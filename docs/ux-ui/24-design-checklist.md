# 24. UI/UX design production checklist (Figma)

331 checklist items in 19 groups. The same list, with tracking columns, is in **05 — Design Production Checklist.xlsx**.

## 24.1 Totals

| Measure | Total |
|---|---|
| Unique screens (section 4) | 197 |
| …of which P0 / P1 / P2 | 116 / 57 / 24 |
| Reusable components | 76 |
| Component variants listed | 234 |
| Screen state variations | 218 |
| Estimated screen frames | 958 |
| Tablet frames | 12 |
| Component documentation frames | 152 |
| Foundation frames | 15 |
| Email frames (17 families × EN/AR) | 34 |
| **Estimated Figma frames in total** | **1171** |
| Prototype flows | 12 |
| User journeys covered | 31 |


## 24.2 How the totals were calculated

1. **Unique screens** = every entry in the screen inventory (pages, dialogs, drawers, overlays and page sections that need their own design), including recommended, planned and blocked screens.
2. **Screen variations** = additional states that need their own frame: for every list or queue screen 3 (loading, empty, error); for status-driven screens one per status that changes the layout (e.g. order detail 7 order states, quote panel 8 states, company profile 7 statuses, checkout 6 states, dispute 6, support 5, trade panel 5 reasons).
3. **Frames per screen**: 2 base frames (desktop 1440 + mobile 360, English). P0 screens that are not blocked add Arabic RTL frames: +2 for pages (desktop + mobile), +1 for dialogs/sections (mobile). Each variation adds 2 frames for P0 screens (desktop + mobile) and 1 for P1/P2 (desktop). External pages count 1.
4. **Other frames**: 12 tablet frames for key templates; 2 documentation frames per component (spec sheet + RTL/variant sheet); 1 frame per foundation item; 34 email frames.
5. Totals are generated from the same data files as the spreadsheets, so they stay consistent. They are estimates for planning; real counts change as the designer merges or splits frames.

## 24.3 Items per group

| Group | Items |
|---|---|
| 1. Design system foundations | 15 |
| 2. Reusable UI components | 76 |
| 3. Public website | 13 |
| 4. Authentication | 13 |
| 5. Buyer onboarding | 7 |
| 6. Manufacturer onboarding | 6 |
| 7. Buyer dashboard | 13 |
| 8. Manufacturer dashboard | 16 |
| 9. Marketplace discovery | 13 |
| 10. RFQ and quotation workflows | 22 |
| 11. Order management | 17 |
| 12. Financial workflows | 9 |
| 13. Notifications and communication | 6 |
| 14. Customer support and disputes | 6 |
| 15. Administration portal | 53 |
| 16. Mobile-responsive screens | 8 |
| 17. Empty and error states | 18 |
| 18. Interactive prototypes | 12 |
| 19. Developer handoff | 8 |


| Priority | Items |
|---|---|
| P0 | 222 |
| P1 | 81 |
| P2 | 28 |


## 1. Design system foundations

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | Arabic typography placeholder styles and RTL text rules | — | P0 | To design | 1 |
| ☐ | Colour variables: brand primitives (8 approved colours + tints/shades) | — | P0 | To design | 1 |
| ☐ | Colour variables: dark-mode collection (future, not for launch) | — | P2 | To design | 1 |
| ☐ | Colour variables: semantic tokens (text, surface, border, action, status) | — | P0 | To design | 1 |
| ☐ | Contrast matrix page (WCAG 2.2 AA) | — | P0 | To design | 1 |
| ☐ | Focus ring, hover, pressed, selected, disabled state rules | — | P0 | To design | 1 |
| ☐ | Grid styles: 4/8/12 columns, breakpoints 360/720/1024/1280/1440 | — | P0 | To design | 1 |
| ☐ | Icon placeholder set and sizing rules (final iconography deferred) | — | P1 | To design | 1 |
| ☐ | Logo placeholder component ("Manufacturers Marketplace" text) | — | P0 | To design | 1 |
| ☐ | Motion tokens with reduced-motion variants | — | P1 | To design | 1 |
| ☐ | Photography and image ratio guidelines page | — | P1 | To design | 1 |
| ☐ | Radius, border and elevation tokens | — | P0 | To design | 1 |
| ☐ | Spacing scale (4px base) | — | P0 | To design | 1 |
| ☐ | Status colour + icon + text mapping page | — | P0 | To design | 1 |
| ☐ | Typography placeholder styles (system font; final typeface deferred) | — | P0 | To design | 1 |


