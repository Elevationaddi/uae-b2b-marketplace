/**
 * Phase 8 catalogue (founder decisions of 28 November 2026): verified delivery and the dispute
 * window, settlement holds, the weekly payout run, the commission policy and refund splits.
 */
export const financialPolicyEn = {
  'order.reason.cancelled_by_supplier': 'Cancelled by the supplier (refunded in full)',
  'bcancel.request': 'Request cancellation',
  'bcancel.request_title': 'Ask to cancel order {number}?',
  'bcancel.request_body':
    'You can ask to cancel before the order is dispatched. Ready-stock orders go to a full refund that finance reviews. Custom or made-to-order goods are reviewed by the supplier first and are never refunded automatically.',
  'bcancel.reason': 'Reason',
  'bcancel.accept': 'Accept cancellation',
  'bcancel.accept_title': 'Accept the buyer’s cancellation of {number}?',
  'bcancel.accept_body':
    'A full refund is requested for finance approval. You cannot process or dispatch the order while it is pending.',
  'bcancel.note': 'Note for the buyer',
  'bcancel.decline': 'Decline cancellation',
  'bcancel.decline_title': 'Decline the buyer’s cancellation of {number}?',
  'bcancel.decline_body': 'The order stays active and you can continue fulfilment.',
  'bcancel.decline_reason': 'Reason for the buyer',
  'bcancel.state.SUPPLIER_REVIEW':
    'The buyer asked to cancel on {date}: {reason}. Waiting for the supplier’s decision.',
  'bcancel.state.REFUND_REVIEW':
    'The buyer asked to cancel on {date}: {reason}. A full refund is awaiting finance approval.',
  'bcancel.state.DECLINED': 'The cancellation requested on {date} was declined.',
  'bcancel.state.REFUNDED': 'Cancelled at the buyer’s request and refunded in full.',
  'order.event.order.buyer_cancel_requested': 'Buyer asked to cancel',
  'order.event.order.buyer_cancel_accepted': 'Supplier accepted the cancellation; full refund requested',
  'order.event.order.buyer_cancel_declined': 'Supplier declined the cancellation',
  'order.event.order.buyer_cancel_rejected': 'Finance refused the cancellation refund',
  'notif.type.order.buyer_cancel_requested':
    'The buyer asked to cancel {number}; a full refund is awaiting approval',
  'notif.type.order.buyer_cancel_review': 'The buyer asked to cancel {number}; please decide',
  'notif.type.order.cancel_declined': 'Your cancellation of {number} was declined',
  'notif.type.order.cancel_refund_review':
    'The supplier accepted your cancellation of {number}; the refund awaits approval',
  'error.order.cancel_after_dispatch': 'Orders can only be cancelled before dispatch.',
  'error.order.cancel_already_requested': 'A cancellation was already requested for this order.',
  'order.reason.refunded_in_full': 'Refunded in full',
  'order.event.order.seller_cancel_requested': 'Supplier asked to cancel; full refund requested',
  'order.event.order.seller_cancel_rejected': 'Finance refused the supplier’s cancellation',
  'notif.type.order.supplier_cancelled':
    'The supplier asked to cancel {number}; a full refund is awaiting approval',
  'order.cancel': 'Cancel order',
  'order.cancel_title': 'Cancel order {number}?',
  'order.cancel_body':
    'The buyer is refunded in full to the original payment method once finance approves. You can no longer process or dispatch this order while the cancellation is pending.',
  'order.cancel_reason': 'Reason for the buyer',
  'order.cancel_pending':
    'Cancellation requested on {date}: {reason}. A full refund is awaiting finance approval.',
  'error.order.cancellation_pending': 'A cancellation is pending for this order.',
  'storefront.return_policy_en': 'Return policy (English)',
  'storefront.return_policy_ar': 'Return policy (Arabic)',
  'storefront.return_policy_hint':
    'Shown to buyers before they pay. Say whether change-of-mind returns are accepted, the time limit and the condition required. Customised goods are generally excluded.',
  'checkout.return_policy': 'Returns',
  'checkout.no_return_policy':
    'This supplier has not stated a return policy. Change-of-mind returns may not be accepted; disputes still cover damaged, wrong, short or missing goods.',
  'admin.nav.holds': 'Settlement holds',
  'admin.nav.commission': 'Commission',

  'ful.delivery_verified': 'Delivery verified',
  'ful.verified.PROOF_OF_DELIVERY': '{date} (proof of delivery)',
  'ful.verified.BUYER_CONFIRMED': '{date} (buyer confirmed receipt)',
  'ful.window_ends': 'Dispute window',
  'ful.window_open': 'Open until {date}',
  'ful.window_closed': 'Ended {date}',
  'ful.window_pending': 'Starts when delivery is verified (proof of delivery or buyer receipt)',

  'refund.split_title': 'Which part of the order does this cover? (optional)',
  'refund.split_hint':
    'Leave all three blank to spread the refund over merchandise, delivery and VAT in proportion. Commission is reversed only on the merchandise part.',
  'refund.merchandise': 'Merchandise (AED)',
  'refund.shipping': 'Delivery (AED)',
  'refund.tax': 'VAT (AED)',
  'refund.parts': 'Merchandise {merchandise} · Delivery {shipping} · VAT {tax}',
  'refund.parts_legacy': 'Split in proportion to the order total (before Phase 8)',
  'field.split_mismatch': 'The three parts must add up to the refund amount.',

  'payout.run_title': 'This week’s payout run',
  'payout.run_week': 'Week of {start} to {end} (Dubai)',
  'payout.run_note':
    'Payouts are made weekly: at most one payout per supplier per week, approved by a second finance user. Orders become eligible only after verified delivery and the end of the dispute window, with no dispute, hold, open reconciliation case or pending refund.',
  'payout.run_count': 'Payouts this week',
  'payout.run_amount': 'Requested this week',
  'payout.available': 'Available provider balance',
  'payout.available_sandbox': 'SANDBOX: worked out from the ledger, not reported by a provider.',
  'payout.week': 'Week of {date}',

  'hold.title': 'Settlement holds',
  'hold.intro':
    'A hold stops an order’s supplier payout until it is released. Use it for compliance, fraud, reconciliation or payment investigations. Every hold and release is recorded with its reason.',
  'hold.place': 'Place a hold',
  'hold.order_id': 'Order ID',
  'hold.kind': 'Type',
  'hold.reason': 'Reason',
  'hold.placed': 'Hold placed. The order cannot be paid out until it is released.',
  'hold.kind.COMPLIANCE': 'Compliance',
  'hold.kind.FRAUD': 'Fraud',
  'hold.kind.RECONCILIATION': 'Reconciliation',
  'hold.kind.PAYMENT_INVESTIGATION': 'Payment investigation',
  'hold.filter.active': 'Active',
  'hold.filter.released': 'Released',
  'hold.empty': 'No holds.',
  'hold.placed_by': 'Placed by {name}',
  'hold.released_by': 'Released by {name}',
  'hold.release': 'Release',
  'hold.release_title': 'Release the hold on {number}?',
  'hold.release_reason': 'Reason for releasing',
  'hold.order': 'Order',

  'commission.title': 'Commission',
  'commission.intro':
    'The platform commission is a percentage of merchandise value, excluding VAT and delivery. A new rate applies to checkouts created from its effective date, at least 30 days after it is recorded, and every supplier is notified; existing orders keep the rate they were priced with.',
  'commission.current': 'Current rate',
  'commission.source.policy': 'Policy version {version}',
  'commission.source.configuration': 'From configuration (no policy version recorded yet)',
  'commission.new': 'Record a new rate',
  'commission.rate': 'Rate (%)',
  'commission.rate_hint': 'For example 10 or 7.5. At most 50%.',
  'commission.reason': 'Reason for the change',
  'commission.totp': 'Authenticator code',
  'commission.save': 'Save new rate',
  'commission.saved':
    'New commission rate recorded. Suppliers have been notified; it applies to checkouts from its effective date.',
  'commission.history': 'History',
  'commission.empty': 'No policy versions recorded yet.',
  'commission.readonly': 'Only a finance approver can change the rate.',
  'commission.version': 'Version {version}',

  'finance.resolve': 'Resolve',
  'finance.resolve_title': 'Resolve this reconciliation case?',
  'finance.resolution': 'How was it resolved?',

  'error.refund.exceeds_component':
    'A part is more than what remains refundable of it, or the parts do not add up to the amount.',
  'error.payout.already_in_run': 'This supplier already has a payout in this week’s run.',
  'error.payout.order_held':
    'An order in this payout is on hold, has an open reconciliation case or pending refund, or is still inside its dispute window.',
  'error.payout.order_changed':
    'An order in this payout changed after it was requested. Reject it and request again.',
  'error.payout.insufficient_balance':
    'The available provider balance is lower than this payout. It cannot be approved now.',
  'error.hold.order_paid_out': 'This order has already been paid out.',
  'error.hold.exists': 'This order already has an active hold of that type.',
  'error.hold.already_released': 'This hold has already been released.',
  'error.reconciliation.not_open': 'This case is already resolved.',

  'payout.state.PROPOSED': 'Proposed by the schedule',
  'payout.scheduled_for': 'Scheduled run',
  'payout.next_run': 'Next week’s run',
  'payout.proposal_status': 'Schedule',
  'payout.proposed_on': '{count} payouts proposed on {date}',
  'payout.not_proposed': 'Not proposed yet',
  'payout.proposed_by_schedule': 'Weekly schedule',
  'payout.confirm': 'Confirm',
  'payout.confirm_title': 'Confirm payout {number}?',
  'payout.confirm_body':
    'Confirming makes you the requester. A different finance approver must still approve it before anything is sent to the provider.',
  'payout.withdraw': 'Withdraw',
  'payout.withdraw_title': 'Withdraw proposed payout {number}?',
  'payout.holidays': 'UAE public holidays',
  'payout.holidays_note':
    'A payout run due on a weekend or a recorded holiday moves to the next working day. Record each public holiday once it is announced.',
  'payout.holidays_empty': 'No holidays recorded.',
  'payout.holiday_date': 'Date',
  'payout.holiday_name': 'Holiday name',
  'payout.holiday_add': 'Add holiday',
  'payout.holiday_remove': 'Remove',
  'payout.holiday_remove_title': 'Remove the holiday on {date}?',
  'error.payout_holiday.exists': 'A holiday is already recorded on that date.',
  'commission.effective_from': 'Effective from',
  'commission.effective_hint':
    'Suppliers get at least {days} days’ notice. Earliest: {date} (Dubai).',
  'commission.scheduled': 'Scheduled',
  'error.commission.notice_too_short':
    'The effective date must give suppliers the full notice period.',
  'notif.type.commission.change_scheduled':
    'The platform commission changes to {rate} from {date}. Orders placed before then keep their rate.',
} as const;

