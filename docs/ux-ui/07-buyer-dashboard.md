# 7. Buyer dashboard and buyer experience

Buyer workspace routes live under `/{locale}/app/buyer/[workspaceId]/…`. Navigation today: global app header (Home, Company, Team, RFQs, Messages, Notifications, Marketplace, Settings) plus the buyer sub-nav from `apps/web/src/components/buyer-shell.tsx`: **Cart** (purchase roles only), **Orders**, **Disputes**, **Support**, **RFQs**, **New request** (purchase roles only), **Addresses**, **Messages**, **Marketplace**, **Company settings**. There is **no buyer dashboard page yet** (gap G-01); buyers land on the Home hub (ACC-01). The founder approved a buyer dashboard with operational counts and monthly spending in AED (FD-21, answer B), so BUY-01 and BUY-33 are Planned P0.

Recommended buyer navigation (design target): Dashboard · Marketplace · Requests (RFQs) · Orders · Cart · Messages · More (Disputes, Support, Addresses, Payments, Invoices, Company, Team, Settings). On mobile: bottom tabs Dashboard, Marketplace, Requests, Orders, More.

## 7.1 Dashboard overview (BUY-01, planned: FD-21)
| Block | Data (source) | Indicator | Action |
|---|---|---|---|
| Verification banner | Company status, licence expiry (`/companies/{id}`) | Status badge; "Licence expires on …" warning 30 days before | Open company profile |
| Payments due | Checkouts PENDING_PAYMENT with pay-by (needs list endpoint or orders AWAITING_PAYMENT) | Count + earliest deadline countdown (Dubai) | Pay now |
| Quotes to review | RFQs OPEN with new quotes (`GET …/rfqs`, quote counts) | Count | Open RFQ |
| Deliveries to confirm | Orders DISPATCHED/DELIVERED (`GET …/orders?state=`) | Count; dispute window end date per order | Confirm receipt (records delivery only, FD-02) |
| Cancellation requests | Orders with an open buyer cancellation request (planned, BUY-31) | Count, "Waiting for supplier" | Open order |
| Counteroffers waiting | Negotiations with a supplier revision after your counteroffer (planned, BUY-34) | Count | Review revision |
| Open disputes | `GET …/disputes` (state ≠ CLOSED) | Count, "Awaiting evidence" flag | Open dispute |
| Support waiting for you | `GET /workspaces/{ws}/support` WAITING_CUSTOMER | Count | Reply |
| Recent orders | Last 5 orders | State badges | View all |
| Monthly spending (BUY-33) | New aggregate endpoint `GET …/spending` (FD-21) | Net spend in AED this month and trend over 3, 6 or 12 Dubai calendar months; sandbox-labelled | Open spending; open orders for a month |
Empty first-use state: "Welcome. Start by searching the marketplace or posting a request for quotation." with two CTAs. VIEWER sees the same blocks without purchase CTAs.

## 7.1a Monthly spending (BUY-33, planned: FD-21)
| Element | Content |
|---|---|
| Period | Last 3, 6 or 12 months (Dubai calendar months); default 6 |
| Chart | One bar per month: net spend = paid order totals minus refunds, in AED, from the server; accessible data table alternative; months without spend show AED 0.00 |
| Breakdown table | Month, orders, merchandise, delivery, VAT, refunds, net spend |
| Top suppliers and categories | Top 5 by net spend in the period |
| Filters | Supplier, category |
| Export | CSV for OWNER and PROCUREMENT, logged |
| Note | "Figures include only orders paid through the platform. Sandbox amounts are test data." |
No budget or forecast features are implied; only figures the API returns are shown.

## 7.2 Marketplace browsing, manufacturer discovery and product discovery
Uses the public marketplace (PUB-01…PUB-10) inside the signed-in header; buyers see prices, save, compare and trade actions. See section 10.

## 7.3 Saved products and manufacturers (PUB-11)
Two tabs (Products, Suppliers); cards with remove; unavailable items show "This listing is no longer available." Saved lists are per **user**, not per workspace.

## 7.4 Requests for quotation (BUY-02…BUY-09)
List with state tabs (All, Draft, Open, Awarded, Cancelled, Expired); columns reference, title, category, quantity, deadline, quotes, state. Create, edit draft, publish, cancel, invite suppliers. Full detail in section 11.

