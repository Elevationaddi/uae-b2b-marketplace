# 4. Complete screen inventory

Status legend: **Implemented** (on `main`, tested) · **Partial** (works but incomplete or conflicts with a founder decision) · **Planned** (approved or required, not built) · **Recommended** (proposed by this audit) · **Blocked** (needs external approval, provider or legal input). Priority: **P0** essential for launch · **P1** important for launch · **P2** post-launch.

**197 individually numbered screens.** Every page, dialog, drawer, overlay and significant page section that needs its own design is listed separately. IDs are stable and used across the sitemap, journeys, checklist, handoff map and spreadsheets. Routes are prefixed with `/{locale}` (`/en` or `/ar`); admin routes are served from the separate admin origin. "Recommended", "Planned" and "Blocked" screens are included so the designer can plan them, but they do not exist in the code.

## 4.1 Totals

| Measure | Count |
|---|---|
| Unique screens | 197 |
| Status: Implemented | 154 |
| Status: Partial | 3 |
| Status: Planned | 13 |
| Status: Recommended | 16 |
| Status: Blocked | 11 |
| Priority: P0 | 116 |
| Priority: P1 | 57 |
| Priority: P2 | 24 |
| Type: Action | 3 |
| Type: Dialog | 38 |
| Type: Drawer | 1 |
| Type: External page | 1 |
| Type: Overlay | 3 |
| Type: Page | 131 |
| Type: Section | 20 |


| Area | Screens |
|---|---|
| Public website | 23 |
| Public website (signed-in) | 4 |
| Authentication | 9 |
| Authentication (admin) | 4 |
| Account management | 16 |
| Communication | 5 |
| Buyer workspace | 32 |
| Shared (buyer + seller) | 6 |
| Payment | 3 |
| Seller workspace | 38 |
| Admin portal | 53 |
| System | 4 |


## 4.2 Index

| ID | Screen | Area | Roles | Route | Type | Status | Priority |
|---|---|---|---|---|---|---|---|
| PUB-01 | Marketplace home | Public website | Guest, verified user, all company users | `/{locale}` | Page | Implemented | P0 |
| PUB-02 | Category directory | Public website | Guest, verified user | `/{locale}/categories` | Page | Implemented | P0 |
| PUB-03 | Category page | Public website | Guest, verified user | `/{locale}/categories/[id]` | Page | Implemented | P0 |
| PUB-04 | Search results | Public website | Guest, verified user | `/{locale}/search?q=&…` | Page | Implemented | P0 |
| PUB-05 | Filter panel / mobile filter sheet | Public website | Guest, verified user | `Overlay on PUB-03/PUB-04` | Overlay | Partial | P0 |
| PUB-06 | Search suggestions dropdown | Public website | Guest, verified user | `Overlay on header search` | Overlay | Implemented | P1 |
| PUB-07 | Product detail | Public website | Guest, verified user, approved buyer (OWNER/PROCUREMENT) | `/{locale}/products/[id]` | Page | Implemented | P0 |
| PUB-08 | Product image viewer (lightbox) | Public website | All marketplace viewers | `Overlay on PUB-07` | Overlay | Recommended | P1 |
| PUB-09 | Supplier directory | Public website | Guest, verified user | `/{locale}/suppliers` | Page | Implemented | P0 |
| PUB-10 | Supplier storefront (manufacturer profile) | Public website | Guest, verified user, approved buyer | `/{locale}/suppliers/[id]` | Page | Implemented | P0 |
| PUB-11 | Saved products and suppliers | Public website (signed-in) | Email-verified user | `/{locale}/saved` | Page | Implemented | P1 |
| PUB-12 | Product comparison | Public website (signed-in) | Email-verified user | `/{locale}/compare` | Page | Implemented | P1 |
| PUB-13 | Recently viewed | Public website (signed-in) | Email-verified user | `/{locale}/recent` | Page | Implemented | P2 |
| PUB-14 | Marketplace preferences | Public website (signed-in) | Email-verified user | `/{locale}/preferences` | Page | Implemented | P2 |
| PUB-15 | System status | Public website | Anyone | `/{locale}/status` | Page | Implemented | P2 |
| PUB-16 | About the platform | Public website | Anyone | `/{locale}/about (recommended)` | Page | Recommended | P1 |
| PUB-17 | How it works | Public website | Anyone | `/{locale}/how-it-works (recommended)` | Page | Recommended | P1 |
| PUB-18 | Pricing and fees | Public website | Anyone | `/{locale}/pricing (recommended)` | Page | Recommended | P1 |
| PUB-19 | Frequently asked questions | Public website | Anyone | `/{locale}/faq (recommended)` | Page | Recommended | P1 |
| PUB-20 | Help centre | Public website | Anyone; signed-in users see ticket shortcut | `/{locale}/help (recommended)` | Page | Recommended | P2 |
| PUB-21 | Contact | Public website | Anyone | `/{locale}/contact (recommended)` | Page | Recommended | P1 |
| PUB-22 | Terms and conditions | Public website | Anyone | `/{locale}/legal/terms (recommended)` | Page | Blocked | P0 |
| PUB-23 | Privacy policy | Public website | Anyone | `/{locale}/legal/privacy (recommended)` | Page | Blocked | P0 |
| PUB-24 | Returns, refunds and cancellation policy | Public website | Anyone | `/{locale}/legal/returns (recommended)` | Page | Blocked | P0 |
| PUB-25 | Other policy pages (template) | Public website | Anyone | `/{locale}/legal/[slug] (recommended)` | Page | Blocked | P1 |
| PUB-26 | Become a supplier | Public website | Anyone | `/{locale}/sell (recommended)` | Page | Recommended | P1 |
| PUB-27 | Site footer and legal centre | Public website | Anyone | `Global footer` | Page | Recommended | P0 |
| AUTH-01 | Create account (register) | Authentication | Guest | `/{locale}/register` | Page | Implemented | P0 |
| AUTH-02 | Check your email | Authentication | Guest | `/{locale}/register (success state)` | Page | Implemented | P0 |
| AUTH-03 | Verify email | Authentication | Guest or signed-in user | `/{locale}/verify-email#token=…` | Page | Implemented | P0 |
| AUTH-04 | Sign in | Authentication | Company user | `/{locale}/login?next=` | Page | Implemented | P0 |
| AUTH-05 | Forgot password | Authentication | Guest | `/{locale}/forgot-password` | Page | Implemented | P0 |
| AUTH-06 | Reset password | Authentication | Guest | `/{locale}/reset-password#token=…` | Page | Implemented | P0 |
| AUTH-07 | Email verification gate | Authentication | Signed-in, unverified user | `Any /app route before verification` | Page | Implemented | P0 |
| AUTH-08 | Accept team invitation | Authentication | Invitee (guest or signed-in) | `/{locale}/invitations/accept#token=…` | Page | Implemented | P0 |
| AUTH-09 | Session expired / signed out | Authentication | Company user | `Redirect to /{locale}/login?next=` | Page | Partial | P1 |
| AUTH-10 | Admin sign in | Authentication (admin) | Platform staff | `/{locale}/admin/login (admin origin only)` | Page | Implemented | P0 |
| AUTH-11 | Admin MFA enrolment | Authentication (admin) | Platform staff (first sign-in) | `/{locale}/admin/mfa` | Page | Implemented | P0 |
| AUTH-12 | Admin recovery codes | Authentication (admin) | Platform staff | `/{locale}/admin/mfa (step)` | Page | Implemented | P0 |
| AUTH-13 | Admin MFA verification | Authentication (admin) | Platform staff | `/{locale}/admin/mfa (verify)` | Page | Implemented | P0 |
| ACC-01 | Home (workspace hub) | Account management | All company users | `/{locale}/app` | Page | Implemented | P0 |
| ACC-02 | Register a company (onboarding) | Account management | Verified user | `/{locale}/app/onboarding` | Page | Implemented | P0 |
| ACC-03 | Company profile and verification | Account management | All company members (edit: OWNER) | `/{locale}/app/company/[companyId]` | Page | Implemented | P0 |
| ACC-04 | Edit company details | Account management | OWNER | `Mode of ACC-03` | Page | Implemented | P0 |
| ACC-05 | Verification document upload | Account management | OWNER | `Section of ACC-03` | Section | Implemented | P0 |
| ACC-06 | Submit for verification (terms) | Account management | OWNER | `Section of ACC-03` | Section | Implemented | P0 |
| ACC-07 | Licence renewal | Account management | OWNER | `Section of ACC-03` | Section | Implemented | P0 |
| ACC-08 | Remove document dialog | Account management | OWNER | `Dialog on ACC-03` | Dialog | Implemented | P1 |
| ACC-09 | Team management | Account management | All members (manage: OWNER) | `/{locale}/app/team/[workspaceId]` | Page | Implemented | P0 |
| ACC-10 | Invite team member form | Account management | OWNER | `Section of ACC-09` | Section | Implemented | P0 |
| ACC-11 | Change role dialog | Account management | OWNER | `Dialog on ACC-09` | Dialog | Implemented | P1 |
| ACC-12 | Remove access dialog | Account management | OWNER | `Dialog on ACC-09` | Dialog | Implemented | P1 |
| ACC-13 | Account settings | Account management | All company users | `/{locale}/app/settings` | Page | Implemented | P0 |
| ACC-14 | Notification centre | Communication | All company users | `/{locale}/app/notifications` | Page | Implemented | P0 |
| ACC-15 | Workspace switcher | Account management | Users with more than one workspace | `Header control (all /app pages)` | Page | Implemented | P0 |
| ACC-16 | Account closure and data requests | Account management | User; OWNER for company | `Not built` | Page | Planned | P1 |
| ACC-17 | Billing, invoices and statements | Account management | Buyer OWNER/PROCUREMENT; seller OWNER/FINANCE | `Not built (spec /account/billing, /finance/invoices)` | Page | Blocked | P0 |
| MSG-01 | Conversations list | Communication | Buyer OWNER/PROCUREMENT; seller OWNER/SALES | `/{locale}/app/messages/[workspaceId]` | Page | Implemented | P0 |
| MSG-02 | Conversation thread | Communication | Buyer OWNER/PROCUREMENT; seller OWNER/SALES | `/{locale}/app/messages/[workspaceId]/[conversationId]` | Page | Implemented | P0 |
| MSG-03 | New message to supplier | Communication | Approved buyer OWNER/PROCUREMENT | `/{locale}/app/messages/new?storefront=…` | Page | Implemented | P1 |
| MSG-04 | Message attachments | Communication | Messaging roles | `Part of MSG-02` | Section | Planned | P1 |
| SYS-01 | Not found / not available | System | All | `Any unknown or inaccessible resource` | Page | Implemented | P0 |
| SYS-02 | Error with retry and reference | System | All | `Any failed load or action` | Page | Implemented | P0 |
| SYS-03 | Sandbox environment banner | System | All | `Global (top of every page)` | Page | Implemented | P0 |
| SYS-04 | Trading unavailable / maintenance | System | All | `Recommended` | Page | Recommended | P2 |
| BUY-01 | Buyer dashboard | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]` | Page | Recommended | P0 |
| BUY-02 | Requests for quotation list | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/rfqs` | Page | Implemented | P0 |
| BUY-03 | New request for quotation | Buyer workspace | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/rfqs/new` | Page | Implemented | P0 |
| BUY-04 | Request quotation entry (workspace chooser) | Buyer workspace | Any signed-in user | `/{locale}/app/rfqs/new` | Page | Implemented | P1 |
| BUY-05 | Request for quotation detail (buyer) | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId]` | Page | Implemented | P0 |
| BUY-06 | Edit request draft | Buyer workspace | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId] (edit mode)` | Page | Implemented | P0 |
| BUY-07 | Publish request dialog | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-08 | Cancel request dialog | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-09 | Invite suppliers picker | Buyer workspace | Buyer OWNER, PROCUREMENT | `Panel in BUY-03/BUY-06` | Section | Implemented | P0 |
| BUY-10 | Quote comparison | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `Section of BUY-05` | Section | Implemented | P0 |
| BUY-11 | Quote detail and version history | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `Expandable within BUY-05` | Section | Implemented | P0 |
| BUY-12 | Accept quote dialog | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-13 | Request revision dialog | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-14 | Decline quote dialog | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05` | Dialog | Implemented | P0 |
| BUY-15 | Counteroffer to supplier | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-05 (proposed)` | Dialog | Planned | P1 |
| BUY-16 | Cart | Buyer workspace | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/cart` | Page | Implemented | P0 |
| BUY-17 | Checkout | Buyer workspace | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/checkout` | Page | Implemented | P0 |
| BUY-18 | Checkout status and payment | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId]` | Page | Implemented | P0 |
| BUY-19 | Cancel checkout dialog | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-18` | Dialog | Implemented | P0 |
| BUY-20 | Delivery addresses | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/addresses` | Page | Implemented | P0 |
| BUY-21 | Address form | Buyer workspace | Buyer OWNER, PROCUREMENT | `Form on BUY-20` | Section | Implemented | P0 |
| BUY-22 | Remove address dialog | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-20` | Dialog | Implemented | P1 |
| BUY-23 | Orders list (buyer) | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/orders` | Page | Implemented | P0 |
| BUY-24 | Order detail (buyer) | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/orders/[orderId]` | Page | Implemented | P0 |
| BUY-25 | Confirm receipt dialog | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-24` | Dialog | Implemented | P0 |
| BUY-26 | Rate supplier form | Buyer workspace | Buyer OWNER, PROCUREMENT | `Section of BUY-24` | Section | Implemented | P1 |
| BUY-27 | Open dispute form (buyer) | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-24` | Dialog | Implemented | P0 |
| BUY-28 | Invoices and tax documents (buyer) | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/invoices (proposed)` | Page | Blocked | P1 |
| BUY-29 | Payment history (buyer) | Buyer workspace | Buyer OWNER, PROCUREMENT, VIEWER | `/{locale}/app/buyer/[workspaceId]/payments (proposed)` | Page | Recommended | P2 |
| BUY-30 | Reorder | Buyer workspace | Buyer OWNER, PROCUREMENT | `Action on BUY-24 (proposed)` | Action | Planned | P2 |
| BUY-31 | Request order cancellation (buyer) | Buyer workspace | Buyer OWNER, PROCUREMENT | `Dialog on BUY-24 (proposed)` | Dialog | Planned | P1 |
| BUY-32 | Request a sample | Buyer workspace | Buyer OWNER, PROCUREMENT | `Action on PUB-07 (proposed)` | Action | Recommended | P2 |
| SHR-01 | Disputes list | Shared (buyer + seller) | Buyer and seller workspace members | `/{locale}/app/buyer/[workspaceId]/disputes and /{locale}/app/seller/[workspaceId]/disputes` | Page | Implemented | P0 |
| SHR-02 | Dispute detail | Shared (buyer + seller) | Buyer and seller workspace members | `/{locale}/app/buyer/[workspaceId]/disputes/[disputeId] and /{locale}/app/seller/[workspaceId]/disputes/[disputeId]` | Page | Implemented | P0 |
| SHR-03 | Support tickets list | Shared (buyer + seller) | Any workspace member | `/{locale}/app/buyer/[workspaceId]/support and /{locale}/app/seller/[workspaceId]/support` | Page | Implemented | P1 |
| SHR-04 | New support ticket | Shared (buyer + seller) | Workspace members except VIEWER | `/{locale}/app/buyer/[workspaceId]/support/new and /{locale}/app/seller/[workspaceId]/support/new` | Page | Implemented | P1 |
| SHR-05 | Support ticket detail | Shared (buyer + seller) | Any workspace member | `/{locale}/app/buyer/[workspaceId]/support/[ticketId] and /{locale}/app/seller/[workspaceId]/support/[ticketId]` | Page | Implemented | P1 |
| SHR-06 | Close or reopen ticket dialog | Shared (buyer + seller) | Workspace members except VIEWER | `Dialog on SHR-05` | Dialog | Implemented | P2 |
| FIN-01 | Sandbox payment page | Payment | Buyer OWNER, PROCUREMENT | `/{locale}/sandbox-pay/[sessionId]` | Page | Implemented | P0 |
| FIN-02 | Live payment provider checkout | Payment | Buyer OWNER, PROCUREMENT | `Provider-hosted page (external)` | External page | Blocked | P0 |
| FIN-03 | Bank transfer instructions | Payment | Buyer OWNER, PROCUREMENT | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId] (proposed state)` | Page | Blocked | P1 |
| SEL-01 | Seller overview (dashboard) | Seller workspace | Seller OWNER, SALES, WAREHOUSE, FINANCE, VIEWER | `/{locale}/app/seller/[workspaceId]` | Page | Implemented | P0 |
| SEL-02 | Storefront editor | Seller workspace | Seller OWNER, SALES (edit); others read | `/{locale}/app/seller/[workspaceId]/storefront` | Page | Implemented | P0 |
| SEL-03 | Storefront media manager | Seller workspace | Seller OWNER, SALES | `Section of SEL-02` | Section | Implemented | P1 |
| SEL-04 | Delivery terms | Seller workspace | Seller OWNER, SALES | `Section of SEL-02` | Section | Implemented | P0 |
| SEL-05 | Publish or take storefront offline dialog | Seller workspace | Seller OWNER, SALES | `Dialog on SEL-02` | Dialog | Implemented | P1 |
| SEL-06 | Product list | Seller workspace | Seller workspace members | `/{locale}/app/seller/[workspaceId]/products` | Page | Implemented | P0 |
| SEL-07 | Add product | Seller workspace | Seller OWNER, SALES | `/{locale}/app/seller/[workspaceId]/products/new` | Page | Implemented | P0 |
| SEL-08 | Product editor (content) | Seller workspace | Seller OWNER, SALES (edit); others read | `/{locale}/app/seller/[workspaceId]/products/[productId]` | Page | Implemented | P0 |
| SEL-09 | Product media manager | Seller workspace | Seller OWNER, SALES | `Section of SEL-08` | Section | Implemented | P0 |
| SEL-10 | Variants (SKU) manager | Seller workspace | Seller OWNER, SALES | `Section of SEL-08` | Section | Implemented | P0 |
| SEL-11 | Product pricing editor | Seller workspace | Seller OWNER, SALES | `Section of SEL-08` | Section | Implemented | P0 |
| SEL-12 | Submit for review dialog | Seller workspace | Seller OWNER, SALES | `Dialog on SEL-08` | Dialog | Implemented | P0 |
| SEL-13 | Listing lifecycle dialogs | Seller workspace | Seller OWNER, SALES | `Dialogs on SEL-08` | Dialog | Implemented | P1 |
| SEL-14 | Moderation history | Seller workspace | Seller workspace members | `Section of SEL-08` | Section | Implemented | P1 |
| SEL-15 | Inventory | Seller workspace | Seller workspace members | `/{locale}/app/seller/[workspaceId]/inventory` | Page | Implemented | P0 |
| SEL-16 | Stock adjustment dialog | Seller workspace | Seller OWNER, SALES, WAREHOUSE | `Dialog on SEL-15` | Dialog | Implemented | P0 |
| SEL-17 | Low-stock threshold and restock date | Seller workspace | Seller OWNER, SALES, WAREHOUSE | `Inline form on SEL-15` | Section | Implemented | P2 |
| SEL-18 | Stock movement history | Seller workspace | Seller workspace members | `Drawer on SEL-15` | Drawer | Implemented | P1 |
| SEL-19 | Pricing overview | Seller workspace | Seller workspace members | `/{locale}/app/seller/[workspaceId]/pricing` | Page | Implemented | P1 |
| SEL-20 | Quotation requests inbox | Seller workspace | Seller workspace members | `/{locale}/app/seller/[workspaceId]/rfqs` | Page | Implemented | P0 |
| SEL-21 | Request detail (seller) | Seller workspace | Seller workspace members | `/{locale}/app/seller/[workspaceId]/rfqs/[rfqId]` | Page | Implemented | P0 |
| SEL-22 | Quote form | Seller workspace | Seller OWNER, SALES | `Form on SEL-21` | Section | Implemented | P0 |
| SEL-23 | Submit quote dialog | Seller workspace | Seller OWNER, SALES | `Dialog on SEL-21` | Dialog | Implemented | P0 |
| SEL-24 | Withdraw quote dialog | Seller workspace | Seller OWNER, SALES | `Dialog on SEL-21` | Dialog | Implemented | P1 |
| SEL-25 | Ask the buyer a question | Seller workspace | Seller OWNER, SALES | `Dialog on SEL-21` | Dialog | Implemented | P1 |
| SEL-26 | Quotes list (seller) | Seller workspace | Seller workspace members | `/{locale}/app/seller/[workspaceId]/quotes` | Page | Implemented | P1 |
| SEL-27 | Orders list (seller) | Seller workspace | Seller workspace members | `/{locale}/app/seller/[workspaceId]/orders` | Page | Implemented | P0 |
| SEL-28 | Order detail (seller) | Seller workspace | Seller workspace members | `/{locale}/app/seller/[workspaceId]/orders/[orderId]` | Page | Implemented | P0 |
| SEL-29 | Record dispatch dialog | Seller workspace | Seller OWNER, SALES, WAREHOUSE | `Dialog on SEL-28` | Dialog | Implemented | P0 |
| SEL-30 | Report delivery dialog | Seller workspace | Seller OWNER, SALES, WAREHOUSE | `Dialog on SEL-28` | Dialog | Implemented | P0 |
| SEL-31 | Open dispute (seller) | Seller workspace | Seller OWNER, SALES, WAREHOUSE | `Dialog on SEL-28` | Dialog | Implemented | P2 |
| SEL-32 | Seller finance | Seller workspace | Seller OWNER, FINANCE | `/{locale}/app/seller/[workspaceId]/finance` | Page | Implemented | P0 |
| SEL-33 | Payout account onboarding | Seller workspace | Seller OWNER, FINANCE | `/{locale}/app/seller/[workspaceId]/finance/payout-account (proposed)` | Page | Blocked | P0 |
| SEL-34 | Statements and commission invoices | Seller workspace | Seller OWNER, FINANCE | `/{locale}/app/seller/[workspaceId]/finance/statements (proposed)` | Page | Blocked | P1 |
| SEL-35 | Seller analytics | Seller workspace | Seller OWNER, SALES, FINANCE | `/{locale}/app/seller/[workspaceId]/analytics (proposed)` | Page | Planned | P2 |
| SEL-36 | Supplier order cancellation | Seller workspace | Seller OWNER, SALES | `Dialog on SEL-28 (proposed)` | Dialog | Planned | P1 |
| SEL-37 | Returns handling | Seller workspace | Seller OWNER, SALES, WAREHOUSE | `/{locale}/app/seller/[workspaceId]/returns (proposed)` | Page | Planned | P2 |
| SEL-38 | Production milestones (made to order) | Seller workspace | Seller OWNER, SALES, WAREHOUSE | `Section of SEL-28 (proposed)` | Section | Recommended | P2 |
| ADM-01 | Admin overview and operations | Admin portal | All admin roles (content varies by capability) | `/{locale}/admin` | Page | Implemented | P0 |
| ADM-02 | Verification queue | Admin portal | COMPLIANCE | `/{locale}/admin/verification` | Page | Implemented | P0 |
| ADM-03 | Verification case detail | Admin portal | COMPLIANCE | `/{locale}/admin/verification/[caseId]` | Page | Implemented | P0 |
| ADM-04 | Verification decision dialog | Admin portal | COMPLIANCE | `Dialog on ADM-03` | Dialog | Implemented | P0 |
| ADM-05 | Companies | Admin portal | COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN | `/{locale}/admin/companies` | Page | Implemented | P0 |
| ADM-06 | Company detail (admin) | Admin portal | Admin roles with companies.read | `/{locale}/admin/companies/[companyId]` | Page | Implemented | P0 |
| ADM-07 | Suspend or reactivate company dialog | Admin portal | COMPLIANCE | `Dialog on ADM-06` | Dialog | Implemented | P0 |
| ADM-08 | Users | Admin portal | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/users` | Page | Implemented | P1 |
| ADM-09 | Revoke sessions dialog | Admin portal | COMPLIANCE, SUPER_ADMIN | `Dialog on ADM-08` | Dialog | Implemented | P1 |
| ADM-10 | Catalogue moderation overview | Admin portal | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog` | Page | Implemented | P0 |
| ADM-11 | Moderation queue | Admin portal | COMPLIANCE (decide); SUPPORT, SUPER_ADMIN (read) | `/{locale}/admin/catalog (queue section)` | Page | Implemented | P0 |
| ADM-12 | Listing version review (diff) | Admin portal | COMPLIANCE | `/{locale}/admin/catalog/reviews/[versionId]` | Page | Implemented | P0 |
| ADM-13 | Review decision dialog | Admin portal | COMPLIANCE | `Dialog on ADM-12` | Dialog | Implemented | P0 |
| ADM-14 | All listings | Admin portal | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog/products` | Page | Implemented | P1 |
| ADM-15 | Listing detail (admin) | Admin portal | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog/products/[id]` | Page | Implemented | P1 |
| ADM-16 | Listing enforcement dialog | Admin portal | COMPLIANCE | `Dialog on ADM-15` | Dialog | Implemented | P1 |
| ADM-17 | Storefront oversight | Admin portal | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog/storefronts` | Page | Implemented | P1 |
| ADM-18 | Storefront detail (admin) | Admin portal | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/catalog/storefronts/[id] (proposed)` | Page | Planned | P2 |
| ADM-19 | Hide or restore storefront dialog | Admin portal | COMPLIANCE | `Dialog on ADM-17` | Dialog | Implemented | P1 |
| ADM-20 | Categories | Admin portal | COMPLIANCE, SUPER_ADMIN (manage); others read | `/{locale}/admin/catalog/categories` | Page | Implemented | P1 |
| ADM-21 | Category editor | Admin portal | COMPLIANCE, SUPER_ADMIN | `/{locale}/admin/catalog/categories/[id]` | Page | Implemented | P1 |
| ADM-22 | Category attribute editor | Admin portal | COMPLIANCE, SUPER_ADMIN | `Dialog on ADM-21` | Dialog | Implemented | P2 |
| ADM-23 | Restricted and prohibited terms | Admin portal | COMPLIANCE | `/{locale}/admin/catalog/restricted` | Page | Implemented | P2 |
| ADM-24 | Featured placements | Admin portal | COMPLIANCE, SUPER_ADMIN | `/{locale}/admin/catalog/featured` | Page | Implemented | P2 |
| ADM-25 | RFQ oversight | Admin portal | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/rfqs` | Page | Implemented | P1 |
| ADM-26 | RFQ detail (admin) | Admin portal | COMPLIANCE, SUPPORT, SUPER_ADMIN | `/{locale}/admin/rfqs/[id]` | Page | Implemented | P1 |
| ADM-27 | Hide or unhide RFQ dialog | Admin portal | COMPLIANCE | `Dialog on ADM-26` | Dialog | Implemented | P2 |
| ADM-28 | Orders (admin) | Admin portal | SUPPORT, FINANCE, FINANCE_APPROVER | `/{locale}/admin/orders` | Page | Implemented | P0 |
| ADM-29 | Order detail (admin) | Admin portal | SUPPORT, FINANCE, FINANCE_APPROVER | `/{locale}/admin/orders/[orderId]` | Page | Implemented | P0 |
| ADM-30 | Finance overview | Admin portal | FINANCE, FINANCE_APPROVER | `/{locale}/admin/finance` | Page | Implemented | P0 |
| ADM-31 | Reconciliation case resolution | Admin portal | FINANCE, FINANCE_APPROVER | `/{locale}/admin/finance/reconciliation/[id] (proposed)` | Page | Planned | P0 |
| ADM-32 | Refunds | Admin portal | FINANCE, FINANCE_APPROVER | `/{locale}/admin/refunds` | Page | Implemented | P0 |
| ADM-33 | Request refund form | Admin portal | FINANCE | `Form on ADM-32` | Section | Partial | P0 |
| ADM-34 | Approve or reject refund dialog | Admin portal | FINANCE_APPROVER | `Dialog on ADM-32` | Dialog | Implemented | P0 |
| ADM-35 | Payouts | Admin portal | FINANCE, FINANCE_APPROVER | `/{locale}/admin/payouts` | Page | Implemented | P0 |
| ADM-36 | Request payout dialog | Admin portal | FINANCE | `Dialog on ADM-35` | Dialog | Implemented | P0 |
| ADM-37 | Approve or reject payout dialog | Admin portal | FINANCE_APPROVER | `Dialog on ADM-35` | Dialog | Implemented | P0 |
| ADM-38 | Disputes queue | Admin portal | SUPPORT (manage); FINANCE roles (read) | `/{locale}/admin/disputes` | Page | Implemented | P0 |
| ADM-39 | Dispute detail (admin) | Admin portal | SUPPORT (manage); FINANCE roles (read) | `/{locale}/admin/disputes/[disputeId]` | Page | Implemented | P0 |
| ADM-40 | Dispute action dialogs | Admin portal | SUPPORT | `Dialogs on ADM-39` | Dialog | Implemented | P0 |
| ADM-41 | Supplier reviews moderation | Admin portal | COMPLIANCE | `/{locale}/admin/supplier-reviews` | Page | Implemented | P2 |
| ADM-42 | Support queue | Admin portal | SUPPORT | `/{locale}/admin/support` | Page | Implemented | P1 |
| ADM-43 | Ticket detail (admin) | Admin portal | SUPPORT | `/{locale}/admin/support/[ticketId]` | Page | Implemented | P1 |
| ADM-44 | Reports (scoped CSV exports) | Admin portal | SUPPORT, FINANCE, FINANCE_APPROVER | `/{locale}/admin/reports` | Page | Implemented | P1 |
| ADM-45 | Audit log | Admin portal | COMPLIANCE, SUPER_ADMIN | `/{locale}/admin/audit` | Page | Implemented | P1 |
| ADM-46 | Staff and roles | Admin portal | SUPER_ADMIN | `/{locale}/admin/staff` | Page | Implemented | P1 |
| ADM-47 | Platform settings and commission | Admin portal | SUPER_ADMIN or finance approver (to be decided) | `/{locale}/admin/settings (proposed)` | Page | Planned | P0 |
| ADM-48 | Logistics and delivery settings | Admin portal | SUPER_ADMIN | `/{locale}/admin/logistics (proposed)` | Page | Planned | P2 |
| ADM-49 | System health and webhooks | Admin portal | SUPER_ADMIN, FINANCE (webhooks) | `/{locale}/admin/system (proposed)` | Page | Recommended | P2 |
| ADM-50 | Tax configuration and invoicing | Admin portal | FINANCE_APPROVER | `/{locale}/admin/tax (proposed)` | Page | Blocked | P1 |
| ADM-51 | Data requests, account closure and legal hold | Admin portal | COMPLIANCE | `/{locale}/admin/data-requests (proposed)` | Page | Planned | P1 |
| ADM-52 | Executive analytics | Admin portal | SUPER_ADMIN, FINANCE | `/{locale}/admin/analytics (proposed)` | Page | Recommended | P2 |
| ADM-53 | Sandbox provider simulator | Admin portal | FINANCE, FINANCE_APPROVER (development only) | `Action on ADM-32 / ADM-35` | Action | Implemented | P2 |


