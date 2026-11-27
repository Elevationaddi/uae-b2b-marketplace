'use client';
import { useState, type FormEvent } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import {
  Alert,
  Button,
  ConfirmDialog,
  Empty,
  Field,
  PageHeader,
  Pager,
  SelectField,
  TextArea,
} from '@/components/ui';
import { formatDubaiTime } from '@/i18n/messages';
import { useCursor, useMutation, useResource } from '@/lib/use-resource';

type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  account_type: 'COMPANY' | 'PLATFORM_ADMIN';
  status: 'ACTIVE' | 'DISABLED';
  email_verified: boolean;
  active_sessions: number;
  memberships: number;
  created_at: string;
};

function Users() {
  const { locale } = useApp();
  const t = useT();
  const me = useAdmin();
  const canRevoke = me.capabilities.includes('admin.users.revoke_sessions');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ q: '', account_type: '' });
  const pager = useCursor();
  const { state, reload } = useResource<UserRow[]>('/admin/users', {
    q: filters.q || undefined,
    account_type: filters.account_type || undefined,
    cursor: pager.cursor,
  });
  const m = useMutation();
  const [target, setTarget] = useState<UserRow | null>(null);
  const [reason, setReason] = useState('');
  const [revoked, setRevoked] = useState<number | null>(null);

  return (
    <>
      <PageHeader title={t('admin.users_title')} />
      <form
        className="filters"
        role="search"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          pager.first();
          setFilters({ ...filters, q: search.trim() });
        }}
      >
        <Field
          label={t('admin.search_users')}
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectField
          label={t('admin.account_type')}
          value={filters.account_type}
          onChange={(e) => {
            pager.first();
            setFilters({ ...filters, account_type: e.target.value });
          }}
          options={[
            { value: '', label: t('common.all') },
            { value: 'COMPANY', label: t('admin.account_type.COMPANY') },
            { value: 'PLATFORM_ADMIN', label: t('admin.account_type.PLATFORM_ADMIN') },
          ]}
        />
        <Button type="submit" variant="secondary">
          {t('common.search')}
        </Button>
      </form>
      {revoked !== null ? (
        <Alert kind="success">{t('admin.sessions_revoked', { count: revoked })}</Alert>
      ) : null}
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
                      <th scope="col">{t('common.email')}</th>
                      <th scope="col">{t('admin.account_type')}</th>
                      <th scope="col">{t('admin.email_verified')}</th>
                      <th scope="col">{t('admin.sessions')}</th>
                      <th scope="col">{t('admin.memberships')}</th>
                      <th scope="col">{t('common.created')}</th>
                      {canRevoke ? <th scope="col">{t('common.actions')}</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <bdi>{u.email}</bdi>
                          <div className="muted">{u.full_name ?? '—'}</div>
                        </td>
                        <td>{t(`admin.account_type.${u.account_type}`)}</td>
                        <td>{u.email_verified ? t('common.yes') : t('common.no')}</td>
                        <td>{u.active_sessions}</td>
                        <td>{u.memberships}</td>
                        <td>{formatDubaiTime(u.created_at, locale)}</td>
                        {canRevoke ? (
                          <td>
                            {u.active_sessions > 0 ? (
                              <Button type="button" variant="link" onClick={() => setTarget(u)}>
                                {t('admin.revoke_sessions')}
                              </Button>
                            ) : null}
                          </td>
                        ) : null}
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
      <ConfirmDialog
        open={target !== null}
        title={t('admin.revoke_sessions')}
        body={target?.email}
        confirmLabel={t('admin.revoke_sessions')}
        danger
        busy={m.busy}
        error={m.error}
        onClose={() => {
          setTarget(null);
          m.setError(null);
        }}
        onConfirm={async () => {
          if (!target) return;
          const r = await m.run<{ revoked: number }>(`/admin/users/${target.id}/revoke-sessions`, {
            method: 'POST',
            body: { reason },
          });
          if (r.ok) {
            setRevoked(r.data.revoked);
            setTarget(null);
            setReason('');
            reload();
          }
        }}
      >
        <TextArea
          label={t('common.reason')}
          hint={t('admin.reason_hint')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          minLength={5}
        />
      </ConfirmDialog>
    </>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminShell require="admin.users.read">
      <Users />
    </AdminShell>
  );
}
