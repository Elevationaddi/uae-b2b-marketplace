# Monthly cost estimate (Phase 8A)

**Date:** 2026-11-28 (UTC). **Status:** estimate for founder approval. **Nothing is provisioned, and no charges have been incurred.**

## How the figures were built
- **Prices.** Microsoft Azure public pay-as-you-go list prices in USD for region `uaenorth`, taken from the Azure Retail Prices API on 2026-11-28.
- **Conversion.** USD is converted to AED at the fixed peg of **3.6725**.
- **Exclusions.** Figures exclude 5% UAE VAT, any partner or CSP margin, and discounts (reservations, savings plans, enterprise agreements).
- **Hours.** 730 hours per month. Container Apps are costed as **always active** at the active rate, which is the worst case.
- **Price status.** Each line is marked **verified** (price read for `uaenorth`) or **UNVERIFIED**. An unverified price is an assumption, either because the API response did not return the UAE North row or because the line is usage-dependent.
  - **PostgreSQL flexible server prices could not be confirmed for UAE North.**
  - The assumptions used are about 20% above typical US list prices: General Purpose D2ds_v5 at USD 0.2136 per hour, Burstable B2s at USD 0.0816 per hour, and storage at USD 0.138 per GiB-month.
  - Log Analytics ingestion is assumed at USD 3.00 per GB.
