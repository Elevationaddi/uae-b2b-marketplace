# Infrastructure

Phase 0 provides local development services only (`docker-compose.yml` at the repo root):
PostgreSQL 16, Redis 7, SeaweedFS (S3-compatible storage) and Mailpit (mail catcher).

Production hosting region, managed services, backups, secret manager and deployment
are undecided (docs/00-decisions.md D12) and belong to Phase 7. Nothing here is a
production deployment.
