-- Phase 5: fulfilment, receipt, disputes, sandbox refunds and payouts, reviews.
-- Additive only: new enum values, enums, columns, tables, indexes, constraints and triggers.

ALTER TYPE "PaymentState" ADD VALUE IF NOT EXISTS 'PARTIALLY_REFUNDED';
ALTER TYPE "PaymentState" ADD VALUE IF NOT EXISTS 'REFUNDED';
ALTER TYPE "ReconciliationKind" ADD VALUE IF NOT EXISTS 'REFUND_FAILED';
ALTER TYPE "ReconciliationKind" ADD VALUE IF NOT EXISTS 'PAYOUT_FAILED';
ALTER TYPE "FilePurpose" ADD VALUE IF NOT EXISTS 'DELIVERY_PROOF';
ALTER TYPE "FilePurpose" ADD VALUE IF NOT EXISTS 'DISPUTE_EVIDENCE';

CREATE TYPE "SettlementState" AS ENUM ('NOT_ELIGIBLE', 'ELIGIBLE', 'HELD', 'IN_PAYOUT', 'PAID_OUT');
CREATE TYPE "ShipmentState" AS ENUM ('DISPATCHED', 'DELIVERED');
CREATE TYPE "DisputeState" AS ENUM ('OPEN', 'UNDER_REVIEW', 'AWAITING_EVIDENCE', 'RESOLUTION_PROPOSED', 'RESOLVING', 'CLOSED');
CREATE TYPE "DisputeType" AS ENUM ('NOT_RECEIVED', 'DAMAGED', 'WRONG_ITEMS', 'QUANTITY_SHORT', 'QUALITY', 'OTHER');
CREATE TYPE "DisputeProposal" AS ENUM ('NO_ACTION', 'REFUND');
CREATE TYPE "RefundState" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'SUBMITTED', 'SUCCEEDED', 'FAILED');
CREATE TYPE "PayoutState" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'PENDING', 'PAID', 'FAILED');
CREATE TYPE "ReviewState" AS ENUM ('PUBLISHED', 'HIDDEN');
CREATE TYPE "MockPspOperationKind" AS ENUM ('REFUND', 'PAYOUT');
CREATE TYPE "MockPspOperationState" AS ENUM ('OPEN', 'SUCCEEDED', 'FAILED');

ALTER TABLE "orders"
  ADD COLUMN "settlement_state" "SettlementState" NOT NULL DEFAULT 'NOT_ELIGIBLE',
  ADD COLUMN "refunded_fils" BIGINT NOT NULL DEFAULT 0,
  ADD COLUMN "processing_at" TIMESTAMPTZ(3),
  ADD COLUMN "dispatched_at" TIMESTAMPTZ(3),
  ADD COLUMN "delivered_at" TIMESTAMPTZ(3),
  ADD COLUMN "completed_at" TIMESTAMPTZ(3);
ALTER TABLE "orders" ADD CONSTRAINT "orders_refund_within_total" CHECK ("refunded_fils" >= 0 AND "refunded_fils" <= "total_fils");

CREATE TABLE "shipments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "order_id" UUID NOT NULL,
  "carrier" TEXT NOT NULL,
  "tracking_code" TEXT,
  "expected_delivery_date" DATE,
  "state" "ShipmentState" NOT NULL DEFAULT 'DISPATCHED',
  "dispatched_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dispatched_by_id" UUID NOT NULL,
  "delivered_at" TIMESTAMPTZ(3),
  "delivered_by_id" UUID,
  "delivery_note" TEXT,
  "proof_file_id" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "shipments_pkey" PRIMARY KEY ("id")
);
-- MVP: one shipment per seller order containing every line (docs/09-workflows.md).
CREATE UNIQUE INDEX "shipments_order_id_key" ON "shipments"("order_id");

CREATE TABLE "shipment_items" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "shipment_id" UUID NOT NULL,
  "order_line_id" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  CONSTRAINT "shipment_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "shipment_items_quantity_positive" CHECK ("quantity" > 0)
);
CREATE UNIQUE INDEX "shipment_items_shipment_id_order_line_id_key" ON "shipment_items"("shipment_id", "order_line_id");

CREATE SEQUENCE "dispute_number_seq" START 1001;
CREATE SEQUENCE "refund_number_seq" START 1001;
CREATE SEQUENCE "payout_number_seq" START 1001;

