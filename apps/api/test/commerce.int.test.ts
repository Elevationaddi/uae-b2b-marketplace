/**
 * Phase 4 integration tests against PostgreSQL: last-stock race (T11), price change after preview
 * (T12), multi-seller checkout (T13), return without webhook (T14), webhook replay (T15), invalid
 * signature and amount mismatch (T16), expiry with an unresolved provider session (T17), late
 * capture (T18), ledger fixture (T40), self-trade (T42), award to order, tenant isolation and
 * admin read scopes. Only the labelled sandbox payment adapter is used.
 */
import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import {
  completeSandboxSession,
  createSandboxPsp,
  expireCheckouts,
  processPendingPaymentEvents,
  signWebhook,
  webhookSecret,
  type PrismaClient,
} from '@app/db';
import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  commerceFixtures,
  inDays,
  inHours,
  key,
  setupCommerce,
  type CommerceCtx,
} from './commerce-fixtures';
import { Client, companyReadyToSubmit, loggedInAdmin, signedInUser } from './helpers';

let app: INestApplication;
let env: AppEnv;
let prisma: PrismaClient;
let compliance: Client;
let categoryId: string;
const ctx = {} as CommerceCtx;
const {
  approvedCompany,
  setupStorefront,
  product,
  seller,
  addAddress,
  buyer,
  addToCart,
  preview,
  createCheckout,
  checkoutFor,
  startPayment,
  postWebhook,
  deliverQueued,
  captureEvent,
  inventory,
} = commerceFixtures(ctx);

beforeAll(async () => {
  Object.assign(ctx, await setupCommerce());
  ({ app, env, prisma, compliance, categoryId } = ctx);
}, 180_000);

afterAll(async () => {
  await app?.close();
  await prisma?.$disconnect();
});

describe('T40 ledger fixture, T14 return without webhook, T15 replay', () => {
  it('prices, reserves, captures once and posts the exact docs/08-finance.md journal', async () => {
    const s = await seller();
    const p = await product(s, 500);
    const b = await buyer();
    await addToCart(b, p.skuId, 100).expect(201);

    const pv = await preview(b);
    expect(pv.blocked).toBe(false);
    expect(pv.merchandise_fils).toBe('100000');
    expect(pv.shipping_fils).toBe('5000');
    expect(pv.tax_fils).toBe('5250');
    expect(pv.total_fils).toBe('110250');
    // Default TAX_TREATMENT: every supplier at the labelled provisional rate (F05).
    expect(pv.tax_provisional).toBe(true);
    expect(pv.groups[0]).toMatchObject({ tax_code: 'PROVISIONAL_STANDARD', tax_bps: 500 });

    const c = (await createCheckout(b, pv.preview_hash).expect(201)).body.data;
    expect(c.state).toBe('PENDING_PAYMENT');
    expect(c.sandbox).toBe(true);
    expect(c.orders).toHaveLength(1);
    let inv = await inventory(p.skuId);
    expect([inv.onHand, inv.reserved, inv.sold]).toEqual([500, 100, 0]);
    // The cart is emptied by checkout.
    const cart = (await b.client.get(`/buyer/workspaces/${b.ws}/cart`).expect(200)).body.data;
    expect(cart.line_count).toBe(0);

    const sessionId = await startPayment(b, c.id);
    // Resuming returns the same open session.
    expect(await startPayment(b, c.id)).toBe(sessionId);
    expect(await completeSandboxSession(prisma, sessionId, 'success')).toBe(true);
    expect(await completeSandboxSession(prisma, sessionId, 'success')).toBe(false);

    // T14: the customer is back but no webhook has arrived: still pending, nothing confirmed.
    let view = (await b.client.get(`/buyer/workspaces/${b.ws}/checkouts/${c.id}`).expect(200)).body
      .data;
    expect(view.state).toBe('PENDING_PAYMENT');
    expect(view.orders[0].state).toBe('AWAITING_PAYMENT');

    // T15: the same event delivered three times is stored once and captured once.
    const s0 = await prisma.mockPspSession.findUniqueOrThrow({ where: { id: sessionId } });
    const body = JSON.stringify((s0.outbox as unknown[])[0]);
    const results = [];
    for (let i = 0; i < 3; i++)
      results.push(
        (await postWebhook(body, signWebhook(webhookSecret(env), body)).expect(200)).body.data,
      );
    expect(results.map((r) => r.duplicate)).toEqual([false, true, true]);
    await processPendingPaymentEvents(prisma);
    // A different event id for the same capture is ignored, not posted twice.
    const again = captureEvent(sessionId, c.number, '110250');
    await postWebhook(again, signWebhook(webhookSecret(env), again)).expect(200);
    const second = await processPendingPaymentEvents(prisma);
    expect(second.IGNORED).toBe(1);

    view = (await b.client.get(`/buyer/workspaces/${b.ws}/checkouts/${c.id}`).expect(200)).body
      .data;
    expect(view.state).toBe('PAID');
    expect(view.orders[0].state).toBe('CONFIRMED');
    inv = await inventory(p.skuId);
    expect([inv.onHand, inv.reserved, inv.sold]).toEqual([400, 0, 100]);

    const journals = await prisma.ledgerJournal.findMany({
      where: { checkoutId: c.id },
      include: { entries: true },
    });
    expect(journals).toHaveLength(1);
    const lines = journals[0]!.entries
      .map((e) => [e.account, e.debitFils.toString(), e.creditFils.toString()])
      .sort();
    expect(lines).toEqual([
      ['platform_fee_revenue', '0', '10000'],
      ['psp_clearing', '110250', '0'],
      ['seller_payable', '0', '100250'],
    ]);

    // Buyer never sees the commission; the seller sees its payable.
    const orderId = view.orders[0].id;
    const bo = (await b.client.get(`/buyer/workspaces/${b.ws}/orders/${orderId}`).expect(200)).body
      .data;
    expect(bo.commission_fils).toBeNull();
    expect(bo.total_fils).toBe('110250');
    expect(bo.address.emirate).toBe('DUBAI');
    const so = (await s.client.get(`/seller/workspaces/${s.ws}/orders/${orderId}`).expect(200)).body
      .data;
    expect(so.commission_fils).toBe('10000');
    expect(so.seller_payable_fils).toBe('100250');
    expect(so.events.map((e: { kind: string }) => e.kind)).toEqual(['order.created', 'order.paid']);

    // Notifications for both sides.
    const notes = await prisma.notification.findMany({
      where: {
        type: { in: ['order.paid', 'order.received'] },
        payload: { path: ['order_id'], equals: orderId },
      },
    });
    expect(new Set(notes.map((n) => n.type))).toEqual(new Set(['order.paid', 'order.received']));
  });
});

