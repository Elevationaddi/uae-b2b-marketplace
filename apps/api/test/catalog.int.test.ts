/**
 * Phase 2 integration tests against PostgreSQL: listing lifecycle and moderation (T07/T08),
 * server-side pricing (T09/T10), search isolation, tenant isolation, seller eligibility, inventory
 * concurrency, admin permissions, restricted terms, buyer lists and media access.
 */
import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { PrismaClient } from '@app/db';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  Client,
  approveCompany,
  companyReadyToSubmit,
  loggedInAdmin,
  makeApp,
  signedInUser,
} from './helpers';

let app: INestApplication;
let env: AppEnv;
let prisma: PrismaClient;
let compliance: Client;
let support: Client;
let categoryId: string;
let parentCategoryId: string;

const tag = () => `Zq${randomBytes(4).toString('hex')}`;
const png = (w = 400, h = 300, color = '#3366cc') =>
  sharp({ create: { width: w, height: h, channels: 3, background: color } }).png().toBuffer();

async function approvedSeller() {
  const { client, email } = await signedInUser(app, env, prisma, 'seller');
  const company = await companyReadyToSubmit(client, ['SELLER']);
  await approveCompany(client, compliance, company.id);
  const ws = company.workspaces.find((w) => w.kind === 'SELLER')!.id;
  return { client, email, ws, companyId: company.id };
}

async function verifiedBuyer() {
  return (await signedInUser(app, env, prisma, 'buyer')).client;
}

type Detail = {
  id: string;
  version: number;
  status: string;
  public: boolean;
  skus: { id: string; code: string; approved: boolean; inventory: { version: number; available: number } }[];
  working_version: { id: string; state: string; title_en: string; media: { file_id: string; url: string }[] } | null;
  published_version: { id: string; title_en: string } | null;
};

async function draftProduct(seller: Client, ws: string, title: string, opts: { price?: boolean } = {}) {
  let d: Detail = (
    await seller
      .post(`/seller/workspaces/${ws}/products`, {
        title_en: title,
        category_id: categoryId,
        sku_code: `SKU-${randomBytes(3).toString('hex')}`,
        unit: 'CARTON',
      })
      .expect(201)
  ).body.data;
  d = (
    await seller
      .patch(`/seller/workspaces/${ws}/products/${d.id}`, {
        description_en: `${title} is a sturdy fictional test product for integration tests.`,
        title_ar: 'منتج تجريبي',
        expected_version: d.version,
      })
      .expect(200)
  ).body.data;
  d = (
    await seller
      .upload(`/seller/workspaces/${ws}/products/${d.id}/media`, { alt_en: 'Front' }, { name: 'a.png', content: await png(), type: 'image/png' })
      .expect(201)
  ).body.data;
  if (opts.price !== false) {
    d = (
      await seller
        .post(`/seller/workspaces/${ws}/products/${d.id}/pricing`, {
          price_type: 'TIERED',
          expected_version: d.version,
          skus: [
            {
              sku_id: d.skus[0]!.id,
              moq: 10,
              order_increment: 5,
              tiers: [
                { min_qty: 10, unit_price_fils: '1250' },
                { min_qty: 100, unit_price_fils: '1000' },
              ],
            },
          ],
        })
        .expect(200)
    ).body.data;
  }
  return d;
}

async function publishedProduct(seller: Client, ws: string, title: string) {
  let d = await draftProduct(seller, ws, title);
  d = (await seller.post(`/seller/workspaces/${ws}/products/${d.id}/submit`, { expected_version: d.version }).expect(200)).body.data;
  expect(d.working_version!.state).toBe('PENDING_REVIEW');
  await compliance
    .post(`/admin/catalog/reviews/${d.working_version!.id}/decision`, { decision: 'APPROVED', expected_state: 'PENDING_REVIEW' })
    .expect(200);
  return (await seller.get(`/seller/workspaces/${ws}/products/${d.id}`).expect(200)).body.data as Detail;
}

async function searchIds(c: Client | null, q: string) {
  const agent = c ?? (await new Client(app, env.WEB_ORIGIN).init());
  const r = await agent.get(`/marketplace/products?q=${encodeURIComponent(q)}`).expect(200);
  return (r.body.data.items as { id: string }[]).map((i) => i.id);
}

