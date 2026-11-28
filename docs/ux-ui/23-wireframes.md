# 23. Low-fidelity wireframe specifications

Functional structure only; no final styling. Widths: desktop 1440, mobile 360. `[Button]` primary, `(Button)` secondary, `{badge}`, `▢` image, `☐` checkbox, `◉` radio, `▾` select. Arabic layouts mirror horizontally (section 20). Logo is always the text placeholder **Manufacturers Marketplace**.

## W-01 Marketplace home (PUB-01)
```
DESKTOP
┌──────────────────────────────────────────────────────────────────────────────┐
│ Manufacturers Marketplace   [ Search products, suppliers, categories    🔍 ]  │
│                                              (Sign in) [Create account] العربية│
├──────────────────────────────────────────────────────────────────────────────┤
│ Categories  Suppliers  Saved  Compare  Recently viewed                        │
├──────────────────────────────────────────────────────────────────────────────┤
│ {Sandbox banner – development only}                                           │
│ HERO  H1 Source from verified UAE suppliers                                   │
│       1,240 products from 86 verified suppliers   [Search]  (Request a quote) │
│ ── Featured categories ───────────────────────────────────── View all ›       │
│ ▢ Packaging  ▢ Food & bev.  ▢ Building  ▢ Textiles  ▢ Chemicals  ▢ …          │
│ chips: All categories (count) …                                               │
│ ── Featured products ─────────────────────────────────────── View all ›       │
│ [card][card][card][card][card]                                                │
│ ── Verified manufacturers ────────────────────────────────── View all ›       │
│ [supplier card][supplier card][supplier card]                                 │
│ ── New arrivals ── [card][card][card][card]                                   │
│ ── How it works (rec.) ── 1 Verify  2 Source/RFQ  3 Pay & receive             │
│ ── Become a supplier (rec.) ── [Start selling]                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ FOOTER (rec.) Marketplace | Company | Support | Legal | language | ©          │
└──────────────────────────────────────────────────────────────────────────────┘
MOBILE: header (logo, account icon) → full-width search → chip nav (scroll) →
hero (stacked) → category tiles 2-up → horizontal card rows → footer accordions.
```

## W-02 Search results (PUB-04/PUB-05)
```
┌ header + search ─────────────────────────────────────────────────────────────┐
│ Breadcrumb: Marketplace › Search "steel shelving"                             │
├───────────────┬──────────────────────────────────────────────────────────────┤
│ FILTERS       │ 312 results   Sort ▾ Relevance   [▦ Grid][≣ List]            │
│ Category ▾    │ Active: (Dubai ×) (Ready stock ×)            Clear all        │
│ Product type  │ ┌card┐┌card┐┌card┐┌card┐                                      │
│ ◉ Any ◯ Ready │ │ ▢  ││ ▢  ││ ▢  ││ ▢  │  title · supplier ✓ · AED from …     │
│ Supplier type │ └────┘└────┘└────┘└────┘  MOQ · lead time · {Ready stock}     │
│ ☐ Manufacturer│ …                                                             │
│ Emirate ☐ …   │                [Show more results]                            │
│ Price (AED)   │                                                               │
│ MOQ up to     │ Guest note: "Price filters are available after signing in…"   │
│ Lead time ≤   │                                                               │
│ ☐ In stock    │                                                               │
│ ☐ Custom mfg  │                                                               │
│ Attributes…   │                                                               │
└───────────────┴──────────────────────────────────────────────────────────────┘
MOBILE: results bar with (Filters 2) (Sort) buttons → sheet with groups and
sticky [Show 312 results] (Clear all); cards 2-up grid or 1-up list.
```

