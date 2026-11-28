# 28. Brand identity (deferred) and approved visual direction

## 28.0 What is deferred and what is approved
**Deferred (do not create or finalise):** business name, logo, brand symbol, slogan, final typography, custom iconography, illustration style, brand personality and verbal identity, app store icon, branded marketing materials. Use the text placeholder **"Manufacturers Marketplace"** wherever a logo appears (set in the placeholder UI font, no symbol).

**Approved (founder, 2026-11-28):** the colour palette below and the visual direction in 28.1. This palette **supersedes** the provisional navy/teal tokens in `docs/05-ui.md` and `packages/ui/src/tokens.css` for design purposes. The application's code and styling are **not** changed by this document. The founder's reference image was not received; this section is built from the approved HEX table and must be reconciled with the image when it is supplied.

## 28.1 Overall design direction
Premium and sophisticated; modern and technology-driven; industrial yet approachable; professional and trustworthy; minimal without feeling empty; international and scalable; distinctive from traditional B2B marketplaces. Avoid: outdated corporate layouts, gradients, unnecessary illustrations, oversized rounded cards, heavy shadows, cluttered dashboards, template or generic AI-site aesthetics.

Translating this into rules:
- **Structure over decoration:** hierarchy comes from spacing, type scale and 1px borders, not from shadows or colour blocks.
- **Calm neutrals, confident blue, rare orange:** most surfaces are white and ivory; blue anchors navigation and primary actions; orange appears once per view for the key conversion.
- **Product imagery leads** in marketplace views; UI chrome recedes.
- **Data density with air:** admin and dashboards use compact tables with generous row separation and clear column alignment.
- **Small radii** (4–10px), crisp edges, industrial precision.

## 28.2 Palette and usage

| Name | HEX | RGB | Role | Usage |
|---|---|---|---|---|
| Bleu Royal | #0D1A64 | rgb(13, 26, 100) | Primary brand colour | Main navigation, primary brand surfaces, premium website sections, selected primary buttons, admin navigation, dark backgrounds |
| Majorelle | #1B2CA2 | rgb(27, 44, 162) | Secondary brand colour | Secondary navigation, supporting elements, dashboard highlights, selected states, secondary brand surfaces |
| Cobalt | #2845D6 | rgb(40, 69, 214) | Interactive elements | Links, active navigation indicators, selected tabs, focus indicators, interactive icons, data visualisation, primary actions where appropriate |
| Orange Brûlé | #E2612D | rgb(226, 97, 45) | Primary accent | High-priority calls to action, key conversion elements, selected accents (sparingly) |
| Abricot | #EE8047 | rgb(238, 128, 71) | Secondary accent | Secondary highlights, soft accent backgrounds, onboarding elements, supporting data visualisation |
| Obsidienne | #302722 | rgb(48, 39, 34) | Text and dark surfaces | Body text, descriptions, headings, financial figures, dark neutral elements |
| Ivoire Naturel | #ECE4DB | rgb(236, 228, 219) | Neutral backgrounds | Page backgrounds, supporting sections, discovery surfaces, dashboard backgrounds, subtle card backgrounds |
| White | #FFFFFF | rgb(255, 255, 255) | Content surfaces | Product cards, forms, tables, modals, containers, high-contrast text on dark |