beforeAll(async () => {
  const made = await makeApp();
  app = made.app;
  env = made.env;
  prisma = made.prisma;
  compliance = (await loggedInAdmin(app, env, prisma, ['COMPLIANCE'])).client;
  support = (await loggedInAdmin(app, env, prisma, ['SUPPORT'])).client;
  const slug = `test-${randomBytes(4).toString('hex')}`;
  const parent = (
    await compliance.post('/admin/categories', { slug, name_en: 'Test Parent', name_ar: 'فئة اختبار' }).expect(201)
  ).body.data;
  parentCategoryId = parent.id;
  const sub = (
    await compliance
      .post('/admin/categories', { slug: `${slug}-sub`, parent_id: parent.id, name_en: 'Test Sub', name_ar: 'فرعية' })
      .expect(201)
  ).body.data;
  categoryId = sub.id;
}, 120_000);

afterAll(async () => {
  await app?.close();
  await prisma?.$disconnect();
});

describe('T07/T08 listing lifecycle and moderation', () => {
  it('a submitted product is invisible until approved, then public; prices only for verified users', async () => {
    const s = await approvedSeller();
    const t = tag();
    let d = await draftProduct(s.client, s.ws, `Carton ${t}`);
    const fileUrl = d.working_version!.media[0]!.file_id;
    d = (await s.client.post(`/seller/workspaces/${s.ws}/products/${d.id}/submit`, { expected_version: d.version }).expect(200)).body.data;

    // Pending: not in search, suggest, detail or public media.
    expect(await searchIds(null, t)).toEqual([]);
    const guest = await new Client(app, env.WEB_ORIGIN).init();
    await guest.get(`/marketplace/products/${d.id}`).expect(404);
    const sug = await guest.get(`/marketplace/suggest?q=${t}`).expect(200);
    expect(sug.body.data.products).toEqual([]);
    await guest.get(`/media/${fileUrl}`).expect(404);
    // Seller still sees own image through the seller route.
    await s.client.get(`/seller/workspaces/${s.ws}/media/${fileUrl}`).expect(200);
    // Draft edits are locked while pending.
    await s.client.patch(`/seller/workspaces/${s.ws}/products/${d.id}`, { title_en: 'x y z', expected_version: d.version }).expect(409);

    await compliance
      .post(`/admin/catalog/reviews/${d.working_version!.id}/decision`, { decision: 'APPROVED', expected_state: 'PENDING_REVIEW' })
      .expect(200);
    expect(await searchIds(null, t)).toEqual([d.id]);
    await guest.get(`/media/${fileUrl}`).expect(200);

    const asGuest = (await guest.get(`/marketplace/products/${d.id}`).expect(200)).body.data;
    expect(asGuest.price_visible).toBe(false);
    expect(asGuest.skus[0].tiers).toBeNull();
    expect(asGuest.viewer.trading).toEqual({ available: false, reason: 'sign_in' });
    const search = (await guest.get(`/marketplace/products?q=${t}`).expect(200)).body.data;
    expect(search.items[0].price.min_price_fils).toBeNull();

    const buyer = await verifiedBuyer();
    const asBuyer = (await buyer.get(`/marketplace/products/${d.id}`).expect(200)).body.data;
    expect(asBuyer.price_visible).toBe(true);
    expect(asBuyer.skus[0].tiers).toEqual([
      { min_qty: 10, unit_price_fils: '1250' },
      { min_qty: 100, unit_price_fils: '1000' },
    ]);
    // Verified but not an approved buyer company: trading is not available.
    expect(asBuyer.viewer.trading.reason).toBe('requires_approved_buyer');
  });

  it('a material edit is re-reviewed while the approved version stays live (reject, resubmit, approve)', async () => {
    const s = await approvedSeller();
    const t = tag();
    let d = await publishedProduct(s.client, s.ws, `Original ${t}`);
    const guest = await new Client(app, env.WEB_ORIGIN).init();
    d = (
      await s.client.patch(`/seller/workspaces/${s.ws}/products/${d.id}`, { title_en: `Renamed ${t}`, expected_version: d.version }).expect(200)
    ).body.data;
    expect(d.published_version!.title_en).toBe(`Original ${t}`);
    expect(d.working_version!.state).toBe('DRAFT');
    d = (await s.client.post(`/seller/workspaces/${s.ws}/products/${d.id}/submit`, { expected_version: d.version }).expect(200)).body.data;
    const review = (await compliance.get(`/admin/catalog/reviews/${d.working_version!.id}`).expect(200)).body.data;
    expect(review.changed_fields).toContain('title_en');

    // Reason required to reject.
    await compliance
      .post(`/admin/catalog/reviews/${d.working_version!.id}/decision`, { decision: 'REJECTED', expected_state: 'PENDING_REVIEW' })
      .expect(422);
    await compliance
      .post(`/admin/catalog/reviews/${d.working_version!.id}/decision`, {
        decision: 'REJECTED',
        reason: 'Title does not describe the product',
        expected_state: 'PENDING_REVIEW',
      })
      .expect(200);
    expect((await guest.get(`/marketplace/products/${d.id}`).expect(200)).body.data.title_en).toBe(`Original ${t}`);
    d = (await s.client.get(`/seller/workspaces/${s.ws}/products/${d.id}`).expect(200)).body.data;
    expect(d.working_version!.state).toBe('REJECTED');

    // Resubmit: editing a rejected version creates a new draft.
    d = (
      await s.client.patch(`/seller/workspaces/${s.ws}/products/${d.id}`, { title_en: `Better ${t}`, expected_version: d.version }).expect(200)
    ).body.data;
    d = (await s.client.post(`/seller/workspaces/${s.ws}/products/${d.id}/submit`, { expected_version: d.version }).expect(200)).body.data;
    await compliance
      .post(`/admin/catalog/reviews/${d.working_version!.id}/decision`, { decision: 'APPROVED', expected_state: 'PENDING_REVIEW' })
      .expect(200);
    expect((await guest.get(`/marketplace/products/${d.id}`).expect(200)).body.data.title_en).toBe(`Better ${t}`);
    // Decision emails are queued for the seller.
    const emails = await prisma.outboxEvent.count({ where: { eventType: 'email.catalog_decision', payload: { path: ['to'], equals: s.email } } });
    expect(emails).toBeGreaterThanOrEqual(3);
  });

  it('submission validates content and pricing; restricted terms block submission', async () => {
    const s = await approvedSeller();
    let d = await draftProduct(s.client, s.ws, `Unpriced ${tag()}`, { price: false });
    const r = await s.client.post(`/seller/workspaces/${s.ws}/products/${d.id}/submit`, { expected_version: d.version }).expect(422);
    expect(r.body.error.message_key).toBe('catalog.submission_incomplete');
    expect(r.body.error.field_errors.pricing).toBe('invalid');

    // Overlapping / non-decreasing tiers and floats are rejected.
    const bad = await s.client
      .post(`/seller/workspaces/${s.ws}/products/${d.id}/pricing`, {
        price_type: 'TIERED',
        expected_version: d.version,
        skus: [{ sku_id: d.skus[0]!.id, moq: 10, order_increment: 5, tiers: [{ min_qty: 10, unit_price_fils: '100' }, { min_qty: 10, unit_price_fils: '200' }] }],
      })
      .expect(422);
    expect(bad.body.error.message_key).toBe('catalog.pricing_invalid');
    await s.client
      .post(`/seller/workspaces/${s.ws}/products/${d.id}/pricing`, {
        price_type: 'FIXED',
        expected_version: d.version,
        skus: [{ sku_id: d.skus[0]!.id, moq: 10, order_increment: 5, tiers: [{ min_qty: 10, unit_price_fils: '12.50' }] }],
      })
      .expect(422);

    const term = `banned${randomBytes(3).toString('hex')}`;
    await compliance.post('/admin/restricted-terms', { term, action: 'BLOCK' }).expect(201);
    d = await draftProduct(s.client, s.ws, `Nice ${term} thing`);
    const blocked = await s.client.post(`/seller/workspaces/${s.ws}/products/${d.id}/submit`, { expected_version: d.version }).expect(422);
    expect(blocked.body.error.message_key).toBe('catalog.restricted_term');
  });
});

