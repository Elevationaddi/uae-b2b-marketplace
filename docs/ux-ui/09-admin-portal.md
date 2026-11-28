# 9. Administration portal

Served from the separate admin origin; routes `/{locale}/admin/…`. Sign-in requires password + TOTP (enrolment with 10 recovery codes on first sign-in). Navigation (`apps/web/src/components/admin-shell.tsx`) is filtered by capability; each page re-checks on the server. Admin is **desktop-first** but must remain usable on tablets and phones for urgent actions (approvals, dispute replies).

Common admin patterns:
- **Queue pages**: filter row (state, assignee, search), table with oldest-first default, pagination by cursor, empty state.
- **Detail pages**: header with status badge and primary action, description list, timeline/audit, right-side panel for decisions.
- **Decision dialogs**: radio decision + mandatory reason (except approvals where allowed), consequence text, audit note "Recorded in the audit log".
- **Dual control**: the requester sees "You requested this; another finance user must decide." and has no approve button; approver sees requester and request time.
- **Sandbox**: finance pages show a "Sandbox" pill; sandbox simulators (ADM-53) are visible only in mock mode.

| Requested area | Screens | Status | Tables / metrics / actions | Approval / permissions |
|---|---|---|---|---|
| Executive dashboard | ADM-01 | Implemented (operations overview) | Company pipeline KPIs, queues, commerce figures for a Dubai date range | Commerce only with `admin.finance.read` |
| Platform analytics | ADM-52 | Recommended | GMV trend, active companies, RFQ conversion, category performance | New capability needed (proposed: SUPER_ADMIN, FINANCE read-only) |
| User management | ADM-08, ADM-09 | Implemented | Users table (email, type, verified, memberships, sessions); revoke sessions with reason | users.read / revoke_sessions |
| Buyer management / manufacturer management | ADM-05, ADM-06, ADM-07 | Implemented (companies, filter by kind in table) | Companies table (name, kinds, status, licence number, expiry); detail with workspaces, members, cases; suspend/reactivate | companies.read / suspend (COMPLIANCE) |
| Business verification | ADM-02, ADM-03, ADM-04 | Implemented | Queue; case with documents (audited download), history; decision approve / needs info / reject (reason) | verification.review |
| Product moderation | ADM-10…ADM-16 | Implemented | Overview, queue oldest first, version diff, decision; listings search; suspend / restore / remove | catalog.read / review / enforce |
| Storefront oversight | ADM-17…ADM-19 | Implemented (detail page planned) | Storefronts table; hide/restore with reason | catalog.enforce |
| Category management | ADM-20…ADM-22 | Implemented | Tree, restriction, image, attributes; reason to hide/archive/change restriction | categories.manage |
| Restricted terms, featured | ADM-23, ADM-24 | Implemented | Terms; featured placements with schedule | restricted.manage / featured.manage |
| RFQ management / quotation management | ADM-25…ADM-27 | Implemented (metadata only) | RFQs table; detail with quote states (never quote contents); hide/unhide | rfqs.read / moderate |
| Order management | ADM-28, ADM-29 | Implemented | Orders table; full detail incl. commission and payable | orders.read |
| Transaction management | ADM-30 | Implemented (read-only) | Payment attempts, ledger balances | finance.read |
| Commission management | ADM-56 | Implemented (PR #13) | Current rate and version, history with reason and actor; planned effective date and 30-day supplier notice | FINANCE_APPROVER with TOTP step-up and reason (FD-05) |
| Settlement holds | ADM-57, ADM-58 | Implemented (PR #13) | Place and release Compliance, Fraud, Reconciliation and Payment investigation holds per order | COMPLIANCE, FINANCE, FINANCE_APPROVER |
| VAT status confirmation | ADM-54 | Implemented (PR #14) | Confirm a company's declared VAT status and TRN with a reason | verification.review |
| Support limit exceptions | ADM-55 | Implemented (PR #16) | Per-company limit (1–100) with reason; default 10 open tickets | support.manage |
| Delivery proof review | ADM-59 | Planned (FD-03) | Queue of contested or suspicious delivery claims; accept, reject or ask for evidence | Proposed admin.delivery.review (SUPPORT, COMPLIANCE) |
| Refund management | ADM-32…ADM-34 | Implemented (sandbox); request form Partial | Refunds table; request; approve/reject | refunds.request / approve |
| Payout management | ADM-35…ADM-37 | Implemented (sandbox; weekly run, PR #13) | This week's run (Monday–Sunday, Dubai), eligible suppliers, available provider balance; request; approve/reject with hold and balance re-checks | payouts.request / approve (two different people, FD-01) |
| Dual-approval workflows | ADM-34, ADM-37, ADM-31 | Implemented for refunds, payouts and reconciliation resolution | Requester ≠ approver enforced by server | FD-01 answered: one requester and one different approver, no self-approval |
| Dispute management | ADM-38…ADM-40 | Implemented | Queue (all, assigned to me), detail, assign, request evidence, propose, close, message | disputes.read / manage |
| Support tickets | ADM-42, ADM-43 | Implemented | Queue; take, reply, resolve, reopen | support.read / manage |
| Financial reporting | ADM-44, ADM-30 | Implemented | Scoped CSV exports with reason + TOTP; 24-hour download | reports.export |
| Reconciliation | ADM-30, ADM-31 | Implemented (PR #13) | Cases by kind; Resolve with reason; held orders re-evaluated | FINANCE_APPROVER resolves |
| Audit logs | ADM-45 | Implemented | Time, actor, action, resource, reason, request ID | audit.read |
| Role management / permission management | ADM-46 | Implemented (roles only) | Staff table; edit roles with reason; last super-admin protected | staff.manage |
| Platform settings | ADM-47, ADM-48 | Planned | Payout schedule (Monday 10:00 Dubai, holidays, minimum 0), dispute window 14 days, ticket auto-close 7 days; delivery settings live with each supplier (SEL-04) | Proposed: FINANCE_APPROVER with TOTP for payout settings; SUPER_ADMIN for windows |
| Security controls | AUTH-10…AUTH-13, ADM-09, ADM-46, ADM-44 | Implemented | MFA, recovery codes, session revocation, step-up for exports | — |
| System health and webhooks | ADM-49 (background tasks on ADM-01) | Recommended; task health implemented (PR #15) | Integrations, quarantined webhooks; background tasks with last run, next run, Overdue and Failing states | New capability needed (proposed: SUPER_ADMIN; FINANCE for payment webhooks) |
| Tax configuration | ADM-50 | Blocked (TAX_TREATMENT is a deployment setting since PR #14) | VAT, supplier TRN status, invoicing | Tax adviser (FD-06) |
| Data requests, closure, legal hold | ADM-51 | Planned | DSAR queue, closure, holds | Legal |
| Supplier review moderation | ADM-41 | Implemented | Reviews table; hide/unhide with reason; admin sees buyer identity | reviews.moderate |

## 9.1 Admin overview (ADM-01) detail
- Header: "Operations", signed-in roles, recovery codes remaining warning when low.
- Company KPIs: Draft companies, Awaiting review, Under review, Waiting on company, Approved companies, Suspended companies, Licences expiring in 30 days, Unverified emails, Company users.
- Queues: Open disputes, Unassigned disputes, Open support tickets, Unassigned tickets, Open reconciliation cases, Quarantined webhooks (7 days), Refunds awaiting approval, Payouts awaiting approval.
- Background tasks (PR #15): task, last finished, next run, and state Running / Not run yet / Overdue / Failing ({count} in a row).
- Commerce (finance roles): Paid orders, Gross order value, Refunded, Net of refunds, Platform fees (net), Owed to sellers now, Paid out to sellers; note "Figures for {from} to {to}. Owed to sellers is the balance right now."; sandbox note.
- Period form: From / To (Dubai dates), Show.

## 9.2 Approval mechanism specification (for designers)
1. Request created → row shows "Awaiting approval", requester name and time.
2. Approver opens dialog: summary (amount AED, target, linked order/dispute), decision buttons Approve / Reject, reason (required to reject).
3. The requester's view has no decision buttons and shows the self-approval note.
4. After approval: "Sent to provider" until the provider confirms (sandbox simulator in development), then "Refunded" / "Paid by provider", or "Failed" which opens a reconciliation case.
