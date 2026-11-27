import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { PrismaClient } from '@app/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  type Client,
  EICAR_PDF,
  SAMPLE_PDF,
  approveCompany,
  companyInput,
  companyReadyToSubmit,
  loggedInAdmin,
  makeApp,
  signedInUser,
  uniqueLicence,
} from './helpers';

let app: INestApplication;
let env: AppEnv;
let prisma: PrismaClient;
let compliance: Client;

beforeAll(async () => {
  ({ app, env, prisma } = await makeApp());
  compliance = (await loggedInAdmin(app, env, prisma, ['COMPLIANCE'])).client;
});
afterAll(async () => {
  await prisma?.$disconnect();
  await app?.close();
});

describe('company registration', () => {
  it('creates a DRAFT company with owner memberships for each requested workspace', async () => {
    const { client } = await signedInUser(app, env, prisma, 'co');
    const res = await client.post('/companies', companyInput(['BUYER', 'SELLER'])).expect(201);
    const c = res.body.data;
    expect(c.status).toBe('DRAFT');
    expect(c.workspaces.map((w: { kind: string }) => w.kind)).toEqual(['BUYER', 'SELLER']);
    expect(c.workspaces.every((w: { status: string }) => w.status === 'PENDING')).toBe(true);
    const me = (await client.get('/me').expect(200)).body.data;
    expect(me.workspaces).toHaveLength(2);
    expect(me.workspaces.every((w: { role: string }) => w.role === 'OWNER')).toBe(true);
  });

  it('validates fields (422) and rejects a duplicate licence (409)', async () => {
    const { client } = await signedInUser(app, env, prisma, 'val');
    const bad = await client
      .post('/companies', {
        ...companyInput(),
        licence_expiry: '2000-01-01',
        contact_phone: 'abc',
        kinds: [],
      })
      .expect(422);
    expect(Object.keys(bad.body.error.field_errors)).toEqual(
      expect.arrayContaining(['contact_phone', 'kinds']),
    );
    const input = companyInput();
    await client.post('/companies', input).expect(201);
    const dupe = await client.post('/companies', { ...input, display_name: 'Other' }).expect(409);
    expect(dupe.body.error.message_key).toBe('company.licence_exists');
  });

  it('rejects past licence expiry dates', async () => {
    const { client } = await signedInUser(app, env, prisma, 'past');
    const res = await client
      .post('/companies', { ...companyInput(), licence_expiry: '2001-01-01' })
      .expect(422);
    expect(res.body.error.field_errors.licence_expiry).toBe('future');
  });

  it('edits require the current version (stale -> 409)', async () => {
    const { client } = await signedInUser(app, env, prisma, 'ver');
    const c = (await client.post('/companies', companyInput()).expect(201)).body.data;
    await client
      .patch(`/companies/${c.id}`, { display_name: 'Renamed', expected_version: c.version })
      .expect(200);
    const stale = await client
      .patch(`/companies/${c.id}`, { display_name: 'Again', expected_version: c.version })
      .expect(409);
    expect(stale.body.error.message_key).toBe('common.stale_version');
  });
});

