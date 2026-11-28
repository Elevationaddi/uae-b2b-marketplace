# 27. Pending founder decisions

21 open decisions that affect UX/UI. Founder decisions already given (D01–D15, A01–A15, and the Phase 8 decisions of 2026-11-28, recorded as F01–F13 in `docs/00-decisions.md` by the Phase 8A pull request) are treated as settled and are not repeated here; provisional rules P3-1…P6-6 that conflict with them are listed in section 26. Each item says whether design can proceed without it.

| ID | Decision | Can design proceed? |
|---|---|---|
| FD-01 | Two finance approvers: meaning | Yes: design approval panel with N approvals. |
| FD-02 | What the buyer's "Confirm receipt" does | Yes: design the "Confirm receipt" action and the countdown. |
| FD-03 | What counts as "verified delivery" | Partly: design proof upload and buyer confirm; window copy waits. |
| FD-04 | Weekly payout schedule details | Yes: design with placeholders. |
| FD-05 | Commission setting governance | Yes. |
| FD-06 | Tax model professional approval | Partly: design tax lines generically; invoice layouts blocked. |
| FD-07 | Payment provider final choice | Yes: provider-neutral design. |
| FD-08 | Delivery options and charges | Yes: design method selector. |
| FD-09 | Cancellation and returns policy | Partly. |
| FD-10 | Counteroffer mechanics | Yes. |
| FD-11 | Public RFQ meaning | Yes. |
| FD-12 | Quote validity bounds | Yes. |
| FD-13 | Sample requests in scope? | Yes. |
| FD-14 | Support ticket limit and urgent path | Yes. |
| FD-15 | Review display details | Yes. |
| FD-16 | Legal document set and acceptance UX | Yes with placeholders; publishing blocked. |
| FD-17 | Brand identity (name, logo, typography, icons) | Yes. |
| FD-18 | Default language and translation responsibility | Yes. |
| FD-19 | Analytics and tracking consent | Yes. |
| FD-20 | Notification channels | Yes. |
| FD-21 | Buyer dashboard spend analytics | Yes. |


## FD-01 · Two finance approvers: meaning

| Aspect | Detail |
|---|---|
| Decision required | Two finance approvers: meaning |
| Why it matters | Founder said "weekly payouts with two finance approvers". The build has requester + one different approver (two people). |
| Screens affected | ADM-32, ADM-34, ADM-35, ADM-37 |
| Options | A) Requester + one approver (current). B) Requester + two approvers (three people). C) Two approvers, requester may be one of them. |
| Recommendation | A, with the requester shown and blocked from approving. |
| Consequences | A: no change. B: extra step and staffing. C: weaker control. |
| Can design proceed without it? | Yes: design approval panel with N approvals. |


## FD-02 · What the buyer's "Confirm receipt" does

| Aspect | Detail |
|---|---|
| Decision required | What the buyer's "Confirm receipt" does |
| Why it matters | Founder (F07): orders auto-complete after the 14-day window when delivery evidence exists and there are no open disputes, holds or investigations; buyer confirmation does not waive the window. The code completes the order on buyer confirmation and starts the window there. |
| Screens affected | BUY-24, BUY-25, SEL-28, ADM-29 |
| Options | A) Confirm receipt records delivery evidence only; the order completes when the window ends. B) Remove the buyer action and rely on supplier proof. C) Confirm receipt completes the order early but keeps the window open. |
| Recommendation | A: keeps one completion rule and gives the buyer a clear action. |
| Consequences | A needs a scheduler and countdown copy; C mixes completion with an open dispute window. |
| Can design proceed without it? | Yes: design the "Confirm receipt" action and the countdown. |


## FD-03 · What counts as "verified delivery"

| Aspect | Detail |
|---|---|
| Decision required | What counts as "verified delivery" |
| Why it matters | Starts the dispute window and drives payouts. |
| Screens affected | SEL-30, BUY-24, SHR-02 |
| Options | A) Supplier uploads proof of delivery. B) Buyer confirms receipt. C) Courier tracking event. D) Proof or buyer confirmation. |
| Recommendation | D for launch (courier integration later). |
| Consequences | A alone risks disputes; C needs integrations. |
| Can design proceed without it? | Partly: design proof upload and buyer confirm; window copy waits. |


## FD-04 · Weekly payout schedule details

| Aspect | Detail |
|---|---|
| Decision required | Weekly payout schedule details |
| Why it matters | Seller balances (pending/available) and admin batch UI depend on cut-off day/time, minimum amount and holiday handling. |
| Screens affected | SEL-32, ADM-35 |
| Options | Day of week; cut-off time (Dubai); minimum payout; carry-forward rule. |
| Recommendation | Weekly, Monday 10:00 Dubai cut-off, no minimum for launch. |
| Consequences | Determines "Available on …" dates. |
| Can design proceed without it? | Yes: design with placeholders. |


