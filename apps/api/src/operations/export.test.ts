import { describe, expect, it } from 'vitest';
import { aed, csvCell, exportAllowed, toCsv } from './export.service';
import { dubaiRange, dubaiToday, rangeDays } from './overview.service';

describe('export helpers', () => {
  it('formats fils as AED without floating point', () => {
    expect(aed(0n)).toBe('0.00');
    expect(aed(110250n)).toBe('1102.50');
    expect(aed(5n)).toBe('0.05');
    expect(aed(-150n)).toBe('-1.50');
    expect(aed(9_007_199_254_740_993n)).toBe('90071992547409.93');
  });

  it('quotes CSV cells and neutralises formulas', () => {
    expect(csvCell('plain')).toBe('plain');
    expect(csvCell('a,b')).toBe('"a,b"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell('=SUM(A1)')).toBe("'=SUM(A1)");
    expect(csvCell('+971')).toBe("'+971");
    expect(csvCell('@cmd')).toBe("'@cmd");
    expect(csvCell('-1.50')).toBe('-1.50');
    expect(csvCell('-x')).toBe("'-x");
    expect(csvCell(null)).toBe('');
    expect(csvCell(true)).toBe('true');
    expect(csvCell(new Date('2026-01-02T03:04:05Z'))).toBe('2026-01-02T03:04:05.000Z');
    const buf = toCsv(['a', 'b'], [['شركة', 1]]);
    expect(buf.toString('utf8')).toBe('\uFEFFa,b\r\nشركة,1\r\n');
  });

  it('scopes exports by admin role (T41)', () => {
    expect(exportAllowed(['FINANCE'], 'orders', 'all')).toBe(true);
    expect(exportAllowed(['FINANCE'], 'orders', 'assigned')).toBe(false);
    expect(exportAllowed(['FINANCE_APPROVER'], 'disputes', 'all')).toBe(true);
    expect(exportAllowed(['FINANCE'], 'support_tickets', 'assigned')).toBe(false);
    expect(exportAllowed(['SUPPORT'], 'orders', 'all')).toBe(false);
    expect(exportAllowed(['SUPPORT'], 'disputes', 'all')).toBe(false);
    expect(exportAllowed(['SUPPORT'], 'disputes', 'assigned')).toBe(true);
    expect(exportAllowed(['SUPPORT'], 'support_tickets', 'assigned')).toBe(true);
    expect(exportAllowed(['SUPPORT'], 'support_tickets', 'all')).toBe(false);
    expect(exportAllowed(['COMPLIANCE'], 'disputes', 'assigned')).toBe(false);
    expect(exportAllowed(['SUPER_ADMIN'], 'orders', 'all')).toBe(false);
  });

  it('maps Dubai calendar dates to UTC instants', () => {
    const r = dubaiRange('2026-03-01', '2026-03-31');
    expect(r.start.toISOString()).toBe('2026-02-28T20:00:00.000Z');
    expect(r.end.toISOString()).toBe('2026-03-31T20:00:00.000Z');
    expect(rangeDays('2026-01-01', '2026-12-31')).toBe(365);
    expect(dubaiToday(new Date('2026-05-01T21:30:00Z'))).toBe('2026-05-02');
  });
});
