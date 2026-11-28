import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import { enqueueEmail, writeAudit, type PrismaClient, type User } from '@app/db';
import { ApiError } from '../common/api-error';
import { RateLimitService } from '../common/rate-limit.service';
import type { RequestMeta } from '../common/request-context';
import { APP_ENV, PRISMA } from '../infra/tokens';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { UserTokenService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly passwords: PasswordService,
    private readonly sessions: SessionService,
    private readonly tokens: UserTokenService,
    private readonly limits: RateLimitService,
  ) {}

  link(locale: string, path: string, token: string): string {
    // Token travels in the URL fragment so it never reaches servers, proxies or logs.
    return `${this.env.WEB_ORIGIN}/${locale}/${path}#token=${encodeURIComponent(token)}`;
  }

  /** Always resolves the same way whether or not the email exists (no enumeration). */
  async register(
    input: { email: string; password: string; full_name: string; locale: 'en' | 'ar' },
    meta: RequestMeta,
  ): Promise<void> {
    await this.limits.consume('register_ip', meta.ip ?? 'unknown');
    // Staging (C-20): public registration stays off; only fictional test domains may register.
    if (this.env.isStaging) {
      const domain = input.email.split('@').pop()?.toLowerCase() ?? '';
      if (!this.env.stagingEmailDomains.includes(domain))
        throw new ApiError('VALIDATION_FAILED', 'auth.staging_domain', { email: 'staging_domain' });
    }
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      // Tell the real owner instead of the requester. Rate limited per account to avoid mail bombing.
      try {
        await this.limits.consume('email_action_account', `exists:${input.email}`);
        if (existing.accountType === 'COMPANY') {
          await enqueueEmail(this.prisma, {
            template: 'account_exists',
            to: existing.email,
            locale: existing.locale,
            vars: { login_url: `${this.env.WEB_ORIGIN}/${existing.locale}/login` },
          });
        }
      } catch (err) {
        if (!(err instanceof ApiError)) throw err;
      }
      await this.passwords.hash(input.password); // equalise timing with the create path
      return;
    }
    const passwordHash = await this.passwords.hash(input.password);
    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          passwordHash,
          fullName: input.full_name,
          locale: input.locale,
          accountType: 'COMPANY',
        },
      });
      const token = await this.tokens.issue(tx, user.id, 'VERIFY_EMAIL');
      await enqueueEmail(tx, {
        template: 'verify_email',
        to: user.email,
        locale: user.locale,
        vars: {
          name: user.fullName ?? '',
          verify_url: this.link(user.locale, 'verify-email', token),
        },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'auth.registered',
        resourceType: 'user',
        resourceId: user.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
  }

  async verifyEmail(token: string, meta: RequestMeta): Promise<void> {
    await this.limits.consume('token_ip', meta.ip ?? 'unknown');
    await this.prisma.$transaction(async (tx) => {
      const userId = await this.tokens.consume(tx, token, 'VERIFY_EMAIL');
      if (!userId)
        throw new ApiError('VALIDATION_FAILED', 'auth.token_invalid', { token: 'invalid' });
      await tx.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } });
      await writeAudit(tx, {
        actorId: userId,
        actorType: 'user',
        action: 'auth.email_verified',
        resourceType: 'user',
        resourceId: userId,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
  }

  async resendVerification(email: string, meta: RequestMeta): Promise<void> {
    await this.limits.consume('email_action_ip', meta.ip ?? 'unknown');
    await this.limits.consume('email_action_account', `verify:${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.emailVerifiedAt || user.accountType !== 'COMPANY') return;
    await this.prisma.$transaction(async (tx) => {
      const token = await this.tokens.issue(tx, user.id, 'VERIFY_EMAIL');
      await enqueueEmail(tx, {
        template: 'verify_email',
        to: user.email,
        locale: user.locale,
        vars: {
          name: user.fullName ?? '',
          verify_url: this.link(user.locale, 'verify-email', token),
        },
      });
    });
  }

  /** Company login. Generic failure for unknown email, wrong password, admin or disabled accounts. */
  async login(
    email: string,
    password: string,
    meta: RequestMeta,
  ): Promise<{ token: string; user: User }> {
    await this.limits.consume('login_ip', meta.ip ?? 'unknown');
    await this.limits.consume('login_account', email);
    const user = await this.prisma.user.findUnique({ where: { email } });
    const ok = await this.passwords.verify(user?.passwordHash, password);
    if (!user || !ok || user.accountType !== 'COMPANY' || user.status !== 'ACTIVE') {
      await writeAudit(this.prisma, {
        actorId: user?.id ?? null,
        actorType: user ? 'user' : 'anonymous',
        action: 'auth.login_failed',
        resourceType: 'user',
        resourceId: user?.id ?? null,
        requestId: meta.requestId,
        ip: meta.ip,
      });
      throw new ApiError('UNAUTHENTICATED', 'auth.invalid_credentials');
    }
    await this.limits.reset('login_account', email);
    if (user.passwordHash && this.passwords.needsRehash(user.passwordHash)) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await this.passwords.hash(password) },
      });
    }
    const { token, session } = await this.sessions.create(user.id, 'COMPANY', meta);
    await writeAudit(this.prisma, {
      actorId: user.id,
      actorType: 'user',
      action: 'auth.login',
      resourceType: 'session',
      resourceId: session.id,
      requestId: meta.requestId,
      ip: meta.ip,
    });
    return { token, user };
  }

  async requestPasswordReset(email: string, meta: RequestMeta): Promise<void> {
    await this.limits.consume('email_action_ip', meta.ip ?? 'unknown');
    try {
      await this.limits.consume('email_action_account', `reset:${email}`);
    } catch (err) {
      if (err instanceof ApiError) return; // silently drop to avoid revealing account state
      throw err;
    }
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Admin passwords are reset only through the privileged staff process (A03).
    if (!user || user.accountType !== 'COMPANY' || user.status !== 'ACTIVE') return;
    await this.prisma.$transaction(async (tx) => {
      const token = await this.tokens.issue(tx, user.id, 'RESET_PASSWORD');
      await enqueueEmail(tx, {
        template: 'password_reset',
        to: user.email,
        locale: user.locale,
        vars: {
          name: user.fullName ?? '',
          reset_url: this.link(user.locale, 'reset-password', token),
        },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'auth.password_reset_requested',
        resourceType: 'user',
        resourceId: user.id,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
  }

  async confirmPasswordReset(token: string, newPassword: string, meta: RequestMeta): Promise<void> {
    await this.limits.consume('token_ip', meta.ip ?? 'unknown');
    const passwordHash = await this.passwords.hash(newPassword);
    await this.prisma.$transaction(async (tx) => {
      const userId = await this.tokens.consume(tx, token, 'RESET_PASSWORD');
      if (!userId)
        throw new ApiError('VALIDATION_FAILED', 'auth.token_invalid', { token: 'invalid' });
      const user = await tx.user.update({
        where: { id: userId },
        // Receiving the reset email also proves control of the inbox.
        data: { passwordHash, emailVerifiedAt: undefined },
      });
      if (!user.emailVerifiedAt)
        await tx.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } });
      await tx.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await enqueueEmail(tx, {
        template: 'password_changed',
        to: user.email,
        locale: user.locale,
        vars: { name: user.fullName ?? '' },
      });
      await writeAudit(tx, {
        actorId: userId,
        actorType: 'user',
        action: 'auth.password_reset_completed',
        resourceType: 'user',
        resourceId: userId,
        details: { sessions_revoked: true },
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
  }

  async changePassword(
    user: User,
    sessionId: string,
    current: string,
    next: string,
    meta: RequestMeta,
  ): Promise<void> {
    await this.limits.consume('login_account', user.email);
    if (!(await this.passwords.verify(user.passwordHash, current))) {
      throw new ApiError('VALIDATION_FAILED', 'auth.current_password_wrong', {
        current_password: 'invalid',
      });
    }
    const passwordHash = await this.passwords.hash(next);
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: user.id }, data: { passwordHash } });
      await tx.session.updateMany({
        where: { userId: user.id, revokedAt: null, id: { not: sessionId } },
        data: { revokedAt: new Date() },
      });
      await enqueueEmail(tx, {
        template: 'password_changed',
        to: user.email,
        locale: user.locale,
        vars: { name: user.fullName ?? '' },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'auth.password_changed',
        resourceType: 'user',
        resourceId: user.id,
        details: { other_sessions_revoked: true },
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
  }
}
