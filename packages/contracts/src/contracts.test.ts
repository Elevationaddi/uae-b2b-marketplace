import { describe, expect, it } from 'vitest';
import {
  ERROR_CODES,
  HTTP_STATUS_FOR_ERROR,
  errorBodySchema,
  livenessSchema,
  successSchema,
} from './index';

describe('contracts', () => {
  it('maps every error code to the HTTP status defined in docs/07-api.md', () => {
    for (const code of ERROR_CODES) expect(HTTP_STATUS_FOR_ERROR[code]).toBeGreaterThanOrEqual(400);
    expect(HTTP_STATUS_FOR_ERROR.NOT_FOUND).toBe(404);
    expect(HTTP_STATUS_FOR_ERROR.CONFLICT).toBe(409);
    expect(HTTP_STATUS_FOR_ERROR.VALIDATION_FAILED).toBe(422);
  });

  it('validates the documented error envelope', () => {
    const ok = errorBodySchema.safeParse({
      error: { code: 'NOT_FOUND', message_key: 'common.not_found', request_id: 'r1' },
    });
    expect(ok.success).toBe(true);
    expect(
      errorBodySchema.safeParse({ error: { code: 'NOPE', message_key: 'x', request_id: 'r' } })
        .success,
    ).toBe(false);
  });

  it('wraps data in the documented success envelope', () => {
    const schema = successSchema(livenessSchema);
    const res = schema.safeParse({
      data: { status: 'ok', service: 'api', version: '0.0.0', time: new Date().toISOString() },
      meta: { next_cursor: null },
    });
    expect(res.success).toBe(true);
  });
});
