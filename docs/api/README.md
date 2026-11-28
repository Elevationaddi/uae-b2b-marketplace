# API reference (Phases 1–2)

Generated from the shared zod contracts; the machine-readable source is [`openapi.json`](openapi.json) (OpenAPI 3.1).
Regenerate with `pnpm --filter @app/contracts openapi`. A unit test fails if the file is stale, and an API
integration test fails if any served route is undocumented (or documented but not served).

## Conventions
- Base path `/api/v1`. Browsers call it on the web origin (or the admin origin for `/admin`), proxied to the API, so cookies stay first-party and host-only.
- Success: `{ "data": …, "meta": { "next_cursor": string|null } }`. Lists use cursor pagination (`limit`, `cursor`).
- Error: `{ "error": { "code", "message_key", "field_errors"?, "request_id" } }`. `message_key` is translated by the client; `field_errors` maps a field to a code such as `required`, `min`, `email`, `future`, `infected`.
- Sessions: opaque random token in an HttpOnly cookie (`sid` for company users, `asid` for admins; `__Host-` prefixed in production). Only a SHA-256 hash is stored. Company: 7 days absolute, 24h idle, SameSite=Lax. Admin: 8h absolute, 30 min idle, SameSite=Strict, rotated after MFA.
- CSRF: every POST/PATCH/DELETE needs `Origin` (or `Referer`) equal to the web origin (admin origin for `/admin/*`) **and** `X-CSRF-Token` equal to the `csrf` cookie (from `GET /auth/csrf`).
- Authorization is re-checked on every request from the database: membership, workspace status, role capability (docs/10-security.md matrix). Resources of another company return **404**, never 403.
- Timestamps are UTC ISO-8601; calendar dates (licence expiry) are `YYYY-MM-DD`.

Columns: **Auth** = session required; **CSRF** = token and origin checked; **Requires** = capability or role beyond membership.

## Health

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/health` | Liveness | public | no |  | 200 |  |
| `GET` | `/api/v1/health/ready` | Readiness (database, Redis) | public | no |  | 200 |  |

## Auth

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/auth/csrf` | Issue CSRF cookie and token (double submit) | public | no |  | 200 |  |
| `GET` | `/api/v1/public/config` | Public configuration: product name (A06), sandbox flag, upload limit | public | no |  | 200 |  |
| `POST` | `/api/v1/auth/register` | Register a company user. Always 202 (no account enumeration); sends verification email | public | yes |  | 202 | 403, 422, 429 |
| `POST` | `/api/v1/auth/verify-email` | Verify email with one-time token (24h) | public | yes |  | 200 | 403, 422, 429 |
| `POST` | `/api/v1/auth/resend-verification` | Resend verification email. Always 202 | public | yes |  | 202 | 403, 422, 429 |
| `POST` | `/api/v1/auth/login` | Sign in (company users). Sets session cookie; rotates session | public | yes |  | 200 | 401, 403, 422, 429 |
| `POST` | `/api/v1/auth/logout` | Sign out and revoke the current session | company session | yes |  | 200 | 401, 403 |
| `POST` | `/api/v1/auth/password-reset/request` | Request password reset email. Always 202 | public | yes |  | 202 | 403, 422, 429 |
| `POST` | `/api/v1/auth/password-reset/confirm` | Set a new password with one-time token (1h); revokes all sessions | public | yes |  | 200 | 403, 422, 429 |

## Account

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/me` | Current user, workspaces and effective capabilities | company session | no |  | 200 | 401 |
| `PATCH` | `/api/v1/me` | Update profile (name, preferred language) | company session | yes |  | 200 | 401, 403, 422 |
| `GET` | `/api/v1/me/sessions` | List active sessions | company session | no |  | 200 | 401 |
| `DELETE` | `/api/v1/me/sessions/{id}` | Revoke one session | company session | yes |  | 200 | 401, 403, 404 |
| `POST` | `/api/v1/me/sessions/revoke-others` | Revoke all other sessions | company session | yes |  | 200 | 401, 403 |
| `POST` | `/api/v1/me/password` | Change password; revokes other sessions | company session | yes |  | 200 | 401, 403, 422, 429 |

## Companies

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/companies` | Companies the caller is a member of | company session | no |  | 200 | 401 |
| `POST` | `/api/v1/companies` | Register a company (caller becomes owner of each requested workspace) | company session | yes |  | 200 | 401, 403, 409, 422, 429 |
| `GET` | `/api/v1/companies/{id}` | Company details | company session | no |  | 200 | 401, 404 |
| `PATCH` | `/api/v1/companies/{id}` | Edit legal details (DRAFT / NEEDS_INFO / REJECTED only; optimistic version) | company session | yes | company.manage | 200 | 401, 403, 404, 409, 422 |

