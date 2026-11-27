/**
 * Money and wholesale pricing rules shared by the API and the web client.
 * Money is integer fils (1 AED = 100 fils), carried in JSON as a string of digits; no floating
 * point is used anywhere (docs/06-data.md, CLAUDE.md). The server is authoritative: the client
 * uses these helpers only to pre-validate forms and display estimates.
 */

export const MAX_UNIT_PRICE_FILS = 100_000_000_000n; // AED 1,000,000,000 per unit
export const MAX_TIERS = 10;
export const MAX_QUANTITY = 10_000_000;

/** Parse an AED amount typed by a person ("12", "12.5", "1,250.00") into fils. Null when invalid. */
export function parseAedToFils(input: string): bigint | null {
  const s = input.trim().replace(/[,\s]/g, '').replace(/^AED/i, '');
  const m = /^(\d{1,12})(?:\.(\d{1,2}))?$/.exec(s);
  if (!m) return null;
  const whole = BigInt(m[1]!);
  const frac = BigInt((m[2] ?? '').padEnd(2, '0') || '0');
  return whole * 100n + frac;
}

/** Fils -> "1250.50" (exact decimal string). */
export function filsToDecimal(fils: bigint | string): string {
  const v = typeof fils === 'bigint' ? fils : BigInt(fils);
  const neg = v < 0n;
  const abs = neg ? -v : v;
  const whole = abs / 100n;
  const frac = (abs % 100n).toString().padStart(2, '0');
  return `${neg ? '-' : ''}${whole.toString()}.${frac}`;
}

/** Localised AED display without converting to a float (Intl formats the exact decimal string). */
export function formatFils(fils: bigint | string, locale: string): string {
  const decimal = filsToDecimal(fils);
  const fmt = new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // Intl.NumberFormat accepts exact decimal strings (ES2023); typed loosely for older lib typings.
  return (fmt.format as (v: string) => string)(decimal);
}

export type PriceTypeValue = 'FIXED' | 'TIERED' | 'QUOTE_ONLY';
export interface TierInput {
  min_qty: number;
  unit_price_fils: string;
}
export interface SkuPricingInput {
  moq: number;
  order_increment: number;
  tiers: TierInput[];
}

/**
 * Validate one SKU's wholesale terms (docs/09-workflows.md "Wholesale rules", T07):
 * MOQ >= 1; increment >= 1; FIXED = exactly one tier at the MOQ; TIERED = 2..10 tiers, first at the
 * MOQ, thresholds strictly ascending and reachable with the increment, unit prices non-increasing;
 * QUOTE_ONLY = no tiers. Returns field errors keyed relative to the SKU (empty object when valid).
 */
export function validateSkuPricing(
  priceType: PriceTypeValue,
  p: SkuPricingInput,
): Record<string, string> {
  const e: Record<string, string> = {};
  if (!Number.isInteger(p.moq) || p.moq < 1) e.moq = 'min';
  else if (p.moq > MAX_QUANTITY) e.moq = 'max';
  if (!Number.isInteger(p.order_increment) || p.order_increment < 1) e.order_increment = 'min';
  else if (p.order_increment > MAX_QUANTITY) e.order_increment = 'max';
  if (priceType === 'QUOTE_ONLY') {
    if (p.tiers.length) e.tiers = 'quote_only_no_tiers';
    return e;
  }
  if (p.tiers.length === 0) {
    e.tiers = 'required';
    return e;
  }
  if (priceType === 'FIXED' && p.tiers.length !== 1) e.tiers = 'fixed_single_tier';
  if (priceType === 'TIERED' && p.tiers.length < 2) e.tiers = 'tiered_min_two';
  if (p.tiers.length > MAX_TIERS) e.tiers = 'max';
  let prevQty = 0;
  let prevPrice: bigint | null = null;
  p.tiers.forEach((t, i) => {
    const qtyKey = `tiers.${i}.min_qty`;
    const priceKey = `tiers.${i}.unit_price_fils`;
    if (!Number.isInteger(t.min_qty) || t.min_qty < 1) e[qtyKey] = 'min';
    else if (t.min_qty > MAX_QUANTITY) e[qtyKey] = 'max';
    else if (i === 0 && !e.moq && t.min_qty !== p.moq) e[qtyKey] = 'first_equals_moq';
    else if (i > 0 && t.min_qty <= prevQty) e[qtyKey] = 'ascending';
    else if (!e.moq && !e.order_increment && (t.min_qty - p.moq) % p.order_increment !== 0)
      e[qtyKey] = 'increment';
    if (!/^\d{1,15}$/.test(t.unit_price_fils)) e[priceKey] = 'money';
    else {
      const price = BigInt(t.unit_price_fils);
      if (price > MAX_UNIT_PRICE_FILS) e[priceKey] = 'max';
      else if (prevPrice !== null && price > prevPrice) e[priceKey] = 'nonincreasing';
      prevPrice = price;
    }
    if (Number.isInteger(t.min_qty)) prevQty = Math.max(prevQty, t.min_qty);
  });
  return e;
}

export type QuantityCheck =
  | { ok: true; unitPriceFils: bigint; lineTotalFils: bigint; tierMinQty: number }
  | { ok: false; code: 'MOQ_NOT_MET' | 'INCREMENT' | 'QUOTE_ONLY' | 'INVALID' };

/**
 * Server-side price for a quantity (T09/T10): quantity must reach the MOQ and follow the
 * increment; the applicable tier is the highest threshold <= quantity. Never trusts client totals.
 */
export function priceForQuantity(
  priceType: PriceTypeValue,
  p: { moq: number; order_increment: number; tiers: { min_qty: number; unit_price_fils: bigint }[] },
  quantity: number,
): QuantityCheck {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY)
    return { ok: false, code: 'INVALID' };
  if (priceType === 'QUOTE_ONLY' || p.tiers.length === 0) return { ok: false, code: 'QUOTE_ONLY' };
  if (quantity < p.moq) return { ok: false, code: 'MOQ_NOT_MET' };
  if ((quantity - p.moq) % p.order_increment !== 0) return { ok: false, code: 'INCREMENT' };
  const sorted = [...p.tiers].sort((a, b) => a.min_qty - b.min_qty);
  let tier = sorted[0]!;
  for (const t of sorted) if (t.min_qty <= quantity) tier = t;
  return {
    ok: true,
    unitPriceFils: tier.unit_price_fils,
    lineTotalFils: tier.unit_price_fils * BigInt(quantity),
    tierMinQty: tier.min_qty,
  };
}
