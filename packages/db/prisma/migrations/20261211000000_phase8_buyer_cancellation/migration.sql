-- Phase 8 (founder decisions 2026-11-28, FD-09): buyer cancellation requests after payment and
-- before dispatch. Additive only.
ALTER TABLE "orders"
  ADD COLUMN "buyer_cancel_state" TEXT,
  ADD COLUMN "buyer_cancel_requested_at" TIMESTAMPTZ(3),
  ADD COLUMN "buyer_cancel_requested_by_id" UUID,
  ADD COLUMN "buyer_cancel_reason" TEXT,
  ADD COLUMN "buyer_cancel_custom" BOOLEAN,
  ADD COLUMN "buyer_cancel_decided_at" TIMESTAMPTZ(3),
  ADD COLUMN "buyer_cancel_decision_reason" TEXT;

ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_cancel_state_check"
  CHECK ("buyer_cancel_state" IS NULL OR "buyer_cancel_state" IN ('SUPPLIER_REVIEW', 'REFUND_REVIEW', 'DECLINED', 'REFUNDED'));
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_cancel_complete_check"
  CHECK ("buyer_cancel_state" IS NULL OR ("buyer_cancel_requested_at" IS NOT NULL AND "buyer_cancel_reason" IS NOT NULL AND "buyer_cancel_custom" IS NOT NULL));

ALTER TABLE "refunds" ADD COLUMN "buyer_cancellation" BOOLEAN NOT NULL DEFAULT false;
