/**
 * Unit tests for the configurable VAT rule (founder decision F05, conflicts C-08/C-09): no assumed
 * standard VAT outside the labelled provisional mode, supplier status decides otherwise.
 */
import { describe, expect, it } from 'vitest';
import { orderTaxRule, quoteTaxRefusal, taxRuleFor, type SupplierVat } from './tax';

const provisional = { treatment: 'provisional_standard', standardBps: 500 } as const;
const status = { treatment: 'supplier_status', standardBps: 500 } as const;
const vat = (s: Partial<SupplierVat>): SupplierVat => ({
  status: 'UNKNOWN',
  confirmed: false,
  trn: null,
  ...s,
});
const registered = vat({ status: 'REGISTERED', confirmed: true, trn: '100000000000003' });
const notRegistered = vat({ status: 'NOT_REGISTERED', confirmed: true });

describe('taxRuleFor', () => {
  it('provisional mode charges the standard rate to everyone, labelled provisional', () => {
    expect(taxRuleFor(provisional, vat({}))).toEqual({
      ok: true,
      code: 'PROVISIONAL_STANDARD',
      bps: 500,
      provisional: true,
    });
  });

  it('supplier mode follows the confirmed registration', () => {
    expect(taxRuleFor(status, registered)).toEqual({
      ok: true,
      code: 'STANDARD',
      bps: 500,
      provisional: false,
    });
    expect(taxRuleFor(status, notRegistered)).toEqual({
      ok: true,
      code: 'NO_VAT_NOT_REGISTERED',
      bps: 0,
      provisional: false,
    });
  });

  it('supplier mode blocks unknown or unconfirmed status', () => {
    const blocked = { ok: false, reason: 'supplier_vat_unconfirmed' };
    expect(taxRuleFor(status, vat({}))).toEqual(blocked);
    expect(taxRuleFor(status, { ...registered, confirmed: false })).toEqual(blocked);
    expect(taxRuleFor(status, { ...notRegistered, confirmed: false })).toEqual(blocked);
    expect(taxRuleFor(status, vat({ status: 'UNKNOWN', confirmed: true }))).toEqual(blocked);
  });
});

describe('quoteTaxRefusal', () => {
  it('allows anything in provisional mode', () => {
    expect(quoteTaxRefusal(provisional, vat({}), 'STANDARD')).toBeNull();
  });
  it('refuses unconfirmed suppliers and standard VAT from unregistered ones', () => {
    expect(quoteTaxRefusal(status, vat({}), 'ZERO_RATED')).toBe('quote.supplier_vat_unconfirmed');
    expect(quoteTaxRefusal(status, notRegistered, 'STANDARD')).toBe('quote.vat_not_registered');
    expect(quoteTaxRefusal(status, notRegistered, 'EXEMPT')).toBeNull();
    expect(quoteTaxRefusal(status, registered, 'STANDARD')).toBeNull();
  });
});

describe('orderTaxRule', () => {
  it('reads the order snapshot first', () => {
    expect(
      orderTaxRule({ tax: { code: 'NO_VAT_NOT_REGISTERED', bps: 0, provisional: false } }, null),
    ).toEqual({ code: 'NO_VAT_NOT_REGISTERED', bps: 0, provisional: false });
  });
  it('labels orders from before Phase 8 as provisional', () => {
    expect(orderTaxRule({}, { code: 'STANDARD', bps: 500 })).toEqual({
      code: 'PROVISIONAL_STANDARD',
      bps: 500,
      provisional: true,
    });
    expect(orderTaxRule(null, { code: 'EXEMPT', bps: 0, source: 'quote' })).toEqual({
      code: 'EXEMPT',
      bps: 0,
      provisional: true,
    });
  });
});
