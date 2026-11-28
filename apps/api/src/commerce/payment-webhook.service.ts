import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import {
  Prisma,
  SANDBOX_PROVIDER,
  verifyWebhook,
  webhookSecret,
  writeAudit,
  type PrismaClient,
} from '@app/db';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { ApiError } from '../common/api-error';
import type { RequestMeta } from '../common/request-context';
import { APP_ENV, PRISMA } from '../infra/tokens';

const eventSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9_.:-]{6,100}$/),
  type: z.string().max(60),
  created: z.string().max(40),
  data: z.object({
    session_id: z.string().max(100),
    reference: z.string().max(60),
    amount_fils: z.string().regex(/^\d{1,15}$/),
    currency: z.string().length(3),
    failure_code: z.string().max(60).optional(),
  }),
});

/**
 * Durable webhook inbox (docs/08-finance.md). The raw body is verified (HMAC-SHA256, constant
 * time, 5-minute window) before anything is trusted. Valid events are stored once per provider
 * event id (replays are no-ops, T15) and processed by the worker. Invalid signatures are stored
 * as QUARANTINED under a fresh id (so a forged event can never occupy a real event id) and
 * rejected with 400 (T16). Amount/currency/reference checks happen at processing time.
 */
@Injectable()
export class PaymentWebhookService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  async receive(
    provider: string,
    signature: string | undefined,
    raw: Buffer | undefined,
    meta: RequestMeta,
  ) {
    if (provider !== SANDBOX_PROVIDER || this.env.PAYMENT_MODE !== 'mock')
      throw new ApiError('NOT_FOUND', 'common.not_found');
    const body = raw ?? Buffer.alloc(0);
    const valid = verifyWebhook(webhookSecret(this.env), signature, body);
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(body.toString('utf8'));
    } catch {
      parsed = null;
    }
    if (!valid) {
      await this.prisma.$transaction(async (tx) => {
        const ev = await tx.paymentEvent.create({
          data: {
            provider,
            eventId: `invalid:${randomUUID()}`,
            type: 'invalid_signature',
            signatureValid: false,
            payload: { length: body.length, ip: meta.ip } as Prisma.InputJsonValue,
            status: 'QUARANTINED',
            error: 'invalid_signature',
            processedAt: new Date(),
          },
        });
        await tx.reconciliationCase.create({
          data: {
            kind: 'INVALID_SIGNATURE',
            paymentEventId: ev.id,
            details: { ip: meta.ip, request_id: meta.requestId } as Prisma.InputJsonValue,
          },
        });
        await writeAudit(tx, {
          actorType: 'anonymous',
          action: 'payment.webhook_rejected',
          resourceType: 'payment_event',
          resourceId: ev.id,
          details: { reason: 'invalid_signature' },
          requestId: meta.requestId,
          ip: meta.ip,
        });
      });
      throw new ApiError('VALIDATION_FAILED', 'payment.invalid_signature');
    }
    const ev = eventSchema.safeParse(parsed);
    if (!ev.success) throw new ApiError('VALIDATION_FAILED', 'payment.invalid_event');
    const e = ev.data;
    try {
      await this.prisma.paymentEvent.create({
        data: {
          provider,
          eventId: e.id,
          type: e.type,
          providerRef: e.data.session_id,
          amountFils: BigInt(e.data.amount_fils),
          currency: e.data.currency,
          signatureValid: true,
          payload: e as unknown as Prisma.InputJsonValue,
        },
      });
      return { received: true, duplicate: false };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002')
        return { received: true, duplicate: true };
      throw err;
    }
  }
}
