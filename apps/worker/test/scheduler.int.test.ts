/**
 * PostgreSQL scheduler (Phase 8, replaces BullMQ for Vercel): leases, crash recovery, backoff and
 * the cron endpoint's authentication. Runs against the docker compose PostgreSQL.
 */
import { createServer } from 'node:http';
import { parseEnv } from '@app/config';
import {
  claimTask,
  createPrismaClient,
  finishTask,
  registerTasks,
  runDueTasks,
  taskHealth,
  type PrismaClient,
  type TaskDef,
} from '@app/db';
import pino from 'pino';
import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cronAuthorized, cronHandler } from '../src/cron';

const env = parseEnv({ ...process.env, NODE_ENV: 'test', LOG_LEVEL: 'silent' });
let prisma: PrismaClient;
const name = () => `test.${randomBytes(4).toString('hex')}`;

beforeAll(() => {
  prisma = createPrismaClient(env.DATABASE_URL);
});
afterAll(async () => {
  await prisma.backgroundTask.deleteMany({ where: { name: { startsWith: 'test.' } } });
  await prisma.$disconnect();
});

describe('background task leases', () => {
  it('lets only one runner claim a due task', async () => {
    const n = name();
    await registerTasks(prisma, [{ name: n, everySeconds: 60, run: async () => null }]);
    const claims = await Promise.all(
      ['a', 'b', 'c', 'd'].map((owner) => claimTask(prisma, n, owner, 60)),
    );
    expect(claims.filter(Boolean)).toHaveLength(1);
  });

  it('re-runs a task whose runner died (expired lease) and ignores the dead runner', async () => {
    const n = name();
    await registerTasks(prisma, [{ name: n, everySeconds: 60, run: async () => null }]);
    expect(await claimTask(prisma, n, 'dead-runner', 60)).toBe(true);
    // Not due again while the lease is live.
    expect(await claimTask(prisma, n, 'other', 60)).toBe(false);
    // Simulate the lease running out (function killed mid-run).
    await prisma.$executeRaw`UPDATE background_tasks SET lease_expires_at = now() - interval '1 second' WHERE name = ${n}`;
    let ran = 0;
    const task: TaskDef = { name: n, everySeconds: 60, run: async () => ++ran };
    const out = await runDueTasks(prisma, [task], { owner: 'new-runner' });
    expect(out).toMatchObject([{ name: n, status: 'succeeded' }]);
    expect(ran).toBe(1);
    // The dead runner's late finish changes nothing.
    await finishTask(prisma, n, 'dead-runner', { ok: false, error: 'late' });
    const row = await prisma.backgroundTask.findUniqueOrThrow({ where: { name: n } });
    expect(row.lastStatus).toBe('succeeded');
    expect(row.runCount).toBe(1);
    expect(row.nextRunAt.getTime()).toBeGreaterThan(Date.now() + 50_000);
  });

  it('records failures and backs off exponentially', async () => {
    const n = name();
    const task: TaskDef = {
      name: n,
      everySeconds: 10,
      run: async () => {
        throw new Error('provider unavailable');
      },
    };
    await registerTasks(prisma, [task]);
    for (let i = 0; i < 3; i++) {
      await prisma.backgroundTask.update({ where: { name: n }, data: { nextRunAt: new Date(0) } });
      const before = Date.now();
      const [o] = await runDueTasks(prisma, [task], { owner: 'r' });
      expect(o).toMatchObject({ status: 'failed', error: 'provider unavailable' });
      const row = await prisma.backgroundTask.findUniqueOrThrow({ where: { name: n } });
      expect(row.consecutiveFailures).toBe(i + 1);
      const delay = (row.nextRunAt.getTime() - before) / 1000;
      // 10 s, then 20 s, then 40 s.
      expect(delay).toBeGreaterThan(10 * 2 ** i - 2);
      expect(delay).toBeLessThan(10 * 2 ** i + 5);
    }
    const health = (await taskHealth(prisma)).find((h) => h.name === n)!;
    expect(health).toMatchObject({ last_status: 'failed', consecutive_failures: 3 });
  });

  it('stops at the deadline and leaves the rest due', async () => {
    const a = name();
    const b = name();
    const tasks: TaskDef[] = [
      { name: a, everySeconds: 60, run: () => new Promise((r) => setTimeout(r, 300)) },
      { name: b, everySeconds: 60, run: async () => null },
    ];
    await registerTasks(prisma, tasks);
    const out = await runDueTasks(prisma, tasks, { owner: 'r', deadline: Date.now() + 100 });
    expect(out.map((o) => o.name)).toEqual([a]);
    const rowB = await prisma.backgroundTask.findUniqueOrThrow({ where: { name: b } });
    expect(rowB.runCount).toBe(0);
  });
});

describe('cron endpoint authentication', () => {
  const secret = randomBytes(24).toString('hex');
  const withSecret = parseEnv({ ...process.env, NODE_ENV: 'test', CRON_SECRET: secret });

  it('compares the bearer secret and refuses when none is configured', () => {
    expect(cronAuthorized(withSecret, `Bearer ${secret}`)).toBe(true);
    expect(cronAuthorized(withSecret, `Bearer ${secret}x`)).toBe(false);
    expect(cronAuthorized(withSecret, undefined)).toBe(false);
    expect(cronAuthorized(env, 'Bearer anything')).toBe(false);
  });

  it('rejects wrong methods and secrets without running tasks', async () => {
    const server = createServer(
      cronHandler(withSecret, prisma, pino({ level: 'silent' }), { budgetMs: 1 }),
    );
    await new Promise<void>((r) => server.listen(0, r));
    const port = (server.address() as { port: number }).port;
    const url = `http://127.0.0.1:${port}/api/cron`;
    try {
      expect((await fetch(url, { method: 'POST' })).status).toBe(405);
      expect((await fetch(url)).status).toBe(401);
      expect((await fetch(url, { headers: { authorization: 'Bearer wrong' } })).status).toBe(401);
      const ok = await fetch(url, { headers: { authorization: `Bearer ${secret}` } });
      expect(ok.status).toBe(200);
      expect(((await ok.json()) as { data: { status: string } }).data.status).toBe('ok');
    } finally {
      await new Promise<void>((r) => server.close(() => r()));
    }
  });
});
