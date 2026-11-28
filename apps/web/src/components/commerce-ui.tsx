'use client';
import type { AddressSnapshot, OrderDetail, OrderSummary } from '@app/contracts';
import Link from 'next/link';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useApp, useT } from './app-context';
import { Money } from './catalog-ui';
import { DefinitionList, StatusBadge } from './ui';

export function OrderState({ value }: { value: string }) {
  const t = useT();
  return <StatusBadge value={value} label={t(`order.state.${value}` as MessageKey)} />;
}

export function CheckoutState({ value }: { value: string }) {
  const t = useT();
  return <StatusBadge value={value} label={t(`checkout.state.${value}` as MessageKey)} />;
}

export function PaymentState({ value }: { value: string }) {
  const t = useT();
  return <StatusBadge value={value} label={t(`payment.state.${value}` as MessageKey)} />;
}

/** Labelled sandbox notice: shown wherever a sandbox payment is involved (no real money). */
export function SandboxNotice() {
  const t = useT();
  return (
    <div className="alert alert-warning sandbox-banner" role="note" data-testid="sandbox-notice">
      <p className="alert-title">{t('payment.sandbox_title')}</p>
      <p>{t('payment.sandbox_body')}</p>
    </div>
  );
}

export function AddressBlock({ a }: { a: AddressSnapshot | null }) {
  const t = useT();
  if (!a) return <p className="muted">{t('checkout.no_address')}</p>;
  return (
    <address className="address-block">
      <strong>{a.label}</strong>
      <br />
      {a.recipient} · <bdi dir="ltr">{a.phone}</bdi>
      <br />
      {a.line1}
      {a.line2 ? (
        <>
          <br />
          {a.line2}
        </>
      ) : null}
      <br />
      {a.city}, {t(`emirate.${a.emirate}` as MessageKey)}
    </address>
  );
}

