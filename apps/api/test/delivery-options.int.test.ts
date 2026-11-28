/**
 * C-10 / FD-08 integration tests against PostgreSQL: per-emirate delivery fees, unserved emirates,
 * free buyer collection with instructions revealed to the buyer only after payment, the method
 * snapshotted on the order, collection handover without a carrier, and optional proof of
 * dispatch with tenant isolation. Payments use the labelled sandbox provider only.
 */
import type { INestApplication } from '@nestjs/common';
import { completeSandboxSession, processPendingPaymentEvents, type PrismaClient } from '@app/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  commerceFixtures,
  key,
  setupCommerce,
  type Buyer,
  type CommerceCtx,
  type Seller,
} from './commerce-fixtures';
import { SAMPLE_PDF } from './helpers';

let app: INestApplication;
let prisma: PrismaClient;
const ctx = {} as CommerceCtx;
const { seller, buyer, product, addAddress, addToCart, startPayment, deliverQueued } =
  commerceFixtures(ctx);

beforeAll(async () => {
  Object.assign(ctx, await setupCommerce());
  ({ app, prisma } = ctx);
}, 180_000);

afterAll(async () => {
  await app?.close();
  await prisma?.$disconnect();
});

const INSTRUCTIONS = 'Warehouse 7, Al Quoz 3. Ask for the dispatch desk, 08:00 to 16:00.';

/** Dubai AED 30 (2 days), Abu Dhabi AED 80 (4 days), Sharjah not served; collection in Dubai. */
async function deliveryTerms(s: Seller) {
  const sf = (await s.client.get(`/seller/workspaces/${s.ws}/storefront`).expect(200)).body.data;
  return (
    await s.client
      .patch(`/seller/workspaces/${s.ws}/storefront`, {
        expected_version: sf.version,
        delivery_rates: [
          { emirate: 'DUBAI', fee_fils: '3000', days: 2 },
          { emirate: 'ABU_DHABI', fee_fils: '8000', days: 4 },
        ],
        collection_enabled: true,
        collection_emirate: 'DUBAI',
        collection_days: 1,
        collection_instructions_en: INSTRUCTIONS,
      })
      .expect(200)
  ).body.data;
}

function previewFor(b: Buyer, addressId: string, methods?: Record<string, string>) {
  return b.client
    .post(`/buyer/workspaces/${b.ws}/checkout/preview`, { address_id: addressId, methods })
    .expect(200)
    .then((r) => r.body.data);
}

async function pay(b: Buyer, checkoutId: string) {
  const sessionId = await startPayment(b, checkoutId);
  expect(await completeSandboxSession(prisma, sessionId, 'success')).toBe(true);
  await deliverQueued(sessionId);
  await processPendingPaymentEvents(prisma);
}

describe('C-10 per-emirate delivery fees', () => {
  it('prices the fee for the buyer emirate and blocks emirates the supplier does not serve', async () => {
    const s = await seller();
    const sf = await deliveryTerms(s);
    expect(sf.delivery_rates).toHaveLength(2);
    expect(sf.collection_enabled).toBe(true);
    const p = await product(s, 500);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);

    const dubai = await previewFor(b, b.addressId);
    expect(dubai.groups[0]).toMatchObject({
      shipping_fils: '3000',
      delivery_days: 2,
      delivery_method: 'DELIVERY',
      issue: null,
    });
    expect(dubai.groups[0].delivery_options.collection).toEqual({
      available: true,
      emirate: 'DUBAI',
      days: 1,
    });
    // Instructions never appear before payment, not even in the preview.
    expect(JSON.stringify(dubai)).not.toContain('Warehouse 7');

    const ad = await previewFor(b, await addAddress(b.client, b.ws, 'ABU_DHABI'));
    expect(ad.groups[0]).toMatchObject({ shipping_fils: '8000', delivery_days: 4 });

    const sharjah = await addAddress(b.client, b.ws, 'SHARJAH');
    const shj = await previewFor(b, sharjah);
    expect(shj.groups[0].issue).toBe('emirate_not_served');
    expect(shj.blocked).toBe(true);

    // Collection is free and possible from any emirate.
    const shjCollect = await previewFor(b, sharjah, { [s.ws]: 'COLLECTION' });
    expect(shjCollect.groups[0]).toMatchObject({
      shipping_fils: '0',
      delivery_method: 'COLLECTION',
      delivery_days: 1,
      issue: null,
    });
    expect(shjCollect.blocked).toBe(false);

    // The cart shows the offered terms without collection instructions.
    const cart = (await b.client.get(`/buyer/workspaces/${b.ws}/cart`).expect(200)).body.data;
    expect(cart.groups[0].delivery.rates).toHaveLength(2);
    expect(cart.groups[0].delivery.collection).toEqual({
      available: true,
      emirate: 'DUBAI',
      days: 1,
    });
  });

  it('rejects malformed rates and collection without an emirate and instructions', async () => {
    const s = await seller();
    const sf = (await s.client.get(`/seller/workspaces/${s.ws}/storefront`).expect(200)).body.data;
    const path = `/seller/workspaces/${s.ws}/storefront`;
    await s.client
      .patch(path, {
        expected_version: sf.version,
        delivery_rates: [
          { emirate: 'DUBAI', fee_fils: '100', days: 1 },
          { emirate: 'DUBAI', fee_fils: '200', days: 1 },
        ],
      })
      .expect(422);
    await s.client
      .patch(path, {
        expected_version: sf.version,
        delivery_rates: [{ emirate: 'DUBAI', fee_fils: '1.5', days: 1 }],
      })
      .expect(422);
    await s.client
      .patch(path, { expected_version: sf.version, collection_enabled: true })
      .expect(422);
  });

  it('refuses collection when the supplier does not offer it', async () => {
    const s = await seller();
    const p = await product(s, 100);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);
    const pv = await previewFor(b, b.addressId, { [s.ws]: 'COLLECTION' });
    expect(pv.groups[0].issue).toBe('collection_unavailable');
    expect(pv.blocked).toBe(true);
  });
});

