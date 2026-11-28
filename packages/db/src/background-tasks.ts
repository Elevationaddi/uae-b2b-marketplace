import { randomBytes } from 'node:crypto';
import type { PrismaClient } from '@prisma/client';

/**
 * PostgreSQL scheduler for recurring background work (Phase 8). It replaces the always-on BullMQ
 * worker so the same tasks can run from a long-lived process (local development, any container)
 * or from a scheduled serverless function (Vercel Cron) without Redis.
 *
 * Guarantees:
 * - At most one runner executes a task at a time: a runner claims a due task with a lease (an
 *   atomic conditional UPDATE using the database clock).
 * - A runner that dies mid-run (function timeout, restart) loses nothing: its lease expires and the
 *   next runner takes the task again. Tasks only move work items that live in their own tables
 *   (outbox, payment events, approved refunds and payouts...) and every handler is idempotent.
 * - A failing task is retried with exponential backoff (capped) and its errors are recorded for the
 *   operations overview.
 */
export interface TaskDef {
  name: string;
  /** Cadence in seconds (1..604800). */
  everySeconds: number;
  /** Maximum expected run time; the lease lasts this long (default 5 minutes). */
  leaseSeconds?: number;
  run: () => Promise<unknown>;
}

export interface TaskOutcome {
  name: string;
  status: 'succeeded' | 'failed';
  ms: number;
  result?: unknown;
  error?: string;
}

const MAX_BACKOFF_SECONDS = 900;

export function runnerId(prefix = 'runner'): string {
  return `${prefix}-${process.pid}-${randomBytes(4).toString('hex')}`;
}

/** Register tasks (insert missing rows, update cadences); existing schedules are kept. */
export async function registerTasks(prisma: PrismaClient, tasks: TaskDef[]): Promise<void> {
  for (const t of tasks) {
    if (!Number.isInteger(t.everySeconds) || t.everySeconds < 1 || t.everySeconds > 604_800)
      throw new Error(`Task ${t.name}: everySeconds out of range`);
    await prisma.$executeRaw`
      INSERT INTO background_tasks (name, every_seconds) VALUES (${t.name}, ${t.everySeconds})
      ON CONFLICT (name) DO UPDATE SET every_seconds = EXCLUDED.every_seconds, updated_at = now()
       WHERE background_tasks.every_seconds <> EXCLUDED.every_seconds`;
  }
}

/** Claim a task if it is due and not leased by a live runner. True when this runner owns it. */
export async function claimTask(
  prisma: PrismaClient,
  name: string,
  owner: string,
  leaseSeconds: number,
): Promise<boolean> {
  const n = await prisma.$executeRaw`
    UPDATE background_tasks
       SET lease_owner = ${owner},
           lease_expires_at = now() + make_interval(secs => ${leaseSeconds}),
           last_started_at = now(), updated_at = now()
     WHERE name = ${name}
       AND next_run_at <= now()
       AND (lease_expires_at IS NULL OR lease_expires_at < now())`;
  return n === 1;
}

/** Record the outcome and schedule the next run; only the lease owner can finish a run. */
export async function finishTask(
  prisma: PrismaClient,
  name: string,
  owner: string,
  outcome: { ok: true; result?: unknown } | { ok: false; error: string },
): Promise<void> {
  if (outcome.ok) {
    const result = JSON.stringify(outcome.result ?? null);
    await prisma.$executeRaw`
      UPDATE background_tasks
         SET lease_owner = NULL, lease_expires_at = NULL, last_finished_at = now(),
             last_status = 'succeeded', last_error = NULL, last_result = ${result}::jsonb,
             run_count = run_count + 1, consecutive_failures = 0,
             next_run_at = now() + make_interval(secs => every_seconds), updated_at = now()
       WHERE name = ${name} AND lease_owner = ${owner}`;
  } else {
    const error = outcome.error.slice(0, 2000);
    await prisma.$executeRaw`
      UPDATE background_tasks
         SET lease_owner = NULL, lease_expires_at = NULL, last_finished_at = now(),
             last_status = 'failed', last_error = ${error},
             run_count = run_count + 1, failure_count = failure_count + 1,
             consecutive_failures = consecutive_failures + 1,
             next_run_at = now() + make_interval(secs => LEAST(
               GREATEST(every_seconds, ${MAX_BACKOFF_SECONDS}),
               every_seconds * power(2, LEAST(consecutive_failures, 10))::int)),
             updated_at = now()
       WHERE name = ${name} AND lease_owner = ${owner}`;
  }
}

/**
 * Run every due task once, in order, until the deadline. Tasks not reached stay due for the next
 * runner. Errors never escape: each is recorded on its task.
 */
export async function runDueTasks(
  prisma: PrismaClient,
  tasks: TaskDef[],
  opts: { owner: string; deadline?: number; onError?: (name: string, err: unknown) => void },
): Promise<TaskOutcome[]> {
  const out: TaskOutcome[] = [];
  for (const t of tasks) {
    if (opts.deadline !== undefined && Date.now() >= opts.deadline) break;
    if (!(await claimTask(prisma, t.name, opts.owner, t.leaseSeconds ?? 300))) continue;
    const started = Date.now();
    try {
      const result = await t.run();
      await finishTask(prisma, t.name, opts.owner, { ok: true, result });
      out.push({ name: t.name, status: 'succeeded', ms: Date.now() - started, result });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      opts.onError?.(t.name, err);
      await finishTask(prisma, t.name, opts.owner, { ok: false, error });
      out.push({ name: t.name, status: 'failed', ms: Date.now() - started, error });
    }
  }
  return out;
}

/** Health view of every task: overdue means not run within twice its cadence (plus a minute). */
export async function taskHealth(prisma: PrismaClient, now: Date = new Date()) {
  const rows = await prisma.backgroundTask.findMany({ orderBy: { name: 'asc' } });
  return rows.map((r) => ({
    name: r.name,
    every_seconds: r.everySeconds,
    last_status: r.lastStatus as 'succeeded' | 'failed' | null,
    last_finished_at: r.lastFinishedAt?.toISOString() ?? null,
    next_run_at: r.nextRunAt.toISOString(),
    consecutive_failures: r.consecutiveFailures,
    overdue: now.getTime() - r.nextRunAt.getTime() > (r.everySeconds * 2 + 60) * 1000,
  }));
}
