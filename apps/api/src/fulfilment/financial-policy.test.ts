/**
 * Unit tests for the Phase 8 financial policy rules (founder decisions of 28 November 2026):
 * merchandise-only commission reversal (C-06), refund splits, settlement states (C-01, C-03),
 * the Dubai payout week (C-04) and the dispute window (C-02).
 */
import {
  allocateRefund,
  canAutoComplete,
  dubaiWeekStart,
  merchandiseCommissionShare,
  refundParts,
  settlementStateFor,
  withinDisputeWindow,
  type Order,
  type RefundParts,
} from '@app/db';
import { describe, expect, it } from 'vitest';

// AED 1,000 merchandise + AED 50 delivery + 5% VAT (AED 52.50) = AED 1,102.50; 10% commission.
const order = {
  merchandiseFils: 100_000n,
  shippingFils: 5_000n,
  taxFils: 5_250n,
  totalFils: 110_250n,
  commissionFils: 10_000n,
};
const none = { merchandiseFils: null, shippingFils: null, taxFils: null };
const refund = (amount: bigint, p?: RefundParts) =>
  p
    ? {
        amountFils: amount,
        merchandiseFils: p.merchandise,
        shippingFils: p.shipping,
        taxFils: p.tax,
      }
    : { amountFils: amount, ...none };

describe('merchandise-only commission reversal (C-06)', () => {
  it('reverses nothing when only delivery and its VAT are refunded', () => {
    const parts = allocateRefund(order, [], 5_250n, {
      merchandise: 0n,
      shipping: 5_000n,
      tax: 250n,
    });
    expect(parts).toEqual({ merchandise: 0n, shipping: 5_000n, tax: 250n });
    expect(merchandiseCommissionShare(order, 0n, 0n, 0n)).toBe(0n);
  });

  it('reverses commission in proportion to the merchandise refunded', () => {
    expect(merchandiseCommissionShare(order, 0n, 25_000n, 0n)).toBe(2_500n);
    expect(merchandiseCommissionShare(order, 0n, 333n, 0n)).toBe(33n); // 33.3 → 33 (half-up)
    expect(merchandiseCommissionShare(order, 0n, 335n, 0n)).toBe(34n); // 33.5 → 34
  });

  it('refunding all merchandise in odd parts reverses exactly the order commission', () => {
    const o = { merchandiseFils: 99_999n, commissionFils: 9_999n };
    let before = 0n;
    let reversed = 0n;
    for (const part of [33_333n, 33_333n, 33_333n]) {
      reversed += merchandiseCommissionShare(o, before, part, reversed);
      before += part;
    }
    expect(reversed).toBe(9_999n);
  });

  it('never reverses more than the commission left', () => {
    expect(merchandiseCommissionShare(order, 0n, 100_000n, 9_990n)).toBe(10n);
  });
});

describe('refund split', () => {
  it('spreads an unsplit refund pro rata over what is left of each part', () => {
    const p = allocateRefund(order, [], 11_025n) as RefundParts; // 10% of the order
    expect(p).toEqual({ merchandise: 10_000n, shipping: 500n, tax: 525n });
    expect(p.merchandise + p.shipping + p.tax).toBe(11_025n);
  });

  it('a full unsplit refund covers every part exactly', () => {
    expect(allocateRefund(order, [], 110_250n)).toEqual({
      merchandise: 100_000n,
      shipping: 5_000n,
      tax: 5_250n,
    });
  });

  it('after a delivery-only refund, the rest is merchandise and its VAT', () => {
    const first = { merchandise: 0n, shipping: 5_000n, tax: 250n };
    const p = allocateRefund(order, [refund(5_250n, first)], 105_000n);
    expect(p).toEqual({ merchandise: 100_000n, shipping: 0n, tax: 5_000n });
  });

  it('refuses a split above a part or that does not add up', () => {
    expect(allocateRefund(order, [], 6_000n, { merchandise: 0n, shipping: 6_000n, tax: 0n })).toBe(
      'refund.exceeds_component',
    );
    expect(allocateRefund(order, [], 1_000n, { merchandise: 500n, shipping: 0n, tax: 0n })).toBe(
      'refund.exceeds_component',
    );
    expect(allocateRefund(order, [], 110_251n)).toBe('refund.exceeds_remaining');
  });

  it('reads refunds made before Phase 8 as pro rata of the total', () => {
    expect(refundParts(order, refund(11_025n))).toEqual({
      merchandise: 10_000n,
      shipping: 500n,
      tax: 525n,
    });
  });

  it('rounding never leaves a negative or oversized part', () => {
    for (const amount of [1n, 2n, 3n, 7n, 99n, 101n, 55_555n, 110_249n]) {
      const p = allocateRefund(order, [refund(1n)], amount) as RefundParts;
      expect(p.merchandise + p.shipping + p.tax).toBe(amount);
      for (const v of Object.values(p)) expect(v >= 0n).toBe(true);
    }
  });
});

