/**
 * FD-09 integration tests against PostgreSQL: buyer cancellation requests after payment and before
 * dispatch. Ready stock goes to refund review (finance approves a full refund); custom or
 * made-to-order goods go to the supplier first and are never refunded automatically.
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
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomBytes } from 'node:crypto';
import {
  commerceFixtures,
  inDays,
  inHours,
  key,
  setupCommerce,
  type Buyer,
  type CommerceCtx,
  type Seller,
} from './commerce-fixtures';
import { Client, loggedInAdmin } from './helpers';

let app: INestApplication;
let env: AppEnv;
let prisma: PrismaClient;
let finance: Client;
let approver: Client;

const ctx = {} as CommerceCtx;
const { seller, buyer, product, addToCart, checkoutFor, startPayment, deliverQueued, postWebhook } =
  commerceFixtures(ctx);

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

async function settleRefund(id: string, outcome: 'success' | 'failure') {
  await submitApprovedSettlements(prisma, createSandboxPsp(prisma, env));
  const row = await prisma.refund.findUniqueOrThrow({ where: { id } });
  await finance
    .post(`/admin/sandbox/operations/${row.providerRef}/complete`, { outcome })
    .expect(200);
  const op = await prisma.mockPspOperation.findUniqueOrThrow({ where: { id: row.providerRef! } });
  for (const e of op.outbox as unknown[]) {
    const body = JSON.stringify(e);
    await postWebhook(body, signWebhook(webhookSecret(env), body)).expect(200);
  }
  await prisma.mockPspOperation.update({ where: { id: op.id }, data: { outbox: [] } });
  await processPendingPaymentEvents(prisma);
}

beforeAll(async () => {
  Object.assign(ctx, await setupCommerce());
  ({ app, env, prisma } = ctx);
  finance = (await loggedInAdmin(app, env, prisma, ['FINANCE'])).client;
  approver = (await loggedInAdmin(app, env, prisma, ['FINANCE_APPROVER'])).client;
}, 180_000);

afterAll(async () => {
  await app?.close();
  await prisma?.$disconnect();
});

describe('FD-09: buyer cancellation of ready stock', () => {
  it('goes to refund review, blocks fulfilment, and cancels only after approval and provider success', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    const path = `${buyerOrder(b, o.id)}/cancel-request`;

    const before = (await b.client.get(buyerOrder(b, o.id)).expect(200)).body.data;
    expect(before.fulfilment.actions.can_request_cancel).toBe(true);
    await b.client.post(path, { reason: '' }).expect(422);
    // Other buyers and the supplier cannot use the buyer route.
    const other = await buyer();
    await other.client
      .post(`${buyerOrder(other, o.id)}/cancel-request`, { reason: 'Not mine.' })
      .expect(404);
    await s.client
      .post(`/buyer/workspaces/${s.ws}/orders/${o.id}/cancel-request`, { reason: 'Seller.' })
      .expect((r) => expect([403, 404]).toContain(r.status));

    const res = (await b.client.post(path, { reason: 'Ordered the wrong size.' }).expect(200)).body
      .data;
    expect(res.fulfilment.buyer_cancel).toMatchObject({
      state: 'REFUND_REVIEW',
      custom: false,
      reason: 'Ordered the wrong size.',
    });
    expect(res.fulfilment.actions.can_request_cancel).toBe(false);
    const again = await b.client.post(path, { reason: 'Again.' }).expect(409);
    expect(again.body.error.message_key).toBe('order.cancellation_pending');

    const so = (await s.client.get(sellerOrder(s, o.id)).expect(200)).body.data;
    expect(so.fulfilment.actions.can_dispatch).toBe(false);
    expect(so.fulfilment.actions.can_decide_cancel).toBe(false);
    const dispatch = await s.client
      .post(`${sellerOrder(s, o.id)}/dispatch`, { carrier: 'Test Freight LLC' })
      .expect(409);
    expect(dispatch.body.error.message_key).toBe('order.cancellation_pending');
    const notes = (await s.client.get('/notifications').expect(200)).body.data;
    expect(notes.some((n: { type: string }) => n.type === 'order.buyer_cancel_requested')).toBe(
      true,
    );

    const refund = await prisma.refund.findFirstOrThrow({ where: { orderId: o.id } });
    expect(refund).toMatchObject({ buyerCancellation: true, state: 'REQUESTED' });
    expect(refund.amountFils).toBe(o.totalFils);
    expect((await prisma.order.findUniqueOrThrow({ where: { id: o.id } })).state).toBe('CONFIRMED');

    await approver
      .post(`/admin/refunds/${refund.id}/approve`, { reason: 'Before dispatch.' })
      .expect(200);
    await settleRefund(refund.id, 'success');
    const after = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(after.state).toBe('CANCELLED');
    expect(after.cancelReason).toBe('cancelled_by_buyer');
    expect(after.buyerCancelState).toBe('REFUNDED');
  });

  it('finance can refuse; the request is declined and fulfilment continues', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    await b.client
      .post(`${buyerOrder(b, o.id)}/cancel-request`, { reason: 'Budget changed.' })
      .expect(200);
    const refund = await prisma.refund.findFirstOrThrow({ where: { orderId: o.id } });
    await approver
      .post(`/admin/refunds/${refund.id}/reject`, { reason: 'Goods already packed.' })
      .expect(200);
    const bo = (await b.client.get(buyerOrder(b, o.id)).expect(200)).body.data;
    expect(bo.fulfilment.buyer_cancel).toMatchObject({
      state: 'DECLINED',
      decision_reason: 'Goods already packed.',
    });
    // One request per order.
    expect(bo.fulfilment.actions.can_request_cancel).toBe(false);
    const again = await b.client
      .post(`${buyerOrder(b, o.id)}/cancel-request`, { reason: 'Please.' })
      .expect(409);
    expect(again.body.error.message_key).toBe('order.cancel_already_requested');
    await s.client
      .post(`${sellerOrder(s, o.id)}/dispatch`, { carrier: 'Test Freight LLC' })
      .expect(200);
  });

  it('is refused after dispatch', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    await s.client
      .post(`${sellerOrder(s, o.id)}/dispatch`, { carrier: 'Test Freight LLC' })
      .expect(200);
    const r = await b.client
      .post(`${buyerOrder(b, o.id)}/cancel-request`, { reason: 'Too late?' })
      .expect(409);
    expect(r.body.error.message_key).toBe('order.cancel_after_dispatch');
  });
});

describe('FD-09: buyer cancellation of custom goods', () => {
  /** A paid quote order (awarded RFQ): custom goods agreed with the supplier. */
  async function madeToOrder(s: Seller, b: Buyer) {
    await product(s, 0);
    const draft = (
      await b.client
        .post(`/buyer/workspaces/${b.ws}/rfqs`, {
          title: `Custom cartons ${randomBytes(3).toString('hex')}`,
          category_id: ctx.categoryId,
          specs: 'Printed double wall cartons, 40x30x30 cm.',
          quantity: 100,
          unit: 'CARTON',
          target_date: inDays(30),
          emirate: 'DUBAI',
          deadline: inHours(72),
        })
        .expect(201)
    ).body.data;
    const rfq = (
      await b.client
        .post(`/buyer/workspaces/${b.ws}/rfqs/${draft.id}/publish`, {
          expected_version: draft.version,
        })
        .expect(200)
    ).body.data;
    const qd = (
      await s.client
        .post(`/seller/workspaces/${s.ws}/rfqs/${rfq.id}/quote`, {
          quantity: 100,
          unit: 'CARTON',
          unit_price_fils: '1000',
          shipping_fils: '5000',
          tax_code: 'STANDARD',
          specs: 'As specified.',
          lead_days: 10,
          delivery_date: inDays(20),
          valid_until: inHours(24 * 7),
        })
        .expect(201)
    ).body.data.quotes[0];
    const q = (
      await s.client
        .post(`/seller/workspaces/${s.ws}/quotes/${qd.id}/submit`, { expected_version: qd.version })
        .expect(200)
    ).body.data.quotes[0];
    const award = (
      await b.client
        .post(`/buyer/workspaces/${b.ws}/quotes/${q.id}/accept`, { version_id: q.current.id })
        .set('Idempotency-Key', key())
        .expect(200)
    ).body.data;
    const sid = await startPayment(b, award.checkout_id, { address_id: b.addressId });
    expect(await completeSandboxSession(prisma, sid, 'success')).toBe(true);
    await deliverQueued(sid);
    await processPendingPaymentEvents(prisma);
    const o = await prisma.order.findUniqueOrThrow({ where: { id: award.order_id as string } });
    expect(o.state).toBe('CONFIRMED');
    return o;
  }

  it('goes to the supplier; accepting only requests a refund for finance approval', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await madeToOrder(s, b);
    const res = (
      await b.client
        .post(`${buyerOrder(b, o.id)}/cancel-request`, { reason: 'Project cancelled.' })
        .expect(200)
    ).body.data;
    expect(res.fulfilment.buyer_cancel).toMatchObject({ state: 'SUPPLIER_REVIEW', custom: true });
    // Never refunded automatically: no refund exists until the supplier accepts.
    expect(await prisma.refund.count({ where: { orderId: o.id } })).toBe(0);

    const decision = `${sellerOrder(s, o.id)}/buyer-cancel/decision`;
    const so = (await s.client.get(sellerOrder(s, o.id)).expect(200)).body.data;
    expect(so.fulfilment.actions.can_decide_cancel).toBe(true);
    expect(so.fulfilment.actions.can_dispatch).toBe(false);
    // Declining needs a reason; another supplier gets 404.
    await s.client.post(decision, { accept: false }).expect(422);
    const other = await seller();
    await other.client
      .post(`${sellerOrder(other, o.id)}/buyer-cancel/decision`, { accept: true })
      .expect(404);

    const accepted = (await s.client.post(decision, { accept: true }).expect(200)).body.data;
    expect(accepted.fulfilment.buyer_cancel.state).toBe('REFUND_REVIEW');
    const refund = await prisma.refund.findFirstOrThrow({ where: { orderId: o.id } });
    expect(refund).toMatchObject({ buyerCancellation: true, state: 'REQUESTED' });
    await s.client.post(decision, { accept: true }).expect(409);
    const notes = (await b.client.get('/notifications').expect(200)).body.data;
    expect(notes.some((n: { type: string }) => n.type === 'order.cancel_refund_review')).toBe(true);
    expect((await prisma.order.findUniqueOrThrow({ where: { id: o.id } })).state).toBe('CONFIRMED');
  });

  it('the supplier can decline with a reason and continue fulfilment', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await madeToOrder(s, b);
    await b.client
      .post(`${buyerOrder(b, o.id)}/cancel-request`, { reason: 'No longer needed.' })
      .expect(200);
    const declined = (
      await s.client
        .post(`${sellerOrder(s, o.id)}/buyer-cancel/decision`, {
          accept: false,
          reason: 'Materials already cut to size.',
        })
        .expect(200)
    ).body.data;
    expect(declined.fulfilment.buyer_cancel).toMatchObject({
      state: 'DECLINED',
      decision_reason: 'Materials already cut to size.',
    });
    expect(declined.fulfilment.actions.can_dispatch).toBe(true);
    expect(await prisma.refund.count({ where: { orderId: o.id } })).toBe(0);
    const notes = (await b.client.get('/notifications').expect(200)).body.data;
    expect(notes.some((n: { type: string }) => n.type === 'order.cancel_declined')).toBe(true);
  });
});
