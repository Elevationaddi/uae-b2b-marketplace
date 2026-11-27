'use client';
import type { AdminCapability, AdminRole } from '@app/contracts';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, Suspense, useContext, useEffect, useState, type ReactNode } from 'react';
import { api, type ApiError } from '@/lib/client';
import { useResource } from '@/lib/use-resource';
import { useApp, useT } from './app-context';
import { LocaleSwitch } from './locale-switch';
import { ApiErrorAlert, Button, Forbidden, Skeleton } from './ui';

export type AdminMe = {
  user: { id: string; email: string; full_name: string | null };
  roles: AdminRole[];
  capabilities: AdminCapability[];
  recovery_codes_remaining: number;
};

const AdminCtx = createContext<AdminMe | null>(null);
export function useAdmin(): AdminMe {
  const v = useContext(AdminCtx);
  if (!v) throw new Error('AdminShell missing');
  return v;
}

/**
 * Admin portal shell (separate origin, A03). A session that has not completed MFA is sent to
 * the MFA step; no admin data loads until the API confirms a fully authenticated admin session.
 */
export function AdminShell({ children, require }: { children: ReactNode; require?: AdminCapability }) {
  const { locale } = useApp();
  const router = useRouter();
  const { state, reload } = useResource<AdminMe>('/admin/me');

  useEffect(() => {
    if (state.status === 'error' && state.error.status === 401) {
      router.replace(
        state.error.messageKey === 'admin.mfa_required' ? `/${locale}/admin/mfa` : `/${locale}/admin/login`,
      );
    }
  }, [state, router, locale]);

  if (state.status === 'loading' || (state.status === 'error' && state.error.status === 401)) {
    return (
      <AdminFrame>
        <Skeleton />
      </AdminFrame>
    );
  }
  if (state.status === 'error') {
    return (
      <AdminFrame>{state.error.status === 403 ? <Forbidden /> : <ApiErrorAlert error={state.error} onRetry={reload} />}</AdminFrame>
    );
  }
  const me = state.data;
  return (
    <AdminCtx.Provider value={me}>
      <AdminFrame me={me}>{require && !me.capabilities.includes(require) ? <Forbidden /> : children}</AdminFrame>
    </AdminCtx.Provider>
  );
}

export function AdminFrame({ me, children }: { me?: AdminMe; children: ReactNode }) {
  const { locale, appName } = useApp();
  const t = useT();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [err, setErr] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);
  const caps = me?.capabilities ?? [];
  const base = `/${locale}/admin`;
  const nav = [
    { href: base, label: t('admin.nav.overview'), cap: 'admin.companies.read' },
    { href: `${base}/verification`, label: t('admin.nav.verification'), cap: 'admin.verification.review' },
    { href: `${base}/companies`, label: t('admin.nav.companies'), cap: 'admin.companies.read' },
    { href: `${base}/users`, label: t('admin.nav.users'), cap: 'admin.users.read' },
    { href: `${base}/audit`, label: t('admin.nav.audit'), cap: 'admin.audit.read' },
    { href: `${base}/staff`, label: t('admin.nav.staff'), cap: 'admin.staff.manage' },
  ].filter((n) => caps.includes(n.cap as AdminCapability));
  const isActive = (href: string) => (href === base ? pathname === href : pathname.startsWith(href));

  async function signOut() {
    setBusy(true);
    const r = await api('/admin/auth/logout', { method: 'POST' });
    setBusy(false);
    if (r.ok) router.replace(`${base}/login`);
    else setErr(r);
  }

  return (
    <div className="admin">
      <header className="site-header admin-header">
        <Link href={base} className="brand">
          {appName} · {t('app.admin_portal')}
        </Link>
        <div className="header-links">
          {me ? <span className="header-user">{me.user.email}</span> : null}
          <Suspense>
            <LocaleSwitch />
          </Suspense>
          {me ? (
            <Button type="button" variant="link" className="on-dark" onClick={signOut} busy={busy}>
              {t('nav.sign_out')}
            </Button>
          ) : null}
        </div>
      </header>
      {me && nav.length ? (
        <nav className="admin-nav" aria-label={t('nav.main')}>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isActive(n.href) ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
      ) : null}
      <main id="main" className="container container-wide">
        {err ? <ApiErrorAlert error={err} /> : null}
        {children}
      </main>
    </div>
  );
}
