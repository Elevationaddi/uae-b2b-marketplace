import { Inject, Injectable } from '@nestjs/common';
import {
  adminCapabilities,
  type AdminRole,
  type CommissionSettings,
  type commissionPolicyCreateRequest,
  type orderHoldCreateRequest,
  type orderHoldListQuery,
  type orderHoldReleaseRequest,
  type OrderHoldItem,
  type PayoutHolidayItem,
  type PayoutRunSummary,
  type payoutHolidayCreateRequest,
  type reconciliationResolveRequest,
} from '@app/contracts';
import type { AppEnv } from '@app/config';
import {
  activeCommission,
  dubaiWeekStart,
  notifyWorkspace,
  payoutSchedule,
  Prisma,
  providerAvailableFils,
  recomputeSettlement,
  toIsoDate,
  writeAudit,
  type PrismaClient,
  type User,
} from '@app/db';
import type { z } from 'zod';
import { MfaService } from '../admin/mfa.service';
import { assertUuid, decodeOffset, encodeOffset } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { CommerceConfig, companyNames } from '../commerce/commerce-common';
import { APP_ENV, PRISMA } from '../infra/tokens';

type Tx = Prisma.TransactionClient;
const PAGE = 20;

/**
 * Phase 8 financial policies on the admin side (founder decisions of 28 November 2026):
 * settlement holds (C-03), the weekly payout run and provider balance (C-04), the restricted,
 * versioned commission setting (C-05) and closing reconciliation cases with a reason. Every change
 * is audited with its reason; nothing here moves money.
 */
