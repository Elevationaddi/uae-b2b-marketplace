import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { adminCapabilities, type AdminCapability, type AdminRole } from '@app/contracts';
import type { PrismaClient, Session, User } from '@app/db';
import type { Request } from 'express';
import { ApiError } from '../common/api-error';
import { PRISMA } from '../infra/tokens';
import { cookieName } from './cookies';
import { SessionService } from './session.service';

export interface AuthContext {
  session: Session;
  user: User;
  /** Admin scope only. */
  adminRoles?: AdminRole[];
}

export type AuthedRequest = Request & { auth?: AuthContext };

const ALLOW_UNVERIFIED = 'auth:allowUnverifiedEmail';
const ALLOW_PENDING_MFA = 'auth:allowPendingMfa';
const ADMIN_CAPABILITY = 'auth:adminCapability';

/** Route may be used before the email address is verified (e.g. /me, resend, logout). */
export const AllowUnverifiedEmail = () => SetMetadata(ALLOW_UNVERIFIED, true);
/** Admin route usable before MFA completes (enrolment / verification only). */
export const AllowPendingMfa = () => SetMetadata(ALLOW_PENDING_MFA, true);
/** Admin route requires this capability (docs/04-admin.md role matrix). */
export const RequireAdmin = (capability: AdminCapability) =>
  SetMetadata(ADMIN_CAPABILITY, capability);

export const Auth = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthContext => {
  const req = ctx.switchToHttp().getRequest<AuthedRequest>();
  if (!req.auth) throw new ApiError('UNAUTHENTICATED', 'auth.unauthenticated');
  return req.auth;
});

/** Company users: valid COMPANY-scope session from the company cookie. Admin cookies are ignored. */
@Injectable()
export class CompanyAuthGuard implements CanActivate {
  constructor(
    private readonly sessions: SessionService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const token = req.cookies?.[cookieName(this.sessions.appEnv, 'company')] as string | undefined;
    const resolved = await this.sessions.resolve(token, 'COMPANY');
    if (!resolved) throw new ApiError('UNAUTHENTICATED', 'auth.unauthenticated');
    const allowUnverified = this.reflector.getAllAndOverride<boolean>(ALLOW_UNVERIFIED, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!allowUnverified && !resolved.user.emailVerifiedAt) {
      throw new ApiError('FORBIDDEN', 'auth.email_not_verified');
    }
    req.auth = resolved;
    return true;
  }
}

/** Platform admins: ADMIN-scope session from the admin cookie, MFA verified, capability checked. */
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly sessions: SessionService,
    private readonly reflector: Reflector,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const token = req.cookies?.[cookieName(this.sessions.appEnv, 'admin')] as string | undefined;
    const resolved = await this.sessions.resolve(token, 'ADMIN');
    if (!resolved) throw new ApiError('UNAUTHENTICATED', 'auth.unauthenticated');
    const allowPending = this.reflector.getAllAndOverride<boolean>(ALLOW_PENDING_MFA, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!allowPending && !resolved.session.mfaVerifiedAt) {
      throw new ApiError('UNAUTHENTICATED', 'admin.mfa_required');
    }
    const memberships = await this.prisma.adminMembership.findMany({
      where: { userId: resolved.user.id, active: true },
      select: { role: true },
    });
    const roles = memberships.map((m) => m.role as AdminRole);
    if (roles.length === 0) throw new ApiError('FORBIDDEN', 'admin.no_role');
    const required = this.reflector.getAllAndOverride<AdminCapability | undefined>(
      ADMIN_CAPABILITY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (required && !adminCapabilities(roles).includes(required)) {
      throw new ApiError('FORBIDDEN', 'admin.forbidden');
    }
    req.auth = { ...resolved, adminRoles: roles };
    return true;
  }
}
