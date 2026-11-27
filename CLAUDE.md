# Repository instructions
Build a UAE B2B procurement marketplace, not a consumer retail clone. The platform connects verified buying companies and suppliers/manufacturers, handles RFQs, wholesale orders and payment-provider-mediated transactions.

## Required reading
Read `docs/00-decisions.md`, `docs/01-product.md`, and `docs/13-roadmap.md` before implementation; read relevant role, API, data, finance and security files before each feature. The decision register takes priority over proposed defaults. The storyboard is background only; report conflicts rather than silently choosing. No production business policy may be inferred from a mock.

## Engineering contract
- Inspect existing code and dependencies before scaffolding. Do not replace working code without approval. Use TypeScript strict mode, shared validated contracts, PostgreSQL migrations and transactional writes. Proposed stack: pnpm monorepo, Next.js web, NestJS API, Prisma ORM, Redis-backed worker, S3-compatible storage. Pin compatible versions and record them; do not assume latest versions.
- Web is responsive and bilingual EN/AR. Server is authoritative for price, stock, permissions, tax and status. All money is integer fils with currency AED; no floating point money. All stored timestamps UTC; display Asia/Dubai.
- Enforce company membership and resource-level permission on every server operation. Never trust role, company ID, totals or status from client. Separate platform admin from company users. No cross-tenant access, even via file URLs, search, reports or realtime events.
- No fake success, inert buttons, hardcoded dashboard figures or mocked production flows. Sandbox adapters allowed only explicitly labeled in development; production must refuse to start if required integrations are not configured.
- Build vertical slices with migrations, API, UI, permission checks, tests and observability. No secrets in git. No destructive migrations or production actions without explicit approval. No live payment calls or transfer simulation presented as real.
- For each phase: plan, implement, lint/typecheck/test, record commands and outcomes, update `docs/IMPLEMENTATION_STATUS.md`, list unresolved blockers. Do not claim passing tests not executed. Stop at gates; ask approval before expanding scope or enabling live services.
- Add unit tests for business rules, integration tests against PostgreSQL, browser E2E for main workflows and negative authorization tests. Use seeded fictional companies only. All screens require loading/empty/error/forbidden states and accessible actions.
