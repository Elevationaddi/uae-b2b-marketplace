'use client';
import type { RfqDetail } from '@app/contracts';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useT } from '@/components/app-context';
import { buyerApi, BuyerShell } from '@/components/buyer-shell';
import { RfqForm } from '@/components/rfq-form';
import type { Workspace } from '@/components/session';
import { Forbidden, PageHeader, Skeleton } from '@/components/ui';
import { useMutation } from '@/lib/use-resource';

function NewRfq({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const m = useMutation();
  if (!ws.capabilities.includes('buyer.purchase')) return <Forbidden />;
  return (
    <>
      <PageHeader title={t('buyer.nav.new_rfq')} />
      <p className="muted">{t('rfq.new_intro')}</p>
      <RfqForm
        wsApi={buyerApi(ws)}
        prefill={{
          category_id: params?.get('category') ?? undefined,
          invite: params?.get('invite') ?? undefined,
          title: params?.get('title') ?? undefined,
        }}
        busy={m.busy}
        error={m.error}
        submitLabel={t('rfq.save_draft')}
        onSubmit={async (body) => {
          const r = await m.run<RfqDetail>(`${buyerApi(ws)}/rfqs`, { method: 'POST', body });
          if (r.ok) router.push(`${base}/rfqs/${r.data.id}?created=1`);
        }}
      />
    </>
  );
}

export default function NewRfqPage() {
  return (
    <BuyerShell>
      {(ws, base) => (
        <Suspense fallback={<Skeleton />}>
          <NewRfq ws={ws} base={base} />
        </Suspense>
      )}
    </BuyerShell>
  );
}
