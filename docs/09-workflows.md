# State machines and invariants
Each transition is a server command, permission checked, atomic with audit/outbox. Generic PATCH status prohibited. Any unsupported transition returns 409. All expiries evaluated on server UTC.

| Aggregate | Allowed transition and trigger |
|---|---|
| Company verification | DRAFT→SUBMITTED owner; SUBMITTED→UNDER_REVIEW compliance; UNDER_REVIEW→APPROVED/NEEDS_INFO/REJECTED compliance reason; NEEDS_INFO/REJECTED→SUBMITTED owner; APPROVED→SUSPENDED compliance or licence expiry; SUSPENDED→APPROVED compliance after checks |
| Workspace | PENDING→ACTIVE approved company and eligible role; ACTIVE→RESTRICTED suspension; RESTRICTED→ACTIVE reapproval |
| Listing version | DRAFT→PENDING_REVIEW seller; PENDING_REVIEW→APPROVED/REJECTED compliance; rejected version replaced by new draft; approved listing→HIDDEN/ARCHIVED via authorized action; approved version preserved on pending edit |
| RFQ | DRAFT→OPEN buyer publish; OPEN→AWARDED buyer accepts current valid quote; OPEN→CANCELLED buyer; OPEN→EXPIRED worker at deadline; AWARDED terminal (new RFQ for re-sourcing) |
| Quote | DRAFT→SUBMITTED seller; SUBMITTED→SUPERSEDED old version on revision; current SUBMITTED→ACCEPTED/DECLINED buyer or WITHDRAWN seller or EXPIRED worker; request revision is event, not acceptance; accepted immutable |
| Checkout | PENDING_PAYMENT→PAID verified capture; PENDING_PAYMENT→EXPIRED/CANCELLED after confirmed provider noncapture; exceptional late capture→RECONCILIATION_REQUIRED |
| Reservation | HELD→CONSUMED confirmed capture; HELD→RELEASED verified failure/cancel/expiry with provider clearance |
| Order fulfilment | AWAITING_PAYMENT→CONFIRMED verified capture; CONFIRMED→PROCESSING seller; PROCESSING→DISPATCHED shipment; DISPATCHED→DELIVERED seller proof; DELIVERED→COMPLETED buyer confirmation; AWAITING_PAYMENT→CANCELLED cleared payment; paid cancellation via approved case and confirmed refund; disputed is separate case flag |
| Payment | CREATED→PENDING→CAPTURED/FAILED/CANCELLED provider; CAPTURED→PARTIALLY_REFUNDED→REFUNDED from confirmed refund; chargeback tracked separately and reconciled |
| Refund | REQUESTED→APPROVED/REJECTED independent approver; APPROVED→SUBMITTED worker; SUBMITTED→SUCCEEDED/FAILED provider; retry only with stable idempotency |
| Payout | INELIGIBLE→ELIGIBLE completed order/no active hold; ELIGIBLE→PENDING provider submission; PENDING→PAID/FAILED provider; HELD eligibility on open dispute where possible; no promise of provider reversal |
| Dispute | OPEN→UNDER_REVIEW assigned support; UNDER_REVIEW→AWAITING_EVIDENCE or RESOLUTION_PROPOSED; AWAITING_EVIDENCE→UNDER_REVIEW; RESOLUTION_PROPOSED→RESOLVING approved action or CLOSED no money action; RESOLVING→CLOSED confirmed provider outcome; failed action remains open |
| Support ticket | OPEN→ASSIGNED→WAITING_CUSTOMER/RESOLVED; WAITING_CUSTOMER→ASSIGNED response; RESOLVED→CLOSED or reopened by support |

## Wholesale rules
Available stock = on_hand - reserved. Quantity >= MOQ and respects unit increment. Applicable tier = highest threshold <= quantity. Tier thresholds unique, ascending, first equals MOQ; tier prices nonincreasing. At preview compute all amounts; on create checkout validate current listing, company eligibility, tax/shipping, SKU, stock and version inside transaction. Lock rows in stable order. Payment capture deducts on_hand and reserved together. Failed order releases reserved only. Stock adjustment cannot make reserved > on_hand. Custom listings never go into stock cart; use RFQ. Samples phase 2 unless offered as separate approved SKU.

RFQ pool visible only to verified sellers eligible by category; invited only to listed sellers. Attachments inherit RFQ scope. Buyer cannot see other buyers' RFQs; seller cannot see competitors' quotes. Quote total must be recomputed. Lock RFQ row to award exactly once, check current version, deadline and quote validity; create unpaid checkout with immutable accepted version. Reject own-company buyer/seller trades in MVP to avoid self-dealing. Payment window after acceptance is configurable, default 72 hours (A05), independent of the 15-minute stock reservation. If order expires require new RFQ; notify buyer. No post-accept edits; phase 2 change order requires both parties and explicit extra payment consent.

Delivery: MVP one shipment per seller order containing all items; verify shipment quantities. Seller delivery evidence is not buyer receipt; no automatic completion timer until policy approved. Late/damaged/missing goods create dispute. Existing orders remain accessible if company suspended. Seller cannot self-complete or mark paid. Admin cannot override payment from UI.

Review: only buyer member for completed order; one per order; no self-review. Licence expiry worker restricts new trading, emits notice and case; existing paid orders remain accessible and fulfilment allowed unless compliance explicitly blocks. No automatic refunds or payout on timeout without approved policy.
