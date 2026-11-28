# Security review (Phase 7, sandbox build)
**Date:** 2026-11-28 (UTC). **Scope:** the code on `main` through Phase 6 plus the Phase 7 branch: web (Next.js), API (NestJS), worker, PostgreSQL schema, CI. **Method:** code review of every authorization path and data boundary against docs/10-security.md, the automated test evidence listed below, dependency audit, secret scan and configuration review. **Not done:** an independent penetration test, infrastructure review (no production environment exists), and manual accessibility/screen-reader testing. This review is not a certification.

## Summary
No open critical or high findings in the application code. Two items need action before launch: an independent penetration test, and a test-runner major upgrade that clears dev-only advisories. Production gates D01–D15 (hosting, PSP, email, legal) remain unapproved, so the system must stay in sandbox.

## Controls reviewed
| Area | Control | Evidence |
|---|---|---|
| Authentication | Argon2id passwords, server-side sessions in PostgreSQL with idle and absolute expiry, mandatory email verification (A01, A07); login and token endpoints rate limited | `auth.int.test.ts`, `auth.spec.ts` |
| Admin access | Separate admin origin and cookie, mandatory TOTP with replay protection and recovery codes, no public admin registration, operator CLI provisioning only (A02, A03) | `admin-security.int.test.ts` |
| Authorization | Every company route resolves an active membership (non-members get 404, never 403); role matrix from docs/10-security.md (A04); trading capabilities additionally need verified, unexpired, unsuspended companies | `team-isolation.int.test.ts`, negative tests in every phase, `access-control.spec.ts` |
| Admin least privilege | Capabilities per admin role; SUPER_ADMIN has no compliance or finance rights; dual control on refunds and payouts (API and database CHECK); support sees limited order data | `fulfilment.int.test.ts` (T28), `operations.int.test.ts` |
| Tenant isolation | Server-side scoping on lists, search, files, messages, disputes, tickets, exports and notifications; private files served only through authorised, audited routes | integration tests per phase; T41 |
| Input handling | zod contracts on every body and query; Prisma parameterised queries (no `$queryRawUnsafe`); no `dangerouslySetInnerHTML` | code search; contract tests |
| Money | Integer fils (`BigInt`) end to end; totals recomputed server-side; ledger journals balanced, append-only and deduplicated; provider events signed (HMAC) and processed exactly once | T11–T18, T29–T31, T40; restore drill consistency checks |
| Files | Type and size limits, malware scan before use (EICAR sandbox scanner in development; production refuses to start without a live scanner), private bucket | Phase 1 and 5 tests |
| Web hardening | CSP (`frame-ancestors 'none'`, `object-src 'none'`, same-origin connect), `X-Frame-Options: DENY`, `nosniff`, referrer and permissions policies, HSTS in production builds; API uses helmet; CSRF token plus Origin check on every state change; SameSite cookies | headers checked on the running build |
| Exports | Reason and TOTP step-up, role scope, audit on create/deny/download, creator-only, 24 h retention, CSV injection neutralised | T41 |
| Audit | Append-only audit events (database triggers reject UPDATE, DELETE, TRUNCATE) for security, verification, catalog, finance, support and export actions | T32 |
| Secrets and configuration | No secrets in git (`.env` ignored; only development placeholders and seeded fictional credentials in `seed-secrets.ts`, refused in production); production refuses to start with sandbox adapters, weak secrets or missing live integrations | `env.test.ts`, `scripts/production-refusal-check.mjs` (T38) |
| Logging | Authorization headers, cookies, passwords, tokens and TOTP codes redacted from logs | `LOG_REDACT_PATHS` |
| Rate limiting | Redis-backed limits on auth, uploads, search, messaging, checkout, webhooks, tickets and exports; `RATE_LIMIT_SCALE` ignored in production | rate limit service |

## Findings
| ID | Severity | Finding | Status |
|---|---|---|---|
| SR-1 | Medium (dev only) | `pnpm audit` (all dependencies) reports 2 critical and 3 moderate advisories in the test runner chain (vitest 3.2.7 → tinypool, @vitest/mocker). They are not in production dependencies (`pnpm audit --prod`: no known vulnerabilities) and are only reachable when running tests locally. Fix requires vitest 4.x. | Open: upgrade the test runner in a separate change (major version) |
| SR-2 | Low | Web CSP allows `'unsafe-inline'` scripts because Next.js injects inline bootstrap scripts. | Open: move to a nonce-based CSP before launch |
| SR-3 | Low | Web origin did not send HSTS. | Fixed in Phase 7 (production builds only) |
| SR-4 | Info | Marketplace home made sequential queries (slow under load, p95 509 ms). | Fixed in Phase 7 (p95 242 ms) |
| SR-5 | Info | Restore drill flagged a failed-then-resolved Prisma migration attempt in the development database history. | Expected history; the check now distinguishes resolved attempts from blocking ones |

## Required before launch
1. Independent penetration test of web, API and admin origins on staging (with the chosen hosting).
2. Nonce-based CSP (SR-2) and test-runner upgrade (SR-1).
3. Production infrastructure review once D12 is decided: TLS, WAF, secret manager, network isolation of PostgreSQL/Redis/storage, backups in a UAE region with a timed restore drill (RPO 24 h / RTO 4 h proposed).
4. Live provider security reviews (PSP webhooks and keys, email provider, malware scanner) when D05 and the email provider are approved.
5. Legal review of data retention and deletion (D09, A13) before enabling any irreversible deletion.
