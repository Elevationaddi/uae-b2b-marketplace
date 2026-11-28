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
  const purchase = ws.capabilities.includes('buyer.purchase');
  const links: [string, MessageKey][] = [
    ...(purchase ? ([[`${base}/cart`, 'buyer.nav.cart']] as [string, MessageKey][]) : []),
    [`${base}/orders`, 'buyer.nav.orders'],
    [`${base}/disputes`, 'buyer.nav.disputes'],
    [`${base}/rfqs`, 'buyer.nav.rfqs'],
    ...(purchase ? ([[`${base}/rfqs/new`, 'buyer.nav.new_rfq']] as [string, MessageKey][]) : []),
    [`${base}/addresses`, 'buyer.nav.addresses'],
    ...(ws.role !== 'VIEWER'
      ? ([[`/${locale}/app/messages/${ws.id}`, 'nav.messages']] as [string, MessageKey][])
      : []),
    [`/${locale}`, 'mkt.title_short'],
  ];
  const active = (href: string) =>
    href === `${base}/rfqs`
      ? pathname === href || /\/rfqs\/[0-9a-f-]{36}/.test(pathname)
      : href === `${base}/orders`
        ? pathname === href || pathname.startsWith(`${href}/`) || pathname.includes('/checkouts/')
        : href === `${base}/disputes`
          ? pathname.startsWith(href)
          : pathname === href || (href === `${base}/cart` && pathname === `${base}/checkout`);
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
