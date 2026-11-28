# Platform administrator experience

> Manufacturers Marketplace (working title). Standalone part of the UX/UI specification (28 November 2026). This document can be handed to a designer on its own: it repeats the full specification of every screen this experience uses, including shared screens. Brand name, logo and typography are not final; use the approved palette and the temporary font (section 28 of the full specification).

## Who this is for

Platform administrators are staff of the marketplace operator on a separate admin origin with mandatory TOTP: compliance verifies companies and VAT status, moderators review listings, support handles tickets and disputes, finance manages refunds, holds, reconciliation, commission and weekly payouts with two-person approval.

Admin roles: SUPER_ADMIN, COMPLIANCE, MODERATOR, SUPPORT, FINANCE, FINANCE_APPROVER, ANALYST (see section 2). Design each admin screen for the least privileged role that can open it; hide or disable what the role lacks.

## Summary

| Measure | Count |
|---|---|
| Screens in this experience | 67 |
| Implemented / Partial / Planned / Recommended / Blocked | 58 / 0 / 5 / 3 / 1 |
| P0 / P1 / P2 | 35 / 21 / 11 |
| Shared with another experience | 4 |


Journeys in section 5 of the full specification that involve this experience: J-24, J-26, J-27, J-30, J-31.

## Founder decisions that shape this experience

| Decision | Answer | Screens here |
|---|---|---|
| FD-01 | A. One requester and one different approver. No self-approval. | ADM-32, ADM-34, ADM-35, ADM-37 |
| FD-02 | A. Confirm receipt records delivery only. The dispute period remains active. | ADM-29 |
| FD-03 | A. Verified delivery proof or buyer confirmation, whichever is first. Supplier-uploaded evidence must be validated, with a review mechanism for contested or suspicious delivery claims. | ADM-59 |
| FD-04 | Monday at 10:00 AM UAE time, no minimum payout at launch, next working day for public holidays. | ADM-35, ADM-47 |
| FD-05 | A. Authorized finance approver, mandatory MFA, recorded reason, versioned commission and 30 days' advance supplier notice. | ADM-56 |
| FD-06 | A. Disclosed-intermediary model. Tax adviser pending. | ADM-50 |
| FD-14 | A. Retain the existing support limits and urgent exceptions. | ADM-55 |
| FD-15 | A. Public reviews display only "Verified business buyer". Authorized administrators can identify the reviewer where necessary. | ADM-41 |
| FD-19 | A. First-party analytics only. No paid analytics services or unnecessary third-party tracking. | ADM-52 |


## Screen index

| ID | Screen | Type | Status | Priority | Shared |
|---|---|---|---|---|---|
| AUTH-10 | Admin sign in | Page | Implemented | P0 |  |
| AUTH-11 | Admin MFA enrolment | Page | Implemented | P0 |  |
| AUTH-12 | Admin recovery codes | Page | Implemented | P0 |  |
| AUTH-13 | Admin MFA verification | Page | Implemented | P0 |  |
| SYS-01 | Not found / not available | Page | Implemented | P0 | Yes |
| SYS-02 | Error with retry and reference | Page | Implemented | P0 | Yes |
| SYS-03 | Sandbox environment banner | Page | Implemented | P0 | Yes |
| SYS-04 | Trading unavailable / maintenance | Page | Recommended | P2 | Yes |
| ADM-01 | Admin overview and operations | Page | Implemented | P0 |  |
| ADM-02 | Verification queue | Page | Implemented | P0 |  |
| ADM-03 | Verification case detail | Page | Implemented | P0 |  |
| ADM-04 | Verification decision dialog | Dialog | Implemented | P0 |  |
| ADM-05 | Companies | Page | Implemented | P0 |  |
| ADM-06 | Company detail (admin) | Page | Implemented | P0 |  |
| ADM-07 | Suspend or reactivate company dialog | Dialog | Implemented | P0 |  |
| ADM-54 | Confirm VAT status dialog | Dialog | Implemented | P0 |  |
| ADM-55 | Support ticket limit exception | Section | Implemented | P1 |  |
| ADM-08 | Users | Page | Implemented | P1 |  |
| ADM-09 | Revoke sessions dialog | Dialog | Implemented | P1 |  |
| ADM-10 | Catalogue moderation overview | Page | Implemented | P0 |  |
| ADM-11 | Moderation queue | Page | Implemented | P0 |  |
| ADM-12 | Listing version review (diff) | Page | Implemented | P0 |  |
| ADM-13 | Review decision dialog | Dialog | Implemented | P0 |  |
| ADM-14 | All listings | Page | Implemented | P1 |  |
| ADM-15 | Listing detail (admin) | Page | Implemented | P1 |  |
| ADM-16 | Listing enforcement dialog | Dialog | Implemented | P1 |  |
| ADM-17 | Storefront oversight | Page | Implemented | P1 |  |
| ADM-18 | Storefront detail (admin) | Page | Planned | P2 |  |
| ADM-19 | Hide or restore storefront dialog | Dialog | Implemented | P1 |  |
| ADM-20 | Categories | Page | Implemented | P1 |  |
| ADM-21 | Category editor | Page | Implemented | P1 |  |
| ADM-22 | Category attribute editor | Dialog | Implemented | P2 |  |
| ADM-23 | Restricted and prohibited terms | Page | Implemented | P2 |  |
| ADM-24 | Featured placements | Page | Implemented | P2 |  |
| ADM-25 | RFQ oversight | Page | Implemented | P1 |  |
| ADM-26 | RFQ detail (admin) | Page | Implemented | P1 |  |
| ADM-27 | Hide or unhide RFQ dialog | Dialog | Implemented | P2 |  |
| ADM-28 | Orders (admin) | Page | Implemented | P0 |  |
| ADM-29 | Order detail (admin) | Page | Implemented | P0 |  |
| ADM-30 | Finance overview | Page | Implemented | P0 |  |
| ADM-31 | Reconciliation case resolution | Dialog | Implemented | P0 |  |
| ADM-32 | Refunds | Page | Implemented | P0 |  |
| ADM-33 | Request refund form | Section | Implemented | P0 |  |
| ADM-34 | Approve or reject refund dialog | Dialog | Implemented | P0 |  |
| ADM-35 | Payouts | Page | Implemented | P0 |  |
| ADM-36 | Request payout dialog | Dialog | Implemented | P0 |  |
| ADM-37 | Approve or reject payout dialog | Dialog | Implemented | P0 |  |
| ADM-38 | Disputes queue | Page | Implemented | P0 |  |
| ADM-39 | Dispute detail (admin) | Page | Implemented | P0 |  |
| ADM-40 | Dispute action dialogs | Dialog | Implemented | P0 |  |
| ADM-59 | Delivery proof review | Page | Planned | P1 |  |
| ADM-41 | Supplier reviews moderation | Page | Implemented | P2 |  |
| ADM-42 | Support queue | Page | Implemented | P1 |  |
| ADM-43 | Ticket detail (admin) | Page | Implemented | P1 |  |
| ADM-44 | Reports (scoped CSV exports) | Page | Implemented | P1 |  |
| ADM-45 | Audit log | Page | Implemented | P1 |  |
| ADM-46 | Staff and roles | Page | Implemented | P1 |  |
| ADM-47 | Platform settings: payout schedule and policy windows | Page | Planned | P1 |  |
| ADM-56 | Commission policy | Page | Implemented | P0 |  |
| ADM-57 | Settlement holds | Page | Implemented | P0 |  |
| ADM-58 | Release hold dialog | Dialog | Implemented | P0 |  |
| ADM-48 | Logistics and delivery settings | Page | Planned | P2 |  |
| ADM-49 | System health and webhooks | Page | Recommended | P2 |  |
| ADM-50 | Tax configuration and invoicing | Page | Blocked | P1 |  |
| ADM-51 | Data requests, account closure and legal hold | Page | Planned | P1 |  |
| ADM-52 | Executive analytics | Page | Recommended | P2 |  |
| ADM-53 | Sandbox provider simulator | Action | Implemented | P2 |  |


## How to read each screen

Each screen is specified with the 19 items the founder asked for on 28 November 2026 (numbered 1–19 in every table), plus route, status, data entities, source files and decisions. Loading, empty, error, success and confirmation behaviour follows the shared contract in section 18; where a screen has its own copy, it is quoted. Arabic and RTL rules follow section 20. Interactions with other roles name the screens where the other side sees or acts on the same record.

## Authentication

### AUTH-10 · Admin sign in

| Item | Specification |
|---|---|
| Screen ID | AUTH-10 |
| Screen name | Admin sign in |
| Experience | Platform administrators |
| User roles | Platform staff |
| Route / URL | `/{locale}/admin/login (admin origin only)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Password step for staff on the separate admin origin (A03). |
| 2. Navigation location | Then AUTH-11 or AUTH-13 |
| 3. User permissions | Admin accounts only (provisioned by CLI); company pages return 404 on this host. |
| 4. Screen layout | Centred card on the admin origin, environment label, no public links. Page header (title, status badge, primary action). Content: Auth card (admin styling), fields, button. |
| 5. Components | Auth card (admin styling), fields, button |
| 6. Displayed data | "Admin sign in", "Restricted to platform staff. Two-factor authentication is required." |
| 7. Buttons and actions | Primary: Sign in · Secondary: — |
| 8. Form fields | Required: Email, Password · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Invalid credentials; rate limit |
| 10. API dependencies | POST /admin/auth/login |
| Database entities | users (PLATFORM_ADMIN), sessions (ADMIN scope) |
| Source files | admin/login/page.tsx; lib/hosts.ts |
| 11. Loading state | Form renders immediately. On submit the button reads "Sign in…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: Invalid credentials; rate limit Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: Then AUTH-11 or AUTH-13. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | Response says which MFA step is required. |
| Related screens | AUTH-11, AUTH-13 |
| Dependencies and decisions | A02, A03 |

Form fields:

  - Email (email, Required): valid
  - Password (password, Required): 1–128

### AUTH-11 · Admin MFA enrolment

| Item | Specification |
|---|---|
| Screen ID | AUTH-11 |
| Screen name | Admin MFA enrolment |
| Experience | Platform administrators |
| User roles | Platform staff (first sign-in) |
| Route / URL | `/{locale}/admin/mfa` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Mandatory TOTP enrolment. |
| 2. Navigation location | Then AUTH-12 |
| 3. User permissions | Password step done, MFA pending |
| 4. Screen layout | Centred card on the admin origin, environment label, no public links. Page header (title, status badge, primary action). Content: QR image, monospace key with copy, OTP input, button. |
| 5. Components | QR image, monospace key with copy, OTP input, button |
| 6. Displayed data | QR code image, manual setup key, 6-digit code field. |
| 7. Buttons and actions | Primary: Confirm and continue · Secondary: — |
| 8. Form fields | Required: 6-digit code · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | field.code; error.admin.mfa_code_invalid |
| 10. API dependencies | POST /admin/auth/mfa/enroll/start; /enroll/confirm |
| Database entities | users.mfa_secret_enc |
| Source files | admin/mfa/page.tsx |
| 11. Loading state | Form renders immediately. On submit the button reads "Confirm and continue…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: field.code; error.admin.mfa_code_invalid Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: Then AUTH-12. |
| 15. Confirmation dialogs | Confirm in a dialog before: confirm (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Stacked. |
| 17. Desktop layout (1440px) | QR left, form right. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | AUTH-12 |
| Dependencies and decisions | A02 |

Form fields:

  - 6-digit code (otp, Required): ^\d{6}$

### AUTH-12 · Admin recovery codes

| Item | Specification |
|---|---|
| Screen ID | AUTH-12 |
| Screen name | Admin recovery codes |
| Experience | Platform administrators |
| User roles | Platform staff |
| Route / URL | `/{locale}/admin/mfa (step)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Show 10 single-use recovery codes once. |
| 2. Navigation location | → ADM-01 |
| 3. User permissions | Just enrolled |
| 4. Screen layout | Centred card on the admin origin, environment label, no public links. Page header (title, status badge, primary action). Content: Code grid (monospace), checkbox "I have saved these codes", button. |
| 5. Components | Code grid (monospace), checkbox "I have saved these codes", button |
| 6. Displayed data | Codes grid, warning that they will not be shown again. |
| 7. Buttons and actions | Primary: Continue · Secondary: Copy / download codes (recommended) |
| 8. Form fields | Required: I have saved these codes · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | (returned by enroll/confirm) |
| Database entities | mfa_recovery_codes |
| Source files | admin/mfa/page.tsx |
| 11. Loading state | Form renders immediately. On submit the button reads "Continue…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: → ADM-01. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Single column codes. |
| 17. Desktop layout (1440px) | Two-column codes. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | AUTH-13 |
| Dependencies and decisions | A02 |

