# Manufacturers Marketplace — UX/UI design specification

> Working title only. Brand name, logo and typography are deferred; the colour palette is approved (section 28).

Single source of truth for designing the platform, based on an audit of the code on `main` at `2ccd947` (Phases 0–7 merged), the decision register (`docs/00-decisions.md`), product and roadmap docs, the implementation status report, the Phase 7 security review, screenshots from each phase and the founder's Phase 8 decisions of 2026-11-28. This directory is documentation only: no application code, styling or branding was changed.

Status legend: **Implemented** (on `main`, tested) · **Partial** (works but incomplete or conflicts with a founder decision) · **Planned** (approved or required, not built) · **Recommended** (proposed by this audit) · **Blocked** (needs external approval, provider or legal input). Priority: **P0** essential for launch · **P1** important for launch · **P2** post-launch.

## Totals

| Measure | Total |
|---|---|
| Unique screens | 197 |
| Implemented / Partial / Planned / Recommended / Blocked | 154 / 3 / 13 / 16 / 11 |
| P0 / P1 / P2 screens | 116 / 57 / 24 |
| Reusable components | 76 |
| Screen variations | 218 |
| Estimated Figma frames | 1171 |
| User journeys | 31 |
| Forms | 91 |
| Missing features and UX gaps | 41 (Critical 3, High 10, Medium 15, Low 13) |
| Pending founder decisions | 21 |


## Contents

- [1. Product overview](01-product-overview.md)
- [2. User types and permissions](02-roles-permissions.md)
- [3. Application sitemap](03-sitemap.md)
- [4. Complete screen inventory](04-screen-inventory.md)
- [5. Detailed user journeys](05-user-journeys.md)
- [6. Public-facing website](06-public-website.md)
- [7. Buyer dashboard and buyer experience](07-buyer-dashboard.md)
- [8. Manufacturer (seller) dashboard](08-manufacturer-dashboard.md)
- [9. Administration portal](09-admin-portal.md)
- [10. Marketplace and product discovery](10-discovery.md)
- [11. RFQ and quotation system](11-rfq-quotation.md)
- [12. Order management and manufacturing lifecycle](12-order-lifecycle.md)
- [13. Financial experience](13-financial.md)
- [14. Communication and notifications](14-communication-notifications.md)
- [15. Forms and data requirements](15-forms.md)
- [16. Statuses and system states (master reference)](16-statuses.md)
- [17. UI components inventory](17-components.md)
- [18. Empty, loading, error and success states](18-states.md)
- [19. Mobile and responsive design](19-responsive.md)
- [20. Language and localization](20-localization.md)
- [21. Accessibility and usability](21-accessibility.md)
- [22. UX copy library](22-ux-copy.md)
- [23. Low-fidelity wireframe specifications](23-wireframes.md)
- [24. UI/UX design production checklist (Figma)](24-design-checklist.md)
- [25. Technical handoff](25-technical-handoff.md)
- [26. Missing features and UX gaps](26-gaps.md)
- [27. Pending founder decisions](27-founder-decisions.md)
- [28. Brand identity (deferred) and approved visual direction](28-visual-direction.md)

## Deliverables generated from these files

01 — Complete UX-UI Product Specification.docx · 02 — Application Sitemap and User Flows.pdf · 03 — Complete Screen Inventory.xlsx · 04 — UI Component Inventory.xlsx · 05 — Design Production Checklist.xlsx · 06 — Founder Decisions and UX Gaps.docx · 07 — Visual Direction and Design System Specification.pdf (shared in the project files under `ux-ui/`).

## Conflicts found between sources

The decision register and founder decisions take priority. Where code, provisional rules (P3–P6) and founder decisions differ, the difference is recorded as a gap (section 26) or decision (section 27), not resolved silently. The storyboard was treated as background only.
