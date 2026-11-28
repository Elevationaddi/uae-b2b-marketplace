/**
 * Phase 5 integration tests against PostgreSQL: unpaid ship attempt (T24), ship, proof and
 * receipt (T25), seller cannot confirm receipt (T26), dispute holds settlement (T27), refund
 * self-approval (T28), refund over the remaining capture (T29), duplicate and out-of-order
 * refund webhooks (T30), payout failure (T31), reviews (T39) and tenant isolation. Refunds and
 * payouts go through the labelled sandbox provider adapter only; nothing is marked paid by hand.
 */
import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import {
  completeSandboxSession,
  createSandboxPsp,
  processPendingPaymentEvents,
  signWebhook,
  submitApprovedSettlements,
  webhookSecret,
  type PrismaClient,
} from '@app/db';
import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  commerceFixtures,
  inDays,
  setupCommerce,
  type Buyer,
  type CommerceCtx,
  type Seller,
} from './commerce-fixtures';
import { Client, PASSWORD, SAMPLE_PDF, emailedToken, loggedInAdmin, uniqueEmail } from './helpers';

let app: INestApplication;
let env: AppEnv;
let prisma: PrismaClient;
let finance: Client;
let approver: Client;
let support: Client;

const ctx = {} as CommerceCtx;
const { seller, buyer, product, addToCart, checkoutFor, startPayment, deliverQueued, postWebhook } =
  commerceFixtures(ctx);

/** A CONFIRMED order: 100 cartons at AED 10 + AED 50 delivery + 5% VAT = AED 1,102.50. */
async function paidOrder(s: Seller, b: Buyer) {
  const p = await product(s, 500);
  await addToCart(b, p.skuId, 100).expect(201);
  const c = await checkoutFor(b);
  const sessionId = await startPayment(b, c.id);
  expect(await completeSandboxSession(prisma, sessionId, 'success')).toBe(true);
  await deliverQueued(sessionId);
  await processPendingPaymentEvents(prisma);
  const id = c.orders[0].id as string;
  const o = await prisma.order.findUniqueOrThrow({ where: { id } });
  expect(o.state).toBe('CONFIRMED');
  return o;
}

const sellerOrder = (s: Seller, id: string) => `/seller/workspaces/${s.ws}/orders/${id}`;
const buyerOrder = (b: Buyer, id: string) => `/buyer/workspaces/${b.ws}/orders/${id}`;

async function shipAndComplete(s: Seller, b: Buyer, id: string) {
  await s.client
    .post(`${sellerOrder(s, id)}/dispatch`, { carrier: 'Test Freight LLC', tracking_code: 'TF-1' })
    .expect(200);
  await b.client.post(`${buyerOrder(b, id)}/confirm-receipt`).expect(200);
}

/** Worker step + sandbox provider completion + signed webhook + exactly-once processing. */
async function settle(kind: 'refund' | 'payout', id: string, outcome: 'success' | 'failure') {
  await submitApprovedSettlements(prisma, createSandboxPsp(prisma, env));
  const row =
    kind === 'refund'
      ? await prisma.refund.findUniqueOrThrow({ where: { id } })
      : await prisma.payout.findUniqueOrThrow({ where: { id } });
  expect(row.providerRef).toMatch(kind === 'refund' ? /^rf_/ : /^po_/);
  await finance
    .post(`/admin/sandbox/operations/${row.providerRef}/complete`, { outcome })
    .expect(200);
  const op = await prisma.mockPspOperation.findUniqueOrThrow({ where: { id: row.providerRef! } });
  const events = op.outbox as unknown[];
  for (const e of events) {
    const body = JSON.stringify(e);
    await postWebhook(body, signWebhook(webhookSecret(env), body)).expect(200);
  }
  await prisma.mockPspOperation.update({ where: { id: op.id }, data: { outbox: [] } });
  await processPendingPaymentEvents(prisma);
  return events as { id: string; type: string; data: Record<string, string> }[];
}

beforeAll(async () => {
  Object.assign(ctx, await setupCommerce());
  ({ app, env, prisma } = ctx);
  finance = (await loggedInAdmin(app, env, prisma, ['FINANCE'])).client;
  approver = (await loggedInAdmin(app, env, prisma, ['FINANCE_APPROVER'])).client;
  support = (await loggedInAdmin(app, env, prisma, ['SUPPORT'])).client;
}, 180_000);

