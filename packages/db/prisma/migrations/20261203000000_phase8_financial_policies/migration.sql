-- Phase 8 (founder decisions of 28 November 2026): financial policy conflicts C-01..C-06.
-- Additive only: new enum, columns, tables, indexes, constraints and triggers. Existing rows are
-- backfilled from data already stored; nothing is deleted or rewritten destructively.

-- ------------------------------------------------------------------ commission policy (C-05)
-- Versioned, append-only commission policy set by a restricted admin. The newest version applies
-- to checkouts created after it; every order records the rate and policy it was priced with.
CREATE TABLE "commission_policies" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "version" INTEGER NOT NULL,
  "rate_bps" INTEGER NOT NULL,
  "base" TEXT NOT NULL DEFAULT 'MERCHANDISE_EX_VAT_DELIVERY',
  "reason" TEXT NOT NULL,
  "created_by_id" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "commission_policies_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "commission_policies_rate_range" CHECK ("rate_bps" >= 0 AND "rate_bps" <= 5000),
  CONSTRAINT "commission_policies_version_positive" CHECK ("version" > 0)
);
CREATE UNIQUE INDEX "commission_policies_version_key" ON "commission_policies"("version");
CREATE TRIGGER "commission_policies_append_only" BEFORE UPDATE OR DELETE ON "commission_policies" FOR EACH ROW EXECUTE FUNCTION "reject_change"();
CREATE TRIGGER "commission_policies_no_truncate" BEFORE TRUNCATE ON "commission_policies" FOR EACH STATEMENT EXECUTE FUNCTION "reject_change"();

ALTER TABLE "checkouts" ADD COLUMN "commission_policy_id" UUID;
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_commission_policy_id_fkey" FOREIGN KEY ("commission_policy_id") REFERENCES "commission_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ------------------------------------------------------------------ orders (C-01, C-02, C-05)
ALTER TABLE "orders"
  ADD COLUMN "commission_bps" INTEGER,
  ADD COLUMN "commission_policy_id" UUID,
  ADD COLUMN "delivery_verified_at" TIMESTAMPTZ(3),
  ADD COLUMN "delivery_verification" TEXT,
  ADD COLUMN "dispute_window_ends_at" TIMESTAMPTZ(3);
ALTER TABLE "orders" ADD CONSTRAINT "orders_commission_policy_id_fkey" FOREIGN KEY ("commission_policy_id") REFERENCES "commission_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_verification_kind" CHECK ("delivery_verification" IS NULL OR "delivery_verification" IN ('PROOF_OF_DELIVERY', 'BUYER_CONFIRMED'));
ALTER TABLE "orders" ADD CONSTRAINT "orders_window_after_verification" CHECK (("delivery_verified_at" IS NULL) = ("dispute_window_ends_at" IS NULL) AND ("dispute_window_ends_at" IS NULL OR "dispute_window_ends_at" >= "delivery_verified_at"));
CREATE INDEX "orders_dispute_window_ends_at_idx" ON "orders"("dispute_window_ends_at") WHERE "settlement_state" IN ('NOT_ELIGIBLE', 'HELD', 'ELIGIBLE');

-- Backfill the rate each order was priced with (already snapshotted on its checkout).
UPDATE "orders" o SET "commission_bps" = c."commission_bps" FROM "checkouts" c WHERE c."id" = o."checkout_id" AND o."commission_bps" IS NULL;

-- Backfill verified delivery for existing orders: the earlier of a delivery with proof and the
-- buyer's receipt confirmation; the window is the then-approved 14 days.
UPDATE "orders" o SET
  "delivery_verified_at" = v.at,
  "delivery_verification" = v.kind,
  "dispute_window_ends_at" = v.at + INTERVAL '14 days'
FROM (
  SELECT o2."id",
    CASE WHEN s."proof_file_id" IS NOT NULL AND s."delivered_at" IS NOT NULL
              AND (o2."completed_at" IS NULL OR s."delivered_at" <= o2."completed_at")
         THEN s."delivered_at" ELSE o2."completed_at" END AS at,
    CASE WHEN s."proof_file_id" IS NOT NULL AND s."delivered_at" IS NOT NULL
              AND (o2."completed_at" IS NULL OR s."delivered_at" <= o2."completed_at")
         THEN 'PROOF_OF_DELIVERY' ELSE 'BUYER_CONFIRMED' END AS kind
  FROM "orders" o2 LEFT JOIN "shipments" s ON s."order_id" = o2."id"
  WHERE o2."delivery_verified_at" IS NULL
    AND (o2."completed_at" IS NOT NULL OR (s."proof_file_id" IS NOT NULL AND s."delivered_at" IS NOT NULL))
) v
WHERE v."id" = o."id" AND v.at IS NOT NULL;