## 2. Reusable UI components

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | C-01 Button — variants: Primary, Secondary, Tertiary/Link, Danger, Accent CTA (Orange), Icon-only; sizes S/M/L; full-width (mobile) | — | P0 | To design | 2 |
| ☐ | C-02 Link — variants: Inline, Standalone with arrow, External (opens new tab with icon) | — | P0 | To design | 2 |
| ☐ | C-03 Text input — variants: Text, Email, Password (show/hide), Search, Number, Money (AED prefix), Phone (+971), URL | — | P0 | To design | 2 |
| ☐ | C-04 Textarea — variants: With counter, auto-grow | — | P0 | To design | 2 |
| ☐ | C-05 Select / dropdown — variants: Native select, Searchable combobox, Grouped | — | P0 | To design | 2 |
| ☐ | C-06 Checkbox — variants: Single, Group, Indeterminate | — | P0 | To design | 2 |
| ☐ | C-07 Radio group / radio cards — variants: Inline, Stacked, Card (with description) | — | P0 | To design | 2 |
| ☐ | C-08 Toggle switch — variants: With label and description | — | P1 | To design | 2 |
| ☐ | C-09 Date / date-time picker — variants: Date, Date-time with "(Dubai time)" suffix, Range | — | P0 | To design | 2 |
| ☐ | C-10 Quantity stepper — variants: With min/step hint, Compact | — | P0 | To design | 2 |
| ☐ | C-11 OTP / authenticator code input — variants: 6 boxes or single field; Recovery code mode | — | P0 | To design | 2 |
| ☐ | C-12 File uploader — variants: Single, Multiple, Image grid, Drag-and-drop (desktop) with button alternative | — | P0 | To design | 2 |
| ☐ | C-13 Repeater (key-value / list rows) — variants: Specifications, certifications, tiers, attributes | — | P0 | To design | 2 |
| ☐ | C-14 Search bar with suggestions — variants: Header (desktop), Full-width (mobile), With grouped suggestions | — | P0 | To design | 2 |
| ☐ | C-15 Site header (marketplace) — variants: Guest, Signed-in, Seller | — | P0 | To design | 2 |
| ☐ | C-16 App header (workspace) — variants: Buyer, Seller, Multi-workspace | — | P0 | To design | 2 |
| ☐ | C-17 Sub-navigation / sidebar — variants: Desktop sidebar, Horizontal tabs, Mobile section picker | — | P0 | To design | 2 |
| ☐ | C-18 Admin navigation — variants: Expanded sidebar, Collapsed, Mobile drawer | — | P0 | To design | 2 |
| ☐ | C-19 Mobile bottom navigation — variants: 4–5 items + More; with badges | — | P0 | To design | 2 |
| ☐ | C-20 Breadcrumb — variants: Standard, Truncated (mobile) | — | P1 | To design | 2 |
| ☐ | C-21 Tabs — variants: Underline, Segmented (.seg), Scrollable | — | P0 | To design | 2 |
| ☐ | C-22 Pagination / Load more — variants: "Show more results", Pager with previous/next | — | P0 | To design | 2 |
| ☐ | C-23 Workspace switcher — variants: Select, Menu with company + kind | — | P0 | To design | 2 |
| ☐ | C-24 Language switch — variants: Text toggle "العربية"/"English" | — | P0 | To design | 2 |
| ☐ | C-25 Product card — variants: Grid, List, Compact (related), Unavailable (gone), With "Featured" label, Guest (price locked) | — | P0 | To design | 2 |
| ☐ | C-26 Manufacturer (supplier) card — variants: Grid, List, Featured, Compact | — | P0 | To design | 2 |
| ☐ | C-27 Category tile / chip — variants: Tile with image, Chip with count, Directory block | — | P0 | To design | 2 |
| ☐ | C-28 KPI / dashboard tile — variants: Count, Money (AED), With trend (future), Linked | — | P0 | To design | 2 |
| ☐ | C-29 Financial summary card — variants: Totals table, Settlement buckets, Ledger balance | — | P0 | To design | 2 |
| ☐ | C-30 Card / section container — variants: Plain, With header/actions, Subcard | — | P0 | To design | 2 |
| ☐ | C-31 Data table — variants: Standard, Compact, With row actions, With selection (future), Responsive stacked | — | P0 | To design | 2 |
| ☐ | C-32 Description list — variants: Two-column, Stacked | — | P0 | To design | 2 |
| ☐ | C-33 Status badge — variants: One per status family (section 16): neutral, info, success, warning, danger, pending, verified | — | P0 | To design | 2 |
| ☐ | C-34 Verified badge — variants: Inline dot, Pill with text, With "since" date | — | P0 | To design | 2 |
| ☐ | C-35 Availability badge — variants: In stock, Low, Out, Made to order | — | P0 | To design | 2 |
| ☐ | C-36 Alert / banner — variants: Info, Success, Warning, Error; with title, actions, dismiss | — | P0 | To design | 2 |
| ☐ | C-37 Sandbox banner / pill — variants: Global banner, Inline pill, Section note | — | P0 | To design | 2 |
| ☐ | C-38 Toast / inline confirmation — variants: Success, Error | — | P1 | To design | 2 |
| ☐ | C-39 Modal / dialog — variants: Confirm, Destructive confirm, Form dialog, Decision (radio + reason) | — | P0 | To design | 2 |
| ☐ | C-40 Drawer / bottom sheet — variants: Right drawer (desktop), Bottom sheet (mobile), Full-screen sheet | — | P1 | To design | 2 |
| ☐ | C-41 Tooltip / help text — variants: Hover/focus tooltip, Inline hint | — | P1 | To design | 2 |
| ☐ | C-42 Popover menu — variants: Row actions, Account menu | — | P1 | To design | 2 |
| ☐ | C-43 Image gallery — variants: Main + thumbnails, Grid, Lightbox | — | P0 | To design | 2 |
| ☐ | C-44 Media manager grid — variants: Product (12), Storefront by kind | — | P0 | To design | 2 |
| ☐ | C-45 Price tier table — variants: Read-only, Editable | — | P0 | To design | 2 |
| ☐ | C-46 Price display / locked price — variants: Unit price, Range, Locked (guest), Quote only | — | P0 | To design | 2 |
| ☐ | C-47 Trade action panel — variants: Cart-eligible, Quote-only, Made-to-order, Signed-out, Not approved | — | P0 | To design | 2 |
| ☐ | C-48 Cart line / supplier group — variants: With issue, Without issue | — | P0 | To design | 2 |
| ☐ | C-49 Order lines table — variants: Buyer (no commission), Seller (commission + payable), Admin | — | P0 | To design | 2 |
| ☐ | C-50 Address card / block — variants: Display, Selectable (radio card), Default badge | — | P0 | To design | 2 |
| ☐ | C-51 Quote comparison — variants: Table (desktop), Cards (mobile), Lowest-total marker | — | P0 | To design | 2 |
| ☐ | C-52 Fulfilment card — variants: Not dispatched, Dispatched, Delivered with proof | — | P0 | To design | 2 |
| ☐ | C-53 Timeline / progress tracker — variants: Event timeline (actor side), Stepper (order lifecycle), Checklist (verification) | — | P0 | To design | 2 |
| ☐ | C-54 Step-by-step form (wizard) — variants: Steps header, Save and continue, Review | — | P1 | To design | 2 |
| ☐ | C-55 Form field wrapper — variants: Standard, Inline, Bilingual pair (EN/AR side by side) | — | P0 | To design | 2 |
| ☐ | C-56 Error summary — variants: — | — | P1 | To design | 2 |
| ☐ | C-57 Filter panel — variants: Sidebar (desktop), Sheet (mobile), Chip bar of active filters | — | P0 | To design | 2 |
| ☐ | C-58 Results bar — variants: — | — | P0 | To design | 2 |
| ☐ | C-59 Compare tray / comparison table — variants: Tray, Table | — | P1 | To design | 2 |
| ☐ | C-60 Star rating — variants: Display (average + count), Input (radio 1–5) | — | P1 | To design | 2 |
| ☐ | C-61 Review list item — variants: Public, Own, Admin (with identity), Hidden | — | P1 | To design | 2 |
| ☐ | C-62 Conversation list item — variants: Unread, Read, RFQ-linked | — | P0 | To design | 2 |
| ☐ | C-63 Message bubble / thread — variants: Buyer, Seller, Admin, System; with attachment (future) | — | P0 | To design | 2 |
| ☐ | C-64 Message composer — variants: Text, With attachment, Disabled (read-only/closed) | — | P0 | To design | 2 |
| ☐ | C-65 Notification item — variants: Unread, Read; by type icon | — | P0 | To design | 2 |
| ☐ | C-66 Unread badge — variants: Dot, Number, 99+ | — | P0 | To design | 2 |
| ☐ | C-67 Chart — variants: Line, Bar, Donut (avoid), Sparkline | — | P2 | To design | 2 |
| ☐ | C-68 Skeleton loader — variants: Lines, Card, Table rows, Image | — | P0 | To design | 2 |
| ☐ | C-69 Empty state — variants: Neutral, First-use, Filtered (no results), Permission | — | P0 | To design | 2 |
| ☐ | C-70 Error state — variants: Inline, Full page, Not found, Forbidden | — | P0 | To design | 2 |
| ☐ | C-71 Page header — variants: With breadcrumb, With status badge, With actions | — | P0 | To design | 2 |
| ☐ | C-72 Grid and container — variants: Narrow, Default, Wide; 2/3/4 columns | — | P0 | To design | 2 |
| ☐ | C-73 Countdown / deadline — variants: Payment due, Quote deadline, Reservation | — | P1 | To design | 2 |
| ☐ | C-74 Capability / role pill — variants: Role, Capability list | — | P2 | To design | 2 |
| ☐ | C-75 Footer — variants: Public, App (minimal) | — | P1 | To design | 2 |
| ☐ | C-76 Email template — variants: Notification, Action required, Security | — | P0 | To design | 2 |