## 4.3 Screen specifications

### Public website

#### PUB-01 · Marketplace home

| Field | Specification |
|---|---|
| Screen ID | PUB-01 |
| Screen name | Marketplace home |
| User roles | Guest, verified user, all company users |
| Route / URL | `/{locale}` |
| Purpose | Entry point of the marketplace: explains the verified-supplier promise and routes buyers to categories, products and suppliers. |
| Information displayed | Sandbox banner; hero title and body; live totals ("{products} products from {suppliers} verified suppliers"); featured (priority) categories with images and product counts; all categories as chips with counts; featured products (labelled "Featured"); featured suppliers; verified manufacturers; new arrivals; "Based on your preferences" row (verified users with preferences only). Prices only for email-verified viewers; guests see "Sign in with a verified email to see wholesale prices". |
| UI components | Marketplace header (search, sign in/create account or account links, language switch), marketplace sub-nav, hero, category tile, category chip, product card, supplier card, section header with "View all", sandbox banner, skeleton, empty state |
| Primary call to action | Search (header search bar) |
| Secondary calls to action | View all (per section); open category; open product; open supplier; Sign in; Create account |
| Required fields | — |
| Optional fields | Search query |
| Filters | None on page (filters live on Search results) |
| Sorting | None (server order: featured position, then newest) |
| Search | Header search with autocomplete (PUB-06) |
| Navigation | Header: brand → home; sub-nav Categories, Suppliers, Saved, Compare, Recently viewed; signed-in: Seller centre (sellers), Preferences, My account |
| Permissions | Public. Prices, "for you" row only for email-verified users (A12). Only public listings (view marketplace_products). |
| Interactions | Sections load concurrently; cards are full-card links; "Featured" label never changes ranking. |
| Validation | Search requires no minimum on submit; suggestions need 2+ characters. |
| Related screens | PUB-02, PUB-03, PUB-04, PUB-06, PUB-07, PUB-09, PUB-10, AUTH-01, AUTH-04 |
| Mobile layout | Single column; horizontal scroll rows for featured products and suppliers; search bar full width under the header; category chips wrap. |
| Desktop layout | Max-width container; 3–5 card grid per row; hero full width. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /marketplace/home |
| Database entities | categories, featured_listings, marketplace_products view, marketplace_suppliers view, marketplace_preferences |
| Source files | apps/web/src/app/[locale]/page.tsx; components/market-shell.tsx; apps/api/src/catalog/marketplace.service.ts |
| Dependencies / decisions | A09, A12 |

Input fields:

  - Search query (text, Optional): max 100 chars

#### PUB-02 · Category directory

| Field | Specification |
|---|---|
| Screen ID | PUB-02 |
| Screen name | Category directory |
| User roles | Guest, verified user |
| Route / URL | `/{locale}/categories` |
| Purpose | Browse the full, database-managed category tree (12 launch categories, A09). |
| Information displayed | Each top-level category with image, EN/AR name, public product count and its subcategories with counts. |
| UI components | Breadcrumb, category directory block (image, title, child links), skeleton, empty state |
| Primary call to action | Open a category |
| Secondary calls to action | Open a subcategory |
| Required fields | — |
| Optional fields | — |
| Filters | None |
| Sorting | Admin-defined position |
| Search | Header search |
| Navigation | Breadcrumb Marketplace › Categories |
| Permissions | Public; hidden, archived and BLOCKED categories are not shown. |
| Interactions | Links only. |
| Validation | — |
| Related screens | PUB-03, PUB-04 |
| Mobile layout | Stacked category blocks; subcategory links as wrapping chips. |
| Desktop layout | Two-column grid of category blocks. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /marketplace/categories |
| Database entities | categories |
| Source files | apps/web/src/app/[locale]/categories/page.tsx |
| Dependencies / decisions | A09 |

Input fields:

  - None

#### PUB-03 · Category page

| Field | Specification |
|---|---|
| Screen ID | PUB-03 |
| Screen name | Category page |
| User roles | Guest, verified user |
| Route / URL | `/{locale}/categories/[id]` |
| Purpose | Landing page for one category: subcategories, seller requirements and the category's product results. |
| Information displayed | Category name and description, image, subcategory links, "Supplier requirements" text (REVIEW_REQUIRED categories note that listings are reviewed and need certification details), embedded search results filtered to the category including category-attribute filters. |
| UI components | Breadcrumb, category header, subcategory chips, info alert for restricted categories, search results module (PUB-04) |
| Primary call to action | Open product |
| Secondary calls to action | Choose subcategory; apply filters |
| Required fields | — |
| Optional fields | Same filters as PUB-04 |
| Filters | All PUB-04 filters plus category attribute filters (filterable attributes only) |
| Sorting | As PUB-04 |
| Search | Header search; query keeps category |
| Navigation | Breadcrumb Marketplace › Categories › Parent › Category |
| Permissions | Public; price filters verified only. |
| Interactions | URL holds filter state. |
| Validation | As PUB-04 |
| Related screens | PUB-02, PUB-04, PUB-07 |
| Mobile layout | Filters behind "Filters" toggle; results single column or 2-up grid. |
| Desktop layout | Left filter column, results grid on the right. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /marketplace/categories/{id}; GET /marketplace/products?category_id= |
| Database entities | categories, category_attributes, marketplace_products |
| Source files | apps/web/src/app/[locale]/categories/[id]/page.tsx; components/search-results.tsx |
| Dependencies / decisions | A09, A12 |

Input fields:

  - Same filters as PUB-04 (mixed, Optional): see PUB-04

#### PUB-04 · Search results

| Field | Specification |
|---|---|
| Screen ID | PUB-04 |
| Screen name | Search results |
| User roles | Guest, verified user |
| Route / URL | `/{locale}/search?q=&…` |
| Purpose | Find approved products with wholesale filters and sorting. |
| Information displayed | Result count, active filters, product cards (grid or list), price visibility notice for guests, pagination ("Show more results"). |
| UI components | Filter panel, results bar (count, sort, grid/list toggle), product card (grid and list variants), pagination, "Clear all", empty state "No products match these filters." |
| Primary call to action | Open product |
| Secondary calls to action | Apply / Clear all filters; change sort; switch grid/list; Show more results |
| Required fields | — |
| Optional fields | q, category_id, mode, business_type, emirate, price_min (AED), price_max (AED), moq_max, lead_time_max (days), delivery_max (dispatch within, days), in_stock, custom, private_label, white_label, samples, attrs |
| Filters | Category, product type, supplier type, emirate, price min/max (verified), MOQ up to, lead time up to, dispatch within, in stock only, custom manufacturing, private label, white label, samples, category attributes |
| Sorting | Relevance, Newest, Price low→high (verified), Price high→low (verified), Lowest MOQ |
| Search | Trigram EN/AR normalised search (diacritics, alef/yaa forms, Arabic-Indic digits) |
| Navigation | Back to results preserved via URL |
| Permissions | Public; guests get 422 on price filters/sorts so the UI hides them and shows "Price filters are available after signing in with a verified email." |
| Interactions | Filters write to the URL; page size 24 (max 48); offset cursor. |
| Validation | Numeric filters integers ≥0; price as AED with ≤2 decimals. |
| Related screens | PUB-05, PUB-06, PUB-07 |
| Mobile layout | "Filters" button opens a sheet (PUB-05); cards single column in list view, 2-up in grid view. |
| Desktop layout | Persistent left filter column (≈280px); 3–4 card grid. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /marketplace/products |
| Database entities | marketplace_products, category_attributes |
| Source files | apps/web/src/app/[locale]/search/page.tsx; components/search-results.tsx |
| Dependencies / decisions | A12 |

Input fields:

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

| Field | Specification |
|---|---|
| Screen ID | PUB-05 |
| Screen name | Filter panel / mobile filter sheet |
| User roles | Guest, verified user |
| Route / URL | `Overlay on PUB-03/PUB-04` |
| Purpose | Narrow results on small screens without leaving the results page. |
| Information displayed | All filter groups of PUB-04, the active-filter count, Apply and Clear all. |
| UI components | Bottom sheet or full-screen drawer, checkbox group, radio group, number inputs, sticky footer with Apply/Clear |
| Primary call to action | Apply |
| Secondary calls to action | Clear all; Close |
| Required fields | — |
| Optional fields | As PUB-04 |
| Filters | As PUB-04 |
| Sorting | Sort can live in the same sheet on mobile |
| Search | — |
| Navigation | Close returns to results |
| Permissions | As PUB-04 |
| Interactions | Today the filters toggle open inline (`.filters-toggle`); a true sheet with focus trap, sticky actions and result count preview is recommended. |
| Validation | As PUB-04 |
| Related screens | PUB-04 |
| Mobile layout | Full-height sheet, sticky Apply bar, 44px targets. |
| Desktop layout | Not used (filters persistent). |
| Implementation status | Partial · P0 |
| API endpoints | — |
| Database entities | — |
| Source files | components/search-results.tsx |
| Dependencies / decisions | — |

Input fields:

  - As PUB-04 (mixed, Optional)

#### PUB-06 · Search suggestions dropdown

| Field | Specification |
|---|---|
| Screen ID | PUB-06 |
| Screen name | Search suggestions dropdown |
| User roles | Guest, verified user |
| Route / URL | `Overlay on header search` |
| Purpose | Autocomplete products, suppliers and categories while typing. |
| Information displayed | Three grouped lists: products, suppliers, categories. |
| UI components | Combobox with listbox groups |
| Primary call to action | Select a suggestion |
| Secondary calls to action | Submit full search |
| Required fields | — |
| Optional fields | q |
| Filters | — |
| Sorting | Server relevance |
| Search | Autocomplete |
| Navigation | Enter submits; arrow keys move |
| Permissions | Public |
| Interactions | Debounced requests; Escape closes. |
| Validation | 2–100 characters |
| Related screens | PUB-04, PUB-07, PUB-10, PUB-03 |
| Mobile layout | Full-width dropdown under the search field. |
| Desktop layout | Dropdown anchored to search bar. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /marketplace/suggest |
| Database entities | marketplace_products, marketplace_suppliers, categories |
| Source files | components/market-shell.tsx |
| Dependencies / decisions | — |

Input fields:

  - q (text, Optional): min 2, max 100

#### PUB-07 · Product detail

| Field | Specification |
|---|---|
| Screen ID | PUB-07 |
| Screen name | Product detail |
| User roles | Guest, verified user, approved buyer (OWNER/PROCUREMENT) |
| Route / URL | `/{locale}/products/[id]` |
| Purpose | Evaluate a product and act: add to cart (ready stock), request a quotation, save, compare or contact the supplier. |
| Information displayed | Gallery (up to 12 images) and optional video link; title EN/AR; category path; mode (ready stock / made to order); availability; MOQ and order increment; lead time; dispatch days; customisation flags (custom manufacturing, private label, white label, samples + note); description; category attributes; specifications; materials; dimensions; country of origin; certifications "(declared by supplier)"; variants table with tiers (verified only) and availability; price calculator (verified); supplier card (name, emirate, business type, verified since, year established, logo); related products. |
| UI components | Breadcrumb, image gallery with thumbnails, price tier table, variant selector, quantity stepper, price calculator, trading action panel with disabled-reason text, supplier card, attribute list, specification table, certification list, product card row, save/compare toggles |
| Primary call to action | Add to cart (ready stock, approved buyer) or Request quotation |
| Secondary calls to action | Save; Compare; Message supplier (via storefront); Visit storefront; Calculate; View cart (after add) |
| Required fields | — |
| Optional fields | Variant (SKU), Quantity |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Breadcrumb; Back to results |
| Permissions | Guest: no prices, buttons disabled with reason. Verified: prices, save, compare. Trading (approved buyer, OWNER/PROCUREMENT): cart and RFQ. Reasons: sign_in, requires_approved_buyer, quote_only, made_to_order, checkout_disabled. |
| Interactions | Calculator calls the server estimate; Add to cart shows "Added to your cart." with View cart; viewing records "recently viewed" for verified users. |
| Validation | Server: MOQ_NOT_MET, INCREMENT, QUOTE_ONLY, insufficient stock, self-trade. |
| Related screens | PUB-08, PUB-10, BUY-03, BUY-16, BUY-32, PUB-11, PUB-12 |
| Mobile layout | Gallery first (swipeable), sticky bottom action bar with primary CTA, sections stacked as accordions. |
| Desktop layout | Two columns: gallery left (≈55%), summary and trade panel right (sticky); details below full width. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /marketplace/products/{id}; /related; /estimate; POST /buyer/workspaces/{ws}/cart/items; POST/DELETE /marketplace/saved/products/{id}; /marketplace/compare/{id}; POST /marketplace/recent/{id} |
| Database entities | products, product_versions, product_media, skus, price_tiers, inventory, storefronts |
| Source files | apps/web/src/app/[locale]/products/[id]/page.tsx |
| Dependencies / decisions | A11, A12, P4-6 |

Input fields:

  - Variant (SKU) (select, Optional): active SKUs
  - Quantity (integer, Optional): ≥ MOQ, follows increment, ≤ available

#### PUB-08 · Product image viewer (lightbox)

| Field | Specification |
|---|---|
| Screen ID | PUB-08 |
| Screen name | Product image viewer (lightbox) |
| User roles | All marketplace viewers |
| Route / URL | `Overlay on PUB-07` |
| Purpose | Inspect product photography at full size (product imagery is the main visual focus). |
| Information displayed | Full-size image, position "Image n of total", alt text. |
| UI components | Modal lightbox, previous/next, pinch zoom, thumbnails |
| Primary call to action | Next image |
| Secondary calls to action | Previous; Close |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Arrow keys, Escape |
| Permissions | Public (images served only while attached to public content) |
| Interactions | Focus trapped; returns focus to the thumbnail. |
| Validation | — |
| Related screens | PUB-07 |
| Mobile layout | Full-screen, swipe, pinch zoom. |
| Desktop layout | Centered modal at 90vh. |
| Implementation status | Recommended · P1 |
| API endpoints | GET /media/{id} |
| Database entities | files, product_media |
| Source files | — (current gallery: thumbnails + main image) |
| Dependencies / decisions | — |

Input fields:

  - None

#### PUB-09 · Supplier directory

| Field | Specification |
|---|---|
| Screen ID | PUB-09 |
| Screen name | Supplier directory |
| User roles | Guest, verified user |
| Route / URL | `/{locale}/suppliers` |
| Purpose | Discover verified suppliers and manufacturers. |
| Information displayed | Supplier cards: logo, cover, name, business type, emirate, "Verified supplier", verified since, specialisation, categories, product count, capability flags. |
| UI components | Filter bar, supplier card, pagination, empty state "No suppliers match these filters." |
| Primary call to action | Open storefront |
| Secondary calls to action | Save supplier (verified); filter |
| Required fields | — |
| Optional fields | q, category_id, emirate, business_type, custom, private_label, white_label, samples |
| Filters | Category, emirate, business type, customisation, private label, white label, samples |
| Sorting | Server default (no user sort today) |
| Search | Name search |
| Navigation | Sub-nav Suppliers |
| Permissions | Public; only published, non-hidden storefronts of eligible approved sellers. |
| Interactions | URL-driven filters; 24 per page. |
| Validation | — |
| Related screens | PUB-10 |
| Mobile layout | Single-column cards; filters in sheet. |
| Desktop layout | Filter row above a 3-column grid. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /marketplace/suppliers |
| Database entities | marketplace_suppliers view, storefronts, storefront_media |
| Source files | apps/web/src/app/[locale]/suppliers/page.tsx |
| Dependencies / decisions | A10, A12 |

Input fields:

  - q (text, Optional): max 100
  - category_id (select, Optional)
  - emirate (checkboxes, Optional)
  - business_type (checkboxes, Optional)
  - custom (checkbox, Optional)
  - private_label (checkbox, Optional)
  - white_label (checkbox, Optional)
  - samples (checkbox, Optional)

#### PUB-10 · Supplier storefront (manufacturer profile)

| Field | Specification |
|---|---|
| Screen ID | PUB-10 |
| Screen name | Supplier storefront (manufacturer profile) |
| User roles | Guest, verified user, approved buyer |
| Route / URL | `/{locale}/suppliers/[id]` |
| Purpose | Present a supplier's verified business profile, capabilities, catalogue and anonymised reviews. |
| Information displayed | Cover and logo; name; business type; emirate and city; verified since; year established; About (EN/AR); specialisation; capabilities; production capacity; fulfilment text; customisation flags; certifications; factory/warehouse gallery; product catalogue (search results filtered by storefront); buyer reviews: average, count, recent items labelled "Verified buyer"; note that contact details, documents and bank information are never shown. |
| UI components | Storefront header (cover, logo, badges), capability tags, certification list, gallery, product grid, review summary and list, save toggle |
| Primary call to action | Request quotation (approved buyer) |
| Secondary calls to action | Message supplier; Save supplier; open product |
| Required fields | — |
| Optional fields | — |
| Filters | Catalogue uses PUB-04 filters scoped to the storefront |
| Sorting | As PUB-04 |
| Search | Catalogue search |
| Navigation | Breadcrumb Suppliers › Name |
| Permissions | Public profile; RFQ and messaging only for approved buyers (A12); reviews anonymised (P5-6; founder: "verified business buyer"). |
| Interactions | Request quotation prefills the RFQ with the supplier as invitee. |
| Validation | — |
| Related screens | PUB-07, BUY-03, MSG-03 |
| Mobile layout | Cover shorter, logo overlaps; tabs About / Products / Reviews. |
| Desktop layout | Header band, two-column body (profile left, catalogue right) or tabbed. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /marketplace/suppliers/{id}; GET /marketplace/suppliers/{id}/reviews; GET /marketplace/products?storefront_id= |
| Database entities | storefronts, storefront_media, reviews |
| Source files | apps/web/src/app/[locale]/suppliers/[id]/page.tsx |
| Dependencies / decisions | P5-6, founder decision 8 (reviews) |

Input fields:

  - None

#### PUB-15 · System status

| Field | Specification |
|---|---|
| Screen ID | PUB-15 |
| Screen name | System status |
| User roles | Anyone |
| Route / URL | `/{locale}/status` |
| Purpose | Live API, database and queue-store status (former landing page). |
| Information displayed | Tagline, landing body, status rows (API, Database, Queue store: Operational / Unavailable), checked-at time, reference on error. |
| UI components | Status list, retry button, error alert |
| Primary call to action | Retry |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Footer link (recommended) |
| Permissions | Public |
| Interactions | Rendered per request (no stale cache). |
| Validation | — |
| Related screens | — |
| Mobile layout | Stacked rows. |
| Desktop layout | Narrow card. |
| Implementation status | Implemented · P2 |
| API endpoints | GET /health/ready |
| Database entities | — |
| Source files | apps/web/src/app/[locale]/status/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### PUB-16 · About the platform

| Field | Specification |
|---|---|
| Screen ID | PUB-16 |
| Screen name | About the platform |
| User roles | Anyone |
| Route / URL | `/{locale}/about (recommended)` |
| Purpose | Explain who the marketplace serves, the verified-business model and the UAE focus. |
| Information displayed | Mission, verified-only promise (licence + representative evidence, manual compliance review), who can buy and sell (A10 eligible business types), how money is handled (payment provider, never "escrow"), UAE focus. |
| UI components | Content page template, feature rows, CTA band |
| Primary call to action | Create account |
| Secondary calls to action | Browse marketplace; Become a supplier |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Footer and header "About" |
| Permissions | Public |
| Interactions | Static content managed by translation keys or a CMS. |
| Validation | — |
| Related screens | PUB-17, PUB-27 |
| Mobile layout | Single column. |
| Desktop layout | Max 72ch text column with image band. |
| Implementation status | Recommended · P1 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Brand deferred; legal wording for payments (D05, D15) |

Input fields:

  - None

#### PUB-17 · How it works

| Field | Specification |
|---|---|
| Screen ID | PUB-17 |
| Screen name | How it works |
| User roles | Anyone |
| Route / URL | `/{locale}/how-it-works (recommended)` |
| Purpose | Step-by-step explanation for buyers and for suppliers. |
| Information displayed | Buyers: register → verify email → register company → verification → browse → cart or RFQ → pay via provider → track → confirm receipt / dispute. Suppliers: register → verification → storefront → listings reviewed → quotes and orders → dispatch → payout after eligibility. |
| UI components | Segmented control Buyers/Suppliers, numbered step list, illustration slots (style deferred) |
| Primary call to action | Create account |
| Secondary calls to action | Browse marketplace |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Header, footer |
| Permissions | Public |
| Interactions | Tabs switch audience. |
| Validation | — |
| Related screens | PUB-16, PUB-20 |
| Mobile layout | Vertical stepper. |
| Desktop layout | Horizontal stepper. |
| Implementation status | Recommended · P1 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Payout timing wording depends on D05 integration |

Input fields:

  - None

#### PUB-18 · Pricing and fees

| Field | Specification |
|---|---|
| Screen ID | PUB-18 |
| Screen name | Pricing and fees |
| User roles | Anyone |
| Route / URL | `/{locale}/pricing (recommended)` |
| Purpose | Disclose that registration, access, storefronts, listings and RFQs are free and that suppliers pay a commission on merchandise value. |
| Information displayed | Free for buyers; free supplier registration, storefront and listings; commission 10% of merchandise value excluding VAT and delivery (founder decision, configurable, snapshotted per order); no subscriptions at launch; payment processing information once the provider is confirmed. |
| UI components | Pricing table, FAQ accordion, legal footnote |
| Primary call to action | Become a supplier |
| Secondary calls to action | Read commission and fee policy |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Footer |
| Permissions | Public |
| Interactions | — |
| Validation | — |
| Related screens | PUB-27, PUB-20 |
| Mobile layout | Stacked cards. |
| Desktop layout | Two-column comparison (Buyers / Suppliers). |
| Implementation status | Recommended · P1 |
| API endpoints | — (rate should be read from configuration when built) |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Commission & fee policy legal review; tax model D06 |

Input fields:

  - None

#### PUB-19 · Frequently asked questions

| Field | Specification |
|---|---|
| Screen ID | PUB-19 |
| Screen name | Frequently asked questions |
| User roles | Anyone |
| Route / URL | `/{locale}/faq (recommended)` |
| Purpose | Answer common questions about verification, prices, RFQs, payment, delivery, disputes and payouts. |
| Information displayed | Grouped questions; answers must reflect approved policy only. |
| UI components | Accordion, category tabs, search field |
| Primary call to action | Contact support |
| Secondary calls to action | Open help centre |
| Required fields | — |
| Optional fields | Search FAQ |
| Filters | Topic |
| Sorting | — |
| Search | Client-side text filter |
| Navigation | Footer, help centre |
| Permissions | Public |
| Interactions | Expand/collapse; deep link to a question. |
| Validation | — |
| Related screens | PUB-20, PUB-21 |
| Mobile layout | Single column accordion. |
| Desktop layout | Topic list left, accordion right. |
| Implementation status | Recommended · P1 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Policies pending legal review |

Input fields:

  - Search FAQ (text, Optional): optional

#### PUB-20 · Help centre

| Field | Specification |
|---|---|
| Screen ID | PUB-20 |
| Screen name | Help centre |
| User roles | Anyone; signed-in users see ticket shortcut |
| Route / URL | `/{locale}/help (recommended)` |
| Purpose | Self-service articles and a route into support tickets. |
| Information displayed | Article categories mirroring support topics (Account and access, Company verification, Order, Payment or refund, Request for quotation, Products and storefront). |
| UI components | Search, category cards, article page template, "Open a ticket" CTA |
| Primary call to action | Open a support ticket (signed in) |
| Secondary calls to action | Search articles |
| Required fields | — |
| Optional fields | Search |
| Filters | Category |
| Sorting | — |
| Search | Article search |
| Navigation | Footer, header help icon |
| Permissions | Public; ticket creation needs a workspace member (not VIEWER). |
| Interactions | — |
| Validation | — |
| Related screens | SHR-SUP-02, PUB-19 |
| Mobile layout | Stacked. |
| Desktop layout | Grid of category cards. |
| Implementation status | Recommended · P2 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | — |

Input fields:

  - Search (text, Optional)

#### PUB-21 · Contact

| Field | Specification |
|---|---|
| Screen ID | PUB-21 |
| Screen name | Contact |
| User roles | Anyone |
| Route / URL | `/{locale}/contact (recommended)` |
| Purpose | Let prospects and guests reach the platform team; route customers to tickets. |
| Information displayed | Contact options (business email placeholder until domain), office emirate, enquiry form for guests, notice that signed-in customers should use support tickets. |
| UI components | Form, info card |
| Primary call to action | Send enquiry |
| Secondary calls to action | Sign in to open a ticket |
| Required fields | Name, Work email, Topic, Message |
| Optional fields | Company |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Footer |
| Permissions | Public |
| Interactions | Rate limited; generic success message. |
| Validation | Email format; required fields. |
| Related screens | PUB-20 |
| Mobile layout | Single column. |
| Desktop layout | Form left, info right. |
| Implementation status | Recommended · P1 |
| API endpoints | Not built (needs endpoint + email provider) |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Resend email provider (sandbox until domain) |

Input fields:

  - Name (text, Required): 1–120
  - Work email (email, Required): valid
  - Company (text, Optional): optional
  - Topic (select, Required): Buyer, Supplier, Partnership, Press, Other
  - Message (textarea, Required): 1–4000

#### PUB-22 · Terms and conditions

| Field | Specification |
|---|---|
| Screen ID | PUB-22 |
| Screen name | Terms and conditions |
| User roles | Anyone |
| Route / URL | `/{locale}/legal/terms (recommended)` |
| Purpose | Platform terms; accepted at company verification (current version label "dev-1"). |
| Information displayed | Versioned legal text with effective date, version, table of contents, EN/AR. |
| UI components | Legal document template (TOC, anchored headings, version banner, print) |
| Primary call to action | — |
| Secondary calls to action | Download/print; switch language |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | In-page find |
| Navigation | Footer legal links; links from registration, company submission and checkout terms checkboxes |
| Permissions | Public |
| Interactions | Version shown must equal the version accepted (CURRENT_TERMS_VERSION). |
| Validation | — |
| Related screens | ACC-06, BUY-17 |
| Mobile layout | Collapsible TOC. |
| Desktop layout | Sticky TOC left. |
| Implementation status | Blocked · P0 |
| API endpoints | — |
| Database entities | companies.terms_version |
| Source files | packages/contracts/src/companies.ts (CURRENT_TERMS_VERSION) |
| Dependencies / decisions | Legal drafting for UAE lawyer review (founder decision 11, D15) |

Input fields:

  - None

#### PUB-23 · Privacy policy

| Field | Specification |
|---|---|
| Screen ID | PUB-23 |
| Screen name | Privacy policy |
| User roles | Anyone |
| Route / URL | `/{locale}/legal/privacy (recommended)` |
| Purpose | Privacy notice (PDPL-style), retention, rights and requests. |
| Information displayed | Controller details, data collected, purposes, processors (payment provider, email provider, hosting region), retention (configurable, A13), rights and how to request access, export or deletion. |
| UI components | Legal document template |
| Primary call to action | Submit a data request (when built) |
| Secondary calls to action | Download/print |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Footer; registration form |
| Permissions | Public |
| Interactions | — |
| Validation | — |
| Related screens | ACC-16 |
| Mobile layout | As PUB-22. |
| Desktop layout | As PUB-22. |
| Implementation status | Blocked · P0 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | D09, D15, founder decision 11 |

Input fields:

  - None

#### PUB-24 · Returns, refunds and cancellation policy

| Field | Specification |
|---|---|
| Screen ID | PUB-24 |
| Screen name | Returns, refunds and cancellation policy |
| User roles | Anyone |
| Route / URL | `/{locale}/legal/returns (recommended)` |
| Purpose | Explain dispute eligibility, change-of-mind returns, custom goods, supplier cancellation and refund routing. |
| Information displayed | Provisional policy (founder D07/D08): incorrect, damaged and defective goods eligible for dispute review; change-of-mind depends on the seller's disclosed policy; custom/made-to-order generally excluded subject to law; supplier cancellation requires refund; partial refunds; refunds to original payment method where possible; 14-day dispute window. |
| UI components | Legal document template |
| Primary call to action | — |
| Secondary calls to action | Open a dispute (signed in) |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Footer, order detail, checkout |
| Permissions | Public |
| Interactions | — |
| Validation | — |
| Related screens | BUY-24, BUY-27, BUY-31 |
| Mobile layout | As PUB-22. |
| Desktop layout | As PUB-22. |
| Implementation status | Blocked · P0 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Legal approval before production |

Input fields:

  - None

#### PUB-25 · Other policy pages (template)

| Field | Specification |
|---|---|
| Screen ID | PUB-25 |
| Screen name | Other policy pages (template) |
| User roles | Anyone |
| Route / URL | `/{locale}/legal/[slug] (recommended)` |
| Purpose | One template for the remaining legal documents: buyer agreement, supplier and manufacturer agreement, commission and fee policy, payment and settlement policy, delivery and fulfilment policy, dispute resolution policy, prohibited and restricted products policy, data retention and deletion policy, cookie policy. |
| Information displayed | Versioned text, effective date, EN/AR. |
| UI components | Legal document template; legal centre index listing all 12 documents |
| Primary call to action | — |
| Secondary calls to action | Download/print |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Footer legal centre |
| Permissions | Public |
| Interactions | — |
| Validation | — |
| Related screens | PUB-22, PUB-23, PUB-24 |
| Mobile layout | As PUB-22. |
| Desktop layout | As PUB-22. |
| Implementation status | Blocked · P1 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Founder decision 11 (12 documents for lawyer review) |

