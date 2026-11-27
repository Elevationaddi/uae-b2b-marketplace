'use client';
import { rolesForKind, type MembershipRole } from '@app/contracts';
import { useParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useApp, useT } from '@/components/app-context';
import { Resource } from '@/components/resource';
import { AppShell, useSession, type Workspace } from '@/components/session';
import {
  Alert,
  ApiErrorAlert,
  Button,
  ConfirmDialog,
  Empty,
  Field,
  NotFound,
  PageHeader,
  SelectField,
  StatusBadge,
  useFieldError,
} from '@/components/ui';
import { formatDubaiTime, type MessageKey } from '@/i18n/messages';
import { useMutation, useResource } from '@/lib/use-resource';

type Member = {
  membership_id: string;
  user: { id: string; email: string; full_name: string | null };
  role: MembershipRole;
  status: 'ACTIVE' | 'REVOKED';
  is_self: boolean;
  created_at: string;
};
type Invitation = {
  id: string;
  email: string;
  role: MembershipRole;
  state: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
  expires_at: string;
  created_at: string;
};

type PendingAction =
  | { kind: 'role'; member: Member; role: MembershipRole }
  | { kind: 'status'; member: Member; status: 'ACTIVE' | 'REVOKED' }
  | { kind: 'invite'; invitation: Invitation };

