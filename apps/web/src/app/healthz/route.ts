export const dynamic = 'force-dynamic';

/** Web liveness probe. Does not call the API so web and API health are independent. */
export function GET() {
  return Response.json(
    {
      data: { status: 'ok', service: 'web', version: '0.0.0', time: new Date().toISOString() },
      meta: { next_cursor: null },
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
