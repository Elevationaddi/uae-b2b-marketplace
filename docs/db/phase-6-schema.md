# Phase 6 schema: support tickets, report exports, marketing consent
Migration (additive only: new enums, a sequence, tables, columns, indexes, constraints and triggers; nothing dropped or rewritten):
- `20261202000000_phase6_support_exports`

## Enums
- `SupportTicketState`: OPEN, ASSIGNED, WAITING_CUSTOMER, RESOLVED, CLOSED.
- `SupportCategory`: ACCOUNT, VERIFICATION, ORDER, PAYMENT, RFQ, CATALOG, OTHER.
- `ExportState`: READY, EXPIRED.

## Columns added
- `notification_preferences.email_marketing` (boolean, default false: opt-in) and `notification_preferences.marketing_consent_at` (UTC; set on opt-in, cleared on opt-out).

## Sequence
- `support_ticket_number_seq` (starts at 1001) for ticket numbers `SUP-001001`.

## Tables
| Table | Purpose | Key constraints |
|---|---|---|
| `support_tickets` | Number, workspace and company, opener, category, subject, state, optional linked order and RFQ, assigned admin, version, last customer/admin activity, resolved and closed times | `number` unique; subject 1–160 characters; FKs to workspaces, companies, users, orders, rfqs (RESTRICT); indexes on (workspace, created), (state, created), (assigned admin, state) |
| `support_messages` | Conversation (CUSTOMER, ADMIN, SYSTEM) | body 1–4000 characters; side CHECK; append-only: UPDATE, DELETE and TRUNCATE rejected by trigger |
| `export_jobs` | Who exported which report, scope, Dubai date filters, reason, row count, CSV bytes, SHA-256, state, expiry, download time | scope ∈ assigned/all; rows ≥ 0; CHECK: an EXPIRED row has no content; indexes on (requester, created) and (state, expiry) |

## Retention
- `export.cleanup` (worker, every 10 minutes) sets READY exports past `expires_at` (24 hours) to EXPIRED and deletes their content. The row and the `export.created` / `export.downloaded` / `export.denied` audit events stay.

## Diagram
```
workspaces 1─* support_tickets 1─* support_messages
support_tickets *─0..1 orders        support_tickets *─0..1 rfqs
users 1─* export_jobs (requested_by)  audit_events ← export.created / downloaded / denied
```
