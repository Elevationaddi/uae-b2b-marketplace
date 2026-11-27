import { describe, expect, it } from 'vitest';
import { filsToDecimal, parseAedToFils, priceForQuantity, validateSkuPricing } from './money';
import { hasCapability, adminCapabilities } from './permissions';
import { marketplaceSearchQuery, catalogDecisionRequest, inventoryAdjustRequest } from './catalog';

describe('money (integer fils, no floats)', () => {
  it.each([
    ['12', 1200n],
    ['12.5', 1250n],
    ['1,250.05', 125005n],
    ['AED 3', 300n],
    ['0.01', 1n],
  ])('parses %s', (input, fils) => expect(parseAedToFils(input)).toBe(fils));
  it.each(['', '1.234', '-1', 'abc', '1e3'])('rejects %s', (input) => expect(parseAedToFils(input)).toBeNull());
  it('formats exact decimals', () => {
    expect(filsToDecimal(125005n)).toBe('1250.05');
    expect(filsToDecimal('7')).toBe('0.07');
  });
});

describe('wholesale tier validation', () => {
  const ok = { moq: 10, order_increment: 5, tiers: [{ min_qty: 10, unit_price_fils: '1250' }, { min_qty: 100, unit_price_fils: '1000' }] };
  it('accepts valid tiered pricing', () => expect(validateSkuPricing('TIERED', ok)).toEqual({}));
  it('first tier must start at the MOQ', () =>
    expect(validateSkuPricing('TIERED', { ...ok, tiers: [{ min_qty: 15, unit_price_fils: '1' }, { min_qty: 100, unit_price_fils: '1' }] })).toHaveProperty('tiers.0.min_qty'));
  it('rejects overlapping (non-ascending) tiers', () =>
    expect(validateSkuPricing('TIERED', { ...ok, tiers: [{ min_qty: 10, unit_price_fils: '5' }, { min_qty: 10, unit_price_fils: '4' }] })).toHaveProperty('tiers.1.min_qty'));
  it('rejects tier quantities off the increment grid', () =>
    expect(validateSkuPricing('TIERED', { ...ok, tiers: [{ min_qty: 10, unit_price_fils: '5' }, { min_qty: 12, unit_price_fils: '4' }] })).toHaveProperty('tiers.1.min_qty'));
  it('rejects prices that increase with quantity', () =>
    expect(validateSkuPricing('TIERED', { ...ok, tiers: [{ min_qty: 10, unit_price_fils: '5' }, { min_qty: 100, unit_price_fils: '6' }] })).toHaveProperty('tiers.1.unit_price_fils'));
  it('rejects decimal money strings', () =>
    expect(validateSkuPricing('FIXED', { moq: 1, order_increment: 1, tiers: [{ min_qty: 1, unit_price_fils: '1.5' }] })).toHaveProperty('tiers.0.unit_price_fils'));
  it('quote-only has no tiers; fixed has exactly one', () => {
    expect(validateSkuPricing('QUOTE_ONLY', { moq: 1, order_increment: 1, tiers: [] })).toEqual({});
    expect(validateSkuPricing('QUOTE_ONLY', ok)).not.toEqual({});
    expect(validateSkuPricing('FIXED', ok)).not.toEqual({});
  });
});

describe('priceForQuantity (T09/T10)', () => {
  const p = { moq: 10, order_increment: 5, tiers: [{ min_qty: 10, unit_price_fils: 1250n }, { min_qty: 100, unit_price_fils: 1000n }] };
  it('below MOQ', () => expect(priceForQuantity('TIERED', p, 5)).toEqual({ ok: false, code: 'MOQ_NOT_MET' }));
  it('off increment', () => expect(priceForQuantity('TIERED', p, 12)).toEqual({ ok: false, code: 'INCREMENT' }));
  it('first tier', () => expect(priceForQuantity('TIERED', p, 15)).toMatchObject({ ok: true, unitPriceFils: 1250n, lineTotalFils: 18750n }));
  it('higher tier boundary', () => expect(priceForQuantity('TIERED', p, 100)).toMatchObject({ ok: true, unitPriceFils: 1000n, lineTotalFils: 100000n }));
  it('quote only', () => expect(priceForQuantity('QUOTE_ONLY', { ...p, tiers: [] }, 10)).toEqual({ ok: false, code: 'QUOTE_ONLY' }));
});

describe('catalog permissions', () => {
  it('all seller roles can read the catalog; only editors can edit', () => {
    for (const role of ['OWNER', 'SALES', 'WAREHOUSE', 'FINANCE', 'VIEWER'] as const)
      expect(hasCapability('SELLER', role, true, 'seller.catalog.read')).toBe(true);
    expect(hasCapability('SELLER', 'VIEWER', true, 'seller.catalog.edit')).toBe(false);
    expect(hasCapability('SELLER', 'SALES', true, 'seller.catalog.edit')).toBe(true);
    expect(hasCapability('SELLER', 'SALES', false, 'seller.catalog.edit')).toBe(false);
    expect(hasCapability('SELLER', 'VIEWER', false, 'seller.catalog.read')).toBe(true);
  });
  it('admin catalog capabilities follow the role matrix', () => {
    expect(adminCapabilities(['SUPPORT'])).toContain('admin.catalog.read');
    expect(adminCapabilities(['SUPPORT'])).not.toContain('admin.catalog.review');
    expect(adminCapabilities(['COMPLIANCE'])).toEqual(expect.arrayContaining(['admin.catalog.review', 'admin.catalog.enforce', 'admin.restricted.manage']));
    expect(adminCapabilities(['FINANCE'])).not.toContain('admin.catalog.read');
  });
});

describe('catalog request contracts', () => {
  it('parses csv enums and booleans in search', () => {
    const q = marketplaceSearchQuery.parse({ emirate: 'DUBAI,SHARJAH', in_stock: 'true', attrs: 'material:cotton' });
    expect(q.emirate).toEqual(['DUBAI', 'SHARJAH']);
    expect(q.in_stock).toBe(true);
    expect(() => marketplaceSearchQuery.parse({ emirate: 'MARS' })).toThrow();
    expect(() => marketplaceSearchQuery.parse({ price_min: '12.5' })).toThrow();
  });
  it('rejections need a reason; stock counts need a version', () => {
    expect(catalogDecisionRequest.safeParse({ decision: 'REJECTED', expected_state: 'PENDING_REVIEW' }).success).toBe(false);
    expect(catalogDecisionRequest.safeParse({ decision: 'APPROVED', expected_state: 'PENDING_REVIEW' }).success).toBe(true);
    expect(inventoryAdjustRequest.safeParse({ kind: 'SET_ON_HAND', quantity: 5, reason: 'count' }).success).toBe(false);
    expect(inventoryAdjustRequest.safeParse({ kind: 'REMOVE', quantity: 0, reason: 'none' }).success).toBe(false);
  });
});
