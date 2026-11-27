# Acceptance criteria and test matrix
Use unit (money, tiers, state guards), integration (real PostgreSQL transactions, permissions, webhook processing), and Playwright browser E2E. Test adapters must be explicitly selected. Every row below is a mandatory test scenario for its relevant phase; add tests for each route and role capability. Record test commands, actual outcomes and evidence in implementation status.

| ID | Given / when | Then |
|---|---|---|
| T01 | Unverified user attempts marketplace purchase | 403; no order/reservation |
| T02 | Owner submits complete clean docs; compliance approves | workspace active, audit, notice |
| T03 | Missing or infected licence upload | submission rejected; no public download |
| T04 | Company A guesses company B order/file ID | 404; no data leakage in export/search/realtime |
| T05 | Revoked membership uses old session | access denied immediately |
| T06 | Owner removes last owner | 409; membership unchanged |
| T07 | Seller creates listing with invalid MOQ/tier | 422; clear field errors |
| T08 | Listing pending/rejected | absent from buyer search; approved old version remains on edit |
| T09 | Quantity below MOQ | checkout blocked |
| T10 | Quantity crosses tier threshold | correct server price; client totals ignored |
| T11 | Two buyers race for last stock | only one reservation succeeds; stock nonnegative |
| T12 | Price changes after preview | 409 with fresh review; no silent charge |
| T13 | Multi-seller checkout | one order per seller, sums match payment, isolated visibility |
| T14 | Buyer returns from PSP without webhook | pending; seller cannot fulfil |
| T15 | Valid capture webhook replayed 3 times | one capture/ledger/stock deduction/notice |
| T16 | Invalid signature or amount mismatch | reject/quarantine; no paid order |
| T17 | Expired reservation with unresolved PSP | retained/quarantined; no oversell |
| T18 | Late capture after cleared reservation | reconciliation case; no automatic fulfilment |
| T19 | Invite-only RFQ accessed by noninvitee | 404 including attachments |
| T20 | Seller attempts competitor quote read | 404 |
| T21 | Buyer accepts superseded/expired quote | 409, no order |
| T22 | Concurrent acceptance of two quotes | exactly one award and checkout |
| T23 | Seller attempts edit accepted quote | 409; immutable snapshot |
| T24 | Unpaid order ship attempt | rejected |
| T25 | Seller ships and submits proof; buyer confirms | timeline correct; eligible payout not paid automatically |
| T26 | Seller tries confirm buyer receipt | 403 |
| T27 | Dispute opens before settlement | eligibility held; case visible to participants |
| T28 | Refund requester self-approves | 403; no PSP request |
| T29 | Refund exceeds remaining capture | 422/409; no ledger mutation |
| T30 | Refund webhook duplicate/out of order | provider-consistent state and one reversal |
| T31 | Payout failure | no paid label; reconciliation alert |
| T32 | Audit log attempted edit by admin | prohibited |
| T33 | Arabic/mobile checkout | RTL correct; no clipping, totals identical |
| T34 | Network failure on form submission | recoverable error; fields preserved; retry safe |
| T35 | Seller licence expires | new trades restricted; existing orders accessible |
| T36 | User opts out marketing | marketing suppressed; critical notices retained |
| T37 | Backup restore | restored DB passes schema and transaction consistency checks |
| T38 | Missing live provider settings on production | trading disabled/startup fails; no mock fallback |
| T39 | Review on unpaid order or duplicate | rejected |
| T40 | Payment/ledger fixture in finance doc | totals and balanced journals exact |
| T41 | CSV export by support outside assigned scope | denied and audited |
| T42 | Buyer and seller same company | self-trade rejected |

Nonfunctional targets (proposed): p95 catalog/API read <500ms under 50 concurrent sandbox users excluding external latency; no unbounded list queries; accessibility keyboard and automated checks; no critical/high exploitable security findings before launch. Load test reservation and award races. Test browser Chromium and Safari-compatible WebKit; mobile widths. Manual UAT with fictional buyer, seller and compliance/finance/support roles. Production release blocked by failed mandatory test or unresolved monetary/security defect. No claim of certification from tests alone.
