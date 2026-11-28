'use client';
import type { SellerFinanceSummary } from '@app/contracts';
import { useApp, useT } from '@/components/app-context';
import { Money } from '@/components/catalog-ui';
import { SandboxNotice } from '@/components/commerce-ui';
import { StateBadge } from '@/components/fulfilment-ui';
import { Resource } from '@/components/resource';
import { SellerShell } from '@/components/seller-shell';
import { DefinitionList, Empty, PageHeader } from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';

function Finance({ wsId }: { wsId: string }) {
  const t = useT();
  const { locale } = useApp();
  const res = useResource<SellerFinanceSummary>(`/seller/workspaces/${wsId}/finance`);
  return (
    <>
      <PageHeader title={t('sfin.title')} />
      <p className="muted">{t('sfin.intro')}</p>
      <Resource state={res.state} reload={res.reload}>
        {(s) => (
          <>
            {s.sandbox ? <SandboxNotice /> : null}
            <div className="two-col">
              <section className="card" aria-labelledby="sfin-totals" data-testid="seller-finance">
                <h2 id="sfin-totals" className="h3">
                  {t('sfin.net')}
                </h2>
                <DefinitionList
                  items={[
                    [t('sfin.gross'), <Money key="g" fils={s.gross_fils} />],
                    [t('sfin.commission'), <Money key="c" fils={s.commission_fils} />],
                    [t('sfin.refunded'), <Money key="r" fils={s.refunded_fils} />],
                    [t('sfin.net'), <Money key="n" fils={s.net_payable_fils} />],
                  ]}
                />
              </section>
              <section className="card" aria-labelledby="sfin-states">
                <h2 id="sfin-states" className="h3">
                  {t('ful.settlement')}
                </h2>
                <DefinitionList
                  items={[
                    [t('sfin.not_yet'), <Money key="a" fils={s.not_yet_eligible_fils} />],
                    [t('sfin.eligible'), <Money key="b" fils={s.eligible_fils} />],
                    [t('sfin.held'), <Money key="c" fils={s.held_fils} />],
                    [t('sfin.in_payout'), <Money key="d" fils={s.in_payout_fils} />],
                    [t('sfin.paid_out'), <Money key="e" fils={s.paid_out_fils} />],
                  ]}
                />
                <p className="muted small">{t('ful.payout_note')}</p>
              </section>
            </div>
            <section className="card" aria-labelledby="sfin-payouts">
              <h2 id="sfin-payouts" className="h3">
                {t('sfin.payouts')}
              </h2>
              {s.payouts.length === 0 ? (
                <Empty>
                  <p>{t('sfin.no_payouts')}</p>
                </Empty>
              ) : (
                <div className="table-wrap">
                  <table className="table" data-testid="seller-payouts">
                    <thead>
                      <tr>
                        <th scope="col">{t('payout.list')}</th>
                        <th scope="col">{t('common.status')}</th>
                        <th scope="col">{t('sandbox.amount')}</th>
                        <th scope="col">{t('payout.orders')}</th>
                        <th scope="col">{t('order.created')}</th>
                        <th scope="col">{t('payout.paid_at')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.payouts.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <bdi>{p.number}</bdi>
                            {p.sandbox ? (
                              <span className="pill pill-warn small">
                                {t('payment.sandbox_pill')}
                              </span>
                            ) : null}
                          </td>
                          <td>
                            <StateBadge ns="payout" value={p.state} />
                          </td>
                          <td>
                            <Money fils={p.amount_fils} />
                          </td>
                          <td>{p.order_count}</td>
                          <td>{formatDubaiTime(p.created_at, locale)}</td>
                          <td>{p.paid_at ? formatDubaiTime(p.paid_at, locale) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </Resource>
    </>
  );
}

export default function SellerFinancePage() {
  return <SellerShell>{(ws) => <Finance wsId={ws.id} />}</SellerShell>;
}
