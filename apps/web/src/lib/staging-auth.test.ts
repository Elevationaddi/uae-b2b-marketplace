import { describe, expect, it } from 'vitest';
import { stagingAuthorized, stagingExempt, stagingProtected } from './staging-auth';

const basic = (v: string) => `Basic ${Buffer.from(v).toString('base64')}`;

describe('staging protection (C-20)', () => {
  it('applies only to APP_ENV=staging', () => {
    expect(stagingProtected({ APP_ENV: 'staging' })).toBe(true);
    expect(stagingProtected({ APP_ENV: 'production' })).toBe(false);
    expect(stagingProtected({})).toBe(false);
  });

  it('accepts only the configured credentials and fails closed without a password', () => {
    const pass = 'Fictional-Staging-Pass-91';
    expect(stagingAuthorized(basic(`staging:${pass}`), 'staging', pass)).toBe(true);
    expect(stagingAuthorized(basic(`staging:wrong`), 'staging', pass)).toBe(false);
    expect(stagingAuthorized(basic(`other:${pass}`), 'staging', pass)).toBe(false);
    expect(stagingAuthorized(null, 'staging', pass)).toBe(false);
    expect(stagingAuthorized('Bearer x', 'staging', pass)).toBe(false);
    expect(stagingAuthorized(basic('staging:'), 'staging', undefined)).toBe(false);
  });

  it('leaves API routes to the API', () => {
    expect(stagingExempt('/api/v1/payments/webhook')).toBe(true);
    expect(stagingExempt('/en/login')).toBe(false);
  });
});
