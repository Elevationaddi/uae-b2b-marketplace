import type { PrismaClient } from '@prisma/client';
import { writeAudit } from './audit';

/**
 * Expire report exports past their retention window: the CSV bytes are deleted, the row (who
 * exported what, when and why) stays for audit. Run by the worker (export.cleanup).
 */
export async function expireExports(prisma: PrismaClient, now: Date = new Date()): Promise<number> {
  const r = await prisma.exportJob.updateMany({
    where: { state: 'READY', expiresAt: { lte: now } },
    data: { state: 'EXPIRED', content: null },
  });
  return r.count;
}

/** Days a resolved support ticket waits for a customer response before closing (C-16). */
export const SUPPORT_AUTO_CLOSE_DAYS = 7;

/**
 * Close resolved support tickets that had no customer response for 7 days (founder decision,
 * C-16). A customer who answers or reopens moves the ticket out of RESOLVED, so only silent tickets
 * close. Each closure is audited as a system action. Run by the worker (support.auto_close).
 */
export async function autoCloseResolvedTickets(
  prisma: PrismaClient,
  now: Date = new Date(),
  batch = 200,
): Promise<number> {
  const cutoff = new Date(now.getTime() - SUPPORT_AUTO_CLOSE_DAYS * 86_400_000);
  const due = await prisma.supportTicket.findMany({
    where: { state: 'RESOLVED', resolvedAt: { lte: cutoff } },
    select: { id: true, companyId: true, number: true },
    orderBy: { resolvedAt: 'asc' },
    take: batch,
  });
  let closed = 0;
  for (const t of due) {
    await prisma.$transaction(async (tx) => {
      const r = await tx.supportTicket.updateMany({
        where: { id: t.id, state: 'RESOLVED', resolvedAt: { lte: cutoff } },
        data: { state: 'CLOSED', closedAt: now, version: { increment: 1 } },
      });
      if (r.count === 0) return;
      closed++;
      await writeAudit(tx, {
        actorId: null,
        actorType: 'system',
        action: 'support.auto_closed',
        resourceType: 'support_ticket',
        resourceId: t.id,
        companyId: t.companyId,
        details: { number: t.number, days: SUPPORT_AUTO_CLOSE_DAYS },
      });
    });
  }
  return closed;
}
