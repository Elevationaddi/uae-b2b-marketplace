import { Inject, Injectable } from '@nestjs/common';
import type {
  AdminFinanceSummary,
  adminPaymentQuery,
  orderListQuery,
  reconciliationQuery,
} from '@app/contracts';
import { LEDGER_ACCOUNTS } from '@app/contracts';
import type { Prisma, PrismaClient, User } from '@app/db';
import type { z } from 'zod';
import { assertUuid, decodeOffset, encodeOffset } from '../catalog/access';
import { ApiError } from '../common/api-error';
import { PRISMA } from '../infra/tokens';
import { loadWorkspaceContext, requireCap } from '../rfq/access';
import {
  CommerceConfig,
  companyNames,
  mapOrderDetail,
  mapOrderSummary,
  mapPayment,
} from './commerce-common';

const PAGE = 20;
type ListQuery = z.infer<typeof orderListQuery>;

/**
 * Orders for both sides and read-only admin views (docs/02-buyer.md, docs/03-seller.md,
 * docs/04-admin.md). Every query is scoped to the caller's workspace; other tenants get 404.
 * The buyer never sees the platform commission; the seller sees its payable.
 */
@Injectable()
export class OrderService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    private readonly config: CommerceConfig,
  ) {}

  private async list(where: Prisma.OrderWhereInput, q: ListQuery) {
    const offset = decodeOffset(q.cursor);
    const rows = await this.prisma.order.findMany({
      where: { ...where, ...(q.state ? { state: q.state } : {}) },
      include: { checkout: true, _count: { select: { lines: true } } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const names = await companyNames(
      this.prisma,
      rows.flatMap((r) => [r.buyerCompanyId, r.sellerCompanyId]),
    );
    return {
      items: rows.slice(0, PAGE).map((r) => mapOrderSummary(r, names)),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  private async detail(where: Prisma.OrderWhereInput, side: 'buyer' | 'seller' | 'admin') {
    const o = await this.prisma.order.findFirst({
      where,
      include: { checkout: true, lines: true, events: true },
    });
    if (!o) throw new ApiError('NOT_FOUND', 'common.not_found');
    const names = await companyNames(this.prisma, [o.buyerCompanyId, o.sellerCompanyId]);
    return mapOrderDetail(o, names, side);
  }

  async buyerList(user: User, ws: string, q: ListQuery) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'BUYER');
    requireCap(ctx, 'buyer.orders.read');
    return this.list({ buyerWorkspaceId: ctx.workspace.id }, q);
  }

  async buyerDetail(user: User, ws: string, id: string) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'BUYER');
    requireCap(ctx, 'buyer.orders.read');
    assertUuid(id);
    return this.detail({ id, buyerWorkspaceId: ctx.workspace.id }, 'buyer');
  }

  /** Sellers see orders once created (awaiting payment) so they can plan; no action before pay. */
  async sellerList(user: User, ws: string, q: ListQuery) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'SELLER');
    requireCap(ctx, 'seller.orders.read');
    return this.list({ sellerWorkspaceId: ctx.workspace.id }, q);
  }

  async sellerDetail(user: User, ws: string, id: string) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'SELLER');
    requireCap(ctx, 'seller.orders.read');
    assertUuid(id);
    return this.detail({ id, sellerWorkspaceId: ctx.workspace.id }, 'seller');
  }

  // ---------------------------------------------------------------- admin (read-only)

  adminList(q: ListQuery) {
    return this.list({}, q);
  }

  adminDetail(id: string) {
    assertUuid(id);
    return this.detail({ id }, 'admin');
  }

  async adminPayments(q: z.infer<typeof adminPaymentQuery>) {
    const offset = decodeOffset(q.cursor);
    const rows = await this.prisma.payment.findMany({
      where: q.state ? { state: q.state } : {},
      include: { checkout: true },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const names = await companyNames(
      this.prisma,
      rows.map((r) => r.checkout.buyerCompanyId),
    );
    return {
      items: rows.slice(0, PAGE).map((p) => ({
        ...mapPayment(p),
        checkout_id: p.checkoutId,
        checkout_number: p.checkout.number,
        checkout_state: p.checkout.state,
        buyer_company_name: names.get(p.checkout.buyerCompanyId) ?? '',
        provider_ref: p.providerRef,
      })),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  async adminReconciliation(q: z.infer<typeof reconciliationQuery>) {
    const offset = decodeOffset(q.cursor);
    const rows = await this.prisma.reconciliationCase.findMany({
      where: q.state ? { state: q.state } : {},
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip: offset,
      take: PAGE + 1,
    });
    const checkouts = await this.prisma.checkout.findMany({
      where: { id: { in: rows.map((r) => r.checkoutId).filter((x): x is string => !!x) } },
      select: { id: true, number: true },
    });
    const numbers = new Map(checkouts.map((c) => [c.id, c.number]));
    return {
      items: rows.slice(0, PAGE).map((r) => ({
        id: r.id,
        kind: r.kind,
        state: r.state,
        checkout_id: r.checkoutId,
        checkout_number: r.checkoutId ? (numbers.get(r.checkoutId) ?? null) : null,
        payment_id: r.paymentId,
        details: (r.details ?? {}) as Record<string, unknown>,
        created_at: r.createdAt.toISOString(),
      })),
      next: rows.length > PAGE ? encodeOffset(offset + PAGE) : null,
    };
  }

  async adminFinanceSummary(): Promise<AdminFinanceSummary> {
    const [sums, open, byState] = await Promise.all([
      this.prisma.ledgerEntry.groupBy({
        by: ['account'],
        _sum: { debitFils: true, creditFils: true },
      }),
      this.prisma.reconciliationCase.count({ where: { state: 'OPEN' } }),
      this.prisma.payment.groupBy({ by: ['state'], _count: { _all: true } }),
    ]);
    const byAccount = new Map(sums.map((s) => [s.account, s._sum]));
    return {
      sandbox: this.config.psp?.sandbox ?? false,
      balances: LEDGER_ACCOUNTS.map((account) => ({
        account,
        debit_fils: (byAccount.get(account)?.debitFils ?? 0n).toString(),
        credit_fils: (byAccount.get(account)?.creditFils ?? 0n).toString(),
      })),
      open_reconciliation: open,
      payments_by_state: Object.fromEntries(byState.map((s) => [s.state, s._count._all])),
    };
  }
}
