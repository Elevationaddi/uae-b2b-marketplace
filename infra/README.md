# Infrastructure

- `docker-compose.yml` (repo root): local development services only: PostgreSQL 16, Redis 7, SeaweedFS (S3-compatible storage) and Mailpit (mail catcher).
- `infra/archive/azure`: **archived.** Terraform for Azure UAE North from Phase 8A. It was never applied, and the founder rejected the Azure proposal on 2026-11-28. It is kept for reference only and is no longer validated in CI. The current plan is Vercel-first: see `docs/phase-8/vercel-architecture.md`.