function Team({ ws }: { ws: Workspace }) {
  const { locale } = useApp();
  const t = useT();
  const isOwner = ws.role === 'OWNER';
  const members = useResource<Member[]>(`/workspaces/${ws.id}/members`);
  const invitations = useResource<Invitation[]>(
    isOwner ? `/workspaces/${ws.id}/invitations` : null,
  );
  const [pending, setPending] = useState<PendingAction | null>(null);
  const action = useMutation();
  const roleLabel = (r: string) => t(`role.${r}` as MessageKey);
  const roles = rolesForKind(ws.kind);

  async function confirm() {
    if (!pending) return;
    const r =
      pending.kind === 'invite'
        ? await action.run(`/workspaces/${ws.id}/invitations/${pending.invitation.id}`, {
            method: 'DELETE',
          })
        : await action.run(`/memberships/${pending.member.membership_id}`, {
            method: 'PATCH',
            body: pending.kind === 'role' ? { role: pending.role } : { status: pending.status },
          });
    if (r.ok) {
      setPending(null);
      members.reload();
      invitations.reload();
    }
  }

  const dialog = (() => {
    if (!pending) return { title: '', body: '', label: '', danger: false };
    if (pending.kind === 'role')
      return {
        title: t('team.change_role'),
        body: t('team.confirm_role', {
          email: pending.member.user.email,
          role: roleLabel(pending.role),
        }),
        label: t('common.confirm'),
        danger: false,
      };
    if (pending.kind === 'status')
      return pending.status === 'REVOKED'
        ? {
            title: t('team.revoke_access'),
            body: t('team.confirm_revoke', { email: pending.member.user.email }),
            label: t('team.revoke_access'),
            danger: true,
          }
        : {
            title: t('team.restore_access'),
            body: pending.member.user.email,
            label: t('team.restore_access'),
            danger: false,
          };
    return {
      title: t('team.revoke_invite'),
      body: pending.invitation.email,
      label: t('team.revoke_invite'),
      danger: true,
    };
  })();

  return (
    <>
      <PageHeader title={t('team.title')} />
      <p className="muted">
        {t('team.workspace')}: {ws.company.display_name} · {t(`kind.${ws.kind}`)}
      </p>
      <section className="card" aria-labelledby="members-heading">
        <h2 id="members-heading">{t('team.members')}</h2>
        <Resource state={members.state} reload={members.reload}>
          {(list) =>
            list.length === 0 ? (
              <Empty>{t('common.empty')}</Empty>
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">{t('common.name')}</th>
                      <th scope="col">{t('common.role')}</th>
                      <th scope="col">{t('common.status')}</th>
                      {isOwner ? <th scope="col">{t('common.actions')}</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((m) => (
                      <tr key={m.membership_id}>
                        <td>
                          {m.user.full_name ?? '—'}{' '}
                          {m.is_self ? <span className="tag">{t('team.you')}</span> : null}
                          <div className="muted">
                            <bdi>{m.user.email}</bdi>
                          </div>
                        </td>
                        <td>
                          {isOwner && m.status === 'ACTIVE' ? (
                            <label>
                              <span className="sr-only">
                                {t('team.change_role')} {m.user.email}
                              </span>
                              <select
                                value={m.role}
                                onChange={(e) =>
                                  setPending({
                                    kind: 'role',
                                    member: m,
                                    role: e.target.value as MembershipRole,
                                  })
                                }
                              >
                                {roles.map((r) => (
                                  <option key={r} value={r}>
                                    {roleLabel(r)}
                                  </option>
                                ))}
                              </select>
                            </label>
                          ) : (
                            roleLabel(m.role)
                          )}
                        </td>
                        <td>
                          <StatusBadge
                            value={m.status}
                            label={t(`team.member_state.${m.status}`)}
                          />
                        </td>
                        {isOwner ? (
                          <td>
                            {m.status === 'ACTIVE' ? (
                              <Button
                                type="button"
                                variant="link"
                                onClick={() =>
                                  setPending({ kind: 'status', member: m, status: 'REVOKED' })
                                }
                              >
                                {t('team.revoke_access')}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="link"
                                onClick={() =>
                                  setPending({ kind: 'status', member: m, status: 'ACTIVE' })
                                }
                              >
                                {t('team.restore_access')}
                              </Button>
                            )}
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </Resource>
      </section>

      {isOwner ? (
        <>
          <InviteForm workspaceId={ws.id} roles={roles} onInvited={invitations.reload} />
          <section className="card" aria-labelledby="inv-heading">
            <h2 id="inv-heading">{t('team.pending')}</h2>
            <Resource state={invitations.state} reload={invitations.reload}>
              {(list) =>
                list.length === 0 ? (
                  <Empty>{t('team.no_invitations')}</Empty>
                ) : (
                  <ul className="doc-list">
                    {list.map((i) => (
                      <li key={i.id} className="doc">
                        <div>
                          <bdi>{i.email}</bdi> · {roleLabel(i.role)}
                          <div className="muted">
                            {t('team.expires')}: {formatDubaiTime(i.expires_at, locale)}
                          </div>
                        </div>
                        <div className="doc-actions">
                          <StatusBadge value={i.state} label={t(`team.invite_state.${i.state}`)} />
                          {i.state === 'PENDING' ? (
                            <Button
                              type="button"
                              variant="link"
                              onClick={() => setPending({ kind: 'invite', invitation: i })}
                            >
                              {t('team.revoke_invite')}
                            </Button>
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              }
            </Resource>
          </section>
        </>
      ) : (
        <p className="muted">{t('team.owner_only')}</p>
      )}

      <ConfirmDialog
        open={pending !== null}
        title={dialog.title}
        body={dialog.body}
        confirmLabel={dialog.label}
        danger={dialog.danger}
        busy={action.busy}
        error={action.error}
        onConfirm={confirm}
        onClose={() => {
          setPending(null);
          action.setError(null);
        }}
      />
    </>
  );
}

function InviteForm({
  workspaceId,
  roles,
  onInvited,
}: {
  workspaceId: string;
  roles: readonly MembershipRole[];
  onInvited: () => void;
}) {
  const t = useT();
  const m = useMutation();
  const fe = useFieldError(m.error);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MembershipRole>(roles.find((r) => r !== 'OWNER') ?? 'VIEWER');
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSentTo(null);
    const r = await m.run(`/workspaces/${workspaceId}/invitations`, {
      method: 'POST',
      body: { email, role },
    });
    if (r.ok) {
      setSentTo(email.trim());
      setEmail('');
      onInvited();
    }
  }

  return (
    <section className="card" aria-labelledby="invite-heading">
      <h2 id="invite-heading">{t('team.invite_title')}</h2>
      {sentTo ? <Alert kind="success">{t('team.invited', { email: sentTo })}</Alert> : null}
      {m.error && !Object.keys(m.error.fieldErrors).length ? (
        <ApiErrorAlert error={m.error} />
      ) : null}
      <form onSubmit={submit} noValidate className="form grid-3 align-end">
        <Field
          label={t('auth.email')}
          type="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fe('email')}
          required
        />
        <SelectField
          label={t('common.role')}
          value={role}
          onChange={(e) => setRole(e.target.value as MembershipRole)}
          options={roles.map((r) => ({ value: r, label: t(`role.${r}` as MessageKey) }))}
          error={fe('role')}
        />
        <Button type="submit" busy={m.busy}>
          {t('team.invite_submit')}
        </Button>
      </form>
    </section>
  );
}

function TeamRoute({ workspaceId }: { workspaceId: string }) {
  const { locale } = useApp();
  const { me } = useSession();
  const ws = me.workspaces.find((w) => w.id === workspaceId);
  if (!ws) return <NotFound backHref={`/${locale}/app`} />;
  return <Team ws={ws} />;
}

export default function TeamPage() {
  const params = useParams<{ workspaceId: string }>();
  return (
    <AppShell>
      <TeamRoute workspaceId={params.workspaceId} />
    </AppShell>
  );
}
