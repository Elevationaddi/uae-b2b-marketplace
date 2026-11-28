# 27. Founder decisions

All 21 UX decisions (FD-01 to FD-21) were answered by the founder on 28 November 2026. **No UX decision is pending.** The answers are applied throughout this specification: the affected screens are listed with each answer, new screens were added for counteroffers, samples, delivery and collection, buyer cancellation, monthly spending, commission policy, settlement holds and delivery proof review, and gaps were re-classified in section 26. Earlier settled decisions (D01–D15, A01–A15 and F01–F13 in `docs/00-decisions.md`) still apply; provisional engineering rules P8-1 to P8-14 are recorded in the decision register.

## 27.1 Answers

| ID | Decision | Founder answer | Screens |
|---|---|---|---|
| FD-01 | Two finance approvers: meaning | A. One requester and one different approver. No self-approval. | ADM-32, ADM-34, ADM-35, ADM-37 |
| FD-02 | What the buyer's "Confirm receipt" does | A. Confirm receipt records delivery only. The dispute period remains active. | BUY-24, BUY-25, SEL-28, ADM-29 |
| FD-03 | What counts as "verified delivery" | A. Verified delivery proof or buyer confirmation, whichever is first. Supplier-uploaded evidence must be validated, with a review mechanism for contested or suspicious delivery claims. | SEL-30, BUY-24, ADM-59 |
| FD-04 | Weekly payout schedule details | Monday at 10:00 AM UAE time, no minimum payout at launch, next working day for public holidays. | SEL-32, ADM-35, ADM-47 |
| FD-05 | Commission setting governance | A. Authorized finance approver, mandatory MFA, recorded reason, versioned commission and 30 days' advance supplier notice. | ADM-56, SEL-32 |
| FD-06 | Tax model professional approval | A. Disclosed-intermediary model. Tax adviser pending. | BUY-17, BUY-37, BUY-28, SEL-34, ADM-50 |
| FD-07 | Payment provider final choice | A. Stripe Connect remains the preferred candidate. Keep the payment interface provider-independent. No live activation or additional subscription is approved. | FIN-01, FIN-02, SEL-33, BUY-18 |
| FD-08 | Delivery options and charges | A. Support free buyer collection and configurable delivery fees for each emirate. | SEL-04, BUY-35, BUY-36, SEL-28 |
| FD-09 | Cancellation and returns policy | A. Supplier cancellation, supplier-specific return policies, disputes and buyer cancellation requests before dispatch. | BUY-31, SEL-36, SEL-41, SEL-02 |
| FD-10 | Counteroffer mechanics | C. Structured counteroffers with a maximum of three rounds per supplier negotiation. | BUY-15, BUY-34, SEL-40, BUY-12 |
| FD-11 | Public RFQ meaning | A. Public RFQs are labelled "Matching suppliers" and are visible only to eligible verified suppliers in matching categories. Private RFQs are invitation-only. | BUY-03, SEL-20 |
| FD-12 | Quote validity bounds | A. Default quotation validity of seven days, with a minimum of one day and a maximum of 90 days. | SEL-22, BUY-10 |
| FD-13 | Sample requests in scope? | B. Add sample requests as a dedicated RFQ type. Do not create an entirely separate paid sample order module. | BUY-32, SEL-39, SEL-20, PUB-07, PUB-10 |
| FD-14 | Support ticket limit and urgent path | A. Retain the existing support limits and urgent exceptions. | SHR-04, ADM-55 |
| FD-15 | Review display details | A. Public reviews display only "Verified business buyer". Authorized administrators can identify the reviewer where necessary. | PUB-10, BUY-26, ADM-41 |
| FD-16 | Legal document set and acceptance UX | A. Versioned clickwrap acceptance at registration and checkout, with re-acceptance after material policy changes. UAE legal adviser pending. | ACC-18, AUTH-03, ACC-06, BUY-17 |
| FD-17 | Brand identity (name, logo, typography, icons) | A. Retain the working name and temporary font. Do not finalize the logo, name or brand identity yet. The colour palette reference will be supplied separately. | All |
| FD-18 | Default language and translation responsibility | A. Arabic product listings are optional. Clearly indicate when an Arabic product description has not been provided. The application interface itself must remain fully bilingual. | PUB-07, SEL-08, SEL-02 |
| FD-19 | Analytics and tracking consent | A. First-party analytics only. No paid analytics services or unnecessary third-party tracking. | SEL-35, ADM-52 |
| FD-20 | Notification channels | A. Email and in-app notifications only. No paid SMS or WhatsApp integration. | ACC-13, ACC-14 |
| FD-21 | Buyer dashboard spend analytics | B. Buyer dashboard should include operational counts and monthly spending analytics in AED. | BUY-01, BUY-33 |


