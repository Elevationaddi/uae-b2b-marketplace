import { describe, expect, it } from 'vitest';
import { EnvValidationError, describeEnv, parseEnv } from './env';

const dev = {
  NODE_ENV: 'development',
  DATABASE_URL: 'postgresql://app:app@localhost:5432/marketplace',
  REDIS_URL: 'redis://localhost:6379',
  SESSION_SECRET: 'dev-only-session-secret-change-me',
  MFA_ENCRYPTION_KEY: 'ZGV2LW9ubHktbWZhLWtleS0zMi1ieXRlcy1sb25nISE=',
  WEB_ORIGIN: 'http://localhost:3000',
  ADMIN_ORIGIN: 'http://admin.localhost:3000',
  SMTP_URL: 'smtp://localhost:1025',
  FILE_SCANNER: 'sandbox-eicar',
  API_ORIGIN: 'http://localhost:4000',
  PAYMENT_MODE: 'mock',
  EMAIL_PROVIDER: 'smtp-dev',
};

const prod = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://svc:Zx81kq@db.internal:5432/marketplace',
  REDIS_URL: 'rediss://cache.internal:6380',
  SESSION_SECRET: 'q8V1r3mZ0pL9sT4uW7yB2nC5xD6eF0gH',
  MFA_ENCRYPTION_KEY: 'k3Jq9vR2xT8mB1nC4zW7yL0pD5sF6gH9aE2rT4uI7oQ=',
  WEB_ORIGIN: 'https://app.invalid',
  ADMIN_ORIGIN: 'https://admin.app.invalid',
  API_ORIGIN: 'https://api.app.invalid',
  STORAGE_ENDPOINT: 'https://s3.invalid',
  STORAGE_BUCKET: 'private-bucket',
  STORAGE_ACCESS_KEY: 'AKIAREALISTIC',
  STORAGE_SECRET_KEY: 'k2J9s8D7f6G5h4J3',
  PAYMENT_MODE: 'disabled',
  EMAIL_PROVIDER: 'live',
  EMAIL_API_KEY: 'live-email-api-key-123',
  EMAIL_FROM: 'no-reply@app.invalid',
  FILE_SCANNER: 'live',
  TAX_STANDARD_BPS: '500',
};

function issuesOf(source: Record<string, string>): string[] {
  try {
    parseEnv(source);
    return [];
  } catch (e) {
    if (e instanceof EnvValidationError) return e.issues;
    throw e;
  }
}

describe('parseEnv (development)', () => {
  it('accepts labelled sandbox adapters and flags sandbox mode', () => {
    const env = parseEnv(dev);
    expect(env.sandbox).toBe(true);
    expect(env.isProduction).toBe(false);
    expect(env.TRADING_ENABLED).toBe(false);
    expect(env.FEATURE_REAL_PAYMENTS).toBe(false);
  });

  it('defaults payments and email to disabled rather than mock', () => {
    const { PAYMENT_MODE: _p, EMAIL_PROVIDER: _e, FILE_SCANNER: _f, ...rest } = dev;
    const env = parseEnv(rest);
    expect(env.PAYMENT_MODE).toBe('disabled');
    expect(env.EMAIL_PROVIDER).toBe('disabled');
    expect(env.sandbox).toBe(false);
  });

  it('rejects missing required variables with a list of issues', () => {
    const issues = issuesOf({ NODE_ENV: 'development' });
    expect(issues.some((i) => i.startsWith('DATABASE_URL'))).toBe(true);
    expect(issues.some((i) => i.startsWith('REDIS_URL'))).toBe(true);
    expect(issues.some((i) => i.startsWith('SESSION_SECRET'))).toBe(true);
  });

  it('rejects non-postgres database URLs', () => {
    expect(issuesOf({ ...dev, DATABASE_URL: 'mysql://x@localhost/db' })[0]).toMatch(/DATABASE_URL/);
  });

  it('refuses live payments outside production', () => {
    expect(issuesOf({ ...dev, PAYMENT_MODE: 'live' }).join()).toMatch(
      /only permitted with NODE_ENV=production/,
    );
    expect(issuesOf({ ...dev, FEATURE_REAL_PAYMENTS: 'true' }).join()).toMatch(
      /outside production/,
    );
  });
});

