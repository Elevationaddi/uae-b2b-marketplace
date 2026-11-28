# Phase 3 schema: RFQs, quotes, messages, notifications
Migration `packages/db/prisma/migrations/20261129000000_phase3_rfq_quotes` (additive only: new enums, enum values, tables, indexes, constraints and triggers; nothing dropped or rewritten).

## Enums
- `FilePurpose` gains `RFQ_ATTACHMENT`, `QUOTE_ATTACHMENT`, `MESSAGE_ATTACHMENT`.
- `RfqState`: DRAFT, OPEN, AWARDED, CANCELLED, EXPIRED.
- `RfqVisibility`: POOL, INVITE.
- `QuoteState`: DRAFT, SUBMITTED, ACCEPTED, DECLINED, WITHDRAWN, EXPIRED.
- `QuoteVersionState`: DRAFT, SUBMITTED, SUPERSEDED, ACCEPTED, DECLINED, WITHDRAWN, EXPIRED.
- `TaxCode`: STANDARD, ZERO_RATED, EXEMPT.

## Tables
| Table | Purpose | Key constraints |
|---|---|---|
| `rfqs` | Buyer request: number (`RFQ-001001` from sequence `rfq_number_seq`), buyer workspace and company, title, category, specs, quantity, unit, target date, emirate, optional budget (fils), deadline (UTC), visibility, state, optimistic `version`, award fields, admin hide fields | `quantity > 0`; `budget_fils >= 0`; `rfqs_award_consistent` (AWARDED ⇔ accepted version and awarded_at set); `accepted_quote_version_id` unique |
| `rfq_invites` | Invited seller workspaces | unique (rfq, seller workspace) |
| `rfq_files` | Attachments (files must be scanned CLEAN to publish) | unique (rfq, file) |
| `quotes` | One per (rfq, seller workspace); state, optimistic `version`, `current_version_id` | unique (rfq, seller workspace); `current_version_id` unique |
| `quote_versions` | Immutable once submitted: quantity, unit, unit price, subtotal, shipping, tax code/bps/amount, total, specs, deviations, lead days, delivery date, validity, terms, state | money columns `>= 0`; `total = subtotal + shipping + tax`; unique (quote, version) |
| `quote_files` | Attachments per quote version (carried forward on revision) | unique (version, file) |
| `rfq_events` | Append-only timeline (kind, actor side, quote/version, reason) | trigger rejects UPDATE and DELETE |
| `conversations` | Buyer workspace ↔ seller workspace, optional RFQ | partial unique: one general conversation per pair, one per pair per RFQ |
| `messages` | Text (attachment column reserved) | `messages_body_or_file` CHECK |
| `read_receipts` | Last message read per user per conversation (never moves backwards) | unique (conversation, user) |
| `notifications` | In-app notifications (type, display payload incl. in-app path, read_at) | index (user, read_at, created_at) |
| `notification_preferences` | Email preferences per user (RFQs and quotes on, messages off by default) | user unique |
| `idempotency_keys` | Stored success responses for idempotent POSTs (accept), purged after 24 hours | unique (user, key) |

## Triggers
- `quote_versions_immutable`: a DRAFT version may change; an ACCEPTED version cannot change at all; any other non-draft version may change only its `state` (e.g. SUBMITTED → SUPERSEDED/EXPIRED).
- `quote_versions_no_delete`: versions are never deleted.
- `rfq_events_append_only`: timeline rows cannot be edited or deleted.

## Concurrency
Award, revise, withdraw, decline and expiry lock the RFQ row (`SELECT … FOR UPDATE`) inside the transaction; the unique `accepted_quote_version_id` makes a second award impossible even if a lock were bypassed.
