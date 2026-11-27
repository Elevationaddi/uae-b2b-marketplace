'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { Empty, PageHeader, Pager, SelectField, Skeleton, StatusBadge } from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useCursor, useResource } from '@/lib/use-resource';

type QueueItem = {
  case_id: string;
  kind: 'INITIAL' | 'RENEWAL';
  state: string;
  submitted_at: string | null;
  assigned_admin: { id: string; email: string } | null;
  company: { id: string; display_name: string; legal_name: string; licence_number: string; emirate: string; kinds: string[] };
};

const STATES = ['', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_INFO', 'REJECTED', 'APPROVED'] as const;

function Queue() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const state = params?.get('state') ?? '';
  const pager = useCursor();
  const { state: res, reload } = useResource<QueueItem[]>('/admin/verification', { state: state || undefined, cursor: pager.cursor });

  return (
    <>
      <PageHeader title={t('admin.queue_title')} />
      <div className="filters">
        <SelectField
          label={t('common.status')}
          value={state}
          onChange={(e) => {
            pager.first();
            router.replace(`/${locale}/admin/verification${e.target.value ? `?state=${e.target.value}` : ''}`);
          }}
          options={STATES.map((s) => ({ value: s, label: s ? t(`cstatus.${s}` as MessageKey) : t('admin.open_cases') }))}
        />
      </div>
      <Resource state={res} reload={reload}>
        {(items, next) =>
          items.length === 0 ? (
            <Empty>{t('admin.queue_empty')}</Empty>
          ) : (
            <>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">{t('nav.company')}</th>
                      <th scope="col">{t('company.kinds')}</th>
                      <th scope="col">{t('common.status')}</th>
                      <th scope="col">{t('admin.submitted_at')}</th>
                      <th scope="col">{t('admin.assigned_to')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((i) => (
                      <tr key={i.case_id}>
                        <td>
                          <Link href={`/${locale}/admin/verification/${i.case_id}`}>{i.company.display_name}</Link>
                          <div className="muted">
                            {t(`admin.case_kind.${i.kind}`)} · <bdi>{i.company.licence_number}</bdi>
                          </div>
                        </td>
                        <td>{i.company.kinds.map((k) => t(`kind.${k}` as MessageKey)).join(', ')}</td>
                        <td>
                          <StatusBadge value={i.state} label={t(`cstatus.${i.state}` as MessageKey)} />
                        </td>
                        <td>{i.submitted_at ? formatDubaiTime(i.submitted_at, locale) : '—'}</td>
                        <td>{i.assigned_admin ? <bdi>{i.assigned_admin.email}</bdi> : t('admin.unassigned')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager hasPrev={pager.hasPrev} nextCursor={next} onFirst={pager.first} onNext={pager.next} />
            </>
          )
        }
      </Resource>
    </>
  );
}

export default function VerificationQueuePage() {
  return (
    <AdminShell require="admin.verification.review">
      <Suspense fallback={<Skeleton />}>
        <Queue />
      </Suspense>
    </AdminShell>
  );
}
