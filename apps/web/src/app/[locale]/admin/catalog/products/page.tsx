'use client';
import { PRODUCT_STATUSES } from '@app/contracts';
import Link from 'next/link';
import { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { useLocalized } from '@/components/catalog-ui';
import { Resource } from '@/components/resource';
import { Empty, PageHeader, Pager, StatusBadge } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

type Item = {
  id: string;
  status: string;
  title_en: string;
  title_ar: string | null;
  company: { id: string; display_name: string };
  category_name_en: string;
  public: boolean;
  working_state: string | null;
  updated_at: string;
};

function Listings() {
  const { locale } = useApp();
  const t = useT();
  const L = useLocalized();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const pager = useCursor();
  const { state, reload } = useResource<Item[]>('/admin/catalog/products', {
    status,
    q,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('acat.listings_title')} />
      <p className="muted small">{t('acat.no_edit_note')}</p>
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
          <span>{t('common.status')}</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              pager.first();
            }}
          >
            <option value="">{t('common.all')}</option>
            {PRODUCT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`pstatus.${s}` as MessageKey)}
              </option>
            ))}
          </select>
        </label>
        <label className="sr-only" htmlFor="al-q">
          {t('acat.search')}
        </label>
        <input id="al-q" name="q" type="search" placeholder={t('acat.search')} maxLength={100} />
        <button type="submit" className="btn btn-secondary">
          {t('common.search')}
        </button>
      </form>
      <Resource state={state} reload={reload}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>{t('common.empty')}</Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="admin-listings">
                  <thead>
                    <tr>
                      <th scope="col">{t('seller.title_en')}</th>
                      <th scope="col">{t('nav.company')}</th>
                      <th scope="col">{t('seller.category')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('common.updated_at')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <Link href={`/${locale}/admin/catalog/products/${p.id}`}>
                            {L(p.title_en, p.title_ar)}
                          </Link>
                          {p.public ? (
                            <span className="pill pill-ok small">{t('seller.public_badge')}</span>
                          ) : null}
                        </td>
                        <td>{p.company.display_name}</td>
                        <td>{p.category_name_en}</td>
                        <td>
                          <StatusBadge
                            value={p.status}
                            label={t(`pstatus.${p.status}` as MessageKey)}
                          />
                          {p.working_state && p.working_state !== 'APPROVED' ? (
                            <>
                              {' '}
                              <StatusBadge
                                value={p.working_state}
                                label={t(`vstate.${p.working_state}` as MessageKey)}
                              />
                            </>
                          ) : null}
                        </td>
                        <td className="small">{formatDubaiTime(p.updated_at, locale)}</td>
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
    </>
  );
}

export default function AdminListingsPage() {
  return (
    <AdminShell require="admin.catalog.read">
      <Listings />
    </AdminShell>
  );
}
