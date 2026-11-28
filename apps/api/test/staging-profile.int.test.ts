/**
 * Phase 8 staging profile (C-20) and serverless readiness: PostgreSQL rate limits when no Redis
 * is configured, the staging registration allowlist and the staging mail catcher.
 */
import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { PrismaClient } from '@app/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AuthService } from '../src/auth/auth.service';
import { ApiError } from '../src/common/api-error';
import { Client, loggedInAdmin, makeApp, uniqueEmail } from './helpers';

describe('without Redis (PostgreSQL rate limits)', () => {
  let app: INestApplication;
  let env: AppEnv;
  let prisma: PrismaClient;

  beforeAll(async () => {
    ({ app, env, prisma } = await makeApp({ RATE_LIMIT_SCALE: '1', REDIS_URL: '' }));
    // Counters persist in PostgreSQL between runs; start the login policies from zero.
    await prisma.rateLimitBucket.deleteMany({ where: { key: { startsWith: 'rl:login_' } } });
  }, 60_000);
  afterAll(async () => {
    await app?.close();
    await prisma?.$disconnect();
  });

  it('starts, reports ready and locks out repeated logins with 429', async () => {
    expect(env.REDIS_URL).toBeUndefined();
    const c = await new Client(app, env.WEB_ORIGIN).init();
    const ready = await c.get('/health/ready').expect(200);
    expect(ready.body.data.checks.redis.status).toBe('up');
    const email = uniqueEmail('pgrl');
    const statuses: number[] = [];
    for (let i = 0; i < 12; i++)
      statuses.push(
        (await c.post('/auth/login', { email, password: `Wrong-Password-${i}` })).status,
      );
    expect(statuses.slice(0, 10).every((s) => s === 401)).toBe(true);
    expect(statuses.slice(10)).toEqual([429, 429]);
    const last = await c.post('/auth/login', { email, password: 'Wrong-Password-x' });
    expect(Number(last.body.error.field_errors.retry_after)).toBeGreaterThan(0);
    const row = await prisma.rateLimitBucket.findUniqueOrThrow({
      where: { key: `rl:login_account:${email}` },
    });
    expect(row.points).toBe(13);
  });

  it('blocks TOTP replay with the PostgreSQL store', async () => {
    const admin = await loggedInAdmin(app, env, prisma, ['SUPPORT']);
    expect(admin.client).toBeDefined();
    const key = `totp-used:test:${Date.now()}`;
    const { KvStore } = await import('../src/common/kv-store');
    const kv = app.get(KvStore);
    expect(kv.kind).toBe('postgres');
    expect(await kv.setOnce(key, 120)).toBe(true);
    expect(await kv.setOnce(key, 120)).toBe(false);
  });
});

describe('staging profile (C-20)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    ({ app, prisma } = await makeApp({
      APP_ENV: 'staging',
      NODE_ENV: 'production',
      SESSION_SECRET: 'q8V1r3mZ0pL9sT4uW7yB2nC5xD6eF0gH',
      MFA_ENCRYPTION_KEY: 'k3Jq9vR2xT8mB1nC4zW7yL0pD5sF6gH9aE2rT4uI7oQ=',
      WEB_ORIGIN: 'https://staging.app.invalid',
      ADMIN_ORIGIN: 'https://admin.staging.app.invalid',
      API_ORIGIN: 'https://api.staging.app.invalid',
      STORAGE_ACCESS_KEY: 'stagingaccesskey',
      STORAGE_SECRET_KEY: 'stagingsecretkey1',
      EMAIL_PROVIDER: 'catcher',
      CRON_SECRET: 'Q7v2LmX9pR4sT1uW6yZ3aB8dE5fG0hJcK4nP',
      STAGING_ACCESS_PASSWORD: 'Fictional-Staging-Pass-91',
      STAGING_ALLOWED_EMAIL_DOMAINS: 'example.test',
    }));
  }, 60_000);
  afterAll(async () => {
    await app?.close();
    await prisma?.$disconnect();
  });

  it('accepts registrations only from the fictional domains', async () => {
    const auth = app.get(AuthService);
    const meta = { requestId: 'test', ip: '203.0.113.9', userAgent: null };
    const real = auth.register(
      {
        email: 'buyer@real-company.ae',
        password: 'Correct-Horse-9',
        full_name: 'Real',
        locale: 'en',
      },
      meta,
    );
    await expect(real).rejects.toBeInstanceOf(ApiError);
    await expect(real).rejects.toMatchObject({ messageKey: 'auth.staging_domain' });
    const email = uniqueEmail('staging');
    await auth.register(
      { email, password: 'Correct-Horse-9', full_name: 'Fictional Buyer', locale: 'en' },
      meta,
    );
    expect(await prisma.user.count({ where: { email } })).toBe(1);
  });
});