export const financialPolicyAr: Record<keyof typeof financialPolicyEn, string> = {
  'order.reason.cancelled_by_supplier': 'ألغاه المورد (استرداد كامل)',
  'bcancel.request': 'طلب الإلغاء',
  'bcancel.request_title': 'هل تريد طلب إلغاء الطلب {number}؟',
  'bcancel.request_body':
    'يمكنك طلب الإلغاء قبل شحن الطلب. تُحال طلبات البضاعة الجاهزة إلى استرداد كامل تراجعه المالية. أما البضائع المخصصة أو المصنوعة حسب الطلب فيراجعها المورد أولاً ولا تُسترد تلقائياً.',
  'bcancel.reason': 'السبب',
  'bcancel.accept': 'قبول الإلغاء',
  'bcancel.accept_title': 'هل تقبل طلب المشتري إلغاء {number}؟',
  'bcancel.accept_body':
    'سيُطلب استرداد كامل بموافقة المالية. لا يمكنك تجهيز الطلب أو شحنه أثناء انتظار القرار.',
  'bcancel.note': 'ملاحظة للمشتري',
  'bcancel.decline': 'رفض الإلغاء',
  'bcancel.decline_title': 'هل ترفض طلب المشتري إلغاء {number}؟',
  'bcancel.decline_body': 'يبقى الطلب نشطاً ويمكنك متابعة التنفيذ.',
  'bcancel.decline_reason': 'السبب للمشتري',
  'bcancel.state.SUPPLIER_REVIEW': 'طلب المشتري الإلغاء في {date}: {reason}. بانتظار قرار المورد.',
  'bcancel.state.REFUND_REVIEW':
    'طلب المشتري الإلغاء في {date}: {reason}. الاسترداد الكامل بانتظار موافقة المالية.',
  'bcancel.state.DECLINED': 'رُفض طلب الإلغاء المقدم في {date}.',
  'bcancel.state.REFUNDED': 'أُلغي بطلب المشتري واسترد المبلغ بالكامل.',
  'order.event.order.buyer_cancel_requested': 'طلب المشتري الإلغاء',
  'order.event.order.buyer_cancel_accepted': 'قبل المورد الإلغاء؛ وطُلب استرداد كامل',
  'order.event.order.buyer_cancel_declined': 'رفض المورد الإلغاء',
  'order.event.order.buyer_cancel_rejected': 'رفضت المالية استرداد الإلغاء',
  'notif.type.order.buyer_cancel_requested':
    'طلب المشتري إلغاء {number}؛ والاسترداد الكامل بانتظار الموافقة',
  'notif.type.order.buyer_cancel_review': 'طلب المشتري إلغاء {number}؛ يرجى اتخاذ القرار',
  'notif.type.order.cancel_declined': 'رُفض طلب إلغاء {number}',
  'notif.type.order.cancel_refund_review': 'قبل المورد إلغاء {number}؛ والاسترداد بانتظار الموافقة',
  'error.order.cancel_after_dispatch': 'لا يمكن إلغاء الطلب إلا قبل الشحن.',
  'error.order.cancel_already_requested': 'سبق طلب إلغاء هذا الطلب.',
  'order.reason.refunded_in_full': 'تم الاسترداد بالكامل',
  'order.event.order.seller_cancel_requested': 'طلب المورد الإلغاء؛ وطُلب استرداد كامل',
  'order.event.order.seller_cancel_rejected': 'رفضت المالية إلغاء المورد',
  'notif.type.order.supplier_cancelled':
    'طلب المورد إلغاء الطلب {number}؛ والاسترداد الكامل بانتظار الموافقة',
  'order.cancel': 'إلغاء الطلب',
  'order.cancel_title': 'إلغاء الطلب {number}؟',
  'order.cancel_body':
    'يُسترد المبلغ كاملاً للمشتري إلى وسيلة الدفع الأصلية بعد موافقة المالية. لا يمكنك تجهيز الطلب أو شحنه أثناء انتظار الإلغاء.',
  'order.cancel_reason': 'السبب للمشتري',
  'order.cancel_pending':
    'طُلب الإلغاء في {date}: {reason}. الاسترداد الكامل بانتظار موافقة المالية.',
  'error.order.cancellation_pending': 'يوجد طلب إلغاء قيد الانتظار لهذا الطلب.',
  'storefront.return_policy_en': 'سياسة الإرجاع (بالإنجليزية)',
  'storefront.return_policy_ar': 'سياسة الإرجاع (بالعربية)',
  'storefront.return_policy_hint':
    'تظهر للمشترين قبل الدفع. وضّح هل تقبل الإرجاع لتغيير الرأي، والمدة، وحالة البضاعة المطلوبة. تُستثنى البضائع المخصصة عادةً.',
  'checkout.return_policy': 'الإرجاع',
  'checkout.no_return_policy':
    'لم يحدد هذا المورد سياسة إرجاع. قد لا يُقبل الإرجاع لتغيير الرأي، لكن النزاعات تشمل البضائع التالفة أو الخاطئة أو الناقصة أو المفقودة.',
  'admin.nav.holds': 'تعليق التسويات',
  'admin.nav.commission': 'العمولة',

  'ful.delivery_verified': 'تم التحقق من التسليم',
  'ful.verified.PROOF_OF_DELIVERY': '{date} (إثبات التسليم)',
  'ful.verified.BUYER_CONFIRMED': '{date} (أكد المشتري الاستلام)',
  'ful.window_ends': 'فترة النزاع',
  'ful.window_open': 'مفتوحة حتى {date}',
  'ful.window_closed': 'انتهت في {date}',
  'ful.window_pending': 'تبدأ عند التحقق من التسليم (إثبات التسليم أو تأكيد المشتري للاستلام)',

  'refund.split_title': 'ما الجزء الذي يغطيه هذا الاسترداد من الطلب؟ (اختياري)',
  'refund.split_hint':
    'اترك الحقول الثلاثة فارغة لتوزيع الاسترداد على البضاعة والتوصيل وضريبة القيمة المضافة بالتناسب. تُعكس العمولة على جزء البضاعة فقط.',
  'refund.merchandise': 'البضاعة (درهم)',
  'refund.shipping': 'التوصيل (درهم)',
  'refund.tax': 'ضريبة القيمة المضافة (درهم)',
  'refund.parts': 'البضاعة {merchandise} · التوصيل {shipping} · الضريبة {tax}',
  'refund.parts_legacy': 'موزع بالتناسب مع إجمالي الطلب (قبل المرحلة 8)',
  'field.split_mismatch': 'يجب أن يساوي مجموع الأجزاء الثلاثة مبلغ الاسترداد.',

  'payout.run_title': 'دورة التحويلات لهذا الأسبوع',
  'payout.run_week': 'أسبوع {start} إلى {end} (بتوقيت دبي)',
  'payout.run_note':
    'تتم التحويلات أسبوعياً: تحويل واحد كحد أقصى لكل مورد في الأسبوع، بموافقة مستخدم مالية ثانٍ. لا تصبح الطلبات مؤهلة إلا بعد التحقق من التسليم وانتهاء فترة النزاع، ودون نزاع أو تعليق أو حالة تسوية مفتوحة أو استرداد معلّق.',
  'payout.run_count': 'تحويلات هذا الأسبوع',
  'payout.run_amount': 'المطلوب هذا الأسبوع',
  'payout.available': 'الرصيد المتاح لدى مزود الدفع',
  'payout.available_sandbox': 'بيئة تجريبية: محسوب من دفتر الأستاذ، وليس من مزود دفع.',
  'payout.week': 'أسبوع {date}',

  'hold.title': 'تعليق التسويات',
  'hold.intro':
    'يوقف التعليق تحويل مستحقات المورد عن الطلب حتى يُرفع. استخدمه لتحقيقات الامتثال أو الاحتيال أو التسوية أو الدفع. يُسجَّل كل تعليق ورفع مع سببه.',
  'hold.place': 'إضافة تعليق',
  'hold.order_id': 'رقم الطلب (المعرّف)',
  'hold.kind': 'النوع',
  'hold.reason': 'السبب',
  'hold.placed': 'تمت إضافة التعليق. لا يمكن تحويل مستحقات الطلب حتى يُرفع.',
  'hold.kind.COMPLIANCE': 'امتثال',
  'hold.kind.FRAUD': 'احتيال',
  'hold.kind.RECONCILIATION': 'تسوية',
  'hold.kind.PAYMENT_INVESTIGATION': 'تحقيق في الدفع',
  'hold.filter.active': 'نشط',
  'hold.filter.released': 'مرفوع',
  'hold.empty': 'لا توجد تعليقات.',
  'hold.placed_by': 'أضافه {name}',
  'hold.released_by': 'رفعه {name}',
  'hold.release': 'رفع التعليق',
  'hold.release_title': 'رفع التعليق عن {number}؟',
  'hold.release_reason': 'سبب الرفع',
  'hold.order': 'الطلب',

  'commission.title': 'العمولة',
  'commission.intro':
    'عمولة المنصة نسبة من قيمة البضاعة دون ضريبة القيمة المضافة والتوصيل. تنطبق النسبة الجديدة على عمليات الدفع اعتباراً من تاريخ سريانها، بعد 30 يوماً على الأقل من تسجيلها، ويُشعَر كل مورد بها، وتحتفظ الطلبات الحالية بالنسبة التي سُعّرت بها.',
  'commission.current': 'النسبة الحالية',
  'commission.source.policy': 'إصدار السياسة {version}',
  'commission.source.configuration': 'من الإعدادات (لم يُسجَّل أي إصدار سياسة بعد)',
  'commission.new': 'تسجيل نسبة جديدة',
  'commission.rate': 'النسبة (%)',
  'commission.rate_hint': 'مثلاً 10 أو 7.5. بحد أقصى 50%.',
  'commission.reason': 'سبب التغيير',
  'commission.totp': 'رمز تطبيق المصادقة',
  'commission.save': 'حفظ النسبة الجديدة',
  'commission.saved':
    'تم تسجيل نسبة العمولة الجديدة وإشعار الموردين. تنطبق على عمليات الدفع اعتباراً من تاريخ سريانها.',
  'commission.history': 'السجل',
  'commission.empty': 'لم يُسجَّل أي إصدار سياسة بعد.',
  'commission.readonly': 'يمكن لمعتمد المالية فقط تغيير النسبة.',
  'commission.version': 'الإصدار {version}',

  'finance.resolve': 'حلّ الحالة',
  'finance.resolve_title': 'حلّ حالة التسوية هذه؟',
  'finance.resolution': 'كيف تم الحل؟',

  'error.refund.exceeds_component':
    'أحد الأجزاء أكبر من المتبقي القابل للاسترداد منه، أو أن الأجزاء لا تساوي المبلغ.',
  'error.payout.already_in_run': 'لدى هذا المورد تحويل في دورة هذا الأسبوع بالفعل.',
  'error.payout.order_held':
    'أحد طلبات هذا التحويل معلّق أو لديه حالة تسوية مفتوحة أو استرداد معلّق، أو ما زال ضمن فترة النزاع.',
  'error.payout.order_changed': 'تغيّر أحد طلبات هذا التحويل بعد طلبه. ارفضه واطلبه من جديد.',
  'error.payout.insufficient_balance':
    'الرصيد المتاح لدى مزود الدفع أقل من هذا التحويل. لا يمكن اعتماده الآن.',
  'error.hold.order_paid_out': 'تم تحويل مستحقات هذا الطلب بالفعل.',
  'error.hold.exists': 'لدى هذا الطلب تعليق نشط من هذا النوع بالفعل.',
  'error.hold.already_released': 'تم رفع هذا التعليق بالفعل.',
  'error.reconciliation.not_open': 'تم حل هذه الحالة بالفعل.',

  'payout.state.PROPOSED': 'مقترح من الجدول',
  'payout.scheduled_for': 'موعد الدورة',
  'payout.next_run': 'دورة الأسبوع القادم',
  'payout.proposal_status': 'الجدول',
  'payout.proposed_on': 'اقتُرح {count} تحويلات في {date}',
  'payout.not_proposed': 'لم يُقترح بعد',
  'payout.proposed_by_schedule': 'الجدول الأسبوعي',
  'payout.confirm': 'تأكيد',
  'payout.confirm_title': 'هل تؤكد التحويل {number}؟',
  'payout.confirm_body':
    'بالتأكيد تصبح مقدم الطلب. يجب أن يوافق عليه معتمد مالي آخر قبل إرسال أي شيء إلى مزود الدفع.',
  'payout.withdraw': 'سحب',
  'payout.withdraw_title': 'هل تسحب التحويل المقترح {number}؟',
  'payout.holidays': 'العطلات الرسمية في الإمارات',
  'payout.holidays_note':
    'تنتقل دورة التحويل التي تصادف عطلة نهاية الأسبوع أو عطلة مسجلة إلى يوم العمل التالي. سجّل كل عطلة رسمية عند الإعلان عنها.',
  'payout.holidays_empty': 'لا توجد عطلات مسجلة.',
  'payout.holiday_date': 'التاريخ',
  'payout.holiday_name': 'اسم العطلة',
  'payout.holiday_add': 'إضافة عطلة',
  'payout.holiday_remove': 'إزالة',
  'payout.holiday_remove_title': 'هل تزيل العطلة في {date}؟',
  'error.payout_holiday.exists': 'توجد عطلة مسجلة في هذا التاريخ بالفعل.',
  'commission.effective_from': 'يسري اعتباراً من',
  'commission.effective_hint':
    'يحصل الموردون على إشعار لا يقل عن {days} يوماً. أقرب موعد: {date} (دبي).',
  'commission.scheduled': 'مجدول',
  'error.commission.notice_too_short': 'يجب أن يمنح تاريخ السريان الموردين فترة الإشعار كاملة.',
  'notif.type.commission.change_scheduled':
    'تتغير عمولة المنصة إلى {rate} اعتباراً من {date}. تحتفظ الطلبات السابقة بنسبتها.',
};
