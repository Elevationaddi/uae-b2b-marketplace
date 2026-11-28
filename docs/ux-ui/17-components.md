# 17. UI components inventory

76 reusable components with 234 listed variants. No final colours or typography are assigned here (preliminary styling is in section 28). "Exists" refers to the current implementation in `apps/web/src/components/ui.tsx`, `resource.tsx`, the domain UI files and `apps/web/src/app/globals.css`.

| ID | Component | Group | Purpose | Variants | Interaction states | Exists in code | Used in | Priority |
|---|---|---|---|---|---|---|---|---|
| C-01 | Button | Actions | Trigger actions | Primary, Secondary, Tertiary/Link, Danger, Accent CTA (Orange), Icon-only; sizes S/M/L; full-width (mobile) | Default, Hover, Focus-visible, Pressed, Disabled, Loading | Yes (.btn, .btn-primary, .btn-secondary, .btn-danger, .btn-link) | All | P0 |
| C-02 | Link | Actions | Navigate inline | Inline, Standalone with arrow, External (opens new tab with icon) | Default, Hover, Visited (optional), Focus-visible | Yes (.link-button) | All | P0 |
| C-03 | Text input | Inputs | Single-line entry | Text, Email, Password (show/hide), Search, Number, Money (AED prefix), Phone (+971), URL | Default, Hover, Focus, Filled, Error, Disabled, Read-only | Yes (Field) | All forms | P0 |
| C-04 | Textarea | Inputs | Long text | With counter, auto-grow | As C-03 + character limit reached | Yes (TextArea) | RFQ, quote, dispute, support | P0 |
| C-05 | Select / dropdown | Inputs | Choose one option | Native select, Searchable combobox, Grouped | Default, Open, Focus, Error, Disabled | Yes (SelectField) | All forms | P0 |
| C-06 | Checkbox | Inputs | Binary or multi choice | Single, Group, Indeterminate | Unchecked, Checked, Indeterminate, Focus, Disabled, Error | Yes (.check, .check-grid) | Filters, forms, terms | P0 |
| C-07 | Radio group / radio cards | Inputs | Choose one of few | Inline, Stacked, Card (with description) | Unselected, Selected, Focus, Disabled, Error | Partial | RFQ visibility, address, decisions | P0 |
| C-08 | Toggle switch | Inputs | On/off setting | With label and description | Off, On, Focus, Disabled | No (checkboxes today) | Notification prefs, settings | P1 |
| C-09 | Date / date-time picker | Inputs | Pick Dubai dates/times | Date, Date-time with "(Dubai time)" suffix, Range | Default, Open, Error, Disabled | Partial (native inputs) | RFQ, quote, reports, ops range | P0 |
| C-10 | Quantity stepper | Inputs | Change quantities respecting MOQ/increment | With min/step hint, Compact | Default, At minimum, At maximum, Error, Disabled | Yes (.qty-edit) | Product, cart | P0 |
| C-11 | OTP / authenticator code input | Inputs | 6-digit TOTP or recovery code | 6 boxes or single field; Recovery code mode | Default, Error, Locked | Partial | Admin MFA, exports | P0 |
| C-12 | File uploader | Inputs | Upload documents/images with scan status | Single, Multiple, Image grid, Drag-and-drop (desktop) with button alternative | Empty, Uploading (progress), Scanning, Clean, Infected/blocked, Error (type/size), Removing | Partial (.upload-form, .file-list) | Verification, product media, RFQ, quote, dispute, proof | P0 |
| C-13 | Repeater (key-value / list rows) | Inputs | Add/remove rows | Specifications, certifications, tiers, attributes | Empty, Filled, Row error, Max reached | Partial (.row-with-remove) | Product, storefront, pricing | P0 |
| C-14 | Search bar with suggestions | Navigation | Marketplace search | Header (desktop), Full-width (mobile), With grouped suggestions | Empty, Typing, Suggestions open, No suggestions, Loading | Yes (.mkt-search, .suggest) | Marketplace header | P0 |
| C-15 | Site header (marketplace) | Navigation | Brand placeholder, search, account links, language switch | Guest, Signed-in, Seller | Default, Scrolled (compact) | Yes (MarketShell) | Public | P0 |
| C-16 | App header (workspace) | Navigation | Global app navigation with badges and workspace switcher | Buyer, Seller, Multi-workspace | Default, With unread badges | Yes (AppShell) | Company app | P0 |
| C-17 | Sub-navigation / sidebar | Navigation | Section navigation for buyer/seller | Desktop sidebar, Horizontal tabs, Mobile section picker | Default, Active, Hover, Focus | Yes (.seller-nav) | Buyer, seller | P0 |
| C-18 | Admin navigation | Navigation | Capability-filtered admin nav | Expanded sidebar, Collapsed, Mobile drawer | Default, Active, Hover, Focus | Yes (AdminShell) | Admin | P0 |
| C-19 | Mobile bottom navigation | Navigation | Primary destinations on ≤720px | 4–5 items + More; with badges | Default, Active, Badge | Yes (.bottom-nav) — labels truncate | Company app | P0 |
| C-20 | Breadcrumb | Navigation | Location in hierarchy | Standard, Truncated (mobile) | Default, Hover, Current | Yes (.breadcrumb) | Marketplace, detail pages | P1 |
| C-21 | Tabs | Navigation | Switch views within a page | Underline, Segmented (.seg), Scrollable | Default, Active, Hover, Focus, Disabled, With count | Yes (.tabs, .seg) | Lists, product editor | P0 |
| C-22 | Pagination / Load more | Navigation | Cursor pagination | "Show more results", Pager with previous/next | Default, Loading, End reached | Yes (Pager) | All lists | P0 |
| C-23 | Workspace switcher | Navigation | Switch company workspace | Select, Menu with company + kind | Default, Open | Yes (.ws-switch) | App header | P0 |
| C-24 | Language switch | Navigation | EN/AR toggle preserving route | Text toggle "العربية"/"English" | Default, Focus | Yes (LocaleSwitch) | All headers | P0 |
| C-25 | Product card | Cards | Product summary in grids/lists | Grid, List, Compact (related), Unavailable (gone), With "Featured" label, Guest (price locked) | Default, Hover, Focus, Saved, In compare | Yes (ProductCardView, .pcard) | Discovery | P0 |
| C-26 | Manufacturer (supplier) card | Cards | Supplier summary | Grid, List, Featured, Compact | Default, Hover, Focus, Saved | Yes (SupplierCardView, .scard) | Discovery, saved | P0 |
| C-27 | Category tile / chip | Cards | Category entry | Tile with image, Chip with count, Directory block | Default, Hover, Focus | Yes (.cat-tile, .cat-chips) | Home, categories | P0 |
| C-28 | KPI / dashboard tile | Cards | Metric with link | Count, Money (AED), With trend (future), Linked | Default, Hover, Loading, Zero | Yes (.kpi) | Dashboards | P0 |
| C-29 | Financial summary card | Cards | Money breakdowns | Totals table, Settlement buckets, Ledger balance | Default, Loading, Sandbox-labelled | Yes (Totals, .kpis-money) | Checkout, order, finance | P0 |
| C-30 | Card / section container | Layout | Group content | Plain, With header/actions, Subcard | Default | Yes (.card, Section) | All | P0 |
| C-31 | Data table | Data display | Tabular data | Standard, Compact, With row actions, With selection (future), Responsive stacked | Default, Hover row, Loading, Empty, Error | Yes (.table, .table-wrap) | Lists, admin | P0 |
| C-32 | Description list | Data display | Label/value pairs | Two-column, Stacked | Default | Yes (DefinitionList) | Details | P0 |
| C-33 | Status badge | Status | State text + icon + semantic colour | One per status family (section 16): neutral, info, success, warning, danger, pending, verified | Static | Yes (StatusBadge, StateBadge) | All | P0 |
| C-34 | Verified badge | Status | Verified company indicator | Inline dot, Pill with text, With "since" date | Static | Yes (VerifiedBadge, .pill-verified) | Discovery, storefront | P0 |
| C-35 | Availability badge | Status | Stock / mode indicator | In stock, Low, Out, Made to order | Static | Yes (AvailabilityBadge) | Product | P0 |
| C-36 | Alert / banner | Feedback | Inline messages | Info, Success, Warning, Error; with title, actions, dismiss | Static, Dismissible | Yes (Alert, .alert-*) | All | P0 |
| C-37 | Sandbox banner / pill | Feedback | Mark sandbox payments and data | Global banner, Inline pill, Section note | Static | Yes (SandboxNotice, .sandbox-banner) | Payment, finance, ops | P0 |
| C-38 | Toast / inline confirmation | Feedback | Brief success after action | Success, Error | Enter, Visible, Exit (respect reduced motion) | Partial (inline alerts) | All actions | P1 |
| C-39 | Modal / dialog | Overlays | Focused task or confirmation | Confirm, Destructive confirm, Form dialog, Decision (radio + reason) | Open, Submitting, Error | Yes (ConfirmDialog, .dialog) | All | P0 |
| C-40 | Drawer / bottom sheet | Overlays | Side panel or mobile sheet | Right drawer (desktop), Bottom sheet (mobile), Full-screen sheet | Open, Closed | No | Filters, movements, details | P1 |
| C-41 | Tooltip / help text | Overlays | Explain fields and icons | Hover/focus tooltip, Inline hint | Hidden, Visible | Partial (.field-hint) | Forms, figures | P1 |
| C-42 | Popover menu | Overlays | Overflow actions | Row actions, Account menu | Open, Closed | No | Tables, header | P1 |
| C-43 | Image gallery | Media | Product/storefront images | Main + thumbnails, Grid, Lightbox | Default, Selected thumbnail, Loading, Missing image placeholder | Yes (.pd-thumbs, .sf-gallery) | Product, storefront | P0 |
| C-44 | Media manager grid | Media | Upload/reorder images | Product (12), Storefront by kind | Empty, Uploading, Scanning, Error | Yes (.media-grid) | Seller | P0 |
| C-45 | Price tier table | Commerce | Quantity tiers | Read-only, Editable | Default, Highlight current tier | Yes (.tier-list) | Product, pricing | P0 |
| C-46 | Price display / locked price | Commerce | AED price or sign-in prompt | Unit price, Range, Locked (guest), Quote only | Static | Yes (PriceLine, .price-locked) | Discovery | P0 |
| C-47 | Trade action panel | Commerce | Product CTA area with disabled reasons | Cart-eligible, Quote-only, Made-to-order, Signed-out, Not approved | Default, Adding, Added | Yes (.pd-trade) | Product | P0 |
| C-48 | Cart line / supplier group | Commerce | Cart rows grouped by supplier | With issue, Without issue | Default, Updating, Error | Yes | Cart | P0 |
| C-49 | Order lines table | Commerce | Lines and totals | Buyer (no commission), Seller (commission + payable), Admin | Static | Yes (OrderLines, Totals) | Orders | P0 |
| C-50 | Address card / block | Commerce | Address display/selection | Display, Selectable (radio card), Default badge | Default, Selected, Archived | Yes (AddressBlock) | Addresses, checkout, orders | P0 |
| C-51 | Quote comparison | Commerce | Side-by-side quotes | Table (desktop), Cards (mobile), Lowest-total marker | Default, Accepted, Declined, Expired | Yes (QuoteComparison) — mobile overflow | RFQ | P0 |
| C-52 | Fulfilment card | Commerce | Shipment details | Not dispatched, Dispatched, Delivered with proof | Static | Yes (FulfilmentCard) | Orders | P0 |
| C-53 | Timeline / progress tracker | Progress | Event history and lifecycle position | Event timeline (actor side), Stepper (order lifecycle), Checklist (verification) | Done, Current, Upcoming, Failed/Cancelled | Partial (Timeline; no stepper) | RFQ, order, verification | P0 |
| C-54 | Step-by-step form (wizard) | Forms | Multi-step onboarding | Steps header, Save and continue, Review | Step done, Current, Error | No (single long forms) | ACC-02, SEL-07 | P1 |
| C-55 | Form field wrapper | Forms | Label, hint, error, required marker | Standard, Inline, Bilingual pair (EN/AR side by side) | Default, Error, Disabled | Yes (Field, .field-error) | All forms | P0 |
| C-56 | Error summary | Forms | List errors at top of long forms with links | — | Visible after submit | No | Long forms | P1 |
| C-57 | Filter panel | Discovery | Faceted filters | Sidebar (desktop), Sheet (mobile), Chip bar of active filters | Default, Applied, Clear all | Partial (.filters, .filters-toggle) | Search, category, lists | P0 |
| C-58 | Results bar | Discovery | Count, sort, view toggle | — | Default | Yes (.results-bar) | Search | P0 |
| C-59 | Compare tray / comparison table | Discovery | Compare up to N products | Tray, Table | Empty, Full | Yes (.compare-table) | Compare | P1 |
| C-60 | Star rating | Reviews | Display and input rating | Display (average + count), Input (radio 1–5) | Default, Hover (input), Focus | Yes (Stars) | Storefront, order | P1 |
| C-61 | Review list item | Reviews | Anonymous review | Public, Own, Admin (with identity), Hidden | Static | Yes (.review-list) | Storefront, admin | P1 |
| C-62 | Conversation list item | Communication | Conversation preview | Unread, Read, RFQ-linked | Default, Hover, Selected | Yes (.conv-list) | Messages | P0 |
| C-63 | Message bubble / thread | Communication | Messages by side | Buyer, Seller, Admin, System; with attachment (future) | Sent, Sending, Failed | Yes (.thread-*) | Messages, disputes, support | P0 |
| C-64 | Message composer | Communication | Write and send | Text, With attachment, Disabled (read-only/closed) | Default, Sending, Error, Rate limited | Yes | Messages, disputes, support | P0 |
| C-65 | Notification item | Communication | In-app notification | Unread, Read; by type icon | Default, Hover | Yes (.notif-list) | Notification centre | P0 |
| C-66 | Unread badge | Communication | Counts on nav | Dot, Number, 99+ | Static | Yes (.nav-badge) | Header, bottom nav | P0 |
| C-67 | Chart | Data visualisation | Trends and distributions (future analytics) | Line, Bar, Donut (avoid), Sparkline | Default, Hover tooltip, Empty, Loading | No | Dashboards (planned) | P2 |
| C-68 | Skeleton loader | Feedback | Loading placeholder | Lines, Card, Table rows, Image | Animated (static when reduced motion) | Yes (Skeleton) | All | P0 |
| C-69 | Empty state | Feedback | No data with next step | Neutral, First-use, Filtered (no results), Permission | Static | Yes (Empty) | All lists | P0 |
| C-70 | Error state | Feedback | Load failure with retry and reference ID | Inline, Full page, Not found, Forbidden | Static | Yes (ApiErrorAlert, NotFound, Forbidden) | All | P0 |
| C-71 | Page header | Layout | Title, description, actions | With breadcrumb, With status badge, With actions | Static | Yes (PageHeader) | All | P0 |
| C-72 | Grid and container | Layout | Responsive layout | Narrow, Default, Wide; 2/3/4 columns | — | Yes (.container*, .grid-*) | All | P0 |
| C-73 | Countdown / deadline | Commerce | Show time left in Dubai time | Payment due, Quote deadline, Reservation | Normal, Urgent (<1h), Expired | Partial (text only) | Checkout, RFQ | P1 |
| C-74 | Capability / role pill | Status | Show role and capabilities | Role, Capability list | Static | Yes (CapabilityPills) | Team, admin | P2 |
| C-75 | Footer | Layout | Site links, legal, language | Public, App (minimal) | Static | No | Public | P1 |
| C-76 | Email template | Communication | Transactional email layout EN/AR | Notification, Action required, Security | — | Partial (plain-text templates) | Email | P0 |


