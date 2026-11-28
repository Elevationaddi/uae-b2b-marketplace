# Manufacturer and supplier experience

> Manufacturers Marketplace (working title). Standalone part of the UX/UI specification (28 November 2026). This document can be handed to a designer on its own: it repeats the full specification of every screen this experience uses, including shared screens. Brand name, logo and typography are not final; use the approved palette and the temporary font (section 28 of the full specification).

## Who this is for

Manufacturers and suppliers are verified UAE companies that sell: they build a storefront, list products with prices, stock, delivery and sample settings, answer requests for quotation and counteroffers, fulfil orders with proof of dispatch and delivery, review buyer cancellation requests, and follow settlement and weekly payouts.

Seller workspace roles: OWNER (everything), SALES (catalogue, quotes, orders), WAREHOUSE (stock and fulfilment), FINANCE (finance read-only views). Trading actions need an ACTIVE workspace.

## Summary

| Measure | Count |
|---|---|
| Screens in this experience | 109 |
| Implemented / Partial / Planned / Recommended / Blocked | 79 / 4 / 7 / 11 / 8 |
| P0 / P1 / P2 | 67 / 31 / 11 |
| Shared with another experience | 68 |


Journeys in section 5 of the full specification that involve this experience: J-01, J-03 to J-07, J-13, J-19, J-21, J-23, J-25, J-27, J-28, J-29, J-32, J-33.

## Founder decisions that shape this experience

| Decision | Answer | Screens here |
|---|---|---|
| FD-02 | A. Confirm receipt records delivery only. The dispute period remains active. | SEL-28 |
| FD-03 | A. Verified delivery proof or buyer confirmation, whichever is first. Supplier-uploaded evidence must be validated, with a review mechanism for contested or suspicious delivery claims. | SEL-30 |
| FD-04 | Monday at 10:00 AM UAE time, no minimum payout at launch, next working day for public holidays. | SEL-32 |
| FD-05 | A. Authorized finance approver, mandatory MFA, recorded reason, versioned commission and 30 days' advance supplier notice. | SEL-32 |
| FD-06 | A. Disclosed-intermediary model. Tax adviser pending. | SEL-34 |
| FD-07 | A. Stripe Connect remains the preferred candidate. Keep the payment interface provider-independent. No live activation or additional subscription is approved. | SEL-33 |
| FD-08 | A. Support free buyer collection and configurable delivery fees for each emirate. | SEL-04, SEL-28 |
| FD-09 | A. Supplier cancellation, supplier-specific return policies, disputes and buyer cancellation requests before dispatch. | SEL-36, SEL-41, SEL-02 |
| FD-10 | C. Structured counteroffers with a maximum of three rounds per supplier negotiation. | SEL-40 |
| FD-11 | A. Public RFQs are labelled "Matching suppliers" and are visible only to eligible verified suppliers in matching categories. Private RFQs are invitation-only. | SEL-20 |
| FD-12 | A. Default quotation validity of seven days, with a minimum of one day and a maximum of 90 days. | SEL-22 |
| FD-13 | B. Add sample requests as a dedicated RFQ type. Do not create an entirely separate paid sample order module. | SEL-39, SEL-20, PUB-07, PUB-10 |
| FD-14 | A. Retain the existing support limits and urgent exceptions. | SHR-04 |
| FD-15 | A. Public reviews display only "Verified business buyer". Authorized administrators can identify the reviewer where necessary. | PUB-10 |
| FD-16 | A. Versioned clickwrap acceptance at registration and checkout, with re-acceptance after material policy changes. UAE legal adviser pending. | ACC-18, AUTH-03, ACC-06 |
| FD-18 | A. Arabic product listings are optional. Clearly indicate when an Arabic product description has not been provided. The application interface itself must remain fully bilingual. | PUB-07, SEL-08, SEL-02 |
| FD-19 | A. First-party analytics only. No paid analytics services or unnecessary third-party tracking. | SEL-35 |
| FD-20 | A. Email and in-app notifications only. No paid SMS or WhatsApp integration. | ACC-13, ACC-14 |


## Screen index

| ID | Screen | Type | Status | Priority | Shared |
|---|---|---|---|---|---|
| PUB-01 | Marketplace home | Page | Implemented | P0 | Yes |
| PUB-02 | Category directory | Page | Implemented | P0 | Yes |
| PUB-03 | Category page | Page | Implemented | P0 | Yes |
| PUB-04 | Search results | Page | Implemented | P0 | Yes |
| PUB-05 | Filter panel / mobile filter sheet | Overlay | Partial | P0 | Yes |
| PUB-06 | Search suggestions dropdown | Overlay | Implemented | P1 | Yes |
| PUB-07 | Product detail | Page | Implemented | P0 | Yes |
| PUB-08 | Product image viewer (lightbox) | Overlay | Recommended | P1 | Yes |
| PUB-09 | Supplier directory | Page | Implemented | P0 | Yes |
| PUB-10 | Supplier storefront (manufacturer profile) | Page | Implemented | P0 | Yes |
| PUB-11 | Saved products and suppliers | Page | Implemented | P1 | Yes |
| PUB-12 | Product comparison | Page | Implemented | P1 | Yes |
| PUB-13 | Recently viewed | Page | Implemented | P2 | Yes |
| PUB-14 | Marketplace preferences | Page | Implemented | P2 | Yes |
| PUB-15 | System status | Page | Implemented | P2 | Yes |
| PUB-16 | About the platform | Page | Recommended | P1 | Yes |
| PUB-17 | How it works | Page | Recommended | P1 | Yes |
| PUB-18 | Pricing and fees | Page | Recommended | P1 | Yes |
| PUB-19 | Frequently asked questions | Page | Recommended | P1 | Yes |
| PUB-20 | Help centre | Page | Recommended | P2 | Yes |
| PUB-21 | Contact | Page | Recommended | P1 | Yes |
| PUB-22 | Terms and conditions | Page | Blocked | P0 | Yes |
| PUB-23 | Privacy policy | Page | Blocked | P0 | Yes |
| PUB-24 | Returns, refunds and cancellation policy | Page | Blocked | P0 | Yes |
| PUB-25 | Other policy pages (template) | Page | Blocked | P1 | Yes |
| PUB-26 | Become a supplier | Page | Recommended | P1 | Yes |
| PUB-27 | Site footer and legal centre | Page | Recommended | P0 | Yes |
| AUTH-01 | Create account (register) | Page | Implemented | P0 | Yes |
| AUTH-02 | Check your email | Page | Implemented | P0 | Yes |
| AUTH-03 | Verify email | Page | Implemented | P0 | Yes |
| AUTH-04 | Sign in | Page | Implemented | P0 | Yes |
| AUTH-05 | Forgot password | Page | Implemented | P0 | Yes |
| AUTH-06 | Reset password | Page | Implemented | P0 | Yes |
| AUTH-07 | Email verification gate | Page | Implemented | P0 | Yes |
| AUTH-08 | Accept team invitation | Page | Implemented | P0 | Yes |
| AUTH-09 | Session expired / signed out | Page | Partial | P1 | Yes |
| ACC-01 | Home (workspace hub) | Page | Implemented | P0 | Yes |
| ACC-02 | Register a company (onboarding) | Page | Implemented | P0 | Yes |
| ACC-03 | Company profile and verification | Page | Implemented | P0 | Yes |
| ACC-04 | Edit company details | Page | Implemented | P0 | Yes |
| ACC-05 | Verification document upload | Section | Implemented | P0 | Yes |
| ACC-06 | Submit for verification (terms) | Section | Implemented | P0 | Yes |
| ACC-07 | Licence renewal | Section | Implemented | P0 | Yes |
| ACC-19 | VAT registration (company section) | Section | Implemented | P0 | Yes |
| ACC-08 | Remove document dialog | Dialog | Implemented | P1 | Yes |
| ACC-09 | Team management | Page | Implemented | P0 | Yes |
| ACC-10 | Invite team member form | Section | Implemented | P0 | Yes |
| ACC-11 | Change role dialog | Dialog | Implemented | P1 | Yes |
| ACC-12 | Remove access dialog | Dialog | Implemented | P1 | Yes |
| ACC-13 | Account settings | Page | Implemented | P0 | Yes |
| ACC-14 | Notification centre | Page | Implemented | P0 | Yes |
| ACC-15 | Workspace switcher | Page | Implemented | P0 | Yes |
| ACC-16 | Account closure and data requests | Page | Planned | P1 | Yes |
| ACC-17 | Billing, invoices and statements | Page | Blocked | P0 | Yes |
| ACC-18 | Policy acceptance and re-acceptance (clickwrap) | Dialog | Blocked | P0 | Yes |
| MSG-01 | Conversations list | Page | Implemented | P0 | Yes |
| MSG-02 | Conversation thread | Page | Implemented | P0 | Yes |
| MSG-04 | Message attachments | Section | Planned | P1 | Yes |
| SYS-01 | Not found / not available | Page | Implemented | P0 | Yes |
| SYS-02 | Error with retry and reference | Page | Implemented | P0 | Yes |
| SYS-03 | Sandbox environment banner | Page | Implemented | P0 | Yes |
| SYS-04 | Trading unavailable / maintenance | Page | Recommended | P2 | Yes |
| SHR-01 | Disputes list | Page | Implemented | P0 | Yes |
| SHR-02 | Dispute detail | Page | Implemented | P0 | Yes |
| SHR-03 | Support tickets list | Page | Implemented | P1 | Yes |
| SHR-04 | New support ticket | Page | Implemented | P1 | Yes |
| SHR-05 | Support ticket detail | Page | Implemented | P1 | Yes |
| SHR-06 | Close or reopen ticket dialog | Dialog | Implemented | P2 | Yes |
| SEL-01 | Seller overview (dashboard) | Page | Implemented | P0 |  |
| SEL-02 | Storefront editor | Page | Implemented | P0 |  |
| SEL-03 | Storefront media manager | Section | Implemented | P1 |  |
| SEL-04 | Delivery terms | Section | Partial | P0 |  |
| SEL-05 | Publish or take storefront offline dialog | Dialog | Implemented | P1 |  |
| SEL-06 | Product list | Page | Implemented | P0 |  |
| SEL-07 | Add product | Page | Implemented | P0 |  |
| SEL-08 | Product editor (content) | Page | Implemented | P0 |  |
| SEL-09 | Product media manager | Section | Implemented | P0 |  |
| SEL-10 | Variants (SKU) manager | Section | Implemented | P0 |  |
| SEL-11 | Product pricing editor | Section | Implemented | P0 |  |
| SEL-12 | Submit for review dialog | Dialog | Implemented | P0 |  |
| SEL-13 | Listing lifecycle dialogs | Dialog | Implemented | P1 |  |
| SEL-14 | Moderation history | Section | Implemented | P1 |  |
| SEL-39 | Sample settings (product section) | Section | Planned | P1 |  |
| SEL-15 | Inventory | Page | Implemented | P0 |  |
| SEL-16 | Stock adjustment dialog | Dialog | Implemented | P0 |  |
| SEL-17 | Low-stock threshold and restock date | Section | Implemented | P2 |  |
| SEL-18 | Stock movement history | Drawer | Implemented | P1 |  |
| SEL-19 | Pricing overview | Page | Implemented | P1 |  |
| SEL-20 | Quotation requests inbox | Page | Implemented | P0 |  |
| SEL-21 | Request detail (seller) | Page | Implemented | P0 |  |
| SEL-22 | Quote form | Section | Implemented | P0 |  |
| SEL-23 | Submit quote dialog | Dialog | Implemented | P0 |  |
| SEL-24 | Withdraw quote dialog | Dialog | Implemented | P1 |  |
| SEL-25 | Ask the buyer a question | Dialog | Implemented | P1 |  |
| SEL-40 | Respond to a counteroffer | Section | Planned | P0 |  |
| SEL-26 | Quotes list (seller) | Page | Implemented | P1 |  |
| SEL-27 | Orders list (seller) | Page | Implemented | P0 |  |
| SEL-28 | Order detail (seller) | Page | Implemented | P0 |  |
| SEL-29 | Record dispatch dialog | Dialog | Partial | P0 |  |
| SEL-30 | Report delivery dialog | Dialog | Implemented | P0 |  |
| SEL-31 | Open dispute (seller) | Dialog | Implemented | P2 |  |
| SEL-32 | Seller finance | Page | Implemented | P0 |  |
| SEL-33 | Payout account onboarding | Page | Blocked | P0 |  |
| SEL-34 | Statements and commission invoices | Page | Blocked | P1 |  |
| SEL-35 | Seller analytics | Page | Planned | P2 |  |
| SEL-36 | Supplier order cancellation | Dialog | Implemented | P0 |  |
| SEL-41 | Review a buyer cancellation request | Dialog | Planned | P0 |  |
| SEL-37 | Returns handling | Page | Planned | P2 |  |
| SEL-38 | Production milestones (made to order) | Section | Recommended | P2 |  |


## How to read each screen

Each screen is specified with the 19 items the founder asked for on 28 November 2026 (numbered 1–19 in every table), plus route, status, data entities, source files and decisions. Loading, empty, error, success and confirmation behaviour follows the shared contract in section 18; where a screen has its own copy, it is quoted. Arabic and RTL rules follow section 20. Interactions with other roles name the screens where the other side sees or acts on the same record.

## Public website

### PUB-01 · Marketplace home

| Item | Specification |
|---|---|
| Screen ID | PUB-01 |
| Screen name | Marketplace home |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest, verified user, all company users |
| Route / URL | `/{locale}` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Entry point of the marketplace: explains the verified-supplier promise and routes buyers to categories, products and suppliers. |
| 2. Navigation location | Header: brand → home; sub-nav Categories, Suppliers, Saved, Compare, Recently viewed; signed-in: Seller centre (sellers), Preferences, My account |
| 3. User permissions | Public. Prices, "for you" row only for email-verified users (A12). Only public listings (view marketplace_products). |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Marketplace header (search, sign in/create account or account links, language switch), marketplace sub-nav, hero, category tile, category chip, product card, supplier card, section header with "View all", sandbox banner, skeleton, empty state. |
| 5. Components | Marketplace header (search, sign in/create account or account links, language switch), marketplace sub-nav, hero, category tile, category chip, product card, supplier card, section header with "View all", sandbox banner, skeleton, empty state |
| 6. Displayed data | Sandbox banner; hero title and body; live totals ("{products} products from {suppliers} verified suppliers"); featured (priority) categories with images and product counts; all categories as chips with counts; featured products (labelled "Featured"); featured suppliers; verified manufacturers; new arrivals; "Based on your preferences" row (verified users with preferences only). Prices only for email-verified viewers; guests see "Sign in with a verified email to see wholesale prices". |
| 7. Buttons and actions | Primary: Search (header search bar) · Secondary: View all (per section); open category; open product; open supplier; Sign in; Create account |
| 8. Form fields | Required: — · Optional: Search query (details below) |
| Filters · sorting · search | None on page (filters live on Search results) · None (server order: featured position, then newest) · Header search with autocomplete (PUB-06) |
| 9. Validation rules | Search requires no minimum on submit; suggestions need 2+ characters. |
| 10. API dependencies | GET /marketplace/home |
| Database entities | categories, featured_listings, marketplace_products view, marketplace_suppliers view, marketplace_preferences |
| Source files | apps/web/src/app/[locale]/page.tsx; components/market-shell.tsx; apps/api/src/catalog/marketplace.service.ts |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Search…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: Search requires no minimum on submit; suggestions need 2+ characters. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Featured". |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column; horizontal scroll rows for featured products and suppliers; search bar full width under the header; category chips wrap. |
| 17. Desktop layout (1440px) | Max-width container; 3–5 card grid per row; hero full width. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Sections load concurrently; cards are full-card links; "Featured" label never changes ranking. |
| Related screens | PUB-02, PUB-03, PUB-04, PUB-06, PUB-07, PUB-09, PUB-10, AUTH-01, AUTH-04 |
| Dependencies and decisions | A09, A12 |

Form fields:

  - Search query (text, Optional): max 100 chars

### PUB-15 · System status

| Item | Specification |
|---|---|
| Screen ID | PUB-15 |
| Screen name | System status |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/status` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Live API, database and queue-store status (former landing page). |
| 2. Navigation location | Footer link (recommended) |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Status list, retry button, error alert. |
| 5. Components | Status list, retry button, error alert |
| 6. Displayed data | Tagline, landing body, status rows (API, Database, Queue store: Operational / Unavailable), checked-at time, reference on error. |
| 7. Buttons and actions | Primary: Retry · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /health/ready |
| Database entities | — |
| Source files | apps/web/src/app/[locale]/status/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Stacked rows. |
| 17. Desktop layout (1440px) | Narrow card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Rendered per request (no stale cache). |
| Related screens | — |
| Dependencies and decisions | — |

Form fields:

  - None

### PUB-16 · About the platform

| Item | Specification |
|---|---|
| Screen ID | PUB-16 |
| Screen name | About the platform |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/about (recommended)` |
| Implementation status | Recommended · P1 |
| 1. Purpose | Explain who the marketplace serves, the verified-business model and the UAE focus. |
| 2. Navigation location | Footer and header "About" |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Content page template, feature rows, CTA band. |
| 5. Components | Content page template, feature rows, CTA band |
| 6. Displayed data | Mission, verified-only promise (licence + representative evidence, manual compliance review), who can buy and sell (A10 eligible business types), how money is handled (payment provider, never "escrow"), UAE focus. |
| 7. Buttons and actions | Primary: Create account · Secondary: Browse marketplace; Become a supplier |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column. |
| 17. Desktop layout (1440px) | Max 72ch text column with image band. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Static content managed by translation keys or a CMS. |
| Related screens | PUB-17, PUB-27 |
| Dependencies and decisions | Brand deferred; legal wording for payments (D05, D15) |

Form fields:

  - None

### PUB-17 · How it works

| Item | Specification |
|---|---|
| Screen ID | PUB-17 |
| Screen name | How it works |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/how-it-works (recommended)` |
| Implementation status | Recommended · P1 |
| 1. Purpose | Step-by-step explanation for buyers and for suppliers. |
| 2. Navigation location | Header, footer |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Segmented control Buyers/Suppliers, numbered step list, illustration slots (style deferred). |
| 5. Components | Segmented control Buyers/Suppliers, numbered step list, illustration slots (style deferred) |
| 6. Displayed data | Buyers: register → verify email → register company → verification → browse → cart or RFQ → pay via provider → track → confirm receipt / dispute. Suppliers: register → verification → storefront → listings reviewed → quotes and orders → dispatch → payout after eligibility. |
| 7. Buttons and actions | Primary: Create account · Secondary: Browse marketplace |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Vertical stepper. |
| 17. Desktop layout (1440px) | Horizontal stepper. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Tabs switch audience. |
| Related screens | PUB-16, PUB-20 |
| Dependencies and decisions | Payout timing wording depends on D05 integration |

Form fields:

  - None

### PUB-18 · Pricing and fees

| Item | Specification |
|---|---|
| Screen ID | PUB-18 |
| Screen name | Pricing and fees |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/pricing (recommended)` |
| Implementation status | Recommended · P1 |
| 1. Purpose | Disclose that registration, access, storefronts, listings and RFQs are free and that suppliers pay a commission on merchandise value. |
| 2. Navigation location | Footer |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Pricing table, FAQ accordion, legal footnote. |
| 5. Components | Pricing table, FAQ accordion, legal footnote |
| 6. Displayed data | Free for buyers; free supplier registration, storefront and listings; commission 10% of merchandise value excluding VAT and delivery (founder decision, configurable, snapshotted per order); no subscriptions at launch; payment processing information once the provider is confirmed. |
| 7. Buttons and actions | Primary: Become a supplier · Secondary: Read commission and fee policy |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — (rate should be read from configuration when built) |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Stacked cards. |
| 17. Desktop layout (1440px) | Two-column comparison (Buyers / Suppliers). |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | — |
| Related screens | PUB-27, PUB-20 |
| Dependencies and decisions | Commission & fee policy legal review; tax model D06 |

Form fields:

  - None

### PUB-19 · Frequently asked questions