afterAll(async () => {
  await app?.close();
  await prisma?.$disconnect();
});

describe('T24–T26 fulfilment and receipt', () => {
  it('T24: an unpaid order cannot be processed or dispatched', async () => {
    const s = await seller();
    const b = await buyer();
    const p = await product(s, 100);
    await addToCart(b, p.skuId, 10).expect(201);
    const c = await checkoutFor(b);
    const id = c.orders[0].id;
    const r = await s.client
      .post(`${sellerOrder(s, id)}/dispatch`, { carrier: 'Test Freight' })
      .expect(409);
    expect(r.body.error.message_key).toBe('order.not_paid');
    await s.client.post(`${sellerOrder(s, id)}/process`).expect(409);
    expect(await prisma.shipment.count({ where: { orderId: id } })).toBe(0);
  });

  it('T25: seller processes, dispatches and delivers with proof; buyer confirms; eligible, not paid', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    let d = (await s.client.get(sellerOrder(s, o.id)).expect(200)).body.data;
    expect(d.fulfilment.actions.can_dispatch).toBe(true);
    expect(d.fulfilment.settlement_state).toBe('NOT_ELIGIBLE');

    await s.client.post(`${sellerOrder(s, o.id)}/process`).expect(200);
    d = (
      await s.client
        .post(`${sellerOrder(s, o.id)}/dispatch`, {
          carrier: 'Test Freight LLC',
          tracking_code: 'TF-123',
          expected_delivery_date: inDays(3),
        })
        .expect(200)
    ).body.data;
    expect(d.state).toBe('DISPATCHED');
    expect(d.fulfilment.shipment.carrier).toBe('Test Freight LLC');
    expect(d.fulfilment.shipment.items[0].quantity).toBe(100);
    // Dispatch twice is a conflict, not a second shipment.
    await s.client.post(`${sellerOrder(s, o.id)}/dispatch`, { carrier: 'Again' }).expect(409);

    d = (
      await s.client
        .upload(
          `${sellerOrder(s, o.id)}/deliver`,
          { note: 'Left with receiving desk' },
          { name: 'pod.pdf', content: SAMPLE_PDF },
        )
        .expect(200)
    ).body.data;
    expect(d.state).toBe('DELIVERED');
    expect(d.fulfilment.shipment.has_proof).toBe(true);

    // The buyer sees the shipment and can download the proof; never the commission.
    let bd = (await b.client.get(buyerOrder(b, o.id)).expect(200)).body.data;
    expect(bd.commission_fils).toBeNull();
    expect(bd.fulfilment.settlement_state).toBeNull();
    expect(bd.fulfilment.actions.can_confirm_receipt).toBe(true);
    const proof = await b.client.get(`${buyerOrder(b, o.id)}/proof`).expect(200);
    expect(proof.headers['content-type']).toContain('application/pdf');

    bd = (await b.client.post(`${buyerOrder(b, o.id)}/confirm-receipt`).expect(200)).body.data;
    expect(bd.state).toBe('COMPLETED');
    expect(bd.fulfilment.completed_at).not.toBeNull();
    expect(bd.events.map((e: { kind: string }) => e.kind)).toEqual(
      expect.arrayContaining([
        'order.processing',
        'order.dispatched',
        'order.delivered',
        'order.completed',
      ]),
    );
    await b.client.post(`${buyerOrder(b, o.id)}/confirm-receipt`).expect(409);

    // Eligible for payout, but nothing is paid automatically.
    const after = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(after.settlementState).toBe('ELIGIBLE');
    expect(await prisma.payout.count({ where: { sellerWorkspaceId: s.ws } })).toBe(0);
    const fin = (await s.client.get(`/seller/workspaces/${s.ws}/finance`).expect(200)).body.data;
    expect(fin.eligible_fils).toBe(after.sellerPayableFils.toString());
    expect(fin.paid_out_fils).toBe('0');
  });

  it('T26: a seller cannot confirm buyer receipt; a buyer viewer cannot either; outsiders get 404', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    await s.client
      .post(`${sellerOrder(s, o.id)}/dispatch`, { carrier: 'Test Freight' })
      .expect(200);
    // The seller's session against the buyer route: not a member of that workspace.
    const r = await s.client.post(`${buyerOrder(b, o.id)}/confirm-receipt`);
    expect([403, 404]).toContain(r.status);
    // A buyer from another company sees nothing.
    const other = await buyer();
    await other.client
      .post(`/buyer/workspaces/${other.ws}/orders/${o.id}/confirm-receipt`)
      .expect(404);
    await other.client.get(`/buyer/workspaces/${other.ws}/orders/${o.id}/proof`).expect(404);
    // A buyer VIEWER in the right workspace is forbidden.
    const viewer = await inviteBuyerViewer(b);
    await viewer.post(`${buyerOrder(b, o.id)}/confirm-receipt`).expect(403);
    const still = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(still.state).toBe('DISPATCHED');
  });
});

