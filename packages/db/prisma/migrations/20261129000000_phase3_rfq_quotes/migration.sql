-- Phase 3: RFQs, versioned quotes and award, scoped conversations, notifications, idempotency.
-- Generated DDL from schema.prisma followed by hand-written constraints and triggers.
-- Additive only: no existing column or table is altered destructively.

CREATE TYPE "RfqState" AS ENUM ('DRAFT', 'OPEN', 'AWARDED', 'CANCELLED', 'EXPIRED');

CREATE TYPE "RfqVisibility" AS ENUM ('POOL', 'INVITE');

CREATE TYPE "QuoteState" AS ENUM ('DRAFT', 'SUBMITTED', 'ACCEPTED', 'DECLINED', 'WITHDRAWN', 'EXPIRED');

CREATE TYPE "QuoteVersionState" AS ENUM ('DRAFT', 'SUBMITTED', 'SUPERSEDED', 'ACCEPTED', 'DECLINED', 'WITHDRAWN', 'EXPIRED');

CREATE TYPE "TaxCode" AS ENUM ('STANDARD', 'ZERO_RATED', 'EXEMPT');

ALTER TYPE "FilePurpose" ADD VALUE 'RFQ_ATTACHMENT';

ALTER TYPE "FilePurpose" ADD VALUE 'QUOTE_ATTACHMENT';

ALTER TYPE "FilePurpose" ADD VALUE 'MESSAGE_ATTACHMENT';

