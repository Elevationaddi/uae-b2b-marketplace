# Phase 4 schema: addresses, cart, checkout, orders, payments, ledger
Migrations (additive only: new enums, enum values, tables, columns, indexes, constraints and triggers; nothing dropped or rewritten):
- `20261130000000_phase4_checkout_orders`
- `20261130000001_phase4_stock_movement_kinds` (`StockMovementKind` gains RESERVE, RELEASE_RESERVATION, SALE)
- `20261130000002_phase4_ledger_no_truncate` (BEFORE TRUNCATE triggers on the ledger and order timeline)

## Enums
- `CheckoutState`: PENDING_PAYMENT, PAID, EXPIRED, CANCELLED, RECONCILIATION_REQUIRED.
- `CheckoutSource`: CART, QUOTE.
- `OrderState`: AWAITING_PAYMENT, CONFIRMED, PROCESSING, DISPATCHED, DELIVERED, COMPLETED, CANCELLED (fulfilment states beyond CONFIRMED are Phase 5).
- `ReservationState`: HELD, CONSUMED, RELEASED.
- `PaymentState`: CREATED, PENDING, CAPTURED, FAILED, CANCELLED.
- `PaymentEventStatus`: RECEIVED, PROCESSED, IGNORED, QUARANTINED.
- `ReconciliationKind`: LATE_CAPTURE, AMOUNT_MISMATCH, UNKNOWN_REFERENCE, INVALID_SIGNATURE. `ReconciliationState`: OPEN, RESOLVED.
- `MockPspSessionState`: OPEN, CAPTURED, FAILED, CANCELLED (sandbox adapter only).

## Columns added
- `storefronts.delivery_fee_fils`, `delivery_emirates`, `delivery_days` (P4-1), CHECK fee ≥ 0 and days 0–365.

## Tables
| Table | Purpose | Key constraints |
|---|---|---|
| `addresses` | Buyer workspace delivery addresses (UAE emirate), archived not deleted | FK workspace |
| `cart_items` | One line per (buyer workspace, SKU) | unique (workspace, sku); quantity > 0 |
| `checkouts` | Number `CHK-…` (sequence `checkout_number_seq`), source CART or QUOTE, buyer, address snapshot, totals, tax/commission bps, pay-by, reservation expiry, PO reference | `total = merchandise + shipping + tax`, AED only; source consistency (QUOTE ⇒ rfq and quote version, no reservation; CART ⇒ reservation expiry); `rfq_id` and `quote_version_id` unique |
| `orders` | One per seller per checkout: number `ORD-…`, buyer and seller workspace/company, totals, commission, seller payable, state, cancel reason | `total = merchandise + shipping + tax`; `seller_payable = total − commission`; `buyer_company_id <> seller_company_id` (T42) |
| `order_lines` | Immutable price snapshot (title, SKU, variant, unit, quantity, unit price, line total) | `line_total = unit_price × quantity`; trigger rejects UPDATE/DELETE |
| `order_events` | Append-only order timeline | trigger rejects UPDATE/DELETE/TRUNCATE |
| `reservations` | Stock held per (checkout, SKU) | unique (checkout, sku); quantity > 0 |
| `payments` | Payment attempts: provider, provider reference, amount, state, failure code, idempotency key | `provider_ref` and `idempotency_key` unique; amount > 0, AED |
| `payment_events` | Verified provider events, stored once | unique (provider, event_id) |
| `ledger_journals` | Double-entry journal header with a dedupe key (`capture:<paymentId>`) | `dedupe_key` unique; append-only |
| `ledger_entries` | Debit or credit lines (accounts `psp_clearing`, `seller_payable`, `platform_fee_revenue`, `unallocated_receipts`) | exactly one side > 0; deferred constraint trigger: every journal has ≥ 2 lines and balances; append-only, no TRUNCATE |
| `reconciliation_cases` | Finance follow-up (late capture, amount mismatch, unknown reference, invalid signature) | state OPEN/RESOLVED |
| `mock_psp_sessions` | Sandbox hosted-page sessions (development only) | `idempotency_key` unique |

## Concurrency and integrity
- Checkout creation locks the buyer workspace, re-prices, compares the preview hash and reserves stock with conditional `UPDATE … WHERE on_hand - reserved >= qty` in SKU order, so concurrent buyers cannot oversell (T11).
- Payment event processing locks the event (`FOR UPDATE SKIP LOCKED`), then the payment and checkout. Capture is applied once: stock consumed, checkout PAID, orders CONFIRMED, one journal via the unique dedupe key (T15). A capture after the checkout expired or was cancelled posts to `unallocated_receipts` and opens a LATE_CAPTURE case; nothing is fulfilled (T18).
- Money is `BIGINT` fils throughout; all amounts are computed server-side with half-up rounding.
