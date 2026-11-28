-- Phase 6: support tickets, scoped report exports, marketing consent. Additive only.

CREATE TYPE "SupportTicketState" AS ENUM ('OPEN', 'ASSIGNED', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED');
CREATE TYPE "SupportCategory" AS ENUM ('ACCOUNT', 'VERIFICATION', 'ORDER', 'PAYMENT', 'RFQ', 'CATALOG', 'OTHER');
CREATE TYPE "ExportState" AS ENUM ('READY', 'EXPIRED');

ALTER TABLE "notification_preferences"
  ADD COLUMN "email_marketing" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "marketing_consent_at" TIMESTAMPTZ(3);

CREATE SEQUENCE "support_ticket_number_seq" START 1001;

CREATE TABLE "support_tickets" (
  "id" UUID NOT NULL,
  "number" TEXT NOT NULL,
  "workspace_id" UUID NOT NULL,
  "company_id" UUID NOT NULL,
  "opened_by_id" UUID NOT NULL,
  "category" "SupportCategory" NOT NULL,
  "subject" TEXT NOT NULL,
  "state" "SupportTicketState" NOT NULL DEFAULT 'OPEN',
  "order_id" UUID,
  "rfq_id" UUID,
  "assigned_admin_id" UUID,
  "version" INTEGER NOT NULL DEFAULT 1,
  "last_customer_at" TIMESTAMPTZ(3),
  "last_admin_at" TIMESTAMPTZ(3),
  "resolved_at" TIMESTAMPTZ(3),
  "closed_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "support_tickets_subject_length" CHECK (char_length("subject") BETWEEN 1 AND 160)
);
CREATE UNIQUE INDEX "support_tickets_number_key" ON "support_tickets"("number");
CREATE INDEX "support_tickets_workspace_id_created_at_idx" ON "support_tickets"("workspace_id", "created_at");
CREATE INDEX "support_tickets_state_created_at_idx" ON "support_tickets"("state", "created_at");
CREATE INDEX "support_tickets_assigned_admin_id_state_idx" ON "support_tickets"("assigned_admin_id", "state");

CREATE TABLE "support_messages" (
  "id" UUID NOT NULL,
  "ticket_id" UUID NOT NULL,
  "author_id" UUID NOT NULL,
  "author_side" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "support_messages_side_valid" CHECK ("author_side" IN ('CUSTOMER', 'ADMIN', 'SYSTEM')),
  CONSTRAINT "support_messages_body_length" CHECK (char_length("body") BETWEEN 1 AND 4000)
);
CREATE INDEX "support_messages_ticket_id_created_at_idx" ON "support_messages"("ticket_id", "created_at");

CREATE TABLE "export_jobs" (
  "id" UUID NOT NULL,
  "requested_by_id" UUID NOT NULL,
  "report_type" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "filters" JSONB NOT NULL DEFAULT '{}',
  "reason" TEXT NOT NULL,
  "row_count" INTEGER NOT NULL,
  "content" BYTEA,
  "sha256" TEXT NOT NULL,
  "state" "ExportState" NOT NULL DEFAULT 'READY',
  "expires_at" TIMESTAMPTZ(3) NOT NULL,
  "downloaded_at" TIMESTAMPTZ(3),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "export_jobs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "export_jobs_scope_valid" CHECK ("scope" IN ('assigned', 'all')),
  CONSTRAINT "export_jobs_rows_nonnegative" CHECK ("row_count" >= 0),
  CONSTRAINT "export_jobs_expired_has_no_content" CHECK ("state" = 'READY' OR "content" IS NULL)
);
CREATE INDEX "export_jobs_requested_by_id_created_at_idx" ON "export_jobs"("requested_by_id", "created_at");
CREATE INDEX "export_jobs_state_expires_at_idx" ON "export_jobs"("state", "expires_at");

ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_opened_by_id_fkey" FOREIGN KEY ("opened_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_admin_id_fkey" FOREIGN KEY ("assigned_admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "rfqs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "support_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "export_jobs" ADD CONSTRAINT "export_jobs_requested_by_id_fkey" FOREIGN KEY ("requested_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Support history is append-only.
CREATE TRIGGER "support_messages_append_only" BEFORE UPDATE OR DELETE ON "support_messages" FOR EACH ROW EXECUTE FUNCTION "reject_change"();
CREATE TRIGGER "support_messages_no_truncate" BEFORE TRUNCATE ON "support_messages" FOR EACH STATEMENT EXECUTE FUNCTION "reject_change"();