describe('T16 invalid signature and amount mismatch', () => {
  it('rejects and quarantines forged events; amount mismatch opens a case without capturing', async () => {
    const forged = captureEvent('ps_00000000000000000000000000000000', 'CHK-X', '1');
    const res = await postWebhook(forged, 't=1,v1=' + 'a'.repeat(64)).expect(422);
    expect(
      res.body.error.message_key ?? res.body.error.messageKey ?? JSON.stringify(res.body),
    ).toMatch(/invalid_signature/);
    await postWebhook(forged).expect(422);
    // A stale timestamp with a correct MAC is also refused.
    const old = Math.floor(Date.now() / 1000) - 3600;
    await postWebhook(forged, signWebhook(webhookSecret(env), forged, old)).expect(422);
    const quarantined = await prisma.paymentEvent.count({
      where: {
        signatureValid: false,
        status: 'QUARANTINED',
        receivedAt: { gte: new Date(Date.now() - 60_000) },
      },
    });
    expect(quarantined).toBeGreaterThanOrEqual(3);

    const s = await seller();
    const p = await product(s, 50);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);
    const c = await checkoutFor(b);
    const sessionId = await startPayment(b, c.id);
    const wrong = captureEvent(sessionId, c.number, '1');
    await postWebhook(wrong, signWebhook(webhookSecret(env), wrong)).expect(200);
    await processPendingPaymentEvents(prisma);
    const pay = await prisma.payment.findFirstOrThrow({ where: { checkoutId: c.id } });
    expect(pay.state).toBe('PENDING');
    const kase = await prisma.reconciliationCase.findFirstOrThrow({
      where: { paymentId: pay.id, kind: 'AMOUNT_MISMATCH' },
    });
    expect(kase.state).toBe('OPEN');
    const chk = await prisma.checkout.findUniqueOrThrow({ where: { id: c.id } });
    expect(chk.state).toBe('PENDING_PAYMENT');
  });
});