export function OrderLines({ lines }: { lines: OrderDetail['lines'] }) {
  const t = useT();
  return (
    <div className="table-wrap">
      <table className="table" data-testid="order-lines">
        <thead>
          <tr>
            <th scope="col">{t('order.item')}</th>
            <th scope="col">{t('order.quantity')}</th>
            <th scope="col">{t('order.unit_price')}</th>
            <th scope="col">{t('order.line_total')}</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l) => (
            <tr key={l.id}>
              <td>
                {l.title}
                {l.sku_code ? (
                  <span className="muted small block">
                    <bdi>{l.sku_code}</bdi>
                    {Object.entries(l.variant_attributes).length
                      ? ` · ${Object.entries(l.variant_attributes)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}`
                      : ''}
                  </span>
                ) : null}
              </td>
              <td>
                {l.quantity} × {t(`unit.${l.unit}` as MessageKey)}
              </td>
              <td>
                <Money fils={l.unit_price_fils} />
              </td>
              <td>
                <Money fils={l.line_total_fils} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Totals({
  merchandise,
  shipping,
  tax,
  taxBps,
  total,
  extra,
}: {
  merchandise: string;
  shipping: string;
  tax: string;
  taxBps?: number;
  total: string;
  extra?: [string, React.ReactNode][];
}) {
  const t = useT();
  return (
    <dl className="totals" data-testid="totals">
      <div>
        <dt>{t('checkout.merchandise')}</dt>
        <dd>
          <Money fils={merchandise} />
        </dd>
      </div>
      <div>
        <dt>{t('checkout.shipping')}</dt>
        <dd>
          <Money fils={shipping} />
        </dd>
      </div>
      <div>
        <dt>
          {t('checkout.tax')}
          {taxBps !== undefined ? (
            <span className="muted small"> ({(taxBps / 100).toFixed(2)}%)</span>
          ) : null}
        </dt>
        <dd>
          <Money fils={tax} />
        </dd>
      </div>
      <div className="totals-total">
        <dt>{t('checkout.total')}</dt>
        <dd>
          <strong>
            <Money fils={total} />
          </strong>
        </dd>
      </div>
      {(extra ?? []).map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function OrdersTable({
  items,
  hrefFor,
  side,
}: {
  items: OrderSummary[];
  hrefFor: (o: OrderSummary) => string;
  side: 'buyer' | 'seller' | 'admin';
}) {
  const t = useT();
  const { locale } = useApp();
  return (
    <div className="table-wrap">
      <table className="table" data-testid="orders">
        <thead>
          <tr>
            <th scope="col">{t('order.number')}</th>
            <th scope="col">{side === 'seller' ? t('order.buyer') : t('order.supplier')}</th>
            {side === 'admin' ? <th scope="col">{t('order.buyer')}</th> : null}
            <th scope="col">{t('common.status')}</th>
            <th scope="col">{t('checkout.total')}</th>
            <th scope="col">{t('order.created')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((o) => (
            <tr key={o.id}>
              <td>
                <Link href={hrefFor(o)}>
                  <bdi>{o.number}</bdi>
                </Link>
                <span className="muted small block">
                  {t(`order.source.${o.source}` as MessageKey)} ·{' '}
                  {t('order.line_count', { count: o.line_count })}
                </span>
              </td>
              <td>{side === 'seller' ? o.buyer.company_name : o.seller.company_name}</td>
              {side === 'admin' ? <td>{o.buyer.company_name}</td> : null}
              <td>
                <OrderState value={o.state} />
              </td>
              <td>
                <Money fils={o.total_fils} />
              </td>
              <td>{formatDubaiTime(o.created_at, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const KNOWN_REASONS = new Set([
  'payment_window_expired',
  'cancelled_by_buyer',
  'cancelled_by_supplier',
  'refunded_in_full',
]);

export function OrderTimeline({ events }: { events: OrderDetail['events'] }) {
  const t = useT();
  const { locale } = useApp();
  return (
    <ol className="timeline" data-testid="order-timeline">
      {[...events].reverse().map((e) => (
        <li key={e.id}>
          <time dateTime={e.created_at}>{formatDubaiTime(e.created_at, locale)}</time>
          <div>
            <strong>{t(`order.event.${e.kind}` as MessageKey)}</strong>{' '}
            <span className="muted small">{t(`rfq.side.${e.actor_side}` as MessageKey)}</span>
            {e.reason ? (
              <p className="muted small">
                {KNOWN_REASONS.has(e.reason)
                  ? t(`order.reason.${e.reason}` as MessageKey)
                  : e.reason}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Order detail body shared by buyer, seller and admin views. */
export function OrderDetailView({
  o,
  side,
  checkoutHref,
  invoiceDraft,
}: {
  o: OrderDetail;
  side: 'buyer' | 'seller' | 'admin';
  checkoutHref?: string;
  /** Rendered after the totals: the non-binding invoice draft card (F05). */
  invoiceDraft?: React.ReactNode;
}) {
  const t = useT();
  const { locale } = useApp();
  return (
    <div className="two-col">
      <div>
        <section className="card" aria-labelledby="ord-lines">
          <h2 id="ord-lines" className="h3">
            {t('order.items')}
          </h2>
          <OrderLines lines={o.lines} />
          <Totals
            merchandise={o.merchandise_fils}
            shipping={o.shipping_fils}
            tax={o.tax_fils}
            taxBps={o.tax_bps}
            total={o.total_fils}
            extra={
              side !== 'buyer' && o.commission_fils !== null && o.seller_payable_fils !== null
                ? [
                    [t('order.commission'), <Money key="c" fils={o.commission_fils} />],
                    [t('order.seller_payable'), <Money key="p" fils={o.seller_payable_fils} />],
                  ]
                : undefined
            }
          />
          <p className="muted small" data-testid="order-tax-code">
            {t('tax.code')}: {t(`taxcode.${o.tax_code}`)}
            {o.tax_provisional ? ` · ${t('tax.provisional_note')}` : ''}
          </p>
        </section>
        {o.return_policy ? (
          <section className="card" aria-labelledby="ord-returns">
            <h2 id="ord-returns" className="h3">
              {t('checkout.return_policy')}
            </h2>
            <p className="pre-wrap">
              {locale === 'ar' && o.return_policy.ar
                ? o.return_policy.ar
                : (o.return_policy.en ?? o.return_policy.ar)}
            </p>
          </section>
        ) : null}
        {invoiceDraft}
        <section className="card" aria-labelledby="ord-tl">
          <h2 id="ord-tl" className="h3">
            {t('order.timeline')}
          </h2>
          <OrderTimeline events={o.events} />
        </section>
      </div>
      <div>
        <section className="card" aria-labelledby="ord-info">
          <h2 id="ord-info" className="h3">
            {t('order.details')}
          </h2>
          <DefinitionList
            items={[
              [t('order.supplier'), o.seller.company_name],
              [t('order.buyer'), o.buyer.company_name],
              [
                t('order.checkout'),
                <span key="c">
                  {checkoutHref ? (
                    <Link href={checkoutHref}>
                      <bdi>{o.checkout_number}</bdi>
                    </Link>
                  ) : (
                    <bdi>{o.checkout_number}</bdi>
                  )}{' '}
                  <CheckoutState value={o.checkout_state} />
                </span>,
              ],
              ...(o.state === 'AWAITING_PAYMENT'
                ? ([[t('order.pay_by'), formatDubaiTime(o.pay_by, locale)]] as [
                    string,
                    React.ReactNode,
                  ][])
                : []),
              ...(o.confirmed_at
                ? ([[t('order.confirmed_at'), formatDubaiTime(o.confirmed_at, locale)]] as [
                    string,
                    React.ReactNode,
                  ][])
                : []),
              ...(o.po_reference
                ? ([[t('checkout.po_reference'), <bdi key="po">{o.po_reference}</bdi>]] as [
                    string,
                    React.ReactNode,
                  ][])
                : []),
              ...(o.cancel_reason
                ? ([
                    [
                      t('order.cancel_reason'),
                      KNOWN_REASONS.has(o.cancel_reason)
                        ? t(`order.reason.${o.cancel_reason}` as MessageKey)
                        : o.cancel_reason,
                    ],
                  ] as [string, React.ReactNode][])
                : []),
            ]}
          />
        </section>
        <section className="card" aria-labelledby="ord-addr">
          <h2 id="ord-addr" className="h3">
            {t('checkout.delivery_address')}
          </h2>
          <AddressBlock a={o.address} />
        </section>
      </div>
    </div>
  );
}
