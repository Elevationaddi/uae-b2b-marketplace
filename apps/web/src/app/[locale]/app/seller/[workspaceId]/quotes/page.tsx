'use client';
import { QUOTE_STATES, type SellerQuoteItem } from '@app/contracts';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useApp, useT } from '@/components/app-context';
import { Money } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { QuoteState, RfqState } from '@/components/rfq-ui';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import { Empty, PageHeader, Pager, Skeleton } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';

function List({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { locale } = useApp();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const params = useSearchParams();
  const state = (QUOTE_STATES as readonly string[]).includes(params?.get('state') ?? '')
    ? params!.get('state')!
    : '';
  const cursor = params?.get('cursor') ?? '';
  const { state: res, reload } = useResource<SellerQuoteItem[]>(`${sellerApi(ws)}/quotes`, {
    state: state || undefined,
    cursor: cursor || undefined,
  });
  const go = (next: Record<string, string>) => {
    const sp = new URLSearchParams({ ...(state ? { state } : {}), ...next });
    for (const [k, v] of [...sp]) if (!v) sp.delete(k);
    router.push(sp.toString() ? `${pathname}?${sp}` : pathname);
  };
  return (
    <>
      <PageHeader title={t('seller.nav.quotes')} />
      <div className="tabs" role="tablist">
        {['', ...QUOTE_STATES].map((k) => (
          <button
            key={k || 'all'}
            type="button"
            role="tab"
            aria-selected={state === k}
            onClick={() => go({ state: k, cursor: '' })}
          >
            {k ? t(`quote.state.${k}` as MessageKey) : t('rfq.all')}
          </button>
        ))}
      </div>
      <Resource state={res} reload={reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('seller.quote.empty')}</p>
              <Link className="btn btn-primary" href={`${base}/rfqs`}>
                {t('seller.nav.rfqs')}
              </Link>
            </Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="seller-quotes">
                  <thead>
                    <tr>
                      <th scope="col">{t('rfq.title')}</th>
                      <th scope="col">{t('rfq.buyer')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('quote.total')}</th>
                      <th scope="col">{t('quote.valid_until')}</th>
                      <th scope="col">{t('rfq.deadline')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((q) => (
                      <tr key={q.id}>
                        <td>
                          <Link href={`${base}/rfqs/${q.rfq.id}`}>{q.rfq.title}</Link>
                          <div className="muted small">
                            <bdi>{q.rfq.number}</bdi> · <RfqState value={q.rfq.state} />
                          </div>
                        </td>
                        <td>{q.buyer_company_name}</td>
                        <td>
                          <QuoteState value={q.state} />
                          {q.current ? (
                            <span className="muted small"> v{q.current.version}</span>
                          ) : null}
                        </td>
                        <td>{q.current ? <Money fils={q.current.total_fils} /> : '—'}</td>
                        <td>{q.current ? formatDubaiTime(q.current.valid_until, locale) : '—'}</td>
                        <td>{formatDubaiTime(q.rfq.deadline, locale)}</td>
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

export default function SellerQuotesPage() {
  return (
    <SellerShell>
      {(ws, base) => (
        <Suspense fallback={<Skeleton />}>
          <List ws={ws} base={base} />
        </Suspense>
      )}
    </SellerShell>
  );
}
