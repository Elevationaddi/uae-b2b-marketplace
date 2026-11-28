# Phase 5 schema: fulfilment, disputes, refunds, payouts, reviews
Migration (additive only: new enums, enum values, tables, columns, indexes, constraints and triggers; nothing dropped or rewritten):
- `20261201000000_phase5_fulfilment_settlement`

## Enums
- New values: `PaymentState` PARTIALLY_REFUNDED, REFUNDED; `ReconciliationKind` REFUND_FAILED, PAYOUT_FAILED; `FilePurpose` DELIVERY_PROOF, DISPUTE_EVIDENCE.
- `SettlementState`: NOT_ELIGIBLE, ELIGIBLE, HELD, IN_PAYOUT, PAID_OUT.
- `ShipmentState`: DISPATCHED, DELIVERED.
- `DisputeState`: OPEN, UNDER_REVIEW, AWAITING_EVIDENCE, RESOLUTION_PROPOSED, RESOLVING, CLOSED. `DisputeType`: NOT_RECEIVED, DAMAGED, WRONG_ITEMS, QUANTITY_SHORT, QUALITY, OTHER. `DisputeProposal`: NO_ACTION, REFUND.
- `RefundState`: REQUESTED, APPROVED, REJECTED, SUBMITTED, SUCCEEDED, FAILED.
- `PayoutState`: REQUESTED, APPROVED, REJECTED, PENDING, PAID, FAILED.
- `ReviewState`: PUBLISHED, HIDDEN.
- `MockPspOperationKind` (REFUND, PAYOUT) and `MockPspOperationState` (OPEN, SUCCEEDED, FAILED): sandbox adapter only.

## Columns added
- `orders.settlement_state` (default NOT_ELIGIBLE), `orders.refunded_fils` (CHECK 0 ≤ refunded ≤ total), `orders.processing_at`, `dispatched_at`, `delivered_at`, `completed_at` (UTC).

## Tables
| Table | Purpose | Key constraints |
|---|---|---|
| `shipments` | One shipment per order: carrier, tracking reference, expected date, dispatch and delivery times, delivery note, optional proof file | `order_id` unique (one shipment per order, P5-1); FK to `files` for proof |
| `shipment_items` | Quantity per order line in the shipment | unique (shipment, order line); quantity > 0 |
| `disputes` | Number `DSP-…` (sequence `dispute_number_seq`), order, opener and side, type, reason, state, assigned admin, proposal and amount, resolution, version | partial unique index: one non-CLOSED dispute per order; side ∈ BUYER/SELLER; proposal amount only with a REFUND proposal |
| `dispute_messages` | Messages and evidence (BUYER, SELLER, ADMIN, SYSTEM) | append-only: UPDATE, DELETE and TRUNCATE rejected by trigger |
| `refunds` | Number `RFD-…`, order, payment, optional dispute, amount, commission share, reason, requester, approver, decision reason, provider reference, failure code, timestamps | amount > 0, 0 ≤ commission ≤ amount, AED; `approved_by_id <> requested_by_id` (T28); `provider_ref` unique |
| `payouts` | Number `PAY-…`, seller workspace and company, amount, requester, approver, provider reference, failure code, paid time | amount > 0, AED; `approved_by_id <> requested_by_id`; `provider_ref` unique |
| `payout_allocations` | Amount per order in a payout | unique (payout, order); amount > 0; append-only |
| `reviews` | One per completed order: rating, comment, buyer and seller workspaces, state, hidden reason and moderator | `order_id` unique; rating 1–5; no self-review; trigger rejects changes to rating, comment, order or parties and rejects DELETE (moderation changes state only) |
| `mock_psp_operations` | Sandbox stand-in for provider refunds and payouts (`rf_…`/`po_…`), with a queued signed-webhook outbox | `idempotency_key` unique (one provider operation per refund/payout) |

## Ledger journals (no schema change; `ledger_journals.dedupe_key` keeps them exactly-once)
- `refund:<refund id>` on provider confirmation: credit `psp_clearing` by the refund amount; debit `platform_fee_revenue` by the commission share and `seller_payable` by the rest.
- `payout:<payout id>` on provider paid event: debit `seller_payable`, credit `psp_clearing` by the payout amount.

## Diagram
```
orders 1─1 shipments 1─* shipment_items *─1 order_lines
orders 1─* disputes 1─* dispute_messages ─(file)→ files
orders 1─* refunds *─1 payments            refunds *─0..1 disputes
payouts 1─* payout_allocations *─1 orders
orders 1─0..1 reviews
refunds/payouts ─(provider_ref)→ mock_psp_operations (sandbox only)
```
