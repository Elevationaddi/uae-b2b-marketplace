-- Phase 8 (founder decisions, conflicts C-16 and C-17): support tickets are limited per company
-- (default 10 open, admin exceptions per company), urgent security and compliance cases are never
-- blocked, and resolved tickets close automatically after 7 days. Additive only.

ALTER TYPE "SupportCategory" ADD VALUE IF NOT EXISTS 'SECURITY';
ALTER TYPE "SupportCategory" ADD VALUE IF NOT EXISTS 'COMPLIANCE';

-- Per-company exception to the open-ticket limit, set by support managers with a reason (audited).
ALTER TABLE "companies" ADD COLUMN "support_ticket_limit" INTEGER;
ALTER TABLE "companies" ADD CONSTRAINT "companies_support_ticket_limit_range" CHECK ("support_ticket_limit" IS NULL OR "support_ticket_limit" BETWEEN 1 AND 100);

-- Finding resolved tickets due for automatic closure.
CREATE INDEX "support_tickets_resolved_at_idx" ON "support_tickets" ("resolved_at") WHERE "state" = 'RESOLVED';
