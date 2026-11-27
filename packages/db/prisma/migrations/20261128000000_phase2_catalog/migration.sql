-- Phase 2: catalog, storefronts, inventory, moderation, buyer lists (A09–A12).
-- Generated DDL from schema.prisma followed by hand-written constraints, triggers and views.
-- Additive only: no existing column or table is altered destructively.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateEnum
CREATE TYPE "FilePurpose" AS ENUM ('VERIFICATION_DOCUMENT', 'PRODUCT_IMAGE', 'STOREFRONT_IMAGE', 'CATEGORY_IMAGE');

-- CreateEnum
CREATE TYPE "CategoryRestriction" AS ENUM ('OPEN', 'REVIEW_REQUIRED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('TEXT', 'NUMBER', 'SELECT', 'BOOLEAN');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('MANUFACTURER', 'FACTORY', 'WHOLESALER', 'DISTRIBUTOR', 'IMPORTER', 'AUTHORIZED_DISTRIBUTOR', 'TRADING_COMPANY');

-- CreateEnum
CREATE TYPE "StorefrontStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "StorefrontMediaKind" AS ENUM ('LOGO', 'COVER', 'FACTORY', 'WAREHOUSE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'SUSPENDED', 'ARCHIVED', 'REMOVED');

-- CreateEnum
CREATE TYPE "VersionState" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'SUPERSEDED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "FulfilmentMode" AS ENUM ('READY_STOCK', 'MADE_TO_ORDER');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('FIXED', 'TIERED', 'QUOTE_ONLY');

-- CreateEnum
CREATE TYPE "QuantityUnit" AS ENUM ('PIECE', 'CARTON', 'BOX', 'PACK', 'SET', 'PAIR', 'ROLL', 'DOZEN');

-- CreateEnum
CREATE TYPE "StockMovementKind" AS ENUM ('RECEIVE', 'REMOVE', 'MARK_UNAVAILABLE', 'RELEASE_UNAVAILABLE', 'SET_ON_HAND');

-- CreateEnum
CREATE TYPE "RestrictedAction" AS ENUM ('BLOCK', 'REVIEW');

-- CreateEnum
CREATE TYPE "FeaturedKind" AS ENUM ('PRODUCT', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "ListingView" AS ENUM ('GRID', 'LIST');

-- AlterEnum
ALTER TYPE "FileVisibility" ADD VALUE 'MEDIA';

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "height" INTEGER,
ADD COLUMN     "purpose" "FilePurpose" NOT NULL DEFAULT 'VERIFICATION_DOCUMENT',
ADD COLUMN     "width" INTEGER;

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "parent_id" UUID,
    "slug" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "description_en" TEXT,
    "description_ar" TEXT,
    "image_file_id" UUID,
    "position" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "priority" BOOLEAN NOT NULL DEFAULT false,
    "restriction" "CategoryRestriction" NOT NULL DEFAULT 'OPEN',
    "requirements_en" TEXT,
    "requirements_ar" TEXT,
    "archived_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_attributes" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "label_en" TEXT NOT NULL,
    "label_ar" TEXT NOT NULL,
    "type" "AttributeType" NOT NULL,
    "options" JSONB NOT NULL DEFAULT '[]',
    "unit" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "filterable" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "category_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storefronts" (
    "id" UUID NOT NULL,
    "seller_workspace_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "status" "StorefrontStatus" NOT NULL DEFAULT 'DRAFT',
    "business_type" "BusinessType",
    "description_en" TEXT,
    "description_ar" TEXT,
    "year_established" INTEGER,
    "city" TEXT,
    "specialization_en" TEXT,
    "specialization_ar" TEXT,
    "capabilities_en" TEXT,
    "capabilities_ar" TEXT,
    "production_capacity" TEXT,
    "customization_services" BOOLEAN NOT NULL DEFAULT false,
    "private_label" BOOLEAN NOT NULL DEFAULT false,
    "white_label" BOOLEAN NOT NULL DEFAULT false,
    "samples_available" BOOLEAN NOT NULL DEFAULT false,
    "fulfilment_en" TEXT,
    "fulfilment_ar" TEXT,
    "certifications" JSONB NOT NULL DEFAULT '[]',
    "published_at" TIMESTAMPTZ(3),
    "admin_hidden_at" TIMESTAMPTZ(3),
    "admin_hidden_reason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "storefronts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storefront_media" (
    "id" UUID NOT NULL,
    "storefront_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "kind" "StorefrontMediaKind" NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "caption_en" TEXT,
    "caption_ar" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storefront_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "seller_workspace_id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "status_before_suspension" "ProductStatus",
    "status_reason" TEXT,
    "price_type" "PriceType" NOT NULL DEFAULT 'FIXED',
    "published_version_id" UUID,
    "working_version_id" UUID,
    "min_price_fils" BIGINT,
    "min_moq" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by_id" UUID NOT NULL,
    "first_published_at" TIMESTAMPTZ(3),
    "published_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_versions" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "state" "VersionState" NOT NULL DEFAULT 'DRAFT',
    "title_en" TEXT NOT NULL,
    "title_ar" TEXT,
    "description_en" TEXT NOT NULL DEFAULT '',
    "description_ar" TEXT,
    "category_id" UUID NOT NULL,
    "mode" "FulfilmentMode" NOT NULL DEFAULT 'READY_STOCK',
    "attributes" JSONB NOT NULL DEFAULT '{}',
    "specifications" JSONB NOT NULL DEFAULT '[]',
    "materials" TEXT,
    "dimensions" TEXT,
    "country_of_origin" TEXT,
    "lead_time_min_days" INTEGER,
    "lead_time_max_days" INTEGER,
    "fulfilment_days" INTEGER,
    "custom_manufacturing" BOOLEAN NOT NULL DEFAULT false,
    "private_label" BOOLEAN NOT NULL DEFAULT false,
    "white_label" BOOLEAN NOT NULL DEFAULT false,
    "samples_available" BOOLEAN NOT NULL DEFAULT false,
    "sample_note" TEXT,
    "certifications" JSONB NOT NULL DEFAULT '[]',
    "video_url" TEXT,
    "search_text" TEXT,
    "auto_flags" JSONB NOT NULL DEFAULT '[]',
    "created_by_id" UUID NOT NULL,
    "submitted_at" TIMESTAMPTZ(3),
    "submitted_by_id" UUID,
    "decided_at" TIMESTAMPTZ(3),
    "decided_by_id" UUID,
    "decision_reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "product_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_media" (
    "id" UUID NOT NULL,
    "product_version_id" UUID NOT NULL,
    "file_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "alt_en" TEXT,
    "alt_ar" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skus" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "seller_workspace_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "variant_attributes" JSONB NOT NULL DEFAULT '{}',
    "unit" "QuantityUnit" NOT NULL DEFAULT 'PIECE',
    "moq" INTEGER NOT NULL DEFAULT 1,
    "order_increment" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "approved_at" TIMESTAMPTZ(3),
    "low_stock_threshold" INTEGER NOT NULL DEFAULT 0,
    "restock_at" DATE,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "skus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_tiers" (
    "id" UUID NOT NULL,
    "sku_id" UUID NOT NULL,
    "min_qty" INTEGER NOT NULL,
    "unit_price_fils" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "price_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" UUID NOT NULL,
    "sku_id" UUID NOT NULL,
    "on_hand" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "unavailable" INTEGER NOT NULL DEFAULT 0,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" UUID NOT NULL,
    "sku_id" UUID NOT NULL,
    "actor_id" UUID,
    "kind" "StockMovementKind" NOT NULL,
    "delta_on_hand" INTEGER NOT NULL,
    "delta_reserved" INTEGER NOT NULL DEFAULT 0,
    "delta_unavailable" INTEGER NOT NULL DEFAULT 0,
    "on_hand_after" INTEGER NOT NULL,
    "reserved_after" INTEGER NOT NULL,
    "unavailable_after" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "reference_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moderation_events" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "product_version_id" UUID,
    "storefront_id" UUID,
    "actor_id" UUID,
    "actor_type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "from_state" TEXT,
    "to_state" TEXT,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moderation_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restricted_terms" (
    "id" UUID NOT NULL,
    "term" TEXT NOT NULL,
    "normalized" TEXT NOT NULL,
    "action" "RestrictedAction" NOT NULL,
    "category_id" UUID,
    "note" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_by_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "restricted_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "product_id" UUID,
    "storefront_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comparison_items" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comparison_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recently_viewed" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "viewed_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recently_viewed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_preferences" (
    "user_id" UUID NOT NULL,
    "category_ids" JSONB NOT NULL DEFAULT '[]',
    "emirates" JSONB NOT NULL DEFAULT '[]',
    "default_view" "ListingView" NOT NULL DEFAULT 'GRID',
    "default_sort" TEXT NOT NULL DEFAULT 'relevance',
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "marketplace_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "featured_listings" (
    "id" UUID NOT NULL,
    "kind" "FeaturedKind" NOT NULL,
    "product_id" UUID,
    "storefront_id" UUID,
    "position" INTEGER NOT NULL DEFAULT 0,
    "starts_at" TIMESTAMPTZ(3),
    "ends_at" TIMESTAMPTZ(3),
    "reason" TEXT NOT NULL,
    "created_by_id" UUID NOT NULL,
    "removed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "featured_listings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parent_id_position_idx" ON "categories"("parent_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "category_attributes_category_id_key_key" ON "category_attributes"("category_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "storefronts_seller_workspace_id_key" ON "storefronts"("seller_workspace_id");

-- CreateIndex
CREATE INDEX "storefronts_status_idx" ON "storefronts"("status");

-- CreateIndex
CREATE INDEX "storefront_media_storefront_id_kind_position_idx" ON "storefront_media"("storefront_id", "kind", "position");

-- CreateIndex
CREATE UNIQUE INDEX "products_published_version_id_key" ON "products"("published_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_working_version_id_key" ON "products"("working_version_id");

-- CreateIndex
CREATE INDEX "products_seller_workspace_id_status_idx" ON "products"("seller_workspace_id", "status");

-- CreateIndex
CREATE INDEX "products_status_published_at_idx" ON "products"("status", "published_at");

-- CreateIndex
CREATE INDEX "product_versions_state_submitted_at_idx" ON "product_versions"("state", "submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "product_versions_product_id_version_key" ON "product_versions"("product_id", "version");

-- CreateIndex
CREATE INDEX "product_media_product_version_id_position_idx" ON "product_media"("product_version_id", "position");

-- CreateIndex
CREATE INDEX "product_media_file_id_idx" ON "product_media"("file_id");

-- CreateIndex
CREATE INDEX "skus_product_id_idx" ON "skus"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "skus_seller_workspace_id_code_key" ON "skus"("seller_workspace_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "price_tiers_sku_id_min_qty_key" ON "price_tiers"("sku_id", "min_qty");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_sku_id_key" ON "inventory"("sku_id");

-- CreateIndex
CREATE INDEX "stock_movements_sku_id_created_at_idx" ON "stock_movements"("sku_id", "created_at");

-- CreateIndex
CREATE INDEX "moderation_events_product_id_created_at_idx" ON "moderation_events"("product_id", "created_at");

-- CreateIndex
CREATE INDEX "moderation_events_storefront_id_created_at_idx" ON "moderation_events"("storefront_id", "created_at");

-- CreateIndex
CREATE INDEX "restricted_terms_active_idx" ON "restricted_terms"("active");

-- CreateIndex
CREATE INDEX "saved_items_user_id_created_at_idx" ON "saved_items"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "comparison_items_user_id_product_id_key" ON "comparison_items"("user_id", "product_id");

-- CreateIndex
CREATE INDEX "recently_viewed_user_id_viewed_at_idx" ON "recently_viewed"("user_id", "viewed_at");

-- CreateIndex
CREATE UNIQUE INDEX "recently_viewed_user_id_product_id_key" ON "recently_viewed"("user_id", "product_id");

-- CreateIndex
CREATE INDEX "featured_listings_kind_removed_at_position_idx" ON "featured_listings"("kind", "removed_at", "position");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storefronts" ADD CONSTRAINT "storefronts_seller_workspace_id_fkey" FOREIGN KEY ("seller_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "storefront_media" ADD CONSTRAINT "storefront_media_storefront_id_fkey" FOREIGN KEY ("storefront_id") REFERENCES "storefronts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_seller_workspace_id_fkey" FOREIGN KEY ("seller_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_published_version_id_fkey" FOREIGN KEY ("published_version_id") REFERENCES "product_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_working_version_id_fkey" FOREIGN KEY ("working_version_id") REFERENCES "product_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_product_version_id_fkey" FOREIGN KEY ("product_version_id") REFERENCES "product_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skus" ADD CONSTRAINT "skus_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_tiers" ADD CONSTRAINT "price_tiers_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_sku_id_fkey" FOREIGN KEY ("sku_id") REFERENCES "skus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ===================================================================================
-- Hand-written: normalisation, constraints, triggers, views
-- ===================================================================================

-- Search normalisation shared by the index (generated column) and every query, so Arabic and
-- English matching cannot drift: lower-case, strip Arabic diacritics/tatweel, unify alef/ta
-- marbuta/ya/hamza forms, Arabic-Indic digits -> ASCII, common Latin accents -> base letters.
CREATE FUNCTION "mkt_normalize"(input text) RETURNS text
LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT btrim(regexp_replace(
    translate(
      regexp_replace(lower(coalesce(input, '')), '[\u064B-\u065F\u0670\u0640]', '', 'g'),
      'أإآٱةىؤئ٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹áàâäãåāéèêëēíìîïīóòôöõōúùûüūçñ',
      'ااااهيوي01234567890123456789aaaaaaaeeeeeiiiiioooooouuuuucn'),
    '\s+', ' ', 'g'))
$$;

ALTER TABLE "product_versions" DROP COLUMN "search_text";
ALTER TABLE "product_versions" ADD COLUMN "search_text" text GENERATED ALWAYS AS (
  "mkt_normalize"(
    "title_en" || ' ' || coalesce("title_ar", '') || ' ' || coalesce("materials", '') || ' ' ||
    left("description_en", 4000) || ' ' || left(coalesce("description_ar", ''), 4000)
  )
) STORED;
CREATE INDEX "product_versions_search_trgm" ON "product_versions" USING gin ("search_text" gin_trgm_ops);
CREATE INDEX "product_versions_category_idx" ON "product_versions" ("category_id");

-- Foreign keys not modelled as Prisma relations
ALTER TABLE "categories" ADD CONSTRAINT "categories_image_file_fk" FOREIGN KEY ("image_file_id") REFERENCES "files"("id") ON DELETE RESTRICT;
ALTER TABLE "storefronts" ADD CONSTRAINT "storefronts_company_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT;
ALTER TABLE "storefront_media" ADD CONSTRAINT "storefront_media_file_fk" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT;
ALTER TABLE "products" ADD CONSTRAINT "products_company_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT;
ALTER TABLE "products" ADD CONSTRAINT "products_created_by_fk" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT;
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_file_fk" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT;
ALTER TABLE "skus" ADD CONSTRAINT "skus_workspace_fk" FOREIGN KEY ("seller_workspace_id") REFERENCES "workspaces"("id") ON DELETE RESTRICT;
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_actor_fk" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT;
ALTER TABLE "restricted_terms" ADD CONSTRAINT "restricted_terms_category_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_storefront_fk" FOREIGN KEY ("storefront_id") REFERENCES "storefronts"("id") ON DELETE CASCADE;
ALTER TABLE "comparison_items" ADD CONSTRAINT "comparison_items_user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "comparison_items" ADD CONSTRAINT "comparison_items_product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;
ALTER TABLE "recently_viewed" ADD CONSTRAINT "recently_viewed_user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "recently_viewed" ADD CONSTRAINT "recently_viewed_product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;
ALTER TABLE "marketplace_preferences" ADD CONSTRAINT "marketplace_preferences_user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "featured_listings" ADD CONSTRAINT "featured_listings_product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT;
ALTER TABLE "featured_listings" ADD CONSTRAINT "featured_listings_storefront_fk" FOREIGN KEY ("storefront_id") REFERENCES "storefronts"("id") ON DELETE RESTRICT;

-- Value constraints
ALTER TABLE "categories" ADD CONSTRAINT "categories_slug_format" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
ALTER TABLE "categories" ADD CONSTRAINT "categories_not_self_parent" CHECK ("parent_id" IS NULL OR "parent_id" <> "id");
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_key_format" CHECK ("key" ~ '^[a-z][a-z0-9_]{0,39}$');
ALTER TABLE "storefronts" ADD CONSTRAINT "storefronts_year" CHECK ("year_established" IS NULL OR "year_established" BETWEEN 1900 AND 2100);
ALTER TABLE "products" ADD CONSTRAINT "products_min_price_nonneg" CHECK ("min_price_fils" IS NULL OR "min_price_fils" >= 0);
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_lead_times" CHECK (
  ("lead_time_min_days" IS NULL OR "lead_time_min_days" >= 0) AND
  ("lead_time_max_days" IS NULL OR "lead_time_max_days" >= 0) AND
  ("lead_time_min_days" IS NULL OR "lead_time_max_days" IS NULL OR "lead_time_max_days" >= "lead_time_min_days") AND
  ("fulfilment_days" IS NULL OR "fulfilment_days" >= 0));
ALTER TABLE "product_versions" ADD CONSTRAINT "product_versions_origin" CHECK ("country_of_origin" IS NULL OR "country_of_origin" ~ '^[A-Z]{2}$');
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_version_position_key" UNIQUE ("product_version_id", "position") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_position_nonneg" CHECK ("position" >= 0);
ALTER TABLE "skus" ADD CONSTRAINT "skus_moq_positive" CHECK ("moq" > 0);
ALTER TABLE "skus" ADD CONSTRAINT "skus_increment_positive" CHECK ("order_increment" > 0);
ALTER TABLE "skus" ADD CONSTRAINT "skus_low_stock_nonneg" CHECK ("low_stock_threshold" >= 0);
ALTER TABLE "price_tiers" ADD CONSTRAINT "price_tiers_min_qty_positive" CHECK ("min_qty" > 0);
ALTER TABLE "price_tiers" ADD CONSTRAINT "price_tiers_price_nonneg" CHECK ("unit_price_fils" >= 0);
ALTER TABLE "price_tiers" ADD CONSTRAINT "price_tiers_currency_aed" CHECK ("currency" = 'AED');
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_nonnegative" CHECK (
  "on_hand" >= 0 AND "reserved" >= 0 AND "unavailable" >= 0 AND "sold" >= 0 AND
  "reserved" + "unavailable" <= "on_hand");
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_one_target" CHECK (num_nonnulls("product_id", "storefront_id") = 1);
CREATE UNIQUE INDEX "saved_items_user_product" ON "saved_items" ("user_id", "product_id") WHERE "product_id" IS NOT NULL;
CREATE UNIQUE INDEX "saved_items_user_storefront" ON "saved_items" ("user_id", "storefront_id") WHERE "storefront_id" IS NOT NULL;
ALTER TABLE "featured_listings" ADD CONSTRAINT "featured_listings_one_target" CHECK (
  ("kind" = 'PRODUCT' AND "product_id" IS NOT NULL AND "storefront_id" IS NULL) OR
  ("kind" = 'SUPPLIER' AND "storefront_id" IS NOT NULL AND "product_id" IS NULL));
ALTER TABLE "featured_listings" ADD CONSTRAINT "featured_listings_window" CHECK ("starts_at" IS NULL OR "ends_at" IS NULL OR "ends_at" > "starts_at");
CREATE UNIQUE INDEX "storefront_media_one_logo_cover" ON "storefront_media" ("storefront_id", "kind") WHERE "kind" IN ('LOGO', 'COVER');

-- Category tree: at most two levels, no cycles.
CREATE FUNCTION "categories_check_tree"() RETURNS trigger AS $$
BEGIN
  IF NEW."parent_id" IS NOT NULL THEN
    IF EXISTS (SELECT 1 FROM "categories" WHERE "id" = NEW."parent_id" AND "parent_id" IS NOT NULL) THEN
      RAISE EXCEPTION 'category depth exceeds two levels' USING ERRCODE = 'check_violation';
    END IF;
    IF EXISTS (SELECT 1 FROM "categories" WHERE "parent_id" = NEW."id") THEN
      RAISE EXCEPTION 'a category with subcategories cannot become a subcategory' USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "categories_check_tree_trg" BEFORE INSERT OR UPDATE OF "parent_id" ON "categories"
  FOR EACH ROW EXECUTE FUNCTION "categories_check_tree"();

-- Tenant consistency: product company = workspace company (seller workspace); SKU workspace = product workspace.
CREATE FUNCTION "products_check_tenant"() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "workspaces" w WHERE w."id" = NEW."seller_workspace_id"
                 AND w."company_id" = NEW."company_id" AND w."kind" = 'SELLER') THEN
    RAISE EXCEPTION 'product tenant mismatch' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "products_check_tenant_trg" BEFORE INSERT OR UPDATE OF "seller_workspace_id", "company_id" ON "products"
  FOR EACH ROW EXECUTE FUNCTION "products_check_tenant"();

CREATE FUNCTION "skus_check_tenant"() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "products" p WHERE p."id" = NEW."product_id"
                 AND p."seller_workspace_id" = NEW."seller_workspace_id") THEN
    RAISE EXCEPTION 'sku tenant mismatch' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "skus_check_tenant_trg" BEFORE INSERT OR UPDATE OF "product_id", "seller_workspace_id" ON "skus"
  FOR EACH ROW EXECUTE FUNCTION "skus_check_tenant"();

CREATE FUNCTION "storefronts_check_tenant"() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "workspaces" w WHERE w."id" = NEW."seller_workspace_id"
                 AND w."company_id" = NEW."company_id" AND w."kind" = 'SELLER') THEN
    RAISE EXCEPTION 'storefront tenant mismatch' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "storefronts_check_tenant_trg" BEFORE INSERT OR UPDATE OF "seller_workspace_id", "company_id" ON "storefronts"
  FOR EACH ROW EXECUTE FUNCTION "storefronts_check_tenant"();

-- Moderated content is immutable once it leaves DRAFT: only the moderation outcome may change.
CREATE FUNCTION "product_versions_freeze"() RETURNS trigger AS $$
BEGIN
  IF OLD."state" <> 'DRAFT' AND (
    NEW."product_id", NEW."version", NEW."title_en", NEW."title_ar", NEW."description_en", NEW."description_ar",
    NEW."category_id", NEW."mode", NEW."attributes", NEW."specifications", NEW."materials", NEW."dimensions",
    NEW."country_of_origin", NEW."lead_time_min_days", NEW."lead_time_max_days", NEW."fulfilment_days",
    NEW."custom_manufacturing", NEW."private_label", NEW."white_label", NEW."samples_available",
    NEW."sample_note", NEW."certifications", NEW."video_url"
  ) IS DISTINCT FROM (
    OLD."product_id", OLD."version", OLD."title_en", OLD."title_ar", OLD."description_en", OLD."description_ar",
    OLD."category_id", OLD."mode", OLD."attributes", OLD."specifications", OLD."materials", OLD."dimensions",
    OLD."country_of_origin", OLD."lead_time_min_days", OLD."lead_time_max_days", OLD."fulfilment_days",
    OLD."custom_manufacturing", OLD."private_label", OLD."white_label", OLD."samples_available",
    OLD."sample_note", OLD."certifications", OLD."video_url"
  ) THEN
    RAISE EXCEPTION 'product version % is % and its content is immutable', OLD."id", OLD."state"
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "product_versions_freeze_trg" BEFORE UPDATE ON "product_versions"
  FOR EACH ROW EXECUTE FUNCTION "product_versions_freeze"();
CREATE TRIGGER "product_versions_no_delete" BEFORE DELETE ON "product_versions"
  FOR EACH ROW EXECUTE FUNCTION "reject_mutation"();

CREATE FUNCTION "product_media_freeze"() RETURNS trigger AS $$
DECLARE v_state "VersionState";
BEGIN
  SELECT "state" INTO v_state FROM "product_versions"
   WHERE "id" = COALESCE(NEW."product_version_id", OLD."product_version_id");
  IF v_state IS DISTINCT FROM 'DRAFT' THEN
    RAISE EXCEPTION 'media of a submitted product version is immutable' USING ERRCODE = 'check_violation';
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "product_media_freeze_trg" BEFORE INSERT OR UPDATE OR DELETE ON "product_media"
  FOR EACH ROW EXECUTE FUNCTION "product_media_freeze"();

-- Append-only ledgers
CREATE TRIGGER "stock_movements_append_only" BEFORE UPDATE OR DELETE ON "stock_movements"
  FOR EACH ROW EXECUTE FUNCTION "reject_mutation"();
CREATE TRIGGER "moderation_events_append_only" BEFORE UPDATE OR DELETE ON "moderation_events"
  FOR EACH ROW EXECUTE FUNCTION "reject_mutation"();

-- Public visibility, defined once (A11, A12). Every public read (search, suggestions, counts,
-- facets, detail, storefront catalogue, related, saved/compare) goes through these views.
CREATE VIEW "marketplace_products" AS
SELECT
  p."id", p."seller_workspace_id", p."company_id", p."price_type", p."min_price_fils", p."min_moq",
  p."published_at", p."first_published_at",
  v."id" AS "version_id", v."title_en", v."title_ar", v."description_en", v."description_ar",
  v."category_id", c."parent_id" AS "parent_category_id", v."mode", v."attributes",
  v."lead_time_min_days", v."lead_time_max_days", v."fulfilment_days", v."custom_manufacturing",
  v."private_label", v."white_label", v."samples_available", v."search_text", v."country_of_origin",
  co."display_name" AS "company_name", "mkt_normalize"(co."display_name") AS "company_search",
  co."emirate", s."id" AS "storefront_id", s."business_type",
  (v."mode" = 'READY_STOCK' AND EXISTS (
    SELECT 1 FROM "skus" k JOIN "inventory" i ON i."sku_id" = k."id"
     WHERE k."product_id" = p."id" AND k."active" AND k."approved_at" IS NOT NULL
       AND i."on_hand" - i."reserved" - i."unavailable" > 0)) AS "in_stock"
FROM "products" p
JOIN "product_versions" v ON v."id" = p."published_version_id" AND v."state" = 'APPROVED'
JOIN "workspaces" w ON w."id" = p."seller_workspace_id" AND w."kind" = 'SELLER' AND w."status" = 'ACTIVE'
JOIN "companies" co ON co."id" = p."company_id" AND co."status" = 'APPROVED'
  AND co."licence_expiry" >= (now() AT TIME ZONE 'UTC')::date
JOIN "categories" c ON c."id" = v."category_id" AND c."visible" AND c."archived_at" IS NULL AND c."restriction" <> 'BLOCKED'
LEFT JOIN "categories" pc ON pc."id" = c."parent_id"
LEFT JOIN "storefronts" s ON s."seller_workspace_id" = p."seller_workspace_id"
  AND s."status" = 'PUBLISHED' AND s."admin_hidden_at" IS NULL
WHERE p."status" = 'PUBLISHED'
  AND (pc."id" IS NULL OR (pc."visible" AND pc."archived_at" IS NULL AND pc."restriction" <> 'BLOCKED'));

CREATE VIEW "marketplace_suppliers" AS
SELECT
  s."id", s."seller_workspace_id", s."company_id", s."business_type", s."published_at",
  co."display_name" AS "company_name", "mkt_normalize"(co."display_name") AS "company_search", co."emirate"
FROM "storefronts" s
JOIN "workspaces" w ON w."id" = s."seller_workspace_id" AND w."kind" = 'SELLER' AND w."status" = 'ACTIVE'
JOIN "companies" co ON co."id" = s."company_id" AND co."status" = 'APPROVED'
  AND co."licence_expiry" >= (now() AT TIME ZONE 'UTC')::date
WHERE s."status" = 'PUBLISHED' AND s."admin_hidden_at" IS NULL;

CREATE INDEX "companies_display_name_trgm" ON "companies" USING gin ("mkt_normalize"("display_name") gin_trgm_ops);
