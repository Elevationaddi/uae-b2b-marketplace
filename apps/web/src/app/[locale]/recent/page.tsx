'use client';
import type { ProductCard } from '@app/contracts';
import { useApp, useT } from '@/components/app-context';
import { ProductCardView } from '@/components/catalog-ui';
import { MarketShell } from '@/components/market-shell';
import { Resource } from '@/components/resource';
import { ApiErrorAlert, Button, Empty, PageHeader } from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Recent = { product_id: string; viewed_at: string; product: ProductCard | null };

function RecentList() {
  const { locale } = useApp();
  const t = useT();
  const { state, reload } = useResource<Recent[]>('/marketplace/recent');
  const m = useMutation();
  const clear = async () => {
    const r = await m.run('/marketplace/recent', { method: 'DELETE' });
    if (r.ok) reload();
  };
  return (
    <>
      <PageHeader title={t('mkt.recent')}>
        {state.status === 'ready' && state.data.length ? (
          <Button type="button" variant="secondary" busy={m.busy} onClick={clear}>
            {t('lists.clear_recent')}
          </Button>
        ) : null}
      </PageHeader>
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      <Resource
        state={state}
        reload={reload}
        loginHref={`/${locale}/login?next=${encodeURIComponent(`/${locale}/recent`)}`}
      >
        {(items) =>
          items.length === 0 ? (
            <Empty>{t('lists.empty_recent')}</Empty>
          ) : (
            <ul className="pgrid">
              {items.map((i) =>
                i.product ? (
                  <ProductCardView
                    key={i.product_id}
                    p={i.product}
                    action={
                      <span className="muted small">{formatDubaiTime(i.viewed_at, locale)}</span>
                    }
                  />
                ) : (
                  <li key={i.product_id} className="pcard pcard-gone">
                    <p className="muted">{t('lists.unavailable_item')}</p>
                  </li>
                ),
              )}
            </ul>
          )
        }
      </Resource>
    </>
  );
}

export default function RecentPage() {
  return (
    <MarketShell>
      <RecentList />
    </MarketShell>
  );
}
