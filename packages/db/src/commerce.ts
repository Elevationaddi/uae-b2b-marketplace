import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { Prisma, type PrismaClient } from '@prisma/client';
import { BUYER_ROLES, notifyWorkspace, openCase, SELLER_ORDER_ROLES } from './commerce-shared';
import { processSettlementEvent } from './settlement';

/**
 * Phase 4 payment processing shared by the API (webhook intake, checkout) and the worker
 * (event processing, expiry, sandbox delivery). docs/08-finance.md, docs/09-workflows.md.
 *
 * Only the labelled sandbox adapter exists. No live payment provider is implemented or called;
 * PAYMENT_MODE=live is refused at startup until a provider is approved (Phase 8 gate).
 */

export const SANDBOX_PROVIDER = 'sandbox';
export const WEBHOOK_SIGNATURE_HEADER = 'x-sandbox-signature';
const SIGNATURE_TOLERANCE_SECONDS = 300;

type TxClient = Prisma.TransactionClient;

// ------------------------------------------------------------------ webhook signatures

/**
 * Webhook signing key. A configured PSP_WEBHOOK_SECRET wins; in sandbox mode without one, a key is
 * derived from SESSION_SECRET with HMAC so no extra secret is needed in development.
 */
export function webhookSecret(env: { PSP_WEBHOOK_SECRET?: string; SESSION_SECRET: string }) {
  return (
    env.PSP_WEBHOOK_SECRET ??
    createHmac('sha256', env.SESSION_SECRET).update('sandbox-psp-webhook-v1').digest('hex')
  );
}

/** Header value `t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>">`. */
export function signWebhook(
  secret: string,
  rawBody: string,
  timestamp = Math.floor(Date.now() / 1000),
): string {
  const mac = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  return `t=${timestamp},v1=${mac}`;
}

/** Constant-time verification with a replay window on the signed timestamp. */
export function verifyWebhook(
  secret: string,
  header: string | undefined,
  rawBody: Buffer | string,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(',').map((p) => {
      const i = p.indexOf('=');
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    }),
  ) as Record<string, string | undefined>;
  const t = Number(parts.t);
  const v1 = parts.v1;
  if (!Number.isInteger(t) || !v1 || !/^[0-9a-f]{64}$/.test(v1)) return false;
  if (Math.abs(nowSeconds - t) > SIGNATURE_TOLERANCE_SECONDS) return false;
  const body = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  const expected = createHmac('sha256', secret).update(`${t}.${body}`).digest();
  const given = Buffer.from(v1, 'hex');
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Event body the sandbox provider posts (and the shape a live adapter must normalise to). */
export interface PspEvent {
  id: string;
  type:
    | 'payment.captured'
    | 'payment.failed'
    | 'refund.succeeded'
    | 'refund.failed'
    | 'payout.paid'
    | 'payout.failed';
  created: string;
  data: {
    session_id: string;
    reference: string;
    amount_fils: string;
    currency: string;
    failure_code?: string;
  };
}

// ------------------------------------------------------------------ sandbox PSP adapter

export type PspSessionState = 'OPEN' | 'CAPTURED' | 'FAILED' | 'CANCELLED' | 'UNKNOWN';

export interface PspAdapter {
  provider: string;
  sandbox: boolean;
  createSession(input: {
    amountFils: bigint;
    currency: string;
    reference: string;
    idempotencyKey: string;
    returnUrl: string;
  }): Promise<{ sessionId: string }>;
  /** Ask the provider for the authoritative state (used before releasing stock, T17). */
  getSessionState(sessionId: string): Promise<PspSessionState>;
  /** Cancel an open session. Returns the final state (CAPTURED if the capture won the race). */
  cancelSession(sessionId: string): Promise<PspSessionState>;
  /** Submit a refund or payout (Phase 5). Idempotent by key; the outcome arrives by webhook. */
  submitOperation(input: {
    kind: 'REFUND' | 'PAYOUT';
    amountFils: bigint;
    currency: string;
    reference: string;
    idempotencyKey: string;
  }): Promise<{ providerRef: string }>;
}

/**
 * Sandbox PSP backed by the mock_psp_sessions table. Clearly labelled; refuses production.
 * The hosted page (web /sandbox-pay/:id) completes a session, which queues a signed webhook that
 * the worker posts to the API, so the real intake path is exercised end to end.
 */
