'use client';
import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';
import { useApp, useT } from './app-context';
import { LocaleSwitch } from './locale-switch';

export function PublicShell({
  children,
  narrow = true,
}: {
  children: ReactNode;
  narrow?: boolean;
}) {
  const { locale, appName } = useApp();
  const t = useT();
  return (
    <>
      <header className="site-header">
        <Link href={`/${locale}`} className="brand">
          {appName}
        </Link>
        <nav className="header-links" aria-label={t('nav.main')}>
          <Link href={`/${locale}/login`}>{t('nav.sign_in')}</Link>
          <Link href={`/${locale}/register`}>{t('nav.register')}</Link>
          <Suspense>
            <LocaleSwitch />
          </Suspense>
        </nav>
      </header>
      <main id="main" className={narrow ? 'container container-narrow' : 'container'}>
        {children}
      </main>
    </>
  );
}
