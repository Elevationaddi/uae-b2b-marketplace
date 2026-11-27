import { describe, expect, it } from 'vitest';
import { safeNext } from './nav';

describe('safeNext', () => {
  it('allows in-app paths', () => {
    expect(safeNext('en', '/en/app/settings')).toBe('/en/app/settings');
    expect(safeNext('ar', '/ar/invitations/accept')).toBe('/ar/invitations/accept');
  });
  it('rejects external, protocol-relative, admin and malformed targets', () => {
    for (const bad of [
      'https://evil.test',
      '//evil.test',
      '/en\\evil',
      '/en/admin',
      'javascript:alert(1)',
      '',
      null,
    ]) {
      expect(safeNext('en', bad)).toBe('/en/app');
    }
  });
});