## Verification

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/companies/{id}/verification` | Current verification case and history | company session | no |  | 200 | 401, 404 |
| `POST` | `/api/v1/companies/{id}/verification` | Submit or resubmit for verification (accepts terms version) | company session | yes | company.manage | 200 | 401, 403, 404, 409, 422 |
| `POST` | `/api/v1/companies/{id}/renewal` | Start licence renewal (APPROVED, or SUSPENDED for licence expiry) | company session | yes | company.manage | 200 | 401, 403, 404, 409, 422 |
| `POST` | `/api/v1/companies/{id}/documents` | Upload a verification document (PDF/PNG/JPEG; magic bytes sniffed; malware scanned; private storage) | company session | yes | company.manage | 200 | 401, 403, 404, 409, 422, 429, 503 |
| `DELETE` | `/api/v1/companies/{id}/documents/{documentId}` | Remove a document from an editable case | company session | yes | company.manage | 200 | 401, 403, 404, 409 |
| `GET` | `/api/v1/files/{id}/download` | Download a clean document (streamed after authorization; audited) | company session | no | legal_documents.read | 200 | 401, 403, 404 |

## Team

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/workspaces/{id}/members` | Workspace members | company session | no |  | 200 | 401, 404 |
| `GET` | `/api/v1/workspaces/{id}/invitations` | Workspace invitations (owners) | company session | no | role OWNER | 200 | 401, 403, 404 |
| `POST` | `/api/v1/workspaces/{id}/invitations` | Invite by email with a role valid for the workspace kind (7-day token) | company session | yes | role OWNER | 200 | 401, 403, 404, 409, 422, 429 |
| `DELETE` | `/api/v1/workspaces/{id}/invitations/{invitationId}` | Revoke a pending invitation | company session | yes | role OWNER | 200 | 401, 403, 404, 409 |
| `POST` | `/api/v1/invitations/preview` | Preview an invitation by token (public) | public | yes |  | 200 | 403, 422, 429 |
| `POST` | `/api/v1/invitations/accept` | Accept an invitation (signed-in user whose email matches) | company session | yes |  | 200 | 401, 403, 409, 422 |
| `PATCH` | `/api/v1/memberships/{id}` | Change role or revoke/restore access (last owner protected) | company session | yes | role OWNER | 200 | 401, 403, 404, 409, 422 |

## Admin auth

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `POST` | `/api/v1/admin/auth/login` | Admin password step (admin origin only). Returns which MFA step is required | public | yes |  | 200 | 401, 403, 422, 429 |
| `POST` | `/api/v1/admin/auth/mfa/enroll/start` | Start mandatory TOTP enrolment | admin (password step done, MFA pending) | yes |  | 200 | 401, 403, 409 |
| `POST` | `/api/v1/admin/auth/mfa/enroll/confirm` | Confirm TOTP; returns 10 one-time recovery codes; rotates session | admin (password step done, MFA pending) | yes |  | 200 | 401, 403, 409, 422, 429 |
| `POST` | `/api/v1/admin/auth/mfa/verify` | Verify TOTP (replay-protected) or a recovery code; rotates session | admin (password step done, MFA pending) | yes |  | 200 | 401, 403, 409, 422, 429 |
| `POST` | `/api/v1/admin/auth/logout` | Admin sign out | admin session | yes |  | 200 | 401, 403 |
| `GET` | `/api/v1/admin/me` | Admin identity, roles and capabilities | admin session | no |  | 200 | 401 |

## Admin

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/overview` | Live counts for the admin overview | admin session | no | admin.companies.read | 200 | 401 |
| `GET` | `/api/v1/admin/verification` | Verification queue (cursor paginated) | admin session | no | admin.verification.review | 200 | 401 |
| `GET` | `/api/v1/admin/verification/{id}` | Verification case detail | admin session | no | admin.verification.review | 200 | 401, 404 |
| `POST` | `/api/v1/admin/verification/{id}/start-review` | Assign to self and move SUBMITTED -> UNDER_REVIEW | admin session | yes | admin.verification.review | 200 | 401, 403, 404, 409 |
| `POST` | `/api/v1/admin/verification/{id}/decision` | Approve, request information or reject (reason required unless approving) | admin session | yes | admin.verification.review | 200 | 401, 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/files/{id}/download` | Download a case document (audited) | admin session | no | admin.verification.review | 200 | 401, 404 |
| `GET` | `/api/v1/admin/companies` | Companies (filter by status, search) | admin session | no | admin.companies.read | 200 | 401 |
| `GET` | `/api/v1/admin/companies/{id}` | Company detail with members and cases | admin session | no | admin.companies.read | 200 | 401, 404 |
| `POST` | `/api/v1/admin/companies/{id}/suspend` | Suspend a company (compliance); restricts workspaces | admin session | yes | admin.companies.suspend | 200 | 401, 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/companies/{id}/reactivate` | Reactivate a compliance-suspended company | admin session | yes | admin.companies.suspend | 200 | 401, 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/users` | Users (search, account type) | admin session | no | admin.users.read | 200 | 401 |
| `POST` | `/api/v1/admin/users/{id}/revoke-sessions` | Revoke all sessions of a user | admin session | yes | admin.users.revoke_sessions | 200 | 401, 403, 404, 422 |
| `GET` | `/api/v1/admin/audit` | Append-only audit log (filters, cursor paginated) | admin session | no | admin.audit.read | 200 | 401 |
| `GET` | `/api/v1/admin/staff` | Platform staff and roles | admin session | no | admin.staff.manage | 200 | 401 |
| `POST` | `/api/v1/admin/staff/{id}/roles` | Set staff roles (last super-admin protected) | admin session | yes | admin.staff.manage | 200 | 401, 403, 404, 409, 422 |

