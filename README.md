# UAE B2B Marketplace — development package
Version 1.0 | Proposed implementation baseline | 27 November 2026

Copy the contents of this directory into the root of your project repository (not into a nested folder). Start Claude Code from that root. The original storyboard is in `reference/`. These documents are specifications, not a working application or legal advice.

Start with `CLAUDE.md`, then `docs/00-decisions.md` and `docs/13-roadmap.md`. Implement phase by phase; do not deploy production or enable real money until the launch gates are signed off. The architecture assumes a responsive web application first, native mobile later; change this in the decision register if desired.

| File | Purpose |
|---|---|
| 00-decisions | Scope, defaults and founder approvals |
| 01-product | Product requirements and journeys |
| 02-buyer | Buyer screens and interactions |
| 03-seller | Seller screens and interactions |
| 04-admin | Admin operations |
| 05-ui | Design and shared interaction rules |
| 06-data | Data model, constraints and indexes |
| 07-api | API contract and endpoints |
| 08-finance | Payment, ledger, tax and subscriptions |
| 09-workflows | State machines and business logic |
| 10-security | Permissions, tenant isolation, privacy |
| 11-integrations | External services and notifications |
| 12-testing | Acceptance tests |
| 13-roadmap | Implementation sequence and deployment |

First prompt to paste into Claude Code:

> Read CLAUDE.md and all docs/*.md. Inspect the existing repository before changing anything. Report conflicts and unresolved decisions. Implement Phase 0 only using the proposed development defaults, then run its acceptance checks and update docs/IMPLEMENTATION_STATUS.md. Do not activate live providers, invent business policies, or skip tests. Stop at the phase gate and summarize changes, tests and remaining blockers.
