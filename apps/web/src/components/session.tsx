'use client';
import type { MeResponse } from '@app/contracts';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, Suspense, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '@/lib/client';
import { useMutation, useResource } from '@/lib/use-resource';
import { useApp, useT } from './app-context';
import { LocaleSwitch } from './locale-switch';
import { Alert, ApiErrorAlert, Button, Skeleton } from './ui';

export type Workspace = MeResponse['workspaces'][number];

type SessionValue = {
  me: MeResponse;
  reload: () => void;
  workspace: Workspace | null;
  selectWorkspace: (id: string) => void;
};

const SessionCtx = createContext<SessionValue | null>(null);

export function useSession(): SessionValue {
  const v = useContext(SessionCtx);
  if (!v) throw new Error('AppShell missing');
  return v;
}

const WS_KEY = 'selected-workspace';

function readStored(): string | null {
  try {
    return window.localStorage.getItem(WS_KEY);
  } catch {
    return null;
  }
}
function writeStored(id: string) {
  try {
    window.localStorage.setItem(WS_KEY, id);
  } catch {
    // storage unavailable: selection lasts for this page only
  }
}

/** Company-user shell: loads the session from the API; redirects to sign-in when there is none. */
export function AppShell({ children, allowUnverified = false }: { children: ReactNode; allowUnverified?: boolean }) {
  const { locale } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const { state, reload } = useResource<MeResponse>('/me');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => setSelected(readStored()), []);
  useEffect(() => {
    if (state.status === 'error' && state.error.status === 401) {
      router.replace(`/${locale}/login?next=${encodeURIComponent(pathname ?? `/${locale}/app`)}`);
    }
  }, [state, router, locale, pathname]);

  const selectWorkspace = useCallback((id: string) => {
    writeStored(id);
    setSelected(id);
  }, []);

  const value = useMemo<SessionValue | null>(() => {
    if (state.status !== 'ready') return null;
    const ws = state.data.workspaces;
    const workspace = ws.find((w) => w.id === selected) ?? ws[0] ?? null;
    return { me: state.data, reload, workspace, selectWorkspace };
  }, [state, selected, reload, selectWorkspace]);

  if (state.status === 'loading' || (state.status === 'error' && state.error.status === 401)) {
    return (
      <Frame>
        <Skeleton />
      </Frame>
    );
  }
  if (state.status === 'error') {
    return (
      <Frame>
        <ApiErrorAlert error={state.error} onRetry={reload} />
      </Frame>
    );
  }
  return (
    <SessionCtx.Provider value={value}>
      <Frame session={value!}>
        {value!.me.user.email_verified || allowUnverified ? children : <UnverifiedNotice email={value!.me.user.email} />}
      </Frame>
    </SessionCtx.Provider>
  );
}

function UnverifiedNotice({ email }: { email: string }) {
  const t = useT();
  const m = useMutation();
  const [sent, setSent] = useState(false);
  return (
    <section className="card">
      <h1>{t('auth.unverified_title')}</h1>
      <p>{t('auth.unverified_body', { email })}</p>
      {sent ? <Alert kind="success">{t('auth.resent')}</Alert> : null}
      {m.error ? <ApiErrorAlert error={m.error} /> : null}
      <Button
        type="button"
        variant="secondary"
        busy={m.busy}
        onClick={async () => {
          const r = await m.run('/auth/resend-verification', { method: 'POST', body: { email } });
          if (r.ok) setSent(true);
        }}
      >
        {t('auth.resend_verification')}
      </Button>
    </section>
  );
}

function Frame({ session, children }: { session?: SessionValue; children: ReactNode }) {
  const { locale, appName } = useApp();
  const t = useT();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [signOutError, setSignOutError] = useState<Awaited<ReturnType<typeof api>> | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const ws = session?.workspace ?? null;
  const verified = session?.me.user.email_verified ?? false;

  const nav = [
    { href: `/${locale}/app`, label: t('nav.home'), icon: '⌂', show: true },
    { href: ws ? `/${locale}/app/company/${ws.company.id}` : '', label: t('nav.company'), icon: '▣', show: !!ws && verified },
    { href: ws ? `/${locale}/app/team/${ws.id}` : '', label: t('nav.team'), icon: '◎', show: !!ws && verified },
    { href: `/${locale}/app/settings`, label: t('nav.settings'), icon: '⚙', show: !!session },
  ].filter((n) => n.show);

  const isActive = (href: string) =>
    href === `/${locale}/app` ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  async function signOut() {
    setSigningOut(true);
    const r = await api('/auth/logout', { method: 'POST' });
    setSigningOut(false);
    if (r.ok) router.replace(`/${locale}/login`);
    else setSignOutError(r);
  }

  return (
    <>
      <header className="site-header">
        <Link href={`/${locale}/app`} className="brand">
          {appName}
        </Link>
        {session ? (
          <nav className="desktop-nav" aria-label={t('nav.main')}>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <div className="header-links">
          {session && session.me.workspaces.length > 1 ? (
            <label className="ws-switch">
              <span className="sr-only">{t('nav.workspace')}</span>
              <select
                value={ws?.id ?? ''}
                onChange={(e) => session.selectWorkspace(e.target.value)}
                aria-label={t('nav.workspace')}
              >
                {session.me.workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.company.display_name} · {t(w.kind === 'BUYER' ? 'kind.BUYER' : 'kind.SELLER')}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <Suspense>
            <LocaleSwitch />
          </Suspense>
          {session ? (
            <Button type="button" variant="link" className="on-dark" onClick={signOut} busy={signingOut}>
              {t('nav.sign_out')}
            </Button>
          ) : null}
        </div>
      </header>
      {signOutError && !signOutError.ok ? (
        <div className="container">
          <ApiErrorAlert error={signOutError} />
        </div>
      ) : null}
      <main id="main" className="container with-bottom-nav">
        {children}
      </main>
      {session ? (
        <nav className="bottom-nav" aria-label={t('nav.main')}>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>
              <span aria-hidden="true">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>
      ) : null}
    </>
  );
}
