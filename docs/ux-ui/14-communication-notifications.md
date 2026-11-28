# 14. Communication and notifications

Channels: **in-app and email only** (FD-20). No SMS or WhatsApp; no paid notification services.

## 14.1 In-app messaging (implemented)
- **Who:** buyer OWNER/PROCUREMENT and seller OWNER/SALES (`messaging` capability); sending is trading-gated (approved, ACTIVE workspace). VIEWER, WAREHOUSE and FINANCE have no messages.
- **Start:** buyer from a storefront ("Message supplier", MSG-03); seller from a visible RFQ ("Ask the buyer a question", SEL-25). One conversation per buyer–seller pair (and RFQ context), "start or continue".
- **Conversations list (MSG-01):** counterpart company, last message preview, time, unread count; ordered by last message.
- **Thread (MSG-02):** messages with side, time; composer (1–4000 characters; 60 messages per user per minute); read marker moves forward when viewed; refreshes every 15 seconds while open.
- **Attachments:** **not supported** (MSG-04 planned, G-18). RFQ, quote and dispute files are separate.
- **Unread indicators:** header Messages badge from `GET /notifications/unread` (messages count), conversation unread counts.

## 14.2 Notification centre (ACC-14)
List of the user's notifications newest first; unread marker; "Unread only" filter; "Mark as read", "Mark all as read"; each item links to an internal path; header badge refreshes every 60 seconds. Empty: "You have no notifications."

## 14.3 Notification preferences (ACC-13)
Email categories per user: **RFQs** (default on), **Quotes and orders** (default on; also covers order, dispute and payout events), **Messages** (default off), **Marketing** (opt-in only, consent time recorded). In-app notifications are always on; support replies and security/account emails are always sent.

## 14.4 Events, triggers and recipients

| Type | Trigger | Recipients | Email category | Opens |
|---|---|---|---|---|
| rfq.invited | Buyer publishes an RFQ with this supplier invited | Invited seller workspace: OWNER, SALES | RFQs (default on) | SEL-21 |
| rfq.matched | Buyer publishes a POOL RFQ in a category where the seller has public listings | Eligible seller workspaces: OWNER, SALES | RFQs | SEL-21 |
| rfq.question | Seller asks the buyer a question on an RFQ | Buyer workspace: OWNER, PROCUREMENT | RFQs | MSG-02 |
| rfq.cancelled | Buyer cancels an RFQ | Seller workspaces that were invited or quoted: OWNER, SALES | RFQs | SEL-21 |
| rfq.expired | RFQ deadline passes without award | Buyer (and quoting sellers) | RFQs | BUY-05 |
| rfq.awarded_other | Buyer accepts another supplier's quote | Other quoting sellers: OWNER, SALES | RFQs | SEL-21 |
| quote.submitted | Seller submits a quote | Buyer workspace: OWNER, PROCUREMENT | Quotes and orders (default on) | BUY-05 |
| quote.revised | Seller submits a revision | Buyer workspace: OWNER, PROCUREMENT | Quotes and orders | BUY-05 |
| quote.withdrawn | Seller withdraws a quote | Buyer workspace: OWNER, PROCUREMENT | Quotes and orders | BUY-05 |
| quote.revision_requested | Buyer requests a revision | Seller workspace: OWNER, SALES | Quotes and orders | SEL-21 |
| quote.declined | Buyer declines a quote | Seller workspace: OWNER, SALES | Quotes and orders | SEL-21 |
| quote.accepted | Buyer accepts a quote | Seller workspace: OWNER, SALES; other buyer members | Quotes and orders | SEL-21 / BUY-05 |
| quote.expired | Quote validity passes | Buyer and seller | Quotes and orders | BUY-05 |
| message.new | New conversation message | Counterparty messaging roles | Messages (default off) | MSG-02 |
| order.paid | Provider confirms payment (webhook) | Buyer workspace: OWNER, PROCUREMENT | Quotes and orders | BUY-24 |
| order.received | Provider confirms payment | Seller workspace: OWNER, SALES, WAREHOUSE, FINANCE | Quotes and orders | SEL-28 |
| order.cancelled | Checkout expires or is cancelled; full refund cancels | Buyer workspace: OWNER, PROCUREMENT | Quotes and orders | BUY-24 |
| order.payment_due | Payment reminder (type defined; no emitter found in code — recommended before deadline) | Buyer workspace: OWNER, PROCUREMENT | Quotes and orders | BUY-18 |
| order.dispatched | Seller records dispatch | Buyer workspace: OWNER, PROCUREMENT | Quotes and orders | BUY-24 |
| order.delivered | Seller reports delivery | Buyer workspace: OWNER, PROCUREMENT | Quotes and orders | BUY-24 |
| order.completed | Buyer confirms receipt | Seller workspace order roles | Quotes and orders | SEL-28 |
| order.refunded | Provider confirms a refund | Buyer OWNER, PROCUREMENT; seller OWNER, SALES, WAREHOUSE, FINANCE | Quotes and orders | BUY-24 / SEL-28 |
| dispute.opened | Buyer or seller opens a dispute | Other party's acting roles | Quotes and orders | SHR-02 |
| dispute.updated | New message, evidence request, proposal or closure | Both parties | Quotes and orders | SHR-02 |
| payout.paid | Provider confirms a payout | Seller workspace: OWNER, FINANCE | Quotes and orders | SEL-32 |
| payout.failed | Provider reports payout failure | Seller workspace: OWNER, FINANCE | Quotes and orders | SEL-32 |
| support.replied | Support agent replies | Ticket workspace members | Always emailed | SHR-05 |
| support.resolved | Support resolves the ticket | Ticket workspace members | Always emailed | SHR-05 |


