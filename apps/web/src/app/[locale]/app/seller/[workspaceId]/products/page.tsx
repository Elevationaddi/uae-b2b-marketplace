'use client';
import { SELLER_PRODUCT_TABS } from '@app/contracts';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useApp, useT } from '@/components/app-context';
import { MediaImg, Money, useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import { Empty, PageHeader, Pager, Skeleton, StatusBadge } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';

type Summary = {
  id: string;
  status: string;
  price_type: string;
  title_en: string;
  title_ar: string | null;
  category_name_en: string;
  category_name_ar: string;
  thumbnail_url: string | null;
  working_state: string | null;
  has_published_version: boolean;
  public: boolean;
  sku_count: number;
  min_price_fils: string | null;
  min_moq: number | null;
  low_stock_skus: number;
  decision_reason: string | null;
  updated_at: string;
};

function Products({ ws, base }: { ws: Workspace; base: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const params = useSearchParams();
  const tab = (SELLER_PRODUCT_TABS as readonly string[]).includes(params?.get('tab') ?? '')
    ? params!.get('tab')!
    : 'all';
  const q = params?.get('q') ?? '';
  const cursor = params?.get('cursor') ?? '';
  const { state, reload } = useResource<Summary[]>(`${sellerApi(ws)}/products`, { tab, q, cursor });
  const go = (next: Record<string, string>) => {
    const sp = new URLSearchParams({ tab, ...(q ? { q } : {}), ...next });
    for (const [k, v] of [...sp]) if (!v) sp.delete(k);
    router.push(`${pathname}?${sp.toString()}`);
  };
  return (
    <>
      <PageHeader title={t('seller.nav.products')}>
        <Link className="btn btn-primary" href={`${base}/products/new`}>
          {t('seller.nav.add_product')}
        </Link>
      </PageHeader>
      <div className="tabs" role="tablist">
        {SELLER_PRODUCT_TABS.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => go({ tab: k, cursor: '' })}
          >
            {t(`seller.tab.${k}` as MessageKey)}
          </button>
        ))}
      </div>
      <form
        role="search"
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          const v = String(new FormData(e.currentTarget).get('q') ?? '').trim();
          go({ q: v, cursor: '' });
        }}
      >
        <label className="sr-only" htmlFor="sp-q">
          {t('seller.search_products')}
        </label>
        <input
          id="sp-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder={t('seller.search_products')}
          maxLength={100}
        />
        <button type="submit" className="btn btn-secondary">
          {t('mkt.search')}
        </button>
      </form>
      <Resource state={state} reload={reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('seller.products_empty')}</p>
              <Link className="btn btn-primary" href={`${base}/products/new`}>
                {t('seller.nav.add_product')}
              </Link>
            </Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="seller-products">
                  <thead>
                    <tr>
                      <th scope="col">{t('seller.title_en')}</th>
                      <th scope="col">{t('seller.category')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('seller.pricing')}</th>
                      <th scope="col">{t('seller.skus')}</th>
                      <th scope="col">{t('common.updated_at')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div className="cell-media">
                            <MediaImg src={p.thumbnail_url} alt="" className="thumb" />
                            <span>
                              <Link href={`${base}/products/${p.id}`}>
                                {L(p.title_en, p.title_ar)}
                              </Link>
                              {p.public ? (
                                <span className="pill pill-ok small">
                                  {t('seller.public_badge')}
                                </span>
                              ) : null}
                              {p.has_published_version && p.working_state === 'PENDING_REVIEW' ? (
                                <span className="pill pill-info small">
                                  {t('seller.update_pending')}
                                </span>
                              ) : null}
                              {p.decision_reason &&
                              (p.working_state === 'REJECTED' ||
                                p.working_state === 'CHANGES_REQUESTED') ? (
                                <span className="muted small block">{p.decision_reason}</span>
                              ) : null}
                            </span>
                          </div>
                        </td>
                        <td>{L(p.category_name_en, p.category_name_ar)}</td>
                        <td>
                          <StatusBadge
                            value={p.status}
                            label={t(`pstatus.${p.status}` as MessageKey)}
                          />
                          {p.working_state && p.working_state !== 'APPROVED' ? (
                            <>
                              {' '}
                              <StatusBadge
                                value={p.working_state}
                                label={t(`vstate.${p.working_state}` as MessageKey)}
                              />
                            </>
                          ) : null}
                        </td>
                        <td>
                          {p.price_type === 'QUOTE_ONLY' ? (
                            t('ptype.QUOTE_ONLY')
                          ) : p.min_price_fils ? (
                            <Money fils={p.min_price_fils} />
                          ) : (
                            '—'
                          )}
                          {p.min_moq ? (
                            <span className="muted small block">
                              {t('mkt.moq', { qty: p.min_moq })}
                            </span>
                          ) : null}
                        </td>
                        <td>
                          {p.sku_count}
                          {p.low_stock_skus ? (
                            <span className="pill pill-warn small">
                              {t('seller.kpi.low_stock')}
                            </span>
                          ) : null}
                        </td>
                        <td className="small">{formatDubaiTime(p.updated_at, locale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager
                hasPrev={!!cursor}
                nextCursor={next}
                onFirst={() => go({ cursor: '' })}
                onNext={(c) => go({ cursor: c })}
              />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function SellerProductsPage() {
  return (
    <SellerShell>
      {(ws, base) => (
        <Suspense fallback={<Skeleton />}>
          <Products ws={ws} base={base} />
        </Suspense>
      )}
    </SellerShell>
  );
}
