/**
 * Host routing for the separate admin origin (decision A03). One Next.js deployment serves two
 * hosts: the company web origin and the admin origin. Admin pages and the admin API are only
 * reachable on the admin host; company pages are not served there. Pure function so it can be
 * unit tested.
 */
export type HostDecision =
  | { kind: 'next' }
  | { kind: 'not_found' }
  | { kind: 'redirect'; location: string };

const LOCALE_RE = /^\/(en|ar)(\/|$)/;
const ADMIN_PAGE_RE = /^\/(en|ar)\/admin(\/|$)/;
const ADMIN_API_RE = /^\/api\/v1\/admin(\/|$)/;
/** Endpoints both hosts need: CSRF bootstrap and public configuration. */
const SHARED_API_RE = /^\/api\/v1\/(auth\/csrf|public\/config|health)(\/|$)/;

export function hostOf(origin: string): string {
  return new URL(origin).host.toLowerCase();
}

export function routeForHost(
  host: string,
  pathname: string,
  adminHost: string,
  webHost: string,
): HostDecision {
  const h = host.toLowerCase();
  const isAdminHost = h === adminHost;
  const isAsset =
    pathname.startsWith('/_next/') || pathname === '/favicon.ico' || pathname === '/healthz';
  if (isAsset) return { kind: 'next' };

  if (isAdminHost && adminHost !== webHost) {
    if (
      ADMIN_PAGE_RE.test(pathname) ||
      ADMIN_API_RE.test(pathname) ||
      SHARED_API_RE.test(pathname)
    ) {
      return { kind: 'next' };
    }
    const m = LOCALE_RE.exec(pathname);
    if (pathname === '/' || (m && pathname.replace(/\/$/, '') === `/${m[1]}`)) {
      return { kind: 'redirect', location: `/${m?.[1] ?? 'en'}/admin` };
    }
    return { kind: 'not_found' };
  }

  // Web host (or any other host): admin surface does not exist here.
  if (ADMIN_PAGE_RE.test(pathname) || ADMIN_API_RE.test(pathname)) return { kind: 'not_found' };
  return { kind: 'next' };
}
