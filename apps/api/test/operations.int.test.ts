/**
 * Phase 6 integration tests against PostgreSQL: support tickets (lifecycle, assignment, tenant
 * isolation, append-only history), the operations overview (finance figures only for finance),
 * scoped CSV exports with step-up and audit (T41), marketing opt-in with critical notices kept
 * (T36) and an expired seller licence keeping existing orders workable (T35).
 */
import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import {
  autoCloseResolvedTickets,
  completeSandboxSession,
  expireExports,
  processPendingPaymentEvents,
  type PrismaClient,
} from '@app/db';
import { authenticator } from 'otplib';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  commerceFixtures,
  setupCommerce,
  type Buyer,
  type CommerceCtx,
  type Seller,
} from './commerce-fixtures';
import { loggedInAdmin, type Client } from './helpers';

let app: INestApplication;
let env: AppEnv;
let prisma: PrismaClient;

const ctx = {} as CommerceCtx;
const { seller, buyer, product, addToCart, checkoutFor, startPayment, deliverQueued } =
  commerceFixtures(ctx);

type Admin = { client: Client; secret: string; id: string };
const admins: Record<string, Admin> = {};

/**
 * A TOTP code from a neighbouring 30 s step. The login already used the current step's code and
 * the server blocks replays, but it accepts one step either side (window 1).
 */
function stepUp(a: Admin, step: -1 | 1) {
  return authenticator.clone({ epoch: Date.now() + step * 30_000 }).generate(a.secret);
}

async function paidOrder(s: Seller, b: Buyer) {
  const p = await product(s, 500);
  await addToCart(b, p.skuId, 100).expect(201);
  const c = await checkoutFor(b);
  const sessionId = await startPayment(b, c.id);
  expect(await completeSandboxSession(prisma, sessionId, 'success')).toBe(true);
  await deliverQueued(sessionId);
  await processPendingPaymentEvents(prisma);
  return prisma.order.findUniqueOrThrow({ where: { id: c.orders[0].id as string } });
}

async function ownerId(ws: string) {
  const m = await prisma.membership.findFirstOrThrow({ where: { workspaceId: ws, role: 'OWNER' } });
  return m.userId;
}

const support = (b: Buyer | Seller, rest = '') => `/workspaces/${b.ws}/support${rest}`;

beforeAll(async () => {
  Object.assign(ctx, await setupCommerce());
  ({ app, env, prisma } = ctx);
  for (const [name, roles] of [
    ['support', ['SUPPORT']],
    ['support2', ['SUPPORT']],
    ['finance', ['FINANCE']],
    ['finance2', ['FINANCE']],
    ['compliance', ['COMPLIANCE']],
  ] as const)
    admins[name] = await loggedInAdmin(app, env, prisma, [...roles]);
}, 180_000);

afterAll(async () => {
  await app?.close();
  await prisma?.$disconnect();
});