## 3. Public website

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | PUB-01 Marketplace home (Page) | PUB-01 | P0 | To design | 4 |
| ☐ | PUB-15 System status (Page) | PUB-15 | P2 | To design | 2 |
| ☐ | PUB-16 About the platform (Page) | PUB-16 | P1 | To design | 2 |
| ☐ | PUB-17 How it works (Page) | PUB-17 | P1 | To design | 2 |
| ☐ | PUB-18 Pricing and fees (Page) | PUB-18 | P1 | To design | 2 |
| ☐ | PUB-19 Frequently asked questions (Page) | PUB-19 | P1 | To design | 2 |
| ☐ | PUB-20 Help centre (Page) | PUB-20 | P2 | To design | 2 |
| ☐ | PUB-21 Contact (Page) | PUB-21 | P1 | To design | 2 |
| ☐ | PUB-22 Terms and conditions (Page) | PUB-22 | P0 | Blocked – design placeholder | 2 |
| ☐ | PUB-23 Privacy policy (Page) | PUB-23 | P0 | Blocked – design placeholder | 2 |
| ☐ | PUB-24 Returns, refunds and cancellation policy (Page) | PUB-24 | P0 | Blocked – design placeholder | 2 |
| ☐ | PUB-25 Other policy pages (template) (Page) | PUB-25 | P1 | Blocked – design placeholder | 2 |
| ☐ | PUB-27 Site footer and legal centre (Page) | PUB-27 | P0 | To design | 4 |