describe('T09/T10 server-side quantity pricing', () => {
  it('enforces MOQ and increments and picks the right tier', async () => {
    const s = await approvedSeller();
    const d = await publishedProduct(s.client, s.ws, `Priced ${tag()}`);
    const sku = d.skus[0]!.id;
    const buyer = await verifiedBuyer();
    const est = (q: number) => buyer.get(`/marketplace/products/${d.id}/estimate?sku_id=${sku}&quantity=${q}`);
    expect((await est(5).expect(422)).body.error.field_errors.quantity).toBe('moq');
    expect((await est(12).expect(422)).body.error.field_errors.quantity).toBe('increment');
    expect((await est(15).expect(200)).body.data).toMatchObject({ unit_price_fils: '1250', line_total_fils: '18750', tier_min_qty: 10 });
    expect((await est(100).expect(200)).body.data).toMatchObject({ unit_price_fils: '1000', line_total_fils: '100000' });
    const guest = await new Client(app, env.WEB_ORIGIN).init();
    await guest.get(`/marketplace/products/${d.id}/estimate?sku_id=${sku}&quantity=15`).expect(403);
    // Guests cannot filter or sort by price (no inference of hidden prices).
    await guest.get('/marketplace/products?price_max=2000').expect(422);
    await guest.get('/marketplace/products?sort=price_asc').expect(422);
    await buyer.get('/marketplace/products?sort=price_asc').expect(200);
  });
});