- **Reproducing.** Run `python3 infra/azure/cost-model.py` to print these tables. Before asking for provisioning approval, replace every UNVERIFIED unit price with a quote from the Azure Pricing Calculator (or the partner's price list) for the actual subscription.
- **Contingency.** A 15% contingency is added for usage variance and unverified prices.

Verified unit prices used (USD, `uaenorth`):

| Service | Price |
|---|---|
| Container Apps, consumption | vCPU USD 0.000024/s active, 0.000003/s idle; memory USD 0.000003/GiB-s; requests USD 0.40 per million |
| Application Gateway WAF v2 | USD 0.475/hour fixed + USD 0.019 per capacity unit-hour |
| Azure Cache for Redis | Basic C1 USD 0.0726/hour; Standard C1 USD 0.091/hour |
| Blob Storage | Hot LRS USD 0.020275/GB-month; Hot RA-GRS USD 0.050688; Cool LRS USD 0.012 |
| Key Vault | USD 0.0396 per 10,000 operations |

## Production (recommended)
| Item | Sizing | USD/month | AED/month | Price status |
|---|---|---:|---:|---|
| Container Apps: web | 2 replicas × 1 vCPU / 2 GiB, always active | 158 | 579 | verified |
| Container Apps: api | 2 replicas × 1 vCPU / 2 GiB, always active | 158 | 579 | verified |
| Container Apps: worker | 1 replica × 0.5 vCPU / 1 GiB | 39 | 145 | verified |
| Container Apps: ClamAV scanner (8D option) | 1 replica × 1.5 vCPU / 3 GiB | 118 | 434 | verified |
| Container Apps: requests and jobs | ~5M requests; nightly backup and migrate jobs | 5 | 18 | verified |
| PostgreSQL flexible server | GP D2ds_v5, zone-redundant HA (2× compute) | 312 | 1,145 | UNVERIFIED |
| PostgreSQL storage | 128 GiB × 2 (HA) + ~100 GiB extra backup | 47 | 172 | UNVERIFIED |
| Redis | Standard C1 (replicated) — or Azure Managed Redis B1 | 66 | 244 | verified (C1) |
| Application Gateway WAF v2 | fixed + ~2 capacity units avg | 374 | 1,375 | verified |
| Public IP (Standard) for gateway | 1 static IP | 4 | 13 | UNVERIFIED |
| Blob Storage (ZRS) | ~200 GB files + ~150 GB backups (cool) + operations | 17 | 62 | UNVERIFIED (ZRS est.) |
| Key Vault | ~1M operations, certificates | 5 | 18 | verified |
| Log Analytics + App Insights | ~20 GB/month ingestion, 90-day retention | 65 | 239 | UNVERIFIED |
| Azure Monitor alerts | ~20 metric/log alert rules | 10 | 37 | UNVERIFIED |
| Container Registry | Standard (shared with staging) | 20 | 73 | UNVERIFIED |
| Private endpoints + DNS zones | 3 endpoints (blob, vault, redis), 5 zones (incl. postgres, environment) | 24 | 90 | UNVERIFIED |
| Bandwidth (egress) | ~200 GB/month | 15 | 55 | UNVERIFIED |
| Contingency 15% | usage variance, unverified prices | 216 | 792 | |
| **Total** | | **1,653** | **6,071** | |

## Staging
| Item | Sizing | USD/month | AED/month | Price status |
|---|---|---:|---:|---|
| Container Apps: web + api | 1 replica each × 0.5 vCPU / 1 GiB | 79 | 290 | verified |
| Container Apps: worker | 1 × 0.25 vCPU / 0.5 GiB | 20 | 72 | verified |
| Container Apps: ClamAV | 1 × 1 vCPU / 2 GiB | 79 | 290 | verified |
| PostgreSQL flexible server | Burstable B2s, no HA, 7-day PITR | 60 | 219 | UNVERIFIED |
| PostgreSQL storage | 32 GiB | 4 | 16 | UNVERIFIED |
| Redis | Basic C1 (no replica) | 53 | 195 | verified |
| Blob Storage (LRS) | ~20 GB + operations | 2 | 9 | verified |
| Key Vault | low volume | 1 | 4 | verified |
| Log Analytics + App Insights | ~5 GB/month, daily cap 1 GB, 30-day retention | 15 | 55 | UNVERIFIED |
| Private endpoints + DNS zones | 3 endpoints, 4 zones (incl. postgres) | 24 | 88 | UNVERIFIED |
| Bandwidth and IPs |  | 5 | 18 | UNVERIFIED |
| Contingency 15% | usage variance, unverified prices | 51 | 188 | |
| **Total** | | **393** | **1,443** | |

## Production (lower-cost alternative)
| Item | Sizing | USD/month | AED/month | Price status |
|---|---|---:|---:|---|
| Container Apps: web + api | 1 replica each × 1 vCPU / 2 GiB | 158 | 579 | verified |
| Container Apps: worker | 1 × 0.5 vCPU / 1 GiB | 39 | 145 | verified |
| Container Apps: requests and jobs |  | 5 | 18 | verified |
| PostgreSQL flexible server | GP D2ds_v5, single zone (no HA), PITR 35 days | 156 | 573 | UNVERIFIED |
| PostgreSQL storage | 128 GiB + backups | 29 | 107 | UNVERIFIED |
| Redis | Standard C1 | 66 | 244 | verified |
| Azure Front Door Standard + WAF custom rules | base + policy + 5 rules + requests/egress | 65 | 239 | UNVERIFIED (zone pricing) |
| Malware scanning: Defender for Storage | per-account fee + ~10 GB scanned | 12 | 42 | UNVERIFIED |
| Blob Storage (ZRS) | as recommended | 17 | 62 | UNVERIFIED |
| Key Vault |  | 5 | 18 | verified |
| Log Analytics | ~10 GB/month | 33 | 121 | UNVERIFIED |
| Container Registry | Basic | 5 | 18 | UNVERIFIED |
| Private endpoints + DNS zones | 3 endpoints (blob, vault, redis), 4 zones | 24 | 88 | UNVERIFIED |
| Bandwidth |  | 15 | 55 | UNVERIFIED |
| Contingency 15% | usage variance, unverified prices | 94 | 346 | |
| **Total** | | **723** | **2,656** | |

## Summary

| Option | Production | Staging | Total per month |
|---|---:|---:|---:|
| **Recommended** (zone-redundant HA, in-region WAF, ClamAV) | **AED 6,071** (USD 1,653) | **AED 1,443** (USD 393) | **AED 7,514** (USD 2,046) |
| **Lower-cost** (single-zone database, Front Door Standard, Defender for Storage) | AED 2,656 (USD 723) | AED 1,443 | AED 4,099 (USD 1,116) |

**Staging savings.** Staging can drop to roughly AED 600–700 per month if it is stopped outside test windows:
- Container Apps minimum replicas set to 0;
- the PostgreSQL server stopped (maximum 7 days at a time);
- Redis removed between test cycles and recreated by Terraform.

The figures above assume staging runs 24/7.

## What the lower-cost option gives up
| Area | Recommended | Lower-cost | Effect |
|---|---|---|---|
| Database availability | Zone-redundant HA: automatic failover in about 2 minutes on a zone outage | Single zone: restore from PITR on a zone outage (about 1–2 hours) | RTO 4 h is still met. Longer outage during a zone failure. |
| Web and API availability | 2 replicas each, spread across zones | 1 replica each | Short outages during restarts and deployments (Container Apps revisions still roll). |
| WAF | Application Gateway WAF v2 in UAE North, managed OWASP and bot rule sets, TLS terminated in the UAE | Front Door Standard: custom rules and rate limits only (managed rule sets need Premium at about USD 330/month base). TLS terminated at Microsoft's global edge. | Weaker managed protection. Traffic is decrypted outside the UAE at edge sites, which is a data-residency question for legal. |
| Malware scanning | ClamAV in-region, synchronous before use (fits the current design) | Defender for Storage, asynchronous after upload | Needs a design change: files stay quarantined until the scan event arrives. |
| Observability | 90-day logs | Shorter retention, smaller volume | Less history for investigations. |

**Recommendation:** run the **recommended** layout for production and the **stopped-outside-test-windows** staging. If the budget requires it, the lower-cost database (no HA) is the safest single saving (about AED 600 per month). Keep the in-region WAF.

## Not included
- **Stripe or Mamo processing fees.** These are a percentage of volume; see `payment-providers.md`.
- **Resend.** The free tier is 3,000 emails per month. Paid tiers start at about USD 20 per month, to be confirmed in 8D.
- **Domain registration.** A `.ae` domain is about AED 100–400 per year through a registrar accredited by the .ae registry.
- **Microsoft Defender for Cloud plans.** Optional, about USD 7–15 per resource-month.
- **Independent penetration test.** One-off third-party cost.
- **Support plan.** Azure Standard support is about USD 100 per month.
- **Reserved capacity savings.** Reserving the database and Redis for 1 year typically saves 30–40%, but only after load is known.
- **Staff time.**

## Before approval to provision
1. Quote every UNVERIFIED line in the Azure Pricing Calculator for the actual subscription and billing currency.
2. Set Azure budgets with alerts at 50%, 80% and 100% of the approved amount, for each subscription (included in the Terraform).
3. Confirm the founder approves the monthly amount. No resource is created before that approval.
