# 7. Buyer dashboard and buyer experience

Buyer workspace routes live under `/{locale}/app/buyer/[workspaceId]/…`. Navigation today: global app header (Home, Company, Team, RFQs, Messages, Notifications, Marketplace, Settings) plus the buyer sub-nav from `apps/web/src/components/buyer-shell.tsx`: **Cart** (purchase roles only), **Orders**, **Disputes**, **Support**, **RFQs**, **New request** (purchase roles only), **Addresses**, **Messages**, **Marketplace**, **Company settings**. There is **no buyer dashboard page** (gap G-01); buyers land on the Home hub (ACC-01).

Recommended buyer navigation (design target): Dashboard · Marketplace · Requests (RFQs) · Orders · Cart · Messages · More (Disputes, Support, Addresses, Payments, Invoices, Company, Team, Settings). On mobile: bottom tabs Dashboard, Marketplace, Requests, Orders, More.

## 7.1 Dashboard overview (BUY-01, recommended)
| Block | Data (source) | Indicator | Action |
|---|---|---|---|
| Verification banner | Company status, licence expiry (`/companies/{id}`) | Status badge; "Licence expires on …" warning 30 days before | Open company profile |
| Payments due | Checkouts PENDING_PAYMENT with pay-by (needs list endpoint or orders AWAITING_PAYMENT) | Count + earliest deadline countdown (Dubai) | Pay now |
| Quotes to review | RFQs OPEN with new quotes (`GET …/rfqs`, quote counts) | Count | Open RFQ |
| Deliveries to confirm | Orders DISPATCHED/DELIVERED (`GET …/orders?state=`) | Count | Confirm receipt |
| Open disputes | `GET …/disputes` (state ≠ CLOSED) | Count, "Awaiting evidence" flag | Open dispute |
| Support waiting for you | `GET /workspaces/{ws}/support` WAITING_CUSTOMER | Count | Reply |
| Recent orders | Last 5 orders | State badges | View all |
| Spend this month (optional) | New aggregate endpoint (FD-21) | AED, sandbox-labelled | — |
Empty first-use state: "Welcome. Start by searching the marketplace or posting a request for quotation." with two CTAs. VIEWER sees the same blocks without purchase CTAs.

## 7.2 Marketplace browsing, manufacturer discovery and product discovery
Uses the public marketplace (PUB-01…PUB-10) inside the signed-in header; buyers see prices, save, compare and trade actions. See section 10.

## 7.3 Saved products and manufacturers (PUB-11)
Two tabs (Products, Suppliers); cards with remove; unavailable items show "This listing is no longer available." Saved lists are per **user**, not per workspace.

## 7.4 Requests for quotation (BUY-02…BUY-09)
List with state tabs (All, Draft, Open, Awarded, Cancelled, Expired); columns reference, title, category, quantity, deadline, quotes, state. Create, edit draft, publish, cancel, invite suppliers. Full detail in section 11.

## 7.5 Quotation comparison (BUY-10…BUY-15)
Comparison table with lowest-total marker, details, versions, accept / revision / decline; counteroffer planned.

## 7.6 Active orders and previous orders (BUY-23)
Single list with state filter today. Recommended split: **Active** (AWAITING_PAYMENT, CONFIRMED, PROCESSING, DISPATCHED, DELIVERED) and **Past** (COMPLETED, CANCELLED) tabs. Columns: order number, supplier, source (Catalogue order / From quotation), created (Dubai), total (AED), state. Search by order number (recommended, G-33).

## 7.7 Order tracking (BUY-24)
Status header with next-step sentence per state (section 12), recommended **stepper** (Paid → Processing → Dispatched → Delivered → Completed), fulfilment card (carrier, tracking reference, expected delivery, delivery note, proof download), timeline.

## 7.8 Payments (BUY-18; history BUY-29 recommended)
Checkout page shows payment attempts (Created, With provider, Captured, Failed, Cancelled) and pay-by deadline. A consolidated payment history is recommended. All amounts sandbox-labelled until a live provider is approved.

## 7.9 Invoices (BUY-28, blocked)
Not available. Design the list (invoice number, supplier, supplier TRN, order, issue date, amount, VAT, PDF) as blocked until the tax model is approved (FD-06).

## 7.10 Disputes (SHR-01, SHR-02, BUY-27)
List and detail with messages and evidence; open from order detail within the window.

## 7.11 Refunds
No separate buyer refund screen. Refunds appear on the order ("Refunded so far") and in the dispute ("Refunds" with state). Buyers cannot request a refund directly; it comes from a dispute resolution or finance (gap G-09 for cancellation requests).

## 7.12 Messaging (MSG-01…MSG-03)
Conversations with suppliers, unread badge in header, started from storefront or RFQ. OWNER and PROCUREMENT only.

## 7.13 Notifications (ACC-14)
Notification centre with unread filter and "Mark all as read"; header badge refreshes every 60 seconds. Events in section 14.

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
