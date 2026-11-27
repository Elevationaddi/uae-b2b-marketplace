# Manufacturer / supplier workspace
Base `/seller`. A company may be supplier, manufacturer or both. Ready stock and made-to-order are listing fulfilment modes, not separate accounts. Mobile companion can prioritize orders, RFQs, messages; web is primary.

| Route | Content and actions | Rules / results |
|---|---|---|
| /dashboard | New orders, open RFQs, pending shipments, low stock, paid sales, payout status | Server-derived figures with date range; quick links to actual tasks |
| /storefront | Logo, cover, company info, capabilities, certifications, policies | Save draft, preview, submit moderation; approved version remains until approved replacement |
| /products | Search/filter listings by status, category, stock, mode | Create, edit, duplicate as draft, archive; no deletion of referenced SKU |
| /products/new | Title EN/AR, category, description, images, attributes, variants/SKU, fulfilment mode, MOQ, unit, price tiers, lead time, tax classification, samples | Validate unique seller SKU, positive MOQ, ascending tiers, nonnegative prices, approved category, image scan; submit for review |
| /products/:id/edit | Editable listing draft, moderation history | Material edits require review; prices/stock can update via audited permitted operations; snapshot old order data |
| /inventory | On hand, reserved, available, low stock threshold, restock date | Adjust on-hand with reason; cannot reduce below reservations; stock movement audit; made-to-order uses lead time not stock |
| /rfqs | Eligible pool and direct invitations, category/deadline filter | View eligible RFQ, ask question, save, draft quote; cannot see competitor bids |
| /quotes | Draft/submitted/revised/accepted/withdrawn quote list | Revise creates version, withdraw before acceptance, expired/accepted read-only |
| /rfqs/:id/quote | Line specs, quantity, unit price, tax, shipping, delivery date, validity, notes, attachments | Server totals; match RFQ requirements or explicitly flag deviations; no sending after RFQ deadline |
| /orders | Seller-specific orders, fulfilment states, payment status | View paid orders; confirm preparation, report inability to fulfil; cannot alter payment status |
| /orders/:id | Item snapshots, delivery address, packing slip, invoice, timeline | Record shipment quantities/carrier/tracking, proof, delays; paid orders only; return requests go to case |
| /production | Custom order list, agreed specs and delivery dates | MVP preparation/dispatch; phase 2 sample approval, milestones, QC and change orders; no unilateral term change |
| /shipping | Pending shipments, tracking and proof of delivery | Create/update permitted shipments; manual carrier entry with validation; partial shipments phase 2 |
| /returns | Cases, evidence, inspection, proposed resolution | Respond to case, upload proof; no direct arbitrary refund |
| /finance | Gross sales, refunds, fees, net due, payout records, reconciliation export | Seller finance/owner only; provider onboarding link; mask bank info; no editable balance |
| /analytics | Views, RFQ response, conversion, sales by SKU/date | MVP basic sales and order metrics; enhanced funnel phase 2; only own data |
| /messages | Buyer conversations and order/RFQ links | Reply, attach files, mark read/report; participant checks |
| /settings/team | Invite staff, permissions, active sessions | Owner only; role change logged |
| /settings/company | Trade licence, business info, settlement readiness, terms | Resubmit material changes; no direct bank account storage |
| /settings/plan | Entitlements, listing usage, invoice history | MVP free sandbox; paid plan features disabled until approved |

Seller roles: owner full seller operations, sales catalog/quotes/messages, warehouse inventory/fulfilment, finance invoices/payout read and onboarding, viewer read-only. Owner can grant only company roles. Supplier approval and payout readiness are separate; production checkout requires provider seller eligibility. Listing moderation does not validate physical quality; verified badge refers to business verification only.