### Usage per colour
- **Bleu Royal #0D1A64:** global navigation bars (public header band optional, app sidebar, admin sidebar), primary buttons by default, premium/hero bands, footer background, dark backgrounds. White text only.
- **Majorelle #1B2CA2:** secondary navigation, hover state of primary buttons, selected navigation item on dark, dashboard highlights (e.g. active KPI), secondary brand surfaces, info status text.
- **Cobalt #2845D6:** links, active tab indicator, focus ring, selected states (border), interactive icons, primary data-visualisation series, in-app interactive buttons where a lighter blue reads better (e.g. "Save draft" is secondary; "Submit quote" may use Cobalt).
- **Orange Brûlé #E2612D:** brand accent; for **text and filled buttons with white labels use the accessible shade #B8461A** (Orange Brûlé 700) because #E2612D with white is 3.5:1 (fails normal text). Reserve for: "Place order and pay", "Add to cart", "Request quotation" on product pages, "Create account" in public header, key promotional highlight. Never for errors or warnings.
- **Abricot #EE8047:** soft accent backgrounds (tint #FEF5F0), onboarding progress accents, secondary chart series, illustration accents (when illustration style is defined). Never as text on white (2.7:1). Use Obsidienne or Bleu Royal text on Abricot.
- **Obsidienne #302722:** body text, headings, money figures, icons on light, dark neutral UI (tooltips).
- **Ivoire Naturel #ECE4DB:** section bands on the public site, discovery surfaces, dashboard backgrounds alternative, subtle card backgrounds, dividers. For long working sessions (app, admin) use the lighter **Ivoire 50 #F6F1EB** as page background.
- **White #FFFFFF:** cards, forms, tables, modals, containers; text on Bleu Royal/Majorelle/Cobalt.

### Colour hierarchy
1. Neutrals (White, Ivoire, Obsidienne text) — foundation.
2. Bleu Royal — structure and primary action.
3. Majorelle / Cobalt — interaction and selection.
4. Orange Brûlé — single most important conversion action per view.
5. Abricot — supporting accent.
6. Semantic colours — status only (separate system).

## 28.3 Distribution (starting point)
| Surface type | Neutrals (White, Ivoire) | Blues | Orange/Abricot |
|---|---|---|---|
| Public marketing pages | 55% | 35% (header/hero/footer bands) | 10% |
| Marketplace discovery (search, product) | 70% | 25% | 5% (Add to cart / Request quote) |
| Buyer and seller dashboards | 70% | 25% (sidebar, links, charts) | 5% |
| Admin portal | 75% | 25% (sidebar, links) | 0–2% (no promotional accent) |
| Checkout | 75% | 20% | 5% (Place order and pay) |
Overall ≈ 60 / 30 / 10 as requested, adapted per purpose.

## 28.4 Semantic colour system
Status colours are separate from brand colours. Every status shows **text + icon + colour**; colour is never the only signal. Tones map to statuses in section 16.

| Tone | Text | Background | Border | Icon | Meaning | Statuses | Text contrast |
|---|---|---|---|---|---|---|---|
| success | #067647 | #ECFDF3 | #ABEFC6 | check-circle | Positive completion | Paid, Captured, Completed, Refunded (buyer), Eligible for payout, Resolved, Delivered (shipment) | 5.40:1 |
| error | #B42318 | #FEF3F2 | #FECDCA | alert-octagon | Failure or blocking problem | Failed, Blocked: malware detected, payment failed | 6.05:1 |
| warning | #7A5A00 | #FFF8DB | #F3D97A | alert-triangle | Needs attention soon; not a failure | More information needed, Restricted, Held (dispute), Partly refunded, licence expiring | 5.99:1 |
| info | #1B2CA2 | #EEF0FB | #C7CCF0 | info | Neutral information, open items | Open, Submitted, Confirmed, Dispatched, Resolution proposed | 9.59:1 |
| pending | #3E4A6B | #EEF1F6 | #C9D0DD | clock | Waiting on someone else | Submitted, Awaiting payment, Awaiting approval, With provider, Pending verification, Waiting for you | 7.74:1 |
| processing | #2845D6 | #ECEFFC | #BCC7F3 | loader (static when reduced motion) | System or party is working on it | Processing, Under review, Sent to provider, Refund in progress, In payout, Scanning | 6.29:1 |
| approved | #067647 | #ECFDF3 | #ABEFC6 | check | Decision positive | Approved (company, version, refund, payout) | 5.40:1 |
| rejected | #B42318 | #FEF3F2 | #FECDCA | x-circle | Decision negative | Rejected, Declined, Removed, Suspended | 6.05:1 |
| verified | #0D1A64 | #E7E9F3 | #B9BEDA | shield-check | Trust indicator (brand-coloured by design) | Verified supplier, Approved company badge | 12.86:1 |
| unverified | #524944 | #F6F1EB | #C7BCB1 | shield (outline) | Not yet verified (only inside own workspace) | Draft company, Pending verification | 7.81:1 |
| disabled | #857A73 | #F6F1EB | #DDD3C8 | — | Unavailable control or item | Disabled buttons, unavailable listings | 3.72:1 |
| completed | #067647 | #ECFDF3 | #ABEFC6 | check-circle | Lifecycle finished successfully | Completed, Paid out, Paid by provider | 5.40:1 |
| cancelled | #524944 | #ECE4DB | #C7BCB1 | slash-circle | Ended without completion (neutral, not an error) | Cancelled, Expired, Withdrawn, Closed, Superseded, Archived | 6.97:1 |


