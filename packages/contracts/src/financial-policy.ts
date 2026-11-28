/**
 * Phase 8 financial policy contracts (founder decisions of 28 November 2026): settlement holds,
 * the weekly payout run, the commission policy and reconciliation case resolution.
 */
import { z } from 'zod';
import { filsString } from './catalog';
import { isoDateTime, uuid } from './common';

const text = (max: number) => z.string().trim().min(1, 'required').max(max, 'max');

// ------------------------------------------------------------------ settlement holds

export const ORDER_HOLD_KINDS = [
  'COMPLIANCE',
  'FRAUD',
  'RECONCILIATION',
  'PAYMENT_INVESTIGATION',
] as const;
export type OrderHoldKind = (typeof ORDER_HOLD_KINDS)[number];

export const orderHoldCreateRequest = z.object({
  order_id: uuid,
  kind: z.enum(ORDER_HOLD_KINDS),
  reason: text(1000),
});
export const orderHoldReleaseRequest = z.object({ reason: text(1000) });
export const orderHoldListQuery = z.object({
  active: z.enum(['true', 'false']).optional(),
  order_id: uuid.optional(),
  cursor: z.string().max(200).optional(),
});
export const orderHoldItem = z.object({
  id: uuid,
  order_id: uuid,
  order_number: z.string(),
  seller_company_name: z.string(),
  kind: z.enum(ORDER_HOLD_KINDS),
  reason: z.string(),
  placed_by: z.string(),
  placed_at: isoDateTime,
  released_by: z.string().nullable(),
  released_at: isoDateTime.nullable(),
  release_reason: z.string().nullable(),
  settlement_state: z.string(),
});

// ------------------------------------------------------------------ weekly payout run

export const payoutRunSummary = z.object({
  /** Monday (YYYY-MM-DD) of the current Dubai week. */
  week_start: z.string(),
  week_end: z.string(),
  /** When this week's run is due (configured weekday and time, moved past weekends and holidays). */
  scheduled_for: isoDateTime,
  next_scheduled_for: isoDateTime,
  /** When the scheduler proposed this week's payouts (null until then). */
  proposed_at: isoDateTime.nullable(),
  proposed_count: z.number().int().nullable(),
  /** Configured schedule: ISO weekday (1 = Monday) and Dubai time. */
  schedule: z.object({ weekday: z.number().int(), time: z.string() }),
  payout_count: z.number().int(),
  amount_fils: filsString,
  /** Sandbox: derived from the ledger. Payout approval is refused above this amount. */
  available_fils: z.string(),
  sandbox: z.boolean(),
});

// ------------------------------------------------------------------ commission policy

export const COMMISSION_LIMITS = { maxBps: 5000 } as const;

export const commissionPolicyCreateRequest = z.object({
  rate_bps: z.number().int('integer').min(0, 'min').max(COMMISSION_LIMITS.maxBps, 'max'),
  reason: text(1000),
  totp_code: z.string().regex(/^\d{6}$/, 'code'),
  /** When the new rate applies; at least COMMISSION_NOTICE_DAYS (30) ahead (FD-05). */
  effective_from: isoDateTime,
});
export const commissionPolicyItem = z.object({
  id: uuid,
  version: z.number().int(),
  rate_bps: z.number().int(),
  base: z.string(),
  reason: z.string(),
  created_by: z.string().nullable(),
  effective_from: isoDateTime,
  /** True until the effective date passes. */
  scheduled: z.boolean(),
  created_at: isoDateTime,
});
export const commissionSettings = z.object({
  current: z.object({
    rate_bps: z.number().int(),
    version: z.number().int().nullable(),
    /** policy: a recorded version; configuration: COMMISSION_BPS or the sandbox fixture. */
    source: z.enum(['policy', 'configuration']),
  }),
  can_manage: z.boolean(),
  /** Minimum days between recording a change and its effective date. */
  notice_days: z.number().int(),
  /** Earliest allowed effective date for a change recorded now. */
  earliest_effective_from: isoDateTime,
  history: z.array(commissionPolicyItem),
});

// ------------------------------------------------------------------ payout holidays (Q9)

export const payoutHolidayCreateRequest = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date'),
  name: z.string().trim().min(2, 'min').max(200, 'max'),
});
export const payoutHolidayItem = z.object({
  date: z.string(),
  name: z.string(),
  created_by: z.string().nullable(),
  created_at: isoDateTime,
});

// ------------------------------------------------------------------ reconciliation

export const reconciliationResolveRequest = z.object({ resolution: text(1000) });

export type OrderHoldItem = z.infer<typeof orderHoldItem>;
export type PayoutRunSummary = z.infer<typeof payoutRunSummary>;
export type CommissionPolicyItem = z.infer<typeof commissionPolicyItem>;
export type CommissionSettings = z.infer<typeof commissionSettings>;
export type PayoutHolidayItem = z.infer<typeof payoutHolidayItem>;
