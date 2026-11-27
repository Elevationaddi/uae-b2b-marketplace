import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

const SAFE_ID = /^[A-Za-z0-9-]{8,64}$/;

/** Accept a well-formed inbound X-Request-Id (e.g. from a proxy), otherwise mint one. */
export function genRequestId(req: IncomingMessage, res: ServerResponse): string {
  const inbound = req.headers['x-request-id'];
  const id = typeof inbound === 'string' && SAFE_ID.test(inbound) ? inbound : randomUUID();
  res.setHeader('X-Request-Id', id);
  return id;
}
