# Infrastructure

- `docker-compose.yml` (repo root): local development services only: PostgreSQL 16, Redis 7, SeaweedFS (S3-compatible storage) and Mailpit (mail catcher).
- `infra/azure`: Terraform for Azure UAE North (Phase 8A, D12). **Written and validated only. Nothing has been provisioned.** See `infra/azure/README.md` and `docs/phase-8/`.