CREATE TABLE "rfqs" (
    "id" UUID NOT NULL,
    "number" TEXT NOT NULL,
    "buyer_workspace_id" UUID NOT NULL,
    "buyer_company_id" UUID NOT NULL,
    "created_by_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "category_id" UUID NOT NULL,
    "specs" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" "QuantityUnit" NOT NULL,
    "target_date" DATE NOT NULL,
    "emirate" "Emirate" NOT NULL,
    "budget_fils" BIGINT,
    "deadline" TIMESTAMPTZ(3) NOT NULL,
    "visibility" "RfqVisibility" NOT NULL DEFAULT 'POOL',
    "state" "RfqState" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "published_at" TIMESTAMPTZ(3),
    "closed_at" TIMESTAMPTZ(3),
    "cancel_reason" TEXT,
    "accepted_quote_version_id" UUID,
    "awarded_at" TIMESTAMPTZ(3),
    "payment_due_at" TIMESTAMPTZ(3),
    "admin_hidden_at" TIMESTAMPTZ(3),
    "admin_hidden_reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "rfqs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rfq_invites" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "seller_workspace_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfq_invites_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rfq_files" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfq_files_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quotes" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "seller_workspace_id" UUID NOT NULL,
    "seller_company_id" UUID NOT NULL,
    "state" "QuoteState" NOT NULL DEFAULT 'DRAFT',
    "current_version_id" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quote_versions" (
    "id" UUID NOT NULL,
    "quote_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" "QuantityUnit" NOT NULL,
    "unit_price_fils" BIGINT NOT NULL,
    "subtotal_fils" BIGINT NOT NULL,
    "shipping_fils" BIGINT NOT NULL,
    "tax_code" "TaxCode" NOT NULL,
    "tax_bps" INTEGER NOT NULL,
    "tax_fils" BIGINT NOT NULL,
    "total_fils" BIGINT NOT NULL,
    "specs" TEXT NOT NULL,
    "deviations" TEXT,
    "lead_days" INTEGER NOT NULL,
    "delivery_date" DATE NOT NULL,
    "valid_until" TIMESTAMPTZ(3) NOT NULL,
    "terms" TEXT,
    "state" "QuoteVersionState" NOT NULL DEFAULT 'DRAFT',
    "submitted_at" TIMESTAMPTZ(3),
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "quote_versions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "quote_files" (
    "id" UUID NOT NULL,
    "quote_version_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_files_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rfq_events" (
    "id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "quote_id" UUID,
    "quote_version_id" UUID,
    "kind" TEXT NOT NULL,
    "actor_side" TEXT NOT NULL,
    "actor_id" UUID,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rfq_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "conversations" (
    "id" UUID NOT NULL,
    "buyer_workspace_id" UUID NOT NULL,
    "seller_workspace_id" UUID NOT NULL,
    "rfq_id" UUID,
    "last_message_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "sender_workspace_id" UUID NOT NULL,
    "body" TEXT,
    "file_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "read_receipts" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "last_read_message_id" UUID,
    "last_read_at" TIMESTAMPTZ(3),

    CONSTRAINT "read_receipts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "read_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notification_preferences" (
    "user_id" UUID NOT NULL,
    "email_rfqs" BOOLEAN NOT NULL DEFAULT true,
    "email_quotes" BOOLEAN NOT NULL DEFAULT true,
    "email_messages" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("user_id")
);

CREATE TABLE "idempotency_keys" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "request_hash" TEXT NOT NULL,
    "status_code" INTEGER NOT NULL,
    "response" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "idempotency_keys_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "rfqs_number_key" ON "rfqs"("number");

CREATE UNIQUE INDEX "rfqs_accepted_quote_version_id_key" ON "rfqs"("accepted_quote_version_id");

CREATE INDEX "rfqs_buyer_workspace_id_state_idx" ON "rfqs"("buyer_workspace_id", "state");

CREATE INDEX "rfqs_category_id_state_deadline_idx" ON "rfqs"("category_id", "state", "deadline");

CREATE INDEX "rfqs_state_deadline_idx" ON "rfqs"("state", "deadline");

CREATE INDEX "rfq_invites_seller_workspace_id_idx" ON "rfq_invites"("seller_workspace_id");

CREATE UNIQUE INDEX "rfq_invites_rfq_id_seller_workspace_id_key" ON "rfq_invites"("rfq_id", "seller_workspace_id");

CREATE UNIQUE INDEX "rfq_files_file_id_key" ON "rfq_files"("file_id");

CREATE INDEX "rfq_files_rfq_id_idx" ON "rfq_files"("rfq_id");

CREATE UNIQUE INDEX "quotes_current_version_id_key" ON "quotes"("current_version_id");

CREATE INDEX "quotes_seller_workspace_id_state_idx" ON "quotes"("seller_workspace_id", "state");

CREATE UNIQUE INDEX "quotes_rfq_id_seller_workspace_id_key" ON "quotes"("rfq_id", "seller_workspace_id");

CREATE UNIQUE INDEX "quote_versions_quote_id_version_key" ON "quote_versions"("quote_id", "version");

CREATE INDEX "quote_files_file_id_idx" ON "quote_files"("file_id");

CREATE UNIQUE INDEX "quote_files_quote_version_id_file_id_key" ON "quote_files"("quote_version_id", "file_id");

CREATE INDEX "rfq_events_rfq_id_created_at_idx" ON "rfq_events"("rfq_id", "created_at");

CREATE INDEX "rfq_events_quote_id_created_at_idx" ON "rfq_events"("quote_id", "created_at");

CREATE INDEX "conversations_buyer_workspace_id_last_message_at_idx" ON "conversations"("buyer_workspace_id", "last_message_at");

CREATE INDEX "conversations_seller_workspace_id_last_message_at_idx" ON "conversations"("seller_workspace_id", "last_message_at");

CREATE UNIQUE INDEX "messages_file_id_key" ON "messages"("file_id");

CREATE INDEX "messages_conversation_id_created_at_idx" ON "messages"("conversation_id", "created_at");

CREATE UNIQUE INDEX "read_receipts_conversation_id_user_id_key" ON "read_receipts"("conversation_id", "user_id");

CREATE INDEX "notifications_user_id_read_at_created_at_idx" ON "notifications"("user_id", "read_at", "created_at");

CREATE INDEX "idempotency_keys_created_at_idx" ON "idempotency_keys"("created_at");

CREATE UNIQUE INDEX "idempotency_keys_user_id_key_key" ON "idempotency_keys"("user_id", "key");

ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_buyer_workspace_id_fkey" FOREIGN KEY ("buyer_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "rfqs" ADD CONSTRAINT "rfqs_accepted_quote_version_id_fkey" FOREIGN KEY ("accepted_quote_version_id") REFERENCES "quote_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "rfq_invites" ADD CONSTRAINT "rfq_invites_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rfq_invites" ADD CONSTRAINT "rfq_invites_seller_workspace_id_fkey" FOREIGN KEY ("seller_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "rfq_files" ADD CONSTRAINT "rfq_files_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "rfq_files" ADD CONSTRAINT "rfq_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "quotes" ADD CONSTRAINT "quotes_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "quotes" ADD CONSTRAINT "quotes_seller_workspace_id_fkey" FOREIGN KEY ("seller_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "quotes" ADD CONSTRAINT "quotes_current_version_id_fkey" FOREIGN KEY ("current_version_id") REFERENCES "quote_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "quote_versions" ADD CONSTRAINT "quote_versions_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "quote_files" ADD CONSTRAINT "quote_files_quote_version_id_fkey" FOREIGN KEY ("quote_version_id") REFERENCES "quote_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "quote_files" ADD CONSTRAINT "quote_files_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "rfq_events" ADD CONSTRAINT "rfq_events_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "rfq_events" ADD CONSTRAINT "rfq_events_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "conversations" ADD CONSTRAINT "conversations_buyer_workspace_id_fkey" FOREIGN KEY ("buyer_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "conversations" ADD CONSTRAINT "conversations_seller_workspace_id_fkey" FOREIGN KEY ("seller_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "conversations" ADD CONSTRAINT "conversations_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "messages" ADD CONSTRAINT "messages_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "read_receipts" ADD CONSTRAINT "read_receipts_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ---------------------------------------------------------------- hand-written constraints

CREATE SEQUENCE "rfq_number_seq" START 1001;

ALTER TABLE "rfqs"
  ADD CONSTRAINT "rfqs_quantity_positive" CHECK ("quantity" > 0),
  ADD CONSTRAINT "rfqs_budget_nonnegative" CHECK ("budget_fils" IS NULL OR "budget_fils" >= 0),
  ADD CONSTRAINT "rfqs_award_consistent" CHECK (("state" = 'AWARDED') = ("accepted_quote_version_id" IS NOT NULL));

ALTER TABLE "quote_versions"
  ADD CONSTRAINT "quote_versions_quantity_positive" CHECK ("quantity" > 0),
  ADD CONSTRAINT "quote_versions_money_nonnegative" CHECK (
    "unit_price_fils" >= 0 AND "subtotal_fils" >= 0 AND "shipping_fils" >= 0
    AND "tax_fils" >= 0 AND "total_fils" >= 0 AND "tax_bps" >= 0),
  ADD CONSTRAINT "quote_versions_total_sum" CHECK ("total_fils" = "subtotal_fils" + "shipping_fils" + "tax_fils"),
  ADD CONSTRAINT "quote_versions_lead_days" CHECK ("lead_days" >= 0 AND "lead_days" <= 730);

ALTER TABLE "messages"
  ADD CONSTRAINT "messages_body_or_file" CHECK ("body" IS NOT NULL OR "file_id" IS NOT NULL);

-- One general conversation per buyer/seller pair, and one per pair per RFQ.
CREATE UNIQUE INDEX "conversations_pair_general_key" ON "conversations" ("buyer_workspace_id", "seller_workspace_id") WHERE "rfq_id" IS NULL;
CREATE UNIQUE INDEX "conversations_pair_rfq_key" ON "conversations" ("buyer_workspace_id", "seller_workspace_id", "rfq_id") WHERE "rfq_id" IS NOT NULL;

-- A submitted quote version is an immutable snapshot (T23): only its state may change, and an
-- accepted version may not change at all.
CREATE FUNCTION "quote_versions_immutable"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD."state" = 'DRAFT' THEN
    RETURN NEW;
  END IF;
  IF OLD."state" = 'ACCEPTED' THEN
    RAISE EXCEPTION 'quote version % is accepted and immutable', OLD."id" USING ERRCODE = 'check_violation';
  END IF;
  IF (NEW."quote_id", NEW."version", NEW."quantity", NEW."unit", NEW."unit_price_fils", NEW."subtotal_fils",
      NEW."shipping_fils", NEW."tax_code", NEW."tax_bps", NEW."tax_fils", NEW."total_fils", NEW."specs",
      NEW."deviations", NEW."lead_days", NEW."delivery_date", NEW."valid_until", NEW."terms", NEW."submitted_at")
     IS DISTINCT FROM
     (OLD."quote_id", OLD."version", OLD."quantity", OLD."unit", OLD."unit_price_fils", OLD."subtotal_fils",
      OLD."shipping_fils", OLD."tax_code", OLD."tax_bps", OLD."tax_fils", OLD."total_fils", OLD."specs",
      OLD."deviations", OLD."lead_days", OLD."delivery_date", OLD."valid_until", OLD."terms", OLD."submitted_at") THEN
    RAISE EXCEPTION 'quote version % is submitted and immutable', OLD."id" USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER "quote_versions_immutable" BEFORE UPDATE ON "quote_versions"
  FOR EACH ROW EXECUTE FUNCTION "quote_versions_immutable"();

CREATE FUNCTION "quote_versions_no_delete"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD."state" <> 'DRAFT' THEN
    RAISE EXCEPTION 'quote version % cannot be deleted', OLD."id" USING ERRCODE = 'check_violation';
  END IF;
  RETURN OLD;
END $$;
CREATE TRIGGER "quote_versions_no_delete" BEFORE DELETE ON "quote_versions"
  FOR EACH ROW EXECUTE FUNCTION "quote_versions_no_delete"();

-- RFQ timeline is append-only.
CREATE FUNCTION "rfq_events_append_only"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'rfq_events is append-only' USING ERRCODE = 'check_violation';
END $$;
CREATE TRIGGER "rfq_events_append_only" BEFORE UPDATE OR DELETE ON "rfq_events"
  FOR EACH ROW EXECUTE FUNCTION "rfq_events_append_only"();