Rules: brand Orange is never used for warnings or errors; "verified" intentionally uses Bleu Royal as a trust signal; "cancelled/expired/closed" are neutral, not red, because they are not failures; "processing" uses Cobalt with a static icon when reduced motion is on.

## 28.5 Design tokens
Names work as Figma variables (`group/name`) and CSS custom properties (`--name`). The existing frontend uses `--color-*`, `--space-*`, `--radius-*` names in `packages/ui/src/tokens.css`; the proposed semantic names keep that convention so a later implementation can swap values without renaming components.

Derived brand scales (mix with white for 50–300, with black for 600–700):

| Scale | 50 | 100 | 200 | 300 | 500 | 600 | 700 |
|---|---|---|---|---|---|---|---|
| royal | #ECEDF3 | #D8DAE6 | #B2B6CD | #8188AE | #0D1A64 | #0B1758 | #0A144B |
| majorelle | #EDEEF8 | #DBDDF0 | #B6BBE1 | #8891CF | #1B2CA2 | #18278F | #14217A |
| cobalt | #EEF0FC | #DDE1F8 | #BAC3F2 | #8F9EEA | #2845D6 | #233DBC | #1E34A0 |
| orange | #FDF2EE | #FAE6DD | #F6CCBC | #F0AD92 | #E2612D | #C75528 | #AA4922 |
| abricot | #FEF5F0 | #FCEBE2 | #FAD6C4 | #F6BD9F | #EE8047 | #D1713E | #B26035 |
| neutral (warm) | #F6F1EB | #ECE4DB | #DDD3C8 | #C7BCB1 | #857A73 | #6A605A | #524944 |


Semantic tokens:

