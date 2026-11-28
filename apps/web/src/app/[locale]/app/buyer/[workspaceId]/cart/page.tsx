'use client';
import type { CartLine, CartView } from '@app/contracts';
import Link from 'next/link';
import { useState } from 'react';
import { errorText, useApp, useT } from '@/components/app-context';
import { buyerApi, BuyerShell } from '@/components/buyer-shell';
import { Money, useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import type { Workspace } from '@/components/session';
import { Alert, Button, Empty, PageHeader } from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

function Line({ l, api, onChange }: { l: CartLine; api: string; onChange: (c: CartView) => void }) {
  const t = useT();
  const { locale } = useApp();
  const L = useLocalized();
  const m = useMutation();
  const [qty, setQty] = useState(String(l.quantity));
  const save = async () => {
    const r = await m.run<CartView>(`${api}/cart/items/${l.id}`, {
      method: 'PATCH',
      body: { quantity: Number(qty) },
    });
    if (r.ok) onChange(r.data);
  };
  const remove = async () => {
    const r = await m.run<CartView>(`${api}/cart/items/${l.id}`, { method: 'DELETE' });
    if (r.ok) onChange(r.data);
  };
  return (
    <tr data-line-id={l.id}>
      <td>
        <Link href={`/${locale}/products/${l.product_id}`}>{L(l.title_en, l.title_ar)}</Link>
        <span className="muted small block">
          <bdi>{l.sku_code}</bdi> · {t('cart.moq', { moq: l.moq, step: l.order_increment })}
        </span>
        {l.issue ? (
          <span className="pill pill-warn small">
            {t(`cart.issue.${l.issue}` as MessageKey, { available: l.available })}
          </span>
        ) : null}
      </td>
      <td>
        <div className="qty-edit">
          <label className="sr-only" htmlFor={`q-${l.id}`}>
            {t('order.quantity')}
          </label>
          <input
            id={`q-${l.id}`}
            type="number"
            inputMode="numeric"
            min={l.moq}
            step={l.order_increment}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
          <span className="muted small">{t(`unit.${l.unit}` as MessageKey)}</span>
          {qty !== String(l.quantity) ? (
            <Button type="button" variant="secondary" busy={m.busy} onClick={save}>
              {t('cart.update')}
            </Button>
          ) : null}
        </div>
        {m.error ? <p className="field-error">{errorText(locale, m.error)}</p> : null}
      </td>
      <td>{l.unit_price_fils ? <Money fils={l.unit_price_fils} /> : '—'}</td>
      <td>{l.line_total_fils ? <Money fils={l.line_total_fils} /> : '—'}</td>
      <td>
        <Button type="button" variant="link" busy={m.busy} onClick={remove}>
          {t('cart.remove')}
        </Button>
      </td>
    </tr>
  );
}

function Cart({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { locale } = useApp();
  const api = buyerApi(ws);
  const { state, reload, setData } = useResource<CartView>(`${api}/cart`);
  return (
    <>
      <PageHeader title={t('buyer.nav.cart')} />
      <Resource state={state} reload={reload} lines={6} backHref={`${base}/rfqs`}>
        {(c) =>
          c.line_count === 0 ? (
            <Empty>
              <p>{t('cart.empty')}</p>
              <Link className="btn btn-primary" href={`/${locale}/search`}>
                {t('cart.browse')}
              </Link>
            </Empty>
          ) : (
            <>
              {!c.checkout_available ? (
                <Alert kind="warning">{t('error.checkout.payments_disabled')}</Alert>
              ) : null}
              {c.groups.map((g) => (
                <section
                  className="card"
                  key={g.seller.workspace_id}
                  aria-label={g.seller.company_name}
                  data-testid="cart-group"
                >
                  <h2 className="h3">
                    {g.seller.storefront_id ? (
                      <Link href={`/${locale}/suppliers/${g.seller.storefront_id}`}>
                        {g.seller.company_name}
                      </Link>
                    ) : (
                      g.seller.company_name
                    )}
                  </h2>
                  <p className="muted small">
                    {g.delivery.fee_fils !== null && g.delivery.emirates.length > 0 ? (
                      <>
                        {t('cart.delivery_fee')} <Money fils={g.delivery.fee_fils} /> ·{' '}
                        {g.delivery.emirates
                          .map((e) => t(`emirate.${e}` as MessageKey))
                          .join(locale === 'ar' ? '، ' : ', ')}
                        {g.delivery.days !== null
                          ? ` · ${t('cart.delivery_days', { count: g.delivery.days })}`
                          : ''}
                      </>
                    ) : (
                      t('checkout.issue.no_delivery_terms')
                    )}
                  </p>
                  <div className="table-wrap">
                    <table className="table" data-testid="cart-lines">
                      <thead>
                        <tr>
                          <th scope="col">{t('order.item')}</th>
                          <th scope="col">{t('order.quantity')}</th>
                          <th scope="col">{t('order.unit_price')}</th>
                          <th scope="col">{t('order.line_total')}</th>
                          <th scope="col">
                            <span className="sr-only">{t('common.actions')}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.lines.map((l) => (
                          <Line key={l.id} l={l} api={api} onChange={setData} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="row-end">
                    {t('checkout.merchandise')}: <Money fils={g.merchandise_fils} />
                  </p>
                </section>
              ))}
              <div className="card checkout-bar">
                <p>
                  {t('checkout.merchandise')}{' '}
                  <strong>
                    <Money fils={c.merchandise_fils} />
                  </strong>
                  <span className="muted small block">{t('cart.totals_note')}</span>
                </p>
                {c.checkout_available ? (
                  <Link className="btn btn-primary" href={`${base}/checkout`}>
                    {t('cart.proceed')}
                  </Link>
                ) : null}
              </div>
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function CartPage() {
  return <BuyerShell>{(ws, base) => <Cart ws={ws} base={base} />}</BuyerShell>;
}
