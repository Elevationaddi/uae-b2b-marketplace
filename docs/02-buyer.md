# Business buyer workspace
Base `/buyer`. Mobile tabs Home, Marketplace, RFQs, Orders, Account; global cart, notifications and messages. Desktop sidebar exposes all routes. Only verified buyer companies can transact.

| Route | Content and actions | Rules / results |
|---|---|---|
| /home | Search, category tiles, featured sellers, recent and reorder cards | Open filtered catalog, product or order; no invented recommendations |
| /marketplace | Search, grid/list, category, emirate, MOQ, price, lead time, stock/custom, verified seller filters, sort and pagination | URL persists filters; price label indicates quantity tier; only approved active catalog |
| /products/:id | Photos, SKU/variants, specs, MOQ, tiers, stock, lead time, sample eligibility, seller info, shipping terms | Quantity selector recalculates estimate; add to cart or request quote; save, report, message; unavailable products disable purchase |
| /suppliers | Directory, capability/location/category filters, saved suppliers | Open storefront, send RFQ, follow; no private documents or bank data |
| /suppliers/:id | Public business profile, verified badge, catalogs, certifications approved for display, terms and reviews | Request quote or message; only approved content |
| /saved | Saved products, suppliers, comparison shortlist | Remove, compare comparable variant/quantity; deleted item marked unavailable |
| /rfqs | Draft/open/closed RFQs, response counts and deadline | Create, edit draft, publish, cancel open without accepted quote, view offers |
| /rfqs/new | Title, category, specs, quantity/unit, target date, emirate, budget optional, attachment, pool/invite visibility, selected sellers | Validate positive quantity, future deadline, required specs and eligible invitees; preview then publish |
| /rfqs/:id | RFQ timeline, quote comparison, conversations | Compare unit/total/tax/shipping/lead time/validity; request revision, decline, accept exact version; single award transaction |
| /cart | Items grouped by seller, variant, quantity, tier, MOQ, estimated subtotal | Update/remove; validate each SKU; checkout disabled for invalid stock/MOQ or stale shipping |
| /checkout | Address, delivery quote per seller, PO reference, tax/fees, total, terms, payment method | Server returns expiring checkout session; confirm snapshot and redirect PSP; retry safely; show pending until webhook |
| /orders | Order IDs, seller, total, status, date, filters | Open detail or reorder by rebuilding cart at current prices; do not duplicate payments |
| /orders/:id | Item snapshot, invoice, shipment tracking, delivery proof, timeline, order conversation | Confirm receipt after dispatch/delivery evidence; request cancellation/return/dispute; download scoped documents |
| /messages | Conversations, unread counts, attachments, linked order/RFQ | Send to authorized participants, report, mark read; no unrestricted company search |
| /account/company | Legal data, licence, TRN optional, contacts, verification history | Submit renewal/change for review; legal changes do not mutate historical invoices |
| /account/team | Staff invitations, roles and status | Owner invites/revokes; prevent removal of last owner; approval thresholds phase 2 |
| /account/addresses | Delivery/billing address list | Create/edit/delete unused address; historical orders retain snapshot |
| /account/billing | Invoices, payment receipts, membership status | Download invoices; payment method management only via PSP; paid plans gated |
| /account/settings | Language, password/MFA, notification preferences, session list | Update own profile; revoke own sessions; critical notices cannot be opted out |
| /support | Cases, FAQ, issue form and evidence | Create ticket, view replies; link order or RFQ only if owned |

RFQ comparison: show quote version, currency, quantities, unit price and landed total, delivery date, payment terms and validity. Confirm acceptance in modal with exact version; if revised/expired, refresh and require new consent. Acceptance creates a single unpaid order; no immediate money capture. Buyer may retry payment for same order until expiry. Unpaid expired orders require a fresh quote or cart.

Buyer staff: owner manages team/company and can purchase; procurement creates RFQs and purchases; viewer read-only; approver role introduced with approval workflow in phase 2. No buyer can see other buyers' quotes or transactions. Reviews only for completed orders, one review per order, rating 1–5 and optional comment; moderation cannot silently alter rating.
