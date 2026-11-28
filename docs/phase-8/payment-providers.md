# Payment provider comparison and eligibility checklist (D05)

**Date:** 2026-11-28 (UTC).

**Status:** research only. No account has been opened, no credentials requested and no API called. Facts come from the providers' public pages on the date above (sources at the end). Anything marked **unconfirmed** must be confirmed in writing by the provider before the 8C integration is finalised.

**Founder decision:** Stripe Connect is preferred, subject to entity eligibility and settlement model. Mamo is the alternative. The arrangement must never be described as escrow unless the provider and legal advisers approve that term. Customer funds never pass through the platform's ordinary corporate bank account.

## Side-by-side

| Requirement | Stripe Connect (UAE platform) | Mamo |
|---|---|---|
| UAE platform supported | Yes: "UAE platform with UAE connected accounts" | Yes, UAE company |
| Connected account model | **Custom connected accounts only**, for UAE platforms | Not documented publicly; "Marketplace payout APIs" on Growth and Premium plans |
| Charge model for marketplaces | Destination charges, or separate charges and transfers. Destination charges with `on_behalf_of` are "not yet supported for UAE platforms". | "Split funds between sellers and the platform"; split rules configurable |
| Multi-seller cart, one payment (P4-5) | Possible only with separate charges and transfers. **Unconfirmed** for UAE: ask Stripe. | **Unconfirmed** |
| AED primary currency | Yes (UAE account currency AED). Minimum charge AED 2.00. | Yes; settlement in AED (or USD per a third-party page) |
| Credit and debit cards | Visa, Mastercard | Visa, Mastercard, American Express, mada, Jaywan |
| Apple Pay | Yes (also Google Pay, Link) | Yes (also Google Pay, Tabby) |
| Corporate bank transfer (pay-in) | **Not listed** for the UAE | **Not stated** (payouts by bank transfer only) |
| Seller onboarding and KYC by the provider | Yes. Risk-based KYC. Valid UAE trade licence required. Business types: sole establishment, free zone establishment, LLC, free zone LLC and branches. Individuals without a licence are not supported. | Merchant KYC/AML stated in general. A vendor onboarding flow is **not documented**. |
| Automatic commission | Yes: application fee (destination) or the platform keeps the difference (separate charges and transfers) | "Configure complex commission rules" (deduction mechanics unconfirmed) |
| Weekly scheduled payouts | Payout timing control included. Weekly schedules and manual payouts exist in Connect generally. UAE delay limits **unconfirmed**. | "Trigger and schedule recurring payouts" through the API |
| Hold until 14-day dispute window + dual approval | Platform-controlled: transfer or payout only after our eligibility rules (manual payouts). Maximum balance hold period **unconfirmed**. | Platform-controlled through the payout API. Hold limits **unconfirmed**. |
| Full and partial refunds | Yes | "Chargeback and refund management". Partial refunds **unconfirmed**. |
| Chargeback management | Yes. Dispute API and evidence submission. | Listed as a feature, with no detail |
| Loss liability | Stripe states UAE connected accounts where the platform is liable for unrecovered losses cannot be created, so Stripe covers connected account losses. With separate charges and transfers the dispute hits the platform balance first, and recovery is by transfer reversal. **Confirm.** | **Unconfirmed** |
| Signed webhooks, idempotency | Yes (signed events, idempotency keys) | Webhooks **not mentioned** on the public pages |
| Reconciliation | Balance transactions, payout reconciliation reports | **Unconfirmed** |
| Regulation and safeguarding | Licensed provider. Funds held by Stripe. | Client funds "held with RAKBANK", segregated, audited yearly. CBUAE licence number **not shown**. |

## Fees (public list prices, excluding VAT, negotiable at volume)

