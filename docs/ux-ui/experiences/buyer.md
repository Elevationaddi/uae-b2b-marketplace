# Business buyer experience

> Manufacturers Marketplace (working title). Standalone part of the UX/UI specification (28 November 2026). This document can be handed to a designer on its own: it repeats the full specification of every screen this experience uses, including shared screens. Brand name, logo and typography are not final; use the approved palette and the temporary font (section 28 of the full specification).

## Who this is for

Business buyers are verified UAE companies that source products: they search the marketplace, post requests for quotation and sample requests, negotiate with structured counteroffers, check out with delivery or collection, pay through the platform (sandbox today), track orders, confirm receipt, request cancellation before dispatch, open disputes and support tickets, and follow their monthly spending.

Buyer workspace roles: OWNER (everything, including team and company), PROCUREMENT (purchasing), VIEWER (read-only). Trading actions need an ACTIVE (approved) workspace; otherwise they are shown disabled with the reason.

## Summary

| Measure | Count |
|---|---|
| Screens in this experience | 108 |
| Implemented / Partial / Planned / Recommended / Blocked | 76 / 2 / 11 / 10 / 9 |
| P0 / P1 / P2 | 72 / 28 / 8 |
| Shared with another experience | 68 |


Journeys in section 5 of the full specification that involve this experience: J-01, J-02, J-04, J-08 to J-18, J-20, J-22, J-23, J-24, J-25, J-28, J-29, J-32, J-33.

## Founder decisions that shape this experience

| Decision | Answer | Screens here |
|---|---|---|
| FD-02 | A. Confirm receipt records delivery only. The dispute period remains active. | BUY-24, BUY-25 |
| FD-03 | A. Verified delivery proof or buyer confirmation, whichever is first. Supplier-uploaded evidence must be validated, with a review mechanism for contested or suspicious delivery claims. | BUY-24 |
| FD-06 | A. Disclosed-intermediary model. Tax adviser pending. | BUY-17, BUY-37, BUY-28 |
| FD-07 | A. Stripe Connect remains the preferred candidate. Keep the payment interface provider-independent. No live activation or additional subscription is approved. | FIN-01, FIN-02, BUY-18 |
| FD-08 | A. Support free buyer collection and configurable delivery fees for each emirate. | BUY-35, BUY-36 |
| FD-09 | A. Supplier cancellation, supplier-specific return policies, disputes and buyer cancellation requests before dispatch. | BUY-31 |
| FD-10 | C. Structured counteroffers with a maximum of three rounds per supplier negotiation. | BUY-15, BUY-34, BUY-12 |
| FD-11 | A. Public RFQs are labelled "Matching suppliers" and are visible only to eligible verified suppliers in matching categories. Private RFQs are invitation-only. | BUY-03 |
| FD-12 | A. Default quotation validity of seven days, with a minimum of one day and a maximum of 90 days. | BUY-10 |
| FD-13 | B. Add sample requests as a dedicated RFQ type. Do not create an entirely separate paid sample order module. | BUY-32, PUB-07, PUB-10 |
| FD-14 | A. Retain the existing support limits and urgent exceptions. | SHR-04 |
| FD-15 | A. Public reviews display only "Verified business buyer". Authorized administrators can identify the reviewer where necessary. | PUB-10, BUY-26 |
| FD-16 | A. Versioned clickwrap acceptance at registration and checkout, with re-acceptance after material policy changes. UAE legal adviser pending. | ACC-18, AUTH-03, ACC-06, BUY-17 |
| FD-18 | A. Arabic product listings are optional. Clearly indicate when an Arabic product description has not been provided. The application interface itself must remain fully bilingual. | PUB-07 |
| FD-20 | A. Email and in-app notifications only. No paid SMS or WhatsApp integration. | ACC-13, ACC-14 |
| FD-21 | B. Buyer dashboard should include operational counts and monthly spending analytics in AED. | BUY-01, BUY-33 |


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
| MSG-03 | New message to supplier | Page | Implemented | P1 | Yes |
| MSG-04 | Message attachments | Section | Planned | P1 | Yes |
| SYS-01 | Not found / not available | Page | Implemented | P0 | Yes |
| SYS-02 | Error with retry and reference | Page | Implemented | P0 | Yes |
| SYS-03 | Sandbox environment banner | Page | Implemented | P0 | Yes |
| SYS-04 | Trading unavailable / maintenance | Page | Recommended | P2 | Yes |
| BUY-01 | Buyer dashboard | Page | Planned | P0 |  |
| BUY-33 | Monthly spending (buyer dashboard section) | Section | Planned | P0 |  |
| BUY-02 | Requests for quotation list | Page | Implemented | P0 |  |
| BUY-03 | New request for quotation | Page | Implemented | P0 |  |
| BUY-04 | Request quotation entry (workspace chooser) | Page | Implemented | P1 |  |
| BUY-05 | Request for quotation detail (buyer) | Page | Implemented | P0 |  |
| BUY-06 | Edit request draft | Page | Implemented | P0 |  |
| BUY-07 | Publish request dialog | Dialog | Implemented | P0 |  |
| BUY-08 | Cancel request dialog | Dialog | Implemented | P0 |  |
| BUY-09 | Invite suppliers picker | Section | Implemented | P0 |  |
| BUY-10 | Quote comparison | Section | Implemented | P0 |  |
| BUY-11 | Quote detail and version history | Section | Implemented | P0 |  |
| BUY-34 | Negotiation history and revision changes | Section | Planned | P0 |  |
| BUY-12 | Accept quote dialog | Dialog | Implemented | P0 |  |
| BUY-13 | Request revision dialog | Dialog | Implemented | P0 |  |
| BUY-14 | Decline quote dialog | Dialog | Implemented | P0 |  |
| BUY-15 | Counteroffer to supplier | Dialog | Planned | P0 |  |
| BUY-16 | Cart | Page | Implemented | P0 |  |
| BUY-17 | Checkout | Page | Implemented | P0 |  |
| BUY-35 | Delivery method selection (checkout section) | Section | Planned | P0 |  |
| BUY-18 | Checkout status and payment | Page | Implemented | P0 |  |
| BUY-19 | Cancel checkout dialog | Dialog | Implemented | P0 |  |
| BUY-20 | Delivery addresses | Page | Implemented | P0 |  |
| BUY-21 | Address form | Section | Implemented | P0 |  |
| BUY-22 | Remove address dialog | Dialog | Implemented | P1 |  |
| BUY-23 | Orders list (buyer) | Page | Implemented | P0 |  |
| BUY-24 | Order detail (buyer) | Page | Implemented | P0 |  |
| BUY-36 | Collection instructions (order section) | Section | Planned | P1 |  |
| BUY-37 | Invoice draft (order section) | Section | Implemented | P1 |  |
| BUY-25 | Confirm receipt dialog | Dialog | Implemented | P0 |  |
| BUY-26 | Rate supplier form | Section | Implemented | P1 |  |
| BUY-27 | Open dispute form (buyer) | Dialog | Implemented | P0 |  |
| BUY-28 | Invoices and tax documents (buyer) | Page | Blocked | P1 |  |
| BUY-29 | Payment history (buyer) | Page | Recommended | P2 |  |
| BUY-30 | Reorder | Action | Planned | P2 |  |
| BUY-31 | Request order cancellation (buyer) | Dialog | Planned | P0 |  |
| BUY-32 | Request a sample | Page | Planned | P1 |  |
| SHR-01 | Disputes list | Page | Implemented | P0 | Yes |
| SHR-02 | Dispute detail | Page | Implemented | P0 | Yes |
| SHR-03 | Support tickets list | Page | Implemented | P1 | Yes |
| SHR-04 | New support ticket | Page | Implemented | P1 | Yes |
| SHR-05 | Support ticket detail | Page | Implemented | P1 | Yes |
| SHR-06 | Close or reopen ticket dialog | Dialog | Implemented | P2 | Yes |
| FIN-01 | Sandbox payment page | Page | Implemented | P0 |  |
| FIN-02 | Live payment provider checkout | External page | Blocked | P0 |  |
| FIN-03 | Bank transfer instructions | Page | Blocked | P1 |  |


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

### BUY-01 · Buyer dashboard

