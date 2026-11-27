# Security and access control
Deny by default. Authentication, email verification, active membership, workspace kind, role, entity ownership and action-specific status are independent checks. Admin session cannot inherit company rights. Resource queries use scoped WHERE predicates; no client-supplied tenant trust. Use 404 for inaccessible IDs. Public access only authentication and public informational pages; marketplace pool requires approved workspace.

| Capability | Buyer owner | Buyer procurement | Buyer viewer | Seller owner | Seller sales | Seller warehouse | Seller finance | Seller viewer |
|---|---|---|---|---|---|---|---|---|
| Browse authorized marketplace | Y | Y | Y | — | — | — | — | — |
| RFQ/cart/pay | Y | Y | — | — | — | — | — | — |
| Buyer order read | Y | Y | Y | — | — | — | — | — |
| Buyer receipt/dispute/review | Y | Y | — | — | — | — | — | — |
| Seller catalog and quotes edit | — | — | — | Y | Y | — | — | — |
| Seller inventory/ship | — | — | — | Y | — | Y | — | — |
| Seller order read | — | — | — | Y | Y | Y | Y | Y |
| Seller finance/export | — | — | — | Y | — | — | Y | — |
| Team/legal/verification edit | Y | — | — | Y | — | — | — | — |
| Messaging | Y | Y | — | Y | Y | — | — | — |

Viewer cannot download sensitive legal/finance documents; warehouse gets minimum shipping contact fields. Buyer invoice read owner/procurement only. Company owner grant scoped roles; last owner cannot be removed. Invitations expire, bind email and intended workspace, single use. Revoke membership immediately invalidates access and realtime subscription.

Admin compliance: verification/catalog and suspension; support: assigned case and necessary order details; finance: reconciliation and requests; finance approver: independent approval; super-admin: roles/config/system, no implicit financial approval. Enforce distinct actor for dual approvals. Require MFA for admin, seller payout profile changes and privileged actions; step-up authentication for sensitive exports. Session cookies Secure/HttpOnly/SameSite, CSRF tokens, rotation on login/role change, revocation and bounded expiry. Passwords Argon2id or established auth provider; rate limit login/reset and prevent enumeration.

Uploads: private bucket, randomized keys, allowlisted MIME/size, inspect magic bytes, malware scan/quarantine; no public URLs for licence, RFQ attachment, invoices or proof. Presign only after scoped authorization; short TTL; audit sensitive downloads. Product images only publicly served if approved and sanitized (strip metadata). Logs redact credentials, personal data and payment payloads; no tokens in query strings or analytics. TLS, encryption at rest, secret manager, dependency scanning, CSP, input validation, parameterized SQL, SSRF controls for external URL fetches. Webhook raw body signature, replay protection per provider docs.

Privacy launch gate: UAE legal review of data controller/processor roles, lawful basis, notices, cross-border transfers, retention and deletion rights, processor contracts. Implement account data export and deletion request workflow with legal retention hold for invoices/disputes; no blind cascade of financial records. Establish retention schedule and incident response before real data. Backups encrypted, restore tested, least-privilege DB/worker credentials. Record access reviews and incident owner. No live sensitive data in development or fixtures.
