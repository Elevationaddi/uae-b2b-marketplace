# 1. Product overview

> Working title: **Manufacturers Marketplace** (placeholder; name, logo and typography are deferred, see section 28).
> Status legend used everywhere in this specification: **Implemented** (in code on `main`, tested), **Partial** (works but incomplete or inconsistent with a founder decision), **Planned** (approved or required, not built), **Recommended** (proposed by this audit, not yet approved), **Blocked** (cannot proceed without an external approval, provider or legal input).

## 1.1 What the platform is

A UAE business-to-business procurement marketplace that connects **verified buying companies** with **verified suppliers and manufacturers**. It is not a consumer retail store. Every trading company is verified against its UAE trade licence before it can buy, sell, message or pay (decision D08). Buyers can:

- browse a moderated catalogue of wholesale products with MOQ, order increments, tiered prices and lead times;
- buy **ready stock** through a multi-supplier cart and a single checkout (one order per supplier);
- send **requests for quotation (RFQs)** for custom or made-to-order goods, compare versioned quotes and convert the accepted quote into an order;
- pay through a payment provider (currently a labelled **sandbox** adapter only), track fulfilment, confirm receipt, rate suppliers and open disputes.

Suppliers manage a public storefront, a versioned product catalogue (every content change is moderated), inventory, pricing, quotations, order fulfilment and a settlement view. The platform team operates verification, catalogue moderation, RFQ oversight, disputes, refunds and payouts with dual control, support, reports and an append-only audit log, from a **separate admin origin** with mandatory TOTP MFA (D02, D03).

