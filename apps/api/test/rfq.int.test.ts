/**
 * Phase 3 integration tests against PostgreSQL: RFQ visibility (T19), competitor isolation (T20),
 * superseded/expired acceptance (T21), concurrent award (T22), accepted immutability (T23),
 * idempotent award, self-dealing, scoped messaging, notifications and admin moderation.
 */
import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { PrismaClient } from '@app/db';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  Client,
  EICAR_PDF,
  SAMPLE_PDF,
  approveCompany,
  companyReadyToSubmit,
  emailedToken,
  loggedInAdmin,
  makeApp,
  signedInUser,
  uniqueEmail,
  PASSWORD,
} from './helpers';

let app: INestApplication;
let env: AppEnv;
let prisma: PrismaClient;
let compliance: Client;
let support: Client;
let categoryId: string;
let otherCategoryId: string;

type Seller = { client: Client; ws: string; companyId: string; storefrontId: string };
type Buyer = { client: Client; ws: string; companyId: string };

const png = () =>
  sharp({ create: { width: 400, height: 300, channels: 3, background: '#3366cc' } })
    .png()
    .toBuffer();
const inHours = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();
const inDays = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString().slice(0, 10);

async function approvedCompany(kinds: ('BUYER' | 'SELLER')[]) {
  const { client } = await signedInUser(app, env, prisma, kinds.join('-').toLowerCase());
  const company = await companyReadyToSubmit(client, kinds);
  await approveCompany(client, compliance, company.id);
  return { client, company };
}

async function publishStorefront(client: Client, ws: string): Promise<string> {
  await client
    .patch(`/seller/workspaces/${ws}/storefront`, {
      business_type: 'MANUFACTURER',
      description_en: 'We make fictional test products for integration testing purposes.',
      city: 'Dubai',
    })
    .expect(200);
  return (await client.post(`/seller/workspaces/${ws}/storefront/publish`).expect(200)).body.data
    .id as string;
}

async function publishProduct(client: Client, ws: string, category: string) {
  let d = (
    await client
      .post(`/seller/workspaces/${ws}/products`, {
        title_en: `RFQ test carton ${randomBytes(3).toString('hex')}`,
        category_id: category,
        sku_code: `SKU-${randomBytes(3).toString('hex')}`,
        unit: 'CARTON',
      })
      .expect(201)
  ).body.data;
  d = (
    await client
      .patch(`/seller/workspaces/${ws}/products/${d.id}`, {
        description_en: 'Sturdy fictional test product used by the RFQ integration tests.',
        title_ar: 'منتج تجريبي',
        expected_version: d.version,
      })
      .expect(200)
  ).body.data;
  d = (
    await client
      .upload(
        `/seller/workspaces/${ws}/products/${d.id}/media`,
        { alt_en: 'Front' },
        { name: 'a.png', content: await png(), type: 'image/png' },
      )
      .expect(201)
  ).body.data;
  d = (
    await client
      .post(`/seller/workspaces/${ws}/products/${d.id}/pricing`, {
        price_type: 'FIXED',
        expected_version: d.version,
        skus: [
          {
            sku_id: d.skus[0].id,
            moq: 10,
            order_increment: 1,
            tiers: [{ min_qty: 10, unit_price_fils: '1000' }],
          },
        ],
      })
      .expect(200)
  ).body.data;
  d = (
    await client
      .post(`/seller/workspaces/${ws}/products/${d.id}/submit`, { expected_version: d.version })
      .expect(200)
  ).body.data;
  await compliance
    .post(`/admin/catalog/reviews/${d.working_version.id}/decision`, {
      decision: 'APPROVED',
      expected_state: 'PENDING_REVIEW',
    })
    .expect(200);
}

/** Approved seller with a public storefront; with a product in the category unless told not to. */
async function seller(opts: { product?: boolean } = {}): Promise<Seller> {
  const { client, company } = await approvedCompany(['SELLER']);
  const ws = company.workspaces.find((w) => w.kind === 'SELLER')!.id;
  const storefrontId = await publishStorefront(client, ws);
  if (opts.product !== false) await publishProduct(client, ws, categoryId);
  return { client, ws, companyId: company.id, storefrontId };
}

async function buyer(): Promise<Buyer> {
  const { client, company } = await approvedCompany(['BUYER']);
  return {
    client,
    ws: company.workspaces.find((w) => w.kind === 'BUYER')!.id,
    companyId: company.id,
  };
}

