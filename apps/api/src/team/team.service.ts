import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import { isRoleAllowedForKind, type MembershipRole, type WorkspaceKind } from '@app/contracts';
import { enqueueEmail, writeAudit, type Invitation, type PrismaClient, type User } from '@app/db';
import { ApiError } from '../common/api-error';
import { randomToken, sha256 } from '../common/crypto';
import { RateLimitService } from '../common/rate-limit.service';
import type { RequestMeta } from '../common/request-context';
import { APP_ENV, PRISMA } from '../infra/tokens';

const INVITATION_TTL_MS = 7 * 24 * 3600_000;

function invitationState(i: Invitation): 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED' {
  if (i.acceptedAt) return 'ACCEPTED';
  if (i.revokedAt) return 'REVOKED';
  if (i.expiresAt.getTime() <= Date.now()) return 'EXPIRED';
  return 'PENDING';
}

function mapInvitation(i: Invitation) {
  return {
    id: i.id,
    email: i.email,
    role: i.role,
    state: invitationState(i),
    expires_at: i.expiresAt.toISOString(),
    created_at: i.createdAt.toISOString(),
  };
}

@Injectable()
export class TeamService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly limits: RateLimitService,
  ) {}

  /** Caller's active membership in the workspace, or 404. */
  private async membership(userId: string, workspaceId: string) {
    if (!/^[0-9a-f-]{36}$/i.test(workspaceId)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const m = await this.prisma.membership.findFirst({
      where: { userId, workspaceId, status: 'ACTIVE' },
      include: { workspace: { include: { company: true } } },
    });
    if (!m) throw new ApiError('NOT_FOUND', 'common.not_found');
    return m;
  }

  private async requireOwner(userId: string, workspaceId: string) {
    const m = await this.membership(userId, workspaceId);
    if (m.role !== 'OWNER') throw new ApiError('FORBIDDEN', 'common.forbidden');
    return m;
  }

  async members(user: User, workspaceId: string) {
    await this.membership(user.id, workspaceId);
    const rows = await this.prisma.membership.findMany({
      where: { workspaceId },
      include: { user: true },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: 200,
    });
    return rows.map((m) => ({
      membership_id: m.id,
      user: { id: m.user.id, email: m.user.email, full_name: m.user.fullName },
      role: m.role,
      status: m.status,
      is_self: m.userId === user.id,
      created_at: m.createdAt.toISOString(),
    }));
  }

  async invitations(user: User, workspaceId: string) {
    await this.requireOwner(user.id, workspaceId);
    const rows = await this.prisma.invitation.findMany({
      where: { workspaceId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 100,
    });
    return rows.map(mapInvitation);
  }

  async invite(
    user: User,
    workspaceId: string,
    input: { email: string; role: MembershipRole },
    meta: RequestMeta,
  ) {
    const owner = await this.requireOwner(user.id, workspaceId);
    if (!isRoleAllowedForKind(owner.workspace.kind as WorkspaceKind, input.role)) {
      throw new ApiError('VALIDATION_FAILED', 'team.role_not_allowed', { role: 'not_allowed' });
    }
    await this.limits.consume('invitation_workspace', workspaceId);
    const existingMember = await this.prisma.membership.findFirst({
      where: { workspaceId, status: 'ACTIVE', user: { email: input.email } },
    });
    if (existingMember) throw new ApiError('CONFLICT', 'team.already_member', { email: 'member' });
    const token = randomToken();
    const invitation = await this.prisma.$transaction(async (tx) => {
      const now = new Date();
      // Only one pending invitation per email and workspace.
      await tx.invitation.updateMany({
        where: { workspaceId, email: input.email, acceptedAt: null, revokedAt: null },
        data: { revokedAt: now },
      });
      const inv = await tx.invitation.create({
        data: {
          workspaceId,
          email: input.email,
          role: input.role,
          tokenHash: sha256(token),
          expiresAt: new Date(now.getTime() + INVITATION_TTL_MS),
          invitedById: user.id,
        },
      });
      await enqueueEmail(tx, {
        template: 'invitation',
        to: input.email,
        locale: user.locale,
        vars: {
          inviter: user.fullName ?? user.email,
          company: owner.workspace.company.displayName,
          workspace_kind: owner.workspace.kind,
          role: input.role,
          accept_url: `${this.env.WEB_ORIGIN}/${user.locale}/invitations/accept#token=${encodeURIComponent(token)}`,
        },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'team.invitation_created',
        resourceType: 'invitation',
        resourceId: inv.id,
        companyId: owner.workspace.companyId,
        details: { workspace_id: workspaceId, role: input.role, email: input.email },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return inv;
    });
    return mapInvitation(invitation);
  }

  async revokeInvitation(user: User, workspaceId: string, invitationId: string, meta: RequestMeta) {
    const owner = await this.requireOwner(user.id, workspaceId);
    const res = await this.prisma.invitation.updateMany({
      where: { id: invitationId, workspaceId, acceptedAt: null, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (res.count === 0) throw new ApiError('NOT_FOUND', 'common.not_found');
    await writeAudit(this.prisma, {
      actorId: user.id,
      actorType: 'user',
      action: 'team.invitation_revoked',
      resourceType: 'invitation',
      resourceId: invitationId,
      companyId: owner.workspace.companyId,
      requestId: meta.requestId,
      ip: meta.ip,
    });
  }

  private async findByToken(token: string) {
    const inv = await this.prisma.invitation.findUnique({
      where: { tokenHash: sha256(token) },
      include: { workspace: { include: { company: true } } },
    });
    if (!inv) throw new ApiError('VALIDATION_FAILED', 'invitation.invalid', { token: 'invalid' });
    return inv;
  }

  async preview(token: string, meta: RequestMeta) {
    await this.limits.consume('token_ip', meta.ip ?? 'unknown');
    const inv = await this.findByToken(token);
    return {
      company_display_name: inv.workspace.company.displayName,
      company_status: inv.workspace.company.status,
      workspace_kind: inv.workspace.kind,
      role: inv.role,
      email: inv.email,
      state: invitationState(inv),
    };
  }

  async accept(user: User, token: string, meta: RequestMeta) {
    await this.limits.consume('token_ip', meta.ip ?? 'unknown');
    if (user.accountType !== 'COMPANY') throw new ApiError('FORBIDDEN', 'common.forbidden');
    return this.prisma.$transaction(async (tx) => {
      const inv = await tx.invitation.findUnique({
        where: { tokenHash: sha256(token) },
        include: { workspace: true },
      });
      if (!inv || invitationState(inv) !== 'PENDING') {
        throw new ApiError('CONFLICT', 'invitation.not_pending');
      }
      if (inv.email !== user.email) throw new ApiError('FORBIDDEN', 'invitation.email_mismatch');
      const claimed = await tx.invitation.updateMany({
        where: { id: inv.id, acceptedAt: null, revokedAt: null },
        data: { acceptedAt: new Date() },
      });
      if (claimed.count !== 1) throw new ApiError('CONFLICT', 'invitation.not_pending');
      const existing = await tx.membership.findUnique({
        where: { workspaceId_userId: { workspaceId: inv.workspaceId, userId: user.id } },
      });
      if (existing?.status === 'ACTIVE') throw new ApiError('CONFLICT', 'team.already_member');
      const membership = existing
        ? await tx.membership.update({
            where: { id: existing.id },
            data: { status: 'ACTIVE', role: inv.role },
          })
        : await tx.membership.create({
            data: { workspaceId: inv.workspaceId, userId: user.id, role: inv.role },
          });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: 'team.invitation_accepted',
        resourceType: 'membership',
        resourceId: membership.id,
        companyId: inv.workspace.companyId,
        details: { invitation_id: inv.id, role: inv.role },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return { workspace_id: inv.workspaceId, membership_id: membership.id };
    });
  }

  /** Owner changes a member's role or revokes access. The last active owner cannot be removed (T06). */
  async updateMembership(
    user: User,
    membershipId: string,
    input: { role?: MembershipRole; status?: 'ACTIVE' | 'REVOKED' },
    meta: RequestMeta,
  ) {
    if (!/^[0-9a-f-]{36}$/i.test(membershipId)) throw new ApiError('NOT_FOUND', 'common.not_found');
    const target = await this.prisma.membership.findUnique({
      where: { id: membershipId },
      include: { workspace: true },
    });
    if (!target) throw new ApiError('NOT_FOUND', 'common.not_found');
    // Non-members of the target's workspace get 404; members without OWNER get 403.
    await this.requireOwner(user.id, target.workspaceId);
    if (input.role && !isRoleAllowedForKind(target.workspace.kind as WorkspaceKind, input.role)) {
      throw new ApiError('VALIDATION_FAILED', 'team.role_not_allowed', { role: 'not_allowed' });
    }
    return this.prisma.$transaction(async (tx) => {
      // Serialise owner changes per workspace so two concurrent removals cannot both pass the check.
      await tx.$queryRaw`SELECT id FROM workspaces WHERE id = ${target.workspaceId}::uuid FOR UPDATE`;
      const current = await tx.membership.findUniqueOrThrow({ where: { id: membershipId } });
      const losesOwner =
        current.role === 'OWNER' &&
        current.status === 'ACTIVE' &&
        ((input.role !== undefined && input.role !== 'OWNER') || input.status === 'REVOKED');
      if (losesOwner) {
        const owners = await tx.membership.count({
          where: { workspaceId: target.workspaceId, role: 'OWNER', status: 'ACTIVE' },
        });
        if (owners <= 1) throw new ApiError('CONFLICT', 'team.last_owner');
      }
      const updated = await tx.membership.update({
        where: { id: membershipId },
        data: {
          ...(input.role ? { role: input.role } : {}),
          ...(input.status ? { status: input.status } : {}),
        },
      });
      await writeAudit(tx, {
        actorId: user.id,
        actorType: 'user',
        action: input.status === 'REVOKED' ? 'team.membership_revoked' : 'team.membership_updated',
        resourceType: 'membership',
        resourceId: membershipId,
        companyId: target.workspace.companyId,
        details: {
          from: { role: current.role, status: current.status },
          to: { role: updated.role, status: updated.status },
        },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return { membership_id: updated.id, role: updated.role, status: updated.status };
    });
  }
}
