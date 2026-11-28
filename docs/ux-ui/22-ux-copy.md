# 22. UX copy library

The application already has 1718 English and 1718 Arabic strings (typed keys, parity tested). This library groups the existing copy for designers and flags strings that are stale or depend on pending decisions. Keep the tone: professional, plain, specific, in sentence case; say what happened and what to do next; never blame the user; use "supplier" for the seller side in buyer-facing copy and "buyer" for the buying company. Use Dubai time explicitly where a time is entered. Do not invent policy (rates, windows) in copy; reference the configured values.

## 22.1 Voice and style rules

| Rule | Example |
|---|---|
| Lead with the outcome | "Quote submitted." not "Your quote has been successfully submitted!" |
| Explain consequences before irreversible actions | "Other quotes will be declined. This cannot be undone." |
| Name the next step | "Confirm receipt once the goods arrive." |
| Be precise about time | "Pay by 30 Nov 2026, 14:00 (Dubai time)." |
| Avoid jargon in buyer copy | "Request for quotation" on first use, "request" afterwards; avoid "PSP", "ledger" outside admin |
| No exclamation marks or emojis | — |
| Never call payments "escrow" | Founder decision; say "paid through the platform" / "held until receipt" |
| Sandbox honesty | "Sandbox payments: no real money." |


## 22.2 Strings that must change

| Key | Current English | Issue |
|---|---|---|
| seller.quote.accepted_body | The buyer accepted your quote. Orders and payment open in the next release; nothing has been charged. | Stale: orders and payment exist now |
| finance.reconciliation_note | Late captures, amount mismatches, unknown references and rejected signatures. Resolution tools arrive with refunds. | Stale: resolution tools not built |
| home.next.APPROVED | Verified. Marketplace features will appear here as they are released. | Stale: features exist now |
| pd.trading.phase_unavailable | Request a quotation from this supplier. Direct ordering opens in a later release. | Stale: refers to a release phase |
| ful.no_auto_complete | Orders are completed only when the buyer confirms receipt; nothing completes automatically. | Will change with FD-02 |
| review.verified_buyer | Verified buyer | Founder: "verified business buyer" |
| dispute.window_note | Disputes can be opened until 14 days after receipt is confirmed and never after the supplier is paid out. | Founder F07: window starts at verified delivery, not receipt confirmation (G-14) |
| company.terms_pending_note | Final legal terms are pending legal review. | Until legal terms are approved |


## 22.3 Suggested new copy (not in the app yet)

| Context | Suggested English |
|---|---|
| Buyer dashboard empty | Your company is verified. Search the marketplace or post a request for quotation to get started. |
| Order completion success | Thank you. The order is complete. You can rate the supplier or open a dispute within 14 days. |
| Auto-complete notice (after FD-02) | This order completes automatically on {date} unless you open a dispute. |
| Weekly payout (after FD-04) | Available for the payout on {date}. |
| Upload type error | This file type is not accepted. Upload a PDF, PNG or JPEG up to 10 MB. |
| Forbidden page | You do not have access to this page. If you think this is wrong, ask your company owner. |
| Not found page | We could not find this page. It may have been removed or you may not have access. |
| Error summary | Fix {count} fields to continue. |
| English-only content in Arabic UI | Available in English only. |
| Counteroffer sent (after FD-10) | Counteroffer sent to {company}. |
| Cancellation requested (planned) | Cancellation requested. The supplier and our team will review it. |
| Session expired with return | Your session has ended. Sign in again to continue where you left off. |


## 22.4 Existing copy by category

Each key appears once, in the first matching category. Arabic is the current translation (native-speaker review pending).

### Page titles and headings (88)

| Key | English | Arabic | Note |
|---|---|---|---|
| status.heading | System status | حالة النظام |  |
| common.error_title | Something went wrong | حدث خطأ |  |
| common.forbidden_title | Not available | غير متاح |  |
| auth.register_title | Create your business account | أنشئ حساب شركتك |  |
| auth.check_email_title | Check your email | تحقق من بريدك الإلكتروني |  |
| auth.login_title | Sign in | تسجيل الدخول |  |
| auth.forgot_title | Reset your password | إعادة تعيين كلمة المرور |  |
| auth.reset_title | Choose a new password | اختر كلمة مرور جديدة |  |
| auth.verify_title | Verify your email | تأكيد البريد الإلكتروني |  |
| auth.unverified_title | Verify your email to continue | أكّد بريدك الإلكتروني للمتابعة |  |
| home.title | Welcome, {name} | مرحباً، {name} |  |
| home.no_company_title | Set up your company | أعدّ شركتك |  |
| company.create_title | Register your company | سجّل شركتك |  |
| company.title | Company | الشركة |  |
| company.renewal_title | Renew trade licence | تجديد الرخصة التجارية |  |
| team.title | Team | الفريق |  |
| team.invite_title | Invite a team member | دعوة عضو |  |
| invite.title | Team invitation | دعوة للفريق |  |
| settings.title | Account settings | إعدادات الحساب |  |
| admin.login_title | Admin sign in | دخول الإدارة |  |
| admin.mfa_enroll_title | Set up two-factor authentication | إعداد المصادقة الثنائية |  |
| admin.mfa_verify_title | Two-factor authentication | المصادقة الثنائية |  |
| admin.recovery_title | Save your recovery codes | احفظ رموز الاسترداد |  |
| admin.overview_title | Overview | نظرة عامة |  |
| admin.queue_title | Verification queue | قائمة التحقق |  |
| admin.case_title | Verification case | حالة تحقق |  |
| admin.companies_title | Companies | الشركات |  |
| admin.users_title | Users | المستخدمون |  |
| admin.audit_title | Audit log | سجل التدقيق |  |
| admin.staff_title | Staff | الموظفون |  |
| mkt.hero_title | Source wholesale from verified UAE suppliers | اشترِ بالجملة من موردين موثقين في الإمارات |  |
| lists.prefs_title | Marketplace preferences | تفضيلات السوق |  |
| seller.dashboard | Seller dashboard | لوحة البائع |  |
| seller.title | Seller centre | مركز البائع |  |
| seller.new_title | Add a product | إضافة منتج |  |
| seller.inventory_title | Inventory | المخزون |  |
| seller.pricing_title | Pricing overview | نظرة عامة على الأسعار |  |
| seller.storefront_title | Storefront | واجهة المتجر |  |
| acat.title | Catalog moderation | مراجعة الكتالوج |  |
| acat.review_title | Review listing | مراجعة الإدراج |  |
| acat.listings_title | All listings | جميع الإدراجات |  |
| acat.storefronts_title | Storefronts | واجهات المتاجر |  |
| acat.categories_title | Categories | الفئات |  |
| acat.restricted_title | Restricted and prohibited terms | الكلمات المقيدة والمحظورة |  |
| acat.featured_title | Featured placements | المواضع المميزة |  |
| checkout.title | Checkout | إتمام الشراء |  |
| checkout.number_title | Checkout {number} | عملية الشراء {number} |  |
| checkout.paid_title | Payment confirmed | تم تأكيد الدفع |  |
| checkout.awaiting_confirmation_title | Waiting for payment confirmation | بانتظار تأكيد الدفع |  |
| checkout.pay_by_title | Payment due | الدفع مستحق |  |
| payment.sandbox_title | Sandbox payments: no real money | مدفوعات تجريبية: لا أموال حقيقية |  |
| sandbox.title | Sandbox payment page | صفحة الدفع التجريبية |  |
| order.number_title | Order {number} | الطلب {number} |  |
| delivery.title | Delivery terms | شروط التوصيل |  |
| ful.title | Fulfilment | التنفيذ |  |
| ful.dispatch_title | Record dispatch | تسجيل الشحن |  |
| ful.deliver_title | Report delivery | الإبلاغ عن التسليم |  |
| ful.confirm_receipt_title | Confirm you received this order? | هل تؤكد استلام هذا الطلب؟ |  |
| review.title | Rate this supplier | قيّم هذا المورد |  |
| review.hide_title | Hide this review? | هل تريد إخفاء هذا التقييم؟ |  |
| review.unhide_title | Publish this review again? | هل تريد إعادة نشر هذا التقييم؟ |  |
| dispute.open_title | Open a dispute | فتح نزاع |  |
| dispute.number_title | Dispute {number} | النزاع {number} |  |
| dispute.close_title | Close with no financial action | إغلاق دون إجراء مالي |  |
| refund.approve_title | Approve refund {number}? | هل توافق على الاسترداد {number}؟ |  |
| refund.reject_title | Reject refund {number}? | هل ترفض الاسترداد {number}؟ |  |
| payout.request_title | Request a payout to {company}? | هل تطلب تحويلاً إلى {company}؟ |  |
| payout.approve_title | Approve payout {number}? | هل توافق على التحويل {number}؟ |  |
| payout.reject_title | Reject payout {number}? | هل ترفض التحويل {number}؟ |  |
| sfin.title | Finance | المالية |  |
| support.title | Support | الدعم |  |
| support.new_title | Open a support ticket | فتح تذكرة دعم |  |
| support.number_title | Ticket {number} | التذكرة {number} |  |
| support.close_title | Close this ticket? | إغلاق هذه التذكرة؟ |  |
| ops.title | Operations | العمليات |  |
| export.title | Reports | التقارير |  |
| export.list_title | Your exports | تصديراتك |  |
| buyer.title | Buying | الشراء |  |
| rfq.title | Title | العنوان |  |
| rfq.need_buyer_title | A buyer workspace is needed | يلزم وجود مساحة عمل للمشتري |  |
| rfq.publish_title | Publish this request? | نشر هذا الطلب؟ |  |
| rfq.cancel_title | Cancel this request? | إلغاء هذا الطلب؟ |  |
| rfq.awarded_title | Quote accepted | تم قبول العرض |  |
| quote.accept_title | Accept this quote? | قبول هذا العرض؟ |  |
| seller.rfq.ask_title | Ask the buyer a question | اسأل المشتري |  |
| seller.quote.title | Your quote | عرضك |  |
| seller.quote.submit_title | Submit this quote? | تقديم هذا العرض؟ |  |
| seller.quote.withdraw_title | Withdraw this quote? | سحب هذا العرض؟ |  |


### Navigation labels (55)

| Key | English | Arabic | Note |
|---|---|---|---|
| nav.home | Home | الرئيسية |  |
| nav.company | Company | الشركة |  |
| nav.team | Team | الفريق |  |
| nav.settings | Settings | الإعدادات |  |
| nav.sign_out | Sign out | تسجيل الخروج |  |
| nav.sign_in | Sign in | تسجيل الدخول |  |
| nav.register | Create account | إنشاء حساب |  |
| nav.workspace | Workspace | مساحة العمل |  |
| nav.main | Main navigation | التنقل الرئيسي |  |
| nav.account_menu | Account | الحساب |  |
| admin.nav.overview | Overview | نظرة عامة |  |
| admin.nav.verification | Verification | التحقق |  |
| admin.nav.companies | Companies | الشركات |  |
| admin.nav.users | Users | المستخدمون |  |
| admin.nav.audit | Audit log | سجل التدقيق |  |
| admin.nav.staff | Staff | الموظفون |  |
| seller.nav.overview | Overview | نظرة عامة |  |
| seller.nav.storefront | Storefront | واجهة المتجر |  |
| seller.nav.products | Products | المنتجات |  |
| seller.nav.add_product | Add product | إضافة منتج |  |
| seller.nav.inventory | Inventory | المخزون |  |
| seller.nav.pricing | Pricing | الأسعار |  |
| seller.nav.company | Company settings | إعدادات الشركة |  |
| seller.nav.orders | Orders | الطلبات |  |
| seller.nav.rfqs | Quotation requests | طلبات عروض الأسعار |  |
| seller.nav.messages | Messages | الرسائل |  |
| seller.nav.finance | Finance | المالية |  |
| admin.nav.catalog | Catalog | الكتالوج |  |
| admin.nav.listings | Listings | الإدراجات |  |
| admin.nav.storefronts | Storefronts | واجهات المتاجر |  |
| admin.nav.categories | Categories | الفئات |  |
| admin.nav.restricted | Restricted terms | الكلمات المحظورة |  |
| admin.nav.featured | Featured | المميزة |  |
| buyer.nav.addresses | Addresses | العناوين |  |
| admin.nav.orders | Orders | الطلبات |  |
| admin.nav.finance | Payments and ledger | المدفوعات والدفتر |  |
| buyer.nav.disputes | Disputes | النزاعات |  |
| seller.nav.disputes | Disputes | النزاعات |  |
| admin.nav.disputes | Disputes | النزاعات |  |
| admin.nav.refunds | Refunds | المبالغ المستردة |  |
| admin.nav.payouts | Payouts | التحويلات للموردين |  |
| admin.nav.supplier_reviews | Supplier reviews | تقييمات الموردين |  |
| buyer.nav.support | Support | الدعم |  |
| seller.nav.support | Support | الدعم |  |
| admin.nav.support | Support queue | قائمة الدعم |  |
| admin.nav.reports | Reports | التقارير |  |
| buyer.nav.rfqs | Requests for quotation | طلبات عروض الأسعار |  |
| buyer.nav.new_rfq | New request | طلب جديد |  |
| buyer.nav.cart | Cart | السلة |  |
| buyer.nav.orders | Orders | الطلبات |  |
| seller.nav.quotes | Quotes | عروض الأسعار |  |
| nav.messages | Messages | الرسائل |  |
| nav.notifications | Notifications | الإشعارات |  |
| nav.unread | {count} unread | {count} غير مقروءة |  |
| admin.nav.rfqs | Requests for quotation | طلبات عروض الأسعار |  |


### Button labels (96)

| Key | English | Arabic | Note |
|---|---|---|---|
| status.retry | Retry | إعادة المحاولة |  |
| common.retry | Retry | إعادة المحاولة |  |
| common.save | Save | حفظ |  |
| common.cancel | Cancel | إلغاء |  |
| common.close | Close | إغلاق |  |
| common.download | Download | تنزيل |  |
| common.remove | Remove | إزالة |  |
| auth.continue | Continue | متابعة |  |
| company.upload | Upload document | رفع المستند |  |
| company.submit | Submit for verification | إرسال للتحقق |  |
| invite.accept | Accept invitation | قبول الدعوة |  |
| mkt.apply | Apply | تطبيق |  |
| pd.save | Save | حفظ |  |
| pd.trading.sign_in | Sign in to request quotations or order. | سجّل الدخول لطلب عروض الأسعار أو الشراء. |  |
| sup.save | Save supplier | حفظ المورد |  |
| lists.remove | Remove | إزالة |  |
| seller.create | Create draft | إنشاء مسودة |  |
| seller.save_draft | Save draft | حفظ المسودة |  |
| seller.submit | Submit for review | إرسال للمراجعة |  |
| seller.withdraw | Withdraw submission | سحب الطلب |  |
| seller.archive | Archive | أرشفة |  |
| seller.unpublish | Unpublish | إلغاء النشر |  |
| seller.publish | Publish storefront | نشر واجهة المتجر |  |
| acat.update | Update to live listing | تحديث لإدراج منشور |  |
| acat.approve | Approve | اعتماد |  |
| acat.reject | Reject | رفض |  |
| acat.remove | Remove | إزالة |  |
| acat.hide | Hide | إخفاء |  |
| seller.confirm.submit | Send this listing to the marketplace team for review? You cannot edit it while it is in review. | إرسال هذا المنتج إلى فريق السوق للمراجعة؟ لا يمكنك تعديله أثناء المراجعة. |  |
| seller.confirm.withdraw | Withdraw this listing from review? It returns to draft. | سحب هذا المنتج من المراجعة؟ سيعود إلى المسودة. |  |
| seller.confirm.archive | Archive this listing? It will no longer be visible to buyers. | أرشفة هذا المنتج؟ لن يظهر للمشترين بعد ذلك. |  |
| seller.confirm.unpublish | Unpublish this listing? Buyers will no longer see it until you republish. | إلغاء نشر هذا المنتج؟ لن يراه المشترون حتى تعيد نشره. |  |
| address.add | Add an address | إضافة عنوان |  |
| address.make_default | Make default | اجعله الافتراضي |  |
| address.remove | Remove address | إزالة العنوان |  |
| address.save | Save address | حفظ العنوان |  |
| cart.browse | Browse products | تصفح المنتجات |  |
| cart.update | Update | تحديث |  |
| cart.remove | Remove | إزالة |  |
| cart.proceed | Continue to checkout | متابعة إلى إتمام الشراء |  |
| checkout.place_and_pay | Place order and pay | تأكيد الطلب والدفع |  |
| checkout.review_cart | Review cart | مراجعة السلة |  |
| checkout.pay_now | Pay now | ادفع الآن |  |
| checkout.resume_payment | Return to payment page | العودة إلى صفحة الدفع |  |
| checkout.cancel | Cancel checkout | إلغاء عملية الشراء |  |
| delivery.save | Save delivery terms | حفظ شروط التوصيل |  |
| ful.process | Start processing | بدء التجهيز |  |
| ful.dispatch | Record dispatch | تسجيل الشحن |  |
| ful.deliver | Report delivery | الإبلاغ عن التسليم |  |
| ful.confirm_receipt | Confirm receipt | تأكيد الاستلام |  |
| review.submit | Submit review | إرسال التقييم |  |
| review.hide | Hide | إخفاء |  |
| review.unhide | Publish again | إعادة النشر |  |
| dispute.open | Open a dispute | فتح نزاع |  |
| dispute.send | Send | إرسال |  |
| dispute.assign | Assign to me | إسناده إليّ |  |
| dispute.request_evidence | Request evidence | طلب أدلة |  |
| dispute.propose | Propose resolution | اقتراح حل |  |
| dispute.close | Close dispute | إغلاق النزاع |  |
| refund.create | Request a refund | طلب استرداد |  |
| refund.approve | Approve | موافقة |  |
| refund.reject | Reject | رفض |  |
| payout.request | Request payout | طلب تحويل |  |
| support.new | New ticket | تذكرة جديدة |  |
| support.submit | Open ticket | فتح التذكرة |  |
| support.reply | Reply | الرد |  |
| support.send | Send reply | إرسال الرد |  |
| support.assign | Take ticket | استلام التذكرة |  |
| support.resolve | Mark resolved | تحديد كمحلولة |  |
| support.reopen | Reopen | إعادة الفتح |  |
| support.close | Close ticket | إغلاق التذكرة |  |
| ops.apply | Show | عرض |  |
| export.new | New export | تصدير جديد |  |
| export.create | Create export | إنشاء التصدير |  |
| export.download | Download CSV | تنزيل CSV |  |
| rfq.request | Request | الطلب |  |
| rfq.upload | Upload | رفع |  |
| rfq.save_draft | Save draft | حفظ المسودة |  |
| rfq.edit_draft | Edit draft | تعديل المسودة |  |
| rfq.publish | Publish | نشر |  |
| rfq.cancel | Cancel request | إلغاء الطلب |  |
| quote.accept | Accept | قبول |  |
| quote.accept_confirm | Accept quote | قبول العرض |  |
| quote.request_revision | Request revision | طلب تعديل |  |
| quote.decline | Decline | رفض |  |
| seller.quote.save_draft | Save draft | حفظ المسودة |  |
| seller.quote.submit | Submit quote | تقديم العرض |  |
| seller.quote.revise | Revise | تعديل |  |
| seller.quote.submit_revision | Submit revision | تقديم التعديل |  |
| seller.quote.withdraw | Withdraw | سحب |  |
| messages.send | Send | إرسال |  |
| notif.mark_all_read | Mark all as read | تعليم الكل كمقروء |  |
| notif.mark_read | Mark as read | تعليم كمقروء |  |
| notif.type.message.new | New message from {company} | رسالة جديدة من {company} |  |
| admin.rfq.hide | Hide request | إخفاء الطلب |  |
| admin.rfq.unhide | Restore request | استعادة الطلب |  |