describe('support tickets', () => {
  it('runs the full lifecycle with assignment, notifications, audit and isolation', async () => {
    const b = await buyer();
    const other = await buyer();
    const s = await seller();
    const p = await product(s, 100);
    await addToCart(b, p.skuId, 10).expect(201);
    const order = (await checkoutFor(b)).orders[0];

    // Linking someone else's order is indistinguishable from a missing one.
    const bad = await other.client
      .post(support(other), {
        category: 'ORDER',
        subject: 'Where is it',
        body: 'x',
        order_id: order.id,
      })
      .expect(422);
    expect(bad.body.error.field_errors.order_id).toBe('not_found');

    const created = (
      await b.client
        .post(support(b), {
          category: 'ORDER',
          subject: 'Delivery window',
          body: 'Can you confirm the delivery window?',
          order_id: order.id,
        })
        .expect(201)
    ).body.data;
    expect(created.number).toMatch(/^SUP-\d{6}$/);
    expect(created.state).toBe('OPEN');
    expect(created.order).toMatchObject({ id: order.id, number: order.number });
    expect(Object.keys(created.order).sort()).toEqual(['id', 'number', 'state', 'total_fils']);
    expect(created.can_reply).toBe(true);

    const list = (await b.client.get(support(b)).expect(200)).body;
    expect(list.data.map((t: { id: string }) => t.id)).toContain(created.id);
    // Tenant isolation: another company gets 404, not 403.
    await other.client.get(support(other, `/${created.id}`)).expect(404);
    await other.client.post(support(other, `/${created.id}/messages`), { body: 'hi' }).expect(404);
    await b.client.get(support(b, '/not-a-uuid')).expect(404);

    // Only support roles see the queue.
    await admins.finance!.client.get('/admin/support').expect(403);
    await admins.compliance!.client.get(`/admin/support/${created.id}`).expect(403);
    const q = (await admins.support!.client.get('/admin/support?assigned=unassigned').expect(200))
      .body;
    expect(q.data.find((t: { id: string }) => t.id === created.id)).toBeTruthy();

    // An agent must take the ticket before replying.
    await admins
      .support!.client.post(`/admin/support/${created.id}/messages`, { body: 'Hello' })
      .expect(403);
    let d = (await admins.support!.client.post(`/admin/support/${created.id}/assign`).expect(200))
      .body.data;
    expect(d.state).toBe('ASSIGNED');
    expect(d.assigned_to_me).toBe(true);
    await admins
      .support2!.client.post(`/admin/support/${created.id}/messages`, { body: 'Not mine' })
      .expect(403);

    d = (
      await admins
        .support!.client.post(`/admin/support/${created.id}/messages`, {
          body: 'Tomorrow between 9 and 12.',
        })
        .expect(201)
    ).body.data;
    expect(d.state).toBe('WAITING_CUSTOMER');
    const owner = await ownerId(b.ws);
    expect(
      await prisma.notification.count({ where: { userId: owner, type: 'support.replied' } }),
    ).toBe(1);

    // Customer sees the agent as "Support", never the agent's address.
    let c = (await b.client.get(support(b, `/${created.id}`)).expect(200)).body.data;
    expect(c.messages.at(-1)).toMatchObject({ author_side: 'ADMIN', author_name: 'Support' });

    c = (await b.client.post(support(b, `/${created.id}/messages`), { body: 'Thanks' }).expect(201))
      .body.data;
    expect(c.state).toBe('ASSIGNED');

    d = (
      await admins
        .support!.client.post(`/admin/support/${created.id}/resolve`, {
          body: 'Confirmed with the seller.',
        })
        .expect(200)
    ).body.data;
    expect(d.state).toBe('RESOLVED');
    c = (await b.client.get(support(b, `/${created.id}`)).expect(200)).body.data;
    expect(c).toMatchObject({ can_reply: false, can_reopen: true, can_close: true });
    await b.client.post(support(b, `/${created.id}/messages`), { body: 'More' }).expect(409);

    c = (await b.client.post(support(b, `/${created.id}/reopen`)).expect(200)).body.data;
    expect(c.state).toBe('ASSIGNED');
    await admins.support!.client.post(`/admin/support/${created.id}/resolve`).expect(200);
    c = (await b.client.post(support(b, `/${created.id}/close`)).expect(200)).body.data;
    expect(c.state).toBe('CLOSED');
    await admins.support!.client.post(`/admin/support/${created.id}/reopen`).expect(409);

    const actions = (
      await prisma.auditEvent.findMany({
        where: { resourceType: 'support_ticket', resourceId: created.id },
        orderBy: { createdAt: 'asc' },
      })
    ).map((e) => e.action);
    expect(actions).toEqual([
      'support.created',
      'support.assigned',
      'support.replied',
      'support.resolved',
      'support.reopened',
      'support.resolved',
      'support.closed',
    ]);

    // History is append-only at the database level.
    const m = await prisma.supportMessage.findFirstOrThrow({ where: { ticketId: created.id } });
    await expect(
      prisma.supportMessage.update({ where: { id: m.id }, data: { body: 'edited' } }),
    ).rejects.toThrow();
    await expect(prisma.supportMessage.delete({ where: { id: m.id } })).rejects.toThrow();
  });

  it('lets sellers open tickets and validates input', async () => {
    const s = await seller();
    await s.client.post(support(s), { category: 'NOPE', subject: 'x', body: 'y' }).expect(422);
    await s.client.post(support(s), { category: 'CATALOG', subject: '', body: 'y' }).expect(422);
    const t = (
      await s.client
        .post(support(s), { category: 'CATALOG', subject: 'Image upload', body: 'Fails at 9 MB' })
        .expect(201)
    ).body.data;
    expect(t.workspace_kind).toBe('SELLER');
  });
});