Form fields:

  - I have saved these codes (checkbox, Required): required

### AUTH-13 · Admin MFA verification

| Item | Specification |
|---|---|
| Screen ID | AUTH-13 |
| Screen name | Admin MFA verification |
| Experience | Platform administrators |
| User roles | Platform staff |
| Route / URL | `/{locale}/admin/mfa (verify)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Second factor on every admin sign-in. |
| 2. Navigation location | → ADM-01 |
| 3. User permissions | Password step done |
| 4. Screen layout | Centred card on the admin origin, environment label, no public links. Page header (title, status badge, primary action). Content: OTP input, text input, link button. |
| 5. Components | OTP input, text input, link button |
| 6. Displayed data | Code field, toggle to recovery code, remaining recovery codes shown later in admin header. |
| 7. Buttons and actions | Primary: Verify · Secondary: Use a recovery code instead |
| 8. Form fields | Required: — · Optional: 6-digit code, Recovery code (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | field.code; mfa_code_invalid |
| 10. API dependencies | POST /admin/auth/mfa/verify |
| Database entities | sessions.mfa_verified_at |
| Source files | admin/mfa/page.tsx |
| 11. Loading state | Form renders immediately. On submit the button reads "Verify…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Rules enforced by the server: field.code; mfa_code_invalid Rate limited: "Too many attempts. Wait a few minutes and try again." |
| 14. Success state | Server-confirmed, then the user moves on: → ADM-01. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Card. |
| 17. Desktop layout (1440px) | Card. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | Replay-protected; session rotates. |
| Related screens | ADM-01 |
| Dependencies and decisions | A02 |

Form fields:

  - 6-digit code (otp, Optional): exactly one of code or recovery code
  - Recovery code (text, Optional): XXXX-XXXX format

## Administration portal

### ADM-01 · Admin overview and operations

| Item | Specification |
|---|---|
| Screen ID | ADM-01 |
| Screen name | Admin overview and operations |
| Experience | Platform administrators |
| User roles | All admin roles (content varies by capability) |
| Route / URL | `/{locale}/admin` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Live platform health: verification pipeline counts, operational queues and (finance roles only) commerce figures for a Dubai date range. |
| 2. Navigation location | Admin nav filtered by capability |
| 3. User permissions | admin.companies.read for counts; commerce needs admin.finance.read. |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Admin shell, KPI tiles, queue list with links, date range form (Dubai dates), sandbox alert, "Commerce figures are shown to finance roles only." note. |
| 5. Components | Admin shell, KPI tiles, queue list with links, date range form (Dubai dates), sandbox alert, "Commerce figures are shown to finance roles only." note |
| 6. Displayed data | Signed-in roles, recovery codes remaining; company KPIs (Draft, Submitted, Under review, Needs info, Approved, Suspended, Licences expiring, Unverified users, Company users); queues (open/unassigned disputes, open/unassigned tickets, open reconciliation cases, quarantined webhooks 7 days, refunds/payouts awaiting approval); commerce (paid orders, gross order value, refunded, net of refunds, platform fees net, owed to sellers now, paid out to sellers) with sandbox note; generated at. Since PR #15: "Background tasks" panel (task, last finished, next run, Running / Not run yet / Overdue / Failing ({count} in a row)). |
| 7. Buttons and actions | Primary: Show (apply period) · Secondary: Open queue links |
| 8. Form fields | Required: — · Optional: From, To (details below) |
| Filters · sorting · search | Period · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/overview; GET /admin/operations/overview |
| Database entities | companies, users, disputes, support_tickets, reconciliation_cases, refunds, payouts, ledger_entries |
| Source files | apps/web/src/app/[locale]/admin/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Show…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | Server-computed; no hardcoded figures. |
| Related screens | ADM-02, ADM-38, ADM-42, ADM-30, ADM-32, ADM-35 |
| Dependencies and decisions | — |

Form fields:

  - From (date, Optional): Dubai date
  - To (date, Optional): Dubai date

### ADM-02 · Verification queue

| Item | Specification |
|---|---|
| Screen ID | ADM-02 |
| Screen name | Verification queue |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/verification` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Work through company verification cases. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.verification.review |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table, status badge, pagination, empty state. |
| 5. Components | Filters, table, status badge, pagination, empty state |
| 6. Displayed data | Company, kind (Initial/Renewal), state, submitted at, assignee, licence expiry. |
| 7. Buttons and actions | Primary: Open case · Secondary: Filter; load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State, kind · Oldest submitted first · Company name |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/verification |
| Database entities | verification_cases, companies |
| Source files | apps/web/src/app/[locale]/admin/verification/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No verification queue yet." with a one-line explanation and the action "Open case". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-03 |
| Dependencies and decisions | D08 |

Form fields:

  - None

### ADM-03 · Verification case detail

