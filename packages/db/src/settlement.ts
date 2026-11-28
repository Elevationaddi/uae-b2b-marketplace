import { randomUUID } from 'node:crypto';
import { type Prisma, type PrismaClient, type PaymentEvent } from '@prisma/client';
import type { PspAdapter, PspEvent } from './commerce';
import { BUYER_ROLES, notifyWorkspace, openCase, SELLER_ORDER_ROLES } from './commerce-shared';
import { canAutoComplete, settlementBlockers, settlementStateFor } from './financial-policy';

/**
 * Phase 5 settlement: sandbox refunds and payouts, settlement eligibility and holds
 * (docs/08-finance.md, docs/09-workflows.md). A refund or payout is never shown as done until
 * the provider confirms it by a verified webhook; money state is changed only here.
 * Only the labelled sandbox adapter exists; no live provider is called.
 */

type TxClient = Prisma.TransactionClient;
const SELLER_FINANCE_ROLES = ['OWNER', 'FINANCE'] as const;

/** Seller payable still owed on an order after confirmed refunds (never negative). */
export async function remainingPayable(tx: TxClient, orderId: string): Promise<bigint> {
  const o = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
  const agg = await tx.refund.aggregate({
    where: { orderId, state: 'SUCCEEDED' },
    _sum: { amountFils: true, commissionFils: true },
  });
  const sellerShare = (agg._sum.amountFils ?? 0n) - (agg._sum.commissionFils ?? 0n);
  const left = o.sellerPayableFils - sellerShare;
  return left > 0n ? left : 0n;
}

/**
 * Recompute an order's settlement eligibility after delivery, receipt, a dispute, hold, refund or
 * reconciliation change, and when its dispute window ends. Orders already in a payout are left
 * alone (the payout outcome decides). Founder decision C-01: ELIGIBLE only after verified delivery
 * and the end of the dispute window, with no dispute, hold, open reconciliation case or pending
 * refund; HELD while any of those is active; otherwise NOT_ELIGIBLE.
 */
export async function recomputeSettlement(
  tx: TxClient,
  orderId: string,
  now: Date = new Date(),
): Promise<void> {
  const o = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
  if (o.settlementState === 'IN_PAYOUT' || o.settlementState === 'PAID_OUT') return;
  const blockers = await settlementBlockers(tx, o, await remainingPayable(tx, orderId), now);
  const next = settlementStateFor(blockers);
  if (next !== o.settlementState)
    await tx.order.update({ where: { id: orderId }, data: { settlementState: next } });
}

/**
 * Worker sweep (idempotent; safe to run often and on several workers): completes delivered orders
 * whose dispute window has ended with no dispute, hold, open reconciliation case or pending refund
 * (C-03), then recomputes eligibility of orders whose window has ended (C-01). `orderIds` limits
 * the sweep (tests); `now` is the clock.
 */
