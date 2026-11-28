# Founder decisions of 28 November 2026 compared with the current implementation

**Date:** 2026-11-28 (UTC). **Scope:** every founder decision in the Phase 8 brief compared with the code on `main` at 2ccd947 (Phases 0–7).

**Rule followed:** financial logic and approved security requirements are **not changed silently**. Every conflict below is recorded and assigned to a Phase 8 workstream. Nothing in Phase 8A changes application behaviour.

Severity levels:
- **Blocking:** must change before any live money moves.
- **Required:** must change before the pilot (8G).
- **Minor:** copy or default value.

## Money, payouts and order completion

| ID | Founder decision | Current implementation | Severity | Workstream |
|---|---|---|---|---|
| C-01 | Payouts become eligible only after the 14-day dispute window. Payout eligibility is kept separate from order completion. | An order becomes payout `ELIGIBLE` as soon as it is `COMPLETED` (`packages/db/src/settlement.ts`, `recomputeSettlement`). A supplier can therefore be paid inside the dispute window, and after that payout disputes are refused (P5-3). | Blocking | 8C/8E |
| C-02 | The dispute window is 14 days after **verified delivery**. Buyer confirmation does not waive the remaining period. | The window is 14 days after the buyer confirms receipt (`completedAt`, `apps/api/src/fulfilment/fulfilment-common.ts`). There is no window before confirmation, and "verified delivery" is not defined in data. | Blocking | 8E |
| C-03 | Orders complete automatically after the window, provided four conditions hold: delivery evidence exists, there are no open disputes, there are no fraud or compliance holds, and there are no pending refund or payment investigations. | There is no automatic completion (P5-2). Proof of delivery is optional (P5-1). There is no fraud, compliance or investigation hold on orders; only company suspension and dispute holds exist. | Blocking | 8E |
| C-04 | Payouts follow a weekly schedule, with dual finance approval and provider reconciliation. No payout is made when available provider balance is insufficient. | Payouts are requested manually at any time and dual-approved, with no schedule (P5-5). There is no check against the provider's available balance, because the sandbox adapter has no balance. | Blocking | 8C |
| C-05 | The commission rate is configurable through a restricted admin setting. The policy and rate are recorded against each order. | The rate comes from the `COMMISSION_BPS` environment variable. `checkouts.commission_bps` and `orders.commission_fils` are stored per order, so history is already protected. However, there is no admin setting, no audited change history and no policy version identifier. | Required | 8E |
| C-06 | Commission is reversed proportionately when **merchandise** is refunded. | Each refund reverses commission pro rata of the **order total**, which includes delivery and VAT (`packages/db/src/settlement.ts`, P5-4). A refund of the delivery charge only therefore reverses some commission. Refunds do not record which amount (merchandise, delivery or tax) they cover. | Blocking | 8E |
| C-07 | Supplier cancellation of an unfulfilled order requires the appropriate refund. Partial refunds go to the original payment method where possible. | Suppliers cannot cancel a paid order. Only a finance refund of an unshipped order cancels it (P5-4). Partial refunds exist. The sandbox adapter models refunds to the original payment. | Required | 8C/8E |

## Tax and invoices (D06)

| ID | Founder decision | Current implementation | Severity | Workstream |
|---|---|---|---|---|
| C-08 | Disclosed marketplace intermediary: suppliers issue merchandise invoices and the platform invoices suppliers for commission. The platform never charges VAT for an unregistered supplier. VAT treatment is not hardcoded. | Catalogue orders always apply the `STANDARD` rate (`TAX_STANDARD_BPS`) to merchandise plus delivery (P4-2), whatever the supplier's VAT registration. `companies.trn` exists but is optional and not used. Quotes let the supplier choose STANDARD, ZERO_RATED or EXEMPT (P3-3). | Blocking (before tax activation) | 8E |
| C-09 | Invoice downloads, credit notes, transaction statements, tax and invoice snapshots, and supplier TRNs. | None of these exist. Orders keep a `tax_rule` snapshot per checkout, but no invoice documents or numbering. | Required | 8E |

## Delivery and returns (D07, D08)

| ID | Founder decision | Current implementation | Severity | Workstream |
|---|---|---|---|---|
| C-10 | Delivery options: supplier-arranged, courier, buyer collection, custom terms and order-specific charges. Tracking, proof of dispatch and proof of delivery are recorded. Charges and lead times are disclosed before payment. | Each supplier has one flat delivery fee per order plus emirates served and typical days (P4-1). Quotes carry their own shipping. Carrier, tracking and optional proof of delivery are recorded (P5-1). There is no buyer collection option, no proof of dispatch and no required delivery evidence. | Required | 8E |
| C-11 | Change-of-mind returns follow the seller's disclosed return policy. Customised goods are generally excluded. | Sellers have no return policy field. Disputes cover damaged, wrong, short, quality and not-received cases. | Required | 8E |