## W-03 Product detail (PUB-07)
```
│ Breadcrumb Marketplace › Packaging › Corrugated boxes                         │
├─────────────────────────────────┬────────────────────────────────────────────┤
│ ▢ main image                    │ H1 Double-wall carton 40×30×30              │
│ ▢▢▢▢ thumbnails  (video link ↗) │ Supplier name ✓ Verified · Dubai            │
│                                 │ {Ready stock} {In stock}                    │
│                                 │ Price tiers: 100–499 AED 4.20 | 500+ 3.90   │
│                                 │ Variant ▾   Quantity [-][ 100 ][+]          │
│                                 │ "Minimum 100, in steps of 50"               │
│                                 │ Estimate: AED 420.00 excl. VAT              │
│                                 │ [Add to cart]  (Request quotation)          │
│                                 │ (♡ Save) (⇄ Compare)                        │
│                                 │ disabled reason text when not allowed       │
├─────────────────────────────────┴────────────────────────────────────────────┤
│ Key facts: MOQ · Lead time · Dispatch · Origin · Materials · Dimensions      │
│ Description │ Attributes │ Specifications │ Certifications (declared)        │
│ Supplier card [Visit storefront] (Message)                                   │
│ Related products [card][card][card][card]                                    │
MOBILE: swipe gallery → title/supplier → price tiers → accordions →
sticky bottom bar: AED estimate + [Add to cart] / (Quote).
```

## W-04 Supplier storefront (PUB-10)
```
│ ▢ cover image (16:5)                                                          │
│ ▢logo  Company name ✓ Verified since Mar 2026 · Manufacturer · Sharjah        │
│        Established 2008   ★ 4.6 (23)    [Request quotation] (Message) (♡)     │
│ Tabs: About | Capabilities | Factory & warehouse | Products | Reviews         │
│ About text · Specialisation · Production capacity · Certifications (declared) │
│ Capability tags: Custom manufacturing · Private label · Samples              │
│ Products: embedded search results scoped to storefront                       │
│ Reviews: "Verified buyer" ★★★★☆ comment · date                                │
│ Note: contact details, documents and bank information are never public       │
```

## W-05 Buyer dashboard (BUY-01, planned: FD-21)
```
┌ app header: logo | workspace ▾ | Marketplace | Messages(2) | 🔔(5) | Account ┐
├ sidebar ──────┬──────────────────────────────────────────────────────────────┤
│ Dashboard     │ H1 Dashboard                              [New request]      │
│ Marketplace   │ {Verified} Licence expires 12 Jan 2027                        │
│ Requests      │ ┌Payments due┐┌Quotes to review┐┌Deliveries┐┌Disputes┐        │
│ Orders        │ │ 2 · 3h left││ 5              ││ 1        ││ 0      │        │
│ Cart          │ └────────────┘└────────────────┘└──────────┘└────────┘        │
│ Disputes      │ Tasks (by deadline, Dubai time)          │ Recent orders      │
│ Support       │ • Pay ORD-1042 by 14:00                  │ ORD-1042 {Awaiting}│
│ Addresses     │ • Compare 3 quotes on RFQ-221            │ ORD-1038 {Dispatch}│
│ Company/Team  │ • Confirm receipt ORD-1031               │ View all ›         │
│               │ ── Monthly spending (BUY-33) ── Period ◉6m ◯3m ◯12m        │
│               │ AED 84,200.00 net this month   ▁▃▅▂▆█ (Jun→Nov)  [Table]   │
│               │ Top suppliers: A 41% · B 22% · C 12%    (Export CSV)        │
└───────────────┴──────────────────────────────────────────────────────────────┘
MOBILE: tiles 2-up, task list, bottom tabs Dashboard | Marketplace | Requests |
Orders | More.
```

