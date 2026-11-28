/**
 * Phase 3 contracts: RFQs, versioned quotes and award, conversations and notifications
 * (docs/02-buyer.md, docs/03-seller.md, docs/07-api.md, docs/09-workflows.md).
 * JSON keys are snake_case; money is integer fils as a digit string; timestamps are UTC ISO.
 */
import { z } from 'zod';
import { filsString, QUANTITY_UNITS } from './catalog';
import { emirate, isoDate, isoDateTime, uuid } from './common';
import { MAX_QUANTITY, MAX_UNIT_PRICE_FILS } from './money';

export const RFQ_STATES = ['DRAFT', 'OPEN', 'AWARDED', 'CANCELLED', 'EXPIRED'] as const;
export const RFQ_VISIBILITIES = ['POOL', 'INVITE'] as const;
export const QUOTE_STATES = [
  'DRAFT',
  'SUBMITTED',
  'ACCEPTED',
  'DECLINED',
  'WITHDRAWN',
  'EXPIRED',
] as const;
export const QUOTE_VERSION_STATES = [
  'DRAFT',
  'SUBMITTED',
  'SUPERSEDED',
  'ACCEPTED',
  'DECLINED',
  'WITHDRAWN',
  'EXPIRED',
] as const;
export const TAX_CODES = ['STANDARD', 'ZERO_RATED', 'EXEMPT'] as const;
export type RfqState = (typeof RFQ_STATES)[number];
export type QuoteState = (typeof QUOTE_STATES)[number];
export type TaxCodeValue = (typeof TAX_CODES)[number];

/** Provisional development limits (Phase 3 decision 2 is open); enforced server-side. */
export const RFQ_LIMITS = {
  maxDeadlineDays: 90,
  minDeadlineMinutes: 60,
  maxInvites: 20,
  maxFiles: 5,
  maxQuoteFiles: 5,
  maxQuoteValidityDays: 90,
  maxOpenPerWorkspace: 50,
} as const;

const boolean_ = () => z.boolean();
const text = (max: number) => z.string().trim().min(1, 'required').max(max, 'max');
const optionalText = (max: number) => z.string().trim().max(max, 'max').optional();
const quantity = z.number().int('integer').min(1, 'min').max(MAX_QUANTITY, 'max');
const money = filsString.refine((v) => !/^\d+$/.test(v) || BigInt(v) <= MAX_UNIT_PRICE_FILS, 'max');

export const rfqVisibility = z.enum(RFQ_VISIBILITIES);
export const taxCode = z.enum(TAX_CODES);
const unit = z.enum(QUANTITY_UNITS);

export const rfqCreateRequest = z.object({
  title: text(160),
  category_id: uuid,
  specs: text(5000),
  quantity,
  unit: unit.default('PIECE'),
  target_date: isoDate,
  emirate,
  budget_fils: money.nullable().optional(),
  deadline: isoDateTime,
  visibility: rfqVisibility.default('POOL'),
  invitee_storefront_ids: z.array(uuid).max(RFQ_LIMITS.maxInvites, 'max').default([]),
});
export const rfqUpdateRequest = rfqCreateRequest
  .partial()
  .extend({ expected_version: z.number().int().positive() });
export const rfqCancelRequest = z.object({
  expected_version: z.number().int().positive(),
  reason: z.string().trim().max(1000).optional(),
});
export const rfqListQuery = z.object({
  state: z.enum(RFQ_STATES).optional(),
  cursor: z.string().max(200).optional(),
});
export const sellerRfqListQuery = z.object({
  scope: z.enum(['all', 'invited', 'pool', 'quoted']).default('all'),
  category_id: uuid.optional(),
  q: z.string().trim().max(100).optional(),
  cursor: z.string().max(200).optional(),
});

export const quoteFields = z.object({
  quantity,
  unit,
  unit_price_fils: money,
  shipping_fils: money.default('0'),
  tax_code: taxCode,
  specs: text(5000),
  deviations: optionalText(2000).nullable(),
  lead_days: z.number().int().min(0).max(730),
  delivery_date: isoDate,
  valid_until: isoDateTime,
  terms: optionalText(3000).nullable(),
});
export const quoteDraftRequest = quoteFields;
export const quoteUpdateRequest = quoteFields.partial().extend({
  expected_version: z.number().int().positive(),
});
export const quoteReviseRequest = quoteFields.extend({
  expected_version: z.number().int().positive(),
});
export const quoteVersionActionRequest = z.object({
  version_id: uuid,
  reason: z.string().trim().max(1000).optional(),
});
export const quoteExpectedRequest = z.object({ expected_version: z.number().int().positive() });
/** docs/07-api.md: accept the exact version shown; totals are never taken from the client. */
export const quoteAcceptRequest = z.object({
  version_id: uuid,
  po_reference: z.string().trim().max(60).optional(),
});

// ---------------------------------------------------------------- responses

const party = z.object({
  workspace_id: uuid,
  company_name: z.string(),
  emirate: z.string(),
});
export const sellerParty = party.extend({ storefront_id: uuid.nullable() });

