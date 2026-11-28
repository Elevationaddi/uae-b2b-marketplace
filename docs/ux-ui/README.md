# Manufacturers Marketplace — UX/UI design specification

> Working title only. Brand name, logo and typography are deferred; the colour palette is approved (section 28).

Single source of truth for designing the platform, based on an audit of the code on `main` (first at `2ccd947`, updated to `9df2f0e` with Phase 8 pull requests #13–#19), the decision register (`docs/00-decisions.md`), product and roadmap docs, the implementation status report, the security reviews, screenshots from each phase, the founder's Phase 8 decisions and the founder's answers to all 21 UX decisions (28 November 2026). It is organised so it can be handed to a designer (for example Claude Design) without other context. This directory is documentation only: no application code, styling or branding was changed.

Status legend: **Implemented** (on `main`, tested) · **Partial** (works but incomplete or conflicts with a founder decision) · **Planned** (approved or required, not built) · **Recommended** (proposed by this audit) · **Blocked** (needs external approval, provider or legal input). Priority: **P0** essential for launch · **P1** important for launch · **P2** post-launch.

## Totals

| Measure | Total |
|---|---|
| Unique screens | 213 |
| Implemented / Partial / Planned / Recommended / Blocked | 162 / 4 / 21 / 14 / 12 |
| P0 / P1 / P2 screens | 129 / 61 / 23 |
| Reusable components | 76 |
| Screen variations | 245 |
| Estimated Figma frames | 1266 |
| User journeys | 33 |
| Forms | 103 |
| Missing features and UX gaps | 41 (Critical 3, High 10, Medium 15, Low 13) |
| Founder decisions | 21 answered on 28 Nov 2026, 0 pending |


## Three experiences, documented independently

Each file below is self-contained and repeats the full 19-item specification of every screen that experience uses, including shared screens:

- [Business buyer experience](experiences/buyer.md) (108 screens)
- [Manufacturer and supplier experience](experiences/supplier.md) (109 screens)
- [Platform administrator experience](experiences/admin.md) (67 screens)

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
- [27. Founder decisions](27-founder-decisions.md)
- [28. Brand identity (deferred) and approved visual direction](28-visual-direction.md)

## Deliverables generated from these files

01 — Complete UX-UI Product Specification.docx · 02 — Application Sitemap and User Flows.pdf · 03 — Complete Screen Inventory.xlsx (with Buyer, Supplier and Admin experience sheets) · 04 — UI Component Inventory.xlsx · 05 — Design Production Checklist.xlsx · 06 — Founder Decisions and UX Gaps.docx · 07 — Visual Direction and Design System Specification.pdf, plus the three experience documents as .docx (shared in the project files under `ux-ui/`).

## Conflicts found between sources

The decision register and founder decisions take priority. Where code, provisional rules (P3–P8) and founder decisions differ, the difference is recorded as a gap (section 26), not resolved silently. All 21 UX decisions are answered (section 27). The storyboard was treated as background only.

## Constraints for design work

Do not finalise the brand: keep the working name, the text placeholder logo and the temporary font (FD-17). Use only free, open-licence fonts and icons; no paid fonts, stock image or icon subscriptions and no paid external design tools. The approved palette stands; a palette reference image will be supplied separately.
