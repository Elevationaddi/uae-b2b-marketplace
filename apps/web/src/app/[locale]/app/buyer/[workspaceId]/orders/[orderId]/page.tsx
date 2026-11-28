'use client';
import type { OrderDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useT } from '@/components/app-context';
import { buyerApi, BuyerShell } from '@/components/buyer-shell';
import { OrderDetailView, OrderState } from '@/components/commerce-ui';
import { FulfilmentCard } from '@/components/fulfilment-ui';
import { Resource } from '@/components/resource';
import type { Workspace } from '@/components/session';
import { Alert, PageHeader } from '@/components/ui';
import { useResource } from '@/lib/use-resource';

function Detail({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { orderId } = useParams<{ orderId: string }>();
  const { state, reload, setData } = useResource<OrderDetail>(`${buyerApi(ws)}/orders/${orderId}`);
  return (
    <Resource state={state} reload={reload} backHref={`${base}/orders`}>
      {(o) => (
        <>
          <PageHeader title={t('order.number_title', { number: o.number })}>
            <OrderState value={o.state} />
            {o.state === 'AWAITING_PAYMENT' && o.checkout_state === 'PENDING_PAYMENT' ? (
              <Link className="btn btn-primary" href={`${base}/checkouts/${o.checkout_id}`}>
                {t('checkout.pay_now')}
              </Link>
            ) : null}
          </PageHeader>
          <p className="muted">
            <Link href={`${base}/orders`}>{t('buyer.nav.orders')}</Link>
            {o.rfq_id ? (
              <>
                {' '}
                · <Link href={`${base}/rfqs/${o.rfq_id}`}>{t('checkout.view_rfq')}</Link>
              </>
            ) : null}
          </p>
          {o.state === 'CONFIRMED' ? (
            <Alert kind="info">{t('order.confirmed_next_buyer')}</Alert>
          ) : null}
          {o.state !== 'AWAITING_PAYMENT' && o.state !== 'CANCELLED' ? (
            <FulfilmentCard
              o={o}
              side="buyer"
              apiBase={buyerApi(ws)}
              disputesBase={`${base}/disputes`}
              onUpdated={setData}
            />
          ) : null}
          {ws.role !== 'VIEWER' ? (
            <p>
              <Link href={`${base}/support/new?order=${o.id}`}>{t('support.contact')}</Link>
            </p>
          ) : null}
          <OrderDetailView o={o} side="buyer" checkoutHref={`${base}/checkouts/${o.checkout_id}`} />
        </>
      )}
    </Resource>
  );
}

export default function BuyerOrderPage() {
  return <BuyerShell>{(ws, base) => <Detail ws={ws} base={base} />}</BuyerShell>;
}
