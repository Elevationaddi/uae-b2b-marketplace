# Database schema and migrations — Phase 1

Source of truth: `packages/db/prisma/schema.prisma`. Migrations are reviewed SQL in `packages/db/prisma/migrations`.

| Migration | Kind | Destructive? |
|---|---|---|
| `20261127000000_baseline` (Phase 0) | empty baseline | no |
| `20261127200000_phase1_identity_verification` | 17 tables, 19 enums, indexes, constraints, triggers | **no** (additive only; no existing data touched) |

`prisma migrate diff` between the schema and the migration history was empty after the migration was written
(no drift). All primary keys are UUIDs; all timestamps are `timestamptz` stored in UTC; licence dates are `date`.
Foreign keys use `ON DELETE RESTRICT` throughout: nothing cascades away audit-relevant history.

## Tables

| Table | Purpose | Key rules |
|---|---|---|
| `users` | Company users and platform admins (`account_type`) | email unique, stored lower-case (CHECK); Argon2id hash; `email_verified_at`; admin TOTP secret AES-256-GCM encrypted; `mfa_enabled` |
| `sessions` | Server-side sessions (`scope` COMPANY / ADMIN) | only SHA-256 of the token stored; absolute + idle expiry; `mfa_verified_at`; `revoked_at` |
| `user_tokens` | One-time tokens: VERIFY_EMAIL (24h), RESET_PASSWORD (1h) | hash only; `used_at` makes them single-use |
| `mfa_recovery_codes` | 10 admin recovery codes | hash of `user_id:code`; `used_at` |
| `companies` | Legal entity | unique (`licence_issuer`, `licence_number`); `status` DRAFT→…→APPROVED/SUSPENDED; `suspension_kind` LICENCE_EXPIRED/COMPLIANCE; `version` for optimistic concurrency; `licence_reminder_for` dedupes the 30-day reminder; `terms_version`/`terms_accepted_at` |
| `workspaces` | BUYER and/or SELLER side of a company | unique (company, kind); `status` PENDING / ACTIVE / RESTRICTED |
| `memberships` | User ↔ workspace with role | unique (workspace, user); `status` ACTIVE / REVOKED; trigger rejects platform admins |
| `invitations` | Email invitation with role (7 days) | token hash only; email normalised (CHECK); state PENDING/ACCEPTED/REVOKED/EXPIRED |
| `verification_cases` | INITIAL or RENEWAL review | partial unique index: **one active case per company**; `proposed` licence for renewals; `reason`; assigned admin |
| `verification_case_events` | State timeline | **append-only** (trigger) |
| `files` | Private object metadata | `object_key` unique; `sha256` hex CHECK; `bytes > 0` CHECK; `scan_state` PENDING/CLEAN/INFECTED; `visibility` PRIVATE; owner company |
| `verification_documents` | Case ↔ file with type (TRADE_LICENCE, AUTHORIZED_REPRESENTATIVE, OTHER) and optional expiry | |
| `admin_memberships` | Platform staff roles (COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN) | unique (user, role); `active` |
| `audit_events` | Security and business audit log | **append-only**: UPDATE/DELETE/TRUNCATE rejected by triggers (T32); secrets redacted before insert |
| `outbox` | Transactional outbox for emails | written in the same transaction as the change; worker delivers with `FOR UPDATE SKIP LOCKED`, retries with backoff, dead-letters after 8 attempts, clears the payload after delivery; `dedupe_key` unique |

Phase 0 tables: none (baseline only). No tables were added for features outside Phase 1.

## Hand-written SQL in the migration
- `users_email_normalised`, `invitations_email_normalised` CHECK constraints.
- `memberships_reject_admin` trigger: a PLATFORM_ADMIN user can never hold a company membership (A03).
- `verification_cases_one_active` partial unique index on `company_id` where state is DRAFT/SUBMITTED/UNDER_REVIEW/NEEDS_INFO/REJECTED.
- `files_bytes_positive`, `files_sha256_hex` CHECK constraints.
- `reject_mutation()` function with `audit_events_append_only`, `audit_events_no_truncate` and
  `verification_case_events_append_only` triggers.

## Applying
`pnpm db:migrate` (deploy) in every environment. The seed (`pnpm db:seed`) is development-only and refuses production.
Rollback strategy for this migration: it is purely additive, so rolling back the application leaves the tables unused;
dropping them would destroy audit history and requires explicit founder approval (CLAUDE.md).
