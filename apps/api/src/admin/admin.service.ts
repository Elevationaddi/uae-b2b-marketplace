import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { AdminRole } from '@app/contracts';
import {
  Prisma,
  enqueueEmail,
  isLicenceExpired,
  toIsoDate,
  todayUtc,
  writeAudit,
  type Company,
  type PrismaClient,
  type User,
  type VerificationState,
  type Workspace,
} from '@app/db';
import type { Readable } from 'node:stream';
import { ApiError } from '../common/api-error';
import { NEWEST_FIRST, beforeCursor, decodeCursor, page } from '../common/pagination';
import type { RequestMeta } from '../common/request-context';
import {
  CASE_INCLUDE,
  adminActorIds,
  mapDocument,
  mapEvent,
  mapProposal,
} from '../companies/mappers';
import { StorageService } from '../files/storage.service';
import { APP_ENV, PRISMA } from '../infra/tokens';

function companySummary(c: Company & { workspaces: Workspace[] }) {
  return {
    id: c.id,
    legal_name: c.legalName,
    display_name: c.displayName,
    licence_number: c.licenceNumber,
    licence_issuer: c.licenceIssuer,
    licence_expiry: toIsoDate(c.licenceExpiry),
    licence_expired: isLicenceExpired(c.licenceExpiry),
    emirate: c.emirate,
    status: c.status,
    kinds: c.workspaces.map((w) => w.kind).sort(),
    created_at: c.createdAt.toISOString(),
  };
}

const UUID_RE = /^[0-9a-f-]{36}$/i;
function assertId(id: string) {
  if (!UUID_RE.test(id)) throw new ApiError('NOT_FOUND', 'common.not_found');
}

