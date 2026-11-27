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
| D09 | Verification | Manual review, trade licence + authorized representative evidence; required before trading (A08) | Approve documents, review policy and retention |
| D10 | Approval | Owner and procurement roles MVP; spend limits phase 2 (full role matrix approved, see A04) | Confirm procurement policy |
| D11 | Reservation | 15-minute sandbox reservation; pending PSP exceptions reconciled; quote payment window 72h configurable (A05) | Approve production timing |
| D12 | Hosting | Local Docker; production region undecided | Privacy, residency, recovery requirements |
| D13 | Custom manufacture | RFQ conversion and full payment MVP; staged payments phase 2 | Approve milestones and deposits |
| D14 | Catalog | Seed packaging, textiles, office supplies as examples only | Approve categories and restricted items |
| D15 | Legal | Platform intermediary; no self-operated escrow | Legal review of contracts, merchant role, data and regulated goods |

Record decisions with owner, date, rationale, affected docs, migration implications. Unknown production settings must fail closed. Never turn test fixture values into live defaults.

## Approved decisions
Approved by the founder (CEO) on 27 November 2026, in the project thread. These override the development baselines above where they differ. Production gates in the table above that are not listed here remain open.

| ID | Decision | Owner / date | Rationale | Affected docs | Migration implications |
|---|---|---|---|---|---|
| A01 | Authentication is self-hosted email and password. Passwords hashed with Argon2id; server-side sessions stored in PostgreSQL (opaque random token in an HttpOnly cookie, only its hash stored). No external auth provider. | Founder, 2026-11-27 | Control and data residency; avoids provider dependency | 10-security, 07-api | `users`, `sessions`, `user_tokens` tables |
| A02 | Admin accounts require TOTP two-factor authentication with authenticator apps, plus single-use recovery codes. Admin access is refused until MFA is enrolled and verified for the session. | Founder, 2026-11-27 | Privileged access protection | 04-admin, 10-security | `mfa_recovery_codes`; encrypted TOTP secret on `users` |
| A03 | The admin portal runs on a separate origin in production, with isolated sessions and cookies. Administrators are created only through an audited privileged process and can never register through public registration. | Founder, 2026-11-27 | Cookie/session isolation, smaller attack surface | 04-admin, 07-api, 10-security, 13-roadmap | `users.account_type`, `sessions.scope`, `ADMIN_ORIGIN` env |
| A04 | Implement the complete role and permission matrix in 10-security for buyer, seller (supplier/manufacturer) and admin roles. Resolves the D10 wording: D10 lists purchasing roles; viewer, sales, warehouse and finance roles are also in MVP. Spend limits / approval thresholds remain phase 2. | Founder, 2026-11-27 | Spec consistency | 10-security, 02-buyer, 03-seller | `memberships.role`, `admin_memberships.role` enums |
| A05 | Quote payment deadline: configurable, default 72 hours after quote acceptance, separate from the 15-minute stock reservation (D11). | Founder, 2026-11-27 | Custom orders need time for buyer payment processes | 09-workflows, 02-buyer, 08-finance | Config `QUOTE_PAYMENT_WINDOW_HOURS`; used from Phase 3/4 |
| A06 | Product name stays a configurable working name until branding is approved. | Founder, 2026-11-27 | Branding pending | 05-ui | Config `APP_NAME` |
| A07 | Email verification is mandatory for all registered users before any company or workspace action. | Founder, 2026-11-27 | Account integrity | 01-product, 10-security | `users.email_verified_at` |
| A08 | Commercial transactions require an approved company verification with approved documentation and a valid (unexpired) trade licence. Expired licences restrict new trading (existing orders remain accessible, per 09-workflows). | Founder, 2026-11-27 | Verified-business marketplace | 01-product, 09-workflows, 04-admin | `companies.status`, licence expiry job |

Not approved by these decisions (still open): live PSP, production email provider, tax/invoice issuer (D06), hosting region (D12), legal review (D15) and all other production gates.
