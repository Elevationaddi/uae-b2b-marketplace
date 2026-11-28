'use client';
import { ORDER_STATES, type OrderSummary } from '@app/contracts';
import { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { OrdersTable } from '@/components/commerce-ui';
import { Resource } from '@/components/resource';
import { Empty, PageHeader, Pager } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

function Orders() {
  const { locale } = useApp();
  const t = useT();
  const [state, setState] = useState('');
  const pager = useCursor();
  const res = useResource<OrderSummary[]>('/admin/orders', {
    state: state || undefined,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('admin.nav.orders')} />
      <p className="muted">{t('admin.orders.intro')}</p>
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
          {ORDER_STATES.map((s) => (
            <option key={s} value={s}>
              {t(`order.state.${s}` as MessageKey)}
            </option>
          ))}
        </select>
      </label>
      <Resource state={res.state} reload={res.reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('order.empty_admin')}</p>
            </Empty>
          ) : (
            <>
              <OrdersTable
                items={items}
                side="admin"
                hrefFor={(o) => `/${locale}/admin/orders/${o.id}`}
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

export default function AdminOrdersPage() {
  return (
    <AdminShell require="admin.orders.read">
      <Orders />
    </AdminShell>
  );
}
