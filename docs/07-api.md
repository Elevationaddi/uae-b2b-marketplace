# API specification
REST JSON `/api/v1`; generate OpenAPI from validated DTOs, export into repository. Cookie session for web with CSRF protection; mobile token flow later. `X-Workspace-Id` selects context but membership verified server-side. Admin uses distinct session scope. JSON snake_case keys matching schema; UUID strings; money/qty decimal strings; ISO UTC timestamps. Pagination `limit` 1–100 default 25, opaque cursor, stable created_at/id order. Filter allowlist; never arbitrary SQL or field selection.

Success `{ "data": ..., "meta": { "next_cursor": null } }`; error `{ "error": { "code": "MOQ_NOT_MET", "message_key": "cart.moq", "field_errors": {"quantity":"min"}, "request_id":"..." } }`. 400 malformed, 401 unauthenticated, 403 action forbidden, 404 unknown or inaccessible resource, 409 stale state/conflict, 422 validation, 429 throttle, 503 provider unavailable. POST monetary/award/order mutations require `Idempotency-Key`; same key+body replays response, changed body returns 409. Mutating state with expected version rejects stale updates.

| Method/path (relative) | Actor | Input → result |
|---|---|---|
| POST /auth/register | public | email,password,locale → user pending verification |
| POST /auth/verify-email | public | token → verified |
| POST /auth/login | public | credentials,MFA if required → session |
| POST /auth/logout | signed in | revoke session |
| POST /auth/password-reset/request, /confirm | public | email or token,new_password → generic response |
| GET /me | signed in | user, authorized workspaces, capabilities |
| POST /companies | verified user | legal details, requested kinds → company + owner memberships |
| GET/PATCH /companies/:id | member/owner | company details or permitted draft edits |
| POST /companies/:id/verification | owner | document IDs,terms_version → submitted case |
| GET /companies/:id/verification | member | current case/status |
| POST /workspaces/:id/invitations | owner | email,role → invitation |
| POST /invitations/accept | signed in | token → membership |
| PATCH /memberships/:id | owner | role/status → membership |
| GET/POST /addresses; PATCH/DELETE /addresses/:id | member/owner or procurement | address fields → address/list; archive |
| POST /files/presign | authorized | purpose,mime,bytes → short-lived upload URL/file ID |
| POST /files/:id/complete | uploader | checksum → scan queued |
| GET /files/:id/download | authorized | short-lived signed URL only if clean |
| GET /categories | verified | active tree |
| GET /marketplace/products | buyer | q,category,emirate,mode,moq,price,sort,cursor → approved listings |
| GET /marketplace/products/:id | buyer | approved detail + SKU tiers |
| GET /marketplace/suppliers; GET /marketplace/suppliers/:id | buyer | directory/profile |
| GET/POST /saved; DELETE /saved/:id | buyer | target ID/type → saved record |
| GET/PATCH /seller/storefront | seller | approved/draft detail, profile fields |
| POST /seller/storefront/submit | seller owner | version → pending moderation |
| GET/POST /seller/products; GET/PATCH /seller/products/:id | seller sales/owner | catalog fields → draft/detail |
| POST /seller/products/:id/submit, /archive | seller sales/owner | expected_version → state |
| PUT /seller/skus/:id/tiers | seller sales/owner | tiers[] → validated tiers |
| GET /seller/inventory; POST /seller/inventory/:sku/adjust | warehouse/owner | delta,reason → stock result |
| GET/POST /rfqs; GET/PATCH /rfqs/:id | buyer / eligible seller read | specs,deadline,visibility → draft/detail |
| POST /rfqs/:id/publish, /cancel | buyer | expected_version → state |
| GET /seller/rfqs | seller | eligible pool or invitations only |
| POST /rfqs/:id/quotes | seller sales/owner | specs,qty,unit_price,shipping,tax_code,valid_until,delivery_date,terms → quote draft |
| GET /rfqs/:id/quotes | buyer owner/procurement | own RFQ quotes; seller only own quote |
| POST /quotes/:id/submit, /revise, /withdraw | seller | version or new terms → immutable version/state |
| POST /quotes/:id/request-revision, /decline | buyer | version_id,reason → event |
| POST /quotes/:id/accept | buyer | version_id,address_id,PO ref → unpaid checkout/order |
| GET /cart; PUT /cart/items/:sku; DELETE /cart/items/:sku | buyer | qty → recalculated cart estimate |
| POST /checkout/preview | buyer | cart_id,address_id → seller-grouped totals/expiry |
| POST /checkouts | buyer | preview token,terms_version → reserved checkout/orders |
| POST /checkouts/:id/pay | buyer | return path allowlist → provider session URL |
| GET /checkouts/:id | buyer | status, totals, order IDs |
| GET /orders; GET /orders/:id | buyer/seller | scoped list/detail |
| POST /orders/:id/prepare | seller warehouse/owner | expected_state → processing |
| POST /orders/:id/shipments | seller warehouse/owner | carrier,tracking,items → shipment |
| POST /shipments/:id/deliver | seller warehouse/owner | proof_file_id → delivery reported |
| POST /orders/:id/confirm-receipt | buyer | expected_state → completed/settlement eligibility |
| POST /orders/:id/cancel-request | buyer/seller | reason → case or unpaid cancellation |
| POST /orders/:id/disputes | buyer/seller | type,reason,evidence → case |
| GET /disputes/:id; POST /disputes/:id/evidence | participant | evidence/message → case history |
| POST /orders/:id/reviews | buyer | rating,comment → review |
| GET/POST /conversations | buyer/seller | counterpart,context → scoped thread |
| GET/POST /conversations/:id/messages | participant | body/file_id → message |
| POST /conversations/:id/read | participant | last_message_id → receipt |
| GET /notifications; POST /notifications/:id/read | user | list/read |
| GET/PATCH /preferences | user | permitted channel/event prefs |
| GET/POST /tickets; GET /tickets/:id; POST /tickets/:id/messages | member | subject,body,order_id? → ticket |
| GET /finance/invoices; GET /finance/payouts | own finance/owner | list,totals,scoped export |
| POST /seller/settlement/onboard | seller finance/owner | provider onboarding URL |
| GET /plans; GET /subscriptions/current | member | active configuration/entitlements |
| POST /webhooks/:provider | PSP | raw signed payload → durable event receipt |
| GET /admin/overview, /companies, /users, /verification, /catalog, /rfqs, /orders, /transactions, /payouts, /disputes, /support, /logistics, /audit, /system, /reports, /plans, /staff | authorized admin | filters → scoped paginated data |
| POST /admin/verification/:id/decision | compliance | decision,reason,expected_state → case and company state |
| POST /admin/companies/:id/suspend, /reactivate | compliance | reason → state |
| POST /admin/users/:id/revoke-sessions | authorized admin | reason → audit |
| POST /admin/catalog/:id/decision | compliance | version_id,decision,reason → moderation |
| POST/PATCH /admin/categories[/:id] | compliance | category fields → tree |
| POST /admin/disputes/:id/assign, /resolve | support | assignee or proposal,reason → case |
| POST /admin/refunds | finance | payment_id,order_id,amount,reason → pending approval |
| POST /admin/refunds/:id/approve | finance approver | reason → queued provider request |
| POST /admin/payouts/:id/approve | finance approver | reason → queued if provider supports |
| POST /admin/webhooks/:id/retry | system admin | reason → queued replay |
| POST /admin/exports | scoped admin | report_type,filters,reason → export job |
| POST /admin/staff/:id/roles | super-admin | roles,reason → audited update |
| POST /admin/configuration/:key/draft | super-admin | version,value,reason → pending config |

Example checkout request: `{"preview_token":"opaque","terms_version":"v1","po_reference":"PO-123"}`. Response data includes checkout_id, state PENDING_PAYMENT, expires_at, orders[{id,seller_workspace_id,total}], currency AED,total, no card data. Preview token binds buyer, cart snapshot, shipping/tax versions and expiry. On mismatch return 409 PRICE_CHANGED with fresh preview; no automatic acceptance. Payment response includes provider session URL only after validated checkout; redirect is not confirmation.

Example quote accept request `{"version_id":"uuid","address_id":"uuid"}`; return order and checkout IDs, state, immutable totals; 409 QUOTE_EXPIRED / QUOTE_SUPERSEDED / RFQ_ALREADY_AWARDED. Do not accept client totals. Generate concrete DTO schemas and response examples for every implemented endpoint before coding its UI; this logical API contract is not an already validated OpenAPI file. Phase 2 endpoints require separate signed-off contracts.
