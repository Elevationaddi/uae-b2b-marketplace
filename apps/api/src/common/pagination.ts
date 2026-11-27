import { ApiError } from './api-error';

/** Opaque cursor over (created_at, id) for stable ordering (docs/07-api.md). */
export interface Cursor {
  createdAt: Date;
  id: string;
}

export function encodeCursor(c: Cursor): string {
  return Buffer.from(JSON.stringify([c.createdAt.toISOString(), c.id])).toString('base64url');
}

export function decodeCursor(raw: string | undefined): Cursor | undefined {
  if (!raw) return undefined;
  try {
    const [ts, id] = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as [string, string];
    const createdAt = new Date(ts);
    if (Number.isNaN(createdAt.getTime()) || typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id))
      throw new Error();
    return { createdAt, id };
  } catch {
    throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', { cursor: 'invalid' });
  }
}

/** Prisma where-fragment for "older than cursor" in (created_at DESC, id DESC) order. */
export function beforeCursor(c: Cursor | undefined) {
  if (!c) return {};
  return {
    OR: [{ createdAt: { lt: c.createdAt } }, { createdAt: c.createdAt, id: { lt: c.id } }],
  };
}

export const NEWEST_FIRST = [{ createdAt: 'desc' as const }, { id: 'desc' as const }];

/** Given limit+1 rows, return the page and the next cursor. */
export function page<T extends { createdAt: Date; id: string }>(rows: T[], limit: number) {
  const items = rows.slice(0, limit);
  const last = items[items.length - 1];
  return { items, nextCursor: rows.length > limit && last ? encodeCursor(last) : null };
}
