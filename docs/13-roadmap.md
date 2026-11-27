# Development sequence and deployment
Proposed monorepo layout: `apps/web`, `apps/api`, `apps/worker`, `packages/contracts`, `packages/ui`, `packages/config`, `infra`, `docs`. pnpm workspace; Docker Compose for Postgres, Redis, local object storage and test mail. Existing repository takes priority; record deviations. Phase gates require actual tests, migration review and founder review where business policy changes.

| Phase | Vertical slice | Exit gate |
|---|---|---|
| 0 | Inspect repo, select compatible pinned tools, scaffold web/API/worker, local Compose, CI, env validation, health endpoints | clean install/build/lint/typecheck, DB connection, documented commands |
| 1 | Auth, workspaces, membership, verification, uploads, admin review, localization shell | T01–06; secure tenant and file boundaries |
| 2 | Seller storefront/catalog/moderation/inventory; buyer marketplace/directory/saved | T07–10 plus search isolation and responsive screens |
| 3 | RFQs, quote versions/award, scoped messages/notifications | T19–23, one award, no competing bid access |
| 4 | Cart, checkout, reservations, order snapshots, sandbox PSP/ledger | T11–18, T40/T42; concurrent stock safe |
| 5 | Fulfilment, receipt, disputes, refunds/payout reconciliation, reviews | T24–32/T39; no manual paid flags |
| 6 | Admin reports, support, audit, expiry, operational notifications, accessibility | T33–36/T41; role-specific UAT |
| 7 | Production provider integration, security review, performance, backup, deployment | T37–38 plus all regressions; D01–D15 production gates approved |
| 8 | Optional paid membership, native app, milestones/deposits, bulk import, procurement approvals, carrier integrations | separate approved specs and tests before build |

## Runtime configuration
`.env.example` with placeholders only: NODE_ENV, DATABASE_URL, REDIS_URL, SESSION_SECRET, WEB_ORIGIN, API_ORIGIN, STORAGE_ENDPOINT, STORAGE_BUCKET, STORAGE_ACCESS_KEY, STORAGE_SECRET_KEY, EMAIL_PROVIDER, EMAIL_API_KEY, EMAIL_FROM, PAYMENT_MODE, PSP_API_KEY, PSP_WEBHOOK_SECRET, APP_LOCALE, LOG_LEVEL. Actual variables adapt to chosen providers and documented validation; production rejects mock payment mode, weak secrets and missing required keys. Feature flags for real payments, subscriptions, custom milestone payments. Disable new checkout if trading disabled; existing order/support remain available.

Local commands to implement in root scripts: `pnpm install --frozen-lockfile`, `docker compose up -d`, `pnpm db:migrate`, `pnpm db:seed`, `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build`. These are required script names, not verified existing commands. CI: lint, typecheck, unit/integration, E2E, dependency/security scanning, migration dry run and artifact build. Branch review for schema and finance changes.

Staging isolated credentials/data, sandbox PSP and webhook tests. Production domain/TLS, managed Postgres backups, private storage, worker autoscaling, secret manager, alerting, health checks and rollback plan. Hosting region and data transfer approved before launch. Deploy additive migrations first; backup before migration; rollback application without destructive schema rollback; forward fix where needed. Proposed recovery targets RPO 24h/RTO 4h subject to founder review; test restore. Monitor HTTP error rate, latency, queue age, DB capacity, PSP mismatch, audit anomalies. Run daily reconciliation. Establish incident escalation and on-call ownership.

Launch checklist: approve decisions, provider underwriting and end-to-end live-mode test plan, legal terms/privacy and tax review, seller eligibility and restricted catalog policy, approved pricing/disputes/delivery policy, penetration testing, restore drill, bilingual review, real-device UAT, support procedures, founder sign-off. No native store submission until native scope and platform-specific requirements approved. Do not enable real transactions merely because a UI demo works.
