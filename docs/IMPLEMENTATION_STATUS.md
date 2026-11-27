# Implementation status
Phase 0 is merged. Phase 1 is implemented and verified locally; it awaits founder gate review. Phases 2–7 have no application code yet.

| Phase | Status | Evidence | Blockers |
|---|---|---|---|
| 0 | DONE | Merged to `main` as 08a127e (PR #1), CI run 46055408891 green | None |
| 1 | READY_FOR_GATE_REVIEW | Local run 2026-11-27 (commands below); Phase 1 PR; CI run pending on the PR (first run including WebKit) | Founder gate review; green CI on the final PR commit |
| 2–7 | NOT_STARTED | None | Phase 1 gate; Phase 2 decisions listed under Phase 1 |
| 8 | OUT_OF_SCOPE | None | Separate approval |

For each completed phase record date, commit, implemented routes, migrations, tests actually executed with pass/fail counts, commands, known bugs, security review, decisions changed, and next gate. Do not mark DONE if an acceptance test is missing or failing. Keep this file current.

## Phase 1: accounts, workspaces, verification
**Date:** 2026-11-27. **Branch:** `phase-1-accounts-verification` (pull request into `main`). **Exit gate (docs/13-roadmap.md):** T01–T06; secure tenant and file boundaries.

### Delivered
- **Identity (A01, A07):** registration, email verification (mandatory before any company action), login, logout, forgot/reset password, profile and locale, password change, session list with per-session and "all other" revocation.
- **Company workspaces:** onboarding with legal details (licence number, issuer, expiry, emirate, TRN, activity, contacts), BUYER and/or SELLER workspaces, workspace switcher.
- **Team and RBAC (A04):** invitations by email (one-time token), accept flow for new and existing users, role change, revoke/restore, last-owner protection with row locking, full role matrix in `packages/contracts/src/permissions.ts` used by both API enforcement and UI capability hiding.
- **Verification (A08):** licence and representative document upload to private storage, magic-byte type checks, sandbox malware scanner (EICAR test string, infected files never stored), submission with terms acceptance, admin queue, start review, approve / needs-info / reject with reason, resubmission, full case timeline for company and admin.
- **Licence expiry and renewal:** worker job flags expired licences and removes trading capabilities while keeping read access (T35); renewal cases with proposed new licence details, approved by compliance.
- **Admin (A02, A03):** separate admin origin (`admin.localhost:3000` locally) with its own cookie (`asid`, SameSite Strict) and session table; host-routing middleware hides admin pages and API from the company origin and vice versa; admins provisioned only by CLI (`admin:create`), never by registration; mandatory TOTP enrolment with QR and recovery codes; overview KPIs from live queries, verification queue and case review, companies (search, suspend/reactivate with reason), users (revoke sessions), audit log with filters, staff role management (super-admin only).
- **Audit:** append-only `audit_log` (database triggers block UPDATE/DELETE, T32) for every security and verification action, with secret redaction.
- **EN/AR and responsive:** every screen in English and Arabic with RTL via logical CSS properties, mobile bottom navigation at ≤720px, tables collapse to cards on phones; every screen has loading, empty, error (with request reference and retry), forbidden and not-found states.
- **OpenAPI:** generated from the shared zod contracts (`pnpm --filter @app/contracts openapi` writes `docs/api/openapi.json`); a unit test fails if the committed file is stale and an API integration test fails if any Express route is missing from the document.
- **WebKit:** Playwright `webkit` and `mobile-safari` projects added; they run in CI (the WebKit download is blocked by this environment's network policy).

### Routes, schema, accounts
- 55 API operations: see `docs/api/README.md` (method, path, auth, CSRF, required capability, status codes) and `docs/api/openapi.json`.
- Migration `20261127200000_phase1_identity_verification` (17 tables, triggers, constraints): see `docs/db/phase-1-schema.md`, including rollback notes. No destructive change to the baseline.
- Development accounts for every company and admin role: `docs/TEST_ACCOUNTS.md` (seed refuses to run in production).

### Commands actually run
Environment: Linux container, Node 22.23.5, pnpm 10.28.0, local PostgreSQL 16, Redis 7, SeaweedFS, Mailpit. `RATE_LIMIT_SCALE=50` in the local `.env` and in CI so E2E does not trip auth rate limits (production default is 1).

| Command | Result |
|---|---|
| `pnpm lint` | pass (0 warnings) |
| `pnpm format:check` | pass |
| `pnpm typecheck` | pass |
| `pnpm test` | pass: 121 tests, 0 failed (config 17, contracts 29, api integration 63, web 10, worker 2) |
| `NODE_ENV=production pnpm build` | pass |
| `pnpm test:e2e` (chromium + mobile-360) | pass: 44 tests, 0 failed, re-run after the final CSP change |
| Screenshots project (`screenshots.spec.ts`, deviceScaleFactor 2) | pass: 4 tests; 58 screenshots of every screen, EN/AR, desktop/phone, forbidden/not-found/unverified states |
| `pnpm audit --prod --audit-level high` | pass: no known vulnerabilities (nodemailer upgraded to 10.4.1) |
| Manual curl of host routing | admin pages/API 404 on the web origin; non-admin paths 404 on the admin origin |
| WebKit / mobile Safari E2E | **not run locally** (browser download blocked); runs in CI on the PR |

### Acceptance tests
| Test | Covered by | Result |
|---|---|---|
| T01 unverified purchase | `companies.int.test.ts` (no `buyer.purchase` capability before approval), `access-control.spec.ts` | pass at capability level; purchase endpoints arrive in Phase 3, where T01 must be re-run end to end |
| T02 clean docs approved | `companies.int.test.ts`, `verification-journey.spec.ts` | pass |
| T03 missing/infected licence | `companies.int.test.ts` (two cases) | pass |
| T04 cross-company ID guessing | `team-isolation.int.test.ts`, `access-control.spec.ts` (404 on company, case, document and workspace IDs) | pass |
| T05 revoked membership, old session | `team-isolation.int.test.ts` | pass |
| T06 last owner removal | `team-isolation.int.test.ts`, including a concurrent mutual-revoke race; `team.spec.ts` | pass |
| T32 audit edit attempt (early) | `admin-security.int.test.ts` | pass |
| T35 licence expiry (early) | `companies.int.test.ts` | pass |

E2E also covers: full registration-to-approval journey, password reset single use, session revocation, unverified-email block, admin MFA enrolment and recovery-code sign-in, invitation acceptance, Arabic RTL and 360px layouts.

### CI
`.github/workflows/ci.yml` now starts Mailpit and SeaweedFS, maps `admin.localhost`, checks OpenAPI is up to date, seeds the database and runs E2E on chromium, mobile-360, webkit and mobile-safari. The first run happens on the Phase 1 PR; results will be recorded here.

### Bugs found and fixed during Phase 1
- Text typed before React hydration was lost; inputs and buttons are now disabled until hydrated.
- The mobile bottom navigation covered the last button on long pages (CSS specificity); fixed.
- Uploading an infected file showed "Saved."; it now says the file was blocked.
- `NODE_ENV=development` from `.env` leaked into `next build`; the env loader now excludes it for web scripts.
- Four high-severity nodemailer advisories; upgraded.

### Security review
| Area | Control |
|---|---|
| Passwords | Argon2id (`argon2` library, 64 MiB, t=3); minimum length enforced by shared contracts; generic login errors |
| Sessions | Opaque random tokens, only SHA-256 hashes stored in PostgreSQL; rotation on login and privilege change; idle and absolute expiry; revocation takes effect on the next request |
| Cookies | `__Host-` prefix, Secure, HttpOnly; SameSite Lax (company), Strict (admin); admin and company cookies never shared |
| CSRF | Origin/Referer check plus double-submit token on every state-changing request |
| Rate limiting | Redis-backed limits on login, registration, reset, verification resend, invitation and MFA (table in `docs/api/README.md`) |
| Recovery tokens | One-time, hashed at rest, short expiry, delivered in the URL fragment (not sent to servers or logs) and stripped from history |
| Admin MFA | TOTP (`otplib`) with replay protection, secrets AES-256-GCM encrypted at rest, hashed single-use recovery codes, QR rendered as an image so it cannot run script |
| Admin separation | Separate origin, cookie, session table and CSRF scope; middleware blocks cross-host routes; database trigger stops admin accounts holding company memberships; no public admin registration |
| Tenant isolation | Every query scoped by membership; cross-tenant IDs return 404 (T04); role and company never taken from the client |
| Files | Private bucket; magic-byte sniffing; sandbox malware scan before storage; downloads streamed only after an authorization check, with `Content-Disposition: attachment`, `nosniff`, `private, no-store` and a restrictive CSP |
| Audit | Append-only by trigger; actor, IP, request ID, reason; secrets redacted |
| Web | CSP (`default-src 'self'`, `frame-ancestors 'none'`), COOP, no-store on API responses, open-redirect-safe `next` parameter, no `window.confirm` |
| Dependencies | `pnpm audit --prod` clean; versions pinned in `docs/DEVELOPMENT.md` |

### Known issues and limitations
- WebKit/Safari not run locally; relies on the first CI run.
- T01 verified at capability level only until purchase endpoints exist (Phase 3).
- Document downloads are streamed through the API rather than presigned URLs (simpler to authorize; revisit for large files).
- Production cannot start yet by design: there is no live email adapter or malware scanner (sandbox adapters only, clearly labelled).
- CSP still needs `'unsafe-inline'` for scripts (Next.js inline bootstrap); nonces can be added later.
- A pending invitation token is kept per browser tab (sessionStorage); opening the link in another tab after sign-up requires clicking it again.
- Notifications are email only; no in-app notifications or compliance queue alerts yet (Phase 6).
- Seeded admin TOTP secrets are fixed for development; the seed refuses production.
- Terms version is `dev-1` pending legal text (D15).
- Arabic copy needs native-speaker review.
- `API_INTERNAL_ORIGIN` is fixed at web build time; `TRUST_PROXY` must be set correctly behind a production load balancer for rate limits and audit IPs.
- No account deletion, data export or admin "disable user" action yet.
- Admin lists have search and status filters but no column filters or detail drawers.

### Deviations and decisions changed
- A01–A08 approved by the founder and recorded in `docs/00-decisions.md`; no D01–D15 entry changed.
- OpenAPI is generated from the contracts package rather than NestJS decorators, so the web client and the spec share one schema source.
- `RATE_LIMIT_SCALE` env variable added (development and test only; ignored in production).

### Decisions needed before Phase 2
1. Launch categories and restricted/prohibited items (D14).
2. Seller eligibility rules beyond an approved licence (D02).
3. Catalog moderation policy: pre-approval of listings or post-publication review.
4. Whether buyer browsing of the marketplace requires an approved company or only a verified account.
5. Document retention period after rejection or account closure (D09).
6. Hosting region for production storage and database (D12).
7. Production email provider and malware scanner (needed before any production deployment, not before Phase 2 development).
8. Legal terms text (D15) and brand name (A06 makes it configurable).

### Next gate
Founder reviews this phase, the screenshots and the decisions above, and approves starting Phase 2 (seller storefront, catalog, moderation, inventory, buyer marketplace and directory; T07–T10 plus search isolation).

## Phase 0: foundation
**Date:** 2026-11-27. **Branch:** `phase-0-foundation` (pull request into `main`). **Exit gate (docs/13-roadmap.md):** clean install/build/lint/typecheck, DB connection, documented commands.

### Delivered
- pnpm monorepo: `apps/web` (Next.js), `apps/api` (NestJS), `apps/worker` (BullMQ on Redis), `packages/config`, `packages/contracts`, `packages/db` (Prisma), `packages/ui` (tokens), `e2e` (Playwright), `infra`. Versions pinned and recorded in `docs/DEVELOPMENT.md`.
- `docker-compose.yml`: PostgreSQL 16, Redis 7, SeaweedFS (S3-compatible), Mailpit. Bound to 127.0.0.1 only.
- Environment validation (`packages/config`), shared by API and worker. Production refuses mock payments, the dev mail catcher, weak/placeholder secrets, missing storage keys, non-https origins, live payments without PSP keys or the explicit `FEATURE_REAL_PAYMENTS` flag, and trading without a live provider. Live payments are refused outside production. Feature flags (`TRADING_ENABLED`, `FEATURE_REAL_PAYMENTS`, `FEATURE_SUBSCRIPTIONS`, `FEATURE_MILESTONE_PAYMENTS`) default false.
- API: `/api/v1` prefix, documented success and error envelopes, error codes mapped to the HTTP statuses in docs/07-api.md, request IDs (`X-Request-Id`), structured pino logs with credential/cookie/token redaction and no query strings, helmet headers, CORS restricted to `WEB_ORIGIN`, 1 MB JSON limit, graceful shutdown.
- Worker: repeatable `system.heartbeat` job that round-trips through Redis and pings PostgreSQL; health server.
- Web: EN/AR shell with `lang`/`dir` at the document root, translation-key catalogue (no hardcoded UI strings), Asia/Dubai time display, design tokens from docs/05-ui.md, sandbox banner driven by the API, live system status with an error state and retry (no fabricated status), security headers.
- Prisma baseline migration `20261127000000_baseline` (no business tables, per docs/06-data.md "no unused tables"). Seed script refuses production and writes nothing in Phase 0.
- CI workflow `.github/workflows/ci.yml`: install (frozen lockfile), lint, format, typecheck, migration status + deploy against a PostgreSQL service, unit/integration tests, build, Playwright E2E, `pnpm audit --prod`.

### Routes
| Route | Purpose |
|---|---|
| `GET /api/v1/health` | API liveness |
| `GET /api/v1/health/ready` | API readiness: PostgreSQL + Redis, 503 when not ready |
| `GET :4100/health`, `GET :4100/health/ready` | Worker liveness / readiness (DB, Redis, heartbeat) |
| `GET /healthz` (web) | Web liveness |
| `/en`, `/ar` (web) | Localized shell with live status; `/` redirects to `/en`; unknown locale 404 |

### Commands actually run (clean checkout state: node_modules and build output deleted first)
Environment: Linux container, Node 22.23.5, pnpm 10.28.0, Docker Compose services from `docker-compose.yml`.

| Command | Result |
|---|---|
| `pnpm install --frozen-lockfile` | pass |
| `docker compose up -d` / `docker compose config --quiet` | pass (all 4 services up; postgres, redis, mail healthy) |
| `pnpm db:migrate:status`, `pnpm db:migrate` | pass (baseline applied) |
| `pnpm db:seed` | pass (connectivity check, no rows) |
| `pnpm lint` | pass (0 warnings) |
| `pnpm format:check` | pass |
| `pnpm typecheck` | pass |
| `pnpm test` | pass: 31 tests in 5 files, 0 failed (config 13, contracts 3, api integration 9, web i18n 4, worker integration 2) |
| `pnpm build` | pass |
| `pnpm test:e2e` | pass: 12 tests, 0 failed (6 scenarios × Chromium desktop and 360px viewport) |
| `pnpm audit --prod --audit-level high` | pass: no known vulnerabilities (after overrides) |
| Manual: API started with `NODE_ENV=production` and the `.env.example` values | refused to start, exit 1, listing 7 issues (mock payments, dev mail, placeholder secret/keys, http origins) |
| Manual: worker started from build output | `/health/ready` reported database, redis and heartbeat up |

Integration tests run against real PostgreSQL and Redis, including a dependencies-down case (503 not_ready while liveness stays 200) and a cold-start concurrency case.

### CI
GitHub Actions run 46055408891 on PR #1 (commit d58ce8f) passed every step: frozen install, lint, format, typecheck, migration status and deploy, unit/integration tests, build, Playwright E2E, production dependency audit.

### Bugs found and fixed during Phase 0
- API readiness reported Redis down on the first concurrent requests after start (lazy-connect race). Found by the E2E suite; fixed and covered by a cold-start integration test.
- Web status page was being prerendered at build time, which would have shown a stale status. Now rendered per request.

### Not yet verified
- WebKit (Safari-compatible) browser tests: not installed in this environment; docs/12-testing.md requires it before launch. Add in Phase 1.
- `docker compose up` was verified with images fetched through a registry mirror because Docker Hub rate-limited this environment; the compose file uses the canonical Docker Hub names.

### Security review (Phase 0 scope)
No secrets in git (`.env` ignored; `.env.example` placeholders are rejected in production). Services bind to localhost. Logs redact authorization, cookies, CSRF/idempotency headers and password/token/secret fields, and omit query strings. Error responses never include stack traces. Transitive vulnerabilities in multer, postcss, effect and deepmerge-ts patched via overrides; zod moved to 4.6.7 for its advisory.

### Deviations and decisions changed
- Added `packages/db` (not in the proposed layout) so API and worker share one Prisma schema.
- Local object storage uses SeaweedFS instead of MinIO: MinIO community images were unavailable from this environment. Any S3-compatible store satisfies the spec.
- Extra env variables beyond docs/13-roadmap.md: `API_PORT`, `WORKER_HEALTH_PORT`, `STORAGE_REGION`, `SMTP_URL`, `TRADING_ENABLED` and the three feature flags. `PAYMENT_MODE` values are `disabled|mock|live`; `EMAIL_PROVIDER` values are `disabled|smtp-dev|live`.
- OpenAPI generation (docs/07-api.md) deferred to Phase 1, when the first real DTOs exist.
- No decision register (D01–D15) entries changed.

### Open questions for the founder (none block Phase 0)
1. **Authentication approach (blocks Phase 1).** docs/10-security.md allows Argon2id passwords or an established auth provider. Proposed development default: self-hosted email/password with Argon2id, server-side sessions in PostgreSQL, TOTP MFA for admin. Choosing a provider later would change Phase 1 substantially.
2. **Admin separation.** docs/04-admin.md and docs/07-api.md require a distinct admin session scope. Proposed default: same web app under `/admin` with a separate cookie name and session table flag; a separate admin origin is stronger and can be chosen now at low cost.
3. **D10 wording vs. the role matrix.** D10 says "Owner and procurement roles MVP", while docs/10-security.md defines buyer viewer and seller sales/warehouse/finance/viewer roles. Assumed D10 refers to buyer purchasing roles only and the full matrix applies.
4. **Payment window for quote-derived orders.** docs/02-buyer.md lets the buyer retry payment "until expiry", but no expiry is defined for orders created from an accepted quote (D11's 15 minutes covers stock reservations). Needed by Phase 3/4.
5. **Brand/name.** None supplied; the UI uses "B2B Marketplace (working name)".
6. **Production gates D01–D15** remain open as listed in docs/00-decisions.md (PSP, tax/invoice issuer, hosting region, legal, etc.). None are needed before Phase 1.

### Next gate
Founder reviews this phase and question 1 (auth approach), then approves starting Phase 1 (auth, workspaces, membership, verification, uploads, admin review, localization shell; T01–T06).
