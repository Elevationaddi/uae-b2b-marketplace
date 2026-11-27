import type { AppEnv } from '@app/config';
import type { CookieOptions } from 'express';

export type CookieKind = 'company' | 'admin' | 'csrf';

/**
 * Cookie names. In production `__Host-` prefixed (Secure, Path=/, no Domain, so host-only):
 * the admin origin and the web origin can never see each other's cookies (A03).
 */
export function cookieName(env: AppEnv, kind: CookieKind): string {
  const base = kind === 'company' ? 'sid' : kind === 'admin' ? 'asid' : 'csrf';
  return env.isProduction ? `__Host-${base}` : base;
}

export function cookieOptions(env: AppEnv, kind: CookieKind, maxAgeMs?: number): CookieOptions {
  return {
    httpOnly: kind !== 'csrf', // the CSRF token must be readable by the page (double submit)
    secure: env.isProduction,
    sameSite: kind === 'admin' ? 'strict' : 'lax',
    path: '/',
    ...(maxAgeMs !== undefined ? { maxAge: maxAgeMs } : {}),
  };
}