async function inviteBuyerViewer(b: Buyer): Promise<Client> {
  const email = uniqueEmail('viewer');
  await b.client.post(`/workspaces/${b.ws}/invitations`, { email, role: 'VIEWER' }).expect(201);
  const token = await emailedToken(prisma, email, 'invitation');
  const c = await new Client(app, env.WEB_ORIGIN).init();
  await c.post('/auth/register', { email, password: PASSWORD, full_name: 'Viewer' }).expect(202);
  await c
    .post('/auth/verify-email', { token: await emailedToken(prisma, email, 'verify_email') })
    .expect(200);
  await c.post('/auth/login', { email, password: PASSWORD }).expect(200);
  await c.refreshCsrf();
  await c.post('/invitations/accept', { token }).expect(200);
  return c;
}

describe('T27 disputes hold settlement', () => {
  it('a dispute after receipt holds eligibility, is visible to both parties and blocks payout', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    await shipAndComplete(s, b, o.id);
    const d = (
      await b.client
        .post(`${buyerOrder(b, o.id)}/disputes`, {
          type: 'DAMAGED',
          reason: 'Twelve cartons arrived crushed.',
        })
        .expect(201)
    ).body.data;
    expect(d.number).toMatch(/^DSP-/);
    expect(d.state).toBe('OPEN');
    // One active dispute per order.
    await s.client
      .post(`${sellerOrder(s, o.id)}/disputes`, { type: 'OTHER', reason: 'Counter claim.' })
      .expect(409);
    expect((await prisma.order.findUniqueOrThrow({ where: { id: o.id } })).settlementState).toBe(
      'HELD',
    );
    // Both participants see the case; the seller can answer with evidence.
    const sd = (await s.client.get(`/seller/workspaces/${s.ws}/disputes/${d.id}`).expect(200)).body
      .data;
    expect(sd.order_id).toBe(o.id);
    const withFile = (
      await s.client
        .upload(
          `/seller/workspaces/${s.ws}/disputes/${d.id}/messages`,
          { body: 'Packing photos attached.' },
          { name: 'packing.pdf', content: SAMPLE_PDF },
        )
        .expect(201)
    ).body.data;
    const fileId = withFile.messages.find((m: { file: unknown }) => m.file).file.id;
    await b.client.get(`/buyer/workspaces/${b.ws}/disputes/${d.id}/files/${fileId}`).expect(200);
    // Another tenant cannot see it.
    const other = await buyer();
    await other.client.get(`/buyer/workspaces/${other.ws}/disputes/${d.id}`).expect(404);
    await other.client
      .get(`/buyer/workspaces/${other.ws}/disputes/${d.id}/files/${fileId}`)
      .expect(404);

    // Held orders are not eligible for a payout.
    const eligible = (await finance.get('/admin/payouts/eligible').expect(200)).body.data;
    expect(
      eligible.find((e: { seller_workspace_id: string }) => e.seller_workspace_id === s.ws),
    ).toBeUndefined();
    await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(409);

    // Support handles it: assign, propose no action, close; eligibility returns.
    await finance.post(`/admin/disputes/${d.id}/assign`).expect(403);
    await support.post(`/admin/disputes/${d.id}/assign`).expect(200);
    await support
      .post(`/admin/disputes/${d.id}/propose`, { proposal: 'NO_ACTION', note: 'Within tolerance.' })
      .expect(200);
    const closed = (
      await support
        .post(`/admin/disputes/${d.id}/close`, { resolution: 'Closed with no refund.' })
        .expect(200)
    ).body.data;
    expect(closed.state).toBe('CLOSED');
    expect((await prisma.order.findUniqueOrThrow({ where: { id: o.id } })).settlementState).toBe(
      'ELIGIBLE',
    );
    // Closed disputes accept no more messages.
    await b.client
      .post(`/buyer/workspaces/${b.ws}/disputes/${d.id}/messages`, { body: 'One more thing' })
      .expect(409);
  });
});

