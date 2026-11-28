-- Phase 8 (founder decisions, conflicts C-07 and C-11): supplier cancellation of an unfulfilled
-- order through a full refund, and the supplier's disclosed return policy. Additive only.

-- C-07: the supplier asked to cancel; fulfilment stops until finance decides the refund.
ALTER TABLE "orders"
  ADD COLUMN "seller_cancel_requested_at" TIMESTAMPTZ(3),
  ADD COLUMN "seller_cancel_reason" TEXT;
ALTER TABLE "orders" ADD CONSTRAINT "orders_seller_cancel_complete" CHECK (("seller_cancel_requested_at" IS NULL) = ("seller_cancel_reason" IS NULL));
ALTER TABLE "refunds" ADD COLUMN "seller_cancellation" BOOLEAN NOT NULL DEFAULT false;

-- C-11: the return policy buyers see before paying (copied onto each order at checkout).
ALTER TABLE "storefronts"
  ADD COLUMN "return_policy_en" TEXT,
  ADD COLUMN "return_policy_ar" TEXT;
