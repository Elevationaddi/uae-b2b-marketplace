import { describe, expect, it } from 'vitest';
import { buildCsp, createNonce } from './csp';

describe('CSP (SR-2)', () => {
  it('uses a fresh nonce per response and no inline-script allowance', () => {
    const a = createNonce();
    const b = createNonce();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    const csp = buildCsp(a, false);
    const script = csp.split('; ').find((d) => d.startsWith('script-src'))!;
    expect(script).toBe(`script-src 'self' 'nonce-${a}' 'strict-dynamic'`);
    expect(script).not.toContain('unsafe-inline');
    expect(script).not.toContain('unsafe-eval');
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });

  it('allows eval and websockets only in development (hot reload)', () => {
    const csp = buildCsp('n', true);
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toContain("connect-src 'self' ws:");
  });
});