| Item | Specification |
|---|---|
| Screen ID | BUY-01 |
| Screen name | Buyer dashboard |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]` |
| Implementation status | Planned · P0 |
| 1. Purpose | FD-21 (founder answer B, 2026-11-28): the buyer dashboard shows operational counts and monthly spending in AED. Buyers land here instead of the generic Home and see what needs action today. |
| 2. Navigation location | Buyer sub-nav: Dashboard (new), Cart, Orders, Disputes, Support, RFQs, New request, Addresses, Messages, Marketplace, Company settings |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). Purchase CTAs hidden for VIEWER and when the workspace is not ACTIVE. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Page header, verification/trading banner, KPI tile (count + link), task list, recent orders table, empty state, skeleton. |
| 5. Components | Page header, verification/trading banner, KPI tile (count + link), task list, recent orders table, empty state, skeleton |
| 6. Displayed data | Action cards with real counts from existing APIs: open RFQs and quotes received (rfqs list), counteroffers answered (planned), payment due before deadline (checkouts PENDING_PAYMENT with pay-by), orders dispatched awaiting receipt (orders DISPATCHED/DELIVERED) with dispute window end dates, open cancellation requests (planned), open disputes, support tickets waiting for you (WAITING_CUSTOMER); recent orders; verification/licence banner; monthly spending in AED (BUY-33) from a new spending endpoint. |
| 7. Buttons and actions | Primary: New request for quotation · Secondary: Browse marketplace; open each task; View all orders |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Period for the spending section (BUY-33) · Tasks by due time (Dubai) · — |
| 9. Validation rules | — |
| 10. API dependencies | Existing: GET /buyer/workspaces/{ws}/rfqs, /orders, /disputes, /workspaces/{ws}/support. New: GET /buyer/workspaces/{ws}/overview (aggregate counts and spend) |
| Database entities | rfqs, quotes, checkouts, orders, disputes, support_tickets |
| Source files | None yet (buyer-shell.tsx holds the sub-nav) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | First visit after approval: "Your company is verified. Search the marketplace or post a request for quotation to get started." Tiles show 0 with their label, never hidden. Spending section shows "No paid orders yet. Spending appears after your first paid order." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Stacked tiles (2-up), task list below, sticky "New request" button. |
| 17. Desktop layout (1440px) | 4-up KPI row, two-column task list and recent orders. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: quote submissions, dispatches and cancellation decisions change the counts; Platform administrator: verification decisions, holds and refunds change the banners and counts. |
| Behaviour | Each tile deep-links to a filtered list; counts refresh on focus. |
| Related screens | BUY-02, BUY-16, BUY-18, BUY-23, SHR-01, SHR-03, ACC-03 |
| Dependencies and decisions | FD-21 (answered: B); Gap G-01; BUY-33 for the spending section |

Form fields:

  - None

### BUY-33 · Monthly spending (buyer dashboard section)

| Item | Specification |
|---|---|
| Screen ID | BUY-33 |
| Screen name | Monthly spending (buyer dashboard section) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `Section of BUY-01` |
| Implementation status | Planned · P0 |
| 1. Purpose | FD-21 (answer B): monthly spending analytics in AED on the buyer dashboard, from the buyer's own paid orders. |
| 2. Navigation location | Buyer sub-nav → Dashboard → Spending |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). Export for OWNER and PROCUREMENT only. |
| 4. Screen layout | Block inside BUY-01 Buyer dashboard with its own heading and actions. Content: Segmented control, bar chart (accessible table alternative), summary tiles, data table, sandbox banner. |
| 5. Components | Segmented control, bar chart (accessible table alternative), summary tiles, data table, sandbox banner |
| 6. Displayed data | Period selector (last 3, 6 or 12 months; Dubai calendar months); bar chart of monthly spend (paid order totals minus refunds, AED); table per month: orders, merchandise, delivery, VAT, refunds, net spend; top suppliers by spend; top categories; note "Figures include only orders paid through the platform. Sandbox amounts are test data." |
| 7. Buttons and actions | Primary: Export CSV (owner and procurement) · Secondary: Open orders for a month |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Period; supplier; category · Month descending · — |
| 9. Validation rules | — |
| 10. API dependencies | New: GET /buyer/workspaces/{ws}/spending?months=12 (aggregates of orders and refunds in fils) |
| Database entities | orders, refunds, order_lines, categories |
| Source files | Not built yet (FD-21 approved) |
| 11. Loading state | Skeleton chart bars and table rows; period control stays usable. |
| 12. Empty state | "No paid orders in this period." with "Browse marketplace" and the period selector; months without spend show AED 0.00, never a gap. |
| 13. Error states | Load failure: chart area shows the error panel with Retry; tiles keep the last loaded values marked "Not updated". Figures are never computed in the browser. |
| 14. Success state | Not applicable (read-only). CSV export: "Your export is ready." and the file downloads; export is logged. |
| 15. Confirmation dialogs | None. |
| 16. Mobile layout (360px) | Tiles 2-up, horizontal scroll-free bar chart with month labels every 2 months, table becomes cards. |
| 17. Desktop layout (1440px) | Chart left (8 cols), top suppliers and categories right (4 cols), table below. |
| 18. Arabic and RTL layout | On `/ar` the page mirrors but the chart time axis stays left to right (oldest month on the left, section 20); legend, tiles and the accessible table mirror; AED amounts use ar-AE formatting inside isolates; month names in Arabic (Gregorian calendar). |
| 19. Interactions with other user roles | Platform administrator: refunds approved by finance reduce net spend; Supplier: none (suppliers never see a buyer's spending). |
| Behaviour | Selecting a bar or month row opens BUY-23 filtered to that month. |
| Related screens | BUY-01, BUY-23 |
| Dependencies and decisions | FD-21 answered (B) |

Form fields:

  - None

### BUY-20 · Delivery addresses

| Item | Specification |
|---|---|
| Screen ID | BUY-20 |
| Screen name | Delivery addresses |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/addresses` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Maintain UAE delivery addresses for the workspace. |
| 2. Navigation location | Buyer sub-nav |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). Changes need buyer.purchase. Max 20. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Address card, default badge, empty state ("No addresses yet. Add one to check out."), back-to-checkout link. |
| 5. Components | Address card, default badge, empty state ("No addresses yet. Add one to check out."), back-to-checkout link |
| 6. Displayed data | "Delivery addresses in the UAE for this buying workspace."; address cards with label, recipient, phone, lines, city, emirate, Default badge. |
| 7. Buttons and actions | Primary: Add an address · Secondary: Edit; Make default; Remove; Back to checkout |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST/PATCH/DELETE /buyer/workspaces/{ws}/addresses |
| Database entities | addresses |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/addresses/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (existing) "No addresses yet. Add one to check out." Action: Add an address. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (BUY-22); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: BUY-22 Remove address dialog. |
| 16. Mobile layout (360px) | Stacked cards. |
| 17. Desktop layout (1440px) | Grid of cards. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Archive keeps snapshots on placed orders. |
| Related screens | BUY-21, BUY-22, BUY-17 |
| Dependencies and decisions | — |

Form fields:

  - None

### BUY-21 · Address form

| Item | Specification |
|---|---|
| Screen ID | BUY-21 |
| Screen name | Address form |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Form on BUY-20` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Add or edit a delivery address. |
| 2. Navigation location | Opened from BUY-20 Delivery addresses |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Block inside BUY-20 Delivery addresses with its own heading and actions. Content: Form, text inputs, phone input, emirate select, default checkbox. |
| 5. Components | Form, text inputs, phone input, emirate select, default checkbox |
| 6. Displayed data | Fields with UAE context. |
| 7. Buttons and actions | Primary: Save address · Secondary: Cancel |
| 8. Form fields | Required: Label (for example Main warehouse), Recipient, Phone, Address line 1, City, Emirate · Optional: Address line 2, Make default (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Phone regex; required fields; max 20 addresses. |
| 10. API dependencies | POST/PATCH /buyer/workspaces/{ws}/addresses(/{id}) |
| Database entities | addresses |
| Source files | addresses/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Phone regex; required fields; max 20 addresses. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Address saved.". |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-screen form. |
| 17. Desktop layout (1440px) | Inline form or modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | "Address saved." |
| Related screens | BUY-20 |
| Dependencies and decisions | — |

Form fields:

  - Label (for example Main warehouse) (text, Required): ≤60
  - Recipient (text, Required): ≤120
  - Phone (tel, Required): E.164, UAE format hint
  - Address line 1 (text, Required): ≤200
  - Address line 2 (text, Optional): ≤200
  - City (text, Required): ≤80
  - Emirate (select, Required): 7 emirates
  - Make default (checkbox, Optional)

### BUY-22 · Remove address dialog

| Item | Specification |
|---|---|
| Screen ID | BUY-22 |
| Screen name | Remove address dialog |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-20` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Archive an address. |
| 2. Navigation location | Opened from BUY-20 Delivery addresses |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Dialog over BUY-20 Delivery addresses: title, context text, fields, footer with secondary action then primary action. Content: Destructive confirm. |
| 5. Components | Destructive confirm |
| 6. Displayed data | "The address is removed from this list. Orders already placed keep their copy." |
| 7. Buttons and actions | Primary: Remove address · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | DELETE /buyer/workspaces/{ws}/addresses/{id} |
| Database entities | addresses |
| Source files | addresses/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Remove address…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Remove address" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | BUY-20 |
| Dependencies and decisions | — |

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

### BUY-02 · Requests for quotation list