### Form labels (72)

| Key | English | Arabic | Note |
|---|---|---|---|
| auth.full_name | Full name | الاسم الكامل |  |
| auth.email | Work email | بريد العمل |  |
| auth.password | Password | كلمة المرور |  |
| auth.password_hint | At least 12 characters. A passphrase of several words works well. | 12 حرفاً على الأقل. عبارة من عدة كلمات خيار جيد. |  |
| auth.check_email_body | If this address can be registered, we have sent a verification link to it. The link expires in 24 hours. | إذا كان بالإمكان تسجيل هذا العنوان، فقد أرسلنا إليه رابط تأكيد. تنتهي صلاحية الرابط خلال 24 ساعة. |  |
| auth.new_password | New password | كلمة المرور الجديدة |  |
| company.legal_name | Legal name | الاسم القانوني |  |
| company.display_name | Display name | الاسم المعروض |  |
| company.licence_number | Trade licence number | رقم الرخصة التجارية |  |
| company.licence_issuer | Licence issuing authority | جهة إصدار الرخصة |  |
| company.licence_expiry | Licence expiry date | تاريخ انتهاء الرخصة |  |
| company.activity | Licensed activity | النشاط المرخّص |  |
| company.trn | Tax registration number (TRN) | رقم التسجيل الضريبي |  |
| company.trn_hint | 15 digits, if registered. | 15 رقماً، إن وُجد. |  |
| company.licence_expired | Licence expired | الرخصة منتهية |  |
| company.document_expiry | Document expiry date | تاريخ انتهاء المستند |  |
| address.label | Label (for example Main warehouse) | التسمية (مثل المستودع الرئيسي) |  |
| address.recipient | Recipient | المستلم |  |
| address.phone | Phone | الهاتف |  |
| address.line1 | Address line 1 | سطر العنوان 1 |  |
| address.line2 | Address line 2 | سطر العنوان 2 |  |
| address.city | City | المدينة |  |
| address.emirate | Emirate | الإمارة |  |
| delivery.fee_aed | Delivery fee per order (AED) | رسوم التوصيل لكل طلب (درهم) |  |
| delivery.days | Typical delivery time (days) | مدة التوصيل المعتادة (أيام) |  |
| delivery.emirates | Emirates you deliver to | الإمارات التي توصل إليها |  |
| ful.carrier | Carrier | شركة الشحن |  |
| ful.tracking | Tracking reference | رقم التتبع |  |
| ful.expected | Expected delivery | التسليم المتوقع |  |
| ful.delivery_note | Delivery note | ملاحظة التسليم |  |
| ful.proof_file | Proof of delivery (PDF, PNG or JPEG) | إثبات التسليم (PDF أو PNG أو JPEG) |  |
| review.rating | Rating | التقييم |  |
| review.comment | Comment | تعليق |  |
| dispute.type | Problem | المشكلة |  |
| dispute.reason | What happened? | ماذا حدث؟ |  |
| dispute.message | Message | الرسالة |  |
| dispute.evidence_file | Evidence (PDF, PNG or JPEG) | دليل (PDF أو PNG أو JPEG) |  |
| refund.order_id | Order ID | معرّف الطلب |  |
| refund.amount | Amount (AED) | المبلغ (درهم) |  |
| refund.reason | Reason | السبب |  |
| refund.dispute_id | Dispute ID (if the refund resolves a dispute) | معرّف النزاع (إذا كان الاسترداد يحل نزاعاً) |  |
| support.category | Topic | الموضوع |  |
| support.subject | Subject | العنوان |  |
| support.body | How can we help? | كيف يمكننا المساعدة؟ |  |
| support.linked_order | Linked order | الطلب المرتبط |  |
| support.linked_rfq | Linked request | طلب عرض السعر المرتبط |  |
| export.report_type | Report | التقرير |  |
| export.scope | Scope | النطاق |  |
| export.from | From (Dubai date) | من (تاريخ دبي) |  |
| export.to | To (Dubai date) | إلى (تاريخ دبي) |  |
| export.reason | Reason | السبب |  |
| export.totp | Authenticator code | رمز المصادقة |  |
| rfq.category | Category | الفئة |  |
| rfq.quantity | Quantity | الكمية |  |
| rfq.unit | Unit | الوحدة |  |
| rfq.delivery_emirate | Delivery emirate | إمارة التسليم |  |
| rfq.target_date | Needed by | مطلوب بحلول |  |
| rfq.deadline_dubai | Quote deadline (Dubai time) | آخر موعد للعروض (بتوقيت دبي) |  |
| rfq.visibility | Who can quote | من يمكنه تقديم عرض |  |
| rfq.budget_aed | Budget (AED) | الميزانية (درهم) |  |
| rfq.specs | Specifications | المواصفات |  |
| rfq.attachments | Attachments | المرفقات |  |
| quote.unit_price_aed | Unit price (AED, before tax) | سعر الوحدة (درهم، قبل الضريبة) |  |
| quote.shipping_aed | Shipping (AED, before tax) | الشحن (درهم، قبل الضريبة) |  |
| quote.tax_code | Tax treatment | المعاملة الضريبية |  |
| quote.lead_days | Lead time (days) | مدة التوريد (أيام) |  |
| quote.delivery_date | Delivery date | تاريخ التسليم |  |
| quote.valid_until_dubai | Valid until (Dubai time) | صالح حتى (بتوقيت دبي) |  |
| quote.specs | What is offered | المعروض |  |
| quote.deviations | Differences from the request | الاختلافات عن الطلب |  |
| quote.terms | Terms | الشروط |  |
| quote.po_reference | Your PO reference | مرجع أمر الشراء لديك |  |


### Placeholder and hint text (27)

| Key | English | Arabic | Note |
|---|---|---|---|
| company.phone_hint | International format, for example +971 50 123 4567. | بالصيغة الدولية، مثل ‎+971 50 123 4567. |  |
| company.kind_buyer_hint | Buy wholesale stock and request quotes. | شراء البضائع بالجملة وطلب عروض الأسعار. |  |
| company.kind_seller_hint | Sell as a supplier or manufacturer. | البيع كمورد أو مصنّع. |  |
| admin.decision_reason_hint | Required for rejection or information requests. The company sees this message. | مطلوب عند الرفض أو طلب المعلومات. ستطّلع الشركة على هذه الرسالة. |  |
| admin.reason_hint | Required. Recorded in the audit log and sent to the company owners. | مطلوب. يُسجَّل في سجل التدقيق ويُرسل إلى مالكي الشركة. |  |
| mkt.search_placeholder | Search products and suppliers | ابحث عن المنتجات والموردين |  |
| seller.first_sku_hint | Your internal code, unique in your workspace (letters, digits, . _ -). | رمزك الداخلي، فريد في مساحة عملك (حروف وأرقام و . _ -). |  |
| seller.content_hint | Changes to content are reviewed. While a change is reviewed, the approved version stays live. | تخضع تغييرات المحتوى للمراجعة. تبقى النسخة المعتمدة منشورة أثناء المراجعة. |  |
| seller.media_hint | PNG, JPEG or WebP, at least 200 × 200 px, up to 12 images. Images are scanned and re-encoded; metadata is removed. | PNG أو JPEG أو WebP، بحد أدنى 200 × 200 بكسل، حتى 12 صورة. تُفحص الصور ويعاد ترميزها وتُحذف بياناتها الوصفية. |  |
| seller.pricing_hint | Prices, MOQ and increments change immediately without review and are recorded in the audit log. Amounts are AED excluding VAT. | تتغير الأسعار والحد الأدنى والمضاعفات فوراً دون مراجعة وتُسجل في سجل التدقيق. المبالغ بالدرهم دون ضريبة القيمة المضافة. |  |
| seller.storefront_hint | Your storefront is public once published and your company is verified with a valid licence. Contact details and documents are never shown. | تصبح واجهتك عامة بعد نشرها وتوثيق شركتك برخصة سارية. لا تُعرض بيانات الاتصال والمستندات أبداً. |  |
| seller.variant_hint | For example: colour=white, size=30 cm | مثال: colour=white, size=30 cm |  |
| checkout.quote_address_hint | Must be in the emirate the supplier quoted for. | يجب أن يكون في الإمارة التي قدّم المورد عرضه لها. |  |
| delivery.hint | Buyers can order from your catalogue only to the emirates you serve. One flat fee is charged per order. | يمكن للمشترين الطلب من كتالوجك فقط إلى الإمارات التي تخدمها. تُفرض رسوم ثابتة واحدة لكل طلب. |  |
| dispute.refund_hint | Finance creates the refund from the Refunds page; the dispute closes when the provider confirms it. | تنشئ المالية الاسترداد من صفحة المبالغ المستردة؛ ويُغلق النزاع عند تأكيد مزود الدفع. |  |
| dispute.amount_hint | Amount in AED, for example 125.50 | المبلغ بالدرهم، مثلاً 125.50 |  |
| support.body_hint | Do not include passwords or card details. | لا تكتب كلمات المرور أو بيانات البطاقات. |  |
| settings.marketing_hint | Marketing email is off unless you turn it on. Order, payment, dispute, support and security notices always appear in the app. | رسائل التسويق متوقفة ما لم تفعّلها. تظهر دائماً داخل التطبيق إشعارات الطلبات والمدفوعات والنزاعات والدعم والأمان. |  |
| export.scope_hint | Finance reports cover all records. Support may export only disputes and tickets assigned to them. | تشمل التقارير المالية جميع السجلات. يمكن لفريق الدعم تصدير النزاعات والتذاكر المُسندة إليه فقط. |  |
| export.totp_hint | The 6-digit code from your authenticator app. | الرمز المكوّن من 6 أرقام من تطبيق المصادقة. |  |
| rfq.budget_hint | Optional. Shared with suppliers who can see this request. | اختياري. تظهر للموردين الذين يمكنهم رؤية هذا الطلب. |  |
| rfq.specs_hint | Describe the goods, standards, packaging and delivery terms you need. | صف البضائع والمعايير والتغليف وشروط التسليم المطلوبة. |  |
| rfq.attachment_hint | PDF, PNG or JPEG up to 10 MB. Files are scanned for malware before anyone can open them. | PDF أو PNG أو JPEG حتى 10 ميغابايت. تُفحص الملفات من البرمجيات الخبيثة قبل أن يفتحها أحد. |  |
| quote.tax_hint | Tax is calculated by the platform on subtotal plus shipping. | تحسب المنصة الضريبة على المجموع الفرعي مضافاً إليه الشحن. |  |
| quote.deviations_hint | Describe anything that differs from the buyer’s specifications. | صف أي اختلاف عن مواصفات المشتري. |  |
| seller.rfq.ask_hint | Only the buyer sees this conversation. | لا يرى هذه المحادثة إلا المشتري. |  |
| settings.email_prefs_hint | In-app notifications are always kept. Security emails are always sent. | تبقى الإشعارات داخل التطبيق دائماً، وتُرسل رسائل الأمان دائماً. |  |


### Onboarding and instructions (18)

| Key | English | Arabic | Note |
|---|---|---|---|
| home.next_step | Next step | الخطوة التالية |  |
| home.next.DRAFT | Complete your company details, upload documents and submit for verification. | أكمل بيانات الشركة وارفع المستندات وأرسلها للتحقق. |  |
| home.next.SUBMITTED | Submitted. Compliance will review your documents. | تم الإرسال. سيراجع فريق الامتثال مستنداتك. |  |
| home.next.UNDER_REVIEW | Compliance is reviewing your documents. | يراجع فريق الامتثال مستنداتك. |  |
| home.next.NEEDS_INFO | Compliance asked for more information. Review the reason and resubmit. | طلب فريق الامتثال معلومات إضافية. راجع السبب وأعد الإرسال. |  |
| home.next.REJECTED | Verification was rejected. Review the reason, fix the documents and resubmit. | تم رفض التحقق. راجع السبب وصحّح المستندات وأعد الإرسال. |  |
| home.next.APPROVED | Verified. Marketplace features will appear here as they are released. | تم التحقق. ستظهر ميزات السوق هنا عند إطلاقها. | Stale: features exist now |
| home.next.SUSPENDED | Trading is restricted. Existing records remain available. See the company page. | التداول مقيّد. تبقى السجلات الحالية متاحة. راجع صفحة الشركة. |  |
| address.intro | Delivery addresses in the UAE for this buying workspace. | عناوين التسليم داخل الإمارات لمساحة الشراء هذه. |  |
| order.seller_intro | Orders appear when a buyer checks out or accepts your quotation. Open a paid order to record dispatch and delivery. | تظهر الطلبات عندما يتم المشتري الشراء أو يقبل عرض السعر الخاص بك. افتح طلباً مدفوعاً لتسجيل الشحن والتسليم. |  |
| refund.intro | Refunds go through the payment provider. A second finance user approves each request; the ledger changes only when the provider confirms. | تتم المبالغ المستردة عبر مزود الدفع. يوافق مستخدم مالية ثانٍ على كل طلب، ولا يتغير الدفتر إلا عند تأكيد المزود. |  |
| payout.intro | Payouts move eligible, undisputed, completed orders to suppliers through the payment provider. A second finance user approves each request; orders are marked paid only on the provider confirmation. | تحوّل التحويلات مبالغ الطلبات المكتملة المؤهلة غير المتنازع عليها إلى الموردين عبر مزود الدفع. يوافق مستخدم مالية ثانٍ على كل طلب، ولا تُعلَّم الطلبات مدفوعة إلا عند تأكيد المزود. |  |
| sfin.intro | Amounts for paid orders of this workspace. Payouts are made by the platform through the payment provider. | مبالغ الطلبات المدفوعة لمساحة العمل هذه. تتم التحويلات من المنصة عبر مزود الدفع. |  |
| support.intro | Ask the platform team for help with your account, verification, orders, payments or listings. Everyone in this workspace can follow its tickets. | اطلب المساعدة من فريق المنصة بشأن حسابك أو التحقق أو الطلبات أو المدفوعات أو المنتجات. يمكن لجميع أعضاء مساحة العمل متابعة تذاكرها. |  |
| export.intro | Download CSV reports. Each export needs a reason and a current authenticator code, is recorded in the audit log and can be downloaded only by you for 24 hours. | نزّل تقارير CSV. يتطلب كل تصدير سبباً ورمزاً حالياً من تطبيق المصادقة، ويُسجَّل في سجل التدقيق، ولا يمكن تنزيله إلا من قِبلك خلال 24 ساعة. |  |
| rfq.new_intro | Describe what you need. The request stays a draft until you publish it; suppliers see it only after publishing. | صف ما تحتاجه. يبقى الطلب مسودة حتى تنشره، ولا يراه الموردون إلا بعد النشر. |  |
| seller.rfq.intro | Requests you were invited to and open requests in categories where you have public listings. | الطلبات التي دُعيت إليها والطلبات المفتوحة في الفئات التي لديك فيها منتجات منشورة. |  |
| seller.quote.intro | Prepare a draft. The buyer sees it only after you submit. | جهّز مسودة. لا يراها المشتري إلا بعد تقديمها. |  |


### Success messages (37)

| Key | English | Arabic | Note |
|---|---|---|---|
| company.uploaded | Document uploaded and scanned clean. | تم رفع المستند وفحصه وهو سليم. |  |
| common.created | Created | تاريخ الإنشاء |  |
| common.saved | Saved. | تم الحفظ. |  |
| auth.resent | If the address needs verification, a new link is on its way. | إذا كان العنوان بحاجة إلى تأكيد، فسيصلك رابط جديد. |  |
| auth.forgot_sent | If the email matches an account, a reset link has been sent. It expires in 1 hour. | إذا كان البريد مطابقاً لحساب، فقد أُرسل رابط إعادة التعيين. تنتهي صلاحيته خلال ساعة. |  |
| auth.reset_done | Your password was changed and all sessions were signed out. You can sign in now. | تم تغيير كلمة المرور وتسجيل الخروج من جميع الجلسات. يمكنك تسجيل الدخول الآن. |  |
| company.submitted_ok | Submitted for verification. | تم الإرسال للتحقق. |  |
| invite.accepted | You joined the workspace. | انضممت إلى مساحة العمل. |  |
| admin.recovery_saved | I have saved these codes | حفظت هذه الرموز |  |
| admin.kpi.submitted | Awaiting review | بانتظار المراجعة |  |
| admin.sessions_revoked | Sessions revoked: {count}. | تم إلغاء الجلسات: {count}. |  |
| mkt.saved | Saved | المحفوظات |  |
| pd.saved | Saved | محفوظ |  |
| sup.saved | Supplier saved | تم حفظ المورد |  |
| lists.empty_saved | Nothing saved yet. Use “Save” on a product or supplier. | لا توجد عناصر محفوظة بعد. استخدم «حفظ» في صفحة منتج أو مورد. |  |
| lists.prefs_saved | Preferences saved. | تم حفظ التفضيلات. |  |
| seller.tab.published | Published | المنشورة |  |
| seller.saved | Saved. | تم الحفظ. |  |
| address.saved | Address saved. | تم حفظ العنوان. |  |
| order.created | Created | تاريخ الإنشاء |  |
| ful.saved | Saved. | تم الحفظ. |  |
| dispute.sent | Message sent. | تم إرسال الرسالة. |  |
| refund.created | Refund requested. Another finance user must approve it. | تم طلب الاسترداد. يجب أن يوافق عليه مستخدم مالية آخر. |  |
| support.sent | Reply sent. | تم إرسال الرد. |  |
| export.created | Export ready. Download it below. | التصدير جاهز. نزّله أدناه. |  |
| rfq.created | Draft saved. Review it and publish when ready. | تم حفظ المسودة. راجعها وانشرها عندما تكون جاهزة. |  |
| rfq.saved | Changes saved. | تم حفظ التغييرات. |  |
| rfq.published | Request published. | تم نشر الطلب. |  |
| rfq.cancelled | Request cancelled. | تم إلغاء الطلب. |  |
| quote.revision_sent | Revision requested. | تم طلب التعديل. |  |
| quote.declined | Quote declined. | تم رفض العرض. |  |
| seller.quote.draft_saved | Draft saved. | تم حفظ المسودة. |  |
| seller.quote.submitted | Quote submitted. | تم تقديم العرض. |  |
| seller.quote.revised | Revision submitted. | تم تقديم التعديل. |  |
| seller.quote.withdrawn | Quote withdrawn. | تم سحب العرض. |  |
| seller.quote.file_added | Attachment added. | تمت إضافة المرفق. |  |
| seller.quote.file_removed | Attachment removed. | تمت إزالة المرفق. |  |


### Empty states (53)