## 4. Authentication

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | AUTH-01 Create account (register) (Page) | AUTH-01 | P0 | To design | 4 |
| ☐ | AUTH-02 Check your email (Page) | AUTH-02 | P0 | To design | 4 |
| ☐ | AUTH-03 Verify email (Page) | AUTH-03 | P0 | To design | 6 |
| ☐ | AUTH-04 Sign in (Page) | AUTH-04 | P0 | To design | 4 |
| ☐ | AUTH-05 Forgot password (Page) | AUTH-05 | P0 | To design | 4 |
| ☐ | AUTH-06 Reset password (Page) | AUTH-06 | P0 | To design | 4 |
| ☐ | AUTH-07 Email verification gate (Page) | AUTH-07 | P0 | To design | 4 |
| ☐ | AUTH-08 Accept team invitation (Page) | AUTH-08 | P0 | To design | 10 |
| ☐ | AUTH-09 Session expired / signed out (Page) | AUTH-09 | P1 | To design | 2 |
| ☐ | AUTH-10 Admin sign in (Page) | AUTH-10 | P0 | To design | 4 |
| ☐ | AUTH-11 Admin MFA enrolment (Page) | AUTH-11 | P0 | To design | 4 |
| ☐ | AUTH-12 Admin recovery codes (Page) | AUTH-12 | P0 | To design | 4 |
| ☐ | AUTH-13 Admin MFA verification (Page) | AUTH-13 | P0 | To design | 4 |


## 5. Buyer onboarding

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | ACC-02 Register a company (onboarding) (Page) | ACC-02 | P0 | To design | 4 |
| ☐ | ACC-03 Company profile and verification (Page) | ACC-03 | P0 | To design | 18 |
| ☐ | ACC-04 Edit company details (Page) | ACC-04 | P0 | To design | 4 |
| ☐ | ACC-05 Verification document upload (Section) | ACC-05 | P0 | To design | 3 |
| ☐ | ACC-06 Submit for verification (terms) (Section) | ACC-06 | P0 | To design | 3 |
| ☐ | ACC-07 Licence renewal (Section) | ACC-07 | P0 | To design | 3 |
| ☐ | ACC-08 Remove document dialog (Dialog) | ACC-08 | P1 | To design | 2 |


## 6. Manufacturer onboarding

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | PUB-26 Become a supplier (Page) | PUB-26 | P1 | To design | 2 |
| ☐ | SEL-02 Storefront editor (Page) | SEL-02 | P0 | To design | 8 |
| ☐ | SEL-03 Storefront media manager (Section) | SEL-03 | P1 | To design | 2 |
| ☐ | SEL-04 Delivery terms (Section) | SEL-04 | P0 | To design | 3 |
| ☐ | SEL-05 Publish or take storefront offline dialog (Dialog) | SEL-05 | P1 | To design | 2 |
| ☐ | SEL-33 Payout account onboarding (Page) | SEL-33 | P0 | Blocked – design placeholder | 2 |


## 7. Buyer dashboard

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | ACC-01 Home (workspace hub) (Page) | ACC-01 | P0 | To design | 18 |
| ☐ | ACC-09 Team management (Page) | ACC-09 | P0 | To design | 10 |
| ☐ | ACC-10 Invite team member form (Section) | ACC-10 | P0 | To design | 3 |
| ☐ | ACC-11 Change role dialog (Dialog) | ACC-11 | P1 | To design | 2 |
| ☐ | ACC-12 Remove access dialog (Dialog) | ACC-12 | P1 | To design | 2 |
| ☐ | ACC-13 Account settings (Page) | ACC-13 | P0 | To design | 4 |
| ☐ | ACC-15 Workspace switcher (Page) | ACC-15 | P0 | To design | 4 |
| ☐ | ACC-16 Account closure and data requests (Page) | ACC-16 | P1 | To design | 2 |
| ☐ | ACC-17 Billing, invoices and statements (Page) | ACC-17 | P0 | Blocked – design placeholder | 2 |
| ☐ | BUY-01 Buyer dashboard (Page) | BUY-01 | P0 | To design | 4 |
| ☐ | BUY-20 Delivery addresses (Page) | BUY-20 | P0 | To design | 10 |
| ☐ | BUY-21 Address form (Section) | BUY-21 | P0 | To design | 3 |
| ☐ | BUY-22 Remove address dialog (Dialog) | BUY-22 | P1 | To design | 2 |


