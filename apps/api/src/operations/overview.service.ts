import { Inject, Injectable } from '@nestjs/common';
import { OPERATIONS_LIMITS, type OperationsOverview, type overviewQuery } from '@app/contracts';
import type { AppEnv } from '@app/config';
import type { PrismaClient } from '@app/db';
import type { z } from 'zod';
import { ApiError } from '../common/api-error';
import { APP_ENV, PRISMA } from '../infra/tokens';

/** The UAE observes no daylight saving: Asia/Dubai is UTC+04:00 all year. */
const DUBAI_OFFSET_MS = 4 * 3600_000;
const DAY_MS = 86400_000;

/** Today's calendar date in Dubai, as YYYY-MM-DD. */
export function dubaiToday(now: Date = new Date()): string {
  return new Date(now.getTime() + DUBAI_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * A Dubai calendar-date range [from, to] (inclusive) as UTC instants [start, end). Report and
 * overview ranges are chosen in Dubai dates because that is how operators read them.
 */
export function dubaiRange(from: string, to: string): { start: Date; end: Date } {
  const start = new Date(Date.parse(`${from}T00:00:00Z`) - DUBAI_OFFSET_MS);
  const end = new Date(Date.parse(`${to}T00:00:00Z`) - DUBAI_OFFSET_MS + DAY_MS);
  return { start, end };
}

export function rangeDays(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS) + 1;
}

const sum = (v: bigint | null | undefined) => v ?? 0n;

/**
 * Operations overview (docs/04-admin.md "Dashboard"): live queue counts for every admin, and
 * commerce figures computed from orders, refunds, payouts and the ledger only for admins holding
 * admin.finance.read. Nothing here is hardcoded; in sandbox mode the figures are labelled.
 */
@Injectable()
export class OverviewService {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  async overview(q: z.infer<typeof overviewQuery>, finance: boolean): Promise<OperationsOverview> {
    const to = q.to ?? dubaiToday();
    const from =
      q.from ?? new Date(Date.parse(`${to}T00:00:00Z`) - 29 * DAY_MS).toISOString().slice(0, 10);
    if (from > to)
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', { to: 'invalid' });
    if (rangeDays(from, to) > OPERATIONS_LIMITS.exportMaxDays)
      throw new ApiError('VALIDATION_FAILED', 'common.validation_failed', {
        from: 'range_too_long',
      });
    const { start, end } = dubaiRange(from, to);
    const live = ['OPEN', 'ASSIGNED', 'WAITING_CUSTOMER'] as const;
    const activeDispute = { not: 'CLOSED' } as const;
    const [
      openDisputes,
      unassignedDisputes,
      openSupport,
      unassignedSupport,
      openRecon,
      quarantined,
      refundsWaiting,
      payoutsWaiting,
    ] = await Promise.all([
      this.prisma.dispute.count({ where: { state: activeDispute } }),
      this.prisma.dispute.count({ where: { state: activeDispute, assignedAdminId: null } }),
      this.prisma.supportTicket.count({ where: { state: { in: [...live] } } }),
      this.prisma.supportTicket.count({
        where: { state: { in: [...live] }, assignedAdminId: null },
      }),
      this.prisma.reconciliationCase.count({ where: { state: 'OPEN' } }),
      this.prisma.paymentEvent.count({
        where: { status: 'QUARANTINED', receivedAt: { gte: new Date(Date.now() - 7 * DAY_MS) } },
      }),
      this.prisma.refund.count({ where: { state: 'REQUESTED' } }),
      this.prisma.payout.count({ where: { state: 'REQUESTED' } }),
    ]);
    return {
      range: { from, to },
      commerce: finance ? await this.commerce(start, end) : null,
      cases: {
        open_disputes: openDisputes,
        unassigned_disputes: unassignedDisputes,
        open_support: openSupport,
        unassigned_support: unassignedSupport,
        open_reconciliation: openRecon,
        quarantined_webhooks_7d: quarantined,
        refunds_awaiting_approval: refundsWaiting,
        payouts_awaiting_approval: payoutsWaiting,
      },
      generated_at: new Date().toISOString(),
    };
  }

  private async commerce(start: Date, end: Date) {
    const inRange = { gte: start, lt: end };
    const [paid, refunds, payouts, payable] = await Promise.all([
      // Paid orders are those confirmed by a captured payment within the range.
      this.prisma.order.aggregate({
        where: { confirmedAt: inRange },
        _count: { _all: true },
        _sum: { totalFils: true, commissionFils: true },
      }),
      this.prisma.refund.aggregate({
        where: { state: 'SUCCEEDED', completedAt: inRange },
        _sum: { amountFils: true, commissionFils: true },
      }),
      this.prisma.payout.aggregate({
        where: { state: 'PAID', paidAt: inRange },
        _sum: { amountFils: true },
      }),
      // Outstanding seller payable right now: ledger credits less debits on that account.
      this.prisma.ledgerEntry.aggregate({
        where: { account: 'seller_payable' },
        _sum: { creditFils: true, debitFils: true },
      }),
    ]);
    const gmv = sum(paid._sum.totalFils);
    const refunded = sum(refunds._sum.amountFils);
    return {
      sandbox: this.env.PAYMENT_MODE !== 'live',
      paid_orders: paid._count._all,
      gmv_fils: gmv.toString(),
      refunds_fils: refunded.toString(),
      net_fils: (gmv - refunded).toString(),
      fee_revenue_fils: (
        sum(paid._sum.commissionFils) - sum(refunds._sum.commissionFils)
      ).toString(),
      seller_payable_pending_fils: (
        sum(payable._sum.creditFils) - sum(payable._sum.debitFils)
      ).toString(),
      seller_payable_settled_fils: sum(payouts._sum.amountFils).toString(),
    };
  }
}