## 7.5 Quotation comparison (BUY-10…BUY-15)
Comparison table with lowest-total marker, details, versions, accept / revision / decline. Structured counteroffers (FD-10, answer C): up to three rounds per supplier with proposed unit price, quantity, delivery date, customisation changes and notes (BUY-15); full negotiation history with changed fields highlighted (BUY-34); only the latest eligible revision can be accepted. Quote validity defaults to 7 days, allowed 1–90 (FD-12).

## 7.5a Sample requests (BUY-32, planned: FD-13)
"Request a sample" appears on products and storefronts where the supplier offers samples (SEL-39). It creates a sample request, a dedicated RFQ type sent privately to that supplier, who answers with a sample quotation (free = AED 0, or a price). Accepting and paying reuse the normal quotation and checkout screens.

## 7.6 Active orders and previous orders (BUY-23)
Single list with state filter today. Recommended split: **Active** (AWAITING_PAYMENT, CONFIRMED, PROCESSING, DISPATCHED, DELIVERED) and **Past** (COMPLETED, CANCELLED) tabs. Columns: order number, supplier, source (Catalogue order / From quotation), created (Dubai), total (AED), state. Search by order number (recommended, G-33).

## 7.7 Order tracking (BUY-24)
Status header with next-step sentence per state (section 12), recommended **stepper** (Paid → Processing → Dispatched → Delivered → Completed), fulfilment card (carrier, tracking reference, expected delivery, delivery note, proof download), "Delivery verified {date} (proof of delivery | buyer confirmed receipt)", "Dispute window: open until {date}", delivery method and charge snapshot, collection instructions for collection orders (BUY-36), invoice draft (BUY-37), timeline.

## 7.7a Delivery or collection at checkout (BUY-35, planned: FD-08)
Per supplier: delivery to the address emirate at that supplier's fee, or free collection where offered (address and instructions shown only after payment); quote orders use the delivery charge agreed in the quotation. Emirates a supplier does not serve are shown disabled with the reason.

## 7.7b Buyer cancellation requests (BUY-31, planned: founder Q12)
After payment and before dispatch the buyer can request cancellation with a reason. Ready stock goes to the supplier and then finance for a refund; made-to-order items are reviewed against production status, quote terms, the disclosed policy and committed costs, with no automatic refund. The order shows "Cancellation requested" until decided.

## 7.8 Payments (BUY-18; history BUY-29 recommended)
Checkout page shows payment attempts (Created, With provider, Captured, Failed, Cancelled) and pay-by deadline. A consolidated payment history is recommended. All amounts sandbox-labelled until a live provider is approved.

## 7.9 Invoices (BUY-28 blocked; drafts BUY-37 implemented)
Each paid order has a non-binding invoice draft ("Draft for review only. This is not a tax invoice…", PR #14). The binding invoice list (invoice number, supplier, supplier TRN, order, issue date, amount, VAT, PDF) stays blocked until the tax adviser approves (FD-06: disclosed-intermediary model).

## 7.10 Disputes (SHR-01, SHR-02, BUY-27)
List and detail with messages and evidence; open from order detail within the window.

## 7.11 Refunds
No separate buyer refund screen. Refunds appear on the order ("Refunded so far") and in the dispute ("Refunds" with state). Buyers cannot request a refund directly; it comes from a dispute resolution, a supplier cancellation, an accepted buyer cancellation request (planned, BUY-31) or finance. Every refund needs a requester and a different approver (FD-01).

## 7.12 Messaging (MSG-01…MSG-03)
Conversations with suppliers, unread badge in header, started from storefront or RFQ. OWNER and PROCUREMENT only.

## 7.13 Notifications (ACC-14)
Notification centre with unread filter and "Mark all as read"; header badge refreshes every 60 seconds. Events in section 14. Channels are in-app and email only (FD-20).

## 7.14 Customer support (SHR-03…SHR-06)
Tickets with topics; linked order or RFQ.

## 7.15 Company profile (ACC-03, ACC-04)
Status, details, documents, verification history, renewal.

## 7.16 Account settings (ACC-13)
Profile, language, password, notification preferences, sessions.

## 7.17 Indicators and tables used across the buyer experience
- Status badges for RFQ, quote, checkout, payment, order, dispute, support states (section 16) with icon + text.
- Deadline indicators always in Dubai time with "(Dubai time)" suffix where a time is entered.
- Money in AED with two decimals, from server fils values (never computed in the browser).
- Tables collapse to cards below 720px (section 19).