## 8. Manufacturer dashboard

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | SEL-01 Seller overview (dashboard) (Page) | SEL-01 | P0 | To design | 6 |
| ☐ | SEL-06 Product list (Page) | SEL-06 | P0 | To design | 10 |
| ☐ | SEL-07 Add product (Page) | SEL-07 | P0 | To design | 4 |
| ☐ | SEL-08 Product editor (content) (Page) | SEL-08 | P0 | To design | 16 |
| ☐ | SEL-09 Product media manager (Section) | SEL-09 | P0 | To design | 3 |
| ☐ | SEL-10 Variants (SKU) manager (Section) | SEL-10 | P0 | To design | 3 |
| ☐ | SEL-11 Product pricing editor (Section) | SEL-11 | P0 | To design | 3 |
| ☐ | SEL-12 Submit for review dialog (Dialog) | SEL-12 | P0 | To design | 3 |
| ☐ | SEL-13 Listing lifecycle dialogs (Dialog) | SEL-13 | P1 | To design | 2 |
| ☐ | SEL-14 Moderation history (Section) | SEL-14 | P1 | To design | 2 |
| ☐ | SEL-15 Inventory (Page) | SEL-15 | P0 | To design | 10 |
| ☐ | SEL-16 Stock adjustment dialog (Dialog) | SEL-16 | P0 | To design | 3 |
| ☐ | SEL-17 Low-stock threshold and restock date (Section) | SEL-17 | P2 | To design | 2 |
| ☐ | SEL-18 Stock movement history (Drawer) | SEL-18 | P1 | To design | 2 |
| ☐ | SEL-19 Pricing overview (Page) | SEL-19 | P1 | To design | 5 |
| ☐ | SEL-35 Seller analytics (Page) | SEL-35 | P2 | To design | 2 |


## 9. Marketplace discovery

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | PUB-02 Category directory (Page) | PUB-02 | P0 | To design | 4 |
| ☐ | PUB-03 Category page (Page) | PUB-03 | P0 | To design | 4 |
| ☐ | PUB-04 Search results (Page) | PUB-04 | P0 | To design | 12 |
| ☐ | PUB-05 Filter panel / mobile filter sheet (Overlay) | PUB-05 | P0 | To design | 3 |
| ☐ | PUB-06 Search suggestions dropdown (Overlay) | PUB-06 | P1 | To design | 2 |
| ☐ | PUB-07 Product detail (Page) | PUB-07 | P0 | To design | 14 |
| ☐ | PUB-08 Product image viewer (lightbox) (Overlay) | PUB-08 | P1 | To design | 2 |
| ☐ | PUB-09 Supplier directory (Page) | PUB-09 | P0 | To design | 10 |
| ☐ | PUB-10 Supplier storefront (manufacturer profile) (Page) | PUB-10 | P0 | To design | 4 |
| ☐ | PUB-11 Saved products and suppliers (Page) | PUB-11 | P1 | To design | 5 |
| ☐ | PUB-12 Product comparison (Page) | PUB-12 | P1 | To design | 2 |
| ☐ | PUB-13 Recently viewed (Page) | PUB-13 | P2 | To design | 5 |
| ☐ | PUB-14 Marketplace preferences (Page) | PUB-14 | P2 | To design | 2 |


## 10. RFQ and quotation workflows

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | BUY-02 Requests for quotation list (Page) | BUY-02 | P0 | To design | 10 |
| ☐ | BUY-03 New request for quotation (Page) | BUY-03 | P0 | To design | 4 |
| ☐ | BUY-04 Request quotation entry (workspace chooser) (Page) | BUY-04 | P1 | To design | 2 |
| ☐ | BUY-05 Request for quotation detail (buyer) (Page) | BUY-05 | P0 | To design | 14 |
| ☐ | BUY-06 Edit request draft (Page) | BUY-06 | P0 | To design | 4 |
| ☐ | BUY-07 Publish request dialog (Dialog) | BUY-07 | P0 | To design | 3 |
| ☐ | BUY-08 Cancel request dialog (Dialog) | BUY-08 | P0 | To design | 3 |
| ☐ | BUY-09 Invite suppliers picker (Section) | BUY-09 | P0 | To design | 3 |
| ☐ | BUY-10 Quote comparison (Section) | BUY-10 | P0 | To design | 7 |
| ☐ | BUY-11 Quote detail and version history (Section) | BUY-11 | P0 | To design | 3 |
| ☐ | BUY-12 Accept quote dialog (Dialog) | BUY-12 | P0 | To design | 3 |
| ☐ | BUY-13 Request revision dialog (Dialog) | BUY-13 | P0 | To design | 3 |
| ☐ | BUY-14 Decline quote dialog (Dialog) | BUY-14 | P0 | To design | 3 |
| ☐ | BUY-15 Counteroffer to supplier (Dialog) | BUY-15 | P1 | To design | 2 |
| ☐ | BUY-32 Request a sample (Action) | BUY-32 | P2 | To design | 2 |
| ☐ | SEL-20 Quotation requests inbox (Page) | SEL-20 | P0 | To design | 10 |
| ☐ | SEL-21 Request detail (seller) (Page) | SEL-21 | P0 | To design | 20 |
| ☐ | SEL-22 Quote form (Section) | SEL-22 | P0 | To design | 7 |
| ☐ | SEL-23 Submit quote dialog (Dialog) | SEL-23 | P0 | To design | 3 |
| ☐ | SEL-24 Withdraw quote dialog (Dialog) | SEL-24 | P1 | To design | 2 |
| ☐ | SEL-25 Ask the buyer a question (Dialog) | SEL-25 | P1 | To design | 2 |
| ☐ | SEL-26 Quotes list (seller) (Page) | SEL-26 | P1 | To design | 5 |