## Phase 2 conventions
- Marketplace routes accept guests. A company session cookie, when present, only changes what is shown: wholesale tiers, price filters/sorts and buyer-list state appear for email-verified users (A12). Responses are `Cache-Control: private, no-store` with `Vary: Cookie`.
- Public visibility is decided in two SQL views (`marketplace_products`, `marketplace_suppliers`): product approved and published, seller company APPROVED with an unexpired licence, workspace active, storefront published and not hidden, category visible and not blocked. Anything else is 404.
- Seller routes are scoped by `{ws}`; a workspace the caller does not belong to returns 404. Mutations of products, pricing and stock are refused (422) when the seller is not eligible to trade (A08, A10).
- Optimistic concurrency: product, storefront and category updates carry `expected_version`; stale writes return 409.
- Money is integer fils serialised as a decimal string (`"12500"` = AED 125.00).
- Images are served through `/media/{id}` (public), `/seller/workspaces/{ws}/media/{fileId}` (owner) and `/admin/media/{id}` (admin), each re-checking access on every request.
## Marketplace (Phase 2)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/marketplace/home` | Marketplace home (categories, featured, manufacturers, new; prices for verified viewers only) | optional (guest allowed) | no |  | 404, 422, 429 |
| `GET` | `/api/v1/marketplace/categories` | Visible category tree with public product counts | optional (guest allowed) | no |  | 404, 422, 429 |
| `GET` | `/api/v1/marketplace/categories/{id}` | Category with subcategories and filterable attributes | optional (guest allowed) | no |  | 404, 422, 429 |
| `GET` | `/api/v1/marketplace/products` | Search approved products (filters, sort, offset cursor). Price filters/sorts require a verified viewer (422 for guests). | optional (guest allowed) | no |  | 404, 422, 429 |
| `GET` | `/api/v1/marketplace/suggest` | Autocomplete over public products, suppliers and categories | optional (guest allowed) | no |  | 404, 422, 429 |
| `GET` | `/api/v1/marketplace/products/{id}` | Public product detail (tiers only for verified viewers; trading actions permission-aware) | optional (guest allowed) | no |  | 404, 422, 429 |
| `GET` | `/api/v1/marketplace/products/{id}/related` | Related public products | optional (guest allowed) | no |  | 404, 422, 429 |
| `GET` | `/api/v1/marketplace/products/{id}/estimate` | Server-side unit price and line total for a quantity (verified viewers; not a commitment) | optional (guest allowed) | no |  | 403, 404, 422, 429 |
| `GET` | `/api/v1/marketplace/suppliers` | Supplier directory (published storefronts of eligible verified sellers) | optional (guest allowed) | no |  | 404, 422, 429 |
| `GET` | `/api/v1/marketplace/suppliers/{id}` | Supplier storefront | optional (guest allowed) | no |  | 404, 422, 429 |
| `GET` | `/api/v1/media/{id}` | Public marketplace image (only while attached to public content) | optional (guest allowed) | no |  | 404, 429 |

## Buyer lists (Phase 2)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/marketplace/saved/products` | Saved products | company | no | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `POST` | `/api/v1/marketplace/saved/products/{id}` | Save a public product (idempotent) | company | yes | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `DELETE` | `/api/v1/marketplace/saved/products/{id}` | Remove a saved product | company | yes | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `GET` | `/api/v1/marketplace/saved/suppliers` | Saved suppliers | company | no | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `POST` | `/api/v1/marketplace/saved/suppliers/{id}` | Save a public supplier (idempotent) | company | yes | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `DELETE` | `/api/v1/marketplace/saved/suppliers/{id}` | Remove a saved supplier | company | yes | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `GET` | `/api/v1/marketplace/compare` | Comparison list (max 4) | company | no | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `POST` | `/api/v1/marketplace/compare/{id}` | Add a public product to comparison (409 marketplace.compare_limit) | company | yes | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `DELETE` | `/api/v1/marketplace/compare/{id}` | Remove from comparison | company | yes | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `GET` | `/api/v1/marketplace/recent` | Recently viewed (last 30) | company | no | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `POST` | `/api/v1/marketplace/recent/{id}` | Record a product view | company | yes | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `DELETE` | `/api/v1/marketplace/recent` | Clear recently viewed | company | yes | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `GET` | `/api/v1/marketplace/preferences` | Marketplace preferences | company | no | email-verified account (A12) | 403, 404, 409, 422, 429 |
| `PATCH` | `/api/v1/marketplace/preferences` | Update marketplace preferences | company | yes | email-verified account (A12) | 403, 404, 409, 422, 429 |

