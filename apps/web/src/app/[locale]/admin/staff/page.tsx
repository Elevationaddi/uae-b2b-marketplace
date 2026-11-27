'use client';
import { ADMIN_ROLES, type AdminRole } from '@app/contracts';
import { useState } from 'react';
import { AdminShell, useAdmin } from '@/components/admin-shell';
import { useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import {
  Alert,
  Button,
  ConfirmDialog,
  Empty,
  PageHeader,
  StatusBadge,
  TextArea,
} from '@/components/ui';
import type { MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Staff = {
  id: string;
  email: string;
  full_name: string | null;
  roles: AdminRole[];
  mfa_enabled: boolean;
  status: 'ACTIVE' | 'DISABLED';
};

function StaffBody() {
  const t = useT();
  const me = useAdmin();
  const { state, reload } = useResource<Staff[]>('/admin/staff');
  const m = useMutation();
  const [editing, setEditing] = useState<Staff | null>(null);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [reason, setReason] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeader title={t('admin.staff_title')} />
      <p className="muted">{t('admin.staff_provision_note')}</p>
      {saved ? <Alert kind="success">{t('common.saved')}</Alert> : null}
      <Resource state={state} reload={reload}>
        {(rows) =>
          rows.length === 0 ? (
            <Empty>{t('common.empty')}</Empty>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">{t('common.email')}</th>
                    <th scope="col">{t('admin.roles')}</th>
                    <th scope="col">{t('admin.mfa_enabled')}</th>
                    <th scope="col">{t('common.status')}</th>
                    <th scope="col">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <bdi>{s.email}</bdi>
                        {s.id === me.user.id ? <span className="tag">{t('team.you')}</span> : null}
                        <div className="muted">{s.full_name ?? '—'}</div>
                      </td>
                      <td>
                        {s.roles.length
                          ? s.roles.map((r) => t(`adminrole.${r}` as MessageKey)).join(', ')
                          : t('common.none')}
                      </td>
                      <td>{s.mfa_enabled ? t('common.yes') : t('common.no')}</td>
                      <td>
                        <StatusBadge value={s.status} label={t(`ustatus.${s.status}`)} />
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => {
                            setEditing(s);
                            setRoles(s.roles);
                            setReason('');
                            setSaved(false);
                          }}
                        >
                          {t('admin.edit_roles')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </Resource>
      <ConfirmDialog
        open={editing !== null}
        title={`${t('admin.edit_roles')}: ${editing?.email ?? ''}`}
        confirmLabel={t('common.save')}
        busy={m.busy}
        error={m.error}
        onClose={() => {
          setEditing(null);
          m.setError(null);
        }}
        onConfirm={async () => {
          if (!editing) return;
          const r = await m.run(`/admin/staff/${editing.id}/roles`, {
            method: 'POST',
            body: { roles, reason },
          });
          if (r.ok) {
            setEditing(null);
            setSaved(true);
            reload();
          }
        }}
      >
        <fieldset className="fieldset">
          <legend>{t('admin.roles')}</legend>
          {ADMIN_ROLES.map((r) => (
            <label key={r} className="check">
              <input
                type="checkbox"
                checked={roles.includes(r)}
                onChange={() =>
                  setRoles((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]))
                }
              />
              <span>{t(`adminrole.${r}` as MessageKey)}</span>
            </label>
          ))}
        </fieldset>
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

export default function AdminStaffPage() {
  return (
    <AdminShell require="admin.staff.manage">
      <StaffBody />
    </AdminShell>
  );
}
