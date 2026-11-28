import {
  type BUYER_CANCEL_STATES,
  hasCapability,
  type Capability,
  type MembershipRole,
  type OrderFulfilment,
  type WorkspaceKind,
} from '@app/contracts';
import {
  withinDisputeWindow,
  type Dispute,
  type Order,
  type Prisma,
  type Review,
  type Shipment,
  type ShipmentItem,
} from '@app/db';
import { ApiError } from '../common/api-error';
import type { WorkspaceContext } from '../rfq/access';

type Tx = Prisma.TransactionClient;

/**
 * Fulfilment and after-sale actions on existing orders check the role only, not current trading
 * eligibility: a supplier whose licence lapses must still ship and a buyer must still confirm or
 * dispute paid orders (docs/09-workflows.md, T35). New trades stay blocked elsewhere.
 */
export function roleCan(ctx: WorkspaceContext, cap: Capability): boolean {
  return hasCapability(
    ctx.workspace.kind as WorkspaceKind,
    ctx.membership.role as MembershipRole,
    true,
    cap,
  );
}

export function requireRole(ctx: WorkspaceContext, cap: Capability): void {
  if (!roleCan(ctx, cap)) throw new ApiError('FORBIDDEN', 'common.forbidden');
}

/** Seller roles that may open or answer a dispute (not finance-only or read-only roles). */
export function sellerCanDispute(ctx: WorkspaceContext): boolean {
  return roleCan(ctx, 'seller.inventory.ship') || roleCan(ctx, 'seller.catalog.edit');
}

export async function nextCaseNumber(tx: Tx, kind: 'dispute' | 'refund' | 'payout') {
  const r =
    kind === 'dispute'
      ? await tx.$queryRaw<{ n: bigint }[]>`SELECT nextval('dispute_number_seq') AS n`
      : kind === 'refund'
        ? await tx.$queryRaw<{ n: bigint }[]>`SELECT nextval('refund_number_seq') AS n`
        : await tx.$queryRaw<{ n: bigint }[]>`SELECT nextval('payout_number_seq') AS n`;
  const prefix = kind === 'dispute' ? 'DSP' : kind === 'refund' ? 'RFD' : 'PAY';
  return `${prefix}-${String(r[0]!.n).padStart(6, '0')}`;
}

const DISPUTABLE = ['CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'COMPLETED'];

/**
 * Paid, not yet paid out and, once delivery is verified, within the dispute window that started
 * then (C-02: 14 days after verified delivery; buyer confirmation does not waive it).
 */
export function disputable(o: Order, now = new Date()): boolean {
  if (!DISPUTABLE.includes(o.state) || o.settlementState === 'PAID_OUT') return false;
  return withinDisputeWindow(o, now);
}

export type OrderForFulfilment = Order & {
  shipment: (Shipment & { items: ShipmentItem[] }) | null;
  disputes: Dispute[];
  review: Review | null;
};

export const FULFILMENT_INCLUDE = {
  shipment: { include: { items: true } },
  disputes: { orderBy: { createdAt: 'desc' as const } },
  review: true,
};

export function buildFulfilment(
  o: OrderForFulfilment,
  side: 'buyer' | 'seller' | 'admin',
  ctx: WorkspaceContext | null,
): OrderFulfilment {
  const active = o.disputes.find((d) => d.state !== 'CLOSED') ?? null;
  const latest = active ?? o.disputes[0] ?? null;
  const ship = side === 'seller' && ctx ? roleCan(ctx, 'seller.inventory.ship') : false;
  const act = side === 'buyer' && ctx ? roleCan(ctx, 'buyer.orders.act') : false;
  const canDispute =
    !active &&
    disputable(o) &&
    ((side === 'buyer' && act) || (side === 'seller' && !!ctx && sellerCanDispute(ctx)));
  const s = o.shipment;
  const unshipped = o.state === 'CONFIRMED' || o.state === 'PROCESSING';
  const buyerPending =
    o.buyerCancelState === 'SUPPLIER_REVIEW' || o.buyerCancelState === 'REFUND_REVIEW';
  const pending = !!o.sellerCancelRequestedAt || buyerPending;
  const settled = o.settlementState === 'IN_PAYOUT' || o.settlementState === 'PAID_OUT';
  return {
    buyer_cancel:
      o.buyerCancelState && o.buyerCancelRequestedAt
        ? {
            state: o.buyerCancelState as (typeof BUYER_CANCEL_STATES)[number],
            requested_at: o.buyerCancelRequestedAt.toISOString(),
            reason: o.buyerCancelReason ?? '',
            custom: !!o.buyerCancelCustom,
            decided_at: o.buyerCancelDecidedAt?.toISOString() ?? null,
            decision_reason: o.buyerCancelDecisionReason,
          }
        : null,
    shipment: s
      ? {
          id: s.id,
          state: s.state,
          carrier: s.carrier,
          tracking_code: s.trackingCode,
          expected_delivery_date: s.expectedDeliveryDate
            ? s.expectedDeliveryDate.toISOString().slice(0, 10)
            : null,
          dispatched_at: s.dispatchedAt.toISOString(),
          delivered_at: s.deliveredAt?.toISOString() ?? null,
          delivery_note: s.deliveryNote,
          has_proof: !!s.proofFileId,
          items: s.items.map((i) => ({ order_line_id: i.orderLineId, quantity: i.quantity })),
        }
      : null,
    settlement_state: side === 'buyer' ? null : o.settlementState,
    refunded_fils: o.refundedFils.toString(),
    completed_at: o.completedAt?.toISOString() ?? null,
    delivery_verified_at: o.deliveryVerifiedAt?.toISOString() ?? null,
    delivery_verification: (o.deliveryVerification ?? null) as
      | 'PROOF_OF_DELIVERY'
      | 'BUYER_CONFIRMED'
      | null,
    dispute_window_ends_at: o.disputeWindowEndsAt?.toISOString() ?? null,
    dispute: latest ? { id: latest.id, number: latest.number, state: latest.state } : null,
    review: o.review
      ? { rating: o.review.rating, comment: o.review.comment, state: o.review.state }
      : null,
    actions: {
      can_process: ship && o.state === 'CONFIRMED' && !pending,
      can_dispatch: ship && unshipped && !pending,
      can_deliver: ship && o.state === 'DISPATCHED',
      can_confirm_receipt: act && (o.state === 'DISPATCHED' || o.state === 'DELIVERED'),
      can_dispute: canDispute,
      can_review: act && o.state === 'COMPLETED' && !o.review,
      can_cancel: ship && unshipped && !pending && !settled,
      can_request_cancel: act && unshipped && !pending && !o.buyerCancelState && !settled,
      can_decide_cancel: ship && unshipped && o.buyerCancelState === 'SUPPLIER_REVIEW',
    },
  };
}
