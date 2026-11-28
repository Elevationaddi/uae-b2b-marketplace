# 16. Statuses and system states (master reference)

Every status below exists in `packages/db/prisma/schema.prisma` (or, for invitations, in `packages/contracts/src/team.ts` as a derived state). Labels are the current English UI strings (`apps/web/src/i18n/*`). **No status has been invented.** Semantic badge tone refers to the colour system in section 28.4; every badge also carries text and an icon.

Tone key: N neutral, I info, P pending/processing, S success/completed, W warning, D danger/rejected, X cancelled/closed, V verified.

## 16.1 Accounts and access
| Entity | Status (enum) | Label | Meaning | Changed by | Transitions | Tone |
|---|---|---|---|---|---|---|
| User | ACTIVE | Active | Can sign in | System | → DISABLED | S |
| User | DISABLED | Disabled | Cannot sign in | Platform (no UI today) | — | X |
| Membership | ACTIVE / REVOKED | Active / (removed) | Access to a workspace | Owner (remove access) | ACTIVE → REVOKED | S / X |
| Invitation (derived) | PENDING, ACCEPTED, REVOKED, EXPIRED | "This invitation is no longer valid ({state})" | 7-day token | Owner (revoke), invitee (accept), time (expire) | PENDING → ACCEPTED/REVOKED/EXPIRED | P, S, X, X |
| Workspace | PENDING | Pending verification | Company not approved; trading capabilities removed | System on company decision | → ACTIVE | P |
| Workspace | ACTIVE | Active | Trading allowed | System on approval / reactivation | → RESTRICTED | S |
| Workspace | RESTRICTED | Restricted | Suspended company; read-only | System on suspension | → ACTIVE | W |

## 16.2 Business verification
| Status | Label | Meaning | Changed by | Next | Visible actions | Tone |
|---|---|---|---|---|---|---|
| DRAFT | Draft | Company created, not submitted | Owner | SUBMITTED | Edit, upload, submit | N |
| SUBMITTED | Submitted | Waiting for compliance | Owner (submit) | UNDER_REVIEW | View only | P |
| UNDER_REVIEW | Under review | Compliance assigned | COMPLIANCE (start review) | APPROVED / NEEDS_INFO / REJECTED | View only | P |
| NEEDS_INFO | More information needed | Compliance asked for changes | COMPLIANCE | SUBMITTED | Edit, resubmit | W |
| REJECTED | Rejected | Not approved; reason shown | COMPLIANCE | SUBMITTED (resubmit) | Edit, resubmit | D |
| APPROVED | Approved | Verified; workspaces ACTIVE | COMPLIANCE | SUSPENDED | Trading | V |
| SUSPENDED | Suspended | `LICENCE_EXPIRED` (worker after expiry) or `COMPLIANCE` (admin) | Worker / COMPLIANCE | APPROVED (renewal or reactivation) | Renew licence; contact support | D |
| CLOSED (verification case only) | Closed | Case superseded/closed | System | — | — | X |

Verification cases have kind INITIAL or RENEWAL and use the same states. Documents carry a scan state: PENDING "Scanning", CLEAN "Scanned: clean", INFECTED "Blocked: malware detected".

## 16.3 Catalogue
| Entity | Status | Label | Meaning | Changed by | Tone |
|---|---|---|---|---|---|
| Product | DRAFT | Draft | Never approved | Seller | N |
| Product | PUBLISHED | Published | Live (approved version) | System on approval / seller republish / admin restore | S |
| Product | UNPUBLISHED | Unpublished | Hidden by seller | Seller | N |
| Product | SUSPENDED | Suspended | Hidden by admin with reason | COMPLIANCE | D |
| Product | ARCHIVED | Archived | Retired by seller; restorable | Seller | X |
| Product | REMOVED | Removed | Removed by admin; irreversible for seller | COMPLIANCE | D |
| Version | DRAFT, PENDING_REVIEW, APPROVED, REJECTED, CHANGES_REQUESTED, SUPERSEDED, WITHDRAWN | Draft, Pending review, Approved, Rejected, Changes requested, Superseded, Withdrawn | Moderation of a content version | Seller (submit, withdraw), COMPLIANCE (decide), system (supersede) | N, P, S, D, W, X, X |
| Storefront | DRAFT / PUBLISHED (+ admin hidden flag) | Not live / Live / Hidden by the marketplace team | Public profile | Seller; COMPLIANCE hides | N / S / D |
| Category restriction | OPEN, REVIEW_REQUIRED, BLOCKED | — | Listing rules per category | COMPLIANCE, SUPER_ADMIN | S, W, D |
| Review | PUBLISHED / HIDDEN | Published / Hidden | Buyer review visibility | COMPLIANCE | S / X |