describe('documents and verification submission (T02, T03)', () => {
  it('T03: submission without the required documents is rejected', async () => {
    const { client } = await signedInUser(app, env, prisma, 't03a');
    const c = (await client.post('/companies', companyInput()).expect(201)).body.data;
    const res = await client
      .post(`/companies/${c.id}/verification`, {
        terms_version: 'dev-1',
        expected_version: c.version,
      })
      .expect(422);
    expect(res.body.error.field_errors).toMatchObject({
      TRADE_LICENCE: 'required',
      AUTHORIZED_REPRESENTATIVE: 'required',
    });
  });

  it('T03: an infected licence is quarantined, never stored or downloadable, and blocks submission', async () => {
    const { client } = await signedInUser(app, env, prisma, 't03b');
    const c = (await client.post('/companies', companyInput()).expect(201)).body.data;
    const infected = await client
      .upload(
        `/companies/${c.id}/documents`,
        { type: 'TRADE_LICENCE' },
        { name: 'licence.pdf', content: EICAR_PDF },
      )
      .expect(201);
    expect(infected.body.data.file.scan_state).toBe('INFECTED');
    await client
      .upload(
        `/companies/${c.id}/documents`,
        { type: 'AUTHORIZED_REPRESENTATIVE' },
        { name: 'rep.pdf', content: SAMPLE_PDF },
      )
      .expect(201);
    const sub = await client
      .post(`/companies/${c.id}/verification`, {
        terms_version: 'dev-1',
        expected_version: c.version,
      })
      .expect(422);
    expect(sub.body.error.field_errors.TRADE_LICENCE).toBe('required');
    expect(sub.body.error.field_errors.documents).toBe('infected');
    const dl = await client.get(`/files/${infected.body.data.file.id}/download`);
    expect(dl.status).toBe(409);
    expect(
      await prisma.auditEvent.count({
        where: { action: 'document.quarantined', resourceId: infected.body.data.file.id },
      }),
    ).toBe(1);
  });

  it('rejects disallowed file types by content, not by declared type', async () => {
    const { client } = await signedInUser(app, env, prisma, 'mime');
    const c = (await client.post('/companies', companyInput()).expect(201)).body.data;
    const res = await client
      .upload(
        `/companies/${c.id}/documents`,
        { type: 'OTHER' },
        {
          name: 'fake.pdf',
          content: Buffer.from('<html>not a pdf</html>'),
          type: 'application/pdf',
        },
      )
      .expect(422);
    expect(res.body.error.message_key).toBe('file.type_not_allowed');
  });

  it('rejects files above the size limit', async () => {
    const { client } = await signedInUser(app, env, prisma, 'big');
    const c = (await client.post('/companies', companyInput()).expect(201)).body.data;
    const big = Buffer.concat([SAMPLE_PDF, Buffer.alloc(env.UPLOAD_MAX_BYTES + 10, 0x20)]);
    const res = await client
      .upload(`/companies/${c.id}/documents`, { type: 'OTHER' }, { name: 'big.pdf', content: big })
      .expect(422);
    expect(res.body.error.field_errors.file).toBe('too_large');
  });

  it('T02: owner submits clean documents, compliance approves: workspace active, audit and notice written', async () => {
    const { client, email } = await signedInUser(app, env, prisma, 't02');
    const company = await companyReadyToSubmit(client, ['BUYER']);
    const before = (await client.get('/me').expect(200)).body.data.workspaces[0];
    expect(before.capabilities).not.toContain('buyer.purchase'); // T01 groundwork: no trading before approval
    const caseId = await approveCompany(client, compliance, company.id);
    const c = (await client.get(`/companies/${company.id}`).expect(200)).body.data;
    expect(c.status).toBe('APPROVED');
    expect(c.workspaces[0].status).toBe('ACTIVE');
    const after = (await client.get('/me').expect(200)).body.data.workspaces[0];
    expect(after.capabilities).toContain('buyer.purchase');
    const actions = (await prisma.auditEvent.findMany({ where: { resourceId: caseId } })).map(
      (a) => a.action,
    );
    expect(actions).toEqual(
      expect.arrayContaining([
        'verification.submitted',
        'verification.review_started',
        'verification.approved',
      ]),
    );
    const notice = await prisma.outboxEvent.findMany({
      where: { eventType: 'email.verification_decided' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    expect(notice.some((n) => (n.payload as { to?: string }).to === email)).toBe(true);
    // Approved company details are locked.
    await client
      .patch(`/companies/${company.id}`, {
        display_name: 'Locked Name',
        expected_version: c.version,
      })
      .expect(409);
  });

  it('rejection requires a reason; owner fixes documents and resubmits', async () => {
    const { client } = await signedInUser(app, env, prisma, 'rej');
    const company = await companyReadyToSubmit(client);
    await client
      .post(`/companies/${company.id}/verification`, {
        terms_version: 'dev-1',
        expected_version: company.version,
      })
      .expect(200);
    const caseId = (await client.get(`/companies/${company.id}/verification`)).body.data.current.id;
    await compliance
      .post(`/admin/verification/${caseId}/start-review`, { expected_state: 'SUBMITTED' })
      .expect(200);
    await compliance
      .post(`/admin/verification/${caseId}/decision`, {
        decision: 'REJECTED',
        expected_state: 'UNDER_REVIEW',
      })
      .expect(422);
    await compliance
      .post(`/admin/verification/${caseId}/decision`, {
        decision: 'REJECTED',
        reason: 'Licence copy is unreadable',
        expected_state: 'UNDER_REVIEW',
      })
      .expect(200);
    const v = (await client.get(`/companies/${company.id}/verification`)).body.data.current;
    expect(v.state).toBe('REJECTED');
    expect(v.reason).toBe('Licence copy is unreadable');
    expect(v.editable).toBe(true);
    expect(v.events.at(-1)).toMatchObject({ to_state: 'REJECTED', actor: 'admin' });
    // Replace the licence and resubmit.
    const licence = v.documents.find((d: { type: string }) => d.type === 'TRADE_LICENCE');
    await client.delete(`/companies/${company.id}/documents/${licence.id}`).expect(200);
    await client
      .upload(
        `/companies/${company.id}/documents`,
        { type: 'TRADE_LICENCE' },
        { name: 'clear.pdf', content: SAMPLE_PDF },
      )
      .expect(201);
    const fresh = (await client.get(`/companies/${company.id}`)).body.data;
    await client
      .post(`/companies/${company.id}/verification`, {
        terms_version: 'dev-1',
        expected_version: fresh.version,
      })
      .expect(200);
    const again = (await client.get(`/companies/${company.id}/verification`)).body.data.current;
    expect(again.state).toBe('SUBMITTED');
    expect(again.id).toBe(caseId);
  });

  it('documents cannot be changed while under review', async () => {
    const { client } = await signedInUser(app, env, prisma, 'lock');
    const company = await companyReadyToSubmit(client);
    await client
      .post(`/companies/${company.id}/verification`, {
        terms_version: 'dev-1',
        expected_version: company.version,
      })
      .expect(200);
    await client
      .upload(
        `/companies/${company.id}/documents`,
        { type: 'OTHER' },
        { name: 'x.pdf', content: SAMPLE_PDF },
      )
      .expect(409);
  });

  it('decisions use expected state: a second concurrent decision gets 409', async () => {
    const { client } = await signedInUser(app, env, prisma, 'race');
    const company = await companyReadyToSubmit(client);
    await client
      .post(`/companies/${company.id}/verification`, {
        terms_version: 'dev-1',
        expected_version: company.version,
      })
      .expect(200);
    const caseId = (await client.get(`/companies/${company.id}/verification`)).body.data.current.id;
    await compliance
      .post(`/admin/verification/${caseId}/start-review`, { expected_state: 'SUBMITTED' })
      .expect(200);
    const [a, b] = await Promise.all([
      compliance.post(`/admin/verification/${caseId}/decision`, {
        decision: 'APPROVED',
        expected_state: 'UNDER_REVIEW',
      }),
      compliance.post(`/admin/verification/${caseId}/decision`, {
        decision: 'REJECTED',
        reason: 'Conflicting decision',
        expected_state: 'UNDER_REVIEW',
      }),
    ]);
    expect([a.status, b.status].sort()).toEqual([200, 409]);
  });
});

describe('licence expiry and renewal (A08, T35)', () => {
  it('expiry restricts trading, renewal approval restores it with the new licence', async () => {
    const { runLicenceExpiry } = await import('../../worker/src/jobs');
    const { client } = await signedInUser(app, env, prisma, 'exp');
    const company = await companyReadyToSubmit(client);
    await approveCompany(client, compliance, company.id);
    // Simulate time passing: licence expired yesterday.
    await prisma.company.update({
      where: { id: company.id },
      data: { licenceExpiry: new Date(Date.now() - 2 * 86400_000) },
    });
    const res = await runLicenceExpiry(prisma, env);
    expect(res.restricted).toBeGreaterThanOrEqual(1);
    const suspended = (await client.get(`/companies/${company.id}`)).body.data;
    expect(suspended.status).toBe('SUSPENDED');
    expect(suspended.workspaces[0].status).toBe('RESTRICTED');
    const me = (await client.get('/me')).body.data.workspaces[0];
    expect(me.capabilities).not.toContain('buyer.purchase');
    expect(me.capabilities).toContain('buyer.orders.read'); // existing records stay readable
    // Compliance cannot simply reactivate an expired licence.
    await compliance
      .post(`/admin/companies/${company.id}/reactivate`, { reason: 'Trying to reactivate' })
      .expect(409);
    // Owner renews.
    const renewedLicence = uniqueLicence();
    const newExpiry = new Date(Date.now() + 400 * 86400_000).toISOString().slice(0, 10);
    await client
      .post(`/companies/${company.id}/renewal`, {
        licence_number: renewedLicence,
        licence_issuer: 'Test Economic Department',
        licence_expiry: newExpiry,
      })
      .expect(201);
    await client
      .upload(
        `/companies/${company.id}/documents`,
        { type: 'TRADE_LICENCE' },
        { name: 'renewed.pdf', content: SAMPLE_PDF },
      )
      .expect(201);
    await client
      .upload(
        `/companies/${company.id}/documents`,
        { type: 'AUTHORIZED_REPRESENTATIVE' },
        { name: 'rep.pdf', content: SAMPLE_PDF },
      )
      .expect(201);
    const current = (await client.get(`/companies/${company.id}`)).body.data;
    await client
      .post(`/companies/${company.id}/verification`, {
        terms_version: 'dev-1',
        expected_version: current.version,
      })
      .expect(200);
    const caseId = (await client.get(`/companies/${company.id}/verification`)).body.data.current.id;
    await compliance
      .post(`/admin/verification/${caseId}/start-review`, { expected_state: 'SUBMITTED' })
      .expect(200);
    await compliance
      .post(`/admin/verification/${caseId}/decision`, {
        decision: 'APPROVED',
        expected_state: 'UNDER_REVIEW',
      })
      .expect(200);
    const renewed = (await client.get(`/companies/${company.id}`)).body.data;
    expect(renewed.status).toBe('APPROVED');
    expect(renewed.licence_number).toBe(renewedLicence);
    expect(renewed.licence_expiry).toBe(newExpiry);
    expect(renewed.workspaces[0].status).toBe('ACTIVE');
  });

  it('sends one expiry reminder 30 days ahead', async () => {
    const { runLicenceExpiry } = await import('../../worker/src/jobs');
    const { client } = await signedInUser(app, env, prisma, 'remind');
    const company = await companyReadyToSubmit(client);
    await approveCompany(client, compliance, company.id);
    await prisma.company.update({
      where: { id: company.id },
      data: { licenceExpiry: new Date(Date.now() + 10 * 86400_000) },
    });
    await runLicenceExpiry(prisma, env);
    await runLicenceExpiry(prisma, env);
    const c = await prisma.company.findUniqueOrThrow({ where: { id: company.id } });
    expect(c.licenceReminderFor?.toISOString()).toBe(c.licenceExpiry.toISOString());
    expect(c.status).toBe('APPROVED');
  });
});
