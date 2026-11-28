# Production readiness checklist

**Use:** a box is ticked only with evidence linked: a PR, a test run, a report or a written approval.

**Status:**
- Phase 8 is **not complete** until every launch gate below is ticked, independently verified where marked **(independent)**, and approved by the founder.
- The application stays in sandbox mode until further notice.

## 8A Infrastructure architecture, IaC and cost (this PR)
- [x] Production architecture and diagram (`architecture.md`)
- [x] Recommended services and lower-cost alternative (`architecture.md`, `cost-estimate.md`)
- [x] Itemized monthly cost estimate in AED for staging and production (`cost-estimate.md`). Some unit prices are unverified.
- [x] Infrastructure as code for bootstrap, staging and production (`infra/azure`). CI validates formatting and syntax only; nothing is applied.
- [x] Environment variable inventory without secret values (`environment-variables.md`)
- [x] Domain, DNS and third-party integration requirements (`domains-and-integrations.md`)
- [x] Payment provider comparison and eligibility checklist (`payment-providers.md`)
- [x] Decisions compared with the implementation (`contradictions.md`)
- [x] Updated risk register and decision register
- [ ] UAE North subscription-level SKU and quota check (needs a subscription: read-only)
- [ ] Every UNVERIFIED price replaced by a calculator quote
- [ ] **Founder approval to provision staging** (amount and billing route)

## 8B Staging deployment, monitoring, backups, DR
- [ ] Code: `APP_ENV=staging` profile (C-20), Azure Blob adapter (C-21), Dockerfiles for web, api, worker and ops images
- [ ] CI: image build, Trivy scan, SBOM, push to ACR by OIDC. GitHub environments with required reviewers.
- [ ] Bootstrap applied; staging applied from a reviewed plan
- [ ] Custom domains and TLS for staging; IP allowlist
- [ ] Monitoring dashboards and alerts firing to on-call (test alert received)
- [ ] Backup job running; PITR restore drill passes `pnpm db:restore-check` with timing recorded against RTO 4 h
- [ ] Regional rebuild drill timed
- [ ] Least-privilege database role for the app (not the server admin)

## 8C Payments with test credentials
- [ ] Stripe eligibility checklist answered in writing (or Mamo)
- [ ] Provider adapter with signature verification; idempotent processing kept
- [ ] Payout eligibility after verified delivery + 14 days, holds, weekly batch, dual approval (C-01, C-02, C-04)
- [ ] Full and partial refunds, chargebacks, transfer reversals
- [ ] Daily reconciliation job and mismatch alert
- [ ] Apple Pay domain verification on staging

## 8D Email and malware scanning
- [ ] Resend DPA approved; sending subdomain verified (SPF, DKIM, DMARC `p=none`)
- [ ] Bilingual (EN/AR) templates for every listed message type
- [ ] Live scanner adapter (ClamAV or Defender) with quarantine; production refusal updated

## 8E Tax, invoicing, commercial policy, admin configuration
- [ ] Commission as a restricted admin setting, with history and a policy version on each order (C-05)
- [ ] Commission reversal on merchandise refunds only (C-06)
- [ ] Supplier VAT status and TRN; supplier invoices, platform commission invoices, credit notes, statements (C-08, C-09). **Tax adviser approval before activation.**
- [ ] Delivery options, proof of dispatch and delivery, seller return policy (C-10, C-11)
- [ ] Auto-completion with holds (C-03); supplier cancellation with refund (C-07)
- [ ] Support auto-close, per-company limit, urgent bypass; compliance exports (C-16 to C-18)
- [ ] Account closure, data access and export requests, deletion requests, legal hold (C-19)
- [ ] Review label, quote validity default, counteroffers (C-12 to C-14)

## 8F Security remediation and testing
- [x] Nonce-based CSP, removing `'unsafe-inline'` where practical (SR-2)
- [x] Vitest 4 upgrade with a full regression run (SR-1)
- [ ] Session security review; cross-tenant isolation review; admin access review
- [ ] Financial ledger reconciliation tests against provider data
- [ ] Dependency and container scanning in CI with no open high or critical findings
- [ ] **Independent penetration test** on staging, with findings fixed or accepted by the founder **(independent)**
- [ ] **Manual accessibility testing** **(independent or specialist)**
- [ ] **Native Arabic language review** **(independent)**
- [ ] Staff user acceptance testing (support, finance, compliance)

## 8G Controlled pilot readiness
- [ ] Legal documents reviewed by a UAE lawyer; tax model approved by a tax adviser
- [ ] Production provisioned (separate approval), with a restore drill in production
- [ ] Runbooks: incident, rollback, key rotation, payout operations, reconciliation
- [ ] Pilot scope and participants approved by the founder

## 8H Production launch (explicit founder approval)
- [ ] Live payment credentials (`PAYMENT_MODE=live`, `FEATURE_REAL_PAYMENTS=true`) approved
- [ ] Live email and scanner on; DMARC at `p=quarantine` or stricter
- [ ] Public registration enabled
- [ ] Founder sign-off recorded in the decision register