function rfqBody(extra: Record<string, unknown> = {}) {
  return {
    title: `Double-wall cartons ${randomBytes(3).toString('hex')}`,
    category_id: categoryId,
    specs: 'Double wall, 40x30x30 cm, brown kraft, printed one colour.',
    quantity: 100,
    unit: 'CARTON',
    target_date: inDays(30),
    emirate: 'DUBAI',
    deadline: inHours(72),
    ...extra,
  };
}

async function openRfq(b: Buyer, extra: Record<string, unknown> = {}) {
  const d = (await b.client.post(`/buyer/workspaces/${b.ws}/rfqs`, rfqBody(extra)).expect(201)).body
    .data;
  return (
    await b.client
      .post(`/buyer/workspaces/${b.ws}/rfqs/${d.id}/publish`, { expected_version: d.version })
      .expect(200)
  ).body.data;
}

function quoteBody(extra: Record<string, unknown> = {}) {
  return {
    quantity: 100,
    unit: 'CARTON',
    unit_price_fils: '1000',
    shipping_fils: '5000',
    tax_code: 'STANDARD',
    specs: 'As specified.',
    lead_days: 10,
    delivery_date: inDays(20),
    valid_until: inHours(24 * 7),
    ...extra,
  };
}

async function submittedQuote(s: Seller, rfqId: string, extra: Record<string, unknown> = {}) {
  const d = (
    await s.client
      .post(`/seller/workspaces/${s.ws}/rfqs/${rfqId}/quote`, quoteBody(extra))
      .expect(201)
  ).body.data;
  const q = d.quotes[0];
  const after = (
    await s.client
      .post(`/seller/workspaces/${s.ws}/quotes/${q.id}/submit`, { expected_version: q.version })
      .expect(200)
  ).body.data;
  return after.quotes[0] as {
    id: string;
    version: number;
    current: { id: string; total_fils: string };
  };
}

const key = () => `test-${randomBytes(8).toString('hex')}`;

beforeAll(async () => {
  const made = await makeApp({ TAX_STANDARD_BPS: '500' });
  app = made.app;
  env = made.env;
  prisma = made.prisma;
  compliance = (await loggedInAdmin(app, env, prisma, ['COMPLIANCE'])).client;
  support = (await loggedInAdmin(app, env, prisma, ['SUPPORT'])).client;
  const slug = `rfq-${randomBytes(4).toString('hex')}`;
  const parent = (
    await compliance
      .post('/admin/categories', { slug, name_en: 'RFQ Parent', name_ar: 'فئة' })
      .expect(201)
  ).body.data;
  categoryId = (
    await compliance
      .post('/admin/categories', {
        slug: `${slug}-sub`,
        parent_id: parent.id,
        name_en: 'RFQ Sub',
        name_ar: 'فرعية',
      })
      .expect(201)
  ).body.data.id;
  otherCategoryId = (
    await compliance
      .post('/admin/categories', { slug: `${slug}-other`, name_en: 'Other', name_ar: 'أخرى' })
      .expect(201)
  ).body.data.id;
}, 180_000);

afterAll(async () => {
  await app?.close();
  await prisma?.$disconnect();
});

describe('RFQ creation and eligibility (A12)', () => {
  it('only approved trading buyers can request quotations; inputs are validated server-side', async () => {
    const pending = await signedInUser(app, env, prisma, 'pending');
    const co = await companyReadyToSubmit(pending.client, ['BUYER']);
    const pws = co.workspaces[0]!.id;
    await pending.client.post(`/buyer/workspaces/${pws}/rfqs`, rfqBody()).expect(403);

    const b = await buyer();
    const r = b.client;
    await r.post(`/buyer/workspaces/${b.ws}/rfqs`, rfqBody({ deadline: inHours(-1) })).expect(422);
    await r.post(`/buyer/workspaces/${b.ws}/rfqs`, rfqBody({ quantity: 0 })).expect(422);
    await r
      .post(
        `/buyer/workspaces/${b.ws}/rfqs`,
        rfqBody({ target_date: inDays(1), deadline: inHours(24 * 5) }),
      )
      .expect(422);
    await r
      .post(
        `/buyer/workspaces/${b.ws}/rfqs`,
        rfqBody({ category_id: '00000000-0000-4000-8000-000000000000' }),
      )
      .expect(422);
    // Another tenant's workspace id: 404, never 403.
    await pending.client.post(`/buyer/workspaces/${b.ws}/rfqs`, rfqBody()).expect(404);
    const invite = await r
      .post(`/buyer/workspaces/${b.ws}/rfqs`, rfqBody({ visibility: 'INVITE' }))
      .expect(201);
    await r
      .post(`/buyer/workspaces/${b.ws}/rfqs/${invite.body.data.id}/publish`, {
        expected_version: invite.body.data.version,
      })
      .expect(422);
  });
});

