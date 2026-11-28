# 13. Financial experience

> **Everything financial runs in sandbox mode.** The only payment adapter is the labelled sandbox (`PAYMENT_MODE=mock`): "Sandbox payments: no real money. Payments in this environment use a labelled test adapter. No card is charged and no money moves." Production refuses to start without a configured live provider. Live payments (Stripe Connect preferred, Mamo fallback), payout onboarding, bank transfer, invoices and production email are **blocked** pending founder approval of Phase 8 and professional tax approval. Designers must show the sandbox label on every money screen in non-production builds and design the live states as separate variants.

Money rules (CLAUDE.md): integer **fils** with currency **AED**; the server is authoritative for every price, tax and total; display uses `formatFils` with `en-AE` / `ar-AE` (e.g. "AED 1,234.50" and "‏1,234.50 د.إ.‏"). Never show computed client totals.

## 13.1 Screen map

| Topic | Screens | Status |
|---|---|---|
| Checkout | BUY-17 | Implemented (sandbox) |
| Order pricing breakdown | BUY-24 (buyer), SEL-28 (seller), ADM-29 (admin) | Implemented |
| Platform commission | SEL-28, SEL-32, ADM-29, ADM-30, ADM-56 | Implemented (versioned policy, PR #13); 30-day supplier notice planned (FD-05) |
| Payment processing | BUY-18, FIN-01 (sandbox), FIN-02 (live, blocked), FIN-03 (bank transfer, blocked) | Implemented / Blocked |
| Payment confirmations | BUY-18 "Payment confirmed" | Implemented |
| Failed payments | BUY-18 "The last payment attempt did not go through ({code}). You can try again." | Implemented |
| Payment history | BUY-18 (per checkout); BUY-29 consolidated | Implemented / Recommended |
| Invoice drafts | BUY-37 (also SEL-28, ADM-29) | Implemented (non-binding, PR #14) |
| Invoices, receipts | BUY-28, SEL-34, ACC-17, ADM-50 | Blocked (tax adviser, FD-06) |
| Manufacturer earnings, pending and available balances | SEL-32 | Implemented as settlement buckets; payout day Monday 10:00 Dubai (FD-04) |
| Payout requests and approvals | ADM-35, ADM-36, ADM-37 | Implemented (sandbox; weekly run, PR #13) |
| Settlement holds | ADM-57, ADM-58 | Implemented (PR #13) |
| Payout schedule settings | ADM-47 | Planned (FD-04) |
| Payout account | SEL-33 | Blocked |
| Refund requests and approvals | ADM-32, ADM-33, ADM-34 | Implemented (sandbox) |
| Financial exports | ADM-44 | Implemented |
| Transaction history | ADM-30 payments; ledger | Implemented (read-only) |
| Financial audit trails | ADM-45, order/dispute timelines | Implemented |
| Reconciliation | ADM-30 (cases), ADM-31 (resolution) | Implemented (PR #13) |
| Tax and VAT presentation | BUY-17, BUY-24, SEL-22, ACC-19, ADM-54 | Implemented by confirmed supplier VAT status (PR #14); professional approval pending (FD-06) |
| Delivery charges | SEL-04, BUY-35 | Partial (flat fee today; per emirate being built, FD-08) |

## 13.2 Checkout pricing breakdown (BUY-17)
Per supplier group: Items (merchandise), Delivery (today a flat fee per order; with FD-08 the fee for the address emirate, AED 0 for collection, or the charge agreed in the quotation, BUY-35), Tax, Total, return policy; grand total for all suppliers; "This creates {count} order(s), one per supplier, paid in one payment."; "Stock is held for 15 minutes while you pay." Tax is computed by the server per supplier on merchandise + delivery using the tax code. Since PR #14 the VAT line follows the supplier's confirmed VAT status: "Standard rate (supplier VAT registered)", "No VAT (supplier not registered)" or, in development, "Provisional standard rate"; suppliers whose VAT status is not confirmed block checkout with "This supplier's VAT registration has not been confirmed yet…". The buyer also accepts the current terms version (FD-16, ACC-18). Do not hardcode a rate in the design; show the server value.

## 13.3 Order breakdown by role
- **Buyer (BUY-24):** lines, delivery, tax, total, refunded so far. No commission figures (API omits them).
- **Seller (SEL-28):** same plus "Platform commission" and "Payable to supplier", settlement state.
- **Admin (ADM-29):** all of the above plus payments, refunds, payouts.

## 13.4 Platform commission presentation
Commission is a versioned policy (PR #13, P8-6): 10% by default of merchandise value excluding VAT and delivery, snapshotted on each order with its policy version. Only a finance approver can record a new rate, with a reason and an authenticator code (ADM-56); FD-05 adds 30 days' advance notice to suppliers before a new rate takes effect (planned: effective date and notice status on ADM-56, notice in-app and by email). Sellers see "Platform commission", the rate and the version on order detail and the invoice draft; buyers never see commission. Refunds reverse commission on the merchandise part only.

## 13.5 Payment processing states (BUY-18, `CheckoutState` and `PaymentState`)
- Checkout: Awaiting payment (PENDING_PAYMENT), Paid (PAID), Expired (EXPIRED), Cancelled (CANCELLED), Under finance review (RECONCILIATION_REQUIRED).
- Payment attempt: Created, With provider (PENDING), Captured, Failed, Cancelled, Partly refunded, Refunded.
- Messages: "Waiting for payment confirmation. We confirm the order only when the payment provider confirms the payment. This page updates automatically." / "Payment confirmed. The supplier has been notified. Track each order from Orders." / "The payment window passed, so the orders were cancelled and stock released." / "This checkout was cancelled and the stock released." / "A payment arrived after this checkout closed. Our finance team is reviewing it and will contact you."
- Max 5 payment attempts per checkout.

## 13.6 Seller earnings and balances (SEL-32)
Tiles: Paid order value, Platform commission, Refunded to buyers, Net payable. Buckets: Not yet eligible (awaiting verified delivery and the end of the dispute window), Eligible for payout, Held (dispute, hold, reconciliation or pending refund), In payout, Paid out. Payouts table: number, amount, state, paid at. Show "Next payout run: Monday {date}, 10:00 (Dubai time)" (next working day after UAE public holidays) and "Payouts are approved by our finance team. Nothing is paid automatically." No minimum payout at launch (FD-04).

## 13.7 Refunds (ADM-32…ADM-34)
Flow: request (FINANCE) → approve/reject (FINANCE_APPROVER, a different person) → Sent to provider → Refunded / Failed. Amount ≤ remaining refundable; if linked to a dispute, ≤ proposed amount and dispute must be in Resolution proposed with a Refund proposal. Ledger changes only on provider confirmation. Commission share is reversed and shown per refund ("Commission share"). Full refund before dispatch cancels the order.

## 13.8 Payouts (ADM-35…ADM-37) and holds (ADM-57)
Weekly run (PR #13, FD-04): every Monday at 10:00 Dubai time, or the next working day after a UAE public holiday, the scheduler opens the run for the previous Monday–Sunday week; it only creates the run, finance approval is never bypassed. FINANCE requests one payout per supplier (all eligible orders); a different FINANCE_APPROVER approves after re-checking holds, order changes and the available provider balance (FD-01) → Sent to provider → Paid by provider / Failed (creates a PAYOUT_FAILED case). No minimum payout at launch, subject to provider limits. Holds of type Compliance, Fraud, Reconciliation or Payment investigation stop a single order's payout until released with a reason.

## 13.9 Ledger and transaction history (ADM-30)
"Operational ledger for marketplace balances, not statutory accounting." Accounts: Payment provider clearing, Payable to suppliers, Platform commission, Unallocated receipts (suspense); debits and credits. Payment attempts table with buyer, checkout, created, amount, state, sandbox pill.

## 13.10 Reconciliation (ADM-30, ADM-31)
Case kinds: Captured after checkout closed (LATE_CAPTURE), Amount or currency mismatch, Unknown payment reference, Rejected webhook signature, Refund failed at provider, Payout failed at provider. States OPEN / RESOLVED. A finance approver resolves a case with a reason (ADM-31, PR #13); orders it held are re-evaluated for payout.

## 13.11 Financial exports (ADM-44)
Reports: Orders, Refunds, Payouts, Disputes, Support tickets; scope Assigned to me / All records ("Finance reports cover all records. Support may export only disputes and tickets assigned to them."); Dubai date range ≤366 days; reason; authenticator code; ≤50,000 rows; download only by the creator within 24 hours; every attempt audited.

## 13.12 Invoices, drafts and VAT status
The disclosed-intermediary model is confirmed (FD-06); the tax adviser is pending. Under it the **supplier** issues the tax invoice to the buyer and the **platform** invoices the supplier for commission; credit notes on refunds; TRNs displayed; no VAT for unregistered suppliers. Built so far: company VAT status and TRN declared by the company (ACC-19) and confirmed by compliance (ADM-54); VAT at checkout follows the confirmed status; a non-binding invoice draft per order ("Draft for review only. This is not a tax invoice…", BUY-37) with a commission draft for sellers and admins ("VAT on the commission is pending professional advice"). Binding invoice lists and PDFs (BUY-28, SEL-34, ADM-50) stay blocked.

## 13.13 Audit trail
Every refund/payout decision, export and admin action writes an audit event (time, actor, action, resource, reason, request ID) visible in ADM-45; order and dispute timelines show the business events.