@Injectable()
export class AdminService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly storage: StorageService,
  ) {}

  async overview() {
    const in30 = new Date(todayUtc().getTime() + 30 * 86400_000);
    const [
      submitted,
      underReview,
      needsInfo,
      approved,
      suspended,
      draft,
      expiring,
      companyUsers,
      unverified,
    ] = await Promise.all([
      this.prisma.verificationCase.count({ where: { state: 'SUBMITTED' } }),
      this.prisma.verificationCase.count({ where: { state: 'UNDER_REVIEW' } }),
      this.prisma.verificationCase.count({ where: { state: 'NEEDS_INFO' } }),
      this.prisma.company.count({ where: { status: 'APPROVED' } }),
      this.prisma.company.count({ where: { status: 'SUSPENDED' } }),
      this.prisma.company.count({ where: { status: 'DRAFT' } }),
      this.prisma.company.count({
        where: { status: 'APPROVED', licenceExpiry: { gte: todayUtc(), lte: in30 } },
      }),
      this.prisma.user.count({ where: { accountType: 'COMPANY' } }),
      this.prisma.user.count({ where: { accountType: 'COMPANY', emailVerifiedAt: null } }),
    ]);
    return {
      verification: { submitted, under_review: underReview, needs_info: needsInfo },
      companies: { approved, suspended, draft, licence_expiring_30d: expiring },
      users: { company_users: companyUsers, unverified_email: unverified },
      generated_at: new Date().toISOString(),
    };
  }

  async queue(q: { state?: VerificationState; limit: number; cursor?: string }) {
    const cursor = decodeCursor(q.cursor);
    const rows = await this.prisma.verificationCase.findMany({
      where: {
        state: q.state ?? { in: ['SUBMITTED', 'UNDER_REVIEW'] },
        ...beforeCursor(cursor),
      },
      include: { company: { include: { workspaces: true } } },
      orderBy: NEWEST_FIRST,
      take: q.limit + 1,
    });
    const { items, nextCursor } = page(rows, q.limit);
    const adminIds = [
      ...new Set(items.map((i) => i.assignedAdminId).filter((x): x is string => !!x)),
    ];
    const admins = adminIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: adminIds } },
          select: { id: true, email: true },
        })
      : [];
    const byId = new Map(admins.map((a) => [a.id, a]));
    return {
      data: items.map((c) => ({
        case_id: c.id,
        kind: c.kind,
        state: c.state,
        submitted_at: c.submittedAt?.toISOString() ?? null,
        assigned_admin: c.assignedAdminId ? (byId.get(c.assignedAdminId) ?? null) : null,
        company: companySummary(c.company),
      })),
      meta: { next_cursor: nextCursor },
    };
  }

  async caseDetail(caseId: string) {
    assertId(caseId);
    const c = await this.prisma.verificationCase.findUnique({
      where: { id: caseId },
      include: { ...CASE_INCLUDE, company: { include: { workspaces: true } } },
    });
    if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
    const adminIds = await adminActorIds(this.prisma, c.events);
    const assigned = c.assignedAdminId
      ? await this.prisma.user.findUnique({
          where: { id: c.assignedAdminId },
          select: { id: true, email: true },
        })
      : null;
    return {
      case_id: c.id,
      kind: c.kind,
      state: c.state,
      submitted_at: c.submittedAt?.toISOString() ?? null,
      decided_at: c.decidedAt?.toISOString() ?? null,
      reason: c.reason,
      proposed: mapProposal(c.proposed),
      assigned_admin: assigned,
      company: {
        ...companySummary(c.company),
        activity: c.company.activity,
        trn: c.company.trn,
        contact_email: c.company.contactEmail,
        contact_phone: c.company.contactPhone,
        terms_version: c.company.termsVersion,
      },
      documents: [...c.documents]
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(mapDocument),
      events: [...c.events]
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((e) => mapEvent(e, adminIds)),
    };
  }

  async startReview(admin: User, caseId: string, expected: VerificationState, meta: RequestMeta) {
    assertId(caseId);
    await this.prisma.$transaction(async (tx) => {
      const c = await this.lockCase(tx, caseId);
      if (c.state !== expected || c.state !== 'SUBMITTED')
        throw new ApiError('CONFLICT', 'common.stale_state');
      await tx.verificationCase.update({
        where: { id: c.id },
        data: { state: 'UNDER_REVIEW', assignedAdminId: admin.id },
      });
      await tx.verificationCaseEvent.create({
        data: { caseId: c.id, actorId: admin.id, fromState: c.state, toState: 'UNDER_REVIEW' },
      });
      if (c.kind === 'INITIAL')
        await tx.company.update({
          where: { id: c.companyId },
          data: { status: 'UNDER_REVIEW', version: { increment: 1 } },
        });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: 'verification.review_started',
        resourceType: 'verification_case',
        resourceId: c.id,
        companyId: c.companyId,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.caseDetail(caseId);
  }

  private async lockCase(tx: Prisma.TransactionClient, caseId: string) {
    await tx.$queryRaw`SELECT id FROM verification_cases WHERE id = ${caseId}::uuid FOR UPDATE`;
    const c = await tx.verificationCase.findUnique({ where: { id: caseId } });
    if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
    return c;
  }

  private async notifyOwners(
    tx: Prisma.TransactionClient,
    companyId: string,
    template: 'verification_decided' | 'company_suspended' | 'company_reactivated',
    vars: Record<string, string>,
  ) {
    const owners = await tx.membership.findMany({
      where: { role: 'OWNER', status: 'ACTIVE', workspace: { companyId } },
      include: { user: true },
    });
    const seen = new Set<string>();
    for (const o of owners) {
      if (seen.has(o.userId)) continue;
      seen.add(o.userId);
      await enqueueEmail(tx, { template, to: o.user.email, locale: o.user.locale, vars });
    }
  }

  async decide(
    admin: User,
    caseId: string,
    input: {
      decision: 'APPROVED' | 'NEEDS_INFO' | 'REJECTED';
      reason?: string;
      expected_state: VerificationState;
    },
    meta: RequestMeta,
  ) {
    assertId(caseId);
    try {
      await this.prisma.$transaction(async (tx) => {
        const c = await this.lockCase(tx, caseId);
        if (c.state !== input.expected_state || c.state !== 'UNDER_REVIEW')
          throw new ApiError('CONFLICT', 'common.stale_state');
        await tx.$queryRaw`SELECT id FROM companies WHERE id = ${c.companyId}::uuid FOR UPDATE`;
        const company = await tx.company.findUniqueOrThrow({ where: { id: c.companyId } });
        const now = new Date();
        const reason = input.reason?.trim() || null;
        await tx.verificationCase.update({
          where: { id: c.id },
          data: { state: input.decision, decidedAt: now, reason, assignedAdminId: admin.id },
        });
        await tx.verificationCaseEvent.create({
          data: {
            caseId: c.id,
            actorId: admin.id,
            fromState: c.state,
            toState: input.decision,
            reason,
          },
        });
        if (input.decision === 'APPROVED') {
          let licence = {
            number: company.licenceNumber,
            issuer: company.licenceIssuer,
            expiry: company.licenceExpiry,
          };
          if (c.kind === 'RENEWAL') {
            const p = mapProposal(c.proposed);
            if (!p) throw new ApiError('CONFLICT', 'verification.proposal_missing');
            licence = {
              number: p.licence_number,
              issuer: p.licence_issuer,
              expiry: new Date(`${p.licence_expiry}T00:00:00Z`),
            };
          }
          if (
            isLicenceExpired(licence.expiry) ||
            licence.expiry.getTime() === todayUtc().getTime()
          ) {
            throw new ApiError('CONFLICT', 'verification.licence_expired');
          }
          await tx.company.update({
            where: { id: company.id },
            data: {
              status: 'APPROVED',
              suspensionKind: null,
              licenceNumber: licence.number,
              licenceIssuer: licence.issuer,
              licenceExpiry: licence.expiry,
              licenceReminderFor: null,
              version: { increment: 1 },
            },
          });
          await tx.workspace.updateMany({
            where: { companyId: company.id },
            data: { status: 'ACTIVE' },
          });
        } else if (c.kind === 'INITIAL') {
          await tx.company.update({
            where: { id: company.id },
            data: { status: input.decision, version: { increment: 1 } },
          });
        }
        await this.notifyOwners(tx, company.id, 'verification_decided', {
          company: company.displayName,
          decision: input.decision,
          reason: reason ?? '',
          company_url: `${this.env.WEB_ORIGIN}/en/account/company`,
        });
        await writeAudit(tx, {
          actorId: admin.id,
          actorType: 'admin',
          action: `verification.${input.decision.toLowerCase()}`,
          resourceType: 'verification_case',
          resourceId: c.id,
          companyId: company.id,
          reason,
          details: { kind: c.kind },
          requestId: meta.requestId,
          ip: meta.ip,
        });
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ApiError('CONFLICT', 'company.licence_exists');
      }
      throw err;
    }
    return this.caseDetail(caseId);
  }

  async downloadFile(
    admin: User,
    fileId: string,
    meta: RequestMeta,
  ): Promise<{ stream: Readable; mime: string; name: string }> {
    assertId(fileId);
    // Only files attached to verification cases are reachable from the admin review screen.
    const file = await this.prisma.file.findFirst({
      where: { id: fileId, verificationDocuments: { some: {} } },
    });
    if (!file) throw new ApiError('NOT_FOUND', 'common.not_found');
    if (file.scanState !== 'CLEAN') throw new ApiError('CONFLICT', 'file.not_clean');
    await writeAudit(this.prisma, {
      actorId: admin.id,
      actorType: 'admin',
      action: 'document.downloaded',
      resourceType: 'file',
      resourceId: file.id,
      companyId: file.ownerCompanyId,
      requestId: meta.requestId,
      ip: meta.ip,
    });
    return {
      stream: await this.storage.get(file.objectKey),
      mime: file.mime,
      name: file.originalName,
    };
  }

  async companies(q: { status?: Company['status']; q?: string; limit: number; cursor?: string }) {
    const cursor = decodeCursor(q.cursor);
    const search = q.q
      ? {
          OR: [
            { legalName: { contains: q.q, mode: 'insensitive' as const } },
            { displayName: { contains: q.q, mode: 'insensitive' as const } },
            { licenceNumber: { contains: q.q, mode: 'insensitive' as const } },
          ],
        }
      : {};
    const rows = await this.prisma.company.findMany({
      where: { ...(q.status ? { status: q.status } : {}), ...search, ...beforeCursor(cursor) },
      include: { workspaces: true },
      orderBy: NEWEST_FIRST,
      take: q.limit + 1,
    });
    const { items, nextCursor } = page(rows, q.limit);
    return { data: items.map(companySummary), meta: { next_cursor: nextCursor } };
  }

  async company(companyId: string) {
    assertId(companyId);
    const c = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        workspaces: {
          include: { memberships: { include: { user: true }, orderBy: { createdAt: 'asc' } } },
        },
        verificationCases: { orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 20 },
      },
    });
    if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
    return {
      ...companySummary(c),
      activity: c.activity,
      trn: c.trn,
      vat_status: c.vatStatus,
      vat_status_confirmed_at: c.vatStatusConfirmedAt?.toISOString() ?? null,
      contact_email: c.contactEmail,
      contact_phone: c.contactPhone,
      members: c.workspaces.flatMap((w) =>
        w.memberships.map((m) => ({
          membership_id: m.id,
          workspace_kind: w.kind,
          role: m.role,
          status: m.status,
          user: { id: m.user.id, email: m.user.email },
        })),
      ),
      cases: c.verificationCases.map((vc) => ({
        case_id: vc.id,
        kind: vc.kind,
        state: vc.state,
        submitted_at: vc.submittedAt?.toISOString() ?? null,
      })),
    };
  }

  async suspend(admin: User, companyId: string, reason: string, meta: RequestMeta) {
    assertId(companyId);
    await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM companies WHERE id = ${companyId}::uuid FOR UPDATE`;
      const c = await tx.company.findUnique({ where: { id: companyId } });
      if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (c.status !== 'APPROVED') throw new ApiError('CONFLICT', 'common.stale_state');
      await tx.company.update({
        where: { id: c.id },
        data: { status: 'SUSPENDED', suspensionKind: 'COMPLIANCE', version: { increment: 1 } },
      });
      await tx.workspace.updateMany({ where: { companyId: c.id }, data: { status: 'RESTRICTED' } });
      await this.notifyOwners(tx, c.id, 'company_suspended', { company: c.displayName, reason });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: 'company.suspended',
        resourceType: 'company',
        resourceId: c.id,
        companyId: c.id,
        reason,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.company(companyId);
  }

  /**
   * Compliance confirms a company's VAT registration (F05, C-08), correcting it if needed. Only a
   * confirmed status lets supplier_status mode charge (or not charge) VAT for the supplier.
   */
  async confirmVatStatus(
    admin: User,
    companyId: string,
    b: { vat_status: 'REGISTERED' | 'NOT_REGISTERED'; trn?: string; reason: string },
    meta: RequestMeta,
  ) {
    assertId(companyId);
    await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM companies WHERE id = ${companyId}::uuid FOR UPDATE`;
      const c = await tx.company.findUnique({ where: { id: companyId } });
      if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
      const trn = b.trn ?? c.trn;
      if (b.vat_status === 'REGISTERED' && !trn)
        throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
          trn: 'trn_required',
        });
      await tx.company.update({
        where: { id: c.id },
        data: {
          vatStatus: b.vat_status,
          trn,
          vatStatusConfirmedAt: new Date(),
          vatStatusConfirmedById: admin.id,
          version: { increment: 1 },
        },
      });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: 'company.vat_status_confirmed',
        resourceType: 'company',
        resourceId: c.id,
        companyId: c.id,
        reason: b.reason,
        details: {
          vat_status: b.vat_status,
          previous_vat_status: c.vatStatus,
          trn_changed: trn !== c.trn,
        },
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.company(companyId);
  }

  async reactivate(admin: User, companyId: string, reason: string, meta: RequestMeta) {
    assertId(companyId);
    await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM companies WHERE id = ${companyId}::uuid FOR UPDATE`;
      const c = await tx.company.findUnique({ where: { id: companyId } });
      if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (c.status !== 'SUSPENDED') throw new ApiError('CONFLICT', 'common.stale_state');
      if (c.suspensionKind === 'LICENCE_EXPIRED' || isLicenceExpired(c.licenceExpiry)) {
        throw new ApiError('CONFLICT', 'company.renewal_required');
      }
      await tx.company.update({
        where: { id: c.id },
        data: { status: 'APPROVED', suspensionKind: null, version: { increment: 1 } },
      });
      await tx.workspace.updateMany({ where: { companyId: c.id }, data: { status: 'ACTIVE' } });
      await this.notifyOwners(tx, c.id, 'company_reactivated', { company: c.displayName });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: 'company.reactivated',
        resourceType: 'company',
        resourceId: c.id,
        companyId: c.id,
        reason,
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return this.company(companyId);
  }

  async users(q: {
    q?: string;
    account_type?: 'COMPANY' | 'PLATFORM_ADMIN';
    limit: number;
    cursor?: string;
  }) {
    const cursor = decodeCursor(q.cursor);
    const rows = await this.prisma.user.findMany({
      where: {
        ...(q.account_type ? { accountType: q.account_type } : {}),
        ...(q.q ? { email: { contains: q.q.toLowerCase() } } : {}),
        ...beforeCursor(cursor),
      },
      include: {
        _count: {
          select: {
            memberships: { where: { status: 'ACTIVE' } },
            sessions: { where: { revokedAt: null, expiresAt: { gt: new Date() } } },
          },
        },
      },
      orderBy: NEWEST_FIRST,
      take: q.limit + 1,
    });
    const { items, nextCursor } = page(rows, q.limit);
    return {
      data: items.map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.fullName,
        account_type: u.accountType,
        status: u.status,
        email_verified: u.emailVerifiedAt !== null,
        active_sessions: u._count.sessions,
        memberships: u._count.memberships,
        created_at: u.createdAt.toISOString(),
      })),
      meta: { next_cursor: nextCursor },
    };
  }

  async revokeUserSessions(admin: User, userId: string, reason: string, meta: RequestMeta) {
    assertId(userId);
    const target = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!target) throw new ApiError('NOT_FOUND', 'common.not_found');
    const count = await this.prisma.$transaction(async (tx) => {
      const res = await tx.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: 'admin.user_sessions_revoked',
        resourceType: 'user',
        resourceId: userId,
        reason,
        details: { count: res.count },
        requestId: meta.requestId,
        ip: meta.ip,
      });
      return res.count;
    });
    return { revoked: count };
  }

  async audit(q: {
    action?: string;
    resource_type?: string;
    resource_id?: string;
    actor_id?: string;
    limit: number;
    cursor?: string;
  }) {
    const cursor = decodeCursor(q.cursor);
    const rows = await this.prisma.auditEvent.findMany({
      where: {
        ...(q.action ? { action: { startsWith: q.action } } : {}),
        ...(q.resource_type ? { resourceType: q.resource_type } : {}),
        ...(q.resource_id ? { resourceId: q.resource_id } : {}),
        ...(q.actor_id ? { actorId: q.actor_id } : {}),
        ...beforeCursor(cursor),
      },
      orderBy: NEWEST_FIRST,
      take: q.limit + 1,
    });
    const { items, nextCursor } = page(rows, q.limit);
    const actorIds = [...new Set(items.map((i) => i.actorId).filter((x): x is string => !!x))];
    const actors = actorIds.length
      ? await this.prisma.user.findMany({
          where: { id: { in: actorIds } },
          select: { id: true, email: true },
        })
      : [];
    const emails = new Map(actors.map((a) => [a.id, a.email]));
    return {
      data: items.map((e) => ({
        id: e.id,
        actor_id: e.actorId,
        actor_email: e.actorId ? (emails.get(e.actorId) ?? null) : null,
        actor_type: e.actorType,
        action: e.action,
        resource_type: e.resourceType,
        resource_id: e.resourceId,
        company_id: e.companyId,
        reason: e.reason,
        details: (e.redactedDiff as Record<string, unknown> | null) ?? null,
        request_id: e.requestId,
        ip: e.ip,
        created_at: e.createdAt.toISOString(),
      })),
      meta: { next_cursor: nextCursor },
    };
  }

  async staff() {
    const admins = await this.prisma.user.findMany({
      where: { accountType: 'PLATFORM_ADMIN' },
      include: { adminMemberships: { where: { active: true } } },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      take: 200,
    });
    return admins.map((u) => ({
      id: u.id,
      email: u.email,
      full_name: u.fullName,
      roles: u.adminMemberships.map((m) => m.role as AdminRole).sort(),
      mfa_enabled: u.mfaEnabled,
      status: u.status,
    }));
  }

  async setStaffRoles(
    admin: User,
    userId: string,
    roles: AdminRole[],
    reason: string,
    meta: RequestMeta,
  ) {
    assertId(userId);
    await this.prisma.$transaction(async (tx) => {
      const target = await tx.user.findUnique({ where: { id: userId } });
      if (!target || target.accountType !== 'PLATFORM_ADMIN')
        throw new ApiError('NOT_FOUND', 'common.not_found');
      await tx.$queryRaw`SELECT id FROM admin_memberships WHERE role = 'SUPER_ADMIN' FOR UPDATE`;
      const before = await tx.adminMembership.findMany({ where: { userId, active: true } });
      if (!roles.includes('SUPER_ADMIN') && before.some((m) => m.role === 'SUPER_ADMIN')) {
        const supers = await tx.adminMembership.count({
          where: { role: 'SUPER_ADMIN', active: true },
        });
        if (supers <= 1) throw new ApiError('CONFLICT', 'admin.last_super_admin');
      }
      await tx.adminMembership.updateMany({
        where: { userId, role: { notIn: roles } },
        data: { active: false },
      });
      for (const role of roles) {
        await tx.adminMembership.upsert({
          where: { userId_role: { userId, role } },
          create: { userId, role },
          update: { active: true },
        });
      }
      // Role change: revoke the target's admin sessions so new rights apply from a fresh login.
      await tx.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await writeAudit(tx, {
        actorId: admin.id,
        actorType: 'admin',
        action: 'admin.staff_roles_changed',
        resourceType: 'user',
        resourceId: userId,
        reason,
        details: { before: before.map((m) => m.role).sort(), after: [...roles].sort() },
        requestId: meta.requestId,
        ip: meta.ip,
      });
    });
    return (await this.staff()).find((s) => s.id === userId);
  }
}