## 17.1 Interaction state definitions

| State | Definition |
|---|---|
| Default | Resting appearance |
| Hover | Pointer over (desktop only; never the only cue) |
| Focus-visible | Keyboard focus: 2px ring with offset |
| Pressed / active | During click/tap |
| Selected | Chosen item in a set (tabs, radio cards, rows) |
| Disabled | Not available; must explain why nearby |
| Loading | Action in progress; prevents repeat |
| Error | Invalid input or failed action, with message |
| Read-only | Visible but not editable (e.g. email in settings) |


## 17.2 Component notes

### C-01 Button

- **Purpose:** Trigger actions
- **Variants:** Primary, Secondary, Tertiary/Link, Danger, Accent CTA (Orange), Icon-only; sizes S/M/L; full-width (mobile)
- **States:** Default, Hover, Focus-visible, Pressed, Disabled, Loading
- **In code:** Yes (.btn, .btn-primary, .btn-secondary, .btn-danger, .btn-link)
- **Used in:** All
- **Priority:** P0

### C-02 Link

- **Purpose:** Navigate inline
- **Variants:** Inline, Standalone with arrow, External (opens new tab with icon)
- **States:** Default, Hover, Visited (optional), Focus-visible
- **In code:** Yes (.link-button)
- **Used in:** All
- **Priority:** P0

