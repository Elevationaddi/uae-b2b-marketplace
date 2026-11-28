/**
 * Phase 8 integration tests against PostgreSQL for supplier cancellation (C-07) and the supplier
 * return policy (C-11). A supplier cancellation is a full refund that finance must approve; the
 * order is only cancelled once the sandbox provider reports the refund as succeeded.
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
import {
  commerceFixtures,
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
const {
  seller,
  buyer,
  product,
  addToCart,
  preview,
  checkoutFor,
  startPayment,
  deliverQueued,
  postWebhook,
} = commerceFixtures(ctx);

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

describe('Phase 8: supplier cancellation (C-07)', () => {
  it('the supplier requests a full refund; fulfilment stops; finance approval and provider success cancel', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);

    // Reason is required; the buyer and other suppliers cannot cancel through this route.
    await s.client.post(`${sellerOrder(s, o.id)}/cancel`, { reason: '' }).expect(422);
    const other = await seller();
    await other.client
      .post(`${sellerOrder(other, o.id)}/cancel`, { reason: 'Not my order at all.' })
      .expect(404);
    await b.client
      .post(`/seller/workspaces/${b.ws}/orders/${o.id}/cancel`, { reason: 'Buyer trying.' })
      .expect((r) => expect([403, 404]).toContain(r.status));

    const before = (await s.client.get(sellerOrder(s, o.id)).expect(200)).body.data;
    expect(before.fulfilment.actions.can_cancel).toBe(true);

    const res = (
      await s.client
        .post(`${sellerOrder(s, o.id)}/cancel`, { reason: 'Production line failure.' })
        .expect(200)
    ).body.data;
    expect(res.seller_cancel.reason).toBe('Production line failure.');
    expect(res.fulfilment.actions.can_cancel).toBe(false);
    expect(res.fulfilment.actions.can_dispatch).toBe(false);

    // A second request and any fulfilment step are refused while the cancellation is pending.
    const again = await s.client
      .post(`${sellerOrder(s, o.id)}/cancel`, { reason: 'Again please.' })
      .expect(409);
    expect(again.body.error.message_key).toBe('order.cancellation_pending');
    const dispatch = await s.client
      .post(`${sellerOrder(s, o.id)}/dispatch`, { carrier: 'Test Freight LLC', tracking_code: 'X' })
      .expect(409);
    expect(dispatch.body.error.message_key).toBe('order.cancellation_pending');

    const refund = await prisma.refund.findFirstOrThrow({ where: { orderId: o.id } });
    expect(refund.sellerCancellation).toBe(true);
    expect(refund.state).toBe('REQUESTED');
    expect(refund.amountFils).toBe(o.totalFils);

    // The buyer sees the pending cancellation and is notified.
    const bo = (await b.client.get(buyerOrder(b, o.id)).expect(200)).body.data;
    expect(bo.seller_cancel.reason).toBe('Production line failure.');
    const notes = (await b.client.get('/notifications').expect(200)).body.data;
    expect(notes.some((n: { type: string }) => n.type === 'order.supplier_cancelled')).toBe(true);

    // The order is not cancelled until finance approves and the provider confirms.
    expect((await prisma.order.findUniqueOrThrow({ where: { id: o.id } })).state).toBe('CONFIRMED');
    await approver
      .post(`/admin/refunds/${refund.id}/approve`, { reason: 'Supplier cannot fulfil.' })
      .expect(200);
    await settleRefund(refund.id, 'success');
    const after = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(after.state).toBe('CANCELLED');
    expect(after.cancelReason).toBe('cancelled_by_supplier');
    expect(after.refundedFils).toBe(o.totalFils);
    expect(after.settlementState).toBe('NOT_ELIGIBLE');

    const audit = await prisma.auditEvent.findFirst({
      where: { action: 'order.seller_cancel_requested', resourceId: o.id },
    });
    expect(audit).not.toBeNull();
  });

  it('finance rejection withdraws the request and fulfilment can continue', async () => {
    const s = await seller();
    const b = await buyer();
    const o = await paidOrder(s, b);
    await s.client.post(`${sellerOrder(s, o.id)}/process`).expect(200);
    await s.client
      .post(`${sellerOrder(s, o.id)}/cancel`, { reason: 'Raw materials delayed.' })
      .expect(200);
    const refund = await prisma.refund.findFirstOrThrow({ where: { orderId: o.id } });
    await approver
      .post(`/admin/refunds/${refund.id}/reject`, { reason: 'Supplier agreed a new date.' })
      .expect(200);
    const order = await prisma.order.findUniqueOrThrow({ where: { id: o.id } });
    expect(order.sellerCancelRequestedAt).toBeNull();
    expect(order.sellerCancelReason).toBeNull();
    expect(order.state).toBe('PROCESSING');
    const d = (await s.client.get(sellerOrder(s, o.id)).expect(200)).body.data;
    expect(d.seller_cancel).toBeNull();
    expect(d.fulfilment.actions.can_dispatch).toBe(true);
    await s.client
      .post(`${sellerOrder(s, o.id)}/dispatch`, { carrier: 'Test Freight LLC', tracking_code: 'Y' })
      .expect(200);
    // A dispatched order can no longer be cancelled by the supplier.
    const late = await s.client
      .post(`${sellerOrder(s, o.id)}/cancel`, { reason: 'Too late now.' })
      .expect(409);
    expect(late.body.error.message_key).toBe('order.invalid_transition');
  });

  it('an unpaid order cannot be cancelled by the supplier through a refund', async () => {
    const s = await seller();
    const b = await buyer();
    const p = await product(s, 500);
    await addToCart(b, p.skuId, 100).expect(201);
    const c = await checkoutFor(b);
    const id = c.orders[0].id as string;
    const r = await s.client
      .post(`${sellerOrder(s, id)}/cancel`, { reason: 'Changed my mind.' })
      .expect(409);
    expect(r.body.error.message_key).toBe('order.not_paid');
    expect(await prisma.refund.count({ where: { orderId: id } })).toBe(0);
  });
});

describe('Phase 8: supplier return policy (C-11)', () => {
  it('is shown at checkout and snapshotted on the order', async () => {
    const s = await seller();
    const b = await buyer();
    const p = await product(s, 500);

    // Without a policy, checkout says so (null).
    await addToCart(b, p.skuId, 100).expect(201);
    const none = await preview(b);
    expect(none.groups[0].return_policy).toBeNull();

    await s.client
      .patch(`/seller/workspaces/${s.ws}/storefront`, {
        return_policy_en: 'Returns accepted within 7 days for unopened cartons.',
        return_policy_ar: 'تقبل المرتجعات خلال 7 أيام للكراتين غير المفتوحة.',
      })
      .expect(200);
    const sf = (await s.client.get(`/seller/workspaces/${s.ws}/storefront`).expect(200)).body.data;
    expect(sf.return_policy_en).toMatch(/7 days/);

    const pv = await preview(b);
    expect(pv.groups[0].return_policy.en).toMatch(/unopened cartons/);
    expect(pv.preview_hash).not.toBe(none.preview_hash);
    const c = await checkoutFor(b);
    const id = c.orders[0].id as string;

    // Later edits do not change what the buyer agreed to.
    await s.client
      .patch(`/seller/workspaces/${s.ws}/storefront`, { return_policy_en: 'No returns at all.' })
      .expect(200);
    const bo = (await b.client.get(buyerOrder(b, id)).expect(200)).body.data;
    expect(bo.return_policy.en).toMatch(/unopened cartons/);
    expect(bo.return_policy.ar).toMatch(/7 أيام/);
  });
});
