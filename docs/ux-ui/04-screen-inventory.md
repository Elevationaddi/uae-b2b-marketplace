# 4. Complete screen inventory

Status legend: **Implemented** (on `main`, tested) · **Partial** (works but incomplete or conflicts with a founder decision) · **Planned** (approved or required, not built) · **Recommended** (proposed by this audit) · **Blocked** (needs external approval, provider or legal input). Priority: **P0** essential for launch · **P1** important for launch · **P2** post-launch.

**213 individually numbered screens**, organised by experience: Part A business buyers (40), Part B manufacturers and suppliers (41), Part C platform administrators (63) and Part D shared, public and system screens (69) used by more than one experience. Each screen appears once here. The standalone experience documents in `experiences/` repeat the full specification of every screen a role uses, including shared ones, so each experience can be designed independently. IDs are stable and used across the sitemap, journeys, checklist, handoff map and spreadsheets. Routes are prefixed with `/{locale}` (`/en` or `/ar`); admin routes are served from the separate admin origin. "Recommended", "Planned" and "Blocked" screens are included so the designer can plan them, but they do not exist in the code.

Each screen is specified with the 19 items the founder asked for on 28 November 2026 (numbered 1–19 in every table), plus route, status, data entities, source files and decisions. Loading, empty, error, success and confirmation behaviour follows the shared contract in section 18; where a screen has its own copy, it is quoted. Arabic and RTL rules follow section 20. Interactions with other roles name the screens where the other side sees or acts on the same record.

## 4.1 Totals

| Measure | Count |
|---|---|
| Unique screens | 213 |
| Status: Implemented | 162 |
| Status: Partial | 4 |
| Status: Planned | 21 |
| Status: Recommended | 14 |
| Status: Blocked | 12 |
| Priority: P0 | 129 |
| Priority: P1 | 61 |
| Priority: P2 | 23 |
| Type: Action | 2 |
| Type: Dialog | 43 |
| Type: Drawer | 1 |
| Type: External page | 1 |
| Type: Overlay | 3 |
| Type: Page | 134 |
| Type: Section | 29 |
| Screens used by business buyers (incl. shared) | 108 |
| Screens used by manufacturers and suppliers (incl. shared) | 109 |
| Screens used by platform administrators (incl. shared) | 67 |


| Area | Screens |
|---|---|
| Public website | 23 |
| Public website (signed-in) | 4 |
| Authentication | 9 |
| Authentication (admin) | 4 |
| Account management | 18 |
| Communication | 5 |
| Buyer workspace | 37 |
| Shared (buyer + seller) | 6 |
| Payment | 3 |
| Seller workspace | 41 |
| Admin portal | 59 |
| System | 4 |


## 4.2 Screens added or changed by the founder decisions of 28 November 2026