## W-06 New request for quotation (BUY-03)
```
│ H1 New request for quotation                                                  │
│ Intro: stays a draft until you publish                                        │
│ ┌ What you need ───────────────────────────────┐ ┌ Attachments ─────────────┐ │
│ │ Title*  [__________________________]          │ │ PDF, PNG, JPEG ≤10 MB    │ │
│ │ Category* ▾   Quantity* [____] Unit* ▾        │ │ (Add attachment)         │ │
│ │ Specifications* [textarea …         ] 0/5000  │ │ file.pdf {Scanning}      │ │
│ ├ Delivery ────────────────────────────────────┤ └──────────────────────────┘ │
│ │ Delivery emirate* ▾   Needed by [date]        │                             │
│ ├ Quotes ──────────────────────────────────────┤                             │
│ │ Quote deadline (Dubai time)* [date][time]     │                             │
│ │ Who can quote* ◉ Matching suppliers ◯ Invited │                             │
│ │ (Invite suppliers) chips: Supplier A ×        │                             │
│ │ Budget (AED) [____] optional                  │                             │
│ └──────────────────────────────────────────────┘                             │
│ sticky bar: (Cancel)                                   [Save draft]           │
```

## W-07 RFQ detail with quote comparison (BUY-05/BUY-10)
```
│ RFQ-221  Steel shelving units   {Open}  Deadline 30 Nov, 17:00 (Dubai)        │
│ [Accept…] (Cancel request)                                                    │
│ Summary: Category · 500 pieces · Dubai · Needed by · Budget · Matching        │
│ Specifications ▸   Attachments ▸   Invited suppliers ▸                        │
│ ── Quotes (current version) ──────────────────────────────────────────────── │
│            │ Supplier A      │ Supplier B ★Lowest total │ Supplier C          │
│ State      │ {Submitted} v2  │ {Submitted} v1           │ {Revision requested}│
│ Unit price │ AED 120.00      │ AED 112.00               │ AED 118.00          │
│ Shipping   │ …               │ …                        │ …                   │
│ Tax        │ …               │ …                        │ …                   │
│ Total      │ AED 63,000.00   │ AED 59,640.00            │ …                   │
│ Lead time  │ 21 days         │ 30 days                  │ 25 days             │
│ Valid until│ 7 Dec           │ 5 Dec                    │ 9 Dec               │
│            │[Accept](Revise)(Decline)(Details) per column                     │
│ ── History timeline (Buyer / Supplier / System / Platform) ──                 │
MOBILE: one card per supplier, swipe; key figures pinned; actions in card.
```

## W-08 Cart and checkout (BUY-16/BUY-17)
```
CART                                         │ CHECKOUT
Supplier A · Delivery AED 50 / order · ~3 d  │ Deliver to: ◉ Main warehouse, Dubai
 ▢ Item  variant  AED 4.20 [-][100][+] 420   │            ◯ Site office, Sharjah
   "Minimum 100, in steps of 50"  (Remove)   │            (Add an address)
 ⚠ Only 80 available                          │ Supplier A: Items 420 · Delivery 50
Supplier B …                                 │            · Tax … · Total …
Summary: Items AED …                         │ Supplier B: …
"Delivery and tax are calculated at checkout"│ Total AED …  "Creates 2 orders, one payment"
[Continue to checkout]                       │ "Stock is held for 15 minutes"
                                             │ PO reference [____]
                                             │ ☐ I confirm … terms of purchase
                                             │ [Place order and pay]  {Sandbox}
```

## W-09 Order detail (BUY-24 buyer / SEL-28 seller)
```
│ Order ORD-1042  {Dispatched}   Supplier A    From quotation                   │
│ Next step: "The supplier has dispatched this order. Confirm receipt once …"   │
│ Stepper (rec.): Paid ● Processing ● Dispatched ● Delivered ○ Completed ○      │
│ [Confirm receipt]  (Open a dispute) (Message supplier) (Support)              │
│ Lines table: item · qty · unit price · line total                             │
│ Totals: items · delivery · tax · total  [seller adds: commission · payable]   │
│ Fulfilment: carrier · tracking · expected · delivered · proof ⬇               │
│ Address snapshot │ Refunded so far │ Settlement {Not yet eligible} (seller)   │
│ Review (after completion) ★★★★★ [Submit review]                              │
│ Timeline                                                                      │
```