## Seller catalog (Phase 2)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/seller/workspaces/{ws}/overview` | Seller dashboard overview (real counts) | company | no | seller.catalog.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/storefront` | Own storefront (empty draft if not created yet) | company | no | seller.catalog.read | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/seller/workspaces/{ws}/storefront` | Update storefront profile | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/storefront/publish` | Publish storefront (eligible sellers; required fields) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/storefront/unpublish` | Take storefront offline | company | yes | owner or sales role | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/storefront/media` | Upload storefront image (logo, cover, factory, warehouse, other; sanitised) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422, 429, 503 |
| `DELETE` | `/api/v1/seller/workspaces/{ws}/storefront/media/{mediaId}` | Remove storefront image | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/products` | Own products by tab (cursor paginated) | company | no | seller.catalog.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products` | Create a draft product with its first SKU | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/products/{id}` | Product detail with working and published versions, SKUs, history and allowed actions | company | no | seller.catalog.read | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/seller/workspaces/{ws}/products/{id}` | Edit content (creates a new draft version when the live one is approved) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/media` | Upload product image (PNG/JPEG/WebP; scanned; re-encoded; max 12) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422, 429, 503 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/media/reorder` | Reorder images | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `DELETE` | `/api/v1/seller/workspaces/{ws}/products/{id}/media/{fileId}` | Remove image from the draft | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/skus` | Add a variant SKU (pending until the version is approved) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/seller/workspaces/{ws}/products/{id}/skus/{skuId}` | Update SKU (identity locked once approved; active flag is live) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `DELETE` | `/api/v1/seller/workspaces/{ws}/products/{id}/skus/{skuId}` | Delete a never-approved SKU without stock history | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/pricing` | Set live pricing: price type, MOQ, increments, tiers (validated, audited, no review) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/submit` | Submit the draft for moderation (restricted-term screening) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/withdraw` | Withdraw a pending submission back to draft | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/archive` | Archive | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/unpublish` | Unpublish (hide from buyers) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/republish` | Republish an unpublished approved listing | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/restore` | Restore an archived product | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/products/{id}/duplicate` | Duplicate as a new draft (zero stock) | company | yes | seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/inventory` | Variant stock (filters: low, out) | company | no | seller.catalog.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/inventory/{skuId}/adjust` | Atomic stock adjustment (never negative; logged with actor and reason) | company | yes | seller.inventory.ship or seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/seller/workspaces/{ws}/inventory/{skuId}` | Low-stock threshold and restock date | company | yes | seller.inventory.ship or seller.catalog.edit (trading-gated) | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/inventory/{skuId}/movements` | Append-only stock movement history | company | no | seller.catalog.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/media/{fileId}` | Own marketplace image (drafts included) | company | no | seller.catalog.read | 403, 404, 409, 422 |

## Admin catalog (Phase 2)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/catalog/overview` | Catalog moderation overview | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/catalog/queue` | Moderation queue (pending oldest first) | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/catalog/reviews/{versionId}` | Review a submitted version (diff against live version) | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/catalog/reviews/{versionId}/decision` | Approve, reject or request changes (reason required unless approving) | admin | yes | admin.catalog.review | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/catalog/products` | Search all listings | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/catalog/products/{id}` | Listing detail with history | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/catalog/products/{id}/suspend` | Suspend listing immediately (reason) | admin | yes | admin.catalog.enforce | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/catalog/products/{id}/restore` | Restore a suspended listing (reason) | admin | yes | admin.catalog.enforce | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/catalog/products/{id}/remove` | Remove listing (reason; irreversible for the seller) | admin | yes | admin.catalog.enforce | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/storefronts` | Storefront oversight | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/storefronts/{id}` | Storefront detail | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/storefronts/{id}/hide` | Hide a storefront (reason) | admin | yes | admin.catalog.enforce | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/storefronts/{id}/restore` | Restore a hidden storefront (reason) | admin | yes | admin.catalog.enforce | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/categories` | All categories (including hidden/archived) | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/categories` | Create category or subcategory | admin | yes | admin.categories.manage | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/categories/{id}` | Category detail with attributes | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/admin/categories/{id}` | Update category (reason required to hide, archive or change restriction) | admin | yes | admin.categories.manage | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/categories/{id}/image` | Upload category image | admin | yes | admin.categories.manage | 403, 404, 422, 429, 503 |
| `POST` | `/api/v1/admin/categories/{id}/attributes` | Add category attribute | admin | yes | admin.categories.manage | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/admin/category-attributes/{id}` | Update category attribute | admin | yes | admin.categories.manage | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/restricted-terms` | Restricted and prohibited terms (provisional policy, A10) | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/restricted-terms` | Add restricted term | admin | yes | admin.restricted.manage | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/admin/restricted-terms/{id}` | Update restricted term | admin | yes | admin.restricted.manage | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/featured` | Featured placements (labelled; never used for ranking) | admin | no | admin.catalog.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/featured` | Add featured placement (public targets only) | admin | yes | admin.featured.manage | 403, 404, 409, 422 |
| `DELETE` | `/api/v1/admin/featured/{id}` | Remove featured placement | admin | yes | admin.featured.manage | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/media/{id}` | Any marketplace image (review) | admin | no | admin.catalog.read | 403, 404, 409, 422 |