describe('tenant isolation and permissions', () => {
  it('another seller, a buyer and a stranger get 404 for a seller resource', async () => {
    const a = await approvedSeller();
    const b = await approvedSeller();
    const d = await draftProduct(a.client, a.ws, `Private ${tag()}`);
    const fileId = d.working_version!.media[0]!.file_id;
    await b.client.get(`/seller/workspaces/${a.ws}/products/${d.id}`).expect(404);
    await b.client.get(`/seller/workspaces/${b.ws}/products/${d.id}`).expect(404);
    await b.client.patch(`/seller/workspaces/${b.ws}/products/${d.id}`, { title_en: 'hijack', expected_version: 1 }).expect(404);
    await b.client.post(`/seller/workspaces/${b.ws}/inventory/${d.skus[0]!.id}/adjust`, { kind: 'RECEIVE', quantity: 5, reason: 'nope' }).expect(404);
    await b.client.get(`/seller/workspaces/${b.ws}/media/${fileId}`).expect(404);
    await b.client.get(`/seller/workspaces/${a.ws}/media/${fileId}`).expect(404);
    const buyer = await verifiedBuyer();
    await buyer.get(`/seller/workspaces/${a.ws}/overview`).expect(404);
    await buyer.get(`/seller/workspaces/not-a-uuid/products`).expect(404);
  });

  it('read-only roles can view but not edit; warehouse can adjust stock but not edit content', async () => {
    const s = await approvedSeller();
    const d = await draftProduct(s.client, s.ws, `Roles ${tag()}`);
    const viewer = await signedInUser(app, env, prisma, 'viewer');
    const wh = await signedInUser(app, env, prisma, 'warehouse');
    for (const [email, role] of [
      [viewer.email, 'VIEWER'],
      [wh.email, 'WAREHOUSE'],
    ] as const) {
      const u = await prisma.user.findUniqueOrThrow({ where: { email } });
      await prisma.membership.create({ data: { workspaceId: s.ws, userId: u.id, role } });
    }
    await viewer.client.get(`/seller/workspaces/${s.ws}/products/${d.id}`).expect(200);
    await viewer.client.patch(`/seller/workspaces/${s.ws}/products/${d.id}`, { title_en: 'nope nope', expected_version: d.version }).expect(403);
    await viewer.client.post(`/seller/workspaces/${s.ws}/inventory/${d.skus[0]!.id}/adjust`, { kind: 'RECEIVE', quantity: 5, reason: 'nope' }).expect(403);
    await wh.client.post(`/seller/workspaces/${s.ws}/inventory/${d.skus[0]!.id}/adjust`, { kind: 'RECEIVE', quantity: 5, reason: 'delivery' }).expect(200);
    await wh.client.patch(`/seller/workspaces/${s.ws}/products/${d.id}`, { title_en: 'nope nope', expected_version: d.version }).expect(403);
  });

  it('an unapproved seller cannot list; an expired licence hides listings and blocks editing', async () => {
    const { client } = await signedInUser(app, env, prisma, 'pending');
    const company = await companyReadyToSubmit(client, ['SELLER']);
    const ws = company.workspaces.find((w) => w.kind === 'SELLER')!.id;
    const r = await client
      .post(`/seller/workspaces/${ws}/products`, { title_en: 'Too early', category_id: categoryId, sku_code: 'EARLY-1' })
      .expect(403);
    expect(r.body.error.message_key).toBe('catalog.company_not_approved');

    const s = await approvedSeller();
    const t = tag();
    const d = await publishedProduct(s.client, s.ws, `Expiring ${t}`);
    expect(await searchIds(null, t)).toEqual([d.id]);
    await prisma.company.update({ where: { id: s.companyId }, data: { licenceExpiry: new Date('2020-01-01') } });
    expect(await searchIds(null, t)).toEqual([]);
    const guest = await new Client(app, env.WEB_ORIGIN).init();
    await guest.get(`/marketplace/products/${d.id}`).expect(404);
    const e = await s.client.patch(`/seller/workspaces/${s.ws}/products/${d.id}`, { title_en: 'still mine', expected_version: d.version }).expect(403);
    expect(e.body.error.message_key).toBe('catalog.licence_expired');
    // Read access stays (the seller can see why).
    const ov = (await s.client.get(`/seller/workspaces/${s.ws}/overview`).expect(200)).body.data;
    expect(ov.eligibility).toEqual({ can_list: false, reason: 'catalog.licence_expired' });
  });
});

