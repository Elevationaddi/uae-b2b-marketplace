import { Body, Controller, Get, HttpCode, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import {
  adminCapabilities,
  adminLoginRequest,
  mfaCodeRequest,
  mfaVerifyRequest,
} from '@app/contracts';
import { writeAudit, type PrismaClient } from '@app/db';
import type { Request, Response } from 'express';
import { cookieName, cookieOptions } from '../auth/cookies';
import { AdminAuthGuard, AllowPendingMfa, Auth, type AuthContext } from '../auth/guards';
import { PasswordService } from '../auth/password.service';
import { SessionService } from '../auth/session.service';
import { ApiError } from '../common/api-error';
import { randomToken } from '../common/crypto';
import { RateLimitService } from '../common/rate-limit.service';
import { requestMeta } from '../common/request-context';
import { parse } from '../common/validation';
import { APP_ENV, PRISMA } from '../infra/tokens';
import { MfaService } from './mfa.service';

const ok = <T>(data: T) => ({ data, meta: { next_cursor: null } });

/** Admin authentication: password, then mandatory TOTP (A02). Separate cookie and session scope (A03). */
@Controller('admin')
export class AdminAuthController {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly passwords: PasswordService,
    private readonly sessions: SessionService,
    private readonly limits: RateLimitService,
    private readonly mfa: MfaService,
  ) {}

  private setSessionCookie(res: Response, token: string) {
    res.cookie(
      cookieName(this.env, 'admin'),
      token,
      cookieOptions(this.env, 'admin', this.sessions.cookieMaxAge('ADMIN')),
    );
    res.cookie(cookieName(this.env, 'csrf'), randomToken(), cookieOptions(this.env, 'csrf'));
  }

  @Post('auth/login')
  @HttpCode(200)
  async login(
    @Body() body: unknown,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const meta = requestMeta(req);
    const input = parse(adminLoginRequest, body);
    await this.limits.consume('admin_login_ip', meta.ip ?? 'unknown');
    await this.limits.consume('admin_login_account', input.email);
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    const valid = await this.passwords.verify(user?.passwordHash, input.password);
    if (!user || !valid || user.accountType !== 'PLATFORM_ADMIN' || user.status !== 'ACTIVE') {
      await writeAudit(this.prisma, {
        actorId: user?.accountType === 'PLATFORM_ADMIN' ? user.id : null,
        actorType: 'anonymous',
        action: 'admin.login_failed',
        resourceType: 'admin_session',
        requestId: meta.requestId,
        ip: meta.ip,
      });
      throw new ApiError('UNAUTHENTICATED', 'auth.invalid_credentials');
    }
    const { token, session } = await this.sessions.create(user.id, 'ADMIN', meta);
    this.setSessionCookie(res, token);
    await writeAudit(this.prisma, {
      actorId: user.id,
      actorType: 'admin',
      action: 'admin.password_accepted',
      resourceType: 'admin_session',
      resourceId: session.id,
      requestId: meta.requestId,
      ip: meta.ip,
    });
    return ok({
      mfa: user.mfaEnabled ? ('VERIFY_REQUIRED' as const) : ('ENROLL_REQUIRED' as const),
    });
  }

  @Post('auth/mfa/enroll/start')
  @HttpCode(200)
  @UseGuards(AdminAuthGuard)
  @AllowPendingMfa()
  async enrollStart(@Auth() a: AuthContext) {
    if (a.user.mfaEnabled) throw new ApiError('CONFLICT', 'admin.mfa_already_enrolled');
    return ok(await this.mfa.startEnrolment(a.user.id, a.user.email));
  }

  @Post('auth/mfa/enroll/confirm')
  @HttpCode(200)
  @UseGuards(AdminAuthGuard)
  @AllowPendingMfa()
  async enrollConfirm(
    @Auth() a: AuthContext,
    @Body() body: unknown,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const meta = requestMeta(req);
    const { code } = parse(mfaCodeRequest, body);
    await this.limits.consume('mfa_user', a.user.id);
    if (a.user.mfaEnabled) throw new ApiError('CONFLICT', 'admin.mfa_already_enrolled');
    if (!(await this.mfa.verifyTotp(a.user.id, a.user.mfaSecretEnc, code))) {
      throw new ApiError('VALIDATION_FAILED', 'admin.mfa_code_invalid', { code: 'invalid' });
    }
    const codes = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: a.user.id }, data: { mfaEnabled: true } });
      const c = await this.mfa.issueRecoveryCodes(tx, a.user.id);
      await writeAudit(tx, {
        actorId: a.user.id,
        actorType: 'admin',
        action: 'admin.mfa_enrolled',
        resourceType: 'user',
        resourceId: a.user.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return c;
    });
    this.setSessionCookie(res, await this.sessions.rotateAfterMfa(a.session.id));
    return ok({ recovery_codes: codes });
  }

  @Post('auth/mfa/verify')
  @HttpCode(200)
  @UseGuards(AdminAuthGuard)
  @AllowPendingMfa()
  async verify(
    @Auth() a: AuthContext,
    @Body() body: unknown,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const meta = requestMeta(req);
    const input = parse(mfaVerifyRequest, body);
    await this.limits.consume('mfa_user', a.user.id);
    if (!a.user.mfaEnabled) throw new ApiError('CONFLICT', 'admin.mfa_not_enrolled');
    const viaRecovery = input.recovery_code !== undefined;
    const valid = viaRecovery
      ? await this.mfa.useRecoveryCode(a.user.id, input.recovery_code!)
      : await this.mfa.verifyTotp(a.user.id, a.user.mfaSecretEnc, input.code!);
    await writeAudit(this.prisma, {
      actorId: a.user.id,
      actorType: 'admin',
      action: valid
        ? viaRecovery
          ? 'admin.mfa_recovery_code_used'
          : 'admin.mfa_verified'
        : 'admin.mfa_failed',
      resourceType: 'admin_session',
      resourceId: a.session.id,
      requestId: meta.requestId,
      ip: meta.ip,
    });
    if (!valid)
      throw new ApiError('VALIDATION_FAILED', 'admin.mfa_code_invalid', {
        [viaRecovery ? 'recovery_code' : 'code']: 'invalid',
      });
    this.setSessionCookie(res, await this.sessions.rotateAfterMfa(a.session.id));
    return ok({ ok: true as const });
  }

  @Post('auth/logout')
  @HttpCode(200)
  @UseGuards(AdminAuthGuard)
  @AllowPendingMfa()
  async logout(
    @Auth() a: AuthContext,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.sessions.revoke(a.session.id);
    await writeAudit(this.prisma, {
      actorId: a.user.id,
      actorType: 'admin',
      action: 'admin.logout',
      resourceType: 'admin_session',
      resourceId: a.session.id,
      requestId: requestMeta(req).requestId,
      ip: requestMeta(req).ip,
    });
    res.clearCookie(cookieName(this.env, 'admin'), cookieOptions(this.env, 'admin'));
    return ok({ ok: true as const });
  }

  @Get('me')
  @UseGuards(AdminAuthGuard)
  async me(@Auth() a: AuthContext) {
    const roles = a.adminRoles ?? [];
    return ok({
      user: { id: a.user.id, email: a.user.email, full_name: a.user.fullName },
      roles,
      capabilities: adminCapabilities(roles),
      recovery_codes_remaining: await this.mfa.remaining(a.user.id),
    });
  }
}