## 11. Order management

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | BUY-16 Cart (Page) | BUY-16 | P0 | To design | 12 |
| ☐ | BUY-17 Checkout (Page) | BUY-17 | P0 | To design | 10 |
| ☐ | BUY-23 Orders list (buyer) (Page) | BUY-23 | P0 | To design | 10 |
| ☐ | BUY-24 Order detail (buyer) (Page) | BUY-24 | P0 | To design | 18 |
| ☐ | BUY-25 Confirm receipt dialog (Dialog) | BUY-25 | P0 | To design | 3 |
| ☐ | BUY-26 Rate supplier form (Section) | BUY-26 | P1 | To design | 2 |
| ☐ | BUY-27 Open dispute form (buyer) (Dialog) | BUY-27 | P0 | To design | 3 |
| ☐ | BUY-30 Reorder (Action) | BUY-30 | P2 | To design | 2 |
| ☐ | BUY-31 Request order cancellation (buyer) (Dialog) | BUY-31 | P1 | To design | 2 |
| ☐ | SEL-27 Orders list (seller) (Page) | SEL-27 | P0 | To design | 10 |
| ☐ | SEL-28 Order detail (seller) (Page) | SEL-28 | P0 | To design | 18 |
| ☐ | SEL-29 Record dispatch dialog (Dialog) | SEL-29 | P0 | To design | 3 |
| ☐ | SEL-30 Report delivery dialog (Dialog) | SEL-30 | P0 | To design | 3 |
| ☐ | SEL-31 Open dispute (seller) (Dialog) | SEL-31 | P2 | To design | 2 |
| ☐ | SEL-36 Supplier order cancellation (Dialog) | SEL-36 | P1 | To design | 2 |
| ☐ | SEL-37 Returns handling (Page) | SEL-37 | P2 | To design | 2 |
| ☐ | SEL-38 Production milestones (made to order) (Section) | SEL-38 | P2 | To design | 2 |


## 12. Financial workflows

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | BUY-18 Checkout status and payment (Page) | BUY-18 | P0 | To design | 16 |
| ☐ | BUY-19 Cancel checkout dialog (Dialog) | BUY-19 | P0 | To design | 3 |
| ☐ | BUY-28 Invoices and tax documents (buyer) (Page) | BUY-28 | P1 | Blocked – design placeholder | 2 |
| ☐ | BUY-29 Payment history (buyer) (Page) | BUY-29 | P2 | To design | 2 |
| ☐ | FIN-01 Sandbox payment page (Page) | FIN-01 | P0 | To design | 4 |
| ☐ | FIN-02 Live payment provider checkout (External page) | FIN-02 | P0 | Blocked – design placeholder | 1 |
| ☐ | FIN-03 Bank transfer instructions (Page) | FIN-03 | P1 | Blocked – design placeholder | 2 |
| ☐ | SEL-32 Seller finance (Page) | SEL-32 | P0 | To design | 6 |
| ☐ | SEL-34 Statements and commission invoices (Page) | SEL-34 | P1 | Blocked – design placeholder | 2 |


## 13. Notifications and communication

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | ACC-14 Notification centre (Page) | ACC-14 | P0 | To design | 10 |
| ☐ | MSG-01 Conversations list (Page) | MSG-01 | P0 | To design | 10 |
| ☐ | MSG-02 Conversation thread (Page) | MSG-02 | P0 | To design | 8 |
| ☐ | MSG-03 New message to supplier (Page) | MSG-03 | P1 | To design | 2 |
| ☐ | MSG-04 Message attachments (Section) | MSG-04 | P1 | To design | 2 |
| ☐ | Email templates EN/AR (17 families, section 14.6) | — | P0 | Blocked – design now, send after Phase 8 | 34 |


## 14. Customer support and disputes

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | SHR-01 Disputes list (Page) | SHR-01 | P0 | To design | 10 |
| ☐ | SHR-02 Dispute detail (Page) | SHR-02 | P0 | To design | 16 |
| ☐ | SHR-03 Support tickets list (Page) | SHR-03 | P1 | To design | 5 |
| ☐ | SHR-04 New support ticket (Page) | SHR-04 | P1 | To design | 2 |
| ☐ | SHR-05 Support ticket detail (Page) | SHR-05 | P1 | To design | 7 |
| ☐ | SHR-06 Close or reopen ticket dialog (Dialog) | SHR-06 | P2 | To design | 2 |