describe('T11 last-stock race and T12 price change after preview', () => {
  it('lets exactly one of two concurrent checkouts reserve the last units', async () => {
    const s = await seller();
    const p = await product(s, 10);
    const [b1, b2] = await Promise.all([buyer(), buyer()]);
    await addToCart(b1, p.skuId, 10).expect(201);
    await addToCart(b2, p.skuId, 10).expect(201);
    const [p1, p2] = await Promise.all([preview(b1), preview(b2)]);
    const results = await Promise.all([
      createCheckout(b1, p1.preview_hash),
      createCheckout(b2, p2.preview_hash),
    ]);
    expect(results.map((r) => r.status).sort()).toEqual([201, 409]);
    const loser = results.find((r) => r.status === 409)!;
    expect(JSON.stringify(loser.body)).toMatch(/checkout.insufficient_stock/);
    const inv = await inventory(p.skuId);
    expect([inv.onHand, inv.reserved]).toEqual([10, 10]);
    // Nothing left to add.
    const b3 = await buyer();
    await addToCart(b3, p.skuId, 10).expect(409);
  });

  it('refuses checkout with 409 when the price or the cart changed after the preview', async () => {
    const s = await seller();
    const p = await product(s, 100);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);
    const pv = await preview(b);
    await prisma.priceTier.updateMany({
      where: { skuId: p.skuId },
      data: { unitPriceFils: 1200n },
    });
    const r = await createCheckout(b, pv.preview_hash).expect(409);
    expect(JSON.stringify(r.body)).toMatch(/checkout.changed/);
    expect((await inventory(p.skuId)).reserved).toBe(0);
    const pv2 = await preview(b);
    expect(pv2.merchandise_fils).toBe('12000');
    const item = (await b.client.get(`/buyer/workspaces/${b.ws}/cart`).expect(200)).body.data
      .groups[0].lines[0];
    await b.client
      .patch(`/buyer/workspaces/${b.ws}/cart/items/${item.id}`, { quantity: 11 })
      .expect(200);
    await createCheckout(b, pv2.preview_hash).expect(409);
    // MOQ is enforced on update.
    await b.client
      .patch(`/buyer/workspaces/${b.ws}/cart/items/${item.id}`, { quantity: 5 })
      .expect(422);
  });
});

describe('T13 multi-seller checkout and delivery terms', () => {
  it('creates one order per seller under one payment; unserved emirates block checkout', async () => {
    const s1 = await seller();
    const s2 = await seller();
    const p1 = await product(s1, 100);
    const p2 = await product(s2, 100, '2500');
    const b = await buyer();
    await addToCart(b, p1.skuId, 10).expect(201);
    await addToCart(b, p2.skuId, 20).expect(201);
    const pv = await preview(b);
    expect(pv.groups).toHaveLength(2);
    // 10 x 10.00 + 50 shipping, 5% = 7.50 → 157.50; 20 x 25.00 + 50, 5% = 27.50 → 577.50
    expect(pv.groups.map((g: { total_fils: string }) => g.total_fils).sort()).toEqual([
      '15750',
      '57750',
    ]);
    expect(pv.total_fils).toBe('73500');
    const c = (await createCheckout(b, pv.preview_hash).expect(201)).body.data;
    expect(c.orders).toHaveLength(2);
    const orders = await prisma.order.findMany({ where: { checkoutId: c.id } });
    expect(new Set(orders.map((o) => o.sellerWorkspaceId))).toEqual(new Set([s1.ws, s2.ws]));
    const sessionId = await startPayment(b, c.id);
    await completeSandboxSession(prisma, sessionId, 'success');
    await deliverQueued(sessionId);
    await processPendingPaymentEvents(prisma);
    const paid = await prisma.order.findMany({ where: { checkoutId: c.id } });
    expect(paid.every((o) => o.state === 'CONFIRMED')).toBe(true);
    const entries = await prisma.ledgerEntry.findMany({
      where: { journal: { checkoutId: c.id }, account: 'seller_payable' },
    });
    expect(entries).toHaveLength(2);

    // Seller 1 only sees its own order; seller 2's order is 404 for it.
    const other = orders.find((o) => o.sellerWorkspaceId === s2.ws)!;
    await s1.client.get(`/seller/workspaces/${s1.ws}/orders/${other.id}`).expect(404);

    // Address in an emirate the seller does not serve blocks checkout.
    const b2 = await buyer();
    const far = await addAddress(b2.client, b2.ws, 'FUJAIRAH');
    await addToCart(b2, p1.skuId, 10).expect(201);
    const blocked = (
      await b2.client
        .post(`/buyer/workspaces/${b2.ws}/checkout/preview`, { address_id: far })
        .expect(200)
    ).body.data;
    expect(blocked.blocked).toBe(true);
    expect(blocked.groups[0].issue).toBe('emirate_not_served');
    await b2.client
      .post(`/buyer/workspaces/${b2.ws}/checkouts`, {
        address_id: far,
        preview_hash: blocked.preview_hash,
        accept_terms: true,
      })
      .set('Idempotency-Key', key())
      .expect(409);
  });

  it('blocks checkout from a supplier without delivery terms', async () => {
    const s = await seller(false);
    const p = await product(s, 100);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);
    const pv = await preview(b);
    expect(pv.groups[0].issue).toBe('no_delivery_terms');
    expect(pv.blocked).toBe(true);
  });
});

