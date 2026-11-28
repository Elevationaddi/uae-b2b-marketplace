# 26. Missing features and UX gaps

41 findings from the audit, with their status after the code merged on `main` up to 9df2f0e (pull requests #13 to #19) and the founder answers of 28 November 2026. Severity: **Critical** blocks launch or creates legal/financial risk; **High** major journey gap; **Medium** noticeable friction or inconsistency; **Low** polish or post-launch. Design priority uses P0/P1/P2. Code conflicts with the founder decisions are tracked for engineering as C-01…C-24 in `docs/phase-8/contradictions.md`; the gaps below describe their effect on screens.

## 26.1 Status

| Status | Gaps |
|---|---|
| Resolved in code | 12 |
| Partly resolved | 2 |
| Approved, being built | 5 |
| Approved, to build | 3 |
| Waiting on legal | 1 |
| Waiting on provider | 1 |
| Open | 17 |


Resolved in code means the behaviour exists on `main` and its screens are now specified as Implemented; design work is still needed. Approved means the founder answered and the screen is specified, but the code is not built yet.

| Severity | Count |
|---|---|
| Critical | 3 |
| High | 10 |
| Medium | 15 |
| Low | 13 |


| Finding type | Count |
|---|---|
| Accessibility | 1 |
| Backend without UI | 3 |
| Blocked | 3 |
| Doc/code inconsistency | 11 |
| Incomplete journey | 3 |
| Missing error handling | 1 |
| Missing feature | 7 |
| Missing interaction | 4 |
| Missing screen | 3 |
| Responsive issue | 3 |
| Security | 1 |
| Unnecessary friction | 1 |


## 26.2 Status of each gap

| ID | Finding | Severity | Status | Note |
|---|---|---|---|---|
| G-01 | No buyer dashboard | High | Approved, to build | FD-21: dashboard with counts and monthly spending (BUY-01, BUY-33). |
| G-02 | Public information pages and footer missing | Medium | Open | Still open; see the recommendation below. |
| G-03 | No invoices, receipts or credit notes | High | Partly resolved | PR #14: non-binding invoice drafts. Binding invoices wait for the tax adviser (FD-06). |
| G-04 | Tax applied regardless of supplier VAT registration | Critical | Resolved in code | PR #14: VAT by confirmed supplier status (P8-9, P8-10). Tax rules still need professional approval. |
| G-05 | Commission configured by environment variable | High | Resolved in code | PR #13: versioned commission policy (ADM-56). 30-day supplier notice still to add (FD-05). |
| G-06 | Refund commission reversal uses order total | Medium | Resolved in code | PR #13: refund split, commission reversed on merchandise only (P8-7). |
| G-07 | No structured buyer counteroffer | Medium | Approved, being built | FD-10 and C-14: structured counteroffers, three rounds (BUY-15, BUY-34, SEL-40). |
| G-08 | Supplier cannot cancel a paid order | High | Resolved in code | PR #17: supplier cancellation with finance-approved full refund (SEL-36). |
| G-09 | Buyer cannot request cancellation after payment | High | Approved, to build | Founder Q12: buyer cancellation requests before dispatch (BUY-31, SEL-41). |
| G-10 | No auto-complete after the dispute window | High | Resolved in code | PR #13: auto-completion after the window when the four conditions hold (P8-3). |
| G-11 | No reorder | Low | Open | Still open; see the recommendation below. |
| G-12 | Reconciliation cases cannot be resolved | High | Resolved in code | PR #13: reconciliation resolution (ADM-31). |
| G-13 | Payouts are manual at completion, not weekly | High | Resolved in code | PR #13: weekly payout run (P8-5). Monday 10:00 schedule and holidays configurable screen still to build (ADM-47). |
| G-14 | Dispute window starts at receipt confirmation | Medium | Resolved in code | PR #13: window from verified delivery (P8-1). |
| G-15 | No account closure, DSAR, retention or legal hold | High | Approved, being built | C-19 in the build thread. |
| G-16 | Refund form takes a raw order ID | Medium | Open | Still open; see the recommendation below. |
| G-17 | No admin storefront detail page | Low | Open | Still open; see the recommendation below. |
| G-18 | No message attachments | Medium | Open | Still open; see the recommendation below. |
| G-19 | No legal documents; terms version "dev-1" | Critical | Waiting on legal | FD-16 answered; texts wait for a UAE legal adviser (ACC-18 blocked). |
| G-20 | Mobile navigation issues | Medium | Open | Still open; see the recommendation below. |
| G-21 | Quote comparison overflows on mobile | Medium | Open | Still open; see the recommendation below. |
| G-22 | Quote validity has no default | Medium | Resolved in code | PR #16: 7-day default; FD-12 sets minimum 1 day. |
| G-23 | Support limits and auto-close differ from founder decision | Low | Resolved in code | PR #16: 10 per company, urgent categories, exceptions, 7-day auto-close. |
| G-24 | Compliance cannot export verification records | Low | Approved, being built | C-18 in the build thread. |
| G-25 | Review label differs | Low | Resolved in code | PR #16: "Verified business buyer". |
| G-26 | Delivery options limited to a flat fee | Medium | Approved, being built | FD-08 and C-10: per-emirate fees, collection, proof of dispatch (SEL-04, BUY-35, BUY-36). |
| G-27 | Stale or misleading copy | Medium | Open | Still open; see the recommendation below. |
| G-28 | No analytics; product views not recorded | Low | Open | Still open; see the recommendation below. |
| G-29 | No live payment provider or payout onboarding | Critical | Waiting on provider | FD-07: Stripe Connect preferred; no live activation approved. |
| G-30 | No bank transfer method | Medium | Open | Still open; see the recommendation below. |
| G-31 | Transactional email not production-ready | High | Approved, being built | Founder Q5: Resend adapter and bilingual templates prepared without real sending. |
| G-32 | No sample request flow | Low | Approved, to build | FD-13: sample requests as an RFQ type (BUY-32, SEL-39). |
| G-33 | No search on workspace lists | Low | Open | Still open; see the recommendation below. |
| G-34 | Mobile filter is an inline toggle | Low | Open | Still open; see the recommendation below. |
| G-35 | No product image lightbox | Low | Open | Still open; see the recommendation below. |
| G-36 | Specification documents out of sync with code | Low | Open | Still open; see the recommendation below. |
| G-37 | Security review open items affect UI | Medium | Resolved in code | PR #18: nonce-based CSP and Vitest 4 (SR-1, SR-2). |
| G-38 | No returns flow | Medium | Partly resolved | PR #17: supplier return policy shown at checkout. A returns workflow stays planned. |
| G-39 | No production milestones for made-to-order | Low | Open | Still open; see the recommendation below. |
| G-40 | No consolidated payment history | Low | Open | Still open; see the recommendation below. |
| G-41 | Accessibility testing is automated only | Medium | Open | Still open; see the recommendation below. |


## 26.3 Original findings

| ID | Finding | Type | Severity | Priority | Area | Detail | Screens | Recommendation |
|---|---|---|---|---|---|---|---|---|
| G-01 | No buyer dashboard | Missing screen | High | P0 | Buyer | Buyers land on the generic Home (ACC-01) and use the sub-nav; nothing shows payments due, quotes waiting or deliveries to confirm. | BUY-01, ACC-01 | Design BUY-01 from existing list APIs; add a small aggregate endpoint for counts and spend. |
| G-02 | Public information pages and footer missing | Missing screen | Medium | P1 | Public | No About, How it works, Pricing/fees, FAQ, Help centre, Contact, Become a supplier pages and no site footer. The only public non-marketplace page is /status. | PUB-16…PUB-21, PUB-26, PUB-27 | Design with placeholder copy; publish only after founder approves copy and legal pages. |
| G-03 | No invoices, receipts or credit notes | Missing feature | High | P1 | Finance | Founder chose disclosed-intermediary (suppliers invoice buyers; platform invoices suppliers for commission) pending professional approval. Nothing generates documents. | BUY-28, SEL-34, ADM-50 | Design document list and PDF layouts as Blocked until tax approval. |
| G-04 | Tax applied regardless of supplier VAT registration | Doc/code inconsistency | Critical | P0 | Finance | Checkout and quotes apply the tax code to every supplier. Founder: no VAT for unregistered suppliers, support TRNs. Must be fixed before live payments. | BUY-17, SEL-22, ADM-50 | Show tax per supplier with TRN; design "Not VAT registered" state. |
| G-05 | Commission configured by environment variable | Backend without UI | High | P0 | Admin | COMMISSION_BPS env var; founder wants a restricted admin setting, snapshotted per order. Orders already store commission figures. | ADM-47, SEL-28, SEL-32 | Design ADM-47 with effective dates, history and dual control. |
| G-06 | Refund commission reversal uses order total | Doc/code inconsistency | Medium | P1 | Finance | refundCommissionShare uses amount × commission / order total; founder says commission applies to merchandise only and reverses proportionally on merchandise refunds. | ADM-32, SEL-32 | Show refund split (merchandise, delivery, VAT, commission reversal) in refund detail. |
| G-07 | No structured buyer counteroffer | Incomplete journey | Medium | P1 | RFQ | Founder allows counteroffers; build supports revision requests with a note only. | BUY-15, BUY-13, SEL-22 | Design BUY-15; confirm rounds limit (FD-10). |
| G-08 | Supplier cannot cancel a paid order | Incomplete journey | High | P1 | Orders | Only unpaid checkouts can be cancelled (by buyer or expiry). No path when a supplier cannot fulfil. | SEL-36 | Design cancellation with automatic refund request to finance. |
| G-09 | Buyer cannot request cancellation after payment | Incomplete journey | High | P1 | Orders | No cancellation request; buyer must open a dispute or support ticket. | BUY-31 | Design request flow; policy pending legal (FD-09). |
| G-10 | No auto-complete after the dispute window | Doc/code inconsistency | High | P0 | Orders | P5-2: orders complete only when the buyer confirms receipt (copy: "nothing completes automatically"). Founder: auto-complete once the window ends under conditions. | BUY-24, BUY-25, SEL-28 | Design countdown "Completes automatically on …" once FD-03 is decided; update copy ful.no_auto_complete. |
| G-11 | No reorder | Missing interaction | Low | P2 | Buyer | Repeat purchasing is common in B2B; no reorder from past orders. | BUY-30 | Post-launch. |
| G-12 | Reconciliation cases cannot be resolved | Backend without UI | High | P0 | Admin | Cases (late capture, mismatch, unknown reference, invalid signature, refund/payout failed) are created and listed read-only; no resolution API or screen. Copy says "Resolution tools arrive with refunds" (stale). | ADM-30, ADM-31 | Design ADM-31 with dual control; required before live money. |
| G-13 | Payouts are manual at completion, not weekly | Doc/code inconsistency | High | P0 | Finance | P5-5 manual payouts of eligible orders; founder: weekly payouts after the 14-day window with two finance approvers. | ADM-35, SEL-32 | Design weekly batch view ("Next payout run: …") and seller pending/available balances. |
| G-14 | Dispute window starts at receipt confirmation | Doc/code inconsistency | Medium | P0 | Disputes | P5-3: 14 days after the buyer confirms receipt; founder: 14 days after verified delivery. | BUY-27, SHR-02 | Copy must state the start event (founder F07: 14 days after verified delivery; what counts as verified delivery is FD-03). |
| G-15 | No account closure, DSAR, retention or legal hold | Missing feature | High | P1 | Account/Admin | Founder requires these workflows; none exist. | ACC-16, ADM-51 | Design request flows; legal text pending. |
| G-16 | Refund form takes a raw order ID | Unnecessary friction | Medium | P1 | Admin | Finance types an order UUID and optional dispute UUID. | ADM-33 | Start refunds from order (ADM-29) or dispute (ADM-39) with prefilled values and remaining refundable amount. |
| G-17 | No admin storefront detail page | Backend without UI | Low | P2 | Admin | GET /admin/storefronts/{id} exists; UI acts from the list only. | ADM-18 | Add detail page. |
| G-18 | No message attachments | Missing interaction | Medium | P1 | Messaging | Conversations are text only; RFQ, quote and dispute files are separate. | MSG-04 | Design attachment chip with scan state. |
| G-19 | No legal documents; terms version "dev-1" | Missing feature | Critical | P0 | Legal | Founder asked for 12 documents to be drafted for lawyer review. Registration and checkout reference terms that do not exist. | PUB-22…PUB-25, ACC-06, BUY-17 | Design legal page template and versioned acceptance; publish only after lawyer review. |
| G-20 | Mobile navigation issues | Responsive issue | Medium | P1 | All app areas | Screenshots show the header wrapping, seller/buyer sub-nav scrolling horizontally without affordance and bottom-nav labels truncating ("Marketpla ce"). | All workspace screens | Design a mobile nav pattern: 4–5 bottom tabs + "More" sheet; sub-nav as a section picker. |
| G-21 | Quote comparison overflows on mobile | Responsive issue | Medium | P1 | RFQ | Comparison table needs horizontal scroll at 360px. | BUY-10 | Card-per-supplier layout with pinned key figures. |
| G-22 | Quote validity has no default | Doc/code inconsistency | Medium | P1 | RFQ | Founder: default 7 days, supplier-configurable; code requires a date with max 90 days and no default. | SEL-22 | Prefill valid-until = now + 7 days (Dubai) once implemented. |
| G-23 | Support limits and auto-close differ from founder decision | Doc/code inconsistency | Low | P2 | Support | P6-1 20 open tickets per workspace vs founder 10 per company with admin exceptions; P6-2 no auto-close vs auto-close 7 days after resolution; urgent cases must not be blocked. | SHR-04, SHR-05, ADM-43 | Design limit-reached state with "urgent" path and auto-close notice. |
| G-24 | Compliance cannot export verification records | Doc/code inconsistency | Low | P2 | Admin | P6-4 vs founder (compliance exports verification records). | ADM-44 | Add report type per role. |
| G-25 | Review label differs | Doc/code inconsistency | Low | P2 | Reviews | Shown as "Verified buyer"; founder: "verified business buyer". | PUB-10, BUY-26 | Copy change. |
| G-26 | Delivery options limited to a flat fee | Doc/code inconsistency | Medium | P1 | Orders | P4-1 flat fee per order per supplier; founder: supplier-arranged, courier, collection, per-order charges, proof of delivery. | SEL-04, BUY-17, ADM-48 | Design delivery method choice at checkout once FD-08 is decided. |
| G-27 | Stale or misleading copy | Missing error handling | Medium | P1 | Copy | seller.quote.accepted_body ("Orders and payment open in the next release"), finance.reconciliation_note ("Resolution tools arrive with refunds"), home.next.APPROVED and pd.trading.phase_unavailable refer to earlier phases. | SEL-21, ADM-30, ACC-01, PUB-07 | Replace with copy library (section 22). |
| G-28 | No analytics; product views not recorded | Missing feature | Low | P2 | Seller/Admin | Seller and admin analytics are not available; view counts are not stored. | SEL-35, ADM-52 | Post-launch; decide privacy/consent (FD-19). |
| G-29 | No live payment provider or payout onboarding | Blocked | Critical | P0 | Finance | Sandbox adapter only. Stripe Connect preferred, Mamo fallback; needs founder approval of Phase 8B and provider accounts. | FIN-02, SEL-33 | Design provider hand-off and onboarding states generically. |
| G-30 | No bank transfer method | Blocked | Medium | P1 | Finance | Founder listed bank transfer; no flow. | FIN-03 | Design instructions and pending-transfer states. |
| G-31 | Transactional email not production-ready | Blocked | High | P0 | Notifications | Mailpit in development; founder chose Resend with EN/AR templates (not built). 14 email templates exist as plain text. | All notification triggers | Design 17 EN/AR email template families (see section 14). |
| G-32 | No sample request flow | Missing feature | Low | P2 | Discovery | Samples flag and note exist without a request flow. | BUY-32, PUB-07 | Decide scope (FD-13). |
| G-33 | No search on workspace lists | Missing interaction | Low | P2 | Buyer/Seller | Buyer RFQs/orders, seller products/inventory/orders have state filters but no text search. | BUY-02, BUY-23, SEL-06, SEL-15, SEL-27 | Add search fields to the list template. |
| G-34 | Mobile filter is an inline toggle | Responsive issue | Low | P2 | Discovery | Filters expand inline rather than in a sheet with sticky actions. | PUB-05 | Design sheet pattern. |
| G-35 | No product image lightbox | Missing interaction | Low | P2 | Discovery | Gallery thumbnails switch the main image only; no zoom. | PUB-08 | Design lightbox with keyboard and swipe. |
| G-36 | Specification documents out of sync with code | Doc/code inconsistency | Low | P2 | Docs | docs/02–03 route names, docs/05-ui tokens (navy/teal) vs approved palette, docs/09 support reopen rule, docs/10 pool rule superseded by A12, storefront moderation described but storefronts are not pre-moderated. | — | Treat this UX spec and the decision register as current; update docs in a later phase. |
| G-37 | Security review open items affect UI | Security | Medium | P1 | Platform | SR-2: CSP allows unsafe-inline styles (inline style usage); SR-1: test tooling advisory. Design should avoid patterns that need inline styles/scripts. | — | Designers: no third-party embeds or inline scripts; video links open externally. |
| G-38 | No returns flow | Missing feature | Medium | P2 | Orders | Founder asked for a provisional returns policy; only disputes exist. | SEL-37 | Design after policy (FD-09). |
| G-39 | No production milestones for made-to-order | Missing feature | Low | P2 | Orders | Only PROCESSING exists between CONFIRMED and DISPATCHED. | SEL-38 | Optional milestones post-launch. |
| G-40 | No consolidated payment history | Missing screen | Low | P2 | Buyer | Payments visible only inside each checkout. | BUY-29 | Post-launch. |
| G-41 | Accessibility testing is automated only | Accessibility | Medium | P1 | All | axe-core (WCAG 2.1 A/AA tags) passes with no serious/critical issues on tested pages; no manual screen-reader or WCAG 2.2-specific checks (target size, focus not obscured, dragging alternatives). | All | Add WCAG 2.2 AA criteria to design acceptance (section 21). |