| Group | Figma variable | CSS variable | Value | Usage |
|---|---|---|---|---|
| Brand primitives | brand/royal/500 | --brand-royal-500 | #0D1A64 | Bleu Royal |
| Brand primitives | brand/majorelle/500 | --brand-majorelle-500 | #1B2CA2 | Majorelle |
| Brand primitives | brand/cobalt/500 | --brand-cobalt-500 | #2845D6 | Cobalt |
| Brand primitives | brand/orange/500 | --brand-orange-500 | #E2612D | Orange Brûlé |
| Brand primitives | brand/orange/700 | --brand-orange-700 | #B8461A | Accessible Orange Brûlé shade for text and filled CTA with white label |
| Brand primitives | brand/abricot/500 | --brand-abricot-500 | #EE8047 | Abricot |
| Brand primitives | neutral/900 | --neutral-900 | #302722 | Obsidienne |
| Brand primitives | neutral/100 | --neutral-100 | #ECE4DB | Ivoire Naturel |
| Brand primitives | neutral/0 | --neutral-0 | #FFFFFF | White |
| Background | color/bg/page | --color-bg | #F6F1EB | App and dashboard page background (Ivoire 50, lighter than Ivoire for long sessions) |
| Background | color/bg/subtle | --color-bg-subtle | #ECE4DB | Marketing and discovery section bands (Ivoire Naturel) |
| Background | color/bg/brand | --color-bg-brand | #0D1A64 | Navigation bars, premium bands, admin sidebar |
| Background | color/bg/brand-secondary | --color-bg-brand-secondary | #1B2CA2 | Secondary navigation, selected nav item on dark |
| Background | color/bg/accent-soft | --color-bg-accent-soft | #FEF5F0 | Abricot 50: soft highlight background (onboarding, tips) |
| Surface | color/surface/default | --color-surface | #FFFFFF | Cards, forms, tables, modals |
| Surface | color/surface/raised | --color-surface-raised | #FFFFFF | Dialogs and menus (with elevation-2) |
| Surface | color/surface/sunken | --color-surface-sunken | #FBF8F5 | Table header, input groups, code/IDs |
| Surface | color/surface/selected | --color-surface-selected | #EEF0FC | Cobalt 50: selected row/card |
| Border | color/border/default | --color-border | #DDD3C8 | Card and input borders (decorative; inputs use strong) |
| Border | color/border/strong | --color-border-strong | #857A73 | Input borders and control outlines (≥3:1 on white) |
| Border | color/border/selected | --color-border-selected | #2845D6 | Selected card / radio card |
| Divider | color/divider | --color-divider | #ECE4DB | Row separators, section dividers |
| Text | color/text/primary | --color-text | #302722 | Body text, headings, money |
| Text | color/text/secondary | --color-text-muted | #6A605A | Secondary text, metadata |
| Text | color/text/on-brand | --color-text-on-brand | #FFFFFF | Text on Bleu Royal / Majorelle / Cobalt |
| Text | color/text/link | --color-text-link | #2845D6 | Links |
| Text | color/text/link-visited | --color-text-link-visited | #1B2CA2 | Optional visited links |
| Text | color/text/accent | --color-text-accent | #B8461A | Accent text on light backgrounds |
| Text | color/text/disabled | --color-text-disabled | #857A73 | Disabled labels (exempt from contrast, still ≥3:1 recommended) |
| Action | color/action/primary/bg | --color-action-primary | #0D1A64 | Default primary button (Bleu Royal) |
| Action | color/action/primary/hover | --color-action-primary-hover | #1B2CA2 | Primary hover (Majorelle) |
| Action | color/action/primary/pressed | --color-action-primary-pressed | #0A144B | Bleu Royal 700 |
| Action | color/action/interactive/bg | --color-action-interactive | #2845D6 | Interactive primary where appropriate (in-app actions, tabs indicator) |
| Action | color/action/interactive/hover | --color-action-interactive-hover | #233DBC | Cobalt 600 |
| Action | color/action/accent/bg | --color-action-accent | #B8461A | High-priority conversion CTA (one per view) |
| Action | color/action/accent/hover | --color-action-accent-hover | #A23E17 | Orange 700 darker |
| Action | color/action/secondary/border | --color-action-secondary-border | #0D1A64 | Secondary (outline) button border/text |
| Action | color/action/secondary/hover-bg | --color-action-secondary-hover | #ECEDF3 | Royal 50 |
| Action | color/action/danger/bg | --color-action-danger | #B42318 | Destructive button |
| Action | color/action/disabled/bg | --color-action-disabled | #ECE4DB | Disabled button background |
| State | color/focus/ring | --color-focus | #2845D6 | 2px focus ring, 2px offset (white ring on dark surfaces) |
| State | color/state/hover-overlay | --color-hover-overlay | rgba(13,26,100,0.06) | Hover tint on rows/cards |
| State | color/state/pressed-overlay | --color-pressed-overlay | rgba(13,26,100,0.12) | Pressed tint |
| State | color/state/selected | --color-selected | #EEF0FC | Cobalt 50 background + Cobalt border |
| Opacity | opacity/scrim | --opacity-scrim | rgba(48,39,34,0.56) | Modal backdrop (Obsidienne 56%) |
| Opacity | opacity/disabled | --opacity-disabled | 0.48 | Only for images/icons; text uses disabled colour |
| Spacing | space/1…12 | --space-1 … --space-12 | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px | 4px base (existing tokens keep --space-1..8) |
| Radius | radius/sm, md, lg, full | --radius-sm/md/lg/full | 4, 6, 10, 999 px | Small radii; avoid oversized rounded cards (existing 8/12 → 6/10) |
| Border width | border/1, 2 | --border-1/2 | 1px, 2px | 1px default; 2px selected/focus |
| Elevation | elevation/1, 2, 3 | --shadow-1/2/3 | 0 1px 2px rgba(48,39,34,.06); 0 4px 12px rgba(48,39,34,.08); 0 12px 32px rgba(48,39,34,.12) | Cards rely on borders; shadows only for menus, dialogs, sticky bars |
| Typography (placeholder) | type/body, label, h1–h4 | --font-sans, --text-* | System UI + Noto Sans Arabic (existing stack); sizes 12/14/16/18/20/24/30/36 | Final typeface deferred |