describe('T19 RFQ visibility and attachments', () => {
  it('pool RFQs reach category sellers only; invite-only RFQs and their files are 404 to others', async () => {
    const b = await buyer();
    const other = await buyer();
    const a = await seller();
    const c = await seller({ product: false });
    const pool = await openRfq(b);
    expect(pool.state).toBe('OPEN');

    // Seller A (product in category) sees it and was notified; C (no product) does not.
    const listA = (await a.client.get(`/seller/workspaces/${a.ws}/rfqs`).expect(200)).body.data;
    expect(listA.map((x: { id: string }) => x.id)).toContain(pool.id);
    expect(listA.find((x: { id: string }) => x.id === pool.id).quote_count).toBeNull();
    await c.client.get(`/seller/workspaces/${c.ws}/rfqs/${pool.id}`).expect(404);
    await other.client.get(`/buyer/workspaces/${other.ws}/rfqs/${pool.id}`).expect(404);
    const notes = (await a.client.get('/notifications').expect(200)).body.data;
    expect(
      notes.some(
        (n: { type: string; payload: { rfq_id: string } }) =>
          n.type === 'rfq.matched' && n.payload.rfq_id === pool.id,
      ),
    ).toBe(true);

    // Invite-only RFQ to C with an attachment.
    let d = (
      await b.client
        .post(
          `/buyer/workspaces/${b.ws}/rfqs`,
          rfqBody({ visibility: 'INVITE', invitee_storefront_ids: [c.storefrontId] }),
        )
        .expect(201)
    ).body.data;
    d = (
      await b.client
        .upload(
          `/buyer/workspaces/${b.ws}/rfqs/${d.id}/files`,
          {},
          { name: 'drawing.pdf', content: SAMPLE_PDF },
        )
        .expect(201)
    ).body.data;
    await b.client
      .upload(
        `/buyer/workspaces/${b.ws}/rfqs/${d.id}/files`,
        {},
        { name: 'bad.pdf', content: EICAR_PDF },
      )
      .expect(422);
    expect(d.files).toHaveLength(1);
    const fileId = d.files[0].id;
    d = (
      await b.client
        .post(`/buyer/workspaces/${b.ws}/rfqs/${d.id}/publish`, { expected_version: d.version })
        .expect(200)
    ).body.data;
    // Files cannot change after publishing.
    await b.client
      .upload(
        `/buyer/workspaces/${b.ws}/rfqs/${d.id}/files`,
        {},
        { name: 'late.pdf', content: SAMPLE_PDF },
      )
      .expect(409);

    await a.client.get(`/seller/workspaces/${a.ws}/rfqs/${d.id}`).expect(404);
    await a.client.get(`/seller/workspaces/${a.ws}/rfqs/${d.id}/files/${fileId}`).expect(404);
    await a.client.get(`/seller/workspaces/${a.ws}/rfqs/${pool.id}/files/${fileId}`).expect(404);
    await other.client
      .get(`/buyer/workspaces/${other.ws}/rfqs/${d.id}/files/${fileId}`)
      .expect(404);
    const listA2 = (await a.client.get(`/seller/workspaces/${a.ws}/rfqs`).expect(200)).body.data;
    expect(listA2.map((x: { id: string }) => x.id)).not.toContain(d.id);

    const seen = (await c.client.get(`/seller/workspaces/${c.ws}/rfqs/${d.id}`).expect(200)).body
      .data;
    expect(seen.invited).toBe(true);
    expect(seen.invitees).toEqual([]);
    const dl = await c.client
      .get(`/seller/workspaces/${c.ws}/rfqs/${d.id}/files/${fileId}`)
      .expect(200);
    expect(dl.headers['cache-control']).toContain('no-store');
    await b.client.get(`/buyer/workspaces/${b.ws}/rfqs/${d.id}/files/${fileId}`).expect(200);
  });
});

