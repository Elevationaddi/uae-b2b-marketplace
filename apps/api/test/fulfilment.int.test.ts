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
  activeCommission,
  createSandboxPsp,
  dubaiWeekStart,
  processPendingPaymentEvents,
  proposeWeeklyPayouts,
  runSettlementSweep,
  signWebhook,
  submitApprovedSettlements,
  webhookSecret,
  type PrismaClient,
} from '@app/db';
import { randomBytes } from 'node:crypto';
import { authenticator } from 'otplib';
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

const DAY = 86_400_000;
const notice = (days: number) => new Date(Date.now() + days * DAY).toISOString();
/**
 * Test clock: move this order's verified delivery and dispute window into the past (as if the
 * 14 days had passed), then run the worker's settlement sweep for this order only.
 */
async function endDisputeWindow(id: string) {
  const o = await prisma.order.findUniqueOrThrow({ where: { id } });
  expect(o.deliveryVerifiedAt).not.toBeNull();
  await prisma.order.update({
    where: { id },
    data: {
      deliveryVerifiedAt: new Date(Date.now() - 15 * DAY),
      disputeWindowEndsAt: new Date(Date.now() - DAY),
    },
  });
  return runSettlementSweep(prisma, { orderIds: [id] });
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

  it('T25: seller processes, dispatches and delivers with proof; buyer confirms; eligible only after the window, not paid', async () => {
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
    // C-02: delivery with proof is verified delivery; the 14-day dispute window starts now.
    expect(d.fulfilment.delivery_verification).toBe('PROOF_OF_DELIVERY');
    const verifiedAt = Date.parse(d.fulfilment.delivery_verified_at);
    expect(Date.parse(d.fulfilment.dispute_window_ends_at) - verifiedAt).toBe(14 * DAY);

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
    // Buyer confirmation neither restarts nor waives the window (C-02).
    expect(bd.fulfilment.delivery_verification).toBe('PROOF_OF_DELIVERY');
    expect(Date.parse(bd.fulfilment.delivery_verified_at)).toBe(verifiedAt);

    // C-01: completed, but not eligible for a payout inside the dispute window.
    let after = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(after.settlementState).toBe('NOT_ELIGIBLE');
    let fin = (await s.client.get(`/seller/workspaces/${s.ws}/finance`).expect(200)).body.data;
    expect(fin.not_yet_eligible_fils).toBe(after.sellerPayableFils.toString());
    expect(fin.eligible_fils).toBe('0');

    // After the window: eligible for payout, but nothing is paid automatically.
    await endDisputeWindow(o.id);
    after = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(after.settlementState).toBe('ELIGIBLE');
    expect(await prisma.payout.count({ where: { sellerWorkspaceId: s.ws } })).toBe(0);
    fin = (await s.client.get(`/seller/workspaces/${s.ws}/finance`).expect(200)).body.data;
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
    // Released from the hold, but still inside the dispute window (C-01).
    expect((await prisma.order.findUniqueOrThrow({ where: { id: o.id } })).settlementState).toBe(
      'NOT_ELIGIBLE',
    );
    await endDisputeWindow(o.id);
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
    // Count only this order's journals (refund journals carry the order's checkout id): other test
    // files share the database and may post journals while this test runs.
    const ownJournals = { where: { checkoutId: o.checkoutId } };
    const journalsBefore = await prisma.ledgerJournal.count(ownJournals);
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
    expect(await prisma.ledgerJournal.count(ownJournals)).toBe(journalsBefore);
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
    await endDisputeWindow(o.id);
    const eligible = (await finance.get('/admin/payouts/eligible').expect(200)).body.data;
    const mine = eligible.find(
      (e: { seller_workspace_id: string }) => e.seller_workspace_id === s.ws,
    );
    expect(mine.amount_fils).toBe(o.sellerPayableFils.toString());

    const p = (await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(201)).body
      .data;
    expect(p.number).toMatch(/^PAY-/);
    expect(p.week_start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // One live payout per supplier per weekly run (C-04).
    const again = await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(409);
    expect(again.body.error.message_key).toBe('payout.already_in_run');
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

// ------------------------------------------------------------------ Phase 8 financial policies

async function deliverWithProof(s: Seller, id: string) {
  await s.client
    .post(`${sellerOrder(s, id)}/dispatch`, { carrier: 'Test Freight LLC' })
    .expect(200);
  await s.client
    .upload(`${sellerOrder(s, id)}/deliver`, {}, { name: 'pod.pdf', content: SAMPLE_PDF })
    .expect(200);
}

const settlementOf = async (id: string) =>
  (await prisma.order.findUniqueOrThrow({ where: { id } })).settlementState;

describe('Phase 8: dispute window after verified delivery (C-02)', () => {
  it('without proof the window starts at buyer receipt; after it, disputes are refused', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    await s.client
      .post(`${sellerOrder(s, o.id)}/dispatch`, { carrier: 'Test Freight' })
      .expect(200);
    // Delivered without proof: not verified, no window yet.
    let d = (await s.client.post(`${sellerOrder(s, o.id)}/deliver`, {}).expect(200)).body.data;
    expect(d.fulfilment.delivery_verified_at).toBeNull();
    expect(d.fulfilment.dispute_window_ends_at).toBeNull();
    // An unverified delivery is never auto-completed or paid out, however long ago.
    await prisma.order.update({ where: { id: o.id }, data: { deliveredAt: new Date(0) } });
    expect(await runSettlementSweep(prisma, { orderIds: [o.id] })).toEqual({
      auto_completed: 0,
      recomputed: 0,
    });
    d = (await b.client.post(`${buyerOrder(b, o.id)}/confirm-receipt`).expect(200)).body.data;
    expect(d.fulfilment.delivery_verification).toBe('BUYER_CONFIRMED');
    expect(
      Date.parse(d.fulfilment.dispute_window_ends_at) -
        Date.parse(d.fulfilment.delivery_verified_at),
    ).toBe(14 * DAY);
    expect(d.fulfilment.actions.can_dispute).toBe(true);
    await endDisputeWindow(o.id);
    d = (await b.client.get(buyerOrder(b, o.id)).expect(200)).body.data;
    expect(d.fulfilment.actions.can_dispute).toBe(false);
    const late = await b.client
      .post(`${buyerOrder(b, o.id)}/disputes`, { type: 'OTHER', reason: 'Too late' })
      .expect(409);
    expect(late.body.error.message_key).toBe('dispute.not_allowed');
  });
});

describe('Phase 8: auto-completion and settlement holds (C-01, C-03)', () => {
  it('completes a delivered order after the window unless a hold is active; holds block payouts', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    await deliverWithProof(s, o.id);
    expect(await settlementOf(o.id)).toBe('NOT_ELIGIBLE');

    const compliance = (await loggedInAdmin(app, env, prisma, ['COMPLIANCE'])).client;
    // Support cannot place holds; outsiders' order ids give 404.
    await support.post('/admin/holds', { order_id: o.id, kind: 'FRAUD', reason: 'x' }).expect(403);
    await compliance
      .post('/admin/holds', {
        order_id: '00000000-0000-4000-8000-000000000000',
        kind: 'FRAUD',
        reason: 'x',
      })
      .expect(404);
    const h = (
      await compliance
        .post('/admin/holds', {
          order_id: o.id,
          kind: 'COMPLIANCE',
          reason: 'Trade licence under review',
        })
        .expect(201)
    ).body.data;
    expect(h.settlement_state).toBe('HELD');
    const dup = await finance
      .post('/admin/holds', { order_id: o.id, kind: 'COMPLIANCE', reason: 'Again' })
      .expect(409);
    expect(dup.body.error.message_key).toBe('hold.exists');

    // The window ends, but the hold stops both auto-completion and the payout.
    expect((await endDisputeWindow(o.id)).auto_completed).toBe(0);
    let row = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(row.state).toBe('DELIVERED');
    expect(row.settlementState).toBe('HELD');
    await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(409);
    // A hold can only be released once, with a reason, and is never deleted.
    await compliance.post(`/admin/holds/${h.id}/release`, { reason: '' }).expect(422);
    const released = (
      await compliance
        .post(`/admin/holds/${h.id}/release`, { reason: 'Licence renewed' })
        .expect(200)
    ).body.data;
    expect(released.released_at).not.toBeNull();
    await compliance.post(`/admin/holds/${h.id}/release`, { reason: 'Again' }).expect(409);
    await expect(prisma.orderHold.delete({ where: { id: h.id } })).rejects.toThrow();

    const sweep = await runSettlementSweep(prisma, { orderIds: [o.id] });
    expect(sweep.auto_completed).toBe(1);
    row = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(row.state).toBe('COMPLETED');
    expect(row.settlementState).toBe('ELIGIBLE');
    expect(
      await prisma.orderEvent.count({ where: { orderId: o.id, kind: 'order.auto_completed' } }),
    ).toBe(1);
    // Idempotent: a second sweep changes nothing.
    expect(await runSettlementSweep(prisma, { orderIds: [o.id] })).toEqual({
      auto_completed: 0,
      recomputed: 0,
    });

    // A hold placed after the payout request makes approval fail until it is released.
    const p = (await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(201)).body
      .data;
    const fraud = (
      await finance
        .post('/admin/holds', { order_id: o.id, kind: 'FRAUD', reason: 'Card testing pattern' })
        .expect(201)
    ).body.data;
    expect(fraud.settlement_state).toBe('IN_PAYOUT');
    const held = await approver
      .post(`/admin/payouts/${p.id}/approve`, { reason: 'Checked' })
      .expect(409);
    expect(held.body.error.message_key).toBe('payout.order_held');
    await finance
      .post(`/admin/holds/${fraud.id}/release`, { reason: 'False positive' })
      .expect(200);
    await approver.post(`/admin/payouts/${p.id}/approve`, { reason: 'Checked' }).expect(200);
    const audit = await prisma.auditEvent.count({
      where: { resourceType: 'order_hold', resourceId: { in: [h.id, fraud.id] } },
    });
    expect(audit).toBe(4);
  });

  it('an open reconciliation case or a pending refund holds the payout until resolved', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    await shipAndComplete(s, b, o.id);
    await endDisputeWindow(o.id);
    expect(await settlementOf(o.id)).toBe('ELIGIBLE');

    // Pending refund: HELD; rejected: eligible again.
    const r = (
      await finance
        .post('/admin/refunds', { order_id: o.id, amount_fils: '500', reason: 'Goodwill' })
        .expect(201)
    ).body.data;
    expect(await settlementOf(o.id)).toBe('HELD');
    await approver.post(`/admin/refunds/${r.id}/reject`, { reason: 'Not agreed' }).expect(200);
    expect(await settlementOf(o.id)).toBe('ELIGIBLE');

    // An open case on the order's checkout holds it; only an approver can resolve it.
    const c = await prisma.reconciliationCase.create({
      data: { kind: 'AMOUNT_MISMATCH', checkoutId: o.checkoutId, details: { test: 'phase8' } },
    });
    await runSettlementSweep(prisma, { orderIds: [o.id] });
    expect(await settlementOf(o.id)).toBe('HELD');
    await finance
      .post(`/admin/finance/reconciliation/${c.id}/resolve`, { resolution: 'x' })
      .expect(403);
    await approver
      .post(`/admin/finance/reconciliation/${c.id}/resolve`, {
        resolution: 'Provider confirmed the captured amount',
      })
      .expect(200);
    expect(await settlementOf(o.id)).toBe('ELIGIBLE');
    await approver
      .post(`/admin/finance/reconciliation/${c.id}/resolve`, { resolution: 'Again' })
      .expect(409);
  });
});

describe('Phase 8: weekly payout run (C-04)', () => {
  it('one live payout per supplier per Dubai week; the run shows the available balance', async () => {
    const s = await seller();
    const b = await buyer();
    const first = await paidOrder(s, b);
    const second = await paidOrder(s, b);
    await shipAndComplete(s, b, first.id);
    await shipAndComplete(s, b, second.id);
    await endDisputeWindow(first.id);
    const p = (await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(201)).body
      .data;
    expect(p.order_count).toBe(1);
    await endDisputeWindow(second.id);
    expect(await settlementOf(second.id)).toBe('ELIGIBLE');
    const again = await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(409);
    expect(again.body.error.message_key).toBe('payout.already_in_run');
    const run = (await finance.get('/admin/payouts/run').expect(200)).body.data;
    expect(run.week_start).toBe(p.week_start);
    expect(run.payout_count).toBeGreaterThanOrEqual(1);
    expect(BigInt(run.available_fils) > 0n).toBe(true);
    expect(run.sandbox).toBe(true);
    // Once this week's payout is rejected, the supplier can be paid in this run.
    await approver.post(`/admin/payouts/${p.id}/reject`, { reason: 'Recheck' }).expect(200);
    const p2 = (await finance.post('/admin/payouts', { seller_workspace_id: s.ws }).expect(201))
      .body.data;
    expect(p2.order_count).toBe(2);
  });
});

describe('Phase 8: scheduled weekly payouts (Q9)', () => {
  it('proposes on the scheduled day, after a holiday; finance confirms and a second user approves', async () => {
    const s = await seller();
    const s2 = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const o2 = await paidOrder(s2, b);
    await shipAndComplete(s, b, o.id);
    await shipAndComplete(s2, b, o2.id);
    await endDisputeWindow(o.id);
    await endDisputeWindow(o2.id);

    // A random far-future week keeps this run separate from real and repeated test runs.
    const year = 2040 + Math.floor(Math.random() * 50);
    const monday = dubaiWeekStart(new Date(Date.UTC(year, Math.floor(Math.random() * 11), 10)));
    const date = monday.toISOString().slice(0, 10);
    await approver
      .post('/admin/payouts/holidays', { date, name: 'Test public holiday' })
      .expect(403);
    const h = (
      await finance
        .post('/admin/payouts/holidays', { date, name: 'Test public holiday' })
        .expect(201)
    ).body.data;
    expect(h.date).toBe(date);
    const dup = await finance
      .post('/admin/payouts/holidays', { date, name: 'Same day again' })
      .expect(409);
    expect(dup.body.error.message_key).toBe('payout_holiday.exists');
    await finance.post('/admin/payouts/holidays', { date: '2041-02-30', name: 'Bad' }).expect(422);
    const list = (await finance.get('/admin/payouts/holidays').expect(200)).body.data;
    expect(list.some((x: { date: string }) => x.date === date)).toBe(true);

    const cfg = { weekday: 1, time: '10:00' };
    const scope = { sellerWorkspaceIds: [s.ws, s2.ws] };
    // Monday is a holiday, so the run is due Tuesday 10:00 Dubai (06:00 UTC).
    const tuesday = monday.getTime() + DAY;
    const early = await proposeWeeklyPayouts(prisma, cfg, {
      ...scope,
      now: new Date(monday.getTime() + 7 * 3_600_000),
    });
    expect(early.week_start).toBeNull();
    const before = await proposeWeeklyPayouts(prisma, cfg, {
      ...scope,
      now: new Date(tuesday + 6 * 3_600_000 - 60_000),
    });
    expect(before.week_start).toBeNull();
    const due = await proposeWeeklyPayouts(prisma, cfg, {
      ...scope,
      now: new Date(tuesday + 6 * 3_600_000 + 60_000),
    });
    expect(due).toEqual({ week_start: date, proposed: 2, skipped: 0 });
    // Idempotent: the run is proposed once.
    const again = await proposeWeeklyPayouts(prisma, cfg, {
      ...scope,
      now: new Date(tuesday + 7 * 3_600_000),
    });
    expect(again.week_start).toBeNull();
    const run = await prisma.payoutRun.findUniqueOrThrow({ where: { weekStart: monday } });
    expect(run.scheduledFor?.toISOString()).toBe(new Date(tuesday + 6 * 3_600_000).toISOString());
    expect(run.proposedCount).toBe(2);

    const proposed = (await finance.get('/admin/payouts?state=PROPOSED').expect(200)).body.data as {
      id: string;
      seller_workspace_id: string;
      requested_by: string | null;
    }[];
    const p = proposed.find((x) => x.seller_workspace_id === s.ws)!;
    const p2 = proposed.find((x) => x.seller_workspace_id === s2.ws)!;
    expect(p.requested_by).toBeNull();
    expect(await settlementOf(o.id)).toBe('IN_PAYOUT');

    // The schedule never bypasses dual control: a proposal cannot be approved directly.
    const direct = await approver
      .post(`/admin/payouts/${p.id}/approve`, { reason: 'Skip confirmation' })
      .expect(409);
    expect(direct.body.error.message_key).toBe('payout.invalid_transition');
    await approver.post(`/admin/payouts/${p.id}/confirm`).expect(403);
    const confirmed = (await finance.post(`/admin/payouts/${p.id}/confirm`).expect(200)).body.data;
    expect(confirmed.state).toBe('REQUESTED');
    expect(confirmed.requested_by_me).toBe(true);
    await finance.post(`/admin/payouts/${p.id}/confirm`).expect(409);
    const approved = (
      await approver.post(`/admin/payouts/${p.id}/approve`, { reason: 'Checked' }).expect(200)
    ).body.data;
    expect(approved.state).toBe('APPROVED');

    // Withdrawing a proposal records the reason and releases its order.
    await finance.post(`/admin/payouts/${p2.id}/withdraw`, { reason: '' }).expect(422);
    const withdrawn = (
      await finance
        .post(`/admin/payouts/${p2.id}/withdraw`, { reason: 'Supplier bank details under review' })
        .expect(200)
    ).body.data;
    expect(withdrawn.state).toBe('REJECTED');
    expect(await settlementOf(o2.id)).toBe('ELIGIBLE');
    await finance.post(`/admin/payouts/${p2.id}/withdraw`, { reason: 'Again' }).expect(409);
    const audit = await prisma.auditEvent.findFirst({
      where: { action: 'payout.proposed', resourceId: p.id, actorType: 'system' },
    });
    expect(audit).not.toBeNull();

    const summary = (await finance.get('/admin/payouts/run').expect(200)).body.data;
    expect(summary.schedule).toEqual({ weekday: 1, time: '10:00' });
    expect(new Date(summary.scheduled_for).getUTCHours()).toBe(6);

    await finance.delete(`/admin/payouts/holidays/${date}`).expect(200);
    await finance.delete(`/admin/payouts/holidays/${date}`).expect(404);
  });
});

describe('Phase 8: refund split and merchandise-only commission (C-06)', () => {
  it('a delivery refund reverses no commission; splits must fit each part', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const bad = await finance
      .post('/admin/refunds', {
        order_id: o.id,
        amount_fils: '5250',
        reason: 'Delivery refund',
        merchandise_fils: '0',
        shipping_fils: '5000',
      })
      .expect(422);
    expect(bad.body.error.field_errors.tax_fils).toBe('required');
    const mismatch = await finance
      .post('/admin/refunds', {
        order_id: o.id,
        amount_fils: '5250',
        reason: 'Delivery refund',
        merchandise_fils: '0',
        shipping_fils: '5000',
        tax_fils: '200',
      })
      .expect(422);
    expect(mismatch.body.error.field_errors.amount_fils).toBe('split_mismatch');
    const tooMuch = await finance
      .post('/admin/refunds', {
        order_id: o.id,
        amount_fils: (o.shippingFils + 1n).toString(),
        reason: 'Delivery refund',
        merchandise_fils: '0',
        shipping_fils: (o.shippingFils + 1n).toString(),
        tax_fils: '0',
      })
      .expect(409);
    expect(tooMuch.body.error.message_key).toBe('refund.exceeds_component');
    const deliveryVat = o.shippingFils / 20n; // 5% VAT on delivery
    const r = (
      await finance
        .post('/admin/refunds', {
          order_id: o.id,
          amount_fils: (o.shippingFils + deliveryVat).toString(),
          reason: 'Delivery was free',
          merchandise_fils: '0',
          shipping_fils: o.shippingFils.toString(),
          tax_fils: deliveryVat.toString(),
        })
        .expect(201)
    ).body.data;
    expect(r.commission_fils).toBe('0');
    expect(r.shipping_fils).toBe(o.shippingFils.toString());
    // The rest, unsplit, is merchandise and its VAT, and reverses the whole commission.
    const rest = o.totalFils - o.shippingFils - deliveryVat;
    const r2 = (
      await finance
        .post('/admin/refunds', { order_id: o.id, amount_fils: rest.toString(), reason: 'Rest' })
        .expect(201)
    ).body.data;
    expect(r2.merchandise_fils).toBe(o.merchandiseFils.toString());
    expect(r2.shipping_fils).toBe('0');
    expect(r2.commission_fils).toBe(o.commissionFils.toString());
  });
});

