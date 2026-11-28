# 8. Manufacturer (seller) dashboard

Seller routes: `/{locale}/app/seller/[workspaceId]/…`. Sub-nav (`apps/web/src/components/seller-shell.tsx`): Overview, Storefront, Products, Add product, Inventory, Pricing, Quotation requests, Quotes, Orders, Disputes, Finance, Support, Messages, Company settings. The same workspace serves every supplier business type (section 3.2).

Recommended navigation grouping: **Overview** · **Catalogue** (Products, Add product, Inventory, Pricing, Storefront) · **Sales** (Quotation requests, Quotes, Orders, Disputes) · **Finance** · **Messages** · **More** (Support, Company, Team, Settings). Mobile bottom tabs: Overview, Requests, Orders, Catalogue, More.

## 8.1 Dashboard overview (SEL-01, implemented; enhancement recommended)
Implemented content: eligibility alert, storefront status, KPI tiles linking to filtered lists, recent moderation decisions. Recommended additions use data that already exists:

| Metric | Available now? | Source / required work |
|---|---|---|
| Listings live / pending / draft / rejected / suspended | **Yes (shown)** | `GET /seller/workspaces/{ws}/overview` |
| Low stock / out of stock variants | **Yes (shown)** | same |
| Storefront live / hidden | **Yes (shown)** | same |
| Recent moderation decisions | **Yes (shown)** | same |
| Open RFQs to quote (invited / matching, not quoted) | Data yes, not on overview | `GET …/rfqs?scope=` counts; add to overview endpoint |
| Quotes submitted / accepted / declined, win rate | Data yes | `quotes` table aggregates; new endpoint |
| Orders to process (CONFIRMED), to dispatch (PROCESSING), awaiting receipt (DISPATCHED/DELIVERED) | Data yes | `GET …/orders?state=`; add counts |
| Open disputes | Data yes | `GET …/disputes` |
| Paid order value, commission, refunds, net payable | **Yes (on Finance page)** | `GET …/finance` |
| Eligible / held / in payout / paid out | **Yes (on Finance page)** | same |
| Revenue over time (chart) | Data yes, no endpoint | Aggregate orders by Dubai date |
| Product views, storefront views, conversion | **No** | Requires view-event tracking (FD-19) |
| Average rating, review count | Data yes (public storefront) | reuse public review aggregate |
| Response time to RFQs | Data yes (timestamps) | New aggregate |
| Next payout date | Rule yes (FD-04: Monday 10:00 Dubai, next working day after public holidays) | Show from the payout run; ADM-47 makes the schedule configurable |
| Cancellation requests to review | Planned (founder Q12) | Count of open buyer requests (SEL-41) |
| Counteroffers waiting | Planned (FD-10) | Count of open counteroffers (SEL-40) |
| Sample requests | Planned (FD-13) | Count of open SAMPLE RFQs |

## 8.2 Business verification (ACC-03…ACC-07)
Same company screens as buyers. Seller-specific consequence: "Listing is paused: {reason}" until APPROVED with valid licence; storefront publish blocked; trading capabilities removed when not ACTIVE.

## 8.3 Company profile and manufacturing capabilities (SEL-02)
Storefront fields: business type, description EN/AR (≤4000), year established (1900–2100), city, specialisation EN/AR (≤300), capabilities EN/AR (≤2000), production capacity (≤200), custom manufacturing, private label, white label, samples available, fulfilment EN/AR (≤1000), certifications (≤20). Legal company data (licence, TRN, address) lives in the company profile, not the storefront.

