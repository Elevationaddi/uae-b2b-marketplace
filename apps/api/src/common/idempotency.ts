import { createHash } from 'node:crypto';
import { Prisma, type PrismaClient } from '@app/db';
import { ApiError } from './api-error';

const KEY = /^[A-Za-z0-9_.:-]{8,100}$/;

/**
 * Idempotency-Key handling for award, order and monetary POSTs (docs/07-api.md): the same key and
 * body replays the stored response; the same key with a different body or route is 409. Only
 * successful responses are stored, so a failed attempt can be retried with the same key.
 */
export async function withIdempotency<T>(
  prisma: PrismaClient,
  userId: string,
  rawKey: string | string[] | undefined,
  route: string,
  body: unknown,
  run: () => Promise<T>,
): Promise<T> {
  const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;
  if (!key || !KEY.test(key))
    throw new ApiError('VALIDATION_FAILED', 'common.idempotency_key_required', {
      'Idempotency-Key': 'required',
    });
  const requestHash = createHash('sha256')
    .update(JSON.stringify(body ?? null))
    .digest('hex');
  const prior = await prisma.idempotencyKey.findUnique({ where: { userId_key: { userId, key } } });
  if (prior) {
    if (prior.route !== route || prior.requestHash !== requestHash)
      throw new ApiError('CONFLICT', 'common.idempotency_key_reused');
    return prior.response as T;
  }
  const result = await run();
  try {
    await prisma.idempotencyKey.create({
      data: {
        userId,
        key,
        route,
        requestHash,
        statusCode: 200,
        response: JSON.parse(JSON.stringify(result)) as Prisma.InputJsonValue,
      },
    });
  } catch (err) {
    // A concurrent request with the same key finished first; its stored response wins.
    if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')) throw err;
  }
  return result;
}
