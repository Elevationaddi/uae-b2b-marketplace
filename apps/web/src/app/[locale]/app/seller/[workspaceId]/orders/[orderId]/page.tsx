'use client';
import type { OrderDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useT } from '@/components/app-context';
import { OrderDetailView, OrderState } from '@/components/commerce-ui';
import { Resource } from '@/components/resource';
import type { Workspace } from '@/components/session';
import { SellerShell } from '@/components/seller-shell';
import { Alert, PageHeader } from '@/components/ui';
import { useResource } from '@/lib/use-resource';

function Detail({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { orderId } = useParams<{ orderId: string }>();
  const { state, reload } = useResource<OrderDetail>(
    `/seller/workspaces/${ws.id}/orders/${orderId}`,
  );
  return (
    <Resource state={state} reload={reload} backHref={`${base}/orders`}>
      {(o) => (
        <>
          <PageHeader title={t('order.number_title', { number: o.number })}>
            <OrderState value={o.state} />
          </PageHeader>
          <p className="muted">
            <Link href={`${base}/orders`}>{t('seller.nav.orders')}</Link>
          </p>
          {o.state === 'AWAITING_PAYMENT' ? (
            <Alert kind="info">{t('order.awaiting_payment_seller')}</Alert>
          ) : null}
          {o.state === 'CONFIRMED' ? (
            <Alert kind="success">{t('order.confirmed_next_seller')}</Alert>
          ) : null}
          <OrderDetailView o={o} side="seller" />
        </>
      )}
    </Resource>
  );
}

export default function SellerOrderPage() {
  return <SellerShell>{(ws, base) => <Detail ws={ws} base={base} />}</SellerShell>;
}
