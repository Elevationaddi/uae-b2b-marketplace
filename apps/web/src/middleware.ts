import { NextResponse, type NextRequest } from 'next/server';
import { buildCsp, createNonce } from './lib/csp';
import { hostOf, routeForHost } from './lib/hosts';

const WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:3000';
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN ?? 'http://admin.localhost:3000';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const decision = routeForHost(
    host,
    req.nextUrl.pathname,
    hostOf(ADMIN_ORIGIN),
    hostOf(WEB_ORIGIN),
  );
  if (decision.kind === 'not_found') {
    return new NextResponse('Not found', {
      status: 404,
      headers: { 'content-type': 'text/plain' },
    });
  }
  if (decision.kind === 'redirect') {
    return NextResponse.redirect(new URL(decision.location, ADMIN_ORIGIN));
  }
  // SR-2: per-response nonce. Next.js reads it from the request's CSP header for its own scripts.
  const nonce = createNonce();
  const csp = buildCsp(nonce, process.env.NODE_ENV !== 'production');
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', csp);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set('content-security-policy', csp);
  return res;
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!_next/static|_next/image).*)'],
};
