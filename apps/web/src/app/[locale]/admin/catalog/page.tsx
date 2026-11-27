'use client';
import Link from 'next/link';
import { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { Empty, PageHeader, Pager, StatusBadge } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

type Overview = {
  pending_reviews: number;
  pending_updates: number;
  flagged_pending: number;
  public_products: number;
  suspended_products: number;
  public_suppliers: number;
  hidden_storefronts: number;
  categories: number;
  blocked_categories: number;
  oldest_pending_at: string | null;
};
type QueueItem = {
  version_id: string;
  product_id: string;
  version: number;
  state: string;
  title_en: string;
  title_ar: string | null;
  company: { id: string; display_name: string };
  category: { id: string; name_en: string; name_ar: string; restriction: string };
  is_update: boolean;
  auto_flags: { kind: string; term: string; field: string }[];
  submitted_at: string | null;
  decided_at: string | null;
};
const STATES = ['PENDING_REVIEW', 'CHANGES_REQUESTED', 'REJECTED', 'APPROVED'] as const;

function Catalog() {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const base = `/${locale}/admin/catalog`;
  const ov = useResource<Overview>('/admin/catalog/overview');
  const [state, setState] = useState<(typeof STATES)[number]>('PENDING_REVIEW');
  const [q, setQ] = useState('');
  const pager = useCursor();
  const queue = useResource<QueueItem[]>('/admin/catalog/queue', {
    state,
    q,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('acat.title')} />
      <Resource state={ov.state} reload={ov.reload} lines={3}>
        {(o) => (
          <ul className="kpis" data-testid="catalog-kpis">
            {(
              [
                ['acat.pending_new', o.pending_reviews],
                ['acat.pending_updates', o.pending_updates],
                ['acat.flagged', o.flagged_pending],
                ['acat.public_products', o.public_products],
                ['acat.suspended', o.suspended_products],
                ['acat.public_suppliers', o.public_suppliers],
                ['acat.hidden_storefronts', o.hidden_storefronts],
              ] as [MessageKey, number][]
            ).map(([k, n]) => (
              <li key={k} className="kpi">
                <span className="kpi-value">{n}</span>
                <span className="kpi-label">{t(k)}</span>
              </li>
            ))}
            {o.oldest_pending_at ? (
              <li className="kpi">
                <span className="kpi-label">{t('acat.oldest_pending')}</span>
                <span className="small">{formatDubaiTime(o.oldest_pending_at, locale)}</span>
              </li>
            ) : null}
          </ul>
        )}
      </Resource>
      <section aria-labelledby="queue-h">
        <h2 id="queue-h">{t('acat.queue')}</h2>
        <form
          className="inline-form"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setQ(String(new FormData(e.currentTarget).get('q') ?? '').trim());
            pager.first();
          }}
        >
          <label className="inline-field">
            <span>{t('acat.state_filter')}</span>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value as (typeof STATES)[number]);
                pager.first();
              }}
            >
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {t(`vstate.${s}` as MessageKey)}
                </option>
              ))}
            </select>
          </label>
          <label className="sr-only" htmlFor="aq">
            {t('acat.search')}
          </label>
          <input id="aq" name="q" type="search" placeholder={t('acat.search')} maxLength={100} />
          <button type="submit" className="btn btn-secondary">
            {t('common.search')}
          </button>
        </form>
        <Resource state={queue.state} reload={queue.reload}>
          {(items, next) =>
            items.length === 0 ? (
              <Empty>{t('acat.queue_empty')}</Empty>
            ) : (
              <>
                <div className="table-wrap">
                  <table className="table" data-testid="review-queue">
                    <thead>
                      <tr>
                        <th scope="col">{t('seller.title_en')}</th>
                        <th scope="col">{t('nav.company')}</th>
                        <th scope="col">{t('seller.category')}</th>
                        <th scope="col">{t('common.status')}</th>
                        <th scope="col">{t('acat.flags')}</th>
                        <th scope="col">{t('common.created')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((i) => (
                        <tr key={i.version_id}>
                          <td>
                            <Link href={`${base}/reviews/${i.version_id}`}>
                              {L(i.title_en, i.title_ar)}
                            </Link>
                            <span className="muted small block">
                              {i.is_update ? t('acat.update') : t('acat.new_listing')} · v
                              {i.version}
                            </span>
                          </td>
                          <td>{i.company.display_name}</td>
                          <td>
                            {L(i.category.name_en, i.category.name_ar)}
                            {i.category.restriction !== 'OPEN' ? (
                              <span className="pill pill-warn small">
                                {t(`restriction.${i.category.restriction}` as MessageKey)}
                              </span>
                            ) : null}
                          </td>
                          <td>
                            <StatusBadge
                              value={i.state}
                              label={t(`vstate.${i.state}` as MessageKey)}
                            />
                          </td>
                          <td>
                            {i.auto_flags.length ? i.auto_flags.map((f) => f.term).join(', ') : '—'}
                          </td>
                          <td className="small">
                            {i.submitted_at ? formatDubaiTime(i.submitted_at, locale) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pager
                  hasPrev={pager.hasPrev}
                  nextCursor={next}
                  onFirst={pager.first}
                  onNext={pager.next}
                />
              </>
            )
          }
        </Resource>
      </section>
    </>
  );
}

export default function AdminCatalogPage() {
  return (
    <AdminShell require="admin.catalog.read">
      <Catalog />
    </AdminShell>
  );
}
