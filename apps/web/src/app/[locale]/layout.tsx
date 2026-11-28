import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '@app/ui/tokens.css';
import '../globals.css';
import { AppProvider } from '@/components/app-context';
import { DIRECTION, isLocale, t } from '@/i18n/messages';
import { loadServerConfig } from '@/lib/server-config';

// Product name and sandbox flag are runtime configuration, so pages render per request.
export const dynamic = 'force-dynamic';

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const cfg = await loadServerConfig();
  return {
    title: { default: cfg.appName, template: `%s · ${cfg.appName}` },
    description: t(locale, 'app.tagline'),
    robots: { index: false, follow: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const cfg = await loadServerConfig();
  return (
    <html lang={locale} dir={DIRECTION[locale]}>
      <body>
        <a className="skip-link" href="#main">
          {t(locale, 'app.skip_to_content')}
        </a>
        {cfg.staging ? (
          <div className="sandbox-banner" role="note" data-testid="staging-banner">
            {t(locale, 'app.staging_banner')}
          </div>
        ) : cfg.sandbox ? (
          <div className="sandbox-banner" role="note">
            {t(locale, 'app.sandbox_banner')}
          </div>
        ) : null}
        <AppProvider
          value={{
            locale,
            appName: cfg.appName,
            sandbox: cfg.sandbox,
            uploadMaxBytes: cfg.uploadMaxBytes,
            staging: cfg.staging,
            stagingEmailDomains: cfg.stagingEmailDomains,
          }}
        >
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
