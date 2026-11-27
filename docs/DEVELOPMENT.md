# Development guide

## Prerequisites
- Node.js 22 (>= 22.12, see `.nvmrc`) and pnpm 10.28 (`corepack enable` picks it up from `package.json`).
- Docker with Compose v2 for local PostgreSQL, Redis, S3-compatible storage and the mail catcher.

## First run
```bash
cp .env.example .env            # placeholders only; never commit .env
pnpm install --frozen-lockfile  # also generates the Prisma client
docker compose up -d            # postgres, redis, storage (SeaweedFS), mail (Mailpit)
pnpm db:migrate                 # apply reviewed migrations
pnpm db:seed                    # fictional companies, users and admins (docs/TEST_ACCOUNTS.md)
pnpm dev                        # web :3000, api :4000, worker health :4100
```

| URL | What |
|---|---|
| http://localhost:3000/en, /ar | Company web app (EN / AR RTL): register, sign in, company, team, settings |
| http://admin.localhost:3000/en/admin | Admin portal on its own origin (A03); TOTP required. `*.localhost` resolves to loopback in browsers |
| http://localhost:3000/healthz | Web liveness |
| http://localhost:4000/api/v1/health | API liveness |
| http://localhost:4000/api/v1/health/ready | API readiness (PostgreSQL + Redis), 503 when not ready |
| http://localhost:4100/health, /health/ready | Worker liveness / readiness (DB, Redis, queue heartbeat) |
| http://localhost:8025 | Mailpit UI (local mail catcher; nothing leaves the machine) |

## Commands
| Command | Purpose |
|---|---|
| `pnpm lint` / `pnpm format:check` | ESLint (zero warnings) / Prettier |
| `pnpm typecheck` | Builds shared packages, then `tsc --noEmit` in every workspace |
| `pnpm test` | Unit tests plus integration tests against the real PostgreSQL and Redis from Compose |
| `pnpm build` | Production builds of all workspaces |
| `pnpm test:e2e` | Playwright browser tests; needs `pnpm build` first, starts the built API and web itself |
| `pnpm db:migrate` / `db:migrate:status` / `db:migrate:dev` | Prisma migrate deploy / status / create a new migration |
| `pnpm db:seed` | Development seed (refuses production); idempotent |
| `pnpm dev:totp <email>` | Print the current TOTP code for a seeded admin (dev only) |
| `ADMIN_INITIAL_PASSWORD=… pnpm --filter @app/api admin:create <email> <ROLE> [name]` | Operator CLI: the only way to create platform admins |
| `pnpm --filter @app/contracts openapi` | Regenerate `docs/api/openapi.json` from the shared contracts |
| `pnpm test:e2e --project=screenshots` | Capture every screen to `e2e/screenshots-out` (or `SCREENSHOT_DIR`) |
| `PW_WEBKIT=1 pnpm test:e2e` | Also run the WebKit (Safari engine) projects; needs `playwright install webkit` |

Integration and E2E tests need `docker compose up -d`, `pnpm db:migrate` and (for E2E) `pnpm db:seed`. E2E starts the
built API, worker and web, reads emails from Mailpit, and creates throwaway admins through the operator CLI. Set
`RATE_LIMIT_SCALE=50` in `.env` for repeated local E2E runs (ignored in production). Playwright projects: `chromium`,
`mobile-360`, and in CI also `webkit` and `mobile-safari` (iPhone 13). CI adds `127.0.0.1 admin.localhost` to
`/etc/hosts` so every engine resolves the admin origin.

## Layout
| Path | Contents |
|---|---|
| `apps/web` | Next.js App Router web: company app and admin portal; `/api/v1` proxied to the API; middleware routes admin vs web host |
| `apps/api` | NestJS REST API under `/api/v1` |
| `apps/worker` | BullMQ (Redis) background worker |
| `packages/config` | Validated runtime environment contract; production fails closed |
| `packages/contracts` | Shared zod contracts (DTOs, role/permission matrix, error codes) and the OpenAPI generator |
| `packages/db` | Prisma schema, migrations, seed and client factory |
| `packages/ui` | Design tokens (neutral placeholder identity) |
| `e2e` | Playwright browser tests |
| `infra` | Infrastructure notes (production hosting undecided, D12) |