Source of truth used for this document: code on `main` at commit `9df2f0e` (Phases 0–7 and the Phase 8 pull requests #10 and #12–#19 merged; first audited at `2ccd947`), the founder's answers to the 21 UX decisions of 28 November 2026, `docs/00-decisions.md`, `docs/01-product.md`, `docs/13-roadmap.md`, `docs/IMPLEMENTATION_STATUS.md`, the founder's Phase 8 decisions of 2026-11-28, and the screenshots in the project files (phase-1 … phase-6).

## 1.2 Business model

| Element | Current state | Source |
|---|---|---|
| Who pays | Buyers pay suppliers through the platform's payment provider; the platform deducts commission from the supplier's payable. | `docs/07-finance.md`, ledger accounts in `/admin/finance` |
| Commission | 10% supplier commission on merchandise value excluding VAT and delivery (founder decision). Since PR #13 a versioned commission policy prices new checkouts and is snapshotted per order; only a finance approver records a new rate, with a reason and TOTP (ADM-56); 30 days' supplier notice before changes (FD-05). | `/admin/commission`, `packages/db` commission policy |
| Commission on refunds | Reversed on the merchandise part of a refund only; refunds can be split into merchandise, delivery and VAT (PR #13, P8-7). | `packages/db/src/settlement.ts` |
| Subscriptions | **None.** Founder: "everything free, no subscriptions". No plans screens are specified. | founder decision |
| Featured placements | Editorial, labelled "Featured", never used for ranking (A13-style rule in code). No paid promotion. | `/admin/catalog/featured` |
| Tax | Disclosed-intermediary model confirmed (FD-06); tax adviser pending. Since PR #14 VAT follows the supplier's VAT status confirmed by compliance (`TAX_TREATMENT`), each order snapshots its tax rule, and non-binding invoice drafts exist. Binding invoices stay blocked. | `TAX_TREATMENT`, ADM-54, BUY-37 |
| Payouts | Weekly: the run opens every Monday at 10:00 Dubai time (next working day after UAE public holidays), no minimum at launch; orders are eligible after verified delivery and the 14-day dispute window; one finance user requests and a different finance approver approves (FD-01, FD-04, PR #13). | `/admin/payouts` |

This document never assumes a commission rate, tax rule or payment policy beyond those listed above. Where the UI must show a figure, it uses server-provided values and labels the environment (sandbox).

## 1.3 Problems the platform solves

1. **Trust**: buyers cannot easily tell whether a UAE supplier is licensed and real. Every trading company is verified from licence documents; verification state and "verified since" are shown publicly.
2. **Wholesale fit**: consumer marketplaces do not handle MOQ, order increments, tier pricing, made-to-order lead times or PO references. These are first-class fields here.
3. **Quotation chaos**: RFQs by email/WhatsApp are hard to compare. The RFQ module provides structured, versioned, server-totalled quotes with a side-by-side comparison and an auditable award.
4. **Payment risk**: payment is confirmed only by the provider's verified webhook, stock is reserved during payment, supplier payouts wait for receipt and disputes, and refunds/payouts need two people.
5. **Operational accountability**: every admin action requires a reason where relevant and is written to an append-only audit log.

## 1.4 Target audience and segments

**Buying companies (buyer workspaces):** UAE-licensed businesses purchasing for resale, production or operations: retailers and distributors, hospitality and F&B groups, contractors and facilities managers, manufacturers buying inputs, and SMEs and entrepreneurs sourcing private-label goods. Roles inside a buyer company: OWNER, PROCUREMENT, VIEWER.

**Supplier segments (seller workspaces):** the seven business types in the data model (`BusinessType` enum in `packages/db/prisma/schema.prisma`): MANUFACTURER, FACTORY, WHOLESALER, DISTRIBUTOR, IMPORTER, AUTHORIZED_DISTRIBUTOR and TRADING_COMPANY, each optionally offering custom manufacturing, private label, white label and samples. Roles: OWNER, SALES, WAREHOUSE, FINANCE, VIEWER. A company may be a buyer, a seller or both (separate workspaces, never mixed permissions).

**Launch categories:** 12 database-managed categories (A09), each OPEN, REVIEW_REQUIRED or BLOCKED.

**Geography:** UAE only for delivery addresses (7 emirates). International suppliers are not supported as trading companies at launch because verification requires a UAE trade licence; "country of origin" on products may be any ISO country.

## 1.5 Value proposition

- For buyers: "Source from verified UAE suppliers with clear wholesale terms, compare quotes side by side and pay with protection until you confirm receipt."
- For suppliers: "Reach verified business buyers, quote on relevant requests and get paid through the platform, free of subscription fees."
- For the platform: commission on completed merchandise value, with low operational risk through verification, moderation, dual control and audit.

## 1.6 Revenue streams

| Stream | Status |
|---|---|
| Supplier commission on merchandise (10% founder decision, configurable) | Partial: computed per order from an env variable; admin setting planned |
| Subscriptions / plans | Not offered (founder decision) |
| Paid promotion / advertising | Not offered; featured is editorial |
| Payment fees pass-through | Not decided (provider not connected) |

## 1.7 Key competitive advantages (from the build, not aspirations)

1. Mandatory company verification with licence expiry tracking and automatic trading restriction (`LICENCE_EXPIRED` suspension).
2. Structured, versioned RFQs with exact-version acceptance and server-calculated totals.
3. Multi-supplier wholesale cart with MOQ, increments, tier pricing and 15-minute stock reservation.
4. Provider-webhook-only payment confirmation, reconciliation cases for late or mismatched payments.
5. Dual-control refunds and payouts, append-only operational ledger, audited exports with MFA step-up.
6. Bilingual EN/AR with full RTL from day one, Arabic-normalised search.
7. Separate admin origin with mandatory TOTP, isolated cookies.

## 1.8 Current development status

| Phase | Scope | State |
|---|---|---|
| 0 | Repo, CI, infrastructure skeleton | Merged |
| 1 | Auth, companies, verification, team, admin MFA | Merged (PR #2) |
| 2 | Catalogue, storefronts, moderation, search, discovery | Merged |
| 3 | RFQs, quotes, messaging, notifications (provisional P3-1…P3-7) | Merged (PR #5) |
| 4 | Cart, checkout, sandbox payments, orders, ledger (P4-1…P4-7) | Merged (PR #6) |
| 5 | Fulfilment, disputes, refunds, payouts, reviews (P5-1…P5-7) | Merged (PR #7) |
| 6 | Support, operations overview, scoped exports (P6-1…P6-6) | Merged (PR #8) |
| 7 | Sandbox-safe hardening, restore drill, production refusal, security review | Merged (PR #9) |
| 8 | Financial policy (PR #13), VAT configuration (PR #14), PostgreSQL scheduler for Vercel Cron (PR #15), support, quote and review policies (PR #16), supplier cancellation and return policy (PR #17), security hardening (PR #18), Vercel-first architecture at no added cost (PR #19; Azure proposal rejected and archived) | Merged |
| 8 (open) | Per-emirate delivery and collection (C-10), counteroffers (C-14), buyer cancellation requests, sample requests, buyer dashboard and spending, staging profile | Approved, being built |
| Launch | Live payments, production email, legal texts, public registration | Not authorised: no paid services, live services or launch without founder approval |

Test evidence (Phase 7 report): 219 unit/integration tests and 76 browser E2E tests, axe-core WCAG 2.1 A/AA checks with no serious or critical findings on tested pages. The app runs only in sandbox mode; production refuses to start without required integrations.

## 1.9 Implemented versus planned (summary)

| Capability | Status | Notes |
|---|---|---|
| Registration, email verification, sign-in, password reset | Implemented | |
| Company onboarding, documents, verification, renewal | Implemented | |
| Team invitations and roles | Implemented | |
| Admin portal with MFA, staff roles | Implemented | |
| Catalogue, storefronts, moderation, categories, restricted terms, featured | Implemented | |
| Search, filters, suggestions, saved, compare, recently viewed, preferences | Implemented | |
| RFQs, versioned quotes, comparison, award | Implemented | Counteroffers (FD-10) and sample requests (FD-13) approved, to build |
| Messaging (text) and notifications (in-app + email) | Implemented | Attachments planned; production email blocked; no SMS or WhatsApp (FD-20) |
| Cart, checkout, orders, sandbox payment | Implemented (sandbox) | Live provider blocked (FD-07); per-emirate delivery and free collection approved (FD-08) |
| Fulfilment, verified delivery, auto-completion, reviews | Implemented (PR #13, #16) | Delivery proof review planned (FD-03) |
| Disputes, refunds, payouts (dual control), holds, weekly payout run | Implemented (sandbox) | Configurable payout schedule screen planned (FD-04) |
| Supplier cancellation, return policies | Implemented (PR #17) | Buyer cancellation requests approved, to build (founder Q12) |
| Support tickets, operations overview, exports | Implemented | |
| Buyer dashboard with monthly spending | Planned | FD-21 |
| Invoice drafts (non-binding) | Implemented (PR #14) | |
| Invoices, credit notes, statements | Blocked | Tax adviser (FD-06) |
| Commission policy (versioned) | Implemented (PR #13) | 30-day supplier notice to add (FD-05) |
| Reconciliation resolution | Implemented (PR #13) | |
| Account closure, DSAR, legal hold | Planned | Founder decision |
| Public information and legal pages | Recommended / Blocked | Legal drafting |
| Native mobile apps | Not planned | Responsive web only |