describe('quotes: T20 isolation, totals, revision and T21', () => {
  it('sellers see only their own quote; totals are server-computed; superseded and expired versions cannot be accepted', async () => {
    const b = await buyer();
    const a = await seller();
    const s2 = await seller();
    const rfq = await openRfq(b);

    const qa = await submittedQuote(a, rfq.id);
    const qb = await submittedQuote(s2, rfq.id, { unit_price_fils: '900' });
    // 100 x AED 10 + AED 50 shipping, 5% on both = AED 1,102.50 (docs/08-finance.md fixture).
    expect(qa.current.total_fils).toBe('110250');

    // T20: competitor quote is invisible and not actionable.
    const viewB = (await s2.client.get(`/seller/workspaces/${s2.ws}/rfqs/${rfq.id}`).expect(200))
      .body.data;
    expect(viewB.quotes).toHaveLength(1);
    expect(viewB.quotes[0].id).toBe(qb.id);
    expect(JSON.stringify(viewB)).not.toContain(qa.id);
    await s2.client
      .patch(`/seller/workspaces/${s2.ws}/quotes/${qa.id}`, { expected_version: 1 })
      .expect(404);
    await s2.client
      .post(`/seller/workspaces/${s2.ws}/quotes/${qa.id}/withdraw`, {
        expected_version: qa.version,
      })
      .expect(404);
    const myQuotes = (await s2.client.get(`/seller/workspaces/${s2.ws}/quotes`).expect(200)).body
      .data;
    expect(myQuotes.map((x: { id: string }) => x.id)).toEqual([qb.id]);

    // Buyer sees both, with server totals; a second quote by the same seller is refused.
    const buyerView = (await b.client.get(`/buyer/workspaces/${b.ws}/rfqs/${rfq.id}`).expect(200))
      .body.data;
    expect(buyerView.quotes).toHaveLength(2);
    expect(buyerView.quote_count).toBe(2);
    await a.client.post(`/seller/workspaces/${a.ws}/rfqs/${rfq.id}/quote`, quoteBody()).expect(409);

    // Revision: v1 superseded by v2; accepting v1 is refused (T21) and creates nothing.
    await b.client
      .post(`/buyer/workspaces/${b.ws}/quotes/${qa.id}/request-revision`, {
        version_id: qa.current.id,
        reason: 'Better price please',
      })
      .expect(200);
    const revised = (
      await a.client
        .post(`/seller/workspaces/${a.ws}/quotes/${qa.id}/revise`, {
          ...quoteBody({ unit_price_fils: '950' }),
          expected_version: qa.version,
        })
        .expect(200)
    ).body.data.quotes[0];
    expect(revised.current.version).toBe(2);
    expect(revised.history[0].state).toBe('SUPERSEDED');
    const stale = await b.client
      .post(`/buyer/workspaces/${b.ws}/quotes/${qa.id}/accept`, { version_id: qa.current.id })
      .set('Idempotency-Key', key());
    expect(stale.status).toBe(409);
    expect(stale.body.error.message_key).toBe('quote.superseded');
    expect((await prisma.rfq.findUniqueOrThrow({ where: { id: rfq.id } })).state).toBe('OPEN');

    // Expired validity: 409 quote.expired.
    const s3 = await seller();
    const short = await submittedQuote(s3, rfq.id, {
      valid_until: new Date(Date.now() + 2500).toISOString(),
    });
    await new Promise((r) => setTimeout(r, 3000));
    const expired = await b.client
      .post(`/buyer/workspaces/${b.ws}/quotes/${short.id}/accept`, { version_id: short.current.id })
      .set('Idempotency-Key', key());
    expect(expired.status).toBe(409);
    expect(expired.body.error.message_key).toBe('quote.expired');
    expect(
      (await prisma.rfq.findUniqueOrThrow({ where: { id: rfq.id } })).acceptedQuoteVersionId,
    ).toBeNull();
  }, 120_000);
});

