-- Phase 8 (C-14, founder FD-10 C): structured buyer counteroffers, at most 3 rounds per quote.
-- Additive only. Rows are append-only (no update or delete from the application).
CREATE TABLE "quote_counteroffers" (
  "id" UUID NOT NULL,
  "quote_id" UUID NOT NULL,
  "quote_version_id" UUID NOT NULL,
  "round" INTEGER NOT NULL,
  "unit_price_fils" BIGINT,
  "quantity" INTEGER,
  "delivery_date" DATE,
  "note" TEXT,
  "created_by_id" UUID NOT NULL,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "quote_counteroffers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "quote_counteroffers_round_check" CHECK ("round" BETWEEN 1 AND 10),
  CONSTRAINT "quote_counteroffers_price_check" CHECK ("unit_price_fils" IS NULL OR "unit_price_fils" > 0),
  CONSTRAINT "quote_counteroffers_quantity_check" CHECK ("quantity" IS NULL OR "quantity" > 0)
);
CREATE UNIQUE INDEX "quote_counteroffers_quote_id_round_key" ON "quote_counteroffers"("quote_id", "round");
ALTER TABLE "quote_counteroffers" ADD CONSTRAINT "quote_counteroffers_quote_id_fkey"
  FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "quote_counteroffers" ADD CONSTRAINT "quote_counteroffers_quote_version_id_fkey"
  FOREIGN KEY ("quote_version_id") REFERENCES "quote_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
