# 10. Marketplace and product discovery

Implemented in Phase 2. Public data comes only from the `marketplace_products` and `marketplace_suppliers` views (approved, published, eligible companies). Search: PostgreSQL trigram on EN and AR with normalisation of Arabic diacritics, alef/yaa/taa-marbuta forms and Arabic-Indic digits. Source: `apps/api/src/catalog/marketplace.service.ts`, `apps/web/src/components/search-results.tsx`, `catalog-ui.tsx`, `market-shell.tsx`.

| Feature | Status | Notes |
|---|---|---|
| Product cards (grid, list) | Implemented | `ProductCardView` |
| Manufacturer cards | Implemented | `SupplierCardView` |
| Category cards (tiles, chips, directory) | Implemented | |
| Search bar | Implemented | header, max 100 characters |
| Search suggestions | Implemented | products, suppliers, categories; from 2 characters |
| Filter panels | Implemented (desktop column, mobile inline toggle) | sheet recommended (G-34) |
| Sorting | Implemented | relevance, newest, price ↑/↓ (verified), lowest MOQ |
| Product comparison | Implemented | `/compare`, verified users |
| Manufacturer comparison | **Recommended** | not built |
| Product galleries | Implemented (thumbnails) | lightbox recommended (G-35) |
| Product specifications | Implemented | attributes + spec rows |
| Manufacturing capabilities | Implemented (storefront) | |
| Verification indicators | Implemented | "Verified supplier", verified since |
| Pricing presentation | Implemented | tiers; guests locked |
| MOQ and increments | Implemented | |
| Estimated production times | Implemented | lead time min–max days, dispatch days |
| Availability | Implemented | in stock / low / out / made to order |
| Customisation options | Implemented (flags) | custom manufacturing, private label, white label, samples |
| Request quotation buttons | Implemented | product, storefront |
| Manufacturer contact | Implemented | message from storefront (approved buyers) |
| Saved lists, recently viewed, preferences | Implemented | verified users |
| Sample request | Recommended | FD-13 |

## 10.1 Product card
Content (grid): image (1:1 recommended, placeholder when missing), "Featured" label when placed (never affects order), title (2 lines max, EN or AR per locale with fallback to EN), supplier name + verified dot, emirate, price ("From AED x" for tiers or unit price; guests: "Sign in to see price"; QUOTE_ONLY: "Price on request"), MOQ ("MOQ 100 pieces"), mode badge (Ready stock / Made to order), lead time or dispatch days, save toggle, compare toggle (verified). List variant adds category, customisation tags and stock. Unavailable variant (saved/compare lists): greyed with "This listing is no longer available." States: default, hover (border colour change, no heavy shadow), focus-visible ring, saved, in compare.

## 10.2 Manufacturer card
Logo (square), cover (optional), name, verified badge + "Verified since {date}", business type, emirate/city, year established, specialisation (2 lines), top categories, product count, capability tags, save toggle.

## 10.3 Category card
Tile: image, name, public product count. Chip: name + count. Directory block: image, name, child links with counts.

## 10.4 Search bar requirements
Placeholder "Search products, suppliers or categories"; submit on Enter; clear button; suggestions after 2 characters, debounced; keyboard navigation (arrow keys, Enter, Escape); grouped headings; ARIA combobox pattern. Mobile: full-width under the header; tapping opens a full-screen search view (recommended).

## 10.5 Filter panel
Groups (from `GET /marketplace/products` query): Category; Product type (Ready stock / Made to order / Any); Supplier type (7 business types); Emirate (7); Price min/max in AED (verified only); MOQ up to; Lead time up to (days); Dispatch within (days); In stock only; Custom manufacturing; Private label; White label; Samples; Category attributes (up to 10 key:value filters, only attributes marked filterable). Active filters show as removable chips; "Clear all". All filter state lives in the URL.

## 10.6 Sorting
Relevance (default with query), Newest, Price low to high, Price high to low (verified only; guests get validation error so options are hidden), Lowest MOQ. Page size 24 (max 48), "Show more results".

## 10.7 Product detail page (PUB-07)
Hierarchy: breadcrumb → gallery (≤12 images, thumbnails; video link opens externally) → title, supplier, verified badge → availability and mode → price block (tiers table with quantity ranges; guests locked) → variant selector → quantity stepper ("Minimum {moq}, in steps of {step}") → price calculator (server estimate) → trade panel: **Add to cart** (ready stock, approved buyer), **Request quotation**, Save, Compare → disabled reason text when not allowed (sign in, requires approved buyer, quote only, made to order, checkout disabled) → key facts (MOQ, lead time, dispatch, origin, materials, dimensions) → description → attributes and specifications → certifications "(declared by supplier)" → customisation and samples note → supplier card → related products.

## 10.8 Comparison (PUB-12)
Columns per product: image, title, category, supplier, price summary, MOQ, mode, stock, lead time, dispatch days, materials, dimensions, origin, certifications, attributes; remove per column. Limit: as enforced by the API (comparison list per user). Mobile: horizontally swipeable columns with sticky attribute labels.

## 10.9 Verification indicators
Use one consistent "Verified" badge (icon + text "Verified supplier") on cards, storefronts and product supplier block; never colour alone. Unverified companies never appear publicly, so there is no public "unverified" badge; the unverified state appears only inside the company's own workspace (company status badge).

## 10.10 Pricing presentation rules
AED, two decimals, "excl. VAT" note where prices exclude tax (seller pricing is entered excluding VAT). Tier tables show quantity ranges ("100–499", "500+") and unit price; highlight the tier matching the chosen quantity. Never show strikethrough "discounts".