export async function runSettlementSweep(
  prisma: PrismaClient,
  opts: { now?: Date; orderIds?: string[]; batch?: number } = {},
): Promise<{ auto_completed: number; recomputed: number }> {
  const now = opts.now ?? new Date();
  const scope = opts.orderIds ? { id: { in: opts.orderIds } } : {};
  const due = await prisma.order.findMany({
    where: {
      ...scope,
      disputeWindowEndsAt: { lte: now },
      state: { in: ['DELIVERED', 'COMPLETED'] },
      // ELIGIBLE orders are re-checked too: a reconciliation case opened by a provider event
      // must move them to HELD before the next payout run (payout requests re-check as well).
      OR: [
        { state: 'DELIVERED' },
        { settlementState: { in: ['NOT_ELIGIBLE', 'HELD', 'ELIGIBLE'] } },
      ],
    },
    select: { id: true },
    orderBy: { disputeWindowEndsAt: 'asc' },
    take: opts.batch ?? 200,
  });
  let autoCompleted = 0;
  let recomputed = 0;
  for (const { id } of due) {
    await prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<
        { id: string }[]
      >`SELECT id FROM orders WHERE id = ${id}::uuid FOR UPDATE SKIP LOCKED`;
      if (rows.length === 0) return;
      const o = await tx.order.findUniqueOrThrow({ where: { id } });
      const blockers = await settlementBlockers(tx, o, await remainingPayable(tx, id), now);
      if (canAutoComplete(o, blockers)) {
        await tx.order.update({
          where: { id },
          data: { state: 'COMPLETED', completedAt: now, version: { increment: 1 } },
        });
        await tx.orderEvent.create({
          data: {
            orderId: id,
            kind: 'order.auto_completed',
            actorSide: 'SYSTEM',
            reason: 'dispute_window_ended',
          },
        });
        const p = { order_id: o.id, order_number: o.number };
        await notifyWorkspace(tx, o.buyerWorkspaceId, BUYER_ROLES, 'order.auto_completed', {
          ...p,
          path: `/app/buyer/${o.buyerWorkspaceId}/orders/${o.id}`,
        });
        await notifyWorkspace(tx, o.sellerWorkspaceId, SELLER_ORDER_ROLES, 'order.auto_completed', {
          ...p,
          path: `/app/seller/${o.sellerWorkspaceId}/orders/${o.id}`,
        });
        autoCompleted++;
      }
      const before = o.settlementState;
      await recomputeSettlement(tx, id, now);
      const after = await tx.order.findUniqueOrThrow({
        where: { id },
        select: { settlementState: true },
      });
      if (after.settlementState !== before) recomputed++;
    });
  }
  return { auto_completed: autoCompleted, recomputed };
}

/** Worker: submit approved refunds and payouts to the provider (APPROVED→SUBMITTED/PENDING). */
export async function submitApprovedSettlements(prisma: PrismaClient, psp: PspAdapter | null) {
  if (!psp) return { refunds: 0, payouts: 0 };
  let refunds = 0;
  let payouts = 0;
  for (const r of await prisma.refund.findMany({ where: { state: 'APPROVED' }, take: 20 })) {
    const { providerRef } = await psp.submitOperation({
      kind: 'REFUND',
      amountFils: r.amountFils,
      currency: r.currency,
      reference: r.number,
      idempotencyKey: `refund:${r.id}`,
    });
    const u = await prisma.refund.updateMany({
      where: { id: r.id, state: 'APPROVED' },
      data: { state: 'SUBMITTED', providerRef, submittedAt: new Date() },
    });
    refunds += u.count;
  }
  for (const p of await prisma.payout.findMany({ where: { state: 'APPROVED' }, take: 20 })) {
    const { providerRef } = await psp.submitOperation({
      kind: 'PAYOUT',
      amountFils: p.amountFils,
      currency: p.currency,
      reference: p.number,
      idempotencyKey: `payout:${p.id}`,
    });
    const u = await prisma.payout.updateMany({
      where: { id: p.id, state: 'APPROVED' },
      data: { state: 'PENDING', providerRef, submittedAt: new Date() },
    });
    payouts += u.count;
  }
  return { refunds, payouts };
}

/**
 * Sandbox only: simulate the provider finishing a refund or payout. The state change and the
 * queued signed webhook are atomic; an operation completes at most once.
 */
