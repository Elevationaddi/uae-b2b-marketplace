import { readinessSchema, successSchema, type Readiness } from '@app/contracts';

export type ReadinessResult =
  | { kind: 'ok'; readiness: Readiness }
  | { kind: 'unreachable'; requestId: string | null };

/** Server-side fetch of API readiness. Never fabricates a status when the API is unreachable. */
export async function fetchReadiness(): Promise<ReadinessResult> {
  const base = process.env.API_INTERNAL_ORIGIN ?? process.env.API_ORIGIN ?? 'http://localhost:4000';
  try {
    const res = await fetch(`${base}/api/v1/health/ready`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3_000),
    });
    const parsed = successSchema(readinessSchema).safeParse(await res.json());
    if (!parsed.success) return { kind: 'unreachable', requestId: res.headers.get('x-request-id') };
    return { kind: 'ok', readiness: parsed.data.data };
  } catch {
    return { kind: 'unreachable', requestId: null };
  }
}