export function createSandboxPsp(
  prisma: PrismaClient,
  env: { NODE_ENV: string; appEnv?: string },
): PspAdapter {
  // Allowed in development, test and the protected staging profile (a production build that
  // never moves real money); refused in production.
  if (
    (env.appEnv ?? (env.NODE_ENV === 'production' ? 'production' : 'development')) === 'production'
  )
    throw new Error('The sandbox PSP is not allowed in production');
  return {
    provider: SANDBOX_PROVIDER,
    sandbox: true,
    async createSession(input) {
      const existing = await prisma.mockPspSession.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) return { sessionId: existing.id };
      const id = `ps_${randomUUID().replace(/-/g, '')}`;
      try {
        await prisma.mockPspSession.create({
          data: {
            id,
            amountFils: input.amountFils,
            currency: input.currency,
            reference: input.reference,
            idempotencyKey: input.idempotencyKey,
            returnUrl: input.returnUrl,
          },
        });
        return { sessionId: id };
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          const s = await prisma.mockPspSession.findUniqueOrThrow({
            where: { idempotencyKey: input.idempotencyKey },
          });
          return { sessionId: s.id };
        }
        throw e;
      }
    },
    async getSessionState(sessionId) {
      const s = await prisma.mockPspSession.findUnique({ where: { id: sessionId } });
      return s ? s.state : 'UNKNOWN';
    },
    async submitOperation(input) {
      const existing = await prisma.mockPspOperation.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) return { providerRef: existing.id };
      const id = `${input.kind === 'REFUND' ? 'rf' : 'po'}_${randomUUID().replace(/-/g, '')}`;
      try {
        await prisma.mockPspOperation.create({
          data: {
            id,
            kind: input.kind,
            amountFils: input.amountFils,
            currency: input.currency,
            reference: input.reference,
            idempotencyKey: input.idempotencyKey,
          },
        });
        return { providerRef: id };
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          const op = await prisma.mockPspOperation.findUniqueOrThrow({
            where: { idempotencyKey: input.idempotencyKey },
          });
          return { providerRef: op.id };
        }
        throw e;
      }
    },
    async cancelSession(sessionId) {
      await prisma.mockPspSession.updateMany({
        where: { id: sessionId, state: 'OPEN' },
        data: { state: 'CANCELLED' },
      });
      const s = await prisma.mockPspSession.findUnique({ where: { id: sessionId } });
      return s ? s.state : 'UNKNOWN';
    },
  };
}

/**
 * Sandbox only: the simulated customer completes or fails the hosted payment. The state change
 * and the queued webhook are atomic; a session completes at most once.
 */
export async function completeSandboxSession(
  prisma: PrismaClient,
  sessionId: string,
  outcome: 'success' | 'failure',
): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<
      { id: string }[]
    >`SELECT id FROM mock_psp_sessions WHERE id = ${sessionId} AND state = 'OPEN' FOR UPDATE`;
    if (rows.length === 0) return false;
    const s = await tx.mockPspSession.findUniqueOrThrow({ where: { id: sessionId } });
    const event: PspEvent = {
      id: `evt_${randomUUID().replace(/-/g, '')}`,
      type: outcome === 'success' ? 'payment.captured' : 'payment.failed',
      created: new Date().toISOString(),
      data: {
        session_id: s.id,
        reference: s.reference,
        amount_fils: s.amountFils.toString(),
        currency: s.currency,
        ...(outcome === 'failure' ? { failure_code: 'card_declined' } : {}),
      },
    };
    await tx.mockPspSession.update({
      where: { id: s.id },
      data: {
        state: outcome === 'success' ? 'CAPTURED' : 'FAILED',
        outbox: [event] as unknown as Prisma.InputJsonValue,
      },
    });
    return true;
  });
}

// ------------------------------------------------------------------ inventory helpers