describe('inventory', () => {
  it('adjustments are atomic, never negative, and logged', async () => {
    const s = await approvedSeller();
    const d = await draftProduct(s.client, s.ws, `Stock ${tag()}`);
    const sku = d.skus[0]!.id;
    const base = `/seller/workspaces/${s.ws}/inventory/${sku}`;
    await s.client.post(`${base}/adjust`, { kind: 'RECEIVE', quantity: 10, reason: 'Opening stock' }).expect(200);
    await s.client.post(`${base}/adjust`, { kind: 'REMOVE', quantity: 11, reason: 'Too many' }).expect(422);
    // 10 concurrent removals of 3 from 10 units: at most 3 succeed.
    const results = await Promise.all(
      Array.from({ length: 10 }, () => s.client.post(`${base}/adjust`, { kind: 'REMOVE', quantity: 3, reason: 'Damaged' })),
    );
    expect(results.filter((r) => r.status === 200)).toHaveLength(3);
    const inv = await prisma.inventory.findUniqueOrThrow({ where: { skuId: sku } });
    expect(inv.onHand).toBe(1);
    await s.client.post(`${base}/adjust`, { kind: 'MARK_UNAVAILABLE', quantity: 2, reason: 'QC hold' }).expect(422);
    await s.client.post(`${base}/adjust`, { kind: 'SET_ON_HAND', quantity: 50, reason: 'Count', expected_version: inv.version - 1 }).expect(409);
    await s.client.post(`${base}/adjust`, { kind: 'SET_ON_HAND', quantity: 50, reason: 'Count', expected_version: inv.version }).expect(200);
    const mv = (await s.client.get(`${base}/movements`).expect(200)).body.data;
    expect(mv).toHaveLength(5);
    expect(mv[0]).toMatchObject({ kind: 'SET_ON_HAND', on_hand_after: 50, delta_on_hand: 49, reason: 'Count' });
    // The ledger is append-only at the database level.
    await expect(prisma.stockMovement.deleteMany({ where: { skuId: sku } })).rejects.toThrow();
  });
});

