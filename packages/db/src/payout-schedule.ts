import type { Payout, Prisma, PrismaClient } from '@prisma/client';
import { writeAudit } from './audit';
import { dubaiWeekStart, settlementBlockers } from './financial-policy';
import { recomputeSettlement, remainingPayable } from './settlement';

/**
 * Weekly payout schedule (founder decisions of 28 November 2026, Q9 and FD-04): every Monday at
 * 10:00 Asia/Dubai by default (PAYOUT_WEEKDAY, PAYOUT_TIME). A Saturday, Sunday or recorded UAE
 * public holiday moves the run to the next working day. There is no minimum amount.
 *
 * The scheduler only creates PROPOSED payouts. A finance user confirms each one (it becomes
 * REQUESTED with that user as requester) and a different finance approver approves it, so the
 * schedule never bypasses dual control. Nothing here moves money.
 */

type TxClient = Prisma.TransactionClient;

const DAY_MS = 86_400_000;
const DUBAI_OFFSET_MS = 4 * 3_600_000;

export interface PayoutScheduleConfig {
  /** ISO weekday, 1 = Monday … 5 = Friday. */
  weekday: number;
  /** HH:MM in Asia/Dubai. */
  time: string;
}

/** Saturday and Sunday are the UAE weekend. */
export function isUaeWeekend(dateUtcMidnight: Date): boolean {
  const d = dateUtcMidnight.getUTCDay();
  return d === 0 || d === 6;
}

/**
 * When the run of the Dubai week starting `weekStart` (a Monday at 00:00Z, see dubaiWeekStart) is
 * due: the configured weekday and time, moved day by day past weekends and holidays. The result
 * is a UTC instant. `holidays` holds YYYY-MM-DD dates.
 */
export function scheduledRunAt(
  weekStart: Date,
  cfg: PayoutScheduleConfig,
  holidays: ReadonlySet<string>,
): Date {
  const [h, m] = cfg.time.split(':').map(Number) as [number, number];
  let day = new Date(weekStart.getTime() + (cfg.weekday - 1) * DAY_MS);
  // Bounded: no calendar has more than a few weeks of consecutive non-working days.
  for (let i = 0; i < 60; i++) {
    if (!isUaeWeekend(day) && !holidays.has(day.toISOString().slice(0, 10))) break;
    day = new Date(day.getTime() + DAY_MS);
  }
  return new Date(day.getTime() + (h * 60 + m) * 60_000 - DUBAI_OFFSET_MS);
}

async function holidaySet(tx: TxClient | PrismaClient, from: Date): Promise<Set<string>> {
  const rows = await tx.payoutHoliday.findMany({
    where: { date: { gte: from, lt: new Date(from.getTime() + 70 * DAY_MS) } },
    select: { date: true },
  });
  return new Set(rows.map((r) => r.date.toISOString().slice(0, 10)));
}

/** The schedule of the current Dubai week, for the admin payout run summary. */
export async function payoutSchedule(
  prisma: PrismaClient,
  cfg: PayoutScheduleConfig,
  now: Date = new Date(),
) {
  const weekStart = dubaiWeekStart(now);
  const next = new Date(weekStart.getTime() + 7 * DAY_MS);
  const holidays = await holidaySet(prisma, weekStart);
  return {
    scheduledFor: scheduledRunAt(weekStart, cfg, holidays),
    nextScheduledFor: scheduledRunAt(next, cfg, holidays),
  };
}

export type SellerPayoutResult =
  | { ok: true; payout: Payout; orders: number }
  | { ok: false; error: 'payout.already_in_run' | 'payout.nothing_eligible' };

async function nextPayoutNumber(tx: TxClient): Promise<string> {
  const r = await tx.$queryRaw<{ n: bigint }[]>`SELECT nextval('payout_number_seq') AS n`;
  return `PAY-${String(r[0]!.n).padStart(6, '0')}`;
}

/**
 * Create one payout for a supplier in a run from its ELIGIBLE orders (C-01, C-04). Every order is
 * locked and checked again; an order held or disputed since the last sweep is left out. At most
 * one live payout (not rejected or failed) per supplier per run. `requestedById` null creates a
 * PROPOSED payout that finance must confirm.
 */
