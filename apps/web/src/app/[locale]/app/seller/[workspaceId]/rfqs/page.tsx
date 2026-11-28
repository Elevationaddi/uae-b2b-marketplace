'use client';
import type { SellerRfqItem } from '@app/contracts';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useApp, useT } from '@/components/app-context';
import { useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { QuoteState, RfqState } from '@/components/rfq-ui';
import { sellerApi, SellerShell } from '@/components/seller-shell';
import type { Workspace } from '@/components/session';
import { Empty, PageHeader, Pager, Skeleton } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useResource } from '@/lib/use-resource';

const SCOPES = ['all', 'invited', 'pool', 'quoted'] as const;

function Inbox({ ws, base }: { ws: Workspace; base: string }) {
  const t = useT();
  const { locale } = useApp();
  const L = useLocalized();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const params = useSearchParams();
  const scope = (SCOPES as readonly string[]).includes(params?.get('scope') ?? '')
    ? params!.get('scope')!
    : 'all';
  const q = params?.get('q') ?? '';
  const cursor = params?.get('cursor') ?? '';
  const [term, setTerm] = useState(q);
  const { state, reload } = useResource<SellerRfqItem[]>(`${sellerApi(ws)}/rfqs`, {
    scope,
    q: q || undefined,
    cursor: cursor || undefined,
  });
  const go = (next: Record<string, string>) => {
    const sp = new URLSearchParams({ scope, ...(q ? { q } : {}), ...next });
    for (const [k, v] of [...sp]) if (!v || (k === 'scope' && v === 'all')) sp.delete(k);
    router.push(sp.toString() ? `${pathname}?${sp}` : pathname);
  };
  return (
    <>
      <PageHeader title={t('seller.nav.rfqs')} />
      <p className="muted">{t('seller.rfq.intro')}</p>
      <div className="tabs" role="tablist">
        {SCOPES.map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={scope === k}
            onClick={() => go({ scope: k, cursor: '' })}
          >
            {t(`seller.rfq.scope.${k}` as MessageKey)}
          </button>
        ))}
      </div>
      <form
        className="inline-form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go({ q: term.trim(), cursor: '' });
        }}
      >
        <label className="sr-only" htmlFor="rfq-q">
          {t('seller.rfq.search')}
        </label>
        <input
          id="rfq-q"
          type="search"
          value={term}
          maxLength={100}
          placeholder={t('seller.rfq.search')}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">
          {t('common.search')}
        </button>
      </form>
      <Resource state={state} reload={reload} lines={6}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>
              <p>{t('seller.rfq.empty')}</p>
            </Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="seller-rfqs">
                  <thead>
                    <tr>
                      <th scope="col">{t('rfq.title')}</th>
                      <th scope="col">{t('rfq.buyer')}</th>
                      <th scope="col">{t('rfq.quantity')}</th>
                      <th scope="col">{t('rfq.deadline')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('seller.rfq.my_quote')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <Link href={`${base}/rfqs/${r.id}`}>{r.title}</Link>
                          <div className="muted small">
                            <bdi>{r.number}</bdi> · {L(r.category_name_en, r.category_name_ar)}
                            {r.invited ? (
                              <span className="pill pill-info small">
                                {t('seller.rfq.invited')}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td>
                          {r.buyer_company_name}
                          <div className="muted small">
                            {t(`emirate.${r.emirate}` as MessageKey)}
                          </div>
                        </td>
                        <td>
                          {r.quantity} × {t(`unit.${r.unit}` as MessageKey)}
                        </td>
                        <td>{formatDubaiTime(r.deadline, locale)}</td>
                        <td>
                          <RfqState value={r.state} />
                        </td>
                        <td>
                          {r.my_quote_state ? (
                            <QuoteState value={r.my_quote_state} />
                          ) : (
                            <span className="muted">{t('seller.rfq.not_quoted')}</span>
                          )}
                        </td>
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

export default function SellerRfqsPage() {
  return (
    <SellerShell>
      {(ws, base) => (
        <Suspense fallback={<Skeleton />}>
          <Inbox ws={ws} base={base} />
        </Suspense>
      )}
    </SellerShell>
  );
}
