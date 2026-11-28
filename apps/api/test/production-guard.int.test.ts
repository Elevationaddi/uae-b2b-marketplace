/**
 * T38 at the application level: with no payment provider configured (the production default,
 * PAYMENT_MODE=disabled) trading is off and there is no mock fallback. Buyers can still browse
 * and keep a cart; checkout and the sandbox provider routes refuse. The process-level refusal to
 * start in production with sandbox adapters is checked by scripts/production-refusal-check.mjs
 * against the built API and worker, and by packages/config env tests.
 */
import type { INestApplication } from '@nestjs/common';
import type { PrismaClient } from '@app/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { commerceFixtures, setupCommerce, type CommerceCtx } from './commerce-fixtures';

let app: INestApplication;
let prisma: PrismaClient;
const ctx = {} as CommerceCtx;
const { seller, buyer, product, addToCart } = commerceFixtures(ctx);

beforeAll(async () => {
  Object.assign(ctx, await setupCommerce({ PAYMENT_MODE: 'disabled' }));
  ({ app, prisma } = ctx);
}, 180_000);

afterAll(async () => {
  await app?.close();
  await prisma?.$disconnect();
});

describe('T38 no payment provider configured', () => {
  it('keeps browsing and the cart but refuses checkout with no mock fallback', async () => {
    const s = await seller();
    const b = await buyer();
    const p = await product(s, 100);
    await addToCart(b, p.skuId, 10).expect(201);
    const cart = (await b.client.get(`/buyer/workspaces/${b.ws}/cart`).expect(200)).body.data;
    expect(cart.checkout_available).toBe(false);
    expect(cart.checkout_unavailable_reason).toBe('checkout.payments_disabled');

    const before = await prisma.checkout.count({ where: { buyerWorkspaceId: b.ws } });
    const r = await b.client
      .post(`/buyer/workspaces/${b.ws}/checkouts`, {
        address_id: b.addressId,
        preview_hash: 'x'.repeat(64),
        accept_terms: true,
      })
      .set('Idempotency-Key', 'k'.repeat(32));
    expect(r.status).toBe(409);
    expect(r.body.error.message_key).toBe('checkout.payments_disabled');
    expect(await prisma.checkout.count({ where: { buyerWorkspaceId: b.ws } })).toBe(before);

    // The sandbox provider page does not exist without PAYMENT_MODE=mock.
    await b.client.get(`/sandbox/psp/sessions/ps_${'0'.repeat(32)}`).expect(404);
    // Trading is reported off (the dev mail catcher keeps the overall sandbox label on here).
    const health = (await b.client.get('/health/ready')).body.data;
    expect(health.trading_enabled).toBe(false);
  });
});
