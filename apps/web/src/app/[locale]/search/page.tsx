'use client';
import type { CategoryNode } from '@app/contracts';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useT } from '@/components/app-context';
import { MarketShell } from '@/components/market-shell';
import { SearchResults } from '@/components/search-results';
import { PageHeader, Skeleton } from '@/components/ui';
import { useResource } from '@/lib/use-resource';

function Search() {
  const t = useT();
  const params = useSearchParams();
  const q = params?.get('q') ?? '';
  const cats = useResource<CategoryNode[]>('/marketplace/categories');
  return (
    <>
      <PageHeader title={q ? `${t('mkt.search')}: “${q}”` : t('mkt.search')} />
      <SearchResults categories={cats.state.status === 'ready' ? cats.state.data : undefined} />
    </>
  );
}

export default function SearchPage() {
  return (
    <MarketShell>
      <Suspense fallback={<Skeleton lines={8} />}>
        <Search />
      </Suspense>
    </MarketShell>
  );
}
