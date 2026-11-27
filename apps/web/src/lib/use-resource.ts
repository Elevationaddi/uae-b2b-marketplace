'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, type ApiError, type RequestOptions } from './client';

export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T; nextCursor: string | null }
  | { status: 'error'; error: ApiError };

/** GET a resource on mount and whenever path/query change. `null` path skips the request. */
export function useResource<T>(path: string | null, query?: RequestOptions['query']) {
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading' });
  const [tick, setTick] = useState(0);
  const key = path === null ? null : `${path}?${JSON.stringify(query ?? {})}`;
  const queryRef = useRef(query);
  queryRef.current = query;

  useEffect(() => {
    if (path === null) return;
    const ctrl = new AbortController();
    setState((s) => (s.status === 'ready' ? s : { status: 'loading' }));
    api<T>(path, { query: queryRef.current, signal: ctrl.signal })
      .then((r) => {
        if (ctrl.signal.aborted) return;
        setState(
          r.ok
            ? { status: 'ready', data: r.data, nextCursor: r.nextCursor }
            : { status: 'error', error: r },
        );
      })
      .catch(() => undefined);
    return () => ctrl.abort();
    // Re-run only when the request key or reload tick changes (query is read via ref).
  }, [key, tick]);

  const reload = useCallback(() => setTick((n) => n + 1), []);
  const setData = useCallback(
    (data: T) =>
      setState((s) => ({
        status: 'ready',
        data,
        nextCursor: s.status === 'ready' ? s.nextCursor : null,
      })),
    [],
  );
  return { state, reload, setData };
}

/** Cursor pagination with a "first page / next page" pattern. */
export function useCursor() {
  const [stack, setStack] = useState<string[]>([]);
  const cursor = stack[stack.length - 1];
  return {
    cursor,
    hasPrev: stack.length > 0,
    next: (c: string) => setStack((s) => [...s, c]),
    first: () => setStack([]),
  };
}

/** Submit helper: tracks busy/error for one mutation. */
export function useMutation() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const run = useCallback(async <T>(path: string, opts: RequestOptions) => {
    setBusy(true);
    setError(null);
    try {
      const r = await api<T>(path, opts);
      if (!r.ok) setError(r);
      return r;
    } finally {
      setBusy(false);
    }
  }, []);
  return { busy, error, setError, run };
}
