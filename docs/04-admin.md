# Platform administration
Base `/admin`, dedicated admin authentication and MFA, no public registration. Admin roles assigned through audited privileged process. Never provide impersonation or unrestricted database editing.

| Route | Content | Actions and safeguards |
|---|---|---|
| /overview | GMV, fee revenue, companies, paid orders, open cases, webhook alerts | Date filters, drilldown; separate gross/net and pending/settled |
| /companies | Buyer/seller accounts, status, licences, expiry | Search, filter, view business record; suspend/reactivate with reason; do not delete historical transactions |
| /verification | Queue, evidence, reviewer notes, history | Approve, request info, reject; compliance only; exact reason + audit; sensitive files private |
| /users | Memberships, status, roles, invited users | Revoke access, investigate, reset sessions; no password viewing or silent impersonation |
| /catalog | Listing approval queue, reports, restricted items | Approve/reject/hide, reason and notify; remove visibility without deleting order history |
| /categories | Category tree, localized names, required attributes | Create/edit/archive; prevent cycles; archived category blocks new listings |
| /rfqs | RFQ reports and moderation | Hide abusive RFQ, review metadata; restricted access to private quotes/evidence only on assigned case |
| /orders | Order lookup, timeline, linked payments and shipments | Investigate, add notes, escalate; no arbitrary status override; exceptional transitions audited |
| /transactions | PSP references, payment status, failures, refund records | Read/reconcile, create refund request with reason; never mark paid manually |
| /payouts | Provider payout status, outstanding reconciliation, exceptions | Finance review, dual-approved permitted release/refund requests; no direct bank transfer |
| /disputes | Queue by priority, case ownership, evidence, deadlines | Assign, request evidence, propose resolution, escalate, close after confirmed financial result |
| /support | Tickets, assignments, response history | Reply, assign, escalate; avoid exposing confidential unrelated records |
| /logistics | Shipment status and delay exceptions | Review and contact seller; record corrections without overwriting original evidence |
| /plans | Versioned plans, limits and entitlements | Draft only until commercial approval; cannot retroactively alter purchases |
| /promotions | Featured placements and campaign dates | Phase 2; mark sponsored, approve content; no hidden ranking manipulation |
| /reports | Aggregated company/order/fee/case metrics | Scoped CSV exports, audit reason, time range, expiring download |
| /system | Integration health, webhook dead letters, feature flags | Retry idempotently, inspect redacted logs; disable trading if necessary |
| /audit | Actor, action, resource, timestamp, reason, request ID | Read-only, filter and export restricted; no edits/deletes through UI |
| /staff | Admin roles, status and access review | Super-admin grants/revokes, MFA mandatory; separate financial approval actor |

Admin roles: compliance handles verification/catalog; support handles assigned cases and limited order details; finance handles reconciliation and monetary requests; finance approver independently approves; super-admin manages roles/config but cannot bypass dual control. Every sensitive read/export and mutation logged. Require reason on status change, user suspension, rejection, refund or payout request. Confirm destructive actions. Show assigned queue and role-based navigation; API must independently enforce it.
