'use client';
import { useState, type FormEvent } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { Button, Empty, Field, PageHeader, Pager } from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

type AuditRow = {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  actor_type: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  company_id: string | null;
  reason: string | null;
  details: Record<string, unknown> | null;
  request_id: string | null;
  ip: string | null;
  created_at: string;
};

function Audit() {
  const { locale } = useApp();
  const t = useT();
  const [draft, setDraft] = useState({ action: '', resource_type: '', resource_id: '' });
  const [filters, setFilters] = useState(draft);
  const pager = useCursor();
  const { state, reload } = useResource<AuditRow[]>('/admin/audit', {
    action: filters.action || undefined,
    resource_type: filters.resource_type || undefined,
    resource_id: filters.resource_id || undefined,
    cursor: pager.cursor,
  });

  return (
    <>
      <PageHeader title={t('admin.audit_title')} />
      <p className="muted">{t('admin.audit_intro')}</p>
      <form
        className="filters"
        role="search"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          pager.first();
          setFilters({
            action: draft.action.trim(),
            resource_type: draft.resource_type.trim(),
            resource_id: draft.resource_id.trim(),
          });
        }}
      >
        <Field label={t('admin.action')} dir="ltr" value={draft.action} onChange={(e) => setDraft({ ...draft, action: e.target.value })} />
        <Field label={t('admin.resource')} dir="ltr" value={draft.resource_type} onChange={(e) => setDraft({ ...draft, resource_type: e.target.value })} />
        <Field label={t('admin.resource_id')} dir="ltr" value={draft.resource_id} onChange={(e) => setDraft({ ...draft, resource_id: e.target.value })} />
        <Button type="submit" variant="secondary">
          {t('common.filter')}
        </Button>
      </form>
      <Resource state={state} reload={reload}>
        {(rows, next) =>
          rows.length === 0 ? (
            <Empty>{t('common.empty')}</Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table table-compact">
                  <thead>
                    <tr>
                      <th scope="col">{t('admin.time')}</th>
                      <th scope="col">{t('admin.action')}</th>
                      <th scope="col">{t('admin.actor')}</th>
                      <th scope="col">{t('admin.resource')}</th>
                      <th scope="col">{t('common.reason')}</th>
                      <th scope="col">{t('admin.request_id')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <time dateTime={a.created_at}>{formatDubaiTime(a.created_at, locale)}</time>
                        </td>
                        <td dir="ltr">
                          <code>{a.action}</code>
                        </td>
                        <td>
                          <bdi>{a.actor_email ?? a.actor_type}</bdi>
                          {a.ip ? (
                            <div className="muted">
                              <bdi>{a.ip}</bdi>
                            </div>
                          ) : null}
                        </td>
                        <td dir="ltr">
                          <code>{a.resource_type}</code>
                          {a.resource_id ? <div className="muted mono">{a.resource_id}</div> : null}
                        </td>
                        <td className="pre-wrap">{a.reason ?? ''}</td>
                        <td dir="ltr" className="mono muted">
                          {a.request_id ?? ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager hasPrev={pager.hasPrev} nextCursor={next} onFirst={pager.first} onNext={pager.next} />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function AdminAuditPage() {
  return (
    <AdminShell require="admin.audit.read">
      <Audit />
    </AdminShell>
  );
}
