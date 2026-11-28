-- Phase 8 (founder decision F05, conflicts C-08 and C-09): supplier VAT registration status and
-- configurable tax treatment. Additive only. No tax is calculated differently until the
-- operator switches TAX_TREATMENT, and binding invoices stay disabled until professional approval.

CREATE TYPE "VatRegistrationStatus" AS ENUM ('UNKNOWN', 'REGISTERED', 'NOT_REGISTERED');

ALTER TABLE "companies"
  ADD COLUMN "vat_status" "VatRegistrationStatus" NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN "vat_status_confirmed_at" TIMESTAMPTZ(3),
  ADD COLUMN "vat_status_confirmed_by_id" UUID;
-- A registered supplier must have a 15-digit TRN; a confirmation names who confirmed it.
ALTER TABLE "companies" ADD CONSTRAINT "companies_registered_has_trn" CHECK ("vat_status" <> 'REGISTERED' OR "trn" ~ '^[0-9]{15}$');
ALTER TABLE "companies" ADD CONSTRAINT "companies_vat_confirmation_complete" CHECK (("vat_status_confirmed_at" IS NULL) = ("vat_status_confirmed_by_id" IS NULL));

-- Companies that already gave a TRN are recorded as declaring registration (not confirmed).
UPDATE "companies" SET "vat_status" = 'REGISTERED' WHERE "trn" ~ '^[0-9]{15}$' AND "vat_status" = 'UNKNOWN';
