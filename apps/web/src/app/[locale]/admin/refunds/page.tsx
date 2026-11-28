'use client';
import { parseAedToFils, REFUND_STATES, type RefundItem } from '@app/contracts';
import { useState, type FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Money } from '@/components/catalog-ui';
import { SandboxNotice } from '@/components/commerce-ui';
import { DecisionButtons, SandboxComplete } from '@/components/finance-ops';
import { StateBadge } from '@/components/fulfilment-ui';
import { Resource } from '@/components/resource';
import {
  ApiErrorAlert,
  Button,
  Empty,
  Field,
  PageHeader,
  Pager,
  TextArea,
  useFieldError,
} from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useCursor, useMutation, useResource } from '@/lib/use-resource';

function CreateRefund({ onDone }: { onDone: () => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [ok, setOk] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const aed = String(fd.get('amount') ?? '');
    const fils = parseAedToFils(aed);
    const dispute = String(fd.get('dispute_id') ?? '').trim();
    const r = await m.run<RefundItem>('/admin/refunds', {
      method: 'POST',
      body: {
        order_id: String(fd.get('order_id') ?? '').trim(),
        amount_fils: fils === null ? aed : String(fils),
        reason: String(fd.get('reason') ?? ''),
        ...(dispute ? { dispute_id: dispute } : {}),
      },
    });
    if (r.ok) {
      form.reset();
      setOk(true);
      onDone();
    }
  }
  return (
    <section className="card" aria-labelledby="rf-new">
      <h2 id="rf-new" className="h3">
        {t('refund.create')}
      </h2>
      <form onSubmit={submit} data-testid="refund-form" noValidate>
        <Field label={t('refund.order_id')} name="order_id" required error={fe('order_id')} />
        <Field
          label={t('refund.amount')}
          name="amount"
          inputMode="decimal"
          required
          hint={t('dispute.amount_hint')}
          error={fe('amount_fils')}
        />
        <TextArea label={t('refund.reason')} name="reason" required rows={2} error={fe('reason')} />
        <Field label={t('refund.dispute_id')} name="dispute_id" optional error={fe('dispute_id')} />
        {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
          <ApiErrorAlert error={m.error} />
        ) : null}
        {ok ? (
          <p role="status" className="muted">
            {t('refund.created')}
          </p>
        ) : null}
        <Button type="submit" busy={m.busy}>
          {t('refund.create')}
        </Button>
      </form>
    </section>
  );
}

function Refunds() {
  const t = useT();
  const { locale } = useApp();
  const me = useAdmin();
  const canRequest = me.capabilities.includes('admin.refunds.request');
  const canApprove = me.capabilities.includes('admin.refunds.approve');
  const [state, setState] = useState('');
  const pager = useCursor();
  const res = useResource<RefundItem[]>('/admin/refunds', {
    state: state || undefined,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('admin.nav.refunds')} />
      <p className="muted">{t('refund.intro')}</p>
      <SandboxNotice />
      {canRequest ? <CreateRefund onDone={res.reload} /> : null}
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
          {REFUND_STATES.map((s) => (
            <option key={s} value={s}>
              {t(`refund.state.${s}`)}
            </option>
          ))}
        </select>
      </label>
      <Resource state={res.state} reload={res.reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('refund.empty')}</p>
            </Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="refunds">
                  <thead>
                    <tr>
                      <th scope="col">{t('admin.nav.refunds')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('sandbox.amount')}</th>
                      <th scope="col">{t('refund.requested_by')}</th>
                      <th scope="col">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <bdi>{r.number}</bdi>
                          <span className="muted small block">
                            <bdi>{r.order_number}</bdi> · {formatDubaiTime(r.created_at, locale)}
                          </span>
                          <span className="small block">{r.reason}</span>
                        </td>
                        <td>
                          <StateBadge ns="refund" value={r.state} />
                          {r.failure_code ? (
                            <span className="muted small block">{r.failure_code}</span>
                          ) : null}
                        </td>
                        <td>
                          <Money fils={r.amount_fils} />
                          <span className="muted small block">
                            {t('refund.commission_share')}: <Money fils={r.commission_fils} />
                          </span>
                        </td>
                        <td>
                          {r.requested_by}
                          {r.approved_by ? (
                            <span className="muted small block">
                              {t('refund.approved_by')}: {r.approved_by}
                              {r.decision_reason ? ` · ${r.decision_reason}` : ''}
                            </span>
                          ) : null}
                        </td>
                        <td>
                          {r.state === 'REQUESTED' && canApprove && !r.requested_by_me ? (
                            <DecisionButtons
                              path={`/admin/refunds/${r.id}`}
                              number={r.number}
                              ns="refund"
                              onDone={res.reload}
                            />
                          ) : null}
                          {r.state === 'REQUESTED' && r.requested_by_me ? (
                            <span className="muted small">{t('refund.self_note')}</span>
                          ) : null}
                          {r.state === 'SUBMITTED' && r.sandbox && r.provider_ref ? (
                            <SandboxComplete providerRef={r.provider_ref} onDone={res.reload} />
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
    </>
  );
}

export default function AdminRefundsPage() {
  return (
    <AdminShell require="admin.finance.read">
      <Refunds />
    </AdminShell>
  );
}