## 27.2 Items still waiting on someone outside the questionnaire

These are not questions for the founder to answer again. They are external inputs the founder has already said are pending.

| Item | What is pending | Waiting on | Screens | Design approach meanwhile |
|---|---|---|---|---|
| Legal texts | Terms of use, privacy policy, buyer and supplier agreements, returns and refunds policy, cancellation policy wording. | UAE legal adviser (FD-16) | ACC-18, ACC-06, BUY-17, BUY-31, PUB-22, PUB-23 | Design with placeholder text; ACC-18 stays Blocked until texts are approved. |
| Tax treatment | Disclosed-intermediary model confirmed; VAT on commission, binding tax invoices and credit notes. | Tax adviser (FD-06) | BUY-28, SEL-34, ADM-50, BUY-37 | Invoice drafts only; binding invoice screens stay Blocked. |
| Payment provider | Stripe Connect preferred; no live activation or subscription approved. | Founder approval before activation (FD-07) | FIN-02, SEL-33, BUY-18 | Keep screens provider-neutral; sandbox labels stay. |
| Palette reference image | The approved palette stands; the founder will supply a reference image separately. | Founder (FD-17) | Section 28, deliverable 07 | Use the approved palette and temporary font; nothing in the specification waits on the image. |
| Brand identity | Final name, logo and font are deliberately not decided. | Founder, later (FD-17) | All | Text placeholder logo and the free temporary font. |


## 27.3 Detail of each decision

### FD-01 · Two finance approvers: meaning

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. One requester and one different approver. No self-approval. |
| Design impact | Approval panels show the requester and block the same person from approving (already built). No third approver. |
| Screens affected | ADM-32, ADM-34, ADM-35, ADM-37 |
| Why it mattered | Founder said "weekly payouts with two finance approvers". The build has requester + one different approver (two people). |
| Options that were offered | A) Requester + one approver (current). B) Requester + two approvers (three people). C) Two approvers, requester may be one of them. |
| Our recommendation at the time | A, with the requester shown and blocked from approving. |


### FD-02 · What the buyer's "Confirm receipt" does

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Confirm receipt records delivery only. The dispute period remains active. |
| Design impact | Confirm receipt copy states the window end date; no early completion of the dispute period. |
| Screens affected | BUY-24, BUY-25, SEL-28, ADM-29 |
| Why it mattered | Founder (F07): orders auto-complete after the 14-day window when delivery evidence exists and there are no open disputes, holds or investigations; buyer confirmation does not waive the window. The code completes the order on buyer confirmation and starts the window there. |
| Options that were offered | A) Confirm receipt records delivery evidence only; the order completes when the window ends. B) Remove the buyer action and rely on supplier proof. C) Confirm receipt completes the order early but keeps the window open. |
| Our recommendation at the time | A: keeps one completion rule and gives the buyer a clear action. |


### FD-03 · What counts as "verified delivery"

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Verified delivery proof or buyer confirmation, whichever is first. Supplier-uploaded evidence must be validated, with a review mechanism for contested or suspicious delivery claims. |
| Design impact | Proof upload states; new admin delivery proof review (ADM-59). |
| Screens affected | SEL-30, BUY-24, ADM-59 |
| Why it mattered | Starts the dispute window and drives payouts. |
| Options that were offered | A) Supplier uploads proof of delivery. B) Buyer confirms receipt. C) Courier tracking event. D) Proof or buyer confirmation. |
| Our recommendation at the time | D for launch (courier integration later). |


### FD-04 · Weekly payout schedule details

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | Monday at 10:00 AM UAE time, no minimum payout at launch, next working day for public holidays. |
| Design impact | Payout run copy and dates; configurable schedule screen (ADM-47). |
| Screens affected | SEL-32, ADM-35, ADM-47 |
| Why it mattered | Seller balances (pending/available) and admin batch UI depend on cut-off day/time, minimum amount and holiday handling. |
| Options that were offered | Day of week; cut-off time (Dubai); minimum payout; carry-forward rule. |
| Our recommendation at the time | Weekly, Monday 10:00 Dubai cut-off, no minimum for launch. |


### FD-05 · Commission setting governance

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Authorized finance approver, mandatory MFA, recorded reason, versioned commission and 30 days' advance supplier notice. |
| Design impact | Commission policy screen (ADM-56, built) plus effective date and supplier notice. |
| Screens affected | ADM-56, SEL-32 |
| Why it mattered | Founder: 10% configurable via restricted admin setting, snapshotted per order. Who changes it, with what approval and notice to suppliers? |
| Options that were offered | A) SUPER_ADMIN + finance approver dual control with effective date. B) Finance approver alone. C) Code deploy only. |
| Our recommendation at the time | A, with supplier notice period. |