describe('parseEnv (production fails closed)', () => {
  it('accepts a fully configured production environment with trading disabled', () => {
    const env = parseEnv(prod);
    expect(env.isProduction).toBe(true);
    expect(env.sandbox).toBe(false);
  });

  it('refuses mock payment mode', () => {
    expect(issuesOf({ ...prod, PAYMENT_MODE: 'mock' }).join()).toMatch(/PAYMENT_MODE=mock/);
  });

  it('refuses the local mail catcher', () => {
    expect(issuesOf({ ...prod, EMAIL_PROVIDER: 'smtp-dev' }).join()).toMatch(/smtp-dev/);
  });

  it('refuses weak or placeholder session secrets', () => {
    expect(issuesOf({ ...prod, SESSION_SECRET: 'short-but-16chars' }).join()).toMatch(
      /SESSION_SECRET/,
    );
    expect(
      issuesOf({ ...prod, SESSION_SECRET: 'change-me-change-me-change-me-change-me' }).join(),
    ).toMatch(/SESSION_SECRET/);
  });

  it('refuses live payments without provider keys and the explicit approval flag', () => {
    const issues = issuesOf({ ...prod, PAYMENT_MODE: 'live' }).join('\n');
    expect(issues).toMatch(/PSP_API_KEY/);
    expect(issues).toMatch(/PSP_WEBHOOK_SECRET/);
    expect(issues).toMatch(/FEATURE_REAL_PAYMENTS=true/);
  });

  it('refuses enabling trading without a live payment provider', () => {
    expect(issuesOf({ ...prod, TRADING_ENABLED: 'true' }).join()).toMatch(/TRADING_ENABLED/);
  });

  it('requires storage configuration and https origins', () => {
    const { STORAGE_BUCKET: _b, ...noBucket } = prod;
    expect(issuesOf(noBucket).join()).toMatch(/STORAGE_BUCKET/);
    expect(issuesOf({ ...prod, WEB_ORIGIN: 'http://app.invalid' }).join()).toMatch(/WEB_ORIGIN/);
  });
});

describe('approved decisions in configuration', () => {
  it('defaults the quote payment window to 72 hours and allows configuring it (A05)', () => {
    expect(parseEnv(dev).QUOTE_PAYMENT_WINDOW_HOURS).toBe(72);
    expect(parseEnv({ ...dev, QUOTE_PAYMENT_WINDOW_HOURS: '48' }).QUOTE_PAYMENT_WINDOW_HOURS).toBe(
      48,
    );
    expect(issuesOf({ ...dev, QUOTE_PAYMENT_WINDOW_HOURS: '0' }).join()).toMatch(
      /QUOTE_PAYMENT_WINDOW_HOURS/,
    );
  });

  it('uses a configurable working name (A06)', () => {
    expect(parseEnv(dev).APP_NAME).toMatch(/working name/);
    expect(parseEnv({ ...dev, APP_NAME: 'Test Name' }).APP_NAME).toBe('Test Name');
  });

  it('requires a 32-byte MFA encryption key', () => {
    expect(issuesOf({ ...dev, MFA_ENCRYPTION_KEY: 'c2hvcnQ=' }).join()).toMatch(
      /MFA_ENCRYPTION_KEY/,
    );
  });

  it('requires a separate admin host, live email and live file scanning in production (A03, A07)', () => {
    expect(issuesOf({ ...prod, ADMIN_ORIGIN: 'https://app.invalid' }).join()).toMatch(
      /ADMIN_ORIGIN/,
    );
    expect(issuesOf({ ...prod, EMAIL_PROVIDER: 'disabled' }).join()).toMatch(/EMAIL_PROVIDER=live/);
    expect(issuesOf({ ...prod, FILE_SCANNER: 'sandbox-eicar' }).join()).toMatch(
      /FILE_SCANNER=live/,
    );
    expect(issuesOf({ ...prod, MFA_ENCRYPTION_KEY: dev.MFA_ENCRYPTION_KEY }).join()).toMatch(
      /MFA_ENCRYPTION_KEY/,
    );
  });
});

describe('describeEnv', () => {
  it('redacts credentials from connection URLs', () => {
    const out = describeEnv(parseEnv(dev));
    expect(String(out.DATABASE_URL)).not.toContain('app:app');
    expect(JSON.stringify(out)).not.toContain(dev.SESSION_SECRET);
  });
});

describe('retention (A13, provisional)', () => {
  it('defaults to report-only with 90/90/180 days', () => {
    const e = parseEnv(dev);
    expect(e.RETENTION_REJECTED_DOCS_DAYS).toBe(90);
    expect(e.RETENTION_ABANDONED_APPLICATION_DAYS).toBe(90);
    expect(e.RETENTION_CLOSED_COMPANY_DAYS).toBe(180);
    expect(e.RETENTION_DELETION_ENABLED).toBe(false);
  });
  it('refuses to enable irreversible deletion until legally approved', () => {
    expect(() => parseEnv({ ...dev, RETENTION_DELETION_ENABLED: 'true' })).toThrow(
      EnvValidationError,
    );
  });
});

describe('quote tax configuration (D06)', () => {
  it('is optional outside production and required in production', () => {
    expect(parseEnv(dev).TAX_STANDARD_BPS).toBeUndefined();
    const { TAX_STANDARD_BPS: _omit, ...noTax } = prod;
    expect(issuesOf(noTax).join()).toMatch(/TAX_STANDARD_BPS/);
    expect(issuesOf({ ...dev, TAX_STANDARD_BPS: '10001' }).join()).toMatch(/TAX_STANDARD_BPS/);
  });
});