| ID | Screen | Experience | Status | Decision |
|---|---|---|---|---|
| ACC-19 | VAT registration (company section) | Business buyers, Manufacturers and suppliers | Implemented · P0 | P8-10; FD-06 |
| ACC-18 | Policy acceptance and re-acceptance (clickwrap) | Business buyers, Manufacturers and suppliers | Blocked · P0 | FD-16 answered (A); legal adviser pending; Gap G-19 |
| BUY-01 | Buyer dashboard | Business buyers | Planned · P0 | FD-21 (answered: B); Gap G-01; BUY-33 for the spending section |
| BUY-33 | Monthly spending (buyer dashboard section) | Business buyers | Planned · P0 | FD-21 answered (B) |
| BUY-03 | New request for quotation | Business buyers | Implemented · P0 | P3-2, P3-3; FD-11 answered (A); FD-13 answered (B: sample requests are an RFQ type). |
| BUY-34 | Negotiation history and revision changes | Business buyers | Planned · P0 | FD-10 answered (C); C-14 |
| BUY-15 | Counteroffer to supplier | Business buyers | Planned · P0 | FD-10 answered (C); C-14 |
| BUY-35 | Delivery method selection (checkout section) | Business buyers | Planned · P0 | FD-08 answered (A); C-10 |
| BUY-36 | Collection instructions (order section) | Business buyers | Planned · P1 | FD-08 answered (A) |
| BUY-37 | Invoice draft (order section) | Business buyers | Implemented · P1 | FD-06 answered (A); P8-11 |
| BUY-25 | Confirm receipt dialog | Business buyers | Implemented · P0 | FD-02 answered (A); P8-1, P8-2 |
| BUY-31 | Request order cancellation (buyer) | Business buyers | Planned · P0 | FD-09 answered (A); founder Q12; legal approval of policies pending |
| BUY-32 | Request a sample | Business buyers | Planned · P1 | FD-13 answered (B) |
| SEL-04 | Delivery terms | Manufacturers and suppliers | Partial · P0 | FD-08 answered (A); C-10 (being built) |
| SEL-39 | Sample settings (product section) | Manufacturers and suppliers | Planned · P1 | FD-13 answered (B) |
| SEL-22 | Quote form | Manufacturers and suppliers | Implemented · P0 | Quote validity default (founder 7 days); tax treatment; FD-12 answered (A); P8-10. |
| SEL-40 | Respond to a counteroffer | Manufacturers and suppliers | Planned · P0 | FD-10 answered (C); C-14 |
| SEL-28 | Order detail (seller) | Manufacturers and suppliers | Implemented · P0 | Commission policy versioned and snapshotted per order (PR #13, P8-6); FD-08, FD-09 answered |
| SEL-30 | Report delivery dialog | Manufacturers and suppliers | Implemented · P0 | FD-03 answered (A); P8-1 |
| SEL-32 | Seller finance | Manufacturers and suppliers | Implemented · P0 | P8-5 weekly payout run (PR #13); FD-04 answered; FD-05 commission notice |
| SEL-41 | Review a buyer cancellation request | Manufacturers and suppliers | Planned · P0 | Founder Q12; FD-09 answered (A) |
| ADM-54 | Confirm VAT status dialog | Platform administrators | Implemented · P0 | P8-10 |
| ADM-55 | Support ticket limit exception | Platform administrators | Implemented · P1 | FD-14 answered (A); P8-13 |
| ADM-35 | Payouts | Platform administrators | Implemented · P0 | P8-5 weekly payout run (PR #13); FD-01 and FD-04 answered; earlier conflict P5-5 resolved |
| ADM-59 | Delivery proof review | Platform administrators | Planned · P1 | FD-03 answered (A) |
| ADM-47 | Platform settings: payout schedule and policy windows | Platform administrators | Planned · P1 | FD-04 answered; P8-5 |
| ADM-56 | Commission policy | Platform administrators | Implemented · P0 | FD-05 answered (A); P8-6 |
| ADM-57 | Settlement holds | Platform administrators | Implemented · P0 | P8-4 |
| ADM-58 | Release hold dialog | Platform administrators | Implemented · P0 | P8-4 |


## 4.3 Index

| ID | Screen | Part | Roles | Route | Type | Status | Priority |
|---|---|---|---|---|---|---|---|
| PUB-01 | Marketplace home | Part D | Guest, verified user, all company users | `/{locale}` | Page | Implemented | P0 |
| PUB-02 | Category directory | Part D | Guest, verified user | `/{locale}/categories` | Page | Implemented | P0 |
| PUB-03 | Category page | Part D | Guest, verified user | `/{locale}/categories/[id]` | Page | Implemented | P0 |
| PUB-04 | Search results | Part D | Guest, verified user | `/{locale}/search?q=&…` | Page | Implemented | P0 |
| PUB-05 | Filter panel / mobile filter sheet | Part D | Guest, verified user | `Overlay on PUB-03/PUB-04` | Overlay | Partial | P0 |
| PUB-06 | Search suggestions dropdown | Part D | Guest, verified user | `Overlay on header search` | Overlay | Implemented | P1 |
| PUB-07 | Product detail | Part D | Guest, verified user, approved buyer (OWNER/PROCUREMENT) | `/{locale}/products/[id]` | Page | Implemented | P0 |
| PUB-08 | Product image viewer (lightbox) | Part D | All marketplace viewers | `Overlay on PUB-07` | Overlay | Recommended | P1 |
| PUB-09 | Supplier directory | Part D | Guest, verified user | `/{locale}/suppliers` | Page | Implemented | P0 |
| PUB-10 | Supplier storefront (manufacturer profile) | Part D | Guest, verified user, approved buyer | `/{locale}/suppliers/[id]` | Page | Implemented | P0 |
| PUB-11 | Saved products and suppliers | Part D | Email-verified user | `/{locale}/saved` | Page | Implemented | P1 |
| PUB-12 | Product comparison | Part D | Email-verified user | `/{locale}/compare` | Page | Implemented | P1 |
| PUB-13 | Recently viewed | Part D | Email-verified user | `/{locale}/recent` | Page | Implemented | P2 |
| PUB-14 | Marketplace preferences | Part D | Email-verified user | `/{locale}/preferences` | Page | Implemented | P2 |
| PUB-15 | System status | Part D | Anyone | `/{locale}/status` | Page | Implemented | P2 |
| PUB-16 | About the platform | Part D | Anyone | `/{locale}/about (recommended)` | Page | Recommended | P1 |
| PUB-17 | How it works | Part D | Anyone | `/{locale}/how-it-works (recommended)` | Page | Recommended | P1 |
| PUB-18 | Pricing and fees | Part D | Anyone | `/{locale}/pricing (recommended)` | Page | Recommended | P1 |
| PUB-19 | Frequently asked questions | Part D | Anyone | `/{locale}/faq (recommended)` | Page | Recommended | P1 |
| PUB-20 | Help centre | Part D | Anyone; signed-in users see ticket shortcut | `/{locale}/help (recommended)` | Page | Recommended | P2 |
| PUB-21 | Contact | Part D | Anyone | `/{locale}/contact (recommended)` | Page | Recommended | P1 |
| PUB-22 | Terms and conditions | Part D | Anyone | `/{locale}/legal/terms (recommended)` | Page | Blocked | P0 |
| PUB-23 | Privacy policy | Part D | Anyone | `/{locale}/legal/privacy (recommended)` | Page | Blocked | P0 |
| PUB-24 | Returns, refunds and cancellation policy | Part D | Anyone | `/{locale}/legal/returns (recommended)` | Page | Blocked | P0 |
| PUB-25 | Other policy pages (template) | Part D | Anyone | `/{locale}/legal/[slug] (recommended)` | Page | Blocked | P1 |
| PUB-26 | Become a supplier | Part D | Anyone | `/{locale}/sell (recommended)` | Page | Recommended | P1 |
| PUB-27 | Site footer and legal centre | Part D | Anyone | `Global footer` | Page | Recommended | P0 |
| AUTH-01 | Create account (register) | Part D | Guest | `/{locale}/register` | Page | Implemented | P0 |
| AUTH-02 | Check your email | Part D | Guest | `/{locale}/register (success state)` | Page | Implemented | P0 |
| AUTH-03 | Verify email | Part D | Guest or signed-in user | `/{locale}/verify-email#token=…` | Page | Implemented | P0 |
| AUTH-04 | Sign in | Part D | Company user | `/{locale}/login?next=` | Page | Implemented | P0 |
| AUTH-05 | Forgot password | Part D | Guest | `/{locale}/forgot-password` | Page | Implemented | P0 |
| AUTH-06 | Reset password | Part D | Guest | `/{locale}/reset-password#token=…` | Page | Implemented | P0 |
| AUTH-07 | Email verification gate | Part D | Signed-in, unverified user | `Any /app route before verification` | Page | Implemented | P0 |
| AUTH-08 | Accept team invitation | Part D | Invitee (guest or signed-in) | `/{locale}/invitations/accept#token=…` | Page | Implemented | P0 |
| AUTH-09 | Session expired / signed out | Part D | Company user | `Redirect to /{locale}/login?next=` | Page | Partial | P1 |
| AUTH-10 | Admin sign in | Part C | Platform staff | `/{locale}/admin/login (admin origin only)` | Page | Implemented | P0 |
| AUTH-11 | Admin MFA enrolment | Part C | Platform staff (first sign-in) | `/{locale}/admin/mfa` | Page | Implemented | P0 |
| AUTH-12 | Admin recovery codes | Part C | Platform staff | `/{locale}/admin/mfa (step)` | Page | Implemented | P0 |
| AUTH-13 | Admin MFA verification | Part C | Platform staff | `/{locale}/admin/mfa (verify)` | Page | Implemented | P0 |
| ACC-01 | Home (workspace hub) | Part D | All company users | `/{locale}/app` | Page | Implemented | P0 |
| ACC-02 | Register a company (onboarding) | Part D | Verified user | `/{locale}/app/onboarding` | Page | Implemented | P0 |
| ACC-03 | Company profile and verification | Part D | All company members (edit: OWNER) | `/{locale}/app/company/[companyId]` | Page | Implemented | P0 |
| ACC-04 | Edit company details | Part D | OWNER | `Mode of ACC-03` | Page | Implemented | P0 |
| ACC-05 | Verification document upload | Part D | OWNER | `Section of ACC-03` | Section | Implemented | P0 |
| ACC-06 | Submit for verification (terms) | Part D | OWNER | `Section of ACC-03` | Section | Implemented | P0 |
| ACC-07 | Licence renewal | Part D | OWNER | `Section of ACC-03` | Section | Implemented | P0 |
| ACC-19 | VAT registration (company section) | Part D | Company OWNER (edit); members (view) | `Section of ACC-03 / ACC-04` | Section | Implemented | P0 |
| ACC-08 | Remove document dialog | Part D | OWNER | `Dialog on ACC-03` | Dialog | Implemented | P1 |
| ACC-09 | Team management | Part D | All members (manage: OWNER) | `/{locale}/app/team/[workspaceId]` | Page | Implemented | P0 |
| ACC-10 | Invite team member form | Part D | OWNER | `Section of ACC-09` | Section | Implemented | P0 |
| ACC-11 | Change role dialog | Part D | OWNER | `Dialog on ACC-09` | Dialog | Implemented | P1 |
| ACC-12 | Remove access dialog | Part D | OWNER | `Dialog on ACC-09` | Dialog | Implemented | P1 |
| ACC-13 | Account settings | Part D | All company users | `/{locale}/app/settings` | Page | Implemented | P0 |
| ACC-14 | Notification centre | Part D | All company users | `/{locale}/app/notifications` | Page | Implemented | P0 |
| ACC-15 | Workspace switcher | Part D | Users with more than one workspace | `Header control (all /app pages)` | Page | Implemented | P0 |
| ACC-16 | Account closure and data requests | Part D | User; OWNER for company | `Not built` | Page | Planned | P1 |
| ACC-17 | Billing, invoices and statements | Part D | Buyer OWNER/PROCUREMENT; seller OWNER/FINANCE | `Not built (spec /account/billing, /finance/invoices)` | Page | Blocked | P0 |
| ACC-18 | Policy acceptance and re-acceptance (clickwrap) | Part D | All company users | `Dialog shown at sign-in when a material policy version changes; checkbox on AUTH-03, ACC-06 and BUY-17` | Dialog | Blocked | P0 |
| MSG-01 | Conversations list | Part D | Buyer OWNER/PROCUREMENT; seller OWNER/SALES | `/{locale}/app/messages/[workspaceId]` | Page | Implemented | P0 |
| MSG-02 | Conversation thread | Part D | Buyer OWNER/PROCUREMENT; seller OWNER/SALES | `/{locale}/app/messages/[workspaceId]/[conversationId]` | Page | Implemented | P0 |
| MSG-03 | New message to supplier | Part D | Approved buyer OWNER/PROCUREMENT | `/{locale}/app/messages/new?storefront=…` | Page | Implemented | P1 |
| MSG-04 | Message attachments | Part D | Messaging roles | `Part of MSG-02` | Section | Planned | P1 |
| SYS-01 | Not found / not available | Part D | All | `Any unknown or inaccessible resource` | Page | Implemented | P0 |
| SYS-02 | Error with retry and reference | Part D | All | `Any failed load or action` | Page | Implemented | P0 |
| SYS-03 | Sandbox environment banner | Part D | All | `Global (top of every page)` | Page | Implemented | P0 |
| SYS-04 | Trading unavailable / maintenance | Part D | All | `Recommended` | Page | Recommended | P2 |
| BUY-01 | Buyer dashboard | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]` | Page | Planned | P0 |
| BUY-33 | Monthly spending (buyer dashboard section) | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `Section of BUY-01` | Section | Planned | P0 |
| BUY-02 | Requests for quotation list | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/rfqs` | Page | Implemented | P0 |
| BUY-03 | New request for quotation | Part A | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/rfqs/new` | Page | Implemented | P0 |
| BUY-04 | Request quotation entry (workspace chooser) | Part A | Any signed-in user | `/{locale}/app/rfqs/new` | Page | Implemented | P1 |
| BUY-05 | Request for quotation detail (buyer) | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId]` | Page | Implemented | P0 |
| BUY-06 | Edit request draft | Part A | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId] (edit mode)` | Page | Implemented | P0 |
| BUY-07 | Publish request dialog | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-08 | Cancel request dialog | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-09 | Invite suppliers picker | Part A | Buyer OWNER, PROCUREMENT | `Panel in BUY-03/BUY-06` | Section | Implemented | P0 |
| BUY-10 | Quote comparison | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `Section of BUY-05` | Section | Implemented | P0 |
| BUY-11 | Quote detail and version history | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `Expandable within BUY-05` | Section | Implemented | P0 |
| BUY-34 | Negotiation history and revision changes | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `Section of BUY-05 (per supplier)` | Section | Planned | P0 |
| BUY-12 | Accept quote dialog | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-13 | Request revision dialog | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-14 | Decline quote dialog | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-15 | Counteroffer to supplier | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05 (proposed)` | Dialog | Planned | P0 |
| BUY-16 | Cart | Part A | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/cart` | Page | Implemented | P0 |
| BUY-17 | Checkout | Part A | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/checkout` | Page | Implemented | P0 |
| BUY-35 | Delivery method selection (checkout section) | Part A | Buyer OWNER, PROCUREMENT | `Section of BUY-17 (per supplier group)` | Section | Planned | P0 |
| BUY-18 | Checkout status and payment | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId]` | Page | Implemented | P0 |
| BUY-19 | Cancel checkout dialog | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-18` | Dialog | Implemented | P0 |
| BUY-20 | Delivery addresses | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/addresses` | Page | Implemented | P0 |
| BUY-21 | Address form | Part A | Buyer OWNER, PROCUREMENT | `Form on BUY-20` | Section | Implemented | P0 |
| BUY-22 | Remove address dialog | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-20` | Dialog | Implemented | P1 |
| BUY-23 | Orders list (buyer) | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/orders` | Page | Implemented | P0 |
| BUY-24 | Order detail (buyer) | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/orders/[orderId]` | Page | Implemented | P0 |
| BUY-36 | Collection instructions (order section) | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `Section of BUY-24` | Section | Planned | P1 |
| BUY-37 | Invoice draft (order section) | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `Section of BUY-24 (also SEL-28, ADM-29)` | Section | Implemented | P1 |
| BUY-25 | Confirm receipt dialog | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-24` | Dialog | Implemented | P0 |
| BUY-26 | Rate supplier form | Part A | Buyer OWNER, PROCUREMENT | `Section of BUY-24` | Section | Implemented | P1 |
| BUY-27 | Open dispute form (buyer) | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-24` | Dialog | Implemented | P0 |
| BUY-28 | Invoices and tax documents (buyer) | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/invoices (proposed)` | Page | Blocked | P1 |
| BUY-29 | Payment history (buyer) | Part A | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/payments (proposed)` | Page | Recommended | P2 |
| BUY-30 | Reorder | Part A | Buyer OWNER, PROCUREMENT | `Action on BUY-24 (proposed)` | Action | Planned | P2 |
| BUY-31 | Request order cancellation (buyer) | Part A | Buyer OWNER, PROCUREMENT | `Dialog on BUY-24 (proposed)` | Dialog | Planned | P0 |
| BUY-32 | Request a sample | Part A | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/rfqs/new?type=sample&product={id} (from PUB-07 or PUB-10)` | Page | Planned | P1 |
| SHR-01 | Disputes list | Part D | Buyer and seller workspace members | `/{locale}/app/buyer/[workspaceId]/disputes and /{locale}/app/seller/[workspaceId]/disputes` | Page | Implemented | P0 |
| SHR-02 | Dispute detail | Part D | Buyer and seller workspace members | `/{locale}/app/buyer/[workspaceId]/disputes/[disputeId] and /{locale}/app/seller/[workspaceId]/disputes/[disputeId]` | Page | Implemented | P0 |
| SHR-03 | Support tickets list | Part D | Any workspace member | `/{locale}/app/buyer/[workspaceId]/support and /{locale}/app/seller/[workspaceId]/support` | Page | Implemented | P1 |
| SHR-04 | New support ticket | Part D | Workspace members except VIEWER | `/{locale}/app/buyer/[workspaceId]/support/new and /{locale}/app/seller/[workspaceId]/support/new` | Page | Implemented | P1 |
| SHR-05 | Support ticket detail | Part D | Any workspace member | `/{locale}/app/buyer/[workspaceId]/support/[ticketId] and /{locale}/app/seller/[workspaceId]/support/[ticketId]` | Page | Implemented | P1 |
| SHR-06 | Close or reopen ticket dialog | Part D | Workspace members except VIEWER | `Dialog on SHR-05` | Dialog | Implemented | P2 |
| FIN-01 | Sandbox payment page | Part A | Buyer OWNER, PROCUREMENT | `/{locale}/sandbox-pay/[sessionId]` | Page | Implemented | P0 |
| FIN-02 | Live payment provider checkout | Part A | Buyer OWNER, PROCUREMENT | `Provider-hosted page (external)` | External page | Blocked | P0 |
| FIN-03 | Bank transfer instructions | Part A | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId] (proposed state)` | Page | Blocked | P1 |
| SEL-01 | Seller overview (dashboard) | Part B | Seller OWNER, SALES, WAREHOUSE, FINANCE, VIEWER | `/{locale}/app/seller/[workspaceId]` | Page | Implemented | P0 |
| SEL-02 | Storefront editor | Part B | Seller OWNER, SALES (edit); others read | `/{locale}/app/seller/[workspaceId]/storefront` | Page | Implemented | P0 |
| SEL-03 | Storefront media manager | Part B | Seller OWNER, SALES | `Section of SEL-02` | Section | Implemented | P1 |
| SEL-04 | Delivery terms | Part B | Seller OWNER, SALES | `Section of SEL-02` | Section | Partial | P0 |
| SEL-05 | Publish or take storefront offline dialog | Part B | Seller OWNER, SALES | `Dialog on SEL-02` | Dialog | Implemented | P1 |
| SEL-06 | Product list | Part B | Seller workspace members | `/{locale}/app/seller/[workspaceId]/products` | Page | Implemented | P0 |
| SEL-07 | Add product | Part B | Seller OWNER, SALES | `/{locale}/app/seller/[workspaceId]/products/new` | Page | Implemented | P0 |
| SEL-08 | Product editor (content) | Part B | Seller OWNER, SALES (edit); others read | `/{locale}/app/seller/[workspaceId]/products/[productId]` | Page | Implemented | P0 |
| SEL-09 | Product media manager | Part B | Seller OWNER, SALES | `Section of SEL-08` | Section | Implemented | P0 |
| SEL-10 | Variants (SKU) manager | Part B | Seller OWNER, SALES | `Section of SEL-08` | Section | Implemented | P0 |
| SEL-11 | Product pricing editor | Part B | Seller OWNER, SALES | `Section of SEL-08` | Section | Implemented | P0 |
| SEL-12 | Submit for review dialog | Part B | Seller OWNER, SALES | `Dialog on SEL-08` | Dialog | Implemented | P0 |
| SEL-13 | Listing lifecycle dialogs | Part B | Seller OWNER, SALES | `Dialogs on SEL-08` | Dialog | Implemented | P1 |
| SEL-14 | Moderation history | Part B | Seller workspace members | `Section of SEL-08` | Section | Implemented | P1 |
| SEL-39 | Sample settings (product section) | Part B | Seller OWNER, SALES | `Section of SEL-08` | Section | Planned | P1 |
| SEL-15 | Inventory | Part B | Seller workspace members | `/{locale}/app/seller/[workspaceId]/inventory` | Page | Implemented | P0 |
| SEL-16 | Stock adjustment dialog | Part B | Seller OWNER, SALES, WAREHOUSE | `Dialog on SEL-15` | Dialog | Implemented | P0 |
| SEL-17 | Low-stock threshold and restock date | Part B | Seller OWNER, SALES, WAREHOUSE | `Inline form on SEL-15` | Section | Implemented | P2 |
| SEL-18 | Stock movement history | Part B | Seller workspace members | `Drawer on SEL-15` | Drawer | Implemented | P1 |
| SEL-19 | Pricing overview | Part B | Seller workspace members | `/{locale}/app/seller/[workspaceId]/pricing` | Page | Implemented | P1 |
| SEL-20 | Quotation requests inbox | Part B | Seller workspace members | `/{locale}/app/seller/[workspaceId]/rfqs` | Page | Implemented | P0 |
| SEL-21 | Request detail (seller) | Part B | Seller workspace members | `/{locale}/app/seller/[workspaceId]/rfqs/[rfqId]` | Page | Implemented | P0 |
| SEL-22 | Quote form | Part B | Seller OWNER, SALES | `Form on SEL-21` | Section | Implemented | P0 |
| SEL-23 | Submit quote dialog | Part B | Seller OWNER, SALES | `Dialog on SEL-21` | Dialog | Implemented | P0 |
| SEL-24 | Withdraw quote dialog | Part B | Seller OWNER, SALES | `Dialog on SEL-21` | Dialog | Implemented | P1 |
| SEL-25 | Ask the buyer a question | Part B | Seller OWNER, SALES | `Dialog on SEL-21` | Dialog | Implemented | P1 |
| SEL-40 | Respond to a counteroffer | Part B | Seller OWNER, SALES | `Section of SEL-21` | Section | Planned | P0 |
| SEL-26 | Quotes list (seller) | Part B | Seller workspace members | `/{locale}/app/seller/[workspaceId]/quotes` | Page | Implemented | P1 |
| SEL-27 | Orders list (seller) | Part B | Seller workspace members | `/{locale}/app/seller/[workspaceId]/orders` | Page | Implemented | P0 |
| SEL-28 | Order detail (seller) | Part B | Seller workspace members | `/{locale}/app/seller/[workspaceId]/orders/[orderId]` | Page | Implemented | P0 |
| SEL-29 | Record dispatch dialog | Part B | Seller OWNER, SALES, WAREHOUSE | `Dialog on SEL-28` | Dialog | Partial | P0 |
| SEL-30 | Report delivery dialog | Part B | Seller OWNER, SALES, WAREHOUSE | `Dialog on SEL-28` | Dialog | Implemented | P0 |
| SEL-31 | Open dispute (seller) | Part B | Seller OWNER, SALES, WAREHOUSE | `Dialog on SEL-28` | Dialog | Implemented | P2 |
| SEL-32 | Seller finance | Part B | Seller OWNER, FINANCE | `/{locale}/app/seller/[workspaceId]/finance` | Page | Implemented | P0 |
| SEL-33 | Payout account onboarding | Part B | Seller OWNER, FINANCE | `/{locale}/app/seller/[workspaceId]/finance/payout-account (proposed)` | Page | Blocked | P0 |
| SEL-34 | Statements and commission invoices | Part B | Seller OWNER, FINANCE | `/{locale}/app/seller/[workspaceId]/finance/statements (proposed)` | Page | Blocked | P1 |
| SEL-35 | Seller analytics | Part B | Seller OWNER, SALES, FINANCE | `/{locale}/app/seller/[workspaceId]/analytics (proposed)` | Page | Planned | P2 |
| SEL-36 | Supplier order cancellation | Part B | Seller OWNER, WAREHOUSE | `Dialog on SEL-28` | Dialog | Implemented | P0 |
| SEL-41 | Review a buyer cancellation request | Part B | Seller OWNER, WAREHOUSE (proposed: same capability as supplier cancellation) | `Dialog on SEL-28` | Dialog | Planned | P0 |
| SEL-37 | Returns handling | Part B | Seller OWNER, SALES, WAREHOUSE | `/{locale}/app/seller/[workspaceId]/returns (proposed)` | Page | Planned | P2 |
| SEL-38 | Production milestones (made to order) | Part B | Seller OWNER, SALES, WAREHOUSE | `Section of SEL-28 (proposed)` | Section | Recommended | P2 |
| ADM-01 | Admin overview and operations | Part C | All admin roles (content varies by capability) | `/{locale}/admin` | Page | Implemented | P0 |
| ADM-02 | Verification queue | Part C | COMPLIANCE | `/{locale}/admin/verification` | Page | Implemented | P0 |
| ADM-03 | Verification case detail | Part C | COMPLIANCE | `/{locale}/admin/verification/[caseId]` | Page | Implemented | P0 |
| ADM-04 | Verification decision dialog | Part C | COMPLIANCE | `Dialog on ADM-03` | Dialog | Implemented | P0 |
| ADM-05 | Companies | Part C | COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN | `/{locale}/admin/companies` | Page | Implemented | P0 |
| ADM-06 | Company detail (admin) | Part C | Admin roles with companies.read | `/{locale}/admin/companies/[companyId]` | Page | Implemented | P0 |
| ADM-07 | Suspend or reactivate company dialog | Part C | COMPLIANCE | `Dialog on ADM-06` | Dialog | Implemented | P0 |
| ADM-54 | Confirm VAT status dialog | Part C | COMPLIANCE (admin.verification.review) | `Dialog on ADM-06` | Dialog | Implemented | P0 |
| ADM-55 | Support ticket limit exception | Part C | SUPPORT (admin.support.manage) | `Section of ADM-06` | Section | Implemented | P1 |
| ADM-08 | Users | Part C | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/users` | Page | Implemented | P1 |
| ADM-09 | Revoke sessions dialog | Part C | COMPLIANCE, SUPER_ADMIN | `Dialog on ADM-08` | Dialog | Implemented | P1 |
| ADM-10 | Catalogue moderation overview | Part C | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog` | Page | Implemented | P0 |
| ADM-11 | Moderation queue | Part C | COMPLIANCE (decide); SUPPORT, SUPER_ADMIN (read) | `/{locale}/admin/catalog (queue section)` | Page | Implemented | P0 |
| ADM-12 | Listing version review (diff) | Part C | COMPLIANCE | `/{locale}/admin/catalog/reviews/[versionId]` | Page | Implemented | P0 |
| ADM-13 | Review decision dialog | Part C | COMPLIANCE | `Dialog on ADM-12` | Dialog | Implemented | P0 |
| ADM-14 | All listings | Part C | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog/products` | Page | Implemented | P1 |
| ADM-15 | Listing detail (admin) | Part C | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog/products/[id]` | Page | Implemented | P1 |
| ADM-16 | Listing enforcement dialog | Part C | COMPLIANCE | `Dialog on ADM-15` | Dialog | Implemented | P1 |
| ADM-17 | Storefront oversight | Part C | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog/storefronts` | Page | Implemented | P1 |
| ADM-18 | Storefront detail (admin) | Part C | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog/storefronts/[id] (proposed)` | Page | Planned | P2 |
| ADM-19 | Hide or restore storefront dialog | Part C | COMPLIANCE | `Dialog on ADM-17` | Dialog | Implemented | P1 |
| ADM-20 | Categories | Part C | COMPLIANCE, SUPER_ADMIN (manage); others read | `/{locale}/admin/catalog/categories` | Page | Implemented | P1 |
| ADM-21 | Category editor | Part C | COMPLIANCE, SUPER_ADMIN | `/{locale}/admin/catalog/categories/[id]` | Page | Implemented | P1 |
| ADM-22 | Category attribute editor | Part C | COMPLIANCE, SUPER_ADMIN | `Dialog on ADM-21` | Dialog | Implemented | P2 |
| ADM-23 | Restricted and prohibited terms | Part C | COMPLIANCE | `/{locale}/admin/catalog/restricted` | Page | Implemented | P2 |
| ADM-24 | Featured placements | Part C | COMPLIANCE, SUPER_ADMIN | `/{locale}/admin/catalog/featured` | Page | Implemented | P2 |
| ADM-25 | RFQ oversight | Part C | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/rfqs` | Page | Implemented | P1 |
| ADM-26 | RFQ detail (admin) | Part C | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/rfqs/[id]` | Page | Implemented | P1 |
| ADM-27 | Hide or unhide RFQ dialog | Part C | COMPLIANCE | `Dialog on ADM-26` | Dialog | Implemented | P2 |
| ADM-28 | Orders (admin) | Part C | SUPPORT, FINANCE, FINANCE_APPROVER | `/{locale}/admin/orders` | Page | Implemented | P0 |
| ADM-29 | Order detail (admin) | Part C | SUPPORT, FINANCE, FINANCE_APPROVER | `/{locale}/admin/orders/[orderId]` | Page | Implemented | P0 |
| ADM-30 | Finance overview | Part C | FINANCE, FINANCE_APPROVER | `/{locale}/admin/finance` | Page | Implemented | P0 |
| ADM-31 | Reconciliation case resolution | Part C | FINANCE_APPROVER | `Dialog on ADM-30` | Dialog | Implemented | P0 |
| ADM-32 | Refunds | Part C | FINANCE, FINANCE_APPROVER | `/{locale}/admin/refunds` | Page | Implemented | P0 |
| ADM-33 | Request refund form | Part C | FINANCE | `Form on ADM-32` | Section | Implemented | P0 |
| ADM-34 | Approve or reject refund dialog | Part C | FINANCE_APPROVER | `Dialog on ADM-32` | Dialog | Implemented | P0 |
| ADM-35 | Payouts | Part C | FINANCE, FINANCE_APPROVER | `/{locale}/admin/payouts` | Page | Implemented | P0 |
| ADM-36 | Request payout dialog | Part C | FINANCE | `Dialog on ADM-35` | Dialog | Implemented | P0 |
| ADM-37 | Approve or reject payout dialog | Part C | FINANCE_APPROVER | `Dialog on ADM-35` | Dialog | Implemented | P0 |
| ADM-38 | Disputes queue | Part C | SUPPORT (manage); FINANCE roles (read) | `/{locale}/admin/disputes` | Page | Implemented | P0 |
| ADM-39 | Dispute detail (admin) | Part C | SUPPORT (manage); FINANCE roles (read) | `/{locale}/admin/disputes/[disputeId]` | Page | Implemented | P0 |
| ADM-40 | Dispute action dialogs | Part C | SUPPORT | `Dialogs on ADM-39` | Dialog | Implemented | P0 |
| ADM-59 | Delivery proof review | Part C | SUPPORT, COMPLIANCE (proposed capability admin.delivery.review) | `/{locale}/admin/deliveries (proposed)` | Page | Planned | P1 |
| ADM-41 | Supplier reviews moderation | Part C | COMPLIANCE | `/{locale}/admin/supplier-reviews` | Page | Implemented | P2 |
| ADM-42 | Support queue | Part C | SUPPORT | `/{locale}/admin/support` | Page | Implemented | P1 |
| ADM-43 | Ticket detail (admin) | Part C | SUPPORT | `/{locale}/admin/support/[ticketId]` | Page | Implemented | P1 |
| ADM-44 | Reports (scoped CSV exports) | Part C | SUPPORT, FINANCE, FINANCE_APPROVER | `/{locale}/admin/reports` | Page | Implemented | P1 |
| ADM-45 | Audit log | Part C | COMPLIANCE, SUPER_ADMIN | `/{locale}/admin/audit` | Page | Implemented | P1 |
| ADM-46 | Staff and roles | Part C | SUPER_ADMIN | `/{locale}/admin/staff` | Page | Implemented | P1 |
| ADM-47 | Platform settings: payout schedule and policy windows | Part C | SUPER_ADMIN or finance approver (to be decided) | `/{locale}/admin/settings (proposed)` | Page | Planned | P1 |
| ADM-56 | Commission policy | Part C | FINANCE, FINANCE_APPROVER (view); FINANCE_APPROVER (change) | `/{locale}/admin/commission` | Page | Implemented | P0 |
| ADM-57 | Settlement holds | Part C | COMPLIANCE, FINANCE, FINANCE_APPROVER | `/{locale}/admin/holds` | Page | Implemented | P0 |
| ADM-58 | Release hold dialog | Part C | COMPLIANCE, FINANCE, FINANCE_APPROVER | `Dialog on ADM-57` | Dialog | Implemented | P0 |
| ADM-48 | Logistics and delivery settings | Part C | SUPER_ADMIN | `/{locale}/admin/logistics (proposed)` | Page | Planned | P2 |
| ADM-49 | System health and webhooks | Part C | SUPER_ADMIN, FINANCE (webhooks) | `/{locale}/admin/system (proposed)` | Page | Recommended | P2 |
| ADM-50 | Tax configuration and invoicing | Part C | FINANCE_APPROVER | `/{locale}/admin/tax (proposed)` | Page | Blocked | P1 |
| ADM-51 | Data requests, account closure and legal hold | Part C | COMPLIANCE | `/{locale}/admin/data-requests (proposed)` | Page | Planned | P1 |
| ADM-52 | Executive analytics | Part C | SUPER_ADMIN, FINANCE | `/{locale}/admin/analytics (proposed)` | Page | Recommended | P2 |
| ADM-53 | Sandbox provider simulator | Part C | FINANCE, FINANCE_APPROVER (development only) | `Action on ADM-32 / ADM-35` | Action | Implemented | P2 |