| Item | Stripe (UAE) | Mamo Growth (AED 0/month) | Mamo Premium (AED 99/month, ≥ AED 50k/month volume) |
|---|---|---|---|
| UAE cards | From 2.9% + AED 1 | 2.9% + AED 1 | 2.7% + AED 0.80 |
| International cards | 3.9% + AED 1 (third-party source, **unconfirmed** on Stripe's page) | 3.4% + AED 1 | 3.2% + AED 0.80 |
| Currency conversion | +1% (third-party source) | +2% | +1.5% |
| Connected account fee | AED 7.50 per monthly active account (accounts that received a payout that month) | — | — |
| Payout fee | 0.25% + AED 5.50 per payout | AED 5 per UAE payout | AED 5 per UAE payout |
| Instant payouts | 1% of volume | Same-day settlement +0.75% | +0.5% |
| Dispute or chargeback fee | **Unconfirmed** | **Unconfirmed** | **Unconfirmed** |
| Settlement period | **Unconfirmed** for the UAE | 5 business days | 5 business days |

### Worked example
Assumptions:
- AED 500,000 per month merchandise and delivery charged.
- 400 card payments, all UAE cards.
- 40 active suppliers, each paid once a week (160 payouts).

| | Stripe | Mamo Premium |
|---|---|---|
| Card fees | 2.9% × 500,000 + 400 × AED 1 = AED 14,900 | 2.7% × 500,000 + 400 × AED 0.80 = AED 13,820 |
| Account fees | 40 × AED 7.50 = AED 300 | AED 99 plan |
| Payout fees | 0.25% × ~AED 450,000 + 160 × AED 5.50 = AED 2,005 | 160 × AED 5 = AED 800 |
| **Total** | **~AED 17,205 (3.4% of volume)** | **~AED 14,719 (2.9%)** |

The 10% commission (D04) is on merchandise excluding VAT and delivery. Provider fees are a platform cost unless the supplier agreement passes them on, which is a decision for legal and commercial review.

## Eligibility checklist (to complete with each provider before 8C)

Each item needs a written answer from the provider. Tick only when the answer is in writing.

**Entity and model**
- [ ] Our UAE legal entity (licence type, free zone or mainland, activity codes) is eligible for a marketplace platform account.
- [ ] Marketplace/platform model approved in underwriting for B2B wholesale goods in the A09 categories, including any restricted categories.
- [ ] Confirm the charge model for a multi-seller cart paid in one payment (Stripe: separate charges and transfers for UAE platforms). If not available, we limit live checkout to one seller per payment.
- [ ] Confirm that the arrangement is not described as escrow, and the exact wording we may use: "payments processed by [provider]; seller payouts released after the dispute window".
- [ ] Confirm that customer funds are held by the provider or its safeguarding bank, never in our corporate account.

**Payment methods**
- [ ] AED settlement and AED pricing.
- [ ] Cards: Visa, Mastercard. Amex and mada if offered.
- [ ] Apple Pay domain verification for our production domain.
- [ ] Corporate bank transfer pay-in: is it available? (Stripe UAE lists none.) If not, what does the provider recommend for invoices above card limits?

**Seller onboarding**
- [ ] Provider-hosted onboarding for UAE suppliers: required documents, trade licence, beneficial owners, bank account verification.
- [ ] Which statuses and webhooks tell us a seller can receive transfers and payouts.
- [ ] Onboarding of manufacturers and branches. Free zone entities.

**Payouts**
- [ ] Manual or scheduled payouts per connected account. Weekly schedule with platform-controlled release.
- [ ] Longest time funds may sit on the platform or connected balance before payout. This must cover delivery time plus the 14-day window.
- [ ] Minimum payout amount, payout fees, bank cut-off times, AED bank rails.
- [ ] Holding a payout for a dispute, compliance hold or insufficient balance.

**Refunds, disputes, liability**
- [ ] Full and partial refunds to the original payment method. Refund window limits.
- [ ] Chargeback fees, evidence process and timelines.
- [ ] Who bears the loss when a seller cannot repay (Stripe states the provider for UAE connected accounts). How transfer reversals work.
- [ ] Negative balance handling on connected accounts.

**Integration and operations**
- [ ] Signed webhooks (signature scheme, secret rotation), retry policy, event ordering, idempotency keys.
- [ ] Test mode with test credentials for staging (8C). No live keys until 8H approval.
- [ ] Reconciliation reports and API for balance transactions, payouts and fees.
- [ ] Data residency of payment data. DPA. PCI DSS responsibility split (we use hosted fields or checkout only, so SAQ A).
- [ ] Contract terms: fees, reserves, rolling reserve, termination, settlement currency.

## Recommendation
Proceed with Stripe Connect as the founder prefers, in test mode only, once the checklist answers above are in.

Two gaps need written answers first:
1. **Corporate bank transfer** is not listed for the UAE.
2. **One payment for a multi-seller cart** depends on separate charges and transfers being approved for our account.

Mamo is cheaper at list prices. However, its public pages do not document vendor KYC onboarding, webhooks, signed events or its licence, so it cannot be assessed further without a sales conversation.

Today the sandbox provider is called from the checkout, payment webhook and settlement services (`apps/api/src/commerce`, `apps/api/src/fulfilment`, `packages/db/src/settlement.ts`). Its events already go through signed, idempotent processing into the ledger. In 8C those calls will be pulled behind one provider adapter interface, so that Stripe (or Mamo) can be added without changing ledger posting rules.

## Sources (read 2026-11-28)
- Stripe, Connect availability in the UAE: https://support.stripe.com/questions/connect-availability-in-the-uae
- Stripe, payment methods and products in the UAE: https://support.stripe.com/questions/which-payments-methods-and-products-are-available-in-the-uae
- Stripe, Connect pricing (UAE): https://stripe.com/ae/connect/pricing
- Third-party Stripe UAE fee summary (international card rate, unconfirmed): https://doany.ai/tools/stripe-fee-calculator/united-arab-emirates
- Mamo, marketplaces: https://www.mamopay.com/industry/marketplaces
- Mamo, payouts: https://www.mamopay.com/business/payouts
- Mamo, pricing: https://www.mamopay.com/pricing
- PaySelect, Mamo profile (third party): https://www.payselect.ae/providers/mamo
