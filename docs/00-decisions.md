# Decision register
Status: proposed defaults are authorized only for local development; founder approval required for production commercial rules. No brand name has been assumed.

| ID | Topic | Development baseline | Production gate |
|---|---|---|---|
| D01 | Clients | Responsive buyer/seller web, desktop admin; native app later | Confirm mobile launch scope |
| D02 | Geography | UAE domestic delivery, AED, EN/AR | Confirm seller eligibility and categories |
| D03 | Access | Verified companies only; free sandbox plan | Approve paid access, entitlements, pricing |
| D04 | Commission | Configurable basis points; test fixture 1000 bps, not commercial price | Approve rate/base and contractual terms |
| D05 | Payment | Mock adapter locally; licensed marketplace PSP in production | Provider underwriting, permitted payout/refund model |
| D06 | Tax | Explicit tax configuration; no assumed blanket VAT treatment | Accountant approves invoice issuer and VAT rules |
| D07 | Delivery | Seller-arranged shipping, fixed/manual quote before checkout | Approve logistics responsibilities and SLAs |
| D08 | Returns | Case-by-case support; no automatic eligibility promise | Approve cancellation, disputes and returns policies |
| D09 | Verification | Manual review, trade licence + authorized representative evidence | Approve documents, review policy and retention |
| D10 | Approval | Owner and procurement roles MVP; spend limits phase 2 | Confirm procurement policy |
| D11 | Reservation | 15-minute sandbox reservation; pending PSP exceptions reconciled | Approve production timing |
| D12 | Hosting | Local Docker; production region undecided | Privacy, residency, recovery requirements |
| D13 | Custom manufacture | RFQ conversion and full payment MVP; staged payments phase 2 | Approve milestones and deposits |
| D14 | Catalog | Seed packaging, textiles, office supplies as examples only | Approve categories and restricted items |
| D15 | Legal | Platform intermediary; no self-operated escrow | Legal review of contracts, merchant role, data and regulated goods |

Record decisions with owner, date, rationale, affected docs, migration implications. Unknown production settings must fail closed. Never turn test fixture values into live defaults.