describe('T28–T30 refunds through the sandbox provider', () => {
  it('T28: the requester cannot approve their own refund and no provider request is made', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const both = (await loggedInAdmin(app, env, prisma, ['FINANCE', 'FINANCE_APPROVER'])).client;
    const r = (
      await both
        .post('/admin/refunds', { order_id: o.id, amount_fils: '1000', reason: 'Goodwill credit' })
        .expect(201)
    ).body.data;
    expect(r.requested_by_me).toBe(true);
    const denied = await both
      .post(`/admin/refunds/${r.id}/approve`, { reason: 'Approving my own' })
      .expect(403);
    expect(denied.body.error.message_key).toBe('refund.self_approval');
    // FINANCE alone cannot approve; FINANCE_APPROVER alone cannot request.
    await finance.post(`/admin/refunds/${r.id}/approve`, { reason: 'x' }).expect(403);
    await approver
      .post('/admin/refunds', { order_id: o.id, amount_fils: '1', reason: 'x' })
      .expect(403);
    await submitApprovedSettlements(prisma, createSandboxPsp(prisma, env));
    const row = await prisma.refund.findUniqueOrThrow({ where: { id: r.id } });
    expect(row.state).toBe('REQUESTED');
    expect(row.providerRef).toBeNull();
    expect(await prisma.mockPspOperation.count({ where: { reference: row.number } })).toBe(0);
  });

  it('T29: refunds never exceed the remaining capture; nothing is posted to the ledger', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const journalsBefore = await prisma.ledgerJournal.count();
    const over = await finance
      .post('/admin/refunds', {
        order_id: o.id,
        amount_fils: (o.totalFils + 1n).toString(),
        reason: 'Too much',
      })
      .expect(409);
    expect(over.body.error.message_key).toBe('refund.exceeds_remaining');
    // A pending request counts against the remaining amount.
    await finance
      .post('/admin/refunds', { order_id: o.id, amount_fils: '100000', reason: 'Part' })
      .expect(201);
    await finance
      .post('/admin/refunds', {
        order_id: o.id,
        amount_fils: (o.totalFils - 100000n + 1n).toString(),
        reason: 'Rest plus one',
      })
      .expect(409);
    expect(await prisma.ledgerJournal.count()).toBe(journalsBefore);
  });

  it('T30: duplicate and out-of-order refund webhooks give one reversal and the provider state', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const amount = 11025n; // 10% of the order
    const r = (
      await finance
        .post('/admin/refunds', {
          order_id: o.id,
          amount_fils: amount.toString(),
          reason: 'Short shipment credit',
        })
        .expect(201)
    ).body.data;
    expect(r.commission_fils).toBe(((amount * o.commissionFils) / o.totalFils).toString());
    await approver.post(`/admin/refunds/${r.id}/approve`, { reason: 'Checked' }).expect(200);
    const events = await settle('refund', r.id, 'success');
    expect(events).toHaveLength(1);

    // Duplicate delivery of the same event: stored once.
    const body = JSON.stringify(events[0]);
    const dup = await postWebhook(body, signWebhook(webhookSecret(env), body)).expect(200);
    expect(dup.body.data.duplicate).toBe(true);
    // Out of order: a failure for an operation that already succeeded is ignored.
    const late = JSON.stringify({
      ...events[0]!,
      id: `evt_${randomBytes(8).toString('hex')}`,
      type: 'refund.failed',
      data: { ...events[0]!.data, failure_code: 'refund_declined' },
    });
    await postWebhook(late, signWebhook(webhookSecret(env), late)).expect(200);
    await processPendingPaymentEvents(prisma);

    const row = await prisma.refund.findUniqueOrThrow({ where: { id: r.id } });
    expect(row.state).toBe('SUCCEEDED');
    const journals = await prisma.ledgerJournal.findMany({
      where: { dedupeKey: `refund:${r.id}` },
      include: { entries: true },
    });
    expect(journals).toHaveLength(1);
    const entries = journals[0]!.entries;
    const credit = entries.find((e) => e.account === 'psp_clearing')!;
    expect(credit.creditFils).toBe(amount);
    const debits = entries.reduce((sum, e) => sum + e.debitFils, 0n);
    expect(debits).toBe(amount);
    const order = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(order.refundedFils).toBe(amount);
    const payment = await prisma.payment.findFirstOrThrow({ where: { checkoutId: o.checkoutId } });
    expect(payment.state).toBe('PARTIALLY_REFUNDED');
    expect(
      await prisma.reconciliationCase.count({
        where: { kind: 'REFUND_FAILED', details: { path: ['refund_number'], equals: r.number } },
      }),
    ).toBe(0);
  });
});