describe('operations overview', () => {
  it('gives finance live commerce figures and others queue counts only', async () => {
    const before = (await admins.finance!.client.get('/admin/operations/overview').expect(200)).body
      .data;
    expect(before.commerce.sandbox).toBe(true);
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const after = (await admins.finance!.client.get('/admin/operations/overview').expect(200)).body
      .data;
    expect(after.commerce.paid_orders - before.commerce.paid_orders).toBeGreaterThanOrEqual(1);
    expect(
      BigInt(after.commerce.gmv_fils) - BigInt(before.commerce.gmv_fils),
    ).toBeGreaterThanOrEqual(o.totalFils);
    expect(BigInt(after.commerce.net_fils)).toBe(
      BigInt(after.commerce.gmv_fils) - BigInt(after.commerce.refunds_fils),
    );

    const sup = (await admins.support!.client.get('/admin/operations/overview').expect(200)).body
      .data;
    expect(sup.commerce).toBeNull();
    expect(typeof sup.cases.open_support).toBe('number');
    // A range in the past has no orders, so figures come from data, not constants.
    const old = (
      await admins
        .finance!.client.get('/admin/operations/overview?from=2020-01-01&to=2020-01-31')
        .expect(200)
    ).body.data;
    expect(old.commerce.paid_orders).toBe(0);
    expect(old.commerce.gmv_fils).toBe('0');
    await admins
      .finance!.client.get('/admin/operations/overview?from=2020-01-01&to=2022-01-31')
      .expect(422);
  });
});