### C-03 Text input

- **Purpose:** Single-line entry
- **Variants:** Text, Email, Password (show/hide), Search, Number, Money (AED prefix), Phone (+971), URL
- **States:** Default, Hover, Focus, Filled, Error, Disabled, Read-only
- **In code:** Yes (Field)
- **Used in:** All forms
- **Priority:** P0

### C-04 Textarea

- **Purpose:** Long text
- **Variants:** With counter, auto-grow
- **States:** As C-03 + character limit reached
- **In code:** Yes (TextArea)
- **Used in:** RFQ, quote, dispute, support
- **Priority:** P0

### C-05 Select / dropdown

- **Purpose:** Choose one option
- **Variants:** Native select, Searchable combobox, Grouped
- **States:** Default, Open, Focus, Error, Disabled
- **In code:** Yes (SelectField)
- **Used in:** All forms
- **Priority:** P0

### C-06 Checkbox

- **Purpose:** Binary or multi choice
- **Variants:** Single, Group, Indeterminate
- **States:** Unchecked, Checked, Indeterminate, Focus, Disabled, Error
- **In code:** Yes (.check, .check-grid)
- **Used in:** Filters, forms, terms
- **Priority:** P0

### C-07 Radio group / radio cards

- **Purpose:** Choose one of few
- **Variants:** Inline, Stacked, Card (with description)
- **States:** Unselected, Selected, Focus, Disabled, Error
- **In code:** Partial
- **Used in:** RFQ visibility, address, decisions
- **Priority:** P0

