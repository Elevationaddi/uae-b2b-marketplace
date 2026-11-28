import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { OrderFulfilment } from '@app/contracts';
import {
  createSandboxPsp,
  type Checkout,
  type Order,
  type OrderEvent,
  type OrderLine,
  type Payment,
  type PrismaClient,
  type PspAdapter,
  type Tx,
} from '@app/db';
import { APP_ENV, PRISMA } from '../infra/tokens';

/** Sandbox fixture commission when COMMISSION_BPS is unset outside production (P4-3, D05). */
export const SANDBOX_COMMISSION_BPS = 1000;
export const SANDBOX_TAX_BPS = 500;

/**
 * Commerce configuration and the payment adapter. Checkout is available only with the labelled
 * sandbox adapter (PAYMENT_MODE=mock) or, later, an approved live provider with TRADING_ENABLED.
 * No live adapter exists, so live mode is refused at startup (see main.ts / bootstrap).
 */
@Injectable()
export class CommerceConfig {
  readonly psp: PspAdapter | null;
  constructor(
    @Inject(APP_ENV) readonly env: AppEnv,
    @Inject(PRISMA) prisma: PrismaClient,
  ) {
    this.psp = env.PAYMENT_MODE === 'mock' ? createSandboxPsp(prisma, env) : null;
  }
  get checkoutEnabled(): boolean {
    return this.psp !== null && (this.psp.sandbox || this.env.TRADING_ENABLED);
  }
  get commissionBps(): number {
    return this.env.COMMISSION_BPS ?? SANDBOX_COMMISSION_BPS;
  }
  get taxBps(): number {
    return this.env.TAX_STANDARD_BPS ?? SANDBOX_TAX_BPS;
  }
  get reservationMinutes(): number {
    return this.env.RESERVATION_MINUTES;
  }
}

export async function nextNumber(tx: Tx, kind: 'checkout' | 'order'): Promise<string> {
  const r =
    kind === 'checkout'
      ? await tx.$queryRaw<{ n: bigint }[]>`SELECT nextval('checkout_number_seq') AS n`
      : await tx.$queryRaw<{ n: bigint }[]>`SELECT nextval('order_number_seq') AS n`;
  return `${kind === 'checkout' ? 'CHK' : 'ORD'}-${String(r[0]!.n).padStart(6, '0')}`;
}

export type OrderWithParties = Order & {
  checkout: Checkout;
  lines?: OrderLine[];
  events?: OrderEvent[];
  _count?: { lines: number };
};

export function mapPayment(p: Payment) {
  return {
    id: p.id,
    state: p.state,
    provider: p.provider,
    sandbox: p.sandbox,
    amount_fils: p.amountFils.toString(),
    failure_code: p.failureCode,
    created_at: p.createdAt.toISOString(),
    captured_at: p.capturedAt?.toISOString() ?? null,
  };
}

type Names = Map<string, string>;

export function mapOrderSummary(o: OrderWithParties, names: Names) {
  return {
    id: o.id,
    number: o.number,
    state: o.state,
    source: o.checkout.source,
    checkout_id: o.checkoutId,
    checkout_number: o.checkout.number,
    buyer: { workspace_id: o.buyerWorkspaceId, company_name: names.get(o.buyerCompanyId) ?? '' },
    seller: { workspace_id: o.sellerWorkspaceId, company_name: names.get(o.sellerCompanyId) ?? '' },
    total_fils: o.totalFils.toString(),
    line_count: o._count?.lines ?? o.lines?.length ?? 0,
    pay_by: o.checkout.payBy.toISOString(),
    created_at: o.createdAt.toISOString(),
    confirmed_at: o.confirmedAt?.toISOString() ?? null,
  };
}

export function mapOrderDetail(
  o: OrderWithParties & { lines: OrderLine[]; events: OrderEvent[] },
  names: Names,
  side: 'buyer' | 'seller' | 'admin',
  fulfilment: OrderFulfilment,
) {
  const taxRule = o.checkout.taxRule as { bps?: number } | null;
  return {
    ...mapOrderSummary(o, names),
    lines: o.lines
      .sort((a, b) => a.position - b.position)
      .map((l) => ({
        id: l.id,
        position: l.position,
        sku_id: l.skuId,
        product_id: l.productId,
        quote_version_id: l.quoteVersionId,
        title: l.title,
        sku_code: l.skuCode,
        variant_attributes: (l.variant ?? {}) as Record<string, string>,
        unit: l.unit,
        quantity: l.quantity,
        unit_price_fils: l.unitPriceFils.toString(),
        line_total_fils: l.lineTotalFils.toString(),
      })),
    merchandise_fils: o.merchandiseFils.toString(),
    shipping_fils: o.shippingFils.toString(),
    tax_fils: o.taxFils.toString(),
    tax_bps: taxRule?.bps ?? 0,
    commission_fils: side === 'buyer' ? null : o.commissionFils.toString(),
    seller_payable_fils: side === 'buyer' ? null : o.sellerPayableFils.toString(),
    address: (o.checkout.addressSnapshot ?? null) as never,
    po_reference: o.checkout.poReference,
    rfq_id: o.checkout.rfqId,
    checkout_state: o.checkout.state,
    cancel_reason: o.cancelReason,
    events: o.events
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((e) => ({
        id: e.id,
        kind: e.kind,
        actor_side: e.actorSide,
        reason: e.reason,
        created_at: e.createdAt.toISOString(),
      })),
    fulfilment,
  };
}

export async function companyNames(prisma: PrismaClient | Tx, ids: string[]): Promise<Names> {
  const rows = await prisma.company.findMany({
    where: { id: { in: [...new Set(ids)] } },
    select: { id: true, displayName: true },
  });
  return new Map(rows.map((r) => [r.id, r.displayName]));
}
