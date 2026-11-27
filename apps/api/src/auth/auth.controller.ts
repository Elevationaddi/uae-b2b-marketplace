import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { AppEnv } from '@app/config';
import {
  emailRequest,
  loginRequest,
  passwordChangeRequest,
  passwordResetConfirmRequest,
  registerRequest,
  tokenRequest,
  updateProfileRequest,
  uuid,
} from '@app/contracts';
import { writeAudit, type PrismaClient } from '@app/db';
import type { Request, Response } from 'express';
import { ApiError } from '../common/api-error';
import { randomToken } from '../common/crypto';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { APP_ENV, PRISMA } from '../infra/tokens';
import { AuthService } from './auth.service';
import { cookieName, cookieOptions } from './cookies';
import { AllowUnverifiedEmail, Auth, CompanyAuthGuard, type AuthContext } from './guards';
import { buildMe } from './me.builder';
import { SessionService } from './session.service';

const ok = <T>(data: T) => ({ data, meta: { next_cursor: null } });
const ACCEPTED = ok({ accepted: true as const });

@Controller()
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionService,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  /** Issues (or re-reads) the double-submit CSRF token for this origin. */
  @Get('auth/csrf')
  csrf(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const name = cookieName(this.env, 'csrf');
    let token = req.cookies?.[name] as string | undefined;
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
      token = randomToken();
      res.cookie(name, token, cookieOptions(this.env, 'csrf'));
    }
    return ok({ csrf_token: token });
  }

  @Get('public/config')
  publicConfig() {
    return ok({
      app_name: this.env.APP_NAME,
      sandbox: this.env.sandbox,
      upload_max_bytes: this.env.UPLOAD_MAX_BYTES,
    });
  }

  @Post('auth/register')
  @HttpCode(202)
  async register(@Body() body: unknown, @Req() req: Request) {
    await this.auth.register(parse(registerRequest, body), requestMeta(req));
    return ACCEPTED;
  }

  @Post('auth/verify-email')
  @HttpCode(200)
  async verifyEmail(@Body() body: unknown, @Req() req: Request) {
    await this.auth.verifyEmail(parse(tokenRequest, body).token, requestMeta(req));
    return ok({ ok: true as const });
  }

  @Post('auth/resend-verification')
  @HttpCode(202)
  async resend(@Body() body: unknown, @Req() req: Request) {
    await this.auth.resendVerification(parse(emailRequest, body).email, requestMeta(req));
    return ACCEPTED;
  }

  @Post('auth/login')
  @HttpCode(200)
  async login(
    @Body() body: unknown,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const input = parse(loginRequest, body);
    const { token, user } = await this.auth.login(input.email, input.password, requestMeta(req));
    res.cookie(
      cookieName(this.env, 'company'),
      token,
      cookieOptions(this.env, 'company', this.sessions.cookieMaxAge('COMPANY')),
    );
    // Rotate the CSRF token on login.
    res.cookie(cookieName(this.env, 'csrf'), randomToken(), cookieOptions(this.env, 'csrf'));
    return ok(await buildMe(this.prisma, user));
  }

  @Post('auth/logout')
  @HttpCode(200)
  @UseGuards(CompanyAuthGuard)
  @AllowUnverifiedEmail()
  async logout(
    @Auth() a: AuthContext,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.sessions.revoke(a.session.id);
    await writeAudit(this.prisma, {
      actorId: a.user.id,
      actorType: 'user',
      action: 'auth.logout',
      resourceType: 'session',
      resourceId: a.session.id,
      requestId: requestMeta(req).requestId,
      ip: requestMeta(req).ip,
    });
    res.clearCookie(cookieName(this.env, 'company'), cookieOptions(this.env, 'company'));
    return ok({ ok: true as const });
  }

  @Post('auth/password-reset/request')
  @HttpCode(202)
  async resetRequest(@Body() body: unknown, @Req() req: Request) {
    await this.auth.requestPasswordReset(parse(emailRequest, body).email, requestMeta(req));
    return ACCEPTED;
  }

  @Post('auth/password-reset/confirm')
  @HttpCode(200)
  async resetConfirm(@Body() body: unknown, @Req() req: Request) {
    const input = parse(passwordResetConfirmRequest, body);
    await this.auth.confirmPasswordReset(input.token, input.new_password, requestMeta(req));
    return ok({ ok: true as const });
  }

  @Get('me')
  @UseGuards(CompanyAuthGuard)
  @AllowUnverifiedEmail()
  async me(@Auth() a: AuthContext) {
    return ok(await buildMe(this.prisma, a.user));
  }

  @Patch('me')
  @UseGuards(CompanyAuthGuard)
  @AllowUnverifiedEmail()
  async updateMe(@Auth() a: AuthContext, @Body() body: unknown) {
    const input = parse(updateProfileRequest, body);
    const user = await this.prisma.user.update({
      where: { id: a.user.id },
      data: {
        ...(input.full_name !== undefined ? { fullName: input.full_name } : {}),
        ...(input.locale ? { locale: input.locale } : {}),
      },
    });
    return ok(await buildMe(this.prisma, user));
  }

  @Get('me/sessions')
  @UseGuards(CompanyAuthGuard)
  @AllowUnverifiedEmail()
  async listSessions(@Auth() a: AuthContext) {
    const rows = await this.prisma.session.findMany({
      where: {
        userId: a.user.id,
        scope: 'COMPANY',
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: [{ lastSeenAt: 'desc' }, { id: 'desc' }],
      take: 50,
    });
    return ok(
      rows.map((s) => ({
        id: s.id,
        current: s.id === a.session.id,
        created_at: s.createdAt.toISOString(),
        last_seen_at: s.lastSeenAt.toISOString(),
        expires_at: s.expiresAt.toISOString(),
        ip: s.ip,
        user_agent: s.userAgent,
      })),
    );
  }

  @Delete('me/sessions/:id')
  @UseGuards(CompanyAuthGuard)
  @AllowUnverifiedEmail()
  async revokeSession(@Auth() a: AuthContext, @Param('id') id: string, @Req() req: Request) {
    parse(uuid, id);
    const res = await this.prisma.session.updateMany({
      where: { id, userId: a.user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (res.count === 0) throw new ApiError('NOT_FOUND', 'common.not_found');
    await writeAudit(this.prisma, {
      actorId: a.user.id,
      actorType: 'user',
      action: 'auth.session_revoked',
      resourceType: 'session',
      resourceId: id,
      requestId: requestMeta(req).requestId,
      ip: requestMeta(req).ip,
    });
    return ok({ ok: true as const });
  }

  @Post('me/sessions/revoke-others')
  @HttpCode(200)
  @UseGuards(CompanyAuthGuard)
  @AllowUnverifiedEmail()
  async revokeOthers(@Auth() a: AuthContext, @Req() req: Request) {
    const count = await this.sessions.revokeAllForUser(a.user.id, a.session.id);
    await writeAudit(this.prisma, {
      actorId: a.user.id,
      actorType: 'user',
      action: 'auth.other_sessions_revoked',
      resourceType: 'user',
      resourceId: a.user.id,
      details: { count },
      requestId: requestMeta(req).requestId,
      ip: requestMeta(req).ip,
    });
    return ok({ ok: true as const });
  }

  @Post('me/password')
  @HttpCode(200)
  @UseGuards(CompanyAuthGuard)
  @AllowUnverifiedEmail()
  async changePassword(@Auth() a: AuthContext, @Body() body: unknown, @Req() req: Request) {
    const input = parse(passwordChangeRequest, body);
    await this.auth.changePassword(
      a.user,
      a.session.id,
      input.current_password,
      input.new_password,
      requestMeta(req),
    );
    return ok({ ok: true as const });
  }
}
