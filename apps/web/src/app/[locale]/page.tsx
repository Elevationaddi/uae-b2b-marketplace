'use client';
import type { HomeResponse } from '@app/contracts';
import Link from 'next/link';
import { useApp, useT } from '@/components/app-context';
import {
  MediaImg,
  ProductGrid,
  Section,
  SupplierCardView,
  useLocalized,
} from '@/components/catalog-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { Empty } from '@/components/ui';
import { useResource } from '@/lib/use-resource';

function Home() {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const { state, reload } = useResource<HomeResponse>('/marketplace/home');
  return (
    <Resource state={state} reload={reload} lines={8}>
      {(d) => {
        const featured = new Set(d.featured_products.map((p) => p.id));
        return (
          <>
            <section className="mkt-hero">
              <h1>{t('mkt.hero_title')}</h1>
              <p className="lead">{t('mkt.hero_body')}</p>
              <p className="muted" data-testid="home-totals">
                {t('mkt.totals', { products: d.totals.products, suppliers: d.totals.suppliers })}
              </p>
            </section>

            {d.priority_categories.length ? (
              <Section
                id="prio"
                title={t('mkt.priority_categories')}
                href={`/${locale}/categories`}
              >
                <ul className="cat-tiles">
                  {d.priority_categories.map((c) => (
                    <li key={c.id}>
                      <Link href={`/${locale}/categories/${c.id}`} className="cat-tile">
                        <MediaImg src={c.image_url} alt="" className="cat-tile-img" />
                        <span className="cat-tile-name">{L(c.name_en, c.name_ar)}</span>
                        <span className="muted small">
                          {t('mkt.products_count', { count: c.product_count })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            <Section id="allcats" title={t('mkt.all_categories')}>
              <ul className="cat-chips">
                {d.categories.map((c) => (
                  <li key={c.id}>
                    <Link href={`/${locale}/categories/${c.id}`}>
                      {L(c.name_en, c.name_ar)} <span className="muted">({c.product_count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>

            {d.totals.products === 0 ? <Empty>{t('mkt.empty_catalogue')}</Empty> : null}

            {d.for_you.length ? (
              <Section id="foryou" title={t('mkt.for_you')}>
                <ProductGrid items={d.for_you} featuredIds={featured} />
              </Section>
            ) : null}
            {d.featured_products.length ? (
              <Section id="featured" title={t('mkt.featured_products')}>
                <ProductGrid items={d.featured_products} featuredIds={featured} />
              </Section>
            ) : null}
            {d.featured_suppliers.length ? (
              <Section id="fsup" title={t('mkt.featured_suppliers')} href={`/${locale}/suppliers`}>
                <ul className="sgrid">
                  {d.featured_suppliers.map((s) => (
                    <SupplierCardView key={s.id} s={s} featured />
                  ))}
                </ul>
              </Section>
            ) : null}
            {d.manufacturers.length ? (
              <Section
                id="manu"
                title={t('mkt.manufacturers')}
                href={`/${locale}/suppliers?business_type=MANUFACTURER,FACTORY`}
              >
                <ul className="sgrid">
                  {d.manufacturers.map((s) => (
                    <SupplierCardView key={s.id} s={s} />
                  ))}
                </ul>
              </Section>
            ) : null}
            {d.new_products.length ? (
              <Section
                id="new"
                title={t('mkt.new_products')}
                href={`/${locale}/search?sort=newest`}
              >
                <ProductGrid items={d.new_products} featuredIds={featured} />
              </Section>
            ) : null}
          </>
        );
      }}
    </Resource>
  );
}

export default function HomePage() {
  return (
    <MarketShell>
      <Home />
    </MarketShell>
  );
}
