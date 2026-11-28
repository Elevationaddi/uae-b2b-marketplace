import { createHash, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { AppEnv } from '@app/config';
import { registerTasks, runDueTasks, runnerId, type PrismaClient, type TaskOutcome } from '@app/db';
import type { Logger } from 'pino';
import { buildTasks } from './tasks';

/**
 * One scheduled-function invocation (for example Vercel Cron, at most once a minute): run due tasks
 * in passes about a second apart until the time budget is used, so two-second tasks such as the
 * email outbox and payment events still run many times per invocation. Leases make overlapping
 * invocations and the long-running worker safe together; a cut-off invocation loses nothing.
 */
export async function runCronTick(
  env: AppEnv,
  prisma: PrismaClient,
  log: Logger,
  opts: { budgetMs?: number; passEveryMs?: number } = {},
): Promise<{ passes: number; runs: number; failed: number; ms: number }> {
  const started = Date.now();
  const deadline = started + (opts.budgetMs ?? 50_000);
  const tasks = buildTasks(env, prisma, log);
  await registerTasks(prisma, tasks);
  const owner = runnerId('cron');
  let passes = 0;
  const outcomes: TaskOutcome[] = [];
  while (Date.now() < deadline) {
    passes++;
    outcomes.push(
      ...(await runDueTasks(prisma, tasks, {
        owner,
        deadline,
        onError: (name, err) =>
          log.error(
            { task: name, err: err instanceof Error ? err.message : String(err) },
            'task failed',
          ),
      })),
    );
    const wait = Math.min(opts.passEveryMs ?? 1_000, deadline - Date.now());
    if (wait <= 0) break;
    await new Promise((r) => setTimeout(r, wait));
  }
  return {
    passes,
    runs: outcomes.length,
    failed: outcomes.filter((o) => o.status === 'failed').length,
    ms: Date.now() - started,
  };
}

/** Constant-time check of `Authorization: Bearer <CRON_SECRET>`; false when no secret is set. */
export function cronAuthorized(env: AppEnv, header: string | undefined): boolean {
  if (!env.CRON_SECRET || !header) return false;
  const digest = (v: string) => createHash('sha256').update(v).digest();
  return timingSafeEqual(digest(header), digest(`Bearer ${env.CRON_SECRET}`));
}

/** Node request handler for the cron endpoint (GET, as Vercel Cron calls it). */
export function cronHandler(
  env: AppEnv,
  prisma: PrismaClient,
  log: Logger,
  opts: { budgetMs?: number } = {},
) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const send = (status: number, data: unknown) => {
      res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      res.end(JSON.stringify({ data, meta: { next_cursor: null } }));
    };
    if (req.method !== 'GET') return send(405, { status: 'method_not_allowed' });
    if (!env.CRON_SECRET) return send(503, { status: 'cron_not_configured' });
    if (!cronAuthorized(env, req.headers.authorization))
      return send(401, { status: 'unauthorized' });
    try {
      return send(200, { status: 'ok', ...(await runCronTick(env, prisma, log, opts)) });
    } catch (err) {
      log.error({ err: err instanceof Error ? err.message : String(err) }, 'cron tick failed');
      return send(500, { status: 'failed' });
    }
  };
}