describe('T22 concurrent award, idempotency and T23 immutability', () => {
  it('two concurrent acceptances produce exactly one award; accepted versions cannot change', async () => {
    const b = await buyer();
    const a = await seller();
    const s2 = await seller();
    const rfq = await openRfq(b);
    const qa = await submittedQuote(a, rfq.id);
    const qb = await submittedQuote(s2, rfq.id);

    await b.client
      .post(`/buyer/workspaces/${b.ws}/quotes/${qa.id}/accept`, { version_id: qa.current.id })
      .expect(422);

    const [r1, r2] = await Promise.all([
      b.client
        .post(`/buyer/workspaces/${b.ws}/quotes/${qa.id}/accept`, { version_id: qa.current.id })
        .set('Idempotency-Key', key()),
      b.client
        .post(`/buyer/workspaces/${b.ws}/quotes/${qb.id}/accept`, { version_id: qb.current.id })
        .set('Idempotency-Key', key()),
    ]);
    expect([r1.status, r2.status].sort()).toEqual([200, 409]);
    const winner = r1.status === 200 ? { q: qa, s: a, res: r1 } : { q: qb, s: s2, res: r2 };
    const loser = r1.status === 200 ? { q: qb, s: s2 } : { q: qa, s: a };
    expect(winner.res.body.data.state).toBe('AWARDED');
    expect(winner.res.body.data.order_id).toEqual(expect.any(String));
    expect(winner.res.body.data.checkout_id).toEqual(expect.any(String));
    const dueMs =
      new Date(winner.res.body.data.payment_due_at).getTime() -
      new Date(winner.res.body.data.awarded_at).getTime();
    expect(dueMs).toBe(env.QUOTE_PAYMENT_WINDOW_HOURS * 3_600_000);

    const row = await prisma.rfq.findUniqueOrThrow({ where: { id: rfq.id } });
    expect(row.state).toBe('AWARDED');
    expect(row.acceptedQuoteVersionId).toBe(winner.q.current.id);
    expect(await prisma.quote.count({ where: { rfqId: rfq.id, state: 'ACCEPTED' } })).toBe(1);
    expect((await prisma.quote.findUniqueOrThrow({ where: { id: loser.q.id } })).state).toBe(
      'DECLINED',
    );

    // Idempotent replay with the same key and body; different body with the same key is 409.
    const k = key();
    const first = await b.client
      .post(`/buyer/workspaces/${b.ws}/quotes/${winner.q.id}/accept`, {
        version_id: winner.q.current.id,
      })
      .set('Idempotency-Key', k)
      .expect(200);
    const replay = await b.client
      .post(`/buyer/workspaces/${b.ws}/quotes/${winner.q.id}/accept`, {
        version_id: winner.q.current.id,
      })
      .set('Idempotency-Key', k)
      .expect(200);
    expect(replay.body.data).toEqual(first.body.data);
    await b.client
      .post(`/buyer/workspaces/${b.ws}/quotes/${winner.q.id}/accept`, {
        version_id: winner.q.current.id,
        po_reference: 'X',
      })
      .set('Idempotency-Key', k)
      .expect(409);

    // T23: the accepted quote cannot be revised or withdrawn, even directly in the database.
    const ver = (await prisma.quote.findUniqueOrThrow({ where: { id: winner.q.id } })).version;
    await winner.s.client
      .post(`/seller/workspaces/${winner.s.ws}/quotes/${winner.q.id}/revise`, {
        ...quoteBody(),
        expected_version: ver,
      })
      .expect(409);
    await winner.s.client
      .post(`/seller/workspaces/${winner.s.ws}/quotes/${winner.q.id}/withdraw`, {
        expected_version: ver,
      })
      .expect(409);
    await expect(
      prisma.quoteVersion.update({
        where: { id: winner.q.current.id },
        data: { unitPriceFils: 1n },
      }),
    ).rejects.toThrow();
    await expect(
      prisma.quoteVersion.update({
        where: { id: winner.q.current.id },
        data: { state: 'DECLINED' },
      }),
    ).rejects.toThrow();
    // Loser still sees its own declined quote but nothing about the winner.
    const lv = (
      await loser.s.client.get(`/seller/workspaces/${loser.s.ws}/rfqs/${rfq.id}`).expect(200)
    ).body.data;
    expect(lv.accepted_quote_version_id).toBeNull();
    expect(JSON.stringify(lv)).not.toContain(winner.q.id);
    const ln = (await loser.s.client.get('/notifications').expect(200)).body.data;
    expect(ln.some((n: { type: string }) => n.type === 'rfq.awarded_other')).toBe(true);
  }, 120_000);

  it('submitted versions are immutable in the database', async () => {
    const b = await buyer();
    const a = await seller();
    const rfq = await openRfq(b);
    const q = await submittedQuote(a, rfq.id);
    await expect(
      prisma.quoteVersion.update({ where: { id: q.current.id }, data: { totalFils: 1n } }),
    ).rejects.toThrow();
    await expect(prisma.rfqEvent.deleteMany({ where: { rfqId: rfq.id } })).rejects.toThrow();
  });
});

