'use client';
import type { ProductCard, SupplierCard } from '@app/contracts';
import { useState } from 'react';
import { useApp, useT } from '@/components/app-context';
import { ProductCardView, SupplierCardView } from '@/components/catalog-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { ApiErrorAlert, Button, Empty, PageHeader } from '@/components/ui';
import { useMutation, useResource } from '@/lib/use-resource';

type SavedP = { product_id: string; saved_at: string; product: ProductCard | null };
type SavedS = { storefront_id: string; saved_at: string; supplier: SupplierCard | null };

function Saved() {
  const { locale } = useApp();
  const t = useT();
  const [tab, setTab] = useState<'products' | 'suppliers'>('products');
  const products = useResource<SavedP[]>(tab === 'products' ? '/marketplace/saved/products' : null);
  const suppliers = useResource<SavedS[]>(
    tab === 'suppliers' ? '/marketplace/saved/suppliers' : null,
  );
  const m = useMutation();
  const login = `/${locale}/login?next=${encodeURIComponent(`/${locale}/saved`)}`;
  const remove = async (path: string, reload: () => void) => {
    const r = await m.run(path, { method: 'DELETE' });
    if (r.ok) reload();
  };
  const removeBtn = (path: string, reload: () => void) => (
    <Button type="button" variant="link" busy={m.busy} onClick={() => remove(path, reload)}>
      {t('lists.remove')}
    </Button>
  );
  return (
    <>
      <PageHeader title={t('mkt.saved')} />
      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'products'}
          onClick={() => setTab('products')}
        >
          {t('lists.saved_products')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'suppliers'}
          onClick={() => setTab('suppliers')}
        >
          {t('lists.saved_suppliers')}
        </button>
      </div>
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      {tab === 'products' ? (
        <Resource state={products.state} reload={products.reload} loginHref={login}>
          {(items) =>
            items.length === 0 ? (
              <Empty>{t('lists.empty_saved')}</Empty>
            ) : (
              <ul className="pgrid">
                {items.map((i) =>
                  i.product ? (
                    <ProductCardView
                      key={i.product_id}
                      p={i.product}
                      action={removeBtn(
                        `/marketplace/saved/products/${i.product_id}`,
                        products.reload,
                      )}
                    />
                  ) : (
                    <li key={i.product_id} className="pcard pcard-gone">
                      <p className="muted">{t('lists.unavailable_item')}</p>
                      {removeBtn(`/marketplace/saved/products/${i.product_id}`, products.reload)}
                    </li>
                  ),
                )}
              </ul>
            )
          }
        </Resource>
      ) : (
        <Resource state={suppliers.state} reload={suppliers.reload} loginHref={login}>
          {(items) =>
            items.length === 0 ? (
              <Empty>{t('lists.empty_saved')}</Empty>
            ) : (
              <ul className="sgrid">
                {items.map((i) =>
                  i.supplier ? (
                    <SupplierCardView
                      key={i.storefront_id}
                      s={i.supplier}
                      action={removeBtn(
                        `/marketplace/saved/suppliers/${i.storefront_id}`,
                        suppliers.reload,
                      )}
                    />
                  ) : (
                    <li key={i.storefront_id} className="scard pcard-gone">
                      <p className="muted">{t('lists.unavailable_item')}</p>
                      {removeBtn(
                        `/marketplace/saved/suppliers/${i.storefront_id}`,
                        suppliers.reload,
                      )}
                    </li>
                  ),
                )}
              </ul>
            )
          }
        </Resource>
      )}
    </>
  );
}

export default function SavedPage() {
  return (
    <MarketShell>
      <Saved />
    </MarketShell>
  );
}
