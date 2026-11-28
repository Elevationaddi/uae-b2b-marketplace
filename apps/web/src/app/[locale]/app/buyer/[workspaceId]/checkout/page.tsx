'use client';
import type {
  AddressItem,
  CheckoutPreview,
  CheckoutResponse,
  PaymentStartResponse,
} from '@app/contracts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { errorText, useApp, useT } from '@/components/app-context';
import { buyerApi, BuyerShell } from '@/components/buyer-shell';
import { Money, useLocalized } from '@/components/catalog-ui';
import { AddressBlock, SandboxNotice, Totals } from '@/components/commerce-ui';
import { Resource } from '@/components/resource';
import type { Workspace } from '@/components/session';
import {
  Alert,
  ApiErrorAlert,
  Button,
  Empty,
  Field,
  PageHeader,
  SelectField,
  Skeleton,
} from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { api as call, type ApiError } from '@/lib/client';
import { useMutation, useResource } from '@/lib/use-resource';

function Preview({ p }: { p: CheckoutPreview }) {
  const t = useT();
  const L = useLocalized();
  return (
    <>
      {p.groups.map((g) => (
        <section
          key={g.seller.workspace_id}
          className="card"
          aria-label={g.seller.company_name}
          data-testid="checkout-group"
        >
          <h2 className="h3">{g.seller.company_name}</h2>
          {g.issue ? (
            <Alert kind="warning">{t(`checkout.issue.${g.issue}` as MessageKey)}</Alert>
          ) : null}
          <ul className="plain-list">
            {g.lines.map((l) => (
              <li key={l.id}>
                {L(l.title_en, l.title_ar)} · {l.quantity} × {t(`unit.${l.unit}` as MessageKey)}{' '}
                {l.line_total_fils ? <Money fils={l.line_total_fils} /> : null}
                {l.issue ? (
                  <span className="pill pill-warn small">
                    {t(`cart.issue.${l.issue}` as MessageKey, { available: l.available })}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          <Totals
            merchandise={g.merchandise_fils}
            shipping={g.shipping_fils}
            tax={g.tax_fils}
            taxBps={g.tax_bps}
            total={g.total_fils}
          />
          <div className="small" data-testid="checkout-return-policy">
            <strong>{t('checkout.return_policy')}:</strong>{' '}
            {g.return_policy
              ? L(g.return_policy.en ?? g.return_policy.ar ?? '', g.return_policy.ar)
              : t('checkout.no_return_policy')}
          </div>
          <p className="muted small" data-testid="checkout-tax-code">
            {t('tax.code')}: {t(`taxcode.${g.tax_code}`)}
          </p>
          {g.delivery_days !== null ? (
            <p className="muted small">{t('cart.delivery_days', { count: g.delivery_days })}</p>
          ) : null}
        </section>
      ))}
    </>
  );
}

function Checkout({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { locale } = useApp();
  const router = useRouter();
  const api = buyerApi(ws);
  const addresses = useResource<AddressItem[]>(`${api}/addresses`);
  const [addressId, setAddressId] = useState('');
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [previewError, setPreviewError] = useState<ApiError | null>(null);
  const [po, setPo] = useState('');
  const [terms, setTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [checkoutKey] = useState(() => `checkout-${crypto.randomUUID()}`);
  const m = useMutation();

  useEffect(() => {
    if (addresses.state.status === 'ready' && !addressId && addresses.state.data[0])
      setAddressId(addresses.state.data[0].id);
  }, [addresses.state, addressId]);

  useEffect(() => {
    if (!addressId) return;
    let live = true;
    setPreview(null);
    setPreviewError(null);
    void call<CheckoutPreview>(`${api}/checkout/preview`, {
      method: 'POST',
      body: { address_id: addressId },
    }).then((r) => {
      if (!live) return;
      if (r.ok) setPreview(r.data);
      else setPreviewError(r);
    });
    return () => {
      live = false;
    };
  }, [addressId, api]);

  const place = async () => {
    if (!preview) return;
    if (!terms) {
      setTermsError(true);
      return;
    }
    const r = await m.run<CheckoutResponse>(`${api}/checkouts`, {
      method: 'POST',
      body: {
        address_id: addressId,
        preview_hash: preview.preview_hash,
        po_reference: po || undefined,
        accept_terms: true,
      },
      headers: { 'Idempotency-Key': checkoutKey },
    });
    if (!r.ok) return;
    const pay = await call<PaymentStartResponse>(`${api}/checkouts/${r.data.id}/pay`, {
      method: 'POST',
      body: {},
      headers: { 'Idempotency-Key': `pay-${crypto.randomUUID()}` },
    });
    router.push(pay.ok ? `/${locale}${pay.data.redirect_url}` : `${base}/checkouts/${r.data.id}`);
  };

  return (
    <>
      <PageHeader title={t('checkout.title')} />
      <p className="muted">
        <Link href={`${base}/cart`}>{t('buyer.nav.cart')}</Link>
      </p>
      <SandboxNotice />
      <Resource state={addresses.state} reload={addresses.reload}>
        {(list) =>
          list.length === 0 ? (
            <Empty>
              <p>{t('checkout.need_address')}</p>
              <Link className="btn btn-primary" href={`${base}/addresses?next=checkout`}>
                {t('address.add')}
              </Link>
            </Empty>
          ) : (
            <div className="two-col">
              <div>
                {previewError ? <ApiErrorAlert error={previewError} /> : null}
                {preview ? (
                  preview.groups.length === 0 ? (
                    <Empty>
                      <p>{t('cart.empty')}</p>
                    </Empty>
                  ) : (
                    <Preview p={preview} />
                  )
                ) : !previewError ? (
                  <Skeleton lines={6} />
                ) : null}
              </div>
              <div>
                <section className="card" aria-labelledby="chk-addr">
                  <h2 id="chk-addr" className="h3">
                    {t('checkout.delivery_address')}
                  </h2>
                  <SelectField
                    label={t('checkout.choose_address')}
                    value={addressId}
                    onChange={(e) => setAddressId(e.target.value)}
                    options={list.map((a) => ({
                      value: a.id,
                      label: `${a.label} · ${t(`emirate.${a.emirate}` as MessageKey)}`,
                    }))}
                  />
                  <AddressBlock a={list.find((a) => a.id === addressId) ?? null} />
                  <p>
                    <Link href={`${base}/addresses?next=checkout`}>{t('address.manage')}</Link>
                  </p>
                </section>
                {preview && preview.groups.length > 0 ? (
                  <section
                    className="card"
                    aria-labelledby="chk-sum"
                    data-testid="checkout-summary"
                  >
                    <h2 id="chk-sum" className="h3">
                      {t('checkout.summary')}
                    </h2>
                    <Totals
                      merchandise={preview.merchandise_fils}
                      shipping={preview.shipping_fils}
                      tax={preview.tax_fils}
                      taxBps={preview.tax_bps ?? undefined}
                      total={preview.total_fils}
                    />
                    {preview.tax_provisional ? (
                      <p className="muted small" data-testid="tax-provisional">
                        {t('tax.provisional_note')}
                      </p>
                    ) : null}
                    <p className="muted small">
                      {t('checkout.orders_note', { count: preview.groups.length })}{' '}
                      {t('checkout.reservation_note', { minutes: preview.reservation_minutes })}
                    </p>
                    <Field
                      label={t('checkout.po_reference')}
                      optional
                      maxLength={60}
                      value={po}
                      onChange={(e) => setPo(e.target.value)}
                    />
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={terms}
                        onChange={(e) => {
                          setTerms(e.target.checked);
                          setTermsError(false);
                        }}
                      />
                      <span>{t('checkout.accept_terms')}</span>
                    </label>
                    {termsError ? (
                      <p className="field-error">{t('checkout.terms_required')}</p>
                    ) : null}
                    {m.error ? (
                      <Alert kind="error">
                        {errorText(locale, m.error)}{' '}
                        {m.error.status === 409 ? (
                          <Link href={`${base}/cart`}>{t('checkout.review_cart')}</Link>
                        ) : null}
                      </Alert>
                    ) : null}
                    <Button
                      type="button"
                      busy={m.busy}
                      disabled={preview.blocked}
                      onClick={place}
                      data-testid="place-order"
                    >
                      {t('checkout.place_and_pay')}
                    </Button>
                    {preview.blocked ? (
                      <p className="muted small">{t('checkout.blocked')}</p>
                    ) : null}
                  </section>
                ) : null}
              </div>
            </div>
          )
        }
      </Resource>
    </>
  );
}

export default function CheckoutPage() {
  return <BuyerShell>{(ws, base) => <Checkout ws={ws} base={base} />}</BuyerShell>;
}
