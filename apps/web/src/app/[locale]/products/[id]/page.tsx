'use client';
import type { CartView, MeResponse, ProductCard, PublicProductDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { useApp, useT } from '@/components/app-context';
import {
  AvailabilityBadge,
  CapabilityPills,
  MediaImg,
  Money,
  ProductGrid,
  Section,
  useLocalized,
  VerifiedBadge,
} from '@/components/catalog-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { ApiErrorAlert, Button, DefinitionList } from '@/components/ui';
import { formatDate, type MessageKey } from '@/i18n/messages';
import { api } from '@/lib/client';
import { useMutation, useResource } from '@/lib/use-resource';

type Estimate = {
  unit_price_fils: string;
  line_total_fils: string;
  tier_min_qty: number;
  quantity: number;
};

function Gallery({ d }: { d: PublicProductDetail }) {
  const t = useT();
  const L = useLocalized();
  const [i, setI] = useState(0);
  const title = L(d.title_en, d.title_ar);
  const m = d.media[i];
  if (!d.media.length) return <MediaImg src={null} alt="" className="pd-main-img" />;
  return (
    <div className="pd-gallery" aria-label={t('pd.gallery')} role="group">
      <MediaImg
        src={m?.url ?? null}
        alt={L(m?.alt_en, m?.alt_ar) || title}
        className="pd-main-img"
        width={m?.width}
        height={m?.height}
      />
      {d.media.length > 1 ? (
        <ul className="pd-thumbs">
          {d.media.map((x, n) => (
            <li key={x.id}>
              <button
                type="button"
                aria-pressed={n === i}
                aria-label={t('pd.image_n', { n: n + 1, total: d.media.length })}
                onClick={() => setI(n)}
              >
                <MediaImg src={x.url} alt="" className="pd-thumb" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function EstimateBox({ d }: { d: PublicProductDetail }) {
  const t = useT();
  const skus = d.skus.filter((s) => s.tiers && s.tiers.length);
  const [skuId, setSkuId] = useState(skus[0]?.id ?? '');
  const sku = skus.find((s) => s.id === skuId);
  const [qty, setQty] = useState(String(sku?.moq ?? 1));
  const [result, setResult] = useState<Estimate | null>(null);
  const m = useMutation();
  if (!d.price_visible || d.price_type === 'QUOTE_ONLY' || !skus.length) return null;
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setResult(null);
    const r = await m.run<Estimate>(`/marketplace/products/${d.id}/estimate`, {
      query: { sku_id: skuId, quantity: qty },
    });
    if (r.ok) setResult(r.data);
  };
  return (
    <form className="card pd-estimate" onSubmit={submit} aria-labelledby="est-h">
      <h2 id="est-h" className="h3">
        {t('pd.estimate')}
      </h2>
      {skus.length > 1 ? (
        <div className="field">
          <label htmlFor="est-sku">{t('pd.variant')}</label>
          <select id="est-sku" value={skuId} onChange={(e) => setSkuId(e.target.value)}>
            {skus.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}
                {Object.values(s.variant_attributes).length
                  ? ` · ${Object.values(s.variant_attributes).join(' / ')}`
                  : ''}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="est-qty">{t('pd.quantity')}</label>
        <input
          id="est-qty"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        {sku ? (
          <p className="field-hint">
            {t('mkt.moq_label')}: {sku.moq} · {t('mkt.increment_label')}: {sku.order_increment}
          </p>
        ) : null}
      </div>
      <Button type="submit" variant="secondary" busy={m.busy}>
        {t('pd.calculate')}
      </Button>
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      {result ? (
        <div role="status" data-testid="estimate-result">
          <DefinitionList
            items={[
              [t('pd.unit_price'), <Money key="u" fils={result.unit_price_fils} />],
              [t('pd.line_total'), <Money key="l" fils={result.line_total_fils} />],
            ]}
          />
        </div>
      ) : null}
      <p className="muted small">{t('pd.estimate_note')}</p>
    </form>
  );
}

function BuyerActions({
  d,
  onChange,
}: {
  d: PublicProductDetail;
  onChange: (v: PublicProductDetail['viewer']) => void;
}) {
  const { locale } = useApp();
  const t = useT();
  const m = useMutation();
  if (d.viewer.tier === 'guest')
    return (
      <p className="small">
        <Link href={`/${locale}/login?next=${encodeURIComponent(`/${locale}/products/${d.id}`)}`}>
          {t('pd.sign_in_to_save')}
        </Link>
      </p>
    );
  const toggle = async (kind: 'saved' | 'compared') => {
    const on = d.viewer[kind];
    const path =
      kind === 'saved' ? `/marketplace/saved/products/${d.id}` : `/marketplace/compare/${d.id}`;
    const r = await m.run(path, { method: on ? 'DELETE' : 'POST' });
    if (r.ok) onChange({ ...d.viewer, [kind]: !on });
  };
  return (
    <div className="pd-actions">
      <Button
        type="button"
        variant="secondary"
        busy={m.busy}
        aria-pressed={d.viewer.saved}
        onClick={() => toggle('saved')}
      >
        {d.viewer.saved ? t('pd.saved') : t('pd.save')}
      </Button>
      <Button
        type="button"
        variant="secondary"
        busy={m.busy}
        aria-pressed={d.viewer.compared}
        onClick={() => toggle('compared')}
      >
        {d.viewer.compared ? t('pd.in_compare') : t('pd.add_compare')}
      </Button>
      {d.viewer.compared ? <Link href={`/${locale}/compare`}>{t('mkt.compare')}</Link> : null}
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
    </div>
  );
}

/** Add to cart (P4-6): ready-stock priced listings for approved trading buyers. */
function AddToCart({ d }: { d: PublicProductDetail }) {
  const t = useT();
  const { locale } = useApp();
  const me = useResource<MeResponse>('/me');
  const buyers =
    me.state.status === 'ready'
      ? me.state.data.workspaces.filter(
          (w) => w.kind === 'BUYER' && w.capabilities.includes('buyer.purchase'),
        )
      : [];
  const skus = d.skus.filter((s) => s.availability === 'IN_STOCK');
  const [skuId, setSkuId] = useState(skus[0]?.id ?? '');
  const sku = skus.find((s) => s.id === skuId);
  const [qty, setQty] = useState(String(sku?.moq ?? 1));
  const [added, setAdded] = useState<string | null>(null);
  const m = useMutation();
  if (!sku) return <p className="muted small">{t('pd.out_of_stock_cart')}</p>;
  const ws = buyers[0];
  if (!ws) return null;
  const add = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAdded(null);
    const r = await m.run<CartView>(`/buyer/workspaces/${ws.id}/cart/items`, {
      method: 'POST',
      body: { sku_id: sku.id, quantity: Number(qty) },
    });
    if (r.ok) setAdded(`/${locale}/app/buyer/${ws.id}/cart`);
  };
  return (
    <form className="add-to-cart" onSubmit={add} noValidate data-testid="add-to-cart">
      {skus.length > 1 ? (
        <label className="field">
          <span>{t('pd.variant')}</span>
          <select
            value={skuId}
            onChange={(e) => {
              setSkuId(e.target.value);
              const n = skus.find((x) => x.id === e.target.value);
              if (n) setQty(String(n.moq));
            }}
          >
            {skus.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code}
                {Object.values(s.variant_attributes).length
                  ? ` · ${Object.values(s.variant_attributes).join(' / ')}`
                  : ''}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="field">
        <span>
          {t('order.quantity')} ({t(`unit.${sku.unit}` as MessageKey)})
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={sku.moq}
          step={sku.order_increment}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      </label>
      <p className="muted small">{t('cart.moq', { moq: sku.moq, step: sku.order_increment })}</p>
      <Button type="submit" busy={m.busy}>
        {t('pd.add_to_cart')}
      </Button>
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      {added ? (
        <p className="alert alert-success" role="status">
          {t('pd.added_to_cart')} <Link href={added}>{t('pd.view_cart')}</Link>
        </p>
      ) : null}
    </form>
  );
}

function TradingActions({ d }: { d: PublicProductDetail }) {
  const t = useT();
  const { locale } = useApp();
  const L = useLocalized();
  const reasonId = `trading-${d.id}`;
  const rfqHref = `/${locale}/app/rfqs/new?${new URLSearchParams({
    category: d.category.id,
    title: L(d.title_en, d.title_ar).slice(0, 160),
    ...(d.supplier.storefront_id ? { invite: d.supplier.storefront_id } : {}),
  })}`;
  return (
    <div className="pd-trade">
      {d.viewer.trading.rfq ? (
        <Link className="btn btn-primary" href={rfqHref}>
          {t('pd.request_quote')}
        </Link>
      ) : (
        <Button type="button" disabled aria-describedby={reasonId}>
          {t('pd.request_quote')}
        </Button>
      )}
      {d.viewer.trading.available ? (
        <AddToCart d={d} />
      ) : d.price_type !== 'QUOTE_ONLY' ? (
        <Button type="button" variant="secondary" disabled aria-describedby={reasonId}>
          {t('pd.buy')}
        </Button>
      ) : null}
      {d.viewer.trading.reason ? (
        <p id={reasonId} className="muted small">
          {t(`pd.trading.${d.viewer.trading.reason}` as MessageKey)}
        </p>
      ) : null}
    </div>
  );
}

function Product({ id }: { id: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const { state, reload, setData } = useResource<PublicProductDetail>(
    `/marketplace/products/${id}`,
  );
  const related = useResource<ProductCard[]>(
    state.status === 'ready' ? `/marketplace/products/${id}/related` : null,
  );
  const verified = state.status === 'ready' && state.data.viewer.tier === 'verified';

  useEffect(() => {
    // Recently viewed is a per-user list, recorded only for signed-in, verified viewers.
    if (verified) void api(`/marketplace/recent/${id}`, { method: 'POST' }).catch(() => undefined);
  }, [verified, id]);

  return (
    <Resource state={state} reload={reload} backHref={`/${locale}/search`} lines={10}>
      {(d) => {
        const title = L(d.title_en, d.title_ar);
        const firstSku = d.skus[0];
        return (
          <>
            <nav aria-label={t('mkt.categories')} className="breadcrumb small">
              <Link href={`/${locale}/categories`}>{t('mkt.categories')}</Link>
              {d.category.parent ? (
                <>
                  {' / '}
                  <Link href={`/${locale}/categories/${d.category.parent.id}`}>
                    {L(d.category.parent.name_en, d.category.parent.name_ar)}
                  </Link>
                </>
              ) : null}
              {' / '}
              <Link href={`/${locale}/categories/${d.category.id}`}>
                {L(d.category.name_en, d.category.name_ar)}
              </Link>
            </nav>
            <div className="pd-layout">
              <Gallery d={d} />
              <div className="pd-summary">
                <h1>{title}</h1>
                <div className="pcard-meta">
                  <AvailabilityBadge
                    mode={d.mode}
                    inStock={d.skus.some((s) => s.availability === 'IN_STOCK')}
                  />
                  <span className="pill">{t(`mode.${d.mode}` as MessageKey)}</span>
                </div>
                {!d.price_visible ? (
                  <p className="price-locked">{t('mkt.sign_in_prices')}</p>
                ) : d.price_type === 'QUOTE_ONLY' ? (
                  <p className="price">{t('mkt.price_quote_only')}</p>
                ) : null}
                {firstSku ? (
                  <p className="small">
                    {t('mkt.moq_label')}: {firstSku.moq} {t(`unit.${firstSku.unit}` as MessageKey)}
                  </p>
                ) : null}
                {d.mode === 'MADE_TO_ORDER' && d.lead_time_min_days !== null ? (
                  <p className="small">
                    {t('mkt.lead_time', {
                      min: d.lead_time_min_days,
                      max: d.lead_time_max_days ?? d.lead_time_min_days,
                    })}
                  </p>
                ) : null}
                {d.fulfilment_days !== null ? (
                  <p className="small">{t('mkt.fulfilment_days', { days: d.fulfilment_days })}</p>
                ) : null}
                <CapabilityPills
                  custom={d.custom_manufacturing}
                  privateLabel={d.private_label}
                  whiteLabel={d.white_label}
                  samples={d.samples_available}
                />
                <BuyerActions d={d} onChange={(v) => setData({ ...d, viewer: v })} />
                <TradingActions d={d} />
                <EstimateBox d={d} />
                <section className="card pd-supplier" aria-labelledby="pd-sup">
                  <h2 id="pd-sup" className="h3">
                    {t('pd.supplier')}
                  </h2>
                  <div className="scard-head">
                    <MediaImg
                      src={d.supplier.logo_url}
                      alt={d.supplier.name}
                      className="scard-logo"
                    />
                    <div>
                      <p className="pcard-title">{d.supplier.name}</p>
                      <p className="muted small">
                        {d.supplier.business_type
                          ? `${t(`btype.${d.supplier.business_type}` as MessageKey)} · `
                          : ''}
                        {t(`emirate.${d.supplier.emirate}` as MessageKey)}
                        {d.supplier.year_established
                          ? ` · ${t('sup.year_established', { year: d.supplier.year_established })}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <VerifiedBadge />
                  {d.supplier.verified_since ? (
                    <p className="muted small">
                      {t('mkt.verified_since', {
                        date: formatDate(d.supplier.verified_since.slice(0, 10), locale),
                      })}
                    </p>
                  ) : null}
                  {d.supplier.storefront_id ? (
                    <Link href={`/${locale}/suppliers/${d.supplier.storefront_id}`}>
                      {t('pd.visit_storefront')}
                    </Link>
                  ) : null}
                </section>
              </div>
            </div>

            <Section id="pd-desc" title={t('pd.description')}>
              <p className="prewrap">{L(d.description_en, d.description_ar)}</p>
            </Section>

            {d.skus.length ? (
              <Section id="pd-var" title={t('pd.variants')}>
                <div className="table-wrap">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">{t('pd.sku')}</th>
                        <th scope="col">{t('pd.variant')}</th>
                        <th scope="col">{t('mkt.moq_label')}</th>
                        <th scope="col">{t('pd.availability')}</th>
                        <th scope="col">{t('pd.tiers')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.skus.map((s) => (
                        <tr key={s.id}>
                          <td>
                            <bdi>{s.code}</bdi>
                          </td>
                          <td>
                            {Object.entries(s.variant_attributes)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(', ') || '—'}
                          </td>
                          <td>
                            {s.moq} {t(`unit.${s.unit}` as MessageKey)}
                            {s.order_increment > 1 ? (
                              <span className="muted small">
                                {' '}
                                ({t('mkt.increment_label')} {s.order_increment})
                              </span>
                            ) : null}
                          </td>
                          <td>
                            {s.availability === 'MADE_TO_ORDER'
                              ? t('mkt.made_to_order')
                              : s.availability === 'IN_STOCK'
                                ? t('mkt.in_stock')
                                : t('mkt.out_of_stock')}
                          </td>
                          <td>
                            {s.tiers === null ? (
                              <span className="price-locked">{t('mkt.sign_in_prices')}</span>
                            ) : s.tiers.length === 0 ? (
                              t('mkt.price_quote_only')
                            ) : (
                              <ul className="tier-list">
                                {s.tiers.map((tr) => (
                                  <li key={tr.min_qty}>
                                    {tr.min_qty}+ : <Money fils={tr.unit_price_fils} />
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            ) : null}

            <Section id="pd-spec" title={t('pd.specifications')}>
              <DefinitionList
                items={[
                  ...d.attributes.map(
                    (a) =>
                      [L(a.label_en, a.label_ar), `${a.value}${a.unit ? ` ${a.unit}` : ''}`] as [
                        string,
                        string,
                      ],
                  ),
                  ...d.specifications.map(
                    (s) => [L(s.label_en, s.label_ar), s.value] as [string, string],
                  ),
                  ...(d.materials ? [[t('pd.materials'), d.materials] as [string, string]] : []),
                  ...(d.dimensions ? [[t('pd.dimensions'), d.dimensions] as [string, string]] : []),
                  ...(d.country_of_origin
                    ? [[t('pd.origin'), d.country_of_origin] as [string, string]]
                    : []),
                ]}
              />
              {d.samples_available && d.sample_note ? (
                <p className="small">
                  <strong>{t('pd.samples_note')}:</strong> {d.sample_note}
                </p>
              ) : null}
              {d.video_url ? (
                <p className="small">
                  <a href={d.video_url} target="_blank" rel="noopener noreferrer nofollow">
                    {t('pd.video')}
                  </a>
                </p>
              ) : null}
            </Section>

            {d.certifications.length ? (
              <Section id="pd-cert" title={t('pd.certifications')}>
                <ul className="plain-list">
                  {d.certifications.map((c, n) => (
                    <li key={n}>
                      <strong>{c.name}</strong>
                      {c.issuer ? ` · ${c.issuer}` : ''}
                      {c.valid_until ? ` · ${formatDate(c.valid_until.slice(0, 10), locale)}` : ''}
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            {related.state.status === 'ready' && related.state.data.length ? (
              <Section id="pd-rel" title={t('pd.related')}>
                <ProductGrid items={related.state.data} />
              </Section>
            ) : null}
          </>
        );
      }}
    </Resource>
  );
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <MarketShell>
      <Product id={id} />
    </MarketShell>
  );
}
