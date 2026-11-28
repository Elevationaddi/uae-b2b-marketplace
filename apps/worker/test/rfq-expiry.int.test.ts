/** RFQ and quote expiry (docs/09-workflows.md) against real PostgreSQL. */
import { parseEnv } from '@app/config';
import { createPrismaClient, type PrismaClient } from '@app/db';
import { randomBytes, randomUUID } from 'node:crypto';
import { afterAll, describe, expect, it } from 'vitest';
import { runRfqExpiry } from '../src/jobs';

const env = parseEnv({ ...process.env, NODE_ENV: 'test', LOG_LEVEL: 'silent' });
const prisma: PrismaClient = createPrismaClient(env.DATABASE_URL);
afterAll(() => prisma.$disconnect());

async function company(kind: 'BUYER' | 'SELLER') {
  const user = await prisma.user.create({
    data: {
      email: `exp.${randomBytes(5).toString('hex')}@example.test`,
      emailVerifiedAt: new Date(),
    },
  });
  const c = await prisma.company.create({
    data: {
      legalName: 'Expiry Test LLC',
      displayName: 'Expiry Test',
      licenceNumber: `EXP-${randomBytes(5).toString('hex')}`,
      licenceIssuer: 'Test',
      licenceExpiry: new Date(Date.now() + 365 * 86400_000),
      activity: 'Trading',
      emirate: 'DUBAI',
      status: 'APPROVED',
      contactEmail: 'c@example.test',
      contactPhone: '+971500000000',
      createdById: user.id,
      workspaces: { create: { kind, status: 'ACTIVE' } },
    },
    include: { workspaces: true },
  });
  const ws = c.workspaces[0]!;
  await prisma.membership.create({
    data: { workspaceId: ws.id, userId: user.id, role: 'OWNER' },
  });
  return { company: c, ws, user };
}

async function rfq(buyer: Awaited<ReturnType<typeof company>>, deadline: Date) {
  const cat = await prisma.category.findFirstOrThrow({ where: { parentId: null } });
  return prisma.rfq.create({
    data: {
      number: `RFQ-T${randomBytes(4).toString('hex')}`,
      buyerWorkspaceId: buyer.ws.id,
      buyerCompanyId: buyer.company.id,
      createdById: buyer.user.id,
      title: 'Expiry test',
      categoryId: cat.id,
      specs: 'n/a',
      quantity: 1,
      unit: 'PIECE',
      targetDate: new Date(Date.now() + 30 * 86400_000),
      emirate: 'DUBAI',
      deadline,
      state: 'OPEN',
      publishedAt: new Date(),
    },
  });
}

async function submittedQuote(
  rfqId: string,
  seller: Awaited<ReturnType<typeof company>>,
  validUntil: Date,
) {
  const id = randomUUID();
  await prisma.quote.create({
    data: {
      id,
      rfqId,
      sellerWorkspaceId: seller.ws.id,
      sellerCompanyId: seller.company.id,
      createdById: seller.user.id,
      state: 'SUBMITTED',
    },
  });
  const v = await prisma.quoteVersion.create({
    data: {
      quoteId: id,
      version: 1,
      quantity: 1,
      unit: 'PIECE',
      unitPriceFils: 100n,
      subtotalFils: 100n,
      shippingFils: 0n,
      taxCode: 'ZERO_RATED',
      taxBps: 0,
      taxFils: 0n,
      totalFils: 100n,
      specs: 'n/a',
      leadDays: 1,
      deliveryDate: new Date(Date.now() + 10 * 86400_000),
      validUntil,
      state: 'SUBMITTED',
      submittedAt: new Date(Date.now() - 3600_000),
      createdById: seller.user.id,
    },
  });
  await prisma.quote.update({ where: { id }, data: { currentVersionId: v.id } });
  return { id, versionId: v.id };
}

describe('rfq expiry job', () => {
  it('expires lapsed quotes, then RFQs past deadline with no valid quote; keeps RFQs with valid quotes open', async () => {
    const buyer = await company('BUYER');
    const s1 = await company('SELLER');
    const s2 = await company('SELLER');
    const past = new Date(Date.now() - 60_000);
    const lapsedOnly = await rfq(buyer, past);
    const q1 = await submittedQuote(lapsedOnly.id, s1, new Date(Date.now() - 1000));
    const stillValid = await rfq(buyer, past);
    await submittedQuote(stillValid.id, s2, new Date(Date.now() + 86400_000));
    const empty = await rfq(buyer, past);
    const future = await rfq(buyer, new Date(Date.now() + 86400_000));

    const r = await runRfqExpiry(prisma);
    expect(r.quotes_expired).toBeGreaterThanOrEqual(1);
    expect((await prisma.quote.findUniqueOrThrow({ where: { id: q1.id } })).state).toBe('EXPIRED');
    expect(
      (await prisma.quoteVersion.findUniqueOrThrow({ where: { id: q1.versionId } })).state,
    ).toBe('EXPIRED');
    const states = await prisma.rfq.findMany({
      where: { id: { in: [lapsedOnly.id, stillValid.id, empty.id, future.id] } },
      select: { id: true, state: true },
    });
    const by = new Map(states.map((s) => [s.id, s.state]));
    expect(by.get(lapsedOnly.id)).toBe('EXPIRED');
    expect(by.get(empty.id)).toBe('EXPIRED');
    expect(by.get(stillValid.id)).toBe('OPEN');
    expect(by.get(future.id)).toBe('OPEN');
    const n = await prisma.notification.findMany({ where: { userId: buyer.user.id } });
    expect(n.map((x) => x.type)).toEqual(expect.arrayContaining(['quote.expired', 'rfq.expired']));
    // Idempotent: a second run changes nothing for these rows.
    await runRfqExpiry(prisma);
    expect((await prisma.rfq.findUniqueOrThrow({ where: { id: stillValid.id } })).state).toBe(
      'OPEN',
    );
  });
});
