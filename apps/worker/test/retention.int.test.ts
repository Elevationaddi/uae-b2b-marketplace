/** Retention report (A13) against real PostgreSQL: counts only, never deletes. */
import { parseEnv } from '@app/config';
import { createPrismaClient } from '@app/db';
import { afterAll, describe, expect, it } from 'vitest';
import { runRetentionReport } from '../src/jobs';

describe('retention report', () => {
  const env = parseEnv({ ...process.env, NODE_ENV: 'test', LOG_LEVEL: 'silent' });
  const prisma = createPrismaClient(env.DATABASE_URL);
  afterAll(() => prisma.$disconnect());

  it('reports eligible documents, deletes nothing and audits the run', async () => {
    const before = await prisma.verificationDocument.count();
    // Far in the future, every rejected or abandoned case is past its cutoff.
    const future = new Date(Date.now() + 10 * 365 * 86400_000);
    const r = await runRetentionReport(prisma, env, future);
    expect(r.deletion_enabled).toBe(false);
    const rejected = await prisma.verificationCase.count({
      where: { state: 'REJECTED', decidedAt: { not: null } },
    });
    expect(r.rejected_cases).toBe(rejected);
    expect(r.rejected_documents).toBeGreaterThanOrEqual(0);
    expect(await prisma.verificationDocument.count()).toBe(before);
    const audit = await prisma.auditEvent.findFirst({
      where: { action: 'retention.report' },
      orderBy: { createdAt: 'desc' },
    });
    expect(audit).not.toBeNull();
  });
});