| Key | English | Arabic | Note |
|---|---|---|---|
| common.none | None | لا يوجد |  |
| common.empty | Nothing here yet. | لا يوجد شيء بعد. |  |
| auth.no_account | New here? | جديد هنا؟ |  |
| home.no_company_body | Register your company to request buyer and/or seller access. Trading is enabled after compliance approves your trade licence and documents. | سجّل شركتك لطلب صلاحية المشتري و/أو البائع. يُفعَّل التداول بعد موافقة فريق الامتثال على الرخصة التجارية والمستندات. |  |
| company.no_documents | No documents uploaded yet. | لم تُرفع أي مستندات بعد. |  |
| team.no_invitations | No invitations. | لا توجد دعوات. |  |
| admin.queue_empty | No cases in this state. | لا توجد حالات بهذه الحالة. |  |
| mkt.empty_catalogue | No approved products yet. Verified suppliers are adding their catalogues. | لا توجد منتجات معتمدة بعد. يضيف الموردون الموثقون كتالوجاتهم. |  |
| mkt.no_results | No products match these filters. | لا توجد منتجات مطابقة لهذه المرشحات. |  |
| sup.empty | No suppliers match these filters. | لا يوجد موردون مطابقون لهذه المرشحات. |  |
| lists.empty_compare | Add up to 4 products to compare them side by side. | أضف حتى 4 منتجات لمقارنتها جنباً إلى جنب. |  |
| lists.empty_recent | Products you view appear here. | تظهر هنا المنتجات التي تشاهدها. |  |
| seller.no_decisions | No decisions yet. | لا توجد قرارات بعد. |  |
| seller.products_empty | No products in this tab. | لا توجد منتجات في هذا التبويب. |  |
| seller.inventory_empty | No variants yet. | لا توجد أصناف بعد. |  |
| acat.queue_empty | Nothing to review. | لا يوجد ما يُراجع. |  |
| acat.no_live | Not published before. | لم يُنشر سابقاً. |  |
| acat.no_edit_note | Admins cannot change a seller’s content, prices, stock or commitments. | لا يمكن للمسؤولين تغيير محتوى البائع أو أسعاره أو مخزونه أو التزاماته. |  |
| address.empty | No addresses yet. Add one to check out. | لا توجد عناوين بعد. أضف عنواناً لإتمام الشراء. |  |
| cart.empty | Your cart is empty. | سلتك فارغة. |  |
| checkout.no_address | No delivery address yet. | لا يوجد عنوان تسليم بعد. |  |
| checkout.issue.no_delivery_terms | This supplier has not set delivery terms yet. | لم يحدد هذا المورد شروط التوصيل بعد. |  |
| checkout.no_payments | No payment started yet. | لم تبدأ أي عملية دفع بعد. |  |
| order.empty_buyer | No orders yet. Orders appear here after checkout or an accepted quotation. | لا توجد طلبات بعد. تظهر الطلبات هنا بعد إتمام الشراء أو قبول عرض سعر. |  |
| order.empty_seller | No orders yet. | لا توجد طلبات بعد. |  |
| order.empty_admin | No orders match. | لا توجد طلبات مطابقة. |  |
| finance.no_payments | No payments yet. | لا توجد مدفوعات بعد. |  |
| finance.no_cases | No open cases. | لا توجد حالات مفتوحة. |  |
| ful.no_shipment | Not dispatched yet. | لم يتم الشحن بعد. |  |
| ful.no_auto_complete | Orders are completed only when the buyer confirms receipt; nothing completes automatically. | لا يكتمل الطلب إلا عندما يؤكد المشتري الاستلام؛ لا يكتمل أي طلب تلقائياً. | Will change with FD-02 |
| review.none | No reviews yet. | لا توجد تقييمات بعد. |  |
| review.empty_admin | No reviews yet. | لا توجد تقييمات بعد. |  |
| dispute.empty | No disputes. | لا توجد نزاعات. |  |
| dispute.no_messages | No messages yet. | لا توجد رسائل بعد. |  |
| refund.empty | No refunds. | لا توجد مبالغ مستردة. |  |
| payout.eligible_empty | No supplier has eligible orders. | لا يوجد مورد لديه طلبات مؤهلة. |  |
| payout.empty | No payouts. | لا توجد تحويلات. |  |
| sfin.no_payouts | No payouts yet. | لا توجد تحويلات بعد. |  |
| support.empty | No tickets yet. | لا توجد تذاكر بعد. |  |
| ops.no_finance | Commerce figures are shown to finance roles only. | تظهر الأرقام التجارية لأدوار المالية فقط. |  |
| export.empty | You have not exported anything yet. | لم تقم بأي تصدير بعد. |  |
| rfq.no_budget | Not stated | غير محددة |  |
| rfq.no_quotes | No quotes yet. | لا توجد عروض بعد. |  |
| rfq.empty_buyer | You have no requests for quotation yet. | لا توجد لديك طلبات عروض أسعار بعد. |  |
| rfq.no_candidates | No eligible suppliers match. | لا يوجد موردون مؤهلون مطابقون. |  |
| rfq.no_invitees | No suppliers invited. | لم تتم دعوة موردين. |  |
| seller.rfq.empty | No requests here yet. | لا توجد طلبات هنا بعد. |  |
| seller.quote.none | You have not quoted on this request. | لم تقدّم عرضاً على هذا الطلب. |  |
| seller.quote.empty | You have not quoted yet. | لم تقدّم أي عرض بعد. |  |
| messages.no_messages | No messages yet. | لا توجد رسائل بعد. |  |
| messages.empty_buyer | No conversations yet. Message a supplier from their storefront or a quote. | لا توجد محادثات بعد. راسل مورداً من صفحته أو من عرضه. |  |
| messages.empty_seller | No conversations yet. Buyers can message you, and you can ask about requests you can see. | لا توجد محادثات بعد. يمكن للمشترين مراسلتك، ويمكنك السؤال عن الطلبات التي تراها. |  |
| notif.empty | You have no notifications. | لا توجد لديك إشعارات. |  |


### Confirmation dialogs (16)

| Key | English | Arabic | Note |
|---|---|---|---|
| address.remove_body | The address is removed from this list. Orders already placed keep their copy. | سيُزال العنوان من هذه القائمة. تحتفظ الطلبات السابقة بنسختها. |  |
| checkout.cancelled_body | This checkout was cancelled and the stock released. | تم إلغاء عملية الشراء وإعادة المخزون. |  |
| checkout.cancel_body | The orders are cancelled and the held stock is released. | سيتم إلغاء الطلبات وإعادة المخزون المحجوز. |  |
| ful.confirm_receipt_body | This completes the order. You can still open a dispute for 14 days after confirming. | يؤدي ذلك إلى إكمال الطلب. يمكنك فتح نزاع خلال 14 يوماً بعد التأكيد. |  |
| support.close_body | A closed ticket cannot be reopened. Open a new ticket if you need more help. | لا يمكن إعادة فتح التذكرة المغلقة. افتح تذكرة جديدة إذا احتجت إلى مساعدة أخرى. |  |
| rfq.cancel_body | Suppliers who quoted will be told. Open quotes are closed. This cannot be undone. | سيُبلَّغ الموردون الذين قدموا عروضاً وتُغلق العروض المفتوحة. لا يمكن التراجع عن ذلك. |  |
| quote.accept_body | You are accepting version {version} from {company}. Other quotes will be declined. This cannot be undone. | أنت تقبل النسخة {version} من {company}. سيتم رفض العروض الأخرى. لا يمكن التراجع عن ذلك. |  |
| quote.revision_body | {company} will be asked to revise the quote. The current version stays valid. | سيُطلب من {company} تعديل العرض. تبقى النسخة الحالية سارية. |  |
| quote.decline_body | Decline the quote from {company}? This cannot be undone. | رفض العرض المقدم من {company}؟ لا يمكن التراجع عن ذلك. |  |
| seller.quote.submit_body | The buyer will see these figures. A submitted version cannot be changed; you can submit a revision while the request is open. | سيرى المشتري هذه المبالغ. لا يمكن تغيير نسخة مقدمة، ويمكنك تقديم تعديل ما دام الطلب مفتوحاً. |  |
| seller.quote.withdraw_body | The buyer will be told. You cannot quote on this request again. | سيُبلَّغ المشتري، ولن تتمكن من تقديم عرض على هذا الطلب مرة أخرى. |  |
| seller.quote.revision_requested_body | The buyer asked for a revision. Submit a revised quote. | طلب المشتري تعديل العرض. قدّم عرضاً معدلاً. |  |
| seller.quote.accepted_body | The buyer accepted your quote. Orders and payment open in the next release; nothing has been charged. | قبل المشتري عرضك. تتوفر الطلبات والدفع في الإصدار القادم ولم يتم تحصيل أي مبلغ. | Stale: orders and payment exist now |
| seller.quote.declined_body | This quote was declined or the request was awarded to another supplier. | تم رفض هذا العرض أو ترسية الطلب على مورد آخر. |  |
| admin.rfq.hide_body | Suppliers will no longer see this request and cannot quote. The buyer is told. A reason is required and audited. | لن يرى الموردون هذا الطلب ولن يمكنهم تقديم عروض، وسيُبلَّغ المشتري. السبب مطلوب ويُسجَّل. |  |
| admin.rfq.unhide_body | The request becomes visible to eligible suppliers again. A reason is required and audited. | يعود الطلب مرئياً للموردين المؤهلين. السبب مطلوب ويُسجَّل. |  |


### Verification instructions (25)

| Key | English | Arabic | Note |
|---|---|---|---|
| company.upload_blocked | The malware scan blocked this file. Remove it and upload a clean copy. | حظر فحص البرمجيات الخبيثة هذا الملف. احذفه وارفع نسخة سليمة. |  |
| company.uploading | Uploading… | جارٍ الرفع… |  |
| company.scan.CLEAN | Scanned: clean | تم الفحص: سليم |  |
| company.scan.INFECTED | Blocked: malware detected | محظور: تم اكتشاف برمجية خبيثة |  |
| company.scan.PENDING | Scanning | قيد الفحص |  |
| company.terms_accept | I confirm the information is accurate and I accept the platform terms (version {version}). | أؤكد صحة المعلومات وأوافق على شروط المنصة (الإصدار {version}). |  |
| company.terms_pending_note | Final legal terms are pending legal review. | الشروط القانونية النهائية قيد المراجعة القانونية. | Until legal terms are approved |
| invite.body | You are invited to the {kind} workspace of {company} as {role}. | تمت دعوتك إلى مساحة {kind} لشركة {company} بدور {role}. |  |
| invite.for_email | This invitation is for {email}. | هذه الدعوة موجهة إلى {email}. |  |
| invite.sign_in_first | Sign in or create an account with {email} to accept. | سجّل الدخول أو أنشئ حساباً بالبريد {email} لقبول الدعوة. |  |
| invite.wrong_account | You are signed in as {current}. Sign out and sign in as {email} to accept. | أنت مسجّل باسم {current}. سجّل الخروج ثم ادخل باسم {email} لقبول الدعوة. |  |
| invite.not_pending | This invitation is no longer valid ({state}). Ask the owner for a new one. | هذه الدعوة لم تعد صالحة ({state}). اطلب دعوة جديدة من المالك. |  |
| admin.decision | Decision | القرار |  |
| admin.decision.APPROVED | Approve | موافقة |  |
| admin.decision.NEEDS_INFO | Request more information | طلب معلومات إضافية |  |
| admin.decision.REJECTED | Reject | رفض |  |
| admin.decision_recorded | Decision recorded. | تم تسجيل القرار. |  |
| cstatus.DRAFT | Draft | مسودة |  |
| cstatus.SUBMITTED | Submitted | مُرسل |  |
| cstatus.UNDER_REVIEW | Under review | قيد المراجعة |  |
| cstatus.NEEDS_INFO | More information needed | مطلوب معلومات إضافية |  |
| cstatus.REJECTED | Rejected | مرفوض |  |
| cstatus.APPROVED | Approved | معتمد |  |
| cstatus.SUSPENDED | Suspended | معلّق |  |
| cstatus.CLOSED | Closed | مغلق |  |


### Payment instructions (56)

| Key | English | Arabic | Note |
|---|---|---|---|
| checkout.delivery_address | Delivery address | عنوان التسليم |  |
| checkout.choose_address | Deliver to | التسليم إلى |  |
| checkout.need_address | Add a delivery address in the UAE to continue. | أضف عنوان تسليم داخل الإمارات للمتابعة. |  |
| checkout.summary | Order summary | ملخص الطلب |  |
| checkout.merchandise | Items | المنتجات |  |
| checkout.shipping | Delivery | التوصيل |  |
| checkout.tax | Tax | الضريبة |  |
| checkout.total | Total | الإجمالي |  |
| checkout.orders_note | This creates {count} order(s), one per supplier, paid in one payment. | سيتم إنشاء {count} طلب، طلب لكل مورد، بدفعة واحدة. |  |
| checkout.reservation_note | Stock is held for {minutes} minutes while you pay. | يتم حجز المخزون لمدة {minutes} دقيقة أثناء الدفع. |  |
| checkout.po_reference | Your PO reference | رقم أمر الشراء لديك |  |
| checkout.accept_terms | I confirm the order details and accept the marketplace terms of purchase. | أؤكد تفاصيل الطلب وأوافق على شروط الشراء في السوق. |  |
| checkout.terms_required | Confirm the order details to continue. | أكّد تفاصيل الطلب للمتابعة. |  |
| checkout.blocked | Fix the items marked above before placing the order. | عالج العناصر المشار إليها أعلاه قبل تأكيد الطلب. |  |
| checkout.issue.emirate_not_served | This supplier does not deliver to the selected emirate. | لا يوصل هذا المورد إلى الإمارة المختارة. |  |
| checkout.view_rfq | View request | عرض الطلب |  |
| checkout.paid_body | The supplier has been notified. Track each order from Orders. | تم إشعار المورد. تابع كل طلب من صفحة الطلبات. |  |
| checkout.awaiting_confirmation_body | We confirm the order only when the payment provider confirms the payment. This page updates automatically. | نؤكد الطلب فقط عندما يؤكد مزود الدفع العملية. يتم تحديث هذه الصفحة تلقائياً. |  |
| checkout.pay_by_body | Pay by {at} (Dubai time). | ادفع قبل {at} (بتوقيت دبي). |  |
| checkout.stock_held | Stock is held for you until then. | المخزون محجوز لك حتى ذلك الوقت. |  |
| checkout.last_failed | The last payment attempt did not go through ({code}). You can try again. | لم تنجح محاولة الدفع الأخيرة ({code}). يمكنك المحاولة مرة أخرى. |  |
| checkout.expired_body | The payment window passed, so the orders were cancelled and stock released. | انتهت مهلة الدفع، لذلك أُلغيت الطلبات وأُعيد المخزون. |  |
| checkout.reconciliation_body | A payment arrived after this checkout closed. Our finance team is reviewing it and will contact you. | وصلت دفعة بعد إغلاق عملية الشراء. يراجعها فريق المالية وسيتواصل معك. |  |
| checkout.orders | Orders | الطلبات |  |
| checkout.payments | Payment attempts | محاولات الدفع |  |
| checkout.pay_by_label | Pay by | آخر موعد للدفع |  |
| checkout.paid_at | Paid at | تاريخ الدفع |  |
| checkout.address_emirate_mismatch | Choose an address in the emirate from your request. | اختر عنواناً في الإمارة المحددة في طلبك. |  |
| checkout.state.PENDING_PAYMENT | Awaiting payment | بانتظار الدفع |  |
| checkout.state.PAID | Paid | مدفوع |  |
| checkout.state.EXPIRED | Expired | منتهي |  |
| checkout.state.CANCELLED | Cancelled | ملغى |  |
| checkout.state.RECONCILIATION_REQUIRED | Under finance review | قيد المراجعة المالية |  |
| payment.sandbox_body | Payments in this environment use a labelled test adapter. No card is charged and no money moves. | تستخدم المدفوعات في هذه البيئة محولاً تجريبياً موسوماً. لا يتم خصم أي بطاقة ولا تنتقل أي أموال. |  |
| payment.sandbox_pill | Sandbox | تجريبي |  |
| payment.state.CREATED | Created | تم الإنشاء |  |
| payment.state.PENDING | With provider | لدى المزود |  |
| payment.state.CAPTURED | Captured | تم التحصيل |  |
| payment.state.FAILED | Failed | فشل |  |
| payment.state.CANCELLED | Cancelled | ملغى |  |
| sandbox.reference | Reference | المرجع |  |
| sandbox.amount | Amount | المبلغ |  |
| sandbox.state | Status | الحالة |  |
| sandbox.state.OPEN | Waiting for the customer | بانتظار العميل |  |
| sandbox.state.CAPTURED | Captured (simulated) | تم التحصيل (محاكاة) |  |
| sandbox.state.FAILED | Failed (simulated) | فشل (محاكاة) |  |
| sandbox.state.CANCELLED | Cancelled | ملغى |  |
| sandbox.simulate_success | Simulate successful payment | محاكاة دفع ناجح |  |
| sandbox.simulate_failure | Simulate declined payment | محاكاة رفض الدفع |  |
| sandbox.return_without_paying | Return without paying | العودة دون دفع |  |
| sandbox.return | Return to checkout | العودة إلى إتمام الشراء |  |
| payment.state.PARTIALLY_REFUNDED | Partly refunded | مسترد جزئياً |  |
| payment.state.REFUNDED | Refunded | مسترد |  |
| sandbox.complete_success | Simulate provider success | محاكاة نجاح المزود |  |
| sandbox.complete_failure | Simulate provider failure | محاكاة فشل المزود |  |
| sandbox.operation_note | SANDBOX: no money moves. These buttons stand in for the provider finishing the operation. | بيئة تجريبية: لا تتحرك أي أموال. تحل هذه الأزرار محل إتمام المزود للعملية. |  |


### Order status explanations (21)

| Key | English | Arabic | Note |
|---|---|---|---|
| order.awaiting_payment_seller | The buyer has not paid yet. Do not dispatch until the order is confirmed. | لم يدفع المشتري بعد. لا تقم بالشحن حتى يتم تأكيد الطلب. |  |
| order.confirmed_next_seller | Payment is confirmed. Prepare the goods and record dispatch. | تم تأكيد الدفع. جهّز البضائع وسجّل الشحن. |  |
| order.confirmed_next_buyer | Payment is confirmed. The supplier will prepare and dispatch the order; you confirm receipt when it arrives. | تم تأكيد الدفع. سيجهز المورد الطلب ويشحنه، وتؤكد أنت الاستلام عند وصوله. |  |
| order.state.AWAITING_PAYMENT | Awaiting payment | بانتظار الدفع |  |
| order.state.CONFIRMED | Confirmed | مؤكد |  |
| order.state.PROCESSING | Processing | قيد التجهيز |  |
| order.state.DISPATCHED | Dispatched | تم الشحن |  |
| order.state.DELIVERED | Delivered | تم التسليم |  |
| order.state.COMPLETED | Completed | مكتمل |  |
| order.state.CANCELLED | Cancelled | ملغى |  |
| order.reason.payment_window_expired | Not paid before the deadline | لم يتم الدفع قبل الموعد |  |
| order.reason.cancelled_by_buyer | Cancelled by the buyer | ألغاه المشتري |  |
| settlement.state.NOT_ELIGIBLE | Not yet eligible | غير مؤهل بعد |  |
| settlement.state.ELIGIBLE | Eligible for payout | مؤهل للتحويل |  |
| settlement.state.HELD | Held (dispute) | معلّق (نزاع) |  |
| settlement.state.IN_PAYOUT | In payout | قيد التحويل |  |
| settlement.state.PAID_OUT | Paid out | تم التحويل |  |
| ful.buyer_next_dispatched | The supplier has dispatched this order. Confirm receipt once the goods arrive. | شحن المورد هذا الطلب. أكد الاستلام عند وصول البضائع. |  |
| ful.seller_next_confirmed | Payment is confirmed. Prepare the goods and record dispatch. | تم تأكيد الدفع. جهّز البضائع وسجّل الشحن. |  |
| ful.seller_waiting_receipt | Waiting for the buyer to confirm receipt. | بانتظار تأكيد المشتري للاستلام. |  |
| ful.payout_note | Eligible orders are paid out by finance through the payment provider after dual approval. Nothing is paid automatically. | يحوّل فريق المالية مبالغ الطلبات المؤهلة عبر مزود الدفع بعد موافقة شخصين. لا يتم أي دفع تلقائياً. |  |


