'use client';
import Link from 'next/link';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Alert, PageHeader } from '@/components/ui';
import { Resource } from '@/components/resource';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';

type Overview = {
  verification: { submitted: number; under_review: number; needs_info: number };
  companies: { approved: number; suspended: number; draft: number; licence_expiring_30d: number };
  users: { company_users: number; unverified_email: number };
  generated_at: string;
};

function Kpi({ label, value, href }: { label: string; value: number; href?: string }) {
  const { locale } = useApp();
  const n = new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE').format(value);
  const body = (
    <>
      <span className="kpi-value">{n}</span>
      <span className="kpi-label">{label}</span>
    </>
  );
  return <li className="kpi">{href ? <Link href={href}>{body}</Link> : body}</li>;
}

function OverviewBody() {
  const { locale } = useApp();
  const t = useT();
  const me = useAdmin();
  const { state, reload } = useResource<Overview>('/admin/overview');
  const base = `/${locale}/admin`;
  const canReview = me.capabilities.includes('admin.verification.review');
  return (
    <>
      <PageHeader title={t('admin.overview_title')} />
      {me.recovery_codes_remaining <= 3 ? (
        <Alert kind="warning">
          {t('admin.recovery_remaining', { count: me.recovery_codes_remaining })}
        </Alert>
      ) : null}
      <Resource state={state} reload={reload} lines={6}>
        {(o) => (
          <>
            <ul className="kpis" aria-label={t('admin.overview_title')}>
              <Kpi
                label={t('admin.kpi.submitted')}
                value={o.verification.submitted}
                href={canReview ? `${base}/verification?state=SUBMITTED` : undefined}
              />
              <Kpi
                label={t('admin.kpi.under_review')}
                value={o.verification.under_review}
                href={canReview ? `${base}/verification?state=UNDER_REVIEW` : undefined}
              />
              <Kpi
                label={t('admin.kpi.needs_info')}
                value={o.verification.needs_info}
                href={canReview ? `${base}/verification?state=NEEDS_INFO` : undefined}
              />
              <Kpi
                label={t('admin.kpi.approved')}
                value={o.companies.approved}
                href={`${base}/companies?status=APPROVED`}
              />
              <Kpi
                label={t('admin.kpi.suspended')}
                value={o.companies.suspended}
                href={`${base}/companies?status=SUSPENDED`}
              />
              <Kpi
                label={t('admin.kpi.draft')}
                value={o.companies.draft}
                href={`${base}/companies?status=DRAFT`}
              />
              <Kpi label={t('admin.kpi.expiring')} value={o.companies.licence_expiring_30d} />
              <Kpi label={t('admin.kpi.company_users')} value={o.users.company_users} />
              <Kpi label={t('admin.kpi.unverified')} value={o.users.unverified_email} />
            </ul>
            <p className="muted">
              {t('admin.generated_at', { time: formatDubaiTime(o.generated_at, locale) })}
            </p>
            <p className="muted">
              {t('admin.roles')}:{' '}
              {me.roles.map((r) => t(`adminrole.${r}` as MessageKey)).join(', ')}
            </p>
          </>
        )}
      </Resource>
    </>
  );
}

export default function AdminOverviewPage() {
  return (
    <AdminShell require="admin.companies.read">
      <OverviewBody />
    </AdminShell>
  );
}