## W-10 Seller overview (SEL-01)
```
│ H1 Seller dashboard                                         [Add product]     │
│ ✓ Your company can list products.  /  ⚠ Listing is paused: {reason}           │
│ Storefront: {Live} (Open storefront)                                          │
│ KPI tiles: Live · Pending review · Drafts · Rejected · Suspended · Low · Out  │
│ (rec.) Requests to quote · Orders to dispatch · Awaiting receipt · Disputes   │
│ Recent moderation decisions: product · {Approved} · date · reason             │
```

## W-11 Seller quote form (SEL-21/SEL-22)
```
│ RFQ-221 Steel shelving · Buyer Co · 500 pcs · Dubai · Deadline …             │
│ Request specs ▸ Attachments ▸                    (Ask the buyer a question)  │
│ ┌ Your quote {Draft} ───────────────────────────────────────────────────────┐ │
│ │ Quantity* [500]  Unit price (AED, before tax)* [____]                     │ │
│ │ Shipping (AED, before tax) [____]  Tax treatment* ▾ Standard              │ │
│ │ Lead time (days)* [__]  Delivery date [date]  Valid until (Dubai)* [ ]   │ │
│ │ What is offered* [textarea]                                               │ │
│ │ Differences from the request [textarea]   Terms [textarea]                │ │
│ │ Attachments (Add)                                                         │ │
│ │ "Subtotal plus shipping: AED 60,000.00 before tax."                       │ │
│ │ (Save draft)                                   [Submit quote]             │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
```

## W-12 Admin verification case (ADM-03/ADM-04)
```
┌ admin header: Manufacturers Marketplace · Admin | roles | Sign out ──────────┐
├ nav ─────────┬──────────────────────────────────────────┬────────────────────┤
│ Overview     │ Company legal name   {Under review}       │ DECISION           │
│ Verification │ Kind: Initial · Submitted 26 Nov 10:12    │ ◉ Approve          │
│ Companies    │ Licence no · Issuer · Expiry · Activity   │ ◯ Request info     │
│ Users        │ TRN · Address · Representative            │ ◯ Reject           │
│ Catalogue    │ Documents: Trade licence {Clean} ⬇        │ Reason [textarea]  │
│ RFQs         │            Authorised rep. {Clean} ⬇      │ [Record decision]  │
│ Orders …     │ History timeline                          │ Audit note         │
└──────────────┴──────────────────────────────────────────┴────────────────────┘
```

## W-13 Admin refunds with dual control (ADM-32…ADM-34)
```
│ H1 Refunds  {Sandbox}                                [Request a refund]       │
│ Intro: A second finance user approves each request…                           │
│ Table: Refund · Order · Amount · Commission share · State · Requested by ·    │
│        Decided by · Actions                                                   │
│ RF-12 · ORD-1031 · AED 125.50 · AED 12.55 · {Awaiting approval} · A · — ·     │
│        [Approve] (Reject)   ← hidden for requester: "You requested this…"     │
│ RF-11 · … {Sent to provider} (Simulate success)(Simulate failure) [sandbox]  │
```

## W-14 Messages (MSG-01/MSG-02)
```
DESKTOP two-pane                         │ MOBILE
┌ Conversations ───┬ Supplier A ───────┐ │ List screen → tap → thread screen
│ Supplier A  (2)  │ msg (them) 10:02  │ │ composer pinned above keyboard
│ Supplier B       │      msg (you) ✓  │ │
│ …                │ [Type a message ] │ │
│                  │           [Send]  │ │
└──────────────────┴───────────────────┘ │
```

