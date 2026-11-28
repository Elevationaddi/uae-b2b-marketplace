import type { Order, Prisma } from '@prisma/client';

/**
 * Phase 8 financial policies (founder decisions of 28 November 2026, conflicts C-01..C-06):
 * verified delivery and the dispute window, settlement blockers, weekly payout runs, the
 * commission policy and merchandise-only commission reversal. Pure helpers are exported for unit
 * tests; database helpers take a transaction client and never move money.
 */

type TxClient = Prisma.TransactionClient;

const DAY_MS = 86_400_000;
/** Asia/Dubai is UTC+4 all year (no daylight saving). */
const DUBAI_OFFSET_MS = 4 * 3_600_000;

/** Half-up integer division for non-negative bigints. */
export function divHalfUp(n: bigint, d: bigint): bigint {
  if (d <= 0n) throw new Error('divHalfUp: non-positive divisor');
  return (n * 2n + d) / (2n * d);
}

// ------------------------------------------------------------------ weekly payout runs (C-04)

/** Monday (00:00Z of the date) of the Dubai calendar week containing `now`. */
export function dubaiWeekStart(now: Date = new Date()): Date {
  const local = new Date(now.getTime() + DUBAI_OFFSET_MS);
  const day = local.getUTCDay(); // 0 = Sunday
  const back = (day + 6) % 7; // days since Monday
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - back));
}

/** The run for the current Dubai week, created on first use (unique per week). */
export async function currentPayoutRun(tx: TxClient, now: Date = new Date()) {
  const weekStart = dubaiWeekStart(now);
  return tx.payoutRun.upsert({ where: { weekStart }, create: { weekStart }, update: {} });
}

// ------------------------------------------------------------------ commission policy (C-05)

export interface ActiveCommission {
  bps: number;
  policyId: string | null;
  version: number | null;
}

/**
 * The commission that prices a new checkout: the newest policy version, or (before any policy is
 * recorded) the configured fallback rate (COMMISSION_BPS, or the labelled sandbox fixture).
 */
export async function activeCommission(
  tx: TxClient,
  fallbackBps: number,
): Promise<ActiveCommission> {
  const p = await tx.commissionPolicy.findFirst({ orderBy: { version: 'desc' } });
  return p
    ? { bps: p.rateBps, policyId: p.id, version: p.version }
    : { bps: fallbackBps, policyId: null, version: null };
}

// ------------------------------------------------------------------ refunds (C-06)

export interface RefundParts {
  merchandise: bigint;
  shipping: bigint;
  tax: bigint;
}
type OrderAmounts = Pick<Order, 'merchandiseFils' | 'shippingFils' | 'taxFils' | 'totalFils'>;
type RefundLike = {
  amountFils: bigint;
  merchandiseFils: bigint | null;
  shippingFils: bigint | null;
  taxFils: bigint | null;
};

/** Parts of an existing refund; refunds made before Phase 8 are split pro rata of the total. */
export function refundParts(o: OrderAmounts, r: RefundLike): RefundParts {
  if (r.merchandiseFils !== null && r.shippingFils !== null && r.taxFils !== null)
    return { merchandise: r.merchandiseFils, shipping: r.shippingFils, tax: r.taxFils };
  if (o.totalFils <= 0n) return { merchandise: 0n, shipping: 0n, tax: r.amountFils };
  const merchandise = divHalfUp(r.amountFils * o.merchandiseFils, o.totalFils);
  const shipping = divHalfUp(r.amountFils * o.shippingFils, o.totalFils);
  const tax = r.amountFils - merchandise - shipping;
  return tax >= 0n
    ? { merchandise, shipping, tax }
    : { merchandise: merchandise + tax, shipping, tax: 0n };
}

export type RefundAllocationError = 'refund.exceeds_remaining' | 'refund.exceeds_component';

/**
 * Split a new refund into merchandise, delivery and VAT parts. An explicit split must fit what is
 * left of each part; without one, the amount is spread pro rata over what is left of each part.
 */