Order-related email notifications are sent through the generic "activity" email (subject = notification summary) when the recipient's category is enabled and their email is verified.

New events from the founder answers (to add with the planned screens; in-app and email):

| Event | Trigger | Recipients | Opens |
|---|---|---|---|
| counteroffer.received | Buyer sends a counteroffer (BUY-15) | Supplier OWNER, SALES | SEL-21 / SEL-40 |
| counteroffer.answered | Supplier submits a revision or declines (SEL-40) | Buyer OWNER, PROCUREMENT | BUY-05 / BUY-34 |
| sample.requested | Buyer sends a sample request (BUY-32) | Supplier OWNER, SALES | SEL-21 |
| order.cancellation_requested | Buyer asks to cancel (BUY-31) | Supplier OWNER, SALES | SEL-28 / SEL-41 |
| order.cancellation_decided | Supplier decides (SEL-41) | Buyer OWNER, PROCUREMENT | BUY-24 |
| order.supplier_cancellation | Supplier cancels (SEL-36); finance decides | Buyer; supplier on decision | BUY-24 / SEL-28 |
| delivery.verified | Proof or receipt verifies delivery | Buyer and supplier | BUY-24 / SEL-28 |
| order.auto_completed | Window ends without issues | Buyer and supplier | BUY-24 / SEL-28 |
| delivery.review_decided | Admin decides on contested proof (ADM-59) | Buyer and supplier | BUY-24 / SEL-28 |
| commission.notice | New commission version, 30 days before it applies (FD-05) | Supplier OWNER, FINANCE | SEL-32 |
| policy.reacceptance_required | Material change to a legal policy (FD-16) | All users | ACC-18 |

## 14.5 System emails (worker templates, EN/AR plain text today)

| Template | Trigger | Recipient | Status |
|---|---|---|---|
| verify_email | Registration / resend | The registering user | Implemented (plain text EN/AR) |
| account_exists | Sign-up attempt with an existing email (enumeration-safe) | Account owner | Implemented |
| password_reset | Forgot password | User | Implemented |
| password_changed | Password changed | User | Implemented |
| invitation | Owner invites a member | Invitee | Implemented |
| verification_submitted | Company submitted for verification | Company owners | Implemented |
| verification_decided | Approved / needs info / rejected | Company owners | Implemented |
| licence_expiring | Licence expiry approaching (worker) | Company owners | Implemented |
| licence_expired | Licence expired; trading restricted | Company owners | Implemented |
| company_suspended | Compliance suspension | Company owners | Implemented |
| company_reactivated | Reactivation | Company owners | Implemented |
| catalog_decision | Listing approved / rejected / changes requested | Seller OWNER, SALES | Implemented |
| listing_enforcement | Listing suspended / restored / removed | Seller OWNER, SALES | Implemented |
| storefront_enforcement | Storefront hidden / restored | Seller OWNER, SALES | Implemented |
| activity | Every in-app notification above when the email category is on | Recipients of the notification | Implemented (generic summary) |
| Branded HTML templates (17 families, EN/AR, Resend) | Founder decision 3; production email | All | Blocked (Phase 8) |


## 14.6 Email design requirements (Resend, EN/AR; templates prepared without real sending until the founder approves)
17 template families to design (bilingual, RTL for Arabic, text-only fallback, no tracking pixels without consent): verify email, sign-up attempt, password reset, password changed, invitation, verification submitted, verification decided (approved / needs info / rejected variants), licence expiring, licence expired, company suspended / reactivated, listing decision, listing/storefront enforcement, RFQ and quote activity, order activity (paid, received, dispatched, delivered, completed, cancelled, refunded), dispute activity, payout activity, support reply/resolved. Layout: text logo placeholder, one-sentence summary, key facts table, one primary button (link to the exact screen), footer with preferences link (for non-transactional categories) and support link.