describe('FD-08 buyer collection', () => {
  it('snapshots the method, reveals instructions after payment and hands over without a carrier', async () => {
    const s = await seller();
    await deliveryTerms(s);
    const p = await product(s, 500);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);
    const methods = { [s.ws]: 'COLLECTION' };
    const pv = await previewFor(b, b.addressId, methods);

    // A hash for delivery cannot be used to check out with collection (method is priced).
    const delivery = await previewFor(b, b.addressId);
    expect(delivery.preview_hash).not.toBe(pv.preview_hash);
    await b.client
      .post(`/buyer/workspaces/${b.ws}/checkouts`, {
        address_id: b.addressId,
        methods,
        preview_hash: delivery.preview_hash,
        accept_terms: true,
      })
      .set('Idempotency-Key', key())
      .expect(409);

    const c = (
      await b.client
        .post(`/buyer/workspaces/${b.ws}/checkouts`, {
          address_id: b.addressId,
          methods,
          preview_hash: pv.preview_hash,
          accept_terms: true,
        })
        .set('Idempotency-Key', key())
        .expect(201)
    ).body.data;
    const orderId = c.orders[0].id as string;
    const row = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    expect(row.deliveryMethod).toBe('COLLECTION');
    expect(row.shippingFils).toBe(0n);

    const buyerPath = `/buyer/workspaces/${b.ws}/orders/${orderId}`;
    const sellerPath = `/seller/workspaces/${s.ws}/orders/${orderId}`;
    const unpaid = (await b.client.get(buyerPath).expect(200)).body.data;
    expect(unpaid.delivery_method).toBe('COLLECTION');
    expect(unpaid.collection).toMatchObject({ emirate: 'DUBAI', instructions_en: null });
    const sellerView = (await s.client.get(sellerPath).expect(200)).body.data;
    expect(sellerView.collection.instructions_en).toBe(INSTRUCTIONS);

    await pay(b, c.id);
    const paid = (await b.client.get(buyerPath).expect(200)).body.data;
    expect(paid.collection.instructions_en).toBe(INSTRUCTIONS);

    // Later changes to the storefront do not change what the order agreed.
    const sf = (await s.client.get(`/seller/workspaces/${s.ws}/storefront`).expect(200)).body.data;
    await s.client
      .patch(`/seller/workspaces/${s.ws}/storefront`, {
        expected_version: sf.version,
        collection_instructions_en: 'Moved to a new warehouse in Jebel Ali.',
      })
      .expect(200);
    expect((await b.client.get(buyerPath).expect(200)).body.data.collection.instructions_en).toBe(
      INSTRUCTIONS,
    );

    // Handover for collection needs no carrier; delivered orders still do.
    const done = (await s.client.post(`${sellerPath}/dispatch`, {}).expect(200)).body.data;
    expect(done.fulfilment.shipment.carrier).toBe('Buyer collection');
  });
});

describe('C-10 proof of dispatch', () => {
  it('stores an optional dispatch proof, scoped to the order parties', async () => {
    const s = await seller();
    const p = await product(s, 500);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);
    const pv = await previewFor(b, b.addressId);
    const c = (
      await b.client
        .post(`/buyer/workspaces/${b.ws}/checkouts`, {
          address_id: b.addressId,
          preview_hash: pv.preview_hash,
          accept_terms: true,
        })
        .set('Idempotency-Key', key())
        .expect(201)
    ).body.data;
    await pay(b, c.id);
    const orderId = c.orders[0].id as string;
    const sellerPath = `/seller/workspaces/${s.ws}/orders/${orderId}`;
    const row = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    expect(row.deliveryMethod).toBe('DELIVERY');
    expect((row.snapshot as { delivery: { method: string } }).delivery.method).toBe('DELIVERY');

    await s.client.post(`${sellerPath}/dispatch`, {}).expect(422);
    const d = (
      await s.client
        .upload(
          `${sellerPath}/dispatch`,
          { carrier: 'Test Freight LLC', tracking_code: 'TF-9' },
          { name: 'waybill.pdf', content: SAMPLE_PDF },
        )
        .expect(200)
    ).body.data;
    expect(d.fulfilment.shipment).toMatchObject({
      carrier: 'Test Freight LLC',
      has_dispatch_proof: true,
      has_proof: false,
    });
    await s.client.get(`${sellerPath}/dispatch-proof`).expect(200);
    await b.client.get(`/buyer/workspaces/${b.ws}/orders/${orderId}/dispatch-proof`).expect(200);
    const other = await buyer();
    await other.client
      .get(`/buyer/workspaces/${other.ws}/orders/${orderId}/dispatch-proof`)
      .expect(404);
    const otherSeller = await seller();
    await otherSeller.client
      .get(`/seller/workspaces/${otherSeller.ws}/orders/${orderId}/dispatch-proof`)
      .expect(404);
  });
});
