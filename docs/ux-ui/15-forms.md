# 15. Forms and data requirements

91 forms, taken from the zod contracts in `packages/contracts/src/*.ts` (validated identically on the server) and the screens in section 4. All text inputs are trimmed; money is entered in AED with up to 2 decimals and stored as integer fils; dates/times are entered in Dubai time and stored in UTC. Uploads: documents and attachments PDF/PNG/JPEG up to `UPLOAD_MAX_BYTES` (10 MB default); product/storefront images PNG/JPEG/WebP ≥200×200 px, ≤10 MB, re-encoded with metadata removed. Every file is malware-scanned (Pending → Clean / Blocked) and private files are only served after authorisation.

## 15.1 Shared field validation messages (existing copy)

| Key | English | Arabic |
|---|---|---|
| field.required | This field is required. | هذا الحقل مطلوب. |
| field.min | Too short. | قصير جداً. |
| field.max | Too long. | طويل جداً. |
| field.email | Enter a valid email address. | أدخل بريداً إلكترونياً صالحاً. |
| field.phone | Enter a phone number in international format, for example +971501234567. | أدخل رقم الهاتف بالصيغة الدولية، مثل ‎+971501234567. |
| field.trn | A TRN has 15 digits. | رقم التسجيل الضريبي مكوّن من 15 رقماً. |
| field.date | Enter a valid date. | أدخل تاريخاً صالحاً. |
| field.future | The date must be in the future. | يجب أن يكون التاريخ في المستقبل. |
| field.invalid | This value is not valid. | هذه القيمة غير صالحة. |
| field.exists | Already registered. | مسجّل مسبقاً. |
| field.member | Already a member of this workspace. | عضو بالفعل في مساحة العمل هذه. |
| field.not_allowed | Not allowed for this workspace. | غير مسموح لمساحة العمل هذه. |
| field.duplicate | Duplicate values. | قيم مكررة. |
| field.type | Only PDF, PNG or JPEG files are accepted. | تُقبل ملفات PDF أو PNG أو JPEG فقط. |
| field.too_large | The file is too large. | حجم الملف كبير جداً. |
| field.infected | Remove blocked documents before submitting. | أزل المستندات المحظورة قبل الإرسال. |
| field.reason_required | A reason is required. | السبب مطلوب. |
| field.code | Enter the 6-digit code. | أدخل الرمز المكوّن من 6 أرقام. |
| field.outdated | The terms have changed. Reload the page. | تغيّرت الشروط. أعد تحميل الصفحة. |
| field.terms | You must accept the terms to submit. | يجب قبول الشروط للإرسال. |
| field.min_description | Write at least 20 characters. | اكتب 20 حرفاً على الأقل. |
| field.choose_subcategory | Choose a subcategory. | اختر فئة فرعية. |
| field.category_unavailable | This category is not available. | هذه الفئة غير متاحة. |
| field.required_for_category | This category requires certification details. | تتطلب هذه الفئة بيانات الشهادات. |
| field.first_equals_moq | The first tier must start at the MOQ. | يجب أن تبدأ الشريحة الأولى من الحد الأدنى. |
| field.ascending | Quantities must increase. | يجب أن تتزايد الكميات. |
| field.increment | Must follow the order increment. | يجب أن يتبع مضاعف الطلب. |
| field.nonincreasing | Price must not be higher than the previous tier. | يجب ألا يزيد السعر عن الشريحة السابقة. |
| field.money | Enter an amount in AED with at most 2 decimals. | أدخل مبلغاً بالدرهم بخانتين عشريتين كحد أقصى. |
| field.insufficient_stock | Not enough available stock. | المخزون المتاح غير كافٍ. |
| field.moq | Below the minimum order. | أقل من الحد الأدنى للطلب. |
| field.requires_verified | Sign in with a verified email. | سجّل الدخول ببريد موثق. |
| field.media_limit | Image limit reached. | تم بلوغ الحد الأقصى للصور. |
| field.image_type | Upload a PNG, JPEG or WebP image. | ارفع صورة PNG أو JPEG أو WebP. |
| field.image_too_small | At least 200 × 200 pixels. | 200 × 200 بكسل على الأقل. |
| field.lead_time_range | Must be at least the minimum lead time. | يجب ألا تقل عن الحد الأدنى لمدة التجهيز. |
| field.sku_code | Letters, digits, dot, dash or underscore (2–40). | حروف وأرقام ونقطة وشرطة وشرطة سفلية (2–40). |
| field.slug | Lowercase letters, digits and dashes. | حروف إنجليزية صغيرة وأرقام وشرطات. |
| field.taken | Already used. | مستخدم بالفعل. |
| field.not_public | Not public. | غير منشور. |
| field.quote_only_no_tiers | Quote-only products have no price tiers. | لا توجد شرائح أسعار للمنتجات المسعّرة عند الطلب. |
| field.fixed_single_tier | A fixed price has exactly one tier. | للسعر الثابت شريحة واحدة فقط. |
| field.tiered_min_two | Tiered pricing needs at least two tiers. | يتطلب السعر المتدرج شريحتين على الأقل. |
| field.emirate_mismatch | Choose an address in the emirate from your request. | اختر عنواناً في الإمارة المحددة في طلبك. |
| field.not_found | Not found in this workspace. | غير موجود في مساحة العمل هذه. |
| field.range_too_long | The period can be at most 366 days. | لا يمكن أن تتجاوز الفترة 366 يوماً. |
| field.too_many_rows | Too many rows. Choose a shorter period. | عدد الصفوف كبير. اختر فترة أقصر. |


## 15.2 Form inventory

### PUB-01 · Marketplace home

**Roles / permissions:** Public. Prices, "for you" row only for email-verified users (A12). Only public listings (view marketplace_products).

**Submits to:** GET /marketplace/home · **Stores in:** categories, featured_listings, marketplace_products view, marketplace_suppliers view, marketplace_preferences

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Search query | text | Optional | max 100 chars |


**Validation:** Search requires no minimum on submit; suggestions need 2+ characters.

**Submission behaviour:** Sections load concurrently; cards are full-card links; "Featured" label never changes ranking.

**Possible server errors (existing copy keys):** `error.marketplace.price_requires_verified`, `error.marketplace.compare_limit`, `error.marketplace.saved_limit`

### PUB-04 · Search results

**Roles / permissions:** Public; guests get 422 on price filters/sorts so the UI hides them and shows "Price filters are available after signing in with a verified email."

**Submits to:** GET /marketplace/products · **Stores in:** marketplace_products, category_attributes

| Field | Type | Required | Rules / options |
|---|---|---|---|
| q | text | Optional | max 100 |
| category_id | select | Optional | uuid |
| mode | radio | Optional | READY_STOCK, MADE_TO_ORDER, Any |
| business_type | checkboxes | Optional | 7 business types |
| emirate | checkboxes | Optional | 7 emirates |
| price_min (AED) | money | Optional | verified only |
| price_max (AED) | money | Optional | verified only |
| moq_max | integer | Optional | 0–10,000,000 |
| lead_time_max (days) | integer | Optional | 0–365 |
| delivery_max (dispatch within, days) | integer | Optional | 0–365 |
| in_stock | checkbox | Optional |  |
| custom | checkbox | Optional | custom manufacturing |
| private_label | checkbox | Optional |  |
| white_label | checkbox | Optional |  |
| samples | checkbox | Optional |  |
| attrs | attribute filters | Optional | up to 10 key:value pairs |


**Validation:** Numeric filters integers ≥0; price as AED with ≤2 decimals.

**Submission behaviour:** Filters write to the URL; page size 24 (max 48); offset cursor.

**Possible server errors (existing copy keys):** `error.marketplace.price_requires_verified`, `error.marketplace.compare_limit`, `error.marketplace.saved_limit`

### PUB-06 · Search suggestions dropdown

**Roles / permissions:** Public

**Submits to:** GET /marketplace/suggest · **Stores in:** marketplace_products, marketplace_suppliers, categories

| Field | Type | Required | Rules / options |
|---|---|---|---|
| q | text | Optional | min 2, max 100 |


**Validation:** 2–100 characters

**Submission behaviour:** Debounced requests; Escape closes.

**Possible server errors (existing copy keys):** `error.marketplace.price_requires_verified`, `error.marketplace.compare_limit`, `error.marketplace.saved_limit`

### PUB-07 · Product detail

**Roles / permissions:** Guest: no prices, buttons disabled with reason. Verified: prices, save, compare. Trading (approved buyer, OWNER/PROCUREMENT): cart and RFQ. Reasons: sign_in, requires_approved_buyer, quote_only, made_to_order, checkout_disabled.

**Submits to:** GET /marketplace/products/{id}; /related; /estimate; POST /buyer/workspaces/{ws}/cart/items; POST/DELETE /marketplace/saved/products/{id}; /marketplace/compare/{id}; POST /marketplace/recent/{id} · **Stores in:** products, product_versions, product_media, skus, price_tiers, inventory, storefronts

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Variant (SKU) | select | Optional | active SKUs |
| Quantity | integer | Optional | ≥ MOQ, follows increment, ≤ available |


**Validation:** Server: MOQ_NOT_MET, INCREMENT, QUOTE_ONLY, insufficient stock, self-trade.

**Submission behaviour:** Calculator calls the server estimate; Add to cart shows "Added to your cart." with View cart; viewing records "recently viewed" for verified users.

**Possible server errors (existing copy keys):** `error.marketplace.price_requires_verified`, `error.marketplace.compare_limit`, `error.marketplace.saved_limit`

### PUB-09 · Supplier directory

**Roles / permissions:** Public; only published, non-hidden storefronts of eligible approved sellers.

**Submits to:** GET /marketplace/suppliers · **Stores in:** marketplace_suppliers view, storefronts, storefront_media

