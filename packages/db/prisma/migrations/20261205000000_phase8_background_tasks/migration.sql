-- Phase 8 (founder message of 2026-11-28 09:28 UTC): a PostgreSQL-backed scheduler for background
-- work, so the platform does not depend on an always-on Redis worker (BullMQ) and can run from a
-- scheduled function (for example Vercel Cron). Additive only.
--
-- Each row is one recurring task. A runner claims a due task with a time-limited lease; if the
-- runner is killed mid-run (function timeout, restart) the lease expires and the next runner takes
-- the task again. The work items themselves (outbox emails, payment events, approved refunds and
-- payouts, unpaid checkouts) stay in their own tables and are processed idempotently, so nothing is
-- lost when a run stops part-way.

CREATE TABLE "background_tasks" (
  "name" TEXT PRIMARY KEY,
  "every_seconds" INTEGER NOT NULL,
  "next_run_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "lease_owner" TEXT,
  "lease_expires_at" TIMESTAMPTZ(3),
  "last_started_at" TIMESTAMPTZ(3),
  "last_finished_at" TIMESTAMPTZ(3),
  "last_status" TEXT,
  "last_error" TEXT,
  "last_result" JSONB,
  "run_count" INTEGER NOT NULL DEFAULT 0,
  "failure_count" INTEGER NOT NULL DEFAULT 0,
  "consecutive_failures" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT now(),
  CONSTRAINT "background_tasks_every_range" CHECK ("every_seconds" BETWEEN 1 AND 604800),
  CONSTRAINT "background_tasks_status" CHECK ("last_status" IS NULL OR "last_status" IN ('succeeded', 'failed')),
  CONSTRAINT "background_tasks_lease_complete" CHECK (("lease_owner" IS NULL) = ("lease_expires_at" IS NULL))
);
CREATE INDEX "background_tasks_next_run_at_idx" ON "background_tasks" ("next_run_at");
