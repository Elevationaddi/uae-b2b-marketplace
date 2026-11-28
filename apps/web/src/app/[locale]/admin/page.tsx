'use client';
import type { OperationsOverview } from '@app/contracts';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Money } from '@/components/catalog-ui';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Alert, Button, Field, PageHeader } from '@/components/ui';
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

function MoneyKpi({ label, fils }: { label: string; fils: string }) {
  return (
    <li className="kpi">
      <span className="kpi-value kpi-money">
        <Money fils={fils} />
      </span>
      <span className="kpi-label">{label}</span>
    </li>
  );
}

/** Live queues for every admin; commerce figures from the ledger for finance roles only. */
function Operations() {
  const t = useT();
  const { locale } = useApp();
  const me = useAdmin();
  const caps = me.capabilities;
  const base = `/${locale}/admin`;
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { state, reload } = useResource<OperationsOverview>('/admin/operations/overview', range);
  function apply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setRange({
      from: String(fd.get('from') ?? '') || undefined,
      to: String(fd.get('to') ?? '') || undefined,
    });
  }
  const link = (cap: string, href: string) => (caps.includes(cap as never) ? href : undefined);
  return (
    <section aria-labelledby="ops-title" data-testid="operations">
      <h2 id="ops-title" className="h3">
        {t('ops.title')}
      </h2>
      <Resource state={state} reload={reload} lines={4}>
        {(o) => (
          <>
            <h3 className="h4">{t('ops.cases')}</h3>
            <ul className="kpis" aria-label={t('ops.cases')}>
              <Kpi
                label={t('ops.open_support')}
                value={o.cases.open_support}
                href={link('admin.support.read', `${base}/support`)}
              />
              <Kpi
                label={t('ops.unassigned_support')}
                value={o.cases.unassigned_support}
                href={link('admin.support.read', `${base}/support`)}
              />
              <Kpi
                label={t('ops.open_disputes')}
                value={o.cases.open_disputes}
                href={link('admin.disputes.read', `${base}/disputes`)}
              />
              <Kpi label={t('ops.unassigned_disputes')} value={o.cases.unassigned_disputes} />
              <Kpi
                label={t('ops.refunds_waiting')}
                value={o.cases.refunds_awaiting_approval}
                href={link('admin.finance.read', `${base}/refunds`)}
              />
              <Kpi
                label={t('ops.payouts_waiting')}
                value={o.cases.payouts_awaiting_approval}
                href={link('admin.finance.read', `${base}/payouts`)}
              />
              <Kpi
                label={t('ops.open_reconciliation')}
                value={o.cases.open_reconciliation}
                href={link('admin.finance.read', `${base}/finance`)}
              />
              <Kpi label={t('ops.quarantined')} value={o.cases.quarantined_webhooks_7d} />
            </ul>
            <h3 className="h4">{t('ops.commerce')}</h3>
            {o.commerce ? (
              <>
                {o.commerce.sandbox ? <Alert kind="warning">{t('ops.sandbox')}</Alert> : null}
                <form className="filters" onSubmit={apply} noValidate aria-label={t('ops.range')}>
                  <Field
                    label={t('ops.from')}
                    name="from"
                    type="date"
                    defaultValue={o.range.from}
                  />
                  <Field label={t('ops.to')} name="to" type="date" defaultValue={o.range.to} />
                  <Button type="submit" variant="secondary">
                    {t('ops.apply')}
                  </Button>
                </form>
                <ul className="kpis kpis-money" aria-label={t('ops.commerce')}>
                  <Kpi label={t('ops.paid_orders')} value={o.commerce.paid_orders} />
                  <MoneyKpi label={t('ops.gmv')} fils={o.commerce.gmv_fils} />
                  <MoneyKpi label={t('ops.refunds')} fils={o.commerce.refunds_fils} />
                  <MoneyKpi label={t('ops.net')} fils={o.commerce.net_fils} />
                  <MoneyKpi label={t('ops.fee_revenue')} fils={o.commerce.fee_revenue_fils} />
                  <MoneyKpi
                    label={t('ops.payable_pending')}
                    fils={o.commerce.seller_payable_pending_fils}
                  />
                  <MoneyKpi
                    label={t('ops.payable_settled')}
                    fils={o.commerce.seller_payable_settled_fils}
                  />
                </ul>
                <p className="muted small">
                  {t('ops.range_note', { from: o.range.from, to: o.range.to })}
                </p>
              </>
            ) : (
              <p className="muted">{t('ops.no_finance')}</p>
            )}
          </>
        )}
      </Resource>
    </section>
  );
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
      <Operations />
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
