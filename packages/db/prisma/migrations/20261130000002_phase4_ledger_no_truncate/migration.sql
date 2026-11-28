-- Phase 4: the ledger and order history also refuse TRUNCATE (statement-level guard).
CREATE TRIGGER "ledger_entries_no_truncate" BEFORE TRUNCATE ON "ledger_entries"
  FOR EACH STATEMENT EXECUTE FUNCTION "reject_change"();
CREATE TRIGGER "ledger_journals_no_truncate" BEFORE TRUNCATE ON "ledger_journals"
  FOR EACH STATEMENT EXECUTE FUNCTION "reject_change"();
CREATE TRIGGER "order_events_no_truncate" BEFORE TRUNCATE ON "order_events"
  FOR EACH STATEMENT EXECUTE FUNCTION "reject_change"();
