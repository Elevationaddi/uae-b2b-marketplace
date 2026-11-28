# 25. Technical handoff

This section tells designers and engineers where each screen lives in the code, which API it calls and which database entities it reads or writes. It describes the code at commit `2ccd947` (Phase 7 merged). Nothing in this package changes the application.

## 25.1 Stack

| Layer | Technology | Location |
|---|---|---|
| Monorepo | pnpm workspaces | `pnpm-workspace.yaml`, `package.json` |
| Web | Next.js 15 App Router, React, server and client components, in-repo EN/AR message catalogues | `apps/web/src/app/[locale]/…` (93 `page.tsx` files), `apps/web/src/components/`, `apps/web/src/i18n/` |
| API | NestJS, REST under `/api/v1` (258 endpoints) | `apps/api/src/{auth,admin,companies,team,catalog,rfq,commerce,fulfilment,operations,files}` |
| Worker | BullMQ on Redis: email delivery, expiries, licence reminders, payouts and other scheduled jobs | `apps/worker/src/{jobs.ts,worker.ts,email-templates.ts}` |
| Database | PostgreSQL via Prisma; migrations are additive | `packages/db/prisma/schema.prisma`, `packages/db/prisma/migrations/` |
| Contracts | zod schemas shared by web and API (request and response validation) | `packages/contracts/src/` |
| Design tokens | CSS custom properties (`--color-*`, `--space-*`, `--radius-*`) | `packages/ui/src/tokens.css` |
| Config | zod-validated environment; production refuses to start with sandbox adapters | `packages/config/src/env.ts` |
| Tests | Vitest unit and PostgreSQL integration tests; Playwright E2E with axe-core accessibility checks | `apps/*/src/**/*.test.ts`, `e2e/tests/` |

## 25.2 Authentication and sessions

- Company users: email and password (Argon2id), mandatory email verification, server-side sessions stored in PostgreSQL, `__Host-` session cookie (HttpOnly, Secure, SameSite=Lax), CSRF middleware on unsafe methods (`apps/api/src/common/csrf.middleware.ts`).
- Platform admins: separate admin origin in production, separate `asid` cookie (SameSite=Strict), mandatory TOTP with recovery codes (`apps/api/src/admin/mfa.service.ts`), no public registration (admins are created with `apps/api/src/cli/create-admin.ts`). Exports and some finance actions ask for a fresh TOTP code (step-up).
- Session expiry returns `error.auth.unauthenticated`; the web keeps the return URL and sends the user to sign in (AUTH-09).
- Rate limits on sign-in, registration, password reset, messages and uploads (`apps/api/src/common/rate-limit.service.ts`) surface as `error.common.rate_limited`.

## 25.3 Permissions

- Every company endpoint checks membership of the workspace in the URL and the capability for the action (section 2). The client never sends role, company ID, totals or status as trusted input.
- Buyer and seller are separate workspaces of a company. Trading capabilities are removed while the workspace is not ACTIVE (pending verification, suspended, licence expired), so screens show the action disabled with the reason rather than hiding it.
- Admin capabilities are separate from company capabilities. Design each admin screen for the least privileged role that can open it, and hide or disable actions the role lacks.
- Forbidden and not-found responses use the same copy so that the existence of another company's records is not revealed (SYS-01).

## 25.4 Uploads

- Uploads go through the API (multipart, one file per request), never directly from the browser to storage. Limits are enforced on the server: 10 MB for verification documents (`UPLOAD_MAX_BYTES`, `apps/api/src/companies/companies.controller.ts`) and category images; product images have their own limit (`IMAGE_MAX` in `apps/api/src/catalog/seller-catalog.controller.ts`).
- Storage is private S3-compatible object storage with two buckets: private (verification documents, attachments, evidence) and media (marketplace images). Objects are never publicly addressable; files are served through permission-checked endpoints (`apps/api/src/files/storage.service.ts`, `apps/api/src/catalog/media-access.service.ts`).
- Every file is scanned before it can be used. In development the scanner is `sandbox-eicar`, which only detects the EICAR test file and is refused in production; `disabled` refuses all uploads; a live scanner is not implemented yet (`apps/api/src/files/scanner.service.ts`). Upload components must show Uploading, Scanning, Clean, Blocked (malware) and Failed states.
- File purposes in the schema: VERIFICATION_DOCUMENT, PRODUCT_IMAGE, STOREFRONT_IMAGE, CATEGORY_IMAGE, RFQ_ATTACHMENT, QUOTE_ATTACHMENT, MESSAGE_ATTACHMENT (defined but not used by any screen), DELIVERY_PROOF, DISPUTE_EVIDENCE.

## 25.5 Payments and money

- `PAYMENT_MODE` is `disabled`, `mock` or `live` (`packages/config/src/env.ts`). Only `mock` is used today: a sandbox provider page (FIN-01) and a sandbox banner on every money screen. `mock` is refused in production; `live` requires provider keys and an explicit `FEATURE_REAL_PAYMENTS=true` approval flag, and no live provider adapter is connected.
- Payment success is taken only from the provider webhook (`apps/api/src/commerce/payment-webhook.service.ts`), never from the browser redirect. BUY-18 polls until a terminal state.
- All amounts are integer fils in AED and are calculated on the server. The web formats them with `formatFils` (Intl `en-AE` / `ar-AE`). Designers should never show a client-calculated total.
- Commission, VAT treatment and payout timing are founder decisions (section 27). Screens show the values the server returns and must not hard-code rates.

## 25.6 Email and notifications

- In-app notifications are rows in `notifications`, created by the API inside the same transaction as the business event (section 14).
- Email goes through the worker. `EMAIL_PROVIDER` is `disabled`, `smtp-dev` (development mail catcher) or `live`; production requires `live`, and no live provider is connected. Templates are plain text today (`apps/worker/src/email-templates.ts`); branded HTML email is design work (section 24).

## 25.7 Third parties and what is not connected

| Integration | State | Design impact |
|---|---|---|
| Payment provider (Stripe Connect preferred, Mamo fallback) | Not connected; sandbox only | FIN-01 is a sandbox page; real provider pages are external and not designed here |
| Email provider (Resend chosen) | Not connected; dev SMTP only | Email templates designed as HTML is new work |
| Malware scanner | Not connected; EICAR sandbox in development | Upload states must include Scanning and Blocked |
| Hosting (Azure UAE North preferred) | Not provisioned | None for screens |
| Maps, address lookup, SMS, WhatsApp, e-invoicing, shipping carriers | Not in the code | Do not design as existing; see section 26 |

