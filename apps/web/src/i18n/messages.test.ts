import { describe, expect, it } from 'vitest';
import { DIRECTION, LOCALES, catalogueKeys, formatDubaiTime, isLocale } from './messages';

describe('i18n catalogue', () => {
  it('has identical keys for every locale', () => {
    const [first, ...rest] = LOCALES.map((l) => catalogueKeys(l));
    for (const keys of rest) expect(keys).toEqual(first);
  });

  it('uses RTL for Arabic only', () => {
    expect(DIRECTION.ar).toBe('rtl');
    expect(DIRECTION.en).toBe('ltr');
  });

  it('rejects unknown locales', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  it('formats UTC instants in Asia/Dubai (UTC+4)', () => {
    expect(formatDubaiTime('2026-01-01T20:30:00Z', 'en')).toMatch(/00:30|12:30/);
  });
});