export async function completeSandboxOperation(
  prisma: PrismaClient,
  id: string,
  outcome: 'success' | 'failure',
): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<
      { id: string }[]
    >`SELECT id FROM mock_psp_operations WHERE id = ${id} AND state = 'OPEN' FOR UPDATE`;
    if (rows.length === 0) return false;
    const op = await tx.mockPspOperation.findUniqueOrThrow({ where: { id } });
    const ok = outcome === 'success';
    const type: PspEvent['type'] =
      op.kind === 'REFUND'
        ? ok
          ? 'refund.succeeded'
          : 'refund.failed'
        : ok
          ? 'payout.paid'
          : 'payout.failed';
    const event: PspEvent = {
      id: `evt_${randomUUID().replace(/-/g, '')}`,
      type,
      created: new Date().toISOString(),
      data: {
        session_id: op.id,
        reference: op.reference,
        amount_fils: op.amountFils.toString(),
        currency: op.currency,
        ...(ok
          ? {}
          : { failure_code: op.kind === 'REFUND' ? 'refund_declined' : 'account_closed' }),
      },
    };
    await tx.mockPspOperation.update({
      where: { id },
      data: {
        state: ok ? 'SUCCEEDED' : 'FAILED',
        outbox: [event] as unknown as Prisma.InputJsonValue,
      },
    });
    return true;
  });
}

type Result = { status: 'PROCESSED' | 'IGNORED' | 'QUARANTINED'; error: string | null };
const done = (status: Result['status'], error: string | null = null): Result => ({ status, error });

/** Called by processPaymentEvent (inside its transaction, event row locked) for refund/payout events. */
export async function processSettlementEvent(tx: TxClient, ev: PaymentEvent): Promise<Result> {
  if (!ev.providerRef) return done('QUARANTINED', 'missing_reference');
  const failureCode =
    (ev.payload as { data?: { failure_code?: string } }).data?.failure_code ?? 'failed';
  return ev.type.startsWith('refund.')
    ? processRefund(tx, ev, failureCode)
    : processPayout(tx, ev, failureCode);
}

async function mismatch(
  tx: TxClient,
  ev: PaymentEvent,
  expected: bigint,
  currency: string,
  ids: { paymentId?: string },
): Promise<Result | null> {
  if (ev.amountFils === expected && ev.currency === currency) return null;
  await openCase(
    tx,
    'AMOUNT_MISMATCH',
    { paymentEventId: ev.id, ...ids },
    {
      event_type: ev.type,
      expected_fils: expected.toString(),
      received_fils: ev.amountFils?.toString() ?? null,
    },
  );
  return done('QUARANTINED', 'amount_mismatch');
}

