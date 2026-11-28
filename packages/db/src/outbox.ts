import type { Prisma } from '@prisma/client';
import type { Tx } from './audit';

export const EMAIL_TEMPLATES = [
  'verify_email',
  'account_exists',
  'password_reset',
  'password_changed',
  'invitation',
  'verification_submitted',
  'verification_decided',
  'licence_expiring',
  'licence_expired',
  'company_suspended',
  'company_reactivated',
  'catalog_decision',
  'listing_enforcement',
  'storefront_enforcement',
  /** Phase 3: RFQ, quote and message activity (summary + authenticated link only). */
  'activity',
] as const;
export type EmailTemplate = (typeof EMAIL_TEMPLATES)[number];

export interface EmailPayload {
  template: EmailTemplate;
  to: string;
  locale: 'en' | 'ar';
  /** Template variables. May contain one-time links; the payload is redacted after delivery. */
  vars: Record<string, string>;
}

/** Queue an email in the same transaction as the business change (transactional outbox). */
export async function enqueueEmail(
  tx: Tx,
  payload: EmailPayload,
  opts: { aggregateId?: string; dedupeKey?: string } = {},
): Promise<void> {
  const data = {
    eventType: `email.${payload.template}`,
    aggregateId: opts.aggregateId ?? null,
    payload: payload as unknown as Prisma.InputJsonValue,
    dedupeKey: opts.dedupeKey ?? null,
  };
  if (opts.dedupeKey) {
    await tx.outboxEvent.upsert({ where: { dedupeKey: opts.dedupeKey }, create: data, update: {} });
  } else {
    await tx.outboxEvent.create({ data });
  }
}
