import type { AppEnv } from '@app/config';
import {
  EMAIL_TEMPLATES,
  enqueueEmail,
  SANDBOX_PROVIDER,
  signWebhook,
  WEBHOOK_SIGNATURE_HEADER,
  webhookSecret,
  type PspEvent,
  todayUtc,
  toIsoDate,
  writeAudit,
  type EmailPayload,
  type Prisma,
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

export type RetentionReport = {
  rejected_cases: number;
  rejected_documents: number;
  abandoned_cases: number;
  abandoned_documents: number;
  /** Company closure does not exist yet; reported as zero until account closure is built. */
  closed_company_documents: number;
  cutoffs: { rejected: string; abandoned: string; closed: string };
  deletion_enabled: false;
};

/**
 * Report-only retention run (A13). Counts verification documents that the provisional schedule
 * would make eligible for deletion and records the counts in the audit log. Nothing is deleted:
 * deletion stays disabled until the policy is legally approved (env refuses to enable it).
 */
export async function runRetentionReport(
  prisma: PrismaClient,
  env: AppEnv,
  now = new Date(),
): Promise<RetentionReport> {
  const day = 86400_000;
  const rejectedCutoff = new Date(now.getTime() - env.RETENTION_REJECTED_DOCS_DAYS * day);
  const abandonedCutoff = new Date(now.getTime() - env.RETENTION_ABANDONED_APPLICATION_DAYS * day);
  const closedCutoff = new Date(now.getTime() - env.RETENTION_CLOSED_COMPANY_DAYS * day);
  const rejectedWhere = { state: 'REJECTED' as const, decidedAt: { lt: rejectedCutoff } };
  const abandonedWhere = {
    state: { in: ['DRAFT' as const, 'NEEDS_INFO' as const] },
    updatedAt: { lt: abandonedCutoff },
  };
  const [rejectedCases, rejectedDocs, abandonedCases, abandonedDocs] = await Promise.all([
    prisma.verificationCase.count({ where: rejectedWhere }),
    prisma.verificationDocument.count({ where: { case: rejectedWhere } }),
    prisma.verificationCase.count({ where: abandonedWhere }),
    prisma.verificationDocument.count({ where: { case: abandonedWhere } }),
  ]);
  const report: RetentionReport = {
    rejected_cases: rejectedCases,
    rejected_documents: rejectedDocs,
    abandoned_cases: abandonedCases,
    abandoned_documents: abandonedDocs,
    closed_company_documents: 0,
    cutoffs: {
      rejected: rejectedCutoff.toISOString(),
      abandoned: abandonedCutoff.toISOString(),
      closed: closedCutoff.toISOString(),
    },
    deletion_enabled: false,
  };
  await writeAudit(prisma, {
    actorType: 'system',
    action: 'retention.report',
    resourceType: 'retention',
    details: report,
  });
  return report;
}

export type RfqExpiryResult = {
  quotes_expired: number;
  rfqs_expired: number;
  idempotency_purged: number;
};

async function actingUsers(
  tx: Prisma.TransactionClient,
  workspaceId: string,
  roles: ('OWNER' | 'PROCUREMENT' | 'SALES')[],
): Promise<string[]> {
  const rows = await tx.membership.findMany({
    where: { workspaceId, status: 'ACTIVE', role: { in: roles }, user: { status: 'ACTIVE' } },
    select: { userId: true },
  });
  return [...new Set(rows.map((r) => r.userId))];
}

/**
 * RFQ and quote expiry (docs/09-workflows.md, docs/11-integrations.md; every minute):
 * - a submitted quote whose validity has passed becomes EXPIRED (version too);
 * - an OPEN RFQ past its deadline with no submitted, still-valid quote becomes EXPIRED. An RFQ
 *   with valid quotes stays open for award until the last of them expires.
 * Each item is handled in its own transaction under the RFQ row lock, so it never races an award.
 * Also purges Idempotency-Key records older than 24 hours.
 */
export async function runRfqExpiry(
  prisma: PrismaClient,
  now = new Date(),
): Promise<RfqExpiryResult> {
  let quotesExpired = 0;
  let rfqsExpired = 0;
  const dueQuotes = await prisma.quote.findMany({
    where: { state: 'SUBMITTED', currentVersion: { validUntil: { lte: now } } },
    select: { id: true },
    take: 500,
  });
  for (const { id } of dueQuotes) {
    const done = await prisma.$transaction(async (tx) => {
      const q = await tx.quote.findUniqueOrThrow({
        where: { id },
        include: { rfq: true, currentVersion: true },
      });
      await tx.$queryRaw`SELECT id FROM rfqs WHERE id = ${q.rfqId}::uuid FOR UPDATE`;
      const cur = await tx.quote.findUniqueOrThrow({
        where: { id },
        include: { currentVersion: true },
      });
      if (cur.state !== 'SUBMITTED' || !cur.currentVersion || cur.currentVersion.validUntil > now)
        return false;
      await tx.quote.update({
        where: { id },
        data: { state: 'EXPIRED', version: { increment: 1 } },
      });
      await tx.quoteVersion.update({
        where: { id: cur.currentVersion.id },
        data: { state: 'EXPIRED' },
      });
      await tx.rfqEvent.create({
        data: {
          rfqId: q.rfqId,
          quoteId: id,
          quoteVersionId: cur.currentVersion.id,
          kind: 'quote.expired',
          actorSide: 'SYSTEM',
        },
      });
      const payload = { rfq_id: q.rfqId, rfq_number: q.rfq.number, quote_id: id };
      // Each side gets a link to its own view of the RFQ.
      const sides: [string[], string][] = [
        [
          await actingUsers(tx, q.rfq.buyerWorkspaceId, ['OWNER', 'PROCUREMENT']),
          `/app/buyer/${q.rfq.buyerWorkspaceId}/rfqs/${q.rfqId}`,
        ],
        [
          await actingUsers(tx, q.sellerWorkspaceId, ['OWNER', 'SALES']),
          `/app/seller/${q.sellerWorkspaceId}/rfqs/${q.rfqId}`,
        ],
      ];
      for (const [users, path] of sides)
        if (users.length)
          await tx.notification.createMany({
            data: users.map((userId) => ({
              userId,
              type: 'quote.expired',
              payload: { ...payload, path },
            })),
          });
      return true;
    });
    if (done) quotesExpired++;
  }

  const dueRfqs = await prisma.rfq.findMany({
    where: {
      state: 'OPEN',
      deadline: { lte: now },
      quotes: { none: { state: 'SUBMITTED', currentVersion: { validUntil: { gt: now } } } },
    },
    select: { id: true },
    take: 500,
  });
  for (const { id } of dueRfqs) {
    const done = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM rfqs WHERE id = ${id}::uuid FOR UPDATE`;
      const r = await tx.rfq.findUniqueOrThrow({ where: { id } });
      const live = await tx.quote.count({
        where: { rfqId: id, state: 'SUBMITTED', currentVersion: { validUntil: { gt: now } } },
      });
      if (r.state !== 'OPEN' || r.deadline > now || live > 0) return false;
      await tx.rfq.update({
        where: { id },
        data: { state: 'EXPIRED', closedAt: now, version: { increment: 1 } },
      });
      await tx.rfqEvent.create({ data: { rfqId: id, kind: 'rfq.expired', actorSide: 'SYSTEM' } });
      const users = await actingUsers(tx, r.buyerWorkspaceId, ['OWNER', 'PROCUREMENT']);
      if (users.length)
        await tx.notification.createMany({
          data: users.map((userId) => ({
            userId,
            type: 'rfq.expired',
            payload: {
              rfq_id: id,
              rfq_number: r.number,
              title: r.title,
              path: `/app/buyer/${r.buyerWorkspaceId}/rfqs/${id}`,
            },
          })),
        });
      return true;
    });
    if (done) rfqsExpired++;
  }

  const purged = await prisma.idempotencyKey.deleteMany({
    where: { createdAt: { lt: new Date(now.getTime() - 24 * 3600_000) } },
  });
  return {
    quotes_expired: quotesExpired,
    rfqs_expired: rfqsExpired,
    idempotency_purged: purged.count,
  };
}

/**
 * Sandbox only (PAYMENT_MODE=mock): post queued sandbox PSP events to the API webhook endpoint,
 * signed exactly like a provider would, so the real intake path is exercised. Delivery is
 * at-least-once; the API's unique event id makes repeats harmless (T15).
 */
export async function deliverSandboxWebhooks(
  prisma: PrismaClient,
  env: AppEnv,
  log: Logger,
): Promise<number> {
  if (env.PAYMENT_MODE !== 'mock' || env.isProduction) return 0;
  const secret = webhookSecret(env);
  const post = async (events: PspEvent[]): Promise<{ sent: number; remaining: PspEvent[] }> => {
    const remaining: PspEvent[] = [];
    let sent = 0;
    for (const e of events) {
      const body = JSON.stringify(e);
      try {
        const res = await fetch(`${env.API_ORIGIN}/api/v1/payments/webhooks/${SANDBOX_PROVIDER}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            [WEBHOOK_SIGNATURE_HEADER]: signWebhook(secret, body),
          },
          body,
        });
        if (res.ok) sent++;
        else {
          log.warn({ status: res.status, event: e.id }, 'sandbox webhook rejected');
          remaining.push(e);
        }
      } catch (err) {
        log.warn({ err: (err as Error).message, event: e.id }, 'sandbox webhook delivery failed');
        remaining.push(e);
      }
    }
    return { sent, remaining };
  };
  const asEvents = (v: Prisma.JsonValue) => (Array.isArray(v) ? v : []) as unknown as PspEvent[];
  let delivered = 0;
  const sessions = await prisma.mockPspSession.findMany({
    where: { NOT: { outbox: { equals: [] } } },
    take: 20,
    orderBy: { updatedAt: 'asc' },
  });
  for (const s of sessions) {
    const r = await post(asEvents(s.outbox));
    delivered += r.sent;
    await prisma.mockPspSession.update({
      where: { id: s.id },
      data: { outbox: r.remaining as unknown as Prisma.InputJsonValue },
    });
  }
  // Refund and payout operations (Phase 5) use the same signed webhook path.
  const ops = await prisma.mockPspOperation.findMany({
    where: { NOT: { outbox: { equals: [] } } },
    take: 20,
    orderBy: { updatedAt: 'asc' },
  });
  for (const o of ops) {
    const r = await post(asEvents(o.outbox));
    delivered += r.sent;
    await prisma.mockPspOperation.update({
      where: { id: o.id },
      data: { outbox: r.remaining as unknown as Prisma.InputJsonValue },
    });
  }
  return delivered;
}
