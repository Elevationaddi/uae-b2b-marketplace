/**
 * Unit tests for the weekly payout schedule (founder decision of 28 November 2026, Q9): Monday
 * 10:00 Asia/Dubai by default, configurable, moved past the UAE weekend and recorded holidays.
 */
import { dubaiWeekStart, isUaeWeekend, scheduledRunAt } from '@app/db';
import { describe, expect, it } from 'vitest';

const monday = dubaiWeekStart(new Date('2026-12-02T12:00:00Z')); // Wednesday → Monday 30 Nov
const cfg = { weekday: 1, time: '10:00' };

describe('weekly payout schedule (Q9)', () => {
  it('defaults to Monday 10:00 Dubai, which is 06:00 UTC', () => {
    expect(monday.toISOString()).toBe('2026-11-30T00:00:00.000Z');
    expect(scheduledRunAt(monday, cfg, new Set()).toISOString()).toBe('2026-11-30T06:00:00.000Z');
  });

  it('moves a Monday holiday to the next working day, and past consecutive holidays', () => {
    expect(scheduledRunAt(monday, cfg, new Set(['2026-11-30'])).toISOString()).toBe(
      '2026-12-01T06:00:00.000Z',
    );
    // UAE National Day style run of holidays: Monday to Wednesday.
    const h = new Set(['2026-11-30', '2026-12-01', '2026-12-02']);
    expect(scheduledRunAt(monday, cfg, h).toISOString()).toBe('2026-12-03T06:00:00.000Z');
  });

  it('skips the Saturday/Sunday weekend when holidays push past Friday', () => {
    const h = new Set(['2026-11-30', '2026-12-01', '2026-12-02', '2026-12-03', '2026-12-04']);
    // Saturday 5 and Sunday 6 December are the weekend: the next working day is Monday 7.
    expect(scheduledRunAt(monday, cfg, h).toISOString()).toBe('2026-12-07T06:00:00.000Z');
    expect(isUaeWeekend(new Date('2026-12-05T00:00:00Z'))).toBe(true);
    expect(isUaeWeekend(new Date('2026-12-04T00:00:00Z'))).toBe(false);
  });

  it('honours a configured weekday and time', () => {
    expect(scheduledRunAt(monday, { weekday: 3, time: '08:30' }, new Set()).toISOString()).toBe(
      '2026-12-02T04:30:00.000Z',
    );
  });
});
