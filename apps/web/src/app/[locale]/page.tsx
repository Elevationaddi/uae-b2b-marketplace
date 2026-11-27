import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicShell } from '@/components/public-shell';
import { fetchReadiness } from '@/lib/api';
import { loadServerConfig } from '@/lib/server-config';
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
  const [result, cfg] = await Promise.all([fetchReadiness(), loadServerConfig()]);

  return (
    <PublicShell narrow={false}>
      <section className="hero">
        <h1>{cfg.appName}</h1>
        <p className="lead">{t(locale, 'app.tagline')}</p>
        <p>{t(locale, 'home.landing_body')}</p>
        <div className="actions">
          <Link href={`/${locale}/register`} className="btn btn-primary">
            {t(locale, 'nav.register')}
          </Link>
          <Link href={`/${locale}/login`} className="btn btn-secondary">
            {t(locale, 'nav.sign_in')}
          </Link>
        </div>
      </section>

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
            <Link href={`/${locale}`} className="btn btn-secondary">
              {t(locale, 'status.retry')}
            </Link>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