describe('self-dealing and roles', () => {
  it("a company's own seller workspace never sees its buyer RFQs; viewers cannot request quotations", async () => {
    const { client, company } = await approvedCompany(['BUYER', 'SELLER']);
    const bws = company.workspaces.find((w) => w.kind === 'BUYER')!.id;
    const sws = company.workspaces.find((w) => w.kind === 'SELLER')!.id;
    await publishStorefront(client, sws);
    await publishProduct(client, sws, categoryId);
    const rfq = await openRfq({ client, ws: bws, companyId: company.id });
    await client.get(`/seller/workspaces/${sws}/rfqs/${rfq.id}`).expect(404);
    const cands = (
      await client
        .get(`/buyer/workspaces/${bws}/invite-candidates?category_id=${categoryId}`)
        .expect(200)
    ).body.data;
    expect(cands.map((c: { workspace_id: string }) => c.workspace_id)).not.toContain(sws);

    // Viewer in the buyer workspace: read yes, create no.
    const email = uniqueEmail('viewer');
    await client.post(`/workspaces/${bws}/invitations`, { email, role: 'VIEWER' }).expect(201);
    const token = await emailedToken(prisma, email, 'invitation');
    const v = await new Client(app, env.WEB_ORIGIN).init();
    await v.post('/auth/register', { email, password: PASSWORD, full_name: 'Viewer' }).expect(202);
    await v
      .post('/auth/verify-email', { token: await emailedToken(prisma, email, 'verify_email') })
      .expect(200);
    await v.post('/auth/login', { email, password: PASSWORD }).expect(200);
    await v.refreshCsrf();
    await v.post('/invitations/accept', { token }).expect(200);
    await v.get(`/buyer/workspaces/${bws}/rfqs/${rfq.id}`).expect(200);
    await v.post(`/buyer/workspaces/${bws}/rfqs`, rfqBody()).expect(403);
    // Viewers have no messaging capability.
    await v.get(`/workspaces/${bws}/conversations`).expect(403);
  }, 120_000);

  it('a seller without a product in the category is not in the pool even if listed', async () => {
    const b = await buyer();
    const s = await seller();
    const rfq = await openRfq(b, { category_id: otherCategoryId });
    await s.client.get(`/seller/workspaces/${s.ws}/rfqs/${rfq.id}`).expect(404);
  }, 120_000);
});

