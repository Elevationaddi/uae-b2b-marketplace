# 21. Accessibility and usability

Target: **WCAG 2.2 AA** for the new design (the code is currently tested against WCAG 2.1 A/AA).

## 21.1 Existing test findings
- `e2e/tests/accessibility.spec.ts` runs **axe-core 4.10.2** with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` on public, buyer, seller and admin pages in English and Arabic. Result (Phase 6/7): **no serious or critical violations**; the suite passes in CI (`docs/IMPLEMENTATION_STATUS.md`).
- Existing patterns: skip link (`.skip-link`), `sr-only` utility, labelled inputs (`Field`), inline field errors, focus ring, status text never colour-only (05-ui rule), `bdi`/`dir="auto"` for mixed-direction text.
- Not done: manual keyboard and screen-reader testing, real-device testing, WCAG 2.2-specific criteria (2.4.11 Focus not obscured, 2.5.7 Dragging movements, 2.5.8 Target size, 3.3.7 Redundant entry, 3.3.8 Accessible authentication) (gap G-41).
- Observed in screenshots: truncated bottom-nav labels and horizontally scrolling sub-nav on phones (G-20), quote comparison overflow (G-21).

## 21.2 Requirements
| Topic | Requirement |
|---|---|
| Readable text sizes | Body ≥16px on mobile and desktop for content; minimum 14px for secondary metadata; line height 1.5 for body; line length 60–80 characters; support 200% zoom and 400% reflow at 320px width without horizontal scroll (except data tables in a scroll container). |
| Accessible contrast | Text 4.5:1 (normal) / 3:1 (≥24px or ≥18.66px bold); UI components and focus indicators 3:1 against adjacent colours. See the matrix in section 28.8. |
| Keyboard navigation | All actions reachable by Tab/Shift+Tab; logical order (mirrored in RTL); Escape closes dialogs, sheets and menus; arrow keys inside tabs, menus, comboboxes and radio groups; no keyboard traps. |
| Screen reader compatibility | Landmarks (header, nav, main, footer); one H1 per page; headings in order; buttons vs links used correctly; status badges have text; live regions for async results ("Saved", payment status updates, "Added to your cart"); tables with `<th scope>` and captions; images with alt (product title) or empty alt if decorative. |
| Focus states | 2px solid focus ring with 2px offset in Cobalt (#2845D6) on light surfaces; on dark (Bleu Royal) surfaces use White ring; never remove outline; focus not obscured by sticky headers/bars (2.4.11). |
| Accessible forms | Visible labels (no placeholder-only); required marked with text "(required)" or asterisk + legend; hints linked with `aria-describedby`; errors linked and announced; error summary on long forms; autocomplete attributes (email, name, tel, address); no redundant re-entry (3.3.7); authentication supports password managers and paste for TOTP (3.3.8). |
| Error identification | Inline message describing the fix ("Enter a UAE number in international format…"), icon + text, field border change; never colour only. |
| Touch target sizes | 44×44px recommended; minimum 24×24 (2.5.8) with spacing. |
| Accessible tables | Header cells, sortable headers announce state, responsive card version keeps label–value pairs, row actions have accessible names ("Open order ORD-1234"). |
| Responsive behaviour | Section 19; orientation not locked. |
| Reduced motion | Honour `prefers-reduced-motion`: no skeleton shimmer, no slide transitions (fade or none). |
| Clear feedback | Every action ends with visible confirmation or error tied to the server response; buttons show progress and prevent double submit; destructive actions confirmed with consequence text. |
| Time limits | Payment countdowns (15 minutes / 72 hours) are business rules; show remaining time, warn before expiry, allow retry; session expiry warns where possible. |
| Language | `lang` and `dir` set per page and on mixed-language fragments. |
| Charts (future) | Provide data tables or text summaries; don't rely on colour alone; patterns or direct labels. |
