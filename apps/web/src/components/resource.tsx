'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ResourceState } from '@/lib/use-resource';
import { useApp, useT } from './app-context';
import { ApiErrorAlert, Forbidden, NotFound, Skeleton } from './ui';

/**
 * Renders the loading / error / forbidden / not-found / signed-out states for a resource
 * (CLAUDE.md: every screen has these states) and the content once ready.
 */
export function Resource<T>({
  state,
  reload,
  children,
  backHref,
  lines,
  loginHref,
}: {
  state: ResourceState<T>;
  reload: () => void;
  children: (data: T, nextCursor: string | null) => ReactNode;
  backHref?: string;
  lines?: number;
  loginHref?: string;
}) {
  const t = useT();
  const { locale } = useApp();
  if (state.status === 'loading') return <Skeleton lines={lines} />;
  if (state.status === 'error') {
    const e = state.error;
    if (e.status === 403) return <Forbidden />;
    if (e.status === 404) return <NotFound backHref={backHref} />;
    if (e.status === 401)
      return (
        <div className="empty" role="alert">
          <p>{t('error.auth.unauthenticated')}</p>
          <Link className="btn btn-primary" href={loginHref ?? `/${locale}/login`}>
            {t('nav.sign_in')}
          </Link>
        </div>
      );
    return <ApiErrorAlert error={e} onRetry={reload} />;
  }
  return <>{children(state.data, state.nextCursor)}</>;
}