### Status labels (60)

| Key | English | Arabic | Note |
|---|---|---|---|
| ustatus.ACTIVE | Active | نشط |  |
| ustatus.DISABLED | Disabled | معطّل |  |
| wstatus.PENDING | Pending verification | بانتظار التحقق |  |
| wstatus.ACTIVE | Active | نشطة |  |
| wstatus.RESTRICTED | Restricted | مقيّدة |  |
| pstatus.DRAFT | Draft | مسودة |  |
| pstatus.PUBLISHED | Published | منشور |  |
| pstatus.UNPUBLISHED | Unpublished | غير منشور |  |
| pstatus.SUSPENDED | Suspended | موقوف |  |
| pstatus.ARCHIVED | Archived | مؤرشف |  |
| pstatus.REMOVED | Removed | محذوف |  |
| vstate.DRAFT | Draft | مسودة |  |
| vstate.PENDING_REVIEW | Pending review | بانتظار المراجعة |  |
| vstate.APPROVED | Approved | معتمد |  |
| vstate.REJECTED | Rejected | مرفوض |  |
| vstate.CHANGES_REQUESTED | Changes requested | مطلوب تعديلات |  |
| vstate.SUPERSEDED | Superseded | مستبدل |  |
| vstate.WITHDRAWN | Withdrawn | مسحوب |  |
| shipment.state.DISPATCHED | Dispatched | تم الشحن |  |
| shipment.state.DELIVERED | Delivered | تم التسليم |  |
| dispute.state.OPEN | Open | مفتوح |  |
| dispute.state.UNDER_REVIEW | Under review | قيد المراجعة |  |
| dispute.state.AWAITING_EVIDENCE | Awaiting evidence | بانتظار الأدلة |  |
| dispute.state.RESOLUTION_PROPOSED | Resolution proposed | تم اقتراح حل |  |
| dispute.state.RESOLVING | Refund in progress | الاسترداد قيد التنفيذ |  |
| dispute.state.CLOSED | Closed | مغلق |  |
| refund.state.REQUESTED | Awaiting approval | بانتظار الموافقة |  |
| refund.state.APPROVED | Approved | تمت الموافقة |  |
| refund.state.REJECTED | Rejected | مرفوض |  |
| refund.state.SUBMITTED | Sent to provider | أُرسل إلى مزود الدفع |  |
| refund.state.SUCCEEDED | Refunded | تم الاسترداد |  |
| refund.state.FAILED | Failed | فشل |  |
| payout.state.REQUESTED | Awaiting approval | بانتظار الموافقة |  |
| payout.state.APPROVED | Approved | تمت الموافقة |  |
| payout.state.REJECTED | Rejected | مرفوض |  |
| payout.state.PENDING | Sent to provider | أُرسل إلى مزود الدفع |  |
| payout.state.PAID | Paid by provider | دفعه مزود الدفع |  |
| payout.state.FAILED | Failed | فشل |  |
| review.state.PUBLISHED | Published | منشور |  |
| review.state.HIDDEN | Hidden | مخفي |  |
| support.state.OPEN | Open | مفتوحة |  |
| support.state.ASSIGNED | With support | لدى الدعم |  |
| support.state.WAITING_CUSTOMER | Waiting for you | بانتظار ردك |  |
| support.state.RESOLVED | Resolved | تم الحل |  |
| support.state.CLOSED | Closed | مغلقة |  |
| support.admin_state.WAITING_CUSTOMER | Waiting for customer | بانتظار العميل |  |
| export.state.READY | Ready | جاهز |  |
| export.state.EXPIRED | Expired | منتهي |  |
| rfq.state.DRAFT | Draft | مسودة |  |
| rfq.state.OPEN | Open | مفتوح |  |
| rfq.state.AWARDED | Awarded | تمت الترسية |  |
| rfq.state.CANCELLED | Cancelled | ملغى |  |
| rfq.state.EXPIRED | Expired | منتهي |  |
| quote.state.DRAFT | Draft | مسودة |  |
| quote.state.SUBMITTED | Submitted | مقدّم |  |
| quote.state.ACCEPTED | Accepted | مقبول |  |
| quote.state.DECLINED | Declined | مرفوض |  |
| quote.state.WITHDRAWN | Withdrawn | مسحوب |  |
| quote.state.EXPIRED | Expired | منتهي |  |
| quote.state.SUPERSEDED | Superseded | نسخة سابقة |  |


### Notification messages (29)

| Key | English | Arabic | Note |
|---|---|---|---|
| notif.type.order.paid | Payment confirmed for {number} | تم تأكيد الدفع للطلب {number} |  |
| notif.type.order.received | New paid order {number} | طلب مدفوع جديد {number} |  |
| notif.type.order.cancelled | {number} was cancelled | تم إلغاء {number} |  |
| notif.type.order.payment_due | Payment is due for {number} | الدفع مستحق للطلب {number} |  |
| notif.type.order.dispatched | {number} has been dispatched | تم شحن الطلب {number} |  |
| notif.type.order.delivered | The supplier reported {number} as delivered | أبلغ المورد بتسليم الطلب {number} |  |
| notif.type.order.completed | The buyer confirmed receipt of {number} | أكد المشتري استلام الطلب {number} |  |
| notif.type.order.refunded | A refund was confirmed for {number} | تم تأكيد استرداد مبلغ للطلب {number} |  |
| notif.type.dispute.opened | A dispute was opened on {number} | تم فتح نزاع على الطلب {number} |  |
| notif.type.dispute.updated | A dispute on {number} was updated | تم تحديث نزاع على الطلب {number} |  |
| notif.type.payout.paid | Payout {number} was paid by the provider | دفع مزود الدفع التحويل {number} |  |
| notif.type.payout.failed | Payout {number} failed at the provider | فشل التحويل {number} لدى مزود الدفع |  |
| notif.type.support.replied | Support replied on ticket {number} | رد الدعم على التذكرة {number} |  |
| notif.type.support.resolved | Support resolved ticket {number} | حل الدعم التذكرة {number} |  |
| notif.unread | Unread: | غير مقروء: |  |
| notif.unread_only | Unread only | غير المقروءة فقط |  |
| notif.type.rfq.invited | You are invited to quote on {number} | تمت دعوتك لتقديم عرض على {number} |  |
| notif.type.rfq.matched | New request in your category: {number} | طلب جديد في فئتك: {number} |  |
| notif.type.rfq.question | {company} asked about {number} | سأل {company} عن {number} |  |
| notif.type.rfq.cancelled | {number} was cancelled by the buyer | ألغى المشتري {number} |  |
| notif.type.rfq.expired | {number} expired without an accepted quote | انتهى {number} دون قبول أي عرض |  |
| notif.type.rfq.awarded_other | {number} was awarded to another supplier | تمت ترسية {number} على مورد آخر |  |
| notif.type.quote.submitted | {company} submitted a quote on {number} | قدّم {company} عرضاً على {number} |  |
| notif.type.quote.revised | {company} revised its quote on {number} | عدّل {company} عرضه على {number} |  |
| notif.type.quote.withdrawn | {company} withdrew its quote on {number} | سحب {company} عرضه على {number} |  |
| notif.type.quote.revision_requested | The buyer asked you to revise your quote on {number} | طلب المشتري تعديل عرضك على {number} |  |
| notif.type.quote.declined | Your quote on {number} was declined | تم رفض عرضك على {number} |  |
| notif.type.quote.accepted | Your quote on {number} was accepted | تم قبول عرضك على {number} |  |
| notif.type.quote.expired | A quote on {number} expired | انتهت صلاحية عرض على {number} |  |


### Error messages (159)

| Key | English | Arabic | Note |
|---|---|---|---|
| error.auth.invalid_credentials | The email or password is incorrect. | البريد الإلكتروني أو كلمة المرور غير صحيحة. |  |
| error.auth.unauthenticated | Your session has ended. Sign in again. | انتهت جلستك. سجّل الدخول مرة أخرى. |  |
| error.auth.email_not_verified | Verify your email address first. | أكّد بريدك الإلكتروني أولاً. |  |
| error.auth.token_invalid | This link is invalid, expired or already used. Request a new one. | هذا الرابط غير صالح أو منتهٍ أو مستخدم. اطلب رابطاً جديداً. |  |
| error.auth.current_password_wrong | The current password is incorrect. | كلمة المرور الحالية غير صحيحة. |  |
| error.common.rate_limited | Too many attempts. Wait a few minutes and try again. | محاولات كثيرة. انتظر بضع دقائق ثم أعد المحاولة. |  |
| error.common.validation_failed | Check the highlighted fields. | راجع الحقول المحددة. |  |
| error.common.not_found | Not found, or you do not have access. | غير موجود، أو ليست لديك صلاحية الوصول. |  |
| error.common.forbidden | You do not have permission for this action. | ليست لديك صلاحية لهذا الإجراء. |  |
| error.common.stale_version | This record changed since you opened it. Reload and try again. | تغيّر هذا السجل منذ فتحه. أعد التحميل وحاول مرة أخرى. |  |
| error.common.stale_state | This item changed state since you opened it. Reload and try again. | تغيّرت حالة هذا العنصر منذ فتحه. أعد التحميل وحاول مرة أخرى. |  |
| error.common.csrf_origin | The request was blocked for security reasons. Reload the page. | تم حظر الطلب لأسباب أمنية. أعد تحميل الصفحة. |  |
| error.common.csrf_token | Your security token expired. Reload the page and try again. | انتهت صلاحية رمز الأمان. أعد تحميل الصفحة وحاول مرة أخرى. |  |
| error.common.internal_error | An unexpected error occurred. | حدث خطأ غير متوقع. |  |
| error.common.network | Could not reach the server. Check your connection; your input is kept, so you can retry. | تعذّر الوصول إلى الخادم. تحقق من الاتصال؛ تم الاحتفاظ بمدخلاتك لتعيد المحاولة. |  |
| error.company.licence_exists | A company with this licence number and issuer is already registered. | توجد شركة مسجلة بنفس رقم الرخصة وجهة الإصدار. |  |
| error.company.not_editable | Company details cannot be edited in the current status. | لا يمكن تعديل بيانات الشركة في الحالة الحالية. |  |
| error.company.licence_expiry_future | The licence expiry date must be in the future. | يجب أن يكون تاريخ انتهاء الرخصة في المستقبل. |  |
| error.company.renewal_required | The licence has expired. The company must submit a renewal. | انتهت الرخصة. يجب على الشركة تقديم طلب تجديد. |  |
| error.verification.incomplete | Upload both required documents (clean) and make sure the licence is valid before submitting. | ارفع المستندين المطلوبين (سليمين) وتأكد من صلاحية الرخصة قبل الإرسال. |  |
| error.verification.not_editable | Documents cannot be changed in the current verification state. | لا يمكن تغيير المستندات في حالة التحقق الحالية. |  |
| error.verification.terms_outdated | The terms changed. Reload the page. | تغيّرت الشروط. أعد تحميل الصفحة. |  |
| error.verification.renewal_not_allowed | Renewal is available for approved companies, or those restricted because the licence expired. | التجديد متاح للشركات المعتمدة أو المقيّدة بسبب انتهاء الرخصة. |  |
| error.verification.case_open | A verification case is already open. | توجد حالة تحقق مفتوحة بالفعل. |  |
| error.verification.licence_expired | The licence on this case has expired; it cannot be approved. | الرخصة في هذه الحالة منتهية ولا يمكن اعتمادها. |  |
| error.file.required | Choose a file. | اختر ملفاً. |  |
| error.file.type_not_allowed | Only PDF, PNG or JPEG files are accepted. | تُقبل ملفات PDF أو PNG أو JPEG فقط. |  |
| error.file.too_large | The file is too large. | حجم الملف كبير جداً. |  |
| error.file.not_clean | This file was blocked by the malware scan and cannot be downloaded. | تم حظر هذا الملف بواسطة فحص البرمجيات الخبيثة ولا يمكن تنزيله. |  |
| error.file.scanning_unavailable | Uploads are unavailable because file scanning is not configured. | الرفع غير متاح لأن فحص الملفات غير مهيأ. |  |
| error.team.last_owner | A workspace must keep at least one owner. Add another owner first. | يجب أن يبقى مالك واحد على الأقل. أضف مالكاً آخر أولاً. |  |
| error.team.already_member | This person is already a member. | هذا الشخص عضو بالفعل. |  |
| error.team.role_not_allowed | That role is not available for this workspace. | هذا الدور غير متاح لمساحة العمل هذه. |  |
| error.invitation.invalid | This invitation link is invalid. | رابط الدعوة غير صالح. |  |
| error.invitation.not_pending | This invitation is no longer valid. | هذه الدعوة لم تعد صالحة. |  |
| error.invitation.email_mismatch | This invitation was sent to a different email address. | أُرسلت هذه الدعوة إلى بريد إلكتروني مختلف. |  |
| error.admin.mfa_required | Complete two-factor authentication to continue. | أكمل المصادقة الثنائية للمتابعة. |  |
| error.admin.mfa_code_invalid | That code is not valid. Codes can only be used once. | الرمز غير صالح. يمكن استخدام كل رمز مرة واحدة فقط. |  |
| error.admin.forbidden | Your admin role does not allow this action. | لا يسمح دورك الإداري بهذا الإجراء. |  |
| error.admin.no_role | Your account has no active admin role. | لا يوجد دور إداري نشط لحسابك. |  |
| error.admin.last_super_admin | At least one super-admin must remain. | يجب أن يبقى مسؤول أعلى واحد على الأقل. |  |
| error.admin.mfa_already_enrolled | Two-factor authentication is already set up. | تم إعداد المصادقة الثنائية بالفعل. |  |
| error.admin.mfa_not_enrolled | Set up two-factor authentication first. | أعدّ المصادقة الثنائية أولاً. |  |
| error.catalog.pending_review_locked | This listing is waiting for review. Withdraw the submission to edit it. | هذا الإدراج بانتظار المراجعة. اسحب الطلب لتعديله. |  |
| error.catalog.product_locked | This listing cannot be changed in its current state. | لا يمكن تغيير هذا الإدراج في حالته الحالية. |  |
| error.catalog.sku_exists | That SKU code is already used in your workspace. | رمز الصنف مستخدم بالفعل في مساحة عملك. |  |
| error.catalog.sku_identity_locked | An approved variant’s code, unit and attributes cannot change. Add a new variant instead. | لا يمكن تغيير رمز الصنف المعتمد أو وحدته أو سماته. أضف صنفاً جديداً بدلاً من ذلك. |  |
| error.catalog.media_limit | The image limit has been reached. | تم بلوغ الحد الأقصى للصور. |  |
| error.catalog.pricing_invalid | Check the highlighted prices: tiers must start at the MOQ, rise in quantity and not increase in price. | راجع الأسعار المحددة: يجب أن تبدأ الشرائح من الحد الأدنى وتتزايد الكميات ولا يرتفع السعر. |  |
| error.catalog.submission_incomplete | Complete the highlighted items before submitting. | أكمل العناصر المحددة قبل الإرسال. |  |
| error.catalog.restricted_term | This listing contains a prohibited term and cannot be submitted. | يحتوي هذا الإدراج على كلمة محظورة ولا يمكن إرساله. |  |
| error.catalog.invalid_transition | That action is not available for this listing now. | هذا الإجراء غير متاح لهذا الإدراج الآن. |  |
| error.catalog.licence_expired | Your trade licence has expired. Renew it to list and edit products. | انتهت رخصتك التجارية. جدّدها لإدراج المنتجات وتعديلها. |  |
| error.catalog.company_suspended | Your company is suspended. Listing is paused. | شركتك موقوفة. الإدراج متوقف. |  |
| error.catalog.company_not_approved | Your company must be verified before you can list products. | يجب توثيق شركتك قبل إدراج المنتجات. |  |
| error.catalog.workspace_inactive | This seller workspace is not active. | مساحة عمل البائع هذه غير نشطة. |  |
| error.catalog.seller_not_eligible | This seller is not eligible to list products. | هذا البائع غير مؤهل لإدراج المنتجات. |  |
| error.catalog.category_unavailable | That category is not available. | هذه الفئة غير متاحة. |  |
| error.catalog.insufficient_stock | Not enough available stock for this adjustment. | المخزون المتاح غير كافٍ لهذا التعديل. |  |
| error.catalog.storefront_incomplete | Complete business type, description and city before publishing. | أكمل نوع النشاط والنبذة والمدينة قبل النشر. |  |
| error.catalog.slug_taken | That slug is already used. | هذا المعرف مستخدم بالفعل. |  |
| error.catalog.attribute_exists | That attribute key already exists in this category. | مفتاح السمة موجود بالفعل في هذه الفئة. |  |
| error.catalog.featured_not_public | Only live products and storefronts can be featured. | يمكن تمييز المنتجات والواجهات المنشورة فقط. |  |
| error.catalog.already_featured | This item is already featured. | هذا العنصر مميز بالفعل. |  |
| error.catalog.moq_not_met | The quantity is below the minimum order. | الكمية أقل من الحد الأدنى للطلب. |  |
| error.catalog.order_increment | The quantity must follow the order increment. | يجب أن تتبع الكمية مضاعف الطلب. |  |
| error.catalog.quote_only | This product is priced on request. | سعر هذا المنتج عند الطلب. |  |
| error.marketplace.price_requires_verified | Sign in with a verified email to use prices. | سجّل الدخول ببريد موثق لاستخدام الأسعار. |  |
| error.marketplace.compare_limit | You can compare up to 4 products. Remove one first. | يمكنك مقارنة 4 منتجات كحد أقصى. أزل منتجاً أولاً. |  |
| error.marketplace.saved_limit | You have reached the saved-items limit. | بلغت الحد الأقصى للعناصر المحفوظة. |  |
| error.file.image_type_not_allowed | Upload a PNG, JPEG or WebP image. | ارفع صورة PNG أو JPEG أو WebP. |  |
| error.file.image_unreadable | This image could not be read. Try another file. | تعذرت قراءة الصورة. جرّب ملفاً آخر. |  |
| error.file.image_too_small | The image must be at least 200 × 200 pixels. | يجب ألا تقل الصورة عن 200 × 200 بكسل. |  |
| error.catalog.no_content | This listing has no content to show yet. | لا يوجد محتوى لعرضه لهذا المنتج بعد. |  |
| error.catalog.not_pending | This version is no longer pending review. Reload to see the latest state. | لم تعد هذه النسخة قيد المراجعة. أعد التحميل لرؤية أحدث حالة. |  |
| error.catalog.nothing_to_submit | There are no draft changes to submit. | لا توجد تعديلات مسودة لإرسالها. |  |
| error.catalog.sku_approved_deactivate | An approved SKU cannot be deleted. Deactivate it instead. | لا يمكن حذف وحدة SKU معتمدة. قم بتعطيلها بدلاً من ذلك. |  |
| error.catalog.sku_has_stock_history | This SKU has stock history and cannot be deleted. Deactivate it instead. | لهذه الوحدة سجل مخزون ولا يمكن حذفها. قم بتعطيلها بدلاً من ذلك. |  |
| error.catalog.sku_last | A listing needs at least one SKU. | يجب أن يحتوي المنتج على وحدة SKU واحدة على الأقل. |  |
| error.catalog.sku_limit | This listing has reached the SKU limit. | وصل هذا المنتج إلى الحد الأقصى لوحدات SKU. |  |
| error.file.infected | The file failed the security scan and was not saved. | لم يجتز الملف الفحص الأمني ولم يتم حفظه. |  |
| error.address.limit_reached | You have reached the maximum number of addresses. | وصلت إلى الحد الأقصى لعدد العناوين. |  |
| error.cart.self_trade | You cannot order from your own company. | لا يمكنك الطلب من شركتك. |  |
| error.cart.not_cart_eligible | This item is ordered through a quotation request. | يتم طلب هذا المنتج عبر طلب عرض سعر. |  |
| error.cart.insufficient_stock | Not enough stock for that quantity. | المخزون غير كافٍ لهذه الكمية. |  |
| error.cart.limit_reached | Your cart has the maximum number of lines. | وصلت سلتك إلى الحد الأقصى لعدد البنود. |  |
| error.checkout.payments_disabled | Checkout is not available right now. | إتمام الشراء غير متاح حالياً. |  |
| error.checkout.changed | Prices, stock or your cart changed since you reviewed it. Review the updated totals and try again. | تغيرت الأسعار أو المخزون أو سلتك منذ المراجعة. راجع الإجماليات المحدثة وحاول مرة أخرى. |  |
| error.checkout.blocked | Some items cannot be ordered as they are. Review your cart. | لا يمكن طلب بعض المنتجات كما هي. راجع سلتك. |  |
| error.checkout.insufficient_stock | Another buyer just reserved the last units of an item. Review your cart. | حجز مشترٍ آخر آخر الوحدات من أحد المنتجات. راجع سلتك. |  |
| error.checkout.not_payable | This checkout can no longer be paid. | لم يعد بالإمكان دفع عملية الشراء هذه. |  |
| error.checkout.expired | The payment window has passed. | انتهت مهلة الدفع. |  |
| error.checkout.address_emirate_mismatch | Choose an address in the emirate from your request. | اختر عنواناً في الإمارة المحددة في طلبك. |  |
| error.checkout.too_many_attempts | Too many payment attempts for this checkout. | محاولات دفع كثيرة لعملية الشراء هذه. |  |
| error.checkout.quote_cancel_unsupported | An order from an accepted quotation cannot be cancelled here. | لا يمكن إلغاء طلب من عرض سعر مقبول من هنا. |  |
| error.checkout.payment_in_progress | The payment provider already captured this payment. It cannot be cancelled now. | حصّل مزود الدفع هذه الدفعة بالفعل. لا يمكن الإلغاء الآن. |  |
| error.payment.invalid_signature | Invalid signature. | توقيع غير صالح. |  |
| error.payment.invalid_event | Invalid payment event. | حدث دفع غير صالح. |  |
| error.payment.session_closed | This payment session is already closed. | جلسة الدفع هذه مغلقة بالفعل. |  |
| error.order.not_paid | This order is not paid yet. Nothing can be shipped before payment. | لم يُدفع هذا الطلب بعد. لا يمكن الشحن قبل الدفع. |  |
| error.order.invalid_transition | This order has moved on. Reload to see its current state. | تغيرت حالة هذا الطلب. أعد التحميل لرؤية حالته الحالية. |  |
| error.review.not_completed | You can review the supplier once you have confirmed receipt. | يمكنك تقييم المورد بعد تأكيد الاستلام. |  |
| error.review.exists | This order already has a review. | يوجد تقييم لهذا الطلب بالفعل. |  |
| error.review.no_change | The review is already in that state. | التقييم في هذه الحالة بالفعل. |  |
| error.dispute.not_allowed | A dispute can no longer be opened on this order (outside the window or already paid out). | لم يعد بالإمكان فتح نزاع على هذا الطلب (خارج المهلة أو تم التحويل). |  |
| error.dispute.exists | This order already has an open dispute. | يوجد نزاع مفتوح على هذا الطلب بالفعل. |  |
| error.dispute.closed | This dispute is closed. | هذا النزاع مغلق. |  |
| error.dispute.not_assigned | Assign the dispute to yourself first. | أسند النزاع إلى نفسك أولاً. |  |
| error.dispute.invalid_transition | This step is not available in the dispute’s current state. | هذه الخطوة غير متاحة في حالة النزاع الحالية. |  |
| error.dispute.message_limit | This dispute has reached its message limit. | بلغ هذا النزاع الحد الأقصى للرسائل. |  |
| error.refund.not_paid | This order was never paid. | لم يُدفع هذا الطلب قط. |  |
| error.refund.order_settled | The supplier has been paid for this order; it cannot be refunded. | تم التحويل إلى المورد عن هذا الطلب؛ لا يمكن استرداده. |  |
| error.refund.no_capture | No captured payment was found for this order. | لم يتم العثور على دفعة محصلة لهذا الطلب. |  |
| error.refund.exceeds_remaining | The amount is more than what remains refundable. | المبلغ أكبر من المتبقي القابل للاسترداد. |  |
| error.refund.dispute_not_ready | The dispute does not have a refund proposal. | لا يتضمن النزاع اقتراح استرداد. |  |
| error.refund.exceeds_proposal | The amount is more than the proposed refund. | المبلغ أكبر من الاسترداد المقترح. |  |
| error.refund.self_approval | You requested this refund; another finance user must decide. | أنت من طلب هذا الاسترداد؛ يجب أن يقرر مستخدم مالية آخر. |  |
| error.refund.invalid_transition | This refund has already been decided. | تم البت في هذا الاسترداد بالفعل. |  |
| error.payout.nothing_eligible | This supplier has no eligible orders right now. | لا توجد لدى هذا المورد طلبات مؤهلة حالياً. |  |
| error.payout.self_approval | You requested this payout; another finance user must decide. | أنت من طلب هذا التحويل؛ يجب أن يقرر مستخدم مالية آخر. |  |
| error.payout.invalid_transition | This payout has already been decided. | تم البت في هذا التحويل بالفعل. |  |
| error.payout.order_disputed | An order in this payout has an open dispute. | يوجد نزاع مفتوح على أحد طلبات هذا التحويل. |  |
| error.support.too_many_open | This workspace has too many open tickets. Close resolved ones before opening another. | لدى مساحة العمل هذه عدد كبير من التذاكر المفتوحة. أغلق التذاكر المحلولة قبل فتح تذكرة جديدة. |  |
| error.support.not_open | This ticket is not open for replies. | هذه التذكرة غير متاحة للرد. |  |
| error.support.closed | This ticket is closed. | هذه التذكرة مغلقة. |  |
| error.support.not_resolved | Only a resolved ticket can be reopened. | لا يمكن إعادة فتح إلا التذكرة المحلولة. |  |
| error.support.not_assigned | Take the ticket before acting on it. | استلم التذكرة قبل اتخاذ أي إجراء. |  |
| error.support.already_assigned | You already hold this ticket. | هذه التذكرة لديك بالفعل. |  |
| error.support.too_many_messages | This conversation has reached its message limit. | بلغت هذه المحادثة الحد الأقصى للرسائل. |  |
| error.export.scope_forbidden | Your role cannot export this report with this scope. The attempt was recorded. | لا يسمح دورك بتصدير هذا التقرير بهذا النطاق. تم تسجيل المحاولة. |  |
| error.export.expired | This export has expired. Create a new one. | انتهت صلاحية هذا التصدير. أنشئ تصديراً جديداً. |  |
| error.common.idempotency_key_required | The request could not be confirmed safely. Reload the page and try again. | تعذر تأكيد الطلب بأمان. أعد تحميل الصفحة وحاول مجدداً. |  |
| error.common.idempotency_key_reused | This confirmation was already used for a different action. Reload and try again. | استُخدم هذا التأكيد لإجراء آخر. أعد التحميل وحاول مجدداً. |  |
| error.common.stale | Someone changed this in the meantime. The latest version is shown; check it and try again. | غيّر شخص آخر هذا في الأثناء. تظهر الآن أحدث نسخة؛ راجعها وحاول مجدداً. |  |
| error.quote.accepted_immutable | An accepted quote cannot be changed. | لا يمكن تغيير عرض مقبول. |  |
| error.quote.exists | You already have a quote on this request. | لديك عرض بالفعل على هذا الطلب. |  |
| error.quote.expired | This quote has expired. | انتهت صلاحية هذا العرض. |  |
| error.quote.not_draft | Only a draft quote can be changed. | لا يمكن تغيير إلا مسودة العرض. |  |
| error.quote.not_submitted | Only a submitted quote can be revised or withdrawn. | لا يمكن تعديل أو سحب إلا عرض مقدّم. |  |
| error.quote.seller_unavailable | This supplier can no longer trade, so the quote cannot be accepted. | لم يعد هذا المورد قادراً على التداول، لذا لا يمكن قبول العرض. |  |
| error.quote.superseded | The supplier submitted a newer version. Review it before accepting. | قدّم المورد نسخة أحدث. راجعها قبل القبول. |  |
| error.rfq.already_awarded | This request has already been awarded. | تمت ترسية هذا الطلب بالفعل. |  |
| error.rfq.deadline_passed | The quote deadline has passed. | انتهى الموعد النهائي للعروض. |  |
| error.rfq.file_limit | The attachment limit has been reached. | تم بلوغ الحد الأقصى للمرفقات. |  |
| error.rfq.files_not_clean | Attachments are still being scanned or were blocked. Remove them or wait, then try again. | المرفقات قيد الفحص أو تم حظرها. أزلها أو انتظر ثم حاول مجدداً. |  |
| error.rfq.hidden | The platform has hidden this request. It cannot be changed or awarded now. | أخفت المنصة هذا الطلب، ولا يمكن تغييره أو ترسيته الآن. |  |
| error.rfq.not_cancellable | This request can no longer be cancelled. | لم يعد بالإمكان إلغاء هذا الطلب. |  |
| error.rfq.not_draft | Only a draft can be published. | لا يمكن نشر إلا المسودة. |  |
| error.rfq.not_editable | Only a draft can be edited. | لا يمكن تعديل إلا المسودة. |  |
| error.rfq.not_open | This request is not open for quotes. | هذا الطلب غير مفتوح للعروض. |  |
| error.rfq.open_limit | Your workspace has reached the limit of open requests. | بلغت مساحة العمل الحد الأقصى للطلبات المفتوحة. |  |
| error.rfq.self_dealing | You cannot invite or quote for your own company. | لا يمكنك دعوة شركتك أو تقديم عرض لها. |  |
| error.messages.counterpart_unavailable | The other company can no longer receive messages. | لم تعد الشركة الأخرى قادرة على استلام الرسائل. |  |
| error.trading.not_eligible | Your company is not yet eligible to trade. | شركتك غير مؤهلة للتداول بعد. |  |
| error.trading.company_not_approved | Your company must be verified before it can trade. | يجب توثيق شركتك قبل التداول. |  |
| error.trading.licence_expired | Your trade licence has expired. Renew it to trade. | انتهت رخصتك التجارية. جدّدها للتداول. |  |
| error.trading.company_suspended | Your company is suspended. Trading is paused. | شركتك موقوفة والتداول متوقف. |  |
| error.trading.workspace_inactive | This workspace is inactive. | مساحة العمل هذه غير نشطة. |  |
| error.trading.seller_not_eligible | This supplier is not eligible to trade. | هذا المورد غير مؤهل للتداول. |  |