## 4.4 Screen specifications

### Part A. Business buyer experience

#### BUY-01 · Buyer dashboard

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

#### BUY-33 · Monthly spending (buyer dashboard section)

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

#### BUY-02 · Requests for quotation list

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

#### BUY-03 · New request for quotation

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

#### BUY-04 · Request quotation entry (workspace chooser)

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

#### BUY-05 · Request for quotation detail (buyer)

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

#### BUY-06 · Edit request draft

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

#### BUY-07 · Publish request dialog

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

#### BUY-08 · Cancel request dialog

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

#### BUY-09 · Invite suppliers picker

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

#### BUY-10 · Quote comparison

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

#### BUY-11 · Quote detail and version history

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

#### BUY-34 · Negotiation history and revision changes

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

#### BUY-12 · Accept quote dialog

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

#### BUY-13 · Request revision dialog

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

#### BUY-14 · Decline quote dialog

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

#### BUY-15 · Counteroffer to supplier

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

#### BUY-16 · Cart

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

#### BUY-17 · Checkout

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

#### BUY-35 · Delivery method selection (checkout section)

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

#### BUY-18 · Checkout status and payment

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

#### BUY-19 · Cancel checkout dialog

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

#### BUY-20 · Delivery addresses

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

#### BUY-21 · Address form

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

#### BUY-22 · Remove address dialog

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

#### BUY-23 · Orders list (buyer)

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

#### BUY-24 · Order detail (buyer)

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

#### BUY-36 · Collection instructions (order section)

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

#### BUY-37 · Invoice draft (order section)

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

#### BUY-25 · Confirm receipt dialog

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

#### BUY-26 · Rate supplier form

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

#### BUY-27 · Open dispute form (buyer)

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

#### BUY-28 · Invoices and tax documents (buyer)

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

#### BUY-29 · Payment history (buyer)

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

#### BUY-30 · Reorder

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

#### BUY-31 · Request order cancellation (buyer)

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

#### BUY-32 · Request a sample

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

#### FIN-01 · Sandbox payment page

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

#### FIN-02 · Live payment provider checkout

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

#### FIN-03 · Bank transfer instructions

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

### Part B. Manufacturer and supplier experience

#### SEL-01 · Seller overview (dashboard)

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

#### SEL-02 · Storefront editor

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

#### SEL-03 · Storefront media manager

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

#### SEL-04 · Delivery terms

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

#### SEL-05 · Publish or take storefront offline dialog

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

#### SEL-06 · Product list

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

#### SEL-07 · Add product

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

#### SEL-08 · Product editor (content)

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

#### SEL-09 · Product media manager

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

#### SEL-10 · Variants (SKU) manager

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

#### SEL-11 · Product pricing editor

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

#### SEL-12 · Submit for review dialog

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

#### SEL-13 · Listing lifecycle dialogs

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

#### SEL-14 · Moderation history

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

#### SEL-39 · Sample settings (product section)

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

#### SEL-15 · Inventory

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

#### SEL-16 · Stock adjustment dialog

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

#### SEL-17 · Low-stock threshold and restock date

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

#### SEL-18 · Stock movement history

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

#### SEL-19 · Pricing overview

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

#### SEL-20 · Quotation requests inbox

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

#### SEL-21 · Request detail (seller)

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

#### SEL-22 · Quote form

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

#### SEL-23 · Submit quote dialog

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

#### SEL-24 · Withdraw quote dialog

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

#### SEL-25 · Ask the buyer a question

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

#### SEL-40 · Respond to a counteroffer

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

#### SEL-26 · Quotes list (seller)

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

#### SEL-27 · Orders list (seller)

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

#### SEL-28 · Order detail (seller)

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

#### SEL-29 · Record dispatch dialog

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

#### SEL-30 · Report delivery dialog

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

#### SEL-31 · Open dispute (seller)

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

#### SEL-32 · Seller finance

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

#### SEL-33 · Payout account onboarding

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

#### SEL-34 · Statements and commission invoices

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

#### SEL-35 · Seller analytics

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

#### SEL-36 · Supplier order cancellation

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

#### SEL-41 · Review a buyer cancellation request

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

#### SEL-37 · Returns handling

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

#### SEL-38 · Production milestones (made to order)

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

### Part C. Platform administrator experience

#### AUTH-10 · Admin sign in

