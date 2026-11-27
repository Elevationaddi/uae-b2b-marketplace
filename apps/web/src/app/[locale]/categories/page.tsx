'use client';
import type { CategoryNode } from '@app/contracts';
import Link from 'next/link';
import { useApp, useT } from '@/components/app-context';
import { MediaImg, useLocalized } from '@/components/catalog-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { Empty, PageHeader } from '@/components/ui';
import { useResource } from '@/lib/use-resource';

function Categories() {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const { state, reload } = useResource<CategoryNode[]>('/marketplace/categories');
  return (
    <>
      <PageHeader title={t('mkt.all_categories')} />
      <Resource state={state} reload={reload} lines={6}>
        {(cats) =>
          cats.length === 0 ? (
            <Empty>{t('mkt.empty_catalogue')}</Empty>
          ) : (
            <ul className="cat-directory">
              {cats.map((c) => (
                <li key={c.id} className="card">
                  <Link href={`/${locale}/categories/${c.id}`} className="cat-dir-head">
                    <MediaImg src={c.image_url} alt="" className="cat-dir-img" />
                    <span>
                      <span className="cat-tile-name">{L(c.name_en, c.name_ar)}</span>
                      <span className="muted small">
                        {' '}
                        · {t('mkt.products_count', { count: c.product_count })}
                      </span>
                      {c.restriction === 'REVIEW_REQUIRED' ? (
                        <span className="pill pill-info">{t('restriction.REVIEW_REQUIRED')}</span>
                      ) : null}
                    </span>
                  </Link>
                  {c.description_en || c.description_ar ? (
                    <p className="small muted">{L(c.description_en, c.description_ar)}</p>
                  ) : null}
                  {c.children.length ? (
                    <ul className="cat-chips">
                      {c.children.map((k) => (
                        <li key={k.id}>
                          <Link href={`/${locale}/categories/${k.id}`}>
                            {L(k.name_en, k.name_ar)}{' '}
                            <span className="muted">({k.product_count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )
        }
      </Resource>
    </>
  );
}

export default function CategoriesPage() {
  return (
    <MarketShell>
      <Categories />
    </MarketShell>
  );
}