CREATE TABLE "disputes" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "number" TEXT NOT NULL,
  "order_id" UUID NOT NULL,
  "opened_by_id" UUID NOT NULL,
  "opened_side" TEXT NOT NULL,
  "type" "DisputeType" NOT NULL,
  "state" "DisputeState" NOT NULL DEFAULT 'OPEN',
  "reason" TEXT NOT NULL,
  "assigned_admin_id" UUID,
  "proposal" "DisputeProposal",
  "proposal_amount_fils" BIGINT,
  "proposal_note" TEXT,
  "resolution" TEXT,
  "closed_at" TIMESTAMPTZ(3),
  "version" INTEGER NOT NULL DEFAULT 1,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "disputes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "disputes_side_valid" CHECK ("opened_side" IN ('BUYER', 'SELLER')),
  CONSTRAINT "disputes_proposal_valid" CHECK (
    ("proposal" IS NULL AND "proposal_amount_fils" IS NULL) OR
    ("proposal" = 'NO_ACTION' AND "proposal_amount_fils" IS NULL) OR
    ("proposal" = 'REFUND' AND "proposal_amount_fils" > 0))
);
CREATE UNIQUE INDEX "disputes_number_key" ON "disputes"("number");
-- One active dispute per order.
CREATE UNIQUE INDEX "disputes_one_active_per_order" ON "disputes"("order_id") WHERE "state" <> 'CLOSED';
CREATE INDEX "disputes_state_created_at_idx" ON "disputes"("state", "created_at");

CREATE TABLE "dispute_messages" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "dispute_id" UUID NOT NULL,
  "author_id" UUID NOT NULL,
  "author_side" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "file_id" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "dispute_messages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "dispute_messages_side_valid" CHECK ("author_side" IN ('BUYER', 'SELLER', 'ADMIN', 'SYSTEM'))
);
CREATE INDEX "dispute_messages_dispute_id_created_at_idx" ON "dispute_messages"("dispute_id", "created_at");

CREATE TABLE "refunds" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "number" TEXT NOT NULL,
  "order_id" UUID NOT NULL,
  "payment_id" UUID NOT NULL,
  "dispute_id" UUID,
  "amount_fils" BIGINT NOT NULL,
  "commission_fils" BIGINT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'AED',
  "state" "RefundState" NOT NULL DEFAULT 'REQUESTED',
  "reason" TEXT NOT NULL,
  "requested_by_id" UUID NOT NULL,
  "approved_by_id" UUID,
  "decision_reason" TEXT,
  "provider_ref" TEXT,
  "failure_code" TEXT,
  "submitted_at" TIMESTAMPTZ(3),
  "completed_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "refunds_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "refunds_amount_valid" CHECK ("amount_fils" > 0 AND "commission_fils" >= 0 AND "commission_fils" <= "amount_fils" AND "currency" = 'AED'),
  -- Dual control (T28): the approver is never the requester.
  CONSTRAINT "refunds_independent_approver" CHECK ("approved_by_id" IS NULL OR "approved_by_id" <> "requested_by_id")
);
CREATE UNIQUE INDEX "refunds_number_key" ON "refunds"("number");
CREATE UNIQUE INDEX "refunds_provider_ref_key" ON "refunds"("provider_ref");
CREATE INDEX "refunds_order_id_idx" ON "refunds"("order_id");
CREATE INDEX "refunds_state_created_at_idx" ON "refunds"("state", "created_at");

CREATE TABLE "payouts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "number" TEXT NOT NULL,
  "seller_workspace_id" UUID NOT NULL,
  "seller_company_id" UUID NOT NULL,
  "amount_fils" BIGINT NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'AED',
  "state" "PayoutState" NOT NULL DEFAULT 'REQUESTED',
  "requested_by_id" UUID NOT NULL,
  "approved_by_id" UUID,
  "decision_reason" TEXT,
  "provider_ref" TEXT,
  "failure_code" TEXT,
  "submitted_at" TIMESTAMPTZ(3),
  "paid_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "payouts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payouts_amount_positive" CHECK ("amount_fils" > 0 AND "currency" = 'AED'),
  CONSTRAINT "payouts_independent_approver" CHECK ("approved_by_id" IS NULL OR "approved_by_id" <> "requested_by_id")
);
CREATE UNIQUE INDEX "payouts_number_key" ON "payouts"("number");
CREATE UNIQUE INDEX "payouts_provider_ref_key" ON "payouts"("provider_ref");
CREATE INDEX "payouts_seller_workspace_id_created_at_idx" ON "payouts"("seller_workspace_id", "created_at");

