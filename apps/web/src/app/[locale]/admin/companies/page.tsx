'use client';
import { COMPANY_STATUSES } from '@app/contracts';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import {
  Button,
  Empty,
  Field,
  PageHeader,
  Pager,
  SelectField,
  Skeleton,
  StatusBadge,
} from '@/components/ui';
import { formatDate, type MessageKey } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

type CompanyRow = {
  id: string;
  legal_name: string;
  display_name: string;
  licence_number: string;
  licence_expiry: string;
  licence_expired: boolean;
  emirate: string;
  status: string;
  kinds: string[];
};

function Companies() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const status = params?.get('status') ?? '';
  const q = params?.get('q') ?? '';
  const [search, setSearch] = useState(q);
  const pager = useCursor();
  const { state, reload } = useResource<CompanyRow[]>('/admin/companies', {
    status: status || undefined,
    q: q || undefined,
    cursor: pager.cursor,
  });
  const go = (next: { status?: string; q?: string }) => {
    pager.first();
    const qs = new URLSearchParams();
    const s = next.status ?? status;
    const query = next.q ?? q;
    if (s) qs.set('status', s);
    if (query) qs.set('q', query);
    router.replace(`/${locale}/admin/companies${qs.size ? `?${qs}` : ''}`);
  };

  return (
    <>
      <PageHeader title={t('admin.companies_title')} />
      <form
        className="filters"
        role="search"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          go({ q: search.trim() });
        }}
      >
        <Field
          label={t('admin.search_companies')}
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectField
          label={t('common.status')}
          value={status}
          onChange={(e) => go({ status: e.target.value })}
          options={[
            { value: '', label: t('common.all') },
            ...COMPANY_STATUSES.map((s) => ({ value: s, label: t(`cstatus.${s}` as MessageKey) })),
          ]}
        />
        <Button type="submit" variant="secondary">
          {t('common.search')}
        </Button>
      </form>
      <Resource state={state} reload={reload}>
        {(rows, next) =>
          rows.length === 0 ? (
            <Empty>{t('common.empty')}</Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">{t('nav.company')}</th>
                      <th scope="col">{t('company.licence_number')}</th>
                      <th scope="col">{t('company.licence_expiry')}</th>
                      <th scope="col">{t('company.kinds')}</th>
                      <th scope="col">{t('common.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <Link href={`/${locale}/admin/companies/${c.id}`}>{c.display_name}</Link>
                          <div className="muted">{c.legal_name}</div>
                        </td>
                        <td>
                          <bdi>{c.licence_number}</bdi>
                        </td>
                        <td>
                          {formatDate(c.licence_expiry, locale)}
                          {c.licence_expired ? (
                            <>
                              {' '}
                              <StatusBadge value="EXPIRED" label={t('team.invite_state.EXPIRED')} />
                            </>
                          ) : null}
                        </td>
                        <td>{c.kinds.map((k) => t(`kind.${k}` as MessageKey)).join(', ')}</td>
                        <td>
                          <StatusBadge
                            value={c.status}
                            label={t(`cstatus.${c.status}` as MessageKey)}
                          />
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
    </>
  );
}

export default function AdminCompaniesPage() {
  return (
    <AdminShell require="admin.companies.read">
      <Suspense fallback={<Skeleton />}>
        <Companies />
      </Suspense>
    </AdminShell>
  );
}
