'use client';
import type { AdminFinanceSummary, AdminPaymentItem, ReconciliationItem } from '@app/contracts';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Money } from '@/components/catalog-ui';
import { CheckoutState, PaymentState, SandboxNotice } from '@/components/commerce-ui';
import { Resource } from '@/components/resource';
import { Empty, PageHeader, Pager } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

function Summary() {
  const t = useT();
  const res = useResource<AdminFinanceSummary>('/admin/finance/summary');
  return (
    <Resource state={res.state} reload={res.reload}>
      {(s) => (
        <>
          {s.sandbox ? <SandboxNotice /> : null}
          <section className="card" aria-labelledby="fin-ledger">
            <h2 id="fin-ledger" className="h3">
              {t('finance.ledger')}
            </h2>
            <p className="muted small">{t('finance.ledger_note')}</p>
            <div className="table-wrap">
              <table className="table" data-testid="ledger-balances">
                <thead>
                  <tr>
                    <th scope="col">{t('finance.account')}</th>
                    <th scope="col">{t('finance.debits')}</th>
                    <th scope="col">{t('finance.credits')}</th>
                  </tr>
                </thead>
                <tbody>
                  {s.balances.map((b) => (
                    <tr key={b.account}>
                      <th scope="row">{t(`finance.account.${b.account}` as MessageKey)}</th>
                      <td>
                        <Money fils={b.debit_fils} />
                      </td>
                      <td>
                        <Money fils={b.credit_fils} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              {t('finance.open_cases', { count: s.open_reconciliation })} ·{' '}
              {Object.entries(s.payments_by_state)
                .map(([k, v]) => `${t(`payment.state.${k}` as MessageKey)}: ${v}`)
                .join(' · ') || t('finance.no_payments')}
            </p>
          </section>
        </>
      )}
    </Resource>
  );
}

function Payments() {
  const t = useT();
  const { locale } = useApp();
  const pager = useCursor();
  const res = useResource<AdminPaymentItem[]>('/admin/finance/payments', { cursor: pager.cursor });
  return (
    <section className="card" aria-labelledby="fin-pay">
      <h2 id="fin-pay" className="h3">
        {t('finance.payments')}
      </h2>
      <Resource state={res.state} reload={res.reload}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('finance.no_payments')}</p>
            </Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="admin-payments">
                  <thead>
                    <tr>
                      <th scope="col">{t('order.checkout')}</th>
                      <th scope="col">{t('order.buyer')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('sandbox.amount')}</th>
                      <th scope="col">{t('order.created')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <bdi>{p.checkout_number}</bdi> <CheckoutState value={p.checkout_state} />
                        </td>
                        <td>{p.buyer_company_name}</td>
                        <td>
                          <PaymentState value={p.state} />
                          {p.sandbox ? (
                            <span className="pill pill-warn small">
                              {t('payment.sandbox_pill')}
                            </span>
                          ) : null}
                        </td>
                        <td>
                          <Money fils={p.amount_fils} />
                        </td>
                        <td>{formatDubaiTime(p.created_at, locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager
                hasPrev={pager.hasPrev}
                nextCursor={next}
                onFirst={pager.first}
                onNext={pager.next}
              />
            </>
          )
        }
      </Resource>
    </section>
  );
}

function Reconciliation() {
  const t = useT();
  const { locale } = useApp();
  const pager = useCursor();
  const res = useResource<ReconciliationItem[]>('/admin/finance/reconciliation', {
    state: 'OPEN',
    cursor: pager.cursor,
  });
  return (
    <section className="card" aria-labelledby="fin-rec">
      <h2 id="fin-rec" className="h3">
        {t('finance.reconciliation')}
      </h2>
      <p className="muted small">{t('finance.reconciliation_note')}</p>
      <Resource state={res.state} reload={res.reload}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('finance.no_cases')}</p>
            </Empty>
          ) : (
            <>
              <ul className="plain-list" data-testid="reconciliation">
                {items.map((c) => (
                  <li key={c.id}>
                    <strong>{t(`finance.case.${c.kind}` as MessageKey)}</strong>
                    {c.checkout_number ? (
                      <>
                        {' '}
                        · <bdi>{c.checkout_number}</bdi>
                      </>
                    ) : null}{' '}
                    · {formatDubaiTime(c.created_at, locale)}
                  </li>
                ))}
              </ul>
              <Pager
                hasPrev={pager.hasPrev}
                nextCursor={next}
                onFirst={pager.first}
                onNext={pager.next}
              />
            </>
          )
        }
      </Resource>
    </section>
  );
}

export default function AdminFinancePage() {
  return (
    <AdminShell require="admin.finance.read">
      <FinanceTitle />
      <Summary />
      <Payments />
      <Reconciliation />
    </AdminShell>
  );
}

function FinanceTitle() {
  const t = useT();
  return (
    <>
      <PageHeader title={t('admin.nav.finance')} />
      <p className="muted">{t('finance.intro')}</p>
    </>
  );
}
