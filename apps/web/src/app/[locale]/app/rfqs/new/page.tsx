'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useApp, useT } from '@/components/app-context';
import { AppShell, useSession } from '@/components/session';
import { Skeleton } from '@/components/ui';

/**
 * Entry point from product and supplier pages: forwards to the new-RFQ form of the user's
 * buyer workspace that may request quotations, keeping the prefill parameters.
 */
function Forward() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const { me, workspace } = useSession();
  const buyers = me.workspaces.filter(
    (w) => w.kind === 'BUYER' && w.capabilities.includes('buyer.purchase'),
  );
  const target = buyers.find((w) => w.id === workspace?.id) ?? buyers[0];
  useEffect(() => {
    if (target)
      router.replace(`/${locale}/app/buyer/${target.id}/rfqs/new?${params?.toString() ?? ''}`);
  }, [target, router, locale, params]);
  if (target) return <Skeleton />;
  return (
    <div className="empty" role="alert">
      <h1>{t('rfq.need_buyer_title')}</h1>
      <p>{t('rfq.need_buyer_body')}</p>
      <Link className="btn btn-primary" href={`/${locale}/app`}>
        {t('nav.home')}
      </Link>
    </div>
  );
}

export default function RfqEntryPage() {
  return (
    <AppShell>
      <Suspense fallback={<Skeleton />}>
        <Forward />
      </Suspense>
    </AppShell>
  );
}