### FD-06 · Tax model professional approval

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Disclosed-intermediary model. Tax adviser pending. |
| Design impact | Invoice drafts only (BUY-37); binding invoice screens stay blocked. |
| Screens affected | BUY-17, BUY-37, BUY-28, SEL-34, ADM-50 |
| Why it mattered | Disclosed intermediary pending approval; affects invoices, VAT lines, TRN fields and unregistered suppliers. |
| Options that were offered | A) Approve disclosed intermediary as described. B) Platform as principal (platform invoices buyers). |
| Our recommendation at the time | Obtain adviser sign-off before live payments. |


### FD-07 · Payment provider final choice

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Stripe Connect remains the preferred candidate. Keep the payment interface provider-independent. No live activation or additional subscription is approved. |
| Design impact | Provider-neutral payment screens; sandbox labels stay. |
| Screens affected | FIN-01, FIN-02, SEL-33, BUY-18 |
| Why it mattered | Stripe Connect preferred, Mamo fallback. Hosted pages, onboarding and payout flows differ. |
| Options that were offered | A) Stripe Connect. B) Mamo. C) Both (fallback). |
| Our recommendation at the time | A, with provider-neutral app screens. |


### FD-08 · Delivery options and charges

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Support free buyer collection and configurable delivery fees for each emirate. |
| Design impact | Per-emirate delivery settings (SEL-04), delivery selection (BUY-35), collection instructions (BUY-36). |
| Screens affected | SEL-04, BUY-35, BUY-36, SEL-28 |
| Why it mattered | Founder: supplier-arranged, courier, collection, per-order charges. Code: one flat fee per supplier order. |
| Options that were offered | A) Keep flat fee + add "Collection" (free). B) Supplier sets per-emirate fees. C) Quote-based delivery for large orders. |
| Our recommendation at the time | A + B for launch; C already possible via RFQ shipping. |


### FD-09 · Cancellation and returns policy

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Supplier cancellation, supplier-specific return policies, disputes and buyer cancellation requests before dispatch. |
| Design impact | Supplier cancel (SEL-36, built), return policy (SEL-02, built), buyer cancellation request (BUY-31) and supplier review (SEL-41). |
| Screens affected | BUY-31, SEL-36, SEL-41, SEL-02 |
| Why it mattered | No policy text; affects BUY-31, SEL-36, SEL-37 and legal pages. |
| Options that were offered | A) Cancellation before dispatch only, returns via disputes. B) Formal returns with RMA. |
| Our recommendation at the time | A for launch. |


### FD-10 · Counteroffer mechanics

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | C. Structured counteroffers with a maximum of three rounds per supplier negotiation. |
| Design impact | Counteroffer dialog (BUY-15), negotiation history (BUY-34), supplier response (SEL-40). |
| Screens affected | BUY-15, BUY-34, SEL-40, BUY-12 |
| Why it mattered | Founder allows counteroffers. Need fields and round limits. |
| Options that were offered | A) Note-only revision requests (current). B) Structured counter (price, quantity, date) with unlimited rounds. C) Structured with max 3 rounds. |
| Our recommendation at the time | C. |


### FD-11 · Public RFQ meaning

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Public RFQs are labelled "Matching suppliers" and are visible only to eligible verified suppliers in matching categories. Private RFQs are invitation-only. |
| Design impact | Audience labels on RFQ forms and lists. |
| Screens affected | BUY-03, SEL-20 |
| Why it mattered | Founder: "public or private RFQs". Code POOL = verified suppliers with public listings in the category (A12); INVITE = invited only. |
| Options that were offered | A) Keep POOL as "public" (category-matched). B) Visible to all verified suppliers. |
| Our recommendation at the time | A, labelled "Matching suppliers". |


### FD-12 · Quote validity bounds

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Default quotation validity of seven days, with a minimum of one day and a maximum of 90 days. |
| Design impact | Quote form default and validation (built in PR #16 for default and maximum). |
| Screens affected | SEL-22, BUY-10 |
| Why it mattered | Founder: default 7 days, supplier-configurable. Code: max 90 days. |
| Options that were offered | Default 7; min 1 day; max 90. |
| Our recommendation at the time | As listed. |


### FD-13 · Sample requests in scope?

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | B. Add sample requests as a dedicated RFQ type. Do not create an entirely separate paid sample order module. |
| Design impact | Request a sample (BUY-32), sample settings (SEL-39), sample badge in the supplier inbox. |
| Screens affected | BUY-32, SEL-39, SEL-20, PUB-07, PUB-10 |
| Why it mattered | Samples flag exists without a flow. |
| Options that were offered | A) Out of scope (use RFQ). B) Sample request as RFQ type. C) Paid sample orders. |
| Our recommendation at the time | A for launch, B later. |


