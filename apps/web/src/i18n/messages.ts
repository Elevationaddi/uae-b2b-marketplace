/**
 * Translation catalogue. Every user-facing string is a key here (docs/05-ui.md).
 * Placeholder product name until a brand is supplied (docs/00-decisions.md: no brand assumed).
 */
export const LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export const DIRECTION: Record<Locale, 'ltr' | 'rtl'> = { en: 'ltr', ar: 'rtl' };

const en = {
  'app.name': 'B2B Marketplace (working name)',
  'app.tagline': 'Verified UAE businesses sourcing from verified suppliers and manufacturers.',
  'app.phase_notice':
    'Development build. Sign-in, company verification and trading are not available yet.',
  'app.sandbox_banner': 'Sandbox environment: test adapters only. No real payments or emails.',
  'status.heading': 'System status',
  'status.api': 'API',
  'status.database': 'Database',
  'status.redis': 'Queue store',
  'status.up': 'Operational',
  'status.down': 'Unavailable',
  'status.unreachable': 'The API could not be reached. Check that it is running, then retry.',
  'status.retry': 'Retry',
  'status.checked_at': 'Checked at',
  'status.reference': 'Reference',
  'locale.switch': 'العربية',
  'locale.switch_label': 'Switch language to Arabic',
};

type Messages = Record<keyof typeof en, string>;

const ar: Messages = {
  'app.name': 'سوق الأعمال B2B (اسم مؤقت)',
  'app.tagline': 'شركات إماراتية موثقة تتعامل مع موردين ومصنّعين موثقين.',
  'app.phase_notice': 'نسخة تطوير. تسجيل الدخول والتحقق من الشركات والتداول غير متاحة بعد.',
  'app.sandbox_banner': 'بيئة تجريبية: محولات اختبار فقط. لا مدفوعات أو رسائل بريد حقيقية.',
  'status.heading': 'حالة النظام',
  'status.api': 'واجهة البرمجة',
  'status.database': 'قاعدة البيانات',
  'status.redis': 'مخزن قائمة الانتظار',
  'status.up': 'يعمل',
  'status.down': 'غير متاح',
  'status.unreachable': 'تعذّر الوصول إلى واجهة البرمجة. تأكد من تشغيلها ثم أعد المحاولة.',
  'status.retry': 'إعادة المحاولة',
  'status.checked_at': 'وقت الفحص',
  'status.reference': 'المرجع',
  'locale.switch': 'English',
  'locale.switch_label': 'تغيير اللغة إلى الإنجليزية',
};

export type MessageKey = keyof typeof en;
const CATALOGUE: Record<Locale, Messages> = { en, ar };

export function t(locale: Locale, key: MessageKey): string {
  return CATALOGUE[locale][key];
}

export function catalogueKeys(locale: Locale): string[] {
  return Object.keys(CATALOGUE[locale]).sort();
}

/** Display timestamps in Asia/Dubai; storage and API stay UTC (CLAUDE.md). */
export function formatDubaiTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-AE' : 'en-AE', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Asia/Dubai',
  }).format(new Date(iso));
}