Input fields:

  - None

#### PUB-26 · Become a supplier

| Field | Specification |
|---|---|
| Screen ID | PUB-26 |
| Screen name | Become a supplier |
| User roles | Anyone |
| Route / URL | `/{locale}/sell (recommended)` |
| Purpose | Acquire UAE-licensed suppliers and manufacturers; explain eligibility and onboarding. |
| Information displayed | Eligible business types (A10), required documents (trade licence, authorised representative evidence), free listing, commission, moderation, priority categories (Fashion & Textiles, Packaging & Printing, Food & Beverage). |
| UI components | Hero, eligibility checklist, step list, FAQ, CTA band |
| Primary call to action | Create supplier account |
| Secondary calls to action | Read supplier agreement |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Header, footer |
| Permissions | Public |
| Interactions | — |
| Validation | — |
| Related screens | AUTH-01, PUB-18 |
| Mobile layout | Stacked. |
| Desktop layout | Hero + 3-column steps. |
| Implementation status | Recommended · P1 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | A09, A10 |

Input fields:

  - None

#### PUB-27 · Site footer and legal centre

| Field | Specification |
|---|---|
| Screen ID | PUB-27 |
| Screen name | Site footer and legal centre |
| User roles | Anyone |
| Route / URL | `Global footer` |
| Purpose | Persistent links to About, How it works, Pricing, FAQ, Help, Contact, legal documents, status and language. |
| Information displayed | Link groups, working name text placeholder, copyright, sandbox notice where applicable. |
| UI components | Footer |
| Primary call to action | — |
| Secondary calls to action | Links |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Global |
| Permissions | Public |
| Interactions | — |
| Validation | — |
| Related screens | PUB-16…PUB-26 |
| Mobile layout | Accordion link groups. |
| Desktop layout | 4-column footer. |
| Implementation status | Recommended · P0 |
| API endpoints | — |
| Database entities | — |
| Source files | — (no footer exists today) |
| Dependencies / decisions | Brand deferred (text placeholder only) |

Input fields:

  - None

### Public website (signed-in)

#### PUB-11 · Saved products and suppliers

| Field | Specification |
|---|---|
| Screen ID | PUB-11 |
| Screen name | Saved products and suppliers |
| User roles | Email-verified user |
| Route / URL | `/{locale}/saved` |
| Purpose | Shortlist products and suppliers for later. |
| Information displayed | Saved products and saved suppliers lists; items no longer public show "This listing is no longer available." |
| UI components | Tabs or two sections, product card, supplier card, unavailable card variant, remove button |
| Primary call to action | Open item |
| Secondary calls to action | Remove |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | Saved date |
| Search | — |
| Navigation | Sub-nav Saved |
| Permissions | Email-verified users only (A12); guests see a sign-in prompt. |
| Interactions | Remove is immediate (no confirmation). |
| Validation | Saved-items limit error. |
| Related screens | PUB-07, PUB-10 |
| Mobile layout | Segmented control Products / Suppliers. |
| Desktop layout | Two sections stacked. |
| Implementation status | Implemented · P1 |
| API endpoints | GET/POST/DELETE /marketplace/saved/products\|suppliers |
| Database entities | saved_items |
| Source files | apps/web/src/app/[locale]/saved/page.tsx |
| Dependencies / decisions | A12 |

Input fields:

  - None

#### PUB-12 · Product comparison

| Field | Specification |
|---|---|
| Screen ID | PUB-12 |
| Screen name | Product comparison |
| User roles | Email-verified user |
| Route / URL | `/{locale}/compare` |
| Purpose | Compare up to 4 products side by side. |
| Information displayed | Per product: image, title, category, supplier, price summary, MOQ, mode, stock, lead time, dispatch days, materials, dimensions, origin, certifications, attributes. |
| UI components | Comparison table with sticky first column, remove per column, empty state "Add up to 4 products to compare them side by side." |
| Primary call to action | Open product |
| Secondary calls to action | Remove from comparison |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | Added order |
| Search | — |
| Navigation | Sub-nav Compare |
| Permissions | Email-verified only. |
| Interactions | Limit 4 enforced server-side (409 compare_limit). |
| Validation | Max 4. |
| Related screens | PUB-07 |
| Mobile layout | Horizontal scroll with sticky label column, or swipeable product cards with aligned rows. |
| Desktop layout | Up to 4 columns. |
| Implementation status | Implemented · P1 |
| API endpoints | GET/POST/DELETE /marketplace/compare |
| Database entities | comparison_items |
| Source files | apps/web/src/app/[locale]/compare/page.tsx |
| Dependencies / decisions | A12 |

Input fields:

  - None

#### PUB-13 · Recently viewed

| Field | Specification |
|---|---|
| Screen ID | PUB-13 |
| Screen name | Recently viewed |
| User roles | Email-verified user |
| Route / URL | `/{locale}/recent` |
| Purpose | Return to products viewed recently (last 30). |
| Information displayed | Product cards with viewed time; unavailable items flagged. |
| UI components | Product card grid, Clear history button, empty state |
| Primary call to action | Open product |
| Secondary calls to action | Clear history |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | Most recent first |
| Search | — |
| Navigation | Sub-nav Recently viewed |
| Permissions | Email-verified only. |
| Interactions | Clear history removes all. |
| Validation | — |
| Related screens | PUB-07 |
| Mobile layout | Single column list. |
| Desktop layout | Grid. |
| Implementation status | Implemented · P2 |
| API endpoints | GET/DELETE /marketplace/recent |
| Database entities | recently_viewed |
| Source files | apps/web/src/app/[locale]/recent/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### PUB-14 · Marketplace preferences

| Field | Specification |
|---|---|
| Screen ID | PUB-14 |
| Screen name | Marketplace preferences |
| User roles | Email-verified user |
| Route / URL | `/{locale}/preferences` |
| Purpose | Tell the marketplace what you buy to personalise the home page and defaults. |
| Information displayed | Categories you buy (max 12), preferred emirates, default view (grid/list), default sort. |
| UI components | Checkbox grid, radio group, select, save button, success alert "Preferences saved." |
| Primary call to action | Save |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Categories, Emirates, Default view, Default sort |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Header link Preferences |
| Permissions | Email-verified only. |
| Interactions | Saves per user. |
| Validation | Max counts. |
| Related screens | PUB-01, PUB-04 |
| Mobile layout | Single column form. |
| Desktop layout | Narrow form container. |
| Implementation status | Implemented · P2 |
| API endpoints | GET/PATCH /marketplace/preferences |
| Database entities | marketplace_preferences |
| Source files | apps/web/src/app/[locale]/preferences/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Categories (checkboxes, Optional): max 12
  - Emirates (checkboxes, Optional): max 7
  - Default view (radio, Optional): GRID, LIST
  - Default sort (select, Optional): 5 sorts

### Authentication

#### AUTH-01 · Create account (register)

| Field | Specification |
|---|---|
| Screen ID | AUTH-01 |
| Screen name | Create account (register) |
| User roles | Guest |
| Route / URL | `/{locale}/register` |
| Purpose | Create a company user account with a work email (no admin self-registration, A03). |
| Information displayed | Title "Create your business account", intro, fields, password hint "At least 12 characters…", link to sign in. |
| UI components | Auth card, text field, password field with hint, select, primary button, inline field errors |
| Primary call to action | Create account |
| Secondary calls to action | Sign in |
| Required fields | Full name, Work email, Password, Preferred language |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Public header |
| Permissions | Public; rate limited. |
| Interactions | Always responds 202 (no enumeration) and moves to AUTH-02. |
| Validation | field.required, field.email, field.min/max; error.common.rate_limited |
| Related screens | AUTH-02, AUTH-04 |
| Mobile layout | Full-width card. |
| Desktop layout | Centered 440px card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /auth/register |
| Database entities | users, user_tokens |
| Source files | apps/web/src/app/[locale]/register/page.tsx; packages/contracts/src/auth.ts |
| Dependencies / decisions | A01, A07 |

Input fields:

  - Full name (text, Required): 1–120
  - Work email (email, Required): valid, max 254, lower-cased
  - Password (password, Required): 12–128 characters
  - Preferred language (select, Required): English, العربية (default en)

#### AUTH-02 · Check your email

| Field | Specification |
|---|---|
| Screen ID | AUTH-02 |
| Screen name | Check your email |
| User roles | Guest |
| Route / URL | `/{locale}/register (success state)` |
| Purpose | Confirm a verification link was sent (24-hour expiry) without revealing whether the address exists. |
| Information displayed | "Check your email" title and body; resend link. |
| UI components | Status card, secondary button |
| Primary call to action | Resend verification email |
| Secondary calls to action | Go to sign in |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Public |
| Interactions | Resend always shows "If the address needs verification, a new link is on its way." |
| Validation | Rate limit |
| Related screens | AUTH-03 |
| Mobile layout | Card. |
| Desktop layout | Card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /auth/resend-verification |
| Database entities | user_tokens |
| Source files | register/page.tsx |
| Dependencies / decisions | A07 |

Input fields:

  - None

#### AUTH-03 · Verify email

| Field | Specification |
|---|---|
| Screen ID | AUTH-03 |
| Screen name | Verify email |
| User roles | Guest or signed-in user |
| Route / URL | `/{locale}/verify-email#token=…` |
| Purpose | Consume the one-time verification token (read from the URL fragment, then stripped from history). |
| Information displayed | States: verifying, verified ("Your email is verified…"), link incomplete, invalid/expired/used. |
| UI components | Status card, spinner, success and error alerts |
| Primary call to action | Continue |
| Secondary calls to action | Resend verification email; Go to sign in |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Public |
| Interactions | Auto-submits on load. |
| Validation | error.auth.token_invalid; auth.token_missing |
| Related screens | ACC-01, AUTH-04 |
| Mobile layout | Card. |
| Desktop layout | Card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /auth/verify-email |
| Database entities | users.email_verified_at, user_tokens |
| Source files | verify-email/page.tsx |
| Dependencies / decisions | A07 |

Input fields:

  - None

#### AUTH-04 · Sign in

| Field | Specification |
|---|---|
| Screen ID | AUTH-04 |
| Screen name | Sign in |
| User roles | Company user |
| Route / URL | `/{locale}/login?next=` |
| Purpose | Start a company session. |
| Information displayed | Email, password, forgot link, register link, generic error on failure. |
| UI components | Auth card, fields, primary button, error alert |
| Primary call to action | Sign in |
| Secondary calls to action | Forgot your password?; Create account |
| Required fields | Work email, Password |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Redirects to a safe `next` path (never /admin) or /app |
| Permissions | Public; rate limited; admin accounts must use the admin origin. |
| Interactions | Session cookie rotates on sign-in. |
| Validation | error.auth.invalid_credentials ("The email or password is incorrect."); rate limit |
| Related screens | AUTH-05, ACC-01 |
| Mobile layout | Full width. |
| Desktop layout | Centered card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /auth/login |
| Database entities | sessions |
| Source files | login/page.tsx; lib/nav.ts (safeNext) |
| Dependencies / decisions | A01 |

Input fields:

  - Work email (email, Required): valid
  - Password (password, Required): 1–128

#### AUTH-05 · Forgot password

| Field | Specification |
|---|---|
| Screen ID | AUTH-05 |
| Screen name | Forgot password |
| User roles | Guest |
| Route / URL | `/{locale}/forgot-password` |
| Purpose | Request a reset link (1-hour expiry) without account enumeration. |
| Information displayed | Intro text; sent state "If the email matches an account, a reset link has been sent. It expires in 1 hour." |
| UI components | Auth card, field, button, success alert |
| Primary call to action | Send reset link |
| Secondary calls to action | Back to sign in |
| Required fields | Email |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Public |
| Interactions | Always 202. |
| Validation | Email format; rate limit |
| Related screens | AUTH-06 |
| Mobile layout | Card. |
| Desktop layout | Card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /auth/password-reset/request |
| Database entities | user_tokens |
| Source files | forgot-password/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Email (email, Required): valid

#### AUTH-06 · Reset password

| Field | Specification |
|---|---|
| Screen ID | AUTH-06 |
| Screen name | Reset password |
| User roles | Guest |
| Route / URL | `/{locale}/reset-password#token=…` |
| Purpose | Set a new password; all sessions are revoked. |
| Information displayed | New password field and hint; done state "Your password was changed and all sessions were signed out." |
| UI components | Auth card, password field, button, alerts |
| Primary call to action | Set new password |
| Secondary calls to action | Go to sign in |
| Required fields | New password |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Public with valid token |
| Interactions | Token read from fragment. |
| Validation | Token invalid/expired; length |
| Related screens | AUTH-04 |
| Mobile layout | Card. |
| Desktop layout | Card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /auth/password-reset/confirm |
| Database entities | users, sessions |
| Source files | reset-password/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - New password (password, Required): 12–128

#### AUTH-07 · Email verification gate

| Field | Specification |
|---|---|
| Screen ID | AUTH-07 |
| Screen name | Email verification gate |
| User roles | Signed-in, unverified user |
| Route / URL | `Any /app route before verification` |
| Purpose | Block every company or workspace action until the email is verified (A07). |
| Information displayed | "Verify your email to continue", the address, resend button. |
| UI components | Card, secondary button, success alert |
| Primary call to action | Resend verification email |
| Secondary calls to action | Sign out |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | App header (reduced) |
| Permissions | Signed in, unverified |
| Interactions | — |
| Validation | — |
| Related screens | AUTH-03 |
| Mobile layout | Card. |
| Desktop layout | Card in container. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /auth/resend-verification |
| Database entities | users |
| Source files | components/session.tsx (UnverifiedNotice) |
| Dependencies / decisions | A07 |

Input fields:

  - None

#### AUTH-08 · Accept team invitation

| Field | Specification |
|---|---|
| Screen ID | AUTH-08 |
| Screen name | Accept team invitation |
| User roles | Invitee (guest or signed-in) |
| Route / URL | `/{locale}/invitations/accept#token=…` |
| Purpose | Join a workspace with the invited role. |
| Information displayed | Company name and status, workspace kind, role, intended email; states: sign in first, wrong account, no longer valid (state), accepted. |
| UI components | Card, definition list, primary button, alerts |
| Primary call to action | Accept invitation |
| Secondary calls to action | Sign in / Create account with the invited email; Sign out |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | After accepting → workspace |
| Permissions | Signed-in user whose email matches the invitation; single use; 7-day expiry. |
| Interactions | Pending token kept per tab (sessionStorage) across sign-up. |
| Validation | error.invitation.invalid / not_pending / email_mismatch; team.already_member |
| Related screens | AUTH-01, AUTH-04, ACC-09 |
| Mobile layout | Card. |
| Desktop layout | Card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /invitations/preview; POST /invitations/accept |
| Database entities | invitations, memberships |
| Source files | invitations/accept/page.tsx |
| Dependencies / decisions | A04 |

Input fields:

  - None

#### AUTH-09 · Session expired / signed out

| Field | Specification |
|---|---|
| Screen ID | AUTH-09 |
| Screen name | Session expired / signed out |
| User roles | Company user |
| Route / URL | `Redirect to /{locale}/login?next=` |
| Purpose | Tell users their session ended and return them to where they were. |
| Information displayed | Today: silent redirect to sign in with `next`. Recommended: banner "Your session has ended. Sign in again." on the sign-in page. |
| UI components | Info alert on AUTH-04 |
| Primary call to action | Sign in |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Returns to `next` after sign-in |
| Permissions | — |
| Interactions | 401 from any API call triggers redirect. |
| Validation | — |
| Related screens | AUTH-04 |
| Mobile layout | Banner above form. |
| Desktop layout | Banner above form. |
| Implementation status | Partial · P1 |
| API endpoints | Any 401 |
| Database entities | sessions |
| Source files | components/session.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

### Authentication (admin)

#### AUTH-10 · Admin sign in

| Field | Specification |
|---|---|
| Screen ID | AUTH-10 |
| Screen name | Admin sign in |
| User roles | Platform staff |
| Route / URL | `/{locale}/admin/login (admin origin only)` |
| Purpose | Password step for staff on the separate admin origin (A03). |
| Information displayed | "Admin sign in", "Restricted to platform staff. Two-factor authentication is required." |
| UI components | Auth card (admin styling), fields, button |
| Primary call to action | Sign in |
| Secondary calls to action | — |
| Required fields | Email, Password |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Then AUTH-11 or AUTH-13 |
| Permissions | Admin accounts only (provisioned by CLI); company pages return 404 on this host. |
| Interactions | Response says which MFA step is required. |
| Validation | Invalid credentials; rate limit |
| Related screens | AUTH-11, AUTH-13 |
| Mobile layout | Card. |
| Desktop layout | Card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/auth/login |
| Database entities | users (PLATFORM_ADMIN), sessions (ADMIN scope) |
| Source files | admin/login/page.tsx; lib/hosts.ts |
| Dependencies / decisions | A02, A03 |

Input fields:

  - Email (email, Required): valid
  - Password (password, Required): 1–128

#### AUTH-11 · Admin MFA enrolment

| Field | Specification |
|---|---|
| Screen ID | AUTH-11 |
| Screen name | Admin MFA enrolment |
| User roles | Platform staff (first sign-in) |
| Route / URL | `/{locale}/admin/mfa` |
| Purpose | Mandatory TOTP enrolment. |
| Information displayed | QR code image, manual setup key, 6-digit code field. |
| UI components | QR image, monospace key with copy, OTP input, button |
| Primary call to action | Confirm and continue |
| Secondary calls to action | — |
| Required fields | 6-digit code |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Then AUTH-12 |
| Permissions | Password step done, MFA pending |
| Interactions | — |
| Validation | field.code; error.admin.mfa_code_invalid |
| Related screens | AUTH-12 |
| Mobile layout | Stacked. |
| Desktop layout | QR left, form right. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/auth/mfa/enroll/start; /enroll/confirm |
| Database entities | users.mfa_secret_enc |
| Source files | admin/mfa/page.tsx |
| Dependencies / decisions | A02 |

Input fields:

  - 6-digit code (otp, Required): ^\d{6}$

#### AUTH-12 · Admin recovery codes

| Field | Specification |
|---|---|
| Screen ID | AUTH-12 |
| Screen name | Admin recovery codes |
| User roles | Platform staff |
| Route / URL | `/{locale}/admin/mfa (step)` |
| Purpose | Show 10 single-use recovery codes once. |
| Information displayed | Codes grid, warning that they will not be shown again. |
| UI components | Code grid (monospace), checkbox "I have saved these codes", button |
| Primary call to action | Continue |
| Secondary calls to action | Copy / download codes (recommended) |
| Required fields | I have saved these codes |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | → ADM-01 |
| Permissions | Just enrolled |
| Interactions | — |
| Validation | — |
| Related screens | AUTH-13 |
| Mobile layout | Single column codes. |
| Desktop layout | Two-column codes. |
| Implementation status | Implemented · P0 |
| API endpoints | (returned by enroll/confirm) |
| Database entities | mfa_recovery_codes |
| Source files | admin/mfa/page.tsx |
| Dependencies / decisions | A02 |

Input fields:

  - I have saved these codes (checkbox, Required): required

#### AUTH-13 · Admin MFA verification

| Field | Specification |
|---|---|
| Screen ID | AUTH-13 |
| Screen name | Admin MFA verification |
| User roles | Platform staff |
| Route / URL | `/{locale}/admin/mfa (verify)` |
| Purpose | Second factor on every admin sign-in. |
| Information displayed | Code field, toggle to recovery code, remaining recovery codes shown later in admin header. |
| UI components | OTP input, text input, link button |
| Primary call to action | Verify |
| Secondary calls to action | Use a recovery code instead |
| Required fields | — |
| Optional fields | 6-digit code, Recovery code |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | → ADM-01 |
| Permissions | Password step done |
| Interactions | Replay-protected; session rotates. |
| Validation | field.code; mfa_code_invalid |
| Related screens | ADM-01 |
| Mobile layout | Card. |
| Desktop layout | Card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/auth/mfa/verify |
| Database entities | sessions.mfa_verified_at |
| Source files | admin/mfa/page.tsx |
| Dependencies / decisions | A02 |

Input fields:

  - 6-digit code (otp, Optional): exactly one of code or recovery code
  - Recovery code (text, Optional): XXXX-XXXX format

### Account management

#### ACC-01 · Home (workspace hub)

| Field | Specification |
|---|---|
| Screen ID | ACC-01 |
| Screen name | Home (workspace hub) |
| User roles | All company users |
| Route / URL | `/{locale}/app` |
| Purpose | After sign-in: show each company, its workspaces, role, status and next verification step. |
| Information displayed | "Welcome, {name}"; companies with status badge; per workspace: kind (Buyer/Seller), role, workspace status; next step text by company status; "Register a company" when none. |
| UI components | Page header, company card, status badge, empty state with CTA |
| Primary call to action | Register a company / Open company |
| Secondary calls to action | Register another company |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | App header (Home, Company, Team, RFQs or Seller centre, Messages, Notifications, Marketplace, Settings); mobile bottom nav |
| Permissions | Signed in, verified email. |
| Interactions | Opening a company selects its workspace. |
| Validation | — |
| Related screens | ACC-02, ACC-03, BUY-01, SEL-01 |
| Mobile layout | Stacked company cards; bottom nav. |
| Desktop layout | Card grid. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /me |
| Database entities | users, memberships, workspaces, companies |
| Source files | apps/web/src/app/[locale]/app/page.tsx |
| Dependencies / decisions | Copy for APPROVED state is stale ("features will appear here as they are released") |

Input fields:

  - None

#### ACC-02 · Register a company (onboarding)

| Field | Specification |
|---|---|
| Screen ID | ACC-02 |
| Screen name | Register a company (onboarding) |
| User roles | Verified user |
| Route / URL | `/{locale}/app/onboarding` |
| Purpose | Create the legal entity and request buyer and/or seller access (caller becomes OWNER of each). |
| Information displayed | "Register your company", "Enter the details exactly as they appear on your trade licence." |
| UI components | Form (grid), select, date picker, checkbox cards for access, inline errors |
| Primary call to action | Register company |
| Secondary calls to action | Cancel |
| Required fields | Legal name, Display name, Trade licence number, Licence issuing authority, Licence expiry date, Licensed activity, Emirate, Company contact email, Company contact phone, Access requested |
| Optional fields | Tax registration number (TRN) |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | → ACC-03 |
| Permissions | Email-verified user |
| Interactions | Creates DRAFT company and PENDING workspaces. |
| Validation | error.company.licence_exists; licence_expiry_future; field.trn; field.phone |
| Related screens | ACC-03 |
| Mobile layout | Single column. |
| Desktop layout | Two-column form grid. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /companies |
| Database entities | companies, workspaces, memberships |
| Source files | app/onboarding/page.tsx; components/company-form.tsx; packages/contracts/src/companies.ts |
| Dependencies / decisions | A07, A08 |

Input fields:

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

| Field | Specification |
|---|---|
| Screen ID | ACC-03 |
| Screen name | Company profile and verification |
| User roles | All company members (edit: OWNER) |
| Route / URL | `/{locale}/app/company/[companyId]` |
| Purpose | Single place to view legal details, upload documents, submit for verification, read compliance messages, renew the licence and see history. |
| Information displayed | Company details (definition list) with status; licence expired flag; workspace access (kinds and statuses); verification state; message from compliance; documents with scan state; terms acceptance; verification history timeline; renewal section. |
| UI components | Definition list, status badge, alert (reason from compliance), document list, upload form, checkbox, timeline, renewal form |
| Primary call to action | Submit / Resubmit for verification |
| Secondary calls to action | Edit details; Upload document; Remove document; Start renewal; Download document (OWNER) |
| Required fields | — |
| Optional fields | See ACC-04, ACC-05, ACC-06, ACC-07 |
| Filters | — |
| Sorting | Timeline newest first |
| Search | — |
| Navigation | App header Company; seller/buyer nav "Company settings" |
| Permissions | Read: members. Edit, upload, submit, renew: company.manage (OWNER). Download legal documents: legal_documents.read (OWNER). Locked while SUBMITTED/UNDER_REVIEW and after approval ("Licence changes go through renewal"). |
| Interactions | Upload is scanned before storage; infected files are blocked with a message. |
| Validation | error.verification.incomplete; terms_outdated; company.not_editable |
| Related screens | ACC-04…ACC-08 |
| Mobile layout | Sections stacked, documents as cards. |
| Desktop layout | Two columns: details and verification left, documents and history right. |
| Implementation status | Implemented · P0 |
| API endpoints | GET/PATCH /companies/{id}; GET/POST /companies/{id}/verification; POST /companies/{id}/documents; DELETE …/documents/{id}; POST /companies/{id}/renewal; GET /files/{id}/download |
| Database entities | companies, verification_cases, verification_case_events, verification_documents, files |
| Source files | app/company/[companyId]/page.tsx |
| Dependencies / decisions | A07, A08, A13 |

Input fields:

  - See ACC-04, ACC-05, ACC-06, ACC-07 (mixed, Optional)

#### ACC-04 · Edit company details

| Field | Specification |
|---|---|
| Screen ID | ACC-04 |
| Screen name | Edit company details |
| User roles | OWNER |
| Route / URL | `Mode of ACC-03` |
| Purpose | Correct legal details while DRAFT, NEEDS_INFO or REJECTED. |
| Information displayed | Same fields as ACC-02 without access kinds. |
| UI components | Form, Save/Cancel |
| Primary call to action | Save changes |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Same as ACC-02 (no Access requested) |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Back to ACC-03 |
| Permissions | company.manage; editable states only |
| Interactions | 409 stale version → reload prompt. |
| Validation | error.common.stale_version; company.not_editable |
| Related screens | ACC-03 |
| Mobile layout | Single column. |
| Desktop layout | Two-column grid. |
| Implementation status | Implemented · P0 |
| API endpoints | PATCH /companies/{id} |
| Database entities | companies |
| Source files | components/company-form.tsx |
| Dependencies / decisions | — |

Input fields:

  - Same as ACC-02 (no Access requested) (mixed, Optional): optimistic expected_version

#### ACC-05 · Verification document upload

| Field | Specification |
|---|---|
| Screen ID | ACC-05 |
| Screen name | Verification document upload |
| User roles | OWNER |
| Route / URL | `Section of ACC-03` |
| Purpose | Upload the trade licence and authorised-representative evidence (both required). |
| Information displayed | Intro "PDF, PNG or JPEG, up to {size} MB"; list of documents with type, expiry, file name, size, scan state (Scanning / Scanned: clean / Blocked: malware detected). |
| UI components | File upload component, select, date field, document list, remove button |
| Primary call to action | Upload document |
| Secondary calls to action | Remove |
| Required fields | Document type, File |
| Optional fields | Document expiry date |
| Filters | — |
| Sorting | Upload order |
| Search | — |
| Navigation | — |
| Permissions | company.manage while case editable |
| Interactions | Shows "Document uploaded and scanned clean." or "The malware scan blocked this file…". |
| Validation | field.type, field.too_large, error.file.scanning_unavailable |
| Related screens | ACC-03 |
| Mobile layout | Full-width dropzone replaced by file button. |
| Desktop layout | Inline upload row. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /companies/{id}/documents |
| Database entities | files, verification_documents |
| Source files | app/company/[companyId]/page.tsx |
| Dependencies / decisions | A13 |

Input fields:

  - Document type (select, Required): TRADE_LICENCE, AUTHORIZED_REPRESENTATIVE, OTHER
  - Document expiry date (date, Optional): optional
  - File (file, Required): PDF/PNG/JPEG, ≤ UPLOAD_MAX_BYTES (10 MB default); magic bytes checked; malware scanned

#### ACC-06 · Submit for verification (terms)

| Field | Specification |
|---|---|
| Screen ID | ACC-06 |
| Screen name | Submit for verification (terms) |
| User roles | OWNER |
| Route / URL | `Section of ACC-03` |
| Purpose | Accept versioned terms and submit the case. |
| Information displayed | Checkbox "I confirm the information is accurate and I accept the platform terms (version {version})", note "Final legal terms are pending legal review." |
| UI components | Checkbox, primary button, success alert "Submitted for verification." |
| Primary call to action | Submit for verification |
| Secondary calls to action | — |
| Required fields | Accept terms |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | company.manage; DRAFT, NEEDS_INFO, REJECTED |
| Interactions | Moves case to SUBMITTED; company sees read-only details. |
| Validation | field.terms; error.verification.incomplete |
| Related screens | PUB-22 |
| Mobile layout | Sticky submit box at bottom. |
| Desktop layout | Submit box in sidebar. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /companies/{id}/verification |
| Database entities | verification_cases, companies.terms_version |
| Source files | app/company/[companyId]/page.tsx |
| Dependencies / decisions | D15 |

Input fields:

  - Accept terms (checkbox, Required): must be checked; terms_version must match

#### ACC-07 · Licence renewal

| Field | Specification |
|---|---|
| Screen ID | ACC-07 |
| Screen name | Licence renewal |
| User roles | OWNER |
| Route / URL | `Section of ACC-03` |
| Purpose | Propose renewed licence details and documents; approval stays until decided unless expired. |
| Information displayed | Renewal intro, proposed licence (number, issuer, expiry), documents. |
| UI components | Form, upload, submit |
| Primary call to action | Start renewal |
| Secondary calls to action | Submit renewal |
| Required fields | Trade licence number, Licence issuing authority, Licence expiry date |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | APPROVED companies or SUSPENDED for licence expiry |
| Interactions | Creates RENEWAL case. |
| Validation | error.verification.renewal_not_allowed; case_open |
| Related screens | ADM-03 |
| Mobile layout | Single column. |
| Desktop layout | Card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /companies/{id}/renewal |
| Database entities | verification_cases (RENEWAL, proposed) |
| Source files | app/company/[companyId]/page.tsx |
| Dependencies / decisions | A08 |