describe('T17 expiry with unresolved provider session and T18 late capture', () => {
  it('cancels an open session, releases stock and cancels orders when pay_by passes', async () => {
    const s = await seller();
    const p = await product(s, 30);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);
    const c = await checkoutFor(b);
    const sessionId = await startPayment(b, c.id);
    await prisma.checkout.update({
      where: { id: c.id },
      data: { payBy: new Date(Date.now() - 1000) },
    });
    const psp = createSandboxPsp(prisma, env);
    const res = await expireCheckouts(prisma, psp);
    expect(res.expired).toBeGreaterThanOrEqual(1);
    expect(
      (await prisma.mockPspSession.findUniqueOrThrow({ where: { id: sessionId } })).state,
    ).toBe('CANCELLED');
    const after = await prisma.checkout.findUniqueOrThrow({
      where: { id: c.id },
      include: { orders: true, reservations: true },
    });
    expect(after.state).toBe('EXPIRED');
    expect(after.orders[0]!.state).toBe('CANCELLED');
    expect(after.reservations[0]!.state).toBe('RELEASED');
    expect((await inventory(p.skuId)).reserved).toBe(0);
    // Paying an expired checkout is refused.
    await b.client
      .post(`/buyer/workspaces/${b.ws}/checkouts/${c.id}/pay`, {})
      .set('Idempotency-Key', key())
      .expect(409);

    // T18: the provider captures anyway (late): money goes to suspense with a reconciliation case.
    const late = captureEvent(sessionId, c.number, c.total_fils);
    await postWebhook(late, signWebhook(webhookSecret(env), late)).expect(200);
    await processPendingPaymentEvents(prisma);
    const rec = await prisma.checkout.findUniqueOrThrow({ where: { id: c.id } });
    expect(rec.state).toBe('RECONCILIATION_REQUIRED');
    const kase = await prisma.reconciliationCase.findFirstOrThrow({
      where: { checkoutId: c.id, kind: 'LATE_CAPTURE' },
    });
    expect(kase.state).toBe('OPEN');
    const j = await prisma.ledgerJournal.findFirstOrThrow({
      where: { checkoutId: c.id },
      include: { entries: true },
    });
    expect(j.kind).toBe('late_capture');
    expect(j.entries.map((e) => e.account).sort()).toEqual([
      'psp_clearing',
      'unallocated_receipts',
    ]);
    // Stock is not taken again by a late capture.
    expect((await inventory(p.skuId)).onHand).toBe(30);
  });

  it('keeps the hold when the provider already captured, then confirms on the webhook', async () => {
    const s = await seller();
    const p = await product(s, 30);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);
    const c = await checkoutFor(b);
    const sessionId = await startPayment(b, c.id);
    await completeSandboxSession(prisma, sessionId, 'success');
    await prisma.checkout.update({
      where: { id: c.id },
      data: { payBy: new Date(Date.now() - 1000) },
    });
    const res = await expireCheckouts(prisma, createSandboxPsp(prisma, env));
    expect(res.awaitingProvider).toBeGreaterThanOrEqual(1);
    expect((await prisma.checkout.findUniqueOrThrow({ where: { id: c.id } })).state).toBe(
      'PENDING_PAYMENT',
    );
    expect((await inventory(p.skuId)).reserved).toBe(10);
    await deliverQueued(sessionId);
    await processPendingPaymentEvents(prisma);
    expect((await prisma.checkout.findUniqueOrThrow({ where: { id: c.id } })).state).toBe('PAID');
    const inv = await inventory(p.skuId);
    expect([inv.onHand, inv.reserved, inv.sold]).toEqual([20, 0, 10]);
  });

  it('a failed payment can be retried; buyer cancel releases stock', async () => {
    const s = await seller();
    const p = await product(s, 30);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);
    const c = await checkoutFor(b);
    const first = await startPayment(b, c.id);
    await completeSandboxSession(prisma, first, 'failure');
    await deliverQueued(first);
    await processPendingPaymentEvents(prisma);
    const failed = await prisma.payment.findFirstOrThrow({ where: { providerRef: first } });
    expect(failed.state).toBe('FAILED');
    expect(failed.failureCode).toBe('card_declined');
    const second = await startPayment(b, c.id);
    expect(second).not.toBe(first);
    const cancelled = (
      await b.client.post(`/buyer/workspaces/${b.ws}/checkouts/${c.id}/cancel`).expect(200)
    ).body.data;
    expect(cancelled.state).toBe('CANCELLED');
    expect((await inventory(p.skuId)).reserved).toBe(0);
    expect((await prisma.mockPspSession.findUniqueOrThrow({ where: { id: second } })).state).toBe(
      'CANCELLED',
    );
  });
});

