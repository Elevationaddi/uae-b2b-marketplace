-- Phase 8 (founder decisions of 28 November 2026, C-10, FD-08): delivery fee per emirate, free
-- buyer collection with collection instructions, the chosen delivery method recorded on each
-- order, and proof of dispatch. Additive only: the Phase 4 flat-fee columns stay (unused) and
-- their values are copied into the per-emirate rates.

ALTER TABLE "storefronts"
  ADD COLUMN "delivery_rates" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "collection_enabled" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "collection_emirate" "Emirate",
  ADD COLUMN "collection_instructions_en" TEXT,
  ADD COLUMN "collection_instructions_ar" TEXT,
  ADD COLUMN "collection_days" INTEGER;
ALTER TABLE "storefronts" ADD CONSTRAINT "storefronts_delivery_rates_array"
  CHECK (jsonb_typeof("delivery_rates") = 'array');
ALTER TABLE "storefronts" ADD CONSTRAINT "storefronts_collection_complete"
  CHECK (NOT "collection_enabled"
    OR ("collection_emirate" IS NOT NULL AND "collection_instructions_en" IS NOT NULL));
ALTER TABLE "storefronts" ADD CONSTRAINT "storefronts_collection_days_range"
  CHECK ("collection_days" IS NULL OR "collection_days" BETWEEN 0 AND 90);

UPDATE "storefronts" s SET "delivery_rates" = (
  SELECT jsonb_agg(jsonb_build_object(
    'emirate', e::text, 'fee_fils', s."delivery_fee_fils"::text, 'days', s."delivery_days")
    ORDER BY e::text)
  FROM unnest(s."delivery_emirates") AS e)
WHERE s."delivery_fee_fils" IS NOT NULL AND cardinality(s."delivery_emirates") > 0;

-- DELIVERY: supplier delivers at the per-emirate fee; COLLECTION: buyer collects, free;
-- QUOTE_TERMS: delivery charge agreed in an accepted quote.
ALTER TABLE "orders" ADD COLUMN "delivery_method" TEXT NOT NULL DEFAULT 'DELIVERY';
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_method_valid"
  CHECK ("delivery_method" IN ('DELIVERY', 'COLLECTION', 'QUOTE_TERMS'));

ALTER TABLE "shipments" ADD COLUMN "dispatch_proof_file_id" UUID;
