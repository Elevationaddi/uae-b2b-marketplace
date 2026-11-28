/** @type {import('next').NextConfig} */
// The Content-Security-Policy is set per request in src/middleware.ts with a fresh script nonce
// (SR-2, src/lib/csp.ts). The headers below are static.
const isDev = process.env.NODE_ENV !== 'production';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  // Production is served over TLS only; browsers ignore HSTS on plain-HTTP local runs.
  ...(isDev
    ? []
    : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]),
];

/**
 * The browser only ever talks to the web origin. /api/v1/* is proxied to the API so that
 * session cookies stay first-party and host-only (A03). The destination is resolved when the
 * app is built, so API_INTERNAL_ORIGIN must be set at build time in deployed environments.
 */
const apiOrigin = (
  process.env.API_INTERNAL_ORIGIN ??
  process.env.API_ORIGIN ??
  'http://localhost:4000'
).replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@app/contracts'],
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Authenticated pages and API responses must never be cached by shared caches.
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }];
  },
  async rewrites() {
    return [{ source: '/api/v1/:path*', destination: `${apiOrigin}/api/v1/:path*` }];
  },
};

export default nextConfig;
