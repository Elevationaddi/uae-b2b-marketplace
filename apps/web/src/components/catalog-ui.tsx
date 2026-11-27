'use client';
import type { ProductCard as Card, SupplierCard as SCard } from '@app/contracts';
import { formatFils } from '@app/contracts';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { formatDate, type MessageKey } from '@/i18n/messages';
import { useApp, useT } from './app-context';

/** Same-origin marketplace image (access re-checked by the API on every request). */
export function MediaImg({
  src,
  alt,
  className,
  width,
  height,
}: {
  src: string | null;
  alt: string;
  className?: string;
  width?: number | null;
  height?: number | null;
}) {
  if (!src) return <div className={`img-placeholder ${className ?? ''}`} aria-hidden="true" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      width={width ?? undefined}
      height={height ?? undefined}
    />
  );
}

export function useLocalized() {
  const { locale } = useApp();
  return (en: string | null | undefined, ar: string | null | undefined) =>
    (locale === 'ar' ? ar || en : en || ar) ?? '';
}

export function Money({ fils }: { fils: string }) {
  const { locale } = useApp();
  return <bdi className="money">{formatFils(fils, locale)}</bdi>;
}

export function PriceLine({ price, unit }: { price: Card['price']; unit?: string }) {
  const t = useT();
  if (!price.visible) return <span className="price-locked">{t('mkt.sign_in_prices')}</span>;
  if (price.price_type === 'QUOTE_ONLY' || !price.min_price_fils)
    return <span className="price">{t('mkt.price_quote_only')}</span>;
  return (
    <span className="price">
      {t('mkt.price_from', { price: '' })}
      <Money fils={price.min_price_fils} />
      {unit ? <span className="muted"> {t('mkt.per_unit', { unit })}</span> : null}
    </span>
  );
}

export function AvailabilityBadge({ mode, inStock }: { mode: string; inStock: boolean }) {
  const t = useT();
  if (mode === 'MADE_TO_ORDER')
    return <span className="pill pill-info">{t('mkt.made_to_order')}</span>;
  return inStock ? (
    <span className="pill pill-ok">{t('mkt.in_stock')}</span>
  ) : (
    <span className="pill pill-warn">{t('mkt.out_of_stock')}</span>
  );
}

export function VerifiedBadge() {
  const t = useT();
  return (
    <span className="pill pill-verified">
      <span aria-hidden="true">✓ </span>
      {t('mkt.verified_supplier')}
    </span>
  );
}

export function CapabilityPills({
  custom,
  privateLabel,
  whiteLabel,
  samples,
}: {
  custom: boolean;
  privateLabel: boolean;
  whiteLabel: boolean;
  samples: boolean;
}) {
  const t = useT();
  const items: [boolean, MessageKey][] = [
    [custom, 'mkt.custom'],
    [privateLabel, 'mkt.private_label'],
    [whiteLabel, 'mkt.white_label'],
    [samples, 'mkt.samples'],
  ];
  const on = items.filter(([v]) => v);
  if (!on.length) return null;
  return (
    <ul className="pill-list">
      {on.map(([, k]) => (
        <li key={k} className="pill">
          {t(k)}
        </li>
      ))}
    </ul>
  );
}

