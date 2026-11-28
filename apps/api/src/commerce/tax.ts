import type { OrderTaxCode, TaxTreatment, VatStatus } from '@app/contracts';

/**
 * VAT rule per supplier order (founder decision F05, conflicts C-08/C-09). There is no assumed
 * "standard VAT for everyone" outside the labelled provisional development mode:
 * - provisional_standard: the configured STANDARD rate for every supplier, labelled provisional.
 * - supplier_status: a supplier whose VAT registration compliance confirmed charges the STANDARD
 *   rate; one confirmed as not registered charges no VAT; anyone unconfirmed cannot be checked out.
 * None of this is a professionally approved tax determination; production requires
 * TAX_APPROVAL_REFERENCE before it starts (see packages/config).
 */
export interface TaxSettings {
  treatment: TaxTreatment;
  standardBps: number;
}

export interface SupplierVat {
  status: VatStatus;
  confirmed: boolean;
  trn: string | null;
}

export type TaxRule =
  | { ok: true; code: OrderTaxCode; bps: number; provisional: boolean }
  | { ok: false; reason: 'supplier_vat_unconfirmed' };

export function taxRuleFor(settings: TaxSettings, vat: SupplierVat): TaxRule {
  if (settings.treatment === 'provisional_standard')
    return { ok: true, code: 'PROVISIONAL_STANDARD', bps: settings.standardBps, provisional: true };
  if (!vat.confirmed || vat.status === 'UNKNOWN')
    return { ok: false, reason: 'supplier_vat_unconfirmed' };
  if (vat.status === 'REGISTERED' && vat.trn)
    return { ok: true, code: 'STANDARD', bps: settings.standardBps, provisional: false };
  if (vat.status === 'NOT_REGISTERED')
    return { ok: true, code: 'NO_VAT_NOT_REGISTERED', bps: 0, provisional: false };
  return { ok: false, reason: 'supplier_vat_unconfirmed' };
}

/**
 * Whether a supplier may quote with a tax code. In supplier_status mode a supplier whose VAT status
 * compliance has not confirmed cannot quote, and one confirmed as not registered cannot charge
 * STANDARD VAT. Returns the refusal message key, or null when allowed.
 */
export function quoteTaxRefusal(
  settings: TaxSettings,
  vat: SupplierVat,
  code: 'STANDARD' | 'ZERO_RATED' | 'EXEMPT',
): 'quote.supplier_vat_unconfirmed' | 'quote.vat_not_registered' | null {
  if (settings.treatment === 'provisional_standard') return null;
  const rule = taxRuleFor(settings, vat);
  if (!rule.ok) return 'quote.supplier_vat_unconfirmed';
  if (rule.code === 'NO_VAT_NOT_REGISTERED' && code === 'STANDARD')
    return 'quote.vat_not_registered';
  return null;
}

export function supplierVat(c: {
  vatStatus: VatStatus;
  vatStatusConfirmedAt: Date | null;
  trn: string | null;
}): SupplierVat {
  return { status: c.vatStatus, confirmed: c.vatStatusConfirmedAt !== null, trn: c.trn };
}

/** The tax rule recorded on an order: its snapshot first, then the checkout's rule. */
export function orderTaxRule(
  snapshot: unknown,
  checkoutTaxRule: unknown,
): { code: OrderTaxCode; bps: number; provisional: boolean } {
  const s = (snapshot as { tax?: { code?: string; bps?: number; provisional?: boolean } } | null)
    ?.tax;
  if (s && typeof s.bps === 'number' && typeof s.code === 'string')
    return { code: s.code as OrderTaxCode, bps: s.bps, provisional: s.provisional === true };
  // Orders created before Phase 8 carry only the checkout rule: STANDARD for everyone, which was
  // the provisional development rate (or a quote's chosen code).
  const r = checkoutTaxRule as { code?: string; bps?: number; source?: string } | null;
  const bps = r?.bps ?? 0;
  if (r?.source === 'quote' && (r.code === 'ZERO_RATED' || r.code === 'EXEMPT'))
    return { code: r.code, bps, provisional: true };
  return { code: 'PROVISIONAL_STANDARD', bps, provisional: true };
}
