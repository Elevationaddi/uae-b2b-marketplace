'use client';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { MessageKey } from '@/i18n/messages';
import { useApp, useT } from './app-context';
import { AppShell, useSession, type Workspace } from './session';
import { NotFound } from './ui';

function BuyerFrame({ children }: { children: (ws: Workspace, base: string) => ReactNode }) {
  const { locale } = useApp();
  const t = useT();
  const pathname = usePathname() ?? '';
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { me } = useSession();
  const ws = me.workspaces.find((w) => w.id === workspaceId && w.kind === 'BUYER');
  // Not a member of this buyer workspace: same response as a missing resource (no enumeration).
  if (!ws) return <NotFound backHref={`/${locale}/app`} />;
  const base = `/${locale}/app/buyer/${ws.id}`;
  const links: [string, MessageKey][] = [
    [`${base}/rfqs`, 'buyer.nav.rfqs'],
    ...(ws.capabilities.includes('buyer.purchase')
      ? ([[`${base}/rfqs/new`, 'buyer.nav.new_rfq']] as [string, MessageKey][])
      : []),
    ...(ws.role !== 'VIEWER'
      ? ([[`/${locale}/app/messages/${ws.id}`, 'nav.messages']] as [string, MessageKey][])
      : []),
    [`/${locale}`, 'mkt.title_short'],
  ];
  const later: MessageKey[] = ['buyer.nav.cart', 'buyer.nav.orders'];
  const active = (href: string) =>
    href === `${base}/rfqs`
      ? pathname === href || /\/rfqs\/[0-9a-f-]{36}/.test(pathname)
      : pathname === href;
  return (
    <div className="seller-layout">
      <nav className="seller-nav" aria-label={t('buyer.title')}>
        <p className="seller-nav-company">{ws.company.display_name}</p>
        <ul>
          {links.map(([href, k]) => (
            <li key={href}>
              <Link href={href} aria-current={active(href) ? 'page' : undefined}>
                {t(k)}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`/${locale}/app/company/${ws.company.id}`}>{t('seller.nav.company')}</Link>
          </li>
        </ul>
        <ul className="seller-nav-later" aria-label={t('seller.later_phase')}>
          {later.map((k) => (
            <li key={k}>
              <span aria-disabled="true" className="disabled-link">
                {t(k)}
                <span className="muted small"> · {t('seller.later_phase')}</span>
              </span>
            </li>
          ))}
        </ul>
      </nav>
      <div className="seller-main">{children(ws, base)}</div>
    </div>
  );
}

/** Buyer workspace: company shell plus buyer sub-navigation. Permissions are enforced by the API. */
export function BuyerShell({ children }: { children: (ws: Workspace, base: string) => ReactNode }) {
  return (
    <AppShell>
      <BuyerFrame>{children}</BuyerFrame>
    </AppShell>
  );
}

export const buyerApi = (ws: Workspace) => `/buyer/workspaces/${ws.id}`;
