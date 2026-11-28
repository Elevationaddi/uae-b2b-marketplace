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
| Commission management | ADM-47 | Planned | Rate, effective date, history | New restricted capability, dual control (FD-05) |
| Refund management | ADM-32…ADM-34 | Implemented (sandbox); request form Partial | Refunds table; request; approve/reject | refunds.request / approve |
| Payout management | ADM-35…ADM-37 | Implemented (sandbox, manual) | Eligible suppliers; payouts; request; approve/reject | payouts.request / approve |
| Dual-approval workflows | ADM-34, ADM-37 (+ADM-31, ADM-47 planned) | Implemented for refunds and payouts | Requester ≠ approver enforced by server | FD-01 on "two approvers" |
| Dispute management | ADM-38…ADM-40 | Implemented | Queue (all, assigned to me), detail, assign, request evidence, propose, close, message | disputes.read / manage |
| Support tickets | ADM-42, ADM-43 | Implemented | Queue; take, reply, resolve, reopen | support.read / manage |
| Financial reporting | ADM-44, ADM-30 | Implemented | Scoped CSV exports with reason + TOTP; 24-hour download | reports.export |
| Reconciliation | ADM-30, ADM-31 | Partial (cases listed, no resolution) | Cases by kind | finance.read; resolution capability not defined yet (proposed: FINANCE requests, FINANCE_APPROVER approves) |
| Audit logs | ADM-45 | Implemented | Time, actor, action, resource, reason, request ID | audit.read |
| Role management / permission management | ADM-46 | Implemented (roles only) | Staff table; edit roles with reason; last super-admin protected | staff.manage |
| Platform settings | ADM-47, ADM-48 | Planned | Commission, windows, limits, delivery methods | New capability needed (FD-05 recommends SUPER_ADMIN plus a finance approver; pending founder decision) |
| Security controls | AUTH-10…AUTH-13, ADM-09, ADM-46, ADM-44 | Implemented | MFA, recovery codes, session revocation, step-up for exports | — |
| System health and webhooks | ADM-49 | Recommended | Integrations, quarantined webhooks, queues | New capability needed (proposed: SUPER_ADMIN; FINANCE for payment webhooks) |
| Tax configuration | ADM-50 | Blocked | VAT, supplier TRN status, invoicing | Tax approval |
| Data requests, closure, legal hold | ADM-51 | Planned | DSAR queue, closure, holds | Legal |
| Supplier review moderation | ADM-41 | Implemented | Reviews table; hide/unhide with reason; admin sees buyer identity | reviews.moderate |

## 9.1 Admin overview (ADM-01) detail
- Header: "Operations", signed-in roles, recovery codes remaining warning when low.
- Company KPIs: Draft companies, Awaiting review, Under review, Waiting on company, Approved companies, Suspended companies, Licences expiring in 30 days, Unverified emails, Company users.
- Queues: Open disputes, Unassigned disputes, Open support tickets, Unassigned tickets, Open reconciliation cases, Quarantined webhooks (7 days), Refunds awaiting approval, Payouts awaiting approval.
- Commerce (finance roles): Paid orders, Gross order value, Refunded, Net of refunds, Platform fees (net), Owed to sellers now, Paid out to sellers; note "Figures for {from} to {to}. Owed to sellers is the balance right now."; sandbox note.
- Period form: From / To (Dubai dates), Show.

## 9.2 Approval mechanism specification (for designers)
1. Request created → row shows "Awaiting approval", requester name and time.
2. Approver opens dialog: summary (amount AED, target, linked order/dispute), decision buttons Approve / Reject, reason (required to reject).
3. The requester's view has no decision buttons and shows the self-approval note.
4. After approval: "Sent to provider" until the provider confirms (sandbox simulator in development), then "Refunded" / "Paid by provider", or "Failed" which opens a reconciliation case.
