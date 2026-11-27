/**
 * Integration tests against real PostgreSQL and Redis (docker compose services).
 * Requires DATABASE_URL and REDIS_URL; run `docker compose up -d` and `pnpm db:migrate` first.
 */
import type { INestApplication } from '@nestjs/common';
import { parseEnv, type AppEnv } from '@app/config';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/bootstrap';

function testEnv(overrides: Record<string, string> = {}): AppEnv {
  return parseEnv({ ...process.env, NODE_ENV: 'test', LOG_LEVEL: 'silent', ...overrides });
}

describe('API health (real PostgreSQL + Redis)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp(testEnv(), { bufferLogs: false });
  });
  afterAll(async () => {
    await app?.close();
  });

  it('GET /api/v1/health returns liveness in the success envelope', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(res.body.data).toMatchObject({ status: 'ok', service: 'api' });
    expect(res.body.meta).toEqual({ next_cursor: null });
    expect(res.headers['x-request-id']).toMatch(/^[A-Za-z0-9-]{8,64}$/);
  });

  it('GET /api/v1/health/ready reports database and redis up', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health/ready').expect(200);
    expect(res.body.data.status).toBe('ready');
    expect(res.body.data.checks.database.status).toBe('up');
    expect(res.body.data.checks.redis.status).toBe('up');
    expect(res.body.data.trading_enabled).toBe(false);
  });

  it('confirms the baseline migration has been applied', async () => {
    const { createPrismaClient } = await import('@app/db');
    const prisma = createPrismaClient(process.env.DATABASE_URL!);
    try {
      const rows = await prisma.$queryRaw<{ migration_name: string }[]>`
        SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL ORDER BY migration_name`;
      expect(rows.map((r) => r.migration_name)).toContain('20261127000000_baseline');
    } finally {
      await prisma.$disconnect();
    }
  });

  it('unknown routes return 404 in the error envelope without internals', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/does-not-exist').expect(404);
    expect(res.body.error).toMatchObject({ code: 'NOT_FOUND', message_key: 'common.not_found' });
    expect(typeof res.body.error.request_id).toBe('string');
    expect(JSON.stringify(res.body)).not.toMatch(/stack|Cannot GET/);
  });

  it('honours a well-formed inbound request id and replaces a malformed one', async () => {
    const good = await request(app.getHttpServer())
      .get('/api/v1/health')
      .set('X-Request-Id', 'abcd1234-req');
    expect(good.headers['x-request-id']).toBe('abcd1234-req');
    const bad = await request(app.getHttpServer())
      .get('/api/v1/health')
      .set('X-Request-Id', '<script>');
    expect(bad.headers['x-request-id']).not.toBe('<script>');
  });

  it('sets security headers and restricts CORS to the configured web origin', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/health')
      .set('Origin', 'https://evil.invalid');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('rejects malformed JSON with 400 in the error envelope', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/health')
      .set('Content-Type', 'application/json')
      .send('{"broken":');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_REQUEST');
  });
});

describe('API readiness when dependencies are down', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp(
      testEnv({
        DATABASE_URL: 'postgresql://nobody:nothing@127.0.0.1:1/none',
        REDIS_URL: 'redis://127.0.0.1:1',
      }),
      { bufferLogs: false },
    );
  });
  afterAll(async () => {
    await app?.close();
  });

  it('returns 503 not_ready and still serves liveness', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health/ready').expect(503);
    expect(res.body.data.status).toBe('not_ready');
    expect(res.body.data.checks.database.status).toBe('down');
    expect(res.body.data.checks.redis.status).toBe('down');
    await request(app.getHttpServer()).get('/api/v1/health').expect(200);
  });
});

describe('API readiness on a cold start', () => {
  it('reports redis up for concurrent first requests (no connect race)', async () => {
    const app = await createApp(testEnv(), { bufferLogs: false });
    try {
      const results = await Promise.all(
        [1, 2, 3].map(() => request(app.getHttpServer()).get('/api/v1/health/ready')),
      );
      for (const res of results) {
        expect(res.status).toBe(200);
        expect(res.body.data.checks.redis.status).toBe('up');
      }
    } finally {
      await app.close();
    }
  });
});