## Phase 3 conventions
- Buyer RFQ routes are scoped by the buyer workspace and seller routes by the seller workspace; a workspace the caller does not belong to, an RFQ the seller cannot see (not invited, not in the matching pool) and another supplier's quote all return 404, including attachments (T19, T20).
- Creating, editing, publishing, cancelling and awarding RFQs need `buyer.purchase` (OWNER, PROCUREMENT) in an approved trading workspace; drafting and submitting quotes need `seller.catalog.edit` (OWNER, SALES) in an approved seller workspace. A refused trading action returns 403 with the specific reason (for example `trading.licence_expired`).
- Optimistic concurrency: RFQ and quote writes carry `expected_version`; stale writes return 409 `common.stale`.
- Award: `POST …/quotes/{quoteId}/accept` needs an `Idempotency-Key` header (8–100 characters). Replaying the same key returns the stored result; reusing it for a different body returns 409. Accepting a superseded or expired version returns 409 and creates nothing (T21); concurrent accepts produce exactly one award (T22).
- Totals are always computed by the server from quantity, unit price, shipping and tax code; a submitted quote version is immutable at the database level (T23).
- Quote counts and other suppliers' quotes are never shown to sellers; admins see metadata and quote states, never prices or documents.

## Buyer RFQs (Phase 3)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/buyer/workspaces/{ws}/rfqs` | List the workspace RFQs (offset cursor) | company | no | member of the buyer workspace | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/rfqs` | Create an RFQ draft (validated category, dates, invitees) | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/invite-candidates` | Public, trading-eligible suppliers the buyer may invite | company | no | member of the buyer workspace | 403, 404, 409, 422 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/rfqs/{id}` | RFQ detail with every quote, timeline and attachments | company | no | member of the buyer workspace | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/buyer/workspaces/{ws}/rfqs/{id}` | Edit a draft (expected_version) | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/rfqs/{id}/publish` | Publish a draft; notifies invitees and eligible pool sellers | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/rfqs/{id}/cancel` | Cancel a draft or open RFQ without an award | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/rfqs/{id}/files` | Attach a file to a draft (PDF/PNG/JPEG; scanned; private) | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422, 429, 503 |
| `DELETE` | `/api/v1/buyer/workspaces/{ws}/rfqs/{id}/files/{fileId}` | Remove a draft attachment | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/rfqs/{id}/files/{fileId}` | Download an RFQ attachment or a submitted quote attachment (audited) | company | no | member of the buyer workspace | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/quotes/{quoteId}/request-revision` | Ask the seller to revise the current version | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/quotes/{quoteId}/decline` | Decline the current quote version | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/quotes/{quoteId}/accept` | Award: accept the exact current version (header Idempotency-Key required). 409 quote.superseded, quote.expired, rfq.already_awarded. Orders are created in Phase 4. | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |

## Seller RFQs and quotes (Phase 3)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/seller/workspaces/{ws}/rfqs` | Eligible pool and invitations (never another seller's quote) | company | no | member of the seller workspace | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/rfqs/{id}` | RFQ detail with only the caller's own quote (404 when not visible) | company | no | member of the seller workspace | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/rfqs/{id}/files/{fileId}` | Download an RFQ attachment or an own quote attachment (audited) | company | no | member of the seller workspace | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/rfqs/{id}/quote` | Create a quote draft (one per seller per RFQ) | company | yes | seller.catalog.edit (OWNER, SALES; trading-gated) | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/quotes` | Own quotes | company | no | member of the seller workspace | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/seller/workspaces/{ws}/quotes/{id}` | Edit the draft version (server recomputes totals) | company | yes | seller.catalog.edit (OWNER, SALES; trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/quotes/{id}/submit` | Submit the draft; the version becomes immutable | company | yes | seller.catalog.edit (OWNER, SALES; trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/quotes/{id}/revise` | Submit a new version; the previous one is superseded | company | yes | seller.catalog.edit (OWNER, SALES; trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/quotes/{id}/withdraw` | Withdraw a submitted quote before acceptance | company | yes | seller.catalog.edit (OWNER, SALES; trading-gated) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/quotes/{id}/files` | Attach a file to the draft version (scanned; private) | company | yes | seller.catalog.edit (OWNER, SALES; trading-gated) | 403, 404, 409, 422, 429, 503 |
| `DELETE` | `/api/v1/seller/workspaces/{ws}/quotes/{id}/files/{fileId}` | Remove a draft attachment | company | yes | seller.catalog.edit (OWNER, SALES; trading-gated) | 403, 404, 409, 422 |