| Field | Type | Required | Rules / options |
|---|---|---|---|
| q | text | Optional | max 100 |
| category_id | select | Optional |  |
| emirate | checkboxes | Optional |  |
| business_type | checkboxes | Optional |  |
| custom | checkbox | Optional |  |
| private_label | checkbox | Optional |  |
| white_label | checkbox | Optional |  |
| samples | checkbox | Optional |  |


**Validation:** —

**Submission behaviour:** URL-driven filters; 24 per page.

**Possible server errors (existing copy keys):** `error.marketplace.price_requires_verified`, `error.marketplace.compare_limit`, `error.marketplace.saved_limit`

### PUB-14 · Marketplace preferences

**Roles / permissions:** Email-verified only.

**Submits to:** GET/PATCH /marketplace/preferences · **Stores in:** marketplace_preferences

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Categories | checkboxes | Optional | max 12 |
| Emirates | checkboxes | Optional | max 7 |
| Default view | radio | Optional | GRID, LIST |
| Default sort | select | Optional | 5 sorts |


**Validation:** Max counts.

**Submission behaviour:** Saves per user.

**Possible server errors (existing copy keys):** `error.marketplace.price_requires_verified`, `error.marketplace.compare_limit`, `error.marketplace.saved_limit`

### PUB-19 · Frequently asked questions

**Roles / permissions:** Public

**Submits to:** — · **Stores in:** —

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Search FAQ | text | Optional | optional |


**Validation:** —

**Submission behaviour:** Expand/collapse; deep link to a question.

**Possible server errors (existing copy keys):** `error.marketplace.price_requires_verified`, `error.marketplace.compare_limit`, `error.marketplace.saved_limit`

### PUB-20 · Help centre

**Roles / permissions:** Public; ticket creation needs a workspace member (not VIEWER).

**Submits to:** — · **Stores in:** —

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Search | text | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.marketplace.price_requires_verified`, `error.marketplace.compare_limit`, `error.marketplace.saved_limit`

### PUB-21 · Contact

**Roles / permissions:** Public

**Submits to:** Not built (needs endpoint + email provider) · **Stores in:** —

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Name | text | Required | 1–120 |
| Work email | email | Required | valid |
| Company | text | Optional | optional |
| Topic | select | Required | Buyer, Supplier, Partnership, Press, Other |
| Message | textarea | Required | 1–4000 |


**Validation:** Email format; required fields.

**Submission behaviour:** Rate limited; generic success message.

**Possible server errors (existing copy keys):** `error.marketplace.price_requires_verified`, `error.marketplace.compare_limit`, `error.marketplace.saved_limit`

### AUTH-01 · Create account (register)

**Roles / permissions:** Public; rate limited.

**Submits to:** POST /auth/register · **Stores in:** users, user_tokens

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Full name | text | Required | 1–120 |
| Work email | email | Required | valid, max 254, lower-cased |
| Password | password | Required | 12–128 characters |
| Preferred language | select | Required | English, العربية (default en) |


**Validation:** field.required, field.email, field.min/max; error.common.rate_limited

**Submission behaviour:** Always responds 202 (no enumeration) and moves to AUTH-02.

**Possible server errors (existing copy keys):** `error.auth.invalid_credentials`, `error.auth.unauthenticated`, `error.auth.email_not_verified`, `error.auth.token_invalid`, `error.auth.current_password_wrong`, `error.common.rate_limited`, `error.common.validation_failed`, `error.common.not_found`, `error.common.forbidden`, `error.common.stale_version`, `error.common.stale_state`, `error.common.csrf_origin`, `error.common.csrf_token`, `error.common.internal_error`

### AUTH-04 · Sign in

**Roles / permissions:** Public; rate limited; admin accounts must use the admin origin.

**Submits to:** POST /auth/login · **Stores in:** sessions

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Work email | email | Required | valid |
| Password | password | Required | 1–128 |


**Validation:** error.auth.invalid_credentials ("The email or password is incorrect."); rate limit

**Submission behaviour:** Session cookie rotates on sign-in.

**Possible server errors (existing copy keys):** `error.auth.invalid_credentials`, `error.auth.unauthenticated`, `error.auth.email_not_verified`, `error.auth.token_invalid`, `error.auth.current_password_wrong`, `error.common.rate_limited`, `error.common.validation_failed`, `error.common.not_found`, `error.common.forbidden`, `error.common.stale_version`, `error.common.stale_state`, `error.common.csrf_origin`, `error.common.csrf_token`, `error.common.internal_error`

### AUTH-05 · Forgot password

**Roles / permissions:** Public

**Submits to:** POST /auth/password-reset/request · **Stores in:** user_tokens

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Email | email | Required | valid |


**Validation:** Email format; rate limit

**Submission behaviour:** Always 202.

**Possible server errors (existing copy keys):** `error.auth.invalid_credentials`, `error.auth.unauthenticated`, `error.auth.email_not_verified`, `error.auth.token_invalid`, `error.auth.current_password_wrong`, `error.common.rate_limited`, `error.common.validation_failed`, `error.common.not_found`, `error.common.forbidden`, `error.common.stale_version`, `error.common.stale_state`, `error.common.csrf_origin`, `error.common.csrf_token`, `error.common.internal_error`

### AUTH-06 · Reset password

**Roles / permissions:** Public with valid token

**Submits to:** POST /auth/password-reset/confirm · **Stores in:** users, sessions

| Field | Type | Required | Rules / options |
|---|---|---|---|
| New password | password | Required | 12–128 |


**Validation:** Token invalid/expired; length

**Submission behaviour:** Token read from fragment.

**Possible server errors (existing copy keys):** `error.auth.invalid_credentials`, `error.auth.unauthenticated`, `error.auth.email_not_verified`, `error.auth.token_invalid`, `error.auth.current_password_wrong`, `error.common.rate_limited`, `error.common.validation_failed`, `error.common.not_found`, `error.common.forbidden`, `error.common.stale_version`, `error.common.stale_state`, `error.common.csrf_origin`, `error.common.csrf_token`, `error.common.internal_error`

### AUTH-10 · Admin sign in

**Roles / permissions:** Admin accounts only (provisioned by CLI); company pages return 404 on this host.

**Submits to:** POST /admin/auth/login · **Stores in:** users (PLATFORM_ADMIN), sessions (ADMIN scope)

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Email | email | Required | valid |
| Password | password | Required | 1–128 |


**Validation:** Invalid credentials; rate limit

**Submission behaviour:** Response says which MFA step is required.

**Possible server errors (existing copy keys):** `error.auth.invalid_credentials`, `error.auth.unauthenticated`, `error.auth.email_not_verified`, `error.auth.token_invalid`, `error.auth.current_password_wrong`, `error.common.rate_limited`, `error.common.validation_failed`, `error.common.not_found`, `error.common.forbidden`, `error.common.stale_version`, `error.common.stale_state`, `error.common.csrf_origin`, `error.common.csrf_token`, `error.common.internal_error`

### AUTH-11 · Admin MFA enrolment

**Roles / permissions:** Password step done, MFA pending

**Submits to:** POST /admin/auth/mfa/enroll/start; /enroll/confirm · **Stores in:** users.mfa_secret_enc

| Field | Type | Required | Rules / options |
|---|---|---|---|
| 6-digit code | otp | Required | ^\d{6}$ |


**Validation:** field.code; error.admin.mfa_code_invalid

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.auth.invalid_credentials`, `error.auth.unauthenticated`, `error.auth.email_not_verified`, `error.auth.token_invalid`, `error.auth.current_password_wrong`, `error.common.rate_limited`, `error.common.validation_failed`, `error.common.not_found`, `error.common.forbidden`, `error.common.stale_version`, `error.common.stale_state`, `error.common.csrf_origin`, `error.common.csrf_token`, `error.common.internal_error`

### AUTH-12 · Admin recovery codes

**Roles / permissions:** Just enrolled

**Submits to:** (returned by enroll/confirm) · **Stores in:** mfa_recovery_codes

