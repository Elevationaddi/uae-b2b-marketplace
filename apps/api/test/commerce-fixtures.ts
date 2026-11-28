/**
 * Shared checkout fixtures for the Phase 4 and Phase 5 integration tests: approved fictional
 * companies, published storefronts and products, carts, checkouts and the labelled sandbox
 * payment adapter's signed webhooks. Nothing here talks to a live provider.
 */
import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import { signWebhook, webhookSecret, type PrismaClient } from '@app/db';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import request from 'supertest';
import {
  Client,
  approveCompany,
  companyReadyToSubmit,
  loggedInAdmin,
  makeApp,
  signedInUser,
} from './helpers';

export type Seller = { client: Client; ws: string; companyId: string };
export type Buyer = { client: Client; ws: string; companyId: string; addressId: string };
export type Product = { productId: string; skuId: string };

export const key = () => `test-${randomBytes(8).toString('hex')}`;
export const inHours = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();
export const inDays = (d: number) =>
  new Date(Date.now() + d * 86_400_000).toISOString().slice(0, 10);
const png = () =>
  sharp({ create: { width: 400, height: 300, channels: 3, background: '#cc6633' } })
    .png()
    .toBuffer();

export async function setupCommerce(envOverrides: Record<string, string> = {}) {
  const made = await makeApp({
    TAX_STANDARD_BPS: '500',
    COMMISSION_BPS: '1000',
    PAYMENT_MODE: 'mock',
    ...envOverrides,
  });
  const { app, env, prisma } = made;
  const compliance = (await loggedInAdmin(app, env, prisma, ['COMPLIANCE'])).client;
  const slug = `chk-${randomBytes(4).toString('hex')}`;
  const parent = (
    await compliance
      .post('/admin/categories', { slug, name_en: 'Checkout Parent', name_ar: 'فئة' })
      .expect(201)
  ).body.data;
  const categoryId = (
    await compliance
      .post('/admin/categories', {
        slug: `${slug}-sub`,
        parent_id: parent.id,
        name_en: 'Checkout Sub',
        name_ar: 'فرعية',
      })
      .expect(201)
  ).body.data.id as string;
  return {
    app,
    env,
    prisma,
    compliance,
    categoryId,
  };
}

export type CommerceCtx = {
  app: INestApplication;
  env: AppEnv;
  prisma: PrismaClient;
  compliance: Client;
  categoryId: string;
};