describe('admin catalog permissions and enforcement', () => {
  it('support can read but not decide; compliance can suspend and restore with a reason', async () => {
    const s = await approvedSeller();
    const t = tag();
    let d = await draftProduct(s.client, s.ws, `Enforce ${t}`);
    d = (await s.client.post(`/seller/workspaces/${s.ws}/products/${d.id}/submit`, { expected_version: d.version }).expect(200)).body.data;
    await support.get('/admin/catalog/queue').expect(200);
    await support
      .post(`/admin/catalog/reviews/${d.working_version!.id}/decision`, { decision: 'APPROVED', expected_state: 'PENDING_REVIEW' })
      .expect(403);
    await support.post('/admin/categories', { slug: `x-${t.toLowerCase()}`, name_en: 'Nope', name_ar: 'لا' }).expect(403);
    // Company sessions cannot reach admin routes at all.
    await s.client.get('/admin/catalog/queue').expect(401);
    await compliance
      .post(`/admin/catalog/reviews/${d.working_version!.id}/decision`, { decision: 'APPROVED', expected_state: 'PENDING_REVIEW' })
      .expect(200);
    expect(await searchIds(null, t)).toEqual([d.id]);
    await compliance.post(`/admin/catalog/products/${d.id}/suspend`, { reason: 'x' }).expect(422);
    await support.post(`/admin/catalog/products/${d.id}/suspend`, { reason: 'Suspected counterfeit' }).expect(403);
    await compliance.post(`/admin/catalog/products/${d.id}/suspend`, { reason: 'Suspected counterfeit' }).expect(200);
    expect(await searchIds(null, t)).toEqual([]);
    const seen = (await s.client.get(`/seller/workspaces/${s.ws}/products/${d.id}`).expect(200)).body.data;
    expect(seen.status).toBe('SUSPENDED');
    expect(seen.status_reason).toBe('Suspected counterfeit');
    await s.client.post(`/seller/workspaces/${s.ws}/products/${d.id}/republish`, { expected_version: seen.version }).expect(409);
    await compliance.post(`/admin/catalog/products/${d.id}/restore`, { reason: 'Documents verified' }).expect(200);
    expect(await searchIds(null, t)).toEqual([d.id]);
    const audit = await prisma.auditEvent.count({ where: { resourceId: d.id, action: { startsWith: 'catalog.product_' } } });
    expect(audit).toBe(2);
  });

  it('hiding a category hides its listings', async () => {
    const s = await approvedSeller();
    const t = tag();
    const slug = `hide-${randomBytes(4).toString('hex')}`;
    const parent = (await compliance.post('/admin/categories', { slug, name_en: 'Hideable', name_ar: 'مخفية' }).expect(201)).body.data;
    let d = await draftProduct(s.client, s.ws, `Cat ${t}`);
    d = (await s.client.patch(`/seller/workspaces/${s.ws}/products/${d.id}`, { category_id: parent.id, expected_version: d.version }).expect(200)).body.data;
    d = (await s.client.post(`/seller/workspaces/${s.ws}/products/${d.id}/submit`, { expected_version: d.version }).expect(200)).body.data;
    await compliance
      .post(`/admin/catalog/reviews/${d.working_version!.id}/decision`, { decision: 'APPROVED', expected_state: 'PENDING_REVIEW' })
      .expect(200);
    expect(await searchIds(null, t)).toEqual([d.id]);
    await compliance.patch(`/admin/categories/${parent.id}`, { visible: false, expected_version: parent.version }).expect(422);
    await compliance.patch(`/admin/categories/${parent.id}`, { visible: false, reason: 'Pending legal review', expected_version: parent.version }).expect(200);
    expect(await searchIds(null, t)).toEqual([]);
    const cats = (await (await new Client(app, env.WEB_ORIGIN).init()).get('/marketplace/categories').expect(200)).body.data as { id: string }[];
    expect(cats.find((c) => c.id === parent.id)).toBeUndefined();
  });
});