## 16.4 RFQs and quotations
See section 11.12 for diagrams.
| Entity | Status | Label | Changed by | Tone |
|---|---|---|---|---|
| RFQ | DRAFT | Draft | Buyer | N |
| RFQ | OPEN | Open | Buyer (publish) | I |
| RFQ | AWARDED | Awarded | Buyer (accept) | S |
| RFQ | CANCELLED | Cancelled | Buyer | X |
| RFQ | EXPIRED | Expired | Worker | X |
| Quote | DRAFT | Draft | Seller | N |
| Quote | SUBMITTED | Submitted | Seller | I |
| Quote | ACCEPTED | Accepted | Buyer | S |
| Quote | DECLINED | Declined | Buyer / system on award | D |
| Quote | WITHDRAWN | Withdrawn | Seller | X |
| Quote | EXPIRED | Expired | Worker | X |
| Quote version | + SUPERSEDED | Superseded | System on revision | X |
| RFQ type (planned) | STANDARD, SAMPLE | Request for quotation, Sample request | Buyer (FD-13) | N / I |
| Counteroffer (planned) | OPEN, ANSWERED, DECLINED, EXPIRED | Waiting for supplier (round {n} of 3), Answered with a revision, Declined, Expired | Buyer, supplier, system (FD-10) | P, S, D, X |

## 16.5 Checkout, orders and payments
| Entity | Status | Label | Changed by | Tone |
|---|---|---|---|---|
| Checkout | PENDING_PAYMENT | Awaiting payment | System | P |
| Checkout | PAID | Paid | Webhook | S |
| Checkout | EXPIRED | Expired | Worker (deadline) | X |
| Checkout | CANCELLED | Cancelled | Buyer | X |
| Checkout | RECONCILIATION_REQUIRED | Under finance review | Webhook (late capture) | W |
| Order | AWAITING_PAYMENT, CONFIRMED, PROCESSING, DISPATCHED, DELIVERED, COMPLETED, CANCELLED | Awaiting payment, Confirmed, Processing, Dispatched, Delivered, Completed, Cancelled | See section 12.2 | P, I, P, I, I, S, X |
| Payment | CREATED | Created | System | N |
| Payment | PENDING | With provider | Provider | P |
| Payment | CAPTURED | Captured | Webhook | S |
| Payment | FAILED | Failed | Webhook | D |
| Payment | CANCELLED | Cancelled | System | X |
| Payment | PARTIALLY_REFUNDED | Partly refunded | Refund success | W |
| Payment | REFUNDED | Refunded | Refund success | X |
| Settlement | NOT_ELIGIBLE, ELIGIBLE, HELD, IN_PAYOUT, PAID_OUT | Not yet eligible, Eligible for payout, Held, In payout, Paid out | System (P8-2: eligible only after verified delivery and the end of the dispute window, with no dispute, hold, reconciliation case or pending refund) | N, S, W, P, S |
| Delivery verification (order fields) | Not verified / verified by proof of delivery / verified by buyer receipt | "Delivery verified {date} (proof of delivery \| buyer confirmed receipt)" | Seller proof or buyer, whichever first (P8-1, FD-03) | N / V |
| Dispute window (derived) | Starts when delivery is verified / Open until {date} / Ended {date} | as shown | System | N / I / X |
| Order hold (`OrderHoldKind`) | COMPLIANCE, FRAUD, RECONCILIATION, PAYMENT_INVESTIGATION; active or released | Compliance, Fraud, Reconciliation, Payment investigation | COMPLIANCE, FINANCE, FINANCE_APPROVER (ADM-57) | W |
| Supplier cancellation (order fields) | Requested / approved (order CANCELLED) / rejected | "Cancellation requested on {date}: {reason}…" | Seller, then finance approver | W |
| Buyer cancellation request (planned) | OPEN, ACCEPTED, ACCEPTED_PARTIAL, DECLINED | Cancellation requested, Accepted, Accepted with deduction, Declined | Buyer, then supplier (SEL-41) | W, S, W, D |
| Shipment | DISPATCHED / DELIVERED | Dispatched / Delivered | Seller | I / S |
| Stock reservation | HELD, CONSUMED, RELEASED | (internal) | System | — |