### C-08 Toggle switch

- **Purpose:** On/off setting
- **Variants:** With label and description
- **States:** Off, On, Focus, Disabled
- **In code:** No (checkboxes today)
- **Used in:** Notification prefs, settings
- **Priority:** P1

### C-09 Date / date-time picker

- **Purpose:** Pick Dubai dates/times
- **Variants:** Date, Date-time with "(Dubai time)" suffix, Range
- **States:** Default, Open, Error, Disabled
- **In code:** Partial (native inputs)
- **Used in:** RFQ, quote, reports, ops range
- **Priority:** P0

### C-10 Quantity stepper

- **Purpose:** Change quantities respecting MOQ/increment
- **Variants:** With min/step hint, Compact
- **States:** Default, At minimum, At maximum, Error, Disabled
- **In code:** Yes (.qty-edit)
- **Used in:** Product, cart
- **Priority:** P0

### C-11 OTP / authenticator code input

- **Purpose:** 6-digit TOTP or recovery code
- **Variants:** 6 boxes or single field; Recovery code mode
- **States:** Default, Error, Locked
- **In code:** Partial
- **Used in:** Admin MFA, exports
- **Priority:** P0

### C-12 File uploader

- **Purpose:** Upload documents/images with scan status
- **Variants:** Single, Multiple, Image grid, Drag-and-drop (desktop) with button alternative
- **States:** Empty, Uploading (progress), Scanning, Clean, Infected/blocked, Error (type/size), Removing
- **In code:** Partial (.upload-form, .file-list)
- **Used in:** Verification, product media, RFQ, quote, dispute, proof
- **Priority:** P0
- **Note:** File uploader must show each stage returned by the API: uploading, scanning (scan state PENDING), clean, blocked (INFECTED) and removal. Never allow opening a file before it is clean.

