/**
 * Phase 5 contracts: fulfilment (shipment, delivery, receipt), disputes, sandbox refunds and
 * payouts with dual control, reviews and seller finance (docs/02-buyer.md, docs/03-seller.md,
 * docs/04-admin.md, docs/08-finance.md, docs/09-workflows.md). Money is integer fils as a digit
 * string; timestamps are UTC ISO; dates are YYYY-MM-DD.
 */
import { z } from 'zod';
import { filsString } from './catalog';
import { isoDateTime, uuid } from './common';

export const SETTLEMENT_STATES = [
  'NOT_ELIGIBLE',
  'ELIGIBLE',
  'HELD',
  'IN_PAYOUT',
  'PAID_OUT',
] as const;
export const SHIPMENT_STATES = ['DISPATCHED', 'DELIVERED'] as const;
export const DISPUTE_STATES = [
  'OPEN',
  'UNDER_REVIEW',
  'AWAITING_EVIDENCE',
  'RESOLUTION_PROPOSED',
  'RESOLVING',
  'CLOSED',
] as const;
export const DISPUTE_TYPES = [
  'NOT_RECEIVED',
  'DAMAGED',
  'WRONG_ITEMS',
  'QUANTITY_SHORT',
  'QUALITY',
  'OTHER',
] as const;
export const DISPUTE_PROPOSALS = ['NO_ACTION', 'REFUND'] as const;
export const REFUND_STATES = [
  'REQUESTED',
  'APPROVED',
  'REJECTED',
  'SUBMITTED',
  'SUCCEEDED',
  'FAILED',
] as const;
export const PAYOUT_STATES = [
  'REQUESTED',
  'APPROVED',
  'REJECTED',
  'PENDING',
  'PAID',
  'FAILED',
] as const;
export const REVIEW_STATES = ['PUBLISHED', 'HIDDEN'] as const;
export type SettlementState = (typeof SETTLEMENT_STATES)[number];
export type DisputeState = (typeof DISPUTE_STATES)[number];

/** Provisional limits (P5-x decisions pending founder); enforced server-side. */
export const FULFILMENT_LIMITS = {
  /** A dispute can be opened until this many days after the buyer confirmed receipt. */
  disputeWindowDays: 14,
  maxDisputeMessages: 200,
  reviewCommentMax: 1000,
} as const;

const text = (max: number) => z.string().trim().min(1, 'required').max(max, 'max');
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, 'max')
    .optional()
    .transform((v) => (v ? v : undefined));
const positiveFils = z
  .string()
  .regex(/^[1-9]\d{0,14}$/, 'invalid')
  .describe('Positive integer fils (1 AED = 100 fils)');

// ------------------------------------------------------------------ seller fulfilment

export const shipmentDispatchRequest = z.object({
  carrier: text(80),
  tracking_code: optionalText(80),
  expected_delivery_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'invalid')
    .optional(),
});
/** Multipart form field next to the optional `file` (proof of delivery, PDF/PNG/JPEG). */
export const shipmentDeliverRequest = z.object({ note: optionalText(500) });

export const shipmentView = z.object({
  id: uuid,
  state: z.enum(SHIPMENT_STATES),
  carrier: z.string(),
  tracking_code: z.string().nullable(),
  expected_delivery_date: z.string().nullable(),
  dispatched_at: isoDateTime,
  delivered_at: isoDateTime.nullable(),
  delivery_note: z.string().nullable(),
  has_proof: z.boolean(),
  items: z.array(z.object({ order_line_id: uuid, quantity: z.number().int() })),
});

// ------------------------------------------------------------------ disputes