export function allocateRefund(
  o: OrderAmounts,
  prior: RefundLike[],
  amount: bigint,
  explicit?: RefundParts,
): RefundParts | RefundAllocationError {
  const used = prior.map((r) => refundParts(o, r));
  const sum = (k: keyof RefundParts) => used.reduce((s, p) => s + p[k], 0n);
  const left: RefundParts = {
    merchandise: o.merchandiseFils - sum('merchandise'),
    shipping: o.shippingFils - sum('shipping'),
    tax: o.taxFils - sum('tax'),
  };
  for (const k of ['merchandise', 'shipping', 'tax'] as const) if (left[k] < 0n) left[k] = 0n;
  const remaining = left.merchandise + left.shipping + left.tax;
  if (amount <= 0n || amount > remaining) return 'refund.exceeds_remaining';
  if (explicit) {
    if (explicit.merchandise + explicit.shipping + explicit.tax !== amount)
      return 'refund.exceeds_component';
    for (const k of ['merchandise', 'shipping', 'tax'] as const)
      if (explicit[k] < 0n || explicit[k] > left[k]) return 'refund.exceeds_component';
    return explicit;
  }
  let merchandise = divHalfUp(amount * left.merchandise, remaining);
  let shipping = divHalfUp(amount * left.shipping, remaining);
  let tax = amount - merchandise - shipping;
  // Rounding can push the VAT part one fil past what is left (or below zero); move the fil.
  if (tax > left.tax) {
    let d = tax - left.tax;
    tax = left.tax;
    const m = left.merchandise - merchandise < d ? left.merchandise - merchandise : d;
    merchandise += m;
    d -= m;
    shipping += d;
  } else if (tax < 0n) {
    let d = -tax;
    tax = 0n;
    const m = merchandise < d ? merchandise : d;
    merchandise -= m;
    d -= m;
    shipping -= d;
  }
  return { merchandise, shipping, tax };
}

/**
 * Commission reversed with a refund: proportional to the merchandise refunded only (never to
 * delivery or VAT). Computed on cumulative merchandise so that refunding all merchandise reverses
 * exactly the order's commission, never more.
 */
export function merchandiseCommissionShare(
  o: Pick<Order, 'merchandiseFils' | 'commissionFils'>,
  merchandiseBefore: bigint,
  merchandise: bigint,
  commissionAlreadyReversed: bigint,
): bigint {
  if (o.merchandiseFils <= 0n || o.commissionFils <= 0n || merchandise <= 0n) return 0n;
  const before = divHalfUp(merchandiseBefore * o.commissionFils, o.merchandiseFils);
  const after = divHalfUp((merchandiseBefore + merchandise) * o.commissionFils, o.merchandiseFils);
  let share = after - before;
  const cap = o.commissionFils - commissionAlreadyReversed;
  if (share > cap) share = cap;
  if (share > merchandise) share = merchandise;
  return share > 0n ? share : 0n;
}

// ------------------------------------------------------------------ verified delivery (C-02)

export type DeliveryVerification = 'PROOF_OF_DELIVERY' | 'BUYER_CONFIRMED';

/**
 * Record verified delivery once: the first of a supplier delivery with proof and the buyer's
 * receipt confirmation. A later confirmation never moves the window (it does not waive it).
 */
export async function verifyDelivery(
  tx: TxClient,
  order: Pick<Order, 'id' | 'deliveryVerifiedAt'>,
  at: Date,
  kind: DeliveryVerification,
  windowDays: number,
): Promise<boolean> {
  if (order.deliveryVerifiedAt) return false;
  const r = await tx.order.updateMany({
    where: { id: order.id, deliveryVerifiedAt: null },
    data: {
      deliveryVerifiedAt: at,
      deliveryVerification: kind,
      disputeWindowEndsAt: new Date(at.getTime() + windowDays * DAY_MS),
    },
  });
  return r.count > 0;
}

/** True while a dispute may still be opened (before verification there is no deadline yet). */
export function withinDisputeWindow(
  o: Pick<Order, 'disputeWindowEndsAt'>,
  now: Date = new Date(),
): boolean {
  return !o.disputeWindowEndsAt || now.getTime() <= o.disputeWindowEndsAt.getTime();
}

// ------------------------------------------------------------------ settlement blockers (C-01, C-03, C-04)

