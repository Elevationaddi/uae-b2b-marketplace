import { describe, expect, it } from 'vitest';
import { EnvValidationError, describeEnv, parseEnv } from './env';

const dev = {
  NODE_ENV: 'development',
  DATABASE_URL: 'postgresql://app:app@localhost:5432/marketplace',
  REDIS_URL: 'redis://localhost:6379',
  SESSION_SECRET: 'dev-only-session-secret-change-me',
  WEB_ORIGIN: 'http://localhost:3000',
  API_ORIGIN: 'http://localhost:4000',
  PAYMENT_MODE: 'mock',
  EMAIL_PROVIDER: 'smtp-dev',
};

const prod = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://svc:Zx81kq@db.internal:5432/marketplace',
  REDIS_URL: 'rediss://cache.internal:6380',
  SESSION_SECRET: 'q8V1r3mZ0pL9sT4uW7yB2nC5xD6eF0gH',
  WEB_ORIGIN: 'https://app.invalid',
  API_ORIGIN: 'https://api.app.invalid',
  STORAGE_ENDPOINT: 'https://s3.invalid',
  STORAGE_BUCKET: 'private-bucket',
  STORAGE_ACCESS_KEY: 'AKIAREALISTIC',
  STORAGE_SECRET_KEY: 'k2J9s8D7f6G5h4J3',
  PAYMENT_MODE: 'disabled',
  EMAIL_PROVIDER: 'disabled',
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
    const { PAYMENT_MODE: _p, EMAIL_PROVIDER: _e, ...rest } = dev;
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

describe('describeEnv', () => {
  it('redacts credentials from connection URLs', () => {
    const out = describeEnv(parseEnv(dev));
    expect(String(out.DATABASE_URL)).not.toContain('app:app');
    expect(JSON.stringify(out)).not.toContain(dev.SESSION_SECRET);
  });
});