| Field | Type | Required | Rules / options |
|---|---|---|---|
| I have saved these codes | checkbox | Required | required |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.auth.invalid_credentials`, `error.auth.unauthenticated`, `error.auth.email_not_verified`, `error.auth.token_invalid`, `error.auth.current_password_wrong`, `error.common.rate_limited`, `error.common.validation_failed`, `error.common.not_found`, `error.common.forbidden`, `error.common.stale_version`, `error.common.stale_state`, `error.common.csrf_origin`, `error.common.csrf_token`, `error.common.internal_error`

### AUTH-13 · Admin MFA verification

**Roles / permissions:** Password step done

**Submits to:** POST /admin/auth/mfa/verify · **Stores in:** sessions.mfa_verified_at

| Field | Type | Required | Rules / options |
|---|---|---|---|
| 6-digit code | otp | Optional | exactly one of code or recovery code |
| Recovery code | text | Optional | XXXX-XXXX format |


**Validation:** field.code; mfa_code_invalid

**Submission behaviour:** Replay-protected; session rotates.

**Possible server errors (existing copy keys):** `error.auth.invalid_credentials`, `error.auth.unauthenticated`, `error.auth.email_not_verified`, `error.auth.token_invalid`, `error.auth.current_password_wrong`, `error.common.rate_limited`, `error.common.validation_failed`, `error.common.not_found`, `error.common.forbidden`, `error.common.stale_version`, `error.common.stale_state`, `error.common.csrf_origin`, `error.common.csrf_token`, `error.common.internal_error`

### ACC-02 · Register a company (onboarding)

**Roles / permissions:** Email-verified user

**Submits to:** POST /companies · **Stores in:** companies, workspaces, memberships

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Legal name | text | Required | 2–200 |
| Display name | text | Required | 2–120 |
| Trade licence number | text | Required | 3–60; unique with issuer |
| Licence issuing authority | text | Required | 2–120 |
| Licence expiry date | date | Required | future |
| Licensed activity | text | Required | 2–200 |
| Emirate | select | Required | 7 emirates |
| Tax registration number (TRN) | text | Optional | 15 digits, optional |
| Company contact email | email | Required | valid |
| Company contact phone | tel | Required | E.164, e.g. +971501234567 |
| Access requested | checkboxes | Required | Buyer and/or Seller (min 1) |


**Validation:** error.company.licence_exists; licence_expiry_future; field.trn; field.phone

**Submission behaviour:** Creates DRAFT company and PENDING workspaces.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-03 · Company profile and verification

**Roles / permissions:** Read: members. Edit, upload, submit, renew: company.manage (OWNER). Download legal documents: legal_documents.read (OWNER). Locked while SUBMITTED/UNDER_REVIEW and after approval ("Licence changes go through renewal").

**Submits to:** GET/PATCH /companies/{id}; GET/POST /companies/{id}/verification; POST /companies/{id}/documents; DELETE …/documents/{id}; POST /companies/{id}/renewal; GET /files/{id}/download · **Stores in:** companies, verification_cases, verification_case_events, verification_documents, files

| Field | Type | Required | Rules / options |
|---|---|---|---|
| See ACC-04, ACC-05, ACC-06, ACC-07 | mixed | Optional |  |


**Validation:** error.verification.incomplete; terms_outdated; company.not_editable

**Submission behaviour:** Upload is scanned before storage; infected files are blocked with a message.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-05 · Verification document upload

**Roles / permissions:** company.manage while case editable

**Submits to:** POST /companies/{id}/documents · **Stores in:** files, verification_documents

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Document type | select | Required | TRADE_LICENCE, AUTHORIZED_REPRESENTATIVE, OTHER |
| Document expiry date | date | Optional | optional |
| File | file | Required | PDF/PNG/JPEG, ≤ UPLOAD_MAX_BYTES (10 MB default); magic bytes checked; malware scanned |


**Validation:** field.type, field.too_large, error.file.scanning_unavailable

**Submission behaviour:** Shows "Document uploaded and scanned clean." or "The malware scan blocked this file…".

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-06 · Submit for verification (terms)

**Roles / permissions:** company.manage; DRAFT, NEEDS_INFO, REJECTED

**Submits to:** POST /companies/{id}/verification · **Stores in:** verification_cases, companies.terms_version

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Accept terms | checkbox | Required | must be checked; terms_version must match |


**Validation:** field.terms; error.verification.incomplete

**Submission behaviour:** Moves case to SUBMITTED; company sees read-only details.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-07 · Licence renewal

**Roles / permissions:** APPROVED companies or SUSPENDED for licence expiry

**Submits to:** POST /companies/{id}/renewal · **Stores in:** verification_cases (RENEWAL, proposed)

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Trade licence number | text | Required | 3–60 |
| Licence issuing authority | text | Required | 2–120 |
| Licence expiry date | date | Required | future |


**Validation:** error.verification.renewal_not_allowed; case_open

**Submission behaviour:** Creates RENEWAL case.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-09 · Team management

**Roles / permissions:** Read: members. Manage: role OWNER only. Owners can only grant roles valid for the workspace kind (buyer: OWNER, PROCUREMENT, VIEWER; seller: OWNER, SALES, WAREHOUSE, FINANCE, VIEWER).

**Submits to:** GET /workspaces/{id}/members; GET/POST/DELETE /workspaces/{id}/invitations; PATCH /memberships/{id} · **Stores in:** memberships, invitations

| Field | Type | Required | Rules / options |
|---|---|---|---|
| See ACC-10 | mixed | Optional |  |


**Validation:** error.team.last_owner; already_member; role_not_allowed

**Submission behaviour:** Revocation takes effect immediately.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-10 · Invite team member form

**Roles / permissions:** OWNER

**Submits to:** POST /workspaces/{id}/invitations · **Stores in:** invitations

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Email | email | Required | valid |
| Role | select | Required | roles valid for workspace kind |


**Validation:** field.member; field.not_allowed

**Submission behaviour:** 7-day single-use token; rate limited.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-11 · Change role dialog

**Roles / permissions:** OWNER

**Submits to:** PATCH /memberships/{id} · **Stores in:** memberships

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Role | select | Required |  |


**Validation:** last_owner

**Submission behaviour:** Session rotation for the member on privilege change.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-13 · Account settings

**Roles / permissions:** Own account only

**Submits to:** GET/PATCH /me; GET /me/sessions; DELETE /me/sessions/{id}; POST /me/sessions/revoke-others; POST /me/password; GET/PATCH /notifications/preferences · **Stores in:** users, sessions, notification_preferences

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Full name | text | Required | 1–120 |
| Language | select | Required | en, ar |
| Current password | password | Required | for password change |
| New password | password | Required | 12–128 |
| Email: RFQs | toggle | Optional | default on |
| Email: quotes | toggle | Optional | default on |
| Email: messages | toggle | Optional | default off |
| Email: marketing | toggle | Optional | default off; records consent time |


**Validation:** error.auth.current_password_wrong; field.min

**Submission behaviour:** Password change signs out other sessions.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-14 · Notification centre

**Roles / permissions:** Own notifications

**Submits to:** GET /notifications; POST /notifications/{id}/read; POST /notifications/read-all; GET /notifications/unread · **Stores in:** notifications

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Unread only | toggle | Optional |  |


**Validation:** —

**Submission behaviour:** Opening marks read; links only to internal /app paths.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-15 · Workspace switcher

**Roles / permissions:** Own memberships

**Submits to:** GET /me · **Stores in:** memberships

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Workspace | select | Optional |  |


**Validation:** —

**Submission behaviour:** Remembered in localStorage per browser.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-16 · Account closure and data requests

**Roles / permissions:** Own data; company closure OWNER

**Submits to:** Not built · **Stores in:** Not built

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Request type | radio | Required | Access, Export, Deletion, Account closure |
| Details | textarea | Optional | optional |


**Validation:** —

**Submission behaviour:** Irreversible deletion disabled until legal approval.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### ACC-17 · Billing, invoices and statements

**Roles / permissions:** Buyer invoice read: OWNER/PROCUREMENT (10-security); seller finance: OWNER/FINANCE

**Submits to:** Not built · **Stores in:** invoices (spec only)

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Period | date range | Optional |  |
| Type | select | Optional | Merchandise invoice, Commission invoice, Credit note, Receipt |


**Validation:** —

**Submission behaviour:** Immutable issued documents.

**Possible server errors (existing copy keys):** `error.company.licence_exists`, `error.company.not_editable`, `error.company.licence_expiry_future`, `error.company.renewal_required`, `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`

### MSG-02 · Conversation thread

**Roles / permissions:** Participants only; sending is trading-gated (approved company).

**Submits to:** GET/POST /workspaces/{ws}/conversations/{id}/messages; POST …/read; GET …/{id} · **Stores in:** messages, read_receipts

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Your message | textarea | Required | 1–4000; 60 messages per user per minute |


**Validation:** error.messages.counterpart_unavailable; trading errors

**Submission behaviour:** 15-second polling while open; read marker moves forward.

**Possible server errors (existing copy keys):** `error.messages.counterpart_unavailable`, `error.trading.not_eligible`, `error.trading.company_not_approved`, `error.trading.licence_expired`, `error.trading.company_suspended`, `error.trading.workspace_inactive`, `error.trading.seller_not_eligible`

### MSG-03 · New message to supplier

**Roles / permissions:** Approved buyer workspace

**Submits to:** POST /workspaces/{ws}/conversations · **Stores in:** conversations

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Your message | textarea | Required | 1–4000 |


**Validation:** —

**Submission behaviour:** Reuses an existing conversation for the pair.

**Possible server errors (existing copy keys):** `error.messages.counterpart_unavailable`, `error.trading.not_eligible`, `error.trading.company_not_approved`, `error.trading.licence_expired`, `error.trading.company_suspended`, `error.trading.workspace_inactive`, `error.trading.seller_not_eligible`

### MSG-04 · Message attachments

**Roles / permissions:** Participants

**Submits to:** Not built · **Stores in:** messages.file_id (reserved), files (MESSAGE_ATTACHMENT)

| Field | Type | Required | Rules / options |
|---|---|---|---|
| File | file | Optional | PDF/PNG/JPEG, scanned, private |


**Validation:** Type, size

**Submission behaviour:** Scan before availability.

**Possible server errors (existing copy keys):** `error.messages.counterpart_unavailable`, `error.trading.not_eligible`, `error.trading.company_not_approved`, `error.trading.licence_expired`, `error.trading.company_suspended`, `error.trading.workspace_inactive`, `error.trading.seller_not_eligible`

### BUY-03 · New request for quotation

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only.

**Submits to:** POST /buyer/workspaces/{ws}/rfqs; POST /buyer/workspaces/{ws}/rfqs/{id}/files; GET /buyer/workspaces/{ws}/invite-candidates · **Stores in:** rfqs, rfq_invitations, rfq_files, files

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Title | text | Required | 1–160 |
| Category | select | Required | active, non-BLOCKED leaf category |
| Quantity | integer | Required | 1–10,000,000 |
| Unit | select | Required | 8 quantity units |
| Specifications | textarea | Required | 1–5000 |
| Delivery emirate | select | Required | 7 emirates |
| Needed by | date | Optional | optional, after deadline |
| Quote deadline (Dubai time) | datetime | Required | 60 minutes to 90 days from now |
| Who can quote | radio | Required | POOL (matching suppliers) or INVITE |
| Budget (AED) | money | Optional | optional, fils integer |
| Invited suppliers | multi-select | Optional | ≤20; required when INVITE |
| Attachments | file | Optional | ≤5, PDF/PNG/JPEG ≤10 MB, malware-scanned |


**Validation:** Server zod rules shown inline; open RFQ limit 50 per workspace; deadline validated in Dubai time.

**Submission behaviour:** Save creates DRAFT and routes to BUY-05; attachments upload after the draft exists.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-04 · Request quotation entry (workspace chooser)

**Roles / permissions:** Signed-in; only ACTIVE buyer workspaces with buyer.purchase qualify.

**Submits to:** — · **Stores in:** —

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Buyer workspace | radio | Required | eligible buyer workspaces of the user |


**Validation:** —

**Submission behaviour:** Auto-redirects when exactly one eligible workspace.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-08 · Cancel request dialog

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Not after AWARDED.

**Submits to:** POST /buyer/workspaces/{ws}/rfqs/{id}/cancel · **Stores in:** rfqs, quotes, rfq_events

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | textarea | Optional | optional, ≤1000 |


**Validation:** —

**Submission behaviour:** "Request cancelled."

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-09 · Invite suppliers picker

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Own company excluded (no self-trade).

**Submits to:** GET /buyer/workspaces/{ws}/invite-candidates · **Stores in:** marketplace_suppliers

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Search suppliers | text | Optional | max 100 |
| Selection | multi | Optional | ≤20 |


**Validation:** ≤20 invitees

**Submission behaviour:** Debounced search; selection held in the draft.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-12 · Accept quote dialog

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only.

**Submits to:** POST /buyer/workspaces/{ws}/quotes/{quoteId}/accept · **Stores in:** quotes, rfqs, checkouts, orders

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Your PO reference | text | Optional | optional, ≤60 |


**Validation:** Version must still be current (quote.superseded) and the RFQ OPEN (rfq.not_open).

**Submission behaviour:** Idempotency-Key header; accepts the exact version_id; creates checkout (source QUOTE) and order with 72-hour payment deadline (D05). The delivery address (in the quoted emirate) is chosen when starting payment on BUY-18.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-13 · Request revision dialog

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only.

**Submits to:** POST /buyer/workspaces/{ws}/quotes/{quoteId}/request-revision · **Stores in:** quotes, rfq_events

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason / note to supplier | textarea | Optional | optional, ≤1000 |


**Validation:** —

**Submission behaviour:** "Revision requested."; flag shown on quote.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-14 · Decline quote dialog

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only.

**Submits to:** POST /buyer/workspaces/{ws}/quotes/{quoteId}/decline · **Stores in:** quotes

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | textarea | Optional | optional, ≤1000 |


**Validation:** —

**Submission behaviour:** "Quote declined."

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-15 · Counteroffer to supplier

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only.

**Submits to:** New: POST /buyer/workspaces/{ws}/quotes/{quoteId}/counter · **Stores in:** New quote_counteroffers table or event payload

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Proposed unit price (AED) | money | Required | fils integer |
| Quantity | integer | Required | 1–10,000,000 |
| Needed by | date | Optional |  |
| Note | textarea | Optional | ≤2000 |


**Validation:** Server validates amounts and RFQ state.

**Submission behaviour:** Supplier answers by revising (new version) or declining.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-16 · Cart

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only. Max 50 lines.

**Submits to:** GET/POST/PATCH/DELETE /buyer/workspaces/{ws}/cart(/items) · **Stores in:** carts, cart_items, skus, inventory, price_tiers

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Quantity | integer | Required | ≥ MOQ, increment, ≤ available |


**Validation:** MOQ_NOT_MET, INCREMENT, insufficient stock.

**Submission behaviour:** Server re-prices on every load; lines with issues block checkout.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-17 · Checkout

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only.

**Submits to:** POST /buyer/workspaces/{ws}/checkout/preview; POST /buyer/workspaces/{ws}/checkouts · **Stores in:** checkouts, orders, order_lines, reservations, addresses

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Deliver to | radio | Required | active UAE address |
| Your PO reference | text | Optional | optional |
| Accept terms | checkbox | Required | required ("Confirm the order details to continue.") |


**Validation:** Address emirate served; no blocking issues; terms accepted.

**Submission behaviour:** Preview hash; 409 checkout.changed shows refreshed totals; creates checkout + orders + 15-minute reservation.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-21 · Address form

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only.

**Submits to:** POST/PATCH /buyer/workspaces/{ws}/addresses(/{id}) · **Stores in:** addresses

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Label (for example Main warehouse) | text | Required | ≤60 |
| Recipient | text | Required | ≤120 |
| Phone | tel | Required | E.164, UAE format hint |
| Address line 1 | text | Required | ≤200 |
| Address line 2 | text | Optional | ≤200 |
| City | text | Required | ≤80 |
| Emirate | select | Required | 7 emirates |
| Make default | checkbox | Optional |  |


**Validation:** Phone regex; required fields; max 20 addresses.

**Submission behaviour:** "Address saved."

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-26 · Rate supplier form

**Roles / permissions:** buyer.orders.act; order COMPLETED; once per order.

**Submits to:** POST /buyer/workspaces/{ws}/orders/{id}/review · **Stores in:** reviews

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Rating | radio 1–5 | Required |  |
| Comment | textarea | Optional | ≤1000 |


**Validation:** 1–5; ≤1000

**Submission behaviour:** Shows "Your review" afterwards.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-27 · Open dispute form (buyer)

**Roles / permissions:** buyer.orders.act

**Submits to:** POST /buyer/workspaces/{ws}/orders/{id}/disputes · **Stores in:** disputes, settlements

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Problem | select | Required | NOT_RECEIVED, DAMAGED, WRONG_ITEMS, QUANTITY_SHORT, QUALITY, OTHER |
| What happened? | textarea | Required | ≤2000 |


**Validation:** Within window; one open dispute per order.

**Submission behaviour:** Creates dispute OPEN; settlement HELD; routes to SHR-02.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-31 · Request order cancellation (buyer)

**Roles / permissions:** buyer.orders.act

**Submits to:** New endpoints · **Stores in:** New cancellation_requests

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | select | Required |  |
| Details | textarea | Optional | ≤2000 |


**Validation:** —

**Submission behaviour:** Supplier/admin decides; refund via finance dual control.

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### BUY-32 · Request a sample

**Roles / permissions:** Buyer OWNER or PROCUREMENT in an ACTIVE (approved) buyer workspace (capability buyer.purchase). VIEWER read-only.

**Submits to:** Could reuse RFQ with a "sample" flag · **Stores in:** rfqs

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Quantity | integer | Required |  |
| Note | textarea | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.address.limit_reached`, `error.cart.self_trade`, `error.cart.not_cart_eligible`, `error.cart.insufficient_stock`, `error.cart.limit_reached`, `error.checkout.payments_disabled`, `error.checkout.changed`, `error.checkout.blocked`, `error.checkout.insufficient_stock`, `error.checkout.not_payable`, `error.checkout.expired`, `error.checkout.address_emirate_mismatch`, `error.checkout.too_many_attempts`, `error.checkout.quote_cancel_unsupported`