## FD-05 · Commission setting governance

| Aspect | Detail |
|---|---|
| Decision required | Commission setting governance |
| Why it matters | Founder: 10% configurable via restricted admin setting, snapshotted per order. Who changes it, with what approval and notice to suppliers? |
| Screens affected | ADM-47, SEL-28, SEL-32, PUB-18 |
| Options | A) SUPER_ADMIN + finance approver dual control with effective date. B) Finance approver alone. C) Code deploy only. |
| Recommendation | A, with supplier notice period. |
| Consequences | A safest; C slow. |
| Can design proceed without it? | Yes. |


## FD-06 · Tax model professional approval

| Aspect | Detail |
|---|---|
| Decision required | Tax model professional approval |
| Why it matters | Disclosed intermediary pending approval; affects invoices, VAT lines, TRN fields and unregistered suppliers. |
| Screens affected | BUY-17, BUY-24, BUY-28, SEL-22, SEL-34, ADM-50 |
| Options | A) Approve disclosed intermediary as described. B) Platform as principal (platform invoices buyers). |
| Recommendation | Obtain adviser sign-off before live payments. |
| Consequences | Invoice layouts and checkout tax lines change materially. |
| Can design proceed without it? | Partly: design tax lines generically; invoice layouts blocked. |


## FD-07 · Payment provider final choice

| Aspect | Detail |
|---|---|
| Decision required | Payment provider final choice |
| Why it matters | Stripe Connect preferred, Mamo fallback. Hosted pages, onboarding and payout flows differ. |
| Screens affected | FIN-02, FIN-03, SEL-33, BUY-18 |
| Options | A) Stripe Connect. B) Mamo. C) Both (fallback). |
| Recommendation | A, with provider-neutral app screens. |
| Consequences | Onboarding screens and bank transfer support differ. |
| Can design proceed without it? | Yes: provider-neutral design. |


## FD-08 · Delivery options and charges

| Aspect | Detail |
|---|---|
| Decision required | Delivery options and charges |
| Why it matters | Founder: supplier-arranged, courier, collection, per-order charges. Code: one flat fee per supplier order. |
| Screens affected | SEL-04, BUY-17, BUY-24, ADM-48 |
| Options | A) Keep flat fee + add "Collection" (free). B) Supplier sets per-emirate fees. C) Quote-based delivery for large orders. |
| Recommendation | A + B for launch; C already possible via RFQ shipping. |
| Consequences | Checkout layout changes with method choice. |
| Can design proceed without it? | Yes: design method selector. |


## FD-09 · Cancellation and returns policy

| Aspect | Detail |
|---|---|
| Decision required | Cancellation and returns policy |
| Why it matters | No policy text; affects BUY-31, SEL-36, SEL-37 and legal pages. |
| Screens affected | BUY-31, SEL-36, SEL-37, PUB-24 |
| Options | A) Cancellation before dispatch only, returns via disputes. B) Formal returns with RMA. |
| Recommendation | A for launch. |
| Consequences | B adds a full returns module. |
| Can design proceed without it? | Partly. |


## FD-10 · Counteroffer mechanics

| Aspect | Detail |
|---|---|
| Decision required | Counteroffer mechanics |
| Why it matters | Founder allows counteroffers. Need fields and round limits. |
| Screens affected | BUY-15, SEL-22 |
| Options | A) Note-only revision requests (current). B) Structured counter (price, quantity, date) with unlimited rounds. C) Structured with max 3 rounds. |
| Recommendation | C. |
| Consequences | B/C need a new endpoint and timeline events. |
| Can design proceed without it? | Yes. |


## FD-11 · Public RFQ meaning

| Aspect | Detail |
|---|---|
| Decision required | Public RFQ meaning |
| Why it matters | Founder: "public or private RFQs". Code POOL = verified suppliers with public listings in the category (A12); INVITE = invited only. |
| Screens affected | BUY-03, SEL-20 |
| Options | A) Keep POOL as "public" (category-matched). B) Visible to all verified suppliers. |
| Recommendation | A, labelled "Matching suppliers". |
| Consequences | B raises spam and relevance issues. |
| Can design proceed without it? | Yes. |


## FD-12 · Quote validity bounds

