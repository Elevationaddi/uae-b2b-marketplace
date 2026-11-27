import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchReadiness } from '@/lib/api';
import { formatDubaiTime, isLocale, t, type Locale, type MessageKey } from '@/i18n/messages';

export const dynamic = 'force-dynamic';

function StatusRow({ locale, label, up }: { locale: Locale; label: MessageKey; up: boolean }) {
  return (
    <li className="status-row">
      <span>{t(locale, label)}</span>
      {/* Status uses text as well as colour (docs/05-ui.md). */}
      <span className={up ? 'badge badge-up' : 'badge badge-down'}>
        {t(locale, up ? 'status.up' : 'status.down')}
      </span>
    </li>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const other: Locale = locale === 'en' ? 'ar' : 'en';
  const result = await fetchReadiness();

  return (
    <>
      {result.kind === 'ok' && result.readiness.sandbox ? (
        <div className="sandbox-banner" role="status">
          {t(locale, 'app.sandbox_banner')}
        </div>
      ) : null}
      <header className="site-header">
        <span className="brand">{t(locale, 'app.name')}</span>
        <Link
          href={`/${other}`}
          hrefLang={other}
          aria-label={t(locale, 'locale.switch_label')}
          className="link-button"
        >
          {t(locale, 'locale.switch')}
        </Link>
      </header>
      <main className="container">
        <h1>{t(locale, 'app.name')}</h1>
        <p className="lead">{t(locale, 'app.tagline')}</p>
        <p className="notice">{t(locale, 'app.phase_notice')}</p>

        <section aria-labelledby="status-heading" className="card">
          <h2 id="status-heading">{t(locale, 'status.heading')}</h2>
          {result.kind === 'ok' ? (
            <>
              <ul className="status-list" data-testid="status-list">
                <StatusRow locale={locale} label="status.api" up />
                <StatusRow
                  locale={locale}
                  label="status.database"
                  up={result.readiness.checks.database?.status === 'up'}
                />
                <StatusRow
                  locale={locale}
                  label="status.redis"
                  up={result.readiness.checks.redis?.status === 'up'}
                />
              </ul>
              <p className="muted">
                {t(locale, 'status.checked_at')}:{' '}
                <time dateTime={result.readiness.time}>
                  {formatDubaiTime(result.readiness.time, locale)}
                </time>
              </p>
            </>
          ) : (
            <div role="alert" className="error-box">
              <p>{t(locale, 'status.unreachable')}</p>
              {result.requestId ? (
                <p className="muted">
                  {t(locale, 'status.reference')}: {result.requestId}
                </p>
              ) : null}
              <Link href={`/${locale}`} className="button">
                {t(locale, 'status.retry')}
              </Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