## Reviews, RFQs and quotes (P3, P5-6)

| ID | Founder decision | Current implementation | Severity | Workstream |
|---|---|---|---|---|
| C-12 | Public label is "verified business buyer". Admins can see the identity. | The label is "Verified buyer" / "مشترٍ موثق". Compliance can hide reviews. The other rules match: completed orders only, one review per order, no edits. | Minor | 8E |
| C-13 | Quote validity defaults to 7 days and is configurable by the supplier. | The quote form defaults to 14 days (`apps/web/src/components/quote-form.tsx`). The maximum is 90 days (P3-2). | Minor | 8E |
| C-14 | Counteroffers, quotation revisions and auditable acceptance. | The buyer can ask for a revision and the supplier submits a new version. Acceptance is auditable and tied to an exact version. There is no structured buyer counteroffer (price or quantity); buyers can only use the message thread. | Required | 8E |
| C-15 | Public RFQs reach eligible verified suppliers in relevant categories. Private RFQs go to invited suppliers. Quotes are confidential. | This matches P3-1 and P3-7. **No conflict.** | — | — |

## Support, exports and data rights (P6, D09)

| ID | Founder decision | Current implementation | Severity | Workstream |
|---|---|---|---|---|
| C-16 | Resolved tickets close automatically after 7 days without a customer response. | Resolved tickets never close automatically (P6-2). | Required | 8E |
| C-17 | At most 10 open tickets per **company**, with admin exceptions. Urgent financial, security or compliance cases are never blocked. | The limit is 20 live tickets per **workspace** (P6-1). There are no admin exceptions and no urgent category that bypasses the limit. | Required | 8E |
| C-18 | Compliance roles may export verification and compliance records. Support exports only support records. | Compliance cannot export at all (P6-4). Support can export its own assigned disputes and tickets. **Question for founder:** do disputes count as support records? | Required | 8E |
| C-19 | Account closure, data access, export, deletion and legal hold workflows. | Only a report-only retention job exists (A13). Company closure is not built (`apps/worker/src/jobs.ts`). | Required | 8E/8F |

## Platform and infrastructure

| ID | Founder decision | Current implementation | Severity | Workstream |
|---|---|---|---|---|
| C-20 | Staging environment kept in sandbox mode. | `NODE_ENV=production` refuses to start without live email, a live scanner and a non-mock payment mode. That rule is correct for production, but it means a staging build cannot run with sandbox adapters. **Proposal:** add an `APP_ENV=staging` profile. It keeps every production hardening rule (HTTPS, strong secrets, separate admin host, no rate-limit scaling) and allows only the labelled sandbox adapters. Production rules stay unchanged. | Required | 8B |
| C-21 | Azure Blob Storage. | File storage uses the S3 API (`apps/api/src/files/storage.service.ts`). Azure Blob does not speak S3. **Proposal:** add an Azure Blob adapter behind the existing `StorageService` interface (put, get, ensure container) and keep S3 for local and other clouds. | Required | 8B |
| C-22 | Production-grade malware scanning. | `FILE_SCANNER=live` has no adapter and refuses to start (correct). The adapter is chosen in 8D: ClamAV in-region, or Microsoft Defender for Storage. | Required | 8D |
| C-23 | Corporate bank transfer support where approved. | Stripe's UAE page lists cards, Apple Pay, Google Pay and Link, and no bank transfer method. See `payment-providers.md`. This is a provider gap, not a code gap. | Provider question | 8C |
| C-24 | Single payment for a multi-seller cart (P4-5) with Stripe Connect. | UAE platforms can use only Custom connected accounts, with destination charges or separate charges and transfers. A multi-seller cart needs separate charges and transfers. Under that model disputes and refunds are taken from the platform balance first, so the platform must recover them through transfer reversals. **Recommendation:** ask Stripe to confirm. If unsupported, limit live checkout to one seller per payment, as docs/08-finance.md already requires. | Provider question | 8C |

## No conflict

These decisions already match the code:
- 15-minute reservation (D11).
- 72-hour quote payment deadline (A05).
- Dual finance approval on refunds and payouts.
- Signed, idempotent provider events.
- The ledger in integer fils.
- "Escrow" is not used anywhere in the product. It appears only in docs, as a prohibition.
- No subscription billing (`FEATURE_SUBSCRIPTIONS=false`).
- Free registration and free RFQ access: no paid gate exists.
- Exports with MFA step-up and audit.
- Configurable retention with deletion disabled.
