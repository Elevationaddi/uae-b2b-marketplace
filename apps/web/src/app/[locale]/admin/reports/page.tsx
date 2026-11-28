'use client';
import { REPORT_TYPES, type ExportItem } from '@app/contracts';
import { useState, type FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import {
  Alert,
  ApiErrorAlert,
  Button,
  Empty,
  Field,
  PageHeader,
  Pager,
  SelectField,
  StatusBadge,
  TextArea,
  useFieldError,
} from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useCursor, useMutation, useResource } from '@/lib/use-resource';

/** Today and 30 days ago as Dubai calendar dates (UTC+04:00, no daylight saving). */
function defaultRange() {
  const day = 86400_000;
  const now = Date.now() + 4 * 3600_000;
  const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  return { from: iso(now - 29 * day), to: iso(now) };
}

function NewExport({ onCreated }: { onCreated: () => void }) {
  const t = useT();
  const me = useAdmin();
  const finance = me.capabilities.includes('admin.finance.read');
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [type, setType] = useState<string>(finance ? 'orders' : 'support_tickets');
  const [scope, setScope] = useState<string>(finance ? 'all' : 'assigned');
  const [done, setDone] = useState(false);
  const range = defaultRange();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const r = await m.run<ExportItem>('/admin/exports', {
      method: 'POST',
      body: {
        report_type: type,
        scope,
        from: String(fd.get('from') ?? ''),
        to: String(fd.get('to') ?? ''),
        reason: String(fd.get('reason') ?? ''),
        totp_code: String(fd.get('totp_code') ?? '').replace(/\s/g, ''),
      },
    });
    if (r.ok) {
      (form.elements.namedItem('totp_code') as HTMLInputElement).value = '';
      setDone(true);
      onCreated();
    } else {
      // A used or wrong code cannot be retried; clear it so the next attempt uses a fresh one.
      (form.elements.namedItem('totp_code') as HTMLInputElement).value = '';
    }
  }
  return (
    <form className="card" onSubmit={submit} noValidate data-testid="export-form">
      <h2 className="h3">{t('export.new')}</h2>
      <p className="muted small">{t('export.scope_hint')}</p>
      {done ? <Alert kind="success">{t('export.created')}</Alert> : null}
      {m.error && Object.keys(m.error.fieldErrors).length === 0 ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      <div className="filters">
        <SelectField
          label={t('export.report_type')}
          name="report_type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={REPORT_TYPES.map((r) => ({ value: r, label: t(`export.type.${r}`) }))}
          error={fe('report_type')}
        />
        <SelectField
          label={t('export.scope')}
          name="scope"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          options={[
            { value: 'all', label: t('export.scope.all') },
            { value: 'assigned', label: t('export.scope.assigned') },
          ]}
          error={fe('scope')}
        />
        <Field
          label={t('export.from')}
          name="from"
          type="date"
          required
          defaultValue={range.from}
          error={fe('from')}
        />
        <Field
          label={t('export.to')}
          name="to"
          type="date"
          required
          defaultValue={range.to}
          error={fe('to')}
        />
      </div>
      <TextArea
        label={t('export.reason')}
        name="reason"
        required
        rows={2}
        maxLength={500}
        error={fe('reason')}
      />
      <Field
        label={t('export.totp')}
        name="totp_code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        required
        hint={t('export.totp_hint')}
        error={fe('totp_code')}
      />
      <Button type="submit" busy={m.busy}>
        {t('export.create')}
      </Button>
    </form>
  );
}

function Exports() {
  const t = useT();
  const { locale } = useApp();
  const pager = useCursor();
  const res = useResource<ExportItem[]>('/admin/exports', { cursor: pager.cursor });
  return (
    <>
      <PageHeader title={t('export.title')} />
      <p className="muted">{t('export.intro')}</p>
      <NewExport onCreated={() => (pager.first(), res.reload())} />
      <section className="card" aria-labelledby="exp-list">
        <h2 id="exp-list" className="h3">
          {t('export.list_title')}
        </h2>
        <Resource state={res.state} reload={res.reload} lines={4}>
          {(items, next) =>
            items.length === 0 ? (
              <Empty>
                <p>{t('export.empty')}</p>
              </Empty>
            ) : (
              <>
                <div className="table-wrap">
                  <table className="table" data-testid="exports">
                    <thead>
                      <tr>
                        <th scope="col">{t('export.report_type')}</th>
                        <th scope="col">{t('export.period')}</th>
                        <th scope="col">{t('export.rows')}</th>
                        <th scope="col">{t('common.status')}</th>
                        <th scope="col">{t('export.expires')}</th>
                        <th scope="col">{t('common.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((x) => (
                        <tr key={x.id}>
                          <td>
                            {t(`export.type.${x.report_type}`)}
                            <span className="muted small block">
                              {t(`export.scope.${x.scope}`)}
                            </span>
                          </td>
                          <td>
                            <bdi>
                              {x.from} – {x.to}
                            </bdi>
                          </td>
                          <td>{x.row_count}</td>
                          <td>
                            <StatusBadge value={x.state} label={t(`export.state.${x.state}`)} />
                            {x.downloaded_at ? (
                              <span className="muted small block">
                                {t('export.downloaded')}: {formatDubaiTime(x.downloaded_at, locale)}
                              </span>
                            ) : null}
                          </td>
                          <td>{formatDubaiTime(x.expires_at, locale)}</td>
                          <td>
                            {x.state === 'READY' ? (
                              <a
                                href={`/api/v1/admin/exports/${x.id}/download`}
                                onClick={() => setTimeout(res.reload, 1500)}
                              >
                                {t('export.download')}
                              </a>
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

export default function AdminReportsPage() {
  return (
    <AdminShell require="admin.reports.export">
      <Exports />
    </AdminShell>
  );
}
