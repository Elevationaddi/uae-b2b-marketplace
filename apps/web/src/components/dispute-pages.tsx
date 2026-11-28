'use client';
import { DISPUTE_STATES, type DisputeDetail, type DisputeSummary } from '@app/contracts';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useT } from './app-context';
import { DisputesTable, DisputeView, StateBadge } from './fulfilment-ui';
import { Resource } from './resource';
import { Empty, PageHeader, Pager } from './ui';
import { useCursor, useResource } from '@/lib/use-resource';

/** Dispute list for a buyer or seller workspace (members only; the API scopes every row). */
export function WorkspaceDisputes({
  apiBase,
  base,
  title,
}: {
  apiBase: string;
  base: string;
  title: string;
}) {
  const t = useT();
  const c = useCursor();
  const [state, setState] = useState('');
  const res = useResource<DisputeSummary[]>(`${apiBase}/disputes`, {
    state: state || undefined,
    cursor: c.cursor || undefined,
  });
  return (
    <>
      <PageHeader title={title} />
      <p className="muted">{t('dispute.list_intro')}</p>
      <DisputeStateTabs value={state} onChange={(v) => (setState(v), c.first())} />
      <Resource state={res.state} reload={res.reload} lines={5}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('dispute.empty')}</p>
            </Empty>
          ) : (
            <>
              <DisputesTable items={items} hrefFor={(d) => `${base}/disputes/${d.id}`} />
              <Pager hasPrev={c.hasPrev} nextCursor={next} onFirst={c.first} onNext={c.next} />
            </>
          )
        }
      </Resource>
    </>
  );
}

export function DisputeStateTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const t = useT();
  return (
    <div className="tabs" role="tablist">
      {['', ...DISPUTE_STATES].map((k) => (
        <button
          key={k || 'all'}
          type="button"
          role="tab"
          aria-selected={value === k}
          onClick={() => onChange(k)}
        >
          {k ? t(`dispute.state.${k as (typeof DISPUTE_STATES)[number]}`) : t('dispute.filter_all')}
        </button>
      ))}
    </div>
  );
}

/** Dispute detail for a buyer or seller workspace member. */
export function WorkspaceDispute({ apiBase, base }: { apiBase: string; base: string }) {
  const t = useT();
  const { disputeId } = useParams<{ disputeId: string }>();
  const res = useResource<DisputeDetail>(`${apiBase}/disputes/${disputeId}`);
  return (
    <Resource state={res.state} reload={res.reload} backHref={`${base}/disputes`}>
      {(d) => (
        <>
          <PageHeader title={t('dispute.number_title', { number: d.number })}>
            <StateBadge ns="dispute" value={d.state} />
          </PageHeader>
          <DisputeView
            d={d}
            orderHref={`${base}/orders/${d.order_id}`}
            postPath={`${apiBase}/disputes/${d.id}/messages`}
            fileHref={(f) => `${apiBase}/disputes/${d.id}/files/${f}`}
            allowFiles
            onUpdated={res.setData}
          />
        </>
      )}
    </Resource>
  );
}