## Messages (Phase 3)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/workspaces/{ws}/conversations` | Conversations of the workspace with unread counts | company | no | messaging role (OWNER, PROCUREMENT, SALES); sending is trading-gated (A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/workspaces/{ws}/conversations` | Start (or continue) a conversation: buyer from a storefront, seller from a visible RFQ | company | yes | messaging role (OWNER, PROCUREMENT, SALES); sending is trading-gated (A12) | 403, 404, 409, 422 |
| `GET` | `/api/v1/workspaces/{ws}/conversations/{id}` | Conversation detail | company | no | messaging role (OWNER, PROCUREMENT, SALES); sending is trading-gated (A12) | 403, 404, 409, 422 |
| `GET` | `/api/v1/workspaces/{ws}/conversations/{id}/messages` | Messages, newest first | company | no | messaging role (OWNER, PROCUREMENT, SALES); sending is trading-gated (A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/workspaces/{ws}/conversations/{id}/messages` | Send a message | company | yes | messaging role (OWNER, PROCUREMENT, SALES); sending is trading-gated (A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/workspaces/{ws}/conversations/{id}/read` | Move the read marker forward | company | yes | messaging role (OWNER, PROCUREMENT, SALES); sending is trading-gated (A12) | 403, 404, 409, 422 |

## Notifications (Phase 3)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/notifications` | Own notifications, newest first | company | no |  | 404, 422 |
| `GET` | `/api/v1/notifications/unread` | Unread notification and message counts | company | no |  | 404, 422 |
| `GET` | `/api/v1/notifications/preferences` | Email notification preferences | company | no |  | 404, 422 |
| `PATCH` | `/api/v1/notifications/preferences` | Update email notification preferences | company | yes |  | 404, 422 |
| `POST` | `/api/v1/notifications/read-all` | Mark all notifications read | company | yes |  | 404, 422 |
| `POST` | `/api/v1/notifications/{id}/read` | Mark one notification read | company | yes |  | 404, 422 |

## Admin RFQs (Phase 3)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/rfqs` | RFQs (metadata only) | admin | no | admin.rfqs.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/rfqs/{id}` | RFQ metadata and quote states (no quote contents) | admin | no | admin.rfqs.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/rfqs/{id}/hide` | Hide an abusive RFQ (sellers lose access; audited) | admin | yes | admin.rfqs.moderate | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/rfqs/{id}/unhide` | Restore a hidden RFQ (audited) | admin | yes | admin.rfqs.moderate | 403, 404, 409, 422 |

## Phase 4 conventions
- Buyer cart, checkout and order routes are scoped by the buyer workspace; seller order routes by the seller workspace. Another workspace's checkout, order, address or payment session returns 404 (T42).
- Prices, delivery fees, tax, commission and totals are computed by the server from live catalogue data. The checkout preview returns a `preview_hash`; creating the checkout re-prices and returns 409 `checkout.changed` if anything differs, so the buyer never pays a total they have not seen.
- Stock is reserved for `RESERVATION_MINUTES` (15) with conditional updates in SKU order; concurrent checkouts for the last units produce exactly one success and 409 `checkout.insufficient_stock` for the rest (T11).
- `POST …/checkouts` and `POST …/checkouts/{id}/pay` require an `Idempotency-Key` header.
- Payment is confirmed only by a verified provider webhook: HMAC-SHA256 header `x-sandbox-signature: t=<unix>,v1=<hex>` over `"<t>.<raw body>"`, 5-minute tolerance, constant-time compare. Events are stored once per provider event id and processed by the worker. The redirect back from the hosted page never marks anything paid (T14); invalid signatures and amount mismatches are quarantined (T16).
- Only the labelled sandbox adapter exists. `PAYMENT_MODE=live` is refused at API and worker startup; the sandbox routes return 404 unless `PAYMENT_MODE=mock`.
- Buyers never see commission or seller payable; sellers and finance admins do.

## Buyer orders and checkout (Phase 4)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/buyer/workspaces/{ws}/addresses` | Delivery addresses (UAE only) | company | no | buyer.orders.read (any buyer workspace member) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/addresses` | Add a delivery address | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/buyer/workspaces/{ws}/addresses/{id}` | Replace a delivery address | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `DELETE` | `/api/v1/buyer/workspaces/{ws}/addresses/{id}` | Archive an address (checkouts keep their snapshot) | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/cart` | Cart grouped by seller, priced from live data with line issues | company | no | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/cart/items` | Add a ready-stock SKU (MOQ, increment, stock, no self-trade) | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `PATCH` | `/api/v1/buyer/workspaces/{ws}/cart/items/{id}` | Change a cart line quantity | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `DELETE` | `/api/v1/buyer/workspaces/{ws}/cart/items/{id}` | Remove a cart line | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/checkout/preview` | Per-seller delivery, tax and totals with a preview hash | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/checkouts` | Create checkout: re-price, 409 checkout.changed if anything differs from the preview, reserve stock (409 checkout.insufficient_stock), one order per seller. Header Idempotency-Key required. | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422, 429 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/checkouts/{id}` | Checkout with orders and payment attempts | company | no | buyer.orders.read (any buyer workspace member) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/checkouts/{id}/pay` | Start or resume a payment session (sandbox adapter only). Returns the hosted page URL; payment is confirmed only by a verified webhook. Header Idempotency-Key required. | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422, 429 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/checkouts/{id}/cancel` | Cancel an unpaid cart checkout and release stock | company | yes | buyer.purchase (OWNER, PROCUREMENT; approved trading workspace, A12) | 403, 404, 409, 422 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/orders` | Buyer orders (offset cursor) | company | no | buyer.orders.read (any buyer workspace member) | 403, 404, 409, 422 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/orders/{id}` | Buyer order detail (no commission figures) | company | no | buyer.orders.read (any buyer workspace member) | 403, 404, 409, 422 |

## Seller orders (Phase 4)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/seller/workspaces/{ws}/orders` | Seller orders (offset cursor) | company | no | seller.orders.read (any seller workspace member) | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/orders/{id}` | Seller order detail with payable | company | no | seller.orders.read (any seller workspace member) | 403, 404, 409, 422 |

## Payments (Phase 4)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/payments/webhooks/{provider}` | Provider webhook intake (sandbox provider only). Verified, stored once per event id, processed by the worker. Invalid signature: 422 payment.invalid_signature and quarantined. | signature | no (signed) | — | 404, 422, 429 |

## Sandbox payments (Phase 4)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/sandbox/psp/sessions/{id}` | Sandbox hosted page session (PAYMENT_MODE=mock only) | company | no | owner/procurement member of the paying buyer workspace | 403, 404, 409, 422 |
| `POST` | `/api/v1/sandbox/psp/sessions/{id}/complete` | Simulate the customer completing or failing the sandbox payment; queues a signed webhook (no money moves) | company | yes | owner/procurement member of the paying buyer workspace | 403, 404, 409, 422 |

## Admin orders and finance (Phase 4)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/orders` | All orders (support) | admin | no | admin.orders.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/orders/{id}` | Order detail | admin | no | admin.orders.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/finance/summary` | Ledger balances, payment states, open cases | admin | no | admin.finance.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/finance/payments` | Payment attempts | admin | no | admin.finance.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/finance/reconciliation` | Reconciliation cases | admin | no | admin.finance.read | 403, 404, 409, 422 |

## Phase 5 conventions
- Seller fulfilment and dispute routes are scoped by the seller workspace; buyer receipt, review and dispute routes by the buyer workspace. Another workspace's order, dispute, proof or evidence file returns 404.
- Shipping actions check the role only (`seller.inventory.ship`), so a restricted company can still deliver paid orders; buyer receipt, review and disputes need `buyer.orders.act`.
- Refunds and payouts use dual control: the requester can never approve (403 `refund.self_approval` / `payout.self_approval`, also a database CHECK). Approved items are sent to the provider adapter by the worker with an idempotency key; the ledger and the paid/refunded state change only on the provider's signed webhook. Duplicate and out-of-order events are ignored.
- Only the labelled sandbox adapter exists; `/admin/sandbox/operations/{ref}/complete` stands in for the provider and returns 404 unless `PAYMENT_MODE=mock`.
- Public storefront reviews never include the buyer company name.

## Seller fulfilment and disputes (Phase 5)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/seller/workspaces/{ws}/orders/{id}/process` | Start processing a confirmed order | company | yes | seller.inventory.ship (OWNER, WAREHOUSE; role only, works while trading is restricted) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/orders/{id}/dispatch` | Record dispatch (paid orders only; full shipment) | company | yes | seller.inventory.ship (OWNER, WAREHOUSE; role only, works while trading is restricted) | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/orders/{id}/deliver` | Report delivery with optional proof (PDF/PNG/JPEG; scanned) | company | yes | seller.inventory.ship (OWNER, WAREHOUSE; role only, works while trading is restricted) | 403, 404, 409, 422, 429, 503 |
| `GET` | `/api/v1/seller/workspaces/{ws}/orders/{id}/proof` | Download the delivery proof (audited) | company | no | any seller workspace member | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/orders/{id}/disputes` | Open a dispute on the order | company | yes | seller.inventory.ship or seller.catalog.edit (OWNER, SALES, WAREHOUSE) | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/disputes` | Disputes on this workspace's orders | company | no | any seller workspace member | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/disputes/{id}` | Dispute detail with messages and evidence | company | no | any seller workspace member | 403, 404, 409, 422 |
| `POST` | `/api/v1/seller/workspaces/{ws}/disputes/{id}/messages` | Add a message, optionally with evidence | company | yes | seller.inventory.ship or seller.catalog.edit (OWNER, SALES, WAREHOUSE) | 403, 404, 409, 422, 429, 503 |
| `GET` | `/api/v1/seller/workspaces/{ws}/disputes/{id}/files/{fileId}` | Download dispute evidence (audited) | company | no | any seller workspace member | 403, 404, 409, 422 |
| `GET` | `/api/v1/seller/workspaces/{ws}/finance` | Seller settlement summary: eligible, held, in payout, paid out | company | no | seller.finance (OWNER, FINANCE) | 403, 404, 409, 422 |

## Buyer fulfilment and disputes (Phase 5)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `POST` | `/api/v1/buyer/workspaces/{ws}/orders/{id}/confirm-receipt` | Confirm receipt; completes the order | company | yes | buyer.orders.act (OWNER, PROCUREMENT) | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/orders/{id}/review` | Rate the supplier once the order is completed | company | yes | buyer.orders.act (OWNER, PROCUREMENT) | 403, 404, 409, 422 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/orders/{id}/proof` | Download the delivery proof (audited) | company | no | any buyer workspace member | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/orders/{id}/disputes` | Open a dispute (within 14 days of completion) | company | yes | buyer.orders.act (OWNER, PROCUREMENT) | 403, 404, 409, 422 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/disputes` | Disputes on this workspace's orders | company | no | any buyer workspace member | 403, 404, 409, 422 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/disputes/{id}` | Dispute detail with messages and evidence | company | no | any buyer workspace member | 403, 404, 409, 422 |
| `POST` | `/api/v1/buyer/workspaces/{ws}/disputes/{id}/messages` | Add a message, optionally with evidence | company | yes | buyer.orders.act (OWNER, PROCUREMENT) | 403, 404, 409, 422, 429, 503 |
| `GET` | `/api/v1/buyer/workspaces/{ws}/disputes/{id}/files/{fileId}` | Download dispute evidence (audited) | company | no | any buyer workspace member | 403, 404, 409, 422 |

## Marketplace (Phase 5)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/marketplace/suppliers/{id}/reviews` | Published reviews of a public storefront (buyers anonymised) | none | no | public | 404, 429 |

## Admin disputes, refunds, payouts, reviews (Phase 5)

| Method | Path | Purpose | Auth | CSRF | Requires | Errors |
|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/disputes` | Dispute queue | admin | no | admin.disputes.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/disputes/{id}` | Dispute detail | admin | no | admin.disputes.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/disputes/{id}/assign` | Assign the dispute to yourself | admin | yes | admin.disputes.manage | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/disputes/{id}/request-evidence` | Ask both parties for evidence | admin | yes | admin.disputes.manage | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/disputes/{id}/propose` | Propose a resolution (refund proposals go to finance) | admin | yes | admin.disputes.manage | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/disputes/{id}/close` | Close without financial action | admin | yes | admin.disputes.manage | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/disputes/{id}/messages` | Message both parties | admin | yes | admin.disputes.manage | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/disputes/{id}/files/{fileId}` | Download dispute evidence (audited) | admin | no | admin.disputes.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/refunds` | Refunds | admin | no | admin.finance.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/refunds` | Request a refund (up to the remaining refundable amount) | admin | yes | admin.refunds.request | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/refunds/{id}/approve` | Approve a refund (a different finance user; dual control) | admin | yes | admin.refunds.approve | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/refunds/{id}/reject` | Reject a refund request | admin | yes | admin.refunds.approve | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/payouts/eligible` | Sellers with eligible, undisputed completed orders | admin | no | admin.finance.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/payouts` | Payouts | admin | no | admin.finance.read | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/payouts` | Request a payout of all eligible orders for one seller | admin | yes | admin.payouts.request | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/payouts/{id}/approve` | Approve a payout (a different finance user; dual control) | admin | yes | admin.payouts.approve | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/payouts/{id}/reject` | Reject a payout request | admin | yes | admin.payouts.approve | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/sandbox/operations/{ref}/complete` | SANDBOX ONLY: simulate the provider finishing a refund or payout | admin | yes | admin.finance.read | 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/reviews` | Reviews for moderation | admin | no | admin.reviews.moderate | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/reviews/{id}/hide` | Hide a review (reason recorded) | admin | yes | admin.reviews.moderate | 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/reviews/{id}/unhide` | Publish a hidden review again | admin | yes | admin.reviews.moderate | 403, 404, 409, 422 |

## Rate limits (per policy; `RATE_LIMIT_SCALE` multiplies them outside production only)

| Policy | Limit |
|---|---|
| login per IP / per account | 50 / 10 per 15 min |
| register per IP | 10 per hour |
| verification/reset emails per account / per IP | 3 / 20 per hour |
| token endpoints per IP | 30 per 15 min |
| admin login per IP / per account | 20 / 5 per 15 min |
| MFA attempts per admin | 5 per 5 min |
| invitations per workspace | 50 per day |
| company creation per user | 5 per day |
| uploads per user | 60 per hour |
| marketplace reads per IP | 600 per minute |
| buyer list changes per user | 300 per minute |
| messages sent per user (Phase 3) | 60 per minute |
| checkout create and pay per user (Phase 4) | 30 per minute |
| payment webhooks per IP (Phase 4) | 600 per minute |
