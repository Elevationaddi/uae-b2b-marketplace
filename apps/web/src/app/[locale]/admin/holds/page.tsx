'use client';
import { ORDER_HOLD_KINDS, type OrderHoldItem } from '@app/contracts';
import { useState, type FormEvent } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { StateBadge } from '@/components/fulfilment-ui';
import { Resource } from '@/components/resource';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  Empty,
  Field,
  PageHeader,
  Pager,
  SelectField,
  TextArea,
  useFieldError,
} from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useCursor, useMutation, useResource } from '@/lib/use-resource';

function PlaceHold({ onDone }: { onDone: () => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [ok, setOk] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const r = await m.run<OrderHoldItem>('/admin/holds', {
      method: 'POST',
      body: {
        order_id: String(fd.get('order_id') ?? '').trim(),
        kind: String(fd.get('kind') ?? ''),
        reason: String(fd.get('reason') ?? ''),
      },
    });
    if (r.ok) {
      form.reset();
      setOk(true);
      onDone();
    }
  }
  return (
    <section className="card" aria-labelledby="hold-new">
      <h2 id="hold-new" className="h3">
        {t('hold.place')}
      </h2>
      <form onSubmit={submit} data-testid="hold-form" noValidate>
        {ok ? <Alert kind="success">{t('hold.placed')}</Alert> : null}
        <Field label={t('hold.order_id')} name="order_id" required error={fe('order_id')} />
        <SelectField
          label={t('hold.kind')}
          name="kind"
          required
          error={fe('kind')}
          options={ORDER_HOLD_KINDS.map((k) => ({ value: k, label: t(`hold.kind.${k}`) }))}
        />
        <TextArea label={t('hold.reason')} name="reason" required rows={2} error={fe('reason')} />
        {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
          <ApiErrorAlert error={m.error} />
        ) : null}
        <Button type="submit" busy={m.busy}>
          {t('hold.place')}
        </Button>
      </form>
    </section>
  );
}

function Release({ h, onDone }: { h: OrderHoldItem; onDone: () => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        {t('hold.release')}
      </Button>
      <ConfirmDialog
        open={open}
        title={t('hold.release_title', { number: h.order_number })}
        confirmLabel={t('hold.release')}
        busy={m.busy}
        error={m.error && Object.keys(m.error.fieldErrors).length === 0 ? m.error : null}
        onClose={() => {
          setOpen(false);
          m.setError(null);
        }}
        onConfirm={async () => {
          const r = await m.run(`/admin/holds/${h.id}/release`, {
            method: 'POST',
            body: { reason },
          });
          if (r.ok) {
            setOpen(false);
            setReason('');
            onDone();
          }
        }}
      >
        <TextArea
          label={t('hold.release_reason')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={2}
          error={fe('reason')}
        />
      </ConfirmDialog>
    </>
  );
}

function Holds() {
  const t = useT();
  const { locale } = useApp();
  const [active, setActive] = useState<'true' | 'false'>('true');
  const pager = useCursor();
  const res = useResource<OrderHoldItem[]>('/admin/holds', { active, cursor: pager.cursor });
  return (
    <>
      <PageHeader title={t('hold.title')} />
      <p className="muted">{t('hold.intro')}</p>
      <PlaceHold onDone={res.reload} />
      <label className="inline-field">
        <span>{t('common.status')}</span>
        <select
          value={active}
          onChange={(e) => {
            setActive(e.target.value === 'false' ? 'false' : 'true');
            pager.first();
          }}
        >
          <option value="true">{t('hold.filter.active')}</option>
          <option value="false">{t('hold.filter.released')}</option>
        </select>
      </label>
      <Resource state={res.state} reload={res.reload} lines={5}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('hold.empty')}</p>
            </Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="holds">
                  <thead>
                    <tr>
                      <th scope="col">{t('hold.order')}</th>
                      <th scope="col">{t('hold.kind')}</th>
                      <th scope="col">{t('hold.reason')}</th>
                      <th scope="col">{t('ful.settlement')}</th>
                      <th scope="col">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((h) => (
                      <tr key={h.id}>
                        <td>
                          <bdi>{h.order_number}</bdi>
                          <span className="muted small block">{h.seller_company_name}</span>
                        </td>
                        <td>{t(`hold.kind.${h.kind}`)}</td>
                        <td>
                          {h.reason}
                          <span className="muted small block">
                            {t('hold.placed_by', { name: h.placed_by })} ·{' '}
                            {formatDubaiTime(h.placed_at, locale)}
                          </span>
                          {h.released_at ? (
                            <span className="muted small block">
                              {t('hold.released_by', { name: h.released_by ?? '' })} ·{' '}
                              {formatDubaiTime(h.released_at, locale)} · {h.release_reason}
                            </span>
                          ) : null}
                        </td>
                        <td>
                          <StateBadge ns="settlement" value={h.settlement_state} />
                        </td>
                        <td>{h.released_at ? null : <Release h={h} onDone={res.reload} />}</td>
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

export default function AdminHoldsPage() {
  return (
    <AdminShell require="admin.holds.manage">
      <Holds />
    </AdminShell>
  );
}
