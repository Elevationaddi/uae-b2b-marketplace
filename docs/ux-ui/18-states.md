# 18. Empty, loading, error and success states

Existing shared screen contract (`docs/05-ui.md`): skeleton while fetching; empty state with a contextual action; error with retry and request reference; forbidden page without leaking whether an entity exists; disabled actions explain the prerequisite; success reflects the persisted server response; no toast-only critical errors; inputs kept on recoverable failure; first invalid field focused. Components: `Resource`, `Skeleton`, `Empty`, `ApiErrorAlert`, `NotFound`, `Forbidden` in `apps/web/src/components/resource.tsx` and `ui.tsx`.

Copy marked **(existing)** is the current UI string; **(suggested)** is new copy for designers. Arabic equivalents exist for all existing strings.

| State | Where | Copy | Recovery action |
|---|---|---|---|
| First-time user (no company) | ACC-01 | (existing) "Register a company" / Next step texts per company status, e.g. "Complete your company details, upload documents and submit for verification." | Register a company |
| First-time buyer after approval | BUY-01 (suggested) | "Your company is verified. Search the marketplace or post a request for quotation to get started." | Search; New request |
| First-time seller after approval | SEL-01 | (existing) "Your company can list products." (suggested) "Build your storefront, then add your first product." | Open storefront; Add product |
| Empty dashboard tiles | BUY-01, SEL-01 | (suggested) Show "0" with the label; never hide the tile. | Link to list |
| No search results | PUB-04 | (existing) "No products match these filters." (suggested addition) "Try fewer filters or a different word." | Clear all filters |
| No suppliers | PUB-09 | (existing) "No suppliers match these filters." | Clear filters |
| No products (seller) | SEL-06 | (suggested) "You have no products in this tab." | Add product |
| No variants | SEL-15 | (existing) "No variants yet." | Open product |
| No RFQs | BUY-02 | (existing) "You have no requests for quotation yet." | New request |
| No requests (seller) | SEL-20 | (existing) "No requests here yet." | Complete storefront and publish listings in relevant categories |
| No quotations | BUY-05 | (existing) "No quotes yet." | Invite more suppliers (if INVITE) |
| Seller has not quoted | SEL-26 | (existing) "You have not quoted yet." | Open inbox |
| No active orders | BUY-23 | (existing) "No orders yet. Orders appear here after checkout or an accepted quotation." | Browse products |
| No orders (seller) | SEL-27 | (existing) "No orders yet." | — |
| Empty cart | BUY-16 | (existing) "Your cart is empty." | Browse products |
| No addresses | BUY-20 | (existing) "No addresses yet. Add one to check out." | Add an address |
| No disputes | SHR-01 | (existing) "No disputes." | — |
| No tickets | SHR-03 | (existing) "No tickets yet." | New ticket |
| No notifications | ACC-14 | (existing) "You have no notifications." | — |
| No reviews | PUB-10 | (existing) "No reviews yet." | — |
| No payouts | SEL-32 | (existing) "No payouts yet." | — |
| Loading page | All | Skeleton lines/cards matching the final layout; no spinner-only pages; `aria-busy` on the region | — |
| Loading action | Buttons | Button shows progress text ("Saving…", "Uploading…") and is disabled to prevent double submit | — |
| Failed payment | BUY-18 | (existing) "The last payment attempt did not go through ({code}). You can try again." | Pay now (≤5 attempts) |
| Payment window expired | BUY-18 | (existing) "The payment window passed, so the orders were cancelled and stock released." | Review cart / View request |
| Late payment | BUY-18 | (existing) "A payment arrived after this checkout closed. Our finance team is reviewing it and will contact you." | Open support ticket |
| Failed upload (type/size) | Uploaders | (suggested) "This file type is not accepted. Upload a PDF, PNG or JPEG up to 10 MB." | Choose another file |
| Failed upload (malware) | Uploaders | (existing) "The malware scan blocked this file. Remove it and upload a clean copy." | Remove; upload again |
| Verification rejection | ACC-03 | (existing) "Verification was rejected. Review the reason, fix the documents and resubmit." + reason | Edit details; resubmit |
| Needs information | ACC-03 | (existing) "Compliance asked for more information. Review the reason and resubmit." | Edit; resubmit |
| Listing rejected / changes requested | SEL-08 | (existing) "Reason from the marketplace team" + reason | Edit; submit again |
| Form validation errors | All forms | (existing) "Check the highlighted fields." + inline field messages (e.g. field.required); (suggested) error summary for long forms: "Fix {count} fields to continue." | Focus first invalid field |
| Permission denied (role) | Any action | (existing example) "Your role can view requests but not create them. Ask an owner or procurement member." | Contact owner |
| Permission denied (action) | Any API 403 | (existing, error.common.forbidden) "You do not have permission for this action." | — |
| Permission denied (page) | Forbidden page | (suggested) "You do not have access to this page. If you think this is wrong, ask your company owner." | Go to Home |
| Not found | SYS-01 | (existing, error.common.not_found) "Not found, or you do not have access." (suggested page copy) "We could not find this page. It may have been removed or you may not have access." | Go to Home / Marketplace |
| Network error | SYS-02 | (existing pattern) error with retry and request reference (e.g. "Reference: {id}") | Retry |
| API unreachable | PUB-15 | (existing) "The API could not be reached. Check that it is running, then retry." (developer-facing; suggested public: "We are having trouble connecting. Try again in a moment.") | Retry |
| Session expiration | AUTH-09 | (existing, error.auth.unauthenticated) "Your session has ended. Sign in again." Keep the return URL. | Sign in |
| Account restriction (licence expired) | ACC-01, workspace banners | (existing) "Trading is restricted. Existing records remain available. See the company page." | Renew licence |
| Account restriction (pending verification) | Product, RFQ, cart | (existing pattern) disabled actions with reason, e.g. "A buyer workspace is needed" | Register / complete verification |
| Listing paused | SEL-01 | (existing) "Listing is paused: {reason}" | Fix eligibility |
| Stale data conflict | Edit forms | (existing, error.common.stale_version) "This record changed since you opened it. Reload and try again." | Reload |
| Rate limited | Messages, login | (existing, error.common.rate_limited) "Too many attempts. Wait a few minutes and try again." | Wait |
| Successful payment | BUY-18 | (existing) "Payment confirmed. The supplier has been notified. Track each order from Orders." | View orders |
| Successful submission (RFQ) | BUY-03/BUY-07 | (existing) "Draft saved. Review it and publish when ready." / "Request published." | — |
| Successful submission (quote) | SEL-23 | (existing) "Quote submitted." | — |
| Successful submission (verification) | ACC-06 | (existing) "Submitted. Compliance will review your documents." | — |
| Successful order completion | BUY-25 | (suggested) "Thank you. The order is complete. You can rate the supplier or open a dispute within 14 days." | Rate supplier |
| Successful save | Forms | (existing) "Saved." / "Changes saved." | — |
| Sandbox | All money screens | (existing) "Sandbox payments: no real money." | — |

Empty-state illustrations: none for launch (founder: avoid unnecessary illustrations). Use a simple icon placeholder, a one-line message and a single action.
