'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { fieldText, useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import {
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  Empty,
  Field,
  PageHeader,
  SelectField,
} from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Item = {
  id: string;
  kind: 'PRODUCT' | 'SUPPLIER';
  target_id: string;
  title: string;
  position: number;
  starts_at: string | null;
  ends_at: string | null;
  reason: string;
  eligible: boolean;
  active_now: boolean;
  created_at: string;
};

/** datetime-local is interpreted as Asia/Dubai (UTC+4, no DST) and sent to the API in UTC. */
function dubaiLocalToIso(v: string): string | null {
  if (!v) return null;
  const d = new Date(`${v}:00+04:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function Featured() {
  const { locale } = useApp();
  const t = useT();
  const me = useAdmin();
  const { state, reload } = useResource<Item[]>('/admin/featured');
  const m = useMutation();
  const [remove, setRemove] = useState<Item | null>(null);
  const can = me.capabilities.includes('admin.featured.manage');
  const fe = (k: string) => fieldText(locale, m.error?.fieldErrors[k]);
  const add = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? '').trim();
    const r = await m.run('/admin/featured', {
      method: 'POST',
      body: {
        kind: s('kind'),
        target_id: s('target_id'),
        position: Number(s('position') || 0),
        starts_at: dubaiLocalToIso(s('starts_at')),
        ends_at: dubaiLocalToIso(s('ends_at')),
        reason: s('reason'),
      },
    });
    if (r.ok) {
      form.reset();
      reload();
    }
  };
  const doRemove = async () => {
    if (!remove) return;
    const r = await m.run(`/admin/featured/${remove.id}`, { method: 'DELETE' });
    if (r.ok) {
      setRemove(null);
      reload();
    }
  };
  return (
    <>
      <PageHeader title={t('acat.featured_title')} />
      <p className="muted">{t('acat.featured_note')}</p>
      {can ? (
        <form className="card" onSubmit={add} noValidate>
          <div className="grid-3">
            <SelectField
              label={t('acat.kind')}
              name="kind"
              defaultValue="PRODUCT"
              options={[
                { value: 'PRODUCT', label: t('acat.kind.PRODUCT') },
                { value: 'SUPPLIER', label: t('acat.kind.SUPPLIER') },
              ]}
            />
            <Field
              label={t('acat.target')}
              name="target_id"
              dir="ltr"
              required
              error={fe('target_id')}
            />
            <Field
              label={t('acat.position')}
              name="position"
              type="number"
              min={0}
              max={1000}
              defaultValue={0}
            />
          </div>
          <div className="grid-3">
            <Field label={t('acat.starts')} name="starts_at" type="datetime-local" />
            <Field
              label={t('acat.ends')}
              name="ends_at"
              type="datetime-local"
              error={fe('ends_at')}
            />
            <Field
              label={t('common.reason')}
              name="reason"
              required
              minLength={5}
              maxLength={500}
              error={fe('reason')}
            />
          </div>
          {m.error && !remove ? <ApiErrorAlert error={m.error} /> : null}
          <Button type="submit" variant="secondary" busy={m.busy}>
            {t('acat.add_featured')}
          </Button>
        </form>
      ) : null}
      <Resource state={state} reload={reload}>
        {(items) =>
          items.length === 0 ? (
            <Empty>{t('common.empty')}</Empty>
          ) : (
            <div className="table-wrap">
              <table className="table" data-testid="featured-table">
                <thead>
                  <tr>
                    <th scope="col">{t('acat.kind')}</th>
                    <th scope="col">{t('common.name')}</th>
                    <th scope="col">{t('acat.position')}</th>
                    <th scope="col">{t('common.status')}</th>
                    <th scope="col">{t('common.reason')}</th>
                    <th scope="col">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((f) => (
                    <tr key={f.id}>
                      <td>{t(`acat.kind.${f.kind}` as MessageKey)}</td>
                      <td>
                        <Link
                          href={
                            f.kind === 'PRODUCT'
                              ? `/${locale}/admin/catalog/products/${f.target_id}`
                              : `/${locale}/admin/catalog/storefronts`
                          }
                        >
                          {f.title}
                        </Link>
                      </td>
                      <td>{f.position}</td>
                      <td>
                        {!f.eligible ? (
                          <span className="pill pill-warn">{t('acat.ineligible')}</span>
                        ) : f.active_now ? (
                          <span className="pill pill-ok">{t('acat.eligible')}</span>
                        ) : (
                          <span className="pill">{t('acat.scheduled')}</span>
                        )}
                        {f.starts_at || f.ends_at ? (
                          <span className="muted small block">
                            {f.starts_at ? formatDubaiTime(f.starts_at, locale) : '…'} –{' '}
                            {f.ends_at ? formatDubaiTime(f.ends_at, locale) : '…'}
                          </span>
                        ) : null}
                      </td>
                      <td>{f.reason}</td>
                      <td>
                        {can ? (
                          <Button type="button" variant="link" onClick={() => setRemove(f)}>
                            {t('common.remove')}
                          </Button>
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
      <ConfirmDialog
        open={remove !== null}
        title={t('common.remove')}
        body={remove?.title}
        confirmLabel={t('common.remove')}
        danger
        busy={m.busy}
        error={remove ? m.error : null}
        onConfirm={doRemove}
        onClose={() => setRemove(null)}
      />
    </>
  );
}

export default function FeaturedPage() {
  return (
    <AdminShell require="admin.catalog.read">
      <Featured />
    </AdminShell>
  );
}