Mapping to existing tokens (for the future implementation, not done now): `--color-navy` → `--color-action-primary` (#0D1A64), `--color-teal` → `--color-text-link`/`--color-focus` (#2845D6), `--color-bg` → #F6F1EB, `--color-text` → #302722, `--color-text-muted` → #6A605A, `--color-border` → #DDD3C8 (decorative) and `--color-border-strong` #857A73 for inputs, `--focus-ring` → 2px #2845D6.

## 28.6 Layout and interface principles
| Topic | Recommendation |
|---|---|
| Grid | 4 / 8 / 12 columns at 360 / 720 / 1024+; max content width 1280 (public) and fluid with 1440 cap (app/admin) |
| Page margins | 16px mobile, 24px tablet, 32px desktop |
| Content spacing | Section gap 48–64px (public), 32px (app); card padding 16px mobile / 24px desktop |
| Component spacing | 4px base; inline gaps 8px; form field gap 16–20px; button groups 8–12px |
| Border radius | 4px inputs/badges, 6px buttons/cards, 10px dialogs/sheets; no pill-shaped cards; badges may be 999px |
| Border thickness | 1px default; 2px selected and focus |
| Elevation | Borders first; shadow-1 for sticky bars, shadow-2 for menus/popovers, shadow-3 for dialogs |
| Visual hierarchy | One H1; clear section headers with optional "View all"; primary action top-right of page header (top-left in RTL) and repeated in sticky mobile bar |
| Icon placement | Leading icons in nav and status badges; trailing chevrons for navigation; 16/20/24px sizes; icon-only buttons need labels |
| Button sizing | Height 40px (desktop default), 48px (mobile primary/sticky), 32px (compact tables); min width 88px; horizontal padding 16px |
| Card layouts | White, 1px border, 6px radius, no shadow; hover changes border to Cobalt 300 |
| Dashboard layouts | KPI row (4) → tasks/activity two-column → tables; avoid more than 8 tiles |
| Data tables | 48px rows (40 compact), sticky header, right-aligned numbers (end-aligned in RTL), zebra off, row hover tint, status column with badges, actions in last column |
| Product image ratios | Product cards 1:1; product gallery 1:1 or 4:3 main with 1:1 thumbnails; storefront cover 16:5 (desktop) / 16:9 (mobile); logos 1:1 |
| Storefront layout | Cover band → identity row (logo, name, verified, facts, CTAs) → tabs → content |
| Mobile navigation | Bottom tabs (4–5) on Bleu Royal or white with Cobalt active indicator; "More" sheet |
| Desktop navigation | Public: top header + sub-nav; App: top header + left sidebar (Bleu Royal or white with Bleu Royal text); Admin: Bleu Royal sidebar |
| Form structure | Sections with headings, label above field, help text below, errors below help, sticky actions on long forms |

## 28.7 Photography and visual content
Use: real UAE manufacturing facilities, machinery in operation, production processes, raw materials, finished goods, close-up product detail, teams at work (with consent), quality control, packaging lines, warehouses and logistics. Style: natural light, true colours, clean backgrounds for products (white or light neutral), consistent product framing (centred, 10% padding), no heavy filters, no text baked into images. Avoid generic handshake/office stock photography. Product imagery is the visual focus in listings and product pages; UI colour should not compete with it (white card backgrounds). Supplier uploads: PNG/JPEG/WebP ≥200px today; recommend ≥1200px for galleries and storefront covers.

## 28.8 Accessibility contrast matrix (WCAG 2.2 AA)
Ratios computed with the WCAG relative-luminance formula. AA requires 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px bold) and for UI components/graphics.

