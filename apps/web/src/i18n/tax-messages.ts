/**
 * Phase 8 tax configuration (founder decision F05): supplier VAT registration status, the labelled
 * provisional VAT rate and non-binding invoice drafts.
 */
export const taxEn = {
  'company.vat_status': 'VAT registration',
  'company.vat_status_hint':
    'Registered suppliers must give their TRN. Our compliance team confirms the status before it is used for VAT.',
  'vat.UNKNOWN': 'Not stated',
  'vat.REGISTERED': 'Registered for VAT',
  'vat.NOT_REGISTERED': 'Not registered for VAT',
  'company.vat_confirmed': 'Confirmed by compliance on {date}',
  'company.vat_unconfirmed': 'Not yet confirmed by compliance',
  'field.trn_required': 'Enter the 15-digit TRN for a VAT-registered company.',

  'checkout.issue.supplier_vat_unconfirmed':
    'This supplier’s VAT registration has not been confirmed yet, so it cannot be checked out.',
  'tax.provisional_note':
    'VAT is shown at a provisional development rate. It is not a professionally approved tax calculation.',
  'tax.code': 'VAT rule',
  'taxcode.PROVISIONAL_STANDARD': 'Provisional standard rate (development)',
  'taxcode.STANDARD': 'Standard rate (supplier VAT registered)',
  'taxcode.NO_VAT_NOT_REGISTERED': 'No VAT (supplier not registered)',
  'taxcode.ZERO_RATED': 'Zero-rated',
  'taxcode.EXEMPT': 'Exempt',

  'error.quote.supplier_vat_unconfirmed':
    'Your company’s VAT registration must be confirmed by compliance before you can submit quotes.',
  'error.quote.vat_not_registered':
    'Your company is not registered for VAT, so the quote cannot charge standard-rate VAT.',

  'invoice.open': 'Invoice draft',
  'invoice.title': 'Invoice draft for {number}',
  'invoice.not_tax_invoice':
    'Draft for review only. This is not a tax invoice: it has no invoice number or issue date, and binding invoices are disabled until the tax rules are approved by a tax professional.',
  'invoice.supplier': 'Supplier',
  'invoice.buyer': 'Buyer',
  'invoice.trn': 'TRN',
  'invoice.vat_status': 'VAT registration',
  'invoice.vat_unconfirmed': '(not confirmed)',
  'invoice.commission_title': 'Platform commission (draft)',
  'invoice.commission_vat_pending':
    'VAT on the commission is pending professional advice and is not shown.',
  'invoice.rate': 'Rate',

  'admin.vat.title': 'VAT registration',
  'admin.vat.confirm': 'Confirm VAT status',
  'admin.vat.reason': 'Reason and evidence checked',
  'admin.vat.confirmed': 'VAT status confirmed.',
} as const;

export const taxAr: Record<keyof typeof taxEn, string> = {
  'company.vat_status': 'التسجيل في ضريبة القيمة المضافة',
  'company.vat_status_hint':
    'يجب على الموردين المسجلين إدخال رقم التسجيل الضريبي. يؤكد فريق الامتثال الحالة قبل استخدامها في الضريبة.',
  'vat.UNKNOWN': 'غير محدد',
  'vat.REGISTERED': 'مسجل في ضريبة القيمة المضافة',
  'vat.NOT_REGISTERED': 'غير مسجل في ضريبة القيمة المضافة',
  'company.vat_confirmed': 'أكده فريق الامتثال في {date}',
  'company.vat_unconfirmed': 'لم يؤكده فريق الامتثال بعد',
  'field.trn_required': 'أدخل رقم التسجيل الضريبي المكوّن من 15 رقماً للشركة المسجلة.',

  'checkout.issue.supplier_vat_unconfirmed':
    'لم يتم تأكيد تسجيل هذا المورد في ضريبة القيمة المضافة بعد، لذا لا يمكن إتمام الشراء منه.',
  'tax.provisional_note':
    'تُعرض ضريبة القيمة المضافة بنسبة تجريبية مؤقتة، وليست حساباً ضريبياً معتمداً من مختص.',
  'tax.code': 'قاعدة الضريبة',
  'taxcode.PROVISIONAL_STANDARD': 'النسبة الأساسية المؤقتة (تجريبية)',
  'taxcode.STANDARD': 'النسبة الأساسية (المورد مسجل)',
  'taxcode.NO_VAT_NOT_REGISTERED': 'بدون ضريبة (المورد غير مسجل)',
  'taxcode.ZERO_RATED': 'خاضع لنسبة صفر',
  'taxcode.EXEMPT': 'معفى',

  'error.quote.supplier_vat_unconfirmed':
    'يجب أن يؤكد فريق الامتثال تسجيل شركتك في ضريبة القيمة المضافة قبل تقديم العروض.',
  'error.quote.vat_not_registered':
    'شركتك غير مسجلة في ضريبة القيمة المضافة، لذا لا يمكن أن يتضمن العرض الضريبة بالنسبة الأساسية.',

  'invoice.open': 'مسودة الفاتورة',
  'invoice.title': 'مسودة فاتورة الطلب {number}',
  'invoice.not_tax_invoice':
    'مسودة للمراجعة فقط. هذه ليست فاتورة ضريبية: لا تحمل رقماً أو تاريخ إصدار، والفواتير الملزمة معطلة حتى يعتمد مختص ضريبي قواعد الضريبة.',
  'invoice.supplier': 'المورد',
  'invoice.buyer': 'المشتري',
  'invoice.trn': 'رقم التسجيل الضريبي',
  'invoice.vat_status': 'التسجيل الضريبي',
  'invoice.vat_unconfirmed': '(غير مؤكد)',
  'invoice.commission_title': 'عمولة المنصة (مسودة)',
  'invoice.commission_vat_pending': 'ضريبة القيمة المضافة على العمولة بانتظار رأي مختص ولا تُعرض.',
  'invoice.rate': 'النسبة',

  'admin.vat.title': 'التسجيل في ضريبة القيمة المضافة',
  'admin.vat.confirm': 'تأكيد الحالة الضريبية',
  'admin.vat.reason': 'السبب والمستندات التي تم التحقق منها',
  'admin.vat.confirmed': 'تم تأكيد الحالة الضريبية.',
};
