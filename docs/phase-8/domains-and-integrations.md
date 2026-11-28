# Domains, DNS and third-party integration requirements

> **Partly superseded on 2026-11-28.** References to Azure (Key Vault, Application Gateway, Container Apps, Terraform, Azure Monitor) belong to the rejected Azure proposal. The current plan is [vercel-architecture.md](vercel-architecture.md). Domain purchases are not authorised: staging uses the `*.vercel.app` address.

**Date:** 2026-11-28 (UTC). **Status:** requirements only. No domain has been registered, no DNS changed, no third-party account opened.

## 1. Domains

We need one registered production domain. A `.ae` domain is recommended for a UAE B2B marketplace and is registered through a registrar accredited by the .ae registry. The brand is still a working name (A06), so the domain waits for branding approval.

| Host | Purpose | Points to | Environment |
|---|---|---|---|
| `www.<domain>` | Buyer and supplier site | Application Gateway public IP (A record) | Production |
| `<domain>` (apex) | Redirect to `www` | Gateway IP (A record) or registrar redirect | Production |
| `admin.<domain>` | Admin portal: separate host and isolated cookies (A03) | Gateway public IP (A record) | Production |
| `staging.<domain>` | Staging site, IP-restricted | `web` Container App FQDN (CNAME) + `asuid.staging` TXT | Staging |
| `admin-staging.<domain>` | Staging admin | Same as above + `asuid.admin-staging` TXT | Staging |
| `mail.<domain>` / `send.<domain>` | Email sending subdomain (Resend) | Records given by Resend | Both (separate subdomains) |

**Rules:**
- The admin host must never share cookies with `www`. Cookies are host-only today, so this holds as long as no cookie is ever set with `Domain=<domain>`.
- Use a separate subdomain for email sending (for example `send.<domain>`). This protects the root domain's reputation and lets staging use its own subdomain.
- Add CAA records that allow only the chosen certificate authority.

### TLS certificates
- **Coverage:** one certificate covering `www`, `admin` and the apex for production, and one for the two staging hosts. These can be SAN certificates or a wildcard, but separate certificates per environment are preferred.
- **Storage:** each is stored in that environment's certificates Key Vault (`infra/azure/bootstrap`). Both the Application Gateway and the Container Apps custom domains read it from there.
- **Issuance:** either a commercial CA, or Key Vault's integrated CA partner with automatic renewal. Free ACME certificates (Let's Encrypt) are possible with a renewal job, which is decided in 8B.
- **Expiry alert:** Azure Monitor alerts 30 days before expiry (8B).

### HSTS
The web app already sends `Strict-Transport-Security: max-age=31536000; includeSubDomains` in production builds. **Do not request HSTS preload until every subdomain is HTTPS-only.**

## 2. Email DNS (Resend; detailed templates and instructions in 8D)

| Record | Host | Value | Purpose |
|---|---|---|---|
| TXT (SPF) | `send.<domain>` | `v=spf1 include:<value from Resend> -all` | Authorises Resend to send for the subdomain |
| TXT/CNAME (DKIM) | `<selector>._domainkey.send.<domain>` | Public key or CNAME given by Resend | Signs messages |
| MX | `send.<domain>` | Feedback host given by Resend | Bounce and complaint handling (custom return path) |
| TXT (DMARC) | `_dmarc.<domain>` | Start: `v=DMARC1; p=none; rua=mailto:dmarc@<domain>; adkim=s; aspf=s; pct=100` | Reporting first |

**DMARC rollout:**
1. Start with `p=none` for 2–4 weeks and review the reports.
2. Move to `p=quarantine`.
3. Then move to `p=reject` before public launch.

**Resend preconditions:**
- Approval of Resend's data-processing agreement (founder decision).
- Confirmation of where message content and logs are stored.

## 3. Third-party integrations

| Integration | Needed for | What we need from the provider | Credentials (Key Vault, operator-set) | Network | Status |
|---|---|---|---|---|---|
| **Stripe Connect** (preferred, D05) | Payments, seller onboarding, payouts, refunds, disputes | Eligibility answers (`payment-providers.md`), **test-mode** account for staging (8C), webhook endpoint `https://<host>/api/v1/payments/webhooks/stripe` for each environment, Apple Pay domain verification file served from `www` | Restricted API key, webhook signing secret (test first, live only at 8H) | Outbound HTTPS to api.stripe.com. Inbound signed webhooks through the gateway (WAF allows Stripe's published webhook IP list on the webhook path). | Not started (blocked on checklist answers) |
| **Mamo** (alternative) | Same | Sales conversation on vendor KYC, webhooks and licence | Same | Same | Evaluation only |
| **Resend** (email) | Verification, password reset and all transactional email (EN/AR) | DPA approval, sending domain, test domain for staging | Sending API key (domain-scoped) | Outbound HTTPS only | Not started (8D) |
| **Malware scanning** | Every upload before use | Option A: ClamAV container (open source, in-region). Option B: Microsoft Defender for Storage (Azure). | None for ClamAV. Azure role for Defender. | Internal only | Decide in 8D |
| **Microsoft Azure** | Hosting (D12) | Subscription(s), billing agreement, region access requests (PostgreSQL, UAE Central), support plan | OIDC federation for CI (no secrets) | n/a | Not started (needs provisioning approval) |
| **Domain registrar and DNS** | Domains, email authentication | `.ae` registration, DNS hosting (Azure DNS or the registrar) | Registrar account with MFA | n/a | Waiting for branding |
| **Certificate authority** | TLS | Certificates for production and staging hosts | Stored in Key Vault | n/a | 8B |
| **GitHub** | CI/CD | Environments `staging` and `production` with required reviewers. OIDC trust to Azure. | No cloud secrets | n/a | 8B |
| **Penetration tester** (independent) | 8F | Scope: web, admin, API and staging infrastructure. Rules of engagement. | Test accounts on staging | Staging IP allowlist | 8F |

## 4. What the founder needs to supply or approve before 8B
1. Answers to the questions in `vercel-architecture.md` (Vercel plan, region, spend budget with pause, free-tier sign-ups).
2. Who receives Vercel budget alerts.
3. The brand and domain (or approval to register a working domain for staging).
4. Resend data-processing approval (8D) and Stripe eligibility answers (8C).