describe('T41 scoped exports', () => {
  const body = (over: Record<string, unknown>) => ({
    report_type: 'orders',
    scope: 'all',
    from: '2026-01-01',
    to: '2026-12-31',
    reason: 'Monthly reconciliation',
    totp_code: '000000',
    ...over,
  });

  it('denies support outside its assigned scope and audits the attempt', async () => {
    const sup = admins.support!;
    for (const over of [
      { report_type: 'orders', scope: 'all' },
      { report_type: 'payouts', scope: 'all' },
      { report_type: 'disputes', scope: 'all' },
      { report_type: 'support_tickets', scope: 'all' },
    ]) {
      const r = await sup.client.post('/admin/exports', body(over)).expect(403);
      expect(r.body.error.message_key).toBe('export.scope_forbidden');
    }
    const denied = await prisma.auditEvent.findMany({
      where: { actorId: sup.id, action: 'export.denied' },
    });
    expect(denied.length).toBe(4);
    expect(denied[0]!.reason).toBe('Monthly reconciliation');
    expect(await prisma.exportJob.count({ where: { requestedById: sup.id } })).toBe(0);
    // Compliance has no export capability at all.
    await admins.compliance!.client.post('/admin/exports', body({})).expect(403);
  });

  it('exports only the tickets assigned to the requesting agent, after step-up', async () => {
    const b = await buyer();
    const mine = (
      await b.client
        .post(support(b), { category: 'OTHER', subject: '=HYPERLINK("x")', body: 'a' })
        .expect(201)
    ).body.data;
    const theirs = (
      await b.client
        .post(support(b), { category: 'OTHER', subject: 'Theirs', body: 'b' })
        .expect(201)
    ).body.data;
    await admins.support!.client.post(`/admin/support/${mine.id}/assign`).expect(200);
    await admins.support2!.client.post(`/admin/support/${theirs.id}/assign`).expect(200);

    const bad = await admins
      .support!.client.post(
        '/admin/exports',
        body({ report_type: 'support_tickets', scope: 'assigned', totp_code: '123456' }),
      )
      .expect(422);
    expect(bad.body.error.field_errors.totp_code).toBe('invalid');

    const e = (
      await admins
        .support!.client.post(
          '/admin/exports',
          body({
            report_type: 'support_tickets',
            scope: 'assigned',
            totp_code: stepUp(admins.support!, 1),
          }),
        )
        .expect(201)
    ).body.data;
    expect(e.state).toBe('READY');
    const csv = await admins.support!.client.get(`/admin/exports/${e.id}/download`).expect(200);
    expect(csv.headers['content-type']).toMatch(/^text\/csv/);
    const text = csv.text;
    expect(text.charCodeAt(0)).toBe(0xfeff);
    expect(text).toContain(mine.number);
    expect(text).not.toContain(theirs.number);
    // Formula cells are neutralised.
    expect(text).toContain(`"'=HYPERLINK(""x"")"`);
  });

  it('lets finance export, restricts download to the creator and expires content', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const fin = admins.finance!;
    const e = (
      await fin.client.post('/admin/exports', body({ totp_code: stepUp(fin, 1) })).expect(201)
    ).body.data;
    expect(e.row_count).toBeGreaterThanOrEqual(1);
    // Same code again is a replay.
    await fin.client.post('/admin/exports', body({ totp_code: stepUp(fin, 1) })).expect(422);

    const list = (await fin.client.get('/admin/exports').expect(200)).body.data;
    expect(list[0].id).toBe(e.id);
    expect(list[0]).not.toHaveProperty('content');
    expect((await admins.finance2!.client.get('/admin/exports').expect(200)).body.data).toEqual([]);
    await admins.finance2!.client.get(`/admin/exports/${e.id}/download`).expect(404);

    const csv = (await fin.client.get(`/admin/exports/${e.id}/download`).expect(200)).text;
    expect(csv.split('\r\n')[0]).toContain('order_number,state,created_at_utc');
    expect(csv).toContain(o.number);
    expect(csv).toContain('1102.50');

    const audit = await prisma.auditEvent.findMany({
      where: { resourceType: 'export', resourceId: e.id },
      orderBy: { createdAt: 'asc' },
    });
    expect(audit.map((a) => a.action)).toEqual(['export.created', 'export.downloaded']);
    expect(
      (await prisma.exportJob.findUniqueOrThrow({ where: { id: e.id } })).downloadedAt,
    ).not.toBeNull();

    await prisma.exportJob.update({
      where: { id: e.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    expect(await expireExports(prisma)).toBeGreaterThanOrEqual(1);
    const row = await prisma.exportJob.findUniqueOrThrow({ where: { id: e.id } });
    expect(row.state).toBe('EXPIRED');
    expect(row.content).toBeNull();
    await fin.client.get(`/admin/exports/${e.id}/download`).expect(409);

    await fin.client
      .post(
        '/admin/exports',
        body({ from: '2024-01-01', to: '2026-01-01', totp_code: stepUp(fin, -1) }),
      )
      .expect(422);
    await fin.client
      .post('/admin/exports', body({ from: '2026-02-01', to: '2026-01-01' }))
      .expect(422);
  });
});

describe('T36 marketing opt-in', () => {
  it('defaults marketing off, records consent and keeps critical notices', async () => {
    const b = await buyer();
    let p = (await b.client.get('/notifications/preferences').expect(200)).body.data;
    expect(p.email_marketing).toBe(false);
    p = (await b.client.patch('/notifications/preferences', { email_marketing: true }).expect(200))
      .body.data;
    expect(p.email_marketing).toBe(true);
    const owner = await ownerId(b.ws);
    let row = await prisma.notificationPreference.findUniqueOrThrow({ where: { userId: owner } });
    expect(row.marketingConsentAt).not.toBeNull();

    // Opt out of marketing and every optional email category.
    await b.client
      .patch('/notifications/preferences', {
        email_marketing: false,
        email_rfqs: false,
        email_quotes: false,
        email_messages: false,
      })
      .expect(200);
    row = await prisma.notificationPreference.findUniqueOrThrow({ where: { userId: owner } });
    expect(row.emailMarketing).toBe(false);
    expect(row.marketingConsentAt).toBeNull();

    // A support resolution is a critical notice: in-app and email both still arrive.
    const user = await prisma.user.findUniqueOrThrow({ where: { id: owner } });
    const t = (
      await b.client
        .post(support(b), { category: 'ACCOUNT', subject: 'Access', body: 'Help' })
        .expect(201)
    ).body.data;
    await admins.support!.client.post(`/admin/support/${t.id}/assign`).expect(200);
    const since = new Date();
    await admins
      .support!.client.post(`/admin/support/${t.id}/resolve`, { body: 'Done' })
      .expect(200);
    expect(
      await prisma.notification.count({ where: { userId: owner, type: 'support.resolved' } }),
    ).toBe(1);
    const mails = await prisma.outboxEvent.findMany({ where: { createdAt: { gte: since } } });
    expect(mails.some((m) => (m.payload as { to?: string }).to === user.email)).toBe(true);
  });
});

describe('T35 seller licence expiry', () => {
  it('restricts new trades but keeps existing orders accessible and shippable', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const p = await product(s, 100);
    await prisma.company.update({
      where: { id: s.companyId },
      data: { licenceExpiry: new Date(Date.now() - 2 * 86400_000) },
    });
    // New trade: the buyer can no longer add this seller's goods to a cart.
    const r = await addToCart(b, p.skuId, 5);
    expect(r.status).toBeGreaterThanOrEqual(400);
    expect(r.status).toBeLessThan(500);
    // Existing order: both sides can still read it and the seller can still ship it.
    await b.client.get(`/buyer/workspaces/${b.ws}/orders/${o.id}`).expect(200);
    await s.client.get(`/seller/workspaces/${s.ws}/orders/${o.id}`).expect(200);
    const d = (
      await s.client
        .post(`/seller/workspaces/${s.ws}/orders/${o.id}/dispatch`, { carrier: 'Test Freight LLC' })
        .expect(200)
    ).body.data;
    expect(d.state).toBe('DISPATCHED');
  });
});

describe('Phase 8 support rules (C-16, C-17)', () => {
  const ticket = (b: Buyer, category = 'OTHER') =>
    b.client.post(support(b), { category, subject: 'Help please', body: 'Details of the question.' });

  it('limits open tickets per company, lets urgent cases through and honours admin exceptions', async () => {
    const b = await buyer();
    for (let i = 0; i < 10; i++) await ticket(b).expect(201);
    const refused = await ticket(b).expect(409);
    expect(refused.body.error.message_key).toBe('support.too_many_open');
    // Urgent payment, security and compliance cases are never blocked.
    for (const c of ['PAYMENT', 'SECURITY', 'COMPLIANCE']) await ticket(b, c).expect(201);

    const sup = admins.support!.client;
    let l = (await sup.get(`/admin/companies/${b.companyId}/support-limit`).expect(200)).body.data;
    expect(l).toMatchObject({ limit: 10, default_limit: 10, exception: false, open_tickets: 13 });
    // Finance cannot change it (needs admin.support.manage).
    await admins.finance!.client
      .post(`/admin/companies/${b.companyId}/support-limit`, { limit: 20, reason: 'Big account' })
      .expect(403);
    await sup
      .post(`/admin/companies/${b.companyId}/support-limit`, { limit: 0, reason: 'Big account' })
      .expect(422);
    l = (
      await sup
        .post(`/admin/companies/${b.companyId}/support-limit`, {
          limit: 15,
          reason: 'Large buyer onboarding many sites',
        })
        .expect(200)
    ).body.data;
    expect(l).toMatchObject({ limit: 15, exception: true });
    await ticket(b).expect(201);
    const audit = await prisma.auditEvent.findFirst({
      where: { action: 'support.limit_changed', resourceId: b.companyId },
    });
    expect(audit?.reason).toBe('Large buyer onboarding many sites');
    l = (
      await sup
        .post(`/admin/companies/${b.companyId}/support-limit`, {
          limit: null,
          reason: 'Onboarding finished',
        })
        .expect(200)
    ).body.data;
    expect(l).toMatchObject({ limit: 10, exception: false });
  });

  it('closes resolved tickets after 7 days without a customer response', async () => {
    const b = await buyer();
    const silent = (await ticket(b).expect(201)).body.data;
    const answered = (await ticket(b).expect(201)).body.data;
    const sup = admins.support!.client;
    for (const t of [silent, answered]) {
      await sup.post(`/admin/support/${t.id}/assign`).expect(200);
      await sup.post(`/admin/support/${t.id}/resolve`, { body: 'Done.' }).expect(200);
    }
    // The customer reopens one; only the silent one stays resolved.
    await b.client.post(support(b, `/${answered.id}/reopen`)).expect(200);
    const eightDaysAgo = new Date(Date.now() - 8 * 86_400_000);
    await prisma.supportTicket.updateMany({
      where: { id: { in: [silent.id, answered.id] } },
      data: { resolvedAt: eightDaysAgo },
    });
    expect(await autoCloseResolvedTickets(prisma)).toBeGreaterThanOrEqual(1);
    const rows = await prisma.supportTicket.findMany({
      where: { id: { in: [silent.id, answered.id] } },
    });
    expect(rows.find((r) => r.id === silent.id)?.state).toBe('CLOSED');
    expect(rows.find((r) => r.id === answered.id)?.state).not.toBe('CLOSED');
    const audit = await prisma.auditEvent.findFirst({
      where: { action: 'support.auto_closed', resourceId: silent.id },
    });
    expect(audit?.actorType).toBe('system');
  });
});
