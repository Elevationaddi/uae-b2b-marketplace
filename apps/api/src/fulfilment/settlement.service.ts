import { Inject, Injectable } from '@nestjs/common';
import type {
  financeDecisionRequest,
  payoutCreateRequest,
  payoutListQuery,
  refundCreateRequest,
  refundListQuery,
  SellerFinanceSummary,
} from '@app/contracts';
import type { AppEnv } from '@app/config';
import {
  completeSandboxOperation,
  Prisma,
  recomputeSettlement,
  refundCommissionShare,
  remainingPayable,
  writeAudit,
  type Payout,
  type PrismaClient,
  type User,
} from '@app/db';
import type { z } from 'zod';
import { assertUuid, decodeOffset, encodeOffset } from '../catalog/access';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { APP_ENV, PRISMA } from '../infra/tokens';
import { loadWorkspaceContext } from '../rfq/access';
import { CommerceConfig, companyNames } from '../commerce/commerce-common';
import { nextCaseNumber, requireRole } from './fulfilment-common';

type Tx = Prisma.TransactionClient;
const PAGE = 20;
/** Refund states that still count against the order's refundable amount. */
const OPEN_REFUND = ['REQUESTED', 'APPROVED', 'SUBMITTED', 'SUCCEEDED'] as const;

/**
 * Sandbox refunds and payouts with dual control (docs/04-admin.md, docs/08-finance.md):
 * finance requests, a different finance approver approves, the worker submits to the provider,
 * and only the provider's verified webhook marks a refund succeeded or a payout paid. Nothing
 * here moves money or edits a balance; there is no manual "paid" action.
 */
