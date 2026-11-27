# API reference (Phase 1)

Generated from the shared zod contracts; the machine-readable source is [`openapi.json`](openapi.json) (OpenAPI 3.1).
Regenerate with `pnpm --filter @app/contracts openapi`. A unit test fails if the file is stale, and an API
integration test fails if any served route is undocumented (or documented but not served).

## Conventions
- Base path `/api/v1`. Browsers call it on the web origin (or the admin origin for `/admin`), proxied to the API, so cookies stay first-party and host-only.
- Success: `{ "data": …, "meta": { "next_cursor": string|null } }`. Lists use cursor pagination (`limit`, `cursor`).
- Error: `{ "error": { "code", "message_key", "field_errors"?, "request_id" } }`. `message_key` is translated by the client; `field_errors` maps a field to a code such as `required`, `min`, `email`, `future`, `infected`.
- Sessions: opaque random token in an HttpOnly cookie (`sid` for company users, `asid` for admins; `__Host-` prefixed in production). Only a SHA-256 hash is stored. Company: 7 days absolute, 24h idle, SameSite=Lax. Admin: 8h absolute, 30 min idle, SameSite=Strict, rotated after MFA.
- CSRF: every POST/PATCH/DELETE needs `Origin` (or `Referer`) equal to the web origin (admin origin for `/admin/*`) **and** `X-CSRF-Token` equal to the `csrf` cookie (from `GET /auth/csrf`).
- Authorization is re-checked on every request from the database: membership, workspace status, role capability (docs/10-security.md matrix). Resources of another company return **404**, never 403.
- Timestamps are UTC ISO-8601; calendar dates (licence expiry) are `YYYY-MM-DD`.

Columns: **Auth** = session required; **CSRF** = token and origin checked; **Requires** = capability or role beyond membership.

## Health

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/health` | Liveness | public | no |  | 200 |  |
| `GET` | `/api/v1/health/ready` | Readiness (database, Redis) | public | no |  | 200 |  |

## Auth

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/auth/csrf` | Issue CSRF cookie and token (double submit) | public | no |  | 200 |  |
| `GET` | `/api/v1/public/config` | Public configuration: product name (A06), sandbox flag, upload limit | public | no |  | 200 |  |
| `POST` | `/api/v1/auth/register` | Register a company user. Always 202 (no account enumeration); sends verification email | public | yes |  | 202 | 403, 422, 429 |
| `POST` | `/api/v1/auth/verify-email` | Verify email with one-time token (24h) | public | yes |  | 200 | 403, 422, 429 |
| `POST` | `/api/v1/auth/resend-verification` | Resend verification email. Always 202 | public | yes |  | 202 | 403, 422, 429 |
| `POST` | `/api/v1/auth/login` | Sign in (company users). Sets session cookie; rotates session | public | yes |  | 200 | 401, 403, 422, 429 |
| `POST` | `/api/v1/auth/logout` | Sign out and revoke the current session | company session | yes |  | 200 | 401, 403 |
| `POST` | `/api/v1/auth/password-reset/request` | Request password reset email. Always 202 | public | yes |  | 202 | 403, 422, 429 |
| `POST` | `/api/v1/auth/password-reset/confirm` | Set a new password with one-time token (1h); revokes all sessions | public | yes |  | 200 | 403, 422, 429 |

## Account

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/me` | Current user, workspaces and effective capabilities | company session | no |  | 200 | 401 |
| `PATCH` | `/api/v1/me` | Update profile (name, preferred language) | company session | yes |  | 200 | 401, 403, 422 |
| `GET` | `/api/v1/me/sessions` | List active sessions | company session | no |  | 200 | 401 |
| `DELETE` | `/api/v1/me/sessions/{id}` | Revoke one session | company session | yes |  | 200 | 401, 403, 404 |
| `POST` | `/api/v1/me/sessions/revoke-others` | Revoke all other sessions | company session | yes |  | 200 | 401, 403 |
| `POST` | `/api/v1/me/password` | Change password; revokes other sessions | company session | yes |  | 200 | 401, 403, 422, 429 |

## Companies

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/companies` | Companies the caller is a member of | company session | no |  | 200 | 401 |
| `POST` | `/api/v1/companies` | Register a company (caller becomes owner of each requested workspace) | company session | yes |  | 200 | 401, 403, 409, 422, 429 |
| `GET` | `/api/v1/companies/{id}` | Company details | company session | no |  | 200 | 401, 404 |
| `PATCH` | `/api/v1/companies/{id}` | Edit legal details (DRAFT / NEEDS_INFO / REJECTED only; optimistic version) | company session | yes | company.manage | 200 | 401, 403, 404, 409, 422 |