describe('Phase 8: commission policy (C-05)', () => {
  it('only a finance approver with a fresh TOTP code records a version; new orders record it', async () => {
    // Uses the approved 10% rate so parallel tests that expect 10% are unaffected.
    const appr = await loggedInAdmin(app, env, prisma, ['FINANCE_APPROVER']);
    const code = (step: -1 | 1) =>
      authenticator.clone({ epoch: Date.now() + step * 30_000 }).generate(appr.secret);
    const before = (await finance.get('/admin/finance/commission').expect(200)).body.data;
    expect(before.can_manage).toBe(false);
    await finance
      .post('/admin/finance/commission', {
        rate_bps: 1000,
        reason: 'x',
        totp_code: '123456',
        effective_from: notice(31),
      })
      .expect(403);
    const wrong = await appr.client
      .post('/admin/finance/commission', {
        rate_bps: 1000,
        reason: 'Founder decision',
        totp_code: '000000',
        effective_from: notice(31),
      })
      .expect(422);
    expect(wrong.body.error.field_errors.totp_code).toBe('invalid');
    await appr.client
      .post('/admin/finance/commission', {
        rate_bps: 5001,
        reason: 'x',
        totp_code: code(1),
        effective_from: notice(31),
      })
      .expect(422);
    // FD-05: less than 30 days' notice is refused (before the TOTP code is used).
    const short = await appr.client
      .post('/admin/finance/commission', {
        rate_bps: 1000,
        reason: 'Too soon',
        totp_code: code(-1),
        effective_from: notice(29),
      })
      .expect(422);
    expect(short.body.error.message_key).toBe('commission.notice_too_short');
    const s = await seller();
    const scheduled = (
      await appr.client
        .post('/admin/finance/commission', {
          rate_bps: 1000,
          reason: 'Founder decision of 28 Nov 2026: 10% of merchandise',
          totp_code: code(1),
          effective_from: notice(31),
        })
        .expect(200)
    ).body.data;
    expect(scheduled.can_manage).toBe(true);
    expect(scheduled.notice_days).toBe(30);
    expect(scheduled.history[0].scheduled).toBe(true);
    // Not in effect until its date; suppliers' finance users were notified.
    expect(scheduled.current.version).not.toBe(scheduled.history[0].version);
    const notes = (await s.client.get('/notifications').expect(200)).body.data;
    const note = notes.find((n: { type: string }) => n.type === 'commission.change_scheduled');
    expect(note?.payload.rate).toBe('10%');
    // Test clock: from its effective date the new version prices checkouts.
    const v = scheduled.history[0];
    const later = await activeCommission(
      prisma,
      env.COMMISSION_BPS ?? 1000,
      new Date(Date.parse(v.effective_from) + 60_000),
    );
    expect(later).toMatchObject({ bps: 1000, version: v.version, policyId: v.id });
    const after = scheduled;
    expect(after.history[0].base).toBe('MERCHANDISE_EX_VAT_DELIVERY');
    // Append-only at the database level.
    await expect(
      prisma.commissionPolicy.update({
        where: { id: after.history[0].id },
        data: { rateBps: 1 },
      }),
    ).rejects.toThrow();

    const b = await buyer();
    const o = await paidOrder(s, b);
    // The scheduled version is not in effect yet: the order uses the version in effect now, or
    // the configured fallback when none is (a fresh database).
    const inEffect = await prisma.commissionPolicy.findFirst({
      where: { effectiveFrom: { lte: new Date() } },
      orderBy: [{ effectiveFrom: 'desc' }, { version: 'desc' }],
    });
    expect(o.commissionPolicyId).toBe(inEffect?.id ?? null);
    expect(o.commissionPolicyId).not.toBe(v.id);
    const bps = inEffect?.rateBps ?? env.COMMISSION_BPS ?? 1000;
    expect(o.commissionBps).toBe(bps);
    expect(o.commissionFils).toBe((o.merchandiseFils * BigInt(bps)) / 10_000n);
  });
});
