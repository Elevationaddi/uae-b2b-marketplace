# 6. Public-facing website

The public site today **is** the marketplace: home, categories, search, product and supplier pages, plus signed-in lists (saved, compare, recently viewed, preferences) and a system status page. There are no informational, pricing, help or legal pages and no footer (gap G-02, G-19). Every page is bilingual (EN/AR), server-rendered from public views only (`marketplace_products`, `marketplace_suppliers`), and shows the sandbox banner in development.

Global page frame (all public pages): marketplace header (text logo placeholder "Manufacturers Marketplace", search with suggestions, Sign in / Create account or account links, language switch), marketplace sub-nav (Categories, Suppliers, Saved, Compare, Recently viewed), content, **footer (recommended)**.

| Page | Route | Status | Screen |
|---|---|---|---|
| Homepage | `/{locale}` | Implemented | PUB-01 |
| About the platform | `/{locale}/about` | Recommended | PUB-16 |
| How it works | `/{locale}/how-it-works` | Recommended | PUB-17 |
| Manufacturer directory | `/{locale}/suppliers` | Implemented | PUB-09 |
| Product marketplace (search) | `/{locale}/search` | Implemented | PUB-04 |
| Category pages | `/{locale}/categories`, `/categories/[id]` | Implemented | PUB-02, PUB-03 |
| Search results | `/{locale}/search?q=` | Implemented | PUB-04 |
| Manufacturer profiles | `/{locale}/suppliers/[id]` | Implemented | PUB-10 |
| Product detail | `/{locale}/products/[id]` | Implemented | PUB-07 |
| Pricing (fees) | `/{locale}/pricing` | Recommended (copy needs legal and tax adviser review; FD-05 and FD-06 answered) | PUB-18 |
| FAQ | `/{locale}/faq` | Recommended | PUB-19 |
| Contact | `/{locale}/contact` | Recommended | PUB-21 |
| Help centre | `/{locale}/help` | Recommended | PUB-20 |
| Terms and conditions | `/{locale}/legal/terms` | Blocked (lawyer review) | PUB-22 |
| Privacy policy | `/{locale}/legal/privacy` | Blocked | PUB-23 |
| Refund and cancellation policy | `/{locale}/legal/refunds` | Blocked (FD-09) | PUB-24 |
| Other policies (acceptable use, seller terms, cookies…) | `/{locale}/legal/[slug]` | Blocked | PUB-25 |
| Become a supplier | `/{locale}/sell` | Recommended | PUB-26 |
| Registration and login | `/{locale}/register`, `/login` | Implemented | AUTH-01, AUTH-04 |
| System status | `/{locale}/status` | Implemented | PUB-15 |

## 6.1 Homepage (existing, PUB-01)

Content hierarchy (top to bottom), as implemented in `apps/web/src/app/[locale]/page.tsx`:
1. Sandbox banner (development only).
2. Hero: title, body, live totals "{products} products from {suppliers} verified suppliers", search.
3. Featured categories (image tiles with counts) and all categories (chips with counts).
4. Featured products (labelled "Featured").
5. Featured suppliers.
6. Verified manufacturers.
7. New arrivals.
8. "Based on your preferences" (verified users with preferences).

Recommended additions (design now, build later): a trust strip ("Every supplier is a verified UAE business", "Pay through the platform", "Dispute protection for 14 days" — wording must follow the approved dispute window), a short "How it works" (3 steps for buyers, 3 for suppliers) linking to PUB-17, a "Request a quotation" entry (BUY-04), a supplier call-to-action block linking to PUB-26, and the footer. Primary CTA: search. Secondary: Create account, Request quotation, Become a supplier. Orange (accent) is reserved for one conversion action per viewport (section 28).

## 6.2 About the platform (recommended, PUB-16)
Sections: mission; who it is for (buyers / suppliers); how verification works (licence check, documents, renewal); how money flows (payment provider, supplier paid after receipt and dispute window, platform commission — figures only after founder approval of public copy); trust & safety (moderation, restricted terms, disputes); company details placeholder. CTAs: Create account, Browse marketplace.

