# Implementation status
Phases 1–7 have no application code yet. Phase 0 is implemented and verified locally; it awaits founder gate review.

| Phase | Status | Evidence | Blockers |
|---|---|---|---|
| 0 | READY_FOR_GATE_REVIEW | Local acceptance run and GitHub Actions run 46055408891 (all steps green) 2026-11-27; PR #1 | Founder review of the open questions below |
| 1–7 | NOT_STARTED | None | Phase 0 gate; Phase 1 decisions listed below |
| 8 | OUT_OF_SCOPE | None | Separate approval |

For each completed phase record date, commit, implemented routes, migrations, tests actually executed with pass/fail counts, commands, known bugs, security review, decisions changed, and next gate. Do not mark DONE if an acceptance test is missing or failing. Keep this file current.

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