## W-15 Monthly spending (BUY-33, planned: FD-21)
```
DESKTOP (section of BUY-01)
┌ Monthly spending ────────────────────── Period [3m][6m][12m] Supplier ▾ Category ▾ ┐
│ {Sandbox: test data}                                                              │
│ ┌ Net this month ┐┌ Orders ┐┌ Refunds ┐┌ VAT ┐                                    │
│ │ AED 84,200.00  ││ 12     ││ AED 900 ││ …   │                                    │
│ ├ Chart (8 cols) ─────────────────────────────┬ Top suppliers (4 cols) ──────────┤ │
│ │ █ bars per month, AED axis, values on focus │ 1 Supplier A  AED 34,500.00       │ │
│ │ Jun Jul Aug Sep Oct Nov                     │ Top categories                    │ │
│ ├─────────────────────────────────────────────┴───────────────────────────────────┤ │
│ │ Month | Orders | Merchandise | Delivery | VAT | Refunds | Net spend  (row → BUY-23)│ │
└───────────────────────────────────────────────────────────────────────────────────┘
MOBILE: tiles 2-up → chart full width (labels every 2 months) → month cards.
RTL: page mirrors; chart time axis stays left to right; AED in ar-AE inside isolates.
EMPTY: "No paid orders in this period." (Browse marketplace)
```

## W-16 Structured counteroffer (BUY-15) and negotiation history (BUY-34), planned: FD-10
```
DESKTOP dialog (≈720px)
┌ Counteroffer to Supplier A · RFQ-221 ·  Round 2 of 3 ─────────────────────── ✕ ┐
│                     Supplier's revision v3      Your counteroffer               │
│ Unit price (AED)    12.40                       [ 11.80        ]                │
│ Quantity            5,000 pieces                [ 6,000        ]                │
│ Delivery date       20 Jan 2027                 [ 15 Jan 2027 ▾]                │
│ Customisation       Logo print 1 colour         [ 2 colours, kraft box     ]    │
│ Notes                                           [                          ]    │
│ Proposed subtotal (server, excl. delivery and VAT): AED 70,800.00               │
│ ⓘ While your counteroffer is open you cannot accept revision v3.                │
│                                        (Cancel)  [Review and send]              │
└─────────────────────────────────────────────────────────────────────────────────┘
NEGOTIATION HISTORY (BUY-34, inside BUY-05 per supplier)
│ ● Quotation v1        12.90 × 5,000 · 28 Jan       {Superseded}                │
│ ● Counteroffer 1      11.50 · 15 Jan               {Answered}                   │
│ ● Revision v2         ~~12.90~~ 12.60 · ~~28 Jan~~ 22 Jan   {Superseded}        │
│ ● Counteroffer 2      11.80 × 6,000                {Waiting for supplier}       │
│ ● Revision v3 ← current, valid until 3 Dec (Dubai)  [Accept] (Counter) (Decline)│
MOBILE: full-height sheet; comparison as stacked rows label / current / yours.
ROUND 3 USED: "You have used all three counteroffer rounds. Accept or decline the latest revision."
```

## W-17 Request a sample (BUY-32, planned: FD-13)
```
┌ Request a sample ───────────────────────────────────────────────────────────────┐
│ ▢ Steel shelving unit 180cm · Supplier A {Verified} · Free sample               │
│ Variant ▾ [Grey, 4 shelves]     Sample quantity [ 1 ] (max 2)                   │
│ Material or colour preferences [                                    ]           │
│ Customisation requirements     [                                    ]           │
│ ◉ Deliver to [Warehouse JAFZA ▾] (Dubai)   ◯ Collect from supplier (free)       │
│ Required by [ 10 Dec 2026 ▾]   Notes [                         ]                │
│ Attachments [Choose files] spec.pdf {Scanning…}                                 │
│ What happens next: the supplier replies with a sample quotation (AED 0 if free).│
│                                       (Save draft) (Cancel) [Send sample request]│
└─────────────────────────────────────────────────────────────────────────────────┘
MOBILE: single column, sticky [Send sample request].
SUPPLIER SIDE: SEL-20 row badge {Sample request}; SEL-39 settings ◉ Free ◯ Paid ◯ Not available.
```