## 6.3 How it works (recommended, PUB-17)
Two tabs: **For buyers** (verify company → find products or post RFQ → compare quotes → pay → confirm receipt or dispute) and **For suppliers** (verify company → build storefront → list products and quote → fulfil → get paid). Each step links to the relevant help article. Use a horizontal stepper on desktop and a vertical list on mobile. CTAs per tab.

## 6.4 Manufacturer directory (existing, PUB-09)
Filter bar (category, emirate, business type, capabilities), supplier cards (logo, name, verified badge, business type, emirate, year established, categories, capability tags), save toggle (verified users), pagination. Empty: "No suppliers match these filters." Recommended additions: sort (newest, name), "Compare suppliers" (not implemented; manufacturer comparison is a recommendation).

## 6.5 Product marketplace and search (existing, PUB-04/PUB-05/PUB-06)
See section 10 for full detail. Guests see "Price filters are available after signing in with a verified email."

## 6.6 Category pages (existing, PUB-02/PUB-03)
Directory then category landing: name, description, image, subcategories, supplier requirements for REVIEW_REQUIRED categories, embedded results with category attribute filters.

## 6.7 Manufacturer profile (existing, PUB-10)
Cover and logo, name, verified badge and "verified since", business type, emirate/city, year established; tabs or sections About, Capabilities (specialisation, capabilities, production capacity, custom manufacturing, private label, white label, samples), Factory and warehouse (gallery), Certifications "(declared by supplier)", Product catalogue, Return policy (EN/AR, PR #17), Buyer reviews ("Average {avg} from {count} reviews", label "Verified business buyer", PR #16, FD-15). Note: "Contact details, documents and bank information are never shown publicly." CTAs: Request quotation (approved buyers), Request a sample (planned, when the supplier offers samples; FD-13), Message supplier (approved buyers), Save supplier.

## 6.8 Product detail (existing, PUB-07)
See section 10.7.

## 6.9 Pricing (recommended, PUB-18)
Purpose: explain that the marketplace is free to join with no subscriptions, and that suppliers pay a commission on completed merchandise sales. **Do not publish a rate until the founder approves public copy** (10% is an approved internal decision, configurable; FD-05). Sections: "Free for buyers", "For suppliers: commission on merchandise, excluding VAT and delivery", "When suppliers are paid" (weekly, every Monday at 10:00 Dubai time, after the 14-day dispute window; FD-04), "Taxes" (disclosed-intermediary model, FD-06; wording after tax adviser review), FAQ. CTA: Become a supplier.

## 6.10 FAQ (recommended, PUB-19)
Accordion grouped by Buyers, Suppliers, Payments, Verification, Disputes, Account. Search box. Each answer links to the help article. Questions must reflect implemented behaviour (e.g. "Prices are visible after you verify your email", "Stock is held for 15 minutes while you pay", "Quote payments are due within 72 hours of acceptance").

## 6.11 Contact (recommended, PUB-21)
Routes signed-in users to Support tickets (SHR-04) and shows a public contact form or email for guests (requires a decision on a public inbox; no public form exists). Fields (recommended): name, company, email, topic, message, consent. Anti-spam needed.

## 6.12 Help centre (recommended, PUB-20)
Category landing (Getting started, Verification, Buying, RFQs, Selling, Orders and delivery, Payments and refunds, Disputes, Account and security), article page template with breadcrumb, related articles, "Still need help? Open a ticket".

## 6.13 Legal pages (blocked, PUB-22…PUB-25)
One template: title, version and effective date, table of contents, body, print/download, language switch, "Previous versions". Registration (AUTH-01), verification submission (ACC-06) and checkout (BUY-17) reference these documents; acceptance is versioned (currently "dev-1"). Founder requested 12 documents to be drafted for lawyer review; none may be published before review.

## 6.14 Registration and login (existing)
See AUTH-01…AUTH-09 in the screen inventory and journeys J-02/J-03.

## 6.15 Footer (recommended, PUB-27)
Columns: Marketplace (Categories, Suppliers, Search), Company (About, How it works, Pricing, Contact), Support (Help centre, FAQ, Status), Legal (Terms, Privacy, Refunds, Cookies), language switch, copyright with placeholder name. On mobile: accordions.
