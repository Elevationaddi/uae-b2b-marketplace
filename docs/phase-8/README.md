# Phase 8: production preparation

**Authorised by the founder on 2026-11-28:** Phase 8 preparation and staging development only, starting with **8A**.

**Not authorised:**
- paid services or infrastructure charges;
- live payments or production credentials;
- public registration or public launch.

The application stays in sandbox mode. Phase 8 is not complete until every launch gate is independently verified where required and approved by the founder.

| Workstream | Scope | Status |
|---|---|---|
| **8A** | Infrastructure architecture, infrastructure as code, cost estimates | Azure proposal **rejected** (2026-11-28) and archived. Replaced by the **Vercel-first, zero added cost** proposal: [vercel-architecture.md](vercel-architecture.md) |
| 8B | Staging deployment, monitoring, backups, disaster recovery | Not started (needs provisioning approval) |
| 8C | Payment provider integration with test credentials | Not started (needs provider eligibility answers) |
| 8D | Transactional email and production malware scanning | Not started |
| 8E | Tax, invoicing, commercial policy, admin configuration | Not started |
| 8F | Security remediation, independent testing preparation, operational testing | Not started |
| 8G | Controlled pilot readiness | Not started |
| 8H | Production launch (explicit founder approval) | Not started |

## Current deliverables (Vercel-first revision, 2026-11-28)
| Deliverable | File |
|---|---|
| Vercel-first architecture, diagram, services in the four cost categories, spend protection, worker, database, storage and residency plans, limits and questions | [vercel-architecture.md](vercel-architecture.md) |
| Domain and DNS requirements; third-party integration requirements (Azure parts superseded) | [domains-and-integrations.md](domains-and-integrations.md) |
| Environment variable inventory (no secret values; Azure parts superseded) | [environment-variables.md](environment-variables.md) |
| Payment provider comparison and eligibility checklist | [payment-providers.md](payment-providers.md) |
| Contradictions between the decisions and the implementation | [contradictions.md](contradictions.md) |
| Security risk register | [risk-register.md](risk-register.md) |
| Production readiness checklist, including launch blockers | [production-readiness-checklist.md](production-readiness-checklist.md) |
| Decision register | [../00-decisions.md](../00-decisions.md) |
| Archived Azure proposal (rejected) | [archive/azure](archive/azure/README.md) |
