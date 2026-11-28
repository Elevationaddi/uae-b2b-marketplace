# Azure UAE North: service availability check

**Date:** 2026-11-28 (UTC).

**Method:**
- public Microsoft documentation;
- the Azure Retail Prices API (a priced meter for `uaenorth` shows the service is sold in the region);
- a community report on Microsoft Q&A.

**Limits of this check:**
- No subscription was used, so quota, SKU restrictions and capacity for **our** subscription could not be checked.
- Service health was not checked, because there is no subscription to query.
- "Confirmed" below means confirmed from public data. The final check is the subscription-level step at the end, which must be run before any provisioning approval.

## Region facts
| Fact | Finding | Source |
|---|---|---|
| UAE North availability zones | 3 zones | Azure regions list |
| Paired region | UAE Central (Abu Dhabi). **Access-restricted** "to support specific customer scenarios, such as disaster recovery within a specific geographic area". No availability zones. | Azure regions list |

## Services
| Service | UAE North status | Evidence | Note |
|---|---|---|---|
| Azure Container Apps (consumption and dedicated workload profiles) | **Sold in region** | Priced meters for `uaenorth`: vCPU, memory, requests, dedicated plan | Zone-redundant environments are supported for the service. Confirm zone redundancy in UAE North at deployment. |
| Azure Database for PostgreSQL flexible server | **Unconfirmed for our subscription** | Priced meters for `uaenorth` not returned in the readable API output. A Microsoft Q&A report (2026-11-13) shows `SkuNotAvailable` for a B2s server in UAE North that was not fixed by quota. The suggested fix is a **region access request** through Azure support. | **Highest provisioning risk.** Run the subscription check below. Raise a support request for General Purpose D2ds_v5 with zone-redundant HA before approval. |
| Azure Cache for Redis | **Sold in region** | Priced meters for Basic C1, Standard C1, C2, C4 | Microsoft has announced retirement of Azure Cache for Redis in favour of Azure Managed Redis. Check whether new instances can still be created. |
| Azure Managed Redis | **Unconfirmed** | Not checked in the price data | Preferred if available in UAE North |
| Blob Storage | **Sold in region** | Priced meters: Hot LRS, Hot RA-GRS, Hot GZRS, Cool LRS, Premium ZRS | GRS/GZRS replicate to the paired region. With UAE Central restricted, confirm what geo-replication actually does for a new subscription. |
| Key Vault | **Sold in region** | Priced meters (operations, HSM keys) | |
| Application Gateway WAF v2 | **Sold in region** | Priced meters (fixed, capacity units) | |
| Azure Front Door | Global service | Priced by zone, not region | TLS terminates at Microsoft edge sites, not only in the UAE |
| Azure Monitor / Log Analytics | **Sold in region** | Priced meters (data export, restore, commitment tiers) | Pay-as-you-go ingestion price not returned |
| Private Link / private endpoints | Expected | Not checked separately | |
| Container Registry | Expected | Not checked | Confirm the SKU in region |

## Subscription-level check (run before asking for approval to provision)

These commands are **read-only** and cost nothing. They need an Azure subscription with Reader access. Run them once the subscription exists.

```bash
# Region and zones
az account list-locations --query "[?name=='uaenorth']" -o table

# PostgreSQL flexible server: SKUs, HA and zone support offered to this subscription
az postgres flexible-server list-skus --location uaenorth -o table

# Container Apps workload profiles available in region
az containerapp env workload-profile list-supported --location uaenorth -o table

# Resource providers registered
az provider show -n Microsoft.App --query registrationState
az provider show -n Microsoft.DBforPostgreSQL --query registrationState

# Quotas (vCPU) in region
az vm list-usage --location uaenorth -o table

# Service health for the region
az rest --method get --url "https://management.azure.com/subscriptions/{subId}/providers/Microsoft.ResourceHealth/events?api-version=2022-10-01&\$filter=properties/impact/impactedService eq 'Azure Database for PostgreSQL flexible servers'"
```

Then:
1. **PostgreSQL access request.** If D2ds_v5 with zone-redundant HA is not offered, open an Azure support request ("Region access for Azure Database for PostgreSQL flexible server, UAE North"), giving the SKU, HA mode and zones.
2. **UAE Central access request.** Needed only if regional disaster recovery (geo-redundant backup or a cross-region replica) is required. See `architecture.md`, "Recovery objectives".
3. **Record the results** in this file, with the date and subscription ID (not secret), before the provisioning request goes to the founder.
