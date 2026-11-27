'use client';
import type { MeResponse } from '@app/contracts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApp, useT } from '@/components/app-context';
import { PublicShell } from '@/components/public-shell';
import { Alert, ApiErrorAlert, Button, PageHeader, Skeleton } from '@/components/ui';
import { api, type ApiError } from '@/lib/client';
import { takeFragmentToken } from '@/lib/nav';
import { useMutation } from '@/lib/use-resource';

type Preview = {
  company_display_name: string;
  company_status: string;
  workspace_kind: 'BUYER' | 'SELLER';
  role: string;
  email: string;
  state: 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';
};

const KEY = 'pending-invitation';

/** The invitation token is kept for this browser tab only while the invitee signs in or registers. */
function loadToken(): string | null {
  const fromUrl = takeFragmentToken();
  try {
    if (fromUrl) window.sessionStorage.setItem(KEY, fromUrl);
    return fromUrl ?? window.sessionStorage.getItem(KEY);
  } catch {
    return fromUrl;
  }
}
function clearToken() {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

type State =
  | { kind: 'loading' }
  | { kind: 'missing' }
  | { kind: 'error'; error: ApiError }
  | { kind: 'ready'; token: string; preview: Preview; me: MeResponse | null };

export default function AcceptInvitationPage() {
  const { locale } = useApp();
  const t = useT();
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [tick, setTick] = useState(0);
  const m = useMutation();

  useEffect(() => {
    const token = loadToken();
    if (!token) {
      setState({ kind: 'missing' });
      return;
    }
    void (async () => {
      const p = await api<Preview>('/invitations/preview', { method: 'POST', body: { token } });
      if (!p.ok) {
        if (p.messageKey === 'invitation.invalid') clearToken();
        setState({ kind: 'error', error: p });
        return;
      }
      const me = await api<MeResponse>('/me');
      if (!me.ok && me.status !== 401) {
        setState({ kind: 'error', error: me });
        return;
      }
      setState({ kind: 'ready', token, preview: p.data, me: me.ok ? me.data : null });
    })();
  }, [tick]);

  const here = `/${locale}/invitations/accept`;

  return (
    <PublicShell>
      <PageHeader title={t('invite.title')} />
      {state.kind === 'loading' ? <Skeleton /> : null}
      {state.kind === 'missing' ? <Alert kind="error">{t('auth.token_missing')}</Alert> : null}
      {state.kind === 'error' ? <ApiErrorAlert error={state.error} onRetry={() => setTick((n) => n + 1)} /> : null}
      {state.kind === 'ready'
        ? (() => {
            const { preview, me, token } = state;
            const kind = t(preview.workspace_kind === 'BUYER' ? 'kind.BUYER' : 'kind.SELLER');
            const role = t(`role.${preview.role}` as 'role.OWNER');
            return (
              <section className="card">
                <p>{t('invite.body', { kind, company: preview.company_display_name, role })}</p>
                <p className="muted">{t('invite.for_email', { email: preview.email })}</p>
                {preview.state !== 'PENDING' ? (
                  <Alert kind="warning">
                    {t('invite.not_pending', { state: t(`team.invite_state.${preview.state}` as 'team.invite_state.PENDING') })}
                  </Alert>
                ) : !me ? (
                  <>
                    <p>{t('invite.sign_in_first', { email: preview.email })}</p>
                    <div className="actions">
                      <Link className="btn btn-primary" href={`/${locale}/login?next=${encodeURIComponent(here)}`}>
                        {t('nav.sign_in')}
                      </Link>
                      <Link className="btn btn-secondary" href={`/${locale}/register?next=${encodeURIComponent(here)}`}>
                        {t('nav.register')}
                      </Link>
                    </div>
                  </>
                ) : me.user.email !== preview.email ? (
                  <Alert kind="warning">{t('invite.wrong_account', { current: me.user.email, email: preview.email })}</Alert>
                ) : !me.user.email_verified ? (
                  <Alert kind="warning">{t('auth.unverified_body', { email: me.user.email })}</Alert>
                ) : (
                  <>
                    {m.error ? <ApiErrorAlert error={m.error} /> : null}
                    <Button
                      type="button"
                      busy={m.busy}
                      onClick={async () => {
                        const r = await m.run<{ workspace_id: string }>('/invitations/accept', {
                          method: 'POST',
                          body: { token },
                        });
                        if (r.ok) {
                          clearToken();
                          try {
                            window.localStorage.setItem('selected-workspace', r.data.workspace_id);
                          } catch {
                            // ignore
                          }
                          router.replace(`/${locale}/app?joined=1`);
                        }
                      }}
                    >
                      {t('invite.accept')}
                    </Button>
                  </>
                )}
              </section>
            );
          })()
        : null}
    </PublicShell>
  );
}