| Aspect | Detail |
|---|---|
| Decision required | Quote validity bounds |
| Why it matters | Founder: default 7 days, supplier-configurable. Code: max 90 days. |
| Screens affected | SEL-22, BUY-10 |
| Options | Default 7; min 1 day; max 90. |
| Recommendation | As listed. |
| Consequences | Validation copy. |
| Can design proceed without it? | Yes. |


## FD-13 · Sample requests in scope?

| Aspect | Detail |
|---|---|
| Decision required | Sample requests in scope? |
| Why it matters | Samples flag exists without a flow. |
| Screens affected | BUY-32, PUB-07 |
| Options | A) Out of scope (use RFQ). B) Sample request as RFQ type. C) Paid sample orders. |
| Recommendation | A for launch, B later. |
| Consequences | — |
| Can design proceed without it? | Yes. |


## FD-14 · Support ticket limit and urgent path

| Aspect | Detail |
|---|---|
| Decision required | Support ticket limit and urgent path |
| Why it matters | Founder: 10 open per company, admin exceptions, urgent not blocked. Code: 20 per workspace. |
| Screens affected | SHR-04, ADM-42 |
| Options | Define "urgent" (payment taken but no order, account locked, security). |
| Recommendation | Category-based urgent flag bypassing the limit. |
| Consequences | Limit state copy. |
| Can design proceed without it? | Yes. |


## FD-15 · Review display details

| Aspect | Detail |
|---|---|
| Decision required | Review display details |
| Why it matters | Founder: anonymous "verified business buyer"; admins see identity. Show emirate/industry? |
| Screens affected | PUB-10, BUY-26, ADM-41 |
| Options | A) Label only. B) Label + emirate. C) Label + business type. |
| Recommendation | A for launch (lowest re-identification risk). |
| Consequences | — |
| Can design proceed without it? | Yes. |


## FD-16 · Legal document set and acceptance UX

| Aspect | Detail |
|---|---|
| Decision required | Legal document set and acceptance UX |
| Why it matters | 12 documents to draft for lawyer review; versioned acceptance and re-acceptance flows. |
| Screens affected | PUB-22…PUB-25, ACC-06, AUTH-01, BUY-17 |
| Options | Clickwrap at registration + checkout; re-accept on material change. |
| Recommendation | As listed. |
| Consequences | — |
| Can design proceed without it? | Yes with placeholders; publishing blocked. |


## FD-17 · Brand identity (name, logo, typography, icons)

| Aspect | Detail |
|---|---|
| Decision required | Brand identity (name, logo, typography, icons) |
| Why it matters | Deferred by founder; palette approved. |
| Screens affected | All |
| Options | Proceed with "Manufacturers Marketplace" text placeholder and system font. |
| Recommendation | Proceed. |
| Consequences | Typography change later affects line lengths and RTL. |
| Can design proceed without it? | Yes. |


## FD-18 · Default language and translation responsibility

| Aspect | Detail |
|---|---|
| Decision required | Default language and translation responsibility |
| Why it matters | App supports EN/AR; sellers may write AR optionally. Should AR be mandatory for listings? Machine translation? |
| Screens affected | PUB-07, SEL-08, SEL-02 |
| Options | A) AR optional (current). B) AR required for publish. C) Assisted translation. |
| Recommendation | A at launch with "Arabic not provided" fallback. |
| Consequences | B slows onboarding. |
| Can design proceed without it? | Yes. |


## FD-19 · Analytics and tracking consent

| Aspect | Detail |
|---|---|
| Decision required | Analytics and tracking consent |
| Why it matters | Product view analytics need consent/retention rules. |
| Screens affected | SEL-35, ADM-52 |
| Options | A) First-party aggregate counts only. B) Third-party analytics. |
| Recommendation | A. |
| Consequences | B needs cookie consent UI. |
| Can design proceed without it? | Yes. |


## FD-20 · Notification channels

| Aspect | Detail |
|---|---|
| Decision required | Notification channels |
| Why it matters | Email + in-app exist. SMS/WhatsApp? |
| Screens affected | ACC-13, ACC-14 |
| Options | A) Email + in-app only. B) Add SMS for payment/security. |
| Recommendation | A for launch. |
| Consequences | B adds provider cost. |
| Can design proceed without it? | Yes. |


## FD-21 · Buyer dashboard spend analytics

| Aspect | Detail |
|---|---|
| Decision required | Buyer dashboard spend analytics |
| Why it matters | BUY-01 can show counts from existing APIs; spend over time needs an aggregate. |
| Screens affected | BUY-01 |
| Options | A) Counts only. B) Counts + monthly spend. |
| Recommendation | B (small backend change). |
| Consequences | — |
| Can design proceed without it? | Yes. |
