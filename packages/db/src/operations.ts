import type { PrismaClient } from '@prisma/client';

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
