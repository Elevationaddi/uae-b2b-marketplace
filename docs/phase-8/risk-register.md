# Security and delivery risk register (updated for Phase 8)

**Date:** 2026-11-28 (UTC). **Supersedes** the "Required before launch" list in `docs/security-review.md` (SR-1 to SR-5 are carried in below).

**Status:**
- This register comes from internal review and automated testing only. It is **not** an independent security assessment or certification.
- Likelihood (L) and impact (I) are scored 1 (low) to 5 (high). Score = L × I.
- **Owner** is the workstream that closes the risk; the founder approves closure of risks scored ≥ 12.

| ID | Risk | L | I | Score | Current controls | Planned treatment | Workstream | Status |
|---|---|---|---|---|---|---|---|---|
| R-01 | Supplier paid before the dispute window ends, so a later refund cannot be recovered (C-01, C-02) | 4 | 5 | 20 | Dual approval, disputes hold payouts, refunds blocked after payout | Payout eligibility = verified delivery + 14 days + no holds. Eligibility separate from completion. Weekly batch. | 8C/8E | Open |
| R-02 | Wrong VAT charged (for example VAT on behalf of an unregistered supplier) (C-08) | 4 | 5 | 20 | Tax rate is explicit configuration; production refuses to start without it | Per-supplier VAT registration and TRN. Invoice model approved by tax adviser before activation. | 8E | Open |
| R-03 | Payment provider cannot support the multi-seller single payment or corporate bank transfer in the UAE (C-23, C-24) | 3 | 4 | 12 | Sandbox only; docs/08-finance allows limiting to one seller per payment | Eligibility checklist answered in writing before 8C. Fallback: one seller per payment. | 8C | Open |
| R-04 | PostgreSQL SKU or HA not available in UAE North for our subscription | 3 | 4 | 12 | None yet | Read-only SKU check and region access request before approval (`azure-region-verification.md`) | 8A/8B | Open |
| R-05 | Regional outage of UAE North with UAE Central restricted, so data is unavailable beyond RTO | 2 | 5 | 10 | Zone-redundant HA, ZRS, PITR, nightly dumps | UAE Central access request for geo-backup. Regional rebuild drill. Legal view on out-of-country DR. | 8B | Open |
| R-06 | Cross-site scripting impact increased by `'unsafe-inline'` scripts in the CSP (SR-2) | 2 | 4 | 8 | React escaping, no `dangerouslySetInnerHTML`, zod validation, `frame-ancestors 'none'` | Nonce-based CSP through Next.js middleware | 8F | **Mitigated** (nonce CSP, no inline or eval scripts) |
| R-07 | Vulnerable dev-only dependencies (vitest 3 chain) (SR-1) | 2 | 2 | 4 | Not in production dependencies; `pnpm audit --prod` is clean | Upgrade to vitest 4 with a full regression run | 8F | **Closed** (vitest 4.1.12, audit clean) |
| R-08 | Malware upload served to other users before scanning | 2 | 5 | 10 | Scan before use; production refuses to start without a live scanner | ClamAV or Defender adapter, with quarantine and audit (8D) | 8D | Open |
| R-09 | Secrets leaked through git, logs or Terraform state | 2 | 5 | 10 | Secret scan; `.env` and tfvars ignored; log redaction; production refuses weak secrets | Key Vault references only. State storage private, versioned, Entra-only. Deployment identity cannot read secret values. Rotation runbook. | 8A/8B | Partly treated (design) |
| R-10 | Database or storage reachable from the internet | 1 | 5 | 5 | n/a (not deployed) | Private access only (VNet injection, private endpoints, public network disabled), enforced in Terraform | 8A/8B | Treated in design |
| R-11 | WAF absent or misconfigured, so application-layer attacks and volumetric abuse get through | 2 | 4 | 8 | App rate limits in Redis | Application Gateway WAF v2 with managed rules in Prevention mode and per-IP limit. Tuned during the penetration test. | 8B/8F | Treated in design |
| R-12 | Cross-tenant data exposure through a new feature (invoices, statements, exports) | 2 | 5 | 10 | 404 for non-members; negative tests in every phase; scoped exports | Same isolation tests for every 8E feature. Independent test focuses on tenancy. | 8E/8F | Open |
| R-13 | Admin account compromise | 2 | 5 | 10 | Separate origin, mandatory TOTP, recovery codes, no public admin signup, audited actions | Admin access review. Optional IP restriction of the admin host at the gateway. Session review. | 8F | Open |
| R-14 | Webhook spoofing or replay | 1 | 5 | 5 | Signed events (HMAC), exactly-once processing, quarantine | Provider signature verification (Stripe scheme), secret rotation, IP allowlist on the webhook path | 8C | Treated (sandbox) |
| R-15 | Ledger out of balance with the provider | 2 | 5 | 10 | Balanced append-only journals, restore consistency check | Daily reconciliation against provider balance transactions, alert on mismatch | 8C | Open |
| R-16 | Infrastructure cost overrun | 3 | 2 | 6 | Not provisioned | Budgets with alerts at 50/80/100% and forecast. Staging scaled to zero outside test windows. | 8A/8B | Treated in design |
| R-17 | Data protection non-compliance (PDPL): retention, data subject rights, cross-border transfer | 3 | 4 | 12 | Configurable retention, deletion disabled, consent stored | Legal documents (D15), DSAR, export, closure and legal hold workflows (C-19), DPAs with Resend and Stripe | 8E/8F + legal | Open |
| R-18 | "Escrow" or similar regulated terminology used without approval | 2 | 4 | 8 | Term not used in the product | Copy review in 8E. Legal approval of payment wording. | 8E | Treated |
| R-19 | Accessibility barriers for keyboard or screen-reader users | 3 | 3 | 9 | axe automated checks: no serious findings | Manual accessibility testing (8F) | 8F | Open |
| R-20 | Arabic copy errors that change meaning (prices, policies) | 3 | 3 | 9 | Bilingual UI, bidi fixes | Native Arabic review of all copy and templates (8F) | 8F | Open |
| R-21 | Azure Cache for Redis retirement affects new deployments | 3 | 2 | 6 | n/a | Prefer Azure Managed Redis if available in UAE North; the module isolates Redis | 8B | Open |
| R-22 | Staging accidentally exposed or holding real data | 2 | 4 | 8 | n/a | IP allowlist, seeded fictional data only, separate subscription, no production keys | 8B | Treated in design |
| R-23 | TLS terminated outside the UAE (if Front Door is chosen) | 2 | 3 | 6 | Recommended design terminates TLS in UAE North | Keep Application Gateway. Get a legal view before choosing Front Door. | 8A | Treated in design |
| R-24 | Container image or supply chain compromise | 2 | 5 | 10 | Lockfile, frozen installs, dependency audit in CI | Image scanning (Trivy), SBOM, deploy by digest, ACR with Entra-only access | 8B | Open |
| R-25 | Treating automated tests or internal review as certification | 2 | 4 | 8 | Every report states it is not certification | Independent penetration test on staging before the pilot | 8F | Open |
