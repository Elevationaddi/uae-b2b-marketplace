'use client';
import { PAYOUT_STATES, type PayoutEligibleSeller, type PayoutItem } from '@app/contracts';
import { useState } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Money } from '@/components/catalog-ui';
import { SandboxNotice } from '@/components/commerce-ui';
import { DecisionButtons, SandboxComplete } from '@/components/finance-ops';
import { StateBadge } from '@/components/fulfilment-ui';
import { Resource } from '@/components/resource';
import { Button, ConfirmDialog, Empty, PageHeader, Pager } from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useCursor, useMutation, useResource } from '@/lib/use-resource';

function RequestPayout({ s, onDone }: { s: PayoutEligibleSeller; onDone: () => void }) {
  const t = useT();
  const m = useMutation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {t('payout.request')}
      </Button>
      <ConfirmDialog
        open={open}
        title={t('payout.request_title', { company: s.seller_company_name })}
        confirmLabel={t('payout.request')}
        busy={m.busy}
        error={m.error}
        onClose={() => {
          setOpen(false);
          m.setError(null);
        }}
        onConfirm={async () => {
          const r = await m.run('/admin/payouts', {
            method: 'POST',
            body: { seller_workspace_id: s.seller_workspace_id },
          });
          if (r.ok) {
            setOpen(false);
            onDone();
          }
        }}
      />
    </>
  );
}

function Eligible({ canRequest, onChange }: { canRequest: boolean; onChange: () => void }) {
  const t = useT();
  const res = useResource<PayoutEligibleSeller[]>('/admin/payouts/eligible');
  return (
    <section className="card" aria-labelledby="po-elig">
      <h2 id="po-elig" className="h3">
        {t('payout.eligible')}
      </h2>
      <Resource state={res.state} reload={res.reload}>
        {(items) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('payout.eligible_empty')}</p>
            </Empty>
          ) : (
            <div className="table-wrap">
              <table className="table" data-testid="payout-eligible">
                <thead>
                  <tr>
                    <th scope="col">{t('order.supplier')}</th>
                    <th scope="col">{t('payout.orders')}</th>
                    <th scope="col">{t('sandbox.amount')}</th>
                    <th scope="col">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={s.seller_workspace_id}>
                      <td>{s.seller_company_name}</td>
                      <td>{s.order_count}</td>
                      <td>
                        <Money fils={s.amount_fils} />
                      </td>
                      <td>
                        {canRequest ? (
                          <RequestPayout
                            s={s}
                            onDone={() => {
                              res.reload();
                              onChange();
                            }}
                          />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </Resource>
    </section>
  );
}

function Payouts() {
  const t = useT();
  const { locale } = useApp();
  const me = useAdmin();
  const canRequest = me.capabilities.includes('admin.payouts.request');
  const canApprove = me.capabilities.includes('admin.payouts.approve');
  const [state, setState] = useState('');
  const pager = useCursor();
  const res = useResource<PayoutItem[]>('/admin/payouts', {
    state: state || undefined,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('admin.nav.payouts')} />
      <p className="muted">{t('payout.intro')}</p>
      <SandboxNotice />
      <Eligible canRequest={canRequest} onChange={res.reload} />
      <section className="card" aria-labelledby="po-list">
        <h2 id="po-list" className="h3">
          {t('payout.list')}
        </h2>
        <label className="inline-field">
          <span>{t('common.status')}</span>
          <select
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              pager.first();
            }}
          >
            <option value="">{t('common.all')}</option>
            {PAYOUT_STATES.map((s) => (
              <option key={s} value={s}>
                {t(`payout.state.${s}`)}
              </option>
            ))}
          </select>
        </label>
        <Resource state={res.state} reload={res.reload} lines={5}>
          {(items, next) =>
            items.length === 0 ? (
              <Empty>
                <p>{t('payout.empty')}</p>
              </Empty>
            ) : (
              <>
                <div className="table-wrap">
                  <table className="table" data-testid="payouts">
                    <thead>
                      <tr>
                        <th scope="col">{t('payout.list')}</th>
                        <th scope="col">{t('order.supplier')}</th>
                        <th scope="col">{t('common.status')}</th>
                        <th scope="col">{t('sandbox.amount')}</th>
                        <th scope="col">{t('refund.requested_by')}</th>
                        <th scope="col">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <bdi>{p.number}</bdi>
                            <span className="muted small block">
                              {formatDubaiTime(p.created_at, locale)} ·{' '}
                              {t('order.line_count', { count: p.order_count })}
                            </span>
                          </td>
                          <td>{p.seller_company_name}</td>
                          <td>
                            <StateBadge ns="payout" value={p.state} />
                            {p.failure_code ? (
                              <span className="muted small block">{p.failure_code}</span>
                            ) : null}
                            {p.paid_at ? (
                              <span className="muted small block">
                                {formatDubaiTime(p.paid_at, locale)}
                              </span>
                            ) : null}
                          </td>
                          <td>
                            <Money fils={p.amount_fils} />
                          </td>
                          <td>
                            {p.requested_by}
                            {p.approved_by ? (
                              <span className="muted small block">
                                {t('refund.approved_by')}: {p.approved_by}
                              </span>
                            ) : null}
                          </td>
                          <td>
                            {p.state === 'REQUESTED' && canApprove && !p.requested_by_me ? (
                              <DecisionButtons
                                path={`/admin/payouts/${p.id}`}
                                number={p.number}
                                ns="payout"
                                onDone={res.reload}
                              />
                            ) : null}
                            {p.state === 'REQUESTED' && p.requested_by_me ? (
                              <span className="muted small">{t('refund.self_note')}</span>
                            ) : null}
                            {p.state === 'PENDING' && p.sandbox && p.provider_ref ? (
                              <SandboxComplete providerRef={p.provider_ref} onDone={res.reload} />
                            ) : null}
                          </td>
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
    </>
  );
}

export default function AdminPayoutsPage() {
  return (
    <AdminShell require="admin.finance.read">
      <Payouts />
    </AdminShell>
  );
}
