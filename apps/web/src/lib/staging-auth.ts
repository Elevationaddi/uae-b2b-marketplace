import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * Staging protection (C-20): HTTP Basic credentials in front of every web and admin page when
 * APP_ENV=staging. API routes (`/api/…`) are exempt: they have their own session, CSRF and
 * permission checks, and provider webhooks and the scheduler must reach them.
 */
export function stagingProtected(env: Record<string, string | undefined>): boolean {
  return env.APP_ENV === 'staging';
}

const digest = (v: string) => createHash('sha256').update(v).digest();

/** Constant-time check of an `Authorization: Basic …` header. */
export function stagingAuthorized(
  header: string | null,
  user: string | undefined,
  password: string | undefined,
): boolean {
  // Fail closed: staging without a configured password lets nobody in (the API also refuses to
  // start without one).
  if (!password || !user || !header?.startsWith('Basic ')) return false;
  let given: string;
  try {
    given = Buffer.from(header.slice(6).trim(), 'base64').toString('utf8');
  } catch {
    return false;
  }
  return timingSafeEqual(digest(given), digest(`${user}:${password}`));
}

export function stagingExempt(pathname: string): boolean {
  return pathname.startsWith('/api/') || pathname === '/robots.txt';
}