describe('storefronts and buyer lists', () => {
  it('storefront publishes for eligible sellers, can be hidden by admins, and saves/compare work for verified users only', async () => {
    const s = await approvedSeller();
    await s.client.post(`/seller/workspaces/${s.ws}/storefront/publish`).expect(422);
    const sf = (
      await s.client
        .patch(`/seller/workspaces/${s.ws}/storefront`, {
          business_type: 'MANUFACTURER',
          description_en: 'We make fictional test products for integration testing purposes.',
          city: 'Dubai',
        })
        .expect(200)
    ).body.data;
    expect(sf.public).toBe(false);
    const pub = (await s.client.post(`/seller/workspaces/${s.ws}/storefront/publish`).expect(200)).body.data;
    expect(pub.public).toBe(true);
    const guest = await new Client(app, env.WEB_ORIGIN).init();
    const detail = (await guest.get(`/marketplace/suppliers/${pub.id}`).expect(200)).body.data;
    expect(detail.name).toBe('Test Trading');
    expect(JSON.stringify(detail)).not.toContain('contact@example.test');
    expect(JSON.stringify(detail)).not.toMatch(/licence_number|trn/);

    await guest.post(`/marketplace/saved/suppliers/${pub.id}`).expect(401);
    const buyer = await verifiedBuyer();
    await buyer.post(`/marketplace/saved/suppliers/${pub.id}`).expect(200);
    await buyer.post(`/marketplace/saved/suppliers/${pub.id}`).expect(200);
    expect((await buyer.get('/marketplace/saved/suppliers').expect(200)).body.data).toHaveLength(1);

    await compliance.post(`/admin/storefronts/${pub.id}/hide`, { reason: 'Misleading claims' }).expect(200);
    await guest.get(`/marketplace/suppliers/${pub.id}`).expect(404);
    const saved = (await buyer.get('/marketplace/saved/suppliers').expect(200)).body.data;
    expect(saved[0].supplier).toBeNull();

    const d = await publishedProduct(s.client, s.ws, `Listed ${tag()}`);
    await buyer.post(`/marketplace/compare/${d.id}`).expect(200);
    await buyer.post(`/marketplace/compare/${d.id}`).expect(200);
    expect((await buyer.get('/marketplace/compare').expect(200)).body.data).toHaveLength(1);
    await buyer.post(`/marketplace/recent/${d.id}`).expect(200);
    expect((await buyer.get('/marketplace/recent').expect(200)).body.data[0].product_id).toBe(d.id);
    // Unpublished listings cannot be saved.
    const draft = await draftProduct(s.client, s.ws, `Hidden ${tag()}`);
    await buyer.post(`/marketplace/saved/products/${draft.id}`).expect(404);
    await buyer.post(`/marketplace/compare/${draft.id}`).expect(404);
  });

  it('rejects non-image and infected uploads', async () => {
    const s = await approvedSeller();
    const d = await draftProduct(s.client, s.ws, `Upload ${tag()}`, { price: false });
    const r = await s.client
      .upload(`/seller/workspaces/${s.ws}/products/${d.id}/media`, {}, { name: 'a.pdf', content: Buffer.from('%PDF-1.4\n%%EOF\n') })
      .expect(422);
    expect(r.body.error.message_key).toBe('file.image_type_not_allowed');
    const tiny = await s.client
      .upload(`/seller/workspaces/${s.ws}/products/${d.id}/media`, {}, { name: 't.png', content: await png(50, 50), type: 'image/png' })
      .expect(422);
    expect(tiny.body.error.message_key).toBe('file.image_too_small');
  });
});

describe('public category and supplier listings never include non-public records', () => {
  it('counts only public products', async () => {
    const s = await approvedSeller();
    await draftProduct(s.client, s.ws, `Uncounted ${tag()}`);
    const guest = await new Client(app, env.WEB_ORIGIN).init();
    const cat = (await guest.get(`/marketplace/categories/${categoryId}`).expect(200)).body.data;
    const publicInCat = await prisma.$queryRaw<{ n: number }[]>`
      SELECT count(*)::int AS n FROM marketplace_products WHERE category_id = ${categoryId}::uuid`;
    expect(cat.product_count).toBe(publicInCat[0]!.n);
    const parent = (await guest.get(`/marketplace/categories/${parentCategoryId}`).expect(200)).body.data;
    expect(parent.children.map((c: { id: string }) => c.id)).toContain(categoryId);
  });
});