export const rfqFileItem = z.object({
  id: uuid,
  name: z.string(),
  mime: z.string(),
  bytes: z.number().int(),
  scan_state: z.enum(['PENDING', 'CLEAN', 'INFECTED']),
  created_at: isoDateTime,
});

export const quoteVersionResponse = z.object({
  id: uuid,
  version: z.number().int(),
  state: z.enum(QUOTE_VERSION_STATES),
  quantity: z.number().int(),
  unit,
  unit_price_fils: filsString,
  subtotal_fils: filsString,
  shipping_fils: filsString,
  tax_code: taxCode,
  tax_bps: z.number().int(),
  tax_fils: filsString,
  total_fils: filsString,
  specs: z.string(),
  deviations: z.string().nullable(),
  lead_days: z.number().int(),
  delivery_date: isoDate,
  valid_until: isoDateTime,
  terms: z.string().nullable(),
  submitted_at: isoDateTime.nullable(),
  files: z.array(rfqFileItem),
});

export const quoteResponse = z.object({
  id: uuid,
  rfq_id: uuid,
  state: z.enum(QUOTE_STATES),
  version: z.number().int(),
  seller: sellerParty,
  current: quoteVersionResponse.nullable(),
  /** Older submitted versions, newest first (buyer and the quoting seller only). */
  history: z.array(quoteVersionResponse),
  revision_requested: z.boolean(),
  created_at: isoDateTime,
  updated_at: isoDateTime,
});

export const rfqEventItem = z.object({
  id: uuid,
  kind: z.string(),
  actor_side: z.string(),
  quote_id: uuid.nullable(),
  quote_version_id: uuid.nullable(),
  reason: z.string().nullable(),
  created_at: isoDateTime,
});

export const rfqSummary = z.object({
  id: uuid,
  number: z.string(),
  title: z.string(),
  state: z.enum(RFQ_STATES),
  visibility: rfqVisibility,
  category_id: uuid,
  category_name_en: z.string(),
  category_name_ar: z.string(),
  quantity: z.number().int(),
  unit,
  emirate: z.string(),
  target_date: isoDate,
  deadline: isoDateTime,
  published_at: isoDateTime.nullable(),
  /** Submitted quotes; buyer and admin views only (null for sellers: competitive information). */
  quote_count: z.number().int().nullable(),
  created_at: isoDateTime,
});

export const rfqDetail = rfqSummary.extend({
  version: z.number().int(),
  specs: z.string(),
  budget_fils: filsString.nullable(),
  cancel_reason: z.string().nullable(),
  awarded_at: isoDateTime.nullable(),
  accepted_quote_version_id: uuid.nullable(),
  payment_due_at: isoDateTime.nullable(),
  admin_hidden: boolean_(),
  buyer: party,
  invitees: z.array(sellerParty),
  files: z.array(rfqFileItem),
  events: z.array(rfqEventItem),
  /** Buyer view: every quote. Seller view: only the caller's own quote (or none). */
  quotes: z.array(quoteResponse),
  can: z.object({
    edit: z.boolean(),
    publish: z.boolean(),
    cancel: z.boolean(),
    quote: z.boolean(),
    message: z.boolean(),
  }),
  /** Seller view only: why quoting is unavailable (message key), if it is. */
  quote_blocked_reason: z.string().nullable(),
  /** Seller view only: the caller's workspace was invited. */
  invited: z.boolean().optional(),
});

export const sellerRfqItem = rfqSummary.extend({
  invited: z.boolean(),
  buyer_company_name: z.string(),
  my_quote_state: z.enum(QUOTE_STATES).nullable(),
});

export const sellerQuoteItem = z.object({
  id: uuid,
  state: z.enum(QUOTE_STATES),
  rfq: rfqSummary.pick({ id: true, number: true, title: true, state: true, deadline: true }),
  buyer_company_name: z.string(),
  current: quoteVersionResponse
    .pick({
      version: true,
      state: true,
      total_fils: true,
      valid_until: true,
    })
    .nullable(),
  updated_at: isoDateTime,
});
export const sellerQuoteListQuery = z.object({
  state: z.enum(QUOTE_STATES).optional(),
  cursor: z.string().max(200).optional(),
});

export const awardResponse = z.object({
  rfq_id: uuid,
  quote_id: uuid,
  quote_version_id: uuid,
  state: z.literal('AWARDED'),
  total_fils: filsString,
  awarded_at: isoDateTime,
  payment_due_at: isoDateTime,
  /** Orders and checkout are created in Phase 4; until then the award is recorded only. */
  order_id: uuid.nullable(),
});

/** Eligible sellers a buyer may invite (public storefronts of trading-eligible sellers). */
export const inviteCandidateQuery = z.object({
  category_id: uuid.optional(),
  q: z.string().trim().max(100).optional(),
});
export const inviteCandidate = sellerParty.extend({ business_type: z.string().nullable() });

// ---------------------------------------------------------------- conversations