Deviation from docs/13-roadmap.md: `packages/db` was added so the API and worker share one Prisma schema and client.

## Environment rules
`packages/config` validates every variable at startup. In production the API and worker refuse to start when:
`PAYMENT_MODE=mock`, `EMAIL_PROVIDER=smtp-dev`, the session secret is short or a placeholder, storage keys are missing,
origins are not https, live payments lack PSP keys or the `FEATURE_REAL_PAYMENTS` approval flag, or
`TRADING_ENABLED=true` without a live payment provider. Live payments are refused outside production.
All feature flags default to false.

Phase 1 additions: production also refuses `EMAIL_PROVIDER` other than `live` and `FILE_SCANNER` other than `live`
(no live adapters exist yet, so production cannot start; intentional until D-decisions on providers are made), the
example `MFA_ENCRYPTION_KEY`, and an `ADMIN_ORIGIN` on the same host as `WEB_ORIGIN`.

| Variable | Default | Purpose |
|---|---|---|
| `APP_NAME` | `B2B Marketplace (working name)` | Product name shown in UI and emails (A06) |
| `ADMIN_ORIGIN` | `http://admin.localhost:3000` | Separate admin origin (A03); CSRF origin for `/api/v1/admin` |
| `MFA_ENCRYPTION_KEY` | dev example (rejected in prod) | 32-byte base64 key encrypting admin TOTP secrets |
| `FILE_SCANNER` | `sandbox-eicar` | `disabled` (uploads 503) / `sandbox-eicar` (dev: flags EICAR test file) / `live` |
| `UPLOAD_MAX_BYTES` | 10485760 | Upload size limit |
| `QUOTE_PAYMENT_WINDOW_HOURS` | 72 | Quote payment deadline (A05), used from Phase 3/4 |
| `RATE_LIMIT_SCALE` | 1 | Multiplies auth rate limits outside production (tests) |
| `TRUST_PROXY` | `loopback` | Express trust proxy setting for client IPs behind the web proxy |
| `API_INTERNAL_ORIGIN` | `API_ORIGIN` | Where the web server proxies `/api/v1` (resolved at web build time) |

## Pinned versions (selected 2026-11-27)
Chosen as the newest stable release within a major line that is known to work together; npm "latest" tags were not
assumed (for example, Prisma's `latest` tag currently points at an 8.0 release candidate, and TypeScript 7 is
available but not yet adopted).

| Tool | Version |
|---|---|
| Node.js | 22.x (CI uses `.nvmrc`) |
| pnpm | 10.28.0 |
| TypeScript | 5.9.3 (strict) |
| Next.js / React | 15.5.29 / 19.1.10 |
| NestJS | 11.1.29 |
| Prisma | 6.19.3 |
| PostgreSQL / Redis images | postgres:16.10-alpine / redis:7.4.6-alpine |
| BullMQ / ioredis | 5.61.2 / 5.11.1 |
| zod | 4.6.7 |
| Vitest / Playwright | 3.2.7 / 1.63.0 |
| ESLint / typescript-eslint / Prettier | 9.39.5 / 8.74.0 / 3.6.2 |
| Local storage / mail images | chrislusf/seaweedfs:3.97 / axllent/mailpit:v1.27 |
| argon2 / otplib / rate-limiter-flexible | 0.45.2 / 12.0.1 / 11.4.1 |
| @aws-sdk/client-s3 / nodemailer / qrcode | 3.1099.0 / 10.4.1 / 1.5.4 |
| @asteasolutions/zod-to-openapi | 9.1.0 |

Security overrides in `pnpm-workspace.yaml` pin patched transitive versions of multer, postcss, effect and
deepmerge-ts; nodemailer was upgraded to 10.4.1 for four high advisories. `pnpm audit --prod --audit-level high`
reports no known vulnerabilities (2026-11-27).
