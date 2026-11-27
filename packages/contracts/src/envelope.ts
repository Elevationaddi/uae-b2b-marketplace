import { z } from 'zod';

/** Error codes shared by API and clients (docs/07-api.md). Extend per feature with tests. */
export const ERROR_CODES = [
  'BAD_REQUEST',
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'VALIDATION_FAILED',
  'RATE_LIMITED',
  'PROVIDER_UNAVAILABLE',
  'SERVICE_UNAVAILABLE',
  'INTERNAL_ERROR',
] as const;
export const errorCodeSchema = z.enum(ERROR_CODES);
export type ErrorCode = z.infer<typeof errorCodeSchema>;

export const HTTP_STATUS_FOR_ERROR: Record<ErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_FAILED: 422,
  RATE_LIMITED: 429,
  PROVIDER_UNAVAILABLE: 503,
  SERVICE_UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
};

export const errorBodySchema = z.object({
  error: z.object({
    code: errorCodeSchema,
    message_key: z.string(),
    field_errors: z.record(z.string(), z.string()).optional(),
    request_id: z.string(),
  }),
});
export type ErrorBody = z.infer<typeof errorBodySchema>;

export const metaSchema = z.object({ next_cursor: z.string().nullable() });

export function successSchema<T extends z.ZodTypeAny>(data: T) {
  return z.object({ data, meta: metaSchema });
}