## 16.6 Refunds and payouts
| Entity | Status | Label | Changed by | Next | Tone |
|---|---|---|---|---|---|
| Refund | REQUESTED | Awaiting approval | FINANCE | APPROVED / REJECTED | P |
| Refund | APPROVED | Approved | FINANCE_APPROVER (≠ requester) | SUBMITTED | I |
| Refund | REJECTED | Rejected | FINANCE_APPROVER | — | D |
| Refund | SUBMITTED | Sent to provider | System | SUCCEEDED / FAILED | P |
| Refund | SUCCEEDED | Refunded | Provider | — | S |
| Refund | FAILED | Failed | Provider | (reconciliation case) | D |
| Payout | REQUESTED | Awaiting approval | FINANCE | APPROVED / REJECTED | P |
| Payout | APPROVED | Approved | FINANCE_APPROVER | PENDING | I |
| Payout | REJECTED | Rejected | FINANCE_APPROVER | — | D |
| Payout | PENDING | Sent to provider | System | PAID / FAILED | P |
| Payout | PAID | Paid by provider | Provider | — | S |
| Payout | FAILED | Failed | Provider | (reconciliation case) | D |

## 16.7 Disputes
| Status | Label | Meaning | Changed by | Tone |
|---|---|---|---|---|
| OPEN | Open | Raised by buyer or seller; payout held | Party | W |
| UNDER_REVIEW | Under review | Support assigned / party replied | SUPPORT, system | P |
| AWAITING_EVIDENCE | Awaiting evidence | Support asked both parties | SUPPORT | W |
| RESOLUTION_PROPOSED | Resolution proposed | No financial action or refund amount proposed | SUPPORT | I |
| RESOLVING | Refund in progress | Refund requested against the dispute | FINANCE | P |
| CLOSED | Closed | Closed with no action or after refund confirmation | SUPPORT / system | X |

Dispute types: Not received, Damaged goods, Wrong items, Short quantity, Quality issue, Other. Proposal: No financial action, Refund.

## 16.8 Support tickets
| Status | Customer label | Admin label | Changed by | Tone |
|---|---|---|---|---|
| OPEN | Open | Open | Customer | I |
| ASSIGNED | With support | With support | Agent takes | P |
| WAITING_CUSTOMER | Waiting for you | Waiting for customer | Agent | W |
| RESOLVED | Resolved | Resolved | Agent | S |
| CLOSED | Closed | Closed | Customer | X |

## 16.9 Operations
| Entity | Statuses | Labels |
|---|---|---|
| Company VAT registration (`VatRegistrationStatus`) | UNKNOWN, REGISTERED, NOT_REGISTERED; confirmed or not | Not stated, Registered for VAT, Not registered for VAT; "Confirmed by compliance on {date}" / "Not yet confirmed by compliance" |
| Commission policy | Versions 1…n (append-only) | "Policy version {version}" or "From configuration" |
| Weekly payout run (derived) | Week Monday–Sunday (Dubai); run opens Monday 10:00 | "This week's payout run" |
| Background task | Running, Not run yet, Overdue, Failing ({count} in a row) | ADM-01 task health (PR #15) |
| Support ticket limit | Default (10) / Exception | "{open} open of {limit} allowed" |
| Export | READY, EXPIRED | Ready, Expired |
| Reconciliation case | OPEN, RESOLVED | (kinds in section 13.10) |
| Payment webhook event | RECEIVED, PROCESSED, IGNORED, QUARANTINED | Internal; "Quarantined webhooks (7 days)" count on ADM-01 |
| Outbox (email) | PENDING, DONE, DEAD | Internal |
| Policy acceptance (planned, FD-16) | Accepted version per user and policy | Re-acceptance required after a material change |
