/**
 * Phase 6 contracts: customer support tickets, operational admin overview and scoped CSV
 * report exports (docs/04-admin.md, docs/09-workflows.md, T36, T41).
 */
import { z } from 'zod';
import { filsString } from './catalog';
import { isoDate, isoDateTime, uuid } from './common';

export const SUPPORT_STATES = [
  'OPEN',
  'ASSIGNED',
  'WAITING_CUSTOMER',
  'RESOLVED',
  'CLOSED',
] as const;
export const SUPPORT_CATEGORIES = [
  'ACCOUNT',
  'VERIFICATION',
  'ORDER',
  'PAYMENT',
  'RFQ',
  'CATALOG',
  'OTHER',
] as const;
export const REPORT_TYPES = [
  'orders',
  'refunds',
  'payouts',
  'disputes',
  'support_tickets',
] as const;
export const EXPORT_SCOPES = ['assigned', 'all'] as const;
export type SupportState = (typeof SUPPORT_STATES)[number];
export type ReportType = (typeof REPORT_TYPES)[number];

/** Provisional limits (P6-x pending founder); enforced server-side. */
export const OPERATIONS_LIMITS = {
  maxSupportMessages: 200,
  openTicketsPerWorkspace: 20,
  exportMaxRows: 50_000,
  exportMaxDays: 366,
  exportTtlHours: 24,
} as const;

const text = (max: number) => z.string().trim().min(1, 'required').max(max, 'max');

// ------------------------------------------------------------------ support (customer)

export const supportCreateRequest = z.object({
  category: z.enum(SUPPORT_CATEGORIES),
  subject: text(160),
  body: text(4000),
  order_id: uuid.optional(),
  rfq_id: uuid.optional(),
});
export const supportReplyRequest = z.object({ body: text(4000) });
/** Admin resolution note (optional), shown to the customer as the last message. */
export const supportResolveRequest = z.object({ body: text(4000).optional() });
export const supportListQuery = z.object({
  state: z.enum(SUPPORT_STATES).optional(),
  cursor: z.string().max(200).optional(),
});
export const adminSupportListQuery = supportListQuery.extend({
  assigned: z.enum(['me', 'unassigned', 'any']).optional(),
});

export const supportMessage = z.object({
  id: uuid,
  author_side: z.enum(['CUSTOMER', 'ADMIN', 'SYSTEM']),
  author_name: z.string(),
  body: z.string(),
  created_at: isoDateTime,
});
export const supportTicketSummary = z.object({
  id: uuid,
  number: z.string(),
  category: z.enum(SUPPORT_CATEGORIES),
  subject: z.string(),
  state: z.enum(SUPPORT_STATES),
  company_name: z.string(),
  workspace_kind: z.enum(['BUYER', 'SELLER']),
  assigned: z.boolean(),
  assigned_to_me: z.boolean(),
  created_at: isoDateTime,
  updated_at: isoDateTime,
});
export const supportTicketDetail = supportTicketSummary.extend({
  /** Limited order details only (number, state, total), docs/04-admin.md support scope. */
  order: z
    .object({ id: uuid, number: z.string(), state: z.string(), total_fils: filsString })
    .nullable(),
  rfq: z.object({ id: uuid, number: z.string(), title: z.string() }).nullable(),
  messages: z.array(supportMessage),
  can_reply: z.boolean(),
  can_close: z.boolean(),
  can_reopen: z.boolean(),
});

// ------------------------------------------------------------------ admin overview

export const overviewQuery = z.object({ from: isoDate.optional(), to: isoDate.optional() });
export const operationsOverview = z.object({
  range: z.object({ from: isoDate, to: isoDate }),
  /** Null unless the admin holds admin.finance.read. */
  commerce: z
    .object({
      sandbox: z.boolean(),
      paid_orders: z.number().int(),
      gmv_fils: filsString,
      refunds_fils: filsString,
      net_fils: filsString,
      fee_revenue_fils: filsString,
      seller_payable_pending_fils: filsString,
      seller_payable_settled_fils: filsString,
    })
    .nullable(),
  cases: z.object({
    open_disputes: z.number().int(),
    unassigned_disputes: z.number().int(),
    open_support: z.number().int(),
    unassigned_support: z.number().int(),
    open_reconciliation: z.number().int(),
    quarantined_webhooks_7d: z.number().int(),
    refunds_awaiting_approval: z.number().int(),
    payouts_awaiting_approval: z.number().int(),
  }),
  /**
   * Background tasks run by the PostgreSQL scheduler (Phase 8): overdue means not run within twice
   * its cadence plus a minute (the worker or the cron is not running, or a task keeps failing).
   */
  background_tasks: z.array(
    z.object({
      name: z.string(),
      every_seconds: z.number().int(),
      last_status: z.enum(['succeeded', 'failed']).nullable(),
      last_finished_at: isoDateTime.nullable(),
      next_run_at: isoDateTime,
      consecutive_failures: z.number().int(),
      overdue: z.boolean(),
    }),
  ),
  generated_at: isoDateTime,
});

// ------------------------------------------------------------------ exports

export const exportCreateRequest = z
  .object({
    report_type: z.enum(REPORT_TYPES),
    scope: z.enum(EXPORT_SCOPES),
    from: isoDate,
    to: isoDate,
    reason: text(500),
    /** Step-up authentication: a current TOTP code (docs/10-security.md sensitive exports). */
    totp_code: z.string().regex(/^\d{6}$/, 'code'),
  })
  .refine((v) => v.from <= v.to, { path: ['to'], message: 'invalid' });
export const exportListQuery = z.object({ cursor: z.string().max(200).optional() });
export const exportItem = z.object({
  id: uuid,
  report_type: z.enum(REPORT_TYPES),
  scope: z.enum(EXPORT_SCOPES),
  from: isoDate,
  to: isoDate,
  row_count: z.number().int(),
  state: z.enum(['READY', 'EXPIRED']),
  expires_at: isoDateTime,
  downloaded_at: isoDateTime.nullable(),
  created_at: isoDateTime,
});

export type SupportTicketSummary = z.infer<typeof supportTicketSummary>;
export type SupportTicketDetail = z.infer<typeof supportTicketDetail>;
export type OperationsOverview = z.infer<typeof operationsOverview>;
export type ExportItem = z.infer<typeof exportItem>;
