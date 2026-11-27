import type { AppEnv } from '@app/config';
import {
  EMAIL_TEMPLATES,
  enqueueEmail,
  todayUtc,
  toIsoDate,
  writeAudit,
  type EmailPayload,
  type PrismaClient,
} from '@app/db';
import nodemailer, { type Transporter } from 'nodemailer';
import type { Logger } from 'pino';
import { TEMPLATES } from './email-templates';

const MAX_ATTEMPTS = 8;

export interface Mailer {
  send(to: string, subject: string, text: string): Promise<void>;
}

/**
 * Email adapter. smtp-dev sends to the local Mailpit catcher (nothing leaves the machine).
 * live has no adapter in Phase 1 and refuses to start; disabled marks messages undeliverable.
 */
export function createMailer(env: AppEnv): Mailer | null {
  if (env.EMAIL_PROVIDER === 'live') {
    throw new Error(
      'EMAIL_PROVIDER=live has no adapter yet (provider not selected). Refusing to start.',
    );
  }
  if (env.EMAIL_PROVIDER !== 'smtp-dev' || !env.SMTP_URL) return null;
  const transport: Transporter = nodemailer.createTransport(env.SMTP_URL);
  const from = env.EMAIL_FROM ?? 'no-reply@marketplace.invalid';
  return {
    async send(to, subject, text) {
      await transport.sendMail({ from, to, subject: `[SANDBOX] ${subject}`, text });
    },
  };
}

function isEmailPayload(p: unknown): p is EmailPayload {
  if (!p || typeof p !== 'object') return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.to === 'string' &&
    (EMAIL_TEMPLATES as readonly string[]).includes(String(o.template)) &&
    (o.locale === 'en' || o.locale === 'ar') &&
    typeof o.vars === 'object'
  );
}

/**
 * Claims due outbox rows with FOR UPDATE SKIP LOCKED (safe with several workers),
 * delivers them, and records the outcome. Exponential backoff with jitter; dead-letter after
 * MAX_ATTEMPTS. Delivered payloads are redacted because they can contain one-time links.
 */
export async function dispatchOutbox(
  prisma: PrismaClient,
  mailer: Mailer | null,
  env: AppEnv,
  log: Logger,
  batch = 20,
): Promise<number> {
  let processed = 0;
  await prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<{ id: string }[]>`
      SELECT id FROM outbox
      WHERE state = 'PENDING' AND next_attempt_at <= now()
      ORDER BY next_attempt_at, created_at
      LIMIT ${batch}
      FOR UPDATE SKIP LOCKED`;
    for (const { id } of rows) {
      const row = await tx.outboxEvent.findUniqueOrThrow({ where: { id } });
      const attempts = row.attempts + 1;
      try {
        if (!row.eventType.startsWith('email.'))
          throw new Error(`unknown event type ${row.eventType}`);
        if (!isEmailPayload(row.payload)) throw new Error('malformed email payload');
        if (!mailer) {
          await tx.outboxEvent.update({
            where: { id },
            data: {
              state: 'DEAD',
              attempts,
              lastError: `EMAIL_PROVIDER=${env.EMAIL_PROVIDER}: not delivered`,
              processedAt: new Date(),
            },
          });
          continue;
        }
        const p = row.payload;
        const msg = TEMPLATES[p.template][p.locale](p.vars, env.APP_NAME);
        await mailer.send(p.to, msg.subject, msg.text);
        await tx.outboxEvent.update({
          where: { id },
          data: {
            state: 'DONE',
            attempts,
            processedAt: new Date(),
            lastError: null,
            payload: { redacted: true, template: p.template },
          },
        });
        processed++;
      } catch (err) {
        const dead = attempts >= MAX_ATTEMPTS;
        const delayMs = Math.min(2 ** attempts * 1000, 3600_000) * (0.5 + Math.random());
        await tx.outboxEvent.update({
          where: { id },
          data: {
            attempts,
            state: dead ? 'DEAD' : 'PENDING',
            lastError: (err as Error).message.slice(0, 500),
            nextAttemptAt: new Date(Date.now() + delayMs),
          },
        });
        log.warn(
          { outbox_id: id, attempts, dead, err: (err as Error).message },
          'outbox delivery failed',
        );
      }
    }
  });
  return processed;
}

/**
 * Licence expiry (A08, docs/09-workflows.md):
 * - 30 days before expiry: one reminder to owners per expiry date.
 * - After expiry: APPROVED companies become SUSPENDED (LICENCE_EXPIRED); workspaces RESTRICTED;
 *   owners notified; audit written. Existing records stay accessible; renewal re-enables trading.
 * Idempotent: safe to run repeatedly.
 */
export async function runLicenceExpiry(
  prisma: PrismaClient,
  env: AppEnv,
  now = new Date(),
): Promise<{ reminded: number; restricted: number }> {
  const today = todayUtc(now);
  const in30 = new Date(today.getTime() + 30 * 86400_000);
  let reminded = 0;
  let restricted = 0;

  const ownersOf = (companyId: string) =>
    prisma.membership.findMany({
      where: { role: 'OWNER', status: 'ACTIVE', workspace: { companyId } },
      include: { user: true },
    });

  const expiring = await prisma.company.findMany({
    where: { status: 'APPROVED', licenceExpiry: { gte: today, lte: in30 } },
    take: 500,
  });
  for (const c of expiring) {
    if (c.licenceReminderFor && c.licenceReminderFor.getTime() === c.licenceExpiry.getTime())
      continue;
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.company.updateMany({
        where: {
          id: c.id,
          OR: [{ licenceReminderFor: null }, { licenceReminderFor: { not: c.licenceExpiry } }],
        },
        data: { licenceReminderFor: c.licenceExpiry },
      });
      if (claimed.count === 0) return;
      const seen = new Set<string>();
      for (const o of await ownersOf(c.id)) {
        if (seen.has(o.userId)) continue;
        seen.add(o.userId);
        await enqueueEmail(tx, {
          template: 'licence_expiring',
          to: o.user.email,
          locale: o.user.locale,
          vars: { company: c.displayName, expiry: toIsoDate(c.licenceExpiry) },
        });
      }
      reminded++;
    });
  }

  const expired = await prisma.company.findMany({
    where: { status: 'APPROVED', licenceExpiry: { lt: today } },
    take: 500,
  });
  for (const c of expired) {
    await prisma.$transaction(async (tx) => {
      const res = await tx.company.updateMany({
        where: { id: c.id, status: 'APPROVED', licenceExpiry: { lt: today } },
        data: { status: 'SUSPENDED', suspensionKind: 'LICENCE_EXPIRED', version: { increment: 1 } },
      });
      if (res.count === 0) return;
      await tx.workspace.updateMany({ where: { companyId: c.id }, data: { status: 'RESTRICTED' } });
      const seen = new Set<string>();
      for (const o of await ownersOf(c.id)) {
        if (seen.has(o.userId)) continue;
        seen.add(o.userId);
        await enqueueEmail(tx, {
          template: 'licence_expired',
          to: o.user.email,
          locale: o.user.locale,
          vars: { company: c.displayName, expiry: toIsoDate(c.licenceExpiry) },
        });
      }
      await writeAudit(tx, {
        actorType: 'system',
        action: 'company.licence_expired_restricted',
        resourceType: 'company',
        resourceId: c.id,
        companyId: c.id,
        details: { licence_expiry: toIsoDate(c.licenceExpiry) },
      });
      restricted++;
    });
  }
  void env;
  return { reminded, restricted };
}
