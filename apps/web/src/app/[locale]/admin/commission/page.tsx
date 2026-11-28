'use client';
import type { CommissionSettings } from '@app/contracts';
import { useState, type FormEvent } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import {
  Alert,
  ApiErrorAlert,
  Button,
  DefinitionList,
  Empty,
  Field,
  PageHeader,
  TextArea,
  useFieldError,
} from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

/** "10" → 1000 bps, "7.5" → 750; null when not a percentage with at most two decimals. */
function percentToBps(v: string): number | null {
  const m = /^(\d{1,2})(?:\.(\d{1,2}))?$/.exec(v.trim());
  if (!m) return null;
  return Number(m[1]) * 100 + Number((m[2] ?? '').padEnd(2, '0'));
}
const bpsToPercent = (bps: number) => `${(bps / 100).toFixed(bps % 100 === 0 ? 0 : 2)}%`;

function NewRate({ onDone }: { onDone: (s: CommissionSettings) => void }) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [ok, setOk] = useState(false);
  const [rateError, setRateError] = useState<string | undefined>();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const bps = percentToBps(String(fd.get('rate') ?? ''));
    if (bps === null || bps > 5000) {
      setRateError(t('field.invalid'));
      return;
    }
    setRateError(undefined);
    const r = await m.run<CommissionSettings>('/admin/finance/commission', {
      method: 'POST',
      body: {
        rate_bps: bps,
        reason: String(fd.get('reason') ?? ''),
        totp_code: String(fd.get('totp_code') ?? '').replace(/\s/g, ''),
      },
    });
    // A used or wrong code cannot be retried; clear it either way.
    (form.elements.namedItem('totp_code') as HTMLInputElement).value = '';
    if (r.ok) {
      form.reset();
      setOk(true);
      onDone(r.data);
    }
  }
  return (
    <form className="card" onSubmit={submit} noValidate data-testid="commission-form">
      <h2 className="h3">{t('commission.new')}</h2>
      {ok ? <Alert kind="success">{t('commission.saved')}</Alert> : null}
      {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      <Field
        label={t('commission.rate')}
        name="rate"
        inputMode="decimal"
        required
        hint={t('commission.rate_hint')}
        error={rateError ?? fe('rate_bps')}
      />
      <TextArea
        label={t('commission.reason')}
        name="reason"
        required
        rows={2}
        error={fe('reason')}
      />
      <Field
        label={t('commission.totp')}
        name="totp_code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        required
        error={fe('totp_code')}
      />
      <Button type="submit" busy={m.busy}>
        {t('commission.save')}
      </Button>
    </form>
  );
}

function Commission() {
  const t = useT();
  const { locale } = useApp();
  const res = useResource<CommissionSettings>('/admin/finance/commission');
  return (
    <>
      <PageHeader title={t('commission.title')} />
      <p className="muted">{t('commission.intro')}</p>
      <Resource state={res.state} reload={res.reload} lines={4}>
        {(s) => (
          <>
            <section className="card" aria-labelledby="cm-cur">
              <h2 id="cm-cur" className="h3">
                {t('commission.current')}
              </h2>
              <div data-testid="commission-current">
                <DefinitionList
                  items={[
                    [t('commission.rate'), bpsToPercent(s.current.rate_bps)],
                    [
                      t('commission.history'),
                      s.current.source === 'policy'
                        ? t('commission.source.policy', { version: String(s.current.version) })
                        : t('commission.source.configuration'),
                    ],
                  ]}
                />
              </div>
            </section>
            {s.can_manage ? (
              <NewRate onDone={res.reload} />
            ) : (
              <p className="muted">{t('commission.readonly')}</p>
            )}
            <section className="card" aria-labelledby="cm-hist">
              <h2 id="cm-hist" className="h3">
                {t('commission.history')}
              </h2>
              {s.history.length === 0 ? (
                <Empty>
                  <p>{t('commission.empty')}</p>
                </Empty>
              ) : (
                <div className="table-wrap">
                  <table className="table" data-testid="commission-history">
                    <thead>
                      <tr>
                        <th scope="col">{t('commission.history')}</th>
                        <th scope="col">{t('commission.rate')}</th>
                        <th scope="col">{t('commission.reason')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.history.map((h) => (
                        <tr key={h.id}>
                          <td>
                            {t('commission.version', { version: String(h.version) })}
                            <span className="muted small block">
                              {formatDubaiTime(h.created_at, locale)}
                              {h.created_by ? ` · ${h.created_by}` : ''}
                            </span>
                          </td>
                          <td>{bpsToPercent(h.rate_bps)}</td>
                          <td>{h.reason}</td>
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

export default function AdminCommissionPage() {
  return (
    <AdminShell require="admin.finance.read">
      <Commission />
    </AdminShell>
  );
}