### C-13 Repeater (key-value / list rows)

- **Purpose:** Add/remove rows
- **Variants:** Specifications, certifications, tiers, attributes
- **States:** Empty, Filled, Row error, Max reached
- **In code:** Partial (.row-with-remove)
- **Used in:** Product, storefront, pricing
- **Priority:** P0

### C-14 Search bar with suggestions

- **Purpose:** Marketplace search
- **Variants:** Header (desktop), Full-width (mobile), With grouped suggestions
- **States:** Empty, Typing, Suggestions open, No suggestions, Loading
- **In code:** Yes (.mkt-search, .suggest)
- **Used in:** Marketplace header
- **Priority:** P0

### C-15 Site header (marketplace)

- **Purpose:** Brand placeholder, search, account links, language switch
- **Variants:** Guest, Signed-in, Seller
- **States:** Default, Scrolled (compact)
- **In code:** Yes (MarketShell)
- **Used in:** Public
- **Priority:** P0

### C-16 App header (workspace)

- **Purpose:** Global app navigation with badges and workspace switcher
- **Variants:** Buyer, Seller, Multi-workspace
- **States:** Default, With unread badges
- **In code:** Yes (AppShell)
- **Used in:** Company app
- **Priority:** P0

### C-17 Sub-navigation / sidebar

- **Purpose:** Section navigation for buyer/seller
- **Variants:** Desktop sidebar, Horizontal tabs, Mobile section picker
- **States:** Default, Active, Hover, Focus
- **In code:** Yes (.seller-nav)
- **Used in:** Buyer, seller
- **Priority:** P0

### C-18 Admin navigation

- **Purpose:** Capability-filtered admin nav
- **Variants:** Expanded sidebar, Collapsed, Mobile drawer
- **States:** Default, Active, Hover, Focus
- **In code:** Yes (AdminShell)
- **Used in:** Admin
- **Priority:** P0

### C-19 Mobile bottom navigation

- **Purpose:** Primary destinations on ≤720px
- **Variants:** 4–5 items + More; with badges
- **States:** Default, Active, Badge
- **In code:** Yes (.bottom-nav) — labels truncate
- **Used in:** Company app
- **Priority:** P0

### C-20 Breadcrumb

- **Purpose:** Location in hierarchy
- **Variants:** Standard, Truncated (mobile)
- **States:** Default, Hover, Current
- **In code:** Yes (.breadcrumb)
- **Used in:** Marketplace, detail pages
- **Priority:** P1

### C-21 Tabs

- **Purpose:** Switch views within a page
- **Variants:** Underline, Segmented (.seg), Scrollable
- **States:** Default, Active, Hover, Focus, Disabled, With count
- **In code:** Yes (.tabs, .seg)
- **Used in:** Lists, product editor
- **Priority:** P0

### C-22 Pagination / Load more

- **Purpose:** Cursor pagination
- **Variants:** "Show more results", Pager with previous/next
- **States:** Default, Loading, End reached
- **In code:** Yes (Pager)
- **Used in:** All lists
- **Priority:** P0

### C-23 Workspace switcher

- **Purpose:** Switch company workspace
- **Variants:** Select, Menu with company + kind
- **States:** Default, Open
- **In code:** Yes (.ws-switch)
- **Used in:** App header
- **Priority:** P0

### C-24 Language switch

- **Purpose:** EN/AR toggle preserving route
- **Variants:** Text toggle "العربية"/"English"
- **States:** Default, Focus
- **In code:** Yes (LocaleSwitch)
- **Used in:** All headers
- **Priority:** P0

### C-25 Product card

- **Purpose:** Product summary in grids/lists
- **Variants:** Grid, List, Compact (related), Unavailable (gone), With "Featured" label, Guest (price locked)
- **States:** Default, Hover, Focus, Saved, In compare
- **In code:** Yes (ProductCardView, .pcard)
- **Used in:** Discovery
- **Priority:** P0
- **Note:** Product card price area has four mutually exclusive variants: guest (locked), unit/tier price, quote only, unavailable.

