/**
 * Phase 8 tax configuration (founder decision F05, conflicts C-08 and C-09): supplier VAT
 * registration status, the configurable tax treatment and non-binding invoice drafts. Nothing here
 * is a tax calculation approved by a tax professional; binding invoices stay disabled until then.
 */
import { z } from 'zod';
import { filsString } from './catalog';
import { isoDateTime, uuid } from './common';

/** Declared by the company, confirmed by compliance. */
export const VAT_STATUSES = ['UNKNOWN', 'REGISTERED', 'NOT_REGISTERED'] as const;
export const vatStatus = z.enum(VAT_STATUSES);
export type VatStatus = (typeof VAT_STATUSES)[number];

/**
 * provisional_standard: every supplier is charged the configured STANDARD rate (labelled
 * provisional; development and sandbox only). supplier_status: the rate follows each supplier's
 * confirmed VAT registration; unconfirmed suppliers cannot be checked out.
 */
export const TAX_TREATMENTS = ['provisional_standard', 'supplier_status'] as const;
export type TaxTreatment = (typeof TAX_TREATMENTS)[number];

/** How an order's VAT was decided. */
export const ORDER_TAX_CODES = [
  'PROVISIONAL_STANDARD',
  'STANDARD',
  'NO_VAT_NOT_REGISTERED',
  'ZERO_RATED',
  'EXEMPT',
] as const;
export const orderTaxCode = z.enum(ORDER_TAX_CODES);
export type OrderTaxCode = (typeof ORDER_TAX_CODES)[number];

/** Compliance confirms (or corrects and confirms) a company's VAT registration, with a reason. */
export const adminVatStatusRequest = z
  .object({
    vat_status: z.enum(['REGISTERED', 'NOT_REGISTERED']),
    trn: z
      .string()
      .trim()
      .regex(/^\d{15}$/, 'trn')
      .optional(),
    reason: z.string().trim().min(5, 'min').max(2000, 'max'),
  })
  .strict();

export const companyVat = z.object({
  vat_status: vatStatus,
  trn: z.string().nullable(),
  confirmed_at: isoDateTime.nullable(),
});

const party = z.object({
  legal_name: z.string(),
  trn: z.string().nullable(),
});

/**
 * Invoice draft for an order. Always non-binding: it is a preview of what an invoice would show,
 * prepared for review by the parties' tax advisers. It carries no invoice number and no issue date.
 */
export const invoiceDraft = z.object({
  order_id: uuid,
  order_number: z.string(),
  binding: z.literal(false),
  /** Why the draft is not a tax invoice (always present until professional approval). */
  status: z.literal('draft_not_tax_invoice'),
  tax_treatment: z.enum(TAX_TREATMENTS),
  tax_code: orderTaxCode,
  tax_bps: z.number().int(),
  provisional: z.boolean(),
  supplier: party.extend({ vat_status: vatStatus, vat_confirmed: z.boolean() }),
  buyer: party,
  lines: z.array(
    z.object({
      title: z.string(),
      quantity: z.number().int(),
      unit_price_fils: filsString,
      line_total_fils: filsString,
    }),
  ),
  merchandise_fils: filsString,
  shipping_fils: filsString,
  tax_fils: filsString,
  total_fils: filsString,
  /** Seller and admin only: the platform's commission document, VAT pending professional advice. */
  commission: z
    .object({
      commission_fils: filsString,
      commission_bps: z.number().int().nullable(),
      vat: z.literal('pending_professional_advice'),
    })
    .nullable(),
  created_at: isoDateTime,
});
export type InvoiceDraft = z.infer<typeof invoiceDraft>;