| Item | Specification |
|---|---|
| Screen ID | PUB-19 |
| Screen name | Frequently asked questions |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/faq (recommended)` |
| Implementation status | Recommended · P1 |
| 1. Purpose | Answer common questions about verification, prices, RFQs, payment, delivery, disputes and payouts. |
| 2. Navigation location | Footer, help centre |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Accordion, category tabs, search field. |
| 5. Components | Accordion, category tabs, search field |
| 6. Displayed data | Grouped questions; answers must reflect approved policy only. |
| 7. Buttons and actions | Primary: Contact support · Secondary: Open help centre |
| 8. Form fields | Required: — · Optional: Search FAQ (details below) |
| Filters · sorting · search | Topic · — · Client-side text filter |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Contact support…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column accordion. |
| 17. Desktop layout (1440px) | Topic list left, accordion right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Expand/collapse; deep link to a question. |
| Related screens | PUB-20, PUB-21 |
| Dependencies and decisions | Policies pending legal review |

Form fields:

  - Search FAQ (text, Optional): optional

### PUB-20 · Help centre

| Item | Specification |
|---|---|
| Screen ID | PUB-20 |
| Screen name | Help centre |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone; signed-in users see ticket shortcut |
| Route / URL | `/{locale}/help (recommended)` |
| Implementation status | Recommended · P2 |
| 1. Purpose | Self-service articles and a route into support tickets. |
| 2. Navigation location | Footer, header help icon |
| 3. User permissions | Public; ticket creation needs a workspace member (not VIEWER). |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Search, category cards, article page template, "Open a ticket" CTA. |
| 5. Components | Search, category cards, article page template, "Open a ticket" CTA |
| 6. Displayed data | Article categories mirroring support topics (Account and access, Company verification, Order, Payment or refund, Request for quotation, Products and storefront). |
| 7. Buttons and actions | Primary: Open a support ticket (signed in) · Secondary: Search articles |
| 8. Form fields | Required: — · Optional: Search (details below) |
| Filters · sorting · search | Category · — · Article search |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Open a support ticket…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Stacked. |
| 17. Desktop layout (1440px) | Grid of category cards. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | — |
| Related screens | SHR-SUP-02, PUB-19 |
| Dependencies and decisions | — |

Form fields:

  - Search (text, Optional)

### PUB-21 · Contact

| Item | Specification |
|---|---|
| Screen ID | PUB-21 |
| Screen name | Contact |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/contact (recommended)` |
| Implementation status | Recommended · P1 |
| 1. Purpose | Let prospects and guests reach the platform team; route customers to tickets. |
| 2. Navigation location | Footer |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Form, info card. |
| 5. Components | Form, info card |
| 6. Displayed data | Contact options (business email placeholder until domain), office emirate, enquiry form for guests, notice that signed-in customers should use support tickets. |
| 7. Buttons and actions | Primary: Send enquiry · Secondary: Sign in to open a ticket |
| 8. Form fields | Required: Name, Work email, Topic, Message · Optional: Company (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Email format; required fields. |
| 10. API dependencies | Not built (needs endpoint + email provider) |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Send enquiry…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: Email format; required fields. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column. |
| 17. Desktop layout (1440px) | Form left, info right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Rate limited; generic success message. |
| Related screens | PUB-20 |
| Dependencies and decisions | Resend email provider (sandbox until domain) |

Form fields:

  - Name (text, Required): 1–120
  - Work email (email, Required): valid
  - Company (text, Optional): optional
  - Topic (select, Required): Buyer, Supplier, Partnership, Press, Other
  - Message (textarea, Required): 1–4000

### PUB-22 · Terms and conditions

| Item | Specification |
|---|---|
| Screen ID | PUB-22 |
| Screen name | Terms and conditions |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/legal/terms (recommended)` |
| Implementation status | Blocked · P0 |
| 1. Purpose | Platform terms; accepted at company verification (current version label "dev-1"). |
| 2. Navigation location | Footer legal links; links from registration, company submission and checkout terms checkboxes |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Legal document template (TOC, anchored headings, version banner, print). |
| 5. Components | Legal document template (TOC, anchored headings, version banner, print) |
| 6. Displayed data | Versioned legal text with effective date, version, table of contents, EN/AR. |
| 7. Buttons and actions | Primary: — · Secondary: Download/print; switch language |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · In-page find |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | companies.terms_version |
| Source files | packages/contracts/src/companies.ts (CURRENT_TERMS_VERSION) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Collapsible TOC. |
| 17. Desktop layout (1440px) | Sticky TOC left. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Version shown must equal the version accepted (CURRENT_TERMS_VERSION). |
| Related screens | ACC-06, BUY-17 |
| Dependencies and decisions | Legal drafting for UAE lawyer review (founder decision 11, D15) |

Form fields:

  - None

### PUB-23 · Privacy policy

| Item | Specification |
|---|---|
| Screen ID | PUB-23 |
| Screen name | Privacy policy |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/legal/privacy (recommended)` |
| Implementation status | Blocked · P0 |
| 1. Purpose | Privacy notice (PDPL-style), retention, rights and requests. |
| 2. Navigation location | Footer; registration form |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Legal document template. |
| 5. Components | Legal document template |
| 6. Displayed data | Controller details, data collected, purposes, processors (payment provider, email provider, hosting region), retention (configurable, A13), rights and how to request access, export or deletion. |
| 7. Buttons and actions | Primary: Submit a data request (when built) · Secondary: Download/print |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | Confirm in a dialog before: submit (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | As PUB-22. |
| 17. Desktop layout (1440px) | As PUB-22. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | — |
| Related screens | ACC-16 |
| Dependencies and decisions | D09, D15, founder decision 11 |

Form fields:

  - None

### PUB-24 · Returns, refunds and cancellation policy

| Item | Specification |
|---|---|
| Screen ID | PUB-24 |
| Screen name | Returns, refunds and cancellation policy |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/legal/returns (recommended)` |
| Implementation status | Blocked · P0 |
| 1. Purpose | Explain dispute eligibility, change-of-mind returns, custom goods, supplier cancellation and refund routing. |
| 2. Navigation location | Footer, order detail, checkout |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Legal document template. |
| 5. Components | Legal document template |
| 6. Displayed data | Provisional policy (founder D07/D08): incorrect, damaged and defective goods eligible for dispute review; change-of-mind depends on the seller's disclosed policy; custom/made-to-order generally excluded subject to law; supplier cancellation requires refund; partial refunds; refunds to original payment method where possible; 14-day dispute window. |
| 7. Buttons and actions | Primary: — · Secondary: Open a dispute (signed in) |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | As PUB-22. |
| 17. Desktop layout (1440px) | As PUB-22. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | — |
| Related screens | BUY-24, BUY-27, BUY-31 |
| Dependencies and decisions | Legal approval before production |

Form fields:

  - None

### PUB-25 · Other policy pages (template)

| Item | Specification |
|---|---|
| Screen ID | PUB-25 |
| Screen name | Other policy pages (template) |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/legal/[slug] (recommended)` |
| Implementation status | Blocked · P1 |
| 1. Purpose | One template for the remaining legal documents: buyer agreement, supplier and manufacturer agreement, commission and fee policy, payment and settlement policy, delivery and fulfilment policy, dispute resolution policy, prohibited and restricted products policy, data retention and deletion policy, cookie policy. |
| 2. Navigation location | Footer legal centre |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Legal document template; legal centre index listing all 12 documents. |
| 5. Components | Legal document template; legal centre index listing all 12 documents |
| 6. Displayed data | Versioned text, effective date, EN/AR. |
| 7. Buttons and actions | Primary: — · Secondary: Download/print |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | As PUB-22. |
| 17. Desktop layout (1440px) | As PUB-22. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | — |
| Related screens | PUB-22, PUB-23, PUB-24 |
| Dependencies and decisions | Founder decision 11 (12 documents for lawyer review) |

Form fields:

  - None

### PUB-27 · Site footer and legal centre

| Item | Specification |
|---|---|
| Screen ID | PUB-27 |
| Screen name | Site footer and legal centre |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `Global footer` |
| Implementation status | Recommended · P0 |
| 1. Purpose | Persistent links to About, How it works, Pricing, FAQ, Help, Contact, legal documents, status and language. |
| 2. Navigation location | Global |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Footer. |
| 5. Components | Footer |
| 6. Displayed data | Link groups, working name text placeholder, copyright, sandbox notice where applicable. |
| 7. Buttons and actions | Primary: — · Secondary: Links |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — (no footer exists today) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Accordion link groups. |
| 17. Desktop layout (1440px) | 4-column footer. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | — |
| Related screens | PUB-16…PUB-26 |
| Dependencies and decisions | Brand deferred (text placeholder only) |

Form fields:

  - None

## Authentication

### AUTH-01 · Create account (register)

| Item | Specification |
|---|---|
| Screen ID | AUTH-01 |
| Screen name | Create account (register) |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest |
| Route / URL | `/{locale}/register` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Create a company user account with a work email (no admin self-registration, A03). |
| 2. Navigation location | Public header |
| 3. User permissions | Public; rate limited. |
| 4. Screen layout | Centred single-column card (max ≈440px) on a plain background, language switch at the top, legal links below. Page header (title, status badge, primary action). Content: Auth card, text field, password field with hint, select, primary button, inline field errors. |
| 5. Components | Auth card, text field, password field with hint, select, primary button, inline field errors |
| 6. Displayed data | Title "Create your business account", intro, fields, password hint "At least 12 characters…", link to sign in. |
| 7. Buttons and actions | Primary: Create account · Secondary: Sign in |
| 8. Form fields | Required: Full name, Work email, Password, Preferred language · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | field.required, field.email, field.min/max; error.common.rate_limited |
| 10. API dependencies | POST /auth/register |
| Database entities | users, user_tokens |
| Source files | apps/web/src/app/[locale]/register/page.tsx; packages/contracts/src/auth.ts |
| 11. Loading state | Form renders immediately. On submit the button reads "Create account…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: field.required, field.email, field.min/max; error.common.rate_limited Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: Public header. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-width card. |
| 17. Desktop layout (1440px) | Centered 440px card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Always responds 202 (no enumeration) and moves to AUTH-02. |
| Related screens | AUTH-02, AUTH-04 |
| Dependencies and decisions | A01, A07 |

Form fields:

  - Full name (text, Required): 1–120
  - Work email (email, Required): valid, max 254, lower-cased
  - Password (password, Required): 12–128 characters
  - Preferred language (select, Required): English, العربية (default en)

### AUTH-02 · Check your email

| Item | Specification |
|---|---|
| Screen ID | AUTH-02 |
| Screen name | Check your email |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest |
| Route / URL | `/{locale}/register (success state)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Confirm a verification link was sent (24-hour expiry) without revealing whether the address exists. |
| 2. Navigation location | — |
| 3. User permissions | Public |
| 4. Screen layout | Centred single-column card (max ≈440px) on a plain background, language switch at the top, legal links below. Page header (title, status badge, primary action). Content: Status card, secondary button. |
| 5. Components | Status card, secondary button |
| 6. Displayed data | "Check your email" title and body; resend link. |
| 7. Buttons and actions | Primary: Resend verification email · Secondary: Go to sign in |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Rate limit |
| 10. API dependencies | POST /auth/resend-verification |
| Database entities | user_tokens |
| Source files | register/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Resend always shows "If the address needs verification, a new link is on its way." |
| Related screens | AUTH-03 |
| Dependencies and decisions | A07 |

Form fields:

  - None

### AUTH-03 · Verify email

| Item | Specification |
|---|---|
| Screen ID | AUTH-03 |
| Screen name | Verify email |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest or signed-in user |
| Route / URL | `/{locale}/verify-email#token=…` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Consume the one-time verification token (read from the URL fragment, then stripped from history). |
| 2. Navigation location | — |
| 3. User permissions | Public |
| 4. Screen layout | Centred single-column card (max ≈440px) on a plain background, language switch at the top, legal links below. Page header (title, status badge, primary action). Content: Status card, spinner, success and error alerts. |
| 5. Components | Status card, spinner, success and error alerts |
| 6. Displayed data | States: verifying, verified ("Your email is verified…"), link incomplete, invalid/expired/used. |
| 7. Buttons and actions | Primary: Continue · Secondary: Resend verification email; Go to sign in |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | error.auth.token_invalid; auth.token_missing |
| 10. API dependencies | POST /auth/verify-email |
| Database entities | users.email_verified_at, user_tokens |
| Source files | verify-email/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Rules enforced by the server: error.auth.token_invalid; auth.token_missing Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Each action confirms on its own screen (ACC-18); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ACC-18 Policy acceptance and re-acceptance (clickwrap). |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Auto-submits on load. |
| Related screens | ACC-01, AUTH-04 |
| Dependencies and decisions | A07; FD-16: registration records acceptance of the current terms and privacy versions (ACC-18). |

Form fields:

  - None

### AUTH-04 · Sign in

| Item | Specification |
|---|---|
| Screen ID | AUTH-04 |
| Screen name | Sign in |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Company user |
| Route / URL | `/{locale}/login?next=` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Start a company session. |
| 2. Navigation location | Redirects to a safe `next` path (never /admin) or /app |
| 3. User permissions | Public; rate limited; admin accounts must use the admin origin. |
| 4. Screen layout | Centred single-column card (max ≈440px) on a plain background, language switch at the top, legal links below. Page header (title, status badge, primary action). Content: Auth card, fields, primary button, error alert. |
| 5. Components | Auth card, fields, primary button, error alert |
| 6. Displayed data | Email, password, forgot link, register link, generic error on failure. |
| 7. Buttons and actions | Primary: Sign in · Secondary: Forgot your password?; Create account |
| 8. Form fields | Required: Work email, Password · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | error.auth.invalid_credentials ("The email or password is incorrect."); rate limit |
| 10. API dependencies | POST /auth/login |
| Database entities | sessions |
| Source files | login/page.tsx; lib/nav.ts (safeNext) |
| 11. Loading state | Form renders immediately. On submit the button reads "Sign in…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: error.auth.invalid_credentials ("The email or password is incorrect."); rate limit Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: Redirects to a safe `next` path (never /admin) or /app. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full width. |
| 17. Desktop layout (1440px) | Centered card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: can revoke a user's sessions (ADM-09) and suspend the company (ADM-07). |
| Behaviour | Session cookie rotates on sign-in. |
| Related screens | AUTH-05, ACC-01 |
| Dependencies and decisions | A01 |

Form fields:

  - Work email (email, Required): valid
  - Password (password, Required): 1–128

### AUTH-05 · Forgot password

| Item | Specification |
|---|---|
| Screen ID | AUTH-05 |
| Screen name | Forgot password |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest |
| Route / URL | `/{locale}/forgot-password` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Request a reset link (1-hour expiry) without account enumeration. |
| 2. Navigation location | — |
| 3. User permissions | Public |
| 4. Screen layout | Centred single-column card (max ≈440px) on a plain background, language switch at the top, legal links below. Page header (title, status badge, primary action). Content: Auth card, field, button, success alert. |
| 5. Components | Auth card, field, button, success alert |
| 6. Displayed data | Intro text; sent state "If the email matches an account, a reset link has been sent. It expires in 1 hour." |
| 7. Buttons and actions | Primary: Send reset link · Secondary: Back to sign in |
| 8. Form fields | Required: Email · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Email format; rate limit |
| 10. API dependencies | POST /auth/password-reset/request |
| Database entities | user_tokens |
| Source files | forgot-password/page.tsx |
| 11. Loading state | Form renders immediately. On submit the button reads "Send reset link…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: Email format; rate limit Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: —. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Always 202. |
| Related screens | AUTH-06 |
| Dependencies and decisions | — |

Form fields:

  - Email (email, Required): valid

### AUTH-06 · Reset password

| Item | Specification |
|---|---|
| Screen ID | AUTH-06 |
| Screen name | Reset password |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest |
| Route / URL | `/{locale}/reset-password#token=…` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Set a new password; all sessions are revoked. |
| 2. Navigation location | — |
| 3. User permissions | Public with valid token |
| 4. Screen layout | Centred single-column card (max ≈440px) on a plain background, language switch at the top, legal links below. Page header (title, status badge, primary action). Content: Auth card, password field, button, alerts. |
| 5. Components | Auth card, password field, button, alerts |
| 6. Displayed data | New password field and hint; done state "Your password was changed and all sessions were signed out." |
| 7. Buttons and actions | Primary: Set new password · Secondary: Go to sign in |
| 8. Form fields | Required: New password · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Token invalid/expired; length |
| 10. API dependencies | POST /auth/password-reset/confirm |
| Database entities | users, sessions |
| Source files | reset-password/page.tsx |
| 11. Loading state | Form renders immediately. On submit the button reads "Set new password…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: Token invalid/expired; length Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: —. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Token read from fragment. |
| Related screens | AUTH-04 |
| Dependencies and decisions | — |

Form fields:

  - New password (password, Required): 12–128

### AUTH-07 · Email verification gate

| Item | Specification |
|---|---|
| Screen ID | AUTH-07 |
| Screen name | Email verification gate |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Signed-in, unverified user |
| Route / URL | `Any /app route before verification` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Block every company or workspace action until the email is verified (A07). |
| 2. Navigation location | App header (reduced) |
| 3. User permissions | Signed in, unverified |
| 4. Screen layout | Centred single-column card (max ≈440px) on a plain background, language switch at the top, legal links below. Page header (title, status badge, primary action). Content: Card, secondary button, success alert. |
| 5. Components | Card, secondary button, success alert |
| 6. Displayed data | "Verify your email to continue", the address, resend button. |
| 7. Buttons and actions | Primary: Resend verification email · Secondary: Sign out |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /auth/resend-verification |
| Database entities | users |
| Source files | components/session.tsx (UnverifiedNotice) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card in container. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | AUTH-03 |
| Dependencies and decisions | A07 |

Form fields:

  - None

### AUTH-08 · Accept team invitation

| Item | Specification |
|---|---|
| Screen ID | AUTH-08 |
| Screen name | Accept team invitation |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Invitee (guest or signed-in) |
| Route / URL | `/{locale}/invitations/accept#token=…` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Join a workspace with the invited role. |
| 2. Navigation location | After accepting → workspace |
| 3. User permissions | Signed-in user whose email matches the invitation; single use; 7-day expiry. |
| 4. Screen layout | Centred single-column card (max ≈440px) on a plain background, language switch at the top, legal links below. Page header (title, status badge, primary action). Content: Card, definition list, primary button, alerts. |
| 5. Components | Card, definition list, primary button, alerts |
| 6. Displayed data | Company name and status, workspace kind, role, intended email; states: sign in first, wrong account, no longer valid (state), accepted. |
| 7. Buttons and actions | Primary: Accept invitation · Secondary: Sign in / Create account with the invited email; Sign out |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | error.invitation.invalid / not_pending / email_mismatch; team.already_member |
| 10. API dependencies | POST /invitations/preview; POST /invitations/accept |
| Database entities | invitations, memberships |
| Source files | invitations/accept/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Rules enforced by the server: error.invitation.invalid / not_pending / email_mismatch; team.already_member Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | Confirm in a dialog before: accept (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Pending token kept per tab (sessionStorage) across sign-up. |
| Related screens | AUTH-01, AUTH-04, ACC-09 |
| Dependencies and decisions | A04 |

Form fields:

  - None

### AUTH-09 · Session expired / signed out

| Item | Specification |
|---|---|
| Screen ID | AUTH-09 |
| Screen name | Session expired / signed out |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Company user |
| Route / URL | `Redirect to /{locale}/login?next=` |
| Implementation status | Partial · P1 |
| 1. Purpose | Tell users their session ended and return them to where they were. |
| 2. Navigation location | Returns to `next` after sign-in |
| 3. User permissions | — |
| 4. Screen layout | Centred single-column card (max ≈440px) on a plain background, language switch at the top, legal links below. Page header (title, status badge, primary action). Content: Info alert on AUTH-04. |
| 5. Components | Info alert on AUTH-04 |
| 6. Displayed data | Today: silent redirect to sign in with `next`. Recommended: banner "Your session has ended. Sign in again." on the sign-in page. |
| 7. Buttons and actions | Primary: Sign in · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | Any 401 |
| Database entities | sessions |
| Source files | components/session.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Banner above form. |
| 17. Desktop layout (1440px) | Banner above form. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | 401 from any API call triggers redirect. |
| Related screens | AUTH-04 |
| Dependencies and decisions | — |

Form fields:

  - None

## Buyer onboarding

### ACC-02 · Register a company (onboarding)

| Item | Specification |
|---|---|
| Screen ID | ACC-02 |
| Screen name | Register a company (onboarding) |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Verified user |
| Route / URL | `/{locale}/app/onboarding` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Create the legal entity and request buyer and/or seller access (caller becomes OWNER of each). |
| 2. Navigation location | → ACC-03 |
| 3. User permissions | Email-verified user |
| 4. Screen layout | Workspace shell (top bar and account/company navigation). Page header (title, status badge, primary action). Content: Form (grid), select, date picker, checkbox cards for access, inline errors. |
| 5. Components | Form (grid), select, date picker, checkbox cards for access, inline errors |
| 6. Displayed data | "Register your company", "Enter the details exactly as they appear on your trade licence." |
| 7. Buttons and actions | Primary: Register company · Secondary: Cancel |
| 8. Form fields | Required: Legal name, Display name, Trade licence number, Licence issuing authority, Licence expiry date, Licensed activity, Emirate, Company contact email, Company contact phone, Access requested · Optional: Tax registration number (TRN) (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | error.company.licence_exists; licence_expiry_future; field.trn; field.phone |
| 10. API dependencies | POST /companies |
| Database entities | companies, workspaces, memberships |
| Source files | app/onboarding/page.tsx; components/company-form.tsx; packages/contracts/src/companies.ts |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Register company…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: error.company.licence_exists; licence_expiry_future; field.trn; field.phone |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column. |
| 17. Desktop layout (1440px) | Two-column form grid. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: a new company appears in ADM-05 and, once submitted, in the verification queue (ADM-02). |
| Behaviour | Creates DRAFT company and PENDING workspaces. |
| Related screens | ACC-03 |
| Dependencies and decisions | A07, A08 |

Form fields:

  - Legal name (text, Required): 2–200
  - Display name (text, Required): 2–120
  - Trade licence number (text, Required): 3–60; unique with issuer
  - Licence issuing authority (text, Required): 2–120
  - Licence expiry date (date, Required): future
  - Licensed activity (text, Required): 2–200
  - Emirate (select, Required): 7 emirates
  - Tax registration number (TRN) (text, Optional): 15 digits, optional
  - Company contact email (email, Required): valid
  - Company contact phone (tel, Required): E.164, e.g. +971501234567
  - Access requested (checkboxes, Required): Buyer and/or Seller (min 1)

### ACC-03 · Company profile and verification

| Item | Specification |
|---|---|
| Screen ID | ACC-03 |
| Screen name | Company profile and verification |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | All company members (edit: OWNER) |
| Route / URL | `/{locale}/app/company/[companyId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Single place to view legal details, upload documents, submit for verification, read compliance messages, renew the licence and see history. |
| 2. Navigation location | App header Company; seller/buyer nav "Company settings" |
| 3. User permissions | Read: members. Edit, upload, submit, renew: company.manage (OWNER). Download legal documents: legal_documents.read (OWNER). Locked while SUBMITTED/UNDER_REVIEW and after approval ("Licence changes go through renewal"). |
| 4. Screen layout | Workspace shell (top bar and account/company navigation). Page header (title, status badge, primary action). Content: Definition list, status badge, alert (reason from compliance), document list, upload form, checkbox, timeline, renewal form. |
| 5. Components | Definition list, status badge, alert (reason from compliance), document list, upload form, checkbox, timeline, renewal form |
| 6. Displayed data | Company details (definition list) with status; licence expired flag; workspace access (kinds and statuses); verification state; message from compliance; documents with scan state; terms acceptance; verification history timeline; renewal section. VAT registration (Not stated / Registered for VAT with 15-digit TRN / Not registered) with "Confirmed by compliance on {date}" or "Not yet confirmed by compliance" (ACC-19). |
| 7. Buttons and actions | Primary: Submit / Resubmit for verification · Secondary: Edit details; Upload document; Remove document; Start renewal; Download document (OWNER) |
| 8. Form fields | Required: — · Optional: See ACC-04, ACC-05, ACC-06, ACC-07 (details below) |
| Filters · sorting · search | — · Timeline newest first · — |
| 9. Validation rules | error.verification.incomplete; terms_outdated; company.not_editable |
| 10. API dependencies | GET/PATCH /companies/{id}; GET/POST /companies/{id}/verification; POST /companies/{id}/documents; DELETE …/documents/{id}; POST /companies/{id}/renewal; GET /files/{id}/download |
| Database entities | companies, verification_cases, verification_case_events, verification_documents, files |
| Source files | app/company/[companyId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Submit…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: error.verification.incomplete; terms_outdated; company.not_editable Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Opens: ACC-08 Remove document dialog. |
| 16. Mobile layout (360px) | Sections stacked, documents as cards. |
| 17. Desktop layout (1440px) | Two columns: details and verification left, documents and history right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: compliance reviews the case in ADM-03 and decides in ADM-04; decision and reason appear here. |
| Behaviour | Upload is scanned before storage; infected files are blocked with a message. |
| Related screens | ACC-04, ACC-05, ACC-06, ACC-07, ACC-19, ADM-54 |
| Dependencies and decisions | A07, A08, A13 |

Form fields:

  - See ACC-04, ACC-05, ACC-06, ACC-07 (mixed, Optional)

### ACC-04 · Edit company details

| Item | Specification |
|---|---|
| Screen ID | ACC-04 |
| Screen name | Edit company details |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | OWNER |
| Route / URL | `Mode of ACC-03` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Correct legal details while DRAFT, NEEDS_INFO or REJECTED. |
| 2. Navigation location | Back to ACC-03 |
| 3. User permissions | company.manage; editable states only |
| 4. Screen layout | Workspace shell (top bar and account/company navigation). Page header (title, status badge, primary action). Content: Form, Save/Cancel. |
| 5. Components | Form, Save/Cancel |
| 6. Displayed data | Same fields as ACC-02 without access kinds. |
| 7. Buttons and actions | Primary: Save changes · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Same as ACC-02 (no Access requested) (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | error.common.stale_version; company.not_editable |
| 10. API dependencies | PATCH /companies/{id} |
| Database entities | companies |
| Source files | components/company-form.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Rules enforced by the server: error.common.stale_version; company.not_editable |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column. |
| 17. Desktop layout (1440px) | Two-column grid. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | 409 stale version → reload prompt. |
| Related screens | ACC-03 |
| Dependencies and decisions | — |

Form fields:

  - Same as ACC-02 (no Access requested) (mixed, Optional): optimistic expected_version

### ACC-05 · Verification document upload

| Item | Specification |
|---|---|
| Screen ID | ACC-05 |
| Screen name | Verification document upload |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | OWNER |
| Route / URL | `Section of ACC-03` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Upload the trade licence and authorised-representative evidence (both required). |
| 2. Navigation location | — |
| 3. User permissions | company.manage while case editable |
| 4. Screen layout | Block inside ACC-03 Company profile and verification with its own heading and actions. Content: File upload component, select, date field, document list, remove button. |
| 5. Components | File upload component, select, date field, document list, remove button |
| 6. Displayed data | Intro "PDF, PNG or JPEG, up to {size} MB"; list of documents with type, expiry, file name, size, scan state (Scanning / Scanned: clean / Blocked: malware detected). |
| 7. Buttons and actions | Primary: Upload document · Secondary: Remove |
| 8. Form fields | Required: Document type, File · Optional: Document expiry date (details below) |
| Filters · sorting · search | — · Upload order · — |
| 9. Validation rules | field.type, field.too_large, error.file.scanning_unavailable |
| 10. API dependencies | POST /companies/{id}/documents |
| Database entities | files, verification_documents |
| Source files | app/company/[companyId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: field.type, field.too_large, error.file.scanning_unavailable Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Document uploaded and scanned clean." / "The malware scan blocked this file…". |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Full-width dropzone replaced by file button. |
| 17. Desktop layout (1440px) | Inline upload row. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: compliance previews the scanned documents in ADM-03. |
| Behaviour | Shows "Document uploaded and scanned clean." or "The malware scan blocked this file…". |
| Related screens | ACC-03 |
| Dependencies and decisions | A13 |

Form fields:

  - Document type (select, Required): TRADE_LICENCE, AUTHORIZED_REPRESENTATIVE, OTHER
  - Document expiry date (date, Optional): optional
  - File (file, Required): PDF/PNG/JPEG, ≤ UPLOAD_MAX_BYTES (10 MB default); magic bytes checked; malware scanned

### ACC-06 · Submit for verification (terms)

| Item | Specification |
|---|---|
| Screen ID | ACC-06 |
| Screen name | Submit for verification (terms) |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | OWNER |
| Route / URL | `Section of ACC-03` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Accept versioned terms and submit the case. |
| 2. Navigation location | — |
| 3. User permissions | company.manage; DRAFT, NEEDS_INFO, REJECTED |
| 4. Screen layout | Block inside ACC-03 Company profile and verification with its own heading and actions. Content: Checkbox, primary button, success alert "Submitted for verification.". |
| 5. Components | Checkbox, primary button, success alert "Submitted for verification." |
| 6. Displayed data | Checkbox "I confirm the information is accurate and I accept the platform terms (version {version})", note "Final legal terms are pending legal review." |
| 7. Buttons and actions | Primary: Submit for verification · Secondary: — |
| 8. Form fields | Required: Accept terms · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | field.terms; error.verification.incomplete |
| 10. API dependencies | POST /companies/{id}/verification |
| Database entities | verification_cases, companies.terms_version |
| Source files | app/company/[companyId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: field.terms; error.verification.incomplete |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: submit (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Sticky submit box at bottom. |
| 17. Desktop layout (1440px) | Submit box in sidebar. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: submission enters the verification queue (ADM-02, ADM-03). |
| Behaviour | Moves case to SUBMITTED; company sees read-only details. |
| Related screens | PUB-22 |
| Dependencies and decisions | D15; FD-16: versioned clickwrap acceptance (ACC-18); legal texts pending a UAE legal adviser. |

Form fields:

  - Accept terms (checkbox, Required): must be checked; terms_version must match

### ACC-07 · Licence renewal

| Item | Specification |
|---|---|
| Screen ID | ACC-07 |
| Screen name | Licence renewal |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | OWNER |
| Route / URL | `Section of ACC-03` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Propose renewed licence details and documents; approval stays until decided unless expired. |
| 2. Navigation location | — |
| 3. User permissions | APPROVED companies or SUSPENDED for licence expiry |
| 4. Screen layout | Block inside ACC-03 Company profile and verification with its own heading and actions. Content: Form, upload, submit. |
| 5. Components | Form, upload, submit |
| 6. Displayed data | Renewal intro, proposed licence (number, issuer, expiry), documents. |
| 7. Buttons and actions | Primary: Start renewal · Secondary: Submit renewal |
| 8. Form fields | Required: Trade licence number, Licence issuing authority, Licence expiry date · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | error.verification.renewal_not_allowed; case_open |
| 10. API dependencies | POST /companies/{id}/renewal |
| Database entities | verification_cases (RENEWAL, proposed) |
| Source files | app/company/[companyId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: error.verification.renewal_not_allowed; case_open Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: submit (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Single column. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: compliance reviews the renewed licence (ADM-03); expiry reminders come from the scheduler. |
| Behaviour | Creates RENEWAL case. |
| Related screens | ADM-03 |
| Dependencies and decisions | A08 |

Form fields:

  - Trade licence number (text, Required): 3–60
  - Licence issuing authority (text, Required): 2–120
  - Licence expiry date (date, Required): future

### ACC-19 · VAT registration (company section)

| Item | Specification |
|---|---|
| Screen ID | ACC-19 |
| Screen name | VAT registration (company section) |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Company OWNER (edit); members (view) |
| Route / URL | `Section of ACC-03 / ACC-04` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Company declares its VAT status (P8-10, PR #14); compliance confirms it before it is used for VAT. |
| 2. Navigation location | Opened from ACC-03 Company profile and verification |
| 3. User permissions | Company OWNER edits; any change clears the confirmation. |
| 4. Screen layout | Block inside ACC-03 Company profile and verification with its own heading and actions. Content: Radio group, TRN input (LTR), status badge. |
| 5. Components | Radio group, TRN input (LTR), status badge |
| 6. Displayed data | Status Not stated / Registered for VAT / Not registered for VAT; TRN; "Confirmed by compliance on {date}" or "Not yet confirmed by compliance"; hint "Registered suppliers must give their TRN…". |
| 7. Buttons and actions | Primary: Save · Secondary: — |
| 8. Form fields | Required: VAT registration · Optional: TRN (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | "Enter the 15-digit TRN for a VAT-registered company." |
| 10. API dependencies | PUT /companies/{id} (vat_status, trn) |
| Database entities | companies (vat_status, vat_confirmed_at, trn) |
| Source files | apps/web/src/components/company-form.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: "Enter the 15-digit TRN for a VAT-registered company." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Stacked fields. |
| 17. Desktop layout (1440px) | Two-column form section. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: compliance confirms the status in ADM-54; Buyer: sees the supplier's VAT rule at checkout (BUY-17). |
| Behaviour | Unconfirmed suppliers cannot submit quotes in supplier_status mode and block checkout. |
| Related screens | ACC-03, ADM-54, SEL-22, BUY-17 |
| Dependencies and decisions | P8-10; FD-06 |

Form fields:

  - VAT registration (radio, Required): UNKNOWN, REGISTERED, NOT_REGISTERED
  - TRN (text, Optional): 15 digits, required when registered

### ACC-08 · Remove document dialog

| Item | Specification |
|---|---|
| Screen ID | ACC-08 |
| Screen name | Remove document dialog |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | OWNER |
| Route / URL | `Dialog on ACC-03` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Confirm removing a document from an editable case. |
| 2. Navigation location | — (opened from ACC-03 Company profile and verification) |
| 3. User permissions | company.manage |
| 4. Screen layout | Dialog over ACC-03 Company profile and verification: title, context text, fields, footer with secondary action then primary action. Content: Confirmation dialog. |
| 5. Components | Confirmation dialog |
| 6. Displayed data | "Remove this document?" |
| 7. Buttons and actions | Primary: Remove · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | verification.not_editable |
| 10. API dependencies | DELETE /companies/{id}/documents/{documentId} |
| Database entities | verification_documents |
| Source files | components/ui.tsx (ConfirmDialog) |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Remove…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: verification.not_editable |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Remove" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Centered dialog. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Focus trap; Escape cancels. |
| Related screens | ACC-05 |
| Dependencies and decisions | — |

Form fields:

  - None

### ACC-18 · Policy acceptance and re-acceptance (clickwrap)

| Item | Specification |
|---|---|
| Screen ID | ACC-18 |
| Screen name | Policy acceptance and re-acceptance (clickwrap) |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | All company users |
| Route / URL | `Dialog shown at sign-in when a material policy version changes; checkbox on AUTH-03, ACC-06 and BUY-17` |
| Implementation status | Blocked · P0 |
| 1. Purpose | FD-16 (answer A): versioned clickwrap acceptance at registration and checkout, and re-acceptance after material policy changes. Legal texts are pending a UAE legal adviser, so publishing is blocked; design can proceed with placeholders. |
| 2. Navigation location | Shown automatically after sign-in when a material policy version has changed; the same acceptance appears as checkboxes on AUTH-01 registration, ACC-06 and BUY-17 checkout. |
| 3. User permissions | Any signed-in company user; acceptance recorded per user with version, time (UTC) and IP. |
| 4. Screen layout | Blocking modal over whichever page the user opened: title "We have updated our terms", what changed, one checkbox and link per changed policy, footer with Sign out then Accept and continue. |
| 5. Components | Modal that cannot be dismissed without a choice, checkbox per policy, links open in new tab, accept button disabled until checked |
| 6. Displayed data | Policy names and versions (Terms of use, Privacy policy, Buyer agreement or Supplier agreement, Returns and refunds policy), "What changed" summary, links to full texts, date effective. |
| 7. Buttons and actions | Primary: Accept and continue · Secondary: Sign out |
| 8. Form fields | Required: I accept the {policy} version {version} · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | All changed policies must be ticked. |
| 10. API dependencies | New: GET /me/policies; POST /me/policies/accept |
| Database entities | New policy_versions, policy_acceptances |
| Source files | Not built (legal texts pending) |
| 11. Loading state | Policy texts load in the dialog before Accept is enabled. |
| 12. Empty state | Not applicable. |
| 13. Error states | "Tick each policy to continue." Saving failure keeps the ticks and offers Retry. |
| 14. Success state | Dialog closes and the blocked action continues; the acceptance (user, versions, time UTC) is recorded. |
| 15. Confirmation dialogs | This dialog is the confirmation; Sign out is the only alternative. |
| 16. Mobile layout (360px) | Full-screen sheet. |
| 17. Desktop layout (1440px) | Centred modal 560px. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: publishing a material policy version triggers re-acceptance for all users (admin screen to be defined with legal). |
| Behaviour | Blocks trading actions until accepted; acceptance is audited; checkout records the version accepted. |
| Related screens | AUTH-03, ACC-06, BUY-17, PUB-22, PUB-23 |
| Dependencies and decisions | FD-16 answered (A); legal adviser pending; Gap G-19 |

Form fields:

  - I accept the {policy} version {version} (checkbox, Required): one per changed policy

## Manufacturer onboarding

### PUB-26 · Become a supplier

| Item | Specification |
|---|---|
| Screen ID | PUB-26 |
| Screen name | Become a supplier |
| Experience | Manufacturers and suppliers |
| User roles | Anyone |
| Route / URL | `/{locale}/sell (recommended)` |
| Implementation status | Recommended · P1 |
| 1. Purpose | Acquire UAE-licensed suppliers and manufacturers; explain eligibility and onboarding. |
| 2. Navigation location | Header, footer |
| 3. User permissions | Public |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Hero, eligibility checklist, step list, FAQ, CTA band. |
| 5. Components | Hero, eligibility checklist, step list, FAQ, CTA band |
| 6. Displayed data | Eligible business types (A10), required documents (trade licence, authorised representative evidence), free listing, commission, moderation, priority categories (Fashion & Textiles, Packaging & Printing, Food & Beverage). |
| 7. Buttons and actions | Primary: Create supplier account · Secondary: Read supplier agreement |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Stacked. |
| 17. Desktop layout (1440px) | Hero + 3-column steps. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | — |
| Related screens | AUTH-01, PUB-18 |
| Dependencies and decisions | A09, A10 |

Form fields:

  - None

### SEL-02 · Storefront editor

| Item | Specification |
|---|---|
| Screen ID | SEL-02 |
| Screen name | Storefront editor |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES (edit); others read |
| Route / URL | `/{locale}/app/seller/[workspaceId]/storefront` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Build the public manufacturer profile. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Form sections (About, Capabilities, Services, Fulfilment, Certifications), bilingual paired inputs, checkboxes, certification repeater, status card. |
| 5. Components | Form sections (About, Capabilities, Services, Fulfilment, Certifications), bilingual paired inputs, checkboxes, certification repeater, status card |
| 6. Displayed data | "Your storefront is public once published and your company is verified with a valid licence."; status; admin-hidden reason; profile fields. Since PR #17: Return policy (English) and Return policy (Arabic) with the hint "Shown to buyers before they pay…". |
| 7. Buttons and actions | Primary: Save · Secondary: Publish; Take offline; Preview public page |
| 8. Form fields | Required: — · Optional: Business type, Description (EN), Description (AR), Year established, City, Specialisation EN/AR, Capabilities EN/AR, Production capacity, Custom manufacturing / Private label / White label / Samples available, Fulfilment EN/AR, Certifications (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Lengths; year range |
| 10. API dependencies | GET/PATCH /seller/workspaces/{ws}/storefront |
| Database entities | storefronts |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/storefront/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Save…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Lengths; year range Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Opens: SEL-05 Publish or take storefront offline dialog. |
| 16. Mobile layout (360px) | Single column, sections as accordions, sticky Save. |
| 17. Desktop layout (1440px) | Form with section anchors left. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: sees the storefront and return policy on PUB-10 and at checkout (BUY-17); Platform administrator: storefront oversight (ADM-17, ADM-19). |
| Behaviour | expected_version concurrency; contact details/documents never public. |
| Related screens | SEL-03, SEL-04, SEL-05, PUB-10 |
| Dependencies and decisions | A07 |

Form fields:

  - Business type (select, Optional): 7 types
  - Description (EN) (textarea, Optional): ≤4000
  - Description (AR) (textarea, Optional): ≤4000
  - Year established (integer, Optional): 1900–2100
  - City (text, Optional): ≤80
  - Specialisation EN/AR (text, Optional): ≤300
  - Capabilities EN/AR (textarea, Optional): ≤2000
  - Production capacity (text, Optional): ≤200
  - Custom manufacturing / Private label / White label / Samples available (checkbox, Optional)
  - Fulfilment EN/AR (textarea, Optional): ≤1000
  - Certifications (repeater, Optional): ≤20

### SEL-03 · Storefront media manager

| Item | Specification |
|---|---|
| Screen ID | SEL-03 |
| Screen name | Storefront media manager |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-02` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Upload logo, cover, factory, warehouse and other images. |
| 2. Navigation location | Opened from SEL-02 Storefront editor |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Block inside SEL-02 Storefront editor with its own heading and actions. Content: Image uploader, media grid, caption inputs, reorder, delete. |
| 5. Components | Image uploader, media grid, caption inputs, reorder, delete |
| 6. Displayed data | Images by kind with caption EN/AR and order. |
| 7. Buttons and actions | Primary: Upload image · Secondary: Edit caption; reorder; remove |
| 8. Form fields | Required: Kind, Image · Optional: Caption EN/AR (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Type, size, dimensions; malware scan |
| 10. API dependencies | Storefront media endpoints under /seller/workspaces/{ws}/storefront |
| Database entities | storefront_media, files |
| Source files | storefront/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Type, size, dimensions; malware scan Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | 2-up grid. |
| 17. Desktop layout (1440px) | 4-up grid. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-02 |
| Dependencies and decisions | — |

Form fields:

  - Kind (select, Required): LOGO, COVER, FACTORY, WAREHOUSE, OTHER
  - Image (file, Required): PNG/JPEG/WebP ≥200px ≤10 MB
  - Caption EN/AR (text, Optional): ≤150

### SEL-04 · Delivery terms

| Item | Specification |
|---|---|
| Screen ID | SEL-04 |
| Screen name | Delivery terms |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-02` |
| Implementation status | Partial · P0 |
| 1. Purpose | Supplier delivery terms. Today: one flat delivery fee per order, emirates served and typical days. FD-08 / founder section 6 (C-10, being built): a fee per emirate with a toggle to disable each of the seven emirates, free buyer collection with secure collection instructions, and quotation-agreed charges for large or customised orders. |
| 2. Navigation location | Opened from SEL-02 Storefront editor |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Block inside SEL-02 Storefront editor with its own heading and actions. Content: Money input, number input, emirate checkbox group. |
| 5. Components | Money input, number input, emirate checkbox group |
| 6. Displayed data | Planned table of the seven emirates (Abu Dhabi, Dubai, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain): Deliver (toggle), Fee (AED), Typical days; Buyer collection (toggle), collection address and instructions (shown only to buyers of paid orders); note that quotes may set their own delivery charge. |
| 7. Buttons and actions | Primary: Save delivery terms · Secondary: — |
| 8. Form fields | Required: Delivery fee {emirate} (AED), Collection address · Optional: Deliver to {emirate}, Typical days {emirate}, Offer buyer collection, Collection instructions (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | At least one emirate or collection must be enabled to sell ready stock; fee integer fils. |
| 10. API dependencies | Existing: PUT /seller/workspaces/{ws}/storefront; new fields with C-10 |
| Database entities | storefronts |
| Source files | storefront/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Before setup: all seven emirates off and collection off, with "Turn on at least one emirate or buyer collection to sell ready-stock products." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: At least one emirate or collection must be enabled to sell ready stock; fee integer fils. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | "Delivery settings saved. New checkouts use them; existing orders keep their charges." |
| 15. Confirmation dialogs | Turning off an emirate or collection asks: "Buyers in {emirate} will no longer be able to order from you. Orders already placed are not affected." |
| 16. Mobile layout (360px) | Stacked. |
| 17. Desktop layout (1440px) | Inline card. |
| 18. Arabic and RTL layout | Emirates table mirrors (emirate name on the right); emirate names from the Arabic catalogue; fee inputs keep LTR digits. |
| 19. Interactions with other user roles | Buyer: options in BUY-35 and collection details in BUY-36 come from here. |
| Behaviour | Without terms, checkout shows "This supplier has not set delivery terms yet." |
| Related screens | BUY-17 |
| Dependencies and decisions | FD-08 answered (A); C-10 (being built) |

Form fields:

  - Deliver to {emirate} (toggle, Optional): per emirate
  - Delivery fee {emirate} (AED) (money, Required): 0 or more, integer fils; required when the emirate is enabled
  - Typical days {emirate} (integer range, Optional): 1–90
  - Offer buyer collection (toggle, Optional)
  - Collection address (textarea, Required): required when collection is on
  - Collection instructions (textarea, Optional): ≤ 1000; shown after payment only

### SEL-05 · Publish or take storefront offline dialog

| Item | Specification |
|---|---|
| Screen ID | SEL-05 |
| Screen name | Publish or take storefront offline dialog |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-02` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Make the storefront public or remove it. |
| 2. Navigation location | Opened from SEL-02 Storefront editor |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. Publish requires eligibility (approved company, valid licence). |
| 4. Screen layout | Dialog over SEL-02 Storefront editor: title, context text, fields, footer with secondary action then primary action. Content: Confirm dialog. |
| 5. Components | Confirm dialog |
| 6. Displayed data | Required-field checklist on publish; consequence text on take offline. |
| 7. Buttons and actions | Primary: Publish / Take offline · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Required fields present |
| 10. API dependencies | POST /seller/workspaces/{ws}/storefront/publish \| /unpublish |
| Database entities | storefronts |
| Source files | storefront/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Publish…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Required fields present Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Publish / Take offline" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: storefront becomes visible or hidden on PUB-10. |
| Behaviour | — |
| Related screens | SEL-02 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-33 · Payout account onboarding

| Item | Specification |
|---|---|
| Screen ID | SEL-33 |
| Screen name | Payout account onboarding |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, FINANCE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/finance/payout-account (proposed)` |
| Implementation status | Blocked · P0 |
| 1. Purpose | Connect the seller's payout account with the provider (Stripe Connect preferred). Requires provider approval, KYC flows and live credentials. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | seller.finance |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Status card, checklist, external link button. |
| 5. Components | Status card, checklist, external link button |
| 6. Displayed data | Status (not started, pending, verified, restricted), requirements, provider link. |
| 7. Buttons and actions | Primary: Set up payouts · Secondary: Update details |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | Provider onboarding (not built) |
| Database entities | New payout_accounts |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: payout account status visible in ADM-06; provider onboarding is external. |
| Behaviour | — |
| Related screens | SEL-32 |
| Dependencies and decisions | D05 provider; Phase 8 |

Form fields:

  - None

## Buyer dashboard

### ACC-01 · Home (workspace hub)

| Item | Specification |
|---|---|
| Screen ID | ACC-01 |
| Screen name | Home (workspace hub) |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | All company users |
| Route / URL | `/{locale}/app` |
| Implementation status | Implemented · P0 |
| 1. Purpose | After sign-in: show each company, its workspaces, role, status and next verification step. |
| 2. Navigation location | App header (Home, Company, Team, RFQs or Seller centre, Messages, Notifications, Marketplace, Settings); mobile bottom nav |
| 3. User permissions | Signed in, verified email. |
| 4. Screen layout | Workspace shell (top bar and account/company navigation). Page header (title, status badge, primary action). Content: Page header, company card, status badge, empty state with CTA. |
| 5. Components | Page header, company card, status badge, empty state with CTA |
| 6. Displayed data | "Welcome, {name}"; companies with status badge; per workspace: kind (Buyer/Seller), role, workspace status; next step text by company status; "Register a company" when none. |
| 7. Buttons and actions | Primary: Register a company / Open company · Secondary: Register another company |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /me |
| Database entities | users, memberships, workspaces, companies |
| Source files | apps/web/src/app/[locale]/app/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | (existing) "Register a company" / Next step texts per company status, e.g. "Complete your company details, upload documents and submit for verification." Action: Register a company. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Stacked company cards; bottom nav. |
| 17. Desktop layout (1440px) | Card grid. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Opening a company selects its workspace. |
| Related screens | ACC-02, ACC-03, BUY-01, SEL-01 |
| Dependencies and decisions | Copy for APPROVED state is stale ("features will appear here as they are released") |

Form fields:

  - None

### ACC-09 · Team management

| Item | Specification |
|---|---|
| Screen ID | ACC-09 |
| Screen name | Team management |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | All members (manage: OWNER) |
| Route / URL | `/{locale}/app/team/[workspaceId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Invite staff, change roles, remove/restore access; last-owner protection. |
| 2. Navigation location | App header Team |
| 3. User permissions | Read: members. Manage: role OWNER only. Owners can only grant roles valid for the workspace kind (buyer: OWNER, PROCUREMENT, VIEWER; seller: OWNER, SALES, WAREHOUSE, FINANCE, VIEWER). |
| 4. Screen layout | Workspace shell (top bar and account/company navigation). Page header (title, status badge, primary action). Content: Data table (cards on mobile), invite form, role select, row actions, confirmation dialogs. |
| 5. Components | Data table (cards on mobile), invite form, role select, row actions, confirmation dialogs |
| 6. Displayed data | Members table (email, name, role, status, "you"); pending invitations (email, role, state, expires); "Only owners can manage the team." for non-owners. |
| 7. Buttons and actions | Primary: Send invitation · Secondary: Change role; Remove access; Restore access; Revoke invitation |
| 8. Form fields | Required: — · Optional: See ACC-10 (details below) |
| Filters · sorting · search | — · Created · — |
| 9. Validation rules | error.team.last_owner; already_member; role_not_allowed |
| 10. API dependencies | GET /workspaces/{id}/members; GET/POST/DELETE /workspaces/{id}/invitations; PATCH /memberships/{id} |
| Database entities | memberships, invitations |
| Source files | app/team/[workspaceId]/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Send invitation…" and is disabled. |
| 12. Empty state | (suggested) "No team management yet." with a one-line explanation and the action "Send invitation". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: error.team.last_owner; already_member; role_not_allowed |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Opens: ACC-11 Change role dialog; ACC-12 Remove access dialog. |
| 16. Mobile layout (360px) | Members as cards with action menu. |
| 17. Desktop layout (1440px) | Table with row actions. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Revocation takes effect immediately. |
| Related screens | ACC-10, ACC-11, ACC-12, AUTH-08 |
| Dependencies and decisions | A04 |

Form fields:

  - See ACC-10 (mixed, Optional)

### ACC-10 · Invite team member form

| Item | Specification |
|---|---|
| Screen ID | ACC-10 |
| Screen name | Invite team member form |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | OWNER |
| Route / URL | `Section of ACC-09` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Send an email invitation with a role. |
| 2. Navigation location | — |
| 3. User permissions | OWNER |
| 4. Screen layout | Block inside ACC-09 Team management with its own heading and actions. Content: Inline form. |
| 5. Components | Inline form |
| 6. Displayed data | Email and role; success "Invitation sent to {email}." |
| 7. Buttons and actions | Primary: Send invitation · Secondary: — |
| 8. Form fields | Required: Email, Role · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | field.member; field.not_allowed |
| 10. API dependencies | POST /workspaces/{id}/invitations |
| Database entities | invitations |
| Source files | app/team/[workspaceId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: field.member; field.not_allowed |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Stacked fields. |
| 17. Desktop layout (1440px) | Inline row. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | 7-day single-use token; rate limited. |
| Related screens | ACC-09 |
| Dependencies and decisions | — |

Form fields:

  - Email (email, Required): valid
  - Role (select, Required): roles valid for workspace kind

### ACC-11 · Change role dialog

| Item | Specification |
|---|---|
| Screen ID | ACC-11 |
| Screen name | Change role dialog |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | OWNER |
| Route / URL | `Dialog on ACC-09` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Confirm a role change. |
| 2. Navigation location | — (opened from ACC-09 Team management) |
| 3. User permissions | OWNER |
| 4. Screen layout | Dialog over ACC-09 Team management: title, context text, fields, footer with secondary action then primary action. Content: Confirmation dialog. |
| 5. Components | Confirmation dialog |
| 6. Displayed data | "Change the role of {email} to {role}?" |
| 7. Buttons and actions | Primary: Confirm · Secondary: Cancel |
| 8. Form fields | Required: Role · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | last_owner |
| 10. API dependencies | PATCH /memberships/{id} |
| Database entities | memberships |
| Source files | team page |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Confirm…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Confirm" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Sheet. |
| 17. Desktop layout (1440px) | Dialog. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Session rotation for the member on privilege change. |
| Related screens | ACC-09 |
| Dependencies and decisions | — |

Form fields:

  - Role (select, Required)

### ACC-12 · Remove access dialog

| Item | Specification |
|---|---|
| Screen ID | ACC-12 |
| Screen name | Remove access dialog |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | OWNER |
| Route / URL | `Dialog on ACC-09` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Confirm revoking a member. |
| 2. Navigation location | — (opened from ACC-09 Team management) |
| 3. User permissions | OWNER |
| 4. Screen layout | Dialog over ACC-09 Team management: title, context text, fields, footer with secondary action then primary action. Content: Destructive confirmation dialog. |
| 5. Components | Destructive confirmation dialog |
| 6. Displayed data | "Remove access for {email}? They lose access immediately." |
| 7. Buttons and actions | Primary: Remove access · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | last_owner |
| 10. API dependencies | PATCH /memberships/{id} |
| Database entities | memberships |
| Source files | team page |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Remove access…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Remove access" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Sheet. |
| 17. Desktop layout (1440px) | Dialog. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | ACC-09 |
| Dependencies and decisions | — |

Form fields:

  - None

### ACC-13 · Account settings

| Item | Specification |
|---|---|
| Screen ID | ACC-13 |
| Screen name | Account settings |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | All company users |
| Route / URL | `/{locale}/app/settings` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Profile, language, password, email notification preferences, marketing consent and sessions. |
| 2. Navigation location | App header Settings |
| 3. User permissions | Own account only |
| 4. Screen layout | Workspace shell (top bar and account/company navigation). Page header (title, status badge, primary action). Content: Settings sections (cards), fields, toggles, session list, buttons. |
| 5. Components | Settings sections (cards), fields, toggles, session list, buttons |
| 6. Displayed data | Profile (full name, email read-only), language; change password; email notifications (RFQs, quotes, messages, marketing opt-in) with note that in-app and security notices are always kept; active sessions (device, IP, last active, this session). FD-20: channels are email and in-app only. |
| 7. Buttons and actions | Primary: Save changes (per section) · Secondary: Change password; Sign out (session); Sign out all other sessions |
| 8. Form fields | Required: Full name, Language, Current password, New password · Optional: Email: RFQs, Email: quotes, Email: messages, Email: marketing (details below) |
| Filters · sorting · search | — · Sessions newest first · — |
| 9. Validation rules | error.auth.current_password_wrong; field.min |
| 10. API dependencies | GET/PATCH /me; GET /me/sessions; DELETE /me/sessions/{id}; POST /me/sessions/revoke-others; POST /me/password; GET/PATCH /notifications/preferences |
| Database entities | users, sessions, notification_preferences |
| Source files | app/settings/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Save changes…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: error.auth.current_password_wrong; field.min |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Sections stacked; sessions as cards. |
| 17. Desktop layout (1440px) | Section nav left (recommended), forms right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Password change signs out other sessions. |
| Related screens | ACC-14 |
| Dependencies and decisions | P6-6 |

Form fields:

  - Full name (text, Required): 1–120
  - Language (select, Required): en, ar
  - Current password (password, Required): for password change
  - New password (password, Required): 12–128
  - Email: RFQs (toggle, Optional): default on
  - Email: quotes (toggle, Optional): default on
  - Email: messages (toggle, Optional): default off
  - Email: marketing (toggle, Optional): default off; records consent time

### ACC-15 · Workspace switcher

| Item | Specification |
|---|---|
| Screen ID | ACC-15 |
| Screen name | Workspace switcher |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Users with more than one workspace |
| Route / URL | `Header control (all /app pages)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Switch between companies and buyer/seller workspaces. |
| 2. Navigation location | Changes header nav items |
| 3. User permissions | Own memberships |
| 4. Screen layout | Workspace shell (top bar and account/company navigation). Page header (title, status badge, primary action). Content: Select (recommended: menu with company grouping and status). |
| 5. Components | Select (recommended: menu with company grouping and status) |
| 6. Displayed data | Options "{Company} · Buyer\|Seller". |
| 7. Buttons and actions | Primary: Select workspace · Secondary: — |
| 8. Form fields | Required: — · Optional: Workspace (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /me |
| Database entities | memberships |
| Source files | components/session.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Select workspace…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Inside account menu. |
| 17. Desktop layout (1440px) | Header right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Remembered in localStorage per browser. |
| Related screens | ACC-01 |
| Dependencies and decisions | — |

Form fields:

  - Workspace (select, Optional)

### ACC-16 · Account closure and data requests

| Item | Specification |
|---|---|
| Screen ID | ACC-16 |
| Screen name | Account closure and data requests |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | User; OWNER for company |
| Route / URL | `Not built` |
| Implementation status | Planned · P1 |
| 1. Purpose | Request account closure, data access/export and deletion with legal-hold handling (founder decision 11). |
| 2. Navigation location | Settings |
| 3. User permissions | Own data; company closure OWNER |
| 4. Screen layout | Workspace shell (top bar and account/company navigation). Page header (title, status badge, primary action). Content: Form, status list, confirmation dialog. |
| 5. Components | Form, status list, confirmation dialog |
| 6. Displayed data | Request types, status, legal hold notice, retention explanation. |
| 7. Buttons and actions | Primary: Submit request · Secondary: Cancel request |
| 8. Form fields | Required: Request type · Optional: Details (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | Not built |
| Database entities | Not built |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Submit request…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: submit (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Single column. |
| 17. Desktop layout (1440px) | Settings section. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: data requests and legal holds are handled in ADM-51. |
| Behaviour | Irreversible deletion disabled until legal approval. |
| Related screens | ACC-13, ADM-51 |
| Dependencies and decisions | D09, D15, A13 |

Form fields:

  - Request type (radio, Required): Access, Export, Deletion, Account closure
  - Details (textarea, Optional): optional

### ACC-17 · Billing, invoices and statements

| Item | Specification |
|---|---|
| Screen ID | ACC-17 |
| Screen name | Billing, invoices and statements |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Buyer OWNER/PROCUREMENT; seller OWNER/FINANCE |
| Route / URL | `Not built (spec /account/billing, /finance/invoices)` |
| Implementation status | Blocked · P0 |
| 1. Purpose | Download supplier merchandise invoices, platform commission invoices, credit notes, receipts and statements. |
| 2. Navigation location | Buyer and seller finance nav |
| 3. User permissions | Buyer invoice read: OWNER/PROCUREMENT (10-security); seller finance: OWNER/FINANCE |
| 4. Screen layout | Workspace shell (top bar and account/company navigation). Page header (title, status badge, primary action). Content: Data table, download button, filters. |
| 5. Components | Data table, download button, filters |
| 6. Displayed data | Invoice list (number, issuer, recipient, type, date, total, VAT, status), credit notes, statements by period. |
| 7. Buttons and actions | Primary: Download invoice · Secondary: Filter; Download statement |
| 8. Form fields | Required: — · Optional: Period, Type (details below) |
| Filters · sorting · search | Type, period, counterparty · Date · Invoice number |
| 9. Validation rules | — |
| 10. API dependencies | Not built |
| Database entities | invoices (spec only) |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Download invoice…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Immutable issued documents. |
| Related screens | BUY-28, SEL-34 |
| Dependencies and decisions | D06 tax approval, founder decision 5 |

Form fields:

  - Period (date range, Optional)
  - Type (select, Optional): Merchandise invoice, Commission invoice, Credit note, Receipt

## Manufacturer dashboard

### SEL-01 · Seller overview (dashboard)

| Item | Specification |
|---|---|
| Screen ID | SEL-01 |
| Screen name | Seller overview (dashboard) |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES, WAREHOUSE, FINANCE, VIEWER |
| Route / URL | `/{locale}/app/seller/[workspaceId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Seller home: listing eligibility, storefront status and real catalogue/inventory counts. |
| 2. Navigation location | Seller sub-nav (Overview, Storefront, Products, Add product, Inventory, Pricing, Quotation requests, Quotes, Orders, Disputes, Finance, Support, Messages, Company settings) |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Page header with "Add product", alert, storefront status card, KPI tile list, decisions list with status badges, skeleton (8 lines), empty ("No decisions yet."). |
| 5. Components | Page header with "Add product", alert, storefront status card, KPI tile list, decisions list with status badges, skeleton (8 lines), empty ("No decisions yet.") |
| 6. Displayed data | Eligibility alert ("Your company can list products." / "Listing is paused: {reason}"); storefront status (Live / Not live / Hidden by the marketplace team); KPI tiles (Public, Pending review, Drafts, Rejected/changes requested, Suspended, Low stock, Out of stock) each linking to a filtered list; recent moderation decisions. No orders, RFQ or finance figures yet. |
| 7. Buttons and actions | Primary: Add product · Secondary: Open storefront; open KPI lists |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/overview |
| Database entities | products, product_versions, inventory, storefronts |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | (existing) "Your company can list products." (suggested) "Build your storefront, then add your first product." Action: Open storefront; Add product. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Tiles 2-up; sub-nav scrolls horizontally (gap G-20). |
| 17. Desktop layout (1440px) | KPI row; two-column cards. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: verification, listing moderation and holds affect what this overview shows. |
| Behaviour | Tiles are links with counts from GET overview. |
| Related screens | SEL-02, SEL-06, SEL-15, SEL-34 |
| Dependencies and decisions | Section 8 metrics |

Form fields:

  - None

### SEL-06 · Product list

| Item | Specification |
|---|---|
| Screen ID | SEL-06 |
| Screen name | Product list |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/products` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Manage every listing by lifecycle tab. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Tabs, table/cards, status badge, pagination, empty state. |
| 5. Components | Tabs, table/cards, status badge, pagination, empty state |
| 6. Displayed data | Tabs (published, pending, draft, rejected/changes requested, suspended, unpublished, archived); title, SKU count, status badge, version state, updated. |
| 7. Buttons and actions | Primary: Add product · Secondary: Open product; switch tab; load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Tab (lifecycle) · Recently updated · None today (recommended) |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/products?tab= |
| Database entities | products, product_versions |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/products/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "You have no products in this tab." Action: Add product. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards; tabs scroll. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-07, SEL-08 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-07 · Add product

| Item | Specification |
|---|---|
| Screen ID | SEL-07 |
| Screen name | Add product |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `/{locale}/app/seller/[workspaceId]/products/new` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Create a draft product with its first variant. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Form: text, select, radio. |
| 5. Components | Form: text, select, radio |
| 6. Displayed data | Minimal creation form; listing continues in the editor. |
| 7. Buttons and actions | Primary: Create draft · Secondary: Cancel |
| 8. Form fields | Required: Title (EN), Category, Fulfilment mode, SKU code, Unit · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Server zod; seller eligibility |
| 10. API dependencies | POST /seller/workspaces/{ws}/products |
| Database entities | products, product_versions, skus |
| Source files | products/new/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Create draft…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Server zod; seller eligibility Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column. |
| 17. Desktop layout (1440px) | Narrow form. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-08 |
| Dependencies and decisions | — |

Form fields:

  - Title (EN) (text, Required): 3–150
  - Category (select, Required): leaf, not BLOCKED
  - Fulfilment mode (radio, Required): READY_STOCK, MADE_TO_ORDER
  - SKU code (text, Required): SKU regex
  - Unit (select, Required): 8 units (default PIECE)

### SEL-08 · Product editor (content)

| Item | Specification |
|---|---|
| Screen ID | SEL-08 |
| Screen name | Product editor (content) |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES (edit); others read |
| Route / URL | `/{locale}/app/seller/[workspaceId]/products/[productId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Edit listing content; edits to a live listing create a new draft version that goes through review. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Tabs or sections (Content, Media, Variants, Pricing, History), bilingual inputs, attribute fields, repeaters, status banner. |
| 5. Components | Tabs or sections (Content, Media, Variants, Pricing, History), bilingual inputs, attribute fields, repeaters, status banner |
| 6. Displayed data | Status, working vs published version, reason from the marketplace team, content fields, category attributes, specifications, certifications "(declared by supplier)". |
| 7. Buttons and actions | Primary: Save · Secondary: Submit for review; Withdraw submission; Unpublish; Archive; Duplicate; View public page |
| 8. Form fields | Required: Title EN, Category, Mode · Optional: Title AR, Description EN, Description AR, Category attributes, Specifications, Materials, Dimensions, Country of origin, Lead time min/max (days), Dispatch days, Custom manufacturing / Private label / White label / Samples, Samples note, Certifications, Video URL (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Restricted-term screening on submit |
| 10. API dependencies | GET/PATCH /seller/workspaces/{ws}/products/{id} |
| Database entities | products, product_versions, category_attributes |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/products/[productId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Save…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Restricted-term screening on submit Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Opens: SEL-12 Submit for review dialog; SEL-13 Listing lifecycle dialogs. |
| 16. Mobile layout (360px) | Section tabs become a select; sticky Save. |
| 17. Desktop layout (1440px) | Left section nav, form right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: sees the approved version on PUB-07; Platform administrator: reviews changes in ADM-11/ADM-12. |
| Behaviour | expected_version; locked fields while pending. |
| Related screens | SEL-09, SEL-10, SEL-11, SEL-12, SEL-13, SEL-14, SEL-39 |
| Dependencies and decisions | A10, A11 |

Form fields:

  - Title EN (text, Required): 3–150
  - Title AR (text, Optional): ≤150
  - Description EN (textarea, Optional): ≤8000
  - Description AR (textarea, Optional): ≤8000
  - Category (select, Required)
  - Mode (radio, Required)
  - Category attributes (dynamic, Optional): per category
  - Specifications (repeater, Optional): ≤40
  - Materials (text, Optional): ≤300
  - Dimensions (text, Optional): ≤200
  - Country of origin (text, Optional): 2-letter code
  - Lead time min/max (days) (integer, Optional): 0–365
  - Dispatch days (integer, Optional): 0–365
  - Custom manufacturing / Private label / White label / Samples (checkbox, Optional)
  - Samples note (text, Optional)
  - Certifications (repeater, Optional): ≤20
  - Video URL (url, Optional): YouTube or Vimeo only

### SEL-09 · Product media manager

| Item | Specification |
|---|---|
| Screen ID | SEL-09 |
| Screen name | Product media manager |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-08` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Upload and order product images. |
| 2. Navigation location | Opened from SEL-08 Product editor (content) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Block inside SEL-08 Product editor (content) with its own heading and actions. Content: Uploader, sortable grid, scan state. |
| 5. Components | Uploader, sortable grid, scan state |
| 6. Displayed data | Up to 12 images with order and primary. |
| 7. Buttons and actions | Primary: Upload image · Secondary: Reorder; remove; set primary |
| 8. Form fields | Required: Image · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Type/size/dimensions; scan |
| 10. API dependencies | Product media endpoints |
| Database entities | product_media, files |
| Source files | products/[productId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Type/size/dimensions; scan Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | 2-up grid. |
| 17. Desktop layout (1440px) | 4–6-up grid. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-08 |
| Dependencies and decisions | — |

Form fields:

  - Image (file, Required): PNG/JPEG/WebP ≥200px ≤10 MB, ≤12

### SEL-10 · Variants (SKU) manager

| Item | Specification |
|---|---|
| Screen ID | SEL-10 |
| Screen name | Variants (SKU) manager |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-08` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Add and edit variants. |
| 2. Navigation location | Opened from SEL-08 Product editor (content) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Block inside SEL-08 Product editor (content) with its own heading and actions. Content: Table, inline form, toggle. |
| 5. Components | Table, inline form, toggle |
| 6. Displayed data | SKU code, variant attributes, unit, active, approval state. |
| 7. Buttons and actions | Primary: Add variant · Secondary: Edit; deactivate; delete (never-approved only) |
| 8. Form fields | Required: SKU code, Unit · Optional: Variant attributes, Active (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST/PATCH/DELETE /seller/workspaces/{ws}/products/{id}/skus(/{skuId}) |
| Database entities | skus |
| Source files | products/[productId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: deactivate, delete (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Cards. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Identity locked once approved. |
| Related screens | SEL-08, SEL-15 |
| Dependencies and decisions | — |

Form fields:

  - SKU code (text, Required): regex, unique
  - Variant attributes (key-value, Optional)
  - Unit (select, Required)
  - Active (toggle, Optional)

### SEL-11 · Product pricing editor

| Item | Specification |
|---|---|
| Screen ID | SEL-11 |
| Screen name | Product pricing editor |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-08` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Set live pricing without review (audited). |
| 2. Navigation location | Opened from SEL-08 Product editor (content) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Block inside SEL-08 Product editor (content) with its own heading and actions. Content: Radio (price type), tier table editor, number inputs. |
| 5. Components | Radio (price type), tier table editor, number inputs |
| 6. Displayed data | "Prices, MOQ and increments change immediately without review… Amounts are AED excluding VAT." |
| 7. Buttons and actions | Primary: Save pricing · Secondary: Add tier; remove tier |
| 8. Form fields | Required: Price type, MOQ, Order increment · Optional: Tiers (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Tier rules |
| 10. API dependencies | POST /seller/workspaces/{ws}/products/{id}/pricing |
| Database entities | price_tiers, skus |
| Source files | products/[productId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Tier rows stacked. |
| 17. Desktop layout (1440px) | Tier table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: price tiers on PUB-07 and cart totals (server-calculated). |
| Behaviour | — |
| Related screens | SEL-19 |
| Dependencies and decisions | — |

Form fields:

  - Price type (radio, Required): FIXED, TIERED, QUOTE_ONLY
  - MOQ (integer, Required): ≥1
  - Order increment (integer, Required): ≥1
  - Tiers (table, Optional): FIXED 1; TIERED 2–10; first = MOQ; ascending qty; non-increasing price

### SEL-12 · Submit for review dialog

| Item | Specification |
|---|---|
| Screen ID | SEL-12 |
| Screen name | Submit for review dialog |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-08` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Send the draft to moderation. |
| 2. Navigation location | Opened from SEL-08 Product editor (content) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Dialog over SEL-08 Product editor (content): title, context text, fields, footer with secondary action then primary action. Content: Confirm dialog. |
| 5. Components | Confirm dialog |
| 6. Displayed data | What review checks; restricted-term warnings. |
| 7. Buttons and actions | Primary: Submit for review · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Completeness; restricted terms |
| 10. API dependencies | POST /seller/workspaces/{ws}/products/{id}/submit |
| Database entities | product_versions |
| Source files | products/[productId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Submit for review…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Completeness; restricted terms Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Submit for review" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: submission enters the moderation queue (ADM-11). |
| Behaviour | — |
| Related screens | SEL-08, ADM-12 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-13 · Listing lifecycle dialogs

| Item | Specification |
|---|---|
| Screen ID | SEL-13 |
| Screen name | Listing lifecycle dialogs |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialogs on SEL-08` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Withdraw submission, unpublish, republish, archive, restore or duplicate. One component, six variations. |
| 2. Navigation location | Opened from SEL-08 Product editor (content) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Dialog over SEL-08 Product editor (content): title, context text, fields, footer with secondary action then primary action. Content: Confirm dialog (6 variants). |
| 5. Components | Confirm dialog (6 variants) |
| 6. Displayed data | Consequence text per action. |
| 7. Buttons and actions | Primary: Confirm action · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /seller/workspaces/{ws}/products/{id}/withdraw\|unpublish\|republish\|archive\|restore\|duplicate |
| Database entities | products, product_versions |
| Source files | products/[productId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Confirm action…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Confirm action" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Duplicate creates a new draft with zero stock. |
| Related screens | SEL-08 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-14 · Moderation history

| Item | Specification |
|---|---|
| Screen ID | SEL-14 |
| Screen name | Moderation history |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `Section of SEL-08` |
| Implementation status | Implemented · P1 |
| 1. Purpose | See every review decision and reason. |
| 2. Navigation location | Opened from SEL-08 Product editor (content) |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| 4. Screen layout | Block inside SEL-08 Product editor (content) with its own heading and actions. Content: Timeline list, status badge. |
| 5. Components | Timeline list, status badge |
| 6. Displayed data | Version, state (Draft, Pending review, Approved, Rejected, Changes requested, Superseded, Withdrawn), decided at, reason. |
| 7. Buttons and actions | Primary: — · Secondary: Open version |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/products/{id} |
| Database entities | product_versions, moderation_decisions |
| Source files | products/[productId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Hidden when there is nothing to show, unless stated otherwise in the purpose. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | List. |
| 17. Desktop layout (1440px) | List. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-08 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-15 · Inventory

| Item | Specification |
|---|---|
| Screen ID | SEL-15 |
| Screen name | Inventory |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/inventory` |
| Implementation status | Implemented · P0 |
| 1. Purpose | See stock per variant and act on it. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). Adjust: seller.inventory.ship. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Filter chips, table, badges, empty state ("No variants yet."). |
| 5. Components | Filter chips, table, badges, empty state ("No variants yet.") |
| 6. Displayed data | Product, SKU, on hand, reserved, unavailable, available, low-stock threshold, restock date, flags (Low, Out). |
| 7. Buttons and actions | Primary: Adjust stock · Secondary: Set threshold; view movements |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | All, Low stock, Out of stock · Product · None today |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/inventory |
| Database entities | inventory, skus |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/inventory/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (existing) "No variants yet." Action: Open product. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (SEL-16); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: SEL-16 Stock adjustment dialog. |
| 16. Mobile layout (360px) | Cards with available figure prominent. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: availability on PUB-07 and stock checks at cart and checkout. |
| Behaviour | — |
| Related screens | SEL-16, SEL-17, SEL-18 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-16 · Stock adjustment dialog

| Item | Specification |
|---|---|
| Screen ID | SEL-16 |
| Screen name | Stock adjustment dialog |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Dialog on SEL-15` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Atomically change stock with a reason. |
| 2. Navigation location | Opened from SEL-15 Inventory |
| 3. User permissions | Seller OWNER or WAREHOUSE (seller.inventory.ship); trading-gated. |
| 4. Screen layout | Dialog over SEL-15 Inventory: title, context text, fields, footer with secondary action then primary action. Content: Dialog, select, number, textarea. |
| 5. Components | Dialog, select, number, textarea |
| 6. Displayed data | Current figures; resulting available. |
| 7. Buttons and actions | Primary: Save adjustment · Secondary: Cancel |
| 8. Form fields | Required: Movement, Quantity, Note · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Never negative |
| 10. API dependencies | POST /seller/workspaces/{ws}/inventory/{skuId}/adjust |
| Database entities | inventory, stock_movements |
| Source files | inventory/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Save adjustment…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Save adjustment" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-15 |
| Dependencies and decisions | — |

Form fields:

  - Movement (select, Required): RECEIVE, REMOVE, MARK_UNAVAILABLE, RELEASE_UNAVAILABLE, SET_ON_HAND
  - Quantity (integer, Required): >0 (never negative result)
  - Note (text, Required): reason

### SEL-17 · Low-stock threshold and restock date

| Item | Specification |
|---|---|
| Screen ID | SEL-17 |
| Screen name | Low-stock threshold and restock date |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Inline form on SEL-15` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Configure alerts and the expected restock date. |
| 2. Navigation location | Opened from SEL-15 Inventory |
| 3. User permissions | Seller OWNER or WAREHOUSE (seller.inventory.ship); trading-gated. |
| 4. Screen layout | Block inside SEL-15 Inventory with its own heading and actions. Content: Number input, date input. |
| 5. Components | Number input, date input |
| 6. Displayed data | Threshold, restock date. |
| 7. Buttons and actions | Primary: Save · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Low-stock threshold, Restock date (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | PATCH /seller/workspaces/{ws}/inventory/{skuId} |
| Database entities | inventory |
| Source files | inventory/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-15 |
| Dependencies and decisions | — |

Form fields:

  - Low-stock threshold (integer, Optional): ≥0
  - Restock date (date, Optional)

### SEL-18 · Stock movement history

| Item | Specification |
|---|---|
| Screen ID | SEL-18 |
| Screen name | Stock movement history |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `Drawer on SEL-15` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Append-only audit of stock changes. |
| 2. Navigation location | Opened from SEL-15 Inventory |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| 4. Screen layout | Drawer over SEL-15 Inventory; host stays visible behind a scrim. Content: Drawer, table. |
| 5. Components | Drawer, table |
| 6. Displayed data | When, kind (8 movement kinds incl. RESERVE, SALE), quantity, actor, note. |
| 7. Buttons and actions | Primary: — · Secondary: Load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · Newest · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/inventory/{skuId}/movements |
| Database entities | stock_movements |
| Source files | inventory/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "—…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-screen sheet. |
| 17. Desktop layout (1440px) | Right drawer. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-15 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-19 · Pricing overview

| Item | Specification |
|---|---|
| Screen ID | SEL-19 |
| Screen name | Pricing overview |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/pricing` |
| Implementation status | Implemented · P1 |
| 1. Purpose | See prices across products; edit inside each product. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Table, links. |
| 5. Components | Table, links |
| 6. Displayed data | "Open a product to change its price type, tiers, MOQ and increments."; product, price type, MOQ, increment, tier range. |
| 7. Buttons and actions | Primary: Open product pricing · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/products |
| Database entities | price_tiers |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/pricing/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No pricing overview yet." with a one-line explanation and the action "Open product pricing". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-11 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-35 · Seller analytics

| Item | Specification |
|---|---|
| Screen ID | SEL-35 |
| Screen name | Seller analytics |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES, FINANCE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/analytics (proposed)` |
| Implementation status | Planned · P2 |
| 1. Purpose | Views, RFQ win rate, conversion, top products. Product view counts are not stored today; RFQ/quote/order metrics can be computed from existing tables. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | OWNER, SALES, FINANCE |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: KPI tiles, line chart, bar chart, table. |
| 5. Components | KPI tiles, line chart, bar chart, table |
| 6. Displayed data | Period selector, charts, tables. |
| 7. Buttons and actions | Primary: — · Secondary: Change period; export |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Period · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | New product_view_events; rfqs, quotes, orders |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | Confirm in a dialog before: export (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SEL-01 |
| Dependencies and decisions | Analytics decision |

Form fields:

  - None

## Marketplace discovery

### PUB-02 · Category directory

| Item | Specification |
|---|---|
| Screen ID | PUB-02 |
| Screen name | Category directory |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest, verified user |
| Route / URL | `/{locale}/categories` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Browse the full, database-managed category tree (12 launch categories, A09). |
| 2. Navigation location | Breadcrumb Marketplace › Categories |
| 3. User permissions | Public; hidden, archived and BLOCKED categories are not shown. |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Breadcrumb, category directory block (image, title, child links), skeleton, empty state. |
| 5. Components | Breadcrumb, category directory block (image, title, child links), skeleton, empty state |
| 6. Displayed data | Each top-level category with image, EN/AR name, public product count and its subcategories with counts. |
| 7. Buttons and actions | Primary: Open a category · Secondary: Open a subcategory |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | None · Admin-defined position · Header search |
| 9. Validation rules | — |
| 10. API dependencies | GET /marketplace/categories |
| Database entities | categories |
| Source files | apps/web/src/app/[locale]/categories/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Stacked category blocks; subcategory links as wrapping chips. |
| 17. Desktop layout (1440px) | Two-column grid of category blocks. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Links only. |
| Related screens | PUB-03, PUB-04 |
| Dependencies and decisions | A09 |

Form fields:

  - None

### PUB-03 · Category page

| Item | Specification |
|---|---|
| Screen ID | PUB-03 |
| Screen name | Category page |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest, verified user |
| Route / URL | `/{locale}/categories/[id]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Landing page for one category: subcategories, seller requirements and the category's product results. |
| 2. Navigation location | Breadcrumb Marketplace › Categories › Parent › Category |
| 3. User permissions | Public; price filters verified only. |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Breadcrumb, category header, subcategory chips, info alert for restricted categories, search results module (PUB-04). |
| 5. Components | Breadcrumb, category header, subcategory chips, info alert for restricted categories, search results module (PUB-04) |
| 6. Displayed data | Category name and description, image, subcategory links, "Supplier requirements" text (REVIEW_REQUIRED categories note that listings are reviewed and need certification details), embedded search results filtered to the category including category-attribute filters. |
| 7. Buttons and actions | Primary: Open product · Secondary: Choose subcategory; apply filters |
| 8. Form fields | Required: — · Optional: Same filters as PUB-04 (details below) |
| Filters · sorting · search | All PUB-04 filters plus category attribute filters (filterable attributes only) · As PUB-04 · Header search; query keeps category |
| 9. Validation rules | As PUB-04 |
| 10. API dependencies | GET /marketplace/categories/{id}; GET /marketplace/products?category_id= |
| Database entities | categories, category_attributes, marketplace_products |
| Source files | apps/web/src/app/[locale]/categories/[id]/page.tsx; components/search-results.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Filters behind "Filters" toggle; results single column or 2-up grid. |
| 17. Desktop layout (1440px) | Left filter column, results grid on the right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | URL holds filter state. |
| Related screens | PUB-02, PUB-04, PUB-07 |
| Dependencies and decisions | A09, A12 |

Form fields:

  - Same filters as PUB-04 (mixed, Optional): see PUB-04

### PUB-04 · Search results

| Item | Specification |
|---|---|
| Screen ID | PUB-04 |
| Screen name | Search results |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest, verified user |
| Route / URL | `/{locale}/search?q=&…` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Find approved products with wholesale filters and sorting. |
| 2. Navigation location | Back to results preserved via URL |
| 3. User permissions | Public; guests get 422 on price filters/sorts so the UI hides them and shows "Price filters are available after signing in with a verified email." |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Filter panel, results bar (count, sort, grid/list toggle), product card (grid and list variants), pagination, "Clear all", empty state "No products match these filters.". |
| 5. Components | Filter panel, results bar (count, sort, grid/list toggle), product card (grid and list variants), pagination, "Clear all", empty state "No products match these filters." |
| 6. Displayed data | Result count, active filters, product cards (grid or list), price visibility notice for guests, pagination ("Show more results"). |
| 7. Buttons and actions | Primary: Open product · Secondary: Apply / Clear all filters; change sort; switch grid/list; Show more results |
| 8. Form fields | Required: — · Optional: q, category_id, mode, business_type, emirate, price_min (AED), price_max (AED), moq_max, lead_time_max (days), delivery_max (dispatch within, days), in_stock, custom, private_label, white_label, samples, attrs (details below) |
| Filters · sorting · search | Category, product type, supplier type, emirate, price min/max (verified), MOQ up to, lead time up to, dispatch within, in stock only, custom manufacturing, private label, white label, samples, category attributes · Relevance, Newest, Price low→high (verified), Price high→low (verified), Lowest MOQ · Trigram EN/AR normalised search (diacritics, alef/yaa forms, Arabic-Indic digits) |
| 9. Validation rules | Numeric filters integers ≥0; price as AED with ≤2 decimals. |
| 10. API dependencies | GET /marketplace/products |
| Database entities | marketplace_products, category_attributes |
| Source files | apps/web/src/app/[locale]/search/page.tsx; components/search-results.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Open product…" and is disabled. |
| 12. Empty state | (existing) "No products match these filters." (suggested addition) "Try fewer filters or a different word." Action: Clear all filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: Numeric filters integers ≥0; price as AED with ≤2 decimals. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | "Filters" button opens a sheet (PUB-05); cards single column in list view, 2-up in grid view. |
| 17. Desktop layout (1440px) | Persistent left filter column (≈280px); 3–4 card grid. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Filters write to the URL; page size 24 (max 48); offset cursor. |
| Related screens | PUB-05, PUB-06, PUB-07 |
| Dependencies and decisions | A12 |

Form fields:

  - q (text, Optional): max 100
  - category_id (select, Optional): uuid
  - mode (radio, Optional): READY_STOCK, MADE_TO_ORDER, Any
  - business_type (checkboxes, Optional): 7 business types
  - emirate (checkboxes, Optional): 7 emirates
  - price_min (AED) (money, Optional): verified only
  - price_max (AED) (money, Optional): verified only
  - moq_max (integer, Optional): 0–10,000,000
  - lead_time_max (days) (integer, Optional): 0–365
  - delivery_max (dispatch within, days) (integer, Optional): 0–365
  - in_stock (checkbox, Optional)
  - custom (checkbox, Optional): custom manufacturing
  - private_label (checkbox, Optional)
  - white_label (checkbox, Optional)
  - samples (checkbox, Optional)
  - attrs (attribute filters, Optional): up to 10 key:value pairs

### PUB-05 · Filter panel / mobile filter sheet

| Item | Specification |
|---|---|
| Screen ID | PUB-05 |
| Screen name | Filter panel / mobile filter sheet |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest, verified user |
| Route / URL | `Overlay on PUB-03/PUB-04` |
| Implementation status | Partial · P0 |
| 1. Purpose | Narrow results on small screens without leaving the results page. |
| 2. Navigation location | Close returns to results |
| 3. User permissions | As PUB-04 |
| 4. Screen layout | Overlay over PUB-03 Category page; host stays visible behind a scrim. Content: Bottom sheet or full-screen drawer, checkbox group, radio group, number inputs, sticky footer with Apply/Clear. |
| 5. Components | Bottom sheet or full-screen drawer, checkbox group, radio group, number inputs, sticky footer with Apply/Clear |
| 6. Displayed data | All filter groups of PUB-04, the active-filter count, Apply and Clear all. |
| 7. Buttons and actions | Primary: Apply · Secondary: Clear all; Close |
| 8. Form fields | Required: — · Optional: As PUB-04 (details below) |
| Filters · sorting · search | As PUB-04 · Sort can live in the same sheet on mobile · — |
| 9. Validation rules | As PUB-04 |
| 10. API dependencies | — |
| Database entities | — |
| Source files | components/search-results.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Apply…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-height sheet, sticky Apply bar, 44px targets. |
| 17. Desktop layout (1440px) | Not used (filters persistent). |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Today the filters toggle open inline (`.filters-toggle`); a true sheet with focus trap, sticky actions and result count preview is recommended. |
| Related screens | PUB-04 |
| Dependencies and decisions | — |

Form fields:

  - As PUB-04 (mixed, Optional)

### PUB-06 · Search suggestions dropdown

| Item | Specification |
|---|---|
| Screen ID | PUB-06 |
| Screen name | Search suggestions dropdown |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest, verified user |
| Route / URL | `Overlay on header search` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Autocomplete products, suppliers and categories while typing. |
| 2. Navigation location | Enter submits; arrow keys move |
| 3. User permissions | Public |
| 4. Screen layout | Overlay over the host page; host stays visible behind a scrim. Content: Combobox with listbox groups. |
| 5. Components | Combobox with listbox groups |
| 6. Displayed data | Three grouped lists: products, suppliers, categories. |
| 7. Buttons and actions | Primary: Select a suggestion · Secondary: Submit full search |
| 8. Form fields | Required: — · Optional: q (details below) |
| Filters · sorting · search | — · Server relevance · Autocomplete |
| 9. Validation rules | 2–100 characters |
| 10. API dependencies | GET /marketplace/suggest |
| Database entities | marketplace_products, marketplace_suppliers, categories |
| Source files | components/market-shell.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Select a suggestion…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: 2–100 characters |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-width dropdown under the search field. |
| 17. Desktop layout (1440px) | Dropdown anchored to search bar. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Debounced requests; Escape closes. |
| Related screens | PUB-04, PUB-07, PUB-10, PUB-03 |
| Dependencies and decisions | — |

Form fields:

  - q (text, Optional): min 2, max 100

### PUB-07 · Product detail

| Item | Specification |
|---|---|
| Screen ID | PUB-07 |
| Screen name | Product detail |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest, verified user, approved buyer (OWNER/PROCUREMENT) |
| Route / URL | `/{locale}/products/[id]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Evaluate a product and act: add to cart (ready stock), request a quotation, save, compare or contact the supplier. |
| 2. Navigation location | Breadcrumb; Back to results |
| 3. User permissions | Guest: no prices, buttons disabled with reason. Verified: prices, save, compare. Trading (approved buyer, OWNER/PROCUREMENT): cart and RFQ. Reasons: sign_in, requires_approved_buyer, quote_only, made_to_order, checkout_disabled. |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Breadcrumb, image gallery with thumbnails, price tier table, variant selector, quantity stepper, price calculator, trading action panel with disabled-reason text, supplier card, attribute list, specification table, certification list, product card row, save/compare toggles. |
| 5. Components | Breadcrumb, image gallery with thumbnails, price tier table, variant selector, quantity stepper, price calculator, trading action panel with disabled-reason text, supplier card, attribute list, specification table, certification list, product card row, save/compare toggles |
| 6. Displayed data | Gallery (up to 12 images) and optional video link; title EN/AR; category path; mode (ready stock / made to order); availability; MOQ and order increment; lead time; dispatch days; customisation flags (custom manufacturing, private label, white label, samples + note); description; category attributes; specifications; materials; dimensions; country of origin; certifications "(declared by supplier)"; variants table with tiers (verified only) and availability; price calculator (verified); supplier card (name, emirate, business type, verified since, year established, logo); related products. FD-18: when the supplier has not provided an Arabic description, the Arabic page shows the English text under the note "لم يقدّم المورد وصفاً بالعربية" ("Arabic description not provided by the supplier"). FD-13: "Request a sample" action when the supplier offers samples for this product (BUY-32). |
| 7. Buttons and actions | Primary: Add to cart (ready stock, approved buyer) or Request quotation · Secondary: Add to cart / Request quotation / Request a sample (FD-13) / Save / Compare / Message supplier |
| 8. Form fields | Required: — · Optional: Variant (SKU), Quantity (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Server: MOQ_NOT_MET, INCREMENT, QUOTE_ONLY, insufficient stock, self-trade. |
| 10. API dependencies | GET /marketplace/products/{id}; /related; /estimate; POST /buyer/workspaces/{ws}/cart/items; POST/DELETE /marketplace/saved/products/{id}; /marketplace/compare/{id}; POST /marketplace/recent/{id} |
| Database entities | products, product_versions, product_media, skus, price_tiers, inventory, storefronts |
| Source files | apps/web/src/app/[locale]/products/[id]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Add to cart…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: Server: MOQ_NOT_MET, INCREMENT, QUOTE_ONLY, insufficient stock, self-trade. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Added to your cart." / "recently viewed". |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Gallery first (swipeable), sticky bottom action bar with primary CTA, sections stacked as accordions. |
| 17. Desktop layout (1440px) | Two columns: gallery left (≈55%), summary and trade panel right (sticky); details below full width. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: content, prices, stock and sample settings come from SEL-08, SEL-11, SEL-15 and SEL-39; Platform administrator: listing approval and enforcement (ADM-12, ADM-16). |
| Behaviour | Calculator calls the server estimate; Add to cart shows "Added to your cart." with View cart; viewing records "recently viewed" for verified users. |
| Related screens | PUB-04, PUB-10, BUY-16, BUY-03, BUY-32 |
| Dependencies and decisions | A11, A12, P4-6 |

Form fields:

  - Variant (SKU) (select, Optional): active SKUs
  - Quantity (integer, Optional): ≥ MOQ, follows increment, ≤ available

### PUB-08 · Product image viewer (lightbox)

| Item | Specification |
|---|---|
| Screen ID | PUB-08 |
| Screen name | Product image viewer (lightbox) |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | All marketplace viewers |
| Route / URL | `Overlay on PUB-07` |
| Implementation status | Recommended · P1 |
| 1. Purpose | Inspect product photography at full size (product imagery is the main visual focus). |
| 2. Navigation location | Arrow keys, Escape |
| 3. User permissions | Public (images served only while attached to public content) |
| 4. Screen layout | Overlay over PUB-07 Product detail; host stays visible behind a scrim. Content: Modal lightbox, previous/next, pinch zoom, thumbnails. |
| 5. Components | Modal lightbox, previous/next, pinch zoom, thumbnails |
| 6. Displayed data | Full-size image, position "Image n of total", alt text. |
| 7. Buttons and actions | Primary: Next image · Secondary: Previous; Close |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /media/{id} |
| Database entities | files, product_media |
| Source files | — (current gallery: thumbnails + main image) |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Next image…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-screen, swipe, pinch zoom. |
| 17. Desktop layout (1440px) | Centered modal at 90vh. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Focus trapped; returns focus to the thumbnail. |
| Related screens | PUB-07 |
| Dependencies and decisions | — |

Form fields:

  - None

### PUB-09 · Supplier directory

| Item | Specification |
|---|---|
| Screen ID | PUB-09 |
| Screen name | Supplier directory |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest, verified user |
| Route / URL | `/{locale}/suppliers` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Discover verified suppliers and manufacturers. |
| 2. Navigation location | Sub-nav Suppliers |
| 3. User permissions | Public; only published, non-hidden storefronts of eligible approved sellers. |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Filter bar, supplier card, pagination, empty state "No suppliers match these filters.". |
| 5. Components | Filter bar, supplier card, pagination, empty state "No suppliers match these filters." |
| 6. Displayed data | Supplier cards: logo, cover, name, business type, emirate, "Verified supplier", verified since, specialisation, categories, product count, capability flags. |
| 7. Buttons and actions | Primary: Open storefront · Secondary: Save supplier (verified); filter |
| 8. Form fields | Required: — · Optional: q, category_id, emirate, business_type, custom, private_label, white_label, samples (details below) |
| Filters · sorting · search | Category, emirate, business type, customisation, private label, white label, samples · Server default (no user sort today) · Name search |
| 9. Validation rules | — |
| 10. API dependencies | GET /marketplace/suppliers |
| Database entities | marketplace_suppliers view, storefronts, storefront_media |
| Source files | apps/web/src/app/[locale]/suppliers/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Open storefront…" and is disabled. |
| 12. Empty state | (existing) "No suppliers match these filters." Action: Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single-column cards; filters in sheet. |
| 17. Desktop layout (1440px) | Filter row above a 3-column grid. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | URL-driven filters; 24 per page. |
| Related screens | PUB-10 |
| Dependencies and decisions | A10, A12 |

Form fields:

  - q (text, Optional): max 100
  - category_id (select, Optional)
  - emirate (checkboxes, Optional)
  - business_type (checkboxes, Optional)
  - custom (checkbox, Optional)
  - private_label (checkbox, Optional)
  - white_label (checkbox, Optional)
  - samples (checkbox, Optional)

### PUB-10 · Supplier storefront (manufacturer profile)

| Item | Specification |
|---|---|
| Screen ID | PUB-10 |
| Screen name | Supplier storefront (manufacturer profile) |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Guest, verified user, approved buyer |
| Route / URL | `/{locale}/suppliers/[id]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Present a supplier's verified business profile, capabilities, catalogue and anonymised reviews. |
| 2. Navigation location | Breadcrumb Suppliers › Name |
| 3. User permissions | Public profile; RFQ and messaging only for approved buyers (A12); reviews anonymised (P5-6; founder: "verified business buyer"). |
| 4. Screen layout | Public header (text logo placeholder, search, categories, language EN/AR, sign in / account) and footer with legal links. Page header (title, status badge, primary action). Content: Storefront header (cover, logo, badges), capability tags, certification list, gallery, product grid, review summary and list, save toggle. |
| 5. Components | Storefront header (cover, logo, badges), capability tags, certification list, gallery, product grid, review summary and list, save toggle |
| 6. Displayed data | Cover and logo; name; business type; emirate and city; verified since; year established; About (EN/AR); specialisation; capabilities; production capacity; fulfilment text; customisation flags; certifications; factory/warehouse gallery; product catalogue (search results filtered by storefront); buyer reviews: average, count, recent items labelled "Verified buyer"; note that contact details, documents and bank information are never shown. Return policy (EN/AR) from the storefront (PR #17). FD-13: "Request a sample" on the storefront when the supplier offers samples (BUY-32). Reviews show only "Verified business buyer" (FD-15, PR #16). |
| 7. Buttons and actions | Primary: Request quotation (approved buyer) · Secondary: Message supplier; Save supplier; open product |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Catalogue uses PUB-04 filters scoped to the storefront · As PUB-04 · Catalogue search |
| 9. Validation rules | — |
| 10. API dependencies | GET /marketplace/suppliers/{id}; GET /marketplace/suppliers/{id}/reviews; GET /marketplace/products?storefront_id= |
| Database entities | storefronts, storefront_media, reviews |
| Source files | apps/web/src/app/[locale]/suppliers/[id]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | (existing) "No reviews yet." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cover shorter, logo overlaps; tabs About / Products / Reviews. |
| 17. Desktop layout (1440px) | Header band, two-column body (profile left, catalogue right) or tabbed. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: storefront and return policy from SEL-02; reviews from buyers (BUY-26) moderated by administrators (ADM-41), shown as "Verified business buyer". |
| Behaviour | Request quotation prefills the RFQ with the supplier as invitee. |
| Related screens | PUB-07, BUY-03, MSG-03 |
| Dependencies and decisions | P5-6, founder decision 8 (reviews) |

Form fields:

  - None

### PUB-11 · Saved products and suppliers

| Item | Specification |
|---|---|
| Screen ID | PUB-11 |
| Screen name | Saved products and suppliers |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Email-verified user |
| Route / URL | `/{locale}/saved` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Shortlist products and suppliers for later. |
| 2. Navigation location | Sub-nav Saved |
| 3. User permissions | Email-verified users only (A12); guests see a sign-in prompt. |
| 4. Screen layout | Public header (signed-in variant with account menu) and footer. Page header (title, status badge, primary action). Content: Tabs or two sections, product card, supplier card, unavailable card variant, remove button. |
| 5. Components | Tabs or two sections, product card, supplier card, unavailable card variant, remove button |
| 6. Displayed data | Saved products and saved suppliers lists; items no longer public show "This listing is no longer available." |
| 7. Buttons and actions | Primary: Open item · Secondary: Remove |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · Saved date · — |
| 9. Validation rules | Saved-items limit error. |
| 10. API dependencies | GET/POST/DELETE /marketplace/saved/products\|suppliers |
| Database entities | saved_items |
| Source files | apps/web/src/app/[locale]/saved/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No saved products and suppliers yet." with a one-line explanation and the action "Open item". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Rules enforced by the server: Saved-items limit error. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Segmented control Products / Suppliers. |
| 17. Desktop layout (1440px) | Two sections stacked. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Remove is immediate (no confirmation). |
| Related screens | PUB-07, PUB-10 |
| Dependencies and decisions | A12 |

Form fields:

  - None

### PUB-12 · Product comparison

| Item | Specification |
|---|---|
| Screen ID | PUB-12 |
| Screen name | Product comparison |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Email-verified user |
| Route / URL | `/{locale}/compare` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Compare up to 4 products side by side. |
| 2. Navigation location | Sub-nav Compare |
| 3. User permissions | Email-verified only. |
| 4. Screen layout | Public header (signed-in variant with account menu) and footer. Page header (title, status badge, primary action). Content: Comparison table with sticky first column, remove per column, empty state "Add up to 4 products to compare them side by side.". |
| 5. Components | Comparison table with sticky first column, remove per column, empty state "Add up to 4 products to compare them side by side." |
| 6. Displayed data | Per product: image, title, category, supplier, price summary, MOQ, mode, stock, lead time, dispatch days, materials, dimensions, origin, certifications, attributes. |
| 7. Buttons and actions | Primary: Open product · Secondary: Remove from comparison |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · Added order · — |
| 9. Validation rules | Max 4. |
| 10. API dependencies | GET/POST/DELETE /marketplace/compare |
| Database entities | comparison_items |
| Source files | apps/web/src/app/[locale]/compare/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Horizontal scroll with sticky label column, or swipeable product cards with aligned rows. |
| 17. Desktop layout (1440px) | Up to 4 columns. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Limit 4 enforced server-side (409 compare_limit). |
| Related screens | PUB-07 |
| Dependencies and decisions | A12 |

Form fields:

  - None

### PUB-13 · Recently viewed

| Item | Specification |
|---|---|
| Screen ID | PUB-13 |
| Screen name | Recently viewed |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Email-verified user |
| Route / URL | `/{locale}/recent` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Return to products viewed recently (last 30). |
| 2. Navigation location | Sub-nav Recently viewed |
| 3. User permissions | Email-verified only. |
| 4. Screen layout | Public header (signed-in variant with account menu) and footer. Page header (title, status badge, primary action). Content: Product card grid, Clear history button, empty state. |
| 5. Components | Product card grid, Clear history button, empty state |
| 6. Displayed data | Product cards with viewed time; unavailable items flagged. |
| 7. Buttons and actions | Primary: Open product · Secondary: Clear history |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · Most recent first · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/DELETE /marketplace/recent |
| Database entities | recently_viewed |
| Source files | apps/web/src/app/[locale]/recent/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No recently viewed yet." with a one-line explanation and the action "Open product". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column list. |
| 17. Desktop layout (1440px) | Grid. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Clear history removes all. |
| Related screens | PUB-07 |
| Dependencies and decisions | — |

Form fields:

  - None

### PUB-14 · Marketplace preferences

| Item | Specification |
|---|---|
| Screen ID | PUB-14 |
| Screen name | Marketplace preferences |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Email-verified user |
| Route / URL | `/{locale}/preferences` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Tell the marketplace what you buy to personalise the home page and defaults. |
| 2. Navigation location | Header link Preferences |
| 3. User permissions | Email-verified only. |
| 4. Screen layout | Public header (signed-in variant with account menu) and footer. Page header (title, status badge, primary action). Content: Checkbox grid, radio group, select, save button, success alert "Preferences saved.". |
| 5. Components | Checkbox grid, radio group, select, save button, success alert "Preferences saved." |
| 6. Displayed data | Categories you buy (max 12), preferred emirates, default view (grid/list), default sort. |
| 7. Buttons and actions | Primary: Save · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Categories, Emirates, Default view, Default sort (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Max counts. |
| 10. API dependencies | GET/PATCH /marketplace/preferences |
| Database entities | marketplace_preferences |
| Source files | apps/web/src/app/[locale]/preferences/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Save…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column form. |
| 17. Desktop layout (1440px) | Narrow form container. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Supplier-entered text appears in the language given; if Arabic is missing the English text keeps `dir="ltr"` with the note "Arabic description not provided by the supplier" (FD-18). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Saves per user. |
| Related screens | PUB-01, PUB-04 |
| Dependencies and decisions | — |

Form fields:

  - Categories (checkboxes, Optional): max 12
  - Emirates (checkboxes, Optional): max 7
  - Default view (radio, Optional): GRID, LIST
  - Default sort (select, Optional): 5 sorts

## RFQ and quotation workflows

### SEL-39 · Sample settings (product section)

| Item | Specification |
|---|---|
| Screen ID | SEL-39 |
| Screen name | Sample settings (product section) |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-08` |
| Implementation status | Planned · P1 |
| 1. Purpose | FD-13 / founder section 5: suppliers say whether samples are free, paid or unavailable for each product. |
| 2. Navigation location | Opened from SEL-08 Product editor (content) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Block inside SEL-08 Product editor (content) with its own heading and actions. Content: Radio group, number inputs, textarea. |
| 5. Components | Radio group, number inputs, textarea |
| 6. Displayed data | Samples: Free / Paid (price quoted per request) / Not available; maximum sample quantity; typical sample lead time; note shown to buyers. |
| 7. Buttons and actions | Primary: Save · Secondary: — |
| 8. Form fields | Required: Samples · Optional: Maximum sample quantity, Sample lead time (days), Note to buyers (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Quantity required when offered. |
| 10. API dependencies | PATCH /seller/workspaces/{ws}/products/{id} (+ sample policy) |
| Database entities | products (+ sample_policy) |
| Source files | Not built yet |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Quantity required when offered. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | "Sample settings saved." The "Request a sample" action appears or disappears on the product page. |
| 15. Confirmation dialogs | None. |
| 16. Mobile layout (360px) | Stacked. |
| 17. Desktop layout (1440px) | Section in the product editor. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Buyer: sees "Request a sample" (PUB-07, PUB-10) only when samples are free or paid. |
| Behaviour | Controls the "Request a sample" action on PUB-07 and PUB-10. |
| Related screens | SEL-08, PUB-07, BUY-32 |
| Dependencies and decisions | FD-13 answered (B) |

Form fields:

  - Samples (radio, Required): FREE, PAID, UNAVAILABLE
  - Maximum sample quantity (integer, Optional): 1–1000 when offered
  - Sample lead time (days) (integer, Optional): 1–90
  - Note to buyers (textarea, Optional): ≤ 500 (EN and AR)

### SEL-20 · Quotation requests inbox

| Item | Specification |
|---|---|
| Screen ID | SEL-20 |
| Screen name | Quotation requests inbox |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/rfqs` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Find requests to quote on: invitations and open requests in categories where the seller has public listings. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). Never sees other sellers' quotes. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Scope tabs (All, Invited, Matching, Quoted), search, table/cards, empty state ("No requests here yet."). |
| 5. Components | Scope tabs (All, Invited, Matching, Quoted), search, table/cards, empty state ("No requests here yet.") |
| 6. Displayed data | "Requests you were invited to and open requests in categories where you have public listings."; reference, title, buyer (company shown), category, quantity, deadline, Invited badge, "Your quote" state or "Not quoted". Badge "Sample request" for RFQs of type SAMPLE (FD-13); "Counteroffer waiting" when a buyer counteroffer is open (FD-10). |
| 7. Buttons and actions | Primary: Open request · Secondary: Search; switch scope |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Scope · Deadline / newest · Title or reference |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/rfqs |
| Database entities | rfqs, rfq_invitations, quotes |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/rfqs/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (existing) "No requests here yet." Action: Complete storefront and publish listings in relevant categories. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards with deadline countdown. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: requests come from BUY-03/BUY-07 and sample requests from BUY-32. |
| Behaviour | — |
| Related screens | SEL-21 |
| Dependencies and decisions | A12 |

Form fields:

  - None

### SEL-21 · Request detail (seller)

| Item | Specification |
|---|---|
| Screen ID | SEL-21 |
| Screen name | Request detail (seller) |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/rfqs/[rfqId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Read the buyer's request and manage the seller's own quote. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). Quote actions: seller.catalog.edit. 404 when not visible. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Description list, attachments, quote panel, alerts. |
| 5. Components | Description list, attachments, quote panel, alerts |
| 6. Displayed data | Request summary, specifications, attachments, deadline, own quote panel by state (none, draft, submitted, revision requested, accepted, declined, withdrawn, expired). Sample requests show product, variant, sample quantity, preferences, delivery or collection and required date. Negotiation panel with counteroffers and rounds (SEL-40). |
| 7. Buttons and actions | Primary: Prepare quote / Submit / Revise · Secondary: Ask the buyer a question; Withdraw; download attachment |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/rfqs/{id} |
| Database entities | rfqs, quotes, quote_versions |
| Source files | rfqs/[rfqId]/page.tsx (seller) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (SEL-23, SEL-24, SEL-25); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: SEL-23 Submit quote dialog; SEL-24 Withdraw quote dialog; SEL-25 Ask the buyer a question. |
| 16. Mobile layout (360px) | Stacked. |
| 17. Desktop layout (1440px) | Request left, quote right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: sees questions, quotes and revisions in BUY-05 and BUY-34. |
| Behaviour | — |
| Related screens | SEL-22, SEL-23, SEL-24, SEL-25, SEL-40 |
| Dependencies and decisions | Stale copy seller.quote.accepted_body (G-27) |

Form fields:

  - None

### SEL-22 · Quote form

| Item | Specification |
|---|---|
| Screen ID | SEL-22 |
| Screen name | Quote form |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Form on SEL-21` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Prepare or revise a quote; server computes totals. |
| 2. Navigation location | Opened from SEL-21 Request detail (seller) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Block inside SEL-21 Request detail (seller) with its own heading and actions. Content: Form, money inputs, number, date-time (Dubai), textarea, tax select, file uploader, preview line. |
| 5. Components | Form, money inputs, number, date-time (Dubai), textarea, tax select, file uploader, preview line |
| 6. Displayed data | "Prepare a draft. The buyer sees it only after you submit."; live preview "Subtotal plus shipping: AED {amount} before tax."; "Tax is calculated by the platform on subtotal plus shipping." Since PR #16 validity defaults to 7 days (min 1, max 90, FD-12). Since PR #14 the VAT rule must match the confirmed VAT status (unconfirmed suppliers cannot submit; unregistered cannot charge standard-rate VAT). Sample mode: price may be 0 for free samples. A revision answering a counteroffer highlights changed fields for the buyer. |
| 7. Buttons and actions | Primary: Save draft · Secondary: Submit quote; Submit revision; Add attachment |
| 8. Form fields | Required: Quantity, Unit price (AED, before tax), Tax treatment, Lead time (days), Valid until (Dubai time), What is offered · Optional: Shipping (AED, before tax), Delivery date, Differences from the request, Terms, Attachments (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Server zod |
| 10. API dependencies | POST /seller/workspaces/{ws}/rfqs/{id}/quote; PATCH /seller/workspaces/{ws}/quotes/{id}; POST /files |
| Database entities | quotes, quote_versions, quote_files |
| Source files | rfqs/[rfqId]/page.tsx (seller) |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: submit (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Single column; preview sticky. |
| 17. Desktop layout (1440px) | Form with preview card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: compares and accepts in BUY-10/BUY-12; changed fields are highlighted in BUY-34. |
| Behaviour | Submitted versions immutable; revision supersedes. |
| Related screens | SEL-21, SEL-23 |
| Dependencies and decisions | Quote validity default (founder 7 days); tax treatment; FD-12 answered (A); P8-10. |

Form fields:

  - Quantity (integer, Required): 1–10,000,000
  - Unit price (AED, before tax) (money, Required): fils
  - Shipping (AED, before tax) (money, Optional): fils
  - Tax treatment (select, Required): STANDARD, ZERO_RATED, EXEMPT
  - Lead time (days) (integer, Required): 0–730
  - Delivery date (date, Optional)
  - Valid until (Dubai time) (datetime, Required): ≤90 days; no default today (founder: 7 days)
  - What is offered (textarea, Required)
  - Differences from the request (textarea, Optional): ≤2000
  - Terms (textarea, Optional): ≤3000
  - Attachments (file, Optional): PDF/PNG/JPEG ≤10 MB

### SEL-23 · Submit quote dialog

| Item | Specification |
|---|---|
| Screen ID | SEL-23 |
| Screen name | Submit quote dialog |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-21` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Confirm submission. |
| 2. Navigation location | Opened from SEL-21 Request detail (seller) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Dialog over SEL-21 Request detail (seller): title, context text, fields, footer with secondary action then primary action. Content: Confirm dialog. |
| 5. Components | Confirm dialog |
| 6. Displayed data | "The buyer will see these figures. A submitted version cannot be changed; you can submit a revision while the request is open." |
| 7. Buttons and actions | Primary: Submit quote · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /seller/workspaces/{ws}/quotes/{id}/submit \| /revise |
| Database entities | quote_versions |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Submit quote…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Submit quote" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: notified of the new quote or revision (BUY-05). |
| Behaviour | — |
| Related screens | SEL-22 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-24 · Withdraw quote dialog

| Item | Specification |
|---|---|
| Screen ID | SEL-24 |
| Screen name | Withdraw quote dialog |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-21` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Withdraw before acceptance. |
| 2. Navigation location | Opened from SEL-21 Request detail (seller) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Dialog over SEL-21 Request detail (seller): title, context text, fields, footer with secondary action then primary action. Content: Destructive confirm. |
| 5. Components | Destructive confirm |
| 6. Displayed data | "The buyer will be told. You cannot quote on this request again." |
| 7. Buttons and actions | Primary: Withdraw · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /seller/workspaces/{ws}/quotes/{id}/withdraw |
| Database entities | quotes |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Withdraw…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Withdraw" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: quote shows Withdrawn in BUY-05/BUY-10. |
| Behaviour | — |
| Related screens | SEL-21 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-25 · Ask the buyer a question

| Item | Specification |
|---|---|
| Screen ID | SEL-25 |
| Screen name | Ask the buyer a question |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-21` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Start an RFQ-linked conversation. |
| 2. Navigation location | Opened from SEL-21 Request detail (seller) |
| 3. User permissions | Messaging roles (OWNER, SALES) |
| 4. Screen layout | Dialog over SEL-21 Request detail (seller): title, context text, fields, footer with secondary action then primary action. Content: Dialog with textarea. |
| 5. Components | Dialog with textarea |
| 6. Displayed data | "Only the buyer sees this conversation." |
| 7. Buttons and actions | Primary: Send · Secondary: Cancel |
| 8. Form fields | Required: Message · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /workspaces/{ws}/conversations |
| Database entities | conversations, messages |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Send…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Send" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: question appears on BUY-05. |
| Behaviour | — |
| Related screens | MSG-02 |
| Dependencies and decisions | — |

Form fields:

  - Message (textarea, Required): ≤4000

### SEL-40 · Respond to a counteroffer

| Item | Specification |
|---|---|
| Screen ID | SEL-40 |
| Screen name | Respond to a counteroffer |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-21` |
| Implementation status | Planned · P0 |
| 1. Purpose | FD-10: the supplier sees the buyer's structured counteroffer and answers with a new revision (accepting or adjusting the proposed terms) or declines. Three rounds at most. |
| 2. Navigation location | Opened from SEL-21 Request detail (seller) |
| 3. User permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| 4. Screen layout | Block inside SEL-21 Request detail (seller) with its own heading and actions. Content: Comparison card, "Create revision from counteroffer" (prefills SEL-22), decline dialog with reason. |
| 5. Components | Comparison card, "Create revision from counteroffer" (prefills SEL-22), decline dialog with reason |
| 6. Displayed data | Counteroffer round {n} of 3: proposed unit price, quantity, delivery date, customisation changes, notes, compared with the current revision; buyer company (anonymised only on public pages, never here); expiry of the current revision. |
| 7. Buttons and actions | Primary: Create revision · Secondary: Decline counteroffer |
| 8. Form fields | Required: — · Optional: Decline reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Round must be open; RFQ open. |
| 10. API dependencies | New: GET /seller/workspaces/{ws}/quotes/{id}/negotiation; POST …/counteroffers/{cid}/decline |
| Database entities | quote_counteroffers, quote_versions |
| Source files | Not built yet (C-14) |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Hidden when no counteroffer is open. |
| 13. Error states | "The buyer withdrew or the request closed." / "This round is no longer open." |
| 14. Success state | Revision: "Revision submitted. The buyer can see what changed." Decline: "Counteroffer declined. Your current revision stays open until it expires." |
| 15. Confirmation dialogs | Decline opens a confirm with reason. Creating a revision uses the SEL-22 submit confirmation. |
| 16. Mobile layout (360px) | Comparison stacked. |
| 17. Desktop layout (1440px) | Comparison card above the quote form. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Buyer: sent it from BUY-15 and sees the answer in BUY-34. |
| Behaviour | A new revision supersedes the previous one and highlights changes for the buyer (BUY-34); declining keeps the current revision open until it expires. |
| Related screens | SEL-21, SEL-22, BUY-15, BUY-34 |
| Dependencies and decisions | FD-10 answered (C); C-14 |

Form fields:

  - Decline reason (textarea, Optional): ≤ 1000

### SEL-26 · Quotes list (seller)

| Item | Specification |
|---|---|
| Screen ID | SEL-26 |
| Screen name | Quotes list (seller) |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/quotes` |
| Implementation status | Implemented · P1 |
| 1. Purpose | All own quotes and their states. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Table, filter, badges, empty state ("You have not quoted yet."). |
| 5. Components | Table, filter, badges, empty state ("You have not quoted yet.") |
| 6. Displayed data | Request, buyer, version, total, valid until, state. |
| 7. Buttons and actions | Primary: Open request · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State · Newest · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/quotes |
| Database entities | quotes |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/quotes/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No quotes list yet." with a one-line explanation and the action "Open request". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: accept or decline decisions in BUY-12/BUY-14. |
| Behaviour | — |
| Related screens | SEL-21 |
| Dependencies and decisions | — |

Form fields:

  - None

## Order management

### SEL-27 · Orders list (seller)

| Item | Specification |
|---|---|
| Screen ID | SEL-27 |
| Screen name | Orders list (seller) |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/orders` |
| Implementation status | Implemented · P0 |
| 1. Purpose | All orders received. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Filter, table, badges, empty state ("No orders yet."). |
| 5. Components | Filter, table, badges, empty state ("No orders yet.") |
| 6. Displayed data | "Orders appear when a buyer checks out or accepts your quotation."; number, buyer, source, created, total, state. Badge "Cancellation requested" for open buyer requests (BUY-31) and "Cancellation pending" for supplier cancellations. |
| 7. Buttons and actions | Primary: Open order · Secondary: Filter; load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State · Newest · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/orders |
| Database entities | orders |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/orders/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (existing) "No orders yet." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: same orders in BUY-23. |
| Behaviour | — |
| Related screens | SEL-28 |
| Dependencies and decisions | — |

Form fields:

  - None

### SEL-28 · Order detail (seller)

| Item | Specification |
|---|---|
| Screen ID | SEL-28 |
| Screen name | Order detail (seller) |
| Experience | Manufacturers and suppliers |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/orders/[orderId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Fulfil the order and see what will be paid out. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). Actions: seller.inventory.ship. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Status header, alert, lines table, totals with commission rows, fulfilment panel, settlement badge, timeline, action bar. |
| 5. Components | Status header, alert, lines table, totals with commission rows, fulfilment panel, settlement badge, timeline, action bar |
| 6. Displayed data | State, next step ("Do not dispatch until the order is confirmed." etc.), lines, totals, platform commission, payable to supplier, settlement state, delivery address, fulfilment panel, "All ordered quantities ship together in one shipment.", payout note, disputes, timeline. Since PR #13: delivery verified and dispute window lines; settlement "Not yet eligible / Held / Eligible". Since PR #14: invoice draft with commission draft (rate, policy version; VAT on commission pending advice). Since PR #17: "Cancel order" for Confirmed/Processing orders (SEL-36) and pending notice. Planned: buyer cancellation request review (SEL-41), delivery method snapshot and collection details (FD-08). |
| 7. Buttons and actions | Primary: Start processing / Record dispatch / Report delivery (by state) · Secondary: Download proof; open dispute; message buyer |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/orders/{id}; POST /process |
| Database entities | orders, order_lines, shipments, settlements |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/orders/[orderId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (SEL-29, SEL-30, SEL-31, SEL-36, SEL-41); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: SEL-29 Record dispatch dialog; SEL-30 Report delivery dialog; SEL-31 Open dispute (seller); SEL-36 Supplier order cancellation; SEL-41 Review a buyer cancellation request. |
| 16. Mobile layout (360px) | Status + next step first; sticky action. |
| 17. Desktop layout (1440px) | Main + right summary. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: sees each fulfilment step on BUY-24 and can confirm receipt, dispute or request cancellation; Platform administrator: holds, refunds and delivery review (ADM-29, ADM-57, ADM-59). |
| Behaviour | — |
| Related screens | SEL-29, SEL-30, SEL-31, SEL-36, SEL-41, BUY-37 |
| Dependencies and decisions | Commission policy versioned and snapshotted per order (PR #13, P8-6); FD-08, FD-09 answered |

Form fields:

  - None

### SEL-29 · Record dispatch dialog

| Item | Specification |
|---|---|
| Screen ID | SEL-29 |
| Screen name | Record dispatch dialog |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Dialog on SEL-28` |
| Implementation status | Partial · P0 |
| 1. Purpose | Record full shipment. |
| 2. Navigation location | Opened from SEL-28 Order detail (seller) |
| 3. User permissions | Seller OWNER or WAREHOUSE (seller.inventory.ship); trading-gated. Paid orders only. |
| 4. Screen layout | Dialog over SEL-28 Order detail (seller): title, context text, fields, footer with secondary action then primary action. Content: Dialog form. |
| 5. Components | Dialog form |
| 6. Displayed data | Order lines summary. C-10 (being built): proof of dispatch file and tracking reference become required for courier deliveries; collection orders record "Collected by buyer" instead. |
| 7. Buttons and actions | Primary: Record dispatch · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Carrier, Tracking reference, Expected delivery (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /seller/workspaces/{ws}/orders/{id}/dispatch |
| Database entities | shipments, orders |
| Source files | orders/[orderId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Record dispatch…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Record dispatch" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: order shows Dispatched with tracking on BUY-24. |
| Behaviour | — |
| Related screens | SEL-28 |
| Dependencies and decisions | —; FD-08; C-10. |

Form fields:

  - Carrier (text, Optional)
  - Tracking reference (text, Optional)
  - Expected delivery (date, Optional)

### SEL-30 · Report delivery dialog

| Item | Specification |
|---|---|
| Screen ID | SEL-30 |
| Screen name | Report delivery dialog |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Dialog on SEL-28` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Report delivery with optional proof. |
| 2. Navigation location | Opened from SEL-28 Order detail (seller) |
| 3. User permissions | Seller OWNER or WAREHOUSE (seller.inventory.ship); trading-gated. |
| 4. Screen layout | Dialog over SEL-28 Order detail (seller): title, context text, fields, footer with secondary action then primary action. Content: Dialog with textarea and file. |
| 5. Components | Dialog with textarea and file |
| 6. Displayed data | Proof rules. Since PR #13 (P8-1): reporting delivery with a clean proof file verifies delivery and starts the 14-day window; without proof nothing starts until the buyer confirms receipt. FD-03: proof is validated and contested or suspicious claims go to admin review (ADM-59). |
| 7. Buttons and actions | Primary: Report delivery · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Delivery note, Proof of delivery (PDF, PNG or JPEG) (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /seller/workspaces/{ws}/orders/{id}/deliver |
| Database entities | shipments, files |
| Source files | orders/[orderId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Report delivery…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Report delivery" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Buyer: delivery verified and the window end shown on BUY-24; Platform administrator: contested or suspicious proof reviewed in ADM-59. |
| Behaviour | — |
| Related screens | SEL-28 |
| Dependencies and decisions | FD-03 answered (A); P8-1 |

Form fields:

  - Delivery note (textarea, Optional)
  - Proof of delivery (PDF, PNG or JPEG) (file, Optional): ≤10 MB, scanned

### SEL-31 · Open dispute (seller)

| Item | Specification |
|---|---|
| Screen ID | SEL-31 |
| Screen name | Open dispute (seller) |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Dialog on SEL-28` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Seller can open a dispute on an order. |
| 2. Navigation location | Opened from SEL-28 Order detail (seller) |
| 3. User permissions | Seller OWNER or WAREHOUSE (seller.inventory.ship); trading-gated. |
| 4. Screen layout | Dialog over SEL-28 Order detail (seller): title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | Type and reason. |
| 7. Buttons and actions | Primary: Open a dispute · Secondary: Cancel |
| 8. Form fields | Required: Problem, What happened? · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /seller/workspaces/{ws}/orders/{id}/disputes |
| Database entities | disputes |
| Source files | orders/[orderId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Open a dispute…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Open a dispute" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: responds in SHR-02; Platform administrator: decides in ADM-39. |
| Behaviour | — |
| Related screens | SHR-02 |
| Dependencies and decisions | — |

Form fields:

  - Problem (select, Required): 6 types
  - What happened? (textarea, Required): ≤2000

### SEL-36 · Supplier order cancellation

| Item | Specification |
|---|---|
| Screen ID | SEL-36 |
| Screen name | Supplier order cancellation |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, WAREHOUSE |
| Route / URL | `Dialog on SEL-28` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Supplier cancels a paid order that has not been dispatched; this requests a full refund that a finance approver decides (P8-14, PR #17). |
| 2. Navigation location | Opened from SEL-28 Order detail (seller) |
| 3. User permissions | Seller OWNER or WAREHOUSE (seller.inventory.ship); trading-gated. |
| 4. Screen layout | Dialog over SEL-28 Order detail (seller): title, context text, fields, footer with secondary action then primary action. Content: Danger dialog with reason textarea. |
| 5. Components | Danger dialog with reason textarea |
| 6. Displayed data | Title "Cancel order {number}?"; body "The buyer is refunded in full to the original payment method once finance approves. You can no longer process or dispatch this order while the cancellation is pending." |
| 7. Buttons and actions | Primary: Cancel order · Secondary: Keep order |
| 8. Form fields | Required: Reason for the buyer · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Order Confirmed or Processing; no pending cancellation ("A cancellation is pending for this order."). |
| 10. API dependencies | POST /seller/workspaces/{ws}/orders/{id}/cancel |
| Database entities | orders, refunds, order_events |
| Source files | apps/web/src/components/fulfilment-ui.tsx; apps/api/src/fulfilment/fulfilment.service.ts |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Cancel order…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Order Confirmed or Processing; no pending cancellation ("A cancellation is pending for this order."). Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Cancellation requested on {date}: {reason}. A full refund is awaiting finance approval." / "Cancelled by the supplier (refunded in full)". |
| 15. Confirmation dialogs | This screen is the confirmation step ("Cancel order" / "Keep order"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Buyer: sees "The supplier asked to cancel this order…" on BUY-24; Platform administrator: finance approver approves or rejects the full refund (ADM-32, ADM-34). |
| Behaviour | Order shows "Cancellation requested on {date}: {reason}. A full refund is awaiting finance approval."; buyer notified; finance approves (order Cancelled, reason "Cancelled by the supplier (refunded in full)") or rejects (fulfilment continues). |
| Related screens | SEL-28, BUY-31 |
| Dependencies and decisions | P8-14 (approved Q12); FD-09 |

Form fields:

  - Reason for the buyer (textarea, Required): required, ≤ 1000

### SEL-41 · Review a buyer cancellation request

| Item | Specification |
|---|---|
| Screen ID | SEL-41 |
| Screen name | Review a buyer cancellation request |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, WAREHOUSE (proposed: same capability as supplier cancellation) |
| Route / URL | `Dialog on SEL-28` |
| Implementation status | Planned · P0 |
| 1. Purpose | Founder Q12: the supplier reviews a buyer's cancellation request before dispatch. Ready stock: accept to request a full refund. Custom or made-to-order: consider production status, accepted quotation terms, disclosed policy and committed costs; never an automatic refund. |
| 2. Navigation location | Opened from SEL-28 Order detail (seller) |
| 3. User permissions | Seller OWNER or WAREHOUSE (seller.inventory.ship); trading-gated. |
| 4. Screen layout | Dialog over SEL-28 Order detail (seller): title, context text, fields, footer with secondary action then primary action. Content: Dialog with decision radio (Accept and request refund / Accept with deduction for committed costs / Decline), money input, reason textarea, attachment. |
| 5. Components | Dialog with decision radio (Accept and request refund / Accept with deduction for committed costs / Decline), money input, reason textarea, attachment |
| 6. Displayed data | Buyer reason and details, order type, production status, policy snapshot, amounts captured; for custom orders an optional "committed costs" amount with evidence. |
| 7. Buttons and actions | Primary: Send decision · Secondary: Cancel |
| 8. Form fields | Required: Decision, Reason for the buyer · Optional: Committed costs (AED), Evidence (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Order still undispatched; request open. |
| 10. API dependencies | New: POST /seller/workspaces/{ws}/orders/{id}/cancellation-requests/{rid}/decide |
| Database entities | order_cancellation_requests, refunds |
| Source files | Not built yet |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Send decision…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | "This order has already been dispatched." / "This request has already been decided." / "Committed costs cannot exceed the merchandise amount paid." |
| 14. Success state | "Decision sent to the buyer." Accepted: "A refund request was created. Finance will review it." Order timeline updated. |
| 15. Confirmation dialogs | This dialog is the confirmation; for Decline the reason is shown to the buyer. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Buyer: request from BUY-31, outcome on BUY-24; Platform administrator: finance requester/approver pair decides the refund (ADM-32, ADM-34). |
| Behaviour | Accept creates a refund request (supplier as requester) that a finance approver decides; decline notifies the buyer with the reason; every decision is audited. |
| Related screens | SEL-28, BUY-31, ADM-32, ADM-34 |
| Dependencies and decisions | Founder Q12; FD-09 answered (A) |

Form fields:

  - Decision (radio, Required): ACCEPT_FULL, ACCEPT_PARTIAL, DECLINE
  - Committed costs (AED) (money, Optional): required for partial; ≤ captured merchandise
  - Evidence (file, Optional): PDF/PNG/JPEG ≤ 10 MB, scanned
  - Reason for the buyer (textarea, Required): ≤ 1000

### SEL-37 · Returns handling

| Item | Specification |
|---|---|
| Screen ID | SEL-37 |
| Screen name | Returns handling |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/returns (proposed)` |
| Implementation status | Planned · P2 |
| 1. Purpose | Founder asked for a provisional returns policy; there is no returns flow (disputes cover refunds only). |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | Seller roles |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: List, detail, dialogs. |
| 5. Components | List, detail, dialogs |
| 6. Displayed data | Return request, items, reason, status, refund. |
| 7. Buttons and actions | Primary: Approve return · Secondary: Reject; record received |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | New returns |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | Confirm in a dialog before: approve, reject (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SHR-02 |
| Dependencies and decisions | Returns policy (legal); PR #17 added storefront return policy text; a returns workflow stays planned (FD-09: disputes cover damaged, wrong, short or missing goods). |

Form fields:

  - None

### SEL-38 · Production milestones (made to order)

| Item | Specification |
|---|---|
| Screen ID | SEL-38 |
| Screen name | Production milestones (made to order) |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Section of SEL-28 (proposed)` |
| Implementation status | Recommended · P2 |
| 1. Purpose | Share progress on long lead-time made-to-order orders (e.g. materials sourced, production started, QC passed). Only order state PROCESSING exists today. |
| 2. Navigation location | Opened from SEL-28 Order detail (seller) |
| 3. User permissions | seller.inventory.ship |
| 4. Screen layout | Block inside SEL-28 Order detail (seller) with its own heading and actions. Content: Timeline editor. |
| 5. Components | Timeline editor |
| 6. Displayed data | Milestones with dates and notes visible to buyer. |
| 7. Buttons and actions | Primary: Add milestone · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | New order_milestones |
| Source files | — |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Hidden when there is nothing to show, unless stated otherwise in the purpose. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: BUY-24 Order detail (buyer) |
| Behaviour | — |
| Related screens | SEL-28, BUY-24 |
| Dependencies and decisions | — |

Form fields:

  - None

## Financial workflows

### SEL-32 · Seller finance

| Item | Specification |
|---|---|
| Screen ID | SEL-32 |
| Screen name | Seller finance |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, FINANCE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/finance` |
| Implementation status | Implemented · P0 |
| 1. Purpose | See paid order value, commission, refunds, net payable and settlement buckets; payouts list. Sandbox only. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | seller.finance (OWNER, FINANCE). |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: KPI tiles, settlement bucket list, payouts table, sandbox banner, empty state ("No payouts yet."). |
| 5. Components | KPI tiles, settlement bucket list, payouts table, sandbox banner, empty state ("No payouts yet.") |
| 6. Displayed data | Paid order value, platform commission, refunded to buyers, net payable; Not yet eligible (awaiting receipt), Eligible for payout, Held by disputes, In payout, Paid out; payouts table; sandbox notice. Since PR #13: "Not yet eligible (awaiting verified delivery and the end of the dispute window)", "Held (dispute, hold, reconciliation or pending refund)"; payouts are weekly (Monday 10:00 Dubai, FD-04), one per supplier per week, approved by a second finance user. |
| 7. Buttons and actions | Primary: — · Secondary: Open payout / order |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /seller/workspaces/{ws}/finance |
| Database entities | settlements, payouts, ledger_entries |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/finance/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | (existing) "No payouts yet." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | Confirm in a dialog before: payout (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Tiles 2-up. |
| 17. Desktop layout (1440px) | Tiles row + table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: weekly payout run, requests and approvals (ADM-35, ADM-36, ADM-37); holds (ADM-57). |
| Behaviour | — |
| Related screens | SEL-28, SEL-33, SEL-34 |
| Dependencies and decisions | P8-5 weekly payout run (PR #13); FD-04 answered; FD-05 commission notice |

Form fields:

  - None

### SEL-34 · Statements and commission invoices

| Item | Specification |
|---|---|
| Screen ID | SEL-34 |
| Screen name | Statements and commission invoices |
| Experience | Manufacturers and suppliers |
| User roles | Seller OWNER, FINANCE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/finance/statements (proposed)` |
| Implementation status | Blocked · P1 |
| 1. Purpose | Weekly payout statements and platform commission invoices (founder: platform invoices suppliers for commission). Needs tax approval. |
| 2. Navigation location | Seller centre sub-nav |
| 3. User permissions | seller.finance |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the seller centre sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Table, download. |
| 5. Components | Table, download |
| 6. Displayed data | Period, gross, commission, VAT on commission, refunds, net, payout reference. |
| 7. Buttons and actions | Primary: Download statement · Secondary: Filter period |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Period · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | New statements, invoices |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: tax configuration (ADM-50) and commission policy (ADM-56). |
| Behaviour | — |
| Related screens | SEL-32 |
| Dependencies and decisions | Tax approval; D06 |

Form fields:

  - None

## Notifications and communication

### ACC-14 · Notification centre

| Item | Specification |
|---|---|
| Screen ID | ACC-14 |
| Screen name | Notification centre |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | All company users |
| Route / URL | `/{locale}/app/notifications` |
| Implementation status | Implemented · P0 |
| 1. Purpose | In-app list of events with links to the resource. |
| 2. Navigation location | Header badge (refreshes every 60 s) |
| 3. User permissions | Own notifications |
| 4. Screen layout | Workspace shell (top bar); messages use a two-pane layout on desktop. Page header (title, status badge, primary action). Content: Notification list item, filter toggle, Mark all as read, empty state "You have no notifications.". |
| 5. Components | Notification list item, filter toggle, Mark all as read, empty state "You have no notifications." |
| 6. Displayed data | Notification rows (type text with parameters, time, unread marker), unread count, unread-only filter. |
| 7. Buttons and actions | Primary: Open notification target · Secondary: Mark as read; Mark all as read; Unread only |
| 8. Form fields | Required: — · Optional: Unread only (details below) |
| Filters · sorting · search | Unread only · Newest first · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /notifications; POST /notifications/{id}/read; POST /notifications/read-all; GET /notifications/unread |
| Database entities | notifications |
| Source files | app/notifications/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Open notification target…" and is disabled. |
| 12. Empty state | (existing) "You have no notifications." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-width list. |
| 17. Desktop layout (1440px) | List in narrow container; dropdown preview recommended. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Opening marks read; links only to internal /app paths. |
| Related screens | MSG-01 |
| Dependencies and decisions | —; FD-20: email and in-app only; no SMS or WhatsApp. |

Form fields:

  - Unread only (toggle, Optional)

### MSG-01 · Conversations list

| Item | Specification |
|---|---|
| Screen ID | MSG-01 |
| Screen name | Conversations list |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Buyer OWNER/PROCUREMENT; seller OWNER/SALES |
| Route / URL | `/{locale}/app/messages/[workspaceId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | All buyer↔supplier conversations of the workspace with unread counts. |
| 2. Navigation location | Header Messages with unread badge |
| 3. User permissions | messaging capability (OWNER, PROCUREMENT, SALES); viewers and other roles have no messages. |
| 4. Screen layout | Workspace shell (top bar); messages use a two-pane layout on desktop. Page header (title, status badge, primary action). Content: Conversation list item, unread badge, empty state ("No conversations yet. Message a supplier from their storefront or a quote." / seller variant). |
| 5. Components | Conversation list item, unread badge, empty state ("No conversations yet. Message a supplier from their storefront or a quote." / seller variant) |
| 6. Displayed data | Counterpart company, linked RFQ (number, title), last message preview, time, unread count; privacy note. |
| 7. Buttons and actions | Primary: Open conversation · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — (recommended: unread, RFQ-linked) · Last message time · — (recommended) |
| 9. Validation rules | — |
| 10. API dependencies | GET /workspaces/{ws}/conversations |
| Database entities | conversations, messages, read_receipts |
| Source files | app/messages/[workspaceId]/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No conversations list yet." with a one-line explanation and the action "Open conversation". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-width list; thread opens as a new page. |
| 17. Desktop layout (1440px) | Two-pane: list left, thread right (recommended). |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer and supplier on each side of a conversation; Platform administrator: no access to message content except through a support or dispute case. |
| Behaviour | Refreshes while open. |
| Related screens | MSG-02 |
| Dependencies and decisions | P3-6 |

Form fields:

  - None

### MSG-02 · Conversation thread

| Item | Specification |
|---|---|
| Screen ID | MSG-02 |
| Screen name | Conversation thread |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Buyer OWNER/PROCUREMENT; seller OWNER/SALES |
| Route / URL | `/{locale}/app/messages/[workspaceId]/[conversationId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Read and send text messages; RFQ context shown. |
| 2. Navigation location | Back to list |
| 3. User permissions | Participants only; sending is trading-gated (approved company). |
| 4. Screen layout | Workspace shell (top bar); messages use a two-pane layout on desktop. Page header (title, status badge, primary action). Content: Chat message bubbles (bidi-isolated), composer textarea, send button, load-older button, info alert. |
| 5. Components | Chat message bubbles (bidi-isolated), composer textarea, send button, load-older button, info alert |
| 6. Displayed data | Messages with sender name, side, time; "Load earlier messages"; composer; blocked reason when sending is not allowed. |
| 7. Buttons and actions | Primary: Send · Secondary: Load earlier messages; open linked RFQ |
| 8. Form fields | Required: Your message · Optional: — (details below) |
| Filters · sorting · search | — · Chronological · — |
| 9. Validation rules | error.messages.counterpart_unavailable; trading errors |
| 10. API dependencies | GET/POST /workspaces/{ws}/conversations/{id}/messages; POST …/read; GET …/{id} |
| Database entities | messages, read_receipts |
| Source files | app/messages/[workspaceId]/[conversationId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Send…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: error.messages.counterpart_unavailable; trading errors Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Composer pinned above keyboard. |
| 17. Desktop layout (1440px) | Right pane. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | The other company in the conversation sees new messages in real time and gets an in-app notification. |
| Behaviour | 15-second polling while open; read marker moves forward. |
| Related screens | MSG-01 |
| Dependencies and decisions | P3-6 |

Form fields:

  - Your message (textarea, Required): 1–4000; 60 messages per user per minute

### MSG-04 · Message attachments

| Item | Specification |
|---|---|
| Screen ID | MSG-04 |
| Screen name | Message attachments |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Messaging roles |
| Route / URL | `Part of MSG-02` |
| Implementation status | Planned · P1 |
| 1. Purpose | Attach files to messages (column reserved; not built). |
| 2. Navigation location | — |
| 3. User permissions | Participants |
| 4. Screen layout | Block inside MSG-02 Conversation thread with its own heading and actions. Content: File upload in composer, attachment chip. |
| 5. Components | File upload in composer, attachment chip |
| 6. Displayed data | Attachment chip with name, size, scan state. |
| 7. Buttons and actions | Primary: Attach file · Secondary: Remove |
| 8. Form fields | Required: — · Optional: File (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Type, size |
| 10. API dependencies | Not built |
| Database entities | messages.file_id (reserved), files (MESSAGE_ATTACHMENT) |
| Source files | — |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Attach icon in composer. |
| 17. Desktop layout (1440px) | Attach icon in composer. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Scan before availability. |
| Related screens | MSG-02 |
| Dependencies and decisions | — |

Form fields:

  - File (file, Optional): PDF/PNG/JPEG, scanned, private

## Customer support and disputes

### SHR-01 · Disputes list

| Item | Specification |
|---|---|
| Screen ID | SHR-01 |
| Screen name | Disputes list |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Buyer and seller workspace members |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/disputes and /{locale}/app/seller/[workspaceId]/disputes` |
| Implementation status | Implemented · P0 |
| 1. Purpose | All disputes on the workspace's orders. |
| 2. Navigation location | Buyer or seller sub-nav › Disputes |
| 3. User permissions | Any member of the workspace. |
| 4. Screen layout | Workspace shell of the current workspace (buyer or seller sub-nav). Page header (title, status badge, primary action). Content: Table/cards, status badge, empty state ("No disputes."). |
| 5. Components | Table/cards, status badge, empty state ("No disputes.") |
| 6. Displayed data | Dispute number, order, type, state badge, opened by, opened date. |
| 7. Buttons and actions | Primary: Open dispute · Secondary: Filter by state |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State (6 dispute states) · Newest · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /buyer/workspaces/{ws}/disputes; GET /seller/workspaces/{ws}/disputes |
| Database entities | disputes |
| Source files | app/buyer/[workspaceId]/disputes/page.tsx; app/seller/[workspaceId]/disputes/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (existing) "No disputes." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SHR-02 |
| Dependencies and decisions | — |

Form fields:

  - None

### SHR-02 · Dispute detail

| Item | Specification |
|---|---|
| Screen ID | SHR-02 |
| Screen name | Dispute detail |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Buyer and seller workspace members |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/disputes/[disputeId] and /{locale}/app/seller/[workspaceId]/disputes/[disputeId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Exchange messages and evidence with the other party and platform support; see the proposed resolution. |
| 2. Navigation location | Buyer or seller sub-nav → Disputes / Support |
| 3. User permissions | Read: any member. Post: buyer.orders.act or seller.inventory.ship. |
| 4. Screen layout | Workspace shell of the current workspace (buyer or seller sub-nav). Page header (title, status badge, primary action). Content: Status header, message thread, evidence file chip with scan state, composer with file input, resolution card. |
| 5. Components | Status header, message thread, evidence file chip with scan state, composer with file input, resolution card |
| 6. Displayed data | Dispute number, state, type, order link, opened by, "Payout for this order is held while the dispute is open.", messages and evidence with author side (Buyer/Supplier/Platform support/System), proposed resolution (No financial action / Refund + amount), refunds, closed note. |
| 7. Buttons and actions | Primary: Send · Secondary: Attach evidence; download evidence; open order |
| 8. Form fields | Required: Message · Optional: Evidence (PDF, PNG or JPEG) (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Length, file type, size |
| 10. API dependencies | GET/POST …/disputes/{id}(/messages); GET …/files/{fileId} |
| Database entities | disputes, dispute_messages, files |
| Source files | disputes/[disputeId]/page.tsx (buyer and seller) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Send…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Length, file type, size Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Thread full screen, composer sticky. |
| 17. Desktop layout (1440px) | Thread left, summary right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer and supplier both respond here; Platform administrator: investigates and decides in ADM-39/ADM-40. |
| Behaviour | Composer hidden when CLOSED. |
| Related screens | SHR-01, BUY-24, SEL-28, ADM-39 |
| Dependencies and decisions | P5-3, P5-4 |

Form fields:

  - Message (textarea, Required): ≤2000 (≤200 messages per dispute)
  - Evidence (PDF, PNG or JPEG) (file, Optional): ≤10 MB, scanned

### SHR-03 · Support tickets list

| Item | Specification |
|---|---|
| Screen ID | SHR-03 |
| Screen name | Support tickets list |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Any workspace member |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/support and /{locale}/app/seller/[workspaceId]/support` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Workspace tickets with the platform team. |
| 2. Navigation location | Buyer or seller sub-nav → Disputes / Support |
| 3. User permissions | Any member; VIEWER cannot create or reply. |
| 4. Screen layout | Workspace shell of the current workspace (buyer or seller sub-nav). Page header (title, status badge, primary action). Content: Table/cards, status badge, empty state ("No tickets yet."). |
| 5. Components | Table/cards, status badge, empty state ("No tickets yet.") |
| 6. Displayed data | Subject, topic, state ("Waiting for you" etc.), updated, linked order/RFQ. |
| 7. Buttons and actions | Primary: New ticket · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State · Recently updated · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /workspaces/{ws}/support |
| Database entities | support_tickets |
| Source files | app/buyer/[workspaceId]/support/page.tsx; app/seller/[workspaceId]/support/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (existing) "No tickets yet." Action: New ticket. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SHR-04, SHR-05 |
| Dependencies and decisions | P6-1 |

Form fields:

  - None

### SHR-04 · New support ticket

| Item | Specification |
|---|---|
| Screen ID | SHR-04 |
| Screen name | New support ticket |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Workspace members except VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/support/new and /{locale}/app/seller/[workspaceId]/support/new` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Open a ticket, optionally linked to an order or RFQ. |
| 2. Navigation location | Buyer or seller sub-nav → Disputes / Support |
| 3. User permissions | Any member except VIEWER; ≤20 open per workspace today (founder: 10 per company). |
| 4. Screen layout | Workspace shell of the current workspace (buyer or seller sub-nav). Page header (title, status badge, primary action). Content: Form, select, text, textarea, linked record select. |
| 5. Components | Form, select, text, textarea, linked record select |
| 6. Displayed data | "Do not include passwords or card details." Since PR #16: categories include Security concern (urgent) and Compliance concern (urgent); "{open} open of {limit} allowed" note; urgent categories are always accepted. |
| 7. Buttons and actions | Primary: Open ticket · Secondary: Cancel |
| 8. Form fields | Required: Topic, Subject, How can we help? · Optional: Linked order, Linked request (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Lengths; open-ticket limit |
| 10. API dependencies | POST /workspaces/{ws}/support |
| Database entities | support_tickets |
| Source files | support/new/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Open ticket…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Lengths; open-ticket limit |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-screen form. |
| 17. Desktop layout (1440px) | Centred form. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: ticket enters the support queue (ADM-42); limit exceptions in ADM-55. |
| Behaviour | — |
| Related screens | SHR-03, SHR-05 |
| Dependencies and decisions | P6-1 vs founder (10 per company) |

Form fields:

  - Topic (select, Required): ACCOUNT, VERIFICATION, ORDER, PAYMENT, RFQ, CATALOG, OTHER
  - Subject (text, Required): ≤160
  - How can we help? (textarea, Required): ≤4000
  - Linked order (select, Optional): own orders
  - Linked request (select, Optional): own RFQs

### SHR-05 · Support ticket detail

| Item | Specification |
|---|---|
| Screen ID | SHR-05 |
| Screen name | Support ticket detail |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Any workspace member |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/support/[ticketId] and /{locale}/app/seller/[workspaceId]/support/[ticketId]` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Converse with support until resolved. |
| 2. Navigation location | Buyer or seller sub-nav → Disputes / Support |
| 3. User permissions | Reply/close/reopen: members except VIEWER. |
| 4. Screen layout | Workspace shell of the current workspace (buyer or seller sub-nav). Page header (title, status badge, primary action). Content: Thread, composer, status header. |
| 5. Components | Thread, composer, status header |
| 6. Displayed data | Subject, topic, state, linked record, messages (customer/agent), resolution note. |
| 7. Buttons and actions | Primary: Send reply · Secondary: Close ticket; Reopen |
| 8. Form fields | Required: Reply · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /workspaces/{ws}/support/{id}; POST /messages, /close, /reopen |
| Database entities | support_tickets, support_messages |
| Source files | support/[ticketId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Send reply…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Opens: SHR-06 Close or reopen ticket dialog. |
| 16. Mobile layout (360px) | Thread full-screen. |
| 17. Desktop layout (1440px) | Thread + summary. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: support staff reply from ADM-43. |
| Behaviour | — |
| Related screens | SHR-03, SHR-06, ADM-43 |
| Dependencies and decisions | P6-2 vs founder (auto-close 7 days) |

Form fields:

  - Reply (textarea, Required): ≤4000 (≤200 messages)

### SHR-06 · Close or reopen ticket dialog

| Item | Specification |
|---|---|
| Screen ID | SHR-06 |
| Screen name | Close or reopen ticket dialog |
| Experience | Business buyers, Manufacturers and suppliers |
| User roles | Workspace members except VIEWER |
| Route / URL | `Dialog on SHR-05` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Close a ticket or reopen a resolved one. |
| 2. Navigation location | Opened from SHR-05 Support ticket detail |
| 3. User permissions | Members except VIEWER |
| 4. Screen layout | Dialog over SHR-05 Support ticket detail: title, context text, fields, footer with secondary action then primary action. Content: Confirm dialog. |
| 5. Components | Confirm dialog |
| 6. Displayed data | Confirmation text. |
| 7. Buttons and actions | Primary: Close ticket / Reopen · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /workspaces/{ws}/support/{id}/close \| /reopen |
| Database entities | support_tickets |
| Source files | support/[ticketId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Close ticket…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Close ticket / Reopen" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | SHR-05 |
| Dependencies and decisions | — |

Form fields:

  - None

## Empty and error states

### SYS-01 · Not found / not available

| Item | Specification |
|---|---|
| Screen ID | SYS-01 |
| Screen name | Not found / not available |
| Experience | Business buyers, Manufacturers and suppliers, Platform administrators |
| User roles | All |
| Route / URL | `Any unknown or inaccessible resource` |
| Implementation status | Implemented · P0 |
| 1. Purpose | One response for missing and forbidden resources so existence is never leaked. |
| 2. Navigation location | — |
| 3. User permissions | — |
| 4. Screen layout | Rendered inside whichever shell the user is in (public, workspace or admin). Page header (title, status badge, primary action). Content: Status page template. |
| 5. Components | Status page template |
| 6. Displayed data | "Not available" — "You do not have access to this page, or it does not exist."; back link. |
| 7. Buttons and actions | Primary: Back · Secondary: Go home |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | 404 responses |
| Database entities | — |
| Source files | components/ui.tsx (NotFound, Forbidden) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Centered. |
| 17. Desktop layout (1440px) | Centered. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | — |
| Related screens | SYS-02 |
| Dependencies and decisions | — |

Form fields:

  - None

### SYS-02 · Error with retry and reference

| Item | Specification |
|---|---|
| Screen ID | SYS-02 |
| Screen name | Error with retry and reference |
| Experience | Business buyers, Manufacturers and suppliers, Platform administrators |
| User roles | All |
| Route / URL | `Any failed load or action` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Recoverable error with request reference. |
| 2. Navigation location | — |
| 3. User permissions | — |
| 4. Screen layout | Rendered inside whichever shell the user is in (public, workspace or admin). Page header (title, status badge, primary action). Content: Error alert, retry button. |
| 5. Components | Error alert, retry button |
| 6. Displayed data | "Something went wrong", message by error key, Reference (request ID), Retry. |
| 7. Buttons and actions | Primary: Retry · Secondary: Contact support |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | Error envelope {code, message_key, field_errors, request_id} |
| Database entities | — |
| Source files | components/ui.tsx (ApiErrorAlert) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Inline. |
| 17. Desktop layout (1440px) | Inline. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Form input kept on failure (T34). |
| Related screens | SYS-01 |
| Dependencies and decisions | — |

Form fields:

  - None

### SYS-03 · Sandbox environment banner

| Item | Specification |
|---|---|
| Screen ID | SYS-03 |
| Screen name | Sandbox environment banner |
| Experience | Business buyers, Manufacturers and suppliers, Platform administrators |
| User roles | All |
| Route / URL | `Global (top of every page)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Make sandbox mode unmistakable: "Sandbox environment: test adapters only. No real payments, and emails go to the local mail catcher." |
| 2. Navigation location | — |
| 3. User permissions | Shown when public config sandbox=true |
| 4. Screen layout | Rendered inside whichever shell the user is in (public, workspace or admin). Page header (title, status badge, primary action). Content: Global banner. |
| 5. Components | Global banner |
| 6. Displayed data | Banner text. |
| 7. Buttons and actions | Primary: — · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /public/config |
| Database entities | — |
| Source files | app/[locale]/layout.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Wraps to 2–3 lines. |
| 17. Desktop layout (1440px) | Single line. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Non-dismissible. |
| Related screens | FIN-01 |
| Dependencies and decisions | — |

Form fields:

  - None

### SYS-04 · Trading unavailable / maintenance

| Item | Specification |
|---|---|
| Screen ID | SYS-04 |
| Screen name | Trading unavailable / maintenance |
| Experience | Business buyers, Manufacturers and suppliers, Platform administrators |
| User roles | All |
| Route / URL | `Recommended` |
| Implementation status | Recommended · P2 |
| 1. Purpose | Explain when checkout or trading is disabled (TRADING_ENABLED off, provider outage) while records stay readable. |
| 2. Navigation location | — |
| 3. User permissions | — |
| 4. Screen layout | Rendered inside whichever shell the user is in (public, workspace or admin). Page header (title, status badge, primary action). Content: Global banner, disabled-button reason text. |
| 5. Components | Global banner, disabled-button reason text |
| 6. Displayed data | Banner/notice, affected actions, what still works. |
| 7. Buttons and actions | Primary: — · Secondary: Request quotation instead |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | viewer.trading.reason = checkout_disabled |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Banner. |
| 17. Desktop layout (1440px) | Banner. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Product page already shows "Ordering is not available right now. You can request a quotation." |
| Related screens | PUB-07, BUY-17 |
| Dependencies and decisions | — |

Form fields:

  - None