### C-26 Manufacturer (supplier) card

- **Purpose:** Supplier summary
- **Variants:** Grid, List, Featured, Compact
- **States:** Default, Hover, Focus, Saved
- **In code:** Yes (SupplierCardView, .scard)
- **Used in:** Discovery, saved
- **Priority:** P0

### C-27 Category tile / chip

- **Purpose:** Category entry
- **Variants:** Tile with image, Chip with count, Directory block
- **States:** Default, Hover, Focus
- **In code:** Yes (.cat-tile, .cat-chips)
- **Used in:** Home, categories
- **Priority:** P0

### C-28 KPI / dashboard tile

- **Purpose:** Metric with link
- **Variants:** Count, Money (AED), With trend (future), Linked
- **States:** Default, Hover, Loading, Zero
- **In code:** Yes (.kpi)
- **Used in:** Dashboards
- **Priority:** P0

### C-29 Financial summary card

- **Purpose:** Money breakdowns
- **Variants:** Totals table, Settlement buckets, Ledger balance
- **States:** Default, Loading, Sandbox-labelled
- **In code:** Yes (Totals, .kpis-money)
- **Used in:** Checkout, order, finance
- **Priority:** P0

### C-30 Card / section container

- **Purpose:** Group content
- **Variants:** Plain, With header/actions, Subcard
- **States:** Default
- **In code:** Yes (.card, Section)
- **Used in:** All
- **Priority:** P0

### C-31 Data table

- **Purpose:** Tabular data
- **Variants:** Standard, Compact, With row actions, With selection (future), Responsive stacked
- **States:** Default, Hover row, Loading, Empty, Error
- **In code:** Yes (.table, .table-wrap)
- **Used in:** Lists, admin
- **Priority:** P0

### C-32 Description list

- **Purpose:** Label/value pairs
- **Variants:** Two-column, Stacked
- **States:** Default
- **In code:** Yes (DefinitionList)
- **Used in:** Details
- **Priority:** P0

### C-33 Status badge

- **Purpose:** State text + icon + semantic colour
- **Variants:** One per status family (section 16): neutral, info, success, warning, danger, pending, verified
- **States:** Static
- **In code:** Yes (StatusBadge, StateBadge)
- **Used in:** All
- **Priority:** P0
- **Note:** One badge component; tone chosen from the status mapping in section 16; always icon + text.

### C-34 Verified badge

- **Purpose:** Verified company indicator
- **Variants:** Inline dot, Pill with text, With "since" date
- **States:** Static
- **In code:** Yes (VerifiedBadge, .pill-verified)
- **Used in:** Discovery, storefront
- **Priority:** P0

### C-35 Availability badge

- **Purpose:** Stock / mode indicator
- **Variants:** In stock, Low, Out, Made to order
- **States:** Static
- **In code:** Yes (AvailabilityBadge)
- **Used in:** Product
- **Priority:** P0

### C-36 Alert / banner

- **Purpose:** Inline messages
- **Variants:** Info, Success, Warning, Error; with title, actions, dismiss
- **States:** Static, Dismissible
- **In code:** Yes (Alert, .alert-*)
- **Used in:** All
- **Priority:** P0

### C-37 Sandbox banner / pill

- **Purpose:** Mark sandbox payments and data
- **Variants:** Global banner, Inline pill, Section note
- **States:** Static
- **In code:** Yes (SandboxNotice, .sandbox-banner)
- **Used in:** Payment, finance, ops
- **Priority:** P0
- **Note:** Mandatory on every money screen outside production.

### C-38 Toast / inline confirmation

- **Purpose:** Brief success after action
- **Variants:** Success, Error
- **States:** Enter, Visible, Exit (respect reduced motion)
- **In code:** Partial (inline alerts)
- **Used in:** All actions
- **Priority:** P1

### C-39 Modal / dialog

- **Purpose:** Focused task or confirmation
- **Variants:** Confirm, Destructive confirm, Form dialog, Decision (radio + reason)
- **States:** Open, Submitting, Error
- **In code:** Yes (ConfirmDialog, .dialog)
- **Used in:** All
- **Priority:** P0
- **Note:** Dialogs used for irreversible actions (accept quote, cancel RFQ, decline, withdraw, suspend, remove, approve refund/payout) must state the consequence and use explicit verbs.

### C-40 Drawer / bottom sheet

- **Purpose:** Side panel or mobile sheet
- **Variants:** Right drawer (desktop), Bottom sheet (mobile), Full-screen sheet
- **States:** Open, Closed
- **In code:** No
- **Used in:** Filters, movements, details
- **Priority:** P1

### C-41 Tooltip / help text

