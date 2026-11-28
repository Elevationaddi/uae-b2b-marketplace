/**
 * Phase 8 tax configuration against PostgreSQL (founder decision F05, conflicts C-08/C-09):
 * TAX_TREATMENT=supplier_status, compliance-confirmed supplier VAT status, per-supplier VAT on
 * checkout, the order's recorded tax rule and non-binding invoice drafts.
 */
import type { INestApplication } from '@nestjs/common';
import type { PrismaClient } from '@app/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { commerceFixtures, setupCommerce, type CommerceCtx } from './commerce-fixtures';
import { companyInput, loggedInAdmin, signedInUser, type Client } from './helpers';

let app: INestApplication;
let prisma: PrismaClient;
let compliance: Client;
let finance: Client;
const ctx = {} as CommerceCtx;
const { seller, buyer, product, addToCart, preview, createCheckout } = commerceFixtures(ctx);

beforeAll(async () => {
  Object.assign(ctx, await setupCommerce({ TAX_TREATMENT: 'supplier_status' }));
  ({ app, prisma, compliance } = ctx);
  finance = (await loggedInAdmin(app, ctx.env, prisma, ['FINANCE'])).client;
}, 180_000);

afterAll(async () => {
  await app?.close();
  await prisma?.$disconnect();
});

const confirmVat = (companyId: string, body: object) =>
  compliance.post(`/admin/companies/${companyId}/vat-status`, body);

describe('supplier VAT status decides checkout VAT (F05)', () => {
  it('blocks an unconfirmed supplier, then charges no VAT once confirmed as not registered', async () => {
    const s = await seller();
    const p = await product(s, 100);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);

    let pv = await preview(b);
    expect(pv.tax_treatment).toBe('supplier_status');
    expect(pv.tax_provisional).toBe(false);
    expect(pv.blocked).toBe(true);
    expect(pv.groups[0].issue).toBe('supplier_vat_unconfirmed');
    await createCheckout(b, pv.preview_hash).expect(409);

    // Only compliance (verification review) may confirm; finance gets 403.
    await finance
      .post(`/admin/companies/${s.companyId}/vat-status`, {
        vat_status: 'NOT_REGISTERED',
        reason: 'Checked FTA register',
      })
      .expect(403);
    const confirmed = (
      await confirmVat(s.companyId, {
        vat_status: 'NOT_REGISTERED',
        reason: 'Checked FTA register: no registration',
      }).expect(200)
    ).body.data;
    expect(confirmed.vat_status).toBe('NOT_REGISTERED');
    expect(confirmed.vat_status_confirmed_at).not.toBeNull();
    const audit = await prisma.auditEvent.findFirst({
      where: { action: 'company.vat_status_confirmed', resourceId: s.companyId },
    });
    expect(audit?.reason).toBe('Checked FTA register: no registration');

    pv = await preview(b);
    expect(pv.blocked).toBe(false);
    expect(pv.groups[0]).toMatchObject({ tax_code: 'NO_VAT_NOT_REGISTERED', tax_bps: 0 });
    expect(pv.tax_fils).toBe('0');
    expect(pv.total_fils).toBe('15000'); // AED 100 merchandise + AED 50 delivery, no VAT
    const c = (await createCheckout(b, pv.preview_hash).expect(201)).body.data;
    const orderId = c.orders[0].id as string;

    const o = (await b.client.get(`/buyer/workspaces/${b.ws}/orders/${orderId}`).expect(200)).body
      .data;
    expect(o).toMatchObject({ tax_code: 'NO_VAT_NOT_REGISTERED', tax_bps: 0, tax_fils: '0' });
    expect(o.tax_provisional).toBe(false);
    const row = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    expect((row.snapshot as { tax: object }).tax).toMatchObject({
      treatment: 'supplier_status',
      code: 'NO_VAT_NOT_REGISTERED',
      supplier_vat_status: 'NOT_REGISTERED',
    });

    // Invoice drafts: never binding; the buyer never sees the commission part.
    const bd = (
      await b.client.get(`/buyer/workspaces/${b.ws}/orders/${orderId}/invoice-draft`).expect(200)
    ).body.data;
    expect(bd).toMatchObject({
      binding: false,
      status: 'draft_not_tax_invoice',
      tax_code: 'NO_VAT_NOT_REGISTERED',
      commission: null,
    });
    expect(bd.supplier).toMatchObject({ vat_status: 'NOT_REGISTERED', vat_confirmed: true });
    const sd = (
      await s.client.get(`/seller/workspaces/${s.ws}/orders/${orderId}/invoice-draft`).expect(200)
    ).body.data;
    expect(sd.commission).toEqual({
      commission_fils: '1000',
      commission_bps: 1000,
      vat: 'pending_professional_advice',
    });
    await finance.get(`/admin/orders/${orderId}/invoice-draft`).expect(200);

    // Another tenant cannot read the draft (404, not 403).
    const other = await buyer();
    await other.client
      .get(`/buyer/workspaces/${other.ws}/orders/${orderId}/invoice-draft`)
      .expect(404);
  });

  it('charges the standard rate only to a confirmed registered supplier with a TRN', async () => {
    const s = await seller();
    const p = await product(s, 100);
    const b = await buyer();
    await addToCart(b, p.skuId, 10).expect(201);

    const noTrn = await confirmVat(s.companyId, {
      vat_status: 'REGISTERED',
      reason: 'Registration certificate checked',
    }).expect(422);
    expect(noTrn.body.error.field_errors).toMatchObject({ trn: 'trn_required' });

    await confirmVat(s.companyId, {
      vat_status: 'REGISTERED',
      trn: '100200300400503',
      reason: 'Registration certificate checked',
    }).expect(200);
    const pv = await preview(b);
    expect(pv.groups[0]).toMatchObject({ tax_code: 'STANDARD', tax_bps: 500, issue: null });
    expect(pv.tax_fils).toBe('750');
    expect(pv.tax_bps).toBe(500);
  });
});

describe('company VAT declaration', () => {
  it('needs a TRN to declare registration, and a change needs confirming again', async () => {
    const { client } = await signedInUser(app, ctx.env, prisma, 'vat');
    const bad = await client
      .post('/companies', { ...companyInput(['SELLER']), vat_status: 'REGISTERED' })
      .expect(422);
    expect(bad.body.error.field_errors).toMatchObject({ trn: 'trn_required' });

    let c = (
      await client
        .post('/companies', {
          ...companyInput(['SELLER']),
          trn: '100200300400503',
          vat_status: 'REGISTERED',
        })
        .expect(201)
    ).body.data;
    expect(c).toMatchObject({ vat_status: 'REGISTERED', vat_status_confirmed_at: null });

    await confirmVat(c.id, { vat_status: 'REGISTERED', reason: 'Certificate checked' }).expect(200);
    c = (await client.get(`/companies/${c.id}`).expect(200)).body.data;
    expect(c.vat_status_confirmed_at).not.toBeNull();

    // Clearing the TRN while registered is refused; switching status clears the confirmation.
    const refused = await client
      .patch(`/companies/${c.id}`, { trn: '', expected_version: c.version })
      .expect(422);
    expect(refused.body.error.field_errors).toMatchObject({ trn: 'trn_required' });
    c = (
      await client
        .patch(`/companies/${c.id}`, { vat_status: 'NOT_REGISTERED', expected_version: c.version })
        .expect(200)
    ).body.data;
    expect(c).toMatchObject({ vat_status: 'NOT_REGISTERED', vat_status_confirmed_at: null });
  });
});