## 8.4 Digital storefront (SEL-02…SEL-05)
Edit, media by kind (LOGO, COVER, FACTORY, WAREHOUSE, OTHER, captions EN/AR), return policy EN/AR shown to buyers before they pay (PR #17), delivery terms, publish / take offline. Delivery terms (SEL-04) move from one flat fee to a fee per emirate with each of the seven emirates switchable, free buyer collection with secure instructions, and quotation-agreed charges (FD-08, C-10 being built). Storefronts are not pre-moderated; admins can hide with a reason ("Hidden by the marketplace team").

## 8.5 Product catalogue, creation and editing (SEL-06…SEL-14)
Lifecycle tabs; create draft; content with category attributes; specifications (≤40); materials; dimensions; country of origin (2-letter code); lead time min/max (0–365 days); dispatch days; customisation flags; certifications; video (YouTube/Vimeo); images (≤12); variants (SKU codes, attributes, unit); submit for review; history. Edits to a live listing create a new version that goes through moderation while the approved version stays live. Arabic content is optional (FD-18); the editor shows which fields have no Arabic text and buyers on the Arabic site see "Arabic description not provided by the supplier". Sample settings per product: free, paid or not available, maximum quantity and lead time (SEL-39, FD-13).

## 8.6 Product categories (selection)
Sellers pick a leaf category; BLOCKED categories are not selectable; REVIEW_REQUIRED categories show supplier requirements and need certification details.

## 8.7 Product specifications
Category attributes (typed, some filterable by buyers) plus free specification rows (label/value).

## 8.8 Minimum order quantities and pricing structures (SEL-11, SEL-19)
Per SKU: price type FIXED (one tier at MOQ), TIERED (2–10 tiers, first at MOQ, ascending quantities reachable by the increment, non-increasing prices) or QUOTE_ONLY (no price; RFQ only). MOQ ≥1, order increment ≥1. Prices are AED excluding VAT, entered with up to 2 decimals and stored as integer fils. Changes are live immediately and audited.

## 8.9 Production capacity and lead times
Storefront "production capacity" (free text) and per-product lead time min/max and dispatch days. Made-to-order products cannot be added to cart; buyers must request a quotation.

## 8.10 Incoming quotation requests (SEL-20, SEL-21)
Scopes All, Invited, Matching, Quoted; search by title or reference; deadline; invited badge; own quote state; "Sample request" badge (FD-13); "Counteroffer waiting" badge (FD-10). Public requests are labelled "Matching suppliers" (FD-11).

## 8.11 Quotation creation and management (SEL-22…SEL-26)
Draft → submit (immutable version) → revise (new version supersedes) → withdraw. Validity defaults to 7 days, minimum 1, maximum 90 (FD-12). Buyer counteroffers are answered with a new revision or declined, three rounds at most (SEL-40, FD-10). See section 11.

## 8.12 Customer communication (MSG-01…MSG-03, SEL-25)
OWNER and SALES only. Sellers cannot start a conversation from nothing; they reply to buyers or ask a question on an RFQ.

## 8.13 Order management (SEL-27, SEL-28)
List with state filter; detail with commission and payable rows, settlement state (Not yet eligible, Held, Eligible), delivery verified and dispute window lines, invoice draft with commission draft, "Cancel order" before dispatch (SEL-36, finance-approved full refund) and, when planned work lands, buyer cancellation requests to review (SEL-41).

## 8.14 Production progress (SEL-38 recommended)
Only the PROCESSING state exists ("Start processing"). Milestones are a recommendation.

## 8.15 Fulfilment management (SEL-29, SEL-30)
Record dispatch (carrier, tracking, expected delivery; full shipment only), report delivery with proof. A clean proof file verifies delivery and starts the 14-day dispute window; without proof the window starts when the buyer confirms receipt (FD-03). Contested or suspicious proof is reviewed by the platform (ADM-59). With C-10, proof of dispatch and tracking become required for courier deliveries and collection orders record "Collected by buyer".

## 8.16 Revenue tracking, earnings, payouts, financial statements (SEL-32…SEL-34)
Finance page: Paid order value, Platform commission (versioned rate, 10% default on merchandise excluding VAT and delivery, changed only by a finance approver with 30 days' notice, FD-05), Refunded to buyers, Net payable, and buckets Not yet eligible (awaiting verified delivery and the end of the dispute window), Eligible for payout, Held (dispute, hold, reconciliation or pending refund), In payout, Paid out; payouts table. Payouts are weekly: the run opens on Monday at 10:00 Dubai time, the next working day after UAE public holidays, with no minimum amount at launch (FD-04). Payout account onboarding and statements are blocked (provider, tax). Everything is sandbox-labelled.

## 8.17 Performance analytics (SEL-35 planned)
See metrics table above; product views require new first-party tracking only (FD-19: no paid or third-party analytics).

## 8.18 Notifications, disputes, support, account settings
Notification centre (rfq.invited, rfq.matched, quote.*, order.received, order.completed, order.refunded, dispute.*, payout.*, support.*), disputes (SHR-01/02, SEL-31), support (SHR-03…06), settings (ACC-13).
