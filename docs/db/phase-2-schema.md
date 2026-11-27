# Database schema and migrations — Phase 2

Source of truth: `packages/db/prisma/schema.prisma`. Reviewed SQL: `packages/db/prisma/migrations/20261128000000_phase2_catalog/migration.sql`.

| Migration | Kind | Destructive? |
|---|---|---|
| `20261128000000_phase2_catalog` | 18 tables, enums, indexes, CHECK constraints, triggers, 2 views, `pg_trgm` search indexes | **no** (additive only; no Phase 1 table altered except new relations) |

`prisma migrate diff` between schema and migration history is empty. Money columns are `BIGINT` fils with a CHECK that
currency is `AED`; timestamps are `timestamptz` (UTC). Foreign keys use `ON DELETE RESTRICT`.

## Tables

| Table | Purpose | Key rules |
|---|---|---|
| `categories` | Admin-managed tree (A09), EN/AR names, image, priority, visibility, restriction OPEN / REVIEW_REQUIRED / BLOCKED, seller requirements, archive | slug unique + format CHECK; tree trigger: max two levels, no cycles; optimistic `version` |
| `category_attributes` | Typed attributes per category (TEXT, NUMBER, SELECT, BOOLEAN), options, unit, required, filterable | unique (category, key); key format CHECK |
| `storefronts` | One per seller workspace: business type (A10), descriptions, capabilities, certifications, status DRAFT/PUBLISHED, admin hide with reason | unique seller workspace; tenant trigger (workspace must be SELLER of the same company) |
| `storefront_media` | Logo, cover, factory/warehouse gallery | one LOGO and one COVER per storefront (partial unique index) |
| `products` | Listing identity, status (DRAFT, PUBLISHED, UNPUBLISHED, SUSPENDED, ARCHIVED, REMOVED), price type, pointers to published and working versions, denormalised min price/MOQ | tenant trigger (company matches workspace) |
| `product_versions` | Moderated content snapshot (A11): titles, descriptions, category, attributes, specs, certifications, video, state DRAFT → PENDING_REVIEW → APPROVED / REJECTED / CHANGES_REQUESTED / SUPERSEDED / WITHDRAWN | unique (product, version); **frozen after submission** (trigger blocks content edits outside DRAFT); never deleted (trigger); `search_text` trigram index |
| `product_media` | Ordered images per version | frozen with its version (trigger) |
| `skus` | Variants: code, variant attributes, unit, MOQ, order increment, active/approved, low-stock threshold, restock date | unique (workspace, code); MOQ/increment > 0; tenant trigger |
| `price_tiers` | Quantity tiers in fils (live, audited, not reviewed; A11) | unique (sku, min_qty); price ≥ 0; currency AED |
| `inventory` | On hand, reserved, unavailable, sold; `version` for stock counts | non-negative CHECK on every counter and on available = on_hand − reserved − unavailable |
| `stock_movements` | Every stock change with deltas, balances after, reason, actor | **append-only** (trigger) |
| `moderation_events` | Submit, withdraw, decisions, suspend/restore/remove, with reason and actor | **append-only** (trigger) |
| `restricted_terms` | Provisional BLOCK / REVIEW terms (A10), optional category, stored normalised | active index; matched with `mkt_normalize` against titles, descriptions and specifications |
| `saved_items` | Per-user saved products or storefronts (A12) | exactly one target (CHECK); partial unique indexes |
| `comparison_items` | Per-user comparison (max 4, enforced in a serializable transaction) | unique (user, product) |
| `recently_viewed` | Per-user history (max 30) | unique (user, product) |
| `marketplace_preferences` | Per-user categories, emirates, default view and sort | one row per user |
| `featured_listings` | Admin placements (product or supplier) with window and reason; labelled for buyers, never affect ranking | one target (CHECK); window CHECK |

## Views (single definition of "public")
- `marketplace_products`: product PUBLISHED with an APPROVED published version; seller company APPROVED with licence not expired; workspace ACTIVE; storefront PUBLISHED and not admin-hidden; category (and parent) visible, not archived, not BLOCKED. Exposes search columns, in-stock flag and minimum price.
- `marketplace_suppliers`: published, non-hidden storefronts of eligible sellers.
Every public API read, public media check, featured placement and buyer-list item goes through these views, so a suspended company or expired licence disappears from search, directory, saved lists and image URLs at once.

## Functions
- `mkt_normalize(text)`: lower-case, strips Arabic diacritics/tatweel and unifies alef, yaa and taa marbuta forms, Arabic-Indic digits and Latin accents, used for EN/AR search and restricted-term matching.

## Applying and rollback
`pnpm db:migrate` in every environment; `pnpm db:seed` is development-only. The migration is additive: rolling back the
application leaves the tables unused. Dropping them would destroy moderation and stock history and needs explicit
founder approval.
