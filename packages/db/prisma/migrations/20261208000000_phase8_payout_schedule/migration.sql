-- Phase 8 (founder decisions of 28 November 2026, evening): scheduled weekly payout proposals,
-- a configurable payout holiday calendar, and commission changes that take effect after notice.
-- Additive only.

-- Payouts proposed by the weekly schedule have no human requester until a finance user confirms
-- them; a different finance approver then decides (dual control is unchanged).
ALTER TYPE "PayoutState" ADD VALUE IF NOT EXISTS 'PROPOSED' BEFORE 'REQUESTED';
ALTER TABLE "payouts" ALTER COLUMN "requested_by_id" DROP NOT NULL;
ALTER TABLE "payouts" ADD COLUMN "proposed_at" TIMESTAMPTZ(3);
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_requester_unless_proposed"
  CHECK ("requested_by_id" IS NOT NULL
    OR ("proposed_at" IS NOT NULL AND "state"::text IN ('PROPOSED', 'REJECTED')));

ALTER TABLE "payout_runs" ADD COLUMN "scheduled_for" TIMESTAMPTZ(3);
ALTER TABLE "payout_runs" ADD COLUMN "proposed_at" TIMESTAMPTZ(3);
ALTER TABLE "payout_runs" ADD COLUMN "proposed_count" INTEGER;

-- UAE public holidays that move the payout run to the next working day.
CREATE TABLE "payout_holidays" (
  "date" DATE NOT NULL,
  "name" TEXT NOT NULL,
  "created_by_id" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payout_holidays_pkey" PRIMARY KEY ("date"),
  CONSTRAINT "payout_holidays_name_len" CHECK (char_length("name") BETWEEN 2 AND 200)
);

-- Commission versions apply to checkouts created from their effective date (30 days' notice).
ALTER TABLE "commission_policies" ADD COLUMN "effective_from" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "commission_policies_effective_from_idx" ON "commission_policies" ("effective_from");