### SHR-02 · Dispute detail

**Roles / permissions:** Read: any member. Post: buyer.orders.act or seller.inventory.ship.

**Submits to:** GET/POST …/disputes/{id}(/messages); GET …/files/{fileId} · **Stores in:** disputes, dispute_messages, files

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Message | textarea | Required | ≤2000 (≤200 messages per dispute) |
| Evidence (PDF, PNG or JPEG) | file | Optional | ≤10 MB, scanned |


**Validation:** Length, file type, size

**Submission behaviour:** Composer hidden when CLOSED.

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.file.image_type_not_allowed`, `error.file.image_unreadable`, `error.file.image_too_small`, `error.file.infected`, `error.dispute.not_allowed`, `error.dispute.exists`, `error.dispute.closed`, `error.dispute.not_assigned`, `error.dispute.invalid_transition`

### SHR-04 · New support ticket

**Roles / permissions:** Any member except VIEWER; ≤20 open per workspace today (founder: 10 per company).

**Submits to:** POST /workspaces/{ws}/support · **Stores in:** support_tickets

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Topic | select | Required | ACCOUNT, VERIFICATION, ORDER, PAYMENT, RFQ, CATALOG, OTHER |
| Subject | text | Required | ≤160 |
| How can we help? | textarea | Required | ≤4000 |
| Linked order | select | Optional | own orders |
| Linked request | select | Optional | own RFQs |


**Validation:** Lengths; open-ticket limit

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.file.image_type_not_allowed`, `error.file.image_unreadable`, `error.file.image_too_small`, `error.file.infected`, `error.dispute.not_allowed`, `error.dispute.exists`, `error.dispute.closed`, `error.dispute.not_assigned`, `error.dispute.invalid_transition`

### SHR-05 · Support ticket detail

**Roles / permissions:** Reply/close/reopen: members except VIEWER.