| Item | Specification |
|---|---|
| Screen ID | AUTH-10 |
| Screen name | Admin sign in |
| Experience | Platform administrators |
| User roles | Platform staff |
| Route / URL | `/{locale}/admin/login (admin origin only)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Password step for staff on the separate admin origin (A03). |
| 2. Navigation location | Then AUTH-11 or AUTH-13 |
| 3. User permissions | Admin accounts only (provisioned by CLI); company pages return 404 on this host. |
| 4. Screen layout | Centred card on the admin origin, environment label, no public links. Page header (title, status badge, primary action). Content: Auth card (admin styling), fields, button. |
| 5. Components | Auth card (admin styling), fields, button |
| 6. Displayed data | "Admin sign in", "Restricted to platform staff. Two-factor authentication is required." |
| 7. Buttons and actions | Primary: Sign in · Secondary: — |
| 8. Form fields | Required: Email, Password · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Invalid credentials; rate limit |
| 10. API dependencies | POST /admin/auth/login |
| Database entities | users (PLATFORM_ADMIN), sessions (ADMIN scope) |
| Source files | admin/login/page.tsx; lib/hosts.ts |
| 11. Loading state | Form renders immediately. On submit the button reads "Sign in…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: Invalid credentials; rate limit Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: Then AUTH-11 or AUTH-13. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | Response says which MFA step is required. |
| Related screens | AUTH-11, AUTH-13 |
| Dependencies and decisions | A02, A03 |

Form fields:

  - Email (email, Required): valid
  - Password (password, Required): 1–128

#### AUTH-11 · Admin MFA enrolment

| Item | Specification |
|---|---|
| Screen ID | AUTH-11 |
| Screen name | Admin MFA enrolment |
| Experience | Platform administrators |
| User roles | Platform staff (first sign-in) |
| Route / URL | `/{locale}/admin/mfa` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Mandatory TOTP enrolment. |
| 2. Navigation location | Then AUTH-12 |
| 3. User permissions | Password step done, MFA pending |
| 4. Screen layout | Centred card on the admin origin, environment label, no public links. Page header (title, status badge, primary action). Content: QR image, monospace key with copy, OTP input, button. |
| 5. Components | QR image, monospace key with copy, OTP input, button |
| 6. Displayed data | QR code image, manual setup key, 6-digit code field. |
| 7. Buttons and actions | Primary: Confirm and continue · Secondary: — |
| 8. Form fields | Required: 6-digit code · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | field.code; error.admin.mfa_code_invalid |
| 10. API dependencies | POST /admin/auth/mfa/enroll/start; /enroll/confirm |
| Database entities | users.mfa_secret_enc |
| Source files | admin/mfa/page.tsx |
| 11. Loading state | Form renders immediately. On submit the button reads "Confirm and continue…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: field.code; error.admin.mfa_code_invalid Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: Then AUTH-12. |
| 15. Confirmation dialogs | Confirm in a dialog before: confirm (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Stacked. |
| 17. Desktop layout (1440px) | QR left, form right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | AUTH-12 |
| Dependencies and decisions | A02 |

Form fields:

  - 6-digit code (otp, Required): ^\d{6}$

#### AUTH-12 · Admin recovery codes

| Item | Specification |
|---|---|
| Screen ID | AUTH-12 |
| Screen name | Admin recovery codes |
| Experience | Platform administrators |
| User roles | Platform staff |
| Route / URL | `/{locale}/admin/mfa (step)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Show 10 single-use recovery codes once. |
| 2. Navigation location | → ADM-01 |
| 3. User permissions | Just enrolled |
| 4. Screen layout | Centred card on the admin origin, environment label, no public links. Page header (title, status badge, primary action). Content: Code grid (monospace), checkbox "I have saved these codes", button. |
| 5. Components | Code grid (monospace), checkbox "I have saved these codes", button |
| 6. Displayed data | Codes grid, warning that they will not be shown again. |
| 7. Buttons and actions | Primary: Continue · Secondary: Copy / download codes (recommended) |
| 8. Form fields | Required: I have saved these codes · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | (returned by enroll/confirm) |
| Database entities | mfa_recovery_codes |
| Source files | admin/mfa/page.tsx |
| 11. Loading state | Form renders immediately. On submit the button reads "Continue…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: → ADM-01. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column codes. |
| 17. Desktop layout (1440px) | Two-column codes. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | AUTH-13 |
| Dependencies and decisions | A02 |

Form fields:

  - I have saved these codes (checkbox, Required): required

#### AUTH-13 · Admin MFA verification

| Item | Specification |
|---|---|
| Screen ID | AUTH-13 |
| Screen name | Admin MFA verification |
| Experience | Platform administrators |
| User roles | Platform staff |
| Route / URL | `/{locale}/admin/mfa (verify)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Second factor on every admin sign-in. |
| 2. Navigation location | → ADM-01 |
| 3. User permissions | Password step done |
| 4. Screen layout | Centred card on the admin origin, environment label, no public links. Page header (title, status badge, primary action). Content: OTP input, text input, link button. |
| 5. Components | OTP input, text input, link button |
| 6. Displayed data | Code field, toggle to recovery code, remaining recovery codes shown later in admin header. |
| 7. Buttons and actions | Primary: Verify · Secondary: Use a recovery code instead |
| 8. Form fields | Required: — · Optional: 6-digit code, Recovery code (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | field.code; mfa_code_invalid |
| 10. API dependencies | POST /admin/auth/mfa/verify |
| Database entities | sessions.mfa_verified_at |
| Source files | admin/mfa/page.tsx |
| 11. Loading state | Form renders immediately. On submit the button reads "Verify…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: field.code; mfa_code_invalid Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: → ADM-01. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | Replay-protected; session rotates. |
| Related screens | ADM-01 |
| Dependencies and decisions | A02 |

Form fields:

  - 6-digit code (otp, Optional): exactly one of code or recovery code
  - Recovery code (text, Optional): XXXX-XXXX format

#### ADM-01 · Admin overview and operations

| Item | Specification |
|---|---|
| Screen ID | ADM-01 |
| Screen name | Admin overview and operations |
| Experience | Platform administrators |
| User roles | All admin roles (content varies by capability) |
| Route / URL | `/{locale}/admin` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Live platform health: verification pipeline counts, operational queues and (finance roles only) commerce figures for a Dubai date range. |
| 2. Navigation location | Admin nav filtered by capability |
| 3. User permissions | admin.companies.read for counts; commerce needs admin.finance.read. |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Admin shell, KPI tiles, queue list with links, date range form (Dubai dates), sandbox alert, "Commerce figures are shown to finance roles only." note. |
| 5. Components | Admin shell, KPI tiles, queue list with links, date range form (Dubai dates), sandbox alert, "Commerce figures are shown to finance roles only." note |
| 6. Displayed data | Signed-in roles, recovery codes remaining; company KPIs (Draft, Submitted, Under review, Needs info, Approved, Suspended, Licences expiring, Unverified users, Company users); queues (open/unassigned disputes, open/unassigned tickets, open reconciliation cases, quarantined webhooks 7 days, refunds/payouts awaiting approval); commerce (paid orders, gross order value, refunded, net of refunds, platform fees net, owed to sellers now, paid out to sellers) with sandbox note; generated at. Since PR #15: "Background tasks" panel (task, last finished, next run, Running / Not run yet / Overdue / Failing ({count} in a row)). |
| 7. Buttons and actions | Primary: Show (apply period) · Secondary: Open queue links |
| 8. Form fields | Required: — · Optional: From, To (details below) |
| Filters · sorting · search | Period · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/overview; GET /admin/operations/overview |
| Database entities | companies, users, disputes, support_tickets, reconciliation_cases, refunds, payouts, ledger_entries |
| Source files | apps/web/src/app/[locale]/admin/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Show…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | Server-computed; no hardcoded figures. |
| Related screens | ADM-02, ADM-38, ADM-42, ADM-30, ADM-32, ADM-35 |
| Dependencies and decisions | — |

Form fields:

  - From (date, Optional): Dubai date
  - To (date, Optional): Dubai date

#### ADM-02 · Verification queue

| Item | Specification |
|---|---|
| Screen ID | ADM-02 |
| Screen name | Verification queue |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/verification` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Work through company verification cases. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.verification.review |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table, status badge, pagination, empty state. |
| 5. Components | Filters, table, status badge, pagination, empty state |
| 6. Displayed data | Company, kind (Initial/Renewal), state, submitted at, assignee, licence expiry. |
| 7. Buttons and actions | Primary: Open case · Secondary: Filter; load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State, kind · Oldest submitted first · Company name |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/verification |
| Database entities | verification_cases, companies |
| Source files | apps/web/src/app/[locale]/admin/verification/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No verification queue yet." with a one-line explanation and the action "Open case". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-03 |
| Dependencies and decisions | D08 |

Form fields:

  - None

#### ADM-03 · Verification case detail