async function processRefund(tx: TxClient, ev: PaymentEvent, failureCode: string): Promise<Result> {
  await tx.$queryRaw`SELECT id FROM refunds WHERE provider_ref = ${ev.providerRef} FOR UPDATE`;
  const refund = await tx.refund.findUnique({ where: { providerRef: ev.providerRef! } });
  if (!refund) {
    await openCase(
      tx,
      'UNKNOWN_REFERENCE',
      { paymentEventId: ev.id },
      {
        provider_ref: ev.providerRef,
        event_id: ev.eventId,
      },
    );
    return done('QUARANTINED', 'unknown_reference');
  }
  const bad = await mismatch(tx, ev, refund.amountFils, refund.currency, {
    paymentId: refund.paymentId,
  });
  if (bad) return bad;
  // Duplicates and out-of-order events: the first terminal provider outcome wins (T30).
  if (refund.state === 'SUCCEEDED') return done('IGNORED', 'refund_succeeded');
  if (refund.state !== 'SUBMITTED' && refund.state !== 'FAILED')
    return done('IGNORED', `refund_${refund.state.toLowerCase()}`);
  await tx.$queryRaw`SELECT id FROM orders WHERE id = ${refund.orderId}::uuid FOR UPDATE`;
  const order = await tx.order.findUniqueOrThrow({ where: { id: refund.orderId } });
  const now = new Date();

  if (ev.type === 'refund.failed') {
    if (refund.state === 'FAILED') return done('IGNORED', 'refund_failed');
    await tx.refund.update({
      where: { id: refund.id },
      data: { state: 'FAILED', failureCode, completedAt: now },
    });
    await openCase(
      tx,
      'REFUND_FAILED',
      { paymentId: refund.paymentId, paymentEventId: ev.id },
      { refund_number: refund.number, order_number: order.number, failure_code: failureCode },
    );
    if (refund.disputeId)
      await tx.disputeMessage.create({
        data: {
          disputeId: refund.disputeId,
          authorId: refund.requestedById,
          authorSide: 'SYSTEM',
          body: `refund_failed:${refund.number}`,
        },
      });
    // The failed refund no longer blocks settlement, but its reconciliation case now holds it.
    await recomputeSettlement(tx, order.id);
    return done('PROCESSED', 'refund_failed');
  }
  if (ev.type !== 'refund.succeeded') return done('IGNORED', 'unsupported_type');

  await tx.refund.update({
    where: { id: refund.id },
    data: { state: 'SUCCEEDED', completedAt: now, failureCode: null },
  });
  const refundedFils = order.refundedFils + refund.amountFils;
  const fullyRefunded = refundedFils >= order.totalFils;
  const cancel = fullyRefunded && (order.state === 'CONFIRMED' || order.state === 'PROCESSING');
  await tx.order.update({
    where: { id: order.id },
    data: {
      refundedFils,
      ...(cancel ? { state: 'CANCELLED', cancelledAt: now, cancelReason: 'refunded_in_full' } : {}),
      version: { increment: 1 },
    },
  });
  await tx.orderEvent.create({
    data: { orderId: order.id, kind: 'order.refunded', actorSide: 'SYSTEM', reason: refund.number },
  });
  if (cancel)
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        kind: 'order.cancelled',
        actorSide: 'SYSTEM',
        reason: 'refunded_in_full',
      },
    });
  // Payment state reflects everything confirmed refunded against the capture.
  await tx.$queryRaw`SELECT id FROM payments WHERE id = ${refund.paymentId}::uuid FOR UPDATE`;
  const payment = await tx.payment.findUniqueOrThrow({ where: { id: refund.paymentId } });
  const paid = await tx.refund.aggregate({
    where: { paymentId: payment.id, state: 'SUCCEEDED' },
    _sum: { amountFils: true },
  });
  await tx.payment.update({
    where: { id: payment.id },
    data: {
      state: (paid._sum.amountFils ?? 0n) >= payment.amountFils ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
    },
  });
  // Reversal linked to the original order: seller payable and commission back to clearing.
  const sellerShare = refund.amountFils - refund.commissionFils;
  const entries: Prisma.LedgerEntryCreateWithoutJournalInput[] = [
    { account: 'psp_clearing', creditFils: refund.amountFils },
  ];
  if (sellerShare > 0n)
    entries.push({
      account: 'seller_payable',
      debitFils: sellerShare,
      orderId: order.id,
      sellerWorkspaceId: order.sellerWorkspaceId,
    });
  if (refund.commissionFils > 0n)
    entries.push({
      account: 'platform_fee_revenue',
      debitFils: refund.commissionFils,
      orderId: order.id,
    });
  await tx.ledgerJournal.create({
    data: {
      kind: 'refund',
      checkoutId: order.checkoutId,
      paymentId: payment.id,
      dedupeKey: `refund:${refund.id}`,
      memo: `Refund ${refund.number} for ${order.number}`,
      entries: { create: entries },
    },
  });
  if (refund.disputeId) {
    const d = await tx.dispute.findUnique({ where: { id: refund.disputeId } });
    if (d && d.state === 'RESOLVING') {
      await tx.dispute.update({
        where: { id: d.id },
        data: {
          state: 'CLOSED',
          resolution: d.resolution ?? `refund_succeeded:${refund.number}`,
          closedAt: now,
          version: { increment: 1 },
        },
      });
      await tx.disputeMessage.create({
        data: {
          disputeId: d.id,
          authorId: refund.requestedById,
          authorSide: 'SYSTEM',
          body: `refund_succeeded:${refund.number}`,
        },
      });
    }
  }
  await recomputeSettlement(tx, order.id);
  const p = { order_id: order.id, order_number: order.number };
  await notifyWorkspace(tx, order.buyerWorkspaceId, BUYER_ROLES, 'order.refunded', {
    ...p,
    path: `/app/buyer/${order.buyerWorkspaceId}/orders/${order.id}`,
  });
  await notifyWorkspace(tx, order.sellerWorkspaceId, SELLER_ORDER_ROLES, 'order.refunded', {
    ...p,
    path: `/app/seller/${order.sellerWorkspaceId}/orders/${order.id}`,
  });
  return done('PROCESSED');
}