**Submits to:** GET /workspaces/{ws}/support/{id}; POST /messages, /close, /reopen · **Stores in:** support_tickets, support_messages

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reply | textarea | Required | ≤4000 (≤200 messages) |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.file.image_type_not_allowed`, `error.file.image_unreadable`, `error.file.image_too_small`, `error.file.infected`, `error.dispute.not_allowed`, `error.dispute.exists`, `error.dispute.closed`, `error.dispute.not_assigned`, `error.dispute.invalid_transition`

### SEL-02 · Storefront editor

**Roles / permissions:** Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace.

**Submits to:** GET/PATCH /seller/workspaces/{ws}/storefront · **Stores in:** storefronts

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Business type | select | Optional | 7 types |
| Description (EN) | textarea | Optional | ≤4000 |
| Description (AR) | textarea | Optional | ≤4000 |
| Year established | integer | Optional | 1900–2100 |
| City | text | Optional | ≤80 |
| Specialisation EN/AR | text | Optional | ≤300 |
| Capabilities EN/AR | textarea | Optional | ≤2000 |
| Production capacity | text | Optional | ≤200 |
| Custom manufacturing / Private label / White label / Samples available | checkbox | Optional |  |
| Fulfilment EN/AR | textarea | Optional | ≤1000 |
| Certifications | repeater | Optional | ≤20 |


**Validation:** Lengths; year range

**Submission behaviour:** expected_version concurrency; contact details/documents never public.

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-03 · Storefront media manager

**Roles / permissions:** Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace.

**Submits to:** Storefront media endpoints under /seller/workspaces/{ws}/storefront · **Stores in:** storefront_media, files

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Kind | select | Required | LOGO, COVER, FACTORY, WAREHOUSE, OTHER |
| Image | file | Required | PNG/JPEG/WebP ≥200px ≤10 MB |
| Caption EN/AR | text | Optional | ≤150 |


**Validation:** Type, size, dimensions; malware scan

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-04 · Delivery terms

**Roles / permissions:** Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace.

**Submits to:** PATCH /seller/workspaces/{ws}/storefront · **Stores in:** storefronts

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Delivery fee per order (AED) | money | Optional | fils |
| Typical delivery time (days) | integer | Optional | 0–90 |
| Emirates you deliver to | checkboxes | Optional | ≤7 |


**Validation:** —

**Submission behaviour:** Without terms, checkout shows "This supplier has not set delivery terms yet."

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-07 · Add product

**Roles / permissions:** Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace.

**Submits to:** POST /seller/workspaces/{ws}/products · **Stores in:** products, product_versions, skus

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Title (EN) | text | Required | 3–150 |
| Category | select | Required | leaf, not BLOCKED |
| Fulfilment mode | radio | Required | READY_STOCK, MADE_TO_ORDER |
| SKU code | text | Required | SKU regex |
| Unit | select | Required | 8 units (default PIECE) |


**Validation:** Server zod; seller eligibility

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-08 · Product editor (content)

**Roles / permissions:** Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace.

**Submits to:** GET/PATCH /seller/workspaces/{ws}/products/{id} · **Stores in:** products, product_versions, category_attributes

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Title EN | text | Required | 3–150 |
| Title AR | text | Optional | ≤150 |
| Description EN | textarea | Optional | ≤8000 |
| Description AR | textarea | Optional | ≤8000 |
| Category | select | Required |  |
| Mode | radio | Required |  |
| Category attributes | dynamic | Optional | per category |
| Specifications | repeater | Optional | ≤40 |
| Materials | text | Optional | ≤300 |
| Dimensions | text | Optional | ≤200 |
| Country of origin | text | Optional | 2-letter code |
| Lead time min/max (days) | integer | Optional | 0–365 |
| Dispatch days | integer | Optional | 0–365 |
| Custom manufacturing / Private label / White label / Samples | checkbox | Optional |  |
| Samples note | text | Optional |  |
| Certifications | repeater | Optional | ≤20 |
| Video URL | url | Optional | YouTube or Vimeo only |


**Validation:** Restricted-term screening on submit

**Submission behaviour:** expected_version; locked fields while pending.

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-09 · Product media manager

**Roles / permissions:** Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace.

**Submits to:** Product media endpoints · **Stores in:** product_media, files

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Image | file | Required | PNG/JPEG/WebP ≥200px ≤10 MB, ≤12 |


**Validation:** Type/size/dimensions; scan

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-10 · Variants (SKU) manager

**Roles / permissions:** Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace.

**Submits to:** POST/PATCH/DELETE /seller/workspaces/{ws}/products/{id}/skus(/{skuId}) · **Stores in:** skus

| Field | Type | Required | Rules / options |
|---|---|---|---|
| SKU code | text | Required | regex, unique |
| Variant attributes | key-value | Optional |  |
| Unit | select | Required |  |
| Active | toggle | Optional |  |


**Validation:** —

**Submission behaviour:** Identity locked once approved.

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-11 · Product pricing editor

**Roles / permissions:** Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace.

**Submits to:** POST /seller/workspaces/{ws}/products/{id}/pricing · **Stores in:** price_tiers, skus

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Price type | radio | Required | FIXED, TIERED, QUOTE_ONLY |
| MOQ | integer | Required | ≥1 |
| Order increment | integer | Required | ≥1 |
| Tiers | table | Optional | FIXED 1; TIERED 2–10; first = MOQ; ascending qty; non-increasing price |


**Validation:** Tier rules

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-16 · Stock adjustment dialog

**Roles / permissions:** Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated.

**Submits to:** POST /seller/workspaces/{ws}/inventory/{skuId}/adjust · **Stores in:** inventory, stock_movements

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Movement | select | Required | RECEIVE, REMOVE, MARK_UNAVAILABLE, RELEASE_UNAVAILABLE, SET_ON_HAND |
| Quantity | integer | Required | >0 (never negative result) |
| Note | text | Required | reason |


**Validation:** Never negative

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-17 · Low-stock threshold and restock date

**Roles / permissions:** Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated.

**Submits to:** PATCH /seller/workspaces/{ws}/inventory/{skuId} · **Stores in:** inventory

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Low-stock threshold | integer | Optional | ≥0 |
| Restock date | date | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-22 · Quote form

**Roles / permissions:** Seller OWNER or SALES (seller.catalog.edit); trading-gated: needs an ACTIVE workspace.

**Submits to:** POST /seller/workspaces/{ws}/rfqs/{id}/quote; PATCH /seller/workspaces/{ws}/quotes/{id}; POST /files · **Stores in:** quotes, quote_versions, quote_files

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Quantity | integer | Required | 1–10,000,000 |
| Unit price (AED, before tax) | money | Required | fils |
| Shipping (AED, before tax) | money | Optional | fils |
| Tax treatment | select | Required | STANDARD, ZERO_RATED, EXEMPT |
| Lead time (days) | integer | Required | 0–730 |
| Delivery date | date | Optional |  |
| Valid until (Dubai time) | datetime | Required | ≤90 days; no default today (founder: 7 days) |
| What is offered | textarea | Required |  |
| Differences from the request | textarea | Optional | ≤2000 |
| Terms | textarea | Optional | ≤3000 |
| Attachments | file | Optional | PDF/PNG/JPEG ≤10 MB |


**Validation:** Server zod

**Submission behaviour:** Submitted versions immutable; revision supersedes.

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-25 · Ask the buyer a question

**Roles / permissions:** Messaging roles (OWNER, SALES)

**Submits to:** POST /workspaces/{ws}/conversations · **Stores in:** conversations, messages

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Message | textarea | Required | ≤4000 |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-29 · Record dispatch dialog

**Roles / permissions:** Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated. Paid orders only.

**Submits to:** POST /seller/workspaces/{ws}/orders/{id}/dispatch · **Stores in:** shipments, orders

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Carrier | text | Optional |  |
| Tracking reference | text | Optional |  |
| Expected delivery | date | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-30 · Report delivery dialog

**Roles / permissions:** Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated.

**Submits to:** POST /seller/workspaces/{ws}/orders/{id}/deliver · **Stores in:** shipments, files

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Delivery note | textarea | Optional |  |
| Proof of delivery (PDF, PNG or JPEG) | file | Optional | ≤10 MB, scanned |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-31 · Open dispute (seller)

**Roles / permissions:** Seller OWNER, SALES or WAREHOUSE (seller.inventory.ship); trading-gated.

**Submits to:** POST /seller/workspaces/{ws}/orders/{id}/disputes · **Stores in:** disputes

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Problem | select | Required | 6 types |
| What happened? | textarea | Required | ≤2000 |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### SEL-36 · Supplier order cancellation

**Roles / permissions:** seller.inventory.ship

**Submits to:** — · **Stores in:** orders, refunds

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | select | Required |  |
| Details | textarea | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.file.required`, `error.file.type_not_allowed`, `error.file.too_large`, `error.file.not_clean`, `error.file.scanning_unavailable`, `error.catalog.pending_review_locked`, `error.catalog.product_locked`, `error.catalog.sku_exists`, `error.catalog.sku_identity_locked`, `error.catalog.media_limit`, `error.catalog.pricing_invalid`, `error.catalog.submission_incomplete`, `error.catalog.restricted_term`, `error.catalog.invalid_transition`

### ADM-01 · Admin overview and operations

**Roles / permissions:** admin.companies.read for counts; commerce needs admin.finance.read.

**Submits to:** GET /admin/overview; GET /admin/operations/overview · **Stores in:** companies, users, disputes, support_tickets, reconciliation_cases, refunds, payouts, ledger_entries

| Field | Type | Required | Rules / options |
|---|---|---|---|
| From | date | Optional | Dubai date |
| To | date | Optional | Dubai date |


**Validation:** —

**Submission behaviour:** Server-computed; no hardcoded figures.

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-04 · Verification decision dialog

**Roles / permissions:** admin.verification.review

**Submits to:** POST /admin/verification/{id}/decision · **Stores in:** verification_cases, companies, workspaces, notifications

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Decision | radio | Required | APPROVE, NEEDS_INFO, REJECT |
| Reason | textarea | Optional | required unless APPROVE |


**Validation:** Reason rule

**Submission behaviour:** Email + in-app notification to company; audit event.

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-07 · Suspend or reactivate company dialog

**Roles / permissions:** admin.companies.suspend

**Submits to:** POST /admin/companies/{id}/suspend | /reactivate · **Stores in:** companies, workspaces, audit_events

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | textarea | Required | required |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-09 · Revoke sessions dialog

**Roles / permissions:** admin.users.revoke_sessions

**Submits to:** POST /admin/users/{id}/revoke-sessions · **Stores in:** sessions, audit_events

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | textarea | Required |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-13 · Review decision dialog

**Roles / permissions:** admin.catalog.review

**Submits to:** POST /admin/catalog/reviews/{versionId}/decision · **Stores in:** product_versions, products, notifications

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Decision | radio | Required | APPROVE, CHANGES_REQUESTED, REJECT |
| Reason | textarea | Optional | required unless approve |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-16 · Listing enforcement dialog

**Roles / permissions:** admin.catalog.enforce

