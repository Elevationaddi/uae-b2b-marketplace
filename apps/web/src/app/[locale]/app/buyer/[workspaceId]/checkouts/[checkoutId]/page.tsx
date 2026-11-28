'use client';
import type { AddressItem, CheckoutResponse, PaymentStartResponse } from '@app/contracts';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { errorText, useApp, useT } from '@/components/app-context';
import { buyerApi, BuyerShell } from '@/components/buyer-shell';
import { Money } from '@/components/catalog-ui';
import {
  AddressBlock,
  CheckoutState,
  OrderState,
  PaymentState,
  SandboxNotice,
  Totals,
} from '@/components/commerce-ui';
import { Resource } from '@/components/resource';
import type { Workspace } from '@/components/session';
import {
  Alert,
  Button,
  ConfirmDialog,
  DefinitionList,
  PageHeader,
  SelectField,
} from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

function Detail({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { locale } = useApp();
  const router = useRouter();
  const { checkoutId } = useParams<{ checkoutId: string }>();
  const api = `${buyerApi(ws)}/checkouts/${checkoutId}`;
  const { state, reload, setData } = useResource<CheckoutResponse>(api);
  const needsAddress = state.status === 'ready' && !state.data.address && state.data.can_pay;
  const addresses = useResource<AddressItem[]>(needsAddress ? `${buyerApi(ws)}/addresses` : null);
  const [addressId, setAddressId] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const m = useMutation();

  // While a payment is with the provider, the page refreshes until the verified webhook lands.
  const waiting =
    state.status === 'ready' &&
    state.data.state === 'PENDING_PAYMENT' &&
    state.data.payments.some((p) => p.state === 'PENDING');
  useEffect(() => {
    if (!waiting) return;
    const id = setInterval(reload, 3000);
    return () => clearInterval(id);
  }, [waiting, reload]);

  useEffect(() => {
    if (addresses.state.status === 'ready' && !addressId && addresses.state.data[0])
      setAddressId(addresses.state.data[0].id);
  }, [addresses.state, addressId]);

  const pay = async () => {
    const r = await m.run<PaymentStartResponse>(`${api}/pay`, {
      method: 'POST',
      body: needsAddress ? { address_id: addressId } : {},
      headers: { 'Idempotency-Key': `pay-${crypto.randomUUID()}` },
    });
    if (r.ok) router.push(`/${locale}${r.data.redirect_url}`);
    else if (r.status === 409) reload();
  };

  return (
    <Resource state={state} reload={reload} backHref={`${base}/orders`}>
      {(c) => {
        const failed = c.payments.find((p) => p.state === 'FAILED');
        return (
          <>
            <PageHeader title={t('checkout.number_title', { number: c.number })}>
              <CheckoutState value={c.state} />
            </PageHeader>
            <p className="muted">
              <Link href={`${base}/orders`}>{t('buyer.nav.orders')}</Link> ·{' '}
              {t(`order.source.${c.source}` as MessageKey)}
              {c.rfq_id ? (
                <>
                  {' '}
                  · <Link href={`${base}/rfqs/${c.rfq_id}`}>{t('checkout.view_rfq')}</Link>
                </>
              ) : null}
            </p>
            {c.sandbox ? <SandboxNotice /> : null}
            {c.state === 'PAID' ? (
              <Alert kind="success" title={t('checkout.paid_title')}>
                <p>{t('checkout.paid_body')}</p>
              </Alert>
            ) : null}
            {waiting ? (
              <Alert kind="info" title={t('checkout.awaiting_confirmation_title')}>
                <p>{t('checkout.awaiting_confirmation_body')}</p>
              </Alert>
            ) : null}
            {c.state === 'PENDING_PAYMENT' && !waiting ? (
              <Alert kind="warning" title={t('checkout.pay_by_title')}>
                <p>
                  {t('checkout.pay_by_body', { at: formatDubaiTime(c.pay_by, locale) })}
                  {c.reservation_expires_at ? ` ${t('checkout.stock_held')}` : ''}
                </p>
                {failed ? (
                  <p>
                    {t('checkout.last_failed', {
                      code: failed.failure_code ?? '',
                    })}
                  </p>
                ) : null}
              </Alert>
            ) : null}
            {c.state === 'EXPIRED' ? <Alert kind="info">{t('checkout.expired_body')}</Alert> : null}
            {c.state === 'CANCELLED' ? (
              <Alert kind="info">{t('checkout.cancelled_body')}</Alert>
            ) : null}
            {c.state === 'RECONCILIATION_REQUIRED' ? (
              <Alert kind="warning">{t('checkout.reconciliation_body')}</Alert>
            ) : null}
            {m.error ? <Alert kind="error">{errorText(locale, m.error)}</Alert> : null}

            <div className="two-col">
              <div>
                <section className="card" aria-labelledby="co-orders">
                  <h2 id="co-orders" className="h3">
                    {t('checkout.orders')}
                  </h2>
                  <ul className="plain-list" data-testid="checkout-orders">
                    {c.orders.map((o) => (
                      <li key={o.id}>
                        <Link href={`${base}/orders/${o.id}`}>
                          <bdi>{o.number}</bdi>
                        </Link>{' '}
                        · {o.seller.company_name} · <Money fils={o.total_fils} />{' '}
                        <OrderState value={o.state} />
                      </li>
                    ))}
                  </ul>
                  <Totals
                    merchandise={c.merchandise_fils}
                    shipping={c.shipping_fils}
                    tax={c.tax_fils}
                    total={c.total_fils}
                  />
                </section>
                <section className="card" aria-labelledby="co-pay">
                  <h2 id="co-pay" className="h3">
                    {t('checkout.payments')}
                  </h2>
                  {c.payments.length === 0 ? (
                    <p className="muted">{t('checkout.no_payments')}</p>
                  ) : (
                    <ul className="plain-list" data-testid="payments">
                      {c.payments.map((p) => (
                        <li key={p.id}>
                          <PaymentState value={p.state} /> <Money fils={p.amount_fils} /> ·{' '}
                          {formatDubaiTime(p.created_at, locale)}
                          {p.sandbox ? (
                            <span className="pill pill-warn small">
                              {t('payment.sandbox_pill')}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>
              <div>
                <section className="card" aria-labelledby="co-addr">
                  <h2 id="co-addr" className="h3">
                    {t('checkout.delivery_address')}
                  </h2>
                  {c.address ? (
                    <AddressBlock a={c.address} />
                  ) : needsAddress && addresses.state.status === 'ready' ? (
                    addresses.state.data.length === 0 ? (
                      <p>
                        <Link href={`${base}/addresses`}>{t('address.add')}</Link>
                      </p>
                    ) : (
                      <SelectField
                        label={t('checkout.choose_address')}
                        hint={t('checkout.quote_address_hint')}
                        value={addressId}
                        onChange={(e) => setAddressId(e.target.value)}
                        options={addresses.state.data.map((a) => ({
                          value: a.id,
                          label: `${a.label} · ${t(`emirate.${a.emirate}` as MessageKey)}`,
                        }))}
                        error={
                          m.error?.fieldErrors?.address_id
                            ? t('checkout.address_emirate_mismatch')
                            : undefined
                        }
                      />
                    )
                  ) : (
                    <AddressBlock a={null} />
                  )}
                </section>
                <section className="card" aria-labelledby="co-info">
                  <h2 id="co-info" className="h3">
                    {t('order.details')}
                  </h2>
                  <DefinitionList
                    items={[
                      [t('checkout.pay_by_label'), formatDubaiTime(c.pay_by, locale)],
                      ...(c.paid_at
                        ? ([[t('checkout.paid_at'), formatDubaiTime(c.paid_at, locale)]] as [
                            string,
                            string,
                          ][])
                        : []),
                      ...(c.po_reference
                        ? ([[t('checkout.po_reference'), c.po_reference]] as [string, string][])
                        : []),
                    ]}
                  />
                  <div className="row-actions">
                    {c.can_pay ? (
                      <Button
                        type="button"
                        busy={m.busy}
                        disabled={needsAddress && !addressId}
                        onClick={pay}
                        data-testid="pay-now"
                      >
                        {waiting ? t('checkout.resume_payment') : t('checkout.pay_now')}
                      </Button>
                    ) : null}
                    {c.can_pay && c.source === 'CART' ? (
                      <Button type="button" variant="danger" onClick={() => setConfirmCancel(true)}>
                        {t('checkout.cancel')}
                      </Button>
                    ) : null}
                  </div>
                </section>
              </div>
            </div>
            <ConfirmDialog
              open={confirmCancel}
              title={t('checkout.cancel')}
              body={t('checkout.cancel_body')}
              confirmLabel={t('checkout.cancel')}
              danger
              busy={m.busy}
              error={m.error}
              onClose={() => setConfirmCancel(false)}
              onConfirm={async () => {
                const r = await m.run<CheckoutResponse>(`${api}/cancel`, { method: 'POST' });
                if (r.ok) {
                  setData(r.data);
                  setConfirmCancel(false);
                }
              }}
            />
          </>
        );
      }}
    </Resource>
  );
}

export default function CheckoutDetailPage() {
  return <BuyerShell>{(ws, base) => <Detail ws={ws} base={base} />}</BuyerShell>;
}