@Injectable()
export class FinancialPolicyService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly config: CommerceConfig,
    private readonly mfa: MfaService,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  private get schedule() {
    return { weekday: this.env.PAYOUT_WEEKDAY, time: this.env.PAYOUT_TIME };
  }

  private audit(
    tx: Tx | PrismaClient,
    admin: User,
    action: string,
    type: string,
    id: string,
    meta: RequestMeta,
    reason?: string,
    details?: Record<string, unknown>,
  ) {
    return writeAudit(tx, {
      actorId: admin.id,
      actorType: 'admin',
      action,
      resourceType: type,
      resourceId: id,
      reason,
      details,
      requestId: meta.requestId,
      ip: meta.ip,
    });
  }

  private async userNames(ids: (string | null)[]) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: ids.filter((x): x is string => !!x) } },
      select: { id: true, fullName: true },
    });
    return new Map(users.map((u) => [u.id, u.fullName]));
  }

  // ---------------------------------------------------------------- holds (C-03)

  async listHolds(q: z.infer<typeof orderHoldListQuery>, extra: Prisma.OrderHoldWhereInput = {}) {
    const offset = decodeOffset(q.cursor);
    const rows = await this.prisma.orderHold.findMany({
      where: {
        ...(q.active === 'true' ? { releasedAt: null } : {}),
        ...(q.active === 'false' ? { releasedAt: { not: null } } : {}),
        ...(q.order_id ? { orderId: q.order_id } : {}),
        ...extra,
      },
      include: { order: true },
      orderBy: [{ placedAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const page = rows.slice(0, PAGE);
    const names = await this.userNames(page.flatMap((h) => [h.placedById, h.releasedById]));
    const companies = await companyNames(
      this.prisma,
      page.map((h) => h.order.sellerCompanyId),
    );
    const items: OrderHoldItem[] = page.map((h) => ({
      id: h.id,
      order_id: h.orderId,
      order_number: h.order.number,
      seller_company_name: companies.get(h.order.sellerCompanyId) ?? '',
      kind: h.kind,
      reason: h.reason,
      placed_by: names.get(h.placedById) ?? '',
      placed_at: h.placedAt.toISOString(),
      released_by: h.releasedById ? (names.get(h.releasedById) ?? '') : null,
      released_at: h.releasedAt?.toISOString() ?? null,
      release_reason: h.releaseReason,
      settlement_state: h.order.settlementState,
    }));
    return { items, next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null };
  }

  private async hold(id: string) {
    const r = await this.listHolds({}, { id });
    if (!r.items[0]) throw new ApiError('NOT_FOUND', 'common.not_found');
    return r.items[0];
  }

  async placeHold(admin: User, b: z.infer<typeof orderHoldCreateRequest>, meta: RequestMeta) {
    const id = await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM orders WHERE id = ${b.order_id}::uuid FOR UPDATE`;
      const o = await tx.order.findUnique({ where: { id: b.order_id } });
      if (!o || !o.confirmedAt) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (o.settlementState === 'PAID_OUT') throw new ApiError('CONFLICT', 'hold.order_paid_out');
      const existing = await tx.orderHold.count({
        where: { orderId: o.id, kind: b.kind, releasedAt: null },
      });
      if (existing) throw new ApiError('CONFLICT', 'hold.exists');
      const h = await tx.orderHold.create({
        data: { orderId: o.id, kind: b.kind, reason: b.reason, placedById: admin.id },
      });
      // An order already in a payout stays there; the payout approval refuses it (C-04).
      await recomputeSettlement(tx, o.id);
      await this.audit(tx, admin, 'order.hold_placed', 'order_hold', h.id, meta, b.reason, {
        order_id: o.id,
        kind: b.kind,
      });
      return h.id;
    });
    return this.hold(id);
  }

  async releaseHold(
    admin: User,
    id: string,
    b: z.infer<typeof orderHoldReleaseRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      const h = await tx.orderHold.findUnique({ where: { id } });
      if (!h) throw new ApiError('NOT_FOUND', 'common.not_found');
      await tx.$queryRaw`SELECT id FROM orders WHERE id = ${h.orderId}::uuid FOR UPDATE`;
      const r = await tx.orderHold.updateMany({
        where: { id, releasedAt: null },
        data: { releasedAt: new Date(), releasedById: admin.id, releaseReason: b.reason },
      });
      if (r.count === 0) throw new ApiError('CONFLICT', 'hold.already_released');
      await recomputeSettlement(tx, h.orderId);
      await this.audit(tx, admin, 'order.hold_released', 'order_hold', id, meta, b.reason, {
        order_id: h.orderId,
        kind: h.kind,
      });
    });
    return this.hold(id);
  }

  // ---------------------------------------------------------------- payout run (C-04)

  async payoutRun(now: Date = new Date()): Promise<PayoutRunSummary> {
    const weekStart = dubaiWeekStart(now);
    const weekEnd = new Date(weekStart.getTime() + 6 * 86_400_000);
    const run = await this.prisma.payoutRun.findUnique({ where: { weekStart } });
    const agg = run
      ? await this.prisma.payout.aggregate({
          where: { runId: run.id, state: { notIn: ['REJECTED', 'FAILED'] } },
          _sum: { amountFils: true },
          _count: { _all: true },
        })
      : null;
    const sched = await payoutSchedule(this.prisma, this.schedule, now);
    return {
      week_start: toIsoDate(weekStart),
      week_end: toIsoDate(weekEnd),
      scheduled_for: sched.scheduledFor.toISOString(),
      next_scheduled_for: sched.nextScheduledFor.toISOString(),
      proposed_at: run?.proposedAt?.toISOString() ?? null,
      proposed_count: run?.proposedCount ?? null,
      schedule: this.schedule,
      payout_count: agg?._count._all ?? 0,
      amount_fils: (agg?._sum.amountFils ?? 0n).toString(),
      available_fils: (await providerAvailableFils(this.prisma)).toString(),
      sandbox: this.config.psp?.sandbox ?? false,
    };
  }

  // ---------------------------------------------------------------- payout holidays (Q9)

  async holidays(): Promise<PayoutHolidayItem[]> {
    const rows = await this.prisma.payoutHoliday.findMany({
      where: { date: { gte: new Date(Date.now() - 366 * 86_400_000) } },
      orderBy: { date: 'asc' },
    });
    const names = await this.userNames(rows.map((r) => r.createdById));
    return rows.map((r) => ({
      date: toIsoDate(r.date),
      name: r.name,
      created_by: r.createdById ? (names.get(r.createdById) ?? '') : null,
      created_at: r.createdAt.toISOString(),
    }));
  }

  private parseDate(v: string): Date {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    const d = m ? new Date(Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!)) : null;
    if (!d || toIsoDate(d) !== v)
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', { date: 'date' });
    return d;
  }

  async addHoliday(admin: User, b: z.infer<typeof payoutHolidayCreateRequest>, meta: RequestMeta) {
    const date = this.parseDate(b.date);
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.payoutHoliday.create({ data: { date, name: b.name, createdById: admin.id } });
        await this.audit(
          tx,
          admin,
          'payout_holiday.added',
          'payout_holiday',
          b.date,
          meta,
          undefined,
          {
            date: b.date,
            name: b.name,
          },
        );
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ApiError('CONFLICT', 'payout_holiday.exists');
      throw e;
    }
    return (await this.holidays()).find((h) => h.date === b.date)!;
  }

  async removeHoliday(admin: User, value: string, meta: RequestMeta) {
    const date = this.parseDate(value);
    await this.prisma.$transaction(async (tx) => {
      const r = await tx.payoutHoliday.deleteMany({ where: { date } });
      if (r.count === 0) throw new ApiError('NOT_FOUND', 'common.not_found');
      await this.audit(
        tx,
        admin,
        'payout_holiday.removed',
        'payout_holiday',
        value,
        meta,
        undefined,
        {
          date: value,
        },
      );
    });
    return { date: value };
  }

  // ---------------------------------------------------------------- commission (C-05)

  async commission(roles: readonly AdminRole[]): Promise<CommissionSettings> {
    const current = await activeCommission(this.prisma, this.config.commissionBps);
    const rows = await this.prisma.commissionPolicy.findMany({
      orderBy: { version: 'desc' },
      take: 50,
    });
    const names = await this.userNames(rows.map((r) => r.createdById));
    const now = Date.now();
    return {
      current: {
        rate_bps: current.bps,
        version: current.version,
        source: current.policyId ? 'policy' : 'configuration',
      },
      can_manage: adminCapabilities(roles).includes('admin.commission.manage'),
      notice_days: this.env.COMMISSION_NOTICE_DAYS,
      earliest_effective_from: new Date(
        now + this.env.COMMISSION_NOTICE_DAYS * 86_400_000,
      ).toISOString(),
      history: rows.map((r) => ({
        id: r.id,
        version: r.version,
        rate_bps: r.rateBps,
        base: r.base,
        reason: r.reason,
        created_by: r.createdById ? (names.get(r.createdById) ?? '') : null,
        effective_from: r.effectiveFrom.toISOString(),
        scheduled: r.effectiveFrom.getTime() > now,
        created_at: r.createdAt.toISOString(),
      })),
    };
  }

  /**
   * A new commission policy version applies to checkouts created from its effective date, which
   * must give suppliers at least COMMISSION_NOTICE_DAYS (FD-05: 30 days) of notice; existing
   * orders keep the rate they were priced with. Needs a fresh TOTP code (step-up) and a stated
   * reason. Every active supplier workspace is notified in the app.
   */
  async setCommission(
    admin: User,
    roles: readonly AdminRole[],
    b: z.infer<typeof commissionPolicyCreateRequest>,
    meta: RequestMeta,
  ) {
    const effectiveFrom = new Date(b.effective_from);
    const earliest = Date.now() + this.env.COMMISSION_NOTICE_DAYS * 86_400_000;
    // One minute of tolerance for the time between the form computing the date and submitting.
    if (effectiveFrom.getTime() < earliest - 60_000)
      throw new ApiError('VALIDATION_FAILED', 'commission.notice_too_short', {
        effective_from: 'notice',
      });
    if (!(await this.mfa.verifyTotp(admin.id, admin.mfaSecretEnc, b.totp_code))) {
      await this.audit(
        this.prisma,
        admin,
        'commission.change_denied',
        'commission_policy',
        'new',
        meta,
        b.reason,
        {
          cause: 'step_up',
          rate_bps: b.rate_bps,
        },
      );
      throw new ApiError('VALIDATION_FAILED', 'admin.mfa_code_invalid', { totp_code: 'invalid' });
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext('commission-policy'))`;
      const before = await activeCommission(tx, this.config.commissionBps);
      const last = await tx.commissionPolicy.findFirst({ orderBy: { version: 'desc' } });
      const p = await tx.commissionPolicy.create({
        data: {
          version: (last?.version ?? 0) + 1,
          rateBps: b.rate_bps,
          reason: b.reason,
          createdById: admin.id,
          effectiveFrom,
        },
      });
      const sellers = await tx.workspace.findMany({
        where: { kind: 'SELLER' },
        select: { id: true },
      });
      for (const w of sellers)
        await notifyWorkspace(tx, w.id, ['OWNER', 'FINANCE'], 'commission.change_scheduled', {
          rate: `${p.rateBps / 100}%`,
          rate_bps: String(p.rateBps),
          previous_rate_bps: String(before.bps),
          effective_from: effectiveFrom.toISOString(),
          // Dubai calendar date (UTC+4) for the notification text.
          effective_date: toIsoDate(new Date(effectiveFrom.getTime() + 4 * 3_600_000)),
        });
      await this.audit(tx, admin, 'commission.changed', 'commission_policy', p.id, meta, b.reason, {
        version: p.version,
        rate_bps: p.rateBps,
        previous_rate_bps: before.bps,
        previous_version: before.version,
        effective_from: effectiveFrom.toISOString(),
        suppliers_notified: sellers.length,
      });
    });
    return this.commission(roles);
  }

  // ---------------------------------------------------------------- reconciliation

  /** Close an open reconciliation case with a reason; orders it held are re-evaluated. */
  async resolveReconciliation(
    admin: User,
    id: string,
    b: z.infer<typeof reconciliationResolveRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM reconciliation_cases WHERE id = ${id}::uuid FOR UPDATE`;
      const c = await tx.reconciliationCase.findUnique({ where: { id } });
      if (!c) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (c.state !== 'OPEN') throw new ApiError('CONFLICT', 'reconciliation.not_open');
      await tx.reconciliationCase.update({
        where: { id },
        data: {
          state: 'RESOLVED',
          resolution: b.resolution,
          resolvedById: admin.id,
          resolvedAt: new Date(),
        },
      });
      let checkoutId = c.checkoutId;
      if (!checkoutId && c.paymentId) {
        const pay = await tx.payment.findUnique({ where: { id: c.paymentId } });
        checkoutId = pay?.checkoutId ?? null;
      }
      if (checkoutId) {
        const orders = await tx.order.findMany({ where: { checkoutId }, select: { id: true } });
        for (const o of orders) await recomputeSettlement(tx, o.id);
      }
      await this.audit(
        tx,
        admin,
        'reconciliation.resolved',
        'reconciliation_case',
        id,
        meta,
        b.resolution,
        {
          kind: c.kind,
        },
      );
    });
    return { id, state: 'RESOLVED' as const };
  }
}
