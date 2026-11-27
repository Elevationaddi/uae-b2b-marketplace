import { NextResponse, type NextRequest } from 'next/server';
import { hostOf, routeForHost } from './lib/hosts';

const WEB_ORIGIN = process.env.WEB_ORIGIN ?? 'http://localhost:3000';
const ADMIN_ORIGIN = process.env.ADMIN_ORIGIN ?? 'http://admin.localhost:3000';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const decision = routeForHost(host, req.nextUrl.pathname, hostOf(ADMIN_ORIGIN), hostOf(WEB_ORIGIN));
  if (decision.kind === 'not_found') {
    return new NextResponse('Not found', { status: 404, headers: { 'content-type': 'text/plain' } });
  }
  if (decision.kind === 'redirect') {
    return NextResponse.redirect(new URL(decision.location, ADMIN_ORIGIN));
  }
  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!_next/static|_next/image).*)'],
};