### Other UI strings (906)

| Key | English | Arabic |
|---|---|---|
| admin.record_decision | Record decision | تسجيل القرار |
| admin.event_actor.company | Company user | مستخدم الشركة |
| admin.event_actor.admin | Compliance | الامتثال |
| admin.event_actor.system | System | النظام |
| common.pagination | Pagination | التنقل بين الصفحات |
| home.landing_body | Register your company, upload your trade licence and get verified. Buying and selling features open to verified companies as they are released. | سجّل شركتك وارفع رخصتك التجارية واحصل على التحقق. تُتاح ميزات الشراء والبيع للشركات المُتحقق منها عند إطلاقها. |
| admin.mfa_qr_alt | QR code for your authenticator app | رمز QR لتطبيق المصادقة |
| admin.open_cases | Open cases (submitted and under review) | الحالات المفتوحة (المُرسلة وقيد المراجعة) |
| admin.resource_id | Resource ID | معرّف المورد |
| app.tagline | Verified UAE businesses sourcing from verified suppliers and manufacturers. | شركات إماراتية موثقة تتعامل مع موردين ومصنّعين موثقين. |
| app.sandbox_banner | Sandbox environment: test adapters only. No real payments, and emails go to the local mail catcher. | بيئة تجريبية: محولات اختبار فقط. لا مدفوعات حقيقية، وتصل الرسائل إلى صندوق البريد المحلي. |
| app.skip_to_content | Skip to main content | تخطَّ إلى المحتوى الرئيسي |
| app.admin_portal | Admin portal | بوابة الإدارة |
| status.api | API | واجهة البرمجة |
| status.database | Database | قاعدة البيانات |
| status.redis | Queue store | مخزن قائمة الانتظار |
| status.up | Operational | يعمل |
| status.down | Unavailable | غير متاح |
| status.unreachable | The API could not be reached. Check that it is running, then retry. | تعذّر الوصول إلى واجهة البرمجة. تأكد من تشغيلها ثم أعد المحاولة. |
| status.checked_at | Checked at | وقت الفحص |
| status.reference | Reference | المرجع |
| locale.switch | العربية | English |
| locale.switch_label | Switch language to Arabic | تغيير اللغة إلى الإنجليزية |
| common.loading | Loading… | جارٍ التحميل… |
| common.saving | Saving… | جارٍ الحفظ… |
| common.confirm | Confirm | تأكيد |
| common.back | Back | رجوع |
| common.next_page | Next page | الصفحة التالية |
| common.first_page | First page | الصفحة الأولى |
| common.yes | Yes | نعم |
| common.no | No | لا |
| common.optional | optional | اختياري |
| common.required | required | مطلوب |
| common.details | Details | التفاصيل |
| common.actions | Actions | الإجراءات |
| common.status | Status | الحالة |
| common.email | Email | البريد الإلكتروني |
| common.name | Name | الاسم |
| common.role | Role | الدور |
| common.reason | Reason | السبب |
| common.search | Search | بحث |
| common.filter | Filter | تصفية |
| common.all | All | الكل |
| common.reference | Reference | المرجع |
| common.forbidden_body | You do not have access to this page, or it does not exist. | ليست لديك صلاحية الوصول إلى هذه الصفحة، أو أنها غير موجودة. |
| auth.register_intro | Register with your work email. You will verify it before setting up your company. | سجّل باستخدام بريد العمل. ستؤكده قبل إعداد شركتك. |
| auth.preferred_language | Preferred language | اللغة المفضلة |
| auth.register_submit | Create account | إنشاء الحساب |
| auth.have_account | Already have an account? | لديك حساب بالفعل؟ |
| auth.resend_verification | Resend verification email | إعادة إرسال رسالة التأكيد |
| auth.login_submit | Sign in | تسجيل الدخول |
| auth.forgot_link | Forgot your password? | نسيت كلمة المرور؟ |
| auth.forgot_intro | Enter your account email and we will send a reset link if it matches an account. | أدخل بريد حسابك وسنرسل رابط إعادة التعيين إذا كان مطابقاً لحساب. |
| auth.forgot_submit | Send reset link | إرسال الرابط |
| auth.reset_submit | Set new password | تعيين كلمة المرور |
| auth.verifying | Verifying your email address… | جارٍ تأكيد بريدك الإلكتروني… |
| auth.verified | Your email is verified. You can continue setting up your company. | تم تأكيد بريدك الإلكتروني. يمكنك متابعة إعداد شركتك. |
| auth.token_missing | This link is incomplete. Open the link from your email again. | هذا الرابط غير مكتمل. افتح الرابط من بريدك مرة أخرى. |
| auth.go_to_login | Go to sign in | الانتقال إلى تسجيل الدخول |
| auth.unverified_body | We sent a verification link to {email}. Company setup unlocks after you verify. | أرسلنا رابط تأكيد إلى {email}. يتاح إعداد الشركة بعد التأكيد. |
| home.create_company | Register a company | تسجيل شركة |
| home.your_workspaces | Your workspaces | مساحات العمل |
| home.open_company | Open company | فتح الشركة |
| home.add_company | Register another company | تسجيل شركة أخرى |
| company.create_intro | Enter the details exactly as they appear on your trade licence. | أدخل البيانات كما تظهر تماماً في الرخصة التجارية. |
| company.emirate | Emirate | الإمارة |
| company.contact_email | Company contact email | بريد التواصل للشركة |
| company.contact_phone | Company contact phone | هاتف التواصل للشركة |
| company.kinds | Access requested | الصلاحية المطلوبة |
| company.create_submit | Register company | تسجيل الشركة |
| company.select | Company | الشركة |
| company.details | Company details | بيانات الشركة |
| company.edit | Edit details | تعديل البيانات |
| company.locked | Details are locked while under review or after approval. Licence changes go through renewal. | البيانات مقفلة أثناء المراجعة أو بعد الموافقة. تتم تغييرات الرخصة عبر التجديد. |
| company.verification | Verification | التحقق |
| company.documents | Documents | المستندات |
| company.documents_intro | Upload a clear copy of the trade licence and evidence that the account owner is an authorised representative. PDF, PNG or JPEG, up to {size} MB. | ارفع نسخة واضحة من الرخصة التجارية وما يثبت أن صاحب الحساب ممثل مفوّض. ملفات PDF أو PNG أو JPEG حتى {size} ميغابايت. |
| company.document_type | Document type | نوع المستند |
| company.file | File | الملف |
| company.resubmit | Resubmit for verification | إعادة الإرسال للتحقق |
| company.reason_from_compliance | Message from compliance | رسالة من فريق الامتثال |
| company.history | Verification history | سجل التحقق |
| company.event_actor.company | Your company | شركتك |
| company.event_actor.admin | Compliance | فريق الامتثال |
| company.event_actor.system | System | النظام |
| company.renewal_intro | Enter the renewed licence details, then upload the renewed licence and representative evidence and submit. Your current approval stays in place until the renewal is decided, unless the licence has already expired. | أدخل بيانات الرخصة المجددة، ثم ارفع الرخصة المجددة وإثبات التفويض وأرسل الطلب. تبقى موافقتك الحالية سارية حتى البت في التجديد، ما لم تكن الرخصة قد انتهت. |
| company.renewal_start | Start renewal | بدء التجديد |
| company.renewal_proposed | Proposed licence | الرخصة المقترحة |
| company.confirm_remove_doc | Remove this document? | هل تريد إزالة هذا المستند؟ |
| company.workspace_access | Workspace access | صلاحيات مساحات العمل |
| team.workspace | Workspace | مساحة العمل |
| team.members | Members | الأعضاء |
| team.you | you | أنت |
| team.invite_submit | Send invitation | إرسال الدعوة |
| team.invited | Invitation sent to {email}. | أُرسلت الدعوة إلى {email}. |
| team.pending | Invitations | الدعوات |
| team.revoke_invite | Revoke | إلغاء |
| team.change_role | Change role | تغيير الدور |
| team.revoke_access | Remove access | إزالة الصلاحية |
| team.restore_access | Restore access | استعادة الصلاحية |
| team.confirm_revoke | Remove access for {email}? They lose access immediately. | إزالة صلاحية {email}؟ سيفقد الوصول فوراً. |
| team.confirm_role | Change the role of {email} to {role}? | تغيير دور {email} إلى {role}؟ |
| team.owner_only | Only owners can manage the team. | يمكن للمالكين فقط إدارة الفريق. |
| team.invite_state.PENDING | Pending | معلّقة |
| team.invite_state.ACCEPTED | Accepted | مقبولة |
| team.invite_state.REVOKED | Revoked | ملغاة |
| team.invite_state.EXPIRED | Expired | منتهية |
| team.member_state.ACTIVE | Active | نشط |
| team.member_state.REVOKED | Removed | تمت الإزالة |
| team.expires | Expires | تنتهي |
| settings.profile | Profile | الملف الشخصي |
| settings.language | Language | اللغة |
| settings.password | Change password | تغيير كلمة المرور |
| settings.current_password | Current password | كلمة المرور الحالية |
| settings.password_changed | Password changed. Other sessions were signed out. | تم تغيير كلمة المرور وتسجيل الخروج من الجلسات الأخرى. |
| settings.sessions | Active sessions | الجلسات النشطة |
| settings.sessions_intro | Signed-in browsers and devices. Remove any you do not recognise. | المتصفحات والأجهزة المسجّلة. أزل أي جلسة لا تعرفها. |
| settings.this_device | This session | هذه الجلسة |
| settings.last_seen | Last active | آخر نشاط |
| settings.revoke | Sign out | تسجيل الخروج |
| settings.revoke_others | Sign out all other sessions | تسجيل الخروج من جميع الجلسات الأخرى |
| settings.unknown_device | Unknown device | جهاز غير معروف |
| admin.login_intro | Restricted to platform staff. Two-factor authentication is required. | مخصص لموظفي المنصة. المصادقة الثنائية مطلوبة. |
| admin.mfa_enroll_intro | Scan the QR code with an authenticator app, or enter the key manually, then enter the 6-digit code. | امسح رمز QR بتطبيق المصادقة أو أدخل المفتاح يدوياً، ثم أدخل الرمز المكوّن من 6 أرقام. |
| admin.mfa_secret | Setup key | مفتاح الإعداد |
| admin.mfa_code | 6-digit code | الرمز المكوّن من 6 أرقام |
| admin.mfa_confirm | Confirm and continue | تأكيد ومتابعة |
| admin.mfa_verify_intro | Enter the code from your authenticator app. | أدخل الرمز من تطبيق المصادقة. |
| admin.mfa_use_recovery | Use a recovery code instead | استخدام رمز استرداد بدلاً من ذلك |
| admin.mfa_use_code | Use an authenticator code instead | استخدام رمز التطبيق بدلاً من ذلك |
| admin.recovery_code | Recovery code | رمز الاسترداد |
| admin.verify | Verify | تحقق |
| admin.recovery_intro | Each code works once if you lose your authenticator. Store them somewhere safe. They will not be shown again. | يعمل كل رمز مرة واحدة إذا فقدت تطبيق المصادقة. احفظها في مكان آمن، فلن تظهر مرة أخرى. |
| admin.recovery_remaining | Recovery codes remaining: {count} | رموز الاسترداد المتبقية: {count} |
| admin.generated_at | Figures generated at {time} | تم احتساب الأرقام في {time} |
| admin.kpi.under_review | Under review | قيد المراجعة |
| admin.kpi.needs_info | Waiting on company | بانتظار الشركة |
| admin.kpi.approved | Approved companies | شركات معتمدة |
| admin.kpi.suspended | Suspended companies | شركات معلّقة |
| admin.kpi.draft | Draft companies | شركات بالمسودة |
| admin.kpi.expiring | Licences expiring in 30 days | رخص تنتهي خلال 30 يوماً |
| admin.kpi.company_users | Company users | مستخدمو الشركات |
| admin.kpi.unverified | Unverified emails | بريد غير مؤكد |
| admin.submitted_at | Submitted | تاريخ الإرسال |
| admin.assigned_to | Assigned to | المسؤول |
| admin.unassigned | Unassigned | غير مُسندة |
| admin.case_kind.INITIAL | Initial verification | تحقق أولي |
| admin.case_kind.RENEWAL | Licence renewal | تجديد الرخصة |
| admin.start_review | Start review | بدء المراجعة |
| admin.confirm_decision | Record decision "{decision}" for {company}? | تسجيل القرار "{decision}" لشركة {company}؟ |
| admin.contact | Contact | التواصل |
| admin.terms_version | Terms accepted | الشروط المقبولة |
| admin.search_companies | Name or licence number | الاسم أو رقم الرخصة |
| admin.suspend | Suspend company | تعليق الشركة |
| admin.reactivate | Reactivate company | إعادة تفعيل الشركة |
| admin.members | Members | الأعضاء |
| admin.cases | Verification cases | حالات التحقق |
| admin.search_users | Email contains | البريد يحتوي على |
| admin.account_type | Account type | نوع الحساب |
| admin.account_type.COMPANY | Company user | مستخدم شركة |
| admin.account_type.PLATFORM_ADMIN | Platform admin | مسؤول المنصة |
| admin.email_verified | Email verified | البريد مؤكد |
| admin.sessions | Active sessions | الجلسات النشطة |
| admin.memberships | Memberships | العضويات |
| admin.revoke_sessions | Revoke sessions | إلغاء الجلسات |
| admin.audit_intro | Read-only, append-only record of security and business events. | سجل للقراءة فقط وغير قابل للتعديل لأحداث الأمان والأعمال. |
| admin.action | Action | الإجراء |
| admin.actor | Actor | المنفّذ |
| admin.resource | Resource | المورد |
| admin.time | Time | الوقت |
| admin.request_id | Request ID | معرّف الطلب |
| admin.roles | Roles | الأدوار |
| admin.edit_roles | Edit roles | تعديل الأدوار |
| admin.mfa_enabled | MFA enrolled | المصادقة الثنائية مفعّلة |
| admin.staff_provision_note | New admin accounts are created through the audited provisioning command, never by public registration. | تُنشأ حسابات الإدارة الجديدة عبر أمر التزويد الخاضع للتدقيق، وليس عبر التسجيل العام. |
| kind.BUYER | Buyer | مشتري |
| kind.SELLER | Seller | بائع |
| role.OWNER | Owner | مالك |
| role.PROCUREMENT | Procurement | مشتريات |
| role.VIEWER | Viewer | مشاهد |
| role.SALES | Sales | مبيعات |
| role.WAREHOUSE | Warehouse | مستودع |
| role.FINANCE | Finance | مالية |
| adminrole.COMPLIANCE | Compliance | الامتثال |
| adminrole.SUPPORT | Support | الدعم |
| adminrole.FINANCE | Finance | المالية |
| adminrole.FINANCE_APPROVER | Finance approver | معتمد مالي |
| adminrole.SUPER_ADMIN | Super-admin | مسؤول أعلى |
| doc.TRADE_LICENCE | Trade licence | الرخصة التجارية |
| doc.AUTHORIZED_REPRESENTATIVE | Authorised representative evidence | إثبات الممثل المفوّض |
| doc.OTHER | Other supporting document | مستند داعم آخر |
| emirate.ABU_DHABI | Abu Dhabi | أبوظبي |
| emirate.DUBAI | Dubai | دبي |
| emirate.SHARJAH | Sharjah | الشارقة |
| emirate.AJMAN | Ajman | عجمان |
| emirate.UMM_AL_QUWAIN | Umm Al Quwain | أم القيوين |
| emirate.RAS_AL_KHAIMAH | Ras Al Khaimah | رأس الخيمة |
| emirate.FUJAIRAH | Fujairah | الفجيرة |
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
| mkt.title_short | Marketplace | السوق |
| mkt.search | Search | بحث |
| mkt.search_label | Search the marketplace | البحث في السوق |
| mkt.categories | Categories | الفئات |
| mkt.all_categories | All categories | جميع الفئات |
| mkt.suppliers | Suppliers | الموردون |
| mkt.compare | Compare | المقارنة |
| mkt.recent | Recently viewed | شوهدت مؤخراً |
| mkt.preferences | Preferences | التفضيلات |
| mkt.my_account | My account | حسابي |
| mkt.hero_body | Every supplier on the marketplace holds a valid UAE trade licence and has passed company verification. Prices and stock are shown live from the supplier. | يحمل كل مورد في السوق رخصة تجارية إماراتية سارية واجتاز توثيق الشركة. تُعرض الأسعار والمخزون مباشرة من المورد. |
| mkt.totals | {products} products from {suppliers} verified suppliers | {products} منتج من {suppliers} مورد موثق |
| mkt.priority_categories | Featured categories | فئات مميزة |
| mkt.featured_products | Featured products | منتجات مميزة |
| mkt.featured_suppliers | Featured suppliers | موردون مميزون |
| mkt.featured_label | Featured | مميز |
| mkt.manufacturers | Verified manufacturers | مصنعون موثقون |
| mkt.new_products | New arrivals | وصل حديثاً |
| mkt.for_you | Based on your preferences | بناءً على تفضيلاتك |
| mkt.view_all | View all | عرض الكل |
| mkt.sign_in_prices | Sign in with a verified email to see wholesale prices | سجّل الدخول ببريد موثق لعرض أسعار الجملة |
| mkt.price_from | From {price} | ابتداءً من {price} |
| mkt.price_quote_only | Price on request | السعر عند الطلب |
| mkt.per_unit | per {unit} | لكل {unit} |
| mkt.moq | MOQ {qty} | الحد الأدنى {qty} |
| mkt.moq_label | Minimum order | الحد الأدنى للطلب |
| mkt.increment_label | Order in multiples of | الطلب بمضاعفات |
| mkt.in_stock | In stock | متوفر |
| mkt.out_of_stock | Out of stock | غير متوفر |
| mkt.made_to_order | Made to order | حسب الطلب |
| mkt.ready_stock | Ready stock | مخزون جاهز |
| mkt.lead_time | Lead time {min}–{max} days | مدة التجهيز {min}–{max} يوم |
| mkt.lead_time_label | Production lead time | مدة التصنيع |
| mkt.fulfilment_days | Dispatch within {days} days | الشحن خلال {days} أيام |
| mkt.verified_supplier | Verified supplier | مورد موثق |
| mkt.verified_since | Verified since {date} | موثق منذ {date} |
| mkt.custom | Custom manufacturing | تصنيع حسب الطلب |
| mkt.private_label | Private label | علامة خاصة |
| mkt.white_label | White label | علامة بيضاء |
| mkt.samples | Samples available | تتوفر عينات |
| mkt.products_count | {count} products | {count} منتج |
| mkt.results_count | {count} results | {count} نتيجة |
| mkt.clear_all | Clear all | مسح الكل |
| mkt.filters | Filters | المرشحات |
| mkt.sort | Sort by | الترتيب حسب |
| mkt.sort.relevance | Relevance | الأكثر صلة |
| mkt.sort.newest | Newest | الأحدث |
| mkt.sort.price_asc | Price: low to high | السعر: من الأقل إلى الأعلى |
| mkt.sort.price_desc | Price: high to low | السعر: من الأعلى إلى الأقل |
| mkt.sort.moq_asc | Lowest MOQ | أقل حد أدنى للطلب |
| mkt.view_grid | Grid view | عرض شبكي |
| mkt.view_list | List view | عرض قائمة |
| mkt.filter.category | Category | الفئة |
| mkt.filter.mode | Product type | نوع المنتج |
| mkt.filter.any | Any | الكل |
| mkt.filter.supplier_type | Supplier type | نوع المورد |
| mkt.filter.emirate | Emirate | الإمارة |
| mkt.filter.price_min | Min price (AED) | أدنى سعر (درهم) |
| mkt.filter.price_max | Max price (AED) | أعلى سعر (درهم) |
| mkt.filter.moq_max | MOQ up to | الحد الأدنى للطلب حتى |
| mkt.filter.lead_time_max | Lead time up to (days) | مدة التجهيز حتى (أيام) |
| mkt.filter.delivery_max | Dispatch within (days) | الشحن خلال (أيام) |
| mkt.filter.in_stock | In stock only | المتوفر فقط |
| mkt.filter.verified_note | All suppliers are verified. | جميع الموردين موثقون. |
| mkt.filter.price_locked | Price filters are available after signing in with a verified email. | تتوفر مرشحات السعر بعد تسجيل الدخول ببريد موثق. |
| mkt.suggestions | Suggestions | اقتراحات |
| mkt.load_more | Show more results | عرض مزيد من النتائج |
| mkt.back_to_results | Back to results | العودة إلى النتائج |
| mkt.subcategories | Subcategories | الفئات الفرعية |
| mkt.category_requirements | Supplier requirements | متطلبات المورد |
| mkt.restricted_review | Listings in this category are reviewed and need certification details. | تتم مراجعة المنتجات في هذه الفئة وتتطلب بيانات الشهادات. |
| pd.gallery | Product images | صور المنتج |
| pd.image_n | Image {n} of {total} | الصورة {n} من {total} |
| pd.video | Product video | فيديو المنتج |
| pd.description | Description | الوصف |
| pd.specifications | Specifications | المواصفات |
| pd.attributes | Details | التفاصيل |
| pd.materials | Materials | الخامات |
| pd.dimensions | Dimensions | الأبعاد |
| pd.origin | Country of origin | بلد المنشأ |
| pd.certifications | Certifications (declared by supplier) | الشهادات (حسب إفادة المورد) |
| pd.variants | Variants and wholesale prices | الأصناف وأسعار الجملة |
| pd.sku | SKU | رمز الصنف |
| pd.variant | Variant | الخيار |
| pd.availability | Availability | التوفر |
| pd.tiers | Price tiers | شرائح الأسعار |
| pd.tier_row | {qty}+ : {price} | {qty}+ : {price} |
| pd.customisation | Customisation | التخصيص |
| pd.samples_note | Samples | العينات |
| pd.fulfilment | Fulfilment | التوريد |
| pd.supplier | Supplier | المورد |
| pd.visit_storefront | Visit storefront | زيارة واجهة المتجر |
| pd.related | Related products | منتجات ذات صلة |
| pd.add_compare | Compare | مقارنة |
| pd.in_compare | In comparison | في المقارنة |
| pd.estimate | Price calculator | حاسبة السعر |
| pd.quantity | Quantity | الكمية |
| pd.calculate | Calculate | احسب |
| pd.unit_price | Unit price | سعر الوحدة |
| pd.line_total | Total (excl. VAT and delivery) | الإجمالي (دون ضريبة القيمة المضافة والتوصيل) |
| pd.estimate_note | Indicative price from the supplier’s live tiers. Not an order or a commitment. | سعر استرشادي من شرائح المورد الحالية. ليس طلباً ولا التزاماً. |
| pd.request_quote | Request quotation | طلب عرض سعر |
| pd.buy | Add to order | إضافة إلى الطلب |
| pd.trading.requires_approved_buyer | Quotations and orders are available to verified buyer companies. Complete company verification to trade. | عروض الأسعار والطلبات متاحة لشركات المشترين الموثقة. أكمل توثيق شركتك للتداول. |
| pd.trading.phase_unavailable | Request a quotation from this supplier. Direct ordering opens in a later release. | اطلب عرض سعر من هذا المورد. سيتوفر الطلب المباشر في إصدار لاحق. |
| pd.trading.quote_only | This product is priced on request. Request a quotation to get a price. | سعر هذا المنتج عند الطلب. اطلب عرض سعر للحصول على السعر. |
| pd.sign_in_to_save | Sign in with a verified email to save and compare. | سجّل الدخول ببريد موثق للحفظ والمقارنة. |
| pd.unavailable | No longer available | لم يعد متاحاً |
| pd.selected_variant | Variant | الصنف |
| sup.directory | Supplier directory | دليل الموردين |
| sup.about | About | نبذة |
| sup.capabilities | Capabilities | القدرات |
| sup.capacity | Production capacity | الطاقة الإنتاجية |
| sup.facilities | Factory and warehouse | المصنع والمستودع |
| sup.catalogue | Product catalogue | كتالوج المنتجات |
| sup.year_established | Established {year} | تأسست عام {year} |
| sup.location | Location | الموقع |
| sup.specialisation | Specialisation | التخصص |
| sup.categories | Categories | الفئات |
| sup.private_note | Contact details, documents and bank information are never shown publicly. | لا تُعرض بيانات الاتصال والمستندات والمعلومات المصرفية للعامة أبداً. |
| lists.saved_products | Saved products | المنتجات المحفوظة |
| lists.saved_suppliers | Saved suppliers | الموردون المحفوظون |
| lists.clear_recent | Clear history | مسح السجل |
| lists.compare_limit | You can compare up to 4 products. | يمكنك مقارنة 4 منتجات كحد أقصى. |
| lists.unavailable_item | This listing is no longer available. | لم يعد هذا المنتج متاحاً. |
| lists.prefs_categories | Categories you buy | الفئات التي تشتريها |
| lists.prefs_emirates | Preferred emirates | الإمارات المفضلة |
| lists.prefs_view | Default view | طريقة العرض الافتراضية |
| lists.prefs_sort | Default sort | الترتيب الافتراضي |
| lists.verified_only | Sign in with a verified email to use saved items, comparison and history. | سجّل الدخول ببريد موثق لاستخدام المحفوظات والمقارنة والسجل. |
| btype.MANUFACTURER | Manufacturer | مصنّع |
| btype.FACTORY | Factory | مصنع |
| btype.WHOLESALER | Wholesaler | تاجر جملة |
| btype.DISTRIBUTOR | Distributor | موزع |
| btype.IMPORTER | Importer | مستورد |
| btype.AUTHORIZED_DISTRIBUTOR | Authorised distributor | موزع معتمد |
| btype.TRADING_COMPANY | Trading company | شركة تجارية |
| unit.PIECE | piece | قطعة |
| unit.CARTON | carton | كرتون |
| unit.BOX | box | صندوق |
| unit.PACK | pack | عبوة |
| unit.SET | set | طقم |
| unit.PAIR | pair | زوج |
| unit.ROLL | roll | لفة |
| unit.DOZEN | dozen | دزينة |
| ptype.FIXED | Fixed price | سعر ثابت |
| ptype.TIERED | Tiered price | سعر متدرج |
| ptype.QUOTE_ONLY | Quote only | عند الطلب |
| mode.READY_STOCK | Ready stock | مخزون جاهز |
| mode.MADE_TO_ORDER | Made to order | حسب الطلب |
| restriction.OPEN | Open | مفتوحة |
| restriction.REVIEW_REQUIRED | Review required | تتطلب مراجعة |
| restriction.BLOCKED | Blocked | محظورة |
| mkind.LOGO | Logo | الشعار |
| mkind.COVER | Cover image | صورة الغلاف |
| mkind.FACTORY | Factory photo | صورة المصنع |
| mkind.WAREHOUSE | Warehouse photo | صورة المستودع |
| mkind.OTHER | Other photo | صورة أخرى |
| movement.RECEIVE | Received | استلام |
| movement.RESERVE | Reserved for checkout | محجوز لإتمام الشراء |
| movement.RELEASE_RESERVATION | Reservation released | تم إلغاء الحجز |
| movement.SALE | Sold (paid order) | مباع (طلب مدفوع) |
| movement.REMOVE | Removed | إخراج |
| movement.MARK_UNAVAILABLE | Marked unavailable | تعليم كغير متاح |
| movement.RELEASE_UNAVAILABLE | Released | إتاحة |
| movement.SET_ON_HAND | Stock count | جرد |
| seller.later_phase | Available in a later release | متاح في إصدار لاحق |
| seller.not_seller | This workspace is not a seller workspace. | مساحة العمل هذه ليست مساحة بائع. |
| seller.ineligible | Listing is paused: {reason} | الإدراج متوقف: {reason} |
| seller.eligible | Your company can list products. | يمكن لشركتك إدراج المنتجات. |
| seller.kpi.public | Live on marketplace | منشور في السوق |
| seller.kpi.pending | Pending review | بانتظار المراجعة |
| seller.kpi.draft | Drafts | مسودات |
| seller.kpi.rejected | Needs changes | تحتاج تعديلات |
| seller.kpi.suspended | Suspended | موقوفة |
| seller.kpi.low_stock | Low-stock variants | أصناف منخفضة المخزون |
| seller.kpi.out_of_stock | Out-of-stock variants | أصناف نفد مخزونها |
| seller.recent_decisions | Recent moderation decisions | أحدث قرارات المراجعة |
| seller.storefront_status | Storefront | واجهة المتجر |
| seller.storefront_public | Live | منشورة |
| seller.storefront_not_public | Not live | غير منشورة |
| seller.storefront_hidden | Hidden by the marketplace team | مخفية من قبل فريق السوق |
| seller.open_storefront | Edit storefront | تعديل واجهة المتجر |
| seller.tab.all | All | الكل |
| seller.tab.draft | Drafts | المسودات |
| seller.tab.pending | Pending | بانتظار المراجعة |
| seller.tab.rejected | Rejected | المرفوضة |
| seller.tab.suspended | Suspended | الموقوفة |
| seller.tab.archived | Archived | المؤرشفة |
| seller.search_products | Search your products | ابحث في منتجاتك |
| seller.public_badge | Live | منشور |
| seller.update_pending | Update pending review | تحديث بانتظار المراجعة |
| seller.new_body | Start with the basics. You can add images, variants, prices and stock next. Nothing is visible to buyers until the marketplace team approves it. | ابدأ بالأساسيات. يمكنك بعد ذلك إضافة الصور والأصناف والأسعار والمخزون. لا يظهر شيء للمشترين قبل موافقة فريق السوق. |
| seller.category | Category | الفئة |
| seller.choose_category | Choose a subcategory | اختر فئة فرعية |
| seller.first_sku | SKU code | رمز الصنف |
| seller.unit | Selling unit | وحدة البيع |
| seller.mode | Product type | نوع المنتج |
| seller.title_en | Product name (English) | اسم المنتج (بالإنجليزية) |
| seller.title_ar | Product name (Arabic) | اسم المنتج (بالعربية) |
| seller.desc_en | Description (English) | الوصف (بالإنجليزية) |
| seller.desc_ar | Description (Arabic) | الوصف (بالعربية) |
| seller.content | Listing content | محتوى الإدراج |
| seller.media | Images | الصور |
| seller.upload_image | Upload image | رفع صورة |
| seller.move_up | Move earlier | تقديم |
| seller.move_down | Move later | تأخير |
| seller.remove_image | Remove image | حذف الصورة |
| seller.skus | Variants (SKUs) | الأصناف (SKU) |
| seller.add_sku | Add variant | إضافة صنف |
| seller.variant_attrs | Variant (e.g. colour=Blue, size=M) | الصنف (مثال: اللون=أزرق، المقاس=M) |
| seller.sku_pending | Pending approval | بانتظار الاعتماد |
| seller.sku_active | Active | نشط |
| seller.sku_inactive | Inactive | غير نشط |
| seller.deactivate | Deactivate | إيقاف |
| seller.activate | Activate | تفعيل |
| seller.delete_sku | Delete variant | حذف الصنف |
| seller.pricing | Pricing | الأسعار |
| seller.price_type | Price type | نوع السعر |
| seller.moq | MOQ | الحد الأدنى |
| seller.increment | Increment | المضاعف |
| seller.tier_qty | From quantity | من كمية |
| seller.tier_price | Unit price (AED) | سعر الوحدة (درهم) |
| seller.add_tier | Add tier | إضافة شريحة |
| seller.remove_tier | Remove tier | حذف الشريحة |
| seller.save_pricing | Save pricing | حفظ الأسعار |
| seller.details | Product details | تفاصيل المنتج |
| seller.lead_min | Lead time from (days) | مدة التجهيز من (أيام) |
| seller.lead_max | Lead time to (days) | مدة التجهيز إلى (أيام) |
| seller.fulfilment_days | Dispatch within (days) | الشحن خلال (أيام) |
| seller.country | Country of origin (2-letter code) | بلد المنشأ (رمز من حرفين) |
| seller.materials | Materials | الخامات |
| seller.dimensions | Dimensions | الأبعاد |
| seller.video | Video link (YouTube or Vimeo) | رابط فيديو (YouTube أو Vimeo) |
| seller.sample_note | Sample note | ملاحظة العينات |
| seller.certifications | Certifications (one per line: name \| issuer) | الشهادات (سطر لكل شهادة: الاسم \| الجهة) |
| seller.attributes | Category attributes | سمات الفئة |
| seller.actions | Listing actions | إجراءات الإدراج |
| seller.republish | Republish | إعادة النشر |
| seller.restore | Restore | استعادة |
| seller.duplicate | Duplicate | نسخ |
| seller.preview | View live listing | عرض الإدراج المنشور |
| seller.history | Moderation history | سجل المراجعة |
| seller.decision_reason | Reviewer’s reason | سبب المراجع |
| seller.status_reason | Reason from the marketplace team | السبب من فريق السوق |
| seller.locked | This listing is locked: {status}. | هذا الإدراج مقفل: {status}. |
| seller.filter.all | All variants | جميع الأصناف |
| seller.filter.low | Low stock | مخزون منخفض |
| seller.filter.out | Out of stock | نفد المخزون |
| seller.on_hand | On hand | في المخزن |
| seller.reserved | Reserved | محجوز |
| seller.unavailable | Unavailable | غير متاح |
| seller.available | Available | متاح |
| seller.sold | Sold | مباع |
| seller.adjust | Adjust stock | تعديل المخزون |
| seller.adjust_kind | Adjustment | نوع التعديل |
| seller.adjust_qty | Quantity | الكمية |
| seller.adjust_reason | Reason (recorded) | السبب (يُسجل) |
| seller.low_threshold | Low-stock alert at | تنبيه انخفاض المخزون عند |
| seller.restock_at | Expected restock date | تاريخ إعادة التوريد المتوقع |
| seller.movements | Stock history | سجل المخزون |
| seller.save_settings | Save alert settings | حفظ إعدادات التنبيه |
| seller.pricing_body | Open a product to change its price type, tiers, MOQ and increments. | افتح منتجاً لتغيير نوع السعر والشرائح والحد الأدنى والمضاعفات. |
| seller.unpublish_storefront | Take offline | إيقاف النشر |
| seller.description_en | About your company (English) | نبذة عن شركتك (بالإنجليزية) |
| seller.description_ar | About your company (Arabic) | نبذة عن شركتك (بالعربية) |
| seller.business_type | Business type | نوع النشاط |
| seller.city | City / area | المدينة / المنطقة |
| seller.year | Year established | سنة التأسيس |
| seller.spec_en | Specialisation (English) | التخصص (بالإنجليزية) |
| seller.spec_ar | Specialisation (Arabic) | التخصص (بالعربية) |
| seller.cap_en | Capabilities (English) | القدرات (بالإنجليزية) |
| seller.cap_ar | Capabilities (Arabic) | القدرات (بالعربية) |
| seller.capacity | Production capacity | الطاقة الإنتاجية |
| seller.fulfil_en | Fulfilment (English) | التوريد (بالإنجليزية) |
| seller.fulfil_ar | Fulfilment (Arabic) | التوريد (بالعربية) |
| seller.customisation | Customisation services | خدمات التخصيص |
| seller.image_kind | Image type | نوع الصورة |
| seller.caption | Caption | التعليق |
| seller.go_seller | Seller centre | مركز البائع |
| seller.choose | Select… | اختر… |
| acat.pending_new | New listings pending | إدراجات جديدة بانتظار المراجعة |
| acat.pending_updates | Updates pending | تحديثات بانتظار المراجعة |
| acat.flagged | Flagged by screening | مُعلّمة من الفحص |
| acat.public_products | Live products | منتجات منشورة |
| acat.suspended | Suspended listings | إدراجات موقوفة |
| acat.public_suppliers | Live storefronts | واجهات منشورة |
| acat.hidden_storefronts | Hidden storefronts | واجهات مخفية |
| acat.oldest_pending | Oldest pending since | أقدم طلب منذ |
| acat.queue | Review queue | قائمة المراجعة |
| acat.state_filter | Show | عرض |
| acat.new_listing | New listing | إدراج جديد |
| acat.flags | Screening flags | علامات الفحص |
| acat.changed_fields | Changed fields | الحقول المعدلة |
| acat.live_version | Live version | النسخة المنشورة |
| acat.submitted_version | Submitted version | النسخة المرسلة |
| acat.company_status | Company status | حالة الشركة |
| acat.licence | Licence expiry | انتهاء الرخصة |
| acat.licence_expired | Licence expired | الرخصة منتهية |
| acat.decision | Decision | القرار |
| acat.request_changes | Request changes | طلب تعديلات |
| acat.reason | Reason (sent to the seller) | السبب (يُرسل إلى البائع) |
| acat.decided | Decision recorded. | تم تسجيل القرار. |
| acat.not_pending | This version is not pending review. | هذه النسخة ليست بانتظار المراجعة. |
| acat.search | Search title, company or SKU | ابحث بالعنوان أو الشركة أو رمز الصنف |
| acat.suspend | Suspend | إيقاف |
| acat.restore | Restore | استعادة |
| acat.enforce_reason | Reason (recorded and sent to the seller) | السبب (يُسجل ويُرسل إلى البائع) |
| acat.hidden | Hidden | مخفية |
| acat.visible | Visible | ظاهرة |
| acat.new_category | New category | فئة جديدة |
| acat.parent | Parent category | الفئة الرئيسية |
| acat.top_level | Top level | المستوى الأعلى |
| acat.slug | URL slug | المعرف في الرابط |
| acat.name_en | Name (English) | الاسم (بالإنجليزية) |
| acat.name_ar | Name (Arabic) | الاسم (بالعربية) |
| acat.desc_en | Description (English) | الوصف (بالإنجليزية) |
| acat.desc_ar | Description (Arabic) | الوصف (بالعربية) |
| acat.position | Position | الترتيب |
| acat.visible_label | Visible to buyers | ظاهرة للمشترين |
| acat.priority | Priority category | فئة ذات أولوية |
| acat.restriction | Restriction | القيود |
| acat.req_en | Seller requirements (English) | متطلبات البائع (بالإنجليزية) |
| acat.req_ar | Seller requirements (Arabic) | متطلبات البائع (بالعربية) |
| acat.archived | Archived | مؤرشفة |
| acat.change_reason | Reason (required to hide, archive or change restriction) | السبب (مطلوب للإخفاء أو الأرشفة أو تغيير القيود) |
| acat.listings | Listings | الإدراجات |
| acat.attributes | Attributes | السمات |
| acat.add_attribute | Add attribute | إضافة سمة |
| acat.attr_key | Key | المفتاح |
| acat.attr_type | Type | النوع |
| acat.attr_options | Options (one per line: value \| English \| Arabic) | الخيارات (سطر لكل خيار: القيمة \| الإنجليزية \| العربية) |
| acat.attr_unit | Unit | الوحدة |
| acat.attr_required | Required | إلزامية |
| acat.attr_filterable | Filterable | قابلة للتصفية |
| acat.image | Category image | صورة الفئة |
| acat.restricted_note | Provisional list pending legal approval (A10). BLOCK rejects a submission; REVIEW flags it for moderators. | قائمة مؤقتة بانتظار الموافقة القانونية (A10). «حظر» يرفض الإرسال؛ «مراجعة» يعلّمه للمراجعين. |
| acat.term | Term | الكلمة |
| acat.action | Action | الإجراء |
| acat.note | Note | ملاحظة |
| acat.add_term | Add term | إضافة كلمة |
| acat.active | Active | نشطة |
| acat.inactive | Inactive | غير نشطة |
| acat.featured_note | Featured items are labelled “Featured” for buyers and never change search ranking. | تُعلَّم العناصر المميزة بكلمة «مميز» للمشترين ولا تغيّر ترتيب نتائج البحث. |
| acat.kind | Type | النوع |
| acat.kind.PRODUCT | Product | منتج |
| acat.kind.SUPPLIER | Supplier | مورد |
| acat.target | Product or storefront ID | معرف المنتج أو واجهة المتجر |
| acat.starts | Starts (optional) | يبدأ (اختياري) |
| acat.ends | Ends (optional) | ينتهي (اختياري) |
| acat.add_featured | Add placement | إضافة موضع |
| acat.eligible | Shown | معروض |
| acat.ineligible | Not public (hidden from buyers) | غير منشور (مخفي عن المشترين) |
| acat.scheduled | Scheduled | مجدول |
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
| common.updated_at | Last updated | آخر تحديث |
| seller.add_cert | Add certification | إضافة شهادة |
| seller.add_spec | Add specification | إضافة مواصفة |
| seller.alt_en | Image description (English) | وصف الصورة (بالإنجليزية) |
| seller.alt_ar | Image description (Arabic) | وصف الصورة (بالعربية) |
| seller.cert_issuer | Issuer | جهة الإصدار |
| seller.cert_name | Certification | الشهادة |
| seller.cert_number | Certificate number | رقم الشهادة |
| seller.cert_valid_until | Valid until | صالحة حتى |
| seller.live_note | The approved version stays live while your changes are reviewed. | تبقى النسخة المعتمدة منشورة أثناء مراجعة تعديلاتك. |
| seller.save_first | Save the storefront details first, then add images. | احفظ بيانات واجهة المتجر أولاً ثم أضف الصور. |
| seller.spec_label_en | Label (English) | العنوان (بالإنجليزية) |
| seller.spec_label_ar | Label (Arabic) | العنوان (بالعربية) |
| seller.spec_value | Value | القيمة |
| seller.confirm.republish | Republish the approved version of this listing? | إعادة نشر النسخة المعتمدة من هذا المنتج؟ |
| seller.confirm.restore | Restore this archived listing as a draft? | استعادة هذا المنتج المؤرشف كمسودة؟ |
| seller.confirm.duplicate | Create a new draft copy of this listing? | إنشاء نسخة مسودة جديدة من هذا المنتج؟ |
| admin.orders.intro | All orders across companies, read-only. Opened for support cases. | جميع الطلبات عبر الشركات، للعرض فقط. تُفتح لحالات الدعم. |
| pd.add_to_cart | Add to cart | أضف إلى السلة |
| pd.added_to_cart | Added to your cart. | تمت الإضافة إلى سلتك. |
| pd.view_cart | View cart | عرض السلة |
| pd.out_of_stock_cart | Out of stock. Request a quotation instead. | غير متوفر في المخزون. اطلب عرض سعر بدلاً من ذلك. |
| pd.trading.made_to_order | This product is made to order. Request a quotation for price and lead time. | هذا المنتج يُصنع حسب الطلب. اطلب عرض سعر لمعرفة السعر ومدة التنفيذ. |
| pd.trading.checkout_disabled | Ordering is not available right now. You can request a quotation. | الطلب غير متاح حالياً. يمكنك طلب عرض سعر. |
| rfq.pay_order | Pay for this order | ادفع قيمة هذا الطلب |
| rfq.view_order | View order | عرض الطلب |
| rfq.order_unavailable | No order was created because checkout is not available right now. | لم يتم إنشاء طلب لأن إتمام الشراء غير متاح حالياً. |
| address.manage | Manage addresses | إدارة العناوين |
| address.back_to_checkout | Back to checkout | العودة إلى إتمام الشراء |
| address.default | Default | الافتراضي |
| cart.moq | Minimum {moq}, in steps of {step} | الحد الأدنى {moq}، بزيادات قدرها {step} |
| cart.delivery_fee | Delivery fee per order: | رسوم التوصيل لكل طلب: |
| cart.delivery_days | Delivers in about {count} days | التوصيل خلال {count} يوم تقريباً |
| cart.totals_note | Delivery and tax are calculated at checkout for your address. | يتم احتساب التوصيل والضريبة عند إتمام الشراء حسب عنوانك. |
| cart.issue.unavailable | No longer available | لم يعد متاحاً |
| cart.issue.not_cart_eligible | Request a quotation for this item | اطلب عرض سعر لهذا المنتج |
| cart.issue.moq | Quantity is below the minimum order | الكمية أقل من الحد الأدنى للطلب |
| cart.issue.increment | Quantity does not match the order step | الكمية لا تطابق خطوة الطلب |
| cart.issue.insufficient_stock | Only {available} available | المتوفر {available} فقط |
| order.number | Order | الطلب |
| order.item | Item | المنتج |
| order.items | Items | المنتجات |
| order.quantity | Quantity | الكمية |
| order.unit_price | Unit price | سعر الوحدة |
| order.line_total | Line total | إجمالي البند |
| order.line_count | {count} line(s) | {count} بند |
| order.supplier | Supplier | المورد |
| order.buyer | Buyer | المشتري |
| order.details | Details | التفاصيل |
| order.checkout | Checkout | عملية الشراء |
| order.pay_by | Pay by | آخر موعد للدفع |
| order.confirmed_at | Confirmed | تاريخ التأكيد |
| order.cancel_reason | Cancellation reason | سبب الإلغاء |
| order.commission | Platform commission | عمولة المنصة |
| order.seller_payable | Payable to supplier | المستحق للمورد |
| order.timeline | Timeline | السجل الزمني |
| order.source.CART | Catalogue order | طلب من الكتالوج |
| order.source.QUOTE | From quotation | من عرض سعر |
| order.event.order.created | Order created | تم إنشاء الطلب |
| order.event.order.paid | Payment confirmed | تم تأكيد الدفع |
| order.event.order.cancelled | Order cancelled | تم إلغاء الطلب |
| finance.intro | Read-only view of payment attempts, the operational ledger and reconciliation cases. | عرض للقراءة فقط لمحاولات الدفع والدفتر التشغيلي وحالات التسوية. |
| finance.ledger | Ledger balances | أرصدة الدفتر |
| finance.ledger_note | Operational ledger for marketplace balances, not statutory accounting. | دفتر تشغيلي لأرصدة السوق، وليس محاسبة نظامية. |
| finance.account | Account | الحساب |
| finance.debits | Debits | المدين |
| finance.credits | Credits | الدائن |
| finance.account.psp_clearing | Payment provider clearing | مقاصة مزود الدفع |
| finance.account.seller_payable | Payable to suppliers | مستحقات الموردين |
| finance.account.platform_fee_revenue | Platform commission | عمولة المنصة |
| finance.account.unallocated_receipts | Unallocated receipts (suspense) | مقبوضات غير مخصصة (معلقة) |
| finance.open_cases | Open reconciliation cases: {count} | حالات التسوية المفتوحة: {count} |
| finance.payments | Payment attempts | محاولات الدفع |
| finance.reconciliation | Open reconciliation cases | حالات التسوية المفتوحة |
| finance.reconciliation_note | Late captures, amount mismatches, unknown references and rejected signatures. Resolution tools arrive with refunds. | تحصيل متأخر، عدم تطابق المبلغ، مرجع غير معروف وتوقيعات مرفوضة. أدوات المعالجة تأتي مع الاستردادات. |
| finance.case.LATE_CAPTURE | Captured after checkout closed | تحصيل بعد إغلاق عملية الشراء |
| finance.case.AMOUNT_MISMATCH | Amount or currency mismatch | عدم تطابق المبلغ أو العملة |
| finance.case.UNKNOWN_REFERENCE | Unknown payment reference | مرجع دفع غير معروف |
| finance.case.INVALID_SIGNATURE | Rejected webhook signature | توقيع إشعار مرفوض |
| field.emirate_mismatch | Choose an address in the emirate from your request. | اختر عنواناً في الإمارة المحددة في طلبك. |
| dispute.type.NOT_RECEIVED | Not received | لم يتم الاستلام |
| dispute.type.DAMAGED | Damaged goods | بضائع تالفة |
| dispute.type.WRONG_ITEMS | Wrong items | أصناف خاطئة |
| dispute.type.QUANTITY_SHORT | Short quantity | كمية ناقصة |
| dispute.type.QUALITY | Quality issue | مشكلة في الجودة |
| dispute.type.OTHER | Other | أخرى |
| dispute.proposal.NO_ACTION | No financial action | دون إجراء مالي |
| dispute.proposal.REFUND | Refund | استرداد |
| finance.case.REFUND_FAILED | Refund failed at provider | فشل الاسترداد لدى مزود الدفع |
| finance.case.PAYOUT_FAILED | Payout failed at provider | فشل التحويل لدى مزود الدفع |
| order.event.order.processing | Processing started | بدأ التجهيز |
| order.event.order.dispatched | Dispatched | تم الشحن |
| order.event.order.delivered | Delivery reported by supplier | أبلغ المورد عن التسليم |
| order.event.order.completed | Receipt confirmed by buyer | أكد المشتري الاستلام |
| order.event.order.refunded | Refund confirmed by provider | أكد مزود الدفع الاسترداد |
| order.event.order.paid_out | Paid out to supplier | تم التحويل إلى المورد |
| order.event.dispute.opened | Dispute opened | تم فتح نزاع |
| ful.dispatched_at | Dispatched | تاريخ الشحن |
| ful.delivered_at | Delivered | تاريخ التسليم |
| ful.proof | Proof of delivery | إثبات التسليم |
| ful.download_proof | Download proof | تنزيل الإثبات |
| ful.settlement | Settlement | التسوية |
| ful.refunded | Refunded so far | المسترد حتى الآن |
| ful.completed_at | Receipt confirmed | تأكيد الاستلام |
| ful.full_shipment | All ordered quantities ship together in one shipment. | تُشحن جميع الكميات المطلوبة معاً في شحنة واحدة. |
| review.rating_n | {count} out of 5 | {count} من 5 |
| review.yours | Your review | تقييمك |
| review.public_note | Reviews are shown publicly without your company name. | تُعرض التقييمات للعامة دون اسم شركتك. |
| review.section | Buyer reviews | تقييمات المشترين |
| review.average | Average {avg} from {count} reviews | المتوسط {avg} من {count} تقييمات |
| review.verified_buyer | Verified buyer | مشترٍ موثق |
| review.reason | Reason (recorded in the audit log) | السبب (يُسجل في سجل التدقيق) |
| review.admin_intro | Buyer reviews of suppliers. Hide reviews that break the content rules; the text is never edited. | تقييمات المشترين للموردين. أخفِ التقييمات المخالفة لقواعد المحتوى؛ لا يتم تعديل النص أبداً. |
| dispute.window_note | Disputes can be opened until 14 days after receipt is confirmed and never after the supplier is paid out. | يمكن فتح النزاع خلال 14 يوماً من تأكيد الاستلام، ولا يمكن فتحه بعد التحويل إلى المورد. |
| dispute.view | View dispute {number} | عرض النزاع {number} |
| dispute.list_intro | Disputes on orders for this workspace. | النزاعات على طلبات مساحة العمل هذه. |
| dispute.col | Dispute | النزاع |
| dispute.order | Order | الطلب |
| dispute.opened_by | Opened by | فتحه |
| dispute.messages | Messages and evidence | الرسائل والأدلة |
| dispute.closed_note | This dispute is closed. | هذا النزاع مغلق. |
| dispute.resolution | Resolution | الحل |
| dispute.proposal | Proposed resolution | الحل المقترح |
| dispute.proposal_amount | Proposed refund | الاسترداد المقترح |
| dispute.refunds | Refunds | المبالغ المستردة |
| dispute.held_note | Payout for this order is held while the dispute is open. | التحويل لهذا الطلب معلّق ما دام النزاع مفتوحاً. |
| dispute.filter_all | All states | جميع الحالات |
| dispute.filter_mine | Assigned to me | المسندة إليّ |
| dispute.assigned | Assigned | مسند |
| dispute.unassigned | Unassigned | غير مسند |
| dispute.note | Note to both parties | ملاحظة للطرفين |
| dispute.admin_intro | Support reviews evidence and proposes an outcome. Refunds go to finance for dual approval and close the dispute when the provider confirms. | يراجع فريق الدعم الأدلة ويقترح النتيجة. تُحال المبالغ المستردة إلى المالية لموافقة شخصين، ويُغلق النزاع عند تأكيد مزود الدفع. |
| dispute.author.BUYER | Buyer | المشتري |
| dispute.author.SELLER | Supplier | المورد |
| dispute.author.ADMIN | Platform support | دعم المنصة |
| dispute.author.SYSTEM | System | النظام |
| refund.requested_by | Requested by | طلبه |
| refund.approved_by | Decided by | قرره |
| refund.commission_share | Commission share | حصة العمولة |
| refund.decision_reason | Reason for the decision | سبب القرار |
| refund.self_note | You requested this; another finance user must decide. | أنت من طلب هذا؛ يجب أن يقرر مستخدم مالية آخر. |
| payout.eligible | Eligible suppliers | الموردون المؤهلون |
| payout.orders | Orders | الطلبات |
| payout.list | Payouts | التحويلات |
| payout.paid_at | Paid | تاريخ الدفع |
| sfin.gross | Paid order value | قيمة الطلبات المدفوعة |
| sfin.commission | Platform commission | عمولة المنصة |
| sfin.refunded | Refunded to buyers | المسترد للمشترين |
| sfin.net | Net payable | صافي المستحق |
| sfin.not_yet | Not yet eligible (awaiting receipt) | غير مؤهل بعد (بانتظار الاستلام) |
| sfin.eligible | Eligible for payout | مؤهل للتحويل |
| sfin.held | Held by disputes | معلّق بسبب نزاعات |
| sfin.in_payout | In payout | قيد التحويل |
| sfin.paid_out | Paid out | تم التحويل |
| sfin.payouts | Payouts | التحويلات |
| support.admin_intro | Customer tickets from buyer and seller workspaces. Take a ticket before replying; the customer sees replies as “Support”. | تذاكر العملاء من مساحات المشترين والموردين. استلم التذكرة قبل الرد؛ يرى العميل الردود باسم «الدعم». |
| support.category.ACCOUNT | Account and access | الحساب والدخول |
| support.category.VERIFICATION | Company verification | التحقق من الشركة |
| support.category.ORDER | Order | طلب شراء |
| support.category.PAYMENT | Payment or refund | دفع أو استرداد |
| support.category.RFQ | Request for quotation | طلب عرض سعر |
| support.category.CATALOG | Products and storefront | المنتجات والمتجر |
| support.category.OTHER | Something else | موضوع آخر |
| support.filter_all | All | الكل |
| support.col | Ticket | التذكرة |
| support.company | Company | الشركة |
| support.kind.BUYER | Buyer | مشترٍ |
| support.kind.SELLER | Seller | مورد |
| support.assigned | Assigned | مُسندة |
| support.assigned_mine | Mine | تذاكري |
| support.unassigned | Unassigned | غير مُسندة |
| support.filter_assigned | Assignment | الإسناد |
| support.filter_any | Any | الكل |
| support.updated | Updated | آخر تحديث |
| support.messages | Conversation | المحادثة |
| support.author.CUSTOMER | Customer | العميل |
| support.author.ADMIN | Support | الدعم |
| support.author.SYSTEM | System | النظام |
| support.take_over | Take over ticket | تولي التذكرة |
| support.resolve_note | Resolution note (optional, sent to the customer) | ملاحظة الحل (اختيارية، تُرسل إلى العميل) |
| support.closed_note | This ticket is closed. | هذه التذكرة مغلقة. |
| support.resolved_note | Support marked this resolved. Reopen it if the problem is not solved, or close it. | حدد الدعم هذه التذكرة كمحلولة. أعد فتحها إذا لم تُحل المشكلة، أو أغلقها. |
| support.readonly_note | Your role can read tickets but not write to them. | يتيح دورك قراءة التذاكر دون الكتابة فيها. |
| support.not_mine_note | Another agent holds this ticket. Take it over to reply. | هذه التذكرة لدى موظف آخر. تولَّها لتتمكن من الرد. |
| support.contact | Contact support about this order | تواصل مع الدعم بشأن هذا الطلب |
| settings.pref.email_marketing | Product news and offers (marketing) | أخبار المنتج والعروض (تسويقية) |
| ops.range | Period (Dubai dates) | الفترة (بتوقيت دبي) |
| ops.from | From | من |
| ops.to | To | إلى |
| ops.commerce | Commerce | التجارة |
| ops.sandbox | Sandbox data: payments, refunds and payouts here went through the test provider. No real money moved. | بيانات تجريبية: تمت المدفوعات والاستردادات والتحويلات هنا عبر مزود الاختبار. لم تُنقل أموال حقيقية. |
| ops.paid_orders | Paid orders | الطلبات المدفوعة |
| ops.gmv | Gross order value | إجمالي قيمة الطلبات |
| ops.refunds | Refunded | المبالغ المستردة |
| ops.net | Net of refunds | الصافي بعد الاسترداد |
| ops.fee_revenue | Platform fees (net) | رسوم المنصة (صافي) |
| ops.payable_pending | Owed to sellers now | المستحق للموردين حالياً |
| ops.payable_settled | Paid out to sellers | المحوّل إلى الموردين |
| ops.cases | Queues | قوائم العمل |
| ops.open_disputes | Open disputes | النزاعات المفتوحة |
| ops.unassigned_disputes | Unassigned disputes | نزاعات غير مُسندة |
| ops.open_support | Open support tickets | تذاكر الدعم المفتوحة |
| ops.unassigned_support | Unassigned tickets | تذاكر غير مُسندة |
| ops.open_reconciliation | Open reconciliation cases | حالات التسوية المفتوحة |
| ops.quarantined | Quarantined webhooks (7 days) | إشعارات دفع معزولة (7 أيام) |
| ops.refunds_waiting | Refunds awaiting approval | استردادات بانتظار الموافقة |
| ops.payouts_waiting | Payouts awaiting approval | تحويلات بانتظار الموافقة |
| ops.range_note | Figures for {from} to {to}. Owed to sellers is the balance right now. | الأرقام من {from} إلى {to}. المستحق للموردين هو الرصيد الحالي. |
| export.type.orders | Orders | الطلبات |
| export.type.refunds | Refunds | الاستردادات |
| export.type.payouts | Payouts | التحويلات |
| export.type.disputes | Disputes | النزاعات |
| export.type.support_tickets | Support tickets | تذاكر الدعم |
| export.scope.assigned | Assigned to me | المُسندة إليّ |
| export.scope.all | All records | جميع السجلات |
| export.rows | Rows | الصفوف |
| export.period | Period | الفترة |
| export.expires | Available until | متاح حتى |
| export.downloaded | Downloaded | تم التنزيل |
| field.not_found | Not found in this workspace. | غير موجود في مساحة العمل هذه. |
| field.range_too_long | The period can be at most 366 days. | لا يمكن أن تتجاوز الفترة 366 يوماً. |
| field.too_many_rows | Too many rows. Choose a shorter period. | عدد الصفوف كبير. اختر فترة أقصر. |
| rfq.visibility.POOL | Matching suppliers | الموردون المطابقون |
| rfq.visibility.INVITE | Invited suppliers only | الموردون المدعوون فقط |
| rfq.visibility_hint.POOL | Verified suppliers with public listings in this category can see and quote. You can also invite suppliers. | يمكن للموردين الموثقين الذين لديهم منتجات منشورة في هذه الفئة رؤية الطلب وتقديم عروض. ويمكنك أيضاً دعوة موردين. |
| rfq.visibility_hint.INVITE | Only the suppliers you invite can see and quote. | لا يرى الطلب ولا يقدّم عروضاً إلا الموردون الذين تدعوهم. |
| tax.STANDARD | Standard rate | النسبة الأساسية |
| tax.ZERO_RATED | Zero-rated | خاضع لنسبة الصفر |
| tax.EXEMPT | Exempt | معفى |
| rfq.event.rfq.created | Request created | تم إنشاء الطلب |
| rfq.event.rfq.published | Request published | تم نشر الطلب |
| rfq.event.rfq.cancelled | Request cancelled | تم إلغاء الطلب |
| rfq.event.rfq.expired | Request expired | انتهى الطلب |
| rfq.event.rfq.awarded | Quote accepted | تم قبول عرض |
| rfq.event.rfq.hidden | Hidden by the platform | أخفته المنصة |
| rfq.event.rfq.unhidden | Restored by the platform | أعادته المنصة |
| rfq.event.quote.submitted | Quote submitted | تم تقديم عرض |
| rfq.event.quote.revised | Quote revised | تم تعديل عرض |
| rfq.event.quote.withdrawn | Quote withdrawn | تم سحب عرض |
| rfq.event.quote.declined | Quote declined | تم رفض عرض |
| rfq.event.quote.revision_requested | Revision requested | طُلب تعديل العرض |
| rfq.event.quote.expired | Quote expired | انتهت صلاحية عرض |
| rfq.side.BUYER | Buyer | المشتري |
| rfq.side.SELLER | Supplier | المورد |
| rfq.side.SYSTEM | System | النظام |
| rfq.side.ADMIN | Platform | المنصة |
| rfq.number | Reference | المرجع |
| rfq.choose_category | Choose a category | اختر فئة |
| rfq.deadline | Quote deadline | آخر موعد للعروض |
| rfq.budget | Budget | الميزانية |
| rfq.buyer | Buyer | المشتري |
| rfq.add_attachment | Add attachment | إضافة مرفق |
| rfq.quotes | Quotes | العروض |
| rfq.compare_caption | Current quote from each supplier | العرض الحالي من كل مورد |
| rfq.lowest_total | Lowest total | أقل إجمالي |
| rfq.all | All | الكل |
| rfq.cannot_create | Your role can view requests but not create them. Ask an owner or procurement member. | يسمح دورك بعرض الطلبات دون إنشائها. اطلب ذلك من المالك أو أحد أعضاء المشتريات. |
| rfq.invite_suppliers | Invite suppliers | دعوة موردين |
| rfq.search_suppliers | Search suppliers | ابحث عن موردين |
| rfq.invited_count | {count} invited | تمت دعوة {count} |
| rfq.invited_suppliers | Invited suppliers | الموردون المدعوون |
| rfq.need_buyer_body | Requests for quotation are sent from a verified buyer company by an owner or procurement member. | تُرسل طلبات عروض الأسعار من شركة مشترية موثقة بواسطة المالك أو أحد أعضاء المشتريات. |
| rfq.publish_body_invite | The invited suppliers will be notified and can quote until the deadline. | سيُبلَّغ الموردون المدعوون ويمكنهم تقديم عروض حتى الموعد النهائي. |
| rfq.publish_body_pool | Matching verified suppliers and any invited suppliers will be notified and can quote until the deadline. | سيُبلَّغ الموردون الموثقون المطابقون وأي موردين مدعوين، ويمكنهم تقديم عروض حتى الموعد النهائي. |
| rfq.cancelled_reason | Cancelled: {reason} | ملغى: {reason} |
| rfq.hidden_notice | The platform has hidden this request from suppliers while it is reviewed. Contact support if you think this is a mistake. | أخفت المنصة هذا الطلب عن الموردين أثناء مراجعته. تواصل مع الدعم إذا كنت تعتقد أن ذلك خطأ. |
| rfq.awarded_body | Payment is due by {due} (Dubai time). | موعد الدفع قبل {due} (بتوقيت دبي). |
| rfq.award_total | Accepted total: | الإجمالي المقبول: |
| rfq.timeline | History | السجل |
| quote.supplier | Supplier | المورد |
| quote.version | Version | النسخة |
| quote.quantity | Quantity | الكمية |
| quote.unit_price | Unit price | سعر الوحدة |
| quote.subtotal | Subtotal | المجموع الفرعي |
| quote.shipping | Shipping | الشحن |
| quote.tax | Tax | الضريبة |
| quote.total | Total | الإجمالي |
| quote.days | {count} days | {count} يوم |
| quote.valid_until | Valid until | صالح حتى |
| quote.preview_before_tax | Subtotal plus shipping: AED {amount} before tax. | المجموع الفرعي مع الشحن: {amount} درهم قبل الضريبة. |
| quote.preview_unavailable | Enter quantity and prices to see the amount before tax. | أدخل الكمية والأسعار لعرض المبلغ قبل الضريبة. |
| quote.revision_requested | Revision requested | طُلب التعديل |
| quote.details | Details | التفاصيل |
| quote.history | Earlier versions ({count}) | نسخ سابقة ({count}) |
| quote.accept_note | Totals are taken from the supplier’s submitted version, not from this page. | تؤخذ المبالغ من النسخة المقدمة من المورد، لا من هذه الصفحة. |
| seller.rfq.scope.all | All | الكل |
| seller.rfq.scope.invited | Invited | مدعو |
| seller.rfq.scope.pool | Matching | مطابقة |
| seller.rfq.scope.quoted | Quoted | قدّمت عرضاً |
| seller.rfq.search | Search by title or reference | ابحث بالعنوان أو المرجع |
| seller.rfq.invited | Invited | مدعو |
| seller.rfq.my_quote | Your quote | عرضك |
| seller.rfq.not_quoted | Not quoted | لم تقدّم عرضاً |
| seller.quote.edit | Edit draft | تعديل المسودة |
| seller.quote.submitted_at | submitted {at} | قُدّم في {at} |
| messages.message_supplier | Message supplier | مراسلة المورد |
| messages.rfq_opening | Hello, I have a question about your quote. | مرحباً، لدي سؤال حول عرضكم. |
| messages.your_message | Your message | رسالتك |
| messages.you | You | أنت |
| messages.attachment | Attachment | مرفق |
| messages.thread | Conversation | المحادثة |
| messages.load_older | Load earlier messages | تحميل الرسائل السابقة |
| messages.privacy_note | Messages are visible to members of both companies who handle trading. Do not share passwords or payment details. | تظهر الرسائل لأعضاء الشركتين المسؤولين عن التداول. لا تشارك كلمات المرور أو بيانات الدفع. |
| messages.need_buyer_body | Messages to suppliers are sent from a verified buyer company. | تُرسل الرسائل إلى الموردين من شركة مشترية موثقة. |
| settings.email_prefs | Email notifications | إشعارات البريد الإلكتروني |
| settings.pref.email_rfqs | Requests for quotation (invitations, cancellations) | طلبات عروض الأسعار (الدعوات والإلغاء) |
| settings.pref.email_quotes | Quotes (submitted, revised, accepted, declined) | العروض (التقديم والتعديل والقبول والرفض) |
| settings.pref.email_messages | New messages | الرسائل الجديدة |
| admin.rfq.intro | Request metadata for moderation. Quote prices stay private to buyer and supplier. | بيانات الطلبات للإشراف. تبقى أسعار العروض خاصة بالمشتري والمورد. |
| admin.rfq.search | Search by title, reference or buyer | ابحث بالعنوان أو المرجع أو المشتري |
| admin.rfq.prices_private | Quote prices and documents are not shown to platform staff. | لا تظهر أسعار العروض ومستنداتها لموظفي المنصة. |