| Item | Specification |
|---|---|
| Screen ID | BUY-02 |
| Screen name | Requests for quotation list |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/rfqs` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Track every request for quotation of the workspace and its quote activity. |
| 2. Navigation location | Buyer sub-nav › RFQs |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). Create needs buyer.purchase. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Page header, state filter tabs, data table / mobile card list, status badge, pagination, empty state ("You have no requests for quotation yet."), forbidden note for VIEWER ("Your role can view requests but not create them."). |
| 5. Components | Page header, state filter tabs, data table / mobile card list, status badge, pagination, empty state ("You have no requests for quotation yet."), forbidden note for VIEWER ("Your role can view requests but not create them.") |
| 6. Displayed data | Reference, title, category, quantity + unit, state badge (Draft/Open/Awarded/Cancelled/Expired), visibility, quote deadline (Dubai), number of quotes. |
| 7. Buttons and actions | Primary: New request · Secondary: Open request; filter by state; load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State: All, Draft, Open, Awarded, Cancelled, Expired · Newest first (server) · None today (recommended: title/reference search) |
| 9. Validation rules | — |
| 10. API dependencies | GET /buyer/workspaces/{ws}/rfqs |
| Database entities | rfqs, quotes |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/rfqs/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (existing) "You have no requests for quotation yet." Action: New request. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card per RFQ with state chip and deadline; filter chips scroll horizontally. |
| 17. Desktop layout (1440px) | Table with sortable-looking headers (sorting is server newest-first only). |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Rows link to BUY-05. |
| Related screens | BUY-03, BUY-05 |
| Dependencies and decisions | D08, P3-1 |

Form fields:

  - None

### BUY-03 · New request for quotation

| Item | Specification |
|---|---|
| Screen ID | BUY-03 |
| Screen name | New request for quotation |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/rfqs/new` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Describe what is needed and save it as a draft before publishing to suppliers. |
| 2. Navigation location | Back to RFQs |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Form sections, text input, textarea, select (category, unit, emirate), number input, date/time input (Dubai), radio cards (visibility), money input, supplier picker (BUY-09), file uploader with scan status, inline errors, error summary. |
| 5. Components | Form sections, text input, textarea, select (category, unit, emirate), number input, date/time input (Dubai), radio cards (visibility), money input, supplier picker (BUY-09), file uploader with scan status, inline errors, error summary |
| 6. Displayed data | Intro ("The request stays a draft until you publish it"), form, visibility hint per option, attachment rules, optional pre-filled product/supplier when started from a product or storefront. Request type: Standard RFQ or Sample request (FD-13; sample requests are created from BUY-32 and reuse this model). Audience: "Matching suppliers" (public: eligible verified suppliers in matching categories) or "Invited suppliers only" (private) (FD-11). |
| 7. Buttons and actions | Primary: Save draft · Secondary: Cancel; Invite suppliers; Add attachment |
| 8. Form fields | Required: Title, Category, Quantity, Unit, Specifications, Delivery emirate, Quote deadline (Dubai time), Who can quote · Optional: Needed by, Budget (AED), Invited suppliers, Attachments (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Server zod rules shown inline; open RFQ limit 50 per workspace; deadline validated in Dubai time. |
| 10. API dependencies | POST /buyer/workspaces/{ws}/rfqs; POST /buyer/workspaces/{ws}/rfqs/{id}/files; GET /buyer/workspaces/{ws}/invite-candidates |
| Database entities | rfqs, rfq_invitations, rfq_files, files |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/rfqs/new/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Save draft…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Server zod rules shown inline; open RFQ limit 50 per workspace; deadline validated in Dubai time. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column, sticky Save bar, date pickers native. |
| 17. Desktop layout (1440px) | Two-column form groups, attachments panel right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: "Matching suppliers" requests reach eligible verified suppliers in the category (SEL-20); private requests reach invited suppliers only; Platform administrator: can hide a request (ADM-27). |
| Behaviour | Save creates DRAFT and routes to BUY-05; attachments upload after the draft exists. |
| Related screens | BUY-02, BUY-05, BUY-06, BUY-09 |
| Dependencies and decisions | P3-2, P3-3; FD-11 answered (A); FD-13 answered (B: sample requests are an RFQ type). |

Form fields:

  - Title (text, Required): 1–160
  - Category (select, Required): active, non-BLOCKED leaf category
  - Quantity (integer, Required): 1–10,000,000
  - Unit (select, Required): 8 quantity units
  - Specifications (textarea, Required): 1–5000
  - Delivery emirate (select, Required): 7 emirates
  - Needed by (date, Optional): optional, after deadline
  - Quote deadline (Dubai time) (datetime, Required): 60 minutes to 90 days from now
  - Who can quote (radio, Required): POOL (matching suppliers) or INVITE
  - Budget (AED) (money, Optional): optional, fils integer
  - Invited suppliers (multi-select, Optional): ≤20; required when INVITE
  - Attachments (file, Optional): ≤5, PDF/PNG/JPEG ≤10 MB, malware-scanned

### BUY-04 · Request quotation entry (workspace chooser)

| Item | Specification |
|---|---|
| Screen ID | BUY-04 |
| Screen name | Request quotation entry (workspace chooser) |
| Experience | Business buyers |
| User roles | Any signed-in user |
| Route / URL | `/{locale}/app/rfqs/new` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Entry point used by "Request quotation" buttons on products and storefronts: routes to the right buyer workspace or explains why it cannot. |
| 2. Navigation location | Back link to origin |
| 3. User permissions | Signed-in; only ACTIVE buyer workspaces with buyer.purchase qualify. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Interstitial card, workspace radio list, info alert. |
| 5. Components | Interstitial card, workspace radio list, info alert |
| 6. Displayed data | Either a redirect to BUY-03 with product/supplier context, a workspace choice when the user has several buyer workspaces, or "A buyer workspace is needed" explanation. |
| 7. Buttons and actions | Primary: Continue · Secondary: Register a company; Back to product |
| 8. Form fields | Required: Buyer workspace · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | apps/web/src/app/[locale]/app/rfqs/new/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Continue…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-width card. |
| 17. Desktop layout (1440px) | Narrow centred card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Auto-redirects when exactly one eligible workspace. |
| Related screens | BUY-03, ACC-02, PUB-07, PUB-10 |
| Dependencies and decisions | A12 |

Form fields:

  - Buyer workspace (radio, Required): eligible buyer workspaces of the user

### BUY-05 · Request for quotation detail (buyer)

| Item | Specification |
|---|---|
| Screen ID | BUY-05 |
| Screen name | Request for quotation detail (buyer) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Manage one request through its life: publish, follow quotes, compare, accept, pay. |
| 2. Navigation location | Breadcrumb RFQs › reference |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). Actions need buyer.purchase. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Page header with status badge, description list, attachment list with scan state, invitee chips, alert (hidden, awarded, cancelled reason), comparison table, timeline, action bar. |
| 5. Components | Page header with status badge, description list, attachment list with scan state, invitee chips, alert (hidden, awarded, cancelled reason), comparison table, timeline, action bar |
| 6. Displayed data | Header with reference, title, state badge, deadline (Dubai); request summary (category, quantity/unit, emirate, needed by, budget or "Not stated", visibility); specifications; attachments; invited suppliers; hidden-by-platform notice; awarded panel (accepted total, payment due by …); quote comparison (BUY-10); history timeline with actor side (Buyer/Supplier/System/Platform). Negotiation panel per supplier with counteroffer rounds used (0–3) and the full history (BUY-34). Only the latest eligible revision shows Accept (FD-10). |
| 7. Buttons and actions | Primary: Depends on state: Publish (DRAFT), Accept a quote (OPEN), Pay for this order (AWARDED) · Secondary: Edit draft; Cancel request; Invite suppliers; View order; Message supplier |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Publish needs complete draft and future deadline. |
| 10. API dependencies | GET /buyer/workspaces/{ws}/rfqs/{id} |
| Database entities | rfqs, rfq_events, quotes, quote_versions, rfq_files |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/rfqs/[rfqId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | (existing) "No quotes yet." Action: Invite more suppliers (if INVITE). |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Rules enforced by the server: Publish needs complete draft and future deadline. |
| 14. Success state | Each action confirms on its own screen (BUY-07, BUY-08, BUY-12, BUY-13, BUY-14, BUY-15); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: BUY-07 Publish request dialog; BUY-08 Cancel request dialog; BUY-12 Accept quote dialog; BUY-13 Request revision dialog; BUY-14 Decline quote dialog; BUY-15 Counteroffer to supplier. |
| 16. Mobile layout (360px) | Sections stacked; comparison becomes swipeable cards (today the table overflows: gap G-21). |
| 17. Desktop layout (1440px) | Main column plus right summary/actions column. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: submits quotes and revisions (SEL-22, SEL-23), answers counteroffers (SEL-40) and questions (SEL-25); Platform administrator: RFQ oversight (ADM-26). |
| Behaviour | Optimistic concurrency via expected_version; state-driven action bar. |
| Related screens | BUY-07, BUY-08, BUY-10, BUY-11, BUY-12, BUY-13, BUY-14, BUY-15, BUY-34 |
| Dependencies and decisions | P3-4, P3-5 |

Form fields:

  - None

### BUY-06 · Edit request draft

| Item | Specification |
|---|---|
| Screen ID | BUY-06 |
| Screen name | Edit request draft |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId] (edit mode)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Change a draft before publishing. |
| 2. Navigation location | Returns to BUY-05 |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. DRAFT only. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: As BUY-03. |
| 5. Components | As BUY-03 |
| 6. Displayed data | Same fields as BUY-03 pre-filled; "Changes saved." toast. |
| 7. Buttons and actions | Primary: Save changes · Secondary: Cancel edit; Add/remove attachment |
| 8. Form fields | Required: — · Optional: As BUY-03 (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | As BUY-03 |
| 10. API dependencies | PATCH /buyer/workspaces/{ws}/rfqs/{id}; POST/DELETE /buyer/workspaces/{ws}/rfqs/{id}/files |
| Database entities | rfqs, rfq_files |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | As BUY-03 |
| 17. Desktop layout (1440px) | As BUY-03 |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | 409 when another member saved first; reload prompt. |
| Related screens | BUY-03, BUY-05 |
| Dependencies and decisions | — |

Form fields:

  - As BUY-03 (mixed, Optional): same rules

### BUY-07 · Publish request dialog

| Item | Specification |
|---|---|
| Screen ID | BUY-07 |
| Screen name | Publish request dialog |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Confirm publication and who will be notified. |
| 2. Navigation location | Opened from BUY-05 Request for quotation detail (buyer) |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Dialog over BUY-05 Request for quotation detail (buyer): title, context text, fields, footer with secondary action then primary action. Content: Confirm dialog. |
| 5. Components | Confirm dialog |
| 6. Displayed data | "Publish this request?" with POOL or INVITE body text. |
| 7. Buttons and actions | Primary: Publish · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Server checks deadline still ≥60 minutes ahead, invitees eligible. |
| 10. API dependencies | POST /buyer/workspaces/{ws}/rfqs/{id}/publish |
| Database entities | rfqs, rfq_invitations, notifications, outbox |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Publish…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Server checks deadline still ≥60 minutes ahead, invitees eligible. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Request published.". |
| 15. Confirmation dialogs | This screen is the confirmation step ("Publish" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: published request appears in SEL-20 with in-app and email notification. |
| Behaviour | On success "Request published." and state OPEN. |
| Related screens | BUY-05 |
| Dependencies and decisions | — |

Form fields:

  - None

### BUY-08 · Cancel request dialog

| Item | Specification |
|---|---|
| Screen ID | BUY-08 |
| Screen name | Cancel request dialog |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Cancel a draft or open request without an award. |
| 2. Navigation location | Opened from BUY-05 Request for quotation detail (buyer) |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Not after AWARDED. |
| 4. Screen layout | Dialog over BUY-05 Request for quotation detail (buyer): title, context text, fields, footer with secondary action then primary action. Content: Destructive confirm dialog with reason field. |
| 5. Components | Destructive confirm dialog with reason field |
| 6. Displayed data | "Cancel this request? Suppliers who quoted will be told. Open quotes are closed. This cannot be undone." |
| 7. Buttons and actions | Primary: Cancel request · Secondary: Keep request |
| 8. Form fields | Required: — · Optional: Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /buyer/workspaces/{ws}/rfqs/{id}/cancel |
| Database entities | rfqs, quotes, rfq_events |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Cancel request…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Request cancelled.". |
| 15. Confirmation dialogs | This screen is the confirmation step ("Cancel request" / "Keep request"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: request shows as cancelled in SEL-20/SEL-21 and quoting stops. |
| Behaviour | "Request cancelled." |
| Related screens | BUY-05 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Optional): optional, ≤1000

### BUY-09 · Invite suppliers picker

| Item | Specification |
|---|---|
| Screen ID | BUY-09 |
| Screen name | Invite suppliers picker |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Panel in BUY-03/BUY-06` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Choose specific verified suppliers to invite. |
| 2. Navigation location | Opened from BUY-03 New request for quotation |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Own company excluded (no self-trade). |
| 4. Screen layout | Block inside BUY-03 New request for quotation with its own heading and actions. Content: Search input, checkbox list with supplier name/emirate, selected chips. |
| 5. Components | Search input, checkbox list with supplier name/emirate, selected chips |
| 6. Displayed data | Search box, eligible supplier results (public, trading-eligible), "{count} invited", "No eligible suppliers match." |
| 7. Buttons and actions | Primary: Invite (add to selection) · Secondary: Remove invitee |
| 8. Form fields | Required: — · Optional: Search suppliers, Selection (details below) |
| Filters · sorting · search | — · — · Supplier name search |
| 9. Validation rules | ≤20 invitees |
| 10. API dependencies | GET /buyer/workspaces/{ws}/invite-candidates |
| Database entities | marketplace_suppliers |
| Source files | rfqs/new/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Full-screen picker sheet. |
| 17. Desktop layout (1440px) | Inline panel or popover list. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: invited suppliers are notified and see the request in SEL-20. |
| Behaviour | Debounced search; selection held in the draft. |
| Related screens | BUY-03 |
| Dependencies and decisions | — |

Form fields:

  - Search suppliers (text, Optional): max 100
  - Selection (multi, Optional): ≤20

### BUY-10 · Quote comparison

| Item | Specification |
|---|---|
| Screen ID | BUY-10 |
| Screen name | Quote comparison |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `Section of BUY-05` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Compare the current version of every supplier quote side by side. |
| 2. Navigation location | Opened from BUY-05 Request for quotation detail (buyer) |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). Actions need buyer.purchase and RFQ OPEN. |
| 4. Screen layout | Block inside BUY-05 Request for quotation detail (buyer) with its own heading and actions. Content: Comparison table (rows = attributes, columns = suppliers), lowest-total marker (text + icon, never colour alone), row actions. |
| 5. Components | Comparison table (rows = attributes, columns = suppliers), lowest-total marker (text + icon, never colour alone), row actions |
| 6. Displayed data | Caption "Current quote from each supplier"; per supplier: state, version, quantity, unit price, subtotal, shipping, tax, total (lowest total flagged "Lowest total"), lead time, delivery date, valid until (Dubai), deviations flag, revision requested flag. Validity shown as "Valid until {date}" (supplier default 7 days, allowed 1–90; FD-12). Rows with an open counteroffer show "Waiting for supplier (round {n} of 3)". |
| 7. Buttons and actions | Primary: Accept · Secondary: Request revision; Decline; View details; Message supplier |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · Lowest total marker; recommended: sort by total, lead time, validity · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /buyer/workspaces/{ws}/rfqs/{id} |
| Database entities | quotes, quote_versions |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Hidden when there is nothing to show, unless stated otherwise in the purpose. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: accept, decline (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Recommended: one card per supplier with key figures and swipe; today the table overflows horizontally. |
| 17. Desktop layout (1440px) | Full-width table with sticky first column. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: quote values compared here come from SEL-22; buyers never see other suppliers' identities in supplier screens. |
| Behaviour | Amounts are server-computed fils; accept uses exact version. |
| Related screens | BUY-11, BUY-12, BUY-13, BUY-14 |
| Dependencies and decisions | Gap G-21 |

Form fields:

  - None

### BUY-11 · Quote detail and version history

| Item | Specification |
|---|---|
| Screen ID | BUY-11 |
| Screen name | Quote detail and version history |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `Expandable within BUY-05` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Read everything a supplier offered, including earlier versions. |
| 2. Navigation location | Opened from BUY-05 Request for quotation detail (buyer) |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). |
| 4. Screen layout | Block inside BUY-05 Request for quotation detail (buyer) with its own heading and actions. Content: Disclosure panel, description list, attachment list, version list. |
| 5. Components | Disclosure panel, description list, attachment list, version list |
| 6. Displayed data | "What is offered", "Differences from the request", terms, attachments, figures, "Earlier versions ({count})" with SUPERSEDED versions. |
| 7. Buttons and actions | Primary: Accept · Secondary: Request revision; Decline; download attachment |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /buyer/workspaces/{ws}/rfqs/{id}; GET /buyer/workspaces/{ws}/rfqs/{id}/files/{fileId} |
| Database entities | quote_versions, quote_files |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Hidden when there is nothing to show, unless stated otherwise in the purpose. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: accept, decline (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Full-screen sheet. |
| 17. Desktop layout (1440px) | Inline expansion under the comparison. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: versions submitted in SEL-22/SEL-23. |
| Behaviour | Downloads streamed after authorization. |
| Related screens | BUY-10, BUY-12 |
| Dependencies and decisions | — |

Form fields:

  - None

### BUY-34 · Negotiation history and revision changes

| Item | Specification |
|---|---|
| Screen ID | BUY-34 |
| Screen name | Negotiation history and revision changes |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `Section of BUY-05 (per supplier)` |
| Implementation status | Planned · P0 |
| 1. Purpose | Founder section 4: keep the entire negotiation history and show clearly what changed in each quotation revision. |
| 2. Navigation location | Inside BUY-05, per quote card |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). Actions for buyer.purchase only. |
| 4. Screen layout | Block inside BUY-05 Request for quotation detail (buyer) with its own heading and actions. Content: Vertical timeline, diff rows (old value struck through, new value bold, change icon), state badges, "Accept this revision" only on the current eligible revision. |
| 5. Components | Vertical timeline, diff rows (old value struck through, new value bold, change icon), state badges, "Accept this revision" only on the current eligible revision |
| 6. Displayed data | Timeline per supplier: quotation v1, counteroffer round 1, revision v2, …; each revision shows changed fields highlighted (unit price, quantity, delivery date, delivery charge, VAT rule, validity, customisation) with old → new values; state badges (Current, Superseded, Expired, Accepted, Declined); rounds used "{n} of 3". |
| 7. Buttons and actions | Primary: Accept latest revision (BUY-12) · Secondary: Send counteroffer (BUY-15); Decline (BUY-14) |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | New: GET /buyer/workspaces/{ws}/quotes/{quoteId}/negotiation |
| Database entities | quotes, quote_versions, quote_counteroffers, rfq_events |
| Source files | Not built yet (C-14) |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Before any counteroffer: shows only "Quotation v1" with "No counteroffers yet." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable (history). Accepting the current revision happens in BUY-12. |
| 15. Confirmation dialogs | Confirm in a dialog before: accept, decline, send counteroffer (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Timeline full width; diff rows stacked label/old/new. |
| 17. Desktop layout (1440px) | Timeline left, current revision summary sticky right. |
| 18. Arabic and RTL layout | Timeline line on the right edge; old values struck through and new values bold keep their own number direction. |
| 19. Interactions with other user roles | Supplier: each revision from SEL-22/SEL-40 appears here; Platform administrator: can read the negotiation on dispute review (ADM-39). |
| Behaviour | Updates live when the supplier submits a revision; older revisions are read-only. |
| Related screens | BUY-05, BUY-12, BUY-15, SEL-40 |
| Dependencies and decisions | FD-10 answered (C); C-14 |

Form fields:

  - None

### BUY-12 · Accept quote dialog

| Item | Specification |
|---|---|
| Screen ID | BUY-12 |
| Screen name | Accept quote dialog |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Award the request to one exact quote version and start the order and payment window. |
| 2. Navigation location | Opened from BUY-05 Request for quotation detail (buyer) |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Dialog over BUY-05 Request for quotation detail (buyer): title, context text, fields, footer with secondary action then primary action. Content: Confirm dialog, PO reference input. |
| 5. Components | Confirm dialog, PO reference input |
| 6. Displayed data | "Accept this quote? You are accepting version {version} from {company}. Other quotes will be declined. This cannot be undone." and "Totals are taken from the supplier's submitted version, not from this page." |
| 7. Buttons and actions | Primary: Accept quote · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Your PO reference (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Version must still be current (quote.superseded) and the RFQ OPEN (rfq.not_open). |
| 10. API dependencies | POST /buyer/workspaces/{ws}/quotes/{quoteId}/accept |
| Database entities | quotes, rfqs, checkouts, orders |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Accept quote…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Version must still be current (quote.superseded) and the RFQ OPEN (rfq.not_open). Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "A newer revision exists". |
| 15. Confirmation dialogs | This screen is the confirmation step ("Accept quote" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: quote shows Accepted in SEL-26 and an order awaiting payment appears in SEL-27. |
| Behaviour | Idempotency-Key header; accepts the exact version_id; creates checkout (source QUOTE) and order with 72-hour payment deadline (D05). The delivery address (in the quoted emirate) is chosen when starting payment on BUY-18. FD-10: only the latest eligible revision can be accepted; an older, expired or superseded revision shows "A newer revision exists" and the server refuses concurrent conflicting acceptances (version check). |
| Related screens | BUY-05, BUY-18, BUY-20 |
| Dependencies and decisions | D05 |

Form fields:

  - Your PO reference (text, Optional): optional, ≤60

### BUY-13 · Request revision dialog

| Item | Specification |
|---|---|
| Screen ID | BUY-13 |
| Screen name | Request revision dialog |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Ask a supplier to revise without declining. |
| 2. Navigation location | Opened from BUY-05 Request for quotation detail (buyer) |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Dialog over BUY-05 Request for quotation detail (buyer): title, context text, fields, footer with secondary action then primary action. Content: Dialog with note textarea. |
| 5. Components | Dialog with note textarea |
| 6. Displayed data | "{company} will be asked to revise the quote. The current version stays valid." |
| 7. Buttons and actions | Primary: Request revision · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Reason / note to supplier (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /buyer/workspaces/{ws}/quotes/{quoteId}/request-revision |
| Database entities | quotes, rfq_events |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Request revision…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Revision requested.". |
| 15. Confirmation dialogs | This screen is the confirmation step ("Request revision" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: revision request shown in SEL-21; answered with a new version. |
| Behaviour | "Revision requested."; flag shown on quote. |
| Related screens | BUY-10 |
| Dependencies and decisions | —; FD-10: a revision request without figures stays available; structured counteroffers use BUY-15. |

Form fields:

  - Reason / note to supplier (textarea, Optional): optional, ≤1000

### BUY-14 · Decline quote dialog

| Item | Specification |
|---|---|
| Screen ID | BUY-14 |
| Screen name | Decline quote dialog |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Decline a quote. |
| 2. Navigation location | Opened from BUY-05 Request for quotation detail (buyer) |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Dialog over BUY-05 Request for quotation detail (buyer): title, context text, fields, footer with secondary action then primary action. Content: Destructive confirm dialog. |
| 5. Components | Destructive confirm dialog |
| 6. Displayed data | "Decline the quote from {company}? This cannot be undone." |
| 7. Buttons and actions | Primary: Decline · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /buyer/workspaces/{ws}/quotes/{quoteId}/decline |
| Database entities | quotes |
| Source files | rfqs/[rfqId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Decline…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Quote declined.". |
| 15. Confirmation dialogs | This screen is the confirmation step ("Decline" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: quote shows Declined in SEL-26 with the buyer's reason. |
| Behaviour | "Quote declined." |
| Related screens | BUY-10 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Optional): optional, ≤1000

### BUY-15 · Counteroffer to supplier

| Item | Specification |
|---|---|
| Screen ID | BUY-15 |
| Screen name | Counteroffer to supplier |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05 (proposed)` |
| Implementation status | Planned · P0 |
| 1. Purpose | FD-10 (answer C) and founder section 4: the buyer sends a structured counteroffer on the supplier's latest quotation revision. At most three counteroffer rounds per buyer–supplier negotiation; the whole history is kept. |
| 2. Navigation location | Opened from BUY-05 Request for quotation detail (buyer) |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Dialog over BUY-05 Request for quotation detail (buyer): title, context text, fields, footer with secondary action then primary action. Content: Dialog (desktop) / full-height sheet (mobile) with comparison columns "Supplier's revision" and "Your counteroffer", money and number inputs, date picker, textarea, server preview, rounds indicator. |
| 5. Components | Dialog (desktop) / full-height sheet (mobile) with comparison columns "Supplier's revision" and "Your counteroffer", money and number inputs, date picker, textarea, server preview, rounds indicator |
| 6. Displayed data | Latest revision figures (unit price, quantity, delivery date, customisation, total); rounds used "Round {n} of 3"; proposed values side by side with the current ones; server-computed proposed subtotal (excluding delivery and VAT, which the supplier quotes). |
| 7. Buttons and actions | Primary: Send counteroffer · Secondary: Cancel |
| 8. Form fields | Required: Proposed unit price (AED), Requested quantity · Optional: Proposed delivery date, Customisation changes, Additional notes (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | At least one of price, quantity or date must differ from the revision; RFQ open and revision current and not expired; rounds ≤ 3; integers only for money. |
| 10. API dependencies | New (C-14, being built): POST /buyer/workspaces/{ws}/quotes/{quoteId}/counteroffers; GET …/quotes/{quoteId}/negotiation |
| Database entities | New quote_counteroffers (round, proposed values, state) linked to quote_versions |
| Source files | Not built yet (C-14 approved; thread "Build marketplace and prepare launch") |
| 11. Loading state | Server preview of the proposed subtotal shows a skeleton line while recalculating; on submit "Send counteroffer…" is disabled. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | "The supplier has already sent a newer revision. Review it before countering." (stale revision); "You have used all three counteroffer rounds." (round limit); "This quotation has expired."; field errors inline. |
| 14. Success state | "Counteroffer sent. The supplier has been notified." The quote card shows "Waiting for supplier (round {n} of 3)" and Accept on the countered revision is disabled. |
| 15. Confirmation dialogs | Review step inside the dialog lists each changed term (old → new) before Send. Cancel keeps nothing. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | Comparison columns mirror ("Supplier's revision" on the right, "Your counteroffer" on the left); numbers and AED stay LTR in isolates. |
| 19. Interactions with other user roles | Supplier: receives the counteroffer in SEL-21 and answers in SEL-40 (in-app and email); the buyer's VIEWER members see the history read-only. |
| Behaviour | Creates counteroffer round n on the latest revision; the supplier is notified (in-app + email) and answers in SEL-40 by submitting a new revision or declining. While a counteroffer is open the buyer cannot accept the countered revision. After round 3 the action is replaced by "Final round reached: accept or decline the latest revision". |
| Related screens | BUY-05, BUY-11, BUY-34, SEL-40 |
| Dependencies and decisions | FD-10 answered (C); C-14 |

Form fields:

  - Proposed unit price (AED) (money, Required): > 0, integer fils, ≤ current unit price × 10
  - Requested quantity (integer, Required): ≥ 1 and within the RFQ quantity rules
  - Proposed delivery date (date, Optional): today or later (Dubai)
  - Customisation changes (textarea, Optional): ≤ 2000
  - Additional notes (textarea, Optional): ≤ 2000

### BUY-32 · Request a sample

| Item | Specification |
|---|---|
| Screen ID | BUY-32 |
| Screen name | Request a sample |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/rfqs/new?type=sample&product={id} (from PUB-07 or PUB-10)` |
| Implementation status | Planned · P1 |
| 1. Purpose | FD-13 (answer B) and founder section 5: "Request a sample" on eligible products and storefronts creates a sample request, a dedicated RFQ type that reuses the RFQ and quotation system. No separate payment module or provider. |
| 2. Navigation location | Buyer sub-nav |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Page form (same layout as BUY-03) with product summary, variant select, quantity, preferences, delivery/collection radio cards, date picker, attachments uploader with scan states. |
| 5. Components | Page form (same layout as BUY-03) with product summary, variant select, quantity, preferences, delivery/collection radio cards, date picker, attachments uploader with scan states |
| 6. Displayed data | Product card (image, title, supplier, verified badge); supplier sample terms "Free sample", "Paid sample (price quoted by the supplier)" or not offered (action hidden); buyer delivery address or collection choice; what happens next. |
| 7. Buttons and actions | Primary: Send sample request · Secondary: Cancel; Save draft |
| 8. Form fields | Required: Product, Sample quantity, Delivery or collection · Optional: Product variant, Material or colour preferences, Customisation requirements, Delivery address, Required by, Additional notes, Attachments (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Supplier offers samples for the product; quantity within the supplier maximum; delivery emirate served or collection offered; attachment security rules. |
| 10. API dependencies | New (being built): POST /buyer/workspaces/{ws}/rfqs with type=SAMPLE and product_id; existing RFQ and quote endpoints |
| Database entities | rfqs (+ type, product_id, variant_id), quotes, quote_versions |
| Source files | Not built yet (FD-13 approved) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Send sample request…" and is disabled. |
| 12. Empty state | Product without sample offer: the action is hidden on PUB-07/PUB-10; a direct link shows "This supplier does not offer samples for this product." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Supplier offers samples for the product; quantity within the supplier maximum; delivery emirate served or collection offered; attachment security rules. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | "Sample request sent." Opens the request in BUY-04 with the "Sample request" badge. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: receives it in SEL-20 with the "Sample request" badge and answers with a sample quotation in SEL-22 (free = AED 0). |
| Behaviour | Creates an RFQ of type SAMPLE sent privately to that supplier; the supplier answers with a sample quotation (SEL-22 in sample mode, price 0 for free samples); the buyer accepts it as any quotation and pays through checkout if paid. |
| Related screens | PUB-07, PUB-10, BUY-05, SEL-21, SEL-22, SEL-39 |
| Dependencies and decisions | FD-13 answered (B) |

Form fields:

  - Product (reference, Required): prefilled; eligible product with samples offered
  - Product variant (select, Optional): variants of the product
  - Sample quantity (integer, Required): 1–(supplier max sample quantity)
  - Material or colour preferences (textarea, Optional): ≤ 1000
  - Customisation requirements (textarea, Optional): ≤ 2000
  - Delivery or collection (radio, Required): Deliver to address (emirate served) / Collect from supplier (if offered)
  - Delivery address (select, Optional): required when delivery is chosen
  - Required by (date, Optional): today + 1 or later
  - Additional notes (textarea, Optional): ≤ 2000
  - Attachments (file, Optional): PDF, PNG, JPEG ≤ 10 MB each, max 5; malware scan; fictional documents only in staging

## Order management

### BUY-16 · Cart

| Item | Specification |
|---|---|
| Screen ID | BUY-16 |
| Screen name | Cart |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/cart` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Review ready-stock items grouped by supplier before checkout. |
| 2. Navigation location | Header cart link (purchase roles only) |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Max 50 lines. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Supplier group card, cart line, quantity stepper, issue alert, summary panel, empty state ("Your cart is empty." + Browse products). |
| 5. Components | Supplier group card, cart line, quantity stepper, issue alert, summary panel, empty state ("Your cart is empty." + Browse products) |
| 6. Displayed data | Groups per supplier with delivery fee per order and typical days; lines with image, title, variant, unit price, quantity stepper, "Minimum {moq}, in steps of {step}", line total, issue text (No longer available / Request a quotation / below MOQ / step mismatch / Only {available} available); merchandise subtotal; note "Delivery and tax are calculated at checkout for your address." |
| 7. Buttons and actions | Primary: Continue to checkout · Secondary: Update; Remove; Browse products; open product |
| 8. Form fields | Required: Quantity · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | MOQ_NOT_MET, INCREMENT, insufficient stock. |
| 10. API dependencies | GET/POST/PATCH/DELETE /buyer/workspaces/{ws}/cart(/items) |
| Database entities | carts, cart_items, skus, inventory, price_tiers |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/cart/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Continue to checkout…" and is disabled. |
| 12. Empty state | (existing) "Your cart is empty." Action: Browse products. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: MOQ_NOT_MET, INCREMENT, insufficient stock. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Lines stacked, sticky summary bar with total and CTA. |
| 17. Desktop layout (1440px) | Lines left, sticky summary right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Server re-prices on every load; lines with issues block checkout. |
| Related screens | BUY-17, PUB-07 |
| Dependencies and decisions | P4-1 |

Form fields:

  - Quantity (integer, Required): ≥ MOQ, increment, ≤ available

### BUY-17 · Checkout

| Item | Specification |
|---|---|
| Screen ID | BUY-17 |
| Screen name | Checkout |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/checkout` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Choose a delivery address, see server totals per supplier and place the order(s). |
| 2. Navigation location | Buyer sub-nav |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Address radio cards, order summary card, totals table, terms checkbox, PO input, issue alerts, sandbox banner. |
| 5. Components | Address radio cards, order summary card, totals table, terms checkbox, PO input, issue alerts, sandbox banner |
| 6. Displayed data | Delivery address selector; per-supplier order summary (items, delivery, tax, total); grand total; "This creates {count} order(s), one per supplier, paid in one payment."; "Stock is held for 15 minutes while you pay."; issues (no delivery terms, emirate not served); sandbox payment notice. Since PR #14/#17: per-supplier VAT rule ("Standard rate (supplier VAT registered)", "No VAT (supplier not registered)" or, in development, "Provisional standard rate" with the note "VAT is shown at a provisional development rate…"); suppliers with unconfirmed VAT status block checkout ("This supplier's VAT registration has not been confirmed yet…"); each supplier's return policy ("Returns") or the no-policy notice. FD-08: delivery method per supplier (BUY-35). FD-16: clickwrap acceptance of the current terms version (ACC-18). |
| 7. Buttons and actions | Primary: Place order and pay · Secondary: Review cart; Add an address; Manage addresses |
| 8. Form fields | Required: Deliver to, Accept terms · Optional: Your PO reference (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Address emirate served; no blocking issues; terms accepted. |
| 10. API dependencies | POST /buyer/workspaces/{ws}/checkout/preview; POST /buyer/workspaces/{ws}/checkouts |
| Database entities | checkouts, orders, order_lines, reservations, addresses |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/checkout/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Place order and pay…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Address emirate served; no blocking issues; terms accepted. Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: place order (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Single column; totals then sticky CTA. |
| 17. Desktop layout (1440px) | Address and items left, summary right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: paid orders appear in SEL-27 with the delivery method and VAT rule; Platform administrator: payments and ledger in ADM-30. |
| Behaviour | Preview hash; 409 checkout.changed shows refreshed totals; creates checkout + orders + 15-minute reservation. |
| Related screens | BUY-16, BUY-18, BUY-20, BUY-35, ACC-18 |
| Dependencies and decisions | P4-1, P4-2, tax model; FD-06 (disclosed intermediary, tax adviser pending); FD-08 (delivery and collection, C-10). |

Form fields:

  - Deliver to (radio, Required): active UAE address
  - Your PO reference (text, Optional): optional
  - Accept terms (checkbox, Required): required ("Confirm the order details to continue.")

### BUY-35 · Delivery method selection (checkout section)

| Item | Specification |
|---|---|
| Screen ID | BUY-35 |
| Screen name | Delivery method selection (checkout section) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Section of BUY-17 (per supplier group)` |
| Implementation status | Planned · P0 |
| 1. Purpose | FD-08 / C-10: per supplier the buyer chooses delivery to the selected address (fee for that emirate) or free collection where offered; quote checkouts use the delivery charge agreed in the quotation. |
| 2. Navigation location | Opened from BUY-17 Checkout |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Block inside BUY-17 Checkout with its own heading and actions. Content: Radio cards, unavailable state with reason, totals panel, info text. |
| 5. Components | Radio cards, unavailable state with reason, totals panel, info text |
| 6. Displayed data | Per supplier: radio cards "Delivery to {emirate}: AED {fee}, typically {min}–{max} days" (disabled with "Does not deliver to {emirate}" when off) and "Collect from supplier: free" (city shown; full address and instructions only after payment); for quote orders "Delivery as agreed in the quotation: AED {amount}"; totals update from the server. |
| 7. Buttons and actions | Primary: Continue to payment · Secondary: Change address |
| 8. Form fields | Required: Delivery method · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Address emirate must be served for delivery; collection only where offered. |
| 10. API dependencies | Existing POST /buyer/workspaces/{ws}/checkouts (+ delivery_method per supplier, C-10) |
| Database entities | checkouts, orders (+ delivery method snapshot), storefronts (delivery settings) |
| Source files | Not built yet (C-10) |
| 11. Loading state | Totals panel shows a skeleton while the server re-prices after a method change; Continue is disabled until the new total returns. |
| 12. Empty state | No method available for a supplier (emirate not served and no collection): card shows "This supplier does not deliver to {emirate} and does not offer collection. Choose another address or remove these items." and checkout cannot continue. |
| 13. Error states | "Delivery charges changed. Review the new total." (409 checkout.changed); unavailable method explained per card. |
| 14. Success state | Totals updated from the server; the chosen method is part of the checkout preview that the order snapshots. |
| 15. Confirmation dialogs | None at this step; the order is confirmed by "Place order and pay" in BUY-17. |
| 16. Mobile layout (360px) | Supplier groups stacked; radio cards full width. |
| 17. Desktop layout (1440px) | Supplier groups in the main column, totals sticky right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: delivery settings in SEL-04 decide what is offered; the chosen method shows on SEL-28. |
| Behaviour | Selection re-prices the checkout on the server; the chosen method, fee and terms are snapshotted on each order. |
| Related screens | BUY-17, BUY-20, BUY-36, SEL-04 |
| Dependencies and decisions | FD-08 answered (A); C-10 |

Form fields:

  - Delivery method (radio, Required): per supplier: delivery (emirate enabled) or collection (offered)

### BUY-23 · Orders list (buyer)

| Item | Specification |
|---|---|
| Screen ID | BUY-23 |
| Screen name | Orders list (buyer) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/orders` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Track all orders from catalogue checkouts and accepted quotations. |
| 2. Navigation location | Buyer sub-nav › Orders |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: State filter, table/cards, status badge, pagination, empty state ("No orders yet. Orders appear here after checkout or an accepted quotation."). |
| 5. Components | State filter, table/cards, status badge, pagination, empty state ("No orders yet. Orders appear here after checkout or an accepted quotation.") |
| 6. Displayed data | Order number, supplier, source (Catalogue order / From quotation), created (Dubai), total, state badge. Status badge includes "Cancellation requested" when a buyer cancellation request is open (BUY-31). |
| 7. Buttons and actions | Primary: Open order · Secondary: Filter; load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State (7 order states) · Newest first · None today (recommended: order number / supplier search) |
| 9. Validation rules | — |
| 10. API dependencies | GET /buyer/workspaces/{ws}/orders |
| Database entities | orders |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/orders/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (existing) "No orders yet. Orders appear here after checkout or an accepted quotation." Action: Browse products. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards with state chip. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: same orders in SEL-27. |
| Behaviour | — |
| Related screens | BUY-24 |
| Dependencies and decisions | — |

Form fields:

  - None

### BUY-24 · Order detail (buyer)

| Item | Specification |
|---|---|
| Screen ID | BUY-24 |
| Screen name | Order detail (buyer) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/orders/[orderId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Follow one order from payment to completion and act on it. |
| 2. Navigation location | Buyer sub-nav |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). Actions need buyer.orders.act. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Status header, next-step alert, line items table, totals, address card, fulfilment panel, timeline, review card, action bar. |
| 5. Components | Status header, next-step alert, line items table, totals, address card, fulfilment panel, timeline, review card, action bar |
| 6. Displayed data | Order number, state badge, supplier, source, PO reference, pay-by or confirmed at, lines (item, quantity, unit price, line total), delivery, tax, total (no commission shown to buyers), delivery address snapshot, next-step text per state, fulfilment (carrier, tracking, expected, dispatched, delivered, delivery note, proof download), refunded so far, review section, dispute link, timeline. Since PR #13: "Delivery verified {date} (proof of delivery \| buyer confirmed receipt)" and "Dispute window: Open until {date} / Ended {date} / Starts when delivery is verified"; "Completed automatically after the dispute window" event. Since PR #14: Invoice draft card (BUY-37). Since PR #17: supplier cancellation pending notice. Planned: collection instructions (BUY-36), "Request cancellation" before dispatch (BUY-31), delivery method and charges snapshot (FD-08). |
| 7. Buttons and actions | Primary: Confirm receipt (DISPATCHED/DELIVERED) · Secondary: Pay (AWAITING_PAYMENT); Open a dispute; Rate this supplier; Download proof; Message supplier; Open support ticket |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /buyer/workspaces/{ws}/orders/{id}; GET /proof |
| Database entities | orders, order_lines, order_events, shipments, refunds, reviews |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/orders/[orderId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (BUY-25, BUY-27, BUY-31); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: BUY-25 Confirm receipt dialog; BUY-27 Open dispute form (buyer); BUY-31 Request order cancellation (buyer). |
| 16. Mobile layout (360px) | Status and next step first; collapsible sections; sticky action. |
| 17. Desktop layout (1440px) | Main column + right summary. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: actions on SEL-28 (processing, dispatch, delivery proof, cancellation) update this page; Platform administrator: holds, refunds and dispute decisions (ADM-29, ADM-39). |
| Behaviour | Actions shown only in valid states; server rejects invalid transitions. |
| Related screens | BUY-25, BUY-26, BUY-27, BUY-31, BUY-36, BUY-37, SHR-02 |
| Dependencies and decisions | P5-1, P5-2 |

Form fields:

  - None

### BUY-36 · Collection instructions (order section)

| Item | Specification |
|---|---|
| Screen ID | BUY-36 |
| Screen name | Collection instructions (order section) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `Section of BUY-24` |
| Implementation status | Planned · P1 |
| 1. Purpose | FD-08: collection address and instructions are given securely, only to the buyer of a paid collection order. |
| 2. Navigation location | Buyer order detail |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). |
| 4. Screen layout | Block inside BUY-24 Order detail (buyer) with its own heading and actions. Content: Card with address block, copy button, map link (plain text address, no paid map service). |
| 5. Components | Card with address block, copy button, map link (plain text address, no paid map service) |
| 6. Displayed data | Collection address, opening hours and instructions from the supplier, contact person, order reference to quote; "Collected" event once the supplier records it. |
| 7. Buttons and actions | Primary: Copy address · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | Existing GET /buyer/workspaces/{ws}/orders/{id} (+ collection block, C-10) |
| Database entities | orders (snapshot), storefronts |
| Source files | Not built yet (C-10) |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Hidden on delivery orders and before payment. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | "Address copied." |
| 15. Confirmation dialogs | None. |
| 16. Mobile layout (360px) | Card full width. |
| 17. Desktop layout (1440px) | Card in right column. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: enters the address and instructions in SEL-04 and records "Collected by buyer" on SEL-28. |
| Behaviour | Visible after payment; hidden on cancelled orders. |
| Related screens | BUY-24, BUY-35, SEL-28 |
| Dependencies and decisions | FD-08 answered (A) |

Form fields:

  - None

### BUY-25 · Confirm receipt dialog

| Item | Specification |
|---|---|
| Screen ID | BUY-25 |
| Screen name | Confirm receipt dialog |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-24` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Confirm goods arrived; completes the order. |
| 2. Navigation location | Opened from BUY-24 Order detail (buyer) |
| 3. User permissions | buyer.orders.act |
| 4. Screen layout | Dialog over BUY-24 Order detail (buyer): title, context text, fields, footer with secondary action then primary action. Content: Confirm dialog. |
| 5. Components | Confirm dialog |
| 6. Displayed data | "Confirm you received this order? This completes the order. You can still open a dispute for 14 days after confirming." FD-02 (answer A): copy must say that confirming receipt records delivery only and the dispute period stays open until the date shown, e.g. "Confirm that the goods arrived. You can still open a dispute until {date}." |
| 7. Buttons and actions | Primary: Confirm receipt · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /buyer/workspaces/{ws}/orders/{id}/confirm-receipt |
| Database entities | orders, settlements |
| Source files | orders/[orderId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Confirm receipt…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | "Receipt confirmed. You can still open a dispute until {date}." Order shows "Delivery verified (buyer confirmed receipt)". |
| 15. Confirmation dialogs | This dialog is the confirmation. Body: "Confirm that the goods arrived. You can still open a dispute until {date}." (FD-02). |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: sees delivery verified and "Not yet eligible" settlement until the window ends (SEL-28, SEL-32). |
| Behaviour | Since PR #13: order → Completed (receipt recorded); delivery becomes verified if a proof file had not already verified it; the 14-day dispute window is not shortened and still ends on the date shown; payout eligibility waits for the end of the window (P8-1, P8-2). Earlier conflict P5-2 is resolved. |
| Related screens | BUY-24 |
| Dependencies and decisions | FD-02 answered (A); P8-1, P8-2 |

Form fields:

  - None

### BUY-26 · Rate supplier form

| Item | Specification |
|---|---|
| Screen ID | BUY-26 |
| Screen name | Rate supplier form |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Section of BUY-24` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Leave one review per completed order. |
| 2. Navigation location | Opened from BUY-24 Order detail (buyer) |
| 3. User permissions | buyer.orders.act; order COMPLETED; once per order. |
| 4. Screen layout | Block inside BUY-24 Order detail (buyer) with its own heading and actions. Content: Star rating (radio group), textarea, submit. |
| 5. Components | Star rating (radio group), textarea, submit |
| 6. Displayed data | "Rate this supplier"; "Reviews are shown publicly without your company name." Shown publicly as "Verified business buyer" (FD-15). |
| 7. Buttons and actions | Primary: Submit review · Secondary: — |
| 8. Form fields | Required: Rating · Optional: Comment (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | 1–5; ≤1000 |
| 10. API dependencies | POST /buyer/workspaces/{ws}/orders/{id}/review |
| Database entities | reviews |
| Source files | orders/[orderId]/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Your review". |
| 15. Confirmation dialogs | Confirm in a dialog before: submit (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Full-width card. |
| 17. Desktop layout (1440px) | Card in order detail. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: rating appears on the storefront (PUB-10) as "Verified business buyer"; Platform administrator: moderation in ADM-41. |
| Behaviour | Shows "Your review" afterwards. |
| Related screens | PUB-10, ADM-41 |
| Dependencies and decisions | P5-6 label vs founder "verified business buyer" |

Form fields:

  - Rating (radio 1–5, Required)
  - Comment (textarea, Optional): ≤1000

### BUY-27 · Open dispute form (buyer)

| Item | Specification |
|---|---|
| Screen ID | BUY-27 |
| Screen name | Open dispute form (buyer) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-24` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Raise a problem with an order. |
| 2. Navigation location | Opened from BUY-24 Order detail (buyer) |
| 3. User permissions | buyer.orders.act |
| 4. Screen layout | Dialog over BUY-24 Order detail (buyer): title, context text, fields, footer with secondary action then primary action. Content: Dialog, select, textarea. |
| 5. Components | Dialog, select, textarea |
| 6. Displayed data | "Disputes can be opened until 14 days after receipt is confirmed and never after the supplier is paid out." Window is 14 days from verified delivery (P8-1); buyer confirmation never shortens it (FD-02). |
| 7. Buttons and actions | Primary: Open a dispute · Secondary: Cancel |
| 8. Form fields | Required: Problem, What happened? · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Within window; one open dispute per order. |
| 10. API dependencies | POST /buyer/workspaces/{ws}/orders/{id}/disputes |
| Database entities | disputes, settlements |
| Source files | orders/[orderId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Open a dispute…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Within window; one open dispute per order. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Open a dispute" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: responds in SHR-02 and can add evidence; Platform administrator: decides in ADM-39/ADM-40. |
| Behaviour | Creates dispute OPEN; settlement HELD; routes to SHR-02. |
| Related screens | SHR-02 |
| Dependencies and decisions | P5-3 vs founder (verified delivery) |

Form fields:

  - Problem (select, Required): NOT_RECEIVED, DAMAGED, WRONG_ITEMS, QUANTITY_SHORT, QUALITY, OTHER
  - What happened? (textarea, Required): ≤2000

### BUY-30 · Reorder

| Item | Specification |
|---|---|
| Screen ID | BUY-30 |
| Screen name | Reorder |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Action on BUY-24 (proposed)` |
| Implementation status | Planned · P2 |
| 1. Purpose | Add the lines of a past catalogue order back to the cart at current prices. |
| 2. Navigation location | Opened from BUY-24 Order detail (buyer) |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Inline action on BUY-24 Order detail (buyer); result shown in place. |
| 5. Components | Dialog with diff list |
| 6. Displayed data | Lines with current availability and price changes. |
| 7. Buttons and actions | Primary: Add to cart · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | New POST /buyer/workspaces/{ws}/orders/{id}/reorder |
| Database entities | carts |
| Source files | — |
| 11. Loading state | Button shows progress text and is disabled until the server responds. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Server re-prices; unavailable lines skipped with reason. |
| Related screens | BUY-16 |
| Dependencies and decisions | Gap G-11 |

Form fields:

  - None

### BUY-31 · Request order cancellation (buyer)

| Item | Specification |
|---|---|
| Screen ID | BUY-31 |
| Screen name | Request order cancellation (buyer) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-24 (proposed)` |
| Implementation status | Planned · P0 |
| 1. Purpose | Founder Q12 / FD-09: after payment and before dispatch the buyer can request cancellation. Ready-stock orders go to cancellation and refund review; custom or made-to-order orders are reviewed against production status, the accepted quotation terms, the disclosed cancellation policy and committed costs. Nothing is refunded automatically for custom manufacturing. |
| 2. Navigation location | Opened from BUY-24 Order detail (buyer) |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| 4. Screen layout | Dialog over BUY-24 Order detail (buyer): title, context text, fields, footer with secondary action then primary action. Content: Dialog / bottom sheet, policy excerpt, reason select, textarea, consequence text, danger-styled secondary confirm. |
| 5. Components | Dialog / bottom sheet, policy excerpt, reason select, textarea, consequence text, danger-styled secondary confirm |
| 6. Displayed data | Order number, state (Confirmed or Processing only), order type (ready stock / made to order from quote), supplier return and cancellation policy snapshot, what happens next ("The supplier reviews your request. If it is accepted, finance reviews the refund. You can keep tracking the order meanwhile."). |
| 7. Buttons and actions | Primary: Send cancellation request · Secondary: Keep the order |
| 8. Form fields | Required: Reason, Details, Acknowledge policy · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Order is Confirmed or Processing and not dispatched; one open request per order; not while a supplier cancellation or refund is pending. |
| 10. API dependencies | New (being built): POST /buyer/workspaces/{ws}/orders/{id}/cancellation-requests |
| Database entities | New order_cancellation_requests (reason, details, state, decided_by, decision_reason) + refunds |
| Source files | Not built yet (founder Q12 approved) |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Send cancellation request…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | "This order has already been dispatched, so it cannot be cancelled. You can open a dispute after delivery." / "A cancellation request is already open for this order." / "The supplier is already cancelling this order." |
| 14. Success state | "Cancellation request sent. The supplier will review it." Order shows the "Cancellation requested" badge and a timeline event. |
| 15. Confirmation dialogs | This dialog is the confirmation. For made-to-order items it states: "This order is made to your specification. The supplier may decline or deduct committed production costs, and no refund is automatic." |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: decides in SEL-41; Platform administrator: a second finance user approves any refund (ADM-32, ADM-34); outcome notified in-app and by email. |
| Behaviour | Creates a cancellation request; order shows "Cancellation requested"; supplier is notified and decides in SEL-41; an accepted request creates a refund that a second finance user approves (dual control, ADM-32/ADM-34); a rejected request records the supplier's reason and the buyer can open a dispute after delivery or a support ticket. |
| Related screens | BUY-24, SEL-41, ADM-32, ADM-34, SHR-04 |
| Dependencies and decisions | FD-09 answered (A); founder Q12; legal approval of policies pending |

Form fields:

  - Reason (select, Required): Ordered by mistake; Found a better price; No longer needed; Delivery date too late; Other
  - Details (textarea, Required): 10–2000 characters
  - Acknowledge policy (checkbox, Required): "I have read the supplier's cancellation policy"

## Financial workflows

### BUY-18 · Checkout status and payment

| Item | Specification |
|---|---|
| Screen ID | BUY-18 |
| Screen name | Checkout status and payment |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Pay, resume payment and see the authoritative payment outcome. |
| 2. Navigation location | Buyer sub-nav |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). Pay/cancel need buyer.purchase. |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Status hero (icon + text + badge), countdown, orders list, payment attempts table, sandbox banner, auto-refresh indicator. |
| 5. Components | Status hero (icon + text + badge), countdown, orders list, payment attempts table, sandbox banner, auto-refresh indicator |
| 6. Displayed data | Delivery address selector for quote checkouts that have none yet ("Must be in the emirate the supplier quoted for."); checkout number and state (Awaiting payment / Paid / Expired / Cancelled / Under finance review); pay-by (Dubai); "Stock is held for you until then."; last failed attempt code; orders created; payment attempts with state (Created, With provider, Captured, Failed, Cancelled); state-specific messages (paid, awaiting confirmation, expired, cancelled, reconciliation). |
| 7. Buttons and actions | Primary: Pay now / Return to payment page · Secondary: Cancel checkout; View order; View request |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /buyer/workspaces/{ws}/checkouts/{id}; POST /pay; POST /cancel |
| Database entities | checkouts, payments, orders, reconciliation_cases |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/checkouts/[checkoutId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (BUY-19); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: BUY-19 Cancel checkout dialog. |
| 16. Mobile layout (360px) | Status hero first, actions sticky. |
| 17. Desktop layout (1440px) | Status hero, two columns orders/payments. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: notified only after the provider webhook confirms payment; Platform administrator: late or failed payments in ADM-30 reconciliation. |
| Behaviour | Polls until a terminal state; payment confirmed only from provider webhook (never from redirect). Max 5 attempts. |
| Related screens | BUY-19, FIN-01, BUY-23, BUY-24 |
| Dependencies and decisions | D05 provider |

Form fields:

  - None

### BUY-19 · Cancel checkout dialog

| Item | Specification |
|---|---|
| Screen ID | BUY-19 |
| Screen name | Cancel checkout dialog |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-18` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Cancel an unpaid cart checkout. |
| 2. Navigation location | Opened from BUY-18 Checkout status and payment |
| 3. User permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Cart checkouts in PENDING_PAYMENT only. |
| 4. Screen layout | Dialog over BUY-18 Checkout status and payment: title, context text, fields, footer with secondary action then primary action. Content: Destructive confirm dialog. |
| 5. Components | Destructive confirm dialog |
| 6. Displayed data | "The orders are cancelled and the held stock is released." |
| 7. Buttons and actions | Primary: Cancel checkout · Secondary: Keep checkout |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /buyer/workspaces/{ws}/checkouts/{id}/cancel |
| Database entities | checkouts, orders, reservations |
| Source files | checkouts/[checkoutId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Cancel checkout…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Workspace not active (pending verification, suspended, licence expired): actions disabled with the reason, never hidden. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Cancel checkout" / "Keep checkout"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Orders → CANCELLED (reason cancelled_by_buyer). |
| Related screens | BUY-18 |
| Dependencies and decisions | — |

Form fields:

  - None

### BUY-37 · Invoice draft (order section)

| Item | Specification |
|---|---|
| Screen ID | BUY-37 |
| Screen name | Invoice draft (order section) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `Section of BUY-24 (also SEL-28, ADM-29)` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Non-binding invoice draft per order (P8-11, PR #14). The buyer view never shows commission. |
| 2. Navigation location | Order detail |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). |
| 4. Screen layout | Block inside BUY-24 Order detail (buyer) with its own heading and actions. Content: Card with button "Invoice draft", warning alert, definition list, totals. |
| 5. Components | Card with button "Invoice draft", warning alert, definition list, totals |
| 6. Displayed data | "Draft for review only. This is not a tax invoice…"; supplier and buyer legal names, TRN, VAT registration (not confirmed); lines, delivery, VAT rule and totals. Seller and admin views add "Platform commission (draft)" with rate and "VAT on the commission is pending professional advice". |
| 7. Buttons and actions | Primary: Invoice draft · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /buyer/workspaces/{ws}/orders/{id}/invoice-draft; GET /seller/workspaces/{ws}/orders/{id}/invoice-draft; GET /admin/orders/{id}/invoice-draft |
| Database entities | orders, companies (trn, vat status), commission snapshot |
| Source files | apps/web/src/components/invoice-draft.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Before payment: "An invoice draft is available after payment." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card full width. |
| 17. Desktop layout (1440px) | Card under the order lines. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: same draft plus commission (SEL-28); Platform administrator: ADM-29. |
| Behaviour | Loaded on request. |
| Related screens | BUY-24, SEL-28, ADM-29, BUY-28 |
| Dependencies and decisions | FD-06 answered (A); P8-11 |

Form fields:

  - None

### BUY-28 · Invoices and tax documents (buyer)

| Item | Specification |
|---|---|
| Screen ID | BUY-28 |
| Screen name | Invoices and tax documents (buyer) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/invoices (proposed)` |
| Implementation status | Blocked · P1 |
| 1. Purpose | Download supplier tax invoices and credit notes for orders. Founder chose the disclosed-intermediary model (suppliers invoice buyers) pending professional tax approval; no invoice generation exists. |
| 2. Navigation location | Buyer sub-nav |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Table, download button, empty state. |
| 5. Components | Table, download button, empty state |
| 6. Displayed data | Invoice number, supplier, TRN, order, date, amount, VAT, credit notes. |
| 7. Buttons and actions | Primary: Download invoice · Secondary: Filter by period |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Period, supplier · Newest · Invoice/order number |
| 9. Validation rules | — |
| 10. API dependencies | New invoice endpoints |
| Database entities | New invoices, credit_notes |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card list. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Manufacturers and supplier: SEL-33 Payout account onboarding |
| Behaviour | — |
| Related screens | BUY-24, SEL-33 |
| Dependencies and decisions | Tax approval; D06; Gap G-03; Non-binding drafts per order exist since PR #14 (BUY-37); this list of binding invoices stays blocked until a tax adviser approves (FD-06). |

Form fields:

  - None

### BUY-29 · Payment history (buyer)

| Item | Specification |
|---|---|
| Screen ID | BUY-29 |
| Screen name | Payment history (buyer) |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/payments (proposed)` |
| Implementation status | Recommended · P2 |
| 1. Purpose | One list of all payments and refunds for the workspace (today visible only inside each checkout/order). |
| 2. Navigation location | Buyer sub-nav |
| 3. User permissions | Any member of the buyer workspace (buyer.orders.read). |
| 4. Screen layout | Workspace shell: top bar (text logo placeholder, workspace switcher, notifications, language EN/AR, account) and the buyer sub-nav; sandbox banner on money screens. Page header (title, status badge, primary action). Content: Table, status badge, sandbox label. |
| 5. Components | Table, status badge, sandbox label |
| 6. Displayed data | Date, checkout, amount, state, refunds. |
| 7. Buttons and actions | Primary: Open checkout · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State, period · Newest · — |
| 9. Validation rules | — |
| 10. API dependencies | New GET /buyer/workspaces/{ws}/payments |
| Database entities | payments, refunds |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Cards. |
| 17. Desktop layout (1440px) | Table. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Platform administrator: refunds approved in ADM-34 appear here. |
| Behaviour | — |
| Related screens | BUY-18 |
| Dependencies and decisions | — |

Form fields:

  - None

### FIN-01 · Sandbox payment page

| Item | Specification |
|---|---|
| Screen ID | FIN-01 |
| Screen name | Sandbox payment page |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/sandbox-pay/[sessionId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Development-only stand-in for a hosted payment page. Clearly labelled; no card is charged and no money moves. |
| 2. Navigation location | Reached from checkout (BUY-17 / BUY-18) |
| 3. User permissions | Checkout owner roles; PAYMENT_MODE=mock only; production refuses to start in mock mode. |
| 4. Screen layout | Minimal shell with the order summary; sandbox banner where applicable. Page header (title, status badge, primary action). Content: Sandbox banner, amount summary, two buttons. |
| 5. Components | Sandbox banner, amount summary, two buttons |
| 6. Displayed data | "Sandbox payments: no real money" banner, amount in AED, checkout reference, buttons to simulate success or failure. |
| 7. Buttons and actions | Primary: Simulate successful payment · Secondary: Simulate failed payment; Back to checkout |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /sandbox/psp/sessions/{id}; POST /sandbox/psp/sessions/{id}/complete |
| Database entities | payments, webhook_events |
| Source files | apps/web/src/app/[locale]/sandbox-pay/[sessionId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full-width card. |
| 17. Desktop layout (1440px) | Narrow centred card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | Calls the sandbox completion which emits a signed webhook; the checkout page then reflects the result. |
| Related screens | BUY-18 |
| Dependencies and decisions | D05 |

Form fields:

  - None

### FIN-02 · Live payment provider checkout

| Item | Specification |
|---|---|
| Screen ID | FIN-02 |
| Screen name | Live payment provider checkout |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Provider-hosted page (external)` |
| Implementation status | Blocked · P0 |
| 1. Purpose | Real card / Apple Pay payment on the provider's hosted page (founder prefers Stripe Connect, Mamo fallback). Not connected; needs founder approval, accounts and credentials. |
| 2. Navigation location | Reached from checkout (BUY-17 / BUY-18) |
| 3. User permissions | As FIN-01 |
| 4. Screen layout | Provider-hosted page outside the product; not designed here beyond the hand-off and return screens. |
| 5. Components | External; we design only the hand-off and return states |
| 6. Displayed data | Provider UI; our return page is BUY-18. |
| 7. Buttons and actions | Primary: Pay (on provider) · Secondary: Back to marketplace |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | Provider adapter (not built) |
| Database entities | payments |
| Source files | — |
| 11. Loading state | Handled by the provider; on return BUY-18 shows "Checking payment…" while it polls. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | — |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | BUY-18 |
| Dependencies and decisions | Phase 8 approval; provider onboarding |

Form fields:

  - None

### FIN-03 · Bank transfer instructions

| Item | Specification |
|---|---|
| Screen ID | FIN-03 |
| Screen name | Bank transfer instructions |
| Experience | Business buyers |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId] (proposed state)` |
| Implementation status | Blocked · P1 |
| 1. Purpose | Founder listed bank transfer as a method. Needs provider support, reference handling and reconciliation; nothing exists. |
| 2. Navigation location | Reached from checkout (BUY-17 / BUY-18) |
| 3. User permissions | As FIN-01 |
| 4. Screen layout | Minimal shell with the order summary; sandbox banner where applicable. Page header (title, status badge, primary action). Content: Instructions card, copy buttons, deadline. |
| 5. Components | Instructions card, copy buttons, deadline |
| 6. Displayed data | Beneficiary, IBAN, unique reference, amount, deadline, reconciliation notice. |
| 7. Buttons and actions | Primary: Copy reference · Secondary: Download instructions |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: this screen shows only the company's own data; other companies and platform staff do not see it. |
| Behaviour | — |
| Related screens | BUY-18 |
| Dependencies and decisions | Provider choice; reconciliation UI (ADM-31) |

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

### MSG-03 · New message to supplier

| Item | Specification |
|---|---|
| Screen ID | MSG-03 |
| Screen name | New message to supplier |
| Experience | Business buyers |
| User roles | Approved buyer OWNER/PROCUREMENT |
| Route / URL | `/{locale}/app/messages/new?storefront=…` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Start (or continue) a conversation from a storefront or quote. |
| 2. Navigation location | → MSG-02 |
| 3. User permissions | Approved buyer workspace |
| 4. Screen layout | Workspace shell (top bar); messages use a two-pane layout on desktop. Page header (title, status badge, primary action). Content: Form, textarea. |
| 5. Components | Form, textarea |
| 6. Displayed data | Supplier name, message field; "A buyer workspace is needed" when not eligible. |
| 7. Buttons and actions | Primary: Send · Secondary: Cancel |
| 8. Form fields | Required: Your message · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /workspaces/{ws}/conversations |
| Database entities | conversations |
| Source files | app/messages/new/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Send…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Full page. |
| 17. Desktop layout (1440px) | Narrow form. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: the new conversation appears in their MSG-01. |
| Behaviour | Reuses an existing conversation for the pair. |
| Related screens | PUB-10, BUY-03 |
| Dependencies and decisions | A12 |

Form fields:

  - Your message (textarea, Required): 1–4000

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