| Foreground | Background | Use | Ratio | WCAG 2.2 result |
|---|---|---|---|---|
| #302722 | #FFFFFF | Body text on white | 14.59:1 | AAA (all text) |
| #302722 | #ECE4DB | Body text on Ivoire Naturel | 11.60:1 | AAA (all text) |
| #302722 | #F6F1EB | Body text on page background | 13.00:1 | AAA (all text) |
| #6A605A | #FFFFFF | Secondary text on white | 6.12:1 | AA (all text) |
| #6A605A | #ECE4DB | Secondary text on Ivoire | 4.86:1 | AA (all text) |
| #857A73 | #FFFFFF | Disabled/placeholder text on white | 4.18:1 | AA large text / UI only |
| #FFFFFF | #0D1A64 | White on Bleu Royal (nav, primary button) | 15.57:1 | AAA (all text) |
| #FFFFFF | #1B2CA2 | White on Majorelle | 10.89:1 | AAA (all text) |
| #FFFFFF | #2845D6 | White on Cobalt (button) | 7.21:1 | AAA (all text) |
| #FFFFFF | #E2612D | White on Orange Brûlé | 3.51:1 | AA large text / UI only |
| #FFFFFF | #B8461A | White on Orange Brûlé 700 (accent CTA) | 5.34:1 | AA (all text) |
| #302722 | #E2612D | Obsidienne on Orange Brûlé | 4.16:1 | AA large text / UI only |
| #FFFFFF | #EE8047 | White on Abricot | 2.69:1 | Fail (decorative only) |
| #302722 | #EE8047 | Obsidienne on Abricot | 5.43:1 | AA (all text) |
| #0D1A64 | #EE8047 | Bleu Royal on Abricot | 5.79:1 | AA (all text) |
| #0D1A64 | #FFFFFF | Bleu Royal text on white | 15.57:1 | AAA (all text) |
| #1B2CA2 | #FFFFFF | Majorelle text on white | 10.89:1 | AAA (all text) |
| #2845D6 | #FFFFFF | Cobalt link on white | 7.21:1 | AAA (all text) |
| #2845D6 | #ECE4DB | Cobalt link on Ivoire | 5.73:1 | AA (all text) |
| #E2612D | #FFFFFF | Orange Brûlé text on white | 3.51:1 | AA large text / UI only |
| #B8461A | #FFFFFF | Orange 700 text on white | 5.34:1 | AA (all text) |
| #EE8047 | #FFFFFF | Abricot text on white | 2.69:1 | Fail (decorative only) |
| #ECE4DB | #0D1A64 | Ivoire text on Bleu Royal | 12.37:1 | AAA (all text) |
| #EE8047 | #0D1A64 | Abricot on Bleu Royal (accent on dark) | 5.79:1 | AA (all text) |
| #E2612D | #0D1A64 | Orange Brûlé on Bleu Royal | 4.43:1 | AA large text / UI only |
| #2845D6 | #0D1A64 | Cobalt on Bleu Royal (avoid) | 2.16:1 | Fail (decorative only) |
| #1B2CA2 | #0D1A64 | Majorelle on Bleu Royal (avoid) | 1.43:1 | Fail (decorative only) |
| #ECE4DB | #FFFFFF | Ivoire on white (avoid as text) | 1.26:1 | Fail (decorative only) |
| #857A73 | #FFFFFF | Input border (strong) vs white – UI 3:1 | 4.18:1 | AA large text / UI only |
| #DDD3C8 | #FFFFFF | Default border vs white – decorative only | 1.48:1 | Fail (decorative only) |
| #2845D6 | #F6F1EB | Focus ring vs page background – UI 3:1 | 6.42:1 | AA (all text) |
| #FFFFFF | #B42318 | White on error (danger button) | 6.57:1 | AA (all text) |
| #067647 | #ECFDF3 | Success badge text | 5.40:1 | AA (all text) |
| #B42318 | #FEF3F2 | Error badge text | 6.05:1 | AA (all text) |
| #7A5A00 | #FFF8DB | Warning badge text | 5.99:1 | AA (all text) |
| #1B2CA2 | #EEF0FB | Info badge text | 9.59:1 | AAA (all text) |
| #3E4A6B | #EEF1F6 | Pending badge text | 7.74:1 | AAA (all text) |
| #2845D6 | #ECEFFC | Processing badge text | 6.29:1 | AA (all text) |
| #0D1A64 | #E7E9F3 | Verified badge text | 12.86:1 | AAA (all text) |
| #524944 | #ECE4DB | Cancelled badge text | 6.97:1 | AA (all text) |
| #524944 | #F6F1EB | Unverified badge text | 7.81:1 | AAA (all text) |
| #857A73 | #F6F1EB | Disabled text on disabled bg | 3.72:1 | AA large text / UI only |