describe('T42 self-trade, eligibility and tenant isolation', () => {
  it('a company cannot buy its own listing; other tenants get 404', async () => {
    const { client, company } = await approvedCompany(['BUYER', 'SELLER']);
    const sws = company.workspaces.find((w) => w.kind === 'SELLER')!.id;
    const bws = company.workspaces.find((w) => w.kind === 'BUYER')!.id;
    await setupStorefront(client, sws);
    const own = await product({ client, ws: sws, companyId: company.id }, 50);
    const r = await client
      .post(`/buyer/workspaces/${bws}/cart/items`, { sku_id: own.skuId, quantity: 10 })
      .expect(409);
    expect(JSON.stringify(r.body)).toMatch(/cart.self_trade/);
    // The database refuses a self-trade order even if a caller bypassed the service.
    await expect(
      prisma.$executeRaw`INSERT INTO orders (id, number, checkout_id, buyer_workspace_id, buyer_company_id, seller_workspace_id, seller_company_id, merchandise_fils, shipping_fils, tax_fils, total_fils, commission_fils, seller_payable_fils, snapshot, updated_at)
        VALUES (gen_random_uuid(), ${'ORD-SELF-' + randomBytes(3).toString('hex')}, gen_random_uuid(), ${bws}::uuid, ${company.id}::uuid, ${sws}::uuid, ${company.id}::uuid, 0, 0, 0, 0, 0, 0, '{}', now())`,
    ).rejects.toThrow();

    // Another buyer cannot see this buyer's addresses, cart lines or checkouts.
    const s = await seller();
    const p = await product(s, 50);
    const a = await buyer();
    const outsider = await buyer();
    await addToCart(a, p.skuId, 10).expect(201);
    const line = (await a.client.get(`/buyer/workspaces/${a.ws}/cart`).expect(200)).body.data
      .groups[0].lines[0];
    const c = await checkoutFor(a);
    await outsider.client.get(`/buyer/workspaces/${a.ws}/cart`).expect(404);
    await outsider.client.get(`/buyer/workspaces/${outsider.ws}/checkouts/${c.id}`).expect(404);
    await outsider.client
      .get(`/buyer/workspaces/${outsider.ws}/orders/${c.orders[0].id}`)
      .expect(404);
    await outsider.client
      .patch(`/buyer/workspaces/${outsider.ws}/cart/items/${line.id}`, { quantity: 20 })
      .expect(404);
    await outsider.client
      .post(`/buyer/workspaces/${outsider.ws}/checkout/preview`, { address_id: a.addressId })
      .expect(404);
    // A seller cannot use its workspace id as a buyer workspace.
    await s.client.get(`/buyer/workspaces/${s.ws}/cart`).expect(404);
    // Sandbox session of another buyer is 404.
    const sid = await startPayment(a, c.id);
    await outsider.client.get(`/sandbox/psp/sessions/${sid}`).expect(404);
    await outsider.client
      .post(`/sandbox/psp/sessions/${sid}/complete`, { outcome: 'success' })
      .expect(404);
    await a.client.get(`/sandbox/psp/sessions/${sid}`).expect(200);
  });

  it('a pending (unapproved) buyer cannot use the cart', async () => {
    const pending = await signedInUser(app, env, prisma, 'pending-buyer');
    const co = await companyReadyToSubmit(pending.client, ['BUYER']);
    await pending.client.get(`/buyer/workspaces/${co.workspaces[0]!.id}/cart`).expect(403);
  });
});