Input fields:

  - Trade licence number (text, Required): 3–60
  - Licence issuing authority (text, Required): 2–120
  - Licence expiry date (date, Required): future

#### ACC-08 · Remove document dialog

| Field | Specification |
|---|---|
| Screen ID | ACC-08 |
| Screen name | Remove document dialog |
| User roles | OWNER |
| Route / URL | `Dialog on ACC-03` |
| Purpose | Confirm removing a document from an editable case. |
| Information displayed | "Remove this document?" |
| UI components | Confirmation dialog |
| Primary call to action | Remove |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | company.manage |
| Interactions | Focus trap; Escape cancels. |
| Validation | verification.not_editable |
| Related screens | ACC-05 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Centered dialog. |
| Implementation status | Implemented · P1 |
| API endpoints | DELETE /companies/{id}/documents/{documentId} |
| Database entities | verification_documents |
| Source files | components/ui.tsx (ConfirmDialog) |
| Dependencies / decisions | — |

Input fields:

  - None

#### ACC-09 · Team management

| Field | Specification |
|---|---|
| Screen ID | ACC-09 |
| Screen name | Team management |
| User roles | All members (manage: OWNER) |
| Route / URL | `/{locale}/app/team/[workspaceId]` |
| Purpose | Invite staff, change roles, remove/restore access; last-owner protection. |
| Information displayed | Members table (email, name, role, status, "you"); pending invitations (email, role, state, expires); "Only owners can manage the team." for non-owners. |
| UI components | Data table (cards on mobile), invite form, role select, row actions, confirmation dialogs |
| Primary call to action | Send invitation |
| Secondary calls to action | Change role; Remove access; Restore access; Revoke invitation |
| Required fields | — |
| Optional fields | See ACC-10 |
| Filters | — |
| Sorting | Created |
| Search | — |
| Navigation | App header Team |
| Permissions | Read: members. Manage: role OWNER only. Owners can only grant roles valid for the workspace kind (buyer: OWNER, PROCUREMENT, VIEWER; seller: OWNER, SALES, WAREHOUSE, FINANCE, VIEWER). |
| Interactions | Revocation takes effect immediately. |
| Validation | error.team.last_owner; already_member; role_not_allowed |
| Related screens | ACC-10, ACC-11, ACC-12, AUTH-08 |
| Mobile layout | Members as cards with action menu. |
| Desktop layout | Table with row actions. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /workspaces/{id}/members; GET/POST/DELETE /workspaces/{id}/invitations; PATCH /memberships/{id} |
| Database entities | memberships, invitations |
| Source files | app/team/[workspaceId]/page.tsx |
| Dependencies / decisions | A04 |

Input fields:

  - See ACC-10 (mixed, Optional)

#### ACC-10 · Invite team member form

| Field | Specification |
|---|---|
| Screen ID | ACC-10 |
| Screen name | Invite team member form |
| User roles | OWNER |
| Route / URL | `Section of ACC-09` |
| Purpose | Send an email invitation with a role. |
| Information displayed | Email and role; success "Invitation sent to {email}." |
| UI components | Inline form |
| Primary call to action | Send invitation |
| Secondary calls to action | — |
| Required fields | Email, Role |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | OWNER |
| Interactions | 7-day single-use token; rate limited. |
| Validation | field.member; field.not_allowed |
| Related screens | ACC-09 |
| Mobile layout | Stacked fields. |
| Desktop layout | Inline row. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /workspaces/{id}/invitations |
| Database entities | invitations |
| Source files | app/team/[workspaceId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Email (email, Required): valid
  - Role (select, Required): roles valid for workspace kind

#### ACC-11 · Change role dialog

| Field | Specification |
|---|---|
| Screen ID | ACC-11 |
| Screen name | Change role dialog |
| User roles | OWNER |
| Route / URL | `Dialog on ACC-09` |
| Purpose | Confirm a role change. |
| Information displayed | "Change the role of {email} to {role}?" |
| UI components | Confirmation dialog |
| Primary call to action | Confirm |
| Secondary calls to action | Cancel |
| Required fields | Role |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | OWNER |
| Interactions | Session rotation for the member on privilege change. |
| Validation | last_owner |
| Related screens | ACC-09 |
| Mobile layout | Sheet. |
| Desktop layout | Dialog. |
| Implementation status | Implemented · P1 |
| API endpoints | PATCH /memberships/{id} |
| Database entities | memberships |
| Source files | team page |
| Dependencies / decisions | — |

Input fields:

  - Role (select, Required)

#### ACC-12 · Remove access dialog

| Field | Specification |
|---|---|
| Screen ID | ACC-12 |
| Screen name | Remove access dialog |
| User roles | OWNER |
| Route / URL | `Dialog on ACC-09` |
| Purpose | Confirm revoking a member. |
| Information displayed | "Remove access for {email}? They lose access immediately." |
| UI components | Destructive confirmation dialog |
| Primary call to action | Remove access |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | OWNER |
| Interactions | — |
| Validation | last_owner |
| Related screens | ACC-09 |
| Mobile layout | Sheet. |
| Desktop layout | Dialog. |
| Implementation status | Implemented · P1 |
| API endpoints | PATCH /memberships/{id} |
| Database entities | memberships |
| Source files | team page |
| Dependencies / decisions | — |

Input fields:

  - None

#### ACC-13 · Account settings

| Field | Specification |
|---|---|
| Screen ID | ACC-13 |
| Screen name | Account settings |
| User roles | All company users |
| Route / URL | `/{locale}/app/settings` |
| Purpose | Profile, language, password, email notification preferences, marketing consent and sessions. |
| Information displayed | Profile (full name, email read-only), language; change password; email notifications (RFQs, quotes, messages, marketing opt-in) with note that in-app and security notices are always kept; active sessions (device, IP, last active, this session). |
| UI components | Settings sections (cards), fields, toggles, session list, buttons |
| Primary call to action | Save changes (per section) |
| Secondary calls to action | Change password; Sign out (session); Sign out all other sessions |
| Required fields | Full name, Language, Current password, New password |
| Optional fields | Email: RFQs, Email: quotes, Email: messages, Email: marketing |
| Filters | — |
| Sorting | Sessions newest first |
| Search | — |
| Navigation | App header Settings |
| Permissions | Own account only |
| Interactions | Password change signs out other sessions. |
| Validation | error.auth.current_password_wrong; field.min |
| Related screens | ACC-14 |
| Mobile layout | Sections stacked; sessions as cards. |
| Desktop layout | Section nav left (recommended), forms right. |
| Implementation status | Implemented · P0 |
| API endpoints | GET/PATCH /me; GET /me/sessions; DELETE /me/sessions/{id}; POST /me/sessions/revoke-others; POST /me/password; GET/PATCH /notifications/preferences |
| Database entities | users, sessions, notification_preferences |
| Source files | app/settings/page.tsx |
| Dependencies / decisions | P6-6 |

Input fields:

  - Full name (text, Required): 1–120
  - Language (select, Required): en, ar
  - Current password (password, Required): for password change
  - New password (password, Required): 12–128
  - Email: RFQs (toggle, Optional): default on
  - Email: quotes (toggle, Optional): default on
  - Email: messages (toggle, Optional): default off
  - Email: marketing (toggle, Optional): default off; records consent time

#### ACC-15 · Workspace switcher

| Field | Specification |
|---|---|
| Screen ID | ACC-15 |
| Screen name | Workspace switcher |
| User roles | Users with more than one workspace |
| Route / URL | `Header control (all /app pages)` |
| Purpose | Switch between companies and buyer/seller workspaces. |
| Information displayed | Options "{Company} · Buyer\|Seller". |
| UI components | Select (recommended: menu with company grouping and status) |
| Primary call to action | Select workspace |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | Workspace |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Changes header nav items |
| Permissions | Own memberships |
| Interactions | Remembered in localStorage per browser. |
| Validation | — |
| Related screens | ACC-01 |
| Mobile layout | Inside account menu. |
| Desktop layout | Header right. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /me |
| Database entities | memberships |
| Source files | components/session.tsx |
| Dependencies / decisions | — |

Input fields:

  - Workspace (select, Optional)

#### ACC-16 · Account closure and data requests

| Field | Specification |
|---|---|
| Screen ID | ACC-16 |
| Screen name | Account closure and data requests |
| User roles | User; OWNER for company |
| Route / URL | `Not built` |
| Purpose | Request account closure, data access/export and deletion with legal-hold handling (founder decision 11). |
| Information displayed | Request types, status, legal hold notice, retention explanation. |
| UI components | Form, status list, confirmation dialog |
| Primary call to action | Submit request |
| Secondary calls to action | Cancel request |
| Required fields | Request type |
| Optional fields | Details |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Settings |
| Permissions | Own data; company closure OWNER |
| Interactions | Irreversible deletion disabled until legal approval. |
| Validation | — |
| Related screens | ACC-13, ADM-51 |
| Mobile layout | Single column. |
| Desktop layout | Settings section. |
| Implementation status | Planned · P1 |
| API endpoints | Not built |
| Database entities | Not built |
| Source files | — |
| Dependencies / decisions | D09, D15, A13 |

Input fields:

  - Request type (radio, Required): Access, Export, Deletion, Account closure
  - Details (textarea, Optional): optional

#### ACC-17 · Billing, invoices and statements

| Field | Specification |
|---|---|
| Screen ID | ACC-17 |
| Screen name | Billing, invoices and statements |
| User roles | Buyer OWNER/PROCUREMENT; seller OWNER/FINANCE |
| Route / URL | `Not built (spec /account/billing, /finance/invoices)` |
| Purpose | Download supplier merchandise invoices, platform commission invoices, credit notes, receipts and statements. |
| Information displayed | Invoice list (number, issuer, recipient, type, date, total, VAT, status), credit notes, statements by period. |
| UI components | Data table, download button, filters |
| Primary call to action | Download invoice |
| Secondary calls to action | Filter; Download statement |
| Required fields | — |
| Optional fields | Period, Type |
| Filters | Type, period, counterparty |
| Sorting | Date |
| Search | Invoice number |
| Navigation | Buyer and seller finance nav |
| Permissions | Buyer invoice read: OWNER/PROCUREMENT (10-security); seller finance: OWNER/FINANCE |
| Interactions | Immutable issued documents. |
| Validation | — |
| Related screens | BUY-28, SEL-34 |
| Mobile layout | Cards. |
| Desktop layout | Table. |
| Implementation status | Blocked · P0 |
| API endpoints | Not built |
| Database entities | invoices (spec only) |
| Source files | — |
| Dependencies / decisions | D06 tax approval, founder decision 5 |

Input fields:

  - Period (date range, Optional)
  - Type (select, Optional): Merchandise invoice, Commission invoice, Credit note, Receipt

### Communication

#### ACC-14 · Notification centre

| Field | Specification |
|---|---|
| Screen ID | ACC-14 |
| Screen name | Notification centre |
| User roles | All company users |
| Route / URL | `/{locale}/app/notifications` |
| Purpose | In-app list of events with links to the resource. |
| Information displayed | Notification rows (type text with parameters, time, unread marker), unread count, unread-only filter. |
| UI components | Notification list item, filter toggle, Mark all as read, empty state "You have no notifications." |
| Primary call to action | Open notification target |
| Secondary calls to action | Mark as read; Mark all as read; Unread only |
| Required fields | — |
| Optional fields | Unread only |
| Filters | Unread only |
| Sorting | Newest first |
| Search | — |
| Navigation | Header badge (refreshes every 60 s) |
| Permissions | Own notifications |
| Interactions | Opening marks read; links only to internal /app paths. |
| Validation | — |
| Related screens | MSG-01 |
| Mobile layout | Full-width list. |
| Desktop layout | List in narrow container; dropdown preview recommended. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /notifications; POST /notifications/{id}/read; POST /notifications/read-all; GET /notifications/unread |
| Database entities | notifications |
| Source files | app/notifications/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Unread only (toggle, Optional)

#### MSG-01 · Conversations list

| Field | Specification |
|---|---|
| Screen ID | MSG-01 |
| Screen name | Conversations list |
| User roles | Buyer OWNER/PROCUREMENT; seller OWNER/SALES |
| Route / URL | `/{locale}/app/messages/[workspaceId]` |
| Purpose | All buyer↔supplier conversations of the workspace with unread counts. |
| Information displayed | Counterpart company, linked RFQ (number, title), last message preview, time, unread count; privacy note. |
| UI components | Conversation list item, unread badge, empty state ("No conversations yet. Message a supplier from their storefront or a quote." / seller variant) |
| Primary call to action | Open conversation |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — (recommended: unread, RFQ-linked) |
| Sorting | Last message time |
| Search | — (recommended) |
| Navigation | Header Messages with unread badge |
| Permissions | messaging capability (OWNER, PROCUREMENT, SALES); viewers and other roles have no messages. |
| Interactions | Refreshes while open. |
| Validation | — |
| Related screens | MSG-02 |
| Mobile layout | Full-width list; thread opens as a new page. |
| Desktop layout | Two-pane: list left, thread right (recommended). |
| Implementation status | Implemented · P0 |
| API endpoints | GET /workspaces/{ws}/conversations |
| Database entities | conversations, messages, read_receipts |
| Source files | app/messages/[workspaceId]/page.tsx |
| Dependencies / decisions | P3-6 |

Input fields:

  - None

#### MSG-02 · Conversation thread

| Field | Specification |
|---|---|
| Screen ID | MSG-02 |
| Screen name | Conversation thread |
| User roles | Buyer OWNER/PROCUREMENT; seller OWNER/SALES |
| Route / URL | `/{locale}/app/messages/[workspaceId]/[conversationId]` |
| Purpose | Read and send text messages; RFQ context shown. |
| Information displayed | Messages with sender name, side, time; "Load earlier messages"; composer; blocked reason when sending is not allowed. |
| UI components | Chat message bubbles (bidi-isolated), composer textarea, send button, load-older button, info alert |
| Primary call to action | Send |
| Secondary calls to action | Load earlier messages; open linked RFQ |
| Required fields | Your message |
| Optional fields | — |
| Filters | — |
| Sorting | Chronological |
| Search | — |
| Navigation | Back to list |
| Permissions | Participants only; sending is trading-gated (approved company). |
| Interactions | 15-second polling while open; read marker moves forward. |
| Validation | error.messages.counterpart_unavailable; trading errors |
| Related screens | MSG-01 |
| Mobile layout | Composer pinned above keyboard. |
| Desktop layout | Right pane. |
| Implementation status | Implemented · P0 |
| API endpoints | GET/POST /workspaces/{ws}/conversations/{id}/messages; POST …/read; GET …/{id} |
| Database entities | messages, read_receipts |
| Source files | app/messages/[workspaceId]/[conversationId]/page.tsx |
| Dependencies / decisions | P3-6 |

Input fields:

  - Your message (textarea, Required): 1–4000; 60 messages per user per minute

#### MSG-03 · New message to supplier

| Field | Specification |
|---|---|
| Screen ID | MSG-03 |
| Screen name | New message to supplier |
| User roles | Approved buyer OWNER/PROCUREMENT |
| Route / URL | `/{locale}/app/messages/new?storefront=…` |
| Purpose | Start (or continue) a conversation from a storefront or quote. |
| Information displayed | Supplier name, message field; "A buyer workspace is needed" when not eligible. |
| UI components | Form, textarea |
| Primary call to action | Send |
| Secondary calls to action | Cancel |
| Required fields | Your message |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | → MSG-02 |
| Permissions | Approved buyer workspace |
| Interactions | Reuses an existing conversation for the pair. |
| Validation | — |
| Related screens | PUB-10, BUY-03 |
| Mobile layout | Full page. |
| Desktop layout | Narrow form. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /workspaces/{ws}/conversations |
| Database entities | conversations |
| Source files | app/messages/new/page.tsx |
| Dependencies / decisions | A12 |

Input fields:

  - Your message (textarea, Required): 1–4000

#### MSG-04 · Message attachments

| Field | Specification |
|---|---|
| Screen ID | MSG-04 |
| Screen name | Message attachments |
| User roles | Messaging roles |
| Route / URL | `Part of MSG-02` |
| Purpose | Attach files to messages (column reserved; not built). |
| Information displayed | Attachment chip with name, size, scan state. |
| UI components | File upload in composer, attachment chip |
| Primary call to action | Attach file |
| Secondary calls to action | Remove |
| Required fields | — |
| Optional fields | File |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Participants |
| Interactions | Scan before availability. |
| Validation | Type, size |
| Related screens | MSG-02 |
| Mobile layout | Attach icon in composer. |
| Desktop layout | Attach icon in composer. |
| Implementation status | Planned · P1 |
| API endpoints | Not built |
| Database entities | messages.file_id (reserved), files (MESSAGE_ATTACHMENT) |
| Source files | — |
| Dependencies / decisions | — |

Input fields:

  - File (file, Optional): PDF/PNG/JPEG, scanned, private

### Buyer workspace

#### BUY-01 · Buyer dashboard

| Field | Specification |
|---|---|
| Screen ID | BUY-01 |
| Screen name | Buyer dashboard |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]` |
| Purpose | A single procurement home: what needs action today (quotes to compare, payments due, deliveries to confirm, disputes) instead of jumping straight into lists. No buyer dashboard exists today; buyers land on ACC-01 and use the buyer sub-nav. |
| Information displayed | Action cards with real counts from existing APIs: open RFQs and quotes received (rfqs list), payment due before deadline (checkouts PENDING_PAYMENT with pay-by), orders dispatched awaiting receipt (orders DISPATCHED/DELIVERED), open disputes, support tickets waiting for you (WAITING_CUSTOMER); recent orders; verification/licence banner. Spend totals need a new aggregate endpoint. |
| UI components | Page header, verification/trading banner, KPI tile (count + link), task list, recent orders table, empty state, skeleton |
| Primary call to action | New request for quotation |
| Secondary calls to action | Browse marketplace; open each task; View all orders |
| Required fields | — |
| Optional fields | — |
| Filters | None (period selector only if spend analytics is added) |
| Sorting | Tasks by due time (Dubai) |
| Search | — |
| Navigation | Buyer sub-nav: Dashboard (new), Cart, Orders, Disputes, Support, RFQs, New request, Addresses, Messages, Marketplace, Company settings |
| Permissions | Any member of the buyer workspace (buyer.orders.read). Purchase CTAs hidden for VIEWER and when the workspace is not ACTIVE. |
| Interactions | Each tile deep-links to a filtered list; counts refresh on focus. |
| Validation | — |
| Related screens | BUY-02, BUY-16, BUY-18, BUY-23, SHR-01, SHR-03, ACC-03 |
| Mobile layout | Stacked tiles (2-up), task list below, sticky "New request" button. |
| Desktop layout | 4-up KPI row, two-column task list and recent orders. |
| Implementation status | Recommended · P0 |
| API endpoints | Existing: GET /buyer/workspaces/{ws}/rfqs, /orders, /disputes, /workspaces/{ws}/support. New: GET /buyer/workspaces/{ws}/overview (aggregate counts and spend) |
| Database entities | rfqs, quotes, checkouts, orders, disputes, support_tickets |
| Source files | None yet (buyer-shell.tsx holds the sub-nav) |
| Dependencies / decisions | Gap G-01 |

Input fields:

  - None

#### BUY-02 · Requests for quotation list

| Field | Specification |
|---|---|
| Screen ID | BUY-02 |
| Screen name | Requests for quotation list |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/rfqs` |
| Purpose | Track every request for quotation of the workspace and its quote activity. |
| Information displayed | Reference, title, category, quantity + unit, state badge (Draft/Open/Awarded/Cancelled/Expired), visibility, quote deadline (Dubai), number of quotes. |
| UI components | Page header, state filter tabs, data table / mobile card list, status badge, pagination, empty state ("You have no requests for quotation yet."), forbidden note for VIEWER ("Your role can view requests but not create them.") |
| Primary call to action | New request |
| Secondary calls to action | Open request; filter by state; load more |
| Required fields | — |
| Optional fields | — |
| Filters | State: All, Draft, Open, Awarded, Cancelled, Expired |
| Sorting | Newest first (server) |
| Search | None today (recommended: title/reference search) |
| Navigation | Buyer sub-nav › RFQs |
| Permissions | Any member of the buyer workspace (buyer.orders.read). Create needs buyer.purchase. |
| Interactions | Rows link to BUY-05. |
| Validation | — |
| Related screens | BUY-03, BUY-05 |
| Mobile layout | Card per RFQ with state chip and deadline; filter chips scroll horizontally. |
| Desktop layout | Table with sortable-looking headers (sorting is server newest-first only). |
| Implementation status | Implemented · P0 |
| API endpoints | GET /buyer/workspaces/{ws}/rfqs |
| Database entities | rfqs, quotes |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/rfqs/page.tsx |
| Dependencies / decisions | D08, P3-1 |

Input fields:

  - None

#### BUY-03 · New request for quotation

| Field | Specification |
|---|---|
| Screen ID | BUY-03 |
| Screen name | New request for quotation |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/rfqs/new` |
| Purpose | Describe what is needed and save it as a draft before publishing to suppliers. |
| Information displayed | Intro ("The request stays a draft until you publish it"), form, visibility hint per option, attachment rules, optional pre-filled product/supplier when started from a product or storefront. |
| UI components | Form sections, text input, textarea, select (category, unit, emirate), number input, date/time input (Dubai), radio cards (visibility), money input, supplier picker (BUY-09), file uploader with scan status, inline errors, error summary |
| Primary call to action | Save draft |
| Secondary calls to action | Cancel; Invite suppliers; Add attachment |
| Required fields | Title, Category, Quantity, Unit, Specifications, Delivery emirate, Quote deadline (Dubai time), Who can quote |
| Optional fields | Needed by, Budget (AED), Invited suppliers, Attachments |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Back to RFQs |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | Save creates DRAFT and routes to BUY-05; attachments upload after the draft exists. |
| Validation | Server zod rules shown inline; open RFQ limit 50 per workspace; deadline validated in Dubai time. |
| Related screens | BUY-02, BUY-05, BUY-06, BUY-09 |
| Mobile layout | Single column, sticky Save bar, date pickers native. |
| Desktop layout | Two-column form groups, attachments panel right. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/rfqs; POST /buyer/workspaces/{ws}/rfqs/{id}/files; GET /buyer/workspaces/{ws}/invite-candidates |
| Database entities | rfqs, rfq_invitations, rfq_files, files |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/rfqs/new/page.tsx |
| Dependencies / decisions | P3-2, P3-3 |

Input fields:

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

| Field | Specification |
|---|---|
| Screen ID | BUY-04 |
| Screen name | Request quotation entry (workspace chooser) |
| User roles | Any signed-in user |
| Route / URL | `/{locale}/app/rfqs/new` |
| Purpose | Entry point used by "Request quotation" buttons on products and storefronts: routes to the right buyer workspace or explains why it cannot. |
| Information displayed | Either a redirect to BUY-03 with product/supplier context, a workspace choice when the user has several buyer workspaces, or "A buyer workspace is needed" explanation. |
| UI components | Interstitial card, workspace radio list, info alert |
| Primary call to action | Continue |
| Secondary calls to action | Register a company; Back to product |
| Required fields | Buyer workspace |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Back link to origin |
| Permissions | Signed-in; only ACTIVE buyer workspaces with buyer.purchase qualify. |
| Interactions | Auto-redirects when exactly one eligible workspace. |
| Validation | — |
| Related screens | BUY-03, ACC-02, PUB-07, PUB-10 |
| Mobile layout | Full-width card. |
| Desktop layout | Narrow centred card. |
| Implementation status | Implemented · P1 |
| API endpoints | — |
| Database entities | — |
| Source files | apps/web/src/app/[locale]/app/rfqs/new/page.tsx |
| Dependencies / decisions | A12 |

Input fields:

  - Buyer workspace (radio, Required): eligible buyer workspaces of the user

#### BUY-05 · Request for quotation detail (buyer)

| Field | Specification |
|---|---|
| Screen ID | BUY-05 |
| Screen name | Request for quotation detail (buyer) |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId]` |
| Purpose | Manage one request through its life: publish, follow quotes, compare, accept, pay. |
| Information displayed | Header with reference, title, state badge, deadline (Dubai); request summary (category, quantity/unit, emirate, needed by, budget or "Not stated", visibility); specifications; attachments; invited suppliers; hidden-by-platform notice; awarded panel (accepted total, payment due by …); quote comparison (BUY-10); history timeline with actor side (Buyer/Supplier/System/Platform). |
| UI components | Page header with status badge, description list, attachment list with scan state, invitee chips, alert (hidden, awarded, cancelled reason), comparison table, timeline, action bar |
| Primary call to action | Depends on state: Publish (DRAFT), Accept a quote (OPEN), Pay for this order (AWARDED) |
| Secondary calls to action | Edit draft; Cancel request; Invite suppliers; View order; Message supplier |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Breadcrumb RFQs › reference |
| Permissions | Any member of the buyer workspace (buyer.orders.read). Actions need buyer.purchase. |
| Interactions | Optimistic concurrency via expected_version; state-driven action bar. |
| Validation | Publish needs complete draft and future deadline. |
| Related screens | BUY-06, BUY-07, BUY-08, BUY-10, BUY-11, BUY-12, BUY-18, BUY-24 |
| Mobile layout | Sections stacked; comparison becomes swipeable cards (today the table overflows: gap G-21). |
| Desktop layout | Main column plus right summary/actions column. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /buyer/workspaces/{ws}/rfqs/{id} |
| Database entities | rfqs, rfq_events, quotes, quote_versions, rfq_files |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | P3-4, P3-5 |

Input fields:

  - None

#### BUY-06 · Edit request draft

| Field | Specification |
|---|---|
| Screen ID | BUY-06 |
| Screen name | Edit request draft |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/rfqs/[rfqId] (edit mode)` |
| Purpose | Change a draft before publishing. |
| Information displayed | Same fields as BUY-03 pre-filled; "Changes saved." toast. |
| UI components | As BUY-03 |
| Primary call to action | Save changes |
| Secondary calls to action | Cancel edit; Add/remove attachment |
| Required fields | — |
| Optional fields | As BUY-03 |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Returns to BUY-05 |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. DRAFT only. |
| Interactions | 409 when another member saved first; reload prompt. |
| Validation | As BUY-03 |
| Related screens | BUY-03, BUY-05 |
| Mobile layout | As BUY-03 |
| Desktop layout | As BUY-03 |
| Implementation status | Implemented · P0 |
| API endpoints | PATCH /buyer/workspaces/{ws}/rfqs/{id}; POST/DELETE /buyer/workspaces/{ws}/rfqs/{id}/files |
| Database entities | rfqs, rfq_files |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - As BUY-03 (mixed, Optional): same rules

#### BUY-07 · Publish request dialog

| Field | Specification |
|---|---|
| Screen ID | BUY-07 |
| Screen name | Publish request dialog |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Purpose | Confirm publication and who will be notified. |
| Information displayed | "Publish this request?" with POOL or INVITE body text. |
| UI components | Confirm dialog |
| Primary call to action | Publish |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | On success "Request published." and state OPEN. |
| Validation | Server checks deadline still ≥60 minutes ahead, invitees eligible. |
| Related screens | BUY-05 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/rfqs/{id}/publish |
| Database entities | rfqs, rfq_invitations, notifications, outbox |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### BUY-08 · Cancel request dialog

| Field | Specification |
|---|---|
| Screen ID | BUY-08 |
| Screen name | Cancel request dialog |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Purpose | Cancel a draft or open request without an award. |
| Information displayed | "Cancel this request? Suppliers who quoted will be told. Open quotes are closed. This cannot be undone." |
| UI components | Destructive confirm dialog with reason field |
| Primary call to action | Cancel request |
| Secondary calls to action | Keep request |
| Required fields | — |
| Optional fields | Reason |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Not after AWARDED. |
| Interactions | "Request cancelled." |
| Validation | — |
| Related screens | BUY-05 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/rfqs/{id}/cancel |
| Database entities | rfqs, quotes, rfq_events |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason (textarea, Optional): optional, ≤1000

#### BUY-09 · Invite suppliers picker

| Field | Specification |
|---|---|
| Screen ID | BUY-09 |
| Screen name | Invite suppliers picker |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Panel in BUY-03/BUY-06` |
| Purpose | Choose specific verified suppliers to invite. |
| Information displayed | Search box, eligible supplier results (public, trading-eligible), "{count} invited", "No eligible suppliers match." |
| UI components | Search input, checkbox list with supplier name/emirate, selected chips |
| Primary call to action | Invite (add to selection) |
| Secondary calls to action | Remove invitee |
| Required fields | — |
| Optional fields | Search suppliers, Selection |
| Filters | — |
| Sorting | — |
| Search | Supplier name search |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Own company excluded (no self-trade). |
| Interactions | Debounced search; selection held in the draft. |
| Validation | ≤20 invitees |
| Related screens | BUY-03 |
| Mobile layout | Full-screen picker sheet. |
| Desktop layout | Inline panel or popover list. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /buyer/workspaces/{ws}/invite-candidates |
| Database entities | marketplace_suppliers |
| Source files | rfqs/new/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Search suppliers (text, Optional): max 100
  - Selection (multi, Optional): ≤20

#### BUY-10 · Quote comparison

| Field | Specification |
|---|---|
| Screen ID | BUY-10 |
| Screen name | Quote comparison |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `Section of BUY-05` |
| Purpose | Compare the current version of every supplier quote side by side. |
| Information displayed | Caption "Current quote from each supplier"; per supplier: state, version, quantity, unit price, subtotal, shipping, tax, total (lowest total flagged "Lowest total"), lead time, delivery date, valid until (Dubai), deviations flag, revision requested flag. |
| UI components | Comparison table (rows = attributes, columns = suppliers), lowest-total marker (text + icon, never colour alone), row actions |
| Primary call to action | Accept |
| Secondary calls to action | Request revision; Decline; View details; Message supplier |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | Lowest total marker; recommended: sort by total, lead time, validity |
| Search | — |
| Navigation | — |
| Permissions | Any member of the buyer workspace (buyer.orders.read). Actions need buyer.purchase and RFQ OPEN. |
| Interactions | Amounts are server-computed fils; accept uses exact version. |
| Validation | — |
| Related screens | BUY-11, BUY-12, BUY-13, BUY-14 |
| Mobile layout | Recommended: one card per supplier with key figures and swipe; today the table overflows horizontally. |
| Desktop layout | Full-width table with sticky first column. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /buyer/workspaces/{ws}/rfqs/{id} |
| Database entities | quotes, quote_versions |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | Gap G-21 |

