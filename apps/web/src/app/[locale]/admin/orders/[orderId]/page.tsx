'use client';
import type { OrderDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { OrderDetailView, OrderState } from '@/components/commerce-ui';
import { InvoiceDraftCard } from '@/components/invoice-draft';
import { FulfilmentCard } from '@/components/fulfilment-ui';
import { Resource } from '@/components/resource';
import { PageHeader } from '@/components/ui';
import { useResource } from '@/lib/use-resource';

function Detail() {
  const { locale } = useApp();
  const t = useT();
  const { orderId } = useParams<{ orderId: string }>();
  const { state, reload, setData } = useResource<OrderDetail>(`/admin/orders/${orderId}`);
  return (
    <Resource state={state} reload={reload} backHref={`/${locale}/admin/orders`}>
      {(o) => (
        <>
          <PageHeader title={t('order.number_title', { number: o.number })}>
            <OrderState value={o.state} />
          </PageHeader>
          <p className="muted">
            <Link href={`/${locale}/admin/orders`}>{t('admin.nav.orders')}</Link>
          </p>
          {o.state !== 'AWAITING_PAYMENT' ? (
            <FulfilmentCard
              o={o}
              side="admin"
              disputesBase={`/${locale}/admin/disputes`}
              onUpdated={setData}
            />
          ) : null}
          <OrderDetailView
            o={o}
            side="admin"
            invoiceDraft={<InvoiceDraftCard url={`/admin/orders/${orderId}/invoice-draft`} />}
          />
        </>
      )}
    </Resource>
  );
}

export default function AdminOrderPage() {
  return (
    <AdminShell require="admin.orders.read">
      <Detail />
    </AdminShell>
  );
}
