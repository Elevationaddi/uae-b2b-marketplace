'use client';
/**
 * Browser API client. All calls go to the same origin (/api/v1, proxied to the API) with
 * cookies. State-changing calls carry the double-submit CSRF token (docs/10-security.md).
 * Never fabricates success: every failure is returned as a typed error for the UI to show.
 */

export type ApiError = {
  ok: false;
  status: number;
  code: string;
  messageKey: string;
  fieldErrors: Record<string, string>;
  requestId: string | null;
};
export type ApiSuccess<T> = { ok: true; status: number; data: T; nextCursor: string | null };
export type ApiResult<T> = ApiSuccess<T> | ApiError;

const NETWORK_ERROR: Omit<ApiError, 'requestId'> = {
  ok: false,
  status: 0,
  code: 'NETWORK',
  messageKey: 'common.network',
  fieldErrors: {},
};

function readCookie(name: string): string | null {
  for (const part of document.cookie.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

let csrfInFlight: Promise<string | null> | null = null;

async function fetchCsrf(): Promise<string | null> {
  csrfInFlight ??= fetch('/api/v1/auth/csrf', { credentials: 'same-origin', cache: 'no-store' })
    .then(async (r) =>
      r.ok ? ((await r.json()) as { data: { csrf_token: string } }).data.csrf_token : null,
    )
    .catch(() => null)
    .finally(() => {
      csrfInFlight = null;
    });
  return csrfInFlight;
}

async function csrfToken(forceRefresh: boolean): Promise<string | null> {
  if (!forceRefresh) {
    const existing = readCookie('__Host-csrf') ?? readCookie('csrf');
    if (existing) return existing;
  }
  return fetchCsrf();
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  form?: FormData;
  query?: Record<string, string | number | undefined | null>;
  signal?: AbortSignal;
};

function withQuery(path: string, query: RequestOptions['query']): string {
  if (!query) return path;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query))
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  const s = qs.toString();
  return s ? `${path}?${s}` : path;
}

async function send<T>(
  path: string,
  opts: RequestOptions,
  retried: boolean,
): Promise<ApiResult<T>> {
  const method = opts.method ?? 'GET';
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (method !== 'GET') {
    const token = await csrfToken(retried);
    if (token) headers['X-CSRF-Token'] = token;
  }
  let body: BodyInit | undefined;
  if (opts.form) body = opts.form;
  else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }
  let res: Response;
  try {
    res = await fetch(`/api/v1${withQuery(path, opts.query)}`, {
      method,
      headers,
      body,
      credentials: 'same-origin',
      cache: 'no-store',
      signal: opts.signal,
    });
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e;
    return { ...NETWORK_ERROR, requestId: null };
  }
  const requestId = res.headers.get('x-request-id');
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  if (res.ok && json && typeof json === 'object' && 'data' in json) {
    const j = json as { data: T; meta?: { next_cursor?: string | null } };
    return { ok: true, status: res.status, data: j.data, nextCursor: j.meta?.next_cursor ?? null };
  }
  const err = (
    json as {
      error?: {
        code?: string;
        message_key?: string;
        field_errors?: Record<string, string>;
        request_id?: string;
      };
    } | null
  )?.error;
  const result: ApiError = {
    ok: false,
    status: res.status,
    code: err?.code ?? (res.status === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR'),
    messageKey:
      err?.message_key ?? (res.status === 404 ? 'common.not_found' : 'common.internal_error'),
    fieldErrors: err?.field_errors ?? {},
    requestId: err?.request_id ?? requestId,
  };
  // A stale or missing CSRF cookie: refresh once and retry the same request.
  if (!retried && result.messageKey === 'common.csrf_token') return send<T>(path, opts, true);
  return result;
}

export function api<T>(path: string, opts: RequestOptions = {}): Promise<ApiResult<T>> {
  return send<T>(path, opts, false);
}