### FD-14 · Support ticket limit and urgent path

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Retain the existing support limits and urgent exceptions. |
| Design impact | Limit note and urgent categories (built in PR #16); admin exception (ADM-55). |
| Screens affected | SHR-04, ADM-55 |
| Why it mattered | Founder: 10 open per company, admin exceptions, urgent not blocked. Code: 20 per workspace. |
| Options that were offered | Define "urgent" (payment taken but no order, account locked, security). |
| Our recommendation at the time | Category-based urgent flag bypassing the limit. |


### FD-15 · Review display details

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Public reviews display only "Verified business buyer". Authorized administrators can identify the reviewer where necessary. |
| Design impact | Review label (built in PR #16). |
| Screens affected | PUB-10, BUY-26, ADM-41 |
| Why it mattered | Founder: anonymous "verified business buyer"; admins see identity. Show emirate/industry? |
| Options that were offered | A) Label only. B) Label + emirate. C) Label + business type. |
| Our recommendation at the time | A for launch (lowest re-identification risk). |


### FD-16 · Legal document set and acceptance UX

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Versioned clickwrap acceptance at registration and checkout, with re-acceptance after material policy changes. UAE legal adviser pending. |
| Design impact | Clickwrap dialog (ACC-18); legal texts are placeholders. |
| Screens affected | ACC-18, AUTH-03, ACC-06, BUY-17 |
| Why it mattered | 12 documents to draft for lawyer review; versioned acceptance and re-acceptance flows. |
| Options that were offered | Clickwrap at registration + checkout; re-accept on material change. |
| Our recommendation at the time | As listed. |


### FD-17 · Brand identity (name, logo, typography, icons)

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Retain the working name and temporary font. Do not finalize the logo, name or brand identity yet. The colour palette reference will be supplied separately. |
| Design impact | Section 28 unchanged: text placeholder logo, temporary font, approved palette; reference image awaited. |
| Screens affected | All |
| Why it mattered | Deferred by founder; palette approved. |
| Options that were offered | Proceed with "Manufacturers Marketplace" text placeholder and system font. |
| Our recommendation at the time | Proceed. |


### FD-18 · Default language and translation responsibility

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Arabic product listings are optional. Clearly indicate when an Arabic product description has not been provided. The application interface itself must remain fully bilingual. |
| Design impact | Arabic-missing notice on product pages; editor shows which fields lack Arabic. |
| Screens affected | PUB-07, SEL-08, SEL-02 |
| Why it mattered | App supports EN/AR; sellers may write AR optionally. Should AR be mandatory for listings? Machine translation? |
| Options that were offered | A) AR optional (current). B) AR required for publish. C) Assisted translation. |
| Our recommendation at the time | A at launch with "Arabic not provided" fallback. |


### FD-19 · Analytics and tracking consent

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. First-party analytics only. No paid analytics services or unnecessary third-party tracking. |
| Design impact | No cookie banner for third-party trackers; analytics screens use first-party data only. |
| Screens affected | SEL-35, ADM-52 |
| Why it mattered | Product view analytics need consent/retention rules. |
| Options that were offered | A) First-party aggregate counts only. B) Third-party analytics. |
| Our recommendation at the time | A. |


### FD-20 · Notification channels

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | A. Email and in-app notifications only. No paid SMS or WhatsApp integration. |
| Design impact | Notification settings show email and in-app only. |
| Screens affected | ACC-13, ACC-14 |
| Why it mattered | Email + in-app exist. SMS/WhatsApp? |
| Options that were offered | A) Email + in-app only. B) Add SMS for payment/security. |
| Our recommendation at the time | A for launch. |


### FD-21 · Buyer dashboard spend analytics

| Aspect | Detail |
|---|---|
| Founder answer (28 Nov 2026) | B. Buyer dashboard should include operational counts and monthly spending analytics in AED. |
| Design impact | Buyer dashboard (BUY-01) with monthly spending section (BUY-33). |
| Screens affected | BUY-01, BUY-33 |
| Why it mattered | BUY-01 can show counts from existing APIs; spend over time needs an aggregate. |
| Options that were offered | A) Counts only. B) Counts + monthly spend. |
| Our recommendation at the time | B (small backend change). |