Input fields:

  - None

#### BUY-11 · Quote detail and version history

| Field | Specification |
|---|---|
| Screen ID | BUY-11 |
| Screen name | Quote detail and version history |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `Expandable within BUY-05` |
| Purpose | Read everything a supplier offered, including earlier versions. |
| Information displayed | "What is offered", "Differences from the request", terms, attachments, figures, "Earlier versions ({count})" with SUPERSEDED versions. |
| UI components | Disclosure panel, description list, attachment list, version list |
| Primary call to action | Accept |
| Secondary calls to action | Request revision; Decline; download attachment |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Any member of the buyer workspace (buyer.orders.read). |
| Interactions | Downloads streamed after authorization. |
| Validation | — |
| Related screens | BUY-10, BUY-12 |
| Mobile layout | Full-screen sheet. |
| Desktop layout | Inline expansion under the comparison. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /buyer/workspaces/{ws}/rfqs/{id}; GET /buyer/workspaces/{ws}/rfqs/{id}/files/{fileId} |
| Database entities | quote_versions, quote_files |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### BUY-12 · Accept quote dialog

| Field | Specification |
|---|---|
| Screen ID | BUY-12 |
| Screen name | Accept quote dialog |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Purpose | Award the request to one exact quote version and start the order and payment window. |
| Information displayed | "Accept this quote? You are accepting version {version} from {company}. Other quotes will be declined. This cannot be undone." and "Totals are taken from the supplier's submitted version, not from this page." |
| UI components | Confirm dialog, PO reference input |
| Primary call to action | Accept quote |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Your PO reference |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | Idempotency-Key header; accepts the exact version_id; creates checkout (source QUOTE) and order with 72-hour payment deadline (D05). The delivery address (in the quoted emirate) is chosen when starting payment on BUY-18. |
| Validation | Version must still be current (quote.superseded) and the RFQ OPEN (rfq.not_open). |
| Related screens | BUY-05, BUY-18, BUY-20 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/quotes/{quoteId}/accept |
| Database entities | quotes, rfqs, checkouts, orders |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | D05 |

Input fields:

  - Your PO reference (text, Optional): optional, ≤60

#### BUY-13 · Request revision dialog

| Field | Specification |
|---|---|
| Screen ID | BUY-13 |
| Screen name | Request revision dialog |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Purpose | Ask a supplier to revise without declining. |
| Information displayed | "{company} will be asked to revise the quote. The current version stays valid." |
| UI components | Dialog with note textarea |
| Primary call to action | Request revision |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Reason / note to supplier |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | "Revision requested."; flag shown on quote. |
| Validation | — |
| Related screens | BUY-10 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/quotes/{quoteId}/request-revision |
| Database entities | quotes, rfq_events |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason / note to supplier (textarea, Optional): optional, ≤1000

#### BUY-14 · Decline quote dialog

| Field | Specification |
|---|---|
| Screen ID | BUY-14 |
| Screen name | Decline quote dialog |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05` |
| Purpose | Decline a quote. |
| Information displayed | "Decline the quote from {company}? This cannot be undone." |
| UI components | Destructive confirm dialog |
| Primary call to action | Decline |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Reason |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | "Quote declined." |
| Validation | — |
| Related screens | BUY-10 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/quotes/{quoteId}/decline |
| Database entities | quotes |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason (textarea, Optional): optional, ≤1000

#### BUY-15 · Counteroffer to supplier

| Field | Specification |
|---|---|
| Screen ID | BUY-15 |
| Screen name | Counteroffer to supplier |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-05 (proposed)` |
| Purpose | Founder decision (2026-11-28): counteroffers and revisions are allowed. Today the buyer can only request a revision with a note; there is no structured counter price/quantity. |
| Information displayed | Current version figures, proposed unit price, quantity, delivery date, note; resulting proposed total computed by the server. |
| UI components | Dialog with money/number inputs and server preview |
| Primary call to action | Send counteroffer |
| Secondary calls to action | Cancel |
| Required fields | Proposed unit price (AED), Quantity |
| Optional fields | Needed by, Note |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | Supplier answers by revising (new version) or declining. |
| Validation | Server validates amounts and RFQ state. |
| Related screens | BUY-13, SEL-22 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Planned · P1 |
| API endpoints | New: POST /buyer/workspaces/{ws}/quotes/{quoteId}/counter |
| Database entities | New quote_counteroffers table or event payload |
| Source files | — |
| Dependencies / decisions | Founder decision 8 (quotes); Gap G-07 |

Input fields:

  - Proposed unit price (AED) (money, Required): fils integer
  - Quantity (integer, Required): 1–10,000,000
  - Needed by (date, Optional)
  - Note (textarea, Optional): ≤2000

#### BUY-16 · Cart

| Field | Specification |
|---|---|
| Screen ID | BUY-16 |
| Screen name | Cart |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/cart` |
| Purpose | Review ready-stock items grouped by supplier before checkout. |
| Information displayed | Groups per supplier with delivery fee per order and typical days; lines with image, title, variant, unit price, quantity stepper, "Minimum {moq}, in steps of {step}", line total, issue text (No longer available / Request a quotation / below MOQ / step mismatch / Only {available} available); merchandise subtotal; note "Delivery and tax are calculated at checkout for your address." |
| UI components | Supplier group card, cart line, quantity stepper, issue alert, summary panel, empty state ("Your cart is empty." + Browse products) |
| Primary call to action | Continue to checkout |
| Secondary calls to action | Update; Remove; Browse products; open product |
| Required fields | Quantity |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Header cart link (purchase roles only) |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Max 50 lines. |
| Interactions | Server re-prices on every load; lines with issues block checkout. |
| Validation | MOQ_NOT_MET, INCREMENT, insufficient stock. |
| Related screens | BUY-17, PUB-07 |
| Mobile layout | Lines stacked, sticky summary bar with total and CTA. |
| Desktop layout | Lines left, sticky summary right. |
| Implementation status | Implemented · P0 |
| API endpoints | GET/POST/PATCH/DELETE /buyer/workspaces/{ws}/cart(/items) |
| Database entities | carts, cart_items, skus, inventory, price_tiers |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/cart/page.tsx |
| Dependencies / decisions | P4-1 |

Input fields:

  - Quantity (integer, Required): ≥ MOQ, increment, ≤ available

#### BUY-17 · Checkout

| Field | Specification |
|---|---|
| Screen ID | BUY-17 |
| Screen name | Checkout |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/checkout` |
| Purpose | Choose a delivery address, see server totals per supplier and place the order(s). |
| Information displayed | Delivery address selector; per-supplier order summary (items, delivery, tax, total); grand total; "This creates {count} order(s), one per supplier, paid in one payment."; "Stock is held for 15 minutes while you pay."; issues (no delivery terms, emirate not served); sandbox payment notice. |
| UI components | Address radio cards, order summary card, totals table, terms checkbox, PO input, issue alerts, sandbox banner |
| Primary call to action | Place order and pay |
| Secondary calls to action | Review cart; Add an address; Manage addresses |
| Required fields | Deliver to, Accept terms |
| Optional fields | Your PO reference |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | Preview hash; 409 checkout.changed shows refreshed totals; creates checkout + orders + 15-minute reservation. |
| Validation | Address emirate served; no blocking issues; terms accepted. |
| Related screens | BUY-16, BUY-18, BUY-20, BUY-21, FIN-01 |
| Mobile layout | Single column; totals then sticky CTA. |
| Desktop layout | Address and items left, summary right. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/checkout/preview; POST /buyer/workspaces/{ws}/checkouts |
| Database entities | checkouts, orders, order_lines, reservations, addresses |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/checkout/page.tsx |
| Dependencies / decisions | P4-1, P4-2, tax model |

Input fields:

  - Deliver to (radio, Required): active UAE address
  - Your PO reference (text, Optional): optional
  - Accept terms (checkbox, Required): required ("Confirm the order details to continue.")

#### BUY-18 · Checkout status and payment