CREATE TABLE "payout_allocations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "payout_id" UUID NOT NULL,
  "order_id" UUID NOT NULL,
  "amount_fils" BIGINT NOT NULL,
  CONSTRAINT "payout_allocations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payout_allocations_amount_positive" CHECK ("amount_fils" > 0)
);
CREATE UNIQUE INDEX "payout_allocations_payout_id_order_id_key" ON "payout_allocations"("payout_id", "order_id");
CREATE INDEX "payout_allocations_order_id_idx" ON "payout_allocations"("order_id");

CREATE TABLE "reviews" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "order_id" UUID NOT NULL,
  "buyer_workspace_id" UUID NOT NULL,
  "seller_workspace_id" UUID NOT NULL,
  "author_id" UUID NOT NULL,
  "rating" SMALLINT NOT NULL,
  "comment" TEXT,
  "state" "ReviewState" NOT NULL DEFAULT 'PUBLISHED',
  "hidden_reason" TEXT,
  "hidden_by_id" UUID,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "reviews_rating_range" CHECK ("rating" BETWEEN 1 AND 5),
  CONSTRAINT "reviews_no_self_review" CHECK ("buyer_workspace_id" <> "seller_workspace_id")
);
-- One review per order (T39).
CREATE UNIQUE INDEX "reviews_order_id_key" ON "reviews"("order_id");
CREATE INDEX "reviews_seller_workspace_id_state_created_at_idx" ON "reviews"("seller_workspace_id", "state", "created_at");

-- Sandbox-only stand-in for provider refund and payout operations (PAYMENT_MODE=mock).
CREATE TABLE "mock_psp_operations" (
  "id" TEXT NOT NULL,
  "kind" "MockPspOperationKind" NOT NULL,
  "amount_fils" BIGINT NOT NULL,
  "currency" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "state" "MockPspOperationState" NOT NULL DEFAULT 'OPEN',
  "outbox" JSONB NOT NULL DEFAULT '[]',
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "mock_psp_operations_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "mock_psp_operations_idempotency_key_key" ON "mock_psp_operations"("idempotency_key");

ALTER TABLE "shipments" ADD CONSTRAINT "shipments_order_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_proof_fk" FOREIGN KEY ("proof_file_id") REFERENCES "files"("id") ON DELETE RESTRICT;
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_shipment_fk" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE RESTRICT;
ALTER TABLE "shipment_items" ADD CONSTRAINT "shipment_items_line_fk" FOREIGN KEY ("order_line_id") REFERENCES "order_lines"("id") ON DELETE RESTRICT;
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_order_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;
ALTER TABLE "dispute_messages" ADD CONSTRAINT "dispute_messages_dispute_fk" FOREIGN KEY ("dispute_id") REFERENCES "disputes"("id") ON DELETE RESTRICT;
ALTER TABLE "dispute_messages" ADD CONSTRAINT "dispute_messages_file_fk" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT;
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_order_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_fk" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT;
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_dispute_fk" FOREIGN KEY ("dispute_id") REFERENCES "disputes"("id") ON DELETE RESTRICT;
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_workspace_fk" FOREIGN KEY ("seller_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT;
ALTER TABLE "payout_allocations" ADD CONSTRAINT "payout_allocations_payout_fk" FOREIGN KEY ("payout_id") REFERENCES "payouts"("id") ON DELETE RESTRICT;
ALTER TABLE "payout_allocations" ADD CONSTRAINT "payout_allocations_order_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;

-- Case history and allocations are append-only evidence.
CREATE TRIGGER "dispute_messages_append_only" BEFORE UPDATE OR DELETE ON "dispute_messages" FOR EACH ROW EXECUTE FUNCTION "reject_change"();
CREATE TRIGGER "payout_allocations_append_only" BEFORE UPDATE OR DELETE ON "payout_allocations" FOR EACH ROW EXECUTE FUNCTION "reject_change"();
CREATE TRIGGER "dispute_messages_no_truncate" BEFORE TRUNCATE ON "dispute_messages" FOR EACH STATEMENT EXECUTE FUNCTION "reject_change"();
-- Reviews: the rating and comment can never be edited (moderation only hides, T39 / docs/02-buyer.md).
CREATE FUNCTION "reviews_content_immutable"() RETURNS trigger AS $$
BEGIN
  IF NEW."rating" <> OLD."rating" OR NEW."comment" IS DISTINCT FROM OLD."comment" OR NEW."order_id" <> OLD."order_id" THEN
    RAISE EXCEPTION 'review content is immutable';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "reviews_content_immutable" BEFORE UPDATE ON "reviews" FOR EACH ROW EXECUTE FUNCTION "reviews_content_immutable"();
CREATE TRIGGER "reviews_no_delete" BEFORE DELETE ON "reviews" FOR EACH ROW EXECUTE FUNCTION "reject_change"();