export const conversationStartRequest = z.object({
  /** Buyer starting a conversation with a supplier (storefront id), optionally about an RFQ. */
  storefront_id: uuid.optional(),
  /** Seller asking a question about an RFQ visible to them. */
  rfq_id: uuid.optional(),
  body: text(4000),
});
export const messageCreateRequest = z.object({ body: text(4000) });
export const readRequest = z.object({ last_message_id: uuid });
export const conversationListQuery = z.object({
  workspace_id: uuid,
  cursor: z.string().max(200).optional(),
});

export const messageItem = z.object({
  id: uuid,
  body: z.string().nullable(),
  file: rfqFileItem.nullable(),
  sender_name: z.string(),
  mine: z.boolean(),
  /** BUYER or SELLER side of the conversation. */
  side: z.enum(['BUYER', 'SELLER']),
  created_at: isoDateTime,
});
export const conversationItem = z.object({
  id: uuid,
  /** The other party as seen by the caller's workspace. */
  counterpart: z.object({ workspace_id: uuid, company_name: z.string() }),
  my_side: z.enum(['BUYER', 'SELLER']),
  my_workspace_id: uuid,
  rfq: z.object({ id: uuid, number: z.string(), title: z.string() }).nullable(),
  last_message: messageItem.pick({ body: true, created_at: true, mine: true }).nullable(),
  unread: z.number().int(),
  last_message_at: isoDateTime,
});
export const conversationDetail = conversationItem.extend({
  can_send: z.boolean(),
  send_blocked_reason: z.string().nullable(),
});

// ---------------------------------------------------------------- notifications

export const NOTIFICATION_TYPES = [
  'rfq.invited',
  'rfq.matched',
  'rfq.question',
  'rfq.cancelled',
  'rfq.expired',
  'rfq.awarded_other',
  'quote.submitted',
  'quote.revised',
  'quote.withdrawn',
  'quote.revision_requested',
  'quote.declined',
  'quote.accepted',
  'quote.expired',
  'message.new',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const notificationItem = z.object({
  id: uuid,
  type: z.string(),
  payload: z.record(z.string(), z.union([z.string(), z.number(), z.null()])),
  read_at: isoDateTime.nullable(),
  created_at: isoDateTime,
});
export const notificationListQuery = z.object({
  unread: z.enum(['true', 'false']).optional(),
  cursor: z.string().max(200).optional(),
});
export const unreadCounts = z.object({
  notifications: z.number().int(),
  messages: z.number().int(),
});
export const notificationPreferences = z.object({
  email_rfqs: z.boolean(),
  email_quotes: z.boolean(),
  email_messages: z.boolean(),
});
export const notificationPreferencesRequest = notificationPreferences.partial();

// ---------------------------------------------------------------- admin

export const adminRfqQuery = z.object({
  state: z.enum(RFQ_STATES).optional(),
  hidden: z.enum(['true', 'false']).optional(),
  q: z.string().trim().max(100).optional(),
  cursor: z.string().max(200).optional(),
});
export const adminRfqItem = rfqSummary.extend({
  buyer_company_name: z.string(),
  hidden: z.boolean(),
});
/** Metadata only: quote contents stay private (docs/04-admin.md). */
export const adminRfqDetail = adminRfqItem.extend({
  specs: z.string(),
  hidden_reason: z.string().nullable(),
  invitee_count: z.number().int(),
  file_count: z.number().int(),
  quotes: z.array(
    z.object({
      id: uuid,
      seller_company_name: z.string(),
      state: z.enum(QUOTE_STATES),
      version: z.number().int(),
      updated_at: isoDateTime,
    }),
  ),
  events: z.array(rfqEventItem),
});

/** Tax and total for one quote line (docs/08-finance.md): tax on goods and shipping, half-up. */
export function quoteTotals(
  qty: number,
  unitPriceFils: bigint,
  shippingFils: bigint,
  taxBps: number,
): { subtotal: bigint; tax: bigint; total: bigint } {
  const subtotal = BigInt(qty) * unitPriceFils;
  const base = (subtotal + shippingFils) * BigInt(taxBps);
  const tax = (base + 5000n) / 10000n;
  return { subtotal, tax, total: subtotal + shippingFils + tax };
}

export type RfqSummary = z.infer<typeof rfqSummary>;
export type RfqDetail = z.infer<typeof rfqDetail>;
export type QuoteResponse = z.infer<typeof quoteResponse>;
export type QuoteVersionResponse = z.infer<typeof quoteVersionResponse>;
export type SellerRfqItem = z.infer<typeof sellerRfqItem>;
export type SellerQuoteItem = z.infer<typeof sellerQuoteItem>;
export type AwardResponse = z.infer<typeof awardResponse>;
export type InviteCandidate = z.infer<typeof inviteCandidate>;
export type ConversationItem = z.infer<typeof conversationItem>;
export type ConversationDetail = z.infer<typeof conversationDetail>;
export type MessageItem = z.infer<typeof messageItem>;
export type NotificationItem = z.infer<typeof notificationItem>;
export type UnreadCounts = z.infer<typeof unreadCounts>;
export type NotificationPreferences = z.infer<typeof notificationPreferences>;
export type AdminRfqItem = z.infer<typeof adminRfqItem>;
export type AdminRfqDetail = z.infer<typeof adminRfqDetail>;