describe('Award creates the unpaid order (Phase 3 → 4)', () => {
  it('award → AWAITING_PAYMENT order; pay with an address in the RFQ emirate; ledger on capture', async () => {
    const s = await seller();
    await product(s, 0);
    const b = await buyer();
    const draft = (
      await b.client
        .post(`/buyer/workspaces/${b.ws}/rfqs`, {
          title: `Award order ${randomBytes(3).toString('hex')}`,
          category_id: categoryId,
          specs: 'Double wall, 40x30x30 cm, brown kraft.',
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
    expect(award.order_id).toBeTruthy();
    expect(award.checkout_id).toBeTruthy();
    const order = (
      await b.client.get(`/buyer/workspaces/${b.ws}/orders/${award.order_id}`).expect(200)
    ).body.data;
    expect(order.state).toBe('AWAITING_PAYMENT');
    expect(order.source).toBe('QUOTE');
    expect(order.total_fils).toBe('110250');
    expect(order.pay_by).toBe(award.payment_due_at);
    const detail = (await b.client.get(`/buyer/workspaces/${b.ws}/rfqs/${rfq.id}`).expect(200)).body
      .data;
    expect(detail.award_order.order_id).toBe(award.order_id);

    // Address must be in the RFQ's delivery emirate.
    const sharjah = await addAddress(b.client, b.ws, 'SHARJAH');
    await b.client
      .post(`/buyer/workspaces/${b.ws}/checkouts/${award.checkout_id}/pay`, { address_id: sharjah })
      .set('Idempotency-Key', key())
      .expect(422);
    await b.client
      .post(`/buyer/workspaces/${b.ws}/checkouts/${award.checkout_id}/pay`, {})
      .set('Idempotency-Key', key())
      .expect(422);
    const sid = await startPayment(b, award.checkout_id, { address_id: b.addressId });
    await completeSandboxSession(prisma, sid, 'success');
    await deliverQueued(sid);
    await processPendingPaymentEvents(prisma);
    const so = (
      await s.client.get(`/seller/workspaces/${s.ws}/orders/${award.order_id}`).expect(200)
    ).body.data;
    expect(so.state).toBe('CONFIRMED');
    expect(so.commission_fils).toBe('10000');
    expect(so.address.emirate).toBe('DUBAI');
  });
});

describe('Ledger invariants and admin read scopes', () => {
  it('ledger entries are append-only and journals must balance', async () => {
    const e = await prisma.ledgerEntry.findFirstOrThrow();
    await expect(
      prisma.ledgerEntry.update({ where: { id: e.id }, data: { creditFils: 1n } }),
    ).rejects.toThrow();
    await expect(prisma.ledgerEntry.delete({ where: { id: e.id } })).rejects.toThrow();
    await expect(prisma.$executeRaw`TRUNCATE ledger_entries`).rejects.toThrow();
    await expect(
      prisma.ledgerJournal.create({
        data: {
          kind: 'test',
          dedupeKey: `unbalanced:${randomBytes(4).toString('hex')}`,
          entries: {
            create: [
              { account: 'psp_clearing', debitFils: 100n },
              { account: 'seller_payable', creditFils: 99n },
            ],
          },
        },
      }),
    ).rejects.toThrow(/not balanced/);
  });

  it('support reads orders but not finance; finance reads ledger and reconciliation', async () => {
    const support = (await loggedInAdmin(app, env, prisma, ['SUPPORT'])).client;
    const finance = (await loggedInAdmin(app, env, prisma, ['FINANCE'])).client;
    const orders = (await support.get('/admin/orders').expect(200)).body.data;
    expect(orders.length).toBeGreaterThan(0);
    await support.get(`/admin/orders/${orders[0].id}`).expect(200);
    await support.get('/admin/finance/summary').expect(403);
    await compliance.get('/admin/orders').expect(403);
    const sum = (await finance.get('/admin/finance/summary').expect(200)).body.data;
    expect(sum.sandbox).toBe(true);
    const clearing = sum.balances.find((x: { account: string }) => x.account === 'psp_clearing');
    expect(BigInt(clearing.debit_fils)).toBeGreaterThan(0n);
    expect(sum.open_reconciliation).toBeGreaterThan(0);
    const cases = (await finance.get('/admin/finance/reconciliation?state=OPEN').expect(200)).body
      .data;
    expect(cases.length).toBeGreaterThan(0);
    expect(cases.every((c: { state: string }) => c.state === 'OPEN')).toBe(true);
    await finance.get('/admin/finance/payments').expect(200);
  });
});
