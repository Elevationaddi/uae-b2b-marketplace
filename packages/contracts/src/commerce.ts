/**
 * Phase 4 contracts: addresses, cart, checkout with stock reservation, sandbox payments, orders,
 * ledger and reconciliation (docs/02-buyer.md, docs/07-api.md, docs/08-finance.md,
 * docs/09-workflows.md). Money is integer fils as a digit string; timestamps are UTC ISO.
 */
import { z } from 'zod';
import { filsString, QUANTITY_UNITS } from './catalog';
import { emirate, isoDateTime, uuid } from './common';
import { orderFulfilment } from './fulfilment';
import { MAX_QUANTITY } from './money';
import { orderTaxCode, TAX_TREATMENTS } from './tax';

export const CHECKOUT_STATES = [
  'PENDING_PAYMENT',
  'PAID',
  'EXPIRED',
  'CANCELLED',
  'RECONCILIATION_REQUIRED',
] as const;
export const CHECKOUT_SOURCES = ['CART', 'QUOTE'] as const;
export const ORDER_STATES = [
  'AWAITING_PAYMENT',
  'CONFIRMED',
  'PROCESSING',
  'DISPATCHED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
] as const;
export const PAYMENT_STATES = [
  'CREATED',
  'PENDING',
  'CAPTURED',
  'FAILED',
  'CANCELLED',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
] as const;
export const PAYMENT_EVENT_STATUSES = ['RECEIVED', 'PROCESSED', 'IGNORED', 'QUARANTINED'] as const;
export const RECONCILIATION_KINDS = [
  'LATE_CAPTURE',
  'AMOUNT_MISMATCH',
  'UNKNOWN_REFERENCE',
  'INVALID_SIGNATURE',
  'REFUND_FAILED',
  'PAYOUT_FAILED',
] as const;
export const CART_ISSUES = [
  'unavailable',
  'not_cart_eligible',
  'moq',
  'increment',
  'insufficient_stock',
] as const;
export const DELIVERY_ISSUES = [
  'no_delivery_terms',
  'emirate_not_served',
  /** TAX_TREATMENT=supplier_status and compliance has not confirmed the supplier's VAT status. */
  'supplier_vat_unconfirmed',
] as const;
export type CheckoutState = (typeof CHECKOUT_STATES)[number];
export type OrderState = (typeof ORDER_STATES)[number];

/** Provisional limits (P4-x decisions pending); enforced server-side. */
export const COMMERCE_LIMITS = {
  maxCartLines: 50,
  maxAddresses: 20,
  maxPaymentAttempts: 5,
} as const;

/** Ledger accounts of the operational ledger (docs/08-finance.md; not statutory accounting). */
export const LEDGER_ACCOUNTS = [
  'psp_clearing',
  'seller_payable',
  'platform_fee_revenue',
  'unallocated_receipts',
] as const;

const text = (max: number) => z.string().trim().min(1, 'required').max(max, 'max');
const quantity = z.number().int('integer').min(1, 'min').max(MAX_QUANTITY, 'max');
const unit = z.enum(QUANTITY_UNITS);

// ------------------------------------------------------------------ addresses

export const addressRequest = z.object({
  label: text(60),
  recipient: text(120),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{7,20}$/, 'phone'),
  line1: text(200),
  line2: z.string().trim().max(200, 'max').optional(),
  city: text(80),
  emirate,
  is_default: z.boolean().optional(),
});
export const addressItem = z.object({
  id: uuid,
  label: z.string(),
  recipient: z.string(),
  phone: z.string(),
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string(),
  emirate,
  is_default: z.boolean(),
});
/** Copy kept on the checkout and orders; never re-read from the live address. */
export const addressSnapshot = addressItem.omit({ id: true, is_default: true });

// ------------------------------------------------------------------ cart

export const cartAddRequest = z.object({ sku_id: uuid, quantity });
export const cartUpdateRequest = z.object({ quantity });
export const sellerRef = z.object({
  workspace_id: uuid,
  company_name: z.string(),
  storefront_id: uuid.nullable(),
});
export const deliveryTerms = z.object({
  fee_fils: filsString.nullable(),
  emirates: z.array(emirate),
  days: z.number().int().nullable(),
});
export const cartLine = z.object({
  id: uuid,
  sku_id: uuid,
  product_id: uuid,
  title_en: z.string(),
  title_ar: z.string().nullable(),
  sku_code: z.string(),
  variant_attributes: z.record(z.string(), z.string()),
  unit,
  quantity: z.number().int(),
  moq: z.number().int(),
  order_increment: z.number().int(),
  available: z.number().int(),
  unit_price_fils: filsString.nullable(),
  line_total_fils: filsString.nullable(),
  issue: z.enum(CART_ISSUES).nullable(),
});
export const cartGroup = z.object({
  seller: sellerRef,
  delivery: deliveryTerms,
  lines: z.array(cartLine),
  merchandise_fils: filsString,
});
export const cartView = z.object({
  groups: z.array(cartGroup),
  line_count: z.number().int(),
  merchandise_fils: filsString,
  checkout_available: z.boolean(),
  checkout_unavailable_reason: z.string().nullable(),
});