**Approved text/background combinations:** Obsidienne on White, Ivoire 50 or Ivoire Naturel; secondary text #6A605A on White/Ivoire; White on Bleu Royal, Majorelle, Cobalt, Orange 700 (#B8461A) and Error; Cobalt links on White/Ivoire; Bleu Royal or Obsidienne on Abricot; Ivoire or Abricot text on Bleu Royal.

**Approved buttons:** Primary = White on Bleu Royal (hover Majorelle); Interactive = White on Cobalt; Accent CTA = White on #B8461A; Secondary = Bleu Royal text + border on White; Danger = White on #B42318; Disabled = #857A73 text on #ECE4DB (exempt, not interactive).

**Must avoid:** White text on Orange Brûlé #E2612D for normal-size text (3.5:1; only ≥24px or bold ≥18.66px); any text in Abricot on White (2.7:1); Cobalt or Majorelle on Bleu Royal (2.2:1 / 1.4:1); Ivoire on White; default border #DDD3C8 as the only boundary of an input (use #857A73); status conveyed by colour alone.

**Focus indicator:** 2px solid Cobalt #2845D6 with 2px offset on light surfaces (6.4:1 on Ivoire 50, 7.2:1 on White); 2px White on Bleu Royal/Majorelle surfaces; never hidden by sticky headers.

**Accessible status indicators:** badge = icon + label + tone colours from 28.4 (all badge text/background pairs ≥4.5:1 except disabled, which is non-interactive).

## 28.9 Light and dark interfaces
Launch is **light mode only**. Optional dark tokens for a future enhancement (not to be designed as full screens now):

