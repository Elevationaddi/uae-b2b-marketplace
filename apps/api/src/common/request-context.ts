import type { Request } from 'express';

export interface RequestMeta {
  requestId: string;
  ip: string | null;
  userAgent: string | null;
}

export function requestMeta(req: Request): RequestMeta {
  return {
    requestId: String((req as Request & { id?: string }).id ?? ''),
    ip: req.ip ?? null,
    userAgent: (req.headers['user-agent'] ?? '').slice(0, 300) || null,
  };
}