| Item | Specification |
|---|---|
| Screen ID | ADM-03 |
| Screen name | Verification case detail |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/verification/[caseId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Review submitted company data and documents and decide. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.verification.review |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Description list, document list with audited download, timeline, decision panel. |
| 5. Components | Description list, document list with audited download, timeline, decision panel |
| 6. Displayed data | Company details (legal name, display name, licence number/issuer/expiry, activity, TRN, address), documents with scan state, event history, previous decisions, assignee. |
| 7. Buttons and actions | Primary: Start review (assign to me) · Secondary: Approve; Request information; Reject; download document |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/verification/{id}; POST /start-review; GET /admin/files/{id}/download |
| Database entities | verification_cases, company_documents, files, audit_events |
| Source files | apps/web/src/app/[locale]/admin/verification/[caseId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-04); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-04 Verification decision dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Company owner: sees the outcome and reason on ACC-03 and gets an email. |
| Behaviour | SUBMITTED → UNDER_REVIEW on start; documents downloaded only when CLEAN. |
| Related screens | ADM-04, ADM-06, ACC-03 |
| Dependencies and decisions | D08 |

Form fields:

  - None

#### ADM-04 · Verification decision dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-04 |
| Screen name | Verification decision dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-03` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Record approve, needs-info or reject. |
| 2. Navigation location | Opened from ADM-03 Verification case detail |
| 3. User permissions | admin.verification.review |
| 4. Screen layout | Dialog over ADM-03 Verification case detail: title, context text, fields, footer with secondary action then primary action. Content: Dialog, radio, textarea. |
| 5. Components | Dialog, radio, textarea |
| 6. Displayed data | Decision radio, reason (required unless approving), consequence text. |
| 7. Buttons and actions | Primary: Record decision · Secondary: Cancel |
| 8. Form fields | Required: Decision · Optional: Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Reason rule |
| 10. API dependencies | POST /admin/verification/{id}/decision |
| Database entities | verification_cases, companies, workspaces, notifications |
| Source files | verification/[caseId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Record decision…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Record decision" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Company owner: approved, rejected or needs-information status and reason on ACC-03; trading unlocks on approval. |
| Behaviour | Email + in-app notification to company; audit event. |
| Related screens | ADM-03 |
| Dependencies and decisions | — |

Form fields:

  - Decision (radio, Required): APPROVE, NEEDS_INFO, REJECT
  - Reason (textarea, Optional): required unless APPROVE

#### ADM-05 · Companies

| Item | Specification |
|---|---|
| Screen ID | ADM-05 |
| Screen name | Companies |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/companies` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Find any company. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.companies.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, status filter, table. |
| 5. Components | Search, status filter, table |
| 6. Displayed data | Name, kinds (buyer/seller), status, licence number, licence expiry. |
| 7. Buttons and actions | Primary: Open company · Secondary: Search; filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Status (7 company statuses) · Name · Company name |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/companies |
| Database entities | companies |
| Source files | apps/web/src/app/[locale]/admin/companies/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No companies yet." with a one-line explanation and the action "Open company". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-06 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-06 · Company detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-06 |
| Screen name | Company detail (admin) |
| Experience | Platform administrators |
| User roles | Admin roles with companies.read |
| Route / URL | `/{locale}/admin/companies/[companyId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Full company record with members and verification cases. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.companies.read; suspend/reactivate admin.companies.suspend |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Description list, members table, cases list, action bar. |
| 5. Components | Description list, members table, cases list, action bar |
| 6. Displayed data | Status, suspension kind, details, workspaces and status, members with roles, cases. Since PR #14: VAT registration with "Confirm VAT status" (ADM-54). Since PR #16: support ticket limit with exception (ADM-55). |
| 7. Buttons and actions | Primary: Suspend / Reactivate (COMPLIANCE) · Secondary: Open case; open user |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/companies/{id} |
| Database entities | companies, workspaces, memberships, verification_cases |
| Source files | apps/web/src/app/[locale]/admin/companies/[companyId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-07, ADM-54); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-07 Suspend or reactivate company dialog; ADM-54 Confirm VAT status dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-07, ADM-54, ADM-55 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-07 · Suspend or reactivate company dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-07 |
| Screen name | Suspend or reactivate company dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-06` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Restrict or restore a company. |
| 2. Navigation location | Opened from ADM-06 Company detail (admin) |
| 3. User permissions | admin.companies.suspend |
| 4. Screen layout | Dialog over ADM-06 Company detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Destructive dialog with reason. |
| 5. Components | Destructive dialog with reason |
| 6. Displayed data | Consequences: workspaces RESTRICTED, trading stops. |
| 7. Buttons and actions | Primary: Suspend company / Reactivate · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/companies/{id}/suspend \| /reactivate |
| Database entities | companies, workspaces, audit_events |
| Source files | companies/[companyId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Suspend company…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Suspend company / Reactivate" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Company members: suspension banner and disabled trading actions in their workspace (SYS-04 pattern). |
| Behaviour | — |
| Related screens | ADM-06 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required): required

#### ADM-54 · Confirm VAT status dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-54 |
| Screen name | Confirm VAT status dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE (admin.verification.review) |
| Route / URL | `Dialog on ADM-06` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Compliance confirms a company's declared VAT status and TRN with a reason (P8-10, PR #14). |
| 2. Navigation location | Opened from ADM-06 Company detail (admin) |
| 3. User permissions | admin.verification.review |
| 4. Screen layout | Dialog over ADM-06 Company detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Dialog with textarea. |
| 5. Components | Dialog with textarea |
| 6. Displayed data | Declared status and TRN; "Reason and evidence checked". |
| 7. Buttons and actions | Primary: Confirm VAT status · Secondary: Cancel |
| 8. Form fields | Required: Reason and evidence checked · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/companies/{id}/vat-status |
| Database entities | companies, audit_events |
| Source files | apps/web/src/app/[locale]/admin/companies/[companyId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Confirm VAT status…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "VAT status confirmed.". |
| 15. Confirmation dialogs | This screen is the confirmation step ("Confirm VAT status" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: can quote and sell with the confirmed VAT rule (ACC-19, SEL-22); Business buyer: checkout unblocked (BUY-17). |
| Behaviour | Shows "VAT status confirmed."; enables checkout and quoting for that supplier. |
| Related screens | ADM-06, ACC-19 |
| Dependencies and decisions | P8-10 |

Form fields:

  - Reason and evidence checked (textarea, Required): required

#### ADM-55 · Support ticket limit exception

| Item | Specification |
|---|---|
| Screen ID | ADM-55 |
| Screen name | Support ticket limit exception |
| Experience | Platform administrators |
| User roles | SUPPORT (admin.support.manage) |
| Route / URL | `Section of ADM-06` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Support managers set a per-company exception to the 10 open tickets limit with an audited reason (P8-13, PR #16). |
| 2. Navigation location | Opened from ADM-06 Company detail (admin) |
| 3. User permissions | admin.support.manage |
| 4. Screen layout | Block inside ADM-06 Company detail (admin) with its own heading and actions. Content: Number input, reason, two buttons. |
| 5. Components | Number input, reason, two buttons |
| 6. Displayed data | "{open} open of {limit} allowed"; Default limit (10) or Exception for this company. |
| 7. Buttons and actions | Primary: Save limit · Secondary: Restore default |
| 8. Form fields | Required: Limit (1 to 100), Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST /admin/companies/{id}/support-limit |
| Database entities | support_limits, audit_events |
| Source files | apps/web/src/components/support-ui.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Ticket limit saved.". |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at 360px tables become stacked cards, filters move to a sheet, actions to a sticky bar. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Company: new limit shown on SHR-04. |
| Behaviour | "Ticket limit saved."; urgent categories are never blocked. |
| Related screens | ADM-06, SHR-04, ADM-42 |
| Dependencies and decisions | FD-14 answered (A); P8-13 |

Form fields:

  - Limit (1 to 100) (integer, Required): 1–100
  - Reason (textarea, Required)

#### ADM-08 · Users

| Item | Specification |
|---|---|
| Screen ID | ADM-08 |
| Screen name | Users |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/users` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Find users and revoke sessions. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.users.read; revoke admin.users.revoke_sessions |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, filter, table, action. |
| 5. Components | Search, filter, table, action |
| 6. Displayed data | Email, account type, email verified, memberships, active sessions, created. |
| 7. Buttons and actions | Primary: Revoke sessions · Secondary: Search; filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Account type · — · Email |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/users |
| Database entities | users, sessions, memberships |
| Source files | apps/web/src/app/[locale]/admin/users/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No users yet." with a one-line explanation and the action "Revoke sessions". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-09); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-09 Revoke sessions dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-09 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-09 · Revoke sessions dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-09 |
| Screen name | Revoke sessions dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `Dialog on ADM-08` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Sign a user out everywhere. |
| 2. Navigation location | Opened from ADM-08 Users |
| 3. User permissions | admin.users.revoke_sessions |
| 4. Screen layout | Dialog over ADM-08 Users: title, context text, fields, footer with secondary action then primary action. Content: Dialog with reason. |
| 5. Components | Dialog with reason |
| 6. Displayed data | Reason hint. |
| 7. Buttons and actions | Primary: Revoke sessions · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/users/{id}/revoke-sessions |
| Database entities | sessions, audit_events |
| Source files | users/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Revoke sessions…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Revoke sessions" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | User: signed out everywhere and sent to AUTH-09. |
| Behaviour | — |
| Related screens | ADM-08 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required)

#### ADM-10 · Catalogue moderation overview

| Item | Specification |
|---|---|
| Screen ID | ADM-10 |
| Screen name | Catalogue moderation overview |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Moderation health: pending count, oldest pending, flags. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: KPI tiles, links. |
| 5. Components | KPI tiles, links |
| 6. Displayed data | Counts by state, oldest pending age, restricted-term flags. |
| 7. Buttons and actions | Primary: Open queue · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/overview |
| Database entities | product_versions |
| Source files | apps/web/src/app/[locale]/admin/catalog/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-11 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-11 · Moderation queue

| Item | Specification |
|---|---|
| Screen ID | ADM-11 |
| Screen name | Moderation queue |
| Experience | Platform administrators |
| User roles | COMPLIANCE (decide); SUPPORT, SUPER_ADMIN (read) |
| Route / URL | `/{locale}/admin/catalog (queue section)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Pending submissions, oldest first. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read; decisions admin.catalog.review |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, state filter, table, flags badge, empty ("queue empty"). |
| 5. Components | Search, state filter, table, flags badge, empty ("queue empty") |
| 6. Displayed data | Title, seller, category, new listing or update, flags, submitted. |
| 7. Buttons and actions | Primary: Review · Secondary: Search; filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State · Oldest pending first · Title |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/queue |
| Database entities | product_versions |
| Source files | catalog/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No moderation queue yet." with a one-line explanation and the action "Review". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-12 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-12 · Listing version review (diff)

| Item | Specification |
|---|---|
| Screen ID | ADM-12 |
| Screen name | Listing version review (diff) |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/catalog/reviews/[versionId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Compare the submitted version with the live version and decide. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.review |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Diff view, media grid, flags list, decision panel. |
| 5. Components | Diff view, media grid, flags list, decision panel |
| 6. Displayed data | Field-by-field diff, media, SKUs, restricted-term hits, seller info, history. |
| 7. Buttons and actions | Primary: Approve · Secondary: Request changes; Reject |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/reviews/{versionId}; GET /admin/media/{id} |
| Database entities | product_versions, product_media |
| Source files | apps/web/src/app/[locale]/admin/catalog/reviews/[versionId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-13); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-13 Review decision dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: decision and reason on SEL-08/SEL-14. |
| Behaviour | — |
| Related screens | ADM-13, SEL-12 |
| Dependencies and decisions | A10 |

Form fields:

  - None

#### ADM-13 · Review decision dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-13 |
| Screen name | Review decision dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-12` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Record the moderation decision. |
| 2. Navigation location | Opened from ADM-12 Listing version review (diff) |
| 3. User permissions | admin.catalog.review |
| 4. Screen layout | Dialog over ADM-12 Listing version review (diff): title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | Reason required for reject/changes. |
| 7. Buttons and actions | Primary: Record decision · Secondary: Cancel |
| 8. Form fields | Required: Decision · Optional: Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/catalog/reviews/{versionId}/decision |
| Database entities | product_versions, products, notifications |
| Source files | catalog/reviews/[versionId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Record decision…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Record decision" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: listing approved (visible on PUB-07) or changes requested with reason on SEL-08. |
| Behaviour | — |
| Related screens | ADM-12 |
| Dependencies and decisions | — |

Form fields:

  - Decision (radio, Required): APPROVE, CHANGES_REQUESTED, REJECT
  - Reason (textarea, Optional): required unless approve

#### ADM-14 · All listings

| Item | Specification |
|---|---|
| Screen ID | ADM-14 |
| Screen name | All listings |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/products` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Search every listing. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, filters, table. |
| 5. Components | Search, filters, table |
| 6. Displayed data | Title, seller, status, category, updated. |
| 7. Buttons and actions | Primary: Open listing · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Status, category · — · Title |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/products |
| Database entities | products |
| Source files | apps/web/src/app/[locale]/admin/catalog/products/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No all listings yet." with a one-line explanation and the action "Open listing". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-15 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-15 · Listing detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-15 |
| Screen name | Listing detail (admin) |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/products/[id]` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Inspect a listing and enforce. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read; enforce admin.catalog.enforce |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Detail view, history timeline, action bar. |
| 5. Components | Detail view, history timeline, action bar |
| 6. Displayed data | Live version, SKUs, history, status reason. |
| 7. Buttons and actions | Primary: Suspend / Restore / Remove · Secondary: Open seller |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/products/{id} |
| Database entities | products, product_versions |
| Source files | apps/web/src/app/[locale]/admin/catalog/products/[id]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-16); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-16 Listing enforcement dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-16 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-16 · Listing enforcement dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-16 |
| Screen name | Listing enforcement dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-15` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Suspend, restore or remove (irreversible for the seller). |
| 2. Navigation location | Opened from ADM-15 Listing detail (admin) |
| 3. User permissions | admin.catalog.enforce |
| 4. Screen layout | Dialog over ADM-15 Listing detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Destructive dialog (3 variants). |
| 5. Components | Destructive dialog (3 variants) |
| 6. Displayed data | Consequence per action. |
| 7. Buttons and actions | Primary: Confirm · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/catalog/products/{id}/suspend\|restore\|remove |
| Database entities | products, audit_events |
| Source files | catalog/products/[id]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Confirm…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Confirm" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: listing paused or removed with reason on SEL-06/SEL-08; Business buyer: listing disappears from search. |
| Behaviour | — |
| Related screens | ADM-15 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required)

#### ADM-17 · Storefront oversight

| Item | Specification |
|---|---|
| Screen ID | ADM-17 |
| Screen name | Storefront oversight |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/storefronts` |
| Implementation status | Implemented · P1 |
| 1. Purpose | See all storefronts and hide/restore. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read; enforce admin.catalog.enforce |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, filter, table, row actions. |
| 5. Components | Search, filter, table, row actions |
| 6. Displayed data | Company, business type, public/not public, hidden, listing count, updated. |
| 7. Buttons and actions | Primary: Hide / Restore · Secondary: Search; filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Visibility · — · Company |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/storefronts |
| Database entities | storefronts |
| Source files | apps/web/src/app/[locale]/admin/catalog/storefronts/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No storefront oversight yet." with a one-line explanation and the action "Hide / Restore". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-19); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-19 Hide or restore storefront dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-18, ADM-19 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-18 · Storefront detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-18 |
| Screen name | Storefront detail (admin) |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/storefronts/[id] (proposed)` |
| Implementation status | Planned · P2 |
| 1. Purpose | API exists (GET /admin/storefronts/{id}) but there is no page; admins act from the list. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Detail view. |
| 5. Components | Detail view |
| 6. Displayed data | Full profile, media, listings, hide history. |
| 7. Buttons and actions | Primary: Hide / Restore · Secondary: Open company |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/storefronts/{id} |
| Database entities | storefronts, storefront_media |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-17 |
| Dependencies and decisions | Gap G-17 |

Form fields:

  - None

#### ADM-19 · Hide or restore storefront dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-19 |
| Screen name | Hide or restore storefront dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-17` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Hide a storefront with reason. |
| 2. Navigation location | Opened from ADM-17 Storefront oversight |
| 3. User permissions | admin.catalog.enforce |
| 4. Screen layout | Dialog over ADM-17 Storefront oversight: title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | Reason shown to seller. |
| 7. Buttons and actions | Primary: Hide / Restore · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/storefronts/{id}/hide\|restore |
| Database entities | storefronts |
| Source files | catalog/storefronts/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Hide…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Hide / Restore" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: storefront hidden notice on SEL-02; Business buyer: PUB-10 unavailable. |
| Behaviour | — |
| Related screens | ADM-17 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required)

#### ADM-20 · Categories

| Item | Specification |
|---|---|
| Screen ID | ADM-20 |
| Screen name | Categories |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN (manage); others read |
| Route / URL | `/{locale}/admin/catalog/categories` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Manage the category tree. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read; manage admin.categories.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Tree table, create form. |
| 5. Components | Tree table, create form |
| 6. Displayed data | Tree with name EN/AR, restriction (Open/Review required/Blocked), visibility, position, product counts. |
| 7. Buttons and actions | Primary: Create category · Secondary: Open category |
| 8. Form fields | Required: Name EN, Name AR, Restriction · Optional: Parent (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST /admin/categories |
| Database entities | categories |
| Source files | apps/web/src/app/[locale]/admin/catalog/categories/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Create category…" and is disabled. |
| 12. Empty state | (suggested) "No categories yet." with a one-line explanation and the action "Create category". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-21 |
| Dependencies and decisions | A09 |

Form fields:

  - Name EN (text, Required)
  - Name AR (text, Required)
  - Parent (select, Optional)
  - Restriction (select, Required): OPEN, REVIEW_REQUIRED, BLOCKED

#### ADM-21 · Category editor

| Item | Specification |
|---|---|
| Screen ID | ADM-21 |
| Screen name | Category editor |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/categories/[id]` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Edit category, image and attributes. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.categories.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Form, image upload, attributes table. |
| 5. Components | Form, image upload, attributes table |
| 6. Displayed data | Fields, image, supplier requirements, attributes list. |
| 7. Buttons and actions | Primary: Save · Secondary: Upload image; add attribute; hide; archive |
| 8. Form fields | Required: Name EN/AR · Optional: Description EN/AR, Requirements EN/AR, Restriction, Hidden / Archived, Image (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/PATCH /admin/categories/{id}; POST /image; POST /attributes |
| Database entities | categories, category_attributes |
| Source files | apps/web/src/app/[locale]/admin/catalog/categories/[id]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Save…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Opens: ADM-22 Category attribute editor. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-22 |
| Dependencies and decisions | — |

Form fields:

  - Name EN/AR (text, Required)
  - Description EN/AR (textarea, Optional)
  - Requirements EN/AR (textarea, Optional)
  - Restriction (select, Optional): reason required to change
  - Hidden / Archived (toggle, Optional): reason required
  - Image (file, Optional)

#### ADM-22 · Category attribute editor

| Item | Specification |
|---|---|
| Screen ID | ADM-22 |
| Screen name | Category attribute editor |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `Dialog on ADM-21` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Define attributes sellers fill and buyers filter by. |
| 2. Navigation location | Opened from ADM-21 Category editor |
| 3. User permissions | admin.categories.manage |
| 4. Screen layout | Dialog over ADM-21 Category editor: title, context text, fields, footer with secondary action then primary action. Content: Dialog form. |
| 5. Components | Dialog form |
| 6. Displayed data | Key, labels, type, options, required, filterable. |
| 7. Buttons and actions | Primary: Save attribute · Secondary: Cancel |
| 8. Form fields | Required: Key, Label EN/AR, Type · Optional: Options, Required, Filterable (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/categories/{id}/attributes; PATCH /admin/category-attributes/{id} |
| Database entities | category_attributes |
| Source files | catalog/categories/[id]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Save attribute…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Save attribute" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-21 |
| Dependencies and decisions | — |

Form fields:

  - Key (text, Required)
  - Label EN/AR (text, Required)
  - Type (select, Required)
  - Options (list, Optional)
  - Required (checkbox, Optional)
  - Filterable (checkbox, Optional)

#### ADM-23 · Restricted and prohibited terms

| Item | Specification |
|---|---|
| Screen ID | ADM-23 |
| Screen name | Restricted and prohibited terms |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/catalog/restricted` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Maintain screening terms (provisional policy A10). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.restricted.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Table, inline form. |
| 5. Components | Table, inline form |
| 6. Displayed data | Term, action (Block / Review), active. |
| 7. Buttons and actions | Primary: Add term · Secondary: Edit; deactivate |
| 8. Form fields | Required: Term, Action · Optional: Active (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST/PATCH /admin/restricted-terms |
| Database entities | restricted_terms |
| Source files | apps/web/src/app/[locale]/admin/catalog/restricted/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Add term…" and is disabled. |
| 12. Empty state | (suggested) "No restricted and prohibited terms yet." with a one-line explanation and the action "Add term". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: deactivate (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-12 |
| Dependencies and decisions | A10 |

Form fields:

  - Term (text, Required)
  - Action (select, Required): BLOCK (prohibited) or REVIEW (route to moderation)
  - Active (toggle, Optional)

#### ADM-24 · Featured placements

| Item | Specification |
|---|---|
| Screen ID | ADM-24 |
| Screen name | Featured placements |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/featured` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Labelled featured slots (never used for ranking). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.featured.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Table, add form. |
| 5. Components | Table, add form |
| 6. Displayed data | Kind, target, position, starts, ends, scheduled/eligible state. |
| 7. Buttons and actions | Primary: Add featured · Secondary: Remove |
| 8. Form fields | Required: Kind, Target, Position · Optional: Starts, Ends, Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST/DELETE /admin/featured |
| Database entities | featured_listings |
| Source files | apps/web/src/app/[locale]/admin/catalog/featured/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Add featured…" and is disabled. |
| 12. Empty state | (suggested) "No featured placements yet." with a one-line explanation and the action "Add featured". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | PUB-01 |
| Dependencies and decisions | — |

Form fields:

  - Kind (select, Required): PRODUCT, SUPPLIER
  - Target (select, Required): public targets only
  - Position (integer, Required)
  - Starts (datetime, Optional)
  - Ends (datetime, Optional)
  - Reason (text, Optional)

#### ADM-25 · RFQ oversight

| Item | Specification |
|---|---|
| Screen ID | ADM-25 |
| Screen name | RFQ oversight |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/rfqs` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Metadata view of requests (no quote contents). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.rfqs.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table. |
| 5. Components | Filters, table |
| 6. Displayed data | Reference, buyer, category, state, visibility, quote count, hidden. |
| 7. Buttons and actions | Primary: Open · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State, hidden · — · Reference/title |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/rfqs |
| Database entities | rfqs |
| Source files | apps/web/src/app/[locale]/admin/rfqs/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No rfq oversight yet." with a one-line explanation and the action "Open". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-26 |
| Dependencies and decisions | P3-6 |

Form fields:

  - None

#### ADM-26 · RFQ detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-26 |
| Screen name | RFQ detail (admin) |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/rfqs/[id]` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Inspect metadata and quote states; moderate abuse. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.rfqs.read; moderate admin.rfqs.moderate |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Detail, timeline, action. |
| 5. Components | Detail, timeline, action |
| 6. Displayed data | Metadata, quote states without contents, timeline. |
| 7. Buttons and actions | Primary: Hide / Unhide (COMPLIANCE) · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/rfqs/{id} |
| Database entities | rfqs, quotes |
| Source files | apps/web/src/app/[locale]/admin/rfqs/[id]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-27); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-27 Hide or unhide RFQ dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-27 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-27 · Hide or unhide RFQ dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-27 |
| Screen name | Hide or unhide RFQ dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-26` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Hide an abusive request (sellers lose access). |
| 2. Navigation location | Opened from ADM-26 RFQ detail (admin) |
| 3. User permissions | admin.rfqs.moderate |
| 4. Screen layout | Dialog over ADM-26 RFQ detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | Reason; buyer sees hidden notice. |
| 7. Buttons and actions | Primary: Hide / Unhide · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/rfqs/{id}/hide\|unhide |
| Database entities | rfqs, audit_events |
| Source files | rfqs/[id]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Hide…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Hide / Unhide" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: request shows hidden by the marketplace on BUY-05; Supplier: request removed from SEL-20. |
| Behaviour | — |
| Related screens | ADM-26 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required)

#### ADM-28 · Orders (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-28 |
| Screen name | Orders (admin) |
| Experience | Platform administrators |
| User roles | SUPPORT, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/orders` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Find any order. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.orders.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table. |
| 5. Components | Filters, table |
| 6. Displayed data | Number, buyer, seller, state, payment state, total, created. |
| 7. Buttons and actions | Primary: Open order · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State · — · Order number |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/orders |
| Database entities | orders |
| Source files | apps/web/src/app/[locale]/admin/orders/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No orders yet." with a one-line explanation and the action "Open order". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-29 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-29 · Order detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-29 |
| Screen name | Order detail (admin) |
| Experience | Platform administrators |
| User roles | SUPPORT, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/orders/[orderId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Full order record for support and finance. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.orders.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Detail sections, timeline. |
| 5. Components | Detail sections, timeline |
| 6. Displayed data | Parties, lines, totals, commission, payable, payments, shipment, settlement, refunds, disputes, timeline. Since PR #13/#14: verified delivery, dispute window, active holds, settlement state; invoice draft with commission draft. |
| 7. Buttons and actions | Primary: Request refund (FINANCE) · Secondary: Open dispute; open company |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/orders/{id} |
| Database entities | orders, payments, shipments, settlements, refunds |
| Source files | apps/web/src/app/[locale]/admin/orders/[orderId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | Confirm in a dialog before: refund (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer and supplier: see the effects of holds, refunds and dispute decisions on BUY-24 and SEL-28 (internal hold reasons are never shown). |
| Behaviour | — |
| Related screens | ADM-33, ADM-39 |
| Dependencies and decisions | Refund form takes raw order ID (G-16) |

Form fields:

  - None

#### ADM-30 · Finance overview

| Item | Specification |
|---|---|
| Screen ID | ADM-30 |
| Screen name | Finance overview |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/finance` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Read-only ledger balances, payment attempts and reconciliation cases (sandbox). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.finance.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Ledger table, payments table, cases table, sandbox pill. |
| 5. Components | Ledger table, payments table, cases table, sandbox pill |
| 6. Displayed data | "Operational ledger for marketplace balances, not statutory accounting."; accounts (provider clearing, payable to suppliers, platform commission, unallocated receipts) with debits/credits; payment attempts; open reconciliation cases by kind (6 kinds). Since PR #13: "Resolve" on each open reconciliation case (ADM-31). |
| 7. Buttons and actions | Primary: — · Secondary: Load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/finance/summary, /payments, /reconciliation |
| Database entities | ledger_entries, payments, reconciliation_cases |
| Source files | apps/web/src/app/[locale]/admin/finance/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | Opens: ADM-31 Reconciliation case resolution. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-31, ADM-32, ADM-35 |
| Dependencies and decisions | Stale note finance.reconciliation_note (G-27) |

Form fields:

  - None

#### ADM-31 · Reconciliation case resolution

| Item | Specification |
|---|---|
| Screen ID | ADM-31 |
| Screen name | Reconciliation case resolution |
| Experience | Platform administrators |
| User roles | FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-30` |
| Implementation status | Implemented · P0 |
| 1. Purpose | FINANCE_APPROVER resolves an open reconciliation case with a reason; orders it held are re-evaluated (P8-8, PR #13). |
| 2. Navigation location | Opened from ADM-30 Finance overview |
| 3. User permissions | admin.reconciliation.resolve (FINANCE_APPROVER) |
| 4. Screen layout | Dialog over ADM-30 Finance overview: title, context text, fields, footer with secondary action then primary action. Content: Detail, action dialog with dual control. |
| 5. Components | Detail, action dialog with dual control |
| 6. Displayed data | Case kind, provider reference, amounts, linked checkout/order, history, resolution options. |
| 7. Buttons and actions | Primary: Resolve · Secondary: Cancel |
| 8. Form fields | Required: How was it resolved? · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/finance/reconciliation/{id}/resolve |
| Database entities | reconciliation_cases, ledger_entries |
| Source files | apps/web/src/app/[locale]/admin/finance/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Resolve…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Resolve" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-30 |
| Dependencies and decisions | P8-8 |

Form fields:

  - How was it resolved? (textarea, Required): required, ≤ 1000

#### ADM-32 · Refunds

| Item | Specification |
|---|---|
| Screen ID | ADM-32 |
| Screen name | Refunds |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/refunds` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Request, approve and track refunds (dual control). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.finance.read; request admin.refunds.request; approve admin.refunds.approve |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Request form, table, row actions, self-approval note, sandbox completion tool. |
| 5. Components | Request form, table, row actions, self-approval note, sandbox completion tool |
| 6. Displayed data | "Refunds go through the payment provider. A second finance user approves each request…"; number, order, amount, commission share, state (Awaiting approval, Approved, Rejected, Sent to provider, Refunded, Failed), requested by, decided by. |
| 7. Buttons and actions | Primary: Request a refund (FINANCE) · Secondary: Approve; Reject (FINANCE_APPROVER); simulate provider (sandbox) |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST /admin/refunds; POST /approve, /reject; POST /admin/sandbox/operations/{ref}/complete |
| Database entities | refunds, ledger_entries |
| Source files | apps/web/src/app/[locale]/admin/refunds/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No refunds yet." with a one-line explanation and the action "Request a refund (FINANCE)". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-34); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-34 Approve or reject refund dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: refund in BUY-29 and BUY-24; Supplier: commission reversal and settlement on SEL-32. |
| Behaviour | — |
| Related screens | ADM-33, ADM-34 |
| Dependencies and decisions | Refund commission rule (founder: merchandise only) |

Form fields:

  - None

#### ADM-33 · Request refund form

| Item | Specification |
|---|---|
| Screen ID | ADM-33 |
| Screen name | Request refund form |
| Experience | Platform administrators |
| User roles | FINANCE |
| Route / URL | `Form on ADM-32` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Request a refund up to the remaining refundable amount. Works, but takes a raw order ID; it should start from the order or dispute. |
| 2. Navigation location | Opened from ADM-32 Refunds |
| 3. User permissions | admin.refunds.request |
| 4. Screen layout | Block inside ADM-32 Refunds with its own heading and actions. Content: Form. |
| 5. Components | Form |
| 6. Displayed data | Order ID, amount, reason, dispute ID. Since PR #13: optional split "Which part of the order does this cover?" Merchandise / Delivery / VAT (AED); blank = pro rata; commission reversed on merchandise only. |
| 7. Buttons and actions | Primary: Request a refund · Secondary: Cancel |
| 8. Form fields | Required: Order ID, Amount (AED), Reason · Optional: Merchandise (AED), Delivery (AED), VAT (AED), Dispute ID (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Amount ≤ refundable |
| 10. API dependencies | POST /admin/refunds |
| Database entities | refunds |
| Source files | refunds/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Amount ≤ refundable |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: refund (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Inline form. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-32, ADM-29, ADM-39 |
| Dependencies and decisions | Gap G-16 |

Form fields:

  - Order ID (uuid, Required)
  - Amount (AED) (money, Required): ≤ remaining capture
  - Merchandise (AED) (money, Optional): parts must add up
  - Delivery (AED) (money, Optional)
  - VAT (AED) (money, Optional)
  - Dispute ID (uuid, Optional): optional
  - Reason (textarea, Required)

#### ADM-34 · Approve or reject refund dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-34 |
| Screen name | Approve or reject refund dialog |
| Experience | Platform administrators |
| User roles | FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-32` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Second-person decision. |
| 2. Navigation location | Opened from ADM-32 Refunds |
| 3. User permissions | admin.refunds.approve; not the requester |
| 4. Screen layout | Dialog over ADM-32 Refunds: title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | "Approve refund {number}?"; "You requested this; another finance user must decide." |
| 7. Buttons and actions | Primary: Approve / Reject · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Reason for the decision (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/refunds/{id}/approve\|reject |
| Database entities | refunds |
| Source files | refunds/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Approve…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Approve / Reject" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: refund status on BUY-24/BUY-29; Supplier: SEL-28/SEL-32 updated; requester cannot approve their own request (FD-01). |
| Behaviour | — |
| Related screens | ADM-32 |
| Dependencies and decisions | "Two finance approvers" ambiguity |

Form fields:

  - Reason for the decision (textarea, Optional): required to reject

#### ADM-35 · Payouts

| Item | Specification |
|---|---|
| Screen ID | ADM-35 |
| Screen name | Payouts |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/payouts` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Pay eligible, undisputed, completed orders to sellers (dual control, sandbox). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.finance.read; request/approve capabilities |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Eligible table, payouts table, row actions, sandbox completion. |
| 5. Components | Eligible table, payouts table, row actions, sandbox completion |
| 6. Displayed data | Eligible suppliers with order count and amount; payouts list with state (Awaiting approval, Approved, Rejected, Sent to provider, Paid by provider, Failed), paid at. Since PR #13: "This week's payout run" (week of {start} to {end}, Dubai), payouts and amount requested this week, available provider balance ("SANDBOX: worked out from the ledger…"). FD-04: the run is created on Monday 10:00 Dubai, next working day on UAE public holidays; the scheduler only creates requests, finance approval is never bypassed. |
| 7. Buttons and actions | Primary: Request payout (FINANCE) · Secondary: Approve; Reject (FINANCE_APPROVER) |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/payouts/eligible; GET/POST /admin/payouts; POST /approve, /reject |
| Database entities | payouts, settlements |
| Source files | apps/web/src/app/[locale]/admin/payouts/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No payouts yet." with a one-line explanation and the action "Request payout (FINANCE)". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-36, ADM-37); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-36 Request payout dialog; ADM-37 Approve or reject payout dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: payout status and dates on SEL-32. |
| Behaviour | — |
| Related screens | ADM-36, ADM-37, SEL-32 |
| Dependencies and decisions | P8-5 weekly payout run (PR #13); FD-01 and FD-04 answered; earlier conflict P5-5 resolved |

Form fields:

  - None

#### ADM-36 · Request payout dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-36 |
| Screen name | Request payout dialog |
| Experience | Platform administrators |
| User roles | FINANCE |
| Route / URL | `Dialog on ADM-35` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Request payout of all eligible orders for one seller. |
| 2. Navigation location | Opened from ADM-35 Payouts |
| 3. User permissions | admin.payouts.request |
| 4. Screen layout | Dialog over ADM-35 Payouts: title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | "Request a payout to {company}?" with amount and orders. |
| 7. Buttons and actions | Primary: Request payout · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/payouts |
| Database entities | payouts |
| Source files | payouts/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Request payout…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Request payout" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-35 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-37 · Approve or reject payout dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-37 |
| Screen name | Approve or reject payout dialog |
| Experience | Platform administrators |
| User roles | FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-35` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Second-person decision. |
| 2. Navigation location | Opened from ADM-35 Payouts |
| 3. User permissions | admin.payouts.approve; not the requester |
| 4. Screen layout | Dialog over ADM-35 Payouts: title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | "Approve payout {number}?" Approval re-checks orders and balance: errors "An order in this payout is on hold…", "…changed after it was requested", "The available provider balance is lower than this payout." FD-01: requester and approver are two different finance users. |
| 7. Buttons and actions | Primary: Approve / Reject · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/payouts/{id}/approve\|reject |
| Database entities | payouts |
| Source files | payouts/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Approve…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Approve / Reject" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: payout marked approved or rejected on SEL-32; requester cannot approve (FD-01). |
| Behaviour | — |
| Related screens | ADM-35 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Optional): required to reject

#### ADM-38 · Disputes queue

| Item | Specification |
|---|---|
| Screen ID | ADM-38 |
| Screen name | Disputes queue |
| Experience | Platform administrators |
| User roles | SUPPORT (manage); FINANCE roles (read) |
| Route / URL | `/{locale}/admin/disputes` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Triage disputes. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.disputes.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters (All states, Assigned to me), table. |
| 5. Components | Filters (All states, Assigned to me), table |
| 6. Displayed data | Number, order, type, state, assigned/unassigned, opened. |
| 7. Buttons and actions | Primary: Open · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State, assigned to me · Oldest open · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/disputes |
| Database entities | disputes |
| Source files | apps/web/src/app/[locale]/admin/disputes/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No disputes queue yet." with a one-line explanation and the action "Open". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-39 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-39 · Dispute detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-39 |
| Screen name | Dispute detail (admin) |
| Experience | Platform administrators |
| User roles | SUPPORT (manage); FINANCE roles (read) |
| Route / URL | `/{locale}/admin/disputes/[disputeId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Review evidence, message both parties and propose an outcome. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.disputes.read; actions admin.disputes.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Thread, evidence list, action bar. |
| 5. Components | Thread, evidence list, action bar |
| 6. Displayed data | "Support reviews evidence and proposes an outcome. Refunds go to finance for dual approval…"; parties, order, messages/evidence, proposal, refunds. |
| 7. Buttons and actions | Primary: Assign to me · Secondary: Request evidence; Propose resolution; Close dispute; Message both parties |
| 8. Form fields | Required: — · Optional: Note to both parties (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/disputes/{id}; POST /assign, /request-evidence, /propose, /close, /messages |
| Database entities | disputes, dispute_messages |
| Source files | apps/web/src/app/[locale]/admin/disputes/[disputeId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Assign to me…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Opens: ADM-40 Dispute action dialogs. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer and supplier: decision and reason on SHR-02, order and settlement updated on BUY-24/SEL-28. |
| Behaviour | — |
| Related screens | ADM-40, ADM-32 |
| Dependencies and decisions | — |

Form fields:

  - Note to both parties (textarea, Optional)

#### ADM-40 · Dispute action dialogs

| Item | Specification |
|---|---|
| Screen ID | ADM-40 |
| Screen name | Dispute action dialogs |
| Experience | Platform administrators |
| User roles | SUPPORT |
| Route / URL | `Dialogs on ADM-39` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Request evidence (from Under review or Resolution proposed), propose a resolution (No financial action / Refund + amount, from Under review or Awaiting evidence) or close a dispute whose proposal is No financial action. One component, three variations. |
| 2. Navigation location | Opened from ADM-39 Dispute detail (admin) |
| 3. User permissions | admin.disputes.manage |
| 4. Screen layout | Dialog over ADM-39 Dispute detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Dialog (3 variants). |
| 5. Components | Dialog (3 variants) |
| 6. Displayed data | "Amount in AED, for example 125.50"; "Finance creates the refund from the Refunds page". |
| 7. Buttons and actions | Primary: Send / Propose / Close dispute · Secondary: Cancel |
| 8. Form fields | Required: Proposal, Note · Optional: Amount (AED) (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/disputes/{id}/request-evidence\|propose\|close |
| Database entities | disputes |
| Source files | disputes/[disputeId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Send…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Send / Propose / Close dispute" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer and supplier: notified of each action on SHR-02. |
| Behaviour | — |
| Related screens | ADM-39 |
| Dependencies and decisions | — |

Form fields:

  - Proposal (radio, Required): NO_ACTION, REFUND
  - Amount (AED) (money, Optional): required for REFUND
  - Note (textarea, Required)

#### ADM-59 · Delivery proof review

| Item | Specification |
|---|---|
| Screen ID | ADM-59 |
| Screen name | Delivery proof review |
| Experience | Platform administrators |
| User roles | SUPPORT, COMPLIANCE (proposed capability admin.delivery.review) |
| Route / URL | `/{locale}/admin/deliveries (proposed)` |
| Implementation status | Planned · P1 |
| 1. Purpose | FD-03 (answer A): supplier-uploaded delivery evidence is validated, with a review mechanism for contested or suspicious delivery claims. |
| 2. Navigation location | Admin nav → Deliveries |
| 3. User permissions | Proposed new capability; decisions audited. |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Queue table, detail with file preview, decision dialog. |
| 5. Components | Queue table, detail with file preview, decision dialog |
| 6. Displayed data | Queue of deliveries flagged by the buyer ("I did not receive this"), by rules (proof uploaded long after dispatch, file reused, mismatch with tracking) or by support; proof file preview (scanned), dispatch and tracking data, buyer statement, timeline; decision: Accept proof / Reject proof (window does not start from it) / Ask for more evidence. |
| 7. Buttons and actions | Primary: Record decision · Secondary: Ask supplier for evidence; Open dispute view |
| 8. Form fields | Required: Decision, Reason · Optional: — (details below) |
| Filters · sorting · search | Flag source; age · Oldest first · — |
| 9. Validation rules | — |
| 10. API dependencies | New: GET /admin/deliveries; POST /admin/deliveries/{orderId}/decision |
| Database entities | orders (delivery_verified_at, source), shipments, delivery_reviews (new), audit_events |
| Source files | Not built yet |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Record decision…" and is disabled. |
| 12. Empty state | "No delivery claims need review." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | "Decision recorded." Buyer and supplier notified; the dispute window recalculates if proof was rejected. |
| 15. Confirmation dialogs | Reject asks: "The dispute window will no longer start from this proof. The supplier and buyer will be told." |
| 16. Mobile layout (360px) | Admin is desktop-first; at 360px tables become stacked cards, filters move to a sheet, actions to a sticky bar. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: asked for more evidence on SEL-28; Buyer: told the outcome on BUY-24. |
| Behaviour | Rejecting proof clears delivery verification from proof; the window then starts at buyer receipt or accepted new proof. Buyer and supplier notified. |
| Related screens | SEL-30, BUY-24, ADM-29, ADM-39 |
| Dependencies and decisions | FD-03 answered (A) |

Form fields:

  - Decision (radio, Required): ACCEPT, REJECT, MORE_EVIDENCE
  - Reason (textarea, Required)

#### ADM-41 · Supplier reviews moderation

| Item | Specification |
|---|---|
| Screen ID | ADM-41 |
| Screen name | Supplier reviews moderation |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/supplier-reviews` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Hide or republish reviews; text is never edited. Admin sees buyer identity. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.reviews.moderate |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Table, actions, reason dialog. |
| 5. Components | Table, actions, reason dialog |
| 6. Displayed data | Supplier, rating, comment, buyer company (admin only), order, state. Public label "Verified business buyer" (FD-15); admins see the buyer company. |
| 7. Buttons and actions | Primary: Hide · Secondary: Publish again |
| 8. Form fields | Required: Reason (recorded in the audit log) · Optional: — (details below) |
| Filters · sorting · search | State · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/reviews; POST /hide, /unhide |
| Database entities | reviews |
| Source files | apps/web/src/app/[locale]/admin/supplier-reviews/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Hide…" and is disabled. |
| 12. Empty state | (suggested) "No supplier reviews moderation yet." with a one-line explanation and the action "Hide". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: publish (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: hidden review notice; Supplier: storefront rating updated (PUB-10). |
| Behaviour | — |
| Related screens | BUY-26, PUB-10 |
| Dependencies and decisions | — |

Form fields:

  - Reason (recorded in the audit log) (textarea, Required)

#### ADM-42 · Support queue

| Item | Specification |
|---|---|
| Screen ID | ADM-42 |
| Screen name | Support queue |
| Experience | Platform administrators |
| User roles | SUPPORT |
| Route / URL | `/{locale}/admin/support` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Customer tickets from all workspaces. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.support.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table. |
| 5. Components | Filters, table |
| 6. Displayed data | Subject, workspace, topic, state (Waiting for customer etc.), assignee, updated. Since PR #16: urgent categories Payment, Security and Compliance are always accepted; 10 open tickets per company by default; resolved tickets close automatically after 7 days. |
| 7. Buttons and actions | Primary: Open · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State, assigned · Oldest open · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/support |
| Database entities | support_tickets |
| Source files | apps/web/src/app/[locale]/admin/support/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No support queue yet." with a one-line explanation and the action "Open". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-43 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-43 · Ticket detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-43 |
| Screen name | Ticket detail (admin) |
| Experience | Platform administrators |
| User roles | SUPPORT |
| Route / URL | `/{locale}/admin/support/[ticketId]` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Take, reply, resolve or reopen. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.support.read; actions admin.support.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Thread, composer, action bar. |
| 5. Components | Thread, composer, action bar |
| 6. Displayed data | Messages, limited order details only, linked records. |
| 7. Buttons and actions | Primary: Take ticket · Secondary: Reply; Resolve; Reopen |
| 8. Form fields | Required: Reply · Optional: Resolution note (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/support/{id}; POST /assign, /messages, /resolve, /reopen |
| Database entities | support_tickets, support_messages |
| Source files | apps/web/src/app/[locale]/admin/support/[ticketId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Take ticket…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: resolve (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Ticket owner: replies and status on SHR-05. |
| Behaviour | — |
| Related screens | ADM-42, SHR-05 |
| Dependencies and decisions | — |

Form fields:

  - Reply (textarea, Required): ≤4000
  - Resolution note (textarea, Optional)

#### ADM-44 · Reports (scoped CSV exports)

| Item | Specification |
|---|---|
| Screen ID | ADM-44 |
| Screen name | Reports (scoped CSV exports) |
| Experience | Platform administrators |
| User roles | SUPPORT, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/reports` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Create audited CSV exports with reason and TOTP step-up; downloads expire after 24 hours. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.reports.export; scope by role (P6-4) |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Form, TOTP input, exports table. |
| 5. Components | Form, TOTP input, exports table |
| 6. Displayed data | "Each export needs a reason and a current authenticator code, is recorded in the audit log and can be downloaded only by you for 24 hours."; own exports with report, period, rows, available until, downloaded, state (Ready, Expired). |
| 7. Buttons and actions | Primary: Create export · Secondary: Download |
| 8. Form fields | Required: Report, Scope, From (Dubai date), To (Dubai date), Reason, Authenticator code · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | ≤50k rows; TOTP valid |
| 10. API dependencies | GET/POST /admin/exports; GET /admin/exports/{id}/download |
| Database entities | exports, audit_events |
| Source files | apps/web/src/app/[locale]/admin/reports/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Create export…" and is disabled. |
| 12. Empty state | (suggested) "No reports yet." with a one-line explanation and the action "Create export". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: ≤50k rows; TOTP valid |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: export (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-45 |
| Dependencies and decisions | Founder: compliance may export verification records (P6-4 conflict) |

Form fields:

  - Report (select, Required): orders, refunds, payouts, disputes, support_tickets (scoped by role)
  - Scope (radio, Required): assigned (Assigned to me) or all (All records); support only assigned
  - From (Dubai date) (date, Required)
  - To (Dubai date) (date, Required): ≤366 days
  - Reason (textarea, Required): 1–500
  - Authenticator code (otp, Required): 6 digits

#### ADM-45 · Audit log

| Item | Specification |
|---|---|
| Screen ID | ADM-45 |
| Screen name | Audit log |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/audit` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Append-only audit trail. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.audit.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table, pagination. |
| 5. Components | Filters, table, pagination |
| 6. Displayed data | Time, actor, action, resource, resource ID, reason, request ID. |
| 7. Buttons and actions | Primary: — · Secondary: Filter; load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Actor, action, resource, period · Newest · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/audit |
| Database entities | audit_events |
| Source files | apps/web/src/app/[locale]/admin/audit/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No audit log yet." with a one-line explanation. Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | — |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-46 · Staff and roles

| Item | Specification |
|---|---|
| Screen ID | ADM-46 |
| Screen name | Staff and roles |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN |
| Route / URL | `/{locale}/admin/staff` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Assign staff roles (last super-admin protected). Staff accounts are provisioned by script, not registration. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.staff.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Table, role editor dialog. |
| 5. Components | Table, role editor dialog |
| 6. Displayed data | Email, roles, MFA enabled, status. |
| 7. Buttons and actions | Primary: Edit roles · Secondary: — |
| 8. Form fields | Required: Reason · Optional: Roles (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/staff; POST /admin/staff/{id}/roles |
| Database entities | admin_users, admin_roles |
| Source files | apps/web/src/app/[locale]/admin/staff/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Edit roles…" and is disabled. |
| 12. Empty state | (suggested) "No staff and roles yet." with a one-line explanation and the action "Edit roles". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | — |
| Dependencies and decisions | D03 |

Form fields:

  - Roles (checkboxes, Optional): COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN
  - Reason (textarea, Required)

#### ADM-47 · Platform settings: payout schedule and policy windows

| Item | Specification |
|---|---|
| Screen ID | ADM-47 |
| Screen name | Platform settings: payout schedule and policy windows |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN or finance approver (to be decided) |
| Route / URL | `/{locale}/admin/settings (proposed)` |
| Implementation status | Planned · P1 |
| 1. Purpose | FD-04: configurable payout schedule (default Monday 10:00 Dubai, next working day after UAE public holidays, no minimum at launch subject to provider limits) and the policy windows (dispute window 14 days, auto-close 7 days). Commission moved to ADM-56 (built). |
| 2. Navigation location | Admin nav |
| 3. User permissions | New restricted capability with dual control |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Settings form with effective-from, change log, dual-control confirmation. |
| 5. Components | Settings form with effective-from, change log, dual-control confirmation |
| 6. Displayed data | Payout day and time (Dubai), UAE public holiday calendar (dates entered by finance), minimum payout (0 at launch), dispute window days, ticket auto-close days; change history with actor and reason. |
| 7. Buttons and actions | Primary: Schedule change · Secondary: View history |
| 8. Form fields | Required: Payout day, Payout time (Dubai), Reason for change, Authenticator code · Optional: Public holidays, Minimum payout (AED) (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | New platform_settings with history; orders.commission snapshot |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Schedule change…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Save asks for TOTP: "Payout runs will be created on {day} at {time} (Dubai). Finance approval is still needed for each payout." |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: next payout date shown on SEL-32. |
| Behaviour | — |
| Related screens | SEL-28, ADM-30 |
| Dependencies and decisions | FD-04 answered; P8-5 |

Form fields:

  - Payout day (select, Required): Monday–Sunday (default Monday)
  - Payout time (Dubai) (time, Required): default 10:00
  - Public holidays (date list, Optional): UAE public holidays entered by finance
  - Minimum payout (AED) (money, Optional): default 0
  - Reason for change (textarea, Required)
  - Authenticator code (totp, Required): step-up

#### ADM-56 · Commission policy

| Item | Specification |
|---|---|
| Screen ID | ADM-56 |
| Screen name | Commission policy |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER (view); FINANCE_APPROVER (change) |
| Route / URL | `/{locale}/admin/commission` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Versioned commission rate on merchandise value (excluding VAT and delivery). Only a finance approver records a new version, with reason and TOTP (P8-6, PR #13). FD-05 adds 30 days' advance supplier notice (planned). |
| 2. Navigation location | Admin nav → Commission |
| 3. User permissions | View: FINANCE, FINANCE_APPROVER; change: admin.commission.manage (FINANCE_APPROVER) with TOTP step-up and reason. |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Summary card, form, history table. |
| 5. Components | Summary card, form, history table |
| 6. Displayed data | Current rate and source ("Policy version {version}" or "From configuration…"); history (version, rate, reason, actor, date); "Only a finance approver can change the rate."; planned: effective date at least 30 days ahead and supplier notice status. |
| 7. Buttons and actions | Primary: Save new rate · Secondary: — |
| 8. Form fields | Required: Rate (%), Reason for the change, Authenticator code · Optional: Effective from (planned) (details below) |
| Filters · sorting · search | — · Version descending · — |
| 9. Validation rules | Rate bounds; TOTP valid; reason required. |
| 10. API dependencies | GET/POST /admin/finance/commission |
| Database entities | commission_policies (append-only), checkouts, orders |
| Source files | apps/web/src/app/[locale]/admin/commission/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Save new rate…" and is disabled. |
| 12. Empty state | No versions yet: "From configuration: 10%" with "No commission versions recorded yet." |
| 13. Error states | "Only a finance approver can change the rate." / "The authenticator code is not valid." / rate outside 0–50%. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "New commission rate saved. It applies to new checkouts.". |
| 15. Confirmation dialogs | Save asks for TOTP and shows "New checkouts will use {rate}%. Existing orders keep their rate." Planned: "Suppliers will be notified 30 days before {date}." |
| 16. Mobile layout (360px) | Admin is desktop-first; at 360px tables become stacked cards, filters move to a sheet, actions to a sticky bar. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: commission rate and version on invoice drafts and payouts (SEL-28, SEL-32); planned 30-day notice in-app and by email. |
| Behaviour | "New commission rate saved. It applies to new checkouts."; existing orders keep their snapshot; planned: suppliers notified 30 days before the effective date. |
| Related screens | ADM-30, SEL-32, BUY-37 |
| Dependencies and decisions | FD-05 answered (A); P8-6 |

Form fields:

  - Rate (%) (decimal, Required): > 0 and ≤ 50, e.g. 10 or 7.5
  - Reason for the change (textarea, Required)
  - Authenticator code (totp, Required): 6 digits
  - Effective from (planned) (date, Optional): ≥ today + 30 days (FD-05)

#### ADM-57 · Settlement holds

| Item | Specification |
|---|---|
| Screen ID | ADM-57 |
| Screen name | Settlement holds |
| Experience | Platform administrators |
| User roles | COMPLIANCE, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/holds` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Place and release holds that stop an order's supplier payout: Compliance, Fraud, Reconciliation, Payment investigation (P8-4, PR #13). |
| 2. Navigation location | Admin nav → Settlement holds |
| 3. User permissions | admin.holds.manage (COMPLIANCE, FINANCE, FINANCE_APPROVER). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Form, filter tabs, table, release dialog (ADM-58). |
| 5. Components | Form, filter tabs, table, release dialog (ADM-58) |
| 6. Displayed data | Intro text; place-hold form; list with order, type, reason, placed by, released by, dates; filter Active / Released; empty "No holds." |
| 7. Buttons and actions | Primary: Place a hold · Secondary: Release |
| 8. Form fields | Required: Order ID, Type, Reason · Optional: — (details below) |
| Filters · sorting · search | Active / Released · Newest first · — |
| 9. Validation rules | One active hold per kind per order. |
| 10. API dependencies | GET/POST /admin/holds |
| Database entities | order_holds (never deleted), audit_events |
| Source files | apps/web/src/app/[locale]/admin/holds/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Place a hold…" and is disabled. |
| 12. Empty state | (existing) "No holds." Action: Place a hold. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: One active hold per kind per order. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Hold placed. The order cannot be paid out until it is released." / "already been paid out" / "already has an active hold of that type". |
| 15. Confirmation dialogs | Place a hold: inline confirm "Place a {type} hold on {order}? Its payout stops until released." Release: ADM-58. |
| 16. Mobile layout (360px) | Admin is desktop-first; at 360px tables become stacked cards, filters move to a sheet, actions to a sticky bar. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: settlement shows "Held" on SEL-28 and SEL-32 without the internal reason; Buyer: nothing changes. |
| Behaviour | "Hold placed. The order cannot be paid out until it is released."; errors "already been paid out", "already has an active hold of that type". |
| Related screens | ADM-29, ADM-35, ADM-58 |
| Dependencies and decisions | P8-4 |

Form fields:

  - Order ID (uuid, Required)
  - Type (select, Required): COMPLIANCE, FRAUD, RECONCILIATION, PAYMENT_INVESTIGATION
  - Reason (textarea, Required)

#### ADM-58 · Release hold dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-58 |
| Screen name | Release hold dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE, FINANCE, FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-57` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Release a hold with a reason. |
| 2. Navigation location | Opened from ADM-57 Settlement holds |
| 3. User permissions | COMPLIANCE, FINANCE, FINANCE_APPROVER |
| 4. Screen layout | Dialog over ADM-57 Settlement holds: title, context text, fields, footer with secondary action then primary action. Content: Dialog with textarea. |
| 5. Components | Dialog with textarea |
| 6. Displayed data | "Release the hold on {number}?" |
| 7. Buttons and actions | Primary: Release · Secondary: Cancel |
| 8. Form fields | Required: Reason for releasing · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | "This hold has already been released." |
| 10. API dependencies | POST /admin/holds/{id}/release |
| Database entities | order_holds |
| Source files | apps/web/src/app/[locale]/admin/holds/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Release…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: "This hold has already been released." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Release" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: settlement returns from "Held" to its normal state on SEL-28/SEL-32. |
| Behaviour | Order is re-evaluated for payout eligibility. |
| Related screens | ADM-57 |
| Dependencies and decisions | P8-4 |

Form fields:

  - Reason for releasing (textarea, Required)

#### ADM-48 · Logistics and delivery settings

| Item | Specification |
|---|---|
| Screen ID | ADM-48 |
| Screen name | Logistics and delivery settings |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN |
| Route / URL | `/{locale}/admin/logistics (proposed)` |
| Implementation status | Planned · P2 |
| 1. Purpose | Founder: supplier-arranged, courier, collection, per-order charges, proof of delivery. Nothing platform-side exists beyond seller delivery terms. |
| 2. Navigation location | Admin nav |
| 3. User permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Settings form. |
| 5. Components | Settings form |
| 6. Displayed data | Delivery methods, courier partners (future), proof requirements. |
| 7. Buttons and actions | Primary: Save · Secondary: — |
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
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Manufacturers and supplier: SEL-04 Delivery terms |
| Behaviour | — |
| Related screens | SEL-04 |
| Dependencies and decisions | Logistics decision |

Form fields:

  - None

#### ADM-49 · System health and webhooks

| Item | Specification |
|---|---|
| Screen ID | ADM-49 |
| Screen name | System health and webhooks |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN, FINANCE (webhooks) |
| Route / URL | `/{locale}/admin/system (proposed)` |
| Implementation status | Recommended · P2 |
| 1. Purpose | Integration status, quarantined webhooks, queue depth, worker jobs. Public /status exists; admin view only shows a quarantine count. |
| 2. Navigation location | Admin nav |
| 3. User permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Status tiles, table. |
| 5. Components | Status tiles, table |
| 6. Displayed data | Integrations (mode: sandbox/live), webhook events, failures, retries. |
| 7. Buttons and actions | Primary: Retry / inspect · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | webhook_events, outbox |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | PUB-15, ADM-01 |
| Dependencies and decisions | — |

Form fields:

  - None

#### ADM-50 · Tax configuration and invoicing

| Item | Specification |
|---|---|
| Screen ID | ADM-50 |
| Screen name | Tax configuration and invoicing |
| Experience | Platform administrators |
| User roles | FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/tax (proposed)` |
| Implementation status | Blocked · P1 |
| 1. Purpose | Founder chose the disclosed-intermediary model pending professional approval: supplier TRNs, VAT only for registered suppliers, commission invoices, credit notes. Today tax applies regardless of supplier registration. |
| 2. Navigation location | Admin nav |
| 3. User permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Settings, tables. |
| 5. Components | Settings, tables |
| 6. Displayed data | VAT rate, supplier registration status, invoice numbering, credit notes. |
| 7. Buttons and actions | Primary: Save · Secondary: — |
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
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: BUY-28 Invoices and tax documents (buyer); Manufacturers and supplier: SEL-34 Statements and commission invoices |
| Behaviour | — |
| Related screens | BUY-28, SEL-34 |
| Dependencies and decisions | Tax adviser approval; Gap G-04; TAX_TREATMENT is a deployment setting since PR #14 (P8-9); a tax screen stays blocked until the tax adviser is appointed (FD-06). |

Form fields:

  - None

#### ADM-51 · Data requests, account closure and legal hold

| Item | Specification |
|---|---|
| Screen ID | ADM-51 |
| Screen name | Data requests, account closure and legal hold |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/data-requests (proposed)` |
| Implementation status | Planned · P1 |
| 1. Purpose | Founder: configurable retention, account closure, DSAR and legal-hold workflows. None exist. |
| 2. Navigation location | Admin nav |
| 3. User permissions | New capability |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Queue, detail, actions. |
| 5. Components | Queue, detail, actions |
| 6. Displayed data | Request type, subject, due date, state, legal hold flag. |
| 7. Buttons and actions | Primary: Process request · Secondary: Place legal hold |
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
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ACC-16 |
| Dependencies and decisions | Legal drafts; Gap G-15 |

Form fields:

  - None

#### ADM-52 · Executive analytics

| Item | Specification |
|---|---|
| Screen ID | ADM-52 |
| Screen name | Executive analytics |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN, FINANCE |
| Route / URL | `/{locale}/admin/analytics (proposed)` |
| Implementation status | Recommended · P2 |
| 1. Purpose | Trends beyond the operations overview: GMV over time, active buyers/suppliers, RFQ conversion, category performance. |
| 2. Navigation location | Admin nav |
| 3. User permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: KPI tiles, charts, tables. |
| 5. Components | KPI tiles, charts, tables |
| 6. Displayed data | Charts by period. |
| 7. Buttons and actions | Primary: — · Secondary: Change period; export |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Period, category · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | Confirm in a dialog before: export (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-01 |
| Dependencies and decisions | Analytics scope |

Form fields:

  - None

#### ADM-53 · Sandbox provider simulator

| Item | Specification |
|---|---|
| Screen ID | ADM-53 |
| Screen name | Sandbox provider simulator |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER (development only) |
| Route / URL | `Action on ADM-32 / ADM-35` |
| Implementation status | Implemented · P2 |
| 1. Purpose | SANDBOX ONLY: simulate the provider finishing a refund or payout. Must never appear in production. |
| 2. Navigation location | Opened from ADM-32 Refunds |
| 3. User permissions | Finance roles; only when PAYMENT_MODE=mock |
| 4. Screen layout | Inline action on ADM-32 Refunds; result shown in place. |
| 5. Components | Inline button group with sandbox pill |
| 6. Displayed data | Operation reference, outcome buttons, "Sandbox" label. |
| 7. Buttons and actions | Primary: Simulate success · Secondary: Simulate failure |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/sandbox/operations/{ref}/complete |
| Database entities | refunds, payouts, ledger_entries |
| Source files | refunds/page.tsx; payouts/page.tsx |
| 11. Loading state | Button shows progress text and is disabled until the server responds. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | — |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-32, ADM-35 |
| Dependencies and decisions | — |

Form fields:

  - None

### Part D. Shared, public and system screens

#### PUB-01 · Marketplace home

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

#### PUB-02 · Category directory

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

#### PUB-03 · Category page

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

#### PUB-04 · Search results

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

#### PUB-05 · Filter panel / mobile filter sheet

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

#### PUB-06 · Search suggestions dropdown

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

#### PUB-07 · Product detail

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

#### PUB-08 · Product image viewer (lightbox)

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

#### PUB-09 · Supplier directory

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

#### PUB-10 · Supplier storefront (manufacturer profile)

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

#### PUB-11 · Saved products and suppliers

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

#### PUB-12 · Product comparison

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

#### PUB-13 · Recently viewed

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

#### PUB-14 · Marketplace preferences

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

#### PUB-15 · System status

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

#### PUB-16 · About the platform

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

#### PUB-17 · How it works

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

#### PUB-18 · Pricing and fees

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

#### PUB-19 · Frequently asked questions

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

#### PUB-20 · Help centre

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

#### PUB-21 · Contact

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

#### PUB-22 · Terms and conditions

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

#### PUB-23 · Privacy policy

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

#### PUB-24 · Returns, refunds and cancellation policy

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

#### PUB-25 · Other policy pages (template)

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

#### PUB-26 · Become a supplier

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

#### PUB-27 · Site footer and legal centre

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

#### AUTH-01 · Create account (register)

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

#### AUTH-02 · Check your email

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

#### AUTH-03 · Verify email

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

#### AUTH-04 · Sign in

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

#### AUTH-05 · Forgot password

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

#### AUTH-06 · Reset password

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

#### AUTH-07 · Email verification gate

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

#### AUTH-08 · Accept team invitation

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

#### AUTH-09 · Session expired / signed out

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

#### ACC-01 · Home (workspace hub)

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

#### ACC-02 · Register a company (onboarding)

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

#### ACC-03 · Company profile and verification

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

#### ACC-04 · Edit company details

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

#### ACC-05 · Verification document upload

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

#### ACC-06 · Submit for verification (terms)

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

#### ACC-07 · Licence renewal

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

#### ACC-19 · VAT registration (company section)

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

#### ACC-08 · Remove document dialog

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

#### ACC-09 · Team management

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

#### ACC-10 · Invite team member form

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

#### ACC-11 · Change role dialog

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

#### ACC-12 · Remove access dialog

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

#### ACC-13 · Account settings

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

#### ACC-14 · Notification centre

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

#### ACC-15 · Workspace switcher

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

#### ACC-16 · Account closure and data requests

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

#### ACC-17 · Billing, invoices and statements

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

#### ACC-18 · Policy acceptance and re-acceptance (clickwrap)

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

#### MSG-01 · Conversations list

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

#### MSG-02 · Conversation thread

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

#### MSG-03 · New message to supplier

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

#### MSG-04 · Message attachments

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

#### SYS-01 · Not found / not available

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

#### SYS-02 · Error with retry and reference

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

#### SYS-03 · Sandbox environment banner

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

#### SYS-04 · Trading unavailable / maintenance

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

#### SHR-01 · Disputes list

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

#### SHR-02 · Dispute detail

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

#### SHR-03 · Support tickets list

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

#### SHR-04 · New support ticket

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

#### SHR-05 · Support ticket detail

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

#### SHR-06 · Close or reopen ticket dialog

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
