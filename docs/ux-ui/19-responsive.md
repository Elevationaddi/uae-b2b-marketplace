# 19. Mobile and responsive design

## 19.1 Platform support today
| Platform | Supported? | Evidence |
|---|---|---|
| Responsive web | **Yes** | Single Next.js 15 app, CSS breakpoints; E2E project `mobile-360` |
| Mobile web | **Yes** (same app) | Bottom navigation ≤720px; screenshots at phone width in project files |
| Native iOS | **No** | No native project |
| Native Android | **No** | No native project |
| Progressive web app | **No** | No manifest or service worker |
| Desktop administration | **Yes** | Admin portal is desktop-first, responsive |

Target widths from `docs/05-ui.md`: 360, 768, 1024, 1440. Rule: no horizontal page overflow; tables scroll inside a wrapper or render as cards.

## 19.2 Breakpoints (recommended for design)
| Name | Width | Columns | Gutter / margin | Navigation |
|---|---|---|---|---|
| Mobile | 360–719 | 4 | 16 / 16 | Compact header + bottom tabs (4–5) + "More" sheet |
| Tablet | 720–1023 | 8 | 20 / 24 | Header + collapsible sidebar (drawer) |
| Desktop | 1024–1439 | 12 | 24 / 32 | Header + persistent sidebar (workspaces/admin) or top nav (public) |
| Wide | ≥1440 | 12 (max content 1280–1360) | 24 / auto | Same as desktop |

## 19.3 Navigation behaviour
- **Public:** header with search; on mobile the search moves to a full-width row; sub-nav becomes a horizontal chip row with scroll affordance (fade edge) or a "Browse" menu.
- **Company app:** today a global header (Home, Company, Team, RFQs/Seller centre, Messages, Notifications, Marketplace, Settings) plus a sub-nav; on mobile the header wraps and the bottom nav labels truncate (G-20). Recommended: bottom tabs (Buyer: Dashboard, Marketplace, Requests, Orders, More; Seller: Overview, Requests, Orders, Catalogue, More) with badges; "More" opens a sheet with the rest; workspace switcher at the top of "More" and in the desktop header.
- **Admin:** sidebar on desktop; on mobile a drawer opened from a menu button, with queue badges.

## 19.4 Dashboard layouts
Desktop: KPI row (4 tiles), then two columns (tasks / recent activity). Tablet: 2×2 tiles, one column below. Mobile: 2-up compact tiles, task list, sticky primary action.

## 19.5 Tables on smaller screens
- ≤720px: each row becomes a card: title line (primary identifier + status badge), 2–4 key facts, chevron to detail; row actions move to an overflow menu or the detail page.
- Tablets: keep tables with priority columns; hide low-priority columns behind a "Columns" control (admin).
- Comparison tables (quotes, products): one card per item with swipe; keep a sticky "Accept" action per card.

## 19.6 Filter behaviour
Desktop: persistent left column. Mobile/tablet: "Filters ({count})" button opens a full-height sheet with sticky "Show {n} results" and "Clear all"; sort in the same sheet or a separate "Sort" button. Active filters as chips under the results bar.

## 19.7 Form layouts
Single column on mobile; label above field; full-width inputs; 44px minimum target; sticky save bar on long forms; bilingual pairs (EN/AR) stack vertically on mobile and sit side by side on desktop. Multi-step onboarding (recommended wizard) shows "Step 2 of 4".

## 19.8 Checkout experience
Mobile: address selection → per-supplier summary (collapsible) → totals → terms checkbox → sticky "Place order and pay" bar showing the total. Desktop: two columns with a sticky summary. Payment hands off to the provider page (sandbox page today) and returns to the checkout status page, which must work on small screens with the countdown visible.

## 19.9 Product browsing
2-up grid or list on mobile; image-first cards; sticky bottom action bar on product detail (price + primary CTA); swipeable gallery; accordions for specs.

## 19.10 Messaging
Mobile: list → thread as separate screens; composer pinned above the keyboard; back to list. Desktop: two-pane (list + thread).

## 19.11 Touch interactions
44×44 px minimum targets (WCAG 2.2 target size minimum is 24×24; we choose 44 for comfort); no hover-only information (tooltips also on focus/tap); swipe only as a shortcut, never the only way; pull-to-refresh not required.

## 19.12 Accessibility on mobile
Respect OS text size up to 200% without loss of content; visible focus for external keyboards; landmarks preserved; orientation not locked.

## 19.13 Mobile-specific limitations
- File upload uses the native picker; camera capture is allowed for proof of delivery and evidence (recommended `accept` with capture).
- Long admin tables and audit logs are read-only friendly on mobile; complex editing (category attributes, product editor) is supported but optimised for desktop.
- No offline mode, no push notifications (no native app or PWA).