/** Move reserved stock back to available (reservation released). Never touches on_hand. */
async function releaseReservations(tx: TxClient, checkoutId: string, reason: string) {
  const held = await tx.reservation.findMany({
    where: { checkoutId, state: 'HELD' },
    orderBy: { skuId: 'asc' },
  });
  for (const r of held) {
    const inv = await tx.$queryRaw<{ on_hand: number; reserved: number; unavailable: number }[]>`
      UPDATE inventory SET reserved = reserved - ${r.quantity}, version = version + 1, updated_at = now()
       WHERE sku_id = ${r.skuId}::uuid AND reserved >= ${r.quantity}
       RETURNING on_hand, reserved, unavailable`;
    const after = inv[0];
    if (!after) throw new Error(`reservation ${r.id}: inventory reserved below hold`);
    await tx.stockMovement.create({
      data: {
        skuId: r.skuId,
        kind: 'RELEASE_RESERVATION',
        deltaOnHand: 0,
        deltaReserved: -r.quantity,
        onHandAfter: after.on_hand,
        reservedAfter: after.reserved,
        unavailableAfter: after.unavailable,
        reason,
        referenceId: checkoutId,
      },
    });
    await tx.reservation.update({
      where: { id: r.id },
      data: { state: 'RELEASED', closedAt: new Date() },
    });
  }
}

/** Convert held stock into a sale: on_hand and reserved both drop, sold rises. */
async function consumeReservations(tx: TxClient, checkoutId: string) {
  const held = await tx.reservation.findMany({
    where: { checkoutId, state: 'HELD' },
    orderBy: { skuId: 'asc' },
  });
  for (const r of held) {
    const inv = await tx.$queryRaw<{ on_hand: number; reserved: number; unavailable: number }[]>`
      UPDATE inventory
         SET on_hand = on_hand - ${r.quantity}, reserved = reserved - ${r.quantity},
             sold = sold + ${r.quantity}, version = version + 1, updated_at = now()
       WHERE sku_id = ${r.skuId}::uuid AND reserved >= ${r.quantity} AND on_hand >= ${r.quantity}
       RETURNING on_hand, reserved, unavailable`;
    const after = inv[0];
    if (!after) throw new Error(`reservation ${r.id}: inventory cannot cover the sale`);
    await tx.stockMovement.create({
      data: {
        skuId: r.skuId,
        kind: 'SALE',
        deltaOnHand: -r.quantity,
        deltaReserved: -r.quantity,
        onHandAfter: after.on_hand,
        reservedAfter: after.reserved,
        unavailableAfter: after.unavailable,
        reason: 'Paid order',
        referenceId: checkoutId,
      },
    });
    await tx.reservation.update({
      where: { id: r.id },
      data: { state: 'CONSUMED', closedAt: new Date() },
    });
  }
}

// ------------------------------------------------------------------ notifications (in-app)

async function lockCheckout(tx: TxClient, id: string) {
  await tx.$queryRaw`SELECT id FROM checkouts WHERE id = ${id}::uuid FOR UPDATE`;
  return tx.checkout.findUniqueOrThrow({ where: { id }, include: { orders: true } });
}

/**
 * Close an unpaid checkout: release stock, cancel orders and open payments. Caller holds the
 * checkout lock and has confirmed with the provider that nothing was captured.
 */
export async function closeUnpaidCheckout(
  tx: TxClient,
  checkoutId: string,
  to: 'EXPIRED' | 'CANCELLED',
  opts: { reason: string; actorSide: 'SYSTEM' | 'BUYER'; actorId?: string },
): Promise<boolean> {
  const c = await lockCheckout(tx, checkoutId);
  if (c.state !== 'PENDING_PAYMENT') return false;
  const now = new Date();
  await releaseReservations(
    tx,
    c.id,
    to === 'EXPIRED' ? 'Checkout expired unpaid' : 'Checkout cancelled',
  );
  await tx.payment.updateMany({
    where: { checkoutId: c.id, state: { in: ['CREATED', 'PENDING', 'FAILED'] } },
    data: { state: 'CANCELLED' },
  });
  await tx.checkout.update({
    where: { id: c.id },
    data: { state: to, closedAt: now, version: { increment: 1 } },
  });
  for (const o of c.orders) {
    if (o.state !== 'AWAITING_PAYMENT') continue;
    await tx.order.update({
      where: { id: o.id },
      data: {
        state: 'CANCELLED',
        cancelledAt: now,
        cancelReason: opts.reason,
        version: { increment: 1 },
      },
    });
    await tx.orderEvent.create({
      data: {
        orderId: o.id,
        kind: 'order.cancelled',
        actorSide: opts.actorSide,
        actorId: opts.actorId ?? null,
        reason: opts.reason,
      },
    });
    await notifyWorkspace(tx, o.buyerWorkspaceId, BUYER_ROLES, 'order.cancelled', {
      order_id: o.id,
      order_number: o.number,
      path: `/app/buyer/${o.buyerWorkspaceId}/orders/${o.id}`,
    });
  }
  return true;
}

