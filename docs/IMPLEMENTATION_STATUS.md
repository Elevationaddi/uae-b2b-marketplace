# Implementation status
Phases 0–7 are merged and were accepted by the founder on 2026-11-28 as complete within the sandbox development scope. Phase 3 is 8517725 (PR #5); Phase 4 5f543bb (PR #6); Phase 5 4575a7f (PR #7); Phase 6 2154837 (PR #8); Phase 7 (sandbox-safe hardening) 2ccd947 (PR #9). On 2026-11-28 the founder decided the production architecture and commercial model (F01–F13 in `docs/00-decisions.md`) and authorised Phase 8 preparation and staging development only, starting with 8A. Paid services, infrastructure charges, live payments, production credentials and public launch are not authorised; the application stays in sandbox mode. Conflicts between those decisions and the current code are listed in `docs/phase-8/contradictions.md` and have not been changed silently.

| Phase | Status | Evidence | Blockers |
|---|---|---|---|
| 0 | DONE | Merged to `main` as 08a127e (PR #1), CI run 46055408891 green | None |
| 1 | DONE | Approved by the founder 2026-11-28; merged to `main` as 7cddb66 (PR #2); GitHub Actions green including WebKit | None |
| 2 | DONE | Merged to `main` as a0f0126; CI run 46081580836 green (110 passed, 2 skipped incl. WebKit) | None |
| 3 | DONE | Merged to `main` as 8517725 (PR #5); CI run 46087385321 green (E2E 120 passed, 4 skipped) | Provisional decisions P3-1…P3-7 need confirmation |
| 4 | DONE (sandbox only) | Merged to `main` as 5f543bb (PR #6); CI green | Provisional decisions P4-1…P4-7; D05/D06 for live payments |
| 5 | DONE (sandbox only) | Merged to `main` as 4575a7f (PR #7); CI green | Provisional decisions P5-1…P5-7; D05 for live refunds and payouts |
| 6 | DONE | Merged to `main` as 2154837 (PR #8); CI green | Provisional decisions P6-1…P6-6; role-specific UAT with real staff not done |
| 7 | DONE (sandbox-safe part; accepted 2026-11-28) | Merged to `main` as 2ccd947 (PR #9); CI green | Live integrations moved to Phase 8 workstreams |
| 8 | IN PROGRESS (code only, nothing provisioned; sandbox) | Azure 8A rejected 2026-11-28 and archived. Merged: financial conflicts C-01 to C-06 (#13), VAT configuration (#14), PostgreSQL scheduler (#15), support/quote/review rules (#16), supplier cancellation and return policy (#17), nonce CSP and Vitest 4 (#18); Vercel-first architecture (#19). Founder answered all questions on 28 Nov 16:33 UTC (P8-1 to P8-14 approved). Then: scheduled weekly payouts and 30-day commission notice (P8-15, P8-16). 14 of 24 conflicts fixed in code | Remaining authorised code: C-14, C-18 to C-21, buyer cancellation, sample requests, staging profile; founder: Vercel plan and spend controls, then deployment authorisation; launch blockers in the readiness checklist |

For each completed phase record date, commit, implemented routes, migrations, tests actually executed with pass/fail counts, commands, known bugs, security review, decisions changed, and next gate. Do not mark DONE if an acceptance test is missing or failing. Keep this file current.

## Phase 8: delivery options (C-10, FD-08)
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8-delivery-options`.

**Delivered**
- Migration `20261210000000_phase8_delivery_options` (additive): `storefronts.delivery_rates` (backfilled from the old flat fee and emirate list, which stay in place unused), collection fields, `orders.delivery_method` (`DELIVERY`, `COLLECTION`, `QUOTE_TERMS`), `shipments.dispatch_proof_file_id`.
- Storefront: per-emirate fee and days for all seven emirates; free buyer collection (emirate, days, EN/AR instructions; enabling it needs an emirate and English instructions).
- Checkout: the buyer picks delivery or collection per supplier; unserved emirates block delivery only; collection is free; the method is covered by the preview hash. Orders snapshot method, charge, days and collection terms; quote orders record `QUOTE_TERMS`.
- Collection instructions are hidden from the buyer until payment is confirmed; the supplier always sees them. Later storefront edits do not change an order.
- Fulfilment: collection handover without a carrier; optional proof of dispatch upload (scanned, audited downloads `GET .../orders/{id}/dispatch-proof`, 404 for anyone outside the order).
- Web: rate table and collection section on the storefront page, method choice at checkout, delivery method and collection on order pages, dispatch-proof field. EN/AR messages.

**Tests actually run locally (2026-11-28)**
- New integration suite `apps/api/test/delivery-options.int.test.ts` (5): per-emirate pricing and unserved emirate, invalid rates and collection settings (422), collection not offered, collection snapshot and post-payment reveal with carrier-free handover, dispatch proof with tenant isolation.
- Full API suite 163 passed (18 files) before merging main; web 12 passed. Lint, Prettier, typecheck clean.

## Phase 8: scheduled weekly payouts and commission notice (founder decisions 2026-11-28 16:33 UTC)
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8-payout-schedule`.

**Delivered**
- Decision register: P8-1 to P8-14 marked approved; P8-15 (payout schedule) and P8-16 (commission notice) added; summary table of the evening decisions and FD-01 to FD-21 answers.
- Migration `20261208000000_phase8_payout_schedule` (additive): payout state `PROPOSED`, `payouts.proposed_at` and nullable `requested_by_id` (only for proposals, enforced by a check constraint), `payout_runs.scheduled_for`, `proposed_at`, `proposed_count`, table `payout_holidays`, `commission_policies.effective_from`.
- Scheduler task `payouts.weekly_proposal` (every 5 minutes, idempotent): once the run is due (Monday 10:00 Dubai by default, `PAYOUT_WEEKDAY`, `PAYOUT_TIME`; weekends and recorded holidays move it to the next working day), proposes one payout per supplier with eligible orders. No minimum amount.
- Finance confirms a proposal (`POST /admin/payouts/{id}/confirm`, it becomes a request with the confirmer as requester) or withdraws it with a reason (`/withdraw`, orders released). A proposal cannot be approved directly; a different finance approver approves as before.
- Holiday calendar: `GET/POST /admin/payouts/holidays`, `DELETE /admin/payouts/holidays/{date}` (audited). Admin payouts page shows the scheduled time, proposal status, next run and the holiday list, with Confirm and Withdraw on proposals.
- Commission changes need an effective date at least `COMMISSION_NOTICE_DAYS` (30) ahead; suppliers' owners and finance users get an in-app notice (EN/AR); the history shows effective dates and scheduled versions.

**Tests actually run locally (2026-11-28)**
- New unit tests `apps/api/src/fulfilment/payout-schedule.test.ts` (4): default time, holiday shift, weekend skip, configured weekday.
- New integration test (scheduled payouts): holiday CRUD and permissions, not proposed before the shifted time, proposed once after it, proposal cannot be approved directly, confirm then second-user approval, withdraw releases orders, system audit.
- Commission test updated: under 30 days refused, scheduled version not in effect until its date, supplier notified.
- Full API suite 163 passed (18 files); config 23, web 12, worker 10. Lint, Prettier, typecheck clean.

## Phase 8: Vercel-first architecture at zero added cost (founder message 2026-11-28 09:28 UTC)
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8-vercel-docs`. Documentation only; nothing provisioned, connected or subscribed.

**Delivered**
- `docs/phase-8/vercel-architecture.md`:
  - architecture and diagram;
  - every service in the founder's four categories, with commercial-use, card, limit, overage and region columns;
  - usage-charge risks and spend protection;
  - worker, database, storage, malware-scanning and residency plans;
  - documented limits with alternatives, and questions for the founder.
- Vercel facts were checked against Vercel's documentation. Values the docs did not show are marked **confirm**, to be read from the provider or the founder's account before choosing.
- Azure proposal archived: `docs/phase-8/archive/azure` and `infra/archive/azure` (never applied). The Terraform job was removed from CI. Decision F02 is marked rejected and replaced.
- Risk register: R-04, R-05, R-21 and R-23 closed; R-26 to R-30 added (usage charges, residency, free-tier limits, cron frequency, RPO proof).
- Readiness checklist: revised 8A section, plus a launch-blocker list that includes the restore drill for RPO 15 minutes.

## Phase 8: security fixes (SR-1, SR-2)
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8-security`.

**Delivered**
- Nonce-based Content Security Policy: a fresh nonce per response in `apps/web/src/middleware.ts`, `script-src 'self' 'nonce-…' 'strict-dynamic'`, no `'unsafe-inline'` or `'unsafe-eval'` for scripts in production. Next.js applies the nonce to its own scripts (pages already render per request). Zod is configured to validate without `Function` in the browser (`packages/contracts/src/runtime.ts`), which removed the only eval attempt.
- Vitest 3.2.7 to 4.1.12 in all five packages; no configuration changes were needed.

**Commands actually run (2026-11-28)**
- Production build (`NODE_ENV=production next build`, `next start`), Playwright on `/en/login`, `/ar/register`, `/en`: CSP header present, nonce on every script, no CSP violations, pages hydrate.
- `pnpm audit` (all dependencies): no known vulnerabilities.
- Vitest 4: API 154 passed, worker 10, web 12 (2 new CSP tests), contracts 62, config 23.

## Phase 8: supplier cancellation and return policy (C-07, C-11)
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8-order-policies`.

**Delivered**
- Migration `20261207000000_phase8_cancellation_returns` (additive): `orders.seller_cancel_requested_at` and `seller_cancel_reason` (set together), `refunds.seller_cancellation`, `storefronts.return_policy_en` and `return_policy_ar`.
- Seller route `POST /seller/workspaces/{ws}/orders/{id}/cancel` with a reason: requests a full refund for finance approval, blocks processing and dispatch while pending, notifies the buyer (`order.supplier_cancelled`) and is audited. Finance rejection withdraws it; provider success cancels the order with reason `cancelled_by_supplier` (P8-14).
- Seller order page: Cancel order with a confirmation and reason, and a pending-cancellation notice for both parties.
- Storefront return policy (EN/AR), shown in the checkout preview and recorded on each order; the order page shows the policy the buyer accepted.

**Tests actually run locally (2026-11-28)**
- New `order-policies.int.test.ts` (4 tests): cancel, refusal while pending, finance approval and provider success, rejection then dispatch, refusal after dispatch and for unpaid orders, cross-tenant 404; return policy in preview, hash and order snapshot. Full counts are in the PR description.

## Phase 8: support limits, ticket auto-close, quote validity and review label (C-12, C-13, C-16, C-17)
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8-support-quote-review`.

**Delivered**
- Migration `20261206000000_phase8_support_limits` (additive): support categories Security and Compliance, `companies.support_ticket_limit` (1 to 100 or null), and an index for resolved tickets.
- Open-ticket limit is now 10 per company (was 20 per workspace); Payment, Security and Compliance tickets always pass; support managers can set a per-company exception with a reason (audited) from the admin company page (P8-13).
- Hourly `support.auto_close` task closes resolved tickets after 7 days without a customer response (audited as a system action).
- Quote validity defaults to 7 days. Reviews show "Verified business buyer". Buyer dispute texts now describe the window from verified delivery.

**Tests actually run locally (2026-11-28)**
- 2 new integration tests in `operations.int.test.ts` (limit, urgent bypass, exception, audit; auto-close of silent tickets only). Full counts are in the PR description.

## Phase 8: PostgreSQL scheduler for background work
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8-job-queue`. **Authority:** founder message of 2026-11-28 09:28 UTC: build a PostgreSQL job queue, do not assume BullMQ runs on Vercel, and never lose financial operations when a function stops. Nothing deployed or provisioned.

**Delivered**
- Migration `20261205000000_phase8_background_tasks` (additive): `background_tasks` with cadence, lease, last outcome and failure counters.
- `packages/db/src/background-tasks.ts`: register, claim with a lease (database clock), finish (only the lease owner), exponential backoff capped at 15 minutes, `runDueTasks` with a deadline, and a health view (P8-12).
- The worker now drives this scheduler every second instead of BullMQ; Redis is no longer needed by the worker (`bullmq` and `ioredis` removed from it). Its readiness check covers the database and the heartbeat task.
- `apps/worker/api/cron.ts` and `apps/worker/vercel.json`: a Vercel Function for Vercel Cron (every minute). Each call runs passes about a second apart for up to 45 s, so two-second tasks such as email and payment events still run many times per minute. It refuses without `CRON_SECRET` (bearer, constant-time comparison). Not deployed.
- Admin overview shows the health of every background task (running, failing, overdue) in EN/AR.

**Tests actually run locally (2026-11-28)**
- Worker: 4 files, **10 passed**, including 6 new scheduler tests: single claim under concurrency, recovery after a killed run, late finish by a dead runner ignored, backoff, deadline, and cron authentication.
- API, contracts, config and web suites: see the PR description for counts.

**Limits to know**
- Vercel Cron runs at most once a minute and only on a paid Vercel plan; on the Hobby plan crons run once a day, which is not enough. Email and payment processing can therefore lag up to about a minute when running only from cron. The long-running worker has no such lag.
- Function run time counts towards the Vercel plan's included usage; see the cost document in PR 6.

## Phase 8: tax configuration (C-08, C-09)
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8-tax-configuration`. **Authority:** founder message of 2026-11-28 09:28 UTC: remove the automatic standard VAT assumption, make tax treatment configurable, add supplier VAT status and invoice preparation, and make no real tax calculation or binding invoice without professional approval. Nothing provisioned; still sandbox mode.

**Delivered**
- Migration `20261204000000_phase8_tax_configuration` (additive): `VatRegistrationStatus` enum; company `vat_status`, `vat_status_confirmed_at`, `vat_status_confirmed_by_id`; checks that a registered company has a 15-digit TRN and that a confirmation names who confirmed it. Companies that already had a TRN are recorded as declaring registration (unconfirmed).
- `TAX_TREATMENT` (`provisional_standard` default, or `supplier_status`) and `TAX_APPROVAL_REFERENCE`. Production refuses to start without `supplier_status` and an approval reference (P8-9).
- Per-supplier VAT rule on the checkout preview and on each order (`orders.snapshot.tax`, with the supplier's VAT status and TRN at the time). Unconfirmed suppliers block checkout in `supplier_status` mode (`supplier_vat_unconfirmed`).
- Company form and page show the VAT declaration and whether compliance confirmed it; admin company page has a confirmation form (reason required, audited as `company.vat_status_confirmed`) (P8-10).
- Quote submission and revision check the supplier's VAT status in `supplier_status` mode.
- Non-binding invoice drafts for buyer, seller and admin, marked "not a tax invoice" (P8-11). Order pages and checkout show which VAT rule applied and label the provisional rate.
- New routes: `POST /admin/companies/{id}/vat-status`, `GET /buyer/workspaces/{ws}/orders/{id}/invoice-draft`, `GET /seller/workspaces/{ws}/orders/{id}/invoice-draft`, `GET /admin/orders/{id}/invoice-draft` (OpenAPI regenerated).

**Tests actually run locally (2026-11-28)**
- API (unit and PostgreSQL integration): 16 files, **152 passed**, 0 failed, including 7 new unit tests (`tax.test.ts`) and 3 new integration tests (`tax.int.test.ts`).
- Contracts 62 passed; config 23 passed; web 10 passed. Lint, Prettier and typecheck clean.
- Browser E2E runs in CI on the pull request.

**Still needed before VAT is used for real**
- A UAE tax professional must approve the rules (standard rate, delivery charge treatment, zero-rated and exempt supplies, the commission invoice and its VAT). Then set `TAX_APPROVAL_REFERENCE`.
- Binding invoices, invoice numbering, credit notes and statements are not built; they wait for that approval.

## Phase 8: financial policy conflicts (C-01 to C-06)
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8-financial-conflicts`. **Authority:** founder message of 2026-11-28 09:28 UTC: code-only changes for the approved business policies, financial conflicts first. Nothing provisioned, no live service connected, still sandbox mode.

**Delivered**
- Migration `20261203000000_phase8_financial_policies` (additive only; existing orders backfilled from stored data): `commission_policies` (append-only), `order_holds` (never deleted, released once), `payout_runs`, order columns for verified delivery, the dispute window and the commission rate and policy, refund split columns, and `payouts.run_id` with one live payout per supplier per run.
- Payout eligibility only after verified delivery plus the 14-day window, with no dispute, hold, open reconciliation case or pending refund (C-01, C-02). Auto-completion and eligibility sweep in the worker every 5 minutes (C-03).
- Weekly payout run, approval re-checks of every order, and a provider balance check (ledger-derived in sandbox) (C-04).
- Versioned commission policy set by FINANCE_APPROVER with TOTP step-up, reason and audit; each checkout and order records its rate and policy (C-05).
- Refund split (merchandise, delivery, VAT) with commission reversed on merchandise only (C-06).
- Admin screens: settlement holds, commission, weekly payout run card, refund split fields, reconciliation case resolution. Order pages show verified delivery and the dispute window (EN/AR).
- New API routes: `GET/POST /admin/holds`, `POST /admin/holds/{id}/release`, `GET /admin/payouts/run`, `GET/POST /admin/finance/commission`, `POST /admin/finance/reconciliation/{id}/resolve` (OpenAPI regenerated).
- New capabilities: `admin.holds.manage` (COMPLIANCE, FINANCE, FINANCE_APPROVER), `admin.commission.manage` and `admin.reconciliation.resolve` (FINANCE_APPROVER).
- SANDBOX-only test clock CLI `sandbox:end-dispute-window` for browser journeys (refuses in production and unless `PAYMENT_MODE=mock`; audited).
- Provisional rules P8-1 to P8-8 in `docs/00-decisions.md`.

**Tests actually run locally (2026-11-28)**
- API (unit and PostgreSQL integration): 14 files, **142 passed**, 0 failed, including 14 new unit tests and 6 new integration tests for the financial rules.
- Contracts 62 passed; config 21 passed; web 10 passed; worker 4 passed. Lint and Prettier clean; typecheck clean for API, web, worker and E2E.
- Browser E2E was not run locally; it runs in CI on the pull request.

**Known limits**
- The provider balance is derived from the ledger in sandbox. A live adapter must query the provider's available balance before approval (launch blocker).
- A reconciliation case opened by a provider event holds an already-eligible order at the next 5-minute sweep; payout requests and approvals re-check immediately.

## Phase 8A: infrastructure architecture, IaC and cost estimates
**Date:** 2026-11-28 (UTC). **Branch:** `phase-8a-infrastructure`.

**Authority:** founder decision of 2026-11-28 (F13): start with 8A only.

**Nothing was provisioned:**
- No Azure subscription, credentials, domain or third-party account was used or created.
- No paid service was activated.
- No application behaviour changed.

**Delivered** (`docs/phase-8/`):
- Architecture and diagram: Azure UAE North, Container Apps, PostgreSQL flexible server with zone-redundant HA, Redis, Blob ZRS, Key Vault, Application Gateway WAF v2, Log Analytics, private networking.
- Region availability check.
- Itemized AED cost estimate:

  | Option | Production | Staging | Total |
  |---|---:|---:|---:|
  | Recommended | AED 6,071/month | AED 1,443/month | AED 7,514/month |
  | Lower-cost alternative | AED 2,656/month | AED 1,443/month | AED 4,099/month |

  The figures are list prices, exclude VAT and include 15% contingency. PostgreSQL and Log Analytics unit prices are unverified for UAE North.
- Payment provider comparison and eligibility checklist (Stripe Connect, Mamo).
- Domains, DNS and integration requirements.
- Environment variable inventory (no secret values).
- Contradictions C-01 to C-24.
- Risk register R-01 to R-25.
- Production readiness checklist.
- Decision register F01–F13, with the status of every provisional rule.

**Infrastructure as code** (`infra/azure`, Terraform, azurerm 4.x):
- Bootstrap: state storage and certificates vaults.
- A platform module.
- Staging and production roots.
- Example variable and backend files (real ones are git-ignored).

**Key findings:**
1. **Stripe for UAE platforms:**
   - It supports only Custom connected accounts, with destination charges or separate charges and transfers.
   - It lists no corporate bank transfer method for the UAE.
   - One payment for a multi-seller cart needs written confirmation.
2. **PostgreSQL in UAE North:** a recent community report shows `SkuNotAvailable` that a quota increase did not fix. A subscription-level check and a possible region access request are needed before approval.
3. **Paired region:** UAE Central is access-restricted, so geo-redundant backup needs a Microsoft access request.
4. **Recovery objectives:** recommended RPO ≤ 15 minutes for the financial database, using built-in PITR, instead of 24 hours. RTO stays 4 hours.
5. **Code changes needed before staging can run** (8B):
   - an `APP_ENV=staging` profile (C-20), because production mode refuses sandbox adapters;
   - an Azure Blob storage adapter (C-21), because Blob is not S3-compatible.
6. **Financial logic conflicts:**
   - payout eligibility starts at completion, not after the dispute window (C-01, C-02);
   - commission is reversed pro rata of the order total, not merchandise (C-06);
   - catalogue VAT is always STANDARD (C-08).
   These are recorded, not changed.

**Commands and checks:**
- `python3 infra/azure/cost-model.py` reproduces the cost tables.
- CI job `infrastructure` runs `terraform fmt -check -recursive` and `terraform validate` (no backend, no credentials) for bootstrap, staging and production. The result is recorded on the PR.
- Terraform was **not** run locally: downloading the binary was blocked in this environment.
- Application tests were not re-run, because no application code changed. The CI `verify` job runs them on the PR.

**Next gate:**
1. Founder approval of the monthly amount and billing route to provision staging (8B).
2. Stripe eligibility answers (8C).
3. Resend data-processing approval (8D).
4. Tax adviser and lawyer engagement (8E, F11).

## Phase 7: production readiness (sandbox-safe part only)
**Date:** 2026-11-28 (UTC). **Merged:** 2ccd947 (PR #9). **Exit gate (docs/13-roadmap.md):** T37–T38 plus all regressions; D01–D15 production gates approved. Only the parts that need no live service or production decision were built; the gate itself is **not met** because D01–D15 are open and no production environment exists.

### Delivered
- **T37 restore drill:** `pnpm db:restore-check` dumps the database, restores it into a temporary database and checks schema, migrations, row counts and transaction consistency (balanced journals, refund caps, order totals, payout allocations), then removes the copy.
- **T38 production refusal:** `pnpm check:production-refusal` starts the built API and worker in production mode with five unsafe configurations; both refuse to start every time. Added to CI after the build. A new integration test shows that without a payment provider checkout is refused, the cart still works and there is no sandbox fallback.
- **Performance:** `pnpm perf:check` load-tests marketplace reads with 50 concurrent clients. The marketplace home page hydrated sections one after another (p95 509 ms); it now loads them concurrently (p95 242 ms).
- **Security review:** `docs/security-review.md` (controls, evidence, findings SR-1…SR-5, launch requirements). HSTS added for production web builds.
- **Docs:** operational commands in `docs/DEVELOPMENT.md`.

### Commands actually run
| Command | Result |
|---|---|
| `pnpm db:restore-check` (development database) | pass (output below) |
| `pnpm check:production-refusal` (local .env base, and again with the CI environment and no .env) | pass: 8 of 8 refusals (API and worker × 4 cases) |
| `pnpm perf:check` (local production build, single machine) | pass (output below) |
| `pnpm audit --prod` | no known vulnerabilities |
| `pnpm audit` (incl. dev) | 2 critical, 3 moderate in the vitest test-runner chain (SR-1, dev only); fixed in Phase 8 with vitest 4.1.12, now no known vulnerabilities |
| Secret scan (`git ls-files`, key patterns) | no secrets tracked; only fictional seeded dev credentials |
| `pnpm lint`, `pnpm format:check`, `pnpm typecheck` | pass |
| `pnpm test` (worker stopped) | pass: 219 tests, 0 failed (config 21, contracts 62, api 122 incl. new T38 test, web 10, worker 4) |
| `pnpm test:e2e --project=chromium --project=mobile-360` | 76 passed, 8 skipped, 0 failed (regression after the home-page and header changes) |

Restore drill output:
```
dump 5.5 MiB, total 3.2 s
expected migrations: 9
PASS  migrations_applied           source=9  restored=9
PASS  migrations_unfinished        source=0  restored=0
PASS  migrations_rolled_back_attempts source=1  restored=1
PASS  tables                       source=74  restored=74
PASS  triggers                     source=31  restored=31
PASS  constraints                  source=245  restored=245
PASS  companies                    source=1574  restored=1574
PASS  users                        source=2532  restored=2532
PASS  orders                       source=244  restored=244
PASS  payments                     source=210  restored=210
PASS  ledger_entries               source=513  restored=513
PASS  audit_events                 source=24054  restored=24054
PASS  refunds                      source=28  restored=28
PASS  payouts                      source=16  restored=16
PASS  support_tickets              source=39  restored=39
PASS  ledger_total_debit           source=13654584  restored=13654584
PASS  ledger_total_credit          source=13654584  restored=13654584
PASS  unbalanced_journals          source=0  restored=0
PASS  over_refunded_orders         source=0  restored=0
PASS  order_total_mismatch         source=0  restored=0
PASS  payout_allocation_mismatch   source=0  restored=0
All restore checks passed
```

Performance output (local, not production hardware):
```
API http://localhost:4000, 50 concurrent clients, 20 s
endpoint            requests   p50     p95     p99   errors
home                    609    174     242     298       0
categories              609     73     112     139       0
search                  609    186     256     315       0
search_category         608    167     231     290       0
suggest                 608     92     128     153       0
product                 608    172     234     297       0
related                 608    207     292     361       0
suppliers               608    172     237     293       0
supplier                608    166     230     284       0
reviews                 608    206     285     363       0
overall: 6083 requests, 304 req/s, p50 169 ms, p95 247 ms, p99 320 ms, errors 0
PASS (p95 < 500 ms, no errors)
```

### Not done (needs founder decisions, real services or people)
- Live PSP, payout rail, production email provider, live malware scanner (D05, email provider, A14): not connected, by instruction.
- Hosting, region, TLS, secret manager, WAF, monitoring and alerting, backups and a timed restore drill on production infrastructure (D12).
- Independent penetration test; manual accessibility and real-device testing; staff UAT; native-speaker Arabic review.
- Legal, tax and policy approvals (D06, D08, D09, D14, D15) and the launch checklist in docs/13-roadmap.md.

### Next gate
Founder decisions on D01–D15 and the provisional P3–P6 rules; then a staging environment for live-provider sandbox testing.

## Phase 6: support, operations overview, scoped exports, accessibility
**Date:** 2026-11-28 (UTC). **Merged:** 2154837 (PR #8). **Exit gate (docs/13-roadmap.md, docs/12-testing.md):** T33–T36, T41; role-specific UAT.

### Delivered
- **Customer support:** buyer and seller workspaces open tickets (topic, subject, message, optional link to one of their own orders, for example from an order page), follow the conversation, reply, reopen a resolved ticket and close it. Viewers read only. Tickets are workspace-wide; other companies get 404.
- **Admin support queue:** SUPPORT agents filter by state and assignment, take or take over a ticket, reply (customer is notified in-app and by email), resolve with an optional note, reopen. Agents see only the order number, state and total. Every state change is audited; messages are append-only.
- **Operations overview:** the admin overview now adds live queues (open and unassigned tickets and disputes, refunds and payouts awaiting approval, open reconciliation cases, quarantined webhooks) and, for finance roles only, commerce figures for a chosen Dubai date range (paid orders, gross value, refunds, net, platform fees, owed to sellers now, paid out), computed from orders, refunds, payouts and the ledger, labelled as sandbox data.
- **Reports:** CSV exports of orders, refunds, payouts, disputes and support tickets with a reason and a fresh authenticator code; role-scoped (T41), audited when created, denied or downloaded, creator-only download, deleted after 24 hours by the worker. Formula injection is neutralised and amounts are exact AED from integer fils.
- **Marketing consent (T36):** a separate, default-off marketing email preference with recorded consent time; critical notices stay on.
- **Licence expiry (T35):** verified that an expired seller licence blocks new trades while existing orders stay readable and shippable.
- **Accessibility:** automated axe-core WCAG 2.1 A/AA checks on public, buyer, seller and admin pages in English and Arabic: no serious or critical findings. Mixed Arabic/English message threads now isolate names, times and bodies (`bdi`, `dir="auto"`).
- **Worker:** `export.cleanup` every 10 minutes.

### Routes, schema, permissions
- 16 new API operations, documented in `docs/api/README.md` (Phase 6 sections) and `docs/api/openapi.json`.
- Migration `20261202000000_phase6_support_exports`, additive only: `docs/db/phase-6-schema.md`.
- New admin capabilities: `admin.support.read` and `admin.support.manage` (SUPPORT), `admin.reports.export` (SUPPORT, FINANCE, FINANCE_APPROVER; scope rules in P6-4).

| Action | Any member | Members except VIEWER | SUPPORT | FINANCE / FINANCE_APPROVER | COMPLIANCE | SUPER_ADMIN |
|---|---|---|---|---|---|---|
| Read own workspace's tickets | Y | Y | — | — | — | — |
| Open, reply, reopen, close own workspace's ticket | — | Y | — | — | — | — |
| Support queue and ticket detail | — | — | Y | — | — | — |
| Take, reply, resolve, reopen tickets | — | — | Y (reply/resolve only when assigned) | — | — | — |
| Operations queues | — | — | Y | Y | Y | Y |
| Commerce figures | — | — | — | Y | — | — |
| Export orders, refunds, payouts, all disputes | — | — | — | Y | — | — |
| Export disputes and tickets assigned to me | — | — | Y | — | — | — |

### Commands actually run
| Command | Result |
|---|---|
| `pnpm lint` | pass (0 warnings) |
| `pnpm format` (prettier check) | pass |
| `pnpm typecheck` | pass |
| `pnpm test` (worker server stopped) | pass: 218 tests, 0 failed (config 21, contracts 62, api 121 incl. 8 new operations integration tests and 4 export unit tests, web 10, worker 4) |
| `pnpm build` (production) | pass |
| `pnpm --filter @app/contracts openapi` | regenerated |
| `pnpm test:e2e --project=chromium --project=mobile-360` | 76 passed, 8 skipped, 0 failed (includes `operations.spec.ts`, `accessibility.spec.ts` and the T33 checks in `checkout.spec.ts`) |
| Screenshots (`operations.screenshots.spec.ts`, deviceScaleFactor 2) | pass: 44 screenshots (EN/AR, desktop/phone) in `phase-6/screenshots` |
| WebKit / mobile Safari | not available in this environment; run in CI |

Fixed during verification: commerce money figures clipped on overview cards (now wrap), Arabic threads reordered English punctuation and mixed the author name with the date (bidi isolation added, also in dispute threads), a stale preferences assertion in the Phase 3 test, and a parallel-test race that closed another test's ticket.

### Acceptance tests
| Test | Covered by | Result |
|---|---|---|
| T33 Arabic/mobile checkout: RTL, no clipping, totals identical | `checkout.spec.ts` (EN desktop vs AR 360 px totals, no horizontal overflow, totals inside viewport) | pass |
| T34 network failure on form submission: recoverable error, fields kept, retry safe | `operations.spec.ts` (aborted request, fields kept, retry creates exactly one ticket) | pass |
| T35 seller licence expires: new trades restricted, existing orders accessible | `operations.int.test.ts`; `companies.int.test.ts` (Phase 1) | pass |
| T36 user opts out of marketing: marketing suppressed, critical notices kept | `operations.int.test.ts` (no marketing sending exists; consent stored; support notice still in-app and emailed) | pass |
| T41 CSV export by support outside assigned scope: denied and audited | `operations.int.test.ts`, `export.test.ts`, `operations.spec.ts` | pass |
| Support lifecycle, assignment, isolation, append-only history, notifications, audit | `operations.int.test.ts`, `operations.spec.ts` | pass |
| Overview commerce figures from data, finance-only | `operations.int.test.ts`, `operations.spec.ts` | pass |
| Accessibility (automated) | `accessibility.spec.ts` (axe-core 4.10.2) | pass |
| Role-specific UAT with real staff | not done (needs people) | open |

### Security review
| Area | Control |
|---|---|
| Tenant isolation | Ticket routes resolve workspace membership; other workspaces' tickets return 404; linked orders/RFQs must belong to the workspace |
| Least privilege | Support sees only order number, state and total; commerce figures need `admin.finance.read`; exports scoped by role (T41) |
| Bulk data exfiltration | Exports need a reason and TOTP step-up (replay-protected), are rate limited (10/hour), audited on create, deny and download, creator-only, and deleted after 24 h |
| CSV injection | Formula-leading cells prefixed with an apostrophe; RFC 4180 quoting |
| Staff privacy | Customers never see the agent's name or email |
| Immutability | Support messages append-only by trigger; audit events append-only (Phase 1) |
| CSRF / rate limits | All state changes need the CSRF token; ticket creation 10/hour per user; replies share the message limit |

### Known issues and limitations
- No marketing campaigns exist; only consent is stored.
- Resolved tickets do not auto-close; no SLA timers or agent workload balancing.
- Tickets have no attachments (customers describe the issue in text).
- Exports are synchronous (fine up to 50,000 rows); larger reports would need a background job.
- Automated accessibility checks do not replace manual keyboard and screen-reader testing.
- Arabic copy needs native-speaker review.
- Tests add fictional tickets and exports to the development database.

### Decisions needed before Phase 7 (production readiness)
1. Confirm or change P6-1 to P6-6 (and P3/P4/P5 sets).
2. Whether resolved tickets should auto-close after N days, and support SLAs.
3. Who may export all support tickets, if anyone, and the export retention period.
4. Production decisions D01–D15 (hosting, PSP, email provider, backups) before any live integration.

### Next gate
Merged under the standing instruction once CI is green; Phase 7 covers only sandbox-safe hardening.

## Phase 5: fulfilment, receipt, disputes, refunds, payouts, reviews
**Date:** 2026-11-28 (UTC). **Merged:** 4575a7f (PR #7). **Exit gate (docs/13-roadmap.md, docs/12-testing.md):** T24–T32, T39; no manual paid flags.

### Delivered
- **Fulfilment:** supplier starts processing, records dispatch (carrier, tracking, expected date; one full shipment per order) and reports delivery with an optional malware-scanned proof file. Only paid orders can move (T24). Shipping works by role even while the company is restricted, so paid goods are never stranded.
- **Receipt:** the buyer confirms receipt (confirmation dialog); the order completes and becomes eligible for payout. Nothing completes or pays automatically (T25). The seller and buyer viewers cannot confirm (T26).
- **Reviews:** one rating and comment per completed order (T39); immutable content; compliance hides or republishes with a reason; public storefront shows average and recent reviews as "Verified buyer".
- **Disputes:** either party opens one active dispute per paid order (until 14 days after receipt, never after payout); payout eligibility is held (T27); append-only messages with evidence files; support assigns, requests evidence, proposes no action (and closes) or a refund (finance executes; the dispute closes on provider confirmation).
- **Refunds:** finance requests, a different finance approver decides (T28); cumulative refunds capped at the order total (T29); worker submits to the sandbox provider with an idempotency key; ledger reversal posted once on the signed webhook; duplicates and out-of-order events ignored (T30); failures open a reconciliation case; a full refund of an unshipped order cancels it.
- **Payouts:** finance requests a payout of a supplier's eligible, undisputed orders; a different approver approves; the worker submits it; orders are marked paid out only on the provider's paid event; a failure releases them and opens a reconciliation case with no paid label (T31).
- **Seller finance:** gross, commission, refunds, net payable and not-yet-eligible, eligible, held, in-payout and paid-out amounts with payout history.
- **Admin:** disputes queue and case page (SUPPORT manages; FINANCE and FINANCE_APPROVER read), refunds and payouts with labelled sandbox completion buttons, supplier review moderation (COMPLIANCE). Order detail shows shipment, settlement and dispute links.
- **Notifications:** dispatched, delivered, completed, refunded, dispute opened/updated, payout paid/failed (in-app and email through the outbox).
- **Worker:** `settlement.submit` (2 s); `sandbox.webhooks` also delivers refund and payout events (mock mode only).

### Routes, schema, permissions
- 40 new API operations, documented in `docs/api/README.md` (Phase 5 sections) and `docs/api/openapi.json`.
- Migration `20261201000000_phase5_fulfilment_settlement`, additive only: `docs/db/phase-5-schema.md`.
- New admin capabilities: `admin.disputes.read` (SUPPORT, FINANCE, FINANCE_APPROVER), `admin.disputes.manage` (SUPPORT), `admin.refunds.request` and `admin.payouts.request` (FINANCE), `admin.refunds.approve` and `admin.payouts.approve` (FINANCE_APPROVER), `admin.reviews.moderate` (COMPLIANCE).

| Action | Buyer owner | Procurement | Buyer viewer | Seller owner | Sales | Warehouse | Finance | Seller viewer | Admin |
|---|---|---|---|---|---|---|---|---|---|
| Process, dispatch, report delivery | — | — | — | Y | — | Y | — | — | — |
| Confirm receipt, review | Y | Y | — | — | — | — | — | — | — |
| Open dispute, post messages | Y | Y | — | Y | Y | Y | — | — | — |
| View disputes, proof, evidence | Y | Y | Y | Y | Y | Y | Y | Y | SUPPORT, FINANCE, FINANCE_APPROVER |
| Seller finance summary | — | — | — | Y | — | — | Y | — | — |
| Manage disputes | — | — | — | — | — | — | — | — | SUPPORT |
| Request refund / payout | — | — | — | — | — | — | — | — | FINANCE |
| Approve refund / payout (never own request) | — | — | — | — | — | — | — | — | FINANCE_APPROVER |
| Moderate reviews | — | — | — | — | — | — | — | — | COMPLIANCE |

### Commands actually run
| Command | Result |
|---|---|
| `pnpm lint` | pass (0 warnings) |
| `pnpm format` | pass |
| `pnpm typecheck` | pass |
| `pnpm test` (worker server stopped) | pass: 206 tests, 0 failed (config 21, contracts 62, api integration 109 incl. 10 new fulfilment tests, web 10, worker 4) |
| `pnpm build` (production) | pass |
| `pnpm --filter @app/contracts openapi` | regenerated |
| `pnpm test:e2e --project=chromium --project=mobile-360` | 68 passed, 4 skipped, 0 failed |
| Screenshots (`fulfilment.screenshots.spec.ts`, deviceScaleFactor 2) | pass: 3 tests, 55 screenshots (EN/AR, desktop/phone) in `phase-5/screenshots` |
| WebKit / mobile Safari | not available in this environment; run in CI |

Fixed during verification: the first browser run showed the seeded sales user cannot dispatch (correct per the role matrix; the journey now uses the seller owner), a test race on the dispute close form, and stale "shipping arrives in the next phase" copy on confirmed orders (EN and AR).

### Acceptance tests
| Test | Covered by | Result |
|---|---|---|
| T24 ship attempt on an unpaid order → rejected, no shipment | `fulfilment.int.test.ts` | pass |
| T25 seller ships with proof, buyer confirms; timeline correct; eligible but not paid automatically | `fulfilment.int.test.ts`, `checkout.spec.ts` (Phase 5 journey) | pass |
| T26 seller (or buyer viewer) tries to confirm receipt → 403/404, state unchanged | `fulfilment.int.test.ts` | pass |
| T27 dispute before settlement holds eligibility, visible to both parties, blocks payout | `fulfilment.int.test.ts` | pass |
| T28 refund requester self-approves → 403, no provider request | `fulfilment.int.test.ts` | pass |
| T29 refund exceeds remaining capture → 409, no ledger change | `fulfilment.int.test.ts` | pass |
| T30 refund webhook duplicate and out of order → provider-consistent state, one reversal | `fulfilment.int.test.ts` | pass |
| T31 payout failure → no paid label, reconciliation case; retry pays | `fulfilment.int.test.ts`, browser journey | pass |
| T32 audit log edit attempt → prohibited (database triggers) | `admin-security.int.test.ts` (Phase 1); dispute messages, payout allocations and review content also immutable | pass |
| T39 review before completion or duplicate → rejected | `fulfilment.int.test.ts` | pass |
| Dispute resolved by a dual-approved full refund closes the dispute and cancels the order | `fulfilment.int.test.ts` | pass |
| Browser: dispatch → delivery proof → receipt → review → dispute with evidence → support closes → partial refund (dual approval, sandbox) → payout (dual approval, sandbox) → supplier sees payout; Arabic RTL; negative access | `checkout.spec.ts`, `fulfilment.spec.ts` | pass |

### Security review
| Area | Control |
|---|---|
| Tenant isolation | Every route resolves workspace membership; other workspaces' orders, disputes, proof and evidence files return 404; public reviews never name the buyer |
| Dual control | Requester ≠ approver enforced in the API (403) and by database CHECKs on `refunds` and `payouts` |
| Money integrity | Refunds capped by order total under a row lock; commission share half-up and never above the order commission; ledger journals balanced, append-only and deduplicated by key |
| Provider authenticity | Refund and payout events use the same HMAC-signed webhook intake as payments; stored once per event id; amount and currency checked; duplicates and out-of-order events ignored |
| No manual paid flags | No route sets paid, refunded or paid-out states; only provider events do. The sandbox completion route exists only in mock mode and is labelled |
| Files | Proof and evidence go through the existing scanner; infected files rejected; downloads audited and scoped |
| Immutability | Dispute messages and payout allocations append-only; review content immutable, no delete |
| CSRF | All state changes require the CSRF token |

### Known issues and limitations
- Sandbox only: no live refunds, payouts or bank details; D05 stays open.
- One full shipment per order; no partial shipments, returns logistics or carrier integration.
- A dispute can still be opened while a payout is already at the provider; the refund is then refused (`refund.order_settled`) and support must resolve it outside the platform.
- Refund requests take a raw order ID on the admin page (no order search yet).
- Arabic copy needs native-speaker review.
- Integration and E2E tests add fictional orders, disputes, refunds and payouts to the development database.

### Decisions needed before Phase 6 (admin reports, support, audit)
1. Confirm or change P5-1 to P5-7 (and the earlier P3/P4 sets).
2. Whether orders should auto-complete after N days without buyer confirmation.
3. Payout schedule, minimum amount and supplier bank-detail verification (D05).
4. Whether public reviews may show the buyer company name with consent.

### Next gate
Merged under the standing instruction once CI is green; Phase 6 proceeds.

## Phase 4: cart, checkout, reservations, orders, sandbox payments, ledger
**Date:** 2026-11-28 (UTC). **Branch:** `phase-4-orders-checkout`. **Exit gate (docs/13-roadmap.md, docs/12-testing.md):** T11–T18, T40, T42.

### Delivered
- **Addresses:** UAE delivery addresses per buyer workspace (add, edit, make default, archive); checkouts keep an immutable snapshot.
- **Cart:** add ready-stock SKUs from the product page (MOQ, increment and stock checked by the server), cart grouped by supplier with delivery terms, live prices and line issues (out of stock, below MOQ, supplier no longer trading), quantity edit and remove. Self-trade refused (T42).
- **Checkout:** per-supplier preview (delivery fee, standard tax, totals) with a preview hash; terms confirmation; optional PO reference; creation re-prices and refuses any change (T12), reserves stock for 15 minutes with conditional updates (T11), creates one order per supplier (T13). Buyer can cancel an unpaid cart checkout (stock released).
- **Sandbox payments:** labelled sandbox hosted page (simulate success or decline, or return without paying). Payment is confirmed only by a signed webhook processed by the worker (T14, T15, T16); declined attempts keep the checkout payable; retries are capped at 5 attempts. `PAYMENT_MODE=live` is refused at startup because no live adapter exists.
- **Quote orders:** accepting a quote now creates a QUOTE checkout and its order from the accepted version (no stock reservation; 72-hour payment window, A05); the buyer chooses the delivery address when paying.
- **Orders:** buyer and supplier order lists and detail (lines, totals, timeline, address, checkout link); suppliers see commission and payable, buyers never do. Notifications for paid, received, cancelled and payment due.
- **Ledger and reconciliation:** double-entry journal per capture (PSP clearing, seller payable, platform fee revenue), balanced and append-only at the database level (T40); late captures go to unallocated receipts with a reconciliation case and no fulfilment (T18); expiry asks the provider before releasing stock (T17).
- **Admin:** orders (SUPPORT, FINANCE) and finance (ledger balances, payment attempts, reconciliation cases; FINANCE, FINANCE_APPROVER). Super admin has no finance access by design.
- **Worker:** `payments.process` (2 s), `checkout.expiry` (30 s), `sandbox.webhooks` (mock mode only).
- **Supplier storefront:** delivery terms form (flat fee per order, emirates served, typical days); the dev seed now includes terms for the three seeded storefronts.

### Routes, schema, permissions
- 25 new API operations, documented in `docs/api/README.md` (Phase 4 sections) and `docs/api/openapi.json`.
- Migrations `20261130000000_phase4_checkout_orders`, `…0001_phase4_stock_movement_kinds`, `…0002_phase4_ledger_no_truncate`, additive only: `docs/db/phase-4-schema.md`.
- Config: `COMMISSION_BPS` (required in production), `RESERVATION_MINUTES` (default 15), existing `TAX_STANDARD_BPS`, `PAYMENT_MODE` (mock only), `PSP_WEBHOOK_SECRET`.

| Action | Buyer owner | Procurement | Buyer viewer | Seller owner | Sales | Warehouse | Finance | Seller viewer | Admin |
|---|---|---|---|---|---|---|---|---|---|
| View addresses, checkouts, orders | Y | Y | Y | — | — | — | — | — | — |
| Manage addresses and cart, check out, pay, cancel | Y | Y | — | — | — | — | — | — | — |
| View supplier orders (with payable) | — | — | — | Y | Y | Y | Y | Y | — |
| Edit storefront delivery terms | — | — | — | Y | Y | — | — | — | — |
| All orders | — | — | — | — | — | — | — | — | SUPPORT, FINANCE, FINANCE_APPROVER |
| Ledger, payments, reconciliation | — | — | — | — | — | — | — | — | FINANCE, FINANCE_APPROVER |

### Commands actually run
| Command | Result |
|---|---|
| `pnpm lint` | pass (0 warnings) |
| `pnpm format` | pass |
| `pnpm typecheck` | pass |
| `pnpm test` (worker server stopped) | pass: 196 tests, 0 failed (config 21, contracts 62, api integration 99 incl. 14 commerce, web 10, worker 4) |
| `pnpm build` (production) | pass |
| `pnpm --filter @app/contracts openapi` | regenerated |
| `pnpm test:e2e --project=chromium --project=mobile-360` | 65 passed, 3 skipped, 0 failed after a rerun: the first run had 9 failures, 8 of them HTTP 429 on registration because local integration runs share the Redis rate-limit counters (cleared, then passed), and 1 the Phase 3 RFQ spec expecting the old "no payment" copy (updated) |
| Screenshots (`checkout.screenshots.spec.ts`, deviceScaleFactor 2) | pass: 3 tests, 42 screenshots (EN/AR, desktop/phone) in `phase-4/screenshots` |
| WebKit / mobile Safari | not available in this environment; run in CI |

Fixed during verification: a stale Phase 3 assertion that awards create no order, and a Phase 3 integration test that counted all outbox emails globally (flaky under parallel files; now scoped to the buyer's members).

### Acceptance tests
| Test | Covered by | Result |
|---|---|---|
| T11 two buyers race for the last stock: one reservation, stock never negative | `commerce.int.test.ts` | pass |
| T12 price change after preview → 409, no charge | `commerce.int.test.ts` | pass |
| T13 multi-seller checkout: one order per seller, sums match the payment, isolated visibility | `commerce.int.test.ts` | pass |
| T14 return from the provider without webhook stays pending; seller cannot fulfil | `commerce.int.test.ts` | pass |
| T15 capture webhook replayed 3 times: one capture, journal, stock deduction, notice | `commerce.int.test.ts` | pass |
| T16 invalid signature or amount mismatch: rejected or quarantined, no paid order | `commerce.int.test.ts` | pass |
| T17 expired reservation with unresolved provider session: retained, no oversell | `commerce.int.test.ts` | pass |
| T18 late capture after reservation cleared: reconciliation case, no fulfilment | `commerce.int.test.ts` | pass |
| T40 ledger fixture: exact totals, balanced and append-only journals | `commerce.int.test.ts` | pass |
| T42 buyer and seller same company: self-trade rejected (API and DB CHECK) | `commerce.int.test.ts` | pass |
| Browser: cart → checkout → sandbox decline → retry → paid → order confirmed → supplier sees it → second checkout cancelled; Arabic RTL; negative access | `checkout.spec.ts` | pass |

### Security review
| Area | Control |
|---|---|
| Tenant isolation | Every route resolves workspace membership; other workspaces' checkouts, orders, addresses and sandbox sessions return 404; buyer views never include commission or payable |
| Price integrity | Server re-prices at checkout and compares a preview hash; totals are integer fils with DB CHECKs (`total = merchandise + shipping + tax`, `payable = total − commission`) |
| Stock | Conditional updates in SKU order under a workspace lock; reservations released only after asking the provider |
| Payment authenticity | HMAC-SHA256 (node:crypto, `timingSafeEqual`), 5-minute window, raw body, stored once per event id; the browser redirect never confirms payment; invalid signatures quarantined |
| Idempotency | `Idempotency-Key` on checkout creation and payment start; journal dedupe key per capture |
| Ledger | Append-only (UPDATE, DELETE and TRUNCATE rejected) and balanced by a deferred constraint trigger |
| Live money | No live adapter; `PAYMENT_MODE=live` refused by API and worker; sandbox routes 404 outside mock mode; every sandbox screen is labelled |
| CSRF | All state changes require the CSRF token except the signed webhook path |

### Known issues and limitations
- Fulfilment after CONFIRMED (dispatch, delivery, receipt), disputes, refunds and payouts are Phase 5.
- Sandbox only: no live PSP, payout or refund; D05 and D06 stay open.
- Delivery is a flat fee per supplier order (P4-1); no weight- or distance-based pricing or carrier integration.
- Seeded data has one approved buyer company, so the long browser journey runs on one browser project to avoid racing the shared cart.
- Arabic copy needs native-speaker review.
- Integration and E2E tests add fictional checkouts and orders to the development database.

### Decisions needed before Phase 5 (fulfilment, disputes, refunds, reviews)
1. Confirm or change provisional rules P4-1 to P4-7 (and P3-1 to P3-7).
2. Payout model and timing to suppliers, and who may trigger a refund (D05).
3. Dispute window and evidence rules; whether the buyer must confirm receipt or it auto-completes after N days.
4. Review eligibility (only completed orders?) and moderation.

### Next gate
Merged under the standing instruction once CI is green; Phase 5 proceeds with sandbox adapters only.

## Phase 3: RFQs, quotes, award, messaging, notifications
**Date:** 2026-11-28 (UTC). **Branch:** `phase-3-rfq-quotes`. **Exit gate (docs/13-roadmap.md, docs/12-testing.md):** T19–T23.

### Delivered
- **Buyer RFQs:** list with state tabs, create/edit draft (title, category, specifications, quantity and unit, delivery emirate, optional budget in AED, deadline in Dubai time, needed-by date), audience choice (matching suppliers or invited only) with eligible-supplier search, attachments (scanned, private), publish, cancel with reason, timeline. Entry points: "Request quotation" on product pages and storefronts for approved buyers (prefills category, title and invitee); guests and unapproved companies still see the disabled button with the reason.
- **Quote comparison and award:** side-by-side current versions (total, unit price, shipping, tax, delivery date, validity, lowest total marked), full quote detail with deviations, terms, files and earlier versions; request revision, decline, and accept the exact version shown (Idempotency-Key, confirmation dialog). Accepting records the award, declines the other quotes and starts the payment deadline (A05). No order or payment is created; the UI says so.
- **Supplier inbox and quotes:** inbox with all/invited/matching/quoted tabs and search, RFQ detail without competitor information, quote draft (server-computed tax and totals, live pre-tax preview), attachments, submit, revise (new immutable version; after the deadline only when the buyer asked), withdraw, quotes list.
- **Messaging:** buyer↔supplier conversations, general or per RFQ (supplier "ask the buyer", buyer "message supplier" from a quote or storefront), unread counts, read receipts, 15-second refresh while open, sending gated by trading eligibility (A12), rate-limited.
- **Notifications:** in-app centre (links to the resource, mark read / all read, unread filter), header badges for notifications and messages, activity emails through the outbox (sandbox mail catcher) with per-user preferences in Settings.
- **Admin:** RFQ list (state, hidden, search) and detail with metadata and quote states only (no prices or documents), hide/restore with audited reason (COMPLIANCE).
- **Worker:** `rfq.expiry` every minute: expires lapsed quotes, then RFQs with no valid quote; notifies both sides; purges idempotency keys after 24 hours.

### Routes, schema, permissions
- 40 new API operations, documented in `docs/api/README.md` (Phase 3 sections) and `docs/api/openapi.json` (version `1.0.0-phase3`).
- Migration `20261129000000_phase3_rfq_quotes` (13 tables, sequence, CHECKs, partial unique indexes, immutability triggers), additive only: `docs/db/phase-3-schema.md`.
- Config: `TAX_STANDARD_BPS` (required in production), existing `QUOTE_PAYMENT_WINDOW_HOURS` (A05).

| Action | Buyer owner | Procurement | Buyer viewer | Seller owner | Sales | Warehouse | Finance | Seller viewer | Admin |
|---|---|---|---|---|---|---|---|---|---|
| View own workspace RFQs and quotes | Y | Y | Y | — | — | — | — | — | — |
| Create, edit, publish, cancel RFQs; revise/decline/accept quotes | Y | Y | — | — | — | — | — | — | — |
| See RFQs invited to / matching pool | — | — | — | Y | Y | Y | Y | Y | — |
| Draft, submit, revise, withdraw quotes | — | — | — | Y | Y | — | — | — | — |
| Read and send messages | Y | Y | — | Y | Y | — | — | — | — |
| RFQ metadata and quote states (no prices) | — | — | — | — | — | — | — | — | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Hide / restore an RFQ | — | — | — | — | — | — | — | — | COMPLIANCE |

Every trading action additionally needs an approved company with an unexpired licence (A08, A12); the API returns 403 with the specific reason.

### Commands actually run
| Command | Result |
|---|---|
| `pnpm lint` | pass (0 warnings) |
| `pnpm format` / `pnpm format:check` | pass |
| `pnpm typecheck` | pass |
| `pnpm test` | pass: 181 tests, 0 failed (config 20, contracts 62, api integration 85, web 10, worker 4). The worker heartbeat test fails if a local worker server is consuming the same Redis queue; it passes with the server stopped. |
| `pnpm build` (production) | pass |
| `pnpm --filter @app/contracts openapi` | regenerated (`1.0.0-phase3`) |
| `pnpm test:e2e --project=chromium --project=mobile-360` | pass: 60 passed, 2 skipped (long two-party journeys are desktop-only), 0 failed |
| Screenshots (`rfq.screenshots.spec.ts`, deviceScaleFactor 2) | pass: 4 tests, 55 screenshots (EN/AR, desktop/phone) |
| WebKit / mobile Safari | not available in this environment; run in CI |

### Acceptance tests
| Test | Covered by | Result |
|---|---|---|
| T19 invite-only RFQ and attachments hidden from non-invitees (404) | `rfq.int.test.ts` | pass |
| T20 seller cannot read a competitor's quote (404) | `rfq.int.test.ts` | pass |
| T21 accepting a superseded or expired version → 409, no award | `rfq.int.test.ts` | pass |
| T22 concurrent acceptance of two quotes → exactly one award; Idempotency-Key replay returns the same result | `rfq.int.test.ts` | pass |
| T23 accepted/submitted versions immutable (API 409 and DB trigger) | `rfq.int.test.ts` | pass |
| Pool eligibility by category, self-dealing refused, viewer role read-only | `rfq.int.test.ts`, `rfq.spec.ts` | pass |
| Messaging and notifications, admin moderation without prices | `rfq.int.test.ts` | pass |
| Expiry job (quotes then RFQs, notifications) | `rfq-expiry.int.test.ts` | pass |
| Full buyer → supplier → award journey in the browser; Arabic RTL on a phone | `rfq.spec.ts` | pass |

### Security review
| Area | Control |
|---|---|
| Tenant isolation | Every route resolves workspace membership; RFQ visibility for sellers is one SQL rule (invited or pool-eligible, never own company); other suppliers' quotes, counts and attachments are never returned to a seller; cross-tenant IDs return 404 |
| Award integrity | RFQ row lock plus unique accepted version; exact version id required; idempotency keys bound to user, route and body hash |
| Immutability | DB triggers keep submitted versions and the RFQ timeline append-only; revisions create new versions |
| Money and tax | Integer fils; totals and tax computed server-side with BigInt half-up rounding; CHECK `total = subtotal + shipping + tax` |
| Files | Magic-byte sniffing, malware scan, only CLEAN files publish or download; download access re-checked and audited |
| Messaging | Trading-gated sending, 60 messages per user per minute, text only, notification payloads carry names and references, never prices |
| Admin | Metadata only; hide/restore audited with reason |
| Notifications | In-app links accept only internal `/app/...` paths written by the server |

### Known issues and limitations
- Orders, checkout, stock reservation and payment are Phase 4; an award records the decision and the payment deadline only.
- Message attachments are not built (the column is reserved); messages refresh by polling, no realtime channel.
- Expiry notifications are in-app only (no email).
- Delivery address is not captured at acceptance; it arrives with checkout.
- Tax rate is configuration pending D06; the UI says tax is computed by the platform, not that it is legally correct.
- Arabic copy needs native-speaker review.
- Integration and E2E tests add fictional RFQs to the development database.

### Decisions needed before Phase 4 (orders, checkout, payments sandbox)
1. Confirm or change provisional Phase 3 rules P3-1 to P3-7 (`docs/00-decisions.md`).
2. Stock reservation at checkout (D11, 15 minutes) and whether made-to-order items reserve capacity.
3. Delivery: who sets shipping for catalogue orders and which emirates are served (D07).
4. VAT treatment and tax invoice issuer (D06).
5. Sandbox payment provider to model (no live connection) and payout model (D05).
6. Minimum order values, if any.

### Next gate
Phase 3 merged under the standing instruction once CI is green; Phase 4 proceeds with sandbox adapters only.

## Phase 2: storefronts, catalog, moderation, inventory, marketplace
**Date:** 2026-11-27/28 (UTC). **Branch:** `phase-2-marketplace-catalog`, merged as a0f0126 (CI run 46081580836: 110 passed, 2 skipped). **Exit gate (docs/13-roadmap.md):** T07–T10, search isolation, guest vs verified access (A12), seller eligibility (A10), moderation (A11).

### Delivered
- **Buyer marketplace (A12):** home (priority categories, featured products and suppliers labelled "Featured", verified manufacturers, new arrivals, "for you" from preferences), category directory and category pages with subcategories and seller requirements, search with autocomplete (EN/AR normalised trigram search), URL-driven filters (category, fulfilment mode, supplier type, emirate, price range, MOQ, lead time, dispatch time, in stock, customisation, private/white label, samples, category attributes), sorts, grid/list view, pagination and clear-all, product detail (gallery, variants and tier table, specifications, certifications, supplier card, related products, server-side price estimate), supplier directory and storefronts. Guests see no prices and cannot use price filters/sorts (API 422). Request quotation / order buttons are visible but disabled with the reason (sign in, approved business needed, or arrives in Phase 3); no fake transaction.
- **Buyer lists (verified users):** saved products and suppliers, compare up to 4, recently viewed (30), marketplace preferences. Items that stop being public show as "no longer available".
- **Seller centre:** overview (live counts, eligibility, storefront state, recent decisions), storefront editor with logo/cover/factory images and publish/unpublish, product list with status tabs and search, add product, full product editor (content, category attributes, specifications, certifications, media upload/reorder/remove, SKUs, pricing with fixed/tiered/quote-only, lifecycle actions submit/withdraw/unpublish/republish/archive/restore/duplicate, history), inventory (all/low/out, receive/remove/mark unavailable/release/stock count, low-stock threshold, restock date, movement history), pricing overview. Orders, quotation requests, messages and payouts appear as "available in a later release".
- **Moderation (A11):** every first publication is reviewed; material edits create a new version reviewed while the approved one stays live; pricing and stock changes are validated and audited without review; admins approve, reject or request changes with a reason; suspend, restore and remove listings and hide/restore storefronts with a reason; sellers are emailed every decision (sandbox email).
- **Admin catalog:** KPI overview and review queue (state filter, search, screening flags), side-by-side review of submitted vs live version with changed fields highlighted and company/licence status, all listings with status filter and enforcement, storefronts with hide/restore, categories and subcategories (create, edit, hide, archive, restriction, requirements, image, attributes), restricted terms (BLOCK/REVIEW, provisional per A10), featured placements with schedule.
- **Eligibility (A08, A10):** only APPROVED companies with an unexpired licence and an active seller workspace can submit, price or change stock, and their listings and storefront disappear from every public surface (search, directory, featured, saved lists, image URLs) the moment the company is suspended or the licence expires. BLOCKED categories cannot be used; REVIEW_REQUIRED categories require certifications.
- **Retention (A13):** daily report-only worker job counts verification documents past the provisional schedule and writes a `retention.report` audit event; deletion stays impossible (config refuses to enable it).
- **Seed:** the 12 approved launch categories (A09) with EN/AR names, subcategories and attributes; 3 fictional storefronts and sample listings (see `docs/TEST_ACCOUNTS.md`).

### Routes, schema, permissions
- 82 new API operations, documented in `docs/api/README.md` (Phase 2 sections) and `docs/api/openapi.json` (version `1.0.0-phase2`).
- Migration `20261128000000_phase2_catalog` (18 tables, 2 views, triggers, CHECK constraints), additive only: `docs/db/phase-2-schema.md`.
- Permission matrix for catalog actions:

| Action | Owner | Sales | Warehouse | Finance | Viewer | Guest | Verified user | Admin |
|---|---|---|---|---|---|---|---|---|
| View own listings, storefront, inventory | Y | Y | Y | Y | Y | — | — | — |
| Create/edit/submit listings, pricing, storefront | Y | Y | — | — | — | — | — | — |
| Adjust stock | Y | Y | Y | — | — | — | — | — |
| Unpublish storefront | Y | Y | — | — | — | — | — | — |
| Browse public catalogue | Y | Y | Y | Y | Y | Y | Y | — |
| See prices, save, compare, history | Y | Y | Y | Y | Y | — | Y | — |
| Review listings (approve/reject/changes) | — | — | — | — | — | — | — | COMPLIANCE |
| Suspend/remove listings, hide storefronts | — | — | — | — | — | — | — | COMPLIANCE |
| Categories, restricted terms, featured | — | — | — | — | — | — | — | COMPLIANCE (categories and featured also SUPER_ADMIN) |
| Read admin catalog | — | — | — | — | — | — | — | COMPLIANCE, SUPPORT, SUPER_ADMIN |

Request quotation, purchase and payment stay unavailable for everyone until Phase 3; when built they require an approved buyer business (A08, A12).

### Commands actually run
| Command | Result |
|---|---|
| `pnpm lint` | pass (0 warnings) |
| `pnpm format:check` | pass |
| `pnpm typecheck` | pass |
| `pnpm test` | pass: 164 tests, 0 failed (config 19, contracts 56, api integration 76, web 10, worker 3) |
| `pnpm build` (production) | pass |
| `pnpm --filter @app/contracts openapi` | regenerated; committed file unchanged afterwards |
| `pnpm test:e2e --project=chromium --project=mobile-360` | pass: 55 passed, 1 skipped (the long seller→admin journey is desktop-only), 0 failed |
| Screenshots (`catalog.screenshots.spec.ts`, deviceScaleFactor 2) | pass: 4 tests, 61 screenshots (EN/AR, desktop/phone, empty, not-found, signed-out and forbidden states) |
| `pnpm audit --prod --audit-level high` | pass: no known vulnerabilities |
| WebKit / mobile Safari | not available in this environment; run in CI |

### Acceptance tests
| Test | Covered by | Result |
|---|---|---|
| T07 seller listing lifecycle and moderation | `catalog.int.test.ts` (lifecycle, material edit while live, reject/resubmit), `marketplace.spec.ts` (seller creates, uploads, prices, submits; admin approves; guest finds it) | pass |
| T08 validation (tiers, MOQ, increments, restricted terms, media, uploads) | `catalog.int.test.ts`, `money.test.ts` | pass |
| T09/T10 server-side pricing and estimate (tiers, MOQ, increment, quote-only, guest refusal) | `catalog.int.test.ts`, `money.test.ts` | pass |
| Tenant isolation (other seller's product, SKU, inventory, media, workspace → 404) | `catalog.int.test.ts`, `marketplace.spec.ts` | pass |
| Seller roles (viewer read-only, warehouse stock only) | `catalog.int.test.ts` | pass |
| Eligibility (unapproved seller, expired licence, blocked category, hidden category) | `catalog.int.test.ts` | pass |
| Inventory concurrency (10 parallel removals, exactly the available stock succeeds, never negative) | `catalog.int.test.ts` | pass |
| Guest vs verified access (no prices, no price filters/sorts, lists need verified email) | `catalog.int.test.ts`, `marketplace.spec.ts` | pass |
| Admin permissions and enforcement audit | `catalog.int.test.ts` | pass |
| EN/AR RTL, 360px mobile | `marketplace.spec.ts`, `shell.spec.ts`, screenshots | pass |
| Retention report deletes nothing | `retention.int.test.ts` | pass |

### Security review
| Area | Control |
|---|---|
| Public exposure | One SQL definition of "public" (views); company contact email/phone, licence numbers, documents and bank data are never selected into public responses; storefront shows city and emirate only |
| Tenant isolation | Seller routes resolve workspace membership on every request; product, SKU, media and inventory queries are scoped by workspace; DB triggers reject cross-company rows; cross-tenant IDs return 404 |
| Moderation integrity | Submitted versions are frozen by trigger; versions and moderation events cannot be deleted or edited; decisions check the expected state (409 on races) |
| Stock | Conditional `UPDATE … RETURNING` with non-negative CHECKs; stock counts use an expected version; every change writes a movement and audit entry |
| Money | Integer fils end to end; parsing via `parseAedToFils` (no floats); totals computed server-side |
| Media | Images re-encoded with `sharp` (strips metadata, rejects non-images and tiny images); access re-checked per request; public images only while attached to public content |
| Search | Parameterised SQL; LIKE wildcards escaped; per-IP rate limit; offset cursor capped |
| Caching | Marketplace responses `private, no-store`, `Vary: Cookie`, so a verified user's prices are never cached for a guest |
| Admin | Capability-checked per route (`RequireAdmin`); every enforcement and taxonomy change is audited with a reason |

### Known issues and limitations
- WebKit/Safari E2E runs only in CI (browser download blocked here).
- Integration and E2E tests write fictional records into the development database, so the local marketplace fills with "E2E"/"Test" listings over time; re-seed a fresh database for demos.
- Storefronts publish without admin pre-approval (admins can hide them with a reason). docs/03-seller describes storefront moderation; this is listed as a decision below.
- Search uses PostgreSQL trigram matching; no dedicated search engine, synonyms or typo tolerance beyond trigram similarity.
- Prices in AED only; VAT presentation and tax classification arrive with checkout (Phase 3/4, D06).
- Video links are shown as external links (YouTube/Vimeo allow-list), not embedded, to keep the strict CSP.
- Arabic copy needs native-speaker review; category names were written for development.
- Restricted-term list is provisional (A10) pending legal review.
- No bulk product import/export yet.

### Deviations and decisions changed
- A09–A15 recorded in `docs/00-decisions.md`; implemented as approved.
- A12 replaces the earlier "marketplace browsing requires an approved workspace" rule in docs/10-security and docs/07-api.
- Storefront moderation (see above) is a deviation pending confirmation.
- The old public landing/status page moved to `/[locale]/status`; `/[locale]` is now the marketplace home.

### Decisions needed before Phase 3 (RFQ, cart, checkout)
1. Confirm storefronts may publish without pre-approval (current build) or require review like products.
2. RFQ rules: who may receive an RFQ (all eligible sellers in the category vs invited only), RFQ validity and maximum quotes per RFQ.
3. Stock reservation at checkout: confirm 15-minute hold (D11) and whether made-to-order items reserve production capacity.
4. Minimum order value or per-supplier minimums, if any.
5. Delivery: who sets shipping costs (supplier-entered, platform table, or quoted per order) and which emirates are served.
6. VAT handling and tax invoice issuer (D06): platform as agent or supplier issues the invoice.
7. Payment provider for the sandbox integration (no live connection) and payout model, needed for Phase 4.
8. Buyer approval thresholds and spend limits (deferred by A04).

### Next gate
Phase 2 implemented and merged under the founder's standing instruction to continue without approval. Phase 3 starts only with the decisions above where they block (RFQ rules, reservation, delivery, VAT); sandbox-only adapters.

## Phase 1: accounts, workspaces, verification
**Date:** 2026-11-27. **Branch:** `phase-1-accounts-verification` (pull request into `main`). **Exit gate (docs/13-roadmap.md):** T01–T06; secure tenant and file boundaries.

### Delivered
- **Identity (A01, A07):** registration, email verification (mandatory before any company action), login, logout, forgot/reset password, profile and locale, password change, session list with per-session and "all other" revocation.
- **Company workspaces:** onboarding with legal details (licence number, issuer, expiry, emirate, TRN, activity, contacts), BUYER and/or SELLER workspaces, workspace switcher.
- **Team and RBAC (A04):** invitations by email (one-time token), accept flow for new and existing users, role change, revoke/restore, last-owner protection with row locking, full role matrix in `packages/contracts/src/permissions.ts` used by both API enforcement and UI capability hiding.
- **Verification (A08):** licence and representative document upload to private storage, magic-byte type checks, sandbox malware scanner (EICAR test string, infected files never stored), submission with terms acceptance, admin queue, start review, approve / needs-info / reject with reason, resubmission, full case timeline for company and admin.
- **Licence expiry and renewal:** worker job flags expired licences and removes trading capabilities while keeping read access (T35); renewal cases with proposed new licence details, approved by compliance.
- **Admin (A02, A03):** separate admin origin (`admin.localhost:3000` locally) with its own cookie (`asid`, SameSite Strict) and session table; host-routing middleware hides admin pages and API from the company origin and vice versa; admins provisioned only by CLI (`admin:create`), never by registration; mandatory TOTP enrolment with QR and recovery codes; overview KPIs from live queries, verification queue and case review, companies (search, suspend/reactivate with reason), users (revoke sessions), audit log with filters, staff role management (super-admin only).
- **Audit:** append-only `audit_log` (database triggers block UPDATE/DELETE, T32) for every security and verification action, with secret redaction.
- **EN/AR and responsive:** every screen in English and Arabic with RTL via logical CSS properties, mobile bottom navigation at ≤720px, tables collapse to cards on phones; every screen has loading, empty, error (with request reference and retry), forbidden and not-found states.
- **OpenAPI:** generated from the shared zod contracts (`pnpm --filter @app/contracts openapi` writes `docs/api/openapi.json`); a unit test fails if the committed file is stale and an API integration test fails if any Express route is missing from the document.
- **WebKit:** Playwright `webkit` and `mobile-safari` projects added; they run in CI (the WebKit download is blocked by this environment's network policy).

### Routes, schema, accounts
- 55 API operations: see `docs/api/README.md` (method, path, auth, CSRF, required capability, status codes) and `docs/api/openapi.json`.
- Migration `20261127200000_phase1_identity_verification` (17 tables, triggers, constraints): see `docs/db/phase-1-schema.md`, including rollback notes. No destructive change to the baseline.
- Development accounts for every company and admin role: `docs/TEST_ACCOUNTS.md` (seed refuses to run in production).

### Commands actually run
Environment: Linux container, Node 22.23.5, pnpm 10.28.0, local PostgreSQL 16, Redis 7, SeaweedFS, Mailpit. `RATE_LIMIT_SCALE=50` in the local `.env` and in CI so E2E does not trip auth rate limits (production default is 1).

| Command | Result |
|---|---|
| `pnpm lint` | pass (0 warnings) |
| `pnpm format:check` | pass |
| `pnpm typecheck` | pass |
| `pnpm test` | pass: 121 tests, 0 failed (config 17, contracts 29, api integration 63, web 10, worker 2) |
| `NODE_ENV=production pnpm build` | pass |
| `pnpm test:e2e` (chromium + mobile-360) | pass: 44 tests, 0 failed, re-run after the final CSP change |
| Screenshots project (`screenshots.spec.ts`, deviceScaleFactor 2) | pass: 4 tests; 58 screenshots of every screen, EN/AR, desktop/phone, forbidden/not-found/unverified states |
| `pnpm audit --prod --audit-level high` | pass: no known vulnerabilities (nodemailer upgraded to 10.4.1) |
| Manual curl of host routing | admin pages/API 404 on the web origin; non-admin paths 404 on the admin origin |
| WebKit / mobile Safari E2E | not run locally (browser download blocked); passed in CI run 46067136882 |

### Acceptance tests
| Test | Covered by | Result |
|---|---|---|
| T01 unverified purchase | `companies.int.test.ts` (no `buyer.purchase` capability before approval), `access-control.spec.ts` | pass at capability level; purchase endpoints arrive in Phase 3, where T01 must be re-run end to end |
| T02 clean docs approved | `companies.int.test.ts`, `verification-journey.spec.ts` | pass |
| T03 missing/infected licence | `companies.int.test.ts` (two cases) | pass |
| T04 cross-company ID guessing | `team-isolation.int.test.ts`, `access-control.spec.ts` (404 on company, case, document and workspace IDs) | pass |
| T05 revoked membership, old session | `team-isolation.int.test.ts` | pass |
| T06 last owner removal | `team-isolation.int.test.ts`, including a concurrent mutual-revoke race; `team.spec.ts` | pass |
| T32 audit edit attempt (early) | `admin-security.int.test.ts` | pass |
| T35 licence expiry (early) | `companies.int.test.ts` | pass |

E2E also covers: full registration-to-approval journey, password reset single use, session revocation, unverified-email block, admin MFA enrolment and recovery-code sign-in, invitation acceptance, Arabic RTL and 360px layouts.

### CI
`.github/workflows/ci.yml` now starts Mailpit and SeaweedFS, maps `admin.localhost`, checks OpenAPI is up to date, seeds the database and runs E2E on chromium, mobile-360, webkit and mobile-safari. GitHub Actions run 46067136882 on PR #2 (commit ad17d00) passed every step: unit/integration tests (121), OpenAPI check, production build, seed, and **88 E2E tests across chromium, mobile-360, webkit and mobile-safari, 0 failed**, plus the dependency audit. (The migration status dry run reports the pending migration before deploy, as intended.)

### Bugs found and fixed during Phase 1
- Text typed before React hydration was lost; inputs and buttons are now disabled until hydrated.
- The mobile bottom navigation covered the last button on long pages (CSS specificity); fixed.
- Uploading an infected file showed "Saved."; it now says the file was blocked.
- `NODE_ENV=development` from `.env` leaked into `next build`; the env loader now excludes it for web scripts.
- Four high-severity nodemailer advisories; upgraded.

### Security review
| Area | Control |
|---|---|
| Passwords | Argon2id (`argon2` library, 64 MiB, t=3); minimum length enforced by shared contracts; generic login errors |
| Sessions | Opaque random tokens, only SHA-256 hashes stored in PostgreSQL; rotation on login and privilege change; idle and absolute expiry; revocation takes effect on the next request |
| Cookies | `__Host-` prefix, Secure, HttpOnly; SameSite Lax (company), Strict (admin); admin and company cookies never shared |
| CSRF | Origin/Referer check plus double-submit token on every state-changing request |
| Rate limiting | Redis-backed limits on login, registration, reset, verification resend, invitation and MFA (table in `docs/api/README.md`) |
| Recovery tokens | One-time, hashed at rest, short expiry, delivered in the URL fragment (not sent to servers or logs) and stripped from history |
| Admin MFA | TOTP (`otplib`) with replay protection, secrets AES-256-GCM encrypted at rest, hashed single-use recovery codes, QR rendered as an image so it cannot run script |
| Admin separation | Separate origin, cookie, session table and CSRF scope; middleware blocks cross-host routes; database trigger stops admin accounts holding company memberships; no public admin registration |
| Tenant isolation | Every query scoped by membership; cross-tenant IDs return 404 (T04); role and company never taken from the client |
| Files | Private bucket; magic-byte sniffing; sandbox malware scan before storage; downloads streamed only after an authorization check, with `Content-Disposition: attachment`, `nosniff`, `private, no-store` and a restrictive CSP |
| Audit | Append-only by trigger; actor, IP, request ID, reason; secrets redacted |
| Web | CSP (`default-src 'self'`, `frame-ancestors 'none'`), COOP, no-store on API responses, open-redirect-safe `next` parameter, no `window.confirm` |
| Dependencies | `pnpm audit --prod` clean; versions pinned in `docs/DEVELOPMENT.md` |

### Known issues and limitations
- WebKit/Safari runs in CI only (passed there); it cannot be downloaded in this development environment.
- T01 verified at capability level only until purchase endpoints exist (Phase 3).
- Document downloads are streamed through the API rather than presigned URLs (simpler to authorize; revisit for large files).
- Production cannot start yet by design: there is no live email adapter or malware scanner (sandbox adapters only, clearly labelled).
- ~~CSP still needs `'unsafe-inline'` for scripts~~ Fixed in Phase 8: nonce-based CSP (SR-2).
- A pending invitation token is kept per browser tab (sessionStorage); opening the link in another tab after sign-up requires clicking it again.
- Notifications are email only; no in-app notifications or compliance queue alerts yet (Phase 6).
- Seeded admin TOTP secrets are fixed for development; the seed refuses production.
- Terms version is `dev-1` pending legal text (D15).
- Arabic copy needs native-speaker review.
- `API_INTERNAL_ORIGIN` is fixed at web build time; `TRUST_PROXY` must be set correctly behind a production load balancer for rate limits and audit IPs.
- No account deletion, data export or admin "disable user" action yet.
- Admin lists have search and status filters but no column filters or detail drawers.

### Deviations and decisions changed
- A01–A08 approved by the founder and recorded in `docs/00-decisions.md`; no D01–D15 entry changed.
- OpenAPI is generated from the contracts package rather than NestJS decorators, so the web client and the spec share one schema source.
- `RATE_LIMIT_SCALE` env variable added (development and test only; ignored in production).

### Decisions needed before Phase 2
1. Launch categories and restricted/prohibited items (D14).
2. Seller eligibility rules beyond an approved licence (D02).
3. Catalog moderation policy: pre-approval of listings or post-publication review.
4. Whether buyer browsing of the marketplace requires an approved company or only a verified account.
5. Document retention period after rejection or account closure (D09).
6. Hosting region for production storage and database (D12).
7. Production email provider and malware scanner (needed before any production deployment, not before Phase 2 development).
8. Legal terms text (D15) and brand name (A06 makes it configurable).

### Next gate
Phase 1 approved and merged 2026-11-28. Next: founder answers the decisions above and approves starting Phase 2 (seller storefront, catalog, moderation, inventory, buyer marketplace and directory; T07–T10 plus search isolation).

## Phase 0: foundation
**Date:** 2026-11-27. **Branch:** `phase-0-foundation` (pull request into `main`). **Exit gate (docs/13-roadmap.md):** clean install/build/lint/typecheck, DB connection, documented commands.

### Delivered
- pnpm monorepo: `apps/web` (Next.js), `apps/api` (NestJS), `apps/worker` (background tasks; BullMQ until Phase 8, now the PostgreSQL scheduler), `packages/config`, `packages/contracts`, `packages/db` (Prisma), `packages/ui` (tokens), `e2e` (Playwright), `infra`. Versions pinned and recorded in `docs/DEVELOPMENT.md`.
- `docker-compose.yml`: PostgreSQL 16, Redis 7, SeaweedFS (S3-compatible), Mailpit. Bound to 127.0.0.1 only.
- Environment validation (`packages/config`), shared by API and worker. Production refuses mock payments, the dev mail catcher, weak/placeholder secrets, missing storage keys, non-https origins, live payments without PSP keys or the explicit `FEATURE_REAL_PAYMENTS` flag, and trading without a live provider. Live payments are refused outside production. Feature flags (`TRADING_ENABLED`, `FEATURE_REAL_PAYMENTS`, `FEATURE_SUBSCRIPTIONS`, `FEATURE_MILESTONE_PAYMENTS`) default false.
- API: `/api/v1` prefix, documented success and error envelopes, error codes mapped to the HTTP statuses in docs/07-api.md, request IDs (`X-Request-Id`), structured pino logs with credential/cookie/token redaction and no query strings, helmet headers, CORS restricted to `WEB_ORIGIN`, 1 MB JSON limit, graceful shutdown.
- Worker: repeatable `system.heartbeat` job that round-trips through Redis and pings PostgreSQL; health server.
- Web: EN/AR shell with `lang`/`dir` at the document root, translation-key catalogue (no hardcoded UI strings), Asia/Dubai time display, design tokens from docs/05-ui.md, sandbox banner driven by the API, live system status with an error state and retry (no fabricated status), security headers.
- Prisma baseline migration `20261127000000_baseline` (no business tables, per docs/06-data.md "no unused tables"). Seed script refuses production and writes nothing in Phase 0.
- CI workflow `.github/workflows/ci.yml`: install (frozen lockfile), lint, format, typecheck, migration status + deploy against a PostgreSQL service, unit/integration tests, build, Playwright E2E, `pnpm audit --prod`.

### Routes
| Route | Purpose |
|---|---|
| `GET /api/v1/health` | API liveness |
| `GET /api/v1/health/ready` | API readiness: PostgreSQL + Redis, 503 when not ready |
| `GET :4100/health`, `GET :4100/health/ready` | Worker liveness / readiness (DB, Redis, heartbeat) |
| `GET /healthz` (web) | Web liveness |
| `/en`, `/ar` (web) | Localized shell with live status; `/` redirects to `/en`; unknown locale 404 |

### Commands actually run (clean checkout state: node_modules and build output deleted first)
Environment: Linux container, Node 22.23.5, pnpm 10.28.0, Docker Compose services from `docker-compose.yml`.

| Command | Result |
|---|---|
| `pnpm install --frozen-lockfile` | pass |
| `docker compose up -d` / `docker compose config --quiet` | pass (all 4 services up; postgres, redis, mail healthy) |
| `pnpm db:migrate:status`, `pnpm db:migrate` | pass (baseline applied) |
| `pnpm db:seed` | pass (connectivity check, no rows) |
| `pnpm lint` | pass (0 warnings) |
| `pnpm format:check` | pass |
| `pnpm typecheck` | pass |
| `pnpm test` | pass: 31 tests in 5 files, 0 failed (config 13, contracts 3, api integration 9, web i18n 4, worker integration 2) |
| `pnpm build` | pass |
| `pnpm test:e2e` | pass: 12 tests, 0 failed (6 scenarios × Chromium desktop and 360px viewport) |
| `pnpm audit --prod --audit-level high` | pass: no known vulnerabilities (after overrides) |
| Manual: API started with `NODE_ENV=production` and the `.env.example` values | refused to start, exit 1, listing 7 issues (mock payments, dev mail, placeholder secret/keys, http origins) |
| Manual: worker started from build output | `/health/ready` reported database, redis and heartbeat up |

Integration tests run against real PostgreSQL and Redis, including a dependencies-down case (503 not_ready while liveness stays 200) and a cold-start concurrency case.

### CI
GitHub Actions run 46055408891 on PR #1 (commit d58ce8f) passed every step: frozen install, lint, format, typecheck, migration status and deploy, unit/integration tests, build, Playwright E2E, production dependency audit.

### Bugs found and fixed during Phase 0
- API readiness reported Redis down on the first concurrent requests after start (lazy-connect race). Found by the E2E suite; fixed and covered by a cold-start integration test.
- Web status page was being prerendered at build time, which would have shown a stale status. Now rendered per request.

### Not yet verified
- WebKit (Safari-compatible) browser tests: not installed in this environment; docs/12-testing.md requires it before launch. Add in Phase 1.
- `docker compose up` was verified with images fetched through a registry mirror because Docker Hub rate-limited this environment; the compose file uses the canonical Docker Hub names.

### Security review (Phase 0 scope)
No secrets in git (`.env` ignored; `.env.example` placeholders are rejected in production). Services bind to localhost. Logs redact authorization, cookies, CSRF/idempotency headers and password/token/secret fields, and omit query strings. Error responses never include stack traces. Transitive vulnerabilities in multer, postcss, effect and deepmerge-ts patched via overrides; zod moved to 4.6.7 for its advisory.

### Deviations and decisions changed
- Added `packages/db` (not in the proposed layout) so API and worker share one Prisma schema.
- Local object storage uses SeaweedFS instead of MinIO: MinIO community images were unavailable from this environment. Any S3-compatible store satisfies the spec.
- Extra env variables beyond docs/13-roadmap.md: `API_PORT`, `WORKER_HEALTH_PORT`, `STORAGE_REGION`, `SMTP_URL`, `TRADING_ENABLED` and the three feature flags. `PAYMENT_MODE` values are `disabled|mock|live`; `EMAIL_PROVIDER` values are `disabled|smtp-dev|live`.
- OpenAPI generation (docs/07-api.md) deferred to Phase 1, when the first real DTOs exist.
- No decision register (D01–D15) entries changed.

### Open questions for the founder (none block Phase 0)
1. **Authentication approach (blocks Phase 1).** docs/10-security.md allows Argon2id passwords or an established auth provider. Proposed development default: self-hosted email/password with Argon2id, server-side sessions in PostgreSQL, TOTP MFA for admin. Choosing a provider later would change Phase 1 substantially.
2. **Admin separation.** docs/04-admin.md and docs/07-api.md require a distinct admin session scope. Proposed default: same web app under `/admin` with a separate cookie name and session table flag; a separate admin origin is stronger and can be chosen now at low cost.
3. **D10 wording vs. the role matrix.** D10 says "Owner and procurement roles MVP", while docs/10-security.md defines buyer viewer and seller sales/warehouse/finance/viewer roles. Assumed D10 refers to buyer purchasing roles only and the full matrix applies.
4. **Payment window for quote-derived orders.** docs/02-buyer.md lets the buyer retry payment "until expiry", but no expiry is defined for orders created from an accepted quote (D11's 15 minutes covers stock reservations). Needed by Phase 3/4.
5. **Brand/name.** None supplied; the UI uses "B2B Marketplace (working name)".
6. **Production gates D01–D15** remain open as listed in docs/00-decisions.md (PSP, tax/invoice issuer, hosting region, legal, etc.). None are needed before Phase 1.

### Next gate
Founder reviews this phase and question 1 (auth approach), then approves starting Phase 1 (auth, workspaces, membership, verification, uploads, admin review, localization shell; T01–T06).