describe('Dispute resolved by a full refund', () => {
  it('refund proposal → dual-approved refund → provider success closes the dispute and cancels', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const d = (
      await b.client
        .post(`${buyerOrder(b, o.id)}/disputes`, {
          type: 'NOT_RECEIVED',
          reason: 'Nothing arrived.',
        })
        .expect(201)
    ).body.data;
    // A refund linked to a dispute needs a refund proposal first.
    await finance
      .post('/admin/refunds', {
        order_id: o.id,
        amount_fils: o.totalFils.toString(),
        reason: 'Too early',
        dispute_id: d.id,
      })
      .expect(409);
    await support.post(`/admin/disputes/${d.id}/assign`).expect(200);
    await support
      .post(`/admin/disputes/${d.id}/propose`, {
        proposal: 'REFUND',
        amount_fils: o.totalFils.toString(),
        note: 'Seller cannot show dispatch.',
      })
      .expect(200);
    // A refund proposal cannot be closed as "no action".
    await support.post(`/admin/disputes/${d.id}/close`, { resolution: 'x' }).expect(409);
    const r = (
      await finance
        .post('/admin/refunds', {
          order_id: o.id,
          amount_fils: o.totalFils.toString(),
          reason: 'Dispute outcome',
          dispute_id: d.id,
        })
        .expect(201)
    ).body.data;
    await approver.post(`/admin/refunds/${r.id}/approve`, { reason: 'Per dispute' }).expect(200);
    await settle('refund', r.id, 'success');

    const order = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(order.state).toBe('CANCELLED');
    expect(order.refundedFils).toBe(o.totalFils);
    const payment = await prisma.payment.findFirstOrThrow({ where: { checkoutId: o.checkoutId } });
    expect(payment.state).toBe('REFUNDED');
    const dd = (await b.client.get(`/buyer/workspaces/${b.ws}/disputes/${d.id}`).expect(200)).body
      .data;
    expect(dd.state).toBe('CLOSED');
    expect(dd.refunds[0].state).toBe('SUCCEEDED');
    // Nothing left to pay out for this order.
    expect(order.settlementState).toBe('NOT_ELIGIBLE');
  });
});

