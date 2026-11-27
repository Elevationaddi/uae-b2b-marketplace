import { describe, expect, it } from 'vitest';
import { routeForHost } from './hosts';

const ADMIN = 'admin.localhost:3000';
const WEB = 'localhost:3000';

describe('host routing (A03)', () => {
  it('serves admin pages and admin API only on the admin host', () => {
    expect(routeForHost(ADMIN, '/en/admin', ADMIN, WEB).kind).toBe('next');
    expect(routeForHost(ADMIN, '/ar/admin/verification', ADMIN, WEB).kind).toBe('next');
    expect(routeForHost(ADMIN, '/api/v1/admin/me', ADMIN, WEB).kind).toBe('next');
    expect(routeForHost(WEB, '/en/admin', ADMIN, WEB).kind).toBe('not_found');
    expect(routeForHost(WEB, '/api/v1/admin/auth/login', ADMIN, WEB).kind).toBe('not_found');
  });

  it('does not serve company pages or company API on the admin host', () => {
    expect(routeForHost(ADMIN, '/en/app', ADMIN, WEB).kind).toBe('not_found');
    expect(routeForHost(ADMIN, '/en/login', ADMIN, WEB).kind).toBe('not_found');
    expect(routeForHost(ADMIN, '/api/v1/me', ADMIN, WEB).kind).toBe('not_found');
    expect(routeForHost(ADMIN, '/api/v1/auth/login', ADMIN, WEB).kind).toBe('not_found');
  });

  it('allows shared endpoints and assets on the admin host and redirects its root', () => {
    expect(routeForHost(ADMIN, '/api/v1/auth/csrf', ADMIN, WEB).kind).toBe('next');
    expect(routeForHost(ADMIN, '/_next/static/x.js', ADMIN, WEB).kind).toBe('next');
    expect(routeForHost(ADMIN, '/en', ADMIN, WEB)).toEqual({
      kind: 'redirect',
      location: '/en/admin',
    });
    expect(routeForHost(ADMIN, '/ar/', ADMIN, WEB)).toEqual({
      kind: 'redirect',
      location: '/ar/admin',
    });
  });

  it('host comparison is case-insensitive and other hosts behave like the web host', () => {
    expect(routeForHost('ADMIN.localhost:3000', '/en/admin', ADMIN, WEB).kind).toBe('next');
    expect(routeForHost('127.0.0.1:3000', '/en/admin', ADMIN, WEB).kind).toBe('not_found');
  });
});
