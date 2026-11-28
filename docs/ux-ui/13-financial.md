# 13. Financial experience

> **Everything financial runs in sandbox mode.** The only payment adapter is the labelled sandbox (`PAYMENT_MODE=mock`): "Sandbox payments: no real money. Payments in this environment use a labelled test adapter. No card is charged and no money moves." Production refuses to start without a configured live provider. Live payments (Stripe Connect preferred, Mamo fallback), payout onboarding, bank transfer, invoices and production email are **blocked** pending founder approval of Phase 8 and professional tax approval. Designers must show the sandbox label on every money screen in non-production builds and design the live states as separate variants.

Money rules (CLAUDE.md): integer **fils** with currency **AED**; the server is authoritative for every price, tax and total; display uses `formatFils` with `en-AE` / `ar-AE` (e.g. "AED 1,234.50" and "‏1,234.50 د.إ.‏"). Never show computed client totals.

## 13.1 Screen map

| Topic | Screens | Status |
|---|---|---|
| Checkout | BUY-17 | Implemented (sandbox) |
| Order pricing breakdown | BUY-24 (buyer), SEL-28 (seller), ADM-29 (admin) | Implemented |
| Platform commission | SEL-28, SEL-32, ADM-29, ADM-30, ADM-47 | Partial (env rate; admin setting planned) |
| Payment processing | BUY-18, FIN-01 (sandbox), FIN-02 (live, blocked), FIN-03 (bank transfer, blocked) | Implemented / Blocked |
| Payment confirmations | BUY-18 "Payment confirmed" | Implemented |
| Failed payments | BUY-18 "The last payment attempt did not go through ({code}). You can try again." | Implemented |
| Payment history | BUY-18 (per checkout); BUY-29 consolidated | Implemented / Recommended |
| Invoices, receipts | BUY-28, SEL-34, ACC-17, ADM-50 | Blocked (tax approval) |
| Manufacturer earnings, pending and available balances | SEL-32 | Implemented as settlement buckets; "available on" dates pending FD-04 |
| Payout requests and approvals | ADM-35, ADM-36, ADM-37 | Implemented (sandbox, manual) |
| Payout account | SEL-33 | Blocked |
| Refund requests and approvals | ADM-32, ADM-33, ADM-34 | Implemented (sandbox) |
| Financial exports | ADM-44 | Implemented |
| Transaction history | ADM-30 payments; ledger | Implemented (read-only) |
| Financial audit trails | ADM-45, order/dispute timelines | Implemented |
| Reconciliation | ADM-30 (cases), ADM-31 (resolution) | Partial / Planned |
| Tax and VAT presentation | BUY-17, BUY-24, SEL-22 | Partial (model pending) |

## 13.2 Checkout pricing breakdown (BUY-17)
Per supplier group: Items (merchandise), Delivery (flat fee per order from supplier delivery terms), Tax, Total; grand total for all suppliers; "This creates {count} order(s), one per supplier, paid in one payment."; "Stock is held for 15 minutes while you pay." Tax is computed by the server per supplier on merchandise + delivery using the tax code. Pending the tax decision, design the tax line to support: VAT 5% (if that is the approved standard rate), "Zero-rated", "Exempt" and "Supplier not VAT registered" with the supplier TRN shown when registered. Do not hardcode a rate in the design; show the server value.

## 13.3 Order breakdown by role
- **Buyer (BUY-24):** lines, delivery, tax, total, refunded so far. No commission figures (API omits them).
- **Seller (SEL-28):** same plus "Platform commission" and "Payable to supplier", settlement state.
- **Admin (ADM-29):** all of the above plus payments, refunds, payouts.

## 13.4 Platform commission presentation
Show commission as a server-provided amount on the seller order and finance pages, labelled "Platform commission". Show the rate only if the API provides the order's snapshotted rate (not in the API today). The founder's 10% rule applies to merchandise excluding VAT and delivery; the current calculation must be confirmed against this before live launch (G-05, G-06).