describe('T31 payouts', () => {
  it('dual-approved payout: failure leaves no paid label and opens a case; a retry pays', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    await shipAndComplete(s, b, o.id);
    const eligible = (await finance.get('/admin/payouts/eligible').expect(200)).body.data;
    const mine = eligible.find(
      (e: { seller_workspace_id: string }) => e.seller_workspace_id === s.ws,
    );
    expect(mine.amount_fils).toBe(o.sellerPayableFils.toString());

    const p = (await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(201)).body
      .data;
    expect(p.number).toMatch(/^PAY-/);
    await finance.post(`/admin/payouts/${p.id}/approve`, { reason: 'Mine' }).expect(403);
    await approver.post(`/admin/payouts/${p.id}/approve`, { reason: 'Checked' }).expect(200);
    await settle('payout', p.id, 'failure');

    const failed = await prisma.payout.findUniqueOrThrow({ where: { id: p.id } });
    expect(failed.state).toBe('FAILED');
    expect(failed.paidAt).toBeNull();
    expect((await prisma.order.findUniqueOrThrow({ where: { id: o.id } })).settlementState).toBe(
      'ELIGIBLE',
    );
    expect(
      await prisma.reconciliationCase.count({ where: { kind: 'PAYOUT_FAILED', state: 'OPEN' } }),
    ).toBeGreaterThan(0);
    expect(await prisma.ledgerJournal.count({ where: { dedupeKey: `payout:${p.id}` } })).toBe(0);
    let fin = (await s.client.get(`/seller/workspaces/${s.ws}/finance`).expect(200)).body.data;
    expect(fin.paid_out_fils).toBe('0');

    // A new payout request for the released orders succeeds.
    const p2 = (await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(201))
      .body.data;
    await approver.post(`/admin/payouts/${p2.id}/approve`, { reason: 'Retry' }).expect(200);
    await settle('payout', p2.id, 'success');
    expect((await prisma.payout.findUniqueOrThrow({ where: { id: p2.id } })).state).toBe('PAID');
    expect((await prisma.order.findUniqueOrThrow({ where: { id: o.id } })).settlementState).toBe(
      'PAID_OUT',
    );
    expect(await prisma.ledgerJournal.count({ where: { dedupeKey: `payout:${p2.id}` } })).toBe(1);
    fin = (await s.client.get(`/seller/workspaces/${s.ws}/finance`).expect(200)).body.data;
    expect(fin.paid_out_fils).toBe(o.sellerPayableFils.toString());
    // Paid-out orders accept neither refunds nor disputes.
    await finance
      .post('/admin/refunds', { order_id: o.id, amount_fils: '100', reason: 'Late' })
      .expect(409);
    await b.client
      .post(`${buyerOrder(b, o.id)}/disputes`, { type: 'OTHER', reason: 'Too late' })
      .expect(409);
  });
});

describe('T39 reviews', () => {
  it('rejects reviews before completion and duplicates; public view is anonymised; moderation', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const early = await b.client
      .post(`${buyerOrder(b, o.id)}/review`, { rating: 5, comment: 'Great' })
      .expect(409);
    expect(early.body.error.message_key).toBe('review.not_completed');
    await shipAndComplete(s, b, o.id);
    await b.client
      .post(`${buyerOrder(b, o.id)}/review`, { rating: 4, comment: 'Good packaging.' })
      .expect(201);
    const dup = await b.client
      .post(`${buyerOrder(b, o.id)}/review`, { rating: 1, comment: 'Changed my mind' })
      .expect(409);
    expect(dup.body.error.message_key).toBe('review.exists');

    const storefront = await prisma.storefront.findUniqueOrThrow({
      where: { sellerWorkspaceId: s.ws },
    });
    const pub = await new Client(app, env.WEB_ORIGIN).init();
    let reviews = (await pub.get(`/marketplace/suppliers/${storefront.id}/reviews`).expect(200))
      .body.data;
    expect(reviews.count).toBe(1);
    expect(reviews.average).toBe(4);
    expect(reviews.items[0].buyer_company_name).toBeNull();

    const moderator = (await loggedInAdmin(app, env, prisma, ['COMPLIANCE'])).client;
    const list = (await moderator.get('/admin/reviews').expect(200)).body.data;
    const item = list.find((r: { order_id: string }) => r.order_id === o.id);
    expect(item.buyer_company_name).not.toBeNull();
    await support.post(`/admin/reviews/${item.id}/hide`, { reason: 'x' }).expect(403);
    await moderator
      .post(`/admin/reviews/${item.id}/hide`, { reason: 'Contains contact details' })
      .expect(200);
    reviews = (await pub.get(`/marketplace/suppliers/${storefront.id}/reviews`).expect(200)).body
      .data;
    expect(reviews.count).toBe(0);
    // Content is immutable at the database level.
    await expect(
      prisma.review.update({ where: { id: item.id }, data: { rating: 1 } }),
    ).rejects.toThrow();
  });
});
