'use client';
import type { DisputeSummary } from '@app/contracts';
import { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { DisputeStateTabs } from '@/components/dispute-pages';
import { DisputesTable } from '@/components/fulfilment-ui';
import { Resource } from '@/components/resource';
import { Empty, PageHeader, Pager } from '@/components/ui';
import { useCursor, useResource } from '@/lib/use-resource';

function Disputes() {
  const t = useT();
  const { locale } = useApp();
  const [state, setState] = useState('');
  const [mine, setMine] = useState(false);
  const pager = useCursor();
  const res = useResource<DisputeSummary[]>('/admin/disputes', {
    state: state || undefined,
    mine: mine ? 'true' : undefined,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('admin.nav.disputes')} />
      <p className="muted">{t('dispute.admin_intro')}</p>
      <DisputeStateTabs value={state} onChange={(v) => (setState(v), pager.first())} />
      <label className="inline-field">
        <input
          type="checkbox"
          checked={mine}
          onChange={(e) => {
            setMine(e.target.checked);
            pager.first();
          }}
        />
        <span>{t('dispute.filter_mine')}</span>
      </label>
      <Resource state={res.state} reload={res.reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('dispute.empty')}</p>
            </Empty>
          ) : (
            <>
              <DisputesTable
                admin
                items={items}
                hrefFor={(d) => `/${locale}/admin/disputes/${d.id}`}
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

export default function AdminDisputesPage() {
  return (
    <AdminShell require="admin.disputes.read">
      <Disputes />
    </AdminShell>
  );
}