export const disputeOpenRequest = z.object({
  type: z.enum(DISPUTE_TYPES),
  reason: text(2000),
});
/** Multipart form field next to the optional `file` (evidence). */
export const disputeMessageRequest = z.object({ body: text(2000) });
export const adminDisputeEvidenceRequest = z.object({ message: text(2000) });
export const adminDisputeProposeRequest = z
  .object({
    proposal: z.enum(DISPUTE_PROPOSALS),
    amount_fils: positiveFils.optional(),
    note: text(2000),
  })
  .refine((v) => (v.proposal === 'REFUND') === (v.amount_fils !== undefined), {
    path: ['amount_fils'],
    message: 'required',
  });
export const adminDisputeCloseRequest = z.object({ resolution: text(2000) });
export const disputeListQuery = z.object({
  state: z.enum(DISPUTE_STATES).optional(),
  mine: z.enum(['true', 'false']).optional(),
  cursor: z.string().max(200).optional(),
});

export const disputeMessage = z.object({
  id: uuid,
  author_side: z.enum(['BUYER', 'SELLER', 'ADMIN', 'SYSTEM']),
  author_name: z.string(),
  body: z.string(),
  file: z.object({ id: uuid, name: z.string() }).nullable(),
  created_at: isoDateTime,
});
export const disputeSummary = z.object({
  id: uuid,
  number: z.string(),
  order_id: uuid,
  order_number: z.string(),
  type: z.enum(DISPUTE_TYPES),
  state: z.enum(DISPUTE_STATES),
  opened_side: z.enum(['BUYER', 'SELLER']),
  buyer_company_name: z.string(),
  seller_company_name: z.string(),
  assigned_to_me: z.boolean(),
  assigned: z.boolean(),
  created_at: isoDateTime,
  updated_at: isoDateTime,
});
export const disputeDetail = disputeSummary.extend({
  reason: z.string(),
  order_total_fils: filsString,
  order_refunded_fils: filsString,
  proposal: z.enum(DISPUTE_PROPOSALS).nullable(),
  proposal_amount_fils: filsString.nullable(),
  proposal_note: z.string().nullable(),
  resolution: z.string().nullable(),
  closed_at: isoDateTime.nullable(),
  messages: z.array(disputeMessage),
  refunds: z.array(
    z.object({
      id: uuid,
      number: z.string(),
      state: z.enum(REFUND_STATES),
      amount_fils: filsString,
    }),
  ),
  can_message: z.boolean(),
});

// ------------------------------------------------------------------ refunds and payouts (admin)

export const refundCreateRequest = z.object({
  order_id: uuid,
  amount_fils: positiveFils,
  reason: text(1000),
  dispute_id: uuid.optional(),
});
export const financeDecisionRequest = z.object({ reason: text(1000) });
export const refundListQuery = z.object({
  state: z.enum(REFUND_STATES).optional(),
  cursor: z.string().max(200).optional(),
});
export const refundItem = z.object({
  id: uuid,
  number: z.string(),
  order_id: uuid,
  order_number: z.string(),
  dispute_id: uuid.nullable(),
  amount_fils: filsString,
  commission_fils: filsString,
  state: z.enum(REFUND_STATES),
  reason: z.string(),
  requested_by: z.string(),
  requested_by_me: z.boolean(),
  approved_by: z.string().nullable(),
  decision_reason: z.string().nullable(),
  provider_ref: z.string().nullable(),
  failure_code: z.string().nullable(),
  sandbox: z.boolean(),
  created_at: isoDateTime,
  completed_at: isoDateTime.nullable(),
});

export const payoutCreateRequest = z.object({ seller_workspace_id: uuid });
export const payoutListQuery = z.object({
  state: z.enum(PAYOUT_STATES).optional(),
  cursor: z.string().max(200).optional(),
});
export const payoutItem = z.object({
  id: uuid,
  number: z.string(),
  seller_workspace_id: uuid,
  seller_company_name: z.string(),
  amount_fils: filsString,
  state: z.enum(PAYOUT_STATES),
  order_count: z.number().int(),
  requested_by: z.string().nullable(),
  requested_by_me: z.boolean(),
  approved_by: z.string().nullable(),
  decision_reason: z.string().nullable(),
  provider_ref: z.string().nullable(),
  failure_code: z.string().nullable(),
  sandbox: z.boolean(),
  created_at: isoDateTime,
  paid_at: isoDateTime.nullable(),
});
export const payoutEligibleSeller = z.object({
  seller_workspace_id: uuid,
  seller_company_name: z.string(),
  order_count: z.number().int(),
  amount_fils: filsString,
});
export const sandboxOperationCompleteRequest = z.object({
  outcome: z.enum(['success', 'failure']),
});

