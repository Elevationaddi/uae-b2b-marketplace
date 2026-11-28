-- Phase 4: cart, checkout, reservations, orders, sandbox payments, webhook inbox, ledger.
-- Additive only. Generated DDL (filtered to new objects) plus hand-written constraints below.

CREATE TYPE "CheckoutState" AS ENUM ('PENDING_PAYMENT', 'PAID', 'EXPIRED', 'CANCELLED', 'RECONCILIATION_REQUIRED');

CREATE TYPE "CheckoutSource" AS ENUM ('CART', 'QUOTE');

CREATE TYPE "OrderState" AS ENUM ('AWAITING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'COMPLETED', 'CANCELLED');

CREATE TYPE "ReservationState" AS ENUM ('HELD', 'CONSUMED', 'RELEASED');

CREATE TYPE "PaymentState" AS ENUM ('CREATED', 'PENDING', 'CAPTURED', 'FAILED', 'CANCELLED');

CREATE TYPE "PaymentEventStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'IGNORED', 'QUARANTINED');

CREATE TYPE "ReconciliationKind" AS ENUM ('LATE_CAPTURE', 'AMOUNT_MISMATCH', 'UNKNOWN_REFERENCE', 'INVALID_SIGNATURE');

CREATE TYPE "ReconciliationState" AS ENUM ('OPEN', 'RESOLVED');

CREATE TYPE "MockPspSessionState" AS ENUM ('OPEN', 'CAPTURED', 'FAILED', 'CANCELLED');

ALTER TABLE "storefronts" ADD COLUMN     "delivery_days" INTEGER,
ADD COLUMN     "delivery_emirates" "Emirate"[] DEFAULT ARRAY[]::"Emirate"[],
ADD COLUMN     "delivery_fee_fils" BIGINT;

CREATE TABLE "addresses" (
    "id" UUID NOT NULL,
    "buyer_workspace_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "emirate" "Emirate" NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cart_items" (
    "id" UUID NOT NULL,
    "buyer_workspace_id" UUID NOT NULL,
    "sku_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "added_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "checkouts" (
    "id" UUID NOT NULL,
    "number" TEXT NOT NULL,
    "buyer_workspace_id" UUID NOT NULL,
    "buyer_company_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "source" "CheckoutSource" NOT NULL,
    "state" "CheckoutState" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "rfq_id" UUID,
    "quote_version_id" UUID,
    "address_snapshot" JSONB,
    "po_reference" TEXT,
    "merchandise_fils" BIGINT NOT NULL,
    "shipping_fils" BIGINT NOT NULL,
    "tax_fils" BIGINT NOT NULL,
    "total_fils" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "tax_rule" JSONB NOT NULL,
    "commission_bps" INTEGER NOT NULL,
    "reservation_expires_at" TIMESTAMPTZ(3),
    "pay_by" TIMESTAMPTZ(3) NOT NULL,
    "paid_at" TIMESTAMPTZ(3),
    "closed_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "checkouts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "number" TEXT NOT NULL,
    "checkout_id" UUID NOT NULL,
    "buyer_workspace_id" UUID NOT NULL,
    "buyer_company_id" UUID NOT NULL,
    "seller_workspace_id" UUID NOT NULL,
    "seller_company_id" UUID NOT NULL,
    "state" "OrderState" NOT NULL DEFAULT 'AWAITING_PAYMENT',
    "merchandise_fils" BIGINT NOT NULL,
    "shipping_fils" BIGINT NOT NULL,
    "tax_fils" BIGINT NOT NULL,
    "total_fils" BIGINT NOT NULL,
    "commission_fils" BIGINT NOT NULL,
    "seller_payable_fils" BIGINT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "confirmed_at" TIMESTAMPTZ(3),
    "cancelled_at" TIMESTAMPTZ(3),
    "cancel_reason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_lines" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "sku_id" UUID,
    "product_id" UUID,
    "quote_version_id" UUID,
    "title" TEXT NOT NULL,
    "sku_code" TEXT,
    "variant" JSONB NOT NULL DEFAULT '{}',
    "unit" "QuantityUnit" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price_fils" BIGINT NOT NULL,
    "line_total_fils" BIGINT NOT NULL,

    CONSTRAINT "order_lines_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "order_events" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "actor_side" TEXT NOT NULL,
    "actor_id" UUID,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reservations" (
    "id" UUID NOT NULL,
    "checkout_id" UUID NOT NULL,
    "sku_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "state" "ReservationState" NOT NULL DEFAULT 'HELD',
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "closed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "checkout_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_ref" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "state" "PaymentState" NOT NULL DEFAULT 'CREATED',
    "amount_fils" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "sandbox" BOOLEAN NOT NULL,
    "captured_at" TIMESTAMPTZ(3),
    "failure_code" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payment_events" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider_ref" TEXT,
    "amount_fils" BIGINT,
    "currency" TEXT,
    "signature_valid" BOOLEAN NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "PaymentEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "error" TEXT,
    "received_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(3),

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ledger_journals" (
    "id" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "checkout_id" UUID,
    "payment_id" UUID,
    "dedupe_key" TEXT NOT NULL,
    "memo" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_journals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ledger_entries" (
    "id" UUID NOT NULL,
    "journal_id" UUID NOT NULL,
    "account" TEXT NOT NULL,
    "debit_fils" BIGINT NOT NULL DEFAULT 0,
    "credit_fils" BIGINT NOT NULL DEFAULT 0,
    "order_id" UUID,
    "seller_workspace_id" UUID,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reconciliation_cases" (
    "id" UUID NOT NULL,
    "kind" "ReconciliationKind" NOT NULL,
    "state" "ReconciliationState" NOT NULL DEFAULT 'OPEN',
    "checkout_id" UUID,
    "payment_id" UUID,
    "payment_event_id" UUID,
    "details" JSONB NOT NULL,
    "resolution" TEXT,
    "resolved_by_id" UUID,
    "resolved_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reconciliation_cases_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "mock_psp_sessions" (
    "id" TEXT NOT NULL,
    "amount_fils" BIGINT NOT NULL,
    "currency" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "return_url" TEXT NOT NULL,
    "state" "MockPspSessionState" NOT NULL DEFAULT 'OPEN',
    "outbox" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "mock_psp_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "addresses_buyer_workspace_id_archived_at_idx" ON "addresses"("buyer_workspace_id", "archived_at");

CREATE UNIQUE INDEX "cart_items_buyer_workspace_id_sku_id_key" ON "cart_items"("buyer_workspace_id", "sku_id");

CREATE UNIQUE INDEX "checkouts_number_key" ON "checkouts"("number");

CREATE UNIQUE INDEX "checkouts_rfq_id_key" ON "checkouts"("rfq_id");

CREATE UNIQUE INDEX "checkouts_quote_version_id_key" ON "checkouts"("quote_version_id");

CREATE INDEX "checkouts_buyer_workspace_id_state_idx" ON "checkouts"("buyer_workspace_id", "state");

CREATE INDEX "checkouts_state_pay_by_idx" ON "checkouts"("state", "pay_by");

CREATE UNIQUE INDEX "orders_number_key" ON "orders"("number");

CREATE INDEX "orders_buyer_workspace_id_state_created_at_idx" ON "orders"("buyer_workspace_id", "state", "created_at");

CREATE INDEX "orders_seller_workspace_id_state_created_at_idx" ON "orders"("seller_workspace_id", "state", "created_at");

CREATE INDEX "orders_checkout_id_idx" ON "orders"("checkout_id");

CREATE UNIQUE INDEX "order_lines_order_id_position_key" ON "order_lines"("order_id", "position");

CREATE INDEX "order_events_order_id_created_at_idx" ON "order_events"("order_id", "created_at");

CREATE INDEX "reservations_state_expires_at_idx" ON "reservations"("state", "expires_at");

CREATE UNIQUE INDEX "reservations_checkout_id_sku_id_key" ON "reservations"("checkout_id", "sku_id");

CREATE UNIQUE INDEX "payments_provider_ref_key" ON "payments"("provider_ref");

CREATE UNIQUE INDEX "payments_idempotency_key_key" ON "payments"("idempotency_key");

CREATE INDEX "payments_checkout_id_idx" ON "payments"("checkout_id");

CREATE INDEX "payment_events_status_received_at_idx" ON "payment_events"("status", "received_at");

CREATE UNIQUE INDEX "payment_events_provider_event_id_key" ON "payment_events"("provider", "event_id");

CREATE UNIQUE INDEX "ledger_journals_dedupe_key_key" ON "ledger_journals"("dedupe_key");

CREATE INDEX "ledger_entries_journal_id_idx" ON "ledger_entries"("journal_id");

CREATE INDEX "ledger_entries_account_idx" ON "ledger_entries"("account");

CREATE INDEX "reconciliation_cases_state_created_at_idx" ON "reconciliation_cases"("state", "created_at");

CREATE UNIQUE INDEX "mock_psp_sessions_idempotency_key_key" ON "mock_psp_sessions"("idempotency_key");

ALTER TABLE "orders" ADD CONSTRAINT "orders_checkout_id_fkey" FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "order_events" ADD CONSTRAINT "order_events_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "reservations" ADD CONSTRAINT "reservations_checkout_id_fkey" FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "payments" ADD CONSTRAINT "payments_checkout_id_fkey" FOREIGN KEY ("checkout_id") REFERENCES "checkouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "ledger_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ---------------------------------------------------------------- numbering
CREATE SEQUENCE "checkout_number_seq" START 1001;
CREATE SEQUENCE "order_number_seq" START 1001;

-- ---------------------------------------------------------------- foreign keys to existing tables
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_workspace_fk" FOREIGN KEY ("buyer_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT;
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_workspace_fk" FOREIGN KEY ("buyer_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT;
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_sku_fk" FOREIGN KEY ("sku_id") REFERENCES "skus"("id") ON DELETE RESTRICT;
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_fk" FOREIGN KEY ("added_by_id") REFERENCES "users"("id") ON DELETE RESTRICT;
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_workspace_fk" FOREIGN KEY ("buyer_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT;
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_company_fk" FOREIGN KEY ("buyer_company_id") REFERENCES "companies"("id") ON DELETE RESTRICT;
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_user_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT;
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_rfq_fk" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE RESTRICT;
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_quote_version_fk" FOREIGN KEY ("quote_version_id") REFERENCES "quote_versions"("id") ON DELETE RESTRICT;
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_workspace_fk" FOREIGN KEY ("buyer_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT;
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_company_fk" FOREIGN KEY ("buyer_company_id") REFERENCES "companies"("id") ON DELETE RESTRICT;
ALTER TABLE "orders" ADD CONSTRAINT "orders_seller_workspace_fk" FOREIGN KEY ("seller_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT;
ALTER TABLE "orders" ADD CONSTRAINT "orders_seller_company_fk" FOREIGN KEY ("seller_company_id") REFERENCES "companies"("id") ON DELETE RESTRICT;
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_sku_fk" FOREIGN KEY ("sku_id") REFERENCES "skus"("id") ON DELETE RESTRICT;
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT;
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_quote_version_fk" FOREIGN KEY ("quote_version_id") REFERENCES "quote_versions"("id") ON DELETE RESTRICT;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_sku_fk" FOREIGN KEY ("sku_id") REFERENCES "skus"("id") ON DELETE RESTRICT;

-- ---------------------------------------------------------------- invariants
ALTER TABLE "storefronts" ADD CONSTRAINT "storefronts_delivery_valid" CHECK (
  ("delivery_fee_fils" IS NULL OR "delivery_fee_fils" >= 0) AND ("delivery_days" IS NULL OR "delivery_days" BETWEEN 0 AND 365));
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_quantity_positive" CHECK ("quantity" > 0);
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_money_valid" CHECK (
  "merchandise_fils" >= 0 AND "shipping_fils" >= 0 AND "tax_fils" >= 0 AND
  "total_fils" = "merchandise_fils" + "shipping_fils" + "tax_fils" AND "currency" = 'AED' AND
  "commission_bps" BETWEEN 0 AND 10000);
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_source_consistent" CHECK (
  ("source" = 'QUOTE' AND "quote_version_id" IS NOT NULL AND "rfq_id" IS NOT NULL AND "reservation_expires_at" IS NULL) OR
  ("source" = 'CART' AND "quote_version_id" IS NULL AND "rfq_id" IS NULL AND "reservation_expires_at" IS NOT NULL));
ALTER TABLE "orders" ADD CONSTRAINT "orders_money_valid" CHECK (
  "merchandise_fils" >= 0 AND "shipping_fils" >= 0 AND "tax_fils" >= 0 AND "commission_fils" >= 0 AND
  "total_fils" = "merchandise_fils" + "shipping_fils" + "tax_fils" AND
  "seller_payable_fils" = "total_fils" - "commission_fils");
ALTER TABLE "orders" ADD CONSTRAINT "orders_no_self_trade" CHECK ("buyer_company_id" <> "seller_company_id");
ALTER TABLE "order_lines" ADD CONSTRAINT "order_lines_valid" CHECK (
  "quantity" > 0 AND "unit_price_fils" >= 0 AND "line_total_fils" = "unit_price_fils" * "quantity");
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_quantity_positive" CHECK ("quantity" > 0);
ALTER TABLE "payments" ADD CONSTRAINT "payments_amount_positive" CHECK ("amount_fils" > 0 AND "currency" = 'AED');
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_one_side" CHECK (
  ("debit_fils" > 0 AND "credit_fils" = 0) OR ("credit_fils" > 0 AND "debit_fils" = 0));

-- Every journal balances: checked at commit so all entries of a journal can be inserted first.
CREATE FUNCTION "ledger_journal_balanced"() RETURNS trigger AS $$
DECLARE d NUMERIC; c NUMERIC; n INTEGER;
BEGIN
  SELECT COALESCE(SUM("debit_fils"), 0), COALESCE(SUM("credit_fils"), 0), COUNT(*)
    INTO d, c, n FROM "ledger_entries" WHERE "journal_id" = NEW."journal_id";
  IF n < 2 OR d <> c THEN
    RAISE EXCEPTION 'ledger journal % is not balanced (debits %, credits %)', NEW."journal_id", d, c;
  END IF;
  RETURN NULL;
END $$ LANGUAGE plpgsql;
CREATE CONSTRAINT TRIGGER "ledger_entries_balanced" AFTER INSERT ON "ledger_entries"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "ledger_journal_balanced"();

-- Append-only records: reversals are new rows, never edits.
CREATE FUNCTION "reject_change"() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "ledger_entries_append_only" BEFORE UPDATE OR DELETE ON "ledger_entries" FOR EACH ROW EXECUTE FUNCTION "reject_change"();
CREATE TRIGGER "ledger_journals_append_only" BEFORE UPDATE OR DELETE ON "ledger_journals" FOR EACH ROW EXECUTE FUNCTION "reject_change"();
CREATE TRIGGER "order_events_append_only" BEFORE UPDATE OR DELETE ON "order_events" FOR EACH ROW EXECUTE FUNCTION "reject_change"();
CREATE TRIGGER "order_lines_immutable" BEFORE UPDATE OR DELETE ON "order_lines" FOR EACH ROW EXECUTE FUNCTION "reject_change"();