## 15. Administration portal

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | ADM-01 Admin overview and operations (Page) | ADM-01 | P0 | To design | 6 |
| ☐ | ADM-02 Verification queue (Page) | ADM-02 | P0 | To design | 10 |
| ☐ | ADM-03 Verification case detail (Page) | ADM-03 | P0 | To design | 14 |
| ☐ | ADM-04 Verification decision dialog (Dialog) | ADM-04 | P0 | To design | 3 |
| ☐ | ADM-05 Companies (Page) | ADM-05 | P0 | To design | 10 |
| ☐ | ADM-06 Company detail (admin) (Page) | ADM-06 | P0 | To design | 4 |
| ☐ | ADM-07 Suspend or reactivate company dialog (Dialog) | ADM-07 | P0 | To design | 3 |
| ☐ | ADM-08 Users (Page) | ADM-08 | P1 | To design | 5 |
| ☐ | ADM-09 Revoke sessions dialog (Dialog) | ADM-09 | P1 | To design | 2 |
| ☐ | ADM-10 Catalogue moderation overview (Page) | ADM-10 | P0 | To design | 4 |
| ☐ | ADM-11 Moderation queue (Page) | ADM-11 | P0 | To design | 10 |
| ☐ | ADM-12 Listing version review (diff) (Page) | ADM-12 | P0 | To design | 6 |
| ☐ | ADM-13 Review decision dialog (Dialog) | ADM-13 | P0 | To design | 3 |
| ☐ | ADM-14 All listings (Page) | ADM-14 | P1 | To design | 5 |
| ☐ | ADM-15 Listing detail (admin) (Page) | ADM-15 | P1 | To design | 2 |
| ☐ | ADM-16 Listing enforcement dialog (Dialog) | ADM-16 | P1 | To design | 2 |
| ☐ | ADM-17 Storefront oversight (Page) | ADM-17 | P1 | To design | 5 |
| ☐ | ADM-18 Storefront detail (admin) (Page) | ADM-18 | P2 | To design | 2 |
| ☐ | ADM-19 Hide or restore storefront dialog (Dialog) | ADM-19 | P1 | To design | 2 |
| ☐ | ADM-20 Categories (Page) | ADM-20 | P1 | To design | 5 |
| ☐ | ADM-21 Category editor (Page) | ADM-21 | P1 | To design | 2 |
| ☐ | ADM-22 Category attribute editor (Dialog) | ADM-22 | P2 | To design | 2 |
| ☐ | ADM-23 Restricted and prohibited terms (Page) | ADM-23 | P2 | To design | 5 |
| ☐ | ADM-24 Featured placements (Page) | ADM-24 | P2 | To design | 5 |
| ☐ | ADM-25 RFQ oversight (Page) | ADM-25 | P1 | To design | 5 |
| ☐ | ADM-26 RFQ detail (admin) (Page) | ADM-26 | P1 | To design | 2 |
| ☐ | ADM-27 Hide or unhide RFQ dialog (Dialog) | ADM-27 | P2 | To design | 2 |
| ☐ | ADM-28 Orders (admin) (Page) | ADM-28 | P0 | To design | 10 |
| ☐ | ADM-29 Order detail (admin) (Page) | ADM-29 | P0 | To design | 10 |
| ☐ | ADM-30 Finance overview (Page) | ADM-30 | P0 | To design | 4 |
| ☐ | ADM-31 Reconciliation case resolution (Page) | ADM-31 | P0 | To design | 4 |
| ☐ | ADM-32 Refunds (Page) | ADM-32 | P0 | To design | 10 |
| ☐ | ADM-33 Request refund form (Section) | ADM-33 | P0 | To design | 3 |
| ☐ | ADM-34 Approve or reject refund dialog (Dialog) | ADM-34 | P0 | To design | 3 |
| ☐ | ADM-35 Payouts (Page) | ADM-35 | P0 | To design | 10 |
| ☐ | ADM-36 Request payout dialog (Dialog) | ADM-36 | P0 | To design | 3 |
| ☐ | ADM-37 Approve or reject payout dialog (Dialog) | ADM-37 | P0 | To design | 3 |
| ☐ | ADM-38 Disputes queue (Page) | ADM-38 | P0 | To design | 10 |
| ☐ | ADM-39 Dispute detail (admin) (Page) | ADM-39 | P0 | To design | 16 |
| ☐ | ADM-40 Dispute action dialogs (Dialog) | ADM-40 | P0 | To design | 3 |
| ☐ | ADM-41 Supplier reviews moderation (Page) | ADM-41 | P2 | To design | 5 |
| ☐ | ADM-42 Support queue (Page) | ADM-42 | P1 | To design | 5 |
| ☐ | ADM-43 Ticket detail (admin) (Page) | ADM-43 | P1 | To design | 2 |
| ☐ | ADM-44 Reports (scoped CSV exports) (Page) | ADM-44 | P1 | To design | 5 |
| ☐ | ADM-45 Audit log (Page) | ADM-45 | P1 | To design | 5 |
| ☐ | ADM-46 Staff and roles (Page) | ADM-46 | P1 | To design | 5 |
| ☐ | ADM-47 Platform settings and commission (Page) | ADM-47 | P0 | To design | 4 |
| ☐ | ADM-48 Logistics and delivery settings (Page) | ADM-48 | P2 | To design | 2 |
| ☐ | ADM-49 System health and webhooks (Page) | ADM-49 | P2 | To design | 2 |
| ☐ | ADM-50 Tax configuration and invoicing (Page) | ADM-50 | P1 | Blocked – design placeholder | 2 |
| ☐ | ADM-51 Data requests, account closure and legal hold (Page) | ADM-51 | P1 | To design | 2 |
| ☐ | ADM-52 Executive analytics (Page) | ADM-52 | P2 | To design | 2 |
| ☐ | ADM-53 Sandbox provider simulator (Action) | ADM-53 | P2 | To design | 2 |