## 13.5 Payment processing states (BUY-18, `CheckoutState` and `PaymentState`)
- Checkout: Awaiting payment (PENDING_PAYMENT), Paid (PAID), Expired (EXPIRED), Cancelled (CANCELLED), Under finance review (RECONCILIATION_REQUIRED).
- Payment attempt: Created, With provider (PENDING), Captured, Failed, Cancelled, Partly refunded, Refunded.
- Messages: "Waiting for payment confirmation. We confirm the order only when the payment provider confirms the payment. This page updates automatically." / "Payment confirmed. The supplier has been notified. Track each order from Orders." / "The payment window passed, so the orders were cancelled and stock released." / "This checkout was cancelled and the stock released." / "A payment arrived after this checkout closed. Our finance team is reviewing it and will contact you."
- Max 5 payment attempts per checkout.

## 13.6 Seller earnings and balances (SEL-32)
Tiles: Paid order value, Platform commission, Refunded to buyers, Net payable. Buckets: Not yet eligible (awaiting receipt), Eligible for payout, Held by disputes, In payout, Paid out. Payouts table: number, amount, state, paid at. Note: "Eligible orders are paid out by finance through the payment provider after dual approval. Nothing is paid automatically." Recommended for launch with weekly payouts: "Pending" (not yet eligible + held) and "Available for next payout on {date}" once FD-04 is decided.

## 13.7 Refunds (ADM-32…ADM-34)
Flow: request (FINANCE) → approve/reject (FINANCE_APPROVER, a different person) → Sent to provider → Refunded / Failed. Amount ≤ remaining refundable; if linked to a dispute, ≤ proposed amount and dispute must be in Resolution proposed with a Refund proposal. Ledger changes only on provider confirmation. Commission share is reversed and shown per refund ("Commission share"). Full refund before dispatch cancels the order.

## 13.8 Payouts (ADM-35…ADM-37)
Eligible suppliers list (completed, undisputed, not paid out). Request a payout of all eligible orders for one seller → approve/reject → Sent to provider → Paid by provider / Failed (creates PAYOUT_FAILED case). Founder target: weekly runs after the 14-day window, two finance approvers (FD-01, FD-04).

## 13.9 Ledger and transaction history (ADM-30)
"Operational ledger for marketplace balances, not statutory accounting." Accounts: Payment provider clearing, Payable to suppliers, Platform commission, Unallocated receipts (suspense); debits and credits. Payment attempts table with buyer, checkout, created, amount, state, sandbox pill.

## 13.10 Reconciliation (ADM-30, ADM-31)
Case kinds: Captured after checkout closed (LATE_CAPTURE), Amount or currency mismatch, Unknown payment reference, Rejected webhook signature, Refund failed at provider, Payout failed at provider. States OPEN / RESOLVED. No resolution tool exists (G-12).

## 13.11 Financial exports (ADM-44)
Reports: Orders, Refunds, Payouts, Disputes, Support tickets; scope Assigned to me / All records ("Finance reports cover all records. Support may export only disputes and tickets assigned to them."); Dubai date range ≤366 days; reason; authenticator code; ≤50,000 rows; download only by the creator within 24 hours; every attempt audited.

## 13.12 Invoices and receipts (blocked)
Under the founder's disclosed-intermediary model the **supplier** issues the tax invoice to the buyer and the **platform** invoices the supplier for commission; credit notes on refunds; TRNs displayed; no VAT for unregistered suppliers. None of this exists. Design list and PDF templates as blocked variants; do not label any current screen "invoice". A simple payment **receipt** (sandbox-labelled) could be offered earlier if the founder wants it.

## 13.13 Audit trail
Every refund/payout decision, export and admin action writes an audit event (time, actor, action, resource, reason, request ID) visible in ADM-45; order and dispute timelines show the business events.