export async function createSellerPayout(
  tx: TxClient,
  input: { sellerWorkspaceId: string; runId: string; requestedById: string | null; now: Date },
): Promise<SellerPayoutResult> {
  const ids = await tx.$queryRaw<{ id: string }[]>`
    SELECT id FROM orders WHERE seller_workspace_id = ${input.sellerWorkspaceId}::uuid
      AND settlement_state = 'ELIGIBLE' ORDER BY id FOR UPDATE`;
  const live = await tx.payout.count({
    where: {
      runId: input.runId,
      sellerWorkspaceId: input.sellerWorkspaceId,
      state: { notIn: ['REJECTED', 'FAILED'] },
    },
  });
  if (live) return { ok: false, error: 'payout.already_in_run' };
  const allocations: { orderId: string; amountFils: bigint }[] = [];
  let companyId: string | null = null;
  for (const { id: orderId } of ids) {
    const o = await tx.order.findUniqueOrThrow({ where: { id: orderId } });
    const left = await remainingPayable(tx, orderId);
    if ((await settlementBlockers(tx, o, left, input.now)).length) {
      await recomputeSettlement(tx, orderId, input.now);
      continue;
    }
    companyId = o.sellerCompanyId;
    allocations.push({ orderId, amountFils: left });
  }
  if (allocations.length === 0 || !companyId)
    return { ok: false, error: 'payout.nothing_eligible' };
  const amount = allocations.reduce((s, a) => s + a.amountFils, 0n);
  const proposed = input.requestedById === null;
  const payout = await tx.payout.create({
    data: {
      number: await nextPayoutNumber(tx),
      sellerWorkspaceId: input.sellerWorkspaceId,
      sellerCompanyId: companyId,
      amountFils: amount,
      state: proposed ? 'PROPOSED' : 'REQUESTED',
      requestedById: input.requestedById,
      proposedAt: proposed ? input.now : null,
      runId: input.runId,
      allocations: { create: allocations },
    },
  });
  await tx.order.updateMany({
    where: { id: { in: allocations.map((a) => a.orderId) } },
    data: { settlementState: 'IN_PAYOUT' },
  });
  return { ok: true, payout, orders: allocations.length };
}

/**
 * Scheduler task: once the current (or, after a long holiday, the previous) week's run is due and
 * not yet proposed, create a PROPOSED payout for every supplier with eligible orders. Idempotent:
 * the run row is locked and marked proposed once, so concurrent or repeated runs do nothing.
 */
export async function proposeWeeklyPayouts(
  prisma: PrismaClient,
  cfg: PayoutScheduleConfig,
  opts: { now?: Date; sellerWorkspaceIds?: string[] } = {},
): Promise<{ week_start: string | null; proposed: number; skipped: number }> {
  const now = opts.now ?? new Date();
  const thisWeek = dubaiWeekStart(now);
  const holidays = await holidaySet(prisma, new Date(thisWeek.getTime() - 7 * DAY_MS));
  // The previous week first: a run moved past its week by holidays is still that week's run.
  for (const weekStart of [new Date(thisWeek.getTime() - 7 * DAY_MS), thisWeek]) {
    const due = scheduledRunAt(weekStart, cfg, holidays);
    if (now.getTime() < due.getTime()) continue;
    // A previous-week run that fell within its own week is not caught up after the fact; only one
    // moved into this week by holidays is (otherwise a new deployment would propose stale runs).
    if (weekStart < thisWeek && due.getTime() < thisWeek.getTime() - DUBAI_OFFSET_MS) continue;
    const res = await prisma.$transaction(
      async (tx) => {
        const run = await tx.payoutRun.upsert({
          where: { weekStart },
          create: { weekStart },
          update: {},
        });
        await tx.$queryRaw`SELECT id FROM payout_runs WHERE id = ${run.id}::uuid FOR UPDATE`;
        const fresh = await tx.payoutRun.findUniqueOrThrow({ where: { id: run.id } });
        if (fresh.proposedAt) return null;
        const sellers = await tx.order.findMany({
          where: {
            settlementState: 'ELIGIBLE',
            // Tests limit the run to their own suppliers; the scheduler passes none.
            ...(opts.sellerWorkspaceIds
              ? { sellerWorkspaceId: { in: opts.sellerWorkspaceIds } }
              : {}),
          },
          distinct: ['sellerWorkspaceId'],
          select: { sellerWorkspaceId: true },
          orderBy: { sellerWorkspaceId: 'asc' },
        });
        let proposed = 0;
        let skipped = 0;
        for (const s of sellers) {
          const r = await createSellerPayout(tx, {
            sellerWorkspaceId: s.sellerWorkspaceId,
            runId: run.id,
            requestedById: null,
            now,
          });
          if (!r.ok) {
            skipped++;
            continue;
          }
          proposed++;
          await writeAudit(tx, {
            actorType: 'system',
            action: 'payout.proposed',
            resourceType: 'payout',
            resourceId: r.payout.id,
            details: {
              amount_fils: r.payout.amountFils.toString(),
              orders: r.orders,
              week_start: weekStart.toISOString().slice(0, 10),
            },
          });
        }
        await tx.payoutRun.update({
          where: { id: run.id },
          data: { scheduledFor: due, proposedAt: now, proposedCount: proposed },
        });
        await writeAudit(tx, {
          actorType: 'system',
          action: 'payout_run.proposed',
          resourceType: 'payout_run',
          resourceId: run.id,
          details: {
            week_start: weekStart.toISOString().slice(0, 10),
            scheduled_for: due.toISOString(),
            proposed,
            skipped,
          },
        });
        return { proposed, skipped };
      },
      { timeout: 60_000 },
    );
    if (res) return { week_start: weekStart.toISOString().slice(0, 10), ...res };
  }
  return { week_start: null, proposed: 0, skipped: 0 };
}