async function processPayout(tx: TxClient, ev: PaymentEvent, failureCode: string): Promise<Result> {
  await tx.$queryRaw`SELECT id FROM payouts WHERE provider_ref = ${ev.providerRef} FOR UPDATE`;
  const payout = await tx.payout.findUnique({
    where: { providerRef: ev.providerRef! },
    include: { allocations: true },
  });
  if (!payout) {
    await openCase(
      tx,
      'UNKNOWN_REFERENCE',
      { paymentEventId: ev.id },
      {
        provider_ref: ev.providerRef,
        event_id: ev.eventId,
      },
    );
    return done('QUARANTINED', 'unknown_reference');
  }
  const bad = await mismatch(tx, ev, payout.amountFils, payout.currency, {});
  if (bad) return bad;
  if (payout.state !== 'PENDING') return done('IGNORED', `payout_${payout.state.toLowerCase()}`);
  const now = new Date();
  const orderIds = payout.allocations.map((a) => a.orderId);
  const path = `/app/seller/${payout.sellerWorkspaceId}/finance`;

  if (ev.type === 'payout.failed') {
    // No paid label; the orders return to eligibility and finance gets a case (T31).
    await tx.payout.update({ where: { id: payout.id }, data: { state: 'FAILED', failureCode } });
    await tx.order.updateMany({
      where: { id: { in: orderIds }, settlementState: 'IN_PAYOUT' },
      data: { settlementState: 'NOT_ELIGIBLE' },
    });
    for (const id of orderIds) await recomputeSettlement(tx, id);
    await openCase(
      tx,
      'PAYOUT_FAILED',
      { paymentEventId: ev.id },
      {
        payout_number: payout.number,
        amount_fils: payout.amountFils.toString(),
        failure_code: failureCode,
      },
    );
    await notifyWorkspace(tx, payout.sellerWorkspaceId, SELLER_FINANCE_ROLES, 'payout.failed', {
      payout_id: payout.id,
      payout_number: payout.number,
      path,
    });
    return done('PROCESSED', 'payout_failed');
  }
  if (ev.type !== 'payout.paid') return done('IGNORED', 'unsupported_type');

  await tx.payout.update({ where: { id: payout.id }, data: { state: 'PAID', paidAt: now } });
  await tx.order.updateMany({
    where: { id: { in: orderIds } },
    data: { settlementState: 'PAID_OUT' },
  });
  await tx.ledgerJournal.create({
    data: {
      kind: 'payout',
      dedupeKey: `payout:${payout.id}`,
      memo: `Payout ${payout.number}`,
      entries: {
        create: [
          ...payout.allocations.map((a) => ({
            account: 'seller_payable',
            debitFils: a.amountFils,
            orderId: a.orderId,
            sellerWorkspaceId: payout.sellerWorkspaceId,
          })),
          { account: 'psp_clearing', creditFils: payout.amountFils },
        ],
      },
    },
  });
  for (const a of payout.allocations)
    await tx.orderEvent.create({
      data: {
        orderId: a.orderId,
        kind: 'order.paid_out',
        actorSide: 'SYSTEM',
        reason: payout.number,
      },
    });
  await notifyWorkspace(tx, payout.sellerWorkspaceId, SELLER_FINANCE_ROLES, 'payout.paid', {
    payout_id: payout.id,
    payout_number: payout.number,
    path,
  });
  return done('PROCESSED');
}
