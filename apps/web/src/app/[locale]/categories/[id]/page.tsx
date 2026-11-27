'use client';
import type { CategoryDetail } from '@app/contracts';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import { useApp, useT } from '@/components/app-context';
import { useLocalized } from '@/components/catalog-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { SearchResults } from '@/components/search-results';
import { Alert, PageHeader, Skeleton } from '@/components/ui';
import { useResource } from '@/lib/use-resource';

function Category({ id }: { id: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const { state, reload } = useResource<CategoryDetail>(`/marketplace/categories/${id}`);
  return (
    <Resource state={state} reload={reload} backHref={`/${locale}/categories`} lines={6}>
      {(c) => (
        <>
          <nav aria-label={t('mkt.categories')} className="breadcrumb small">
            <Link href={`/${locale}/categories`}>{t('mkt.categories')}</Link>
            {c.parent ? (
              <>
                {' / '}
                <Link href={`/${locale}/categories/${c.parent.id}`}>
                  {L(c.parent.name_en, c.parent.name_ar)}
                </Link>
              </>
            ) : null}
          </nav>
          <PageHeader title={L(c.name_en, c.name_ar)} />
          {c.description_en || c.description_ar ? (
            <p className="lead">{L(c.description_en, c.description_ar)}</p>
          ) : null}
          {c.restriction === 'REVIEW_REQUIRED' ? (
            <Alert kind="info" title={t('mkt.category_requirements')}>
              {L(c.requirements_en, c.requirements_ar) || t('mkt.restricted_review')}
            </Alert>
          ) : null}
          {c.children.length ? (
            <section aria-label={t('mkt.subcategories')}>
              <ul className="cat-chips">
                {c.children.map((s) => (
                  <li key={s.id}>
                    <Link href={`/${locale}/categories/${s.id}`}>
                      {L(s.name_en, s.name_ar)} <span className="muted">({s.product_count})</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <Suspense fallback={<Skeleton lines={8} />}>
            <SearchResults fixed={{ category_id: c.id }} />
          </Suspense>
        </>
      )}
    </Resource>
  );
}

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <MarketShell>
      <Category id={id} />
    </MarketShell>
  );
}
