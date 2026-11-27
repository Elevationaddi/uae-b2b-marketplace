# Development test accounts (fictional, dev only)

Created by `pnpm db:seed`, which refuses to run in production. All companies, people and licence numbers are
fictional. Never reuse these credentials anywhere else.

**Password for every account:** `DevOnly-Passw0rd!`

## Company users — web origin http://localhost:3000

| Email | Company (status) | Workspace · role |
|---|---|---|
| `buyer.owner@falcon-trading.test` | Falcon Trading (APPROVED) | Buyer · Owner |
| `buyer.procurement@falcon-trading.test` | Falcon Trading | Buyer · Procurement |
| `buyer.viewer@falcon-trading.test` | Falcon Trading | Buyer · Viewer |
| `seller.owner@desert-pack.test` | Desert Packaging (APPROVED) | Seller · Owner |
| `seller.sales@desert-pack.test` | Desert Packaging | Seller · Sales |
| `seller.warehouse@desert-pack.test` | Desert Packaging | Seller · Warehouse |
| `seller.finance@desert-pack.test` | Desert Packaging | Seller · Finance |
| `seller.viewer@desert-pack.test` | Desert Packaging | Seller · Viewer |
| `dual.owner@oasis-textiles.test` | Oasis Textiles (SUBMITTED, sample PDFs uploaded) | Buyer · Owner and Seller · Owner |
| `draft.owner@palm-office.test` | Palm Office (DRAFT) | Buyer · Owner |
| `unverified@example.test` | none (email not verified) | — |

## Platform admins — admin origin http://admin.localhost:3000/en/admin

Admins cannot register publicly (A03). TOTP is mandatory (A02). The seeded admins have **fixed development TOTP
secrets** so a reviewer can sign in; add the secret to any authenticator app, or print the current code with
`pnpm dev:totp <email>`.

| Email | Role | Dev TOTP secret |
|---|---|---|
| `compliance@admin.test` | COMPLIANCE (reviews verification, suspends) | `JBSWY3DPEHPK3PXPCOMPLIAN` |
| `support@admin.test` | SUPPORT (read companies and users) | `JBSWY3DPEHPK3PXPSUPPORTA` |
| `finance@admin.test` | FINANCE (read companies; finance arrives later) | `JBSWY3DPEHPK3PXPFINANCEA` |
| `approver@admin.test` | FINANCE_APPROVER | `JBSWY3DPEHPK3PXPAPPROVER` |
| `superadmin@admin.test` | SUPER_ADMIN (staff roles, audit, users; no compliance approval) | `JBSWY3DPEHPK3PXPSUPERADM` |
| `new.admin@admin.test` | COMPLIANCE, **MFA not enrolled** (shows the enrolment flow once) | — |

New admins are provisioned only by an operator:
`ADMIN_INITIAL_PASSWORD='…' pnpm --filter @app/api admin:create <email> <ROLE> [full name]`.
Each TOTP code works once (replay protection), so wait for the next code when signing in twice within 30 seconds.

## Emails
All email goes to Mailpit at http://localhost:8025 with a `[SANDBOX]` subject prefix. Verification, reset and
invitation links carry the token in the URL fragment (`#token=…`), which never reaches server logs.
