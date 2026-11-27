import { createServer, type Server } from 'node:http';
import type { AppEnv } from '@app/config';
import { createPrismaClient, pingDatabase, type PrismaClient } from '@app/db';
import { Queue, Worker, type ConnectionOptions } from 'bullmq';
import pino, { type Logger } from 'pino';

/**
 * Redis-backed background worker (docs/11-integrations.md).
 *
 * Phase 0 runs a single real job: a "system.heartbeat" repeatable job that proves
 * the enqueue -> claim -> process loop works through Redis. Business jobs
 * (outbox dispatch, reservation/RFQ expiry, reconciliation) arrive with their phases.
 */
export const SYSTEM_QUEUE = 'system';
export const HEARTBEAT_JOB = 'system.heartbeat';
const HEARTBEAT_EVERY_MS = 60_000;
const HEARTBEAT_STALE_MS = 3 * HEARTBEAT_EVERY_MS;

export interface RunningWorker {
  server: Server;
  port: number;
  lastHeartbeatAt: () => Date | null;
  stop: () => Promise<void>;
}

function redisConnection(url: string): ConnectionOptions {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: Number(u.port || 6379),
    username: u.username || undefined,
    password: u.password ? decodeURIComponent(u.password) : undefined,
    db: u.pathname.length > 1 ? Number(u.pathname.slice(1)) : 0,
    tls: u.protocol === 'rediss:' ? {} : undefined,
    maxRetriesPerRequest: null, // required by BullMQ workers
  };
}

export async function startWorker(
  env: AppEnv,
  opts: { port?: number; heartbeatEveryMs?: number; logger?: Logger } = {},
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
  const connection = redisConnection(env.REDIS_URL);
  const prisma: PrismaClient = createPrismaClient(env.DATABASE_URL);
  const queue = new Queue(SYSTEM_QUEUE, { connection });
  let lastHeartbeat: Date | null = null;
  const startedAt = Date.now();

  const worker = new Worker(
    SYSTEM_QUEUE,
    async (job) => {
      if (job.name !== HEARTBEAT_JOB) throw new Error(`No handler for job ${job.name}`);
      await pingDatabase(prisma);
      lastHeartbeat = new Date();
      return { at: lastHeartbeat.toISOString() };
    },
    { connection, concurrency: 1 },
  );
  worker.on('failed', (job, err) => log.error({ job: job?.name, err: err.message }, 'job failed'));
  worker.on('error', (err) => log.error({ err: err.message }, 'worker error'));

  const every = opts.heartbeatEveryMs ?? HEARTBEAT_EVERY_MS;
  await queue.upsertJobScheduler(
    'heartbeat',
    { every },
    {
      name: HEARTBEAT_JOB,
      opts: {
        removeOnComplete: 10,
        removeOnFail: 50,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1_000 },
      },
    },
  );

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
      const [database, redis] = await Promise.all([
        probe(() => pingDatabase(prisma)),
        probe(async () => {
          const client = await queue.client;
          if ((await client.ping()) !== 'PONG') throw new Error('bad ping');
        }),
      ]);
      const hbAge = lastHeartbeat ? Date.now() - lastHeartbeat.getTime() : Date.now() - startedAt;
      const heartbeat = {
        status:
          hbAge <= Math.max(HEARTBEAT_STALE_MS, every * 3) ? ('up' as const) : ('down' as const),
        latency_ms: 0,
      };
      const ok = database.status === 'up' && redis.status === 'up' && heartbeat.status === 'up';
      return send(ok ? 200 : 503, {
        status: ok ? 'ready' : 'not_ready',
        service: 'worker',
        checks: { database, redis, heartbeat },
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
      await new Promise<void>((r) => server.close(() => r()));
      await worker.close();
      await queue.close();
      await prisma.$disconnect();
    },
  };
}
