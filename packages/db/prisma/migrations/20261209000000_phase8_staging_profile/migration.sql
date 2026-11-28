-- Phase 8 (founder decisions of 28 November 2026, evening): protected staging profile on free
-- services. Additive only.

-- Rate-limit counters and one-time markers (TOTP replay) when no Redis is configured: Vercel
-- functions cannot keep in-memory state, and Redis is optional on the free plan (C-20).
CREATE TABLE "rate_limit_buckets" (
  "key" TEXT NOT NULL,
  "points" INTEGER NOT NULL,
  "expires_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key"),
  CONSTRAINT "rate_limit_buckets_points_positive" CHECK ("points" > 0)
);
CREATE INDEX "rate_limit_buckets_expires_at_idx" ON "rate_limit_buckets" ("expires_at");

-- Staging mail catcher (EMAIL_PROVIDER=catcher): emails are rendered and kept here for 7 days
-- instead of being sent. Never enabled in production.
CREATE TABLE "caught_emails" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "to_address" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "template" TEXT NOT NULL,
  "locale" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "caught_emails_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "caught_emails_created_at_idx" ON "caught_emails" ("created_at");