## W-18 Delivery or collection at checkout (BUY-35, planned: FD-08)
```
┌ Checkout ─────────────────────────────────────────┬ Order summary (sticky) ────┐
│ Delivery address ▾ [Warehouse JAFZA, Dubai]        │ Supplier A   AED 12,000.00 │
│ ── Supplier A (3 items) ──                         │ Delivery     AED    150.00 │
│ ◉ Delivery to Dubai: AED 150.00 · 2–4 days         │ VAT (standard, supplier    │
│ ◯ Collect from supplier: free (Sharjah; address    │   VAT registered) AED …    │
│   shown after payment)                             │ Supplier B   …             │
│ Returns: "Unused items within 7 days…" (policy)    │ Total        AED …         │
│ ── Supplier B (1 item) ──                          │ ☐ I accept Terms v1.0      │
│ ◌ Delivery to Dubai — Does not deliver to Dubai    │ [Place order and pay]      │
│ ◉ Collect from supplier: free                      │ Stock held 15 min          │
│ ── From quotation ORD-1050 ── Delivery as agreed in the quotation: AED 900.00   │
└────────────────────────────────────────────────────┴────────────────────────────┘
MOBILE: supplier groups stacked; summary collapses into a sticky bottom bar.
NO OPTION: "This supplier does not deliver to Dubai and does not offer collection…"
SUPPLIER SETTINGS (SEL-04): table of 7 emirates | Deliver ☐ | Fee AED | Days; Buyer collection ☐; address; instructions.
```

## W-19 Buyer cancellation request (BUY-31) and supplier review (SEL-41), planned: founder Q12
```
BUYER dialog                                   │ SUPPLIER dialog
┌ Request cancellation of ORD-1042 ─────── ✕ ┐ │ ┌ Cancellation request · ORD-1042 ──────── ✕ ┐
│ {Confirmed} Made to order (from quotation)  │ │ │ Reason: Delivery date too late            │
│ ⚠ This order is made to your specification. │ │ │ "We need it by 1 Dec…"                    │
│ The supplier may decline or deduct committed│ │ │ Production status: materials secured      │
│ production costs, and no refund is automatic│ │ │ ◉ Accept and request full refund          │
│ Reason ▾ [Delivery date too late]           │ │ │ ◯ Accept with deduction  AED [  2,000 ]   │
│ Details [                               ]   │ │ │   Evidence [Choose file]                  │
│ ☐ I have read the supplier's policy         │ │ │ ◯ Decline                                 │
│        (Keep the order) [Send request]      │ │ │ Reason for the buyer [               ]    │
└─────────────────────────────────────────────┘ │ │              (Cancel) [Send decision]     │
                                                │ └───────────────────────────────────────────┘
AFTER: BUY-24 badge {Cancellation requested}; accepted → refund awaiting finance approval (ADM-34).
```

## W-20 Commission policy and settlement holds (ADM-56, ADM-57)
```
┌ Commission ──────────────────────────────────┐ ┌ Settlement holds ───────────────────────────┐
│ Current: 10% · Policy version 3              │ │ Place a hold: Order [ORD-…] Type ▾ Reason [ ] │
│ New rate (%) [ 9.5 ] Reason [            ]   │ │ [Place a hold]                                 │
│ Effective from (planned) [ ≥ today + 30 d ]  │ │ (Active) (Released)                            │
│ Authenticator code [ ______ ] [Save new rate]│ │ Order   Type        Reason   Placed by  (Release)│
│ History: v3 10% · reason · actor · date      │ │ ORD-9   Compliance  …        A. Admin   (Release)│
└──────────────────────────────────────────────┘ └────────────────────────────────────────────────┘
Only FINANCE_APPROVER can save; suppliers see the rate on SEL-28/SEL-32 and get 30 days' notice (FD-05).
```