// ------------------------------------------------------------------ checkout

export const checkoutPreviewRequest = z.object({ address_id: uuid });
export const checkoutPreviewGroup = z.object({
  seller: sellerRef,
  lines: z.array(cartLine),
  merchandise_fils: filsString,
  shipping_fils: filsString,
  tax_fils: filsString,
  total_fils: filsString,
  delivery_days: z.number().int().nullable(),
  /** VAT rule for this supplier's order (F05): rate and how it was decided. */
  tax_bps: z.number().int(),
  tax_code: orderTaxCode,
  /** The supplier's disclosed return policy (C-11); null when the supplier has not stated one. */
  return_policy: z.object({ en: z.string().nullable(), ar: z.string().nullable() }).nullable(),
  issue: z.enum(DELIVERY_ISSUES).nullable(),
});
export const checkoutPreview = z.object({
  address: addressSnapshot,
  groups: z.array(checkoutPreviewGroup),
  merchandise_fils: filsString,
  shipping_fils: filsString,
  tax_fils: filsString,
  total_fils: filsString,
  /** The rate when every supplier has the same rate; null when rates differ by supplier. */
  tax_bps: z.number().int().nullable(),
  tax_treatment: z.enum(TAX_TREATMENTS),
  /** True while VAT is the provisional development rate, not a professionally approved rule. */
  tax_provisional: z.boolean(),
  reservation_minutes: z.number().int(),
  /** Hash of the priced lines; checkout is refused (409) if anything changed since the preview. */
  preview_hash: z.string(),
  blocked: z.boolean(),
});
export const checkoutCreateRequest = z.object({
  address_id: uuid,
  preview_hash: z.string().min(16).max(128),
  po_reference: z.string().trim().max(60).optional(),
  accept_terms: z.literal(true, { error: 'required' }),
});
export const paymentStartRequest = z.object({
  /** Required for quote checkouts that have no delivery address yet. */
  address_id: uuid.optional(),
});
export const paymentSummary = z.object({
  id: uuid,
  state: z.enum(PAYMENT_STATES),
  provider: z.string(),
  sandbox: z.boolean(),
  amount_fils: filsString,
  failure_code: z.string().nullable(),
  created_at: isoDateTime,
  captured_at: isoDateTime.nullable(),
});
export const paymentStartResponse = z.object({
  payment_id: uuid,
  redirect_url: z.string(),
  sandbox: z.boolean(),
});

export const orderParty = z.object({ workspace_id: uuid, company_name: z.string() });
export const orderSummary = z.object({
  id: uuid,
  number: z.string(),
  state: z.enum(ORDER_STATES),
  source: z.enum(CHECKOUT_SOURCES),
  checkout_id: uuid,
  checkout_number: z.string(),
  buyer: orderParty,
  seller: orderParty,
  total_fils: filsString,
  line_count: z.number().int(),
  pay_by: isoDateTime,
  created_at: isoDateTime,
  confirmed_at: isoDateTime.nullable(),
});
export const orderLine = z.object({
  id: uuid,
  position: z.number().int(),
  sku_id: uuid.nullable(),
  product_id: uuid.nullable(),
  quote_version_id: uuid.nullable(),
  title: z.string(),
  sku_code: z.string().nullable(),
  variant_attributes: z.record(z.string(), z.string()),
  unit,
  quantity: z.number().int(),
  unit_price_fils: filsString,
  line_total_fils: filsString,
});
export const orderEvent = z.object({
  id: uuid,
  kind: z.string(),
  actor_side: z.string(),
  reason: z.string().nullable(),
  created_at: isoDateTime,
});
export const orderDetail = orderSummary.extend({
  lines: z.array(orderLine),
  merchandise_fils: filsString,
  shipping_fils: filsString,
  tax_fils: filsString,
  tax_bps: z.number().int(),
  tax_code: orderTaxCode,
  tax_provisional: z.boolean(),
  /** Return policy disclosed at checkout (C-11); null when none was stated. */
  return_policy: z.object({ en: z.string().nullable(), ar: z.string().nullable() }).nullable(),
  /** C-07: the supplier asked to cancel; null otherwise. */
  seller_cancel: z.object({ requested_at: isoDateTime, reason: z.string() }).nullable(),
  /** Seller and admin only: the buyer never sees the platform commission. */
  commission_fils: filsString.nullable(),
  seller_payable_fils: filsString.nullable(),
  address: addressSnapshot.nullable(),
  po_reference: z.string().nullable(),
  rfq_id: uuid.nullable(),
  checkout_state: z.enum(CHECKOUT_STATES),
  cancel_reason: z.string().nullable(),
  events: z.array(orderEvent),
  /** Phase 5: shipment, settlement, dispute, review and the caller's allowed actions. */
  fulfilment: orderFulfilment,
});
export const checkoutResponse = z.object({
  id: uuid,
  number: z.string(),
  source: z.enum(CHECKOUT_SOURCES),
  state: z.enum(CHECKOUT_STATES),
  address: addressSnapshot.nullable(),
  po_reference: z.string().nullable(),
  merchandise_fils: filsString,
  shipping_fils: filsString,
  tax_fils: filsString,
  total_fils: filsString,
  pay_by: isoDateTime,
  reservation_expires_at: isoDateTime.nullable(),
  paid_at: isoDateTime.nullable(),
  rfq_id: uuid.nullable(),
  orders: z.array(orderSummary),
  payments: z.array(paymentSummary),
  /** True when payments run through the labelled sandbox adapter (no real money moves). */
  sandbox: z.boolean(),
  can_pay: z.boolean(),
});
export const orderListQuery = z.object({
  state: z.enum(ORDER_STATES).optional(),
  cursor: z.string().max(200).optional(),
});