## Verification

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/companies/{id}/verification` | Current verification case and history | company session | no |  | 200 | 401, 404 |
| `POST` | `/api/v1/companies/{id}/verification` | Submit or resubmit for verification (accepts terms version) | company session | yes | company.manage | 200 | 401, 403, 404, 409, 422 |
| `POST` | `/api/v1/companies/{id}/renewal` | Start licence renewal (APPROVED, or SUSPENDED for licence expiry) | company session | yes | company.manage | 200 | 401, 403, 404, 409, 422 |
| `POST` | `/api/v1/companies/{id}/documents` | Upload a verification document (PDF/PNG/JPEG; magic bytes sniffed; malware scanned; private storage) | company session | yes | company.manage | 200 | 401, 403, 404, 409, 422, 429, 503 |
| `DELETE` | `/api/v1/companies/{id}/documents/{documentId}` | Remove a document from an editable case | company session | yes | company.manage | 200 | 401, 403, 404, 409 |
| `GET` | `/api/v1/files/{id}/download` | Download a clean document (streamed after authorization; audited) | company session | no | legal_documents.read | 200 | 401, 403, 404 |

## Team

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/workspaces/{id}/members` | Workspace members | company session | no |  | 200 | 401, 404 |
| `GET` | `/api/v1/workspaces/{id}/invitations` | Workspace invitations (owners) | company session | no | role OWNER | 200 | 401, 403, 404 |
| `POST` | `/api/v1/workspaces/{id}/invitations` | Invite by email with a role valid for the workspace kind (7-day token) | company session | yes | role OWNER | 200 | 401, 403, 404, 409, 422, 429 |
| `DELETE` | `/api/v1/workspaces/{id}/invitations/{invitationId}` | Revoke a pending invitation | company session | yes | role OWNER | 200 | 401, 403, 404, 409 |
| `POST` | `/api/v1/invitations/preview` | Preview an invitation by token (public) | public | yes |  | 200 | 403, 422, 429 |
| `POST` | `/api/v1/invitations/accept` | Accept an invitation (signed-in user whose email matches) | company session | yes |  | 200 | 401, 403, 409, 422 |
| `PATCH` | `/api/v1/memberships/{id}` | Change role or revoke/restore access (last owner protected) | company session | yes | role OWNER | 200 | 401, 403, 404, 409, 422 |

## Admin auth

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `POST` | `/api/v1/admin/auth/login` | Admin password step (admin origin only). Returns which MFA step is required | public | yes |  | 200 | 401, 403, 422, 429 |
| `POST` | `/api/v1/admin/auth/mfa/enroll/start` | Start mandatory TOTP enrolment | admin (password step done, MFA pending) | yes |  | 200 | 401, 403, 409 |
| `POST` | `/api/v1/admin/auth/mfa/enroll/confirm` | Confirm TOTP; returns 10 one-time recovery codes; rotates session | admin (password step done, MFA pending) | yes |  | 200 | 401, 403, 409, 422, 429 |
| `POST` | `/api/v1/admin/auth/mfa/verify` | Verify TOTP (replay-protected) or a recovery code; rotates session | admin (password step done, MFA pending) | yes |  | 200 | 401, 403, 409, 422, 429 |
| `POST` | `/api/v1/admin/auth/logout` | Admin sign out | admin session | yes |  | 200 | 401, 403 |
| `GET` | `/api/v1/admin/me` | Admin identity, roles and capabilities | admin session | no |  | 200 | 401 |

## Admin

| Method | Path | Purpose | Auth | CSRF | Requires | OK | Errors |
|---|---|---|---|---|---|---|---|
| `GET` | `/api/v1/admin/overview` | Live counts for the admin overview | admin session | no | admin.companies.read | 200 | 401 |
| `GET` | `/api/v1/admin/verification` | Verification queue (cursor paginated) | admin session | no | admin.verification.review | 200 | 401 |
| `GET` | `/api/v1/admin/verification/{id}` | Verification case detail | admin session | no | admin.verification.review | 200 | 401, 404 |
| `POST` | `/api/v1/admin/verification/{id}/start-review` | Assign to self and move SUBMITTED -> UNDER_REVIEW | admin session | yes | admin.verification.review | 200 | 401, 403, 404, 409 |
| `POST` | `/api/v1/admin/verification/{id}/decision` | Approve, request information or reject (reason required unless approving) | admin session | yes | admin.verification.review | 200 | 401, 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/files/{id}/download` | Download a case document (audited) | admin session | no | admin.verification.review | 200 | 401, 404 |
| `GET` | `/api/v1/admin/companies` | Companies (filter by status, search) | admin session | no | admin.companies.read | 200 | 401 |
| `GET` | `/api/v1/admin/companies/{id}` | Company detail with members and cases | admin session | no | admin.companies.read | 200 | 401, 404 |
| `POST` | `/api/v1/admin/companies/{id}/suspend` | Suspend a company (compliance); restricts workspaces | admin session | yes | admin.companies.suspend | 200 | 401, 403, 404, 409, 422 |
| `POST` | `/api/v1/admin/companies/{id}/reactivate` | Reactivate a compliance-suspended company | admin session | yes | admin.companies.suspend | 200 | 401, 403, 404, 409, 422 |
| `GET` | `/api/v1/admin/users` | Users (search, account type) | admin session | no | admin.users.read | 200 | 401 |
| `POST` | `/api/v1/admin/users/{id}/revoke-sessions` | Revoke all sessions of a user | admin session | yes | admin.users.revoke_sessions | 200 | 401, 403, 404, 422 |
| `GET` | `/api/v1/admin/audit` | Append-only audit log (filters, cursor paginated) | admin session | no | admin.audit.read | 200 | 401 |
| `GET` | `/api/v1/admin/staff` | Platform staff and roles | admin session | no | admin.staff.manage | 200 | 401 |
| `POST` | `/api/v1/admin/staff/{id}/roles` | Set staff roles (last super-admin protected) | admin session | yes | admin.staff.manage | 200 | 401, 403, 404, 409, 422 |

## Rate limits (per policy; `RATE_LIMIT_SCALE` multiplies them outside production only)

| Policy | Limit |
|---|---|
| login per IP / per account | 50 / 10 per 15 min |
| register per IP | 10 per hour |
| verification/reset emails per account / per IP | 3 / 20 per hour |
| token endpoints per IP | 30 per 15 min |
| admin login per IP / per account | 20 / 5 per 15 min |
| MFA attempts per admin | 5 per 5 min |
| invitations per workspace | 50 per day |
| company creation per user | 5 per day |
| uploads per user | 60 per hour |
