'use client';
import { ORDER_STATES, type OrderSummary } from '@app/contracts';
import Link from 'next/link';
import { useState } from 'react';
import { useT } from '@/components/app-context';
import { buyerApi, BuyerShell } from '@/components/buyer-shell';
import { OrdersTable } from '@/components/commerce-ui';
import { Resource } from '@/components/resource';
import type { Workspace } from '@/components/session';
import { Empty, PageHeader, Pager } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

function List({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const c = useCursor();
  const [state, setState] = useState('');
  const { state: res, reload } = useResource<OrderSummary[]>(`${buyerApi(ws)}/orders`, {
    state: state || undefined,
    cursor: c.cursor || undefined,
  });
  return (
    <>
      <PageHeader title={t('buyer.nav.orders')}>
        {ws.capabilities.includes('buyer.purchase') ? (
          <Link className="btn btn-secondary" href={`${base}/cart`}>
            {t('buyer.nav.cart')}
          </Link>
        ) : null}
      </PageHeader>
      <div className="tabs" role="tablist">
        {['', ...ORDER_STATES].map((k) => (
          <button
            key={k || 'all'}
            type="button"
            role="tab"
            aria-selected={state === k}
            onClick={() => {
              setState(k);
              c.first();
            }}
          >
            {k ? t(`order.state.${k}` as MessageKey) : t('rfq.all')}
          </button>
        ))}
      </div>
      <Resource state={res} reload={reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('order.empty_buyer')}</p>
            </Empty>
          ) : (
            <>
              <OrdersTable items={items} side="buyer" hrefFor={(o) => `${base}/orders/${o.id}`} />
              <Pager hasPrev={c.hasPrev} nextCursor={next} onFirst={c.first} onNext={c.next} />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function BuyerOrdersPage() {
  return <BuyerShell>{(ws, base) => <List ws={ws} base={base} />}</BuyerShell>;
}
