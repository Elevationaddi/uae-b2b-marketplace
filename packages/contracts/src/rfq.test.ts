import { describe, expect, it } from 'vitest';
import { quoteAcceptRequest, quoteFields, quoteTotals, rfqCreateRequest } from './rfq';

describe('quoteTotals (docs/08-finance.md fixture)', () => {
  it('100 units x AED 10 + AED 50 shipping at the 5% fixture = AED 1,102.50', () => {
    expect(quoteTotals(100, 1000n, 5000n, 500)).toEqual({
      subtotal: 100000n,
      tax: 5250n,
      total: 110250n,
    });
  });
  it('rounds half up to the fils', () => {
    // (1 x 1 fils + 0) x 5% = 0.05 fils -> 0; 10 fils x 5% = 0.5 -> 1
    expect(quoteTotals(1, 1n, 0n, 500).tax).toBe(0n);
    expect(quoteTotals(1, 10n, 0n, 500).tax).toBe(1n);
    expect(quoteTotals(3, 333n, 0n, 0).total).toBe(999n);
  });
  it('handles large amounts without floating point', () => {
    const r = quoteTotals(10_000_000, 100_000_000_000n, 0n, 500);
    expect(r.subtotal).toBe(1_000_000_000_000_000_000n);
    expect(r.total - r.subtotal).toBe(r.tax);
  });
});

describe('RFQ and quote validation', () => {
  const rfq = {
    title: 'Corrugated boxes',
    category_id: '3f1d2c4b-1a2b-4c3d-8e9f-0a1b2c3d4e5f',
    specs: 'Double wall, 40x30x30 cm',
    quantity: 500,
    target_date: '2027-01-31',
    emirate: 'DUBAI',
    deadline: '2027-01-10T12:00:00.000Z',
  };
  it('accepts a minimal RFQ and applies defaults', () => {
    const r = rfqCreateRequest.parse(rfq);
    expect(r.visibility).toBe('POOL');
    expect(r.unit).toBe('PIECE');
    expect(r.invitee_storefront_ids).toEqual([]);
  });
  it('rejects zero or fractional quantities and floating money', () => {
    expect(rfqCreateRequest.safeParse({ ...rfq, quantity: 0 }).success).toBe(false);
    expect(rfqCreateRequest.safeParse({ ...rfq, quantity: 1.5 }).success).toBe(false);
    expect(rfqCreateRequest.safeParse({ ...rfq, budget_fils: '10.5' }).success).toBe(false);
  });
  it('quote requires integer fils and a tax code; accept takes no totals', () => {
    const q = {
      quantity: 500,
      unit: 'CARTON',
      unit_price_fils: '250',
      tax_code: 'STANDARD',
      specs: 'As requested',
      lead_days: 10,
      delivery_date: '2027-01-30',
      valid_until: '2027-01-20T00:00:00.000Z',
    };
    expect(quoteFields.parse(q).shipping_fils).toBe('0');
    expect(quoteFields.safeParse({ ...q, unit_price_fils: 2.5 }).success).toBe(false);
    expect(quoteFields.safeParse({ ...q, tax_code: 'VAT' }).success).toBe(false);
    const a = quoteAcceptRequest.parse({
      version_id: '3f1d2c4b-1a2b-4c3d-8e9f-0a1b2c3d4e5f',
      total_fils: '1',
    } as never);
    expect('total_fils' in a).toBe(false);
  });
});