describe('settlement state (C-01, C-03)', () => {
  it('is ELIGIBLE only with no blocker', () => {
    expect(settlementStateFor([])).toBe('ELIGIBLE');
    expect(settlementStateFor(['dispute_window_open'])).toBe('NOT_ELIGIBLE');
    expect(settlementStateFor(['delivery_not_verified'])).toBe('NOT_ELIGIBLE');
    expect(settlementStateFor(['dispute_window_open', 'hold_active'])).toBe('HELD');
    expect(settlementStateFor(['reconciliation_open'])).toBe('HELD');
    expect(settlementStateFor(['refund_pending'])).toBe('HELD');
    expect(settlementStateFor(['nothing_payable', 'hold_active'])).toBe('NOT_ELIGIBLE');
  });

  it('auto-completes a delivered order only after the window, with no holding blocker', () => {
    const delivered = { state: 'DELIVERED' } as Order;
    expect(canAutoComplete(delivered, [])).toBe(true);
    expect(canAutoComplete(delivered, ['nothing_payable'])).toBe(true);
    expect(canAutoComplete(delivered, ['dispute_window_open'])).toBe(false);
    expect(canAutoComplete(delivered, ['delivery_not_verified'])).toBe(false);
    expect(canAutoComplete(delivered, ['hold_active'])).toBe(false);
    expect(canAutoComplete(delivered, ['refund_pending'])).toBe(false);
    expect(canAutoComplete({ state: 'COMPLETED' } as Order, [])).toBe(false);
  });
});

describe('dispute window (C-02) and payout week (C-04)', () => {
  it('has no deadline before verified delivery and closes after its end', () => {
    expect(withinDisputeWindow({ disputeWindowEndsAt: null })).toBe(true);
    const end = new Date('2026-12-15T10:00:00Z');
    expect(
      withinDisputeWindow({ disputeWindowEndsAt: end }, new Date('2026-12-15T10:00:00Z')),
    ).toBe(true);
    expect(
      withinDisputeWindow({ disputeWindowEndsAt: end }, new Date('2026-12-15T10:00:01Z')),
    ).toBe(false);
  });

  it('starts the payout week on Monday in Dubai time', () => {
    // Sunday 2026-11-29 21:00 UTC is Monday 01:00 in Dubai.
    expect(dubaiWeekStart(new Date('2026-11-29T21:00:00Z')).toISOString()).toBe(
      '2026-11-30T00:00:00.000Z',
    );
    // Sunday 2026-11-29 19:59 UTC is still Sunday 23:59 in Dubai.
    expect(dubaiWeekStart(new Date('2026-11-29T19:59:00Z')).toISOString()).toBe(
      '2026-11-23T00:00:00.000Z',
    );
    expect(dubaiWeekStart(new Date('2026-11-23T00:00:00Z')).toISOString()).toBe(
      '2026-11-23T00:00:00.000Z',
    );
  });
});