## 25.8 Restrictions for design work

- Do not show a status, total, permission or count that the API does not return. Dashboard figures must come from real queries (section 8 lists what exists).
- Every list screen needs loading, empty, error and forbidden states (section 18).
- Do not design flows that imply real money movement until the founder approves live payments.

## 25.9 Screen map

Route is the Next.js path, or the screen type for dialogs, drawers, sections and actions (their host page is in section 4). API paths are relative to `/api/v1`.

| Screen | Name | Route | API endpoints | Database entities | Source | Status |
|---|---|---|---|---|---|---|
| PUB-01 | Marketplace home | `/{locale}` | GET /marketplace/home | categories, featured_listings, marketplace_products view, marketplace_suppliers view, marketplace_preferences | apps/web/src/app/[locale]/page.tsx; components/market-shell.tsx; apps/api/src/catalog/marketplace.service.ts | Implemented |
| PUB-02 | Category directory | `/{locale}/categories` | GET /marketplace/categories | categories | apps/web/src/app/[locale]/categories/page.tsx | Implemented |
| PUB-03 | Category page | `/{locale}/categories/[id]` | GET /marketplace/categories/{id}; GET /marketplace/products?category_id= | categories, category_attributes, marketplace_products | apps/web/src/app/[locale]/categories/[id]/page.tsx; components/search-results.tsx | Implemented |
| PUB-04 | Search results | `/{locale}/search?q=&…` | GET /marketplace/products | marketplace_products, category_attributes | apps/web/src/app/[locale]/search/page.tsx; components/search-results.tsx | Implemented |
| PUB-05 | Filter panel / mobile filter sheet | `Overlay on PUB-03/PUB-04` | — | — | components/search-results.tsx | Partial |
| PUB-06 | Search suggestions dropdown | `Overlay on header search` | GET /marketplace/suggest | marketplace_products, marketplace_suppliers, categories | components/market-shell.tsx | Implemented |
| PUB-07 | Product detail | `/{locale}/products/[id]` | GET /marketplace/products/{id}; /related; /estimate; POST /buyer/workspaces/{ws}/cart/items; POST/DELETE /marketplace/saved/products/{id}; /marketplace/compare/{id}; POST /marketplace/recent/{id} | products, product_versions, product_media, skus, price_tiers, inventory, storefronts | apps/web/src/app/[locale]/products/[id]/page.tsx | Implemented |
| PUB-08 | Product image viewer (lightbox) | `Overlay on PUB-07` | GET /media/{id} | files, product_media | — (current gallery: thumbnails + main image) | Recommended |
| PUB-09 | Supplier directory | `/{locale}/suppliers` | GET /marketplace/suppliers | marketplace_suppliers view, storefronts, storefront_media | apps/web/src/app/[locale]/suppliers/page.tsx | Implemented |
| PUB-10 | Supplier storefront (manufacturer profile) | `/{locale}/suppliers/[id]` | GET /marketplace/suppliers/{id}; GET /marketplace/suppliers/{id}/reviews; GET /marketplace/products?storefront_id= | storefronts, storefront_media, reviews | apps/web/src/app/[locale]/suppliers/[id]/page.tsx | Implemented |
| PUB-11 | Saved products and suppliers | `/{locale}/saved` | GET/POST/DELETE /marketplace/saved/products\|suppliers | saved_items | apps/web/src/app/[locale]/saved/page.tsx | Implemented |
| PUB-12 | Product comparison | `/{locale}/compare` | GET/POST/DELETE /marketplace/compare | comparison_items | apps/web/src/app/[locale]/compare/page.tsx | Implemented |
| PUB-13 | Recently viewed | `/{locale}/recent` | GET/DELETE /marketplace/recent | recently_viewed | apps/web/src/app/[locale]/recent/page.tsx | Implemented |
| PUB-14 | Marketplace preferences | `/{locale}/preferences` | GET/PATCH /marketplace/preferences | marketplace_preferences | apps/web/src/app/[locale]/preferences/page.tsx | Implemented |
| PUB-15 | System status | `/{locale}/status` | GET /health/ready | — | apps/web/src/app/[locale]/status/page.tsx | Implemented |
| PUB-16 | About the platform | `/{locale}/about (recommended)` | — | — | — | Recommended |
| PUB-17 | How it works | `/{locale}/how-it-works (recommended)` | — | — | — | Recommended |
| PUB-18 | Pricing and fees | `/{locale}/pricing (recommended)` | — (rate should be read from configuration when built) | — | — | Recommended |
| PUB-19 | Frequently asked questions | `/{locale}/faq (recommended)` | — | — | — | Recommended |
| PUB-20 | Help centre | `/{locale}/help (recommended)` | — | — | — | Recommended |
| PUB-21 | Contact | `/{locale}/contact (recommended)` | Not built (needs endpoint + email provider) | — | — | Recommended |
| PUB-22 | Terms and conditions | `/{locale}/legal/terms (recommended)` | — | companies.terms_version | packages/contracts/src/companies.ts (CURRENT_TERMS_VERSION) | Blocked |
| PUB-23 | Privacy policy | `/{locale}/legal/privacy (recommended)` | — | — | — | Blocked |
| PUB-24 | Returns, refunds and cancellation policy | `/{locale}/legal/returns (recommended)` | — | — | — | Blocked |
| PUB-25 | Other policy pages (template) | `/{locale}/legal/[slug] (recommended)` | — | — | — | Blocked |
| PUB-26 | Become a supplier | `/{locale}/sell (recommended)` | — | — | — | Recommended |
| PUB-27 | Site footer and legal centre | `Global footer` | — | — | — (no footer exists today) | Recommended |
| AUTH-01 | Create account (register) | `/{locale}/register` | POST /auth/register | users, user_tokens | apps/web/src/app/[locale]/register/page.tsx; packages/contracts/src/auth.ts | Implemented |
| AUTH-02 | Check your email | `/{locale}/register (success state)` | POST /auth/resend-verification | user_tokens | register/page.tsx | Implemented |
| AUTH-03 | Verify email | `/{locale}/verify-email#token=…` | POST /auth/verify-email | users.email_verified_at, user_tokens | verify-email/page.tsx | Implemented |
| AUTH-04 | Sign in | `/{locale}/login?next=` | POST /auth/login | sessions | login/page.tsx; lib/nav.ts (safeNext) | Implemented |
| AUTH-05 | Forgot password | `/{locale}/forgot-password` | POST /auth/password-reset/request | user_tokens | forgot-password/page.tsx | Implemented |
| AUTH-06 | Reset password | `/{locale}/reset-password#token=…` | POST /auth/password-reset/confirm | users, sessions | reset-password/page.tsx | Implemented |
| AUTH-07 | Email verification gate | `Any /app route before verification` | POST /auth/resend-verification | users | components/session.tsx (UnverifiedNotice) | Implemented |
| AUTH-08 | Accept team invitation | `/{locale}/invitations/accept#token=…` | POST /invitations/preview; POST /invitations/accept | invitations, memberships | invitations/accept/page.tsx | Implemented |
| AUTH-09 | Session expired / signed out | `Redirect to /{locale}/login?next=` | Any 401 | sessions | components/session.tsx | Partial |
| AUTH-10 | Admin sign in | `/{locale}/admin/login (admin origin only)` | POST /admin/auth/login | users (PLATFORM_ADMIN), sessions (ADMIN scope) | admin/login/page.tsx; lib/hosts.ts | Implemented |
| AUTH-11 | Admin MFA enrolment | `/{locale}/admin/mfa` | POST /admin/auth/mfa/enroll/start; /enroll/confirm | users.mfa_secret_enc | admin/mfa/page.tsx | Implemented |
| AUTH-12 | Admin recovery codes | `/{locale}/admin/mfa (step)` | (returned by enroll/confirm) | mfa_recovery_codes | admin/mfa/page.tsx | Implemented |
| AUTH-13 | Admin MFA verification | `/{locale}/admin/mfa (verify)` | POST /admin/auth/mfa/verify | sessions.mfa_verified_at | admin/mfa/page.tsx | Implemented |
| ACC-01 | Home (workspace hub) | `/{locale}/app` | GET /me | users, memberships, workspaces, companies | apps/web/src/app/[locale]/app/page.tsx | Implemented |
| ACC-02 | Register a company (onboarding) | `/{locale}/app/onboarding` | POST /companies | companies, workspaces, memberships | app/onboarding/page.tsx; components/company-form.tsx; packages/contracts/src/companies.ts | Implemented |
| ACC-03 | Company profile and verification | `/{locale}/app/company/[companyId]` | GET/PATCH /companies/{id}; GET/POST /companies/{id}/verification; POST /companies/{id}/documents; DELETE …/documents/{id}; POST /companies/{id}/renewal; GET /files/{id}/download | companies, verification_cases, verification_case_events, verification_documents, files | app/company/[companyId]/page.tsx | Implemented |
| ACC-04 | Edit company details | `Mode of ACC-03` | PATCH /companies/{id} | companies | components/company-form.tsx | Implemented |
| ACC-05 | Verification document upload | `Section of ACC-03` | POST /companies/{id}/documents | files, verification_documents | app/company/[companyId]/page.tsx | Implemented |
| ACC-06 | Submit for verification (terms) | `Section of ACC-03` | POST /companies/{id}/verification | verification_cases, companies.terms_version | app/company/[companyId]/page.tsx | Implemented |
| ACC-07 | Licence renewal | `Section of ACC-03` | POST /companies/{id}/renewal | verification_cases (RENEWAL, proposed) | app/company/[companyId]/page.tsx | Implemented |
| ACC-08 | Remove document dialog | `Dialog on ACC-03` | DELETE /companies/{id}/documents/{documentId} | verification_documents | components/ui.tsx (ConfirmDialog) | Implemented |
| ACC-09 | Team management | `/{locale}/app/team/[workspaceId]` | GET /workspaces/{id}/members; GET/POST/DELETE /workspaces/{id}/invitations; PATCH /memberships/{id} | memberships, invitations | app/team/[workspaceId]/page.tsx | Implemented |
| ACC-10 | Invite team member form | `Section of ACC-09` | POST /workspaces/{id}/invitations | invitations | app/team/[workspaceId]/page.tsx | Implemented |
| ACC-11 | Change role dialog | `Dialog on ACC-09` | PATCH /memberships/{id} | memberships | team page | Implemented |
| ACC-12 | Remove access dialog | `Dialog on ACC-09` | PATCH /memberships/{id} | memberships | team page | Implemented |
| ACC-13 | Account settings | `/{locale}/app/settings` | GET/PATCH /me; GET /me/sessions; DELETE /me/sessions/{id}; POST /me/sessions/revoke-others; POST /me/password; GET/PATCH /notifications/preferences | users, sessions, notification_preferences | app/settings/page.tsx | Implemented |
| ACC-14 | Notification centre | `/{locale}/app/notifications` | GET /notifications; POST /notifications/{id}/read; POST /notifications/read-all; GET /notifications/unread | notifications | app/notifications/page.tsx | Implemented |
| ACC-15 | Workspace switcher | `Header control (all /app pages)` | GET /me | memberships | components/session.tsx | Implemented |
| ACC-16 | Account closure and data requests | `Not built` | Not built | Not built | — | Planned |
| ACC-17 | Billing, invoices and statements | `Not built (spec /account/billing, /finance/invoices)` | Not built | invoices (spec only) | — | Blocked |
| MSG-01 | Conversations list | `/{locale}/app/messages/[workspaceId]` | GET /workspaces/{ws}/conversations | conversations, messages, read_receipts | app/messages/[workspaceId]/page.tsx | Implemented |
| MSG-02 | Conversation thread | `/{locale}/app/messages/[workspaceId]/[conversationId]` | GET/POST /workspaces/{ws}/conversations/{id}/messages; POST …/read; GET …/{id} | messages, read_receipts | app/messages/[workspaceId]/[conversationId]/page.tsx | Implemented |
| MSG-03 | New message to supplier | `/{locale}/app/messages/new?storefront=…` | POST /workspaces/{ws}/conversations | conversations | app/messages/new/page.tsx | Implemented |
| MSG-04 | Message attachments | `Part of MSG-02` | Not built | messages.file_id (reserved), files (MESSAGE_ATTACHMENT) | — | Planned |
| SYS-01 | Not found / not available | `Any unknown or inaccessible resource` | 404 responses | — | components/ui.tsx (NotFound, Forbidden) | Implemented |
| SYS-02 | Error with retry and reference | `Any failed load or action` | Error envelope {code, message_key, field_errors, request_id} | — | components/ui.tsx (ApiErrorAlert) | Implemented |
| SYS-03 | Sandbox environment banner | `Global (top of every page)` | GET /public/config | — | app/[locale]/layout.tsx | Implemented |
| SYS-04 | Trading unavailable / maintenance | `Recommended` | viewer.trading.reason = checkout_disabled | — | — | Recommended |
| BUY-01 | Buyer dashboard | `/{locale}/app/buyer/[workspaceId]` | Existing: GET /buyer/workspaces/{ws}/rfqs, /orders, /disputes, /workspaces/{ws}/support. New: GET /buyer/workspaces/{ws}/overview (aggregate counts and spend) | rfqs, quotes, checkouts, orders, disputes, support_tickets | None yet (buyer-shell.tsx holds the sub-nav) | Recommended |
| BUY-02 | Requests for quotation list | `/{locale}/app/buyer/[workspaceId]/rfqs` | GET /buyer/workspaces/{ws}/rfqs | rfqs, quotes | apps/web/src/app/[locale]/app/buyer/[workspaceId]/rfqs/page.tsx | Implemented |
| BUY-03 | New request for quotation | `/{locale}/app/buyer/[workspaceId]/rfqs/new` | POST /buyer/workspaces/{ws}/rfqs; POST /buyer/workspaces/{ws}/rfqs/{id}/files; GET /buyer/workspaces/{ws}/invite-candidates | rfqs, rfq_invitations, rfq_files, files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/rfqs/new/page.tsx | Implemented |
| BUY-04 | Request quotation entry (workspace chooser) | `/{locale}/app/rfqs/new` | — | — | apps/web/src/app/[locale]/app/rfqs/new/page.tsx | Implemented |
| BUY-05 | Request for quotation detail (buyer) | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId]` | GET /buyer/workspaces/{ws}/rfqs/{id} | rfqs, rfq_events, quotes, quote_versions, rfq_files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/rfqs/[rfqId]/page.tsx | Implemented |
| BUY-06 | Edit request draft | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId] (edit mode)` | PATCH /buyer/workspaces/{ws}/rfqs/{id}; POST/DELETE /buyer/workspaces/{ws}/rfqs/{id}/files | rfqs, rfq_files | rfqs/[rfqId]/page.tsx | Implemented |
| BUY-07 | Publish request dialog | `Dialog on BUY-05` | POST /buyer/workspaces/{ws}/rfqs/{id}/publish | rfqs, rfq_invitations, notifications, outbox | rfqs/[rfqId]/page.tsx | Implemented |
| BUY-08 | Cancel request dialog | `Dialog on BUY-05` | POST /buyer/workspaces/{ws}/rfqs/{id}/cancel | rfqs, quotes, rfq_events | rfqs/[rfqId]/page.tsx | Implemented |
| BUY-09 | Invite suppliers picker | `Panel in BUY-03/BUY-06` | GET /buyer/workspaces/{ws}/invite-candidates | marketplace_suppliers | rfqs/new/page.tsx | Implemented |
| BUY-10 | Quote comparison | `Section of BUY-05` | GET /buyer/workspaces/{ws}/rfqs/{id} | quotes, quote_versions | rfqs/[rfqId]/page.tsx | Implemented |
| BUY-11 | Quote detail and version history | `Expandable within BUY-05` | GET /buyer/workspaces/{ws}/rfqs/{id}; GET /buyer/workspaces/{ws}/rfqs/{id}/files/{fileId} | quote_versions, quote_files | rfqs/[rfqId]/page.tsx | Implemented |
| BUY-12 | Accept quote dialog | `Dialog on BUY-05` | POST /buyer/workspaces/{ws}/quotes/{quoteId}/accept | quotes, rfqs, checkouts, orders | rfqs/[rfqId]/page.tsx | Implemented |
| BUY-13 | Request revision dialog | `Dialog on BUY-05` | POST /buyer/workspaces/{ws}/quotes/{quoteId}/request-revision | quotes, rfq_events | rfqs/[rfqId]/page.tsx | Implemented |
| BUY-14 | Decline quote dialog | `Dialog on BUY-05` | POST /buyer/workspaces/{ws}/quotes/{quoteId}/decline | quotes | rfqs/[rfqId]/page.tsx | Implemented |
| BUY-15 | Counteroffer to supplier | `Dialog on BUY-05 (proposed)` | New: POST /buyer/workspaces/{ws}/quotes/{quoteId}/counter | New quote_counteroffers table or event payload | — | Planned |
| BUY-16 | Cart | `/{locale}/app/buyer/[workspaceId]/cart` | GET/POST/PATCH/DELETE /buyer/workspaces/{ws}/cart(/items) | carts, cart_items, skus, inventory, price_tiers | apps/web/src/app/[locale]/app/buyer/[workspaceId]/cart/page.tsx | Implemented |
| BUY-17 | Checkout | `/{locale}/app/buyer/[workspaceId]/checkout` | POST /buyer/workspaces/{ws}/checkout/preview; POST /buyer/workspaces/{ws}/checkouts | checkouts, orders, order_lines, reservations, addresses | apps/web/src/app/[locale]/app/buyer/[workspaceId]/checkout/page.tsx | Implemented |
| BUY-18 | Checkout status and payment | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId]` | GET /buyer/workspaces/{ws}/checkouts/{id}; POST /pay; POST /cancel | checkouts, payments, orders, reconciliation_cases | apps/web/src/app/[locale]/app/buyer/[workspaceId]/checkouts/[checkoutId]/page.tsx | Implemented |
| BUY-19 | Cancel checkout dialog | `Dialog on BUY-18` | POST /buyer/workspaces/{ws}/checkouts/{id}/cancel | checkouts, orders, reservations | checkouts/[checkoutId]/page.tsx | Implemented |
| BUY-20 | Delivery addresses | `/{locale}/app/buyer/[workspaceId]/addresses` | GET/POST/PATCH/DELETE /buyer/workspaces/{ws}/addresses | addresses | apps/web/src/app/[locale]/app/buyer/[workspaceId]/addresses/page.tsx | Implemented |
| BUY-21 | Address form | `Form on BUY-20` | POST/PATCH /buyer/workspaces/{ws}/addresses(/{id}) | addresses | addresses/page.tsx | Implemented |
| BUY-22 | Remove address dialog | `Dialog on BUY-20` | DELETE /buyer/workspaces/{ws}/addresses/{id} | addresses | addresses/page.tsx | Implemented |
| BUY-23 | Orders list (buyer) | `/{locale}/app/buyer/[workspaceId]/orders` | GET /buyer/workspaces/{ws}/orders | orders | apps/web/src/app/[locale]/app/buyer/[workspaceId]/orders/page.tsx | Implemented |
| BUY-24 | Order detail (buyer) | `/{locale}/app/buyer/[workspaceId]/orders/[orderId]` | GET /buyer/workspaces/{ws}/orders/{id}; GET /proof | orders, order_lines, order_events, shipments, refunds, reviews | apps/web/src/app/[locale]/app/buyer/[workspaceId]/orders/[orderId]/page.tsx | Implemented |
| BUY-25 | Confirm receipt dialog | `Dialog on BUY-24` | POST /buyer/workspaces/{ws}/orders/{id}/confirm-receipt | orders, settlements | orders/[orderId]/page.tsx | Implemented |
| BUY-26 | Rate supplier form | `Section of BUY-24` | POST /buyer/workspaces/{ws}/orders/{id}/review | reviews | orders/[orderId]/page.tsx | Implemented |
| BUY-27 | Open dispute form (buyer) | `Dialog on BUY-24` | POST /buyer/workspaces/{ws}/orders/{id}/disputes | disputes, settlements | orders/[orderId]/page.tsx | Implemented |
| BUY-28 | Invoices and tax documents (buyer) | `/{locale}/app/buyer/[workspaceId]/invoices (proposed)` | New invoice endpoints | New invoices, credit_notes | — | Blocked |
| BUY-29 | Payment history (buyer) | `/{locale}/app/buyer/[workspaceId]/payments (proposed)` | New GET /buyer/workspaces/{ws}/payments | payments, refunds | — | Recommended |
| BUY-30 | Reorder | `Action on BUY-24 (proposed)` | New POST /buyer/workspaces/{ws}/orders/{id}/reorder | carts | — | Planned |
| BUY-31 | Request order cancellation (buyer) | `Dialog on BUY-24 (proposed)` | New endpoints | New cancellation_requests | — | Planned |
| BUY-32 | Request a sample | `Action on PUB-07 (proposed)` | Could reuse RFQ with a "sample" flag | rfqs | — | Recommended |
| SHR-01 | Disputes list | `/{locale}/app/buyer/[workspaceId]/disputes and /{locale}/app/seller/[workspaceId]/disputes` | GET /buyer/workspaces/{ws}/disputes; GET /seller/workspaces/{ws}/disputes | disputes | app/buyer/[workspaceId]/disputes/page.tsx; app/seller/[workspaceId]/disputes/page.tsx | Implemented |
| SHR-02 | Dispute detail | `/{locale}/app/buyer/[workspaceId]/disputes/[disputeId] and /{locale}/app/seller/[workspaceId]/disputes/[disputeId]` | GET/POST …/disputes/{id}(/messages); GET …/files/{fileId} | disputes, dispute_messages, files | disputes/[disputeId]/page.tsx (buyer and seller) | Implemented |
| SHR-03 | Support tickets list | `/{locale}/app/buyer/[workspaceId]/support and /{locale}/app/seller/[workspaceId]/support` | GET /workspaces/{ws}/support | support_tickets | app/buyer/[workspaceId]/support/page.tsx; app/seller/[workspaceId]/support/page.tsx | Implemented |
| SHR-04 | New support ticket | `/{locale}/app/buyer/[workspaceId]/support/new and /{locale}/app/seller/[workspaceId]/support/new` | POST /workspaces/{ws}/support | support_tickets | support/new/page.tsx | Implemented |
| SHR-05 | Support ticket detail | `/{locale}/app/buyer/[workspaceId]/support/[ticketId] and /{locale}/app/seller/[workspaceId]/support/[ticketId]` | GET /workspaces/{ws}/support/{id}; POST /messages, /close, /reopen | support_tickets, support_messages | support/[ticketId]/page.tsx | Implemented |
| SHR-06 | Close or reopen ticket dialog | `Dialog on SHR-05` | POST /workspaces/{ws}/support/{id}/close \| /reopen | support_tickets | support/[ticketId]/page.tsx | Implemented |
| FIN-01 | Sandbox payment page | `/{locale}/sandbox-pay/[sessionId]` | GET /sandbox/psp/sessions/{id}; POST /sandbox/psp/sessions/{id}/complete | payments, webhook_events | apps/web/src/app/[locale]/sandbox-pay/[sessionId]/page.tsx | Implemented |
| FIN-02 | Live payment provider checkout | `Provider-hosted page (external)` | Provider adapter (not built) | payments | — | Blocked |
| FIN-03 | Bank transfer instructions | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId] (proposed state)` | — | — | — | Blocked |
| SEL-01 | Seller overview (dashboard) | `/{locale}/app/seller/[workspaceId]` | GET /seller/workspaces/{ws}/overview | products, product_versions, inventory, storefronts | apps/web/src/app/[locale]/app/seller/[workspaceId]/page.tsx | Implemented |
| SEL-02 | Storefront editor | `/{locale}/app/seller/[workspaceId]/storefront` | GET/PATCH /seller/workspaces/{ws}/storefront | storefronts | apps/web/src/app/[locale]/app/seller/[workspaceId]/storefront/page.tsx | Implemented |
| SEL-03 | Storefront media manager | `Section of SEL-02` | Storefront media endpoints under /seller/workspaces/{ws}/storefront | storefront_media, files | storefront/page.tsx | Implemented |
| SEL-04 | Delivery terms | `Section of SEL-02` | PATCH /seller/workspaces/{ws}/storefront | storefronts | storefront/page.tsx | Implemented |
| SEL-05 | Publish or take storefront offline dialog | `Dialog on SEL-02` | POST /seller/workspaces/{ws}/storefront/publish \| /unpublish | storefronts | storefront/page.tsx | Implemented |
| SEL-06 | Product list | `/{locale}/app/seller/[workspaceId]/products` | GET /seller/workspaces/{ws}/products?tab= | products, product_versions | apps/web/src/app/[locale]/app/seller/[workspaceId]/products/page.tsx | Implemented |
| SEL-07 | Add product | `/{locale}/app/seller/[workspaceId]/products/new` | POST /seller/workspaces/{ws}/products | products, product_versions, skus | products/new/page.tsx | Implemented |
| SEL-08 | Product editor (content) | `/{locale}/app/seller/[workspaceId]/products/[productId]` | GET/PATCH /seller/workspaces/{ws}/products/{id} | products, product_versions, category_attributes | apps/web/src/app/[locale]/app/seller/[workspaceId]/products/[productId]/page.tsx | Implemented |
| SEL-09 | Product media manager | `Section of SEL-08` | Product media endpoints | product_media, files | products/[productId]/page.tsx | Implemented |
| SEL-10 | Variants (SKU) manager | `Section of SEL-08` | POST/PATCH/DELETE /seller/workspaces/{ws}/products/{id}/skus(/{skuId}) | skus | products/[productId]/page.tsx | Implemented |
| SEL-11 | Product pricing editor | `Section of SEL-08` | POST /seller/workspaces/{ws}/products/{id}/pricing | price_tiers, skus | products/[productId]/page.tsx | Implemented |
| SEL-12 | Submit for review dialog | `Dialog on SEL-08` | POST /seller/workspaces/{ws}/products/{id}/submit | product_versions | products/[productId]/page.tsx | Implemented |
| SEL-13 | Listing lifecycle dialogs | `Dialogs on SEL-08` | POST /seller/workspaces/{ws}/products/{id}/withdraw\|unpublish\|republish\|archive\|restore\|duplicate | products, product_versions | products/[productId]/page.tsx | Implemented |
| SEL-14 | Moderation history | `Section of SEL-08` | GET /seller/workspaces/{ws}/products/{id} | product_versions, moderation_decisions | products/[productId]/page.tsx | Implemented |
| SEL-15 | Inventory | `/{locale}/app/seller/[workspaceId]/inventory` | GET /seller/workspaces/{ws}/inventory | inventory, skus | apps/web/src/app/[locale]/app/seller/[workspaceId]/inventory/page.tsx | Implemented |
| SEL-16 | Stock adjustment dialog | `Dialog on SEL-15` | POST /seller/workspaces/{ws}/inventory/{skuId}/adjust | inventory, stock_movements | inventory/page.tsx | Implemented |
| SEL-17 | Low-stock threshold and restock date | `Inline form on SEL-15` | PATCH /seller/workspaces/{ws}/inventory/{skuId} | inventory | inventory/page.tsx | Implemented |
| SEL-18 | Stock movement history | `Drawer on SEL-15` | GET /seller/workspaces/{ws}/inventory/{skuId}/movements | stock_movements | inventory/page.tsx | Implemented |
| SEL-19 | Pricing overview | `/{locale}/app/seller/[workspaceId]/pricing` | GET /seller/workspaces/{ws}/products | price_tiers | apps/web/src/app/[locale]/app/seller/[workspaceId]/pricing/page.tsx | Implemented |
| SEL-20 | Quotation requests inbox | `/{locale}/app/seller/[workspaceId]/rfqs` | GET /seller/workspaces/{ws}/rfqs | rfqs, rfq_invitations, quotes | apps/web/src/app/[locale]/app/seller/[workspaceId]/rfqs/page.tsx | Implemented |
| SEL-21 | Request detail (seller) | `/{locale}/app/seller/[workspaceId]/rfqs/[rfqId]` | GET /seller/workspaces/{ws}/rfqs/{id} | rfqs, quotes, quote_versions | rfqs/[rfqId]/page.tsx (seller) | Implemented |
| SEL-22 | Quote form | `Form on SEL-21` | POST /seller/workspaces/{ws}/rfqs/{id}/quote; PATCH /seller/workspaces/{ws}/quotes/{id}; POST /files | quotes, quote_versions, quote_files | rfqs/[rfqId]/page.tsx (seller) | Implemented |
| SEL-23 | Submit quote dialog | `Dialog on SEL-21` | POST /seller/workspaces/{ws}/quotes/{id}/submit \| /revise | quote_versions | rfqs/[rfqId]/page.tsx | Implemented |
| SEL-24 | Withdraw quote dialog | `Dialog on SEL-21` | POST /seller/workspaces/{ws}/quotes/{id}/withdraw | quotes | rfqs/[rfqId]/page.tsx | Implemented |
| SEL-25 | Ask the buyer a question | `Dialog on SEL-21` | POST /workspaces/{ws}/conversations | conversations, messages | rfqs/[rfqId]/page.tsx | Implemented |
| SEL-26 | Quotes list (seller) | `/{locale}/app/seller/[workspaceId]/quotes` | GET /seller/workspaces/{ws}/quotes | quotes | apps/web/src/app/[locale]/app/seller/[workspaceId]/quotes/page.tsx | Implemented |
| SEL-27 | Orders list (seller) | `/{locale}/app/seller/[workspaceId]/orders` | GET /seller/workspaces/{ws}/orders | orders | apps/web/src/app/[locale]/app/seller/[workspaceId]/orders/page.tsx | Implemented |
| SEL-28 | Order detail (seller) | `/{locale}/app/seller/[workspaceId]/orders/[orderId]` | GET /seller/workspaces/{ws}/orders/{id}; POST /process | orders, order_lines, shipments, settlements | apps/web/src/app/[locale]/app/seller/[workspaceId]/orders/[orderId]/page.tsx | Implemented |
| SEL-29 | Record dispatch dialog | `Dialog on SEL-28` | POST /seller/workspaces/{ws}/orders/{id}/dispatch | shipments, orders | orders/[orderId]/page.tsx | Implemented |
| SEL-30 | Report delivery dialog | `Dialog on SEL-28` | POST /seller/workspaces/{ws}/orders/{id}/deliver | shipments, files | orders/[orderId]/page.tsx | Implemented |
| SEL-31 | Open dispute (seller) | `Dialog on SEL-28` | POST /seller/workspaces/{ws}/orders/{id}/disputes | disputes | orders/[orderId]/page.tsx | Implemented |
| SEL-32 | Seller finance | `/{locale}/app/seller/[workspaceId]/finance` | GET /seller/workspaces/{ws}/finance | settlements, payouts, ledger_entries | apps/web/src/app/[locale]/app/seller/[workspaceId]/finance/page.tsx | Implemented |
| SEL-33 | Payout account onboarding | `/{locale}/app/seller/[workspaceId]/finance/payout-account (proposed)` | Provider onboarding (not built) | New payout_accounts | — | Blocked |
| SEL-34 | Statements and commission invoices | `/{locale}/app/seller/[workspaceId]/finance/statements (proposed)` | — | New statements, invoices | — | Blocked |
| SEL-35 | Seller analytics | `/{locale}/app/seller/[workspaceId]/analytics (proposed)` | — | New product_view_events; rfqs, quotes, orders | — | Planned |
| SEL-36 | Supplier order cancellation | `Dialog on SEL-28 (proposed)` | — | orders, refunds | — | Planned |
| SEL-37 | Returns handling | `/{locale}/app/seller/[workspaceId]/returns (proposed)` | — | New returns | — | Planned |
| SEL-38 | Production milestones (made to order) | `Section of SEL-28 (proposed)` | — | New order_milestones | — | Recommended |
| ADM-01 | Admin overview and operations | `/{locale}/admin` | GET /admin/overview; GET /admin/operations/overview | companies, users, disputes, support_tickets, reconciliation_cases, refunds, payouts, ledger_entries | apps/web/src/app/[locale]/admin/page.tsx | Implemented |
| ADM-02 | Verification queue | `/{locale}/admin/verification` | GET /admin/verification | verification_cases, companies | apps/web/src/app/[locale]/admin/verification/page.tsx | Implemented |
| ADM-03 | Verification case detail | `/{locale}/admin/verification/[caseId]` | GET /admin/verification/{id}; POST /start-review; GET /admin/files/{id}/download | verification_cases, company_documents, files, audit_events | apps/web/src/app/[locale]/admin/verification/[caseId]/page.tsx | Implemented |
| ADM-04 | Verification decision dialog | `Dialog on ADM-03` | POST /admin/verification/{id}/decision | verification_cases, companies, workspaces, notifications | verification/[caseId]/page.tsx | Implemented |
| ADM-05 | Companies | `/{locale}/admin/companies` | GET /admin/companies | companies | apps/web/src/app/[locale]/admin/companies/page.tsx | Implemented |
| ADM-06 | Company detail (admin) | `/{locale}/admin/companies/[companyId]` | GET /admin/companies/{id} | companies, workspaces, memberships, verification_cases | apps/web/src/app/[locale]/admin/companies/[companyId]/page.tsx | Implemented |
| ADM-07 | Suspend or reactivate company dialog | `Dialog on ADM-06` | POST /admin/companies/{id}/suspend \| /reactivate | companies, workspaces, audit_events | companies/[companyId]/page.tsx | Implemented |
| ADM-08 | Users | `/{locale}/admin/users` | GET /admin/users | users, sessions, memberships | apps/web/src/app/[locale]/admin/users/page.tsx | Implemented |
| ADM-09 | Revoke sessions dialog | `Dialog on ADM-08` | POST /admin/users/{id}/revoke-sessions | sessions, audit_events | users/page.tsx | Implemented |
| ADM-10 | Catalogue moderation overview | `/{locale}/admin/catalog` | GET /admin/catalog/overview | product_versions | apps/web/src/app/[locale]/admin/catalog/page.tsx | Implemented |
| ADM-11 | Moderation queue | `/{locale}/admin/catalog (queue section)` | GET /admin/catalog/queue | product_versions | catalog/page.tsx | Implemented |
| ADM-12 | Listing version review (diff) | `/{locale}/admin/catalog/reviews/[versionId]` | GET /admin/catalog/reviews/{versionId}; GET /admin/media/{id} | product_versions, product_media | apps/web/src/app/[locale]/admin/catalog/reviews/[versionId]/page.tsx | Implemented |
| ADM-13 | Review decision dialog | `Dialog on ADM-12` | POST /admin/catalog/reviews/{versionId}/decision | product_versions, products, notifications | catalog/reviews/[versionId]/page.tsx | Implemented |
| ADM-14 | All listings | `/{locale}/admin/catalog/products` | GET /admin/catalog/products | products | apps/web/src/app/[locale]/admin/catalog/products/page.tsx | Implemented |
| ADM-15 | Listing detail (admin) | `/{locale}/admin/catalog/products/[id]` | GET /admin/catalog/products/{id} | products, product_versions | apps/web/src/app/[locale]/admin/catalog/products/[id]/page.tsx | Implemented |
| ADM-16 | Listing enforcement dialog | `Dialog on ADM-15` | POST /admin/catalog/products/{id}/suspend\|restore\|remove | products, audit_events | catalog/products/[id]/page.tsx | Implemented |
| ADM-17 | Storefront oversight | `/{locale}/admin/catalog/storefronts` | GET /admin/storefronts | storefronts | apps/web/src/app/[locale]/admin/catalog/storefronts/page.tsx | Implemented |
| ADM-18 | Storefront detail (admin) | `/{locale}/admin/catalog/storefronts/[id] (proposed)` | GET /admin/storefronts/{id} | storefronts, storefront_media | — | Planned |
| ADM-19 | Hide or restore storefront dialog | `Dialog on ADM-17` | POST /admin/storefronts/{id}/hide\|restore | storefronts | catalog/storefronts/page.tsx | Implemented |
| ADM-20 | Categories | `/{locale}/admin/catalog/categories` | GET/POST /admin/categories | categories | apps/web/src/app/[locale]/admin/catalog/categories/page.tsx | Implemented |
| ADM-21 | Category editor | `/{locale}/admin/catalog/categories/[id]` | GET/PATCH /admin/categories/{id}; POST /image; POST /attributes | categories, category_attributes | apps/web/src/app/[locale]/admin/catalog/categories/[id]/page.tsx | Implemented |
| ADM-22 | Category attribute editor | `Dialog on ADM-21` | POST /admin/categories/{id}/attributes; PATCH /admin/category-attributes/{id} | category_attributes | catalog/categories/[id]/page.tsx | Implemented |
| ADM-23 | Restricted and prohibited terms | `/{locale}/admin/catalog/restricted` | GET/POST/PATCH /admin/restricted-terms | restricted_terms | apps/web/src/app/[locale]/admin/catalog/restricted/page.tsx | Implemented |
| ADM-24 | Featured placements | `/{locale}/admin/catalog/featured` | GET/POST/DELETE /admin/featured | featured_listings | apps/web/src/app/[locale]/admin/catalog/featured/page.tsx | Implemented |
| ADM-25 | RFQ oversight | `/{locale}/admin/rfqs` | GET /admin/rfqs | rfqs | apps/web/src/app/[locale]/admin/rfqs/page.tsx | Implemented |
| ADM-26 | RFQ detail (admin) | `/{locale}/admin/rfqs/[id]` | GET /admin/rfqs/{id} | rfqs, quotes | apps/web/src/app/[locale]/admin/rfqs/[id]/page.tsx | Implemented |
| ADM-27 | Hide or unhide RFQ dialog | `Dialog on ADM-26` | POST /admin/rfqs/{id}/hide\|unhide | rfqs, audit_events | rfqs/[id]/page.tsx | Implemented |
| ADM-28 | Orders (admin) | `/{locale}/admin/orders` | GET /admin/orders | orders | apps/web/src/app/[locale]/admin/orders/page.tsx | Implemented |
| ADM-29 | Order detail (admin) | `/{locale}/admin/orders/[orderId]` | GET /admin/orders/{id} | orders, payments, shipments, settlements, refunds | apps/web/src/app/[locale]/admin/orders/[orderId]/page.tsx | Implemented |
| ADM-30 | Finance overview | `/{locale}/admin/finance` | GET /admin/finance/summary, /payments, /reconciliation | ledger_entries, payments, reconciliation_cases | apps/web/src/app/[locale]/admin/finance/page.tsx | Implemented |
| ADM-31 | Reconciliation case resolution | `/{locale}/admin/finance/reconciliation/[id] (proposed)` | New endpoints | reconciliation_cases, ledger_entries | — | Planned |
| ADM-32 | Refunds | `/{locale}/admin/refunds` | GET/POST /admin/refunds; POST /approve, /reject; POST /admin/sandbox/operations/{ref}/complete | refunds, ledger_entries | apps/web/src/app/[locale]/admin/refunds/page.tsx | Implemented |
| ADM-33 | Request refund form | `Form on ADM-32` | POST /admin/refunds | refunds | refunds/page.tsx | Partial |
| ADM-34 | Approve or reject refund dialog | `Dialog on ADM-32` | POST /admin/refunds/{id}/approve\|reject | refunds | refunds/page.tsx | Implemented |
| ADM-35 | Payouts | `/{locale}/admin/payouts` | GET /admin/payouts/eligible; GET/POST /admin/payouts; POST /approve, /reject | payouts, settlements | apps/web/src/app/[locale]/admin/payouts/page.tsx | Implemented |
| ADM-36 | Request payout dialog | `Dialog on ADM-35` | POST /admin/payouts | payouts | payouts/page.tsx | Implemented |
| ADM-37 | Approve or reject payout dialog | `Dialog on ADM-35` | POST /admin/payouts/{id}/approve\|reject | payouts | payouts/page.tsx | Implemented |
| ADM-38 | Disputes queue | `/{locale}/admin/disputes` | GET /admin/disputes | disputes | apps/web/src/app/[locale]/admin/disputes/page.tsx | Implemented |
| ADM-39 | Dispute detail (admin) | `/{locale}/admin/disputes/[disputeId]` | GET /admin/disputes/{id}; POST /assign, /request-evidence, /propose, /close, /messages | disputes, dispute_messages | apps/web/src/app/[locale]/admin/disputes/[disputeId]/page.tsx | Implemented |
| ADM-40 | Dispute action dialogs | `Dialogs on ADM-39` | POST /admin/disputes/{id}/request-evidence\|propose\|close | disputes | disputes/[disputeId]/page.tsx | Implemented |
| ADM-41 | Supplier reviews moderation | `/{locale}/admin/supplier-reviews` | GET /admin/reviews; POST /hide, /unhide | reviews | apps/web/src/app/[locale]/admin/supplier-reviews/page.tsx | Implemented |
| ADM-42 | Support queue | `/{locale}/admin/support` | GET /admin/support | support_tickets | apps/web/src/app/[locale]/admin/support/page.tsx | Implemented |
| ADM-43 | Ticket detail (admin) | `/{locale}/admin/support/[ticketId]` | GET /admin/support/{id}; POST /assign, /messages, /resolve, /reopen | support_tickets, support_messages | apps/web/src/app/[locale]/admin/support/[ticketId]/page.tsx | Implemented |
| ADM-44 | Reports (scoped CSV exports) | `/{locale}/admin/reports` | GET/POST /admin/exports; GET /admin/exports/{id}/download | exports, audit_events | apps/web/src/app/[locale]/admin/reports/page.tsx | Implemented |
| ADM-45 | Audit log | `/{locale}/admin/audit` | GET /admin/audit | audit_events | apps/web/src/app/[locale]/admin/audit/page.tsx | Implemented |
| ADM-46 | Staff and roles | `/{locale}/admin/staff` | GET /admin/staff; POST /admin/staff/{id}/roles | admin_users, admin_roles | apps/web/src/app/[locale]/admin/staff/page.tsx | Implemented |
| ADM-47 | Platform settings and commission | `/{locale}/admin/settings (proposed)` | — | New platform_settings with history; orders.commission snapshot | — | Planned |
| ADM-48 | Logistics and delivery settings | `/{locale}/admin/logistics (proposed)` | — | — | — | Planned |
| ADM-49 | System health and webhooks | `/{locale}/admin/system (proposed)` | — | webhook_events, outbox | — | Recommended |
| ADM-50 | Tax configuration and invoicing | `/{locale}/admin/tax (proposed)` | — | — | — | Blocked |
| ADM-51 | Data requests, account closure and legal hold | `/{locale}/admin/data-requests (proposed)` | — | — | — | Planned |
| ADM-52 | Executive analytics | `/{locale}/admin/analytics (proposed)` | — | — | — | Recommended |
| ADM-53 | Sandbox provider simulator | `Action on ADM-32 / ADM-35` | POST /admin/sandbox/operations/{ref}/complete | refunds, payouts, ledger_entries | refunds/page.tsx; payouts/page.tsx | Implemented |
