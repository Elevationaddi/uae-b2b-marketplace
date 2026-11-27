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
pnpm db:seed                    # fictional seed data (Phase 0: connectivity check only)
pnpm dev                        # web :3000, api :4000, worker health :4100
```

| URL | What |
|---|---|
| http://localhost:3000/en, /ar | Web shell (EN / AR RTL) with live system status from the API |
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

Integration and E2E tests need `docker compose up -d` and `pnpm db:migrate`. Playwright uses Chromium; install it with `pnpm --filter @app/e2e exec playwright install chromium` if missing.

## Layout
| Path | Contents |
|---|---|
| `apps/web` | Next.js App Router web (buyer/seller/admin UI arrives Phase 1+) |
| `apps/api` | NestJS REST API under `/api/v1` |
| `apps/worker` | BullMQ (Redis) background worker |
| `packages/config` | Validated runtime environment contract; production fails closed |
| `packages/contracts` | Shared zod contracts (response envelope, error codes, health) |
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

Security overrides in `pnpm-workspace.yaml` pin patched transitive versions of multer, postcss, effect and
deepmerge-ts; `pnpm audit --prod` reported no known vulnerabilities after this.