| Field | Specification |
|---|---|
| Screen ID | BUY-18 |
| Screen name | Checkout status and payment |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId]` |
| Purpose | Pay, resume payment and see the authoritative payment outcome. |
| Information displayed | Delivery address selector for quote checkouts that have none yet ("Must be in the emirate the supplier quoted for."); checkout number and state (Awaiting payment / Paid / Expired / Cancelled / Under finance review); pay-by (Dubai); "Stock is held for you until then."; last failed attempt code; orders created; payment attempts with state (Created, With provider, Captured, Failed, Cancelled); state-specific messages (paid, awaiting confirmation, expired, cancelled, reconciliation). |
| UI components | Status hero (icon + text + badge), countdown, orders list, payment attempts table, sandbox banner, auto-refresh indicator |
| Primary call to action | Pay now / Return to payment page |
| Secondary calls to action | Cancel checkout; View order; View request |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Any member of the buyer workspace (buyer.orders.read). Pay/cancel need buyer.purchase. |
| Interactions | Polls until a terminal state; payment confirmed only from provider webhook (never from redirect). Max 5 attempts. |
| Validation | — |
| Related screens | BUY-19, FIN-01, BUY-23, BUY-24 |
| Mobile layout | Status hero first, actions sticky. |
| Desktop layout | Status hero, two columns orders/payments. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /buyer/workspaces/{ws}/checkouts/{id}; POST /pay; POST /cancel |
| Database entities | checkouts, payments, orders, reconciliation_cases |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/checkouts/[checkoutId]/page.tsx |
| Dependencies / decisions | D05 provider |

Input fields:

  - None

#### BUY-19 · Cancel checkout dialog

| Field | Specification |
|---|---|
| Screen ID | BUY-19 |
| Screen name | Cancel checkout dialog |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-18` |
| Purpose | Cancel an unpaid cart checkout. |
| Information displayed | "The orders are cancelled and the held stock is released." |
| UI components | Destructive confirm dialog |
| Primary call to action | Cancel checkout |
| Secondary calls to action | Keep checkout |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Cart checkouts in PENDING_PAYMENT only. |
| Interactions | Orders → CANCELLED (reason cancelled_by_buyer). |
| Validation | — |
| Related screens | BUY-18 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/checkouts/{id}/cancel |
| Database entities | checkouts, orders, reservations |
| Source files | checkouts/[checkoutId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### BUY-20 · Delivery addresses

| Field | Specification |
|---|---|
| Screen ID | BUY-20 |
| Screen name | Delivery addresses |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/addresses` |
| Purpose | Maintain UAE delivery addresses for the workspace. |
| Information displayed | "Delivery addresses in the UAE for this buying workspace."; address cards with label, recipient, phone, lines, city, emirate, Default badge. |
| UI components | Address card, default badge, empty state ("No addresses yet. Add one to check out."), back-to-checkout link |
| Primary call to action | Add an address |
| Secondary calls to action | Edit; Make default; Remove; Back to checkout |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Any member of the buyer workspace (buyer.orders.read). Changes need buyer.purchase. Max 20. |
| Interactions | Archive keeps snapshots on placed orders. |
| Validation | — |
| Related screens | BUY-21, BUY-22, BUY-17 |
| Mobile layout | Stacked cards. |
| Desktop layout | Grid of cards. |
| Implementation status | Implemented · P0 |
| API endpoints | GET/POST/PATCH/DELETE /buyer/workspaces/{ws}/addresses |
| Database entities | addresses |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/addresses/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### BUY-21 · Address form

| Field | Specification |
|---|---|
| Screen ID | BUY-21 |
| Screen name | Address form |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Form on BUY-20` |
| Purpose | Add or edit a delivery address. |
| Information displayed | Fields with UAE context. |
| UI components | Form, text inputs, phone input, emirate select, default checkbox |
| Primary call to action | Save address |
| Secondary calls to action | Cancel |
| Required fields | Label (for example Main warehouse), Recipient, Phone, Address line 1, City, Emirate |
| Optional fields | Address line 2, Make default |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | "Address saved." |
| Validation | Phone regex; required fields; max 20 addresses. |
| Related screens | BUY-20 |
| Mobile layout | Full-screen form. |
| Desktop layout | Inline form or modal. |
| Implementation status | Implemented · P0 |
| API endpoints | POST/PATCH /buyer/workspaces/{ws}/addresses(/{id}) |
| Database entities | addresses |
| Source files | addresses/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Label (for example Main warehouse) (text, Required): ≤60
  - Recipient (text, Required): ≤120
  - Phone (tel, Required): E.164, UAE format hint
  - Address line 1 (text, Required): ≤200
  - Address line 2 (text, Optional): ≤200
  - City (text, Required): ≤80
  - Emirate (select, Required): 7 emirates
  - Make default (checkbox, Optional)

#### BUY-22 · Remove address dialog

| Field | Specification |
|---|---|
| Screen ID | BUY-22 |
| Screen name | Remove address dialog |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-20` |
| Purpose | Archive an address. |
| Information displayed | "The address is removed from this list. Orders already placed keep their copy." |
| UI components | Destructive confirm |
| Primary call to action | Remove address |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | — |
| Validation | — |
| Related screens | BUY-20 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P1 |
| API endpoints | DELETE /buyer/workspaces/{ws}/addresses/{id} |
| Database entities | addresses |
| Source files | addresses/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### BUY-23 · Orders list (buyer)

| Field | Specification |
|---|---|
| Screen ID | BUY-23 |
| Screen name | Orders list (buyer) |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/orders` |
| Purpose | Track all orders from catalogue checkouts and accepted quotations. |
| Information displayed | Order number, supplier, source (Catalogue order / From quotation), created (Dubai), total, state badge. |
| UI components | State filter, table/cards, status badge, pagination, empty state ("No orders yet. Orders appear here after checkout or an accepted quotation.") |
| Primary call to action | Open order |
| Secondary calls to action | Filter; load more |
| Required fields | — |
| Optional fields | — |
| Filters | State (7 order states) |
| Sorting | Newest first |
| Search | None today (recommended: order number / supplier search) |
| Navigation | Buyer sub-nav › Orders |
| Permissions | Any member of the buyer workspace (buyer.orders.read). |
| Interactions | — |
| Validation | — |
| Related screens | BUY-24 |
| Mobile layout | Cards with state chip. |
| Desktop layout | Table. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /buyer/workspaces/{ws}/orders |
| Database entities | orders |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/orders/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### BUY-24 · Order detail (buyer)

| Field | Specification |
|---|---|
| Screen ID | BUY-24 |
| Screen name | Order detail (buyer) |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/orders/[orderId]` |
| Purpose | Follow one order from payment to completion and act on it. |
| Information displayed | Order number, state badge, supplier, source, PO reference, pay-by or confirmed at, lines (item, quantity, unit price, line total), delivery, tax, total (no commission shown to buyers), delivery address snapshot, next-step text per state, fulfilment (carrier, tracking, expected, dispatched, delivered, delivery note, proof download), refunded so far, review section, dispute link, timeline. |
| UI components | Status header, next-step alert, line items table, totals, address card, fulfilment panel, timeline, review card, action bar |
| Primary call to action | Confirm receipt (DISPATCHED/DELIVERED) |
| Secondary calls to action | Pay (AWAITING_PAYMENT); Open a dispute; Rate this supplier; Download proof; Message supplier; Open support ticket |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Any member of the buyer workspace (buyer.orders.read). Actions need buyer.orders.act. |
| Interactions | Actions shown only in valid states; server rejects invalid transitions. |
| Validation | — |
| Related screens | BUY-25, BUY-26, BUY-27, BUY-30, BUY-31, SHR-02, BUY-18 |
| Mobile layout | Status and next step first; collapsible sections; sticky action. |
| Desktop layout | Main column + right summary. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /buyer/workspaces/{ws}/orders/{id}; GET /proof |
| Database entities | orders, order_lines, order_events, shipments, refunds, reviews |
| Source files | apps/web/src/app/[locale]/app/buyer/[workspaceId]/orders/[orderId]/page.tsx |
| Dependencies / decisions | P5-1, P5-2 |

Input fields:

  - None

#### BUY-25 · Confirm receipt dialog

| Field | Specification |
|---|---|
| Screen ID | BUY-25 |
| Screen name | Confirm receipt dialog |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-24` |
| Purpose | Confirm goods arrived; completes the order. |
| Information displayed | "Confirm you received this order? This completes the order. You can still open a dispute for 14 days after confirming." |
| UI components | Confirm dialog |
| Primary call to action | Confirm receipt |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | buyer.orders.act |
| Interactions | Order → COMPLETED; settlement becomes ELIGIBLE (unless disputed). Founder decision wants auto-complete after the window: conflict P5-2. |
| Validation | — |
| Related screens | BUY-24 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/orders/{id}/confirm-receipt |
| Database entities | orders, settlements |
| Source files | orders/[orderId]/page.tsx |
| Dependencies / decisions | Founder decision (auto-complete) vs P5-2 |

Input fields:

  - None

#### BUY-26 · Rate supplier form

| Field | Specification |
|---|---|
| Screen ID | BUY-26 |
| Screen name | Rate supplier form |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Section of BUY-24` |
| Purpose | Leave one review per completed order. |
| Information displayed | "Rate this supplier"; "Reviews are shown publicly without your company name." |
| UI components | Star rating (radio group), textarea, submit |
| Primary call to action | Submit review |
| Secondary calls to action | — |
| Required fields | Rating |
| Optional fields | Comment |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | buyer.orders.act; order COMPLETED; once per order. |
| Interactions | Shows "Your review" afterwards. |
| Validation | 1–5; ≤1000 |
| Related screens | PUB-10, ADM-41 |
| Mobile layout | Full-width card. |
| Desktop layout | Card in order detail. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /buyer/workspaces/{ws}/orders/{id}/review |
| Database entities | reviews |
| Source files | orders/[orderId]/page.tsx |
| Dependencies / decisions | P5-6 label vs founder "verified business buyer" |

Input fields:

  - Rating (radio 1–5, Required)
  - Comment (textarea, Optional): ≤1000

#### BUY-27 · Open dispute form (buyer)

| Field | Specification |
|---|---|
| Screen ID | BUY-27 |
| Screen name | Open dispute form (buyer) |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-24` |
| Purpose | Raise a problem with an order. |
| Information displayed | "Disputes can be opened until 14 days after receipt is confirmed and never after the supplier is paid out." |
| UI components | Dialog, select, textarea |
| Primary call to action | Open a dispute |
| Secondary calls to action | Cancel |
| Required fields | Problem, What happened? |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | buyer.orders.act |
| Interactions | Creates dispute OPEN; settlement HELD; routes to SHR-02. |
| Validation | Within window; one open dispute per order. |
| Related screens | SHR-02 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /buyer/workspaces/{ws}/orders/{id}/disputes |
| Database entities | disputes, settlements |
| Source files | orders/[orderId]/page.tsx |
| Dependencies / decisions | P5-3 vs founder (verified delivery) |

Input fields:

  - Problem (select, Required): NOT_RECEIVED, DAMAGED, WRONG_ITEMS, QUANTITY_SHORT, QUALITY, OTHER
  - What happened? (textarea, Required): ≤2000

#### BUY-28 · Invoices and tax documents (buyer)

| Field | Specification |
|---|---|
| Screen ID | BUY-28 |
| Screen name | Invoices and tax documents (buyer) |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/invoices (proposed)` |
| Purpose | Download supplier tax invoices and credit notes for orders. Founder chose the disclosed-intermediary model (suppliers invoice buyers) pending professional tax approval; no invoice generation exists. |
| Information displayed | Invoice number, supplier, TRN, order, date, amount, VAT, credit notes. |
| UI components | Table, download button, empty state |
| Primary call to action | Download invoice |
| Secondary calls to action | Filter by period |
| Required fields | — |
| Optional fields | — |
| Filters | Period, supplier |
| Sorting | Newest |
| Search | Invoice/order number |
| Navigation | — |
| Permissions | Any member of the buyer workspace (buyer.orders.read). |
| Interactions | — |
| Validation | — |
| Related screens | BUY-24, SEL-33 |
| Mobile layout | Card list. |
| Desktop layout | Table. |
| Implementation status | Blocked · P1 |
| API endpoints | New invoice endpoints |
| Database entities | New invoices, credit_notes |
| Source files | — |
| Dependencies / decisions | Tax approval; D06; Gap G-03 |

Input fields:

  - None

#### BUY-29 · Payment history (buyer)

| Field | Specification |
|---|---|
| Screen ID | BUY-29 |
| Screen name | Payment history (buyer) |
| User roles | Buyer OWNER, PROCUREMENT, VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/payments (proposed)` |
| Purpose | One list of all payments and refunds for the workspace (today visible only inside each checkout/order). |
| Information displayed | Date, checkout, amount, state, refunds. |
| UI components | Table, status badge, sandbox label |
| Primary call to action | Open checkout |
| Secondary calls to action | Filter |
| Required fields | — |
| Optional fields | — |
| Filters | State, period |
| Sorting | Newest |
| Search | — |
| Navigation | — |
| Permissions | Any member of the buyer workspace (buyer.orders.read). |
| Interactions | — |
| Validation | — |
| Related screens | BUY-18 |
| Mobile layout | Cards. |
| Desktop layout | Table. |
| Implementation status | Recommended · P2 |
| API endpoints | New GET /buyer/workspaces/{ws}/payments |
| Database entities | payments, refunds |
| Source files | — |
| Dependencies / decisions | — |

Input fields:

  - None

#### BUY-30 · Reorder

| Field | Specification |
|---|---|
| Screen ID | BUY-30 |
| Screen name | Reorder |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Action on BUY-24 (proposed)` |
| Purpose | Add the lines of a past catalogue order back to the cart at current prices. |
| Information displayed | Lines with current availability and price changes. |
| UI components | Dialog with diff list |
| Primary call to action | Add to cart |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | Server re-prices; unavailable lines skipped with reason. |
| Validation | — |
| Related screens | BUY-16 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Planned · P2 |
| API endpoints | New POST /buyer/workspaces/{ws}/orders/{id}/reorder |
| Database entities | carts |
| Source files | — |
| Dependencies / decisions | Gap G-11 |

Input fields:

  - None

#### BUY-31 · Request order cancellation (buyer)

| Field | Specification |
|---|---|
| Screen ID | BUY-31 |
| Screen name | Request order cancellation (buyer) |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Dialog on BUY-24 (proposed)` |
| Purpose | Ask to cancel a paid order before dispatch. Today a buyer can only cancel an unpaid checkout; refund policy is provisional. |
| Information displayed | Reason, policy text (pending lawyer review). |
| UI components | Dialog, reason select, textarea |
| Primary call to action | Send request |
| Secondary calls to action | Cancel |
| Required fields | Reason |
| Optional fields | Details |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | buyer.orders.act |
| Interactions | Supplier/admin decides; refund via finance dual control. |
| Validation | — |
| Related screens | BUY-24, SEL-36 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Planned · P1 |
| API endpoints | New endpoints |
| Database entities | New cancellation_requests |
| Source files | — |
| Dependencies / decisions | Returns/cancellation policy (legal); Gap G-09 |

Input fields:

  - Reason (select, Required)
  - Details (textarea, Optional): ≤2000

#### BUY-32 · Request a sample

| Field | Specification |
|---|---|
| Screen ID | BUY-32 |
| Screen name | Request a sample |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Action on PUB-07 (proposed)` |
| Purpose | Products carry a "samples available" flag and note but there is no sample request flow; today buyers must use an RFQ or message. |
| Information displayed | Product, variant, quantity, delivery address, note. |
| UI components | Dialog form |
| Primary call to action | Request sample |
| Secondary calls to action | Cancel |
| Required fields | Quantity |
| Optional fields | Note |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. |
| Interactions | — |
| Validation | — |
| Related screens | PUB-07, BUY-03 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Recommended · P2 |
| API endpoints | Could reuse RFQ with a "sample" flag |
| Database entities | rfqs |
| Source files | — |
| Dependencies / decisions | Product decision |

Input fields:

  - Quantity (integer, Required)
  - Note (textarea, Optional)

### Shared (buyer + seller)

#### SHR-01 · Disputes list

| Field | Specification |
|---|---|
| Screen ID | SHR-01 |
| Screen name | Disputes list |
| User roles | Buyer and seller workspace members |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/disputes and /{locale}/app/seller/[workspaceId]/disputes` |
| Purpose | All disputes on the workspace's orders. |
| Information displayed | Dispute number, order, type, state badge, opened by, opened date. |
| UI components | Table/cards, status badge, empty state ("No disputes.") |
| Primary call to action | Open dispute |
| Secondary calls to action | Filter by state |
| Required fields | — |
| Optional fields | — |
| Filters | State (6 dispute states) |
| Sorting | Newest |
| Search | — |
| Navigation | Buyer or seller sub-nav › Disputes |
| Permissions | Any member of the workspace. |
| Interactions | — |
| Validation | — |
| Related screens | SHR-02 |
| Mobile layout | Cards. |
| Desktop layout | Table. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /buyer/workspaces/{ws}/disputes; GET /seller/workspaces/{ws}/disputes |
| Database entities | disputes |
| Source files | app/buyer/[workspaceId]/disputes/page.tsx; app/seller/[workspaceId]/disputes/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SHR-02 · Dispute detail

| Field | Specification |
|---|---|
| Screen ID | SHR-02 |
| Screen name | Dispute detail |
| User roles | Buyer and seller workspace members |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/disputes/[disputeId] and /{locale}/app/seller/[workspaceId]/disputes/[disputeId]` |
| Purpose | Exchange messages and evidence with the other party and platform support; see the proposed resolution. |
| Information displayed | Dispute number, state, type, order link, opened by, "Payout for this order is held while the dispute is open.", messages and evidence with author side (Buyer/Supplier/Platform support/System), proposed resolution (No financial action / Refund + amount), refunds, closed note. |
| UI components | Status header, message thread, evidence file chip with scan state, composer with file input, resolution card |
| Primary call to action | Send |
| Secondary calls to action | Attach evidence; download evidence; open order |
| Required fields | Message |
| Optional fields | Evidence (PDF, PNG or JPEG) |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Read: any member. Post: buyer.orders.act or seller.inventory.ship. |
| Interactions | Composer hidden when CLOSED. |
| Validation | Length, file type, size |
| Related screens | SHR-01, BUY-24, SEL-28, ADM-39 |
| Mobile layout | Thread full screen, composer sticky. |
| Desktop layout | Thread left, summary right. |
| Implementation status | Implemented · P0 |
| API endpoints | GET/POST …/disputes/{id}(/messages); GET …/files/{fileId} |
| Database entities | disputes, dispute_messages, files |
| Source files | disputes/[disputeId]/page.tsx (buyer and seller) |
| Dependencies / decisions | P5-3, P5-4 |

Input fields:

  - Message (textarea, Required): ≤2000 (≤200 messages per dispute)
  - Evidence (PDF, PNG or JPEG) (file, Optional): ≤10 MB, scanned

#### SHR-03 · Support tickets list

| Field | Specification |
|---|---|
| Screen ID | SHR-03 |
| Screen name | Support tickets list |
| User roles | Any workspace member |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/support and /{locale}/app/seller/[workspaceId]/support` |
| Purpose | Workspace tickets with the platform team. |
| Information displayed | Subject, topic, state ("Waiting for you" etc.), updated, linked order/RFQ. |
| UI components | Table/cards, status badge, empty state ("No tickets yet.") |
| Primary call to action | New ticket |
| Secondary calls to action | Filter |
| Required fields | — |
| Optional fields | — |
| Filters | State |
| Sorting | Recently updated |
| Search | — |
| Navigation | — |
| Permissions | Any member; VIEWER cannot create or reply. |
| Interactions | — |
| Validation | — |
| Related screens | SHR-04, SHR-05 |
| Mobile layout | Cards. |
| Desktop layout | Table. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /workspaces/{ws}/support |
| Database entities | support_tickets |
| Source files | app/buyer/[workspaceId]/support/page.tsx; app/seller/[workspaceId]/support/page.tsx |
| Dependencies / decisions | P6-1 |

Input fields:

  - None

#### SHR-04 · New support ticket

| Field | Specification |
|---|---|
| Screen ID | SHR-04 |
| Screen name | New support ticket |
| User roles | Workspace members except VIEWER |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/support/new and /{locale}/app/seller/[workspaceId]/support/new` |
| Purpose | Open a ticket, optionally linked to an order or RFQ. |
| Information displayed | "Do not include passwords or card details." |
| UI components | Form, select, text, textarea, linked record select |
| Primary call to action | Open ticket |
| Secondary calls to action | Cancel |
| Required fields | Topic, Subject, How can we help? |
| Optional fields | Linked order, Linked request |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Any member except VIEWER; ≤20 open per workspace today (founder: 10 per company). |
| Interactions | — |
| Validation | Lengths; open-ticket limit |
| Related screens | SHR-03, SHR-05 |
| Mobile layout | Full-screen form. |
| Desktop layout | Centred form. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /workspaces/{ws}/support |
| Database entities | support_tickets |
| Source files | support/new/page.tsx |
| Dependencies / decisions | P6-1 vs founder (10 per company) |

Input fields:

  - Topic (select, Required): ACCOUNT, VERIFICATION, ORDER, PAYMENT, RFQ, CATALOG, OTHER
  - Subject (text, Required): ≤160
  - How can we help? (textarea, Required): ≤4000
  - Linked order (select, Optional): own orders
  - Linked request (select, Optional): own RFQs

#### SHR-05 · Support ticket detail

| Field | Specification |
|---|---|
| Screen ID | SHR-05 |
| Screen name | Support ticket detail |
| User roles | Any workspace member |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/support/[ticketId] and /{locale}/app/seller/[workspaceId]/support/[ticketId]` |
| Purpose | Converse with support until resolved. |
| Information displayed | Subject, topic, state, linked record, messages (customer/agent), resolution note. |
| UI components | Thread, composer, status header |
| Primary call to action | Send reply |
| Secondary calls to action | Close ticket; Reopen |
| Required fields | Reply |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Reply/close/reopen: members except VIEWER. |
| Interactions | — |
| Validation | — |
| Related screens | SHR-03, SHR-06, ADM-43 |
| Mobile layout | Thread full-screen. |
| Desktop layout | Thread + summary. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /workspaces/{ws}/support/{id}; POST /messages, /close, /reopen |
| Database entities | support_tickets, support_messages |
| Source files | support/[ticketId]/page.tsx |
| Dependencies / decisions | P6-2 vs founder (auto-close 7 days) |

Input fields:

  - Reply (textarea, Required): ≤4000 (≤200 messages)

#### SHR-06 · Close or reopen ticket dialog

| Field | Specification |
|---|---|
| Screen ID | SHR-06 |
| Screen name | Close or reopen ticket dialog |
| User roles | Workspace members except VIEWER |
| Route / URL | `Dialog on SHR-05` |
| Purpose | Close a ticket or reopen a resolved one. |
| Information displayed | Confirmation text. |
| UI components | Confirm dialog |
| Primary call to action | Close ticket / Reopen |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Members except VIEWER |
| Interactions | — |
| Validation | — |
| Related screens | SHR-05 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P2 |
| API endpoints | POST /workspaces/{ws}/support/{id}/close \| /reopen |
| Database entities | support_tickets |
| Source files | support/[ticketId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

### Payment

#### FIN-01 · Sandbox payment page

| Field | Specification |
|---|---|
| Screen ID | FIN-01 |
| Screen name | Sandbox payment page |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/sandbox-pay/[sessionId]` |
| Purpose | Development-only stand-in for a hosted payment page. Clearly labelled; no card is charged and no money moves. |
| Information displayed | "Sandbox payments: no real money" banner, amount in AED, checkout reference, buttons to simulate success or failure. |
| UI components | Sandbox banner, amount summary, two buttons |
| Primary call to action | Simulate successful payment |
| Secondary calls to action | Simulate failed payment; Back to checkout |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Checkout owner roles; PAYMENT_MODE=mock only; production refuses to start in mock mode. |
| Interactions | Calls the sandbox completion which emits a signed webhook; the checkout page then reflects the result. |
| Validation | — |
| Related screens | BUY-18 |
| Mobile layout | Full-width card. |
| Desktop layout | Narrow centred card. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /sandbox/psp/sessions/{id}; POST /sandbox/psp/sessions/{id}/complete |
| Database entities | payments, webhook_events |
| Source files | apps/web/src/app/[locale]/sandbox-pay/[sessionId]/page.tsx |
| Dependencies / decisions | D05 |

Input fields:

  - None

#### FIN-02 · Live payment provider checkout

| Field | Specification |
|---|---|
| Screen ID | FIN-02 |
| Screen name | Live payment provider checkout |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `Provider-hosted page (external)` |
| Purpose | Real card / Apple Pay payment on the provider's hosted page (founder prefers Stripe Connect, Mamo fallback). Not connected; needs founder approval, accounts and credentials. |
| Information displayed | Provider UI; our return page is BUY-18. |
| UI components | External; we design only the hand-off and return states |
| Primary call to action | Pay (on provider) |
| Secondary calls to action | Back to marketplace |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | As FIN-01 |
| Interactions | — |
| Validation | — |
| Related screens | BUY-18 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Blocked · P0 |
| API endpoints | Provider adapter (not built) |
| Database entities | payments |
| Source files | — |
| Dependencies / decisions | Phase 8 approval; provider onboarding |

Input fields:

  - None

#### FIN-03 · Bank transfer instructions

| Field | Specification |
|---|---|
| Screen ID | FIN-03 |
| Screen name | Bank transfer instructions |
| User roles | Buyer OWNER, PROCUREMENT |
| Route / URL | `/{locale}/app/buyer/[workspaceId]/checkouts/[checkoutId] (proposed state)` |
| Purpose | Founder listed bank transfer as a method. Needs provider support, reference handling and reconciliation; nothing exists. |
| Information displayed | Beneficiary, IBAN, unique reference, amount, deadline, reconciliation notice. |
| UI components | Instructions card, copy buttons, deadline |
| Primary call to action | Copy reference |
| Secondary calls to action | Download instructions |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | As FIN-01 |
| Interactions | — |
| Validation | — |
| Related screens | BUY-18 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Blocked · P1 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Provider choice; reconciliation UI (ADM-31) |

Input fields:

  - None

### Seller workspace

#### SEL-01 · Seller overview (dashboard)

| Field | Specification |
|---|---|
| Screen ID | SEL-01 |
| Screen name | Seller overview (dashboard) |
| User roles | Seller OWNER, SALES, WAREHOUSE, FINANCE, VIEWER |
| Route / URL | `/{locale}/app/seller/[workspaceId]` |
| Purpose | Seller home: listing eligibility, storefront status and real catalogue/inventory counts. |
| Information displayed | Eligibility alert ("Your company can list products." / "Listing is paused: {reason}"); storefront status (Live / Not live / Hidden by the marketplace team); KPI tiles (Public, Pending review, Drafts, Rejected/changes requested, Suspended, Low stock, Out of stock) each linking to a filtered list; recent moderation decisions. No orders, RFQ or finance figures yet. |
| UI components | Page header with "Add product", alert, storefront status card, KPI tile list, decisions list with status badges, skeleton (8 lines), empty ("No decisions yet.") |
| Primary call to action | Add product |
| Secondary calls to action | Open storefront; open KPI lists |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | Seller sub-nav (Overview, Storefront, Products, Add product, Inventory, Pricing, Quotation requests, Quotes, Orders, Disputes, Finance, Support, Messages, Company settings) |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| Interactions | Tiles are links with counts from GET overview. |
| Validation | — |
| Related screens | SEL-02, SEL-06, SEL-15, SEL-34 |
| Mobile layout | Tiles 2-up; sub-nav scrolls horizontally (gap G-20). |
| Desktop layout | KPI row; two-column cards. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /seller/workspaces/{ws}/overview |
| Database entities | products, product_versions, inventory, storefronts |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/page.tsx |
| Dependencies / decisions | Section 8 metrics |

Input fields:

  - None

#### SEL-02 · Storefront editor

| Field | Specification |
|---|---|
| Screen ID | SEL-02 |
| Screen name | Storefront editor |
| User roles | Seller OWNER, SALES (edit); others read |
| Route / URL | `/{locale}/app/seller/[workspaceId]/storefront` |
| Purpose | Build the public manufacturer profile. |
| Information displayed | "Your storefront is public once published and your company is verified with a valid licence."; status; admin-hidden reason; profile fields. |
| UI components | Form sections (About, Capabilities, Services, Fulfilment, Certifications), bilingual paired inputs, checkboxes, certification repeater, status card |
| Primary call to action | Save |
| Secondary calls to action | Publish; Take offline; Preview public page |
| Required fields | — |
| Optional fields | Business type, Description (EN), Description (AR), Year established, City, Specialisation EN/AR, Capabilities EN/AR, Production capacity, Custom manufacturing / Private label / White label / Samples available, Fulfilment EN/AR, Certifications |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | expected_version concurrency; contact details/documents never public. |
| Validation | Lengths; year range |
| Related screens | SEL-03, SEL-04, SEL-05, PUB-10 |
| Mobile layout | Single column, sections as accordions, sticky Save. |
| Desktop layout | Form with section anchors left. |
| Implementation status | Implemented · P0 |
| API endpoints | GET/PATCH /seller/workspaces/{ws}/storefront |
| Database entities | storefronts |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/storefront/page.tsx |
| Dependencies / decisions | A07 |

Input fields:

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

| Field | Specification |
|---|---|
| Screen ID | SEL-03 |
| Screen name | Storefront media manager |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-02` |
| Purpose | Upload logo, cover, factory, warehouse and other images. |
| Information displayed | Images by kind with caption EN/AR and order. |
| UI components | Image uploader, media grid, caption inputs, reorder, delete |
| Primary call to action | Upload image |
| Secondary calls to action | Edit caption; reorder; remove |
| Required fields | Kind, Image |
| Optional fields | Caption EN/AR |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | — |
| Validation | Type, size, dimensions; malware scan |
| Related screens | SEL-02 |
| Mobile layout | 2-up grid. |
| Desktop layout | 4-up grid. |
| Implementation status | Implemented · P1 |
| API endpoints | Storefront media endpoints under /seller/workspaces/{ws}/storefront |
| Database entities | storefront_media, files |
| Source files | storefront/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Kind (select, Required): LOGO, COVER, FACTORY, WAREHOUSE, OTHER
  - Image (file, Required): PNG/JPEG/WebP ≥200px ≤10 MB
  - Caption EN/AR (text, Optional): ≤150

#### SEL-04 · Delivery terms

| Field | Specification |
|---|---|
| Screen ID | SEL-04 |
| Screen name | Delivery terms |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-02` |
| Purpose | Set where and for how much the seller delivers catalogue orders (provisional P4-1). |
| Information displayed | "Buyers can order from your catalogue only to the emirates you serve. One flat fee is charged per order." |
| UI components | Money input, number input, emirate checkbox group |
| Primary call to action | Save delivery terms |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | Delivery fee per order (AED), Typical delivery time (days), Emirates you deliver to |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | Without terms, checkout shows "This supplier has not set delivery terms yet." |
| Validation | — |
| Related screens | BUY-17 |
| Mobile layout | Stacked. |
| Desktop layout | Inline card. |
| Implementation status | Implemented · P0 |
| API endpoints | PATCH /seller/workspaces/{ws}/storefront |
| Database entities | storefronts |
| Source files | storefront/page.tsx |
| Dependencies / decisions | Founder: supplier-arranged, courier, collection, per-order charges (conflict with flat fee) |

Input fields:

  - Delivery fee per order (AED) (money, Optional): fils
  - Typical delivery time (days) (integer, Optional): 0–90
  - Emirates you deliver to (checkboxes, Optional): ≤7

#### SEL-05 · Publish or take storefront offline dialog

| Field | Specification |
|---|---|
| Screen ID | SEL-05 |
| Screen name | Publish or take storefront offline dialog |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-02` |
| Purpose | Make the storefront public or remove it. |
| Information displayed | Required-field checklist on publish; consequence text on take offline. |
| UI components | Confirm dialog |
| Primary call to action | Publish / Take offline |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. Publish requires eligibility (approved company, valid licence). |
| Interactions | — |
| Validation | Required fields present |
| Related screens | SEL-02 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /seller/workspaces/{ws}/storefront/publish \| /unpublish |
| Database entities | storefronts |
| Source files | storefront/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-06 · Product list

| Field | Specification |
|---|---|
| Screen ID | SEL-06 |
| Screen name | Product list |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/products` |
| Purpose | Manage every listing by lifecycle tab. |
| Information displayed | Tabs (published, pending, draft, rejected/changes requested, suspended, unpublished, archived); title, SKU count, status badge, version state, updated. |
| UI components | Tabs, table/cards, status badge, pagination, empty state |
| Primary call to action | Add product |
| Secondary calls to action | Open product; switch tab; load more |
| Required fields | — |
| Optional fields | — |
| Filters | Tab (lifecycle) |
| Sorting | Recently updated |
| Search | None today (recommended) |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| Interactions | — |
| Validation | — |
| Related screens | SEL-07, SEL-08 |
| Mobile layout | Cards; tabs scroll. |
| Desktop layout | Table. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /seller/workspaces/{ws}/products?tab= |
| Database entities | products, product_versions |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/products/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-07 · Add product

| Field | Specification |
|---|---|
| Screen ID | SEL-07 |
| Screen name | Add product |
| User roles | Seller OWNER, SALES |
| Route / URL | `/{locale}/app/seller/[workspaceId]/products/new` |
| Purpose | Create a draft product with its first variant. |
| Information displayed | Minimal creation form; listing continues in the editor. |
| UI components | Form: text, select, radio |
| Primary call to action | Create draft |
| Secondary calls to action | Cancel |
| Required fields | Title (EN), Category, Fulfilment mode, SKU code, Unit |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | — |
| Validation | Server zod; seller eligibility |
| Related screens | SEL-08 |
| Mobile layout | Single column. |
| Desktop layout | Narrow form. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /seller/workspaces/{ws}/products |
| Database entities | products, product_versions, skus |
| Source files | products/new/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Title (EN) (text, Required): 3–150
  - Category (select, Required): leaf, not BLOCKED
  - Fulfilment mode (radio, Required): READY_STOCK, MADE_TO_ORDER
  - SKU code (text, Required): SKU regex
  - Unit (select, Required): 8 units (default PIECE)

#### SEL-08 · Product editor (content)

| Field | Specification |
|---|---|
| Screen ID | SEL-08 |
| Screen name | Product editor (content) |
| User roles | Seller OWNER, SALES (edit); others read |
| Route / URL | `/{locale}/app/seller/[workspaceId]/products/[productId]` |
| Purpose | Edit listing content; edits to a live listing create a new draft version that goes through review. |
| Information displayed | Status, working vs published version, reason from the marketplace team, content fields, category attributes, specifications, certifications "(declared by supplier)". |
| UI components | Tabs or sections (Content, Media, Variants, Pricing, History), bilingual inputs, attribute fields, repeaters, status banner |
| Primary call to action | Save |
| Secondary calls to action | Submit for review; Withdraw submission; Unpublish; Archive; Duplicate; View public page |
| Required fields | Title EN, Category, Mode |
| Optional fields | Title AR, Description EN, Description AR, Category attributes, Specifications, Materials, Dimensions, Country of origin, Lead time min/max (days), Dispatch days, Custom manufacturing / Private label / White label / Samples, Samples note, Certifications, Video URL |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | expected_version; locked fields while pending. |
| Validation | Restricted-term screening on submit |
| Related screens | SEL-09, SEL-10, SEL-11, SEL-12, SEL-13, SEL-14 |
| Mobile layout | Section tabs become a select; sticky Save. |
| Desktop layout | Left section nav, form right. |
| Implementation status | Implemented · P0 |
| API endpoints | GET/PATCH /seller/workspaces/{ws}/products/{id} |
| Database entities | products, product_versions, category_attributes |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/products/[productId]/page.tsx |
| Dependencies / decisions | A10, A11 |

Input fields:

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

| Field | Specification |
|---|---|
| Screen ID | SEL-09 |
| Screen name | Product media manager |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-08` |
| Purpose | Upload and order product images. |
| Information displayed | Up to 12 images with order and primary. |
| UI components | Uploader, sortable grid, scan state |
| Primary call to action | Upload image |
| Secondary calls to action | Reorder; remove; set primary |
| Required fields | Image |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | — |
| Validation | Type/size/dimensions; scan |
| Related screens | SEL-08 |
| Mobile layout | 2-up grid. |
| Desktop layout | 4–6-up grid. |
| Implementation status | Implemented · P0 |
| API endpoints | Product media endpoints |
| Database entities | product_media, files |
| Source files | products/[productId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Image (file, Required): PNG/JPEG/WebP ≥200px ≤10 MB, ≤12

#### SEL-10 · Variants (SKU) manager

| Field | Specification |
|---|---|
| Screen ID | SEL-10 |
| Screen name | Variants (SKU) manager |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-08` |
| Purpose | Add and edit variants. |
| Information displayed | SKU code, variant attributes, unit, active, approval state. |
| UI components | Table, inline form, toggle |
| Primary call to action | Add variant |
| Secondary calls to action | Edit; deactivate; delete (never-approved only) |
| Required fields | SKU code, Unit |
| Optional fields | Variant attributes, Active |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | Identity locked once approved. |
| Validation | — |
| Related screens | SEL-08, SEL-15 |
| Mobile layout | Cards. |
| Desktop layout | Table. |
| Implementation status | Implemented · P0 |
| API endpoints | POST/PATCH/DELETE /seller/workspaces/{ws}/products/{id}/skus(/{skuId}) |
| Database entities | skus |
| Source files | products/[productId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - SKU code (text, Required): regex, unique
  - Variant attributes (key-value, Optional)
  - Unit (select, Required)
  - Active (toggle, Optional)

#### SEL-11 · Product pricing editor

| Field | Specification |
|---|---|
| Screen ID | SEL-11 |
| Screen name | Product pricing editor |
| User roles | Seller OWNER, SALES |
| Route / URL | `Section of SEL-08` |
| Purpose | Set live pricing without review (audited). |
| Information displayed | "Prices, MOQ and increments change immediately without review… Amounts are AED excluding VAT." |
| UI components | Radio (price type), tier table editor, number inputs |
| Primary call to action | Save pricing |
| Secondary calls to action | Add tier; remove tier |
| Required fields | Price type, MOQ, Order increment |
| Optional fields | Tiers |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | — |
| Validation | Tier rules |
| Related screens | SEL-19 |
| Mobile layout | Tier rows stacked. |
| Desktop layout | Tier table. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /seller/workspaces/{ws}/products/{id}/pricing |
| Database entities | price_tiers, skus |
| Source files | products/[productId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Price type (radio, Required): FIXED, TIERED, QUOTE_ONLY
  - MOQ (integer, Required): ≥1
  - Order increment (integer, Required): ≥1
  - Tiers (table, Optional): FIXED 1; TIERED 2–10; first = MOQ; ascending qty; non-increasing price

#### SEL-12 · Submit for review dialog

| Field | Specification |
|---|---|
| Screen ID | SEL-12 |
| Screen name | Submit for review dialog |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-08` |
| Purpose | Send the draft to moderation. |
| Information displayed | What review checks; restricted-term warnings. |
| UI components | Confirm dialog |
| Primary call to action | Submit for review |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | — |
| Validation | Completeness; restricted terms |
| Related screens | SEL-08, ADM-12 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /seller/workspaces/{ws}/products/{id}/submit |
| Database entities | product_versions |
| Source files | products/[productId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-13 · Listing lifecycle dialogs

| Field | Specification |
|---|---|
| Screen ID | SEL-13 |
| Screen name | Listing lifecycle dialogs |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialogs on SEL-08` |
| Purpose | Withdraw submission, unpublish, republish, archive, restore or duplicate. One component, six variations. |
| Information displayed | Consequence text per action. |
| UI components | Confirm dialog (6 variants) |
| Primary call to action | Confirm action |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | Duplicate creates a new draft with zero stock. |
| Validation | — |
| Related screens | SEL-08 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /seller/workspaces/{ws}/products/{id}/withdraw\|unpublish\|republish\|archive\|restore\|duplicate |
| Database entities | products, product_versions |
| Source files | products/[productId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-14 · Moderation history

| Field | Specification |
|---|---|
| Screen ID | SEL-14 |
| Screen name | Moderation history |
| User roles | Seller workspace members |
| Route / URL | `Section of SEL-08` |
| Purpose | See every review decision and reason. |
| Information displayed | Version, state (Draft, Pending review, Approved, Rejected, Changes requested, Superseded, Withdrawn), decided at, reason. |
| UI components | Timeline list, status badge |
| Primary call to action | — |
| Secondary calls to action | Open version |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| Interactions | — |
| Validation | — |
| Related screens | SEL-08 |
| Mobile layout | List. |
| Desktop layout | List. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /seller/workspaces/{ws}/products/{id} |
| Database entities | product_versions, moderation_decisions |
| Source files | products/[productId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-15 · Inventory

| Field | Specification |
|---|---|
| Screen ID | SEL-15 |
| Screen name | Inventory |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/inventory` |
| Purpose | See stock per variant and act on it. |
| Information displayed | Product, SKU, on hand, reserved, unavailable, available, low-stock threshold, restock date, flags (Low, Out). |
| UI components | Filter chips, table, badges, empty state ("No variants yet.") |
| Primary call to action | Adjust stock |
| Secondary calls to action | Set threshold; view movements |
| Required fields | — |
| Optional fields | — |
| Filters | All, Low stock, Out of stock |
| Sorting | Product |
| Search | None today |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). Adjust: seller.inventory.ship. |
| Interactions | — |
| Validation | — |
| Related screens | SEL-16, SEL-17, SEL-18 |
| Mobile layout | Cards with available figure prominent. |
| Desktop layout | Table. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /seller/workspaces/{ws}/inventory |
| Database entities | inventory, skus |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/inventory/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-16 · Stock adjustment dialog

| Field | Specification |
|---|---|
| Screen ID | SEL-16 |
| Screen name | Stock adjustment dialog |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Dialog on SEL-15` |
| Purpose | Atomically change stock with a reason. |
| Information displayed | Current figures; resulting available. |
| UI components | Dialog, select, number, textarea |
| Primary call to action | Save adjustment |
| Secondary calls to action | Cancel |
| Required fields | Movement, Quantity, Note |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated. |
| Interactions | — |
| Validation | Never negative |
| Related screens | SEL-15 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /seller/workspaces/{ws}/inventory/{skuId}/adjust |
| Database entities | inventory, stock_movements |
| Source files | inventory/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Movement (select, Required): RECEIVE, REMOVE, MARK_UNAVAILABLE, RELEASE_UNAVAILABLE, SET_ON_HAND
  - Quantity (integer, Required): >0 (never negative result)
  - Note (text, Required): reason

#### SEL-17 · Low-stock threshold and restock date

| Field | Specification |
|---|---|
| Screen ID | SEL-17 |
| Screen name | Low-stock threshold and restock date |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Inline form on SEL-15` |
| Purpose | Configure alerts and the expected restock date. |
| Information displayed | Threshold, restock date. |
| UI components | Number input, date input |
| Primary call to action | Save |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Low-stock threshold, Restock date |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated. |
| Interactions | — |
| Validation | — |
| Related screens | SEL-15 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P2 |
| API endpoints | PATCH /seller/workspaces/{ws}/inventory/{skuId} |
| Database entities | inventory |
| Source files | inventory/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Low-stock threshold (integer, Optional): ≥0
  - Restock date (date, Optional)

#### SEL-18 · Stock movement history

| Field | Specification |
|---|---|
| Screen ID | SEL-18 |
| Screen name | Stock movement history |
| User roles | Seller workspace members |
| Route / URL | `Drawer on SEL-15` |
| Purpose | Append-only audit of stock changes. |
| Information displayed | When, kind (8 movement kinds incl. RESERVE, SALE), quantity, actor, note. |
| UI components | Drawer, table |
| Primary call to action | — |
| Secondary calls to action | Load more |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | Newest |
| Search | — |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| Interactions | — |
| Validation | — |
| Related screens | SEL-15 |
| Mobile layout | Full-screen sheet. |
| Desktop layout | Right drawer. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /seller/workspaces/{ws}/inventory/{skuId}/movements |
| Database entities | stock_movements |
| Source files | inventory/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-19 · Pricing overview

| Field | Specification |
|---|---|
| Screen ID | SEL-19 |
| Screen name | Pricing overview |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/pricing` |
| Purpose | See prices across products; edit inside each product. |
| Information displayed | "Open a product to change its price type, tiers, MOQ and increments."; product, price type, MOQ, increment, tier range. |
| UI components | Table, links |
| Primary call to action | Open product pricing |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| Interactions | — |
| Validation | — |
| Related screens | SEL-11 |
| Mobile layout | Cards. |
| Desktop layout | Table. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /seller/workspaces/{ws}/products |
| Database entities | price_tiers |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/pricing/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-20 · Quotation requests inbox

| Field | Specification |
|---|---|
| Screen ID | SEL-20 |
| Screen name | Quotation requests inbox |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/rfqs` |
| Purpose | Find requests to quote on: invitations and open requests in categories where the seller has public listings. |
| Information displayed | "Requests you were invited to and open requests in categories where you have public listings."; reference, title, buyer (company shown), category, quantity, deadline, Invited badge, "Your quote" state or "Not quoted". |
| UI components | Scope tabs (All, Invited, Matching, Quoted), search, table/cards, empty state ("No requests here yet.") |
| Primary call to action | Open request |
| Secondary calls to action | Search; switch scope |
| Required fields | — |
| Optional fields | — |
| Filters | Scope |
| Sorting | Deadline / newest |
| Search | Title or reference |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). Never sees other sellers' quotes. |
| Interactions | — |
| Validation | — |
| Related screens | SEL-21 |
| Mobile layout | Cards with deadline countdown. |
| Desktop layout | Table. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /seller/workspaces/{ws}/rfqs |
| Database entities | rfqs, rfq_invitations, quotes |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/rfqs/page.tsx |
| Dependencies / decisions | A12 |

Input fields:

  - None

#### SEL-21 · Request detail (seller)

| Field | Specification |
|---|---|
| Screen ID | SEL-21 |
| Screen name | Request detail (seller) |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/rfqs/[rfqId]` |
| Purpose | Read the buyer's request and manage the seller's own quote. |
| Information displayed | Request summary, specifications, attachments, deadline, own quote panel by state (none, draft, submitted, revision requested, accepted, declined, withdrawn, expired). |
| UI components | Description list, attachments, quote panel, alerts |
| Primary call to action | Prepare quote / Submit / Revise |
| Secondary calls to action | Ask the buyer a question; Withdraw; download attachment |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). Quote actions: seller.catalog.edit. 404 when not visible. |
| Interactions | — |
| Validation | — |
| Related screens | SEL-22, SEL-23, SEL-24, SEL-25 |
| Mobile layout | Stacked. |
| Desktop layout | Request left, quote right. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /seller/workspaces/{ws}/rfqs/{id} |
| Database entities | rfqs, quotes, quote_versions |
| Source files | rfqs/[rfqId]/page.tsx (seller) |
| Dependencies / decisions | Stale copy seller.quote.accepted_body (G-27) |

Input fields:

  - None

#### SEL-22 · Quote form

| Field | Specification |
|---|---|
| Screen ID | SEL-22 |
| Screen name | Quote form |
| User roles | Seller OWNER, SALES |
| Route / URL | `Form on SEL-21` |
| Purpose | Prepare or revise a quote; server computes totals. |
| Information displayed | "Prepare a draft. The buyer sees it only after you submit."; live preview "Subtotal plus shipping: AED {amount} before tax."; "Tax is calculated by the platform on subtotal plus shipping." |
| UI components | Form, money inputs, number, date-time (Dubai), textarea, tax select, file uploader, preview line |
| Primary call to action | Save draft |
| Secondary calls to action | Submit quote; Submit revision; Add attachment |
| Required fields | Quantity, Unit price (AED, before tax), Tax treatment, Lead time (days), Valid until (Dubai time), What is offered |
| Optional fields | Shipping (AED, before tax), Delivery date, Differences from the request, Terms, Attachments |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | Submitted versions immutable; revision supersedes. |
| Validation | Server zod |
| Related screens | SEL-21, SEL-23 |
| Mobile layout | Single column; preview sticky. |
| Desktop layout | Form with preview card. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /seller/workspaces/{ws}/rfqs/{id}/quote; PATCH /seller/workspaces/{ws}/quotes/{id}; POST /files |
| Database entities | quotes, quote_versions, quote_files |
| Source files | rfqs/[rfqId]/page.tsx (seller) |
| Dependencies / decisions | Quote validity default (founder 7 days); tax treatment |

Input fields:

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

| Field | Specification |
|---|---|
| Screen ID | SEL-23 |
| Screen name | Submit quote dialog |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-21` |
| Purpose | Confirm submission. |
| Information displayed | "The buyer will see these figures. A submitted version cannot be changed; you can submit a revision while the request is open." |
| UI components | Confirm dialog |
| Primary call to action | Submit quote |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | — |
| Validation | — |
| Related screens | SEL-22 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /seller/workspaces/{ws}/quotes/{id}/submit \| /revise |
| Database entities | quote_versions |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-24 · Withdraw quote dialog

| Field | Specification |
|---|---|
| Screen ID | SEL-24 |
| Screen name | Withdraw quote dialog |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-21` |
| Purpose | Withdraw before acceptance. |
| Information displayed | "The buyer will be told. You cannot quote on this request again." |
| UI components | Destructive confirm |
| Primary call to action | Withdraw |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace. |
| Interactions | — |
| Validation | — |
| Related screens | SEL-21 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /seller/workspaces/{ws}/quotes/{id}/withdraw |
| Database entities | quotes |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-25 · Ask the buyer a question

| Field | Specification |
|---|---|
| Screen ID | SEL-25 |
| Screen name | Ask the buyer a question |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-21` |
| Purpose | Start an RFQ-linked conversation. |
| Information displayed | "Only the buyer sees this conversation." |
| UI components | Dialog with textarea |
| Primary call to action | Send |
| Secondary calls to action | Cancel |
| Required fields | Message |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Messaging roles (OWNER, SALES) |
| Interactions | — |
| Validation | — |
| Related screens | MSG-02 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /workspaces/{ws}/conversations |
| Database entities | conversations, messages |
| Source files | rfqs/[rfqId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Message (textarea, Required): ≤4000

#### SEL-26 · Quotes list (seller)

| Field | Specification |
|---|---|
| Screen ID | SEL-26 |
| Screen name | Quotes list (seller) |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/quotes` |
| Purpose | All own quotes and their states. |
| Information displayed | Request, buyer, version, total, valid until, state. |
| UI components | Table, filter, badges, empty state ("You have not quoted yet.") |
| Primary call to action | Open request |
| Secondary calls to action | Filter |
| Required fields | — |
| Optional fields | — |
| Filters | State |
| Sorting | Newest |
| Search | — |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| Interactions | — |
| Validation | — |
| Related screens | SEL-21 |
| Mobile layout | Cards. |
| Desktop layout | Table. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /seller/workspaces/{ws}/quotes |
| Database entities | quotes |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/quotes/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-27 · Orders list (seller)

| Field | Specification |
|---|---|
| Screen ID | SEL-27 |
| Screen name | Orders list (seller) |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/orders` |
| Purpose | All orders received. |
| Information displayed | "Orders appear when a buyer checks out or accepts your quotation."; number, buyer, source, created, total, state. |
| UI components | Filter, table, badges, empty state ("No orders yet.") |
| Primary call to action | Open order |
| Secondary calls to action | Filter; load more |
| Required fields | — |
| Optional fields | — |
| Filters | State |
| Sorting | Newest |
| Search | — |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). |
| Interactions | — |
| Validation | — |
| Related screens | SEL-28 |
| Mobile layout | Cards. |
| Desktop layout | Table. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /seller/workspaces/{ws}/orders |
| Database entities | orders |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/orders/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SEL-28 · Order detail (seller)

| Field | Specification |
|---|---|
| Screen ID | SEL-28 |
| Screen name | Order detail (seller) |
| User roles | Seller workspace members |
| Route / URL | `/{locale}/app/seller/[workspaceId]/orders/[orderId]` |
| Purpose | Fulfil the order and see what will be paid out. |
| Information displayed | State, next step ("Do not dispatch until the order is confirmed." etc.), lines, totals, platform commission, payable to supplier, settlement state, delivery address, fulfilment panel, "All ordered quantities ship together in one shipment.", payout note, disputes, timeline. |
| UI components | Status header, alert, lines table, totals with commission rows, fulfilment panel, settlement badge, timeline, action bar |
| Primary call to action | Start processing / Record dispatch / Report delivery (by state) |
| Secondary calls to action | Download proof; open dispute; message buyer |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Any member of the seller workspace (seller.catalog.read / seller.orders.read). Actions: seller.inventory.ship. |
| Interactions | — |
| Validation | — |
| Related screens | SEL-29, SEL-30, SEL-31, SHR-02 |
| Mobile layout | Status + next step first; sticky action. |
| Desktop layout | Main + right summary. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /seller/workspaces/{ws}/orders/{id}; POST /process |
| Database entities | orders, order_lines, shipments, settlements |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/orders/[orderId]/page.tsx |
| Dependencies / decisions | Commission 10% (founder) not yet configured per order |

Input fields:

  - None

#### SEL-29 · Record dispatch dialog

| Field | Specification |
|---|---|
| Screen ID | SEL-29 |
| Screen name | Record dispatch dialog |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Dialog on SEL-28` |
| Purpose | Record full shipment. |
| Information displayed | Order lines summary. |
| UI components | Dialog form |
| Primary call to action | Record dispatch |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Carrier, Tracking reference, Expected delivery |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated. Paid orders only. |
| Interactions | — |
| Validation | — |
| Related screens | SEL-28 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /seller/workspaces/{ws}/orders/{id}/dispatch |
| Database entities | shipments, orders |
| Source files | orders/[orderId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Carrier (text, Optional)
  - Tracking reference (text, Optional)
  - Expected delivery (date, Optional)

#### SEL-30 · Report delivery dialog

| Field | Specification |
|---|---|
| Screen ID | SEL-30 |
| Screen name | Report delivery dialog |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Dialog on SEL-28` |
| Purpose | Report delivery with optional proof. |
| Information displayed | Proof rules. |
| UI components | Dialog with textarea and file |
| Primary call to action | Report delivery |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Delivery note, Proof of delivery (PDF, PNG or JPEG) |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated. |
| Interactions | — |
| Validation | — |
| Related screens | SEL-28 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /seller/workspaces/{ws}/orders/{id}/deliver |
| Database entities | shipments, files |
| Source files | orders/[orderId]/page.tsx |
| Dependencies / decisions | Founder: proof of delivery (verified delivery starts dispute window) |

Input fields:

  - Delivery note (textarea, Optional)
  - Proof of delivery (PDF, PNG or JPEG) (file, Optional): ≤10 MB, scanned

#### SEL-31 · Open dispute (seller)

| Field | Specification |
|---|---|
| Screen ID | SEL-31 |
| Screen name | Open dispute (seller) |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Dialog on SEL-28` |
| Purpose | Seller can open a dispute on an order. |
| Information displayed | Type and reason. |
| UI components | Dialog |
| Primary call to action | Open a dispute |
| Secondary calls to action | Cancel |
| Required fields | Problem, What happened? |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated. |
| Interactions | — |
| Validation | — |
| Related screens | SHR-02 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Implemented · P2 |
| API endpoints | POST /seller/workspaces/{ws}/orders/{id}/disputes |
| Database entities | disputes |
| Source files | orders/[orderId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Problem (select, Required): 6 types
  - What happened? (textarea, Required): ≤2000

#### SEL-32 · Seller finance

| Field | Specification |
|---|---|
| Screen ID | SEL-32 |
| Screen name | Seller finance |
| User roles | Seller OWNER, FINANCE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/finance` |
| Purpose | See paid order value, commission, refunds, net payable and settlement buckets; payouts list. Sandbox only. |
| Information displayed | Paid order value, platform commission, refunded to buyers, net payable; Not yet eligible (awaiting receipt), Eligible for payout, Held by disputes, In payout, Paid out; payouts table; sandbox notice. |
| UI components | KPI tiles, settlement bucket list, payouts table, sandbox banner, empty state ("No payouts yet.") |
| Primary call to action | — |
| Secondary calls to action | Open payout / order |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | seller.finance (OWNER, FINANCE). |
| Interactions | — |
| Validation | — |
| Related screens | SEL-28, SEL-33, SEL-34 |
| Mobile layout | Tiles 2-up. |
| Desktop layout | Tiles row + table. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /seller/workspaces/{ws}/finance |
| Database entities | settlements, payouts, ledger_entries |
| Source files | apps/web/src/app/[locale]/app/seller/[workspaceId]/finance/page.tsx |
| Dependencies / decisions | Commission setting; weekly payouts |

Input fields:

  - None

#### SEL-33 · Payout account onboarding

| Field | Specification |
|---|---|
| Screen ID | SEL-33 |
| Screen name | Payout account onboarding |
| User roles | Seller OWNER, FINANCE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/finance/payout-account (proposed)` |
| Purpose | Connect the seller's payout account with the provider (Stripe Connect preferred). Requires provider approval, KYC flows and live credentials. |
| Information displayed | Status (not started, pending, verified, restricted), requirements, provider link. |
| UI components | Status card, checklist, external link button |
| Primary call to action | Set up payouts |
| Secondary calls to action | Update details |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | seller.finance |
| Interactions | — |
| Validation | — |
| Related screens | SEL-32 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Blocked · P0 |
| API endpoints | Provider onboarding (not built) |
| Database entities | New payout_accounts |
| Source files | — |
| Dependencies / decisions | D05 provider; Phase 8 |

Input fields:

  - None

#### SEL-34 · Statements and commission invoices

| Field | Specification |
|---|---|
| Screen ID | SEL-34 |
| Screen name | Statements and commission invoices |
| User roles | Seller OWNER, FINANCE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/finance/statements (proposed)` |
| Purpose | Weekly payout statements and platform commission invoices (founder: platform invoices suppliers for commission). Needs tax approval. |
| Information displayed | Period, gross, commission, VAT on commission, refunds, net, payout reference. |
| UI components | Table, download |
| Primary call to action | Download statement |
| Secondary calls to action | Filter period |
| Required fields | — |
| Optional fields | — |
| Filters | Period |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | seller.finance |
| Interactions | — |
| Validation | — |
| Related screens | SEL-32 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Blocked · P1 |
| API endpoints | — |
| Database entities | New statements, invoices |
| Source files | — |
| Dependencies / decisions | Tax approval; D06 |

Input fields:

  - None

#### SEL-35 · Seller analytics

| Field | Specification |
|---|---|
| Screen ID | SEL-35 |
| Screen name | Seller analytics |
| User roles | Seller OWNER, SALES, FINANCE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/analytics (proposed)` |
| Purpose | Views, RFQ win rate, conversion, top products. Product view counts are not stored today; RFQ/quote/order metrics can be computed from existing tables. |
| Information displayed | Period selector, charts, tables. |
| UI components | KPI tiles, line chart, bar chart, table |
| Primary call to action | — |
| Secondary calls to action | Change period; export |
| Required fields | — |
| Optional fields | — |
| Filters | Period |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | OWNER, SALES, FINANCE |
| Interactions | — |
| Validation | — |
| Related screens | SEL-01 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Planned · P2 |
| API endpoints | — |
| Database entities | New product_view_events; rfqs, quotes, orders |
| Source files | — |
| Dependencies / decisions | Analytics decision |

Input fields:

  - None

#### SEL-36 · Supplier order cancellation

| Field | Specification |
|---|---|
| Screen ID | SEL-36 |
| Screen name | Supplier order cancellation |
| User roles | Seller OWNER, SALES |
| Route / URL | `Dialog on SEL-28 (proposed)` |
| Purpose | Cancel a paid order the supplier cannot fulfil (triggers a full refund through finance). Not implemented. |
| Information displayed | Reason, refund consequence. |
| UI components | Destructive dialog |
| Primary call to action | Cancel order |
| Secondary calls to action | Keep order |
| Required fields | Reason |
| Optional fields | Details |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | seller.inventory.ship |
| Interactions | — |
| Validation | — |
| Related screens | SEL-28, BUY-31 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Planned · P1 |
| API endpoints | — |
| Database entities | orders, refunds |
| Source files | — |
| Dependencies / decisions | Cancellation policy; Gap G-08 |

Input fields:

  - Reason (select, Required)
  - Details (textarea, Optional)

#### SEL-37 · Returns handling

| Field | Specification |
|---|---|
| Screen ID | SEL-37 |
| Screen name | Returns handling |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `/{locale}/app/seller/[workspaceId]/returns (proposed)` |
| Purpose | Founder asked for a provisional returns policy; there is no returns flow (disputes cover refunds only). |
| Information displayed | Return request, items, reason, status, refund. |
| UI components | List, detail, dialogs |
| Primary call to action | Approve return |
| Secondary calls to action | Reject; record received |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Seller roles |
| Interactions | — |
| Validation | — |
| Related screens | SHR-02 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Planned · P2 |
| API endpoints | — |
| Database entities | New returns |
| Source files | — |
| Dependencies / decisions | Returns policy (legal) |

Input fields:

  - None

#### SEL-38 · Production milestones (made to order)

| Field | Specification |
|---|---|
| Screen ID | SEL-38 |
| Screen name | Production milestones (made to order) |
| User roles | Seller OWNER, SALES, WAREHOUSE |
| Route / URL | `Section of SEL-28 (proposed)` |
| Purpose | Share progress on long lead-time made-to-order orders (e.g. materials sourced, production started, QC passed). Only order state PROCESSING exists today. |
| Information displayed | Milestones with dates and notes visible to buyer. |
| UI components | Timeline editor |
| Primary call to action | Add milestone |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | seller.inventory.ship |
| Interactions | — |
| Validation | — |
| Related screens | SEL-28, BUY-24 |
| Mobile layout | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| Desktop layout | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| Implementation status | Recommended · P2 |
| API endpoints | — |
| Database entities | New order_milestones |
| Source files | — |
| Dependencies / decisions | — |

Input fields:

  - None

### Admin portal

#### ADM-01 · Admin overview and operations

| Field | Specification |
|---|---|
| Screen ID | ADM-01 |
| Screen name | Admin overview and operations |
| User roles | All admin roles (content varies by capability) |
| Route / URL | `/{locale}/admin` |
| Purpose | Live platform health: verification pipeline counts, operational queues and (finance roles only) commerce figures for a Dubai date range. |
| Information displayed | Signed-in roles, recovery codes remaining; company KPIs (Draft, Submitted, Under review, Needs info, Approved, Suspended, Licences expiring, Unverified users, Company users); queues (open/unassigned disputes, open/unassigned tickets, open reconciliation cases, quarantined webhooks 7 days, refunds/payouts awaiting approval); commerce (paid orders, gross order value, refunded, net of refunds, platform fees net, owed to sellers now, paid out to sellers) with sandbox note; generated at. |
| UI components | Admin shell, KPI tiles, queue list with links, date range form (Dubai dates), sandbox alert, "Commerce figures are shown to finance roles only." note |
| Primary call to action | Show (apply period) |
| Secondary calls to action | Open queue links |
| Required fields | — |
| Optional fields | From, To |
| Filters | Period |
| Sorting | — |
| Search | — |
| Navigation | Admin nav filtered by capability |
| Permissions | admin.companies.read for counts; commerce needs admin.finance.read. |
| Interactions | Server-computed; no hardcoded figures. |
| Validation | — |
| Related screens | ADM-02, ADM-38, ADM-42, ADM-30, ADM-32, ADM-35 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/overview; GET /admin/operations/overview |
| Database entities | companies, users, disputes, support_tickets, reconciliation_cases, refunds, payouts, ledger_entries |
| Source files | apps/web/src/app/[locale]/admin/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - From (date, Optional): Dubai date
  - To (date, Optional): Dubai date

#### ADM-02 · Verification queue

| Field | Specification |
|---|---|
| Screen ID | ADM-02 |
| Screen name | Verification queue |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/verification` |
| Purpose | Work through company verification cases. |
| Information displayed | Company, kind (Initial/Renewal), state, submitted at, assignee, licence expiry. |
| UI components | Filters, table, status badge, pagination, empty state |
| Primary call to action | Open case |
| Secondary calls to action | Filter; load more |
| Required fields | — |
| Optional fields | — |
| Filters | State, kind |
| Sorting | Oldest submitted first |
| Search | Company name |
| Navigation | — |
| Permissions | admin.verification.review |
| Interactions | — |
| Validation | — |
| Related screens | ADM-03 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/verification |
| Database entities | verification_cases, companies |
| Source files | apps/web/src/app/[locale]/admin/verification/page.tsx |
| Dependencies / decisions | D08 |

Input fields:

  - None

#### ADM-03 · Verification case detail

| Field | Specification |
|---|---|
| Screen ID | ADM-03 |
| Screen name | Verification case detail |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/verification/[caseId]` |
| Purpose | Review submitted company data and documents and decide. |
| Information displayed | Company details (legal name, display name, licence number/issuer/expiry, activity, TRN, address), documents with scan state, event history, previous decisions, assignee. |
| UI components | Description list, document list with audited download, timeline, decision panel |
| Primary call to action | Start review (assign to me) |
| Secondary calls to action | Approve; Request information; Reject; download document |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.verification.review |
| Interactions | SUBMITTED → UNDER_REVIEW on start; documents downloaded only when CLEAN. |
| Validation | — |
| Related screens | ADM-04, ADM-06, ACC-03 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/verification/{id}; POST /start-review; GET /admin/files/{id}/download |
| Database entities | verification_cases, company_documents, files, audit_events |
| Source files | apps/web/src/app/[locale]/admin/verification/[caseId]/page.tsx |
| Dependencies / decisions | D08 |

Input fields:

  - None

#### ADM-04 · Verification decision dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-04 |
| Screen name | Verification decision dialog |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-03` |
| Purpose | Record approve, needs-info or reject. |
| Information displayed | Decision radio, reason (required unless approving), consequence text. |
| UI components | Dialog, radio, textarea |
| Primary call to action | Record decision |
| Secondary calls to action | Cancel |
| Required fields | Decision |
| Optional fields | Reason |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.verification.review |
| Interactions | Email + in-app notification to company; audit event. |
| Validation | Reason rule |
| Related screens | ADM-03 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/verification/{id}/decision |
| Database entities | verification_cases, companies, workspaces, notifications |
| Source files | verification/[caseId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Decision (radio, Required): APPROVE, NEEDS_INFO, REJECT
  - Reason (textarea, Optional): required unless APPROVE

#### ADM-05 · Companies

| Field | Specification |
|---|---|
| Screen ID | ADM-05 |
| Screen name | Companies |
| User roles | COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/companies` |
| Purpose | Find any company. |
| Information displayed | Name, kinds (buyer/seller), status, licence number, licence expiry. |
| UI components | Search, status filter, table |
| Primary call to action | Open company |
| Secondary calls to action | Search; filter |
| Required fields | — |
| Optional fields | — |
| Filters | Status (7 company statuses) |
| Sorting | Name |
| Search | Company name |
| Navigation | — |
| Permissions | admin.companies.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-06 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/companies |
| Database entities | companies |
| Source files | apps/web/src/app/[locale]/admin/companies/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-06 · Company detail (admin)

| Field | Specification |
|---|---|
| Screen ID | ADM-06 |
| Screen name | Company detail (admin) |
| User roles | Admin roles with companies.read |
| Route / URL | `/{locale}/admin/companies/[companyId]` |
| Purpose | Full company record with members and verification cases. |
| Information displayed | Status, suspension kind, details, workspaces and status, members with roles, cases. |
| UI components | Description list, members table, cases list, action bar |
| Primary call to action | Suspend / Reactivate (COMPLIANCE) |
| Secondary calls to action | Open case; open user |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.companies.read; suspend/reactivate admin.companies.suspend |
| Interactions | — |
| Validation | — |
| Related screens | ADM-07, ADM-03, ADM-08 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/companies/{id} |
| Database entities | companies, workspaces, memberships, verification_cases |
| Source files | apps/web/src/app/[locale]/admin/companies/[companyId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-07 · Suspend or reactivate company dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-07 |
| Screen name | Suspend or reactivate company dialog |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-06` |
| Purpose | Restrict or restore a company. |
| Information displayed | Consequences: workspaces RESTRICTED, trading stops. |
| UI components | Destructive dialog with reason |
| Primary call to action | Suspend company / Reactivate |
| Secondary calls to action | Cancel |
| Required fields | Reason |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.companies.suspend |
| Interactions | — |
| Validation | — |
| Related screens | ADM-06 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/companies/{id}/suspend \| /reactivate |
| Database entities | companies, workspaces, audit_events |
| Source files | companies/[companyId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason (textarea, Required): required

#### ADM-08 · Users

| Field | Specification |
|---|---|
| Screen ID | ADM-08 |
| Screen name | Users |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/users` |
| Purpose | Find users and revoke sessions. |
| Information displayed | Email, account type, email verified, memberships, active sessions, created. |
| UI components | Search, filter, table, action |
| Primary call to action | Revoke sessions |
| Secondary calls to action | Search; filter |
| Required fields | — |
| Optional fields | — |
| Filters | Account type |
| Sorting | — |
| Search | Email |
| Navigation | — |
| Permissions | admin.users.read; revoke admin.users.revoke_sessions |
| Interactions | — |
| Validation | — |
| Related screens | ADM-09 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/users |
| Database entities | users, sessions, memberships |
| Source files | apps/web/src/app/[locale]/admin/users/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-09 · Revoke sessions dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-09 |
| Screen name | Revoke sessions dialog |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `Dialog on ADM-08` |
| Purpose | Sign a user out everywhere. |
| Information displayed | Reason hint. |
| UI components | Dialog with reason |
| Primary call to action | Revoke sessions |
| Secondary calls to action | Cancel |
| Required fields | Reason |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.users.revoke_sessions |
| Interactions | — |
| Validation | — |
| Related screens | ADM-08 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /admin/users/{id}/revoke-sessions |
| Database entities | sessions, audit_events |
| Source files | users/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason (textarea, Required)

#### ADM-10 · Catalogue moderation overview

| Field | Specification |
|---|---|
| Screen ID | ADM-10 |
| Screen name | Catalogue moderation overview |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog` |
| Purpose | Moderation health: pending count, oldest pending, flags. |
| Information displayed | Counts by state, oldest pending age, restricted-term flags. |
| UI components | KPI tiles, links |
| Primary call to action | Open queue |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.catalog.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-11 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/catalog/overview |
| Database entities | product_versions |
| Source files | apps/web/src/app/[locale]/admin/catalog/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-11 · Moderation queue

| Field | Specification |
|---|---|
| Screen ID | ADM-11 |
| Screen name | Moderation queue |
| User roles | COMPLIANCE (decide); SUPPORT, SUPER_ADMIN (read) |
| Route / URL | `/{locale}/admin/catalog (queue section)` |
| Purpose | Pending submissions, oldest first. |
| Information displayed | Title, seller, category, new listing or update, flags, submitted. |
| UI components | Search, state filter, table, flags badge, empty ("queue empty") |
| Primary call to action | Review |
| Secondary calls to action | Search; filter |
| Required fields | — |
| Optional fields | — |
| Filters | State |
| Sorting | Oldest pending first |
| Search | Title |
| Navigation | — |
| Permissions | admin.catalog.read; decisions admin.catalog.review |
| Interactions | — |
| Validation | — |
| Related screens | ADM-12 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/catalog/queue |
| Database entities | product_versions |
| Source files | catalog/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-12 · Listing version review (diff)

| Field | Specification |
|---|---|
| Screen ID | ADM-12 |
| Screen name | Listing version review (diff) |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/catalog/reviews/[versionId]` |
| Purpose | Compare the submitted version with the live version and decide. |
| Information displayed | Field-by-field diff, media, SKUs, restricted-term hits, seller info, history. |
| UI components | Diff view, media grid, flags list, decision panel |
| Primary call to action | Approve |
| Secondary calls to action | Request changes; Reject |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.catalog.review |
| Interactions | — |
| Validation | — |
| Related screens | ADM-13, SEL-12 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/catalog/reviews/{versionId}; GET /admin/media/{id} |
| Database entities | product_versions, product_media |
| Source files | apps/web/src/app/[locale]/admin/catalog/reviews/[versionId]/page.tsx |
| Dependencies / decisions | A10 |

Input fields:

  - None

#### ADM-13 · Review decision dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-13 |
| Screen name | Review decision dialog |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-12` |
| Purpose | Record the moderation decision. |
| Information displayed | Reason required for reject/changes. |
| UI components | Dialog |
| Primary call to action | Record decision |
| Secondary calls to action | Cancel |
| Required fields | Decision |
| Optional fields | Reason |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.catalog.review |
| Interactions | — |
| Validation | — |
| Related screens | ADM-12 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/catalog/reviews/{versionId}/decision |
| Database entities | product_versions, products, notifications |
| Source files | catalog/reviews/[versionId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Decision (radio, Required): APPROVE, CHANGES_REQUESTED, REJECT
  - Reason (textarea, Optional): required unless approve

#### ADM-14 · All listings

| Field | Specification |
|---|---|
| Screen ID | ADM-14 |
| Screen name | All listings |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/products` |
| Purpose | Search every listing. |
| Information displayed | Title, seller, status, category, updated. |
| UI components | Search, filters, table |
| Primary call to action | Open listing |
| Secondary calls to action | Filter |
| Required fields | — |
| Optional fields | — |
| Filters | Status, category |
| Sorting | — |
| Search | Title |
| Navigation | — |
| Permissions | admin.catalog.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-15 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/catalog/products |
| Database entities | products |
| Source files | apps/web/src/app/[locale]/admin/catalog/products/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-15 · Listing detail (admin)

| Field | Specification |
|---|---|
| Screen ID | ADM-15 |
| Screen name | Listing detail (admin) |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/products/[id]` |
| Purpose | Inspect a listing and enforce. |
| Information displayed | Live version, SKUs, history, status reason. |
| UI components | Detail view, history timeline, action bar |
| Primary call to action | Suspend / Restore / Remove |
| Secondary calls to action | Open seller |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.catalog.read; enforce admin.catalog.enforce |
| Interactions | — |
| Validation | — |
| Related screens | ADM-16 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/catalog/products/{id} |
| Database entities | products, product_versions |
| Source files | apps/web/src/app/[locale]/admin/catalog/products/[id]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-16 · Listing enforcement dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-16 |
| Screen name | Listing enforcement dialog |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-15` |
| Purpose | Suspend, restore or remove (irreversible for the seller). |
| Information displayed | Consequence per action. |
| UI components | Destructive dialog (3 variants) |
| Primary call to action | Confirm |
| Secondary calls to action | Cancel |
| Required fields | Reason |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.catalog.enforce |
| Interactions | — |
| Validation | — |
| Related screens | ADM-15 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /admin/catalog/products/{id}/suspend\|restore\|remove |
| Database entities | products, audit_events |
| Source files | catalog/products/[id]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason (textarea, Required)

#### ADM-17 · Storefront oversight

| Field | Specification |
|---|---|
| Screen ID | ADM-17 |
| Screen name | Storefront oversight |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/storefronts` |
| Purpose | See all storefronts and hide/restore. |
| Information displayed | Company, business type, public/not public, hidden, listing count, updated. |
| UI components | Search, filter, table, row actions |
| Primary call to action | Hide / Restore |
| Secondary calls to action | Search; filter |
| Required fields | — |
| Optional fields | — |
| Filters | Visibility |
| Sorting | — |
| Search | Company |
| Navigation | — |
| Permissions | admin.catalog.read; enforce admin.catalog.enforce |
| Interactions | — |
| Validation | — |
| Related screens | ADM-18, ADM-19 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/storefronts |
| Database entities | storefronts |
| Source files | apps/web/src/app/[locale]/admin/catalog/storefronts/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-18 · Storefront detail (admin)

| Field | Specification |
|---|---|
| Screen ID | ADM-18 |
| Screen name | Storefront detail (admin) |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/storefronts/[id] (proposed)` |
| Purpose | API exists (GET /admin/storefronts/{id}) but there is no page; admins act from the list. |
| Information displayed | Full profile, media, listings, hide history. |
| UI components | Detail view |
| Primary call to action | Hide / Restore |
| Secondary calls to action | Open company |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.catalog.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-17 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Planned · P2 |
| API endpoints | GET /admin/storefronts/{id} |
| Database entities | storefronts, storefront_media |
| Source files | — |
| Dependencies / decisions | Gap G-17 |

Input fields:

  - None

#### ADM-19 · Hide or restore storefront dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-19 |
| Screen name | Hide or restore storefront dialog |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-17` |
| Purpose | Hide a storefront with reason. |
| Information displayed | Reason shown to seller. |
| UI components | Dialog |
| Primary call to action | Hide / Restore |
| Secondary calls to action | Cancel |
| Required fields | Reason |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.catalog.enforce |
| Interactions | — |
| Validation | — |
| Related screens | ADM-17 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P1 |
| API endpoints | POST /admin/storefronts/{id}/hide\|restore |
| Database entities | storefronts |
| Source files | catalog/storefronts/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason (textarea, Required)

#### ADM-20 · Categories

| Field | Specification |
|---|---|
| Screen ID | ADM-20 |
| Screen name | Categories |
| User roles | COMPLIANCE, SUPER_ADMIN (manage); others read |
| Route / URL | `/{locale}/admin/catalog/categories` |
| Purpose | Manage the category tree. |
| Information displayed | Tree with name EN/AR, restriction (Open/Review required/Blocked), visibility, position, product counts. |
| UI components | Tree table, create form |
| Primary call to action | Create category |
| Secondary calls to action | Open category |
| Required fields | Name EN, Name AR, Restriction |
| Optional fields | Parent |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.catalog.read; manage admin.categories.manage |
| Interactions | — |
| Validation | — |
| Related screens | ADM-21 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET/POST /admin/categories |
| Database entities | categories |
| Source files | apps/web/src/app/[locale]/admin/catalog/categories/page.tsx |
| Dependencies / decisions | A09 |

Input fields:

  - Name EN (text, Required)
  - Name AR (text, Required)
  - Parent (select, Optional)
  - Restriction (select, Required): OPEN, REVIEW_REQUIRED, BLOCKED

#### ADM-21 · Category editor

| Field | Specification |
|---|---|
| Screen ID | ADM-21 |
| Screen name | Category editor |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/categories/[id]` |
| Purpose | Edit category, image and attributes. |
| Information displayed | Fields, image, supplier requirements, attributes list. |
| UI components | Form, image upload, attributes table |
| Primary call to action | Save |
| Secondary calls to action | Upload image; add attribute; hide; archive |
| Required fields | Name EN/AR |
| Optional fields | Description EN/AR, Requirements EN/AR, Restriction, Hidden / Archived, Image |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.categories.manage |
| Interactions | — |
| Validation | — |
| Related screens | ADM-22 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET/PATCH /admin/categories/{id}; POST /image; POST /attributes |
| Database entities | categories, category_attributes |
| Source files | apps/web/src/app/[locale]/admin/catalog/categories/[id]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Name EN/AR (text, Required)
  - Description EN/AR (textarea, Optional)
  - Requirements EN/AR (textarea, Optional)
  - Restriction (select, Optional): reason required to change
  - Hidden / Archived (toggle, Optional): reason required
  - Image (file, Optional)

#### ADM-22 · Category attribute editor

| Field | Specification |
|---|---|
| Screen ID | ADM-22 |
| Screen name | Category attribute editor |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `Dialog on ADM-21` |
| Purpose | Define attributes sellers fill and buyers filter by. |
| Information displayed | Key, labels, type, options, required, filterable. |
| UI components | Dialog form |
| Primary call to action | Save attribute |
| Secondary calls to action | Cancel |
| Required fields | Key, Label EN/AR, Type |
| Optional fields | Options, Required, Filterable |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.categories.manage |
| Interactions | — |
| Validation | — |
| Related screens | ADM-21 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P2 |
| API endpoints | POST /admin/categories/{id}/attributes; PATCH /admin/category-attributes/{id} |
| Database entities | category_attributes |
| Source files | catalog/categories/[id]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Key (text, Required)
  - Label EN/AR (text, Required)
  - Type (select, Required)
  - Options (list, Optional)
  - Required (checkbox, Optional)
  - Filterable (checkbox, Optional)

#### ADM-23 · Restricted and prohibited terms

| Field | Specification |
|---|---|
| Screen ID | ADM-23 |
| Screen name | Restricted and prohibited terms |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/catalog/restricted` |
| Purpose | Maintain screening terms (provisional policy A10). |
| Information displayed | Term, action (Block / Review), active. |
| UI components | Table, inline form |
| Primary call to action | Add term |
| Secondary calls to action | Edit; deactivate |
| Required fields | Term, Action |
| Optional fields | Active |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.restricted.manage |
| Interactions | — |
| Validation | — |
| Related screens | ADM-12 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P2 |
| API endpoints | GET/POST/PATCH /admin/restricted-terms |
| Database entities | restricted_terms |
| Source files | apps/web/src/app/[locale]/admin/catalog/restricted/page.tsx |
| Dependencies / decisions | A10 |

Input fields:

  - Term (text, Required)
  - Action (select, Required): BLOCK (prohibited) or REVIEW (route to moderation)
  - Active (toggle, Optional)

#### ADM-24 · Featured placements

| Field | Specification |
|---|---|
| Screen ID | ADM-24 |
| Screen name | Featured placements |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/featured` |
| Purpose | Labelled featured slots (never used for ranking). |
| Information displayed | Kind, target, position, starts, ends, scheduled/eligible state. |
| UI components | Table, add form |
| Primary call to action | Add featured |
| Secondary calls to action | Remove |
| Required fields | Kind, Target, Position |
| Optional fields | Starts, Ends, Reason |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.featured.manage |
| Interactions | — |
| Validation | — |
| Related screens | PUB-01 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P2 |
| API endpoints | GET/POST/DELETE /admin/featured |
| Database entities | featured_listings |
| Source files | apps/web/src/app/[locale]/admin/catalog/featured/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Kind (select, Required): PRODUCT, SUPPLIER
  - Target (select, Required): public targets only
  - Position (integer, Required)
  - Starts (datetime, Optional)
  - Ends (datetime, Optional)
  - Reason (text, Optional)

#### ADM-25 · RFQ oversight

| Field | Specification |
|---|---|
| Screen ID | ADM-25 |
| Screen name | RFQ oversight |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/rfqs` |
| Purpose | Metadata view of requests (no quote contents). |
| Information displayed | Reference, buyer, category, state, visibility, quote count, hidden. |
| UI components | Filters, table |
| Primary call to action | Open |
| Secondary calls to action | Filter |
| Required fields | — |
| Optional fields | — |
| Filters | State, hidden |
| Sorting | — |
| Search | Reference/title |
| Navigation | — |
| Permissions | admin.rfqs.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-26 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/rfqs |
| Database entities | rfqs |
| Source files | apps/web/src/app/[locale]/admin/rfqs/page.tsx |
| Dependencies / decisions | P3-6 |

Input fields:

  - None

#### ADM-26 · RFQ detail (admin)

| Field | Specification |
|---|---|
| Screen ID | ADM-26 |
| Screen name | RFQ detail (admin) |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/rfqs/[id]` |
| Purpose | Inspect metadata and quote states; moderate abuse. |
| Information displayed | Metadata, quote states without contents, timeline. |
| UI components | Detail, timeline, action |
| Primary call to action | Hide / Unhide (COMPLIANCE) |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.rfqs.read; moderate admin.rfqs.moderate |
| Interactions | — |
| Validation | — |
| Related screens | ADM-27 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/rfqs/{id} |
| Database entities | rfqs, quotes |
| Source files | apps/web/src/app/[locale]/admin/rfqs/[id]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-27 · Hide or unhide RFQ dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-27 |
| Screen name | Hide or unhide RFQ dialog |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-26` |
| Purpose | Hide an abusive request (sellers lose access). |
| Information displayed | Reason; buyer sees hidden notice. |
| UI components | Dialog |
| Primary call to action | Hide / Unhide |
| Secondary calls to action | Cancel |
| Required fields | Reason |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.rfqs.moderate |
| Interactions | — |
| Validation | — |
| Related screens | ADM-26 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P2 |
| API endpoints | POST /admin/rfqs/{id}/hide\|unhide |
| Database entities | rfqs, audit_events |
| Source files | rfqs/[id]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason (textarea, Required)

#### ADM-28 · Orders (admin)

| Field | Specification |
|---|---|
| Screen ID | ADM-28 |
| Screen name | Orders (admin) |
| User roles | SUPPORT, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/orders` |
| Purpose | Find any order. |
| Information displayed | Number, buyer, seller, state, payment state, total, created. |
| UI components | Filters, table |
| Primary call to action | Open order |
| Secondary calls to action | Filter |
| Required fields | — |
| Optional fields | — |
| Filters | State |
| Sorting | — |
| Search | Order number |
| Navigation | — |
| Permissions | admin.orders.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-29 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/orders |
| Database entities | orders |
| Source files | apps/web/src/app/[locale]/admin/orders/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-29 · Order detail (admin)

| Field | Specification |
|---|---|
| Screen ID | ADM-29 |
| Screen name | Order detail (admin) |
| User roles | SUPPORT, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/orders/[orderId]` |
| Purpose | Full order record for support and finance. |
| Information displayed | Parties, lines, totals, commission, payable, payments, shipment, settlement, refunds, disputes, timeline. |
| UI components | Detail sections, timeline |
| Primary call to action | Request refund (FINANCE) |
| Secondary calls to action | Open dispute; open company |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.orders.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-33, ADM-39 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/orders/{id} |
| Database entities | orders, payments, shipments, settlements, refunds |
| Source files | apps/web/src/app/[locale]/admin/orders/[orderId]/page.tsx |
| Dependencies / decisions | Refund form takes raw order ID (G-16) |

Input fields:

  - None

#### ADM-30 · Finance overview

| Field | Specification |
|---|---|
| Screen ID | ADM-30 |
| Screen name | Finance overview |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/finance` |
| Purpose | Read-only ledger balances, payment attempts and reconciliation cases (sandbox). |
| Information displayed | "Operational ledger for marketplace balances, not statutory accounting."; accounts (provider clearing, payable to suppliers, platform commission, unallocated receipts) with debits/credits; payment attempts; open reconciliation cases by kind (6 kinds). |
| UI components | Ledger table, payments table, cases table, sandbox pill |
| Primary call to action | — |
| Secondary calls to action | Load more |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.finance.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-31, ADM-32, ADM-35 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/finance/summary, /payments, /reconciliation |
| Database entities | ledger_entries, payments, reconciliation_cases |
| Source files | apps/web/src/app/[locale]/admin/finance/page.tsx |
| Dependencies / decisions | Stale note finance.reconciliation_note (G-27) |

Input fields:

  - None

#### ADM-31 · Reconciliation case resolution

| Field | Specification |
|---|---|
| Screen ID | ADM-31 |
| Screen name | Reconciliation case resolution |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/finance/reconciliation/[id] (proposed)` |
| Purpose | Resolve late captures, mismatches, unknown references, invalid signatures, failed refunds/payouts. Cases are created today but no resolution UI or API exists. |
| Information displayed | Case kind, provider reference, amounts, linked checkout/order, history, resolution options. |
| UI components | Detail, action dialog with dual control |
| Primary call to action | Resolve |
| Secondary calls to action | Refund to buyer; Allocate |
| Required fields | Resolution, Note |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.finance.read; resolution needs new capability with dual control |
| Interactions | — |
| Validation | — |
| Related screens | ADM-30 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Planned · P0 |
| API endpoints | New endpoints |
| Database entities | reconciliation_cases, ledger_entries |
| Source files | — |
| Dependencies / decisions | Gap G-12 |

Input fields:

  - Resolution (select, Required)
  - Note (textarea, Required)

#### ADM-32 · Refunds

| Field | Specification |
|---|---|
| Screen ID | ADM-32 |
| Screen name | Refunds |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/refunds` |
| Purpose | Request, approve and track refunds (dual control). |
| Information displayed | "Refunds go through the payment provider. A second finance user approves each request…"; number, order, amount, commission share, state (Awaiting approval, Approved, Rejected, Sent to provider, Refunded, Failed), requested by, decided by. |
| UI components | Request form, table, row actions, self-approval note, sandbox completion tool |
| Primary call to action | Request a refund (FINANCE) |
| Secondary calls to action | Approve; Reject (FINANCE_APPROVER); simulate provider (sandbox) |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.finance.read; request admin.refunds.request; approve admin.refunds.approve |
| Interactions | — |
| Validation | — |
| Related screens | ADM-33, ADM-34 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET/POST /admin/refunds; POST /approve, /reject; POST /admin/sandbox/operations/{ref}/complete |
| Database entities | refunds, ledger_entries |
| Source files | apps/web/src/app/[locale]/admin/refunds/page.tsx |
| Dependencies / decisions | Refund commission rule (founder: merchandise only) |

Input fields:

  - None

#### ADM-33 · Request refund form

| Field | Specification |
|---|---|
| Screen ID | ADM-33 |
| Screen name | Request refund form |
| User roles | FINANCE |
| Route / URL | `Form on ADM-32` |
| Purpose | Request a refund up to the remaining refundable amount. Works, but takes a raw order ID; it should start from the order or dispute. |
| Information displayed | Order ID, amount, reason, dispute ID. |
| UI components | Form |
| Primary call to action | Request a refund |
| Secondary calls to action | Cancel |
| Required fields | Order ID, Amount (AED), Reason |
| Optional fields | Dispute ID |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.refunds.request |
| Interactions | — |
| Validation | Amount ≤ refundable |
| Related screens | ADM-32, ADM-29, ADM-39 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Inline form. |
| Implementation status | Partial · P0 |
| API endpoints | POST /admin/refunds |
| Database entities | refunds |
| Source files | refunds/page.tsx |
| Dependencies / decisions | Gap G-16 |

Input fields:

  - Order ID (text, Required): uuid (recommended: picker from ADM-29)
  - Amount (AED) (money, Required): ≤ remaining refundable
  - Reason (textarea, Required)
  - Dispute ID (text, Optional): optional

#### ADM-34 · Approve or reject refund dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-34 |
| Screen name | Approve or reject refund dialog |
| User roles | FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-32` |
| Purpose | Second-person decision. |
| Information displayed | "Approve refund {number}?"; "You requested this; another finance user must decide." |
| UI components | Dialog |
| Primary call to action | Approve / Reject |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Reason for the decision |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.refunds.approve; not the requester |
| Interactions | — |
| Validation | — |
| Related screens | ADM-32 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/refunds/{id}/approve\|reject |
| Database entities | refunds |
| Source files | refunds/page.tsx |
| Dependencies / decisions | "Two finance approvers" ambiguity |

Input fields:

  - Reason for the decision (textarea, Optional): required to reject

#### ADM-35 · Payouts

| Field | Specification |
|---|---|
| Screen ID | ADM-35 |
| Screen name | Payouts |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/payouts` |
| Purpose | Pay eligible, undisputed, completed orders to sellers (dual control, sandbox). |
| Information displayed | Eligible suppliers with order count and amount; payouts list with state (Awaiting approval, Approved, Rejected, Sent to provider, Paid by provider, Failed), paid at. |
| UI components | Eligible table, payouts table, row actions, sandbox completion |
| Primary call to action | Request payout (FINANCE) |
| Secondary calls to action | Approve; Reject (FINANCE_APPROVER) |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.finance.read; request/approve capabilities |
| Interactions | — |
| Validation | — |
| Related screens | ADM-36, ADM-37, SEL-32 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/payouts/eligible; GET/POST /admin/payouts; POST /approve, /reject |
| Database entities | payouts, settlements |
| Source files | apps/web/src/app/[locale]/admin/payouts/page.tsx |
| Dependencies / decisions | Founder weekly schedule after window (P5-5 conflict) |

Input fields:

  - None

#### ADM-36 · Request payout dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-36 |
| Screen name | Request payout dialog |
| User roles | FINANCE |
| Route / URL | `Dialog on ADM-35` |
| Purpose | Request payout of all eligible orders for one seller. |
| Information displayed | "Request a payout to {company}?" with amount and orders. |
| UI components | Dialog |
| Primary call to action | Request payout |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.payouts.request |
| Interactions | — |
| Validation | — |
| Related screens | ADM-35 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/payouts |
| Database entities | payouts |
| Source files | payouts/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-37 · Approve or reject payout dialog

| Field | Specification |
|---|---|
| Screen ID | ADM-37 |
| Screen name | Approve or reject payout dialog |
| User roles | FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-35` |
| Purpose | Second-person decision. |
| Information displayed | "Approve payout {number}?" |
| UI components | Dialog |
| Primary call to action | Approve / Reject |
| Secondary calls to action | Cancel |
| Required fields | — |
| Optional fields | Reason |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.payouts.approve; not the requester |
| Interactions | — |
| Validation | — |
| Related screens | ADM-35 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/payouts/{id}/approve\|reject |
| Database entities | payouts |
| Source files | payouts/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason (textarea, Optional): required to reject

#### ADM-38 · Disputes queue

| Field | Specification |
|---|---|
| Screen ID | ADM-38 |
| Screen name | Disputes queue |
| User roles | SUPPORT (manage); FINANCE roles (read) |
| Route / URL | `/{locale}/admin/disputes` |
| Purpose | Triage disputes. |
| Information displayed | Number, order, type, state, assigned/unassigned, opened. |
| UI components | Filters (All states, Assigned to me), table |
| Primary call to action | Open |
| Secondary calls to action | Filter |
| Required fields | — |
| Optional fields | — |
| Filters | State, assigned to me |
| Sorting | Oldest open |
| Search | — |
| Navigation | — |
| Permissions | admin.disputes.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-39 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/disputes |
| Database entities | disputes |
| Source files | apps/web/src/app/[locale]/admin/disputes/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-39 · Dispute detail (admin)

| Field | Specification |
|---|---|
| Screen ID | ADM-39 |
| Screen name | Dispute detail (admin) |
| User roles | SUPPORT (manage); FINANCE roles (read) |
| Route / URL | `/{locale}/admin/disputes/[disputeId]` |
| Purpose | Review evidence, message both parties and propose an outcome. |
| Information displayed | "Support reviews evidence and proposes an outcome. Refunds go to finance for dual approval…"; parties, order, messages/evidence, proposal, refunds. |
| UI components | Thread, evidence list, action bar |
| Primary call to action | Assign to me |
| Secondary calls to action | Request evidence; Propose resolution; Close dispute; Message both parties |
| Required fields | — |
| Optional fields | Note to both parties |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.disputes.read; actions admin.disputes.manage |
| Interactions | — |
| Validation | — |
| Related screens | ADM-40, ADM-32 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /admin/disputes/{id}; POST /assign, /request-evidence, /propose, /close, /messages |
| Database entities | disputes, dispute_messages |
| Source files | apps/web/src/app/[locale]/admin/disputes/[disputeId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Note to both parties (textarea, Optional)

#### ADM-40 · Dispute action dialogs

| Field | Specification |
|---|---|
| Screen ID | ADM-40 |
| Screen name | Dispute action dialogs |
| User roles | SUPPORT |
| Route / URL | `Dialogs on ADM-39` |
| Purpose | Request evidence (from Under review or Resolution proposed), propose a resolution (No financial action / Refund + amount, from Under review or Awaiting evidence) or close a dispute whose proposal is No financial action. One component, three variations. |
| Information displayed | "Amount in AED, for example 125.50"; "Finance creates the refund from the Refunds page". |
| UI components | Dialog (3 variants) |
| Primary call to action | Send / Propose / Close dispute |
| Secondary calls to action | Cancel |
| Required fields | Proposal, Note |
| Optional fields | Amount (AED) |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.disputes.manage |
| Interactions | — |
| Validation | — |
| Related screens | ADM-39 |
| Mobile layout | Bottom sheet. |
| Desktop layout | Modal. |
| Implementation status | Implemented · P0 |
| API endpoints | POST /admin/disputes/{id}/request-evidence\|propose\|close |
| Database entities | disputes |
| Source files | disputes/[disputeId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Proposal (radio, Required): NO_ACTION, REFUND
  - Amount (AED) (money, Optional): required for REFUND
  - Note (textarea, Required)

#### ADM-41 · Supplier reviews moderation

| Field | Specification |
|---|---|
| Screen ID | ADM-41 |
| Screen name | Supplier reviews moderation |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/supplier-reviews` |
| Purpose | Hide or republish reviews; text is never edited. Admin sees buyer identity. |
| Information displayed | Supplier, rating, comment, buyer company (admin only), order, state. |
| UI components | Table, actions, reason dialog |
| Primary call to action | Hide |
| Secondary calls to action | Publish again |
| Required fields | Reason (recorded in the audit log) |
| Optional fields | — |
| Filters | State |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.reviews.moderate |
| Interactions | — |
| Validation | — |
| Related screens | BUY-26, PUB-10 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P2 |
| API endpoints | GET /admin/reviews; POST /hide, /unhide |
| Database entities | reviews |
| Source files | apps/web/src/app/[locale]/admin/supplier-reviews/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reason (recorded in the audit log) (textarea, Required)

#### ADM-42 · Support queue

| Field | Specification |
|---|---|
| Screen ID | ADM-42 |
| Screen name | Support queue |
| User roles | SUPPORT |
| Route / URL | `/{locale}/admin/support` |
| Purpose | Customer tickets from all workspaces. |
| Information displayed | Subject, workspace, topic, state (Waiting for customer etc.), assignee, updated. |
| UI components | Filters, table |
| Primary call to action | Open |
| Secondary calls to action | Filter |
| Required fields | — |
| Optional fields | — |
| Filters | State, assigned |
| Sorting | Oldest open |
| Search | — |
| Navigation | — |
| Permissions | admin.support.read |
| Interactions | — |
| Validation | — |
| Related screens | ADM-43 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/support |
| Database entities | support_tickets |
| Source files | apps/web/src/app/[locale]/admin/support/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-43 · Ticket detail (admin)

| Field | Specification |
|---|---|
| Screen ID | ADM-43 |
| Screen name | Ticket detail (admin) |
| User roles | SUPPORT |
| Route / URL | `/{locale}/admin/support/[ticketId]` |
| Purpose | Take, reply, resolve or reopen. |
| Information displayed | Messages, limited order details only, linked records. |
| UI components | Thread, composer, action bar |
| Primary call to action | Take ticket |
| Secondary calls to action | Reply; Resolve; Reopen |
| Required fields | Reply |
| Optional fields | Resolution note |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.support.read; actions admin.support.manage |
| Interactions | — |
| Validation | — |
| Related screens | ADM-42, SHR-05 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/support/{id}; POST /assign, /messages, /resolve, /reopen |
| Database entities | support_tickets, support_messages |
| Source files | apps/web/src/app/[locale]/admin/support/[ticketId]/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - Reply (textarea, Required): ≤4000
  - Resolution note (textarea, Optional)

#### ADM-44 · Reports (scoped CSV exports)

| Field | Specification |
|---|---|
| Screen ID | ADM-44 |
| Screen name | Reports (scoped CSV exports) |
| User roles | SUPPORT, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/reports` |
| Purpose | Create audited CSV exports with reason and TOTP step-up; downloads expire after 24 hours. |
| Information displayed | "Each export needs a reason and a current authenticator code, is recorded in the audit log and can be downloaded only by you for 24 hours."; own exports with report, period, rows, available until, downloaded, state (Ready, Expired). |
| UI components | Form, TOTP input, exports table |
| Primary call to action | Create export |
| Secondary calls to action | Download |
| Required fields | Report, Scope, From (Dubai date), To (Dubai date), Reason, Authenticator code |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.reports.export; scope by role (P6-4) |
| Interactions | — |
| Validation | ≤50k rows; TOTP valid |
| Related screens | ADM-45 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET/POST /admin/exports; GET /admin/exports/{id}/download |
| Database entities | exports, audit_events |
| Source files | apps/web/src/app/[locale]/admin/reports/page.tsx |
| Dependencies / decisions | Founder: compliance may export verification records (P6-4 conflict) |

Input fields:

  - Report (select, Required): orders, refunds, payouts, disputes, support_tickets (scoped by role)
  - Scope (radio, Required): assigned (Assigned to me) or all (All records); support only assigned
  - From (Dubai date) (date, Required)
  - To (Dubai date) (date, Required): ≤366 days
  - Reason (textarea, Required): 1–500
  - Authenticator code (otp, Required): 6 digits

#### ADM-45 · Audit log

| Field | Specification |
|---|---|
| Screen ID | ADM-45 |
| Screen name | Audit log |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/audit` |
| Purpose | Append-only audit trail. |
| Information displayed | Time, actor, action, resource, resource ID, reason, request ID. |
| UI components | Filters, table, pagination |
| Primary call to action | — |
| Secondary calls to action | Filter; load more |
| Required fields | — |
| Optional fields | — |
| Filters | Actor, action, resource, period |
| Sorting | Newest |
| Search | — |
| Navigation | — |
| Permissions | admin.audit.read |
| Interactions | — |
| Validation | — |
| Related screens | — |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/audit |
| Database entities | audit_events |
| Source files | apps/web/src/app/[locale]/admin/audit/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-46 · Staff and roles

| Field | Specification |
|---|---|
| Screen ID | ADM-46 |
| Screen name | Staff and roles |
| User roles | SUPER_ADMIN |
| Route / URL | `/{locale}/admin/staff` |
| Purpose | Assign staff roles (last super-admin protected). Staff accounts are provisioned by script, not registration. |
| Information displayed | Email, roles, MFA enabled, status. |
| UI components | Table, role editor dialog |
| Primary call to action | Edit roles |
| Secondary calls to action | — |
| Required fields | Reason |
| Optional fields | Roles |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | admin.staff.manage |
| Interactions | — |
| Validation | — |
| Related screens | — |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P1 |
| API endpoints | GET /admin/staff; POST /admin/staff/{id}/roles |
| Database entities | admin_users, admin_roles |
| Source files | apps/web/src/app/[locale]/admin/staff/page.tsx |
| Dependencies / decisions | D03 |

Input fields:

  - Roles (checkboxes, Optional): COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN
  - Reason (textarea, Required)

#### ADM-47 · Platform settings and commission

| Field | Specification |
|---|---|
| Screen ID | ADM-47 |
| Screen name | Platform settings and commission |
| User roles | SUPER_ADMIN or finance approver (to be decided) |
| Route / URL | `/{locale}/admin/settings (proposed)` |
| Purpose | Founder: commission 10% on merchandise ex VAT/delivery, configurable through a restricted admin setting and snapshotted per order. Today commission is env COMMISSION_BPS; no settings screen. |
| Information displayed | Commission rate, effective date, change history; reservation minutes, payment window, dispute window, quote validity default, ticket limits. |
| UI components | Settings form with effective-from, change log, dual-control confirmation |
| Primary call to action | Schedule change |
| Secondary calls to action | View history |
| Required fields | Commission (%), Effective from, Reason |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | New restricted capability with dual control |
| Interactions | — |
| Validation | — |
| Related screens | SEL-28, ADM-30 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Planned · P0 |
| API endpoints | — |
| Database entities | New platform_settings with history; orders.commission snapshot |
| Source files | — |
| Dependencies / decisions | Founder decision 4; Gap G-05 |

Input fields:

  - Commission (%) (decimal→basis points, Required)
  - Effective from (datetime, Required)
  - Reason (textarea, Required)

#### ADM-48 · Logistics and delivery settings

| Field | Specification |
|---|---|
| Screen ID | ADM-48 |
| Screen name | Logistics and delivery settings |
| User roles | SUPER_ADMIN |
| Route / URL | `/{locale}/admin/logistics (proposed)` |
| Purpose | Founder: supplier-arranged, courier, collection, per-order charges, proof of delivery. Nothing platform-side exists beyond seller delivery terms. |
| Information displayed | Delivery methods, courier partners (future), proof requirements. |
| UI components | Settings form |
| Primary call to action | Save |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| Interactions | — |
| Validation | — |
| Related screens | SEL-04 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Planned · P2 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Logistics decision |

Input fields:

  - None

#### ADM-49 · System health and webhooks

| Field | Specification |
|---|---|
| Screen ID | ADM-49 |
| Screen name | System health and webhooks |
| User roles | SUPER_ADMIN, FINANCE (webhooks) |
| Route / URL | `/{locale}/admin/system (proposed)` |
| Purpose | Integration status, quarantined webhooks, queue depth, worker jobs. Public /status exists; admin view only shows a quarantine count. |
| Information displayed | Integrations (mode: sandbox/live), webhook events, failures, retries. |
| UI components | Status tiles, table |
| Primary call to action | Retry / inspect |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| Interactions | — |
| Validation | — |
| Related screens | PUB-15, ADM-01 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Recommended · P2 |
| API endpoints | — |
| Database entities | webhook_events, outbox |
| Source files | — |
| Dependencies / decisions | — |

Input fields:

  - None

#### ADM-50 · Tax configuration and invoicing

| Field | Specification |
|---|---|
| Screen ID | ADM-50 |
| Screen name | Tax configuration and invoicing |
| User roles | FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/tax (proposed)` |
| Purpose | Founder chose the disclosed-intermediary model pending professional approval: supplier TRNs, VAT only for registered suppliers, commission invoices, credit notes. Today tax applies regardless of supplier registration. |
| Information displayed | VAT rate, supplier registration status, invoice numbering, credit notes. |
| UI components | Settings, tables |
| Primary call to action | Save |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| Interactions | — |
| Validation | — |
| Related screens | BUY-28, SEL-34 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Blocked · P1 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Tax adviser approval; Gap G-04 |

Input fields:

  - None

#### ADM-51 · Data requests, account closure and legal hold

| Field | Specification |
|---|---|
| Screen ID | ADM-51 |
| Screen name | Data requests, account closure and legal hold |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/data-requests (proposed)` |
| Purpose | Founder: configurable retention, account closure, DSAR and legal-hold workflows. None exist. |
| Information displayed | Request type, subject, due date, state, legal hold flag. |
| UI components | Queue, detail, actions |
| Primary call to action | Process request |
| Secondary calls to action | Place legal hold |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | New capability |
| Interactions | — |
| Validation | — |
| Related screens | ACC-16 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Planned · P1 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Legal drafts; Gap G-15 |

Input fields:

  - None

#### ADM-52 · Executive analytics

| Field | Specification |
|---|---|
| Screen ID | ADM-52 |
| Screen name | Executive analytics |
| User roles | SUPER_ADMIN, FINANCE |
| Route / URL | `/{locale}/admin/analytics (proposed)` |
| Purpose | Trends beyond the operations overview: GMV over time, active buyers/suppliers, RFQ conversion, category performance. |
| Information displayed | Charts by period. |
| UI components | KPI tiles, charts, tables |
| Primary call to action | — |
| Secondary calls to action | Change period; export |
| Required fields | — |
| Optional fields | — |
| Filters | Period, category |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| Interactions | — |
| Validation | — |
| Related screens | ADM-01 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Recommended · P2 |
| API endpoints | — |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | Analytics scope |

Input fields:

  - None

#### ADM-53 · Sandbox provider simulator

| Field | Specification |
|---|---|
| Screen ID | ADM-53 |
| Screen name | Sandbox provider simulator |
| User roles | FINANCE, FINANCE_APPROVER (development only) |
| Route / URL | `Action on ADM-32 / ADM-35` |
| Purpose | SANDBOX ONLY: simulate the provider finishing a refund or payout. Must never appear in production. |
| Information displayed | Operation reference, outcome buttons, "Sandbox" label. |
| UI components | Inline button group with sandbox pill |
| Primary call to action | Simulate success |
| Secondary calls to action | Simulate failure |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Finance roles; only when PAYMENT_MODE=mock |
| Interactions | — |
| Validation | — |
| Related screens | ADM-32, ADM-35 |
| Mobile layout | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| Desktop layout | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| Implementation status | Implemented · P2 |
| API endpoints | POST /admin/sandbox/operations/{ref}/complete |
| Database entities | refunds, payouts, ledger_entries |
| Source files | refunds/page.tsx; payouts/page.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

### System

#### SYS-01 · Not found / not available

| Field | Specification |
|---|---|
| Screen ID | SYS-01 |
| Screen name | Not found / not available |
| User roles | All |
| Route / URL | `Any unknown or inaccessible resource` |
| Purpose | One response for missing and forbidden resources so existence is never leaked. |
| Information displayed | "Not available" — "You do not have access to this page, or it does not exist."; back link. |
| UI components | Status page template |
| Primary call to action | Back |
| Secondary calls to action | Go home |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | — |
| Interactions | — |
| Validation | — |
| Related screens | SYS-02 |
| Mobile layout | Centered. |
| Desktop layout | Centered. |
| Implementation status | Implemented · P0 |
| API endpoints | 404 responses |
| Database entities | — |
| Source files | components/ui.tsx (NotFound, Forbidden) |
| Dependencies / decisions | — |

Input fields:

  - None

#### SYS-02 · Error with retry and reference

| Field | Specification |
|---|---|
| Screen ID | SYS-02 |
| Screen name | Error with retry and reference |
| User roles | All |
| Route / URL | `Any failed load or action` |
| Purpose | Recoverable error with request reference. |
| Information displayed | "Something went wrong", message by error key, Reference (request ID), Retry. |
| UI components | Error alert, retry button |
| Primary call to action | Retry |
| Secondary calls to action | Contact support |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | — |
| Interactions | Form input kept on failure (T34). |
| Validation | — |
| Related screens | SYS-01 |
| Mobile layout | Inline. |
| Desktop layout | Inline. |
| Implementation status | Implemented · P0 |
| API endpoints | Error envelope {code, message_key, field_errors, request_id} |
| Database entities | — |
| Source files | components/ui.tsx (ApiErrorAlert) |
| Dependencies / decisions | — |

Input fields:

  - None

#### SYS-03 · Sandbox environment banner

| Field | Specification |
|---|---|
| Screen ID | SYS-03 |
| Screen name | Sandbox environment banner |
| User roles | All |
| Route / URL | `Global (top of every page)` |
| Purpose | Make sandbox mode unmistakable: "Sandbox environment: test adapters only. No real payments, and emails go to the local mail catcher." |
| Information displayed | Banner text. |
| UI components | Global banner |
| Primary call to action | — |
| Secondary calls to action | — |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | Shown when public config sandbox=true |
| Interactions | Non-dismissible. |
| Validation | — |
| Related screens | FIN-01 |
| Mobile layout | Wraps to 2–3 lines. |
| Desktop layout | Single line. |
| Implementation status | Implemented · P0 |
| API endpoints | GET /public/config |
| Database entities | — |
| Source files | app/[locale]/layout.tsx |
| Dependencies / decisions | — |

Input fields:

  - None

#### SYS-04 · Trading unavailable / maintenance

| Field | Specification |
|---|---|
| Screen ID | SYS-04 |
| Screen name | Trading unavailable / maintenance |
| User roles | All |
| Route / URL | `Recommended` |
| Purpose | Explain when checkout or trading is disabled (TRADING_ENABLED off, provider outage) while records stay readable. |
| Information displayed | Banner/notice, affected actions, what still works. |
| UI components | Global banner, disabled-button reason text |
| Primary call to action | — |
| Secondary calls to action | Request quotation instead |
| Required fields | — |
| Optional fields | — |
| Filters | — |
| Sorting | — |
| Search | — |
| Navigation | — |
| Permissions | — |
| Interactions | Product page already shows "Ordering is not available right now. You can request a quotation." |
| Validation | — |
| Related screens | PUB-07, BUY-17 |
| Mobile layout | Banner. |
| Desktop layout | Banner. |
| Implementation status | Recommended · P2 |
| API endpoints | viewer.trading.reason = checkout_disabled |
| Database entities | — |
| Source files | — |
| Dependencies / decisions | — |

Input fields:

  - None