**Submits to:** POST /admin/catalog/products/{id}/suspend|restore|remove · **Stores in:** products, audit_events

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | textarea | Required |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-19 · Hide or restore storefront dialog

**Roles / permissions:** admin.catalog.enforce

**Submits to:** POST /admin/storefronts/{id}/hide|restore · **Stores in:** storefronts

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | textarea | Required |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-20 · Categories

**Roles / permissions:** admin.catalog.read; manage admin.categories.manage

**Submits to:** GET/POST /admin/categories · **Stores in:** categories

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Name EN | text | Required |  |
| Name AR | text | Required |  |
| Parent | select | Optional |  |
| Restriction | select | Required | OPEN, REVIEW_REQUIRED, BLOCKED |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-21 · Category editor

**Roles / permissions:** admin.categories.manage

**Submits to:** GET/PATCH /admin/categories/{id}; POST /image; POST /attributes · **Stores in:** categories, category_attributes

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Name EN/AR | text | Required |  |
| Description EN/AR | textarea | Optional |  |
| Requirements EN/AR | textarea | Optional |  |
| Restriction | select | Optional | reason required to change |
| Hidden / Archived | toggle | Optional | reason required |
| Image | file | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-22 · Category attribute editor

**Roles / permissions:** admin.categories.manage

**Submits to:** POST /admin/categories/{id}/attributes; PATCH /admin/category-attributes/{id} · **Stores in:** category_attributes

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Key | text | Required |  |
| Label EN/AR | text | Required |  |
| Type | select | Required |  |
| Options | list | Optional |  |
| Required | checkbox | Optional |  |
| Filterable | checkbox | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-23 · Restricted and prohibited terms

**Roles / permissions:** admin.restricted.manage

**Submits to:** GET/POST/PATCH /admin/restricted-terms · **Stores in:** restricted_terms

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Term | text | Required |  |
| Action | select | Required | BLOCK (prohibited) or REVIEW (route to moderation) |
| Active | toggle | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-24 · Featured placements

**Roles / permissions:** admin.featured.manage

**Submits to:** GET/POST/DELETE /admin/featured · **Stores in:** featured_listings

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Kind | select | Required | PRODUCT, SUPPLIER |
| Target | select | Required | public targets only |
| Position | integer | Required |  |
| Starts | datetime | Optional |  |
| Ends | datetime | Optional |  |
| Reason | text | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-27 · Hide or unhide RFQ dialog

**Roles / permissions:** admin.rfqs.moderate

**Submits to:** POST /admin/rfqs/{id}/hide|unhide · **Stores in:** rfqs, audit_events

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | textarea | Required |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-31 · Reconciliation case resolution

**Roles / permissions:** admin.finance.read; resolution needs new capability with dual control

**Submits to:** New endpoints · **Stores in:** reconciliation_cases, ledger_entries

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Resolution | select | Required |  |
| Note | textarea | Required |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-33 · Request refund form

**Roles / permissions:** admin.refunds.request

**Submits to:** POST /admin/refunds · **Stores in:** refunds

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Order ID | text | Required | uuid (recommended: picker from ADM-29) |
| Amount (AED) | money | Required | ≤ remaining refundable |
| Reason | textarea | Required |  |
| Dispute ID | text | Optional | optional |


**Validation:** Amount ≤ refundable

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-34 · Approve or reject refund dialog

**Roles / permissions:** admin.refunds.approve; not the requester

**Submits to:** POST /admin/refunds/{id}/approve|reject · **Stores in:** refunds

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason for the decision | textarea | Optional | required to reject |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-37 · Approve or reject payout dialog

**Roles / permissions:** admin.payouts.approve; not the requester

**Submits to:** POST /admin/payouts/{id}/approve|reject · **Stores in:** payouts

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason | textarea | Optional | required to reject |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-39 · Dispute detail (admin)

**Roles / permissions:** admin.disputes.read; actions admin.disputes.manage

**Submits to:** GET /admin/disputes/{id}; POST /assign, /request-evidence, /propose, /close, /messages · **Stores in:** disputes, dispute_messages

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Note to both parties | textarea | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-40 · Dispute action dialogs

**Roles / permissions:** admin.disputes.manage

**Submits to:** POST /admin/disputes/{id}/request-evidence|propose|close · **Stores in:** disputes

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Proposal | radio | Required | NO_ACTION, REFUND |
| Amount (AED) | money | Optional | required for REFUND |
| Note | textarea | Required |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-41 · Supplier reviews moderation

**Roles / permissions:** admin.reviews.moderate

**Submits to:** GET /admin/reviews; POST /hide, /unhide · **Stores in:** reviews

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reason (recorded in the audit log) | textarea | Required |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-43 · Ticket detail (admin)

**Roles / permissions:** admin.support.read; actions admin.support.manage

**Submits to:** GET /admin/support/{id}; POST /assign, /messages, /resolve, /reopen · **Stores in:** support_tickets, support_messages

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Reply | textarea | Required | ≤4000 |
| Resolution note | textarea | Optional |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-44 · Reports (scoped CSV exports)

**Roles / permissions:** admin.reports.export; scope by role (P6-4)

**Submits to:** GET/POST /admin/exports; GET /admin/exports/{id}/download · **Stores in:** exports, audit_events

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Report | select | Required | orders, refunds, payouts, disputes, support_tickets (scoped by role) |
| Scope | radio | Required | assigned (Assigned to me) or all (All records); support only assigned |
| From (Dubai date) | date | Required |  |
| To (Dubai date) | date | Required | ≤366 days |
| Reason | textarea | Required | 1–500 |
| Authenticator code | otp | Required | 6 digits |


**Validation:** ≤50k rows; TOTP valid

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-46 · Staff and roles

**Roles / permissions:** admin.staff.manage

**Submits to:** GET /admin/staff; POST /admin/staff/{id}/roles · **Stores in:** admin_users, admin_roles

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Roles | checkboxes | Optional | COMPLIANCE, SUPPORT, FINANCE, FINANCE_APPROVER, SUPER_ADMIN |
| Reason | textarea | Required |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

### ADM-47 · Platform settings and commission

**Roles / permissions:** New restricted capability with dual control

**Submits to:** — · **Stores in:** New platform_settings with history; orders.commission snapshot

| Field | Type | Required | Rules / options |
|---|---|---|---|
| Commission (%) | decimal→basis points | Required |  |
| Effective from | datetime | Required |  |
| Reason | textarea | Required |  |


**Validation:** —

**Submission behaviour:** —

**Possible server errors (existing copy keys):** `error.verification.incomplete`, `error.verification.not_editable`, `error.verification.terms_outdated`, `error.verification.renewal_not_allowed`, `error.verification.case_open`, `error.verification.licence_expired`, `error.admin.mfa_required`, `error.admin.mfa_code_invalid`, `error.admin.forbidden`, `error.admin.no_role`, `error.admin.last_super_admin`, `error.admin.mfa_already_enrolled`, `error.admin.mfa_not_enrolled`, `error.catalog.pending_review_locked`

## 15.3 Server error messages (existing copy)