| Item | Specification |
|---|---|
| Screen ID | ADM-03 |
| Screen name | Verification case detail |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/verification/[caseId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Review submitted company data and documents and decide. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.verification.review |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Description list, document list with audited download, timeline, decision panel. |
| 5. Components | Description list, document list with audited download, timeline, decision panel |
| 6. Displayed data | Company details (legal name, display name, licence number/issuer/expiry, activity, TRN, address), documents with scan state, event history, previous decisions, assignee. |
| 7. Buttons and actions | Primary: Start review (assign to me) · Secondary: Approve; Request information; Reject; download document |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/verification/{id}; POST /start-review; GET /admin/files/{id}/download |
| Database entities | verification_cases, company_documents, files, audit_events |
| Source files | apps/web/src/app/[locale]/admin/verification/[caseId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-04); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-04 Verification decision dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Company owner: sees the outcome and reason on ACC-03 and gets an email. |
| Behaviour | SUBMITTED → UNDER_REVIEW on start; documents downloaded only when CLEAN. |
| Related screens | ADM-04, ADM-06, ACC-03 |
| Dependencies and decisions | D08 |

Form fields:

  - None

### ADM-04 · Verification decision dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-04 |
| Screen name | Verification decision dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-03` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Record approve, needs-info or reject. |
| 2. Navigation location | Opened from ADM-03 Verification case detail |
| 3. User permissions | admin.verification.review |
| 4. Screen layout | Dialog over ADM-03 Verification case detail: title, context text, fields, footer with secondary action then primary action. Content: Dialog, radio, textarea. |
| 5. Components | Dialog, radio, textarea |
| 6. Displayed data | Decision radio, reason (required unless approving), consequence text. |
| 7. Buttons and actions | Primary: Record decision · Secondary: Cancel |
| 8. Form fields | Required: Decision · Optional: Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Reason rule |
| 10. API dependencies | POST /admin/verification/{id}/decision |
| Database entities | verification_cases, companies, workspaces, notifications |
| Source files | verification/[caseId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Record decision…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Record decision" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Company owner: approved, rejected or needs-information status and reason on ACC-03; trading unlocks on approval. |
| Behaviour | Email + in-app notification to company; audit event. |
| Related screens | ADM-03 |
| Dependencies and decisions | — |

Form fields:

  - Decision (radio, Required): APPROVE, NEEDS_INFO, REJECT
  - Reason (textarea, Optional): required unless APPROVE

### ADM-05 · Companies

| Item | Specification |
|---|---|
| Screen ID | ADM-05 |
| Screen name | Companies |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/companies` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Find any company. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.companies.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, status filter, table. |
| 5. Components | Search, status filter, table |
| 6. Displayed data | Name, kinds (buyer/seller), status, licence number, licence expiry. |
| 7. Buttons and actions | Primary: Open company · Secondary: Search; filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Status (7 company statuses) · Name · Company name |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/companies |
| Database entities | companies |
| Source files | apps/web/src/app/[locale]/admin/companies/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No companies yet." with a one-line explanation and the action "Open company". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-06 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-06 · Company detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-06 |
| Screen name | Company detail (admin) |
| Experience | Platform administrators |
| User roles | Admin roles with companies.read |
| Route / URL | `/{locale}/admin/companies/[companyId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Full company record with members and verification cases. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.companies.read; suspend/reactivate admin.companies.suspend |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Description list, members table, cases list, action bar. |
| 5. Components | Description list, members table, cases list, action bar |
| 6. Displayed data | Status, suspension kind, details, workspaces and status, members with roles, cases. Since PR #14: VAT registration with "Confirm VAT status" (ADM-54). Since PR #16: support ticket limit with exception (ADM-55). |
| 7. Buttons and actions | Primary: Suspend / Reactivate (COMPLIANCE) · Secondary: Open case; open user |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/companies/{id} |
| Database entities | companies, workspaces, memberships, verification_cases |
| Source files | apps/web/src/app/[locale]/admin/companies/[companyId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-07, ADM-54); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-07 Suspend or reactivate company dialog; ADM-54 Confirm VAT status dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-07, ADM-54, ADM-55 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-07 · Suspend or reactivate company dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-07 |
| Screen name | Suspend or reactivate company dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-06` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Restrict or restore a company. |
| 2. Navigation location | Opened from ADM-06 Company detail (admin) |
| 3. User permissions | admin.companies.suspend |
| 4. Screen layout | Dialog over ADM-06 Company detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Destructive dialog with reason. |
| 5. Components | Destructive dialog with reason |
| 6. Displayed data | Consequences: workspaces RESTRICTED, trading stops. |
| 7. Buttons and actions | Primary: Suspend company / Reactivate · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/companies/{id}/suspend \| /reactivate |
| Database entities | companies, workspaces, audit_events |
| Source files | companies/[companyId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Suspend company…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Suspend company / Reactivate" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Company members: suspension banner and disabled trading actions in their workspace (SYS-04 pattern). |
| Behaviour | — |
| Related screens | ADM-06 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required): required

### ADM-54 · Confirm VAT status dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-54 |
| Screen name | Confirm VAT status dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE (admin.verification.review) |
| Route / URL | `Dialog on ADM-06` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Compliance confirms a company's declared VAT status and TRN with a reason (P8-10, PR #14). |
| 2. Navigation location | Opened from ADM-06 Company detail (admin) |
| 3. User permissions | admin.verification.review |
| 4. Screen layout | Dialog over ADM-06 Company detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Dialog with textarea. |
| 5. Components | Dialog with textarea |
| 6. Displayed data | Declared status and TRN; "Reason and evidence checked". |
| 7. Buttons and actions | Primary: Confirm VAT status · Secondary: Cancel |
| 8. Form fields | Required: Reason and evidence checked · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/companies/{id}/vat-status |
| Database entities | companies, audit_events |
| Source files | apps/web/src/app/[locale]/admin/companies/[companyId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Confirm VAT status…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "VAT status confirmed.". |
| 15. Confirmation dialogs | This screen is the confirmation step ("Confirm VAT status" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: can quote and sell with the confirmed VAT rule (ACC-19, SEL-22); Business buyer: checkout unblocked (BUY-17). |
| Behaviour | Shows "VAT status confirmed."; enables checkout and quoting for that supplier. |
| Related screens | ADM-06, ACC-19 |
| Dependencies and decisions | P8-10 |

Form fields:

  - Reason and evidence checked (textarea, Required): required

### ADM-55 · Support ticket limit exception

| Item | Specification |
|---|---|
| Screen ID | ADM-55 |
| Screen name | Support ticket limit exception |
| Experience | Platform administrators |
| User roles | SUPPORT (admin.support.manage) |
| Route / URL | `Section of ADM-06` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Support managers set a per-company exception to the 10 open tickets limit with an audited reason (P8-13, PR #16). |
| 2. Navigation location | Opened from ADM-06 Company detail (admin) |
| 3. User permissions | admin.support.manage |
| 4. Screen layout | Block inside ADM-06 Company detail (admin) with its own heading and actions. Content: Number input, reason, two buttons. |
| 5. Components | Number input, reason, two buttons |
| 6. Displayed data | "{open} open of {limit} allowed"; Default limit (10) or Exception for this company. |
| 7. Buttons and actions | Primary: Save limit · Secondary: Restore default |
| 8. Form fields | Required: Limit (1 to 100), Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST /admin/companies/{id}/support-limit |
| Database entities | support_limits, audit_events |
| Source files | apps/web/src/components/support-ui.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Ticket limit saved.". |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at 360px tables become stacked cards, filters move to a sheet, actions to a sticky bar. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Company: new limit shown on SHR-04. |
| Behaviour | "Ticket limit saved."; urgent categories are never blocked. |
| Related screens | ADM-06, SHR-04, ADM-42 |
| Dependencies and decisions | FD-14 answered (A); P8-13 |

Form fields:

  - Limit (1 to 100) (integer, Required): 1–100
  - Reason (textarea, Required)

### ADM-08 · Users

| Item | Specification |
|---|---|
| Screen ID | ADM-08 |
| Screen name | Users |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/users` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Find users and revoke sessions. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.users.read; revoke admin.users.revoke_sessions |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, filter, table, action. |
| 5. Components | Search, filter, table, action |
| 6. Displayed data | Email, account type, email verified, memberships, active sessions, created. |
| 7. Buttons and actions | Primary: Revoke sessions · Secondary: Search; filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Account type · — · Email |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/users |
| Database entities | users, sessions, memberships |
| Source files | apps/web/src/app/[locale]/admin/users/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No users yet." with a one-line explanation and the action "Revoke sessions". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-09); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-09 Revoke sessions dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-09 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-09 · Revoke sessions dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-09 |
| Screen name | Revoke sessions dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `Dialog on ADM-08` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Sign a user out everywhere. |
| 2. Navigation location | Opened from ADM-08 Users |
| 3. User permissions | admin.users.revoke_sessions |
| 4. Screen layout | Dialog over ADM-08 Users: title, context text, fields, footer with secondary action then primary action. Content: Dialog with reason. |
| 5. Components | Dialog with reason |
| 6. Displayed data | Reason hint. |
| 7. Buttons and actions | Primary: Revoke sessions · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/users/{id}/revoke-sessions |
| Database entities | sessions, audit_events |
| Source files | users/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Revoke sessions…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Revoke sessions" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | User: signed out everywhere and sent to AUTH-09. |
| Behaviour | — |
| Related screens | ADM-08 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required)

### ADM-10 · Catalogue moderation overview

| Item | Specification |
|---|---|
| Screen ID | ADM-10 |
| Screen name | Catalogue moderation overview |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Moderation health: pending count, oldest pending, flags. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: KPI tiles, links. |
| 5. Components | KPI tiles, links |
| 6. Displayed data | Counts by state, oldest pending age, restricted-term flags. |
| 7. Buttons and actions | Primary: Open queue · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/overview |
| Database entities | product_versions |
| Source files | apps/web/src/app/[locale]/admin/catalog/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-11 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-11 · Moderation queue

| Item | Specification |
|---|---|
| Screen ID | ADM-11 |
| Screen name | Moderation queue |
| Experience | Platform administrators |
| User roles | COMPLIANCE (decide); SUPPORT, SUPER_ADMIN (read) |
| Route / URL | `/{locale}/admin/catalog (queue section)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Pending submissions, oldest first. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read; decisions admin.catalog.review |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, state filter, table, flags badge, empty ("queue empty"). |
| 5. Components | Search, state filter, table, flags badge, empty ("queue empty") |
| 6. Displayed data | Title, seller, category, new listing or update, flags, submitted. |
| 7. Buttons and actions | Primary: Review · Secondary: Search; filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State · Oldest pending first · Title |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/queue |
| Database entities | product_versions |
| Source files | catalog/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No moderation queue yet." with a one-line explanation and the action "Review". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-12 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-12 · Listing version review (diff)

| Item | Specification |
|---|---|
| Screen ID | ADM-12 |
| Screen name | Listing version review (diff) |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/catalog/reviews/[versionId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Compare the submitted version with the live version and decide. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.review |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Diff view, media grid, flags list, decision panel. |
| 5. Components | Diff view, media grid, flags list, decision panel |
| 6. Displayed data | Field-by-field diff, media, SKUs, restricted-term hits, seller info, history. |
| 7. Buttons and actions | Primary: Approve · Secondary: Request changes; Reject |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/reviews/{versionId}; GET /admin/media/{id} |
| Database entities | product_versions, product_media |
| Source files | apps/web/src/app/[locale]/admin/catalog/reviews/[versionId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-13); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-13 Review decision dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: decision and reason on SEL-08/SEL-14. |
| Behaviour | — |
| Related screens | ADM-13, SEL-12 |
| Dependencies and decisions | A10 |

Form fields:

  - None

### ADM-13 · Review decision dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-13 |
| Screen name | Review decision dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-12` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Record the moderation decision. |
| 2. Navigation location | Opened from ADM-12 Listing version review (diff) |
| 3. User permissions | admin.catalog.review |
| 4. Screen layout | Dialog over ADM-12 Listing version review (diff): title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | Reason required for reject/changes. |
| 7. Buttons and actions | Primary: Record decision · Secondary: Cancel |
| 8. Form fields | Required: Decision · Optional: Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/catalog/reviews/{versionId}/decision |
| Database entities | product_versions, products, notifications |
| Source files | catalog/reviews/[versionId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Record decision…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Record decision" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: listing approved (visible on PUB-07) or changes requested with reason on SEL-08. |
| Behaviour | — |
| Related screens | ADM-12 |
| Dependencies and decisions | — |

Form fields:

  - Decision (radio, Required): APPROVE, CHANGES_REQUESTED, REJECT
  - Reason (textarea, Optional): required unless approve

### ADM-14 · All listings

| Item | Specification |
|---|---|
| Screen ID | ADM-14 |
| Screen name | All listings |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/products` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Search every listing. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, filters, table. |
| 5. Components | Search, filters, table |
| 6. Displayed data | Title, seller, status, category, updated. |
| 7. Buttons and actions | Primary: Open listing · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Status, category · — · Title |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/products |
| Database entities | products |
| Source files | apps/web/src/app/[locale]/admin/catalog/products/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No all listings yet." with a one-line explanation and the action "Open listing". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-15 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-15 · Listing detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-15 |
| Screen name | Listing detail (admin) |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/products/[id]` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Inspect a listing and enforce. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read; enforce admin.catalog.enforce |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Detail view, history timeline, action bar. |
| 5. Components | Detail view, history timeline, action bar |
| 6. Displayed data | Live version, SKUs, history, status reason. |
| 7. Buttons and actions | Primary: Suspend / Restore / Remove · Secondary: Open seller |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/catalog/products/{id} |
| Database entities | products, product_versions |
| Source files | apps/web/src/app/[locale]/admin/catalog/products/[id]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-16); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-16 Listing enforcement dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-16 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-16 · Listing enforcement dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-16 |
| Screen name | Listing enforcement dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-15` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Suspend, restore or remove (irreversible for the seller). |
| 2. Navigation location | Opened from ADM-15 Listing detail (admin) |
| 3. User permissions | admin.catalog.enforce |
| 4. Screen layout | Dialog over ADM-15 Listing detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Destructive dialog (3 variants). |
| 5. Components | Destructive dialog (3 variants) |
| 6. Displayed data | Consequence per action. |
| 7. Buttons and actions | Primary: Confirm · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/catalog/products/{id}/suspend\|restore\|remove |
| Database entities | products, audit_events |
| Source files | catalog/products/[id]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Confirm…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Confirm" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: listing paused or removed with reason on SEL-06/SEL-08; Business buyer: listing disappears from search. |
| Behaviour | — |
| Related screens | ADM-15 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required)

### ADM-17 · Storefront oversight

| Item | Specification |
|---|---|
| Screen ID | ADM-17 |
| Screen name | Storefront oversight |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/storefronts` |
| Implementation status | Implemented · P1 |
| 1. Purpose | See all storefronts and hide/restore. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read; enforce admin.catalog.enforce |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Search, filter, table, row actions. |
| 5. Components | Search, filter, table, row actions |
| 6. Displayed data | Company, business type, public/not public, hidden, listing count, updated. |
| 7. Buttons and actions | Primary: Hide / Restore · Secondary: Search; filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Visibility · — · Company |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/storefronts |
| Database entities | storefronts |
| Source files | apps/web/src/app/[locale]/admin/catalog/storefronts/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No storefront oversight yet." with a one-line explanation and the action "Hide / Restore". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-19); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-19 Hide or restore storefront dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-18, ADM-19 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-18 · Storefront detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-18 |
| Screen name | Storefront detail (admin) |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/storefronts/[id] (proposed)` |
| Implementation status | Planned · P2 |
| 1. Purpose | API exists (GET /admin/storefronts/{id}) but there is no page; admins act from the list. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Detail view. |
| 5. Components | Detail view |
| 6. Displayed data | Full profile, media, listings, hide history. |
| 7. Buttons and actions | Primary: Hide / Restore · Secondary: Open company |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/storefronts/{id} |
| Database entities | storefronts, storefront_media |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-17 |
| Dependencies and decisions | Gap G-17 |

Form fields:

  - None

### ADM-19 · Hide or restore storefront dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-19 |
| Screen name | Hide or restore storefront dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-17` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Hide a storefront with reason. |
| 2. Navigation location | Opened from ADM-17 Storefront oversight |
| 3. User permissions | admin.catalog.enforce |
| 4. Screen layout | Dialog over ADM-17 Storefront oversight: title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | Reason shown to seller. |
| 7. Buttons and actions | Primary: Hide / Restore · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/storefronts/{id}/hide\|restore |
| Database entities | storefronts |
| Source files | catalog/storefronts/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Hide…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Hide / Restore" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: storefront hidden notice on SEL-02; Business buyer: PUB-10 unavailable. |
| Behaviour | — |
| Related screens | ADM-17 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required)

### ADM-20 · Categories

| Item | Specification |
|---|---|
| Screen ID | ADM-20 |
| Screen name | Categories |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN (manage); others read |
| Route / URL | `/{locale}/admin/catalog/categories` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Manage the category tree. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.catalog.read; manage admin.categories.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Tree table, create form. |
| 5. Components | Tree table, create form |
| 6. Displayed data | Tree with name EN/AR, restriction (Open/Review required/Blocked), visibility, position, product counts. |
| 7. Buttons and actions | Primary: Create category · Secondary: Open category |
| 8. Form fields | Required: Name EN, Name AR, Restriction · Optional: Parent (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST /admin/categories |
| Database entities | categories |
| Source files | apps/web/src/app/[locale]/admin/catalog/categories/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Create category…" and is disabled. |
| 12. Empty state | (suggested) "No categories yet." with a one-line explanation and the action "Create category". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-21 |
| Dependencies and decisions | A09 |

Form fields:

  - Name EN (text, Required)
  - Name AR (text, Required)
  - Parent (select, Optional)
  - Restriction (select, Required): OPEN, REVIEW_REQUIRED, BLOCKED

### ADM-21 · Category editor

| Item | Specification |
|---|---|
| Screen ID | ADM-21 |
| Screen name | Category editor |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/categories/[id]` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Edit category, image and attributes. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.categories.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Form, image upload, attributes table. |
| 5. Components | Form, image upload, attributes table |
| 6. Displayed data | Fields, image, supplier requirements, attributes list. |
| 7. Buttons and actions | Primary: Save · Secondary: Upload image; add attribute; hide; archive |
| 8. Form fields | Required: Name EN/AR · Optional: Description EN/AR, Requirements EN/AR, Restriction, Hidden / Archived, Image (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/PATCH /admin/categories/{id}; POST /image; POST /attributes |
| Database entities | categories, category_attributes |
| Source files | apps/web/src/app/[locale]/admin/catalog/categories/[id]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Save…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Uploads: "This file type is not accepted…" for type or size; "The malware scan blocked this file…" when blocked; Failed with Retry. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Opens: ADM-22 Category attribute editor. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-22 |
| Dependencies and decisions | — |

Form fields:

  - Name EN/AR (text, Required)
  - Description EN/AR (textarea, Optional)
  - Requirements EN/AR (textarea, Optional)
  - Restriction (select, Optional): reason required to change
  - Hidden / Archived (toggle, Optional): reason required
  - Image (file, Optional)

### ADM-22 · Category attribute editor

| Item | Specification |
|---|---|
| Screen ID | ADM-22 |
| Screen name | Category attribute editor |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `Dialog on ADM-21` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Define attributes sellers fill and buyers filter by. |
| 2. Navigation location | Opened from ADM-21 Category editor |
| 3. User permissions | admin.categories.manage |
| 4. Screen layout | Dialog over ADM-21 Category editor: title, context text, fields, footer with secondary action then primary action. Content: Dialog form. |
| 5. Components | Dialog form |
| 6. Displayed data | Key, labels, type, options, required, filterable. |
| 7. Buttons and actions | Primary: Save attribute · Secondary: Cancel |
| 8. Form fields | Required: Key, Label EN/AR, Type · Optional: Options, Required, Filterable (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/categories/{id}/attributes; PATCH /admin/category-attributes/{id} |
| Database entities | category_attributes |
| Source files | catalog/categories/[id]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Save attribute…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Save attribute" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-21 |
| Dependencies and decisions | — |

Form fields:

  - Key (text, Required)
  - Label EN/AR (text, Required)
  - Type (select, Required)
  - Options (list, Optional)
  - Required (checkbox, Optional)
  - Filterable (checkbox, Optional)

### ADM-23 · Restricted and prohibited terms

| Item | Specification |
|---|---|
| Screen ID | ADM-23 |
| Screen name | Restricted and prohibited terms |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/catalog/restricted` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Maintain screening terms (provisional policy A10). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.restricted.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Table, inline form. |
| 5. Components | Table, inline form |
| 6. Displayed data | Term, action (Block / Review), active. |
| 7. Buttons and actions | Primary: Add term · Secondary: Edit; deactivate |
| 8. Form fields | Required: Term, Action · Optional: Active (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST/PATCH /admin/restricted-terms |
| Database entities | restricted_terms |
| Source files | apps/web/src/app/[locale]/admin/catalog/restricted/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Add term…" and is disabled. |
| 12. Empty state | (suggested) "No restricted and prohibited terms yet." with a one-line explanation and the action "Add term". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: deactivate (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-12 |
| Dependencies and decisions | A10 |

Form fields:

  - Term (text, Required)
  - Action (select, Required): BLOCK (prohibited) or REVIEW (route to moderation)
  - Active (toggle, Optional)

### ADM-24 · Featured placements

| Item | Specification |
|---|---|
| Screen ID | ADM-24 |
| Screen name | Featured placements |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/catalog/featured` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Labelled featured slots (never used for ranking). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.featured.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Table, add form. |
| 5. Components | Table, add form |
| 6. Displayed data | Kind, target, position, starts, ends, scheduled/eligible state. |
| 7. Buttons and actions | Primary: Add featured · Secondary: Remove |
| 8. Form fields | Required: Kind, Target, Position · Optional: Starts, Ends, Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST/DELETE /admin/featured |
| Database entities | featured_listings |
| Source files | apps/web/src/app/[locale]/admin/catalog/featured/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Add featured…" and is disabled. |
| 12. Empty state | (suggested) "No featured placements yet." with a one-line explanation and the action "Add featured". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: remove (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | PUB-01 |
| Dependencies and decisions | — |

Form fields:

  - Kind (select, Required): PRODUCT, SUPPLIER
  - Target (select, Required): public targets only
  - Position (integer, Required)
  - Starts (datetime, Optional)
  - Ends (datetime, Optional)
  - Reason (text, Optional)

### ADM-25 · RFQ oversight

| Item | Specification |
|---|---|
| Screen ID | ADM-25 |
| Screen name | RFQ oversight |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/rfqs` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Metadata view of requests (no quote contents). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.rfqs.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table. |
| 5. Components | Filters, table |
| 6. Displayed data | Reference, buyer, category, state, visibility, quote count, hidden. |
| 7. Buttons and actions | Primary: Open · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State, hidden · — · Reference/title |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/rfqs |
| Database entities | rfqs |
| Source files | apps/web/src/app/[locale]/admin/rfqs/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No rfq oversight yet." with a one-line explanation and the action "Open". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-26 |
| Dependencies and decisions | P3-6 |

Form fields:

  - None

### ADM-26 · RFQ detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-26 |
| Screen name | RFQ detail (admin) |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPPORT, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/rfqs/[id]` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Inspect metadata and quote states; moderate abuse. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.rfqs.read; moderate admin.rfqs.moderate |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Detail, timeline, action. |
| 5. Components | Detail, timeline, action |
| 6. Displayed data | Metadata, quote states without contents, timeline. |
| 7. Buttons and actions | Primary: Hide / Unhide (COMPLIANCE) · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/rfqs/{id} |
| Database entities | rfqs, quotes |
| Source files | apps/web/src/app/[locale]/admin/rfqs/[id]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-27); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-27 Hide or unhide RFQ dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-27 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-27 · Hide or unhide RFQ dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-27 |
| Screen name | Hide or unhide RFQ dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `Dialog on ADM-26` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Hide an abusive request (sellers lose access). |
| 2. Navigation location | Opened from ADM-26 RFQ detail (admin) |
| 3. User permissions | admin.rfqs.moderate |
| 4. Screen layout | Dialog over ADM-26 RFQ detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | Reason; buyer sees hidden notice. |
| 7. Buttons and actions | Primary: Hide / Unhide · Secondary: Cancel |
| 8. Form fields | Required: Reason · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/rfqs/{id}/hide\|unhide |
| Database entities | rfqs, audit_events |
| Source files | rfqs/[id]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Hide…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Hide / Unhide" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: request shows hidden by the marketplace on BUY-05; Supplier: request removed from SEL-20. |
| Behaviour | — |
| Related screens | ADM-26 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Required)

### ADM-28 · Orders (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-28 |
| Screen name | Orders (admin) |
| Experience | Platform administrators |
| User roles | SUPPORT, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/orders` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Find any order. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.orders.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table. |
| 5. Components | Filters, table |
| 6. Displayed data | Number, buyer, seller, state, payment state, total, created. |
| 7. Buttons and actions | Primary: Open order · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State · — · Order number |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/orders |
| Database entities | orders |
| Source files | apps/web/src/app/[locale]/admin/orders/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No orders yet." with a one-line explanation and the action "Open order". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-29 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-29 · Order detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-29 |
| Screen name | Order detail (admin) |
| Experience | Platform administrators |
| User roles | SUPPORT, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/orders/[orderId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Full order record for support and finance. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.orders.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Detail sections, timeline. |
| 5. Components | Detail sections, timeline |
| 6. Displayed data | Parties, lines, totals, commission, payable, payments, shipment, settlement, refunds, disputes, timeline. Since PR #13/#14: verified delivery, dispute window, active holds, settlement state; invoice draft with commission draft. |
| 7. Buttons and actions | Primary: Request refund (FINANCE) · Secondary: Open dispute; open company |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/orders/{id} |
| Database entities | orders, payments, shipments, settlements, refunds |
| Source files | apps/web/src/app/[locale]/admin/orders/[orderId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | Confirm in a dialog before: refund (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer and supplier: see the effects of holds, refunds and dispute decisions on BUY-24 and SEL-28 (internal hold reasons are never shown). |
| Behaviour | — |
| Related screens | ADM-33, ADM-39 |
| Dependencies and decisions | Refund form takes raw order ID (G-16) |

Form fields:

  - None

### ADM-30 · Finance overview

| Item | Specification |
|---|---|
| Screen ID | ADM-30 |
| Screen name | Finance overview |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/finance` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Read-only ledger balances, payment attempts and reconciliation cases (sandbox). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.finance.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Ledger table, payments table, cases table, sandbox pill. |
| 5. Components | Ledger table, payments table, cases table, sandbox pill |
| 6. Displayed data | "Operational ledger for marketplace balances, not statutory accounting."; accounts (provider clearing, payable to suppliers, platform commission, unallocated receipts) with debits/credits; payment attempts; open reconciliation cases by kind (6 kinds). Since PR #13: "Resolve" on each open reconciliation case (ADM-31). |
| 7. Buttons and actions | Primary: — · Secondary: Load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/finance/summary, /payments, /reconciliation |
| Database entities | ledger_entries, payments, reconciliation_cases |
| Source files | apps/web/src/app/[locale]/admin/finance/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | Opens: ADM-31 Reconciliation case resolution. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-31, ADM-32, ADM-35 |
| Dependencies and decisions | Stale note finance.reconciliation_note (G-27) |

Form fields:

  - None

### ADM-31 · Reconciliation case resolution

| Item | Specification |
|---|---|
| Screen ID | ADM-31 |
| Screen name | Reconciliation case resolution |
| Experience | Platform administrators |
| User roles | FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-30` |
| Implementation status | Implemented · P0 |
| 1. Purpose | FINANCE_APPROVER resolves an open reconciliation case with a reason; orders it held are re-evaluated (P8-8, PR #13). |
| 2. Navigation location | Opened from ADM-30 Finance overview |
| 3. User permissions | admin.reconciliation.resolve (FINANCE_APPROVER) |
| 4. Screen layout | Dialog over ADM-30 Finance overview: title, context text, fields, footer with secondary action then primary action. Content: Detail, action dialog with dual control. |
| 5. Components | Detail, action dialog with dual control |
| 6. Displayed data | Case kind, provider reference, amounts, linked checkout/order, history, resolution options. |
| 7. Buttons and actions | Primary: Resolve · Secondary: Cancel |
| 8. Form fields | Required: How was it resolved? · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/finance/reconciliation/{id}/resolve |
| Database entities | reconciliation_cases, ledger_entries |
| Source files | apps/web/src/app/[locale]/admin/finance/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Resolve…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Resolve" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-30 |
| Dependencies and decisions | P8-8 |

Form fields:

  - How was it resolved? (textarea, Required): required, ≤ 1000

### ADM-32 · Refunds

| Item | Specification |
|---|---|
| Screen ID | ADM-32 |
| Screen name | Refunds |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/refunds` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Request, approve and track refunds (dual control). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.finance.read; request admin.refunds.request; approve admin.refunds.approve |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Request form, table, row actions, self-approval note, sandbox completion tool. |
| 5. Components | Request form, table, row actions, self-approval note, sandbox completion tool |
| 6. Displayed data | "Refunds go through the payment provider. A second finance user approves each request…"; number, order, amount, commission share, state (Awaiting approval, Approved, Rejected, Sent to provider, Refunded, Failed), requested by, decided by. |
| 7. Buttons and actions | Primary: Request a refund (FINANCE) · Secondary: Approve; Reject (FINANCE_APPROVER); simulate provider (sandbox) |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET/POST /admin/refunds; POST /approve, /reject; POST /admin/sandbox/operations/{ref}/complete |
| Database entities | refunds, ledger_entries |
| Source files | apps/web/src/app/[locale]/admin/refunds/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No refunds yet." with a one-line explanation and the action "Request a refund (FINANCE)". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-34); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-34 Approve or reject refund dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: refund in BUY-29 and BUY-24; Supplier: commission reversal and settlement on SEL-32. |
| Behaviour | — |
| Related screens | ADM-33, ADM-34 |
| Dependencies and decisions | Refund commission rule (founder: merchandise only) |

Form fields:

  - None

### ADM-33 · Request refund form

| Item | Specification |
|---|---|
| Screen ID | ADM-33 |
| Screen name | Request refund form |
| Experience | Platform administrators |
| User roles | FINANCE |
| Route / URL | `Form on ADM-32` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Request a refund up to the remaining refundable amount. Works, but takes a raw order ID; it should start from the order or dispute. |
| 2. Navigation location | Opened from ADM-32 Refunds |
| 3. User permissions | admin.refunds.request |
| 4. Screen layout | Block inside ADM-32 Refunds with its own heading and actions. Content: Form. |
| 5. Components | Form |
| 6. Displayed data | Order ID, amount, reason, dispute ID. Since PR #13: optional split "Which part of the order does this cover?" Merchandise / Delivery / VAT (AED); blank = pro rata; commission reversed on merchandise only. |
| 7. Buttons and actions | Primary: Request a refund · Secondary: Cancel |
| 8. Form fields | Required: Order ID, Amount (AED), Reason · Optional: Merchandise (AED), Delivery (AED), VAT (AED), Dispute ID (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | Amount ≤ refundable |
| 10. API dependencies | POST /admin/refunds |
| Database entities | refunds |
| Source files | refunds/page.tsx |
| 11. Loading state | Skeleton block of the final size inside the host page; the rest of the page stays usable; `aria-busy` on the block. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: Amount ≤ refundable |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: refund (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Inline form. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-32, ADM-29, ADM-39 |
| Dependencies and decisions | Gap G-16 |

Form fields:

  - Order ID (uuid, Required)
  - Amount (AED) (money, Required): ≤ remaining capture
  - Merchandise (AED) (money, Optional): parts must add up
  - Delivery (AED) (money, Optional)
  - VAT (AED) (money, Optional)
  - Dispute ID (uuid, Optional): optional
  - Reason (textarea, Required)

### ADM-34 · Approve or reject refund dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-34 |
| Screen name | Approve or reject refund dialog |
| Experience | Platform administrators |
| User roles | FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-32` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Second-person decision. |
| 2. Navigation location | Opened from ADM-32 Refunds |
| 3. User permissions | admin.refunds.approve; not the requester |
| 4. Screen layout | Dialog over ADM-32 Refunds: title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | "Approve refund {number}?"; "You requested this; another finance user must decide." |
| 7. Buttons and actions | Primary: Approve / Reject · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Reason for the decision (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/refunds/{id}/approve\|reject |
| Database entities | refunds |
| Source files | refunds/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Approve…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Approve / Reject" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: refund status on BUY-24/BUY-29; Supplier: SEL-28/SEL-32 updated; requester cannot approve their own request (FD-01). |
| Behaviour | — |
| Related screens | ADM-32 |
| Dependencies and decisions | "Two finance approvers" ambiguity |

Form fields:

  - Reason for the decision (textarea, Optional): required to reject

### ADM-35 · Payouts

| Item | Specification |
|---|---|
| Screen ID | ADM-35 |
| Screen name | Payouts |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/payouts` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Pay eligible, undisputed, completed orders to sellers (dual control, sandbox). |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.finance.read; request/approve capabilities |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Eligible table, payouts table, row actions, sandbox completion. |
| 5. Components | Eligible table, payouts table, row actions, sandbox completion |
| 6. Displayed data | Eligible suppliers with order count and amount; payouts list with state (Awaiting approval, Approved, Rejected, Sent to provider, Paid by provider, Failed), paid at. Since PR #13: "This week's payout run" (week of {start} to {end}, Dubai), payouts and amount requested this week, available provider balance ("SANDBOX: worked out from the ledger…"). FD-04: the run is created on Monday 10:00 Dubai, next working day on UAE public holidays; the scheduler only creates requests, finance approval is never bypassed. |
| 7. Buttons and actions | Primary: Request payout (FINANCE) · Secondary: Approve; Reject (FINANCE_APPROVER) |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/payouts/eligible; GET/POST /admin/payouts; POST /approve, /reject |
| Database entities | payouts, settlements |
| Source files | apps/web/src/app/[locale]/admin/payouts/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No payouts yet." with a one-line explanation and the action "Request payout (FINANCE)". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Each action confirms on its own screen (ADM-36, ADM-37); afterwards this page reloads from the server and shows the new state and timeline event. |
| 15. Confirmation dialogs | Opens: ADM-36 Request payout dialog; ADM-37 Approve or reject payout dialog. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: payout status and dates on SEL-32. |
| Behaviour | — |
| Related screens | ADM-36, ADM-37, SEL-32 |
| Dependencies and decisions | P8-5 weekly payout run (PR #13); FD-01 and FD-04 answered; earlier conflict P5-5 resolved |

Form fields:

  - None

### ADM-36 · Request payout dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-36 |
| Screen name | Request payout dialog |
| Experience | Platform administrators |
| User roles | FINANCE |
| Route / URL | `Dialog on ADM-35` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Request payout of all eligible orders for one seller. |
| 2. Navigation location | Opened from ADM-35 Payouts |
| 3. User permissions | admin.payouts.request |
| 4. Screen layout | Dialog over ADM-35 Payouts: title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | "Request a payout to {company}?" with amount and orders. |
| 7. Buttons and actions | Primary: Request payout · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/payouts |
| Database entities | payouts |
| Source files | payouts/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Request payout…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Request payout" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-35 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-37 · Approve or reject payout dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-37 |
| Screen name | Approve or reject payout dialog |
| Experience | Platform administrators |
| User roles | FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-35` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Second-person decision. |
| 2. Navigation location | Opened from ADM-35 Payouts |
| 3. User permissions | admin.payouts.approve; not the requester |
| 4. Screen layout | Dialog over ADM-35 Payouts: title, context text, fields, footer with secondary action then primary action. Content: Dialog. |
| 5. Components | Dialog |
| 6. Displayed data | "Approve payout {number}?" Approval re-checks orders and balance: errors "An order in this payout is on hold…", "…changed after it was requested", "The available provider balance is lower than this payout." FD-01: requester and approver are two different finance users. |
| 7. Buttons and actions | Primary: Approve / Reject · Secondary: Cancel |
| 8. Form fields | Required: — · Optional: Reason (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/payouts/{id}/approve\|reject |
| Database entities | payouts |
| Source files | payouts/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Approve…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Approve / Reject" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: payout marked approved or rejected on SEL-32; requester cannot approve (FD-01). |
| Behaviour | — |
| Related screens | ADM-35 |
| Dependencies and decisions | — |

Form fields:

  - Reason (textarea, Optional): required to reject

### ADM-38 · Disputes queue

| Item | Specification |
|---|---|
| Screen ID | ADM-38 |
| Screen name | Disputes queue |
| Experience | Platform administrators |
| User roles | SUPPORT (manage); FINANCE roles (read) |
| Route / URL | `/{locale}/admin/disputes` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Triage disputes. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.disputes.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters (All states, Assigned to me), table. |
| 5. Components | Filters (All states, Assigned to me), table |
| 6. Displayed data | Number, order, type, state, assigned/unassigned, opened. |
| 7. Buttons and actions | Primary: Open · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State, assigned to me · Oldest open · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/disputes |
| Database entities | disputes |
| Source files | apps/web/src/app/[locale]/admin/disputes/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No disputes queue yet." with a one-line explanation and the action "Open". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-39 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-39 · Dispute detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-39 |
| Screen name | Dispute detail (admin) |
| Experience | Platform administrators |
| User roles | SUPPORT (manage); FINANCE roles (read) |
| Route / URL | `/{locale}/admin/disputes/[disputeId]` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Review evidence, message both parties and propose an outcome. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.disputes.read; actions admin.disputes.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Thread, evidence list, action bar. |
| 5. Components | Thread, evidence list, action bar |
| 6. Displayed data | "Support reviews evidence and proposes an outcome. Refunds go to finance for dual approval…"; parties, order, messages/evidence, proposal, refunds. |
| 7. Buttons and actions | Primary: Assign to me · Secondary: Request evidence; Propose resolution; Close dispute; Message both parties |
| 8. Form fields | Required: — · Optional: Note to both parties (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/disputes/{id}; POST /assign, /request-evidence, /propose, /close, /messages |
| Database entities | disputes, dispute_messages |
| Source files | apps/web/src/app/[locale]/admin/disputes/[disputeId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Assign to me…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Opens: ADM-40 Dispute action dialogs. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer and supplier: decision and reason on SHR-02, order and settlement updated on BUY-24/SEL-28. |
| Behaviour | — |
| Related screens | ADM-40, ADM-32 |
| Dependencies and decisions | — |

Form fields:

  - Note to both parties (textarea, Optional)

### ADM-40 · Dispute action dialogs

| Item | Specification |
|---|---|
| Screen ID | ADM-40 |
| Screen name | Dispute action dialogs |
| Experience | Platform administrators |
| User roles | SUPPORT |
| Route / URL | `Dialogs on ADM-39` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Request evidence (from Under review or Resolution proposed), propose a resolution (No financial action / Refund + amount, from Under review or Awaiting evidence) or close a dispute whose proposal is No financial action. One component, three variations. |
| 2. Navigation location | Opened from ADM-39 Dispute detail (admin) |
| 3. User permissions | admin.disputes.manage |
| 4. Screen layout | Dialog over ADM-39 Dispute detail (admin): title, context text, fields, footer with secondary action then primary action. Content: Dialog (3 variants). |
| 5. Components | Dialog (3 variants) |
| 6. Displayed data | "Amount in AED, for example 125.50"; "Finance creates the refund from the Refunds page". |
| 7. Buttons and actions | Primary: Send / Propose / Close dispute · Secondary: Cancel |
| 8. Form fields | Required: Proposal, Note · Optional: Amount (AED) (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/disputes/{id}/request-evidence\|propose\|close |
| Database entities | disputes |
| Source files | disputes/[disputeId]/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Send…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Send / Propose / Close dispute" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet. |
| 17. Desktop layout (1440px) | Modal. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer and supplier: notified of each action on SHR-02. |
| Behaviour | — |
| Related screens | ADM-39 |
| Dependencies and decisions | — |

Form fields:

  - Proposal (radio, Required): NO_ACTION, REFUND
  - Amount (AED) (money, Optional): required for REFUND
  - Note (textarea, Required)

### ADM-59 · Delivery proof review

| Item | Specification |
|---|---|
| Screen ID | ADM-59 |
| Screen name | Delivery proof review |
| Experience | Platform administrators |
| User roles | SUPPORT, COMPLIANCE (proposed capability admin.delivery.review) |
| Route / URL | `/{locale}/admin/deliveries (proposed)` |
| Implementation status | Planned · P1 |
| 1. Purpose | FD-03 (answer A): supplier-uploaded delivery evidence is validated, with a review mechanism for contested or suspicious delivery claims. |
| 2. Navigation location | Admin nav → Deliveries |
| 3. User permissions | Proposed new capability; decisions audited. |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Queue table, detail with file preview, decision dialog. |
| 5. Components | Queue table, detail with file preview, decision dialog |
| 6. Displayed data | Queue of deliveries flagged by the buyer ("I did not receive this"), by rules (proof uploaded long after dispatch, file reused, mismatch with tracking) or by support; proof file preview (scanned), dispatch and tracking data, buyer statement, timeline; decision: Accept proof / Reject proof (window does not start from it) / Ask for more evidence. |
| 7. Buttons and actions | Primary: Record decision · Secondary: Ask supplier for evidence; Open dispute view |
| 8. Form fields | Required: Decision, Reason · Optional: — (details below) |
| Filters · sorting · search | Flag source; age · Oldest first · — |
| 9. Validation rules | — |
| 10. API dependencies | New: GET /admin/deliveries; POST /admin/deliveries/{orderId}/decision |
| Database entities | orders (delivery_verified_at, source), shipments, delivery_reviews (new), audit_events |
| Source files | Not built yet |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Record decision…" and is disabled. |
| 12. Empty state | "No delivery claims need review." |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | "Decision recorded." Buyer and supplier notified; the dispute window recalculates if proof was rejected. |
| 15. Confirmation dialogs | Reject asks: "The dispute window will no longer start from this proof. The supplier and buyer will be told." |
| 16. Mobile layout (360px) | Admin is desktop-first; at 360px tables become stacked cards, filters move to a sheet, actions to a sticky bar. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: asked for more evidence on SEL-28; Buyer: told the outcome on BUY-24. |
| Behaviour | Rejecting proof clears delivery verification from proof; the window then starts at buyer receipt or accepted new proof. Buyer and supplier notified. |
| Related screens | SEL-30, BUY-24, ADM-29, ADM-39 |
| Dependencies and decisions | FD-03 answered (A) |

Form fields:

  - Decision (radio, Required): ACCEPT, REJECT, MORE_EVIDENCE
  - Reason (textarea, Required)

### ADM-41 · Supplier reviews moderation

| Item | Specification |
|---|---|
| Screen ID | ADM-41 |
| Screen name | Supplier reviews moderation |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/supplier-reviews` |
| Implementation status | Implemented · P2 |
| 1. Purpose | Hide or republish reviews; text is never edited. Admin sees buyer identity. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.reviews.moderate |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Table, actions, reason dialog. |
| 5. Components | Table, actions, reason dialog |
| 6. Displayed data | Supplier, rating, comment, buyer company (admin only), order, state. Public label "Verified business buyer" (FD-15); admins see the buyer company. |
| 7. Buttons and actions | Primary: Hide · Secondary: Publish again |
| 8. Form fields | Required: Reason (recorded in the audit log) · Optional: — (details below) |
| Filters · sorting · search | State · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/reviews; POST /hide, /unhide |
| Database entities | reviews |
| Source files | apps/web/src/app/[locale]/admin/supplier-reviews/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Hide…" and is disabled. |
| 12. Empty state | (suggested) "No supplier reviews moderation yet." with a one-line explanation and the action "Hide". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: publish (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: hidden review notice; Supplier: storefront rating updated (PUB-10). |
| Behaviour | — |
| Related screens | BUY-26, PUB-10 |
| Dependencies and decisions | — |

Form fields:

  - Reason (recorded in the audit log) (textarea, Required)

### ADM-42 · Support queue

| Item | Specification |
|---|---|
| Screen ID | ADM-42 |
| Screen name | Support queue |
| Experience | Platform administrators |
| User roles | SUPPORT |
| Route / URL | `/{locale}/admin/support` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Customer tickets from all workspaces. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.support.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table. |
| 5. Components | Filters, table |
| 6. Displayed data | Subject, workspace, topic, state (Waiting for customer etc.), assignee, updated. Since PR #16: urgent categories Payment, Security and Compliance are always accepted; 10 open tickets per company by default; resolved tickets close automatically after 7 days. |
| 7. Buttons and actions | Primary: Open · Secondary: Filter |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | State, assigned · Oldest open · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/support |
| Database entities | support_tickets |
| Source files | apps/web/src/app/[locale]/admin/support/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No support queue yet." with a one-line explanation and the action "Open". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-43 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-43 · Ticket detail (admin)

| Item | Specification |
|---|---|
| Screen ID | ADM-43 |
| Screen name | Ticket detail (admin) |
| Experience | Platform administrators |
| User roles | SUPPORT |
| Route / URL | `/{locale}/admin/support/[ticketId]` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Take, reply, resolve or reopen. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.support.read; actions admin.support.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Thread, composer, action bar. |
| 5. Components | Thread, composer, action bar |
| 6. Displayed data | Messages, limited order details only, linked records. |
| 7. Buttons and actions | Primary: Take ticket · Secondary: Reply; Resolve; Reopen |
| 8. Form fields | Required: Reply · Optional: Resolution note (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/support/{id}; POST /assign, /messages, /resolve, /reopen |
| Database entities | support_tickets, support_messages |
| Source files | apps/web/src/app/[locale]/admin/support/[ticketId]/page.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Take ticket…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: resolve (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Ticket owner: replies and status on SHR-05. |
| Behaviour | — |
| Related screens | ADM-42, SHR-05 |
| Dependencies and decisions | — |

Form fields:

  - Reply (textarea, Required): ≤4000
  - Resolution note (textarea, Optional)

### ADM-44 · Reports (scoped CSV exports)

| Item | Specification |
|---|---|
| Screen ID | ADM-44 |
| Screen name | Reports (scoped CSV exports) |
| Experience | Platform administrators |
| User roles | SUPPORT, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/reports` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Create audited CSV exports with reason and TOTP step-up; downloads expire after 24 hours. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.reports.export; scope by role (P6-4) |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Form, TOTP input, exports table. |
| 5. Components | Form, TOTP input, exports table |
| 6. Displayed data | "Each export needs a reason and a current authenticator code, is recorded in the audit log and can be downloaded only by you for 24 hours."; own exports with report, period, rows, available until, downloaded, state (Ready, Expired). |
| 7. Buttons and actions | Primary: Create export · Secondary: Download |
| 8. Form fields | Required: Report, Scope, From (Dubai date), To (Dubai date), Reason, Authenticator code · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | ≤50k rows; TOTP valid |
| 10. API dependencies | GET/POST /admin/exports; GET /admin/exports/{id}/download |
| Database entities | exports, audit_events |
| Source files | apps/web/src/app/[locale]/admin/reports/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Create export…" and is disabled. |
| 12. Empty state | (suggested) "No reports yet." with a one-line explanation and the action "Create export". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: ≤50k rows; TOTP valid |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Confirm in a dialog before: export (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-45 |
| Dependencies and decisions | Founder: compliance may export verification records (P6-4 conflict) |

Form fields:

  - Report (select, Required): orders, refunds, payouts, disputes, support_tickets (scoped by role)
  - Scope (radio, Required): assigned (Assigned to me) or all (All records); support only assigned
  - From (Dubai date) (date, Required)
  - To (Dubai date) (date, Required): ≤366 days
  - Reason (textarea, Required): 1–500
  - Authenticator code (otp, Required): 6 digits

### ADM-45 · Audit log

| Item | Specification |
|---|---|
| Screen ID | ADM-45 |
| Screen name | Audit log |
| Experience | Platform administrators |
| User roles | COMPLIANCE, SUPER_ADMIN |
| Route / URL | `/{locale}/admin/audit` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Append-only audit trail. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.audit.read |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Filters, table, pagination. |
| 5. Components | Filters, table, pagination |
| 6. Displayed data | Time, actor, action, resource, resource ID, reason, request ID. |
| 7. Buttons and actions | Primary: — · Secondary: Filter; load more |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Actor, action, resource, period · Newest · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/audit |
| Database entities | audit_events |
| Source files | apps/web/src/app/[locale]/admin/audit/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. |
| 12. Empty state | (suggested) "No audit log yet." with a one-line explanation. Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | — |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-46 · Staff and roles

| Item | Specification |
|---|---|
| Screen ID | ADM-46 |
| Screen name | Staff and roles |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN |
| Route / URL | `/{locale}/admin/staff` |
| Implementation status | Implemented · P1 |
| 1. Purpose | Assign staff roles (last super-admin protected). Staff accounts are provisioned by script, not registration. |
| 2. Navigation location | Admin nav |
| 3. User permissions | admin.staff.manage |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Table, role editor dialog. |
| 5. Components | Table, role editor dialog |
| 6. Displayed data | Email, roles, MFA enabled, status. |
| 7. Buttons and actions | Primary: Edit roles · Secondary: — |
| 8. Form fields | Required: Reason · Optional: Roles (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /admin/staff; POST /admin/staff/{id}/roles |
| Database entities | admin_users, admin_roles |
| Source files | apps/web/src/app/[locale]/admin/staff/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Edit roles…" and is disabled. |
| 12. Empty state | (suggested) "No staff and roles yet." with a one-line explanation and the action "Edit roles". Filtered empty: "Nothing matches these filters." with Clear filters. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | — |
| Dependencies and decisions | D03 |

Form fields:

  - Roles (checkboxes, Optional): COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN
  - Reason (textarea, Required)

### ADM-47 · Platform settings: payout schedule and policy windows

| Item | Specification |
|---|---|
| Screen ID | ADM-47 |
| Screen name | Platform settings: payout schedule and policy windows |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN or finance approver (to be decided) |
| Route / URL | `/{locale}/admin/settings (proposed)` |
| Implementation status | Planned · P1 |
| 1. Purpose | FD-04: configurable payout schedule (default Monday 10:00 Dubai, next working day after UAE public holidays, no minimum at launch subject to provider limits) and the policy windows (dispute window 14 days, auto-close 7 days). Commission moved to ADM-56 (built). |
| 2. Navigation location | Admin nav |
| 3. User permissions | New restricted capability with dual control |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Settings form with effective-from, change log, dual-control confirmation. |
| 5. Components | Settings form with effective-from, change log, dual-control confirmation |
| 6. Displayed data | Payout day and time (Dubai), UAE public holiday calendar (dates entered by finance), minimum payout (0 at launch), dispute window days, ticket auto-close days; change history with actor and reason. |
| 7. Buttons and actions | Primary: Schedule change · Secondary: View history |
| 8. Form fields | Required: Payout day, Payout time (Dubai), Reason for change, Authenticator code · Optional: Public holidays, Minimum payout (AED) (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | New platform_settings with history; orders.commission snapshot |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. On submit the button reads "Schedule change…" and is disabled. |
| 12. Empty state | Not applicable: the form starts blank with defaults or prefilled from the saved record. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | Save asks for TOTP: "Payout runs will be created on {day} at {time} (Dubai). Finance approval is still needed for each payout." |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: next payout date shown on SEL-32. |
| Behaviour | — |
| Related screens | SEL-28, ADM-30 |
| Dependencies and decisions | FD-04 answered; P8-5 |

Form fields:

  - Payout day (select, Required): Monday–Sunday (default Monday)
  - Payout time (Dubai) (time, Required): default 10:00
  - Public holidays (date list, Optional): UAE public holidays entered by finance
  - Minimum payout (AED) (money, Optional): default 0
  - Reason for change (textarea, Required)
  - Authenticator code (totp, Required): step-up

### ADM-56 · Commission policy

| Item | Specification |
|---|---|
| Screen ID | ADM-56 |
| Screen name | Commission policy |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER (view); FINANCE_APPROVER (change) |
| Route / URL | `/{locale}/admin/commission` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Versioned commission rate on merchandise value (excluding VAT and delivery). Only a finance approver records a new version, with reason and TOTP (P8-6, PR #13). FD-05 adds 30 days' advance supplier notice (planned). |
| 2. Navigation location | Admin nav → Commission |
| 3. User permissions | View: FINANCE, FINANCE_APPROVER; change: admin.commission.manage (FINANCE_APPROVER) with TOTP step-up and reason. |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Summary card, form, history table. |
| 5. Components | Summary card, form, history table |
| 6. Displayed data | Current rate and source ("Policy version {version}" or "From configuration…"); history (version, rate, reason, actor, date); "Only a finance approver can change the rate."; planned: effective date at least 30 days ahead and supplier notice status. |
| 7. Buttons and actions | Primary: Save new rate · Secondary: — |
| 8. Form fields | Required: Rate (%), Reason for the change, Authenticator code · Optional: Effective from (planned) (details below) |
| Filters · sorting · search | — · Version descending · — |
| 9. Validation rules | Rate bounds; TOTP valid; reason required. |
| 10. API dependencies | GET/POST /admin/finance/commission |
| Database entities | commission_policies (append-only), checkouts, orders |
| Source files | apps/web/src/app/[locale]/admin/commission/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Save new rate…" and is disabled. |
| 12. Empty state | No versions yet: "From configuration: 10%" with "No commission versions recorded yet." |
| 13. Error states | "Only a finance approver can change the rate." / "The authenticator code is not valid." / rate outside 0–50%. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "New commission rate saved. It applies to new checkouts.". |
| 15. Confirmation dialogs | Save asks for TOTP and shows "New checkouts will use {rate}%. Existing orders keep their rate." Planned: "Suppliers will be notified 30 days before {date}." |
| 16. Mobile layout (360px) | Admin is desktop-first; at 360px tables become stacked cards, filters move to a sheet, actions to a sticky bar. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: commission rate and version on invoice drafts and payouts (SEL-28, SEL-32); planned 30-day notice in-app and by email. |
| Behaviour | "New commission rate saved. It applies to new checkouts."; existing orders keep their snapshot; planned: suppliers notified 30 days before the effective date. |
| Related screens | ADM-30, SEL-32, BUY-37 |
| Dependencies and decisions | FD-05 answered (A); P8-6 |

Form fields:

  - Rate (%) (decimal, Required): > 0 and ≤ 50, e.g. 10 or 7.5
  - Reason for the change (textarea, Required)
  - Authenticator code (totp, Required): 6 digits
  - Effective from (planned) (date, Optional): ≥ today + 30 days (FD-05)

### ADM-57 · Settlement holds

| Item | Specification |
|---|---|
| Screen ID | ADM-57 |
| Screen name | Settlement holds |
| Experience | Platform administrators |
| User roles | COMPLIANCE, FINANCE, FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/holds` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Place and release holds that stop an order's supplier payout: Compliance, Fraud, Reconciliation, Payment investigation (P8-4, PR #13). |
| 2. Navigation location | Admin nav → Settlement holds |
| 3. User permissions | admin.holds.manage (COMPLIANCE, FINANCE, FINANCE_APPROVER). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Form, filter tabs, table, release dialog (ADM-58). |
| 5. Components | Form, filter tabs, table, release dialog (ADM-58) |
| 6. Displayed data | Intro text; place-hold form; list with order, type, reason, placed by, released by, dates; filter Active / Released; empty "No holds." |
| 7. Buttons and actions | Primary: Place a hold · Secondary: Release |
| 8. Form fields | Required: Order ID, Type, Reason · Optional: — (details below) |
| Filters · sorting · search | Active / Released · Newest first · — |
| 9. Validation rules | One active hold per kind per order. |
| 10. API dependencies | GET/POST /admin/holds |
| Database entities | order_holds (never deleted), audit_events |
| Source files | apps/web/src/app/[locale]/admin/holds/page.tsx |
| 11. Loading state | Skeleton rows or cards matching the final layout; header and filters render first; `aria-busy` on the results region; no spinner-only page. On submit the button reads "Place a hold…" and is disabled. |
| 12. Empty state | (existing) "No holds." Action: Place a hold. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: One active hold per kind per order. |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Copy: "Hold placed. The order cannot be paid out until it is released." / "already been paid out" / "already has an active hold of that type". |
| 15. Confirmation dialogs | Place a hold: inline confirm "Place a {type} hold on {order}? Its payout stops until released." Release: ADM-58. |
| 16. Mobile layout (360px) | Admin is desktop-first; at 360px tables become stacked cards, filters move to a sheet, actions to a sticky bar. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Table columns flip (first column on the right, actions column on the left); filter sheet opens from the right edge on mobile. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: settlement shows "Held" on SEL-28 and SEL-32 without the internal reason; Buyer: nothing changes. |
| Behaviour | "Hold placed. The order cannot be paid out until it is released."; errors "already been paid out", "already has an active hold of that type". |
| Related screens | ADM-29, ADM-35, ADM-58 |
| Dependencies and decisions | P8-4 |

Form fields:

  - Order ID (uuid, Required)
  - Type (select, Required): COMPLIANCE, FRAUD, RECONCILIATION, PAYMENT_INVESTIGATION
  - Reason (textarea, Required)

### ADM-58 · Release hold dialog

| Item | Specification |
|---|---|
| Screen ID | ADM-58 |
| Screen name | Release hold dialog |
| Experience | Platform administrators |
| User roles | COMPLIANCE, FINANCE, FINANCE_APPROVER |
| Route / URL | `Dialog on ADM-57` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Release a hold with a reason. |
| 2. Navigation location | Opened from ADM-57 Settlement holds |
| 3. User permissions | COMPLIANCE, FINANCE, FINANCE_APPROVER |
| 4. Screen layout | Dialog over ADM-57 Settlement holds: title, context text, fields, footer with secondary action then primary action. Content: Dialog with textarea. |
| 5. Components | Dialog with textarea |
| 6. Displayed data | "Release the hold on {number}?" |
| 7. Buttons and actions | Primary: Release · Secondary: Cancel |
| 8. Form fields | Required: Reason for releasing · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | "This hold has already been released." |
| 10. API dependencies | POST /admin/holds/{id}/release |
| Database entities | order_holds |
| Source files | apps/web/src/app/[locale]/admin/holds/page.tsx |
| 11. Loading state | Opens with data already loaded on the host. On submit the primary button reads "Release…", is disabled to prevent double submission and inputs are locked; Escape is ignored while saving. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | Submit failure: "Check the highlighted fields." with inline messages, first invalid field focused, inputs kept. Stale record: "This record changed since you opened it. Reload and try again." Rules enforced by the server: "This hold has already been released." |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Dialog closes, focus returns to the trigger and the host refreshes to the new state. |
| 15. Confirmation dialogs | This screen is the confirmation step ("Release" / "Cancel"). Consequence stated in plain words; destructive or irreversible actions styled as danger; initial focus on the safe option. |
| 16. Mobile layout (360px) | Bottom sheet with sticky action row; primary action last in reading order; 44px targets. |
| 17. Desktop layout (1440px) | Centred modal (≈480px), focus trapped, Escape and Cancel close, destructive action styled as danger. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. Labels, helper text and errors right-aligned; email, TRN, phone, IBAN, URLs and codes keep LTR input direction. Footer order mirrors (primary action on the left). AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Supplier: settlement returns from "Held" to its normal state on SEL-28/SEL-32. |
| Behaviour | Order is re-evaluated for payout eligibility. |
| Related screens | ADM-57 |
| Dependencies and decisions | P8-4 |

Form fields:

  - Reason for releasing (textarea, Required)

### ADM-48 · Logistics and delivery settings

| Item | Specification |
|---|---|
| Screen ID | ADM-48 |
| Screen name | Logistics and delivery settings |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN |
| Route / URL | `/{locale}/admin/logistics (proposed)` |
| Implementation status | Planned · P2 |
| 1. Purpose | Founder: supplier-arranged, courier, collection, per-order charges, proof of delivery. Nothing platform-side exists beyond seller delivery terms. |
| 2. Navigation location | Admin nav |
| 3. User permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Settings form. |
| 5. Components | Settings form |
| 6. Displayed data | Delivery methods, courier partners (future), proof requirements. |
| 7. Buttons and actions | Primary: Save · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Manufacturers and supplier: SEL-04 Delivery terms |
| Behaviour | — |
| Related screens | SEL-04 |
| Dependencies and decisions | Logistics decision |

Form fields:

  - None

### ADM-49 · System health and webhooks

| Item | Specification |
|---|---|
| Screen ID | ADM-49 |
| Screen name | System health and webhooks |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN, FINANCE (webhooks) |
| Route / URL | `/{locale}/admin/system (proposed)` |
| Implementation status | Recommended · P2 |
| 1. Purpose | Integration status, quarantined webhooks, queue depth, worker jobs. Public /status exists; admin view only shows a quarantine count. |
| 2. Navigation location | Admin nav |
| 3. User permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Status tiles, table. |
| 5. Components | Status tiles, table |
| 6. Displayed data | Integrations (mode: sandbox/live), webhook events, failures, retries. |
| 7. Buttons and actions | Primary: Retry / inspect · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | webhook_events, outbox |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | PUB-15, ADM-01 |
| Dependencies and decisions | — |

Form fields:

  - None

### ADM-50 · Tax configuration and invoicing

| Item | Specification |
|---|---|
| Screen ID | ADM-50 |
| Screen name | Tax configuration and invoicing |
| Experience | Platform administrators |
| User roles | FINANCE_APPROVER |
| Route / URL | `/{locale}/admin/tax (proposed)` |
| Implementation status | Blocked · P1 |
| 1. Purpose | Founder chose the disclosed-intermediary model pending professional approval: supplier TRNs, VAT only for registered suppliers, commission invoices, credit notes. Today tax applies regardless of supplier registration. |
| 2. Navigation location | Admin nav |
| 3. User permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Settings, tables. |
| 5. Components | Settings, tables |
| 6. Displayed data | VAT rate, supplier registration status, invoice numbering, credit notes. |
| 7. Buttons and actions | Primary: Save · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | Business buyer: BUY-28 Invoices and tax documents (buyer); Manufacturers and supplier: SEL-34 Statements and commission invoices |
| Behaviour | — |
| Related screens | BUY-28, SEL-34 |
| Dependencies and decisions | Tax adviser approval; Gap G-04; TAX_TREATMENT is a deployment setting since PR #14 (P8-9); a tax screen stays blocked until the tax adviser is appointed (FD-06). |

Form fields:

  - None

### ADM-51 · Data requests, account closure and legal hold

| Item | Specification |
|---|---|
| Screen ID | ADM-51 |
| Screen name | Data requests, account closure and legal hold |
| Experience | Platform administrators |
| User roles | COMPLIANCE |
| Route / URL | `/{locale}/admin/data-requests (proposed)` |
| Implementation status | Planned · P1 |
| 1. Purpose | Founder: configurable retention, account closure, DSAR and legal-hold workflows. None exist. |
| 2. Navigation location | Admin nav |
| 3. User permissions | New capability |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: Queue, detail, actions. |
| 5. Components | Queue, detail, actions |
| 6. Displayed data | Request type, subject, due date, state, legal hold flag. |
| 7. Buttons and actions | Primary: Process request · Secondary: Place legal hold |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ACC-16 |
| Dependencies and decisions | Legal drafts; Gap G-15 |

Form fields:

  - None

### ADM-52 · Executive analytics

| Item | Specification |
|---|---|
| Screen ID | ADM-52 |
| Screen name | Executive analytics |
| Experience | Platform administrators |
| User roles | SUPER_ADMIN, FINANCE |
| Route / URL | `/{locale}/admin/analytics (proposed)` |
| Implementation status | Recommended · P2 |
| 1. Purpose | Trends beyond the operations overview: GMV over time, active buyers/suppliers, RFQ conversion, category performance. |
| 2. Navigation location | Admin nav |
| 3. User permissions | No capability exists yet (new screen). Proposed: a new admin capability granted to the roles listed above; to be defined with the founder (see section 27). |
| 4. Screen layout | Admin shell on the separate admin origin: capability-filtered admin nav, environment and sandbox labels, signed-in staff member and role. Page header (title, status badge, primary action). Content: KPI tiles, charts, tables. |
| 5. Components | KPI tiles, charts, tables |
| 6. Displayed data | Charts by period. |
| 7. Buttons and actions | Primary: — · Secondary: Change period; export |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | Period, category · — · — |
| 9. Validation rules | — |
| 10. API dependencies | — |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). No access or missing record: the same not-found copy (SYS-01), never revealing whether the record exists. Session ended: AUTH-09 keeps the return URL. |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | Confirm in a dialog before: export (state the consequence; simple saves need no confirmation). |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-01 |
| Dependencies and decisions | Analytics scope |

Form fields:

  - None

### ADM-53 · Sandbox provider simulator

| Item | Specification |
|---|---|
| Screen ID | ADM-53 |
| Screen name | Sandbox provider simulator |
| Experience | Platform administrators |
| User roles | FINANCE, FINANCE_APPROVER (development only) |
| Route / URL | `Action on ADM-32 / ADM-35` |
| Implementation status | Implemented · P2 |
| 1. Purpose | SANDBOX ONLY: simulate the provider finishing a refund or payout. Must never appear in production. |
| 2. Navigation location | Opened from ADM-32 Refunds |
| 3. User permissions | Finance roles; only when PAYMENT_MODE=mock |
| 4. Screen layout | Inline action on ADM-32 Refunds; result shown in place. |
| 5. Components | Inline button group with sandbox pill |
| 6. Displayed data | Operation reference, outcome buttons, "Sandbox" label. |
| 7. Buttons and actions | Primary: Simulate success · Secondary: Simulate failure |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | POST /admin/sandbox/operations/{ref}/complete |
| Database entities | refunds, payouts, ledger_entries |
| Source files | refunds/page.tsx; payouts/page.tsx |
| 11. Loading state | Button shows progress text and is disabled until the server responds. |
| 12. Empty state | Not applicable: always opened for an existing record. |
| 13. Error states | — |
| 14. Success state | Shown only after the server confirms (no optimistic success); message announced with `role="status"`. Inline "Changes saved." and the screen shows the saved values. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Admin is desktop-first; at ≤720px tables become stacked cards, filters collapse behind a "Filter" button, actions move to an overflow menu. |
| 17. Desktop layout (1440px) | Admin shell: capability-filtered left/top nav, page header, filters row, data table, right detail panel or full detail page. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None outside the platform team: this screen is internal to staff; its effects on companies are described on the action dialogs. |
| Behaviour | — |
| Related screens | ADM-32, ADM-35 |
| Dependencies and decisions | — |

Form fields:

  - None

## Empty and error states

### SYS-01 · Not found / not available

| Item | Specification |
|---|---|
| Screen ID | SYS-01 |
| Screen name | Not found / not available |
| Experience | Business buyers, Manufacturers and suppliers, Platform administrators |
| User roles | All |
| Route / URL | `Any unknown or inaccessible resource` |
| Implementation status | Implemented · P0 |
| 1. Purpose | One response for missing and forbidden resources so existence is never leaked. |
| 2. Navigation location | — |
| 3. User permissions | — |
| 4. Screen layout | Rendered inside whichever shell the user is in (public, workspace or admin). Page header (title, status badge, primary action). Content: Status page template. |
| 5. Components | Status page template |
| 6. Displayed data | "Not available" — "You do not have access to this page, or it does not exist."; back link. |
| 7. Buttons and actions | Primary: Back · Secondary: Go home |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | 404 responses |
| Database entities | — |
| Source files | components/ui.tsx (NotFound, Forbidden) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Centered. |
| 17. Desktop layout (1440px) | Centered. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | — |
| Related screens | SYS-02 |
| Dependencies and decisions | — |

Form fields:

  - None

### SYS-02 · Error with retry and reference

| Item | Specification |
|---|---|
| Screen ID | SYS-02 |
| Screen name | Error with retry and reference |
| Experience | Business buyers, Manufacturers and suppliers, Platform administrators |
| User roles | All |
| Route / URL | `Any failed load or action` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Recoverable error with request reference. |
| 2. Navigation location | — |
| 3. User permissions | — |
| 4. Screen layout | Rendered inside whichever shell the user is in (public, workspace or admin). Page header (title, status badge, primary action). Content: Error alert, retry button. |
| 5. Components | Error alert, retry button |
| 6. Displayed data | "Something went wrong", message by error key, Reference (request ID), Retry. |
| 7. Buttons and actions | Primary: Retry · Secondary: Contact support |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | Error envelope {code, message_key, field_errors, request_id} |
| Database entities | — |
| Source files | components/ui.tsx (ApiErrorAlert) |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: actions open other screens. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Inline. |
| 17. Desktop layout (1440px) | Inline. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Form input kept on failure (T34). |
| Related screens | SYS-01 |
| Dependencies and decisions | — |

Form fields:

  - None

### SYS-03 · Sandbox environment banner

| Item | Specification |
|---|---|
| Screen ID | SYS-03 |
| Screen name | Sandbox environment banner |
| Experience | Business buyers, Manufacturers and suppliers, Platform administrators |
| User roles | All |
| Route / URL | `Global (top of every page)` |
| Implementation status | Implemented · P0 |
| 1. Purpose | Make sandbox mode unmistakable: "Sandbox environment: test adapters only. No real payments, and emails go to the local mail catcher." |
| 2. Navigation location | — |
| 3. User permissions | Shown when public config sandbox=true |
| 4. Screen layout | Rendered inside whichever shell the user is in (public, workspace or admin). Page header (title, status badge, primary action). Content: Global banner. |
| 5. Components | Global banner |
| 6. Displayed data | Banner text. |
| 7. Buttons and actions | Primary: — · Secondary: — |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | GET /public/config |
| Database entities | — |
| Source files | app/[locale]/layout.tsx |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Wraps to 2–3 lines. |
| 17. Desktop layout (1440px) | Single line. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Non-dismissible. |
| Related screens | FIN-01 |
| Dependencies and decisions | — |

Form fields:

  - None

### SYS-04 · Trading unavailable / maintenance

| Item | Specification |
|---|---|
| Screen ID | SYS-04 |
| Screen name | Trading unavailable / maintenance |
| Experience | Business buyers, Manufacturers and suppliers, Platform administrators |
| User roles | All |
| Route / URL | `Recommended` |
| Implementation status | Recommended · P2 |
| 1. Purpose | Explain when checkout or trading is disabled (TRADING_ENABLED off, provider outage) while records stay readable. |
| 2. Navigation location | — |
| 3. User permissions | — |
| 4. Screen layout | Rendered inside whichever shell the user is in (public, workspace or admin). Page header (title, status badge, primary action). Content: Global banner, disabled-button reason text. |
| 5. Components | Global banner, disabled-button reason text |
| 6. Displayed data | Banner/notice, affected actions, what still works. |
| 7. Buttons and actions | Primary: — · Secondary: Request quotation instead |
| 8. Form fields | Required: — · Optional: — (details below) |
| Filters · sorting · search | — · — · — |
| 9. Validation rules | — |
| 10. API dependencies | viewer.trading.reason = checkout_disabled |
| Database entities | — |
| Source files | — |
| 11. Loading state | Skeleton header and content blocks in the final layout; actions disabled until data loads; `aria-busy` on the main region. |
| 12. Empty state | Not applicable: opened for an existing record; a missing or inaccessible record shows SYS-01. |
| 13. Error states | Load failure: error panel with the message for the error code, "Reference: {id}" and Retry (SYS-02). |
| 14. Success state | Not applicable: read-only screen. Data shown is the server response. |
| 15. Confirmation dialogs | None: actions are simple saves or navigation and can be undone. |
| 16. Mobile layout (360px) | Banner. |
| 17. Desktop layout (1440px) | Banner. |
| 18. Arabic and RTL layout | On `/ar` the screen mirrors with `dir="rtl"`: navigation, labels and reading order start on the right. AED amounts (formatFils, ar-AE), dates (Asia/Dubai), numbers and references stay in bidi isolates; only directional icons mirror. |
| 19. Interactions with other user roles | None: the same screen is shown to every visitor or user in that situation. |
| Behaviour | Product page already shows "Ordering is not available right now. You can request a quotation." |
| Related screens | PUB-07, BUY-17 |
| Dependencies and decisions | — |

Form fields:

  - None