export function ProductCardView({
  p,
  view = 'grid',
  featured,
  action,
}: {
  p: Card;
  view?: 'grid' | 'list';
  featured?: boolean;
  action?: ReactNode;
}) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const title = L(p.title_en, p.title_ar);
  return (
    <li className={`pcard pcard-${view}`} data-testid="product-card">
      <Link href={`/${locale}/products/${p.id}`} className="pcard-link">
        <div className="pcard-media">
          <MediaImg src={p.image_url} alt={title} className="pcard-img" />
          {featured ? <span className="pcard-flag">{t('mkt.featured_label')}</span> : null}
        </div>
        <div className="pcard-body">
          <h3 className="pcard-title">{title}</h3>
          <PriceLine price={p.price} />
          <div className="pcard-meta">
            {p.min_moq ? <span>{t('mkt.moq', { qty: p.min_moq })}</span> : null}
            <AvailabilityBadge mode={p.mode} inStock={p.in_stock} />
          </div>
          {p.mode === 'MADE_TO_ORDER' && p.lead_time_min_days !== null ? (
            <p className="muted small">
              {t('mkt.lead_time', {
                min: p.lead_time_min_days,
                max: p.lead_time_max_days ?? p.lead_time_min_days,
              })}
            </p>
          ) : null}
          <p className="pcard-supplier small">
            <span>{p.supplier.name}</span>
            <span className="verified-dot" title={t('mkt.verified_supplier')}>
              ✓<span className="sr-only">{t('mkt.verified_supplier')}</span>
            </span>
            <span className="muted"> · {t(`emirate.${p.supplier.emirate}` as MessageKey)}</span>
          </p>
          {view === 'list' ? (
            <CapabilityPills
              custom={p.custom_manufacturing}
              privateLabel={p.private_label}
              whiteLabel={p.white_label}
              samples={p.samples_available}
            />
          ) : null}
        </div>
      </Link>
      {action ? <div className="pcard-action">{action}</div> : null}
    </li>
  );
}

export function ProductGrid({
  items,
  view = 'grid',
  featuredIds,
}: {
  items: Card[];
  view?: 'grid' | 'list';
  featuredIds?: Set<string>;
}) {
  return (
    <ul className={view === 'grid' ? 'pgrid' : 'plist'}>
      {items.map((p) => (
        <ProductCardView key={p.id} p={p} view={view} featured={featuredIds?.has(p.id)} />
      ))}
    </ul>
  );
}

export function SupplierCardView({
  s,
  featured,
  action,
}: {
  s: SCard;
  featured?: boolean;
  action?: ReactNode;
}) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  return (
    <li className="scard" data-testid="supplier-card">
      <Link href={`/${locale}/suppliers/${s.id}`} className="scard-link">
        <div className="scard-cover">
          <MediaImg src={s.cover_url} alt="" className="scard-cover-img" />
          {featured ? <span className="pcard-flag">{t('mkt.featured_label')}</span> : null}
        </div>
        <div className="scard-body">
          <div className="scard-head">
            <MediaImg src={s.logo_url} alt={s.name} className="scard-logo" />
            <div>
              <h3 className="pcard-title">{s.name}</h3>
              <p className="muted small">
                {s.business_type ? t(`btype.${s.business_type}` as MessageKey) : null}
                {s.business_type ? ' · ' : null}
                {t(`emirate.${s.emirate}` as MessageKey)}
              </p>
            </div>
          </div>
          <VerifiedBadge />
          {s.verified_since ? (
            <p className="muted small">
              {t('mkt.verified_since', { date: formatDate(s.verified_since.slice(0, 10), locale) })}
            </p>
          ) : null}
          {s.specialization_en || s.specialization_ar ? (
            <p className="small">{L(s.specialization_en, s.specialization_ar)}</p>
          ) : null}
          <p className="small">
            {t('mkt.products_count', { count: s.product_count })}
            {s.categories.length
              ? ` · ${s.categories.map((c) => L(c.name_en, c.name_ar)).join(', ')}`
              : ''}
          </p>
        </div>
      </Link>
      {action ? <div className="pcard-action">{action}</div> : null}
    </li>
  );
}

export function Section({
  title,
  href,
  children,
  id,
}: {
  title: string;
  href?: string;
  children: ReactNode;
  id: string;
}) {
  const t = useT();
  return (
    <section className="mkt-section" aria-labelledby={id}>
      <div className="section-head">
        <h2 id={id}>{title}</h2>
        {href ? <Link href={href}>{t('mkt.view_all')}</Link> : null}
      </div>
      {children}
    </section>
  );
}