// ------------------------------------------------------------------ event processing

type Outcome = 'PROCESSED' | 'IGNORED' | 'QUARANTINED' | 'SKIPPED';

/**
 * Process one stored webhook event exactly once (T15): the event row is locked and must still be
 * RECEIVED; the payment and checkout rows are locked; the capture journal has a unique dedupe key.
 */
export async function processPaymentEvent(prisma: PrismaClient, eventRowId: string) {
  return prisma.$transaction(
    async (tx): Promise<Outcome> => {
      const locked = await tx.$queryRaw<{ id: string }[]>`
        SELECT id FROM payment_events WHERE id = ${eventRowId}::uuid AND status = 'RECEIVED'
           FOR UPDATE SKIP LOCKED`;
      if (locked.length === 0) return 'SKIPPED';
      const ev = await tx.paymentEvent.findUniqueOrThrow({ where: { id: eventRowId } });
      const finish = async (status: Exclude<Outcome, 'SKIPPED'>, error: string | null = null) => {
        await tx.paymentEvent.update({
          where: { id: ev.id },
          data: { status, error, processedAt: new Date() },
        });
        return status;
      };
      if (ev.type.startsWith('refund.') || ev.type.startsWith('payout.')) {
        const r = await processSettlementEvent(tx, ev);
        return finish(r.status, r.error);
      }
      if (!ev.providerRef) return finish('QUARANTINED', 'missing_reference');
      await tx.$queryRaw`SELECT id FROM payments WHERE provider = ${ev.provider} AND provider_ref = ${ev.providerRef} FOR UPDATE`;
      const payment = await tx.payment.findFirst({
        where: { provider: ev.provider, providerRef: ev.providerRef },
      });
      if (!payment) {
        await openCase(
          tx,
          'UNKNOWN_REFERENCE',
          { paymentEventId: ev.id },
          {
            provider_ref: ev.providerRef,
            event_id: ev.eventId,
          },
        );
        return finish('QUARANTINED', 'unknown_reference');
      }
      if (ev.amountFils !== payment.amountFils || ev.currency !== payment.currency) {
        await openCase(
          tx,
          'AMOUNT_MISMATCH',
          { checkoutId: payment.checkoutId, paymentId: payment.id, paymentEventId: ev.id },
          {
            expected_fils: payment.amountFils.toString(),
            received_fils: ev.amountFils?.toString() ?? null,
            expected_currency: payment.currency,
            received_currency: ev.currency,
          },
        );
        return finish('QUARANTINED', 'amount_mismatch');
      }

      if (ev.type === 'payment.failed') {
        if (payment.state !== 'CREATED' && payment.state !== 'PENDING')
          return finish('IGNORED', `payment_${payment.state.toLowerCase()}`);
        const payload = ev.payload as { data?: { failure_code?: string } };
        await tx.payment.update({
          where: { id: payment.id },
          data: { state: 'FAILED', failureCode: payload.data?.failure_code ?? 'failed' },
        });
        return finish('PROCESSED');
      }
      if (ev.type !== 'payment.captured') return finish('IGNORED', 'unsupported_type');
      if (payment.state === 'CAPTURED') return finish('IGNORED', 'already_captured');

      const now = new Date();
      const checkout = await lockCheckout(tx, payment.checkoutId);
      await tx.payment.update({
        where: { id: payment.id },
        data: { state: 'CAPTURED', capturedAt: now, failureCode: null },
      });

      if (checkout.state !== 'PENDING_PAYMENT') {
        // Money moved after the checkout closed (T18): hold it in suspense for finance review.
        if (checkout.state !== 'PAID')
          await tx.checkout.update({
            where: { id: checkout.id },
            data: { state: 'RECONCILIATION_REQUIRED', version: { increment: 1 } },
          });
        await tx.ledgerJournal.create({
          data: {
            kind: 'late_capture',
            checkoutId: checkout.id,
            paymentId: payment.id,
            dedupeKey: `capture:${payment.id}`,
            memo: `Captured after checkout ${checkout.state}`,
            entries: {
              create: [
                { account: 'psp_clearing', debitFils: payment.amountFils },
                { account: 'unallocated_receipts', creditFils: payment.amountFils },
              ],
            },
          },
        });
        await openCase(
          tx,
          'LATE_CAPTURE',
          { checkoutId: checkout.id, paymentId: payment.id, paymentEventId: ev.id },
          { checkout_state: checkout.state, amount_fils: payment.amountFils.toString() },
        );
        return finish('PROCESSED', 'late_capture');
      }

      await tx.payment.updateMany({
        where: {
          checkoutId: checkout.id,
          id: { not: payment.id },
          state: { in: ['CREATED', 'PENDING'] },
        },
        data: { state: 'CANCELLED' },
      });
      await consumeReservations(tx, checkout.id);
      await tx.checkout.update({
        where: { id: checkout.id },
        data: { state: 'PAID', paidAt: now, closedAt: now, version: { increment: 1 } },
      });
      const entries: Prisma.LedgerEntryCreateWithoutJournalInput[] = [
        { account: 'psp_clearing', debitFils: checkout.totalFils },
      ];
      for (const o of checkout.orders) {
        await tx.order.update({
          where: { id: o.id },
          data: { state: 'CONFIRMED', confirmedAt: now, version: { increment: 1 } },
        });
        await tx.orderEvent.create({
          data: { orderId: o.id, kind: 'order.paid', actorSide: 'SYSTEM' },
        });
        entries.push({
          account: 'seller_payable',
          creditFils: o.sellerPayableFils,
          orderId: o.id,
          sellerWorkspaceId: o.sellerWorkspaceId,
        });
        if (o.commissionFils > 0n)
          entries.push({
            account: 'platform_fee_revenue',
            creditFils: o.commissionFils,
            orderId: o.id,
          });
        const p = { order_id: o.id, order_number: o.number };
        await notifyWorkspace(tx, o.buyerWorkspaceId, BUYER_ROLES, 'order.paid', {
          ...p,
          path: `/app/buyer/${o.buyerWorkspaceId}/orders/${o.id}`,
        });
        await notifyWorkspace(tx, o.sellerWorkspaceId, SELLER_ORDER_ROLES, 'order.received', {
          ...p,
          path: `/app/seller/${o.sellerWorkspaceId}/orders/${o.id}`,
        });
      }
      await tx.ledgerJournal.create({
        data: {
          kind: 'capture',
          checkoutId: checkout.id,
          paymentId: payment.id,
          dedupeKey: `capture:${payment.id}`,
          memo: `Checkout ${checkout.number}`,
          entries: { create: entries },
        },
      });
      return finish('PROCESSED');
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted, timeout: 20_000 },
  );
}