- **Purpose:** Explain fields and icons
- **Variants:** Hover/focus tooltip, Inline hint
- **States:** Hidden, Visible
- **In code:** Partial (.field-hint)
- **Used in:** Forms, figures
- **Priority:** P1

### C-42 Popover menu

- **Purpose:** Overflow actions
- **Variants:** Row actions, Account menu
- **States:** Open, Closed
- **In code:** No
- **Used in:** Tables, header
- **Priority:** P1

### C-43 Image gallery

- **Purpose:** Product/storefront images
- **Variants:** Main + thumbnails, Grid, Lightbox
- **States:** Default, Selected thumbnail, Loading, Missing image placeholder
- **In code:** Yes (.pd-thumbs, .sf-gallery)
- **Used in:** Product, storefront
- **Priority:** P0

### C-44 Media manager grid

- **Purpose:** Upload/reorder images
- **Variants:** Product (12), Storefront by kind
- **States:** Empty, Uploading, Scanning, Error
- **In code:** Yes (.media-grid)
- **Used in:** Seller
- **Priority:** P0

### C-45 Price tier table

- **Purpose:** Quantity tiers
- **Variants:** Read-only, Editable
- **States:** Default, Highlight current tier
- **In code:** Yes (.tier-list)
- **Used in:** Product, pricing
- **Priority:** P0

### C-46 Price display / locked price

- **Purpose:** AED price or sign-in prompt
- **Variants:** Unit price, Range, Locked (guest), Quote only
- **States:** Static
- **In code:** Yes (PriceLine, .price-locked)
- **Used in:** Discovery
- **Priority:** P0

### C-47 Trade action panel

- **Purpose:** Product CTA area with disabled reasons
- **Variants:** Cart-eligible, Quote-only, Made-to-order, Signed-out, Not approved
- **States:** Default, Adding, Added
- **In code:** Yes (.pd-trade)
- **Used in:** Product
- **Priority:** P0
- **Note:** Trade panel shows the reason when an action is unavailable: sign in, requires approved buyer, quote only, made to order, checkout disabled.

### C-48 Cart line / supplier group

- **Purpose:** Cart rows grouped by supplier
- **Variants:** With issue, Without issue
- **States:** Default, Updating, Error
- **In code:** Yes
- **Used in:** Cart
- **Priority:** P0

### C-49 Order lines table

- **Purpose:** Lines and totals
- **Variants:** Buyer (no commission), Seller (commission + payable), Admin
- **States:** Static
- **In code:** Yes (OrderLines, Totals)
- **Used in:** Orders
- **Priority:** P0

### C-50 Address card / block

- **Purpose:** Address display/selection
- **Variants:** Display, Selectable (radio card), Default badge
- **States:** Default, Selected, Archived
- **In code:** Yes (AddressBlock)
- **Used in:** Addresses, checkout, orders
- **Priority:** P0

### C-51 Quote comparison

- **Purpose:** Side-by-side quotes
- **Variants:** Table (desktop), Cards (mobile), Lowest-total marker
- **States:** Default, Accepted, Declined, Expired
- **In code:** Yes (QuoteComparison) — mobile overflow
- **Used in:** RFQ
- **Priority:** P0
- **Note:** Lowest-total marker uses icon + text; mobile switches to cards.

### C-52 Fulfilment card

- **Purpose:** Shipment details
- **Variants:** Not dispatched, Dispatched, Delivered with proof
- **States:** Static
- **In code:** Yes (FulfilmentCard)
- **Used in:** Orders
- **Priority:** P0

### C-53 Timeline / progress tracker

- **Purpose:** Event history and lifecycle position
- **Variants:** Event timeline (actor side), Stepper (order lifecycle), Checklist (verification)
- **States:** Done, Current, Upcoming, Failed/Cancelled
- **In code:** Partial (Timeline; no stepper)
- **Used in:** RFQ, order, verification
- **Priority:** P0
- **Note:** Order stepper is recommended (states in section 12); timeline exists.

### C-54 Step-by-step form (wizard)

- **Purpose:** Multi-step onboarding
- **Variants:** Steps header, Save and continue, Review
- **States:** Step done, Current, Error
- **In code:** No (single long forms)
- **Used in:** ACC-02, SEL-07
- **Priority:** P1

### C-55 Form field wrapper

- **Purpose:** Label, hint, error, required marker
- **Variants:** Standard, Inline, Bilingual pair (EN/AR side by side)
- **States:** Default, Error, Disabled
- **In code:** Yes (Field, .field-error)
- **Used in:** All forms
- **Priority:** P0

### C-56 Error summary

- **Purpose:** List errors at top of long forms with links
- **Variants:** —
- **States:** Visible after submit
- **In code:** No
- **Used in:** Long forms
- **Priority:** P1

### C-57 Filter panel

- **Purpose:** Faceted filters
- **Variants:** Sidebar (desktop), Sheet (mobile), Chip bar of active filters
- **States:** Default, Applied, Clear all
- **In code:** Partial (.filters, .filters-toggle)
- **Used in:** Search, category, lists
- **Priority:** P0

