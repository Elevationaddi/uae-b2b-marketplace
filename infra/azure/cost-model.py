#!/usr/bin/env python3
"""Phase 8A monthly cost model (USD list prices, uaenorth, 730 h/month, AED at the 3.6725 peg).
Run: python3 infra/azure/cost-model.py  -- prints the tables in docs/phase-8/cost-estimate.md.
UNVERIFIED unit prices are assumptions to replace with Azure Pricing Calculator quotes."""
H=730; S=H*3600; FX=3.6725
vcpu=0.000024*S; gib=0.000003*S  # per month active
def aca(n,c,m): return n*(c*vcpu+m*gib)
V='verified'; U='UNVERIFIED'
def env(name,rows):
    print(f"\n## {name}")
    print("| Item | Sizing | USD/month | AED/month | Price status |\n|---|---|---:|---:|---|")
    t=0
    for item,size,usd,st in rows:
        t+=usd; print(f"| {item} | {size} | {usd:,.0f} | {usd*FX:,.0f} | {st} |")
    c=t*0.15
    print(f"| Contingency 15% | usage variance, unverified prices | {c:,.0f} | {c*FX:,.0f} | |")
    print(f"| **Total** | | **{t+c:,.0f}** | **{(t+c)*FX:,.0f}** | |")
    return t+c
pg_gp=0.2136; pg_b2s=0.0816; pg_st=0.138
prod=[
("Container Apps: web","2 replicas × 1 vCPU / 2 GiB, always active",aca(2,1,2),V),
("Container Apps: api","2 replicas × 1 vCPU / 2 GiB, always active",aca(2,1,2),V),
("Container Apps: worker","1 replica × 0.5 vCPU / 1 GiB",aca(1,.5,1),V),
("Container Apps: ClamAV scanner (8D option)","1 replica × 1.5 vCPU / 3 GiB",aca(1,1.5,3),V),
("Container Apps: requests and jobs","~5M requests; nightly backup and migrate jobs",5*0.4+3,V),
("PostgreSQL flexible server","GP D2ds_v5, zone-redundant HA (2× compute)",pg_gp*2*H,U),
("PostgreSQL storage","128 GiB × 2 (HA) + ~100 GiB extra backup",128*2*pg_st+100*0.114,U),
("Redis","Standard C1 (replicated) — or Azure Managed Redis B1",0.091*H,V+" (C1)"),
("Application Gateway WAF v2","fixed + ~2 capacity units avg",0.475*H+2*0.019*H,V),
("Public IP (Standard) for gateway","1 static IP",0.005*H,U),
("Blob Storage (ZRS)","~200 GB files + ~150 GB backups (cool) + operations",200*0.0253+150*0.012+10,U+" (ZRS est.)"),
("Key Vault","~1M operations, certificates",1e6/1e4*0.0396+1,V),
("Log Analytics + App Insights","~20 GB/month ingestion, 90-day retention",20*3.0+5,U),
("Azure Monitor alerts","~20 metric/log alert rules",10,U),
("Container Registry","Standard (shared with staging)",20,U),
("Private endpoints + DNS zones","3 endpoints (blob, vault, redis), 5 zones (incl. postgres, environment)",3*0.01*H+5*0.5,U),
("Bandwidth (egress)","~200 GB/month",15,U),
]
stg=[
("Container Apps: web + api","1 replica each × 0.5 vCPU / 1 GiB",aca(2,.5,1),V),
("Container Apps: worker","1 × 0.25 vCPU / 0.5 GiB",aca(1,.25,.5),V),
("Container Apps: ClamAV","1 × 1 vCPU / 2 GiB",aca(1,1,2),V),
("PostgreSQL flexible server","Burstable B2s, no HA, 7-day PITR",pg_b2s*H,U),
("PostgreSQL storage","32 GiB",32*pg_st,U),
("Redis","Basic C1 (no replica)",0.0726*H,V),
("Blob Storage (LRS)","~20 GB + operations",20*0.020275+2,V),
("Key Vault","low volume",1,V),
("Log Analytics + App Insights","~5 GB/month, daily cap 1 GB, 30-day retention",5*3.0,U),
("Private endpoints + DNS zones","3 endpoints, 4 zones (incl. postgres)",3*0.01*H+4*0.5,U),
("Bandwidth and IPs","",5,U),
]
low=[
("Container Apps: web + api","1 replica each × 1 vCPU / 2 GiB",aca(2,1,2),V),
("Container Apps: worker","1 × 0.5 vCPU / 1 GiB",aca(1,.5,1),V),
("Container Apps: requests and jobs","",5,V),
("PostgreSQL flexible server","GP D2ds_v5, single zone (no HA), PITR 35 days",pg_gp*H,U),
("PostgreSQL storage","128 GiB + backups",128*pg_st+100*0.114,U),
("Redis","Standard C1",0.091*H,V),
("Azure Front Door Standard + WAF custom rules","base + policy + 5 rules + requests/egress",35+5+5+20,U+" (zone pricing)"),
("Malware scanning: Defender for Storage","per-account fee + ~10 GB scanned",10+10*0.15,U),
("Blob Storage (ZRS)","as recommended",200*0.0253+150*0.012+10,U),
("Key Vault","",5,V),
("Log Analytics","~10 GB/month",10*3.0+3,U),
("Container Registry","Basic",5,U),
("Private endpoints + DNS zones","3 endpoints (blob, vault, redis), 4 zones",3*0.01*H+4*0.5,U),
("Bandwidth","",15,U),
]
p=env("Production (recommended)",prod); s=env("Staging",stg); l=env("Production (lower-cost alternative)",low)
print(f"\nprod+stg USD {p+s:,.0f} AED {(p+s)*FX:,.0f}; low+stg USD {l+s:,.0f} AED {(l+s)*FX:,.0f}")