-- Orders made eligible under the old rule but still inside the new window go back to waiting.
UPDATE "orders" SET "settlement_state" = 'NOT_ELIGIBLE'
WHERE "settlement_state" = 'ELIGIBLE' AND ("dispute_window_ends_at" IS NULL OR "dispute_window_ends_at" > CURRENT_TIMESTAMP);

-- ------------------------------------------------------------------ settlement holds (C-03, C-04)
CREATE TYPE "OrderHoldKind" AS ENUM ('COMPLIANCE', 'FRAUD', 'RECONCILIATION', 'PAYMENT_INVESTIGATION');

CREATE TABLE "order_holds" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "order_id" UUID NOT NULL,
  "kind" "OrderHoldKind" NOT NULL,
  "reason" TEXT NOT NULL,
  "placed_by_id" UUID NOT NULL,
  "placed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "released_by_id" UUID,
  "released_at" TIMESTAMPTZ(3),
  "release_reason" TEXT,
  CONSTRAINT "order_holds_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "order_holds_release_complete" CHECK (("released_at" IS NULL) = ("released_by_id" IS NULL) AND ("released_at" IS NULL) = ("release_reason" IS NULL))
);
CREATE INDEX "order_holds_order_id_idx" ON "order_holds"("order_id");
CREATE INDEX "order_holds_active_idx" ON "order_holds"("placed_at") WHERE "released_at" IS NULL;
-- One active hold of each kind per order.
CREATE UNIQUE INDEX "order_holds_one_active_kind" ON "order_holds"("order_id", "kind") WHERE "released_at" IS NULL;
ALTER TABLE "order_holds" ADD CONSTRAINT "order_holds_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- A hold is never deleted, and once released its facts are fixed.
CREATE FUNCTION "order_holds_guard"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'order holds are never deleted';
  END IF;
  IF OLD."released_at" IS NOT NULL
     OR NEW."order_id" <> OLD."order_id" OR NEW."kind" <> OLD."kind" OR NEW."reason" <> OLD."reason"
     OR NEW."placed_by_id" <> OLD."placed_by_id" OR NEW."placed_at" <> OLD."placed_at" THEN
    RAISE EXCEPTION 'order hold % can only be released once', OLD."id";
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER "order_holds_guard" BEFORE UPDATE OR DELETE ON "order_holds" FOR EACH ROW EXECUTE FUNCTION "order_holds_guard"();
CREATE TRIGGER "order_holds_no_truncate" BEFORE TRUNCATE ON "order_holds" FOR EACH STATEMENT EXECUTE FUNCTION "reject_change"();

-- ------------------------------------------------------------------ refund breakdown (C-06)
-- Which part of the order a refund covers. Commission is reversed only on the merchandise part.
-- Null on refunds made before Phase 8 (they were allocated pro rata of the order total).
ALTER TABLE "refunds"
  ADD COLUMN "merchandise_fils" BIGINT,
  ADD COLUMN "shipping_fils" BIGINT,
  ADD COLUMN "tax_fils" BIGINT;
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_breakdown_complete" CHECK (
  ("merchandise_fils" IS NULL AND "shipping_fils" IS NULL AND "tax_fils" IS NULL)
  OR ("merchandise_fils" >= 0 AND "shipping_fils" >= 0 AND "tax_fils" >= 0
      AND "merchandise_fils" + "shipping_fils" + "tax_fils" = "amount_fils"));
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_commission_within_merchandise" CHECK ("merchandise_fils" IS NULL OR "commission_fils" <= "merchandise_fils");

-- ------------------------------------------------------------------ weekly payout runs (C-04)
-- Payouts are batched per Dubai calendar week (Monday to Sunday); a supplier gets at most one
-- live payout per run. Rejected and failed payouts do not count, so a failed payout can be retried.
CREATE TABLE "payout_runs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "week_start" DATE NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "payout_runs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payout_runs_week_starts_monday" CHECK (EXTRACT(ISODOW FROM "week_start") = 1)
);
CREATE UNIQUE INDEX "payout_runs_week_start_key" ON "payout_runs"("week_start");
CREATE TRIGGER "payout_runs_no_delete" BEFORE DELETE ON "payout_runs" FOR EACH ROW EXECUTE FUNCTION "reject_change"();

ALTER TABLE "payouts" ADD COLUMN "run_id" UUID;
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "payout_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE UNIQUE INDEX "payouts_one_live_per_seller_per_run" ON "payouts"("run_id", "seller_workspace_id") WHERE "run_id" IS NOT NULL AND "state" NOT IN ('REJECTED', 'FAILED');