### C-58 Results bar

- **Purpose:** Count, sort, view toggle
- **Variants:** —
- **States:** Default
- **In code:** Yes (.results-bar)
- **Used in:** Search
- **Priority:** P0

### C-59 Compare tray / comparison table

- **Purpose:** Compare up to N products
- **Variants:** Tray, Table
- **States:** Empty, Full
- **In code:** Yes (.compare-table)
- **Used in:** Compare
- **Priority:** P1

### C-60 Star rating

- **Purpose:** Display and input rating
- **Variants:** Display (average + count), Input (radio 1–5)
- **States:** Default, Hover (input), Focus
- **In code:** Yes (Stars)
- **Used in:** Storefront, order
- **Priority:** P1

### C-61 Review list item

- **Purpose:** Anonymous review
- **Variants:** Public, Own, Admin (with identity), Hidden
- **States:** Static
- **In code:** Yes (.review-list)
- **Used in:** Storefront, admin
- **Priority:** P1

### C-62 Conversation list item

- **Purpose:** Conversation preview
- **Variants:** Unread, Read, RFQ-linked
- **States:** Default, Hover, Selected
- **In code:** Yes (.conv-list)
- **Used in:** Messages
- **Priority:** P0

### C-63 Message bubble / thread

- **Purpose:** Messages by side
- **Variants:** Buyer, Seller, Admin, System; with attachment (future)
- **States:** Sent, Sending, Failed
- **In code:** Yes (.thread-*)
- **Used in:** Messages, disputes, support
- **Priority:** P0

### C-64 Message composer

- **Purpose:** Write and send
- **Variants:** Text, With attachment, Disabled (read-only/closed)
- **States:** Default, Sending, Error, Rate limited
- **In code:** Yes
- **Used in:** Messages, disputes, support
- **Priority:** P0

### C-65 Notification item

- **Purpose:** In-app notification
- **Variants:** Unread, Read; by type icon
- **States:** Default, Hover
- **In code:** Yes (.notif-list)
- **Used in:** Notification centre
- **Priority:** P0

### C-66 Unread badge

- **Purpose:** Counts on nav
- **Variants:** Dot, Number, 99+
- **States:** Static
- **In code:** Yes (.nav-badge)
- **Used in:** Header, bottom nav
- **Priority:** P0

### C-67 Chart

- **Purpose:** Trends and distributions (future analytics)
- **Variants:** Line, Bar, Donut (avoid), Sparkline
- **States:** Default, Hover tooltip, Empty, Loading
- **In code:** No
- **Used in:** Dashboards (planned)
- **Priority:** P2

### C-68 Skeleton loader

- **Purpose:** Loading placeholder
- **Variants:** Lines, Card, Table rows, Image
- **States:** Animated (static when reduced motion)
- **In code:** Yes (Skeleton)
- **Used in:** All
- **Priority:** P0

### C-69 Empty state

- **Purpose:** No data with next step
- **Variants:** Neutral, First-use, Filtered (no results), Permission
- **States:** Static
- **In code:** Yes (Empty)
- **Used in:** All lists
- **Priority:** P0

### C-70 Error state

- **Purpose:** Load failure with retry and reference ID
- **Variants:** Inline, Full page, Not found, Forbidden
- **States:** Static
- **In code:** Yes (ApiErrorAlert, NotFound, Forbidden)
- **Used in:** All
- **Priority:** P0

### C-71 Page header

- **Purpose:** Title, description, actions
- **Variants:** With breadcrumb, With status badge, With actions
- **States:** Static
- **In code:** Yes (PageHeader)
- **Used in:** All
- **Priority:** P0

### C-72 Grid and container

- **Purpose:** Responsive layout
- **Variants:** Narrow, Default, Wide; 2/3/4 columns
- **States:** —
- **In code:** Yes (.container*, .grid-*)
- **Used in:** All
- **Priority:** P0

### C-73 Countdown / deadline

- **Purpose:** Show time left in Dubai time
- **Variants:** Payment due, Quote deadline, Reservation
- **States:** Normal, Urgent (<1h), Expired
- **In code:** Partial (text only)
- **Used in:** Checkout, RFQ
- **Priority:** P1

### C-74 Capability / role pill

- **Purpose:** Show role and capabilities
- **Variants:** Role, Capability list
- **States:** Static
- **In code:** Yes (CapabilityPills)
- **Used in:** Team, admin
- **Priority:** P2

### C-75 Footer

- **Purpose:** Site links, legal, language
- **Variants:** Public, App (minimal)
- **States:** Static
- **In code:** No
- **Used in:** Public
- **Priority:** P1

### C-76 Email template

- **Purpose:** Transactional email layout EN/AR
- **Variants:** Notification, Action required, Security
- **States:** —
- **In code:** Partial (plain-text templates)
- **Used in:** Email
- **Priority:** P0