// ------------------------------------------------------------------ reviews

export const reviewCreateRequest = z.object({
  rating: z.number().int('integer').min(1, 'min').max(5, 'max'),
  comment: optionalText(FULFILMENT_LIMITS.reviewCommentMax),
});
export const reviewHideRequest = z.object({ reason: text(500) });
export const reviewListQuery = z.object({
  state: z.enum(REVIEW_STATES).optional(),
  cursor: z.string().max(200).optional(),
});
export const reviewItem = z.object({
  id: uuid,
  rating: z.number().int(),
  comment: z.string().nullable(),
  /** Null on public storefront views: buyers are shown as "Verified buyer" (P5 decision). */
  buyer_company_name: z.string().nullable(),
  created_at: isoDateTime,
});
export const adminReviewItem = reviewItem.extend({
  order_id: uuid,
  order_number: z.string(),
  seller_company_name: z.string(),
  state: z.enum(REVIEW_STATES),
  hidden_reason: z.string().nullable(),
});
export const storefrontReviews = z.object({
  average: z.number().nullable(),
  count: z.number().int(),
  items: z.array(reviewItem),
});

// ------------------------------------------------------------------ order additions

export const orderActions = z.object({
  can_process: z.boolean(),
  can_dispatch: z.boolean(),
  can_deliver: z.boolean(),
  can_confirm_receipt: z.boolean(),
  can_dispute: z.boolean(),
  can_review: z.boolean(),
});
export const orderFulfilment = z.object({
  shipment: shipmentView.nullable(),
  /** Seller and admin only. */
  settlement_state: z.enum(SETTLEMENT_STATES).nullable(),
  refunded_fils: filsString,
  completed_at: isoDateTime.nullable(),
  dispute: z.object({ id: uuid, number: z.string(), state: z.enum(DISPUTE_STATES) }).nullable(),
  review: z
    .object({
      rating: z.number().int(),
      comment: z.string().nullable(),
      state: z.enum(REVIEW_STATES),
    })
    .nullable(),
  actions: orderActions,
});

// ------------------------------------------------------------------ seller finance

export const sellerFinanceSummary = z.object({
  sandbox: z.boolean(),
  gross_fils: filsString,
  commission_fils: filsString,
  refunded_fils: filsString,
  net_payable_fils: filsString,
  not_yet_eligible_fils: filsString,
  eligible_fils: filsString,
  held_fils: filsString,
  in_payout_fils: filsString,
  paid_out_fils: filsString,
  payouts: z.array(
    payoutItem.omit({ requested_by: true, requested_by_me: true, approved_by: true }),
  ),
});

export type ShipmentView = z.infer<typeof shipmentView>;
export type DisputeSummary = z.infer<typeof disputeSummary>;
export type DisputeDetail = z.infer<typeof disputeDetail>;
export type RefundItem = z.infer<typeof refundItem>;
export type PayoutItem = z.infer<typeof payoutItem>;
export type PayoutEligibleSeller = z.infer<typeof payoutEligibleSeller>;
export type ReviewItem = z.infer<typeof reviewItem>;
export type AdminReviewItem = z.infer<typeof adminReviewItem>;
export type StorefrontReviews = z.infer<typeof storefrontReviews>;
export type OrderFulfilment = z.infer<typeof orderFulfilment>;
export type SellerFinanceSummary = z.infer<typeof sellerFinanceSummary>;
