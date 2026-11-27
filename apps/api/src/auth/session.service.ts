import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { PrismaClient, Session, SessionScope, User } from '@app/db';
import { randomToken, sha256 } from '../common/crypto';
import { APP_ENV, PRISMA } from '../infra/tokens';

/** Session lifetimes (docs/10-security.md: bounded expiry). */
export const SESSION_POLICY = {
  COMPANY: { absoluteMs: 7 * 24 * 3600_000, idleMs: 24 * 3600_000 },
  ADMIN: { absoluteMs: 8 * 3600_000, idleMs: 30 * 60_000 },
  /** Admin session before MFA is completed. */
  ADMIN_PENDING_MFA: { absoluteMs: 10 * 60_000, idleMs: 10 * 60_000 },
} as const;

/** Do not write last_seen_at more often than this. */
const TOUCH_INTERVAL_MS = 60_000;

export interface ResolvedSession {
  session: Session;
  user: User;
}

@Injectable()
export class SessionService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  /** Creates a session and returns the raw token (only its hash is stored). */
  async create(
    userId: string,
    scope: SessionScope,
    meta: { ip: string | null; userAgent: string | null },
  ): Promise<{ token: string; session: Session }> {
    const token = randomToken();
    const policy = scope === 'ADMIN' ? SESSION_POLICY.ADMIN_PENDING_MFA : SESSION_POLICY.COMPANY;
    const session = await this.prisma.session.create({
      data: {
        userId,
        scope,
        tokenHash: sha256(token),
        expiresAt: new Date(Date.now() + policy.absoluteMs),
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
    });
    return { token, session };
  }

  /** Resolves a valid, unrevoked, unexpired, non-idle session of the given scope. */
  async resolve(token: string | undefined, scope: SessionScope): Promise<ResolvedSession | null> {
    if (!token || token.length > 100) return null;
    const session = await this.prisma.session.findUnique({
      where: { tokenHash: sha256(token) },
      include: { user: true },
    });
    if (!session || session.scope !== scope || session.revokedAt) return null;
    const now = Date.now();
    const policy =
      scope === 'ADMIN'
        ? session.mfaVerifiedAt
          ? SESSION_POLICY.ADMIN
          : SESSION_POLICY.ADMIN_PENDING_MFA
        : SESSION_POLICY.COMPANY;
    if (session.expiresAt.getTime() <= now) return null;
    if (now - session.lastSeenAt.getTime() > policy.idleMs) return null;
    if (session.user.status !== 'ACTIVE') return null;
    const expectedType = scope === 'ADMIN' ? 'PLATFORM_ADMIN' : 'COMPANY';
    if (session.user.accountType !== expectedType) return null;
    if (now - session.lastSeenAt.getTime() > TOUCH_INTERVAL_MS) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { lastSeenAt: new Date(now) },
      });
    }
    const { user, ...rest } = session;
    return { session: rest as Session, user };
  }

  /** After MFA succeeds: rotate the token (session fixation defence) and extend to the full admin lifetime. */
  async rotateAfterMfa(sessionId: string): Promise<string> {
    const token = randomToken();
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        tokenHash: sha256(token),
        mfaVerifiedAt: new Date(),
        lastSeenAt: new Date(),
        expiresAt: new Date(Date.now() + SESSION_POLICY.ADMIN.absoluteMs),
      },
    });
    return token;
  }

  async revoke(sessionId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string, exceptSessionId?: string): Promise<number> {
    const res = await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
      },
      data: { revokedAt: new Date() },
    });
    return res.count;
  }

  cookieMaxAge(scope: SessionScope): number {
    return scope === 'ADMIN' ? SESSION_POLICY.ADMIN.absoluteMs : SESSION_POLICY.COMPANY.absoluteMs;
  }

  get appEnv(): AppEnv {
    return this.env;
  }
}
