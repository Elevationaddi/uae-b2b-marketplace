'use client';
import type { SupportTicketSummary } from '@app/contracts';
import { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { SupportStateTabs, SupportTable } from '@/components/support-ui';
import { Empty, PageHeader, Pager, SelectField } from '@/components/ui';
import { useCursor, useResource } from '@/lib/use-resource';

function Queue() {
  const t = useT();
  const { locale } = useApp();
  const [state, setState] = useState('');
  const [assigned, setAssigned] = useState('any');
  const pager = useCursor();
  const res = useResource<SupportTicketSummary[]>('/admin/support', {
    state: state || undefined,
    assigned: assigned === 'any' ? undefined : assigned,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('admin.nav.support')} />
      <p className="muted">{t('support.admin_intro')}</p>
      <SupportStateTabs admin value={state} onChange={(v) => (setState(v), pager.first())} />
      <div className="filters">
        <SelectField
          label={t('support.filter_assigned')}
          name="assigned"
          value={assigned}
          onChange={(e) => {
            setAssigned(e.target.value);
            pager.first();
          }}
          options={[
            { value: 'any', label: t('support.filter_any') },
            { value: 'me', label: t('support.assigned_mine') },
            { value: 'unassigned', label: t('support.unassigned') },
          ]}
        />
      </div>
      <Resource state={res.state} reload={res.reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('support.empty')}</p>
            </Empty>
          ) : (
            <>
              <SupportTable
                admin
                items={items}
                hrefFor={(s) => `/${locale}/admin/support/${s.id}`}
              />
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

export default function AdminSupportPage() {
  return (
    <AdminShell require="admin.support.read">
      <Queue />
    </AdminShell>
  );
}