/** Process up to `limit` RECEIVED events, oldest first. */
export async function processPendingPaymentEvents(prisma: PrismaClient, limit = 50) {
  const rows = await prisma.paymentEvent.findMany({
    where: { status: 'RECEIVED' },
    orderBy: { receivedAt: 'asc' },
    take: limit,
    select: { id: true },
  });
  const out: Record<string, number> = {};
  for (const r of rows) {
    const o = await processPaymentEvent(prisma, r.id);
    out[o] = (out[o] ?? 0) + 1;
  }
  return out;
}

/**
 * Expire checkouts past pay_by (T17). The provider is asked first: a captured session keeps the
 * hold until its webhook is processed; an open session is cancelled before stock is released.
 */
export async function expireCheckouts(
  prisma: PrismaClient,
  psp: PspAdapter | null,
  now = new Date(),
  limit = 50,
) {
  const due = await prisma.checkout.findMany({
    where: { state: 'PENDING_PAYMENT', payBy: { lte: now } },
    orderBy: { payBy: 'asc' },
    take: limit,
    include: { payments: { where: { state: { in: ['CREATED', 'PENDING'] } } } },
  });
  let expired = 0;
  let awaitingProvider = 0;
  for (const c of due) {
    let captured = false;
    for (const p of c.payments) {
      const state = psp
        ? await psp
            .getSessionState(p.providerRef)
            .then((s) => (s === 'OPEN' ? psp.cancelSession(p.providerRef) : s))
        : 'UNKNOWN';
      if (state === 'CAPTURED') captured = true;
    }
    if (captured) {
      awaitingProvider++;
      continue;
    }
    const done = await prisma.$transaction((tx) =>
      closeUnpaidCheckout(tx, c.id, 'EXPIRED', {
        reason: 'payment_window_expired',
        actorSide: 'SYSTEM',
      }),
    );
    if (done) expired++;
  }
  return { expired, awaitingProvider };
}
