# Azure infrastructure (Terraform)

**Status (Phase 8A, 2026-11-28):** code only. **Not applied.** No subscription, credentials or state exist yet. Provisioning needs separate founder approval of the monthly amount (`docs/phase-8/cost-estimate.md`). CI runs `terraform fmt -check` and `terraform validate` without a backend or credentials.

| Path | What |
|---|---|
| `bootstrap/` | One-time: Terraform state storage (private, versioned, Entra-only, delete lock) and one certificates Key Vault per environment |
| `modules/platform/` | Everything for one environment: VNet and subnets, private DNS, private endpoints, Container Apps environment (web, api, worker, ClamAV, migrate and backup jobs), PostgreSQL flexible server, Redis, Blob storage, Key Vault, Application Gateway WAF v2 (production), Log Analytics and Application Insights, alerts, budget |
| `envs/staging/` | Staging sizing: Burstable database, Basic Redis, LRS storage, IP-restricted public ingress, sandbox app settings |
| `envs/production/` | Production sizing: General Purpose database with zone-redundant HA, Standard Redis, ZRS, internal environment behind the WAF, integrations disabled until 8H |
| `cost-model.py` | Prints the cost tables in `docs/phase-8/cost-estimate.md` |

**Versions.**
- Terraform: `>= 1.9, < 2.0` (CI uses 1.16.6).
- azurerm: `>= 4.0, < 5.0`; random: `>= 3.6, < 4.0`.
- Commit `.terraform.lock.hcl` from the first real `init` so provider versions are pinned and recorded.

## Order of operations (after approval only)
1. **Subscription checks** (read-only): run the checks in `docs/phase-8/azure-region-verification.md`. Raise region access requests if needed.
2. **Bootstrap** (operator with Owner rights): `terraform -chdir=bootstrap init && terraform -chdir=bootstrap apply`.
3. **Certificates:** import the TLS certificate (PFX) for each environment's hosts into its certificates vault as `public-hosts`.
4. **Images:** CI builds and pushes `marketplace-web`, `marketplace-api`, `marketplace-worker` and `marketplace-ops`, tagged with the commit SHA. The Dockerfiles and the 8B code changes come first:
   - `APP_ENV=staging` profile (C-20);
   - Azure Blob adapter (C-21);
   - `backup-to-blob` script.
5. **Staging:**
   ```bash
   cp envs/staging/backend.hcl.example envs/staging/backend.hcl
   cp envs/staging/terraform.tfvars.example envs/staging/terraform.tfvars   # fill in, no secrets
   terraform -chdir=envs/staging init -backend-config=backend.hcl
   terraform -chdir=envs/staging plan -out=staging.tfplan   # reviewed in the PR or environment approval
   terraform -chdir=envs/staging apply staging.tfplan
   ```
6. **Migrations:** start `job-migrate` (manual trigger) for additive migrations only, then update the app revisions.
7. **DNS:** create the CNAME and `asuid` TXT records for staging (outputs `web_fqdn`, `environment_verification_id`).
8. **Production:** the same steps from `envs/production`, only after founder approval. Apply production before staging if staging should reuse the production registry.

## Network access during apply
Key Vault, Blob storage and Redis have public network access **disabled**. Terraform writes Key Vault secrets and blob containers from the deployment runner, so applies run from one of:
- **(a)** a self-hosted GitHub runner inside the VNet (recommended for production); or
- **(b)** a time-boxed firewall exception for the runner's IP, added and removed by the pipeline.

Container creation uses the management plane (`storage_account_id`), so it does not need data-plane access.

## Secrets
Terraform generates the following and writes them to the environment Key Vault:
- the session secret;
- the MFA encryption key;
- the database password;
- the Redis access key.

These values exist in Terraform state, which is why the state account is private, versioned and readable only by the deployment identities. Third-party credentials (Stripe, Resend) are **never** in Terraform: an operator adds them to Key Vault after founder approval. Apps read secrets through Key Vault references with a user-assigned managed identity.

## Known limits of this code
- **Not validated against Azure.** CI checks syntax and provider schema only. The first `plan` against a real subscription may need fixes, especially for:
  - region-specific SKUs;
  - Container Apps custom domain bindings for the internal environment;
  - Key Vault certificate references.
- **Application settings target the 8B code changes** (`APP_ENV`, `STORAGE_DRIVER`, `FILE_SCANNER_URL`). Applying before 8B would leave the apps unable to start, which is intended.
- **Database role:** the database URL uses the server admin login. 8B adds a least-privilege application role.
