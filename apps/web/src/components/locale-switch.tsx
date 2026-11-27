'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/messages';
import { useApp, useT } from './app-context';

/** Switches language on the same page, keeping query and fragment (tokens live in the fragment). */
export function LocaleSwitch({ className }: { className?: string }) {
  const { locale } = useApp();
  const t = useT();
  const pathname = usePathname() ?? `/${locale}`;
  const search = useSearchParams();
  const [hash, setHash] = useState('');
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const other: Locale = locale === 'en' ? 'ar' : 'en';
  const rest = pathname.replace(/^\/(en|ar)(?=\/|$)/, '');
  const qs = search?.toString();
  const href = `/${other}${rest}${qs ? `?${qs}` : ''}${hash}`;
  return (
    <Link
      href={href}
      hrefLang={other}
      lang={other}
      aria-label={t('locale.switch_label')}
      className={className ?? 'link-button'}
    >
      {t('locale.switch')}
    </Link>
  );
}
