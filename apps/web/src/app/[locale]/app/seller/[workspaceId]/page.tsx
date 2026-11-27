'use client';
import Link from 'next/link';
import { useApp, useT } from '@/components/app-context';
import { useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import { Alert, Empty, PageHeader, StatusBadge } from '@/components/ui';
import { formatDubaiTime, tDynamic, type MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';

type Overview = {
  storefront: {
    exists: boolean;
    status: 'DRAFT' | 'PUBLISHED' | null;
    public: boolean;
    admin_hidden: boolean;
  };
  products: Record<
    'total' | 'draft' | 'pending' | 'published' | 'public' | 'rejected' | 'suspended' | 'archived',
    number
  >;
  inventory: { skus: number; low_stock: number; out_of_stock: number };
  eligibility: { can_list: boolean; reason: string | null };
  recent_decisions: {
    product_id: string;
    title_en: string;
    title_ar: string | null;
    state: string;
    reason: string | null;
    decided_at: string;
  }[];
};

function OverviewView({ ws, base }: { ws: Workspace; base: string }) {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const { state, reload } = useResource<Overview>(`${sellerApi(ws)}/overview`);
  return (
    <>
      <PageHeader title={t('seller.dashboard')}>
        <Link className="btn btn-primary" href={`${base}/products/new`}>
          {t('seller.nav.add_product')}
        </Link>
      </PageHeader>
      <Resource state={state} reload={reload} lines={8}>
        {(o) => (
          <>
            {o.eligibility.can_list ? (
              <Alert kind="success">{t('seller.eligible')}</Alert>
            ) : (
              <Alert kind="warning">
                {t('seller.ineligible', {
                  reason: tDynamic(
                    locale,
                    `error.${o.eligibility.reason ?? 'catalog.seller_not_eligible'}`,
                    'error.catalog.seller_not_eligible',
                  ),
                })}
              </Alert>
            )}
            <section className="card">
              <h2 className="h3">{t('seller.storefront_status')}</h2>
              <p>
                {o.storefront.admin_hidden
                  ? t('seller.storefront_hidden')
                  : o.storefront.public
                    ? t('seller.storefront_public')
                    : t('seller.storefront_not_public')}
              </p>
              <Link href={`${base}/storefront`}>{t('seller.open_storefront')}</Link>
            </section>
            <ul className="kpis" data-testid="seller-kpis">
              {(
                [
                  ['seller.kpi.public', o.products.public, `${base}/products?tab=published`],
                  ['seller.kpi.pending', o.products.pending, `${base}/products?tab=pending`],
                  ['seller.kpi.draft', o.products.draft, `${base}/products?tab=draft`],
                  ['seller.kpi.rejected', o.products.rejected, `${base}/products?tab=rejected`],
                  ['seller.kpi.suspended', o.products.suspended, `${base}/products?tab=suspended`],
                  ['seller.kpi.low_stock', o.inventory.low_stock, `${base}/inventory?filter=low`],
                  [
                    'seller.kpi.out_of_stock',
                    o.inventory.out_of_stock,
                    `${base}/inventory?filter=out`,
                  ],
                ] as [MessageKey, number, string][]
              ).map(([k, n, href]) => (
                <li key={k} className="kpi">
                  <Link href={href}>
                    <span className="kpi-value">{n}</span>
                    <span className="kpi-label">{t(k)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <section className="card">
              <h2 className="h3">{t('seller.recent_decisions')}</h2>
              {o.recent_decisions.length === 0 ? (
                <Empty>{t('seller.no_decisions')}</Empty>
              ) : (
                <ul className="plain-list">
                  {o.recent_decisions.map((d) => (
                    <li key={`${d.product_id}-${d.decided_at}`}>
                      <Link href={`${base}/products/${d.product_id}`}>
                        {L(d.title_en, d.title_ar)}
                      </Link>{' '}
                      <StatusBadge value={d.state} label={t(`vstate.${d.state}` as MessageKey)} />{' '}
                      <span className="muted small">{formatDubaiTime(d.decided_at, locale)}</span>
                      {d.reason ? <p className="small">{d.reason}</p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </Resource>
    </>
  );
}

export default function SellerOverviewPage() {
  return <SellerShell>{(ws, base) => <OverviewView ws={ws} base={base} />}</SellerShell>;
}
