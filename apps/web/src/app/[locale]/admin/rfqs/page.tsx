'use client';
import { RFQ_STATES, type AdminRfqItem } from '@app/contracts';
import Link from 'next/link';
import { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { RfqState } from '@/components/rfq-ui';
import { Empty, PageHeader, Pager } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

function Rfqs() {
  const { locale } = useApp();
  const t = useT();
  const [q, setQ] = useState('');
  const [state, setState] = useState('');
  const [hidden, setHidden] = useState('');
  const pager = useCursor();
  const res = useResource<AdminRfqItem[]>('/admin/rfqs', {
    q: q || undefined,
    state: state || undefined,
    hidden: hidden || undefined,
    cursor: pager.cursor,
  });
  return (
    <>
      <PageHeader title={t('admin.nav.rfqs')} />
      <p className="muted">{t('admin.rfq.intro')}</p>
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
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              pager.first();
            }}
          >
            <option value="">{t('common.all')}</option>
            {RFQ_STATES.map((s) => (
              <option key={s} value={s}>
                {t(`rfq.state.${s}` as MessageKey)}
              </option>
            ))}
          </select>
        </label>
        <label className="inline-field">
          <span>{t('common.filter')}</span>
          <select
            value={hidden}
            onChange={(e) => {
              setHidden(e.target.value);
              pager.first();
            }}
          >
            <option value="">{t('common.all')}</option>
            <option value="true">{t('acat.hidden')}</option>
            <option value="false">{t('acat.visible')}</option>
          </select>
        </label>
        <label className="sr-only" htmlFor="ar-q">
          {t('common.search')}
        </label>
        <input
          id="ar-q"
          name="q"
          type="search"
          placeholder={t('admin.rfq.search')}
          maxLength={100}
        />
        <button type="submit" className="btn btn-secondary">
          {t('common.search')}
        </button>
      </form>
      <Resource state={res.state} reload={res.reload}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>{t('common.empty')}</Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table" data-testid="admin-rfqs">
                  <thead>
                    <tr>
                      <th scope="col">{t('rfq.title')}</th>
                      <th scope="col">{t('rfq.buyer')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('rfq.quotes')}</th>
                      <th scope="col">{t('rfq.deadline')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <Link href={`/${locale}/admin/rfqs/${r.id}`}>{r.title}</Link>
                          <div className="muted small">
                            <bdi>{r.number}</bdi>
                            {r.hidden ? (
                              <span className="pill pill-warn small">{t('acat.hidden')}</span>
                            ) : null}
                          </div>
                        </td>
                        <td>{r.buyer_company_name}</td>
                        <td>
                          <RfqState value={r.state} />
                        </td>
                        <td>{r.quote_count ?? 0}</td>
                        <td className="small">{formatDubaiTime(r.deadline, locale)}</td>
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

export default function AdminRfqsPage() {
  return (
    <AdminShell require="admin.rfqs.read">
      <Rfqs />
    </AdminShell>
  );
}