@Injectable()
export class SettlementService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
    private readonly config: CommerceConfig,
  ) {}

  private async audit(
    tx: Tx,
    admin: User,
    action: string,
    type: string,
    id: string,
    meta: RequestMeta,
    reason?: string,
    details?: Record<string, unknown>,
  ) {
    await writeAudit(tx, {
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

  // ---------------------------------------------------------------- refunds

  async createRefund(admin: User, b: z.infer<typeof refundCreateRequest>, meta: RequestMeta) {
    const amount = BigInt(b.amount_fils);
    const id = await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM orders WHERE id = ${b.order_id}::uuid FOR UPDATE`;
      const o = await tx.order.findUnique({ where: { id: b.order_id } });
      if (!o) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (!o.confirmedAt) throw new ApiError('CONFLICT', 'refund.not_paid');
      if (o.settlementState === 'IN_PAYOUT' || o.settlementState === 'PAID_OUT')
        throw new ApiError('CONFLICT', 'refund.order_settled');
      const payment = await tx.payment.findFirst({
        where: { checkoutId: o.checkoutId, state: { in: ['CAPTURED', 'PARTIALLY_REFUNDED'] } },
      });
      if (!payment) throw new ApiError('CONFLICT', 'refund.no_capture');
      const committed = await tx.refund.aggregate({
        where: { orderId: o.id, state: { in: [...OPEN_REFUND] } },
        _sum: { amountFils: true },
      });
      // T29: cumulative refunds never exceed what was captured for this order.
      if (amount > o.totalFils - (committed._sum.amountFils ?? 0n))
        throw new ApiError('CONFLICT', 'refund.exceeds_remaining');
      let disputeId: string | null = null;
      if (b.dispute_id) {
        const d = await tx.dispute.findFirst({ where: { id: b.dispute_id, orderId: o.id } });
        if (!d) throw new ApiError('NOT_FOUND', 'common.not_found');
        if (d.state !== 'RESOLUTION_PROPOSED' || d.proposal !== 'REFUND')
          throw new ApiError('CONFLICT', 'refund.dispute_not_ready');
        if (d.proposalAmountFils !== null && amount > d.proposalAmountFils)
          throw new ApiError('CONFLICT', 'refund.exceeds_proposal');
        await tx.dispute.update({
          where: { id: d.id },
          data: { state: 'RESOLVING', version: { increment: 1 } },
        });
        disputeId = d.id;
      }
      const r = await tx.refund.create({
        data: {
          number: await nextCaseNumber(tx, 'refund'),
          orderId: o.id,
          paymentId: payment.id,
          disputeId,
          amountFils: amount,
          commissionFils: refundCommissionShare(amount, o.commissionFils, o.totalFils),
          reason: b.reason,
          requestedById: admin.id,
        },
      });
      await this.audit(tx, admin, 'refund.requested', 'refund', r.id, meta, b.reason, {
        order_id: o.id,
        amount_fils: amount.toString(),
      });
      return r.id;
    });
    return this.refund(admin, id);
  }

  /** T28: the requester can never approve; no provider request is made by this call. */
  async decideRefund(
    admin: User,
    id: string,
    approve: boolean,
    b: z.infer<typeof financeDecisionRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM refunds WHERE id = ${id}::uuid FOR UPDATE`;
      const r = await tx.refund.findUnique({ where: { id } });
      if (!r) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (r.requestedById === admin.id) throw new ApiError('FORBIDDEN', 'refund.self_approval');
      if (r.state !== 'REQUESTED') throw new ApiError('CONFLICT', 'refund.invalid_transition');
      await tx.refund.update({
        where: { id },
        data: approve
          ? { state: 'APPROVED', approvedById: admin.id, decisionReason: b.reason }
          : { state: 'REJECTED', approvedById: admin.id, decisionReason: b.reason },
      });
      if (!approve && r.disputeId) {
        const active = await tx.refund.count({
          where: {
            disputeId: r.disputeId,
            id: { not: r.id },
            state: { in: ['REQUESTED', 'APPROVED', 'SUBMITTED'] },
          },
        });
        if (!active)
          await tx.dispute.updateMany({
            where: { id: r.disputeId, state: 'RESOLVING' },
            data: { state: 'RESOLUTION_PROPOSED' },
          });
      }
      await this.audit(
        tx,
        admin,
        approve ? 'refund.approved' : 'refund.rejected',
        'refund',
        id,
        meta,
        b.reason,
      );
    });
    return this.refund(admin, id);
  }

  private async refund(admin: User, id: string) {
    const r = await this.listRefunds(admin, {}, { id });
    if (!r.items[0]) throw new ApiError('NOT_FOUND', 'common.not_found');
    return r.items[0];
  }

  async listRefunds(
    admin: User,
    q: z.infer<typeof refundListQuery>,
    extra: Prisma.RefundWhereInput = {},
  ) {
    const offset = decodeOffset(q.cursor);
    const rows = await this.prisma.refund.findMany({
      where: { ...(q.state ? { state: q.state } : {}), ...extra },
      include: { order: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const names = await this.userNames(rows.flatMap((r) => [r.requestedById, r.approvedById]));
    return {
      items: rows.slice(0, PAGE).map((r) => ({
        id: r.id,
        number: r.number,
        order_id: r.orderId,
        order_number: r.order.number,
        dispute_id: r.disputeId,
        amount_fils: r.amountFils.toString(),
        commission_fils: r.commissionFils.toString(),
        state: r.state,
        reason: r.reason,
        requested_by: names.get(r.requestedById) ?? '',
        requested_by_me: r.requestedById === admin.id,
        approved_by: r.approvedById ? (names.get(r.approvedById) ?? '') : null,
        decision_reason: r.decisionReason,
        provider_ref: r.providerRef,
        failure_code: r.failureCode,
        sandbox: this.config.psp?.sandbox ?? false,
        created_at: r.createdAt.toISOString(),
        completed_at: r.completedAt?.toISOString() ?? null,
      })),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  // ---------------------------------------------------------------- payouts

  /** Sellers with completed, undisputed orders whose payable is not yet paid out. */
  async eligibleSellers() {
    const orders = await this.prisma.order.findMany({
      where: { settlementState: 'ELIGIBLE' },
      select: { id: true, sellerWorkspaceId: true, sellerCompanyId: true },
    });
    const by = new Map<string, { company: string; ids: string[] }>();
    for (const o of orders) {
      const g = by.get(o.sellerWorkspaceId) ?? { company: o.sellerCompanyId, ids: [] };
      g.ids.push(o.id);
      by.set(o.sellerWorkspaceId, g);
    }
    const names = await companyNames(
      this.prisma,
      [...by.values()].map((g) => g.company),
    );
    const out = [];
    for (const [ws, g] of by) {
      let sum = 0n;
      for (const id of g.ids) sum += await remainingPayable(this.prisma, id);
      out.push({
        seller_workspace_id: ws,
        seller_company_name: names.get(g.company) ?? '',
        order_count: g.ids.length,
        amount_fils: sum.toString(),
      });
    }
    return out.sort((a, b) => a.seller_company_name.localeCompare(b.seller_company_name));
  }

  async createPayout(admin: User, b: z.infer<typeof payoutCreateRequest>, meta: RequestMeta) {
    const id = await this.prisma.$transaction(async (tx) => {
      const ids = await tx.$queryRaw<{ id: string }[]>`
        SELECT id FROM orders WHERE seller_workspace_id = ${b.seller_workspace_id}::uuid
          AND settlement_state = 'ELIGIBLE' ORDER BY id FOR UPDATE`;
      const allocations: { orderId: string; amountFils: bigint }[] = [];
      let companyId: string | null = null;
      for (const { id: orderId } of ids) {
        const o = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
        companyId = o.sellerCompanyId;
        const active = await tx.dispute.count({ where: { orderId, state: { not: 'CLOSED' } } });
        const left = await remainingPayable(tx, orderId);
        if (active || left <= 0n) continue;
        allocations.push({ orderId, amountFils: left });
      }
      if (allocations.length === 0 || !companyId)
        throw new ApiError('CONFLICT', 'payout.nothing_eligible');
      const amount = allocations.reduce((s, a) => s + a.amountFils, 0n);
      const p = await tx.payout.create({
        data: {
          number: await nextCaseNumber(tx, 'payout'),
          sellerWorkspaceId: b.seller_workspace_id,
          sellerCompanyId: companyId,
          amountFils: amount,
          requestedById: admin.id,
          allocations: { create: allocations },
        },
      });
      await tx.order.updateMany({
        where: { id: { in: allocations.map((a) => a.orderId) } },
        data: { settlementState: 'IN_PAYOUT' },
      });
      await this.audit(tx, admin, 'payout.requested', 'payout', p.id, meta, undefined, {
        amount_fils: amount.toString(),
        orders: allocations.length,
      });
      return p.id;
    });
    return this.payout(admin, id);
  }

  async decidePayout(
    admin: User,
    id: string,
    approve: boolean,
    b: z.infer<typeof financeDecisionRequest>,
    meta: RequestMeta,
  ) {
    assertUuid(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM payouts WHERE id = ${id}::uuid FOR UPDATE`;
      const p = await tx.payout.findUnique({ where: { id }, include: { allocations: true } });
      if (!p) throw new ApiError('NOT_FOUND', 'common.not_found');
      if (p.requestedById === admin.id) throw new ApiError('FORBIDDEN', 'payout.self_approval');
      if (p.state !== 'REQUESTED') throw new ApiError('CONFLICT', 'payout.invalid_transition');
      const orderIds = p.allocations.map((a) => a.orderId);
      if (approve) {
        const disputed = await tx.dispute.count({
          where: { orderId: { in: orderIds }, state: { not: 'CLOSED' } },
        });
        if (disputed) throw new ApiError('CONFLICT', 'payout.order_disputed');
      }
      await tx.payout.update({
        where: { id },
        data: {
          state: approve ? 'APPROVED' : 'REJECTED',
          approvedById: admin.id,
          decisionReason: b.reason,
        },
      });
      if (!approve) {
        await tx.order.updateMany({
          where: { id: { in: orderIds }, settlementState: 'IN_PAYOUT' },
          data: { settlementState: 'NOT_ELIGIBLE' },
        });
        for (const oid of orderIds) await recomputeSettlement(tx, oid);
      }
      await this.audit(
        tx,
        admin,
        approve ? 'payout.approved' : 'payout.rejected',
        'payout',
        id,
        meta,
        b.reason,
      );
    });
    return this.payout(admin, id);
  }

  private async payout(admin: User, id: string) {
    const r = await this.listPayouts(admin, {}, { id });
    if (!r.items[0]) throw new ApiError('NOT_FOUND', 'common.not_found');
    return r.items[0];
  }

  private async mapPayouts(
    rows: (Payout & { _count: { allocations: number } })[],
    adminId: string | null,
  ) {
    const names = await companyNames(
      this.prisma,
      rows.map((r) => r.sellerCompanyId),
    );
    const users = await this.userNames(rows.flatMap((r) => [r.requestedById, r.approvedById]));
    return rows.map((p) => ({
      id: p.id,
      number: p.number,
      seller_workspace_id: p.sellerWorkspaceId,
      seller_company_name: names.get(p.sellerCompanyId) ?? '',
      amount_fils: p.amountFils.toString(),
      state: p.state,
      order_count: p._count.allocations,
      requested_by: users.get(p.requestedById) ?? '',
      requested_by_me: p.requestedById === adminId,
      approved_by: p.approvedById ? (users.get(p.approvedById) ?? '') : null,
      decision_reason: p.decisionReason,
      provider_ref: p.providerRef,
      failure_code: p.failureCode,
      sandbox: this.config.psp?.sandbox ?? false,
      created_at: p.createdAt.toISOString(),
      paid_at: p.paidAt?.toISOString() ?? null,
    }));
  }

  async listPayouts(
    admin: User,
    q: z.infer<typeof payoutListQuery>,
    extra: Prisma.PayoutWhereInput = {},
  ) {
    const offset = decodeOffset(q.cursor);
    const rows = await this.prisma.payout.findMany({
      where: { ...(q.state ? { state: q.state } : {}), ...extra },
      include: { _count: { select: { allocations: true } } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    return {
      items: await this.mapPayouts(rows.slice(0, PAGE), admin.id),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  /** Sandbox only (PAYMENT_MODE=mock): simulate the provider finishing a refund or payout. */
  async completeSandbox(
    admin: User,
    providerRef: string,
    outcome: 'success' | 'failure',
    meta: RequestMeta,
  ) {
    if (this.env.PAYMENT_MODE !== 'mock' || !/^(rf|po)_[0-9a-f]{32}$/.test(providerRef))
      throw new ApiError('NOT_FOUND', 'common.not_found');
    const ok = await completeSandboxOperation(this.prisma, providerRef, outcome);
    if (!ok) throw new ApiError('CONFLICT', 'payment.session_closed');
    await writeAudit(this.prisma, {
      actorId: admin.id,
      actorType: 'admin',
      action: 'sandbox.operation_completed',
      resourceType: 'sandbox_operation',
      resourceId: providerRef,
      details: { outcome },
      requestId: meta.requestId,
      ip: meta.ip,
    });
    return { provider_ref: providerRef, outcome };
  }

  // ---------------------------------------------------------------- seller finance

  async sellerSummary(user: User, ws: string): Promise<SellerFinanceSummary> {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'SELLER');
    requireRole(ctx, 'seller.finance');
    const orders = await this.prisma.order.findMany({
      where: { sellerWorkspaceId: ctx.workspace.id, confirmedAt: { not: null } },
      select: {
        id: true,
        totalFils: true,
        commissionFils: true,
        sellerPayableFils: true,
        refundedFils: true,
        settlementState: true,
      },
    });
    const refunds = await this.prisma.refund.groupBy({
      by: ['orderId'],
      where: { order: { sellerWorkspaceId: ctx.workspace.id }, state: 'SUCCEEDED' },
      _sum: { amountFils: true, commissionFils: true },
    });
    const sellerShare = new Map(
      refunds.map((r) => [r.orderId, (r._sum.amountFils ?? 0n) - (r._sum.commissionFils ?? 0n)]),
    );
    const t = {
      gross: 0n,
      commission: 0n,
      refunded: 0n,
      net: 0n,
      NOT_ELIGIBLE: 0n,
      ELIGIBLE: 0n,
      HELD: 0n,
      IN_PAYOUT: 0n,
      PAID_OUT: 0n,
    };
    for (const o of orders) {
      const net = o.sellerPayableFils - (sellerShare.get(o.id) ?? 0n);
      t.gross += o.totalFils;
      t.commission += o.commissionFils;
      t.refunded += o.refundedFils;
      t.net += net > 0n ? net : 0n;
      t[o.settlementState] += net > 0n ? net : 0n;
    }
    const payouts = await this.prisma.payout.findMany({
      where: { sellerWorkspaceId: ctx.workspace.id },
      include: { _count: { select: { allocations: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return {
      sandbox: this.config.psp?.sandbox ?? false,
      gross_fils: t.gross.toString(),
      commission_fils: t.commission.toString(),
      refunded_fils: t.refunded.toString(),
      net_payable_fils: t.net.toString(),
      not_yet_eligible_fils: t.NOT_ELIGIBLE.toString(),
      eligible_fils: t.ELIGIBLE.toString(),
      held_fils: t.HELD.toString(),
      in_payout_fils: t.IN_PAYOUT.toString(),
      paid_out_fils: t.PAID_OUT.toString(),
      payouts: (await this.mapPayouts(payouts, null)).map(
        ({ requested_by: _r, requested_by_me: _m, approved_by: _a, ...rest }) => rest,
      ),
    };
  }
}