| Key | English | Arabic |
|---|---|---|
| error.auth.invalid_credentials | The email or password is incorrect. | البريد الإلكتروني أو كلمة المرور غير صحيحة. |
| error.auth.unauthenticated | Your session has ended. Sign in again. | انتهت جلستك. سجّل الدخول مرة أخرى. |
| error.auth.email_not_verified | Verify your email address first. | أكّد بريدك الإلكتروني أولاً. |
| error.auth.token_invalid | This link is invalid, expired or already used. Request a new one. | هذا الرابط غير صالح أو منتهٍ أو مستخدم. اطلب رابطاً جديداً. |
| error.auth.current_password_wrong | The current password is incorrect. | كلمة المرور الحالية غير صحيحة. |
| error.common.rate_limited | Too many attempts. Wait a few minutes and try again. | محاولات كثيرة. انتظر بضع دقائق ثم أعد المحاولة. |
| error.common.validation_failed | Check the highlighted fields. | راجع الحقول المحددة. |
| error.common.not_found | Not found, or you do not have access. | غير موجود، أو ليست لديك صلاحية الوصول. |
| error.common.forbidden | You do not have permission for this action. | ليست لديك صلاحية لهذا الإجراء. |
| error.common.stale_version | This record changed since you opened it. Reload and try again. | تغيّر هذا السجل منذ فتحه. أعد التحميل وحاول مرة أخرى. |
| error.common.stale_state | This item changed state since you opened it. Reload and try again. | تغيّرت حالة هذا العنصر منذ فتحه. أعد التحميل وحاول مرة أخرى. |
| error.common.csrf_origin | The request was blocked for security reasons. Reload the page. | تم حظر الطلب لأسباب أمنية. أعد تحميل الصفحة. |
| error.common.csrf_token | Your security token expired. Reload the page and try again. | انتهت صلاحية رمز الأمان. أعد تحميل الصفحة وحاول مرة أخرى. |
| error.common.internal_error | An unexpected error occurred. | حدث خطأ غير متوقع. |
| error.common.network | Could not reach the server. Check your connection; your input is kept, so you can retry. | تعذّر الوصول إلى الخادم. تحقق من الاتصال؛ تم الاحتفاظ بمدخلاتك لتعيد المحاولة. |
| error.company.licence_exists | A company with this licence number and issuer is already registered. | توجد شركة مسجلة بنفس رقم الرخصة وجهة الإصدار. |
| error.company.not_editable | Company details cannot be edited in the current status. | لا يمكن تعديل بيانات الشركة في الحالة الحالية. |
| error.company.licence_expiry_future | The licence expiry date must be in the future. | يجب أن يكون تاريخ انتهاء الرخصة في المستقبل. |
| error.company.renewal_required | The licence has expired. The company must submit a renewal. | انتهت الرخصة. يجب على الشركة تقديم طلب تجديد. |
| error.verification.incomplete | Upload both required documents (clean) and make sure the licence is valid before submitting. | ارفع المستندين المطلوبين (سليمين) وتأكد من صلاحية الرخصة قبل الإرسال. |
| error.verification.not_editable | Documents cannot be changed in the current verification state. | لا يمكن تغيير المستندات في حالة التحقق الحالية. |
| error.verification.terms_outdated | The terms changed. Reload the page. | تغيّرت الشروط. أعد تحميل الصفحة. |
| error.verification.renewal_not_allowed | Renewal is available for approved companies, or those restricted because the licence expired. | التجديد متاح للشركات المعتمدة أو المقيّدة بسبب انتهاء الرخصة. |
| error.verification.case_open | A verification case is already open. | توجد حالة تحقق مفتوحة بالفعل. |
| error.verification.licence_expired | The licence on this case has expired; it cannot be approved. | الرخصة في هذه الحالة منتهية ولا يمكن اعتمادها. |
| error.file.required | Choose a file. | اختر ملفاً. |
| error.file.type_not_allowed | Only PDF, PNG or JPEG files are accepted. | تُقبل ملفات PDF أو PNG أو JPEG فقط. |
| error.file.too_large | The file is too large. | حجم الملف كبير جداً. |
| error.file.not_clean | This file was blocked by the malware scan and cannot be downloaded. | تم حظر هذا الملف بواسطة فحص البرمجيات الخبيثة ولا يمكن تنزيله. |
| error.file.scanning_unavailable | Uploads are unavailable because file scanning is not configured. | الرفع غير متاح لأن فحص الملفات غير مهيأ. |
| error.team.last_owner | A workspace must keep at least one owner. Add another owner first. | يجب أن يبقى مالك واحد على الأقل. أضف مالكاً آخر أولاً. |
| error.team.already_member | This person is already a member. | هذا الشخص عضو بالفعل. |
| error.team.role_not_allowed | That role is not available for this workspace. | هذا الدور غير متاح لمساحة العمل هذه. |
| error.invitation.invalid | This invitation link is invalid. | رابط الدعوة غير صالح. |
| error.invitation.not_pending | This invitation is no longer valid. | هذه الدعوة لم تعد صالحة. |
| error.invitation.email_mismatch | This invitation was sent to a different email address. | أُرسلت هذه الدعوة إلى بريد إلكتروني مختلف. |
| error.admin.mfa_required | Complete two-factor authentication to continue. | أكمل المصادقة الثنائية للمتابعة. |
| error.admin.mfa_code_invalid | That code is not valid. Codes can only be used once. | الرمز غير صالح. يمكن استخدام كل رمز مرة واحدة فقط. |
| error.admin.forbidden | Your admin role does not allow this action. | لا يسمح دورك الإداري بهذا الإجراء. |
| error.admin.no_role | Your account has no active admin role. | لا يوجد دور إداري نشط لحسابك. |
| error.admin.last_super_admin | At least one super-admin must remain. | يجب أن يبقى مسؤول أعلى واحد على الأقل. |
| error.admin.mfa_already_enrolled | Two-factor authentication is already set up. | تم إعداد المصادقة الثنائية بالفعل. |
| error.admin.mfa_not_enrolled | Set up two-factor authentication first. | أعدّ المصادقة الثنائية أولاً. |
| error.catalog.pending_review_locked | This listing is waiting for review. Withdraw the submission to edit it. | هذا الإدراج بانتظار المراجعة. اسحب الطلب لتعديله. |
| error.catalog.product_locked | This listing cannot be changed in its current state. | لا يمكن تغيير هذا الإدراج في حالته الحالية. |
| error.catalog.sku_exists | That SKU code is already used in your workspace. | رمز الصنف مستخدم بالفعل في مساحة عملك. |
| error.catalog.sku_identity_locked | An approved variant’s code, unit and attributes cannot change. Add a new variant instead. | لا يمكن تغيير رمز الصنف المعتمد أو وحدته أو سماته. أضف صنفاً جديداً بدلاً من ذلك. |
| error.catalog.media_limit | The image limit has been reached. | تم بلوغ الحد الأقصى للصور. |
| error.catalog.pricing_invalid | Check the highlighted prices: tiers must start at the MOQ, rise in quantity and not increase in price. | راجع الأسعار المحددة: يجب أن تبدأ الشرائح من الحد الأدنى وتتزايد الكميات ولا يرتفع السعر. |
| error.catalog.submission_incomplete | Complete the highlighted items before submitting. | أكمل العناصر المحددة قبل الإرسال. |
| error.catalog.restricted_term | This listing contains a prohibited term and cannot be submitted. | يحتوي هذا الإدراج على كلمة محظورة ولا يمكن إرساله. |
| error.catalog.invalid_transition | That action is not available for this listing now. | هذا الإجراء غير متاح لهذا الإدراج الآن. |
| error.catalog.licence_expired | Your trade licence has expired. Renew it to list and edit products. | انتهت رخصتك التجارية. جدّدها لإدراج المنتجات وتعديلها. |
| error.catalog.company_suspended | Your company is suspended. Listing is paused. | شركتك موقوفة. الإدراج متوقف. |
| error.catalog.company_not_approved | Your company must be verified before you can list products. | يجب توثيق شركتك قبل إدراج المنتجات. |
| error.catalog.workspace_inactive | This seller workspace is not active. | مساحة عمل البائع هذه غير نشطة. |
| error.catalog.seller_not_eligible | This seller is not eligible to list products. | هذا البائع غير مؤهل لإدراج المنتجات. |
| error.catalog.category_unavailable | That category is not available. | هذه الفئة غير متاحة. |
| error.catalog.insufficient_stock | Not enough available stock for this adjustment. | المخزون المتاح غير كافٍ لهذا التعديل. |
| error.catalog.storefront_incomplete | Complete business type, description and city before publishing. | أكمل نوع النشاط والنبذة والمدينة قبل النشر. |
| error.catalog.slug_taken | That slug is already used. | هذا المعرف مستخدم بالفعل. |
| error.catalog.attribute_exists | That attribute key already exists in this category. | مفتاح السمة موجود بالفعل في هذه الفئة. |
| error.catalog.featured_not_public | Only live products and storefronts can be featured. | يمكن تمييز المنتجات والواجهات المنشورة فقط. |
| error.catalog.already_featured | This item is already featured. | هذا العنصر مميز بالفعل. |
| error.catalog.moq_not_met | The quantity is below the minimum order. | الكمية أقل من الحد الأدنى للطلب. |
| error.catalog.order_increment | The quantity must follow the order increment. | يجب أن تتبع الكمية مضاعف الطلب. |
| error.catalog.quote_only | This product is priced on request. | سعر هذا المنتج عند الطلب. |
| error.marketplace.price_requires_verified | Sign in with a verified email to use prices. | سجّل الدخول ببريد موثق لاستخدام الأسعار. |
| error.marketplace.compare_limit | You can compare up to 4 products. Remove one first. | يمكنك مقارنة 4 منتجات كحد أقصى. أزل منتجاً أولاً. |
| error.marketplace.saved_limit | You have reached the saved-items limit. | بلغت الحد الأقصى للعناصر المحفوظة. |
| error.file.image_type_not_allowed | Upload a PNG, JPEG or WebP image. | ارفع صورة PNG أو JPEG أو WebP. |
| error.file.image_unreadable | This image could not be read. Try another file. | تعذرت قراءة الصورة. جرّب ملفاً آخر. |
| error.file.image_too_small | The image must be at least 200 × 200 pixels. | يجب ألا تقل الصورة عن 200 × 200 بكسل. |
| error.catalog.no_content | This listing has no content to show yet. | لا يوجد محتوى لعرضه لهذا المنتج بعد. |
| error.catalog.not_pending | This version is no longer pending review. Reload to see the latest state. | لم تعد هذه النسخة قيد المراجعة. أعد التحميل لرؤية أحدث حالة. |
| error.catalog.nothing_to_submit | There are no draft changes to submit. | لا توجد تعديلات مسودة لإرسالها. |
| error.catalog.sku_approved_deactivate | An approved SKU cannot be deleted. Deactivate it instead. | لا يمكن حذف وحدة SKU معتمدة. قم بتعطيلها بدلاً من ذلك. |
| error.catalog.sku_has_stock_history | This SKU has stock history and cannot be deleted. Deactivate it instead. | لهذه الوحدة سجل مخزون ولا يمكن حذفها. قم بتعطيلها بدلاً من ذلك. |
| error.catalog.sku_last | A listing needs at least one SKU. | يجب أن يحتوي المنتج على وحدة SKU واحدة على الأقل. |
| error.catalog.sku_limit | This listing has reached the SKU limit. | وصل هذا المنتج إلى الحد الأقصى لوحدات SKU. |
| error.file.infected | The file failed the security scan and was not saved. | لم يجتز الملف الفحص الأمني ولم يتم حفظه. |
| error.address.limit_reached | You have reached the maximum number of addresses. | وصلت إلى الحد الأقصى لعدد العناوين. |
| error.cart.self_trade | You cannot order from your own company. | لا يمكنك الطلب من شركتك. |
| error.cart.not_cart_eligible | This item is ordered through a quotation request. | يتم طلب هذا المنتج عبر طلب عرض سعر. |
| error.cart.insufficient_stock | Not enough stock for that quantity. | المخزون غير كافٍ لهذه الكمية. |
| error.cart.limit_reached | Your cart has the maximum number of lines. | وصلت سلتك إلى الحد الأقصى لعدد البنود. |
| error.checkout.payments_disabled | Checkout is not available right now. | إتمام الشراء غير متاح حالياً. |
| error.checkout.changed | Prices, stock or your cart changed since you reviewed it. Review the updated totals and try again. | تغيرت الأسعار أو المخزون أو سلتك منذ المراجعة. راجع الإجماليات المحدثة وحاول مرة أخرى. |
| error.checkout.blocked | Some items cannot be ordered as they are. Review your cart. | لا يمكن طلب بعض المنتجات كما هي. راجع سلتك. |
| error.checkout.insufficient_stock | Another buyer just reserved the last units of an item. Review your cart. | حجز مشترٍ آخر آخر الوحدات من أحد المنتجات. راجع سلتك. |
| error.checkout.not_payable | This checkout can no longer be paid. | لم يعد بالإمكان دفع عملية الشراء هذه. |
| error.checkout.expired | The payment window has passed. | انتهت مهلة الدفع. |
| error.checkout.address_emirate_mismatch | Choose an address in the emirate from your request. | اختر عنواناً في الإمارة المحددة في طلبك. |
| error.checkout.too_many_attempts | Too many payment attempts for this checkout. | محاولات دفع كثيرة لعملية الشراء هذه. |
| error.checkout.quote_cancel_unsupported | An order from an accepted quotation cannot be cancelled here. | لا يمكن إلغاء طلب من عرض سعر مقبول من هنا. |
| error.checkout.payment_in_progress | The payment provider already captured this payment. It cannot be cancelled now. | حصّل مزود الدفع هذه الدفعة بالفعل. لا يمكن الإلغاء الآن. |
| error.payment.invalid_signature | Invalid signature. | توقيع غير صالح. |
| error.payment.invalid_event | Invalid payment event. | حدث دفع غير صالح. |
| error.payment.session_closed | This payment session is already closed. | جلسة الدفع هذه مغلقة بالفعل. |
| error.order.not_paid | This order is not paid yet. Nothing can be shipped before payment. | لم يُدفع هذا الطلب بعد. لا يمكن الشحن قبل الدفع. |
| error.order.invalid_transition | This order has moved on. Reload to see its current state. | تغيرت حالة هذا الطلب. أعد التحميل لرؤية حالته الحالية. |
| error.review.not_completed | You can review the supplier once you have confirmed receipt. | يمكنك تقييم المورد بعد تأكيد الاستلام. |
| error.review.exists | This order already has a review. | يوجد تقييم لهذا الطلب بالفعل. |
| error.review.no_change | The review is already in that state. | التقييم في هذه الحالة بالفعل. |
| error.dispute.not_allowed | A dispute can no longer be opened on this order (outside the window or already paid out). | لم يعد بالإمكان فتح نزاع على هذا الطلب (خارج المهلة أو تم التحويل). |
| error.dispute.exists | This order already has an open dispute. | يوجد نزاع مفتوح على هذا الطلب بالفعل. |
| error.dispute.closed | This dispute is closed. | هذا النزاع مغلق. |
| error.dispute.not_assigned | Assign the dispute to yourself first. | أسند النزاع إلى نفسك أولاً. |
| error.dispute.invalid_transition | This step is not available in the dispute’s current state. | هذه الخطوة غير متاحة في حالة النزاع الحالية. |
| error.dispute.message_limit | This dispute has reached its message limit. | بلغ هذا النزاع الحد الأقصى للرسائل. |
| error.refund.not_paid | This order was never paid. | لم يُدفع هذا الطلب قط. |
| error.refund.order_settled | The supplier has been paid for this order; it cannot be refunded. | تم التحويل إلى المورد عن هذا الطلب؛ لا يمكن استرداده. |
| error.refund.no_capture | No captured payment was found for this order. | لم يتم العثور على دفعة محصلة لهذا الطلب. |
| error.refund.exceeds_remaining | The amount is more than what remains refundable. | المبلغ أكبر من المتبقي القابل للاسترداد. |
| error.refund.dispute_not_ready | The dispute does not have a refund proposal. | لا يتضمن النزاع اقتراح استرداد. |
| error.refund.exceeds_proposal | The amount is more than the proposed refund. | المبلغ أكبر من الاسترداد المقترح. |
| error.refund.self_approval | You requested this refund; another finance user must decide. | أنت من طلب هذا الاسترداد؛ يجب أن يقرر مستخدم مالية آخر. |
| error.refund.invalid_transition | This refund has already been decided. | تم البت في هذا الاسترداد بالفعل. |
| error.payout.nothing_eligible | This supplier has no eligible orders right now. | لا توجد لدى هذا المورد طلبات مؤهلة حالياً. |
| error.payout.self_approval | You requested this payout; another finance user must decide. | أنت من طلب هذا التحويل؛ يجب أن يقرر مستخدم مالية آخر. |
| error.payout.invalid_transition | This payout has already been decided. | تم البت في هذا التحويل بالفعل. |
| error.payout.order_disputed | An order in this payout has an open dispute. | يوجد نزاع مفتوح على أحد طلبات هذا التحويل. |
| error.support.too_many_open | This workspace has too many open tickets. Close resolved ones before opening another. | لدى مساحة العمل هذه عدد كبير من التذاكر المفتوحة. أغلق التذاكر المحلولة قبل فتح تذكرة جديدة. |
| error.support.not_open | This ticket is not open for replies. | هذه التذكرة غير متاحة للرد. |
| error.support.closed | This ticket is closed. | هذه التذكرة مغلقة. |
| error.support.not_resolved | Only a resolved ticket can be reopened. | لا يمكن إعادة فتح إلا التذكرة المحلولة. |
| error.support.not_assigned | Take the ticket before acting on it. | استلم التذكرة قبل اتخاذ أي إجراء. |
| error.support.already_assigned | You already hold this ticket. | هذه التذكرة لديك بالفعل. |
| error.support.too_many_messages | This conversation has reached its message limit. | بلغت هذه المحادثة الحد الأقصى للرسائل. |
| error.export.scope_forbidden | Your role cannot export this report with this scope. The attempt was recorded. | لا يسمح دورك بتصدير هذا التقرير بهذا النطاق. تم تسجيل المحاولة. |
| error.export.expired | This export has expired. Create a new one. | انتهت صلاحية هذا التصدير. أنشئ تصديراً جديداً. |
| error.common.idempotency_key_required | The request could not be confirmed safely. Reload the page and try again. | تعذر تأكيد الطلب بأمان. أعد تحميل الصفحة وحاول مجدداً. |
| error.common.idempotency_key_reused | This confirmation was already used for a different action. Reload and try again. | استُخدم هذا التأكيد لإجراء آخر. أعد التحميل وحاول مجدداً. |
| error.common.stale | Someone changed this in the meantime. The latest version is shown; check it and try again. | غيّر شخص آخر هذا في الأثناء. تظهر الآن أحدث نسخة؛ راجعها وحاول مجدداً. |
| error.quote.accepted_immutable | An accepted quote cannot be changed. | لا يمكن تغيير عرض مقبول. |
| error.quote.exists | You already have a quote on this request. | لديك عرض بالفعل على هذا الطلب. |
| error.quote.expired | This quote has expired. | انتهت صلاحية هذا العرض. |
| error.quote.not_draft | Only a draft quote can be changed. | لا يمكن تغيير إلا مسودة العرض. |
| error.quote.not_submitted | Only a submitted quote can be revised or withdrawn. | لا يمكن تعديل أو سحب إلا عرض مقدّم. |
| error.quote.seller_unavailable | This supplier can no longer trade, so the quote cannot be accepted. | لم يعد هذا المورد قادراً على التداول، لذا لا يمكن قبول العرض. |
| error.quote.superseded | The supplier submitted a newer version. Review it before accepting. | قدّم المورد نسخة أحدث. راجعها قبل القبول. |
| error.rfq.already_awarded | This request has already been awarded. | تمت ترسية هذا الطلب بالفعل. |
| error.rfq.deadline_passed | The quote deadline has passed. | انتهى الموعد النهائي للعروض. |
| error.rfq.file_limit | The attachment limit has been reached. | تم بلوغ الحد الأقصى للمرفقات. |
| error.rfq.files_not_clean | Attachments are still being scanned or were blocked. Remove them or wait, then try again. | المرفقات قيد الفحص أو تم حظرها. أزلها أو انتظر ثم حاول مجدداً. |
| error.rfq.hidden | The platform has hidden this request. It cannot be changed or awarded now. | أخفت المنصة هذا الطلب، ولا يمكن تغييره أو ترسيته الآن. |
| error.rfq.not_cancellable | This request can no longer be cancelled. | لم يعد بالإمكان إلغاء هذا الطلب. |
| error.rfq.not_draft | Only a draft can be published. | لا يمكن نشر إلا المسودة. |
| error.rfq.not_editable | Only a draft can be edited. | لا يمكن تعديل إلا المسودة. |
| error.rfq.not_open | This request is not open for quotes. | هذا الطلب غير مفتوح للعروض. |
| error.rfq.open_limit | Your workspace has reached the limit of open requests. | بلغت مساحة العمل الحد الأقصى للطلبات المفتوحة. |
| error.rfq.self_dealing | You cannot invite or quote for your own company. | لا يمكنك دعوة شركتك أو تقديم عرض لها. |
| error.messages.counterpart_unavailable | The other company can no longer receive messages. | لم تعد الشركة الأخرى قادرة على استلام الرسائل. |
| error.trading.not_eligible | Your company is not yet eligible to trade. | شركتك غير مؤهلة للتداول بعد. |
| error.trading.company_not_approved | Your company must be verified before it can trade. | يجب توثيق شركتك قبل التداول. |
| error.trading.licence_expired | Your trade licence has expired. Renew it to trade. | انتهت رخصتك التجارية. جدّدها للتداول. |
| error.trading.company_suspended | Your company is suspended. Trading is paused. | شركتك موقوفة والتداول متوقف. |
| error.trading.workspace_inactive | This workspace is inactive. | مساحة العمل هذه غير نشطة. |
| error.trading.seller_not_eligible | This supplier is not eligible to trade. | هذا المورد غير مؤهل للتداول. |
