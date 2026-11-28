import type { IncomingMessage, ServerResponse } from 'node:http';
import { parseEnv } from '@app/config';
import { createApp } from './bootstrap';

/**
 * Vercel Function entry for the API (C-21 / Phase 8B; not deployed: deployment needs founder
 * approval). The Nest application is built once per function instance and reused across
 * requests. The API keeps no state in memory between requests (sessions, rate limits,
 * idempotency keys and the outbox live in PostgreSQL), so any instance can serve any request.
 * The environment is validated exactly as for `main.ts`: staging and production refuse to start
 * with an unsafe configuration.
 */
type Handler = (req: IncomingMessage, res: ServerResponse) => void;
let ready: Promise<Handler> | null = null;

function handler(): Promise<Handler> {
  ready ??= (async () => {
    const env = parseEnv(process.env);
    const app = await createApp(env, { bufferLogs: false });
    return app.getHttpAdapter().getInstance() as Handler;
  })().catch((err: unknown) => {
    ready = null; // let the next request retry a failed cold start
    throw err;
  });
  return ready;
}

export default async function vercelApi(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    (await handler())(req, res);
  } catch (err) {
    // Configuration errors list only variable names and rules, never values.
    console.error('[api] cold start failed', (err as Error).message);
    res.statusCode = 503;
    res.setHeader('content-type', 'application/json');
    res.end(
      JSON.stringify({
        error: { code: 'SERVICE_UNAVAILABLE', message_key: 'common.unavailable', field_errors: {} },
      }),
    );
  }
}