/** Blockers that put an order on HOLD (they need someone to act); the rest mean "not yet". */
export const HOLDING_BLOCKERS = [
  'dispute_active',
  'hold_active',
  'reconciliation_open',
  'refund_pending',
] as const;
export type SettlementBlocker =
  | (typeof HOLDING_BLOCKERS)[number]
  | 'order_state'
  | 'delivery_not_verified'
  | 'dispute_window_open'
  | 'nothing_payable';

/** Why an order's seller payable cannot be paid out now (empty: eligible). */
export async function settlementBlockers(
  tx: TxClient,
  o: Order,
  remaining: bigint,
  now: Date = new Date(),
): Promise<SettlementBlocker[]> {
  const out: SettlementBlocker[] = [];
  if (o.state !== 'DELIVERED' && o.state !== 'COMPLETED') out.push('order_state');
  if (!o.deliveryVerifiedAt || !o.disputeWindowEndsAt) out.push('delivery_not_verified');
  else if (now.getTime() < o.disputeWindowEndsAt.getTime()) out.push('dispute_window_open');
  const [disputes, holds, refunds, payments] = await Promise.all([
    tx.dispute.count({ where: { orderId: o.id, state: { not: 'CLOSED' } } }),
    tx.orderHold.count({ where: { orderId: o.id, releasedAt: null } }),
    tx.refund.count({
      where: { orderId: o.id, state: { in: ['REQUESTED', 'APPROVED', 'SUBMITTED'] } },
    }),
    tx.payment.findMany({ where: { checkoutId: o.checkoutId }, select: { id: true } }),
  ]);
  const cases = await tx.reconciliationCase.count({
    where: {
      state: 'OPEN',
      OR: [{ checkoutId: o.checkoutId }, { paymentId: { in: payments.map((p) => p.id) } }],
    },
  });
  if (disputes) out.push('dispute_active');
  if (holds) out.push('hold_active');
  if (cases) out.push('reconciliation_open');
  if (refunds) out.push('refund_pending');
  if (remaining <= 0n) out.push('nothing_payable');
  return out;
}

export function settlementStateFor(
  blockers: SettlementBlocker[],
): 'NOT_ELIGIBLE' | 'ELIGIBLE' | 'HELD' {
  if (blockers.length === 0) return 'ELIGIBLE';
  if (blockers.includes('nothing_payable')) return 'NOT_ELIGIBLE';
  return blockers.some((b) => (HOLDING_BLOCKERS as readonly string[]).includes(b))
    ? 'HELD'
    : 'NOT_ELIGIBLE';
}

/** Auto-completion (C-03) needs verified delivery, an ended window and no holding blocker. */
export function canAutoComplete(o: Order, blockers: SettlementBlocker[]): boolean {
  return (
    o.state === 'DELIVERED' &&
    !blockers.includes('delivery_not_verified') &&
    !blockers.includes('dispute_window_open') &&
    !blockers.some((b) => (HOLDING_BLOCKERS as readonly string[]).includes(b))
  );
}

// ------------------------------------------------------------------ provider balance (C-04)

/**
 * Funds available for new payouts. Sandbox: derived from the ledger (captured money still at the
 * provider, minus approved refunds and payouts not yet posted). A live adapter must instead ask
 * the provider for its available balance before any payout is submitted (launch blocker).
 */
export async function providerAvailableFils(tx: TxClient): Promise<bigint> {
  const clearing = await tx.ledgerEntry.aggregate({
    where: { account: 'psp_clearing' },
    _sum: { debitFils: true, creditFils: true },
  });
  const [payouts, refunds] = await Promise.all([
    tx.payout.aggregate({
      where: { state: { in: ['APPROVED', 'PENDING'] } },
      _sum: { amountFils: true },
    }),
    tx.refund.aggregate({
      where: { state: { in: ['APPROVED', 'SUBMITTED'] } },
      _sum: { amountFils: true },
    }),
  ]);
  return (
    (clearing._sum.debitFils ?? 0n) -
    (clearing._sum.creditFils ?? 0n) -
    (payouts._sum.amountFils ?? 0n) -
    (refunds._sum.amountFils ?? 0n)
  );
}
