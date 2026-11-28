import { createServer, type Server } from 'node:http';
import type { AppEnv } from '@app/config';
import {
  createPrismaClient,
  pingDatabase,
  registerTasks,
  runDueTasks,
  runnerId,
  type PrismaClient,
} from '@app/db';
import pino, { type Logger } from 'pino';
import { buildTasks, TASK } from './tasks';

/**
 * Long-running background worker (docs/11-integrations.md). It drives the PostgreSQL scheduler
 * (`@app/db` background-tasks): every tick it runs whichever tasks are due, each under a lease, so
 * several workers (or a worker plus a scheduled function) never run the same task at once and a
 * killed run is retried. Redis is not needed. The task list is in ./tasks.ts.
 */
const HEARTBEAT_EVERY_MS = 60_000;
const HEARTBEAT_STALE_MS = 3 * HEARTBEAT_EVERY_MS;
const TICK_MS = 1_000;

export interface RunningWorker {
  server: Server;
  port: number;
  lastHeartbeatAt: () => Date | null;
  stop: () => Promise<void>;
}

export async function startWorker(
  env: AppEnv,
  opts: { port?: number; heartbeatEveryMs?: number; tickMs?: number; logger?: Logger } = {},
): Promise<RunningWorker> {
  const log =
    opts.logger ??
    pino({
      level: env.LOG_LEVEL,
      base: { service: 'worker' },
      transport:
        env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { singleLine: true } }
          : undefined,
    });
  const prisma: PrismaClient = createPrismaClient(env.DATABASE_URL);
  let lastHeartbeat: Date | null = null;
  const startedAt = Date.now();
  const every = opts.heartbeatEveryMs ?? HEARTBEAT_EVERY_MS;
  const tasks = buildTasks(env, prisma, log, {
    heartbeatEverySeconds: Math.max(1, Math.round(every / 1000)),
    onHeartbeat: (at) => {
      lastHeartbeat = at;
    },
  });
  await registerTasks(prisma, tasks);
  if (!tasks.some((t) => t.name === TASK.sandboxWebhooks))
    await prisma.backgroundTask.deleteMany({ where: { name: TASK.sandboxWebhooks } });
  const owner = runnerId('worker');

  // Tick loop: one pass at a time; a slow pass delays the next tick instead of overlapping it.
  let stopping = false;
  let current: Promise<unknown> = Promise.resolve();
  let timer: NodeJS.Timeout | null = null;
  const tick = () => {
    if (stopping) return;
    current = runDueTasks(prisma, tasks, {
      owner,
      onError: (name, err) =>
        log.error(
          { task: name, err: err instanceof Error ? err.message : String(err) },
          'task failed',
        ),
    })
      .catch((err: unknown) =>
        log.error(
          { err: err instanceof Error ? err.message : String(err) },
          'scheduler pass failed',
        ),
      )
      .finally(() => {
        if (!stopping) timer = setTimeout(tick, opts.tickMs ?? TICK_MS);
      });
  };
  tick();

  const server = createServer(async (req, res) => {
    const path = (req.url ?? '/').split('?')[0];
    const send = (status: number, data: unknown) => {
      res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      res.end(JSON.stringify({ data, meta: { next_cursor: null } }));
    };
    if (req.method !== 'GET') return send(405, { status: 'method_not_allowed' });
    if (path === '/health') {
      return send(200, {
        status: 'ok',
        service: 'worker',
        version: '0.0.0',
        time: new Date().toISOString(),
      });
    }
    if (path === '/health/ready') {
      const probe = async (fn: () => Promise<unknown>) => {
        const t = Date.now();
        try {
          await fn();
          return { status: 'up' as const, latency_ms: Date.now() - t };
        } catch {
          return { status: 'down' as const, latency_ms: Date.now() - t };
        }
      };
      const database = await probe(() => pingDatabase(prisma));
      const hbAge = lastHeartbeat ? Date.now() - lastHeartbeat.getTime() : Date.now() - startedAt;
      const heartbeat = {
        status:
          hbAge <= Math.max(HEARTBEAT_STALE_MS, every * 3) ? ('up' as const) : ('down' as const),
        latency_ms: 0,
      };
      const ok = database.status === 'up' && heartbeat.status === 'up';
      return send(ok ? 200 : 503, {
        status: ok ? 'ready' : 'not_ready',
        service: 'worker',
        checks: { database, heartbeat },
        last_heartbeat_at: lastHeartbeat?.toISOString() ?? null,
        sandbox: env.sandbox,
        trading_enabled: env.TRADING_ENABLED,
        time: new Date().toISOString(),
      });
    }
    return send(404, { status: 'not_found' });
  });
  const port = await new Promise<number>((resolvePort) => {
    server.listen(opts.port ?? env.WORKER_HEALTH_PORT, () => {
      const addr = server.address();
      resolvePort(typeof addr === 'object' && addr ? addr.port : 0);
    });
  });
  log.info({ port }, 'worker started');

  return {
    server,
    port,
    lastHeartbeatAt: () => lastHeartbeat,
    stop: async () => {
      stopping = true;
      if (timer) clearTimeout(timer);
      await new Promise<void>((r) => server.close(() => r()));
      await current; // let the running pass finish its task (its lease would expire otherwise)
      await prisma.$disconnect();
    },
  };
}
