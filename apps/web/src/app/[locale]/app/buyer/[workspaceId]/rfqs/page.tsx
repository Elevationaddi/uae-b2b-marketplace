'use client';
import { RFQ_STATES, type RfqSummary } from '@app/contracts';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useApp, useT } from '@/components/app-context';
import { buyerApi, BuyerShell } from '@/components/buyer-shell';
import { useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { RfqState } from '@/components/rfq-ui';
import type { Workspace } from '@/components/session';
import { Empty, PageHeader, Pager, Skeleton } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';

function List({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { locale } = useApp();
  const L = useLocalized();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const params = useSearchParams();
  const state = (RFQ_STATES as readonly string[]).includes(params?.get('state') ?? '')
    ? params!.get('state')!
    : '';
  const cursor = params?.get('cursor') ?? '';
  const { state: res, reload } = useResource<RfqSummary[]>(`${buyerApi(ws)}/rfqs`, {
    state,
    cursor,
  });
  const canCreate = ws.capabilities.includes('buyer.purchase');
  const go = (next: Record<string, string>) => {
    const sp = new URLSearchParams({ ...(state ? { state } : {}), ...next });
    for (const [k, v] of [...sp]) if (!v) sp.delete(k);
    router.push(sp.toString() ? `${pathname}?${sp}` : pathname);
  };
  return (
    <>
      <PageHeader title={t('buyer.nav.rfqs')}>
        {canCreate ? (
          <Link className="btn btn-primary" href={`${base}/rfqs/new`}>
            {t('buyer.nav.new_rfq')}
          </Link>
        ) : null}
      </PageHeader>
      {!canCreate ? <p className="muted">{t('rfq.cannot_create')}</p> : null}
      <div className="tabs" role="tablist">
        {['', ...RFQ_STATES].map((k) => (
          <button
            key={k || 'all'}
            type="button"
            role="tab"
            aria-selected={state === k}
            onClick={() => go({ state: k, cursor: '' })}
          >
            {k ? t(`rfq.state.${k}` as MessageKey) : t('rfq.all')}
          </button>
        ))}
      </div>
      <Resource state={res} reload={reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('rfq.empty_buyer')}</p>
              {canCreate ? (
                <Link className="btn btn-primary" href={`${base}/rfqs/new`}>
                  {t('buyer.nav.new_rfq')}
                </Link>
              ) : null}
            </Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="buyer-rfqs">
                  <thead>
                    <tr>
                      <th scope="col">{t('rfq.title')}</th>
                      <th scope="col">{t('rfq.category')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('rfq.quotes')}</th>
                      <th scope="col">{t('rfq.deadline')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <Link href={`${base}/rfqs/${r.id}`}>{r.title}</Link>
                          <div className="muted small">
                            <bdi>{r.number}</bdi>
                          </div>
                        </td>
                        <td>{L(r.category_name_en, r.category_name_ar)}</td>
                        <td>
                          <RfqState value={r.state} />
                        </td>
                        <td>{r.quote_count ?? 0}</td>
                        <td>{formatDubaiTime(r.deadline, locale)}</td>
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

export default function BuyerRfqsPage() {
  return (
    <BuyerShell>
      {(ws, base) => (
        <Suspense fallback={<Skeleton />}>
          <List ws={ws} base={base} />
        </Suspense>
      )}
    </BuyerShell>
  );
}