## 16. Mobile-responsive screens

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | Mobile admin drawer navigation | — | P1 | To design | 1 |
| ☐ | Mobile app shell: header, bottom tabs, More sheet (buyer and seller) | — | P0 | To design | 1 |
| ☐ | Mobile filter sheet and sort sheet | — | P0 | To design | 1 |
| ☐ | Mobile quote comparison cards | — | P0 | To design | 1 |
| ☐ | Mobile sticky action bars (product, checkout, forms) | — | P0 | To design | 1 |
| ☐ | Mobile table-to-card pattern (lists) | — | P0 | To design | 1 |
| ☐ | RTL mirroring review of every P0 mobile frame | — | P0 | To design | 1 |
| ☐ | Tablet layouts for 12 key templates (home, search, product, storefront, dashboards, lists, detail, checkout, admin queue, admin detail, messages, forms) | — | P1 | To design | 1 |


## 17. Empty and error states

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | SYS-01 Not found / not available (Page) | SYS-01 | P0 | To design | 4 |
| ☐ | SYS-02 Error with retry and reference (Page) | SYS-02 | P0 | To design | 4 |
| ☐ | SYS-03 Sandbox environment banner (Page) | SYS-03 | P0 | To design | 4 |
| ☐ | SYS-04 Trading unavailable / maintenance (Page) | SYS-04 | P2 | To design | 2 |
| ☐ | Account restricted / licence expired banners | — | P0 | To design | 1 |
| ☐ | Disabled-action reasons (trade panel, RFQ, messaging) | — | P0 | To design | 1 |
| ☐ | Empty states (all lists, see section 18) | — | P0 | To design | 1 |
| ☐ | Error with retry and reference | — | P0 | To design | 1 |
| ☐ | Forbidden and not found pages | — | P0 | To design | 1 |
| ☐ | Form validation and error summary | — | P0 | To design | 1 |
| ☐ | Loading skeletons per template | — | P0 | To design | 1 |
| ☐ | Payment failed / expired / late payment | — | P0 | To design | 1 |
| ☐ | Rate limited | — | P2 | To design | 1 |
| ☐ | Sandbox labelling on all money screens | — | P0 | To design | 1 |
| ☐ | Session expired | — | P0 | To design | 1 |
| ☐ | Stale record conflict | — | P1 | To design | 1 |
| ☐ | Success confirmations (inline and toast) | — | P1 | To design | 1 |
| ☐ | Upload failure and malware block | — | P0 | To design | 1 |


## 18. Interactive prototypes

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | Admin: dispute triage → proposal | — | P1 | To build | 0 |
| ☐ | Admin: refund request → second-approver approval | — | P0 | To build | 0 |
| ☐ | Admin: verification review and decision (with MFA sign-in) | — | P0 | To build | 0 |
| ☐ | Arabic RTL walkthrough of buyer purchase | — | P0 | To build | 0 |
| ☐ | Buyer: RFQ create → publish → compare quotes → accept → pay | — | P0 | To build | 0 |
| ☐ | Buyer: confirm receipt → review / open dispute | — | P0 | To build | 0 |
| ☐ | Buyer: first visit → register → company onboarding → verification submitted | — | P0 | To build | 0 |
| ☐ | Buyer: search → product → add to cart → checkout → sandbox payment → order | — | P0 | To build | 0 |
| ☐ | Mobile: browse, cart and checkout on 360px | — | P0 | To build | 0 |
| ☐ | Seller: RFQ inbox → quote → revision → accepted → fulfil order | — | P0 | To build | 0 |
| ☐ | Seller: onboarding → storefront → add product → submit for review | — | P0 | To build | 0 |
| ☐ | Support ticket lifecycle | — | P1 | To build | 0 |


## 19. Developer handoff

| ☐ | Deliverable | Screen | Priority | State | Est. frames |
|---|---|---|---|---|---|
| ☐ | Accessibility annotations (focus order, landmarks, labels) | — | P0 | To prepare | 0 |
| ☐ | Asset export rules (SVG icons, image placeholders) | — | P1 | To prepare | 0 |
| ☐ | Change log against this specification | — | P1 | To prepare | 0 |
| ☐ | Component specs with states and token names | — | P0 | To prepare | 0 |
| ☐ | Copy deck export keyed to i18n message keys (EN/AR) | — | P0 | To prepare | 0 |
| ☐ | Redlines for responsive breakpoints | — | P0 | To prepare | 0 |
| ☐ | Screen-to-route/API/entity map annotated on each frame (section 25) | — | P0 | To prepare | 0 |
| ☐ | Status mapping table (enum → label → badge) | — | P0 | To prepare | 0 |
