'use client';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { MessageKey } from '@/i18n/messages';
import { useApp, useT } from './app-context';
import { AppShell, useSession, type Workspace } from './session';
import { NotFound } from './ui';

function SellerFrame({ children }: { children: (ws: Workspace, base: string) => ReactNode }) {
  const { locale } = useApp();
  const t = useT();
  const pathname = usePathname() ?? '';
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { me } = useSession();
  const ws = me.workspaces.find((w) => w.id === workspaceId && w.kind === 'SELLER');
  // Not a member of this seller workspace: same response as a missing resource (no enumeration).
  if (!ws) return <NotFound backHref={`/${locale}/app`} />;
  const base = `/${locale}/app/seller/${ws.id}`;
  const links: [string, MessageKey][] = [
    [base, 'seller.nav.overview'],
    [`${base}/storefront`, 'seller.nav.storefront'],
    [`${base}/products`, 'seller.nav.products'],
    [`${base}/products/new`, 'seller.nav.add_product'],
    [`${base}/inventory`, 'seller.nav.inventory'],
    [`${base}/pricing`, 'seller.nav.pricing'],
    [`${base}/rfqs`, 'seller.nav.rfqs'],
    [`${base}/quotes`, 'seller.nav.quotes'],
    [`/${locale}/app/messages/${ws.id}`, 'seller.nav.messages'],
  ];
  const later: MessageKey[] = ['seller.nav.orders', 'seller.nav.finance'];
  const active = (href: string) =>
    href === base || href === `${base}/products`
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <div className="seller-layout">
      <nav className="seller-nav" aria-label={t('seller.title')}>
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

/** Seller centre: company shell plus the seller sub-navigation. Permissions are enforced by the API. */
export function SellerShell({
  children,
}: {
  children: (ws: Workspace, base: string) => ReactNode;
}) {
  return (
    <AppShell>
      <SellerFrame>{children}</SellerFrame>
    </AppShell>
  );
}

/** The workspace API base for seller calls. */
export const sellerApi = (ws: Workspace) => `/seller/workspaces/${ws.id}`;
