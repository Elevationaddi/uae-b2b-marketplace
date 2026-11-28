/** Integration test against real PostgreSQL (docker compose service); Redis is not used. */
import { parseEnv } from '@app/config';
import pino from 'pino';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { startWorker, type RunningWorker } from '../src/worker';

describe('worker (PostgreSQL scheduler)', () => {
  let w: RunningWorker;
  beforeAll(async () => {
    const env = parseEnv({ ...process.env, NODE_ENV: 'test', LOG_LEVEL: 'silent' });
    w = await startWorker(env, {
      port: 0,
      heartbeatEveryMs: 1000,
      tickMs: 200,
      logger: pino({ level: 'silent' }),
    });
  });
  afterAll(async () => {
    await w?.stop();
  });

  it('runs the heartbeat task through the PostgreSQL scheduler', async () => {
    const deadline = Date.now() + 15_000;
    while (!w.lastHeartbeatAt() && Date.now() < deadline)
      await new Promise((r) => setTimeout(r, 200));
    expect(w.lastHeartbeatAt()).toBeInstanceOf(Date);
  });

  it('serves liveness and readiness', async () => {
    const live = await fetch(`http://127.0.0.1:${w.port}/health`);
    expect(live.status).toBe(200);
    const ready = await fetch(`http://127.0.0.1:${w.port}/health/ready`);
    const body = (await ready.json()) as {
      data: { status: string; checks: Record<string, { status: string }> };
    };
    expect(ready.status).toBe(200);
    expect(body.data.status).toBe('ready');
    expect(body.data.checks.database?.status).toBe('up');
    expect(body.data.checks.redis).toBeUndefined();
    expect(body.data.checks.heartbeat?.status).toBe('up');
  });
});