// ------------------------------------------------------------------ sandbox PSP

export const sandboxSession = z.object({
  id: z.string(),
  amount_fils: filsString,
  currency: z.string(),
  reference: z.string(),
  state: z.enum(['OPEN', 'CAPTURED', 'FAILED', 'CANCELLED']),
  return_url: z.string(),
});
export const sandboxCompleteRequest = z.object({ outcome: z.enum(['success', 'failure']) });

// ------------------------------------------------------------------ admin finance (read-only)

export const adminPaymentQuery = z.object({
  state: z.enum(PAYMENT_STATES).optional(),
  cursor: z.string().max(200).optional(),
});
export const adminPaymentItem = paymentSummary.extend({
  checkout_id: uuid,
  checkout_number: z.string(),
  checkout_state: z.enum(CHECKOUT_STATES),
  buyer_company_name: z.string(),
  provider_ref: z.string(),
});
export const reconciliationQuery = z.object({
  state: z.enum(['OPEN', 'RESOLVED']).optional(),
  cursor: z.string().max(200).optional(),
});
export const reconciliationItem = z.object({
  id: uuid,
  kind: z.enum(RECONCILIATION_KINDS),
  state: z.enum(['OPEN', 'RESOLVED']),
  checkout_id: uuid.nullable(),
  checkout_number: z.string().nullable(),
  payment_id: uuid.nullable(),
  details: z.record(z.string(), z.unknown()),
  created_at: isoDateTime,
});
export const ledgerBalance = z.object({
  account: z.enum(LEDGER_ACCOUNTS),
  debit_fils: filsString,
  credit_fils: filsString,
});
export const adminFinanceSummary = z.object({
  sandbox: z.boolean(),
  balances: z.array(ledgerBalance),
  open_reconciliation: z.number().int(),
  payments_by_state: z.record(z.string(), z.number().int()),
});

/** Half-up rounding of amount × bps / 10000 (docs/08-finance.md). */
export function bpsOf(amountFils: bigint, bps: number): bigint {
  return (amountFils * BigInt(bps) + 5000n) / 10000n;
}

export type AddressItem = z.infer<typeof addressItem>;
export type AddressSnapshot = z.infer<typeof addressSnapshot>;
export type CartView = z.infer<typeof cartView>;
export type CartLine = z.infer<typeof cartLine>;
export type CheckoutPreview = z.infer<typeof checkoutPreview>;
export type CheckoutResponse = z.infer<typeof checkoutResponse>;
export type PaymentStartResponse = z.infer<typeof paymentStartResponse>;
export type OrderSummary = z.infer<typeof orderSummary>;
export type OrderDetail = z.infer<typeof orderDetail>;
export type SandboxSession = z.infer<typeof sandboxSession>;
export type AdminPaymentItem = z.infer<typeof adminPaymentItem>;
export type ReconciliationItem = z.infer<typeof reconciliationItem>;
export type AdminFinanceSummary = z.infer<typeof adminFinanceSummary>;
