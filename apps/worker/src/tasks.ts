import type { AppEnv } from '@app/config';
import {
  createSandboxPsp,
  expireCheckouts,
  expireExports,
  pingDatabase,
  processPendingPaymentEvents,
  autoCloseResolvedTickets,
  runSettlementSweep,
  submitApprovedSettlements,
  type PrismaClient,
  type TaskDef,
} from '@app/db';
import type { Logger } from 'pino';
import {
  createMailer,
  deliverSandboxWebhooks,
  dispatchOutbox,
  runLicenceExpiry,
  runRetentionReport,
  runRfqExpiry,
} from './jobs';

/**
 * Background tasks (docs/11-integrations.md), run by the PostgreSQL scheduler
 * (`@app/db` background-tasks): by the long-running worker loop or by a scheduled function.
 *
 * - system.heartbeat: proves the scheduler loop and DB connectivity (readiness).
 * - outbox.dispatch: delivers transactional emails from the outbox table.
 * - licence.expiry: licence reminders and expiry restriction (idempotent).
 * - retention.report: report-only count of documents past the provisional retention schedule
 *   (A13); writes an audit event, deletes nothing.
 * - rfq.expiry: expires lapsed quotes and RFQs past their deadline.
 * - payments.process: processes stored, verified PSP webhook events exactly once.
 * - checkout.expiry: asks the provider, then releases stock of unpaid checkouts past pay_by (T17).
 * - settlement.submit: sends dual-approved refunds and payouts to the provider adapter
 *   (idempotency key per refund/payout, so a retry never pays twice).
 * - settlement.sweep: auto-completion and payout eligibility (C-01, C-03).
 * - export.cleanup: deletes the bytes of report exports past their 24 h retention.
 * - support.auto_close: closes resolved tickets after 7 days without a customer response (C-16).
 * - sandbox.webhooks: PAYMENT_MODE=mock only; posts signed sandbox PSP events to the API.
 */
export const TASK = {
  heartbeat: 'system.heartbeat',
  outbox: 'outbox.dispatch',
  licence: 'licence.expiry',
  retention: 'retention.report',
  rfqExpiry: 'rfq.expiry',
  payments: 'payments.process',
  checkoutExpiry: 'checkout.expiry',
  settlementSubmit: 'settlement.submit',
  settlementSweep: 'settlement.sweep',
  exportCleanup: 'export.cleanup',
  supportAutoClose: 'support.auto_close',
  sandboxWebhooks: 'sandbox.webhooks',
} as const;

export function buildTasks(
  env: AppEnv,
  prisma: PrismaClient,
  log: Logger,
  opts: { heartbeatEverySeconds?: number; onHeartbeat?: (at: Date) => void } = {},
): TaskDef[] {
  if (env.PAYMENT_MODE === 'live')
    throw new Error('PAYMENT_MODE=live: no live payment adapter is implemented (Phase 8 gate)');
  const psp = env.PAYMENT_MODE === 'mock' ? createSandboxPsp(prisma, env) : null;
  const mailer = createMailer(env);
  const tasks: TaskDef[] = [
    {
      name: TASK.heartbeat,
      everySeconds: opts.heartbeatEverySeconds ?? 60,
      run: async () => {
        await pingDatabase(prisma);
        const at = new Date();
        opts.onHeartbeat?.(at);
        return { at: at.toISOString() };
      },
    },
    {
      name: TASK.outbox,
      everySeconds: 2,
      leaseSeconds: 120,
      run: async () => {
        // Drain several batches per run (bounded) so a backlog cannot delay fresh one-time links.
        const started = Date.now();
        let delivered = 0;
        for (let i = 0; i < 10; i++) {
          const n = await dispatchOutbox(prisma, mailer, env, log);
          delivered += n;
          if (n < 20 || Date.now() - started > 1_500) break;
        }
        return { delivered };
      },
    },
    {
      name: TASK.payments,
      everySeconds: 2,
      leaseSeconds: 120,
      run: async () => {
        const res = await processPendingPaymentEvents(prisma);
        if (Object.keys(res).length) log.info(res, 'payment events processed');
        return res;
      },
    },
    {
      name: TASK.settlementSubmit,
      everySeconds: 2,
      leaseSeconds: 120,
      run: async () => {
        const res = await submitApprovedSettlements(prisma, psp);
        if (res.refunds || res.payouts) log.info(res, 'settlements submitted');
        return res;
      },
    },
    {
      name: TASK.checkoutExpiry,
      everySeconds: 30,
      run: async () => {
        const res = await expireCheckouts(prisma, psp);
        if (res.expired || res.awaitingProvider) log.info(res, 'checkout expiry run');
        return res;
      },
    },
    {
      name: TASK.rfqExpiry,
      everySeconds: 60,
      run: async () => {
        const res = await runRfqExpiry(prisma);
        if (res.quotes_expired || res.rfqs_expired) log.info(res, 'rfq expiry run');
        return res;
      },
    },
    {
      name: TASK.settlementSweep,
      everySeconds: 300,
      run: async () => {
        const res = await runSettlementSweep(prisma);
        if (res.auto_completed || res.recomputed) log.info(res, 'settlement sweep');
        return res;
      },
    },
    {
      name: TASK.exportCleanup,
      everySeconds: 600,
      run: async () => {
        const expired = await expireExports(prisma);
        if (expired) log.info({ expired }, 'report exports expired');
        return { expired };
      },
    },
    {
      name: TASK.supportAutoClose,
      everySeconds: 3600,
      run: async () => {
        const closed = await autoCloseResolvedTickets(prisma);
        if (closed) log.info({ closed }, 'resolved support tickets closed after 7 days');
        return { closed };
      },
    },
    {
      name: TASK.licence,
      everySeconds: 3600,
      run: async () => {
        const res = await runLicenceExpiry(prisma, env);
        if (res.reminded || res.restricted) log.info(res, 'licence expiry run');
        return res;
      },
    },
    {
      name: TASK.retention,
      everySeconds: 86_400,
      run: async () => {
        const res = await runRetentionReport(prisma, env);
        log.info(res, 'retention report (no deletion)');
        return res;
      },
    },
  ];
  if (psp)
    tasks.push({
      name: TASK.sandboxWebhooks,
      everySeconds: 2,
      leaseSeconds: 120,
      run: async () => ({ delivered: await deliverSandboxWebhooks(prisma, env, log) }),
    });
  return tasks;
}
