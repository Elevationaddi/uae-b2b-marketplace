import { Inject, Injectable } from '@nestjs/common';
import type {
  InvoiceDraft,
  TaxTreatment,
  VatStatus,
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
import { buildFulfilment, FULFILMENT_INCLUDE } from '../fulfilment/fulfilment-common';
import { loadWorkspaceContext, requireCap, type WorkspaceContext } from '../rfq/access';
import {
  CommerceConfig,
  companyNames,
  mapOrderDetail,
  mapOrderSummary,
  mapPayment,
} from './commerce-common';
import { orderTaxRule } from './tax';

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

  private async detail(
    where: Prisma.OrderWhereInput,
    side: 'buyer' | 'seller' | 'admin',
    ctx: WorkspaceContext | null = null,
  ) {
    const o = await this.prisma.order.findFirst({
      where,
      include: { checkout: true, lines: true, events: true, ...FULFILMENT_INCLUDE },
    });
    if (!o) throw new ApiError('NOT_FOUND', 'common.not_found');
    const names = await companyNames(this.prisma, [o.buyerCompanyId, o.sellerCompanyId]);
    return mapOrderDetail(o, names, side, buildFulfilment(o, side, ctx));
  }

  /**
   * Non-binding invoice draft (F05, C-09): what an invoice would show, for review by tax advisers.
   * It has no invoice number or issue date and says it is not a tax invoice. Binding invoices stay
   * disabled until the tax rules are professionally approved.
   */
  private async invoiceDraft(
    where: Prisma.OrderWhereInput,
    side: 'buyer' | 'seller' | 'admin',
  ): Promise<InvoiceDraft> {
    const o = await this.prisma.order.findFirst({
      where,
      include: { checkout: true, lines: true },
    });
    if (!o) throw new ApiError('NOT_FOUND', 'common.not_found');
    const companies = await this.prisma.company.findMany({
      where: { id: { in: [o.buyerCompanyId, o.sellerCompanyId] } },
    });
    const buyer = companies.find((c) => c.id === o.buyerCompanyId)!;
    const seller = companies.find((c) => c.id === o.sellerCompanyId)!;
    const tax = orderTaxRule(o.snapshot, o.checkout.taxRule);
    const snap = (
      o.snapshot as {
        tax?: {
          supplier_vat_status?: VatStatus;
          supplier_trn?: string | null;
          treatment?: TaxTreatment;
        };
      } | null
    )?.tax;
    return {
      order_id: o.id,
      order_number: o.number,
      binding: false,
      status: 'draft_not_tax_invoice',
      tax_treatment: snap?.treatment ?? 'provisional_standard',
      tax_code: tax.code,
      tax_bps: tax.bps,
      provisional: tax.provisional,
      supplier: {
        legal_name: seller.legalName,
        trn: snap?.supplier_trn !== undefined ? snap.supplier_trn : seller.trn,
        vat_status: snap?.supplier_vat_status ?? seller.vatStatus,
        vat_confirmed: seller.vatStatusConfirmedAt !== null,
      },
      buyer: { legal_name: buyer.legalName, trn: buyer.trn },
      lines: o.lines
        .sort((a, b) => a.position - b.position)
        .map((l) => ({
          title: l.title,
          quantity: l.quantity,
          unit_price_fils: l.unitPriceFils.toString(),
          line_total_fils: l.lineTotalFils.toString(),
        })),
      merchandise_fils: o.merchandiseFils.toString(),
      shipping_fils: o.shippingFils.toString(),
      tax_fils: o.taxFils.toString(),
      total_fils: o.totalFils.toString(),
      commission:
        side === 'buyer'
          ? null
          : {
              commission_fils: o.commissionFils.toString(),
              commission_bps: o.commissionBps,
              vat: 'pending_professional_advice',
            },
      created_at: o.createdAt.toISOString(),
    };
  }

  async buyerInvoiceDraft(user: User, ws: string, id: string) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'BUYER');
    requireCap(ctx, 'buyer.orders.read');
    assertUuid(id);
    return this.invoiceDraft({ id, buyerWorkspaceId: ctx.workspace.id }, 'buyer');
  }

  async sellerInvoiceDraft(user: User, ws: string, id: string) {
    const ctx = await loadWorkspaceContext(this.prisma, user.id, ws, 'SELLER');
    requireCap(ctx, 'seller.orders.read');
    assertUuid(id);
    return this.invoiceDraft({ id, sellerWorkspaceId: ctx.workspace.id }, 'seller');
  }

  adminInvoiceDraft(id: string) {
    assertUuid(id);
    return this.invoiceDraft({ id }, 'admin');
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
    return this.detail({ id, buyerWorkspaceId: ctx.workspace.id }, 'buyer', ctx);
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
    return this.detail({ id, sellerWorkspaceId: ctx.workspace.id }, 'seller', ctx);
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