describe('scoped messaging and notifications', () => {
  it('seller asks about a visible RFQ, buyer replies; outsiders get 404; unread counts and preferences work', async () => {
    const b = await buyer();
    const a = await seller();
    const outsider = await seller();
    const rfq = await openRfq(b);

    const conv = (
      await a.client
        .post(`/workspaces/${a.ws}/conversations`, {
          rfq_id: rfq.id,
          body: 'Is printing on two sides acceptable?',
        })
        .expect(201)
    ).body.data;
    expect(conv.rfq.id).toBe(rfq.id);
    expect(conv.counterpart.workspace_id).toBe(b.ws);

    const unread = (await b.client.get('/notifications/unread').expect(200)).body.data;
    expect(unread.messages).toBeGreaterThanOrEqual(1);
    const list = (await b.client.get(`/workspaces/${b.ws}/conversations`).expect(200)).body.data;
    const mine = list.find((c: { id: string }) => c.id === conv.id);
    expect(mine.unread).toBe(1);
    const msgs = (
      await b.client.get(`/workspaces/${b.ws}/conversations/${conv.id}/messages`).expect(200)
    ).body.data;
    await b.client
      .post(`/workspaces/${b.ws}/conversations/${conv.id}/read`, { last_message_id: msgs[0].id })
      .expect(200);
    const reply = (
      await b.client
        .post(`/workspaces/${b.ws}/conversations/${conv.id}/messages`, { body: 'Yes, both sides.' })
        .expect(201)
    ).body.data;
    expect(reply.side).toBe('BUYER');
    expect(
      (await b.client.get(`/workspaces/${b.ws}/conversations`).expect(200)).body.data.find(
        (c: { id: string }) => c.id === conv.id,
      ).unread,
    ).toBe(0);

    // Outsiders: other seller workspace, and the seller using the buyer's workspace id.
    await outsider.client.get(`/workspaces/${outsider.ws}/conversations/${conv.id}`).expect(404);
    await outsider.client.get(`/workspaces/${b.ws}/conversations`).expect(404);
    await outsider.client
      .post(`/workspaces/${outsider.ws}/conversations/${conv.id}/messages`, { body: 'hi' })
      .expect(404);

    // Buyer may start a general conversation from a public storefront.
    const general = (
      await b.client
        .post(`/workspaces/${b.ws}/conversations`, {
          storefront_id: outsider.storefrontId,
          body: 'Do you ship to Sharjah?',
        })
        .expect(201)
    ).body.data;
    expect(general.rfq).toBeNull();
    // A pending (unapproved) buyer cannot start commercial communication (A12).
    const pending = await signedInUser(app, env, prisma, 'pendmsg');
    const co = await companyReadyToSubmit(pending.client, ['BUYER']);
    await pending.client
      .post(`/workspaces/${co.workspaces[0]!.id}/conversations`, {
        storefront_id: outsider.storefrontId,
        body: 'Hello there',
      })
      .expect(403);

    // Notifications: read one, read all, preferences; quote submission emails the buyer by default.
    const notes = (await b.client.get('/notifications?unread=true').expect(200)).body.data;
    expect(notes.length).toBeGreaterThan(0);
    await b.client.post(`/notifications/${notes[0].id}/read`).expect(200);
    await a.client.post(`/notifications/${notes[0].id}/read`).expect(404);
    await b.client.post('/notifications/read-all').expect(200);
    expect((await b.client.get('/notifications/unread').expect(200)).body.data.notifications).toBe(
      0,
    );
    const prefs = (
      await b.client.patch('/notifications/preferences', { email_quotes: false }).expect(200)
    ).body.data;
    expect(prefs).toEqual({
      email_rfqs: true,
      email_quotes: false,
      email_messages: false,
      email_marketing: false,
    });
    // Scoped to this buyer's members: other test files enqueue emails concurrently.
    const members = await prisma.user.findMany({
      where: { memberships: { some: { workspaceId: b.ws } } },
      select: { email: true },
    });
    const buyerEmails = {
      eventType: 'email.activity',
      OR: members.map((mm) => ({ payload: { path: ['to'], equals: mm.email } })),
    };
    const before = await prisma.outboxEvent.count({ where: buyerEmails });
    await submittedQuote(a, rfq.id);
    // Buyer opted out of quote emails: in-app notification only.
    expect(await prisma.outboxEvent.count({ where: buyerEmails })).toBe(before);
    const n2 = (await b.client.get('/notifications?unread=true').expect(200)).body.data;
    expect(n2.some((n: { type: string }) => n.type === 'quote.submitted')).toBe(true);
  }, 120_000);
});

describe('admin RFQ moderation', () => {
  it('compliance hides an abusive RFQ (sellers lose access); support reads metadata only', async () => {
    const b = await buyer();
    const a = await seller();
    const rfq = await openRfq(b);
    await submittedQuote(a, rfq.id);
    const listed = (await support.get(`/admin/rfqs?q=${rfq.number}`).expect(200)).body.data;
    expect(listed[0].id).toBe(rfq.id);
    const meta = (await support.get(`/admin/rfqs/${rfq.id}`).expect(200)).body.data;
    expect(meta.quotes).toHaveLength(1);
    expect(JSON.stringify(meta)).not.toMatch(/unit_price_fils|total_fils/);
    await support.post(`/admin/rfqs/${rfq.id}/hide`, { reason: 'Abusive content' }).expect(403);
    await compliance.post(`/admin/rfqs/${rfq.id}/hide`, { reason: 'Abusive content' }).expect(200);
    await a.client.get(`/seller/workspaces/${a.ws}/rfqs/${rfq.id}`).expect(404);
    const bv = (await b.client.get(`/buyer/workspaces/${b.ws}/rfqs/${rfq.id}`).expect(200)).body
      .data;
    expect(bv.admin_hidden).toBe(true);
    await compliance
      .post(`/admin/rfqs/${rfq.id}/unhide`, { reason: 'Reviewed, restored' })
      .expect(200);
    await a.client.get(`/seller/workspaces/${a.ws}/rfqs/${rfq.id}`).expect(200);
    const audit = await prisma.auditEvent.findMany({
      where: { resourceId: rfq.id, action: { startsWith: 'admin.rfq' } },
    });
    expect(audit.map((e) => e.action).sort()).toEqual(['admin.rfq.hidden', 'admin.rfq.unhidden']);
  }, 120_000);
});
