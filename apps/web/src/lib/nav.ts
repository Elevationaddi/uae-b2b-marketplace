import type { Locale } from '@/i18n/messages';

/** Only same-site relative paths inside the app are allowed as post-login targets (no open redirect). */
export function safeNext(locale: Locale, next: string | null | undefined): string {
  if (
    !next ||
    !/^\/(en|ar)\//.test(next) ||
    next.startsWith('//') ||
    next.includes('\\') ||
    /\/admin(\/|$)/.test(next)
  ) {
    return `/${locale}/app`;
  }
  return next;
}

/** Read and strip a one-time token from the URL fragment, so it does not linger in history. */
export function takeFragmentToken(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const token = params.get('token');
  if (token)
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  return token;
}