/** Helpers read `ctx` lazily, so they can be destructured before `beforeAll` fills it. */
export function commerceFixtures(ctx: CommerceCtx) {
  async function approvedCompany(kinds: ('BUYER' | 'SELLER')[]) {
    const { client } = await signedInUser(
      ctx.app,
      ctx.env,
      ctx.prisma,
      kinds.join('-').toLowerCase(),
    );
    const company = await companyReadyToSubmit(client, kinds);
    await approveCompany(client, ctx.compliance, company.id);
    return { client, company };
  }

  async function setupStorefront(client: Client, ws: string, delivery = true) {
    await client
      .patch(`/seller/workspaces/${ws}/storefront`, {
        business_type: 'MANUFACTURER',
        description_en: 'We make fictional test products for checkout integration tests.',
        city: 'Dubai',
        ...(delivery ? { delivery_fee_fils: '5000', delivery_emirates: ['DUBAI', 'SHARJAH'] } : {}),
      })
      .expect(200);
    await client.post(`/seller/workspaces/${ws}/storefront/publish`).expect(200);
  }

  /** Ready-stock FIXED product at AED 10 per carton, MOQ 10, with on-hand stock. */
  async function product(s: Seller, onHand: number, priceFils = '1000'): Promise<Product> {
    const ws = s.ws;
    let d = (
      await s.client
        .post(`/seller/workspaces/${ws}/products`, {
          title_en: `Checkout carton ${randomBytes(3).toString('hex')}`,
          category_id: ctx.categoryId,
          sku_code: `SKU-${randomBytes(3).toString('hex')}`,
          unit: 'CARTON',
        })
        .expect(201)
    ).body.data;
    d = (
      await s.client
        .patch(`/seller/workspaces/${ws}/products/${d.id}`, {
          description_en: 'Sturdy fictional test product used by the checkout integration tests.',
          title_ar: 'منتج تجريبي',
          expected_version: d.version,
        })
        .expect(200)
    ).body.data;
    d = (
      await s.client
        .upload(
          `/seller/workspaces/${ws}/products/${d.id}/media`,
          { alt_en: 'Front' },
          { name: 'a.png', content: await png(), type: 'image/png' },
        )
        .expect(201)
    ).body.data;
    const skuId = d.skus[0].id as string;
    d = (
      await s.client
        .post(`/seller/workspaces/${ws}/products/${d.id}/pricing`, {
          price_type: 'FIXED',
          expected_version: d.version,
          skus: [
            {
              sku_id: skuId,
              moq: 10,
              order_increment: 1,
              tiers: [{ min_qty: 10, unit_price_fils: priceFils }],
            },
          ],
        })
        .expect(200)
    ).body.data;
    d = (
      await s.client
        .post(`/seller/workspaces/${ws}/products/${d.id}/submit`, { expected_version: d.version })
        .expect(200)
    ).body.data;
    await ctx.compliance
      .post(`/admin/catalog/reviews/${d.working_version.id}/decision`, {
        decision: 'APPROVED',
        expected_state: 'PENDING_REVIEW',
      })
      .expect(200);
    if (onHand > 0)
      await s.client
        .post(`/seller/workspaces/${ws}/inventory/${skuId}/adjust`, {
          kind: 'RECEIVE',
          quantity: onHand,
          reason: 'Initial stock',
        })
        .expect(200);
    return { productId: d.id, skuId };
  }

  async function seller(delivery = true): Promise<Seller> {
    const { client, company } = await approvedCompany(['SELLER']);
    const ws = company.workspaces.find((w) => w.kind === 'SELLER')!.id;
    await setupStorefront(client, ws, delivery);
    return { client, ws, companyId: company.id };
  }

  async function addAddress(client: Client, ws: string, emirate = 'DUBAI') {
    return (
      await client
        .post(`/buyer/workspaces/${ws}/addresses`, {
          label: 'Warehouse',
          recipient: 'Receiving desk',
          phone: '+971 4 000 0000',
          line1: 'Unit 1, Test Street',
          city: emirate === 'DUBAI' ? 'Dubai' : 'City',
          emirate,
        })
        .expect(201)
    ).body.data.id as string;
  }

  async function buyer(): Promise<Buyer> {
    const { client, company } = await approvedCompany(['BUYER']);
    const ws = company.workspaces.find((w) => w.kind === 'BUYER')!.id;
    return { client, ws, companyId: company.id, addressId: await addAddress(client, ws) };
  }

  function addToCart(b: Buyer, skuId: string, quantity: number) {
    return b.client.post(`/buyer/workspaces/${b.ws}/cart/items`, { sku_id: skuId, quantity });
  }

  async function preview(b: Buyer) {
    return (
      await b.client
        .post(`/buyer/workspaces/${b.ws}/checkout/preview`, { address_id: b.addressId })
        .expect(200)
    ).body.data;
  }

  function createCheckout(b: Buyer, hash: string) {
    return b.client
      .post(`/buyer/workspaces/${b.ws}/checkouts`, {
        address_id: b.addressId,
        preview_hash: hash,
        accept_terms: true,
      })
      .set('Idempotency-Key', key());
  }

  async function checkoutFor(b: Buyer) {
    const p = await preview(b);
    return (await createCheckout(b, p.preview_hash).expect(201)).body.data;
  }

  async function startPayment(b: Buyer, checkoutId: string, body: object = {}) {
    const r = await b.client
      .post(`/buyer/workspaces/${b.ws}/checkouts/${checkoutId}/pay`, body)
      .set('Idempotency-Key', key())
      .expect(200);
    return r.body.data.redirect_url.split('/').pop() as string;
  }

  /** Post a webhook body to the intake endpoint the way the provider would. */
  function postWebhook(body: string, signature?: string) {
    const req = request(ctx.app.getHttpServer())
      .post('/api/v1/payments/webhooks/sandbox')
      .set('content-type', 'application/json');
    if (signature) req.set('x-sandbox-signature', signature);
    return req.send(body);
  }

  /** Deliver the sandbox session's queued events through the signed intake endpoint. */
  async function deliverQueued(sessionId: string) {
    const s = await ctx.prisma.mockPspSession.findUniqueOrThrow({ where: { id: sessionId } });
    const events = s.outbox as unknown[];
    for (const e of events) {
      const body = JSON.stringify(e);
      await postWebhook(body, signWebhook(webhookSecret(ctx.env), body)).expect(200);
    }
    await ctx.prisma.mockPspSession.update({ where: { id: sessionId }, data: { outbox: [] } });
    return events as { id: string }[];
  }

  function captureEvent(
    sessionId: string,
    reference: string,
    amount: string,
    id = `evt_${randomBytes(8).toString('hex')}`,
  ) {
    return JSON.stringify({
      id,
      type: 'payment.captured',
      created: new Date().toISOString(),
      data: { session_id: sessionId, reference, amount_fils: amount, currency: 'AED' },
    });
  }

  async function inventory(skuId: string) {
    return ctx.prisma.inventory.findUniqueOrThrow({ where: { skuId } });
  }

  return {
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
  };
}