| Figma variable | CSS variable | Dark value | Note |
|---|---|---|---|
| color/bg/page | --color-bg | #0B0F24 | Near-black navy derived from Bleu Royal |
| color/surface/default | --color-surface | #141A3A |  |
| color/surface/raised | --color-surface-raised | #1C2350 |  |
| color/border/default | --color-border | #2E3566 |  |
| color/text/primary | --color-text | #F4EFE9 | Ivoire 25 |
| color/text/secondary | --color-text-muted | #C7BCB1 |  |
| color/text/link | --color-text-link | #9DB0FF | Cobalt lightened for dark backgrounds |
| color/action/primary/bg | --color-action-primary | #4F67E8 | Cobalt lightened |
| color/action/accent/bg | --color-action-accent | #EE8047 | Abricot (dark text on it) |
| color/focus/ring | --color-focus | #9DB0FF |  |


## 28.10 Component styling recommendations (preliminary)
- **Buttons:** see approved buttons; 6px radius; label in sentence case; icon optional leading; loading state replaces label with progress text.
- **Inputs:** white background, 1px #857A73 border, 4px radius, 40px height; focus = 2px Cobalt ring; error = #B42318 border + message with icon.
- **Product card:** white, 1px border #DDD3C8, 1:1 image, title Obsidienne 2 lines, supplier line with verified icon, price in Obsidienne semi-bold, MOQ and lead time in secondary text, mode badge; hover border Cobalt 300; one accent action only on product detail, not on every card.
- **Manufacturer card:** white, logo 48px, name, verified badge (Bleu Royal tone), business type and emirate, capability tags in neutral chips.
- **Dashboard tile:** white, label secondary text, value 28–32px Obsidienne, optional link; no coloured backgrounds except a 3px top or start border in Majorelle for the active/selected tile.
- **Navigation:** Bleu Royal bar or sidebar; items White 80% opacity, active White with Cobalt/Abricot indicator bar (3px); badges in Orange 700 with White text or White with Bleu Royal text.
- **Status badge:** 4px radius or pill, 12–14px text, icon 14px, semantic tones.
- **Tables:** header row #FBF8F5, 1px dividers #ECE4DB, row hover rgba(13,26,100,.06).

## 28.11 Visual do's and don'ts
| Do | Don't |
|---|---|
| Use white cards on Ivoire backgrounds with 1px borders | Stack shadows or use glassmorphism |
| Keep one orange CTA per view | Use orange for links, warnings or several buttons |
| Show status with icon + text + colour | Rely on colour alone |
| Use real product and factory photography | Use generic office stock photos or heavy illustrations |
| Keep radii small (4–10px) | Use oversized rounded "bubble" cards |
| Align numbers to the end and use tabular figures | Centre-align money columns |
| Mirror layouts fully in Arabic | Mirror numbers, SKUs or phone numbers |
| Label sandbox money clearly | Present simulated payments as real |
| Use the text placeholder logo | Design a logo or symbol |

## 28.12 Figma setup recommendations
1. **Variables collections:** `Primitives` (brand scales, neutrals), `Semantic – Light` (modes: Light; later Dark), `Spacing`, `Radius`, `Elevation` (effects). Bind all components to semantic variables only.
2. **Text styles:** placeholder families for Latin and Arabic with the size scale; name by role (Display, H1–H4, Body L/M/S, Label, Caption, Numeric).
3. **Grids:** Mobile 4-col (16/16), Tablet 8-col (20/24), Desktop 12-col (24/32), Wide 12-col max 1280.
4. **Pages:** Cover · Foundations · Components · Patterns · Public · Auth · Buyer · Seller · Admin · Email · Prototypes · Handoff · Archive.
5. **Components:** variants via properties (type, size, state, direction=LTR/RTL); use auto layout with logical padding so RTL variants are created by mirroring.
6. **Naming:** frames named by screen ID from section 4 (e.g. `BUY-24 Order detail / Desktop / EN / Dispatched`).
7. **Annotations:** route, API endpoints and permissions from section 25 on every frame; status mapping table linked.
8. **Contrast checks:** keep the matrix page; run a contrast plugin on every new pairing.
