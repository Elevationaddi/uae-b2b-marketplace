import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { PrismaClient } from '@app/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  Client,
  PASSWORD,
  SAMPLE_PDF,
  companyInput,
  companyReadyToSubmit,
  emailedToken,
  makeApp,
  signedInUser,
  uniqueEmail,
} from './helpers';

let app: INestApplication;
let env: AppEnv;
let prisma: PrismaClient;

beforeAll(async () => {
  ({ app, env, prisma } = await makeApp());
});
afterAll(async () => {
  await prisma?.$disconnect();
  await app?.close();
});

async function inviteAndAccept(owner: Client, workspaceId: string, role: string) {
  const email = uniqueEmail(role.toLowerCase());
  await owner.post(`/workspaces/${workspaceId}/invitations`, { email, role }).expect(201);
  const token = await emailedToken(prisma, email, 'invitation');
  const invitee = await new Client(app, env.WEB_ORIGIN).init();
  await invitee.post('/auth/register', { email, password: PASSWORD, full_name: role }).expect(202);
  await invitee
    .post('/auth/verify-email', { token: await emailedToken(prisma, email, 'verify_email') })
    .expect(200);
  await invitee.post('/auth/login', { email, password: PASSWORD }).expect(200);
  await invitee.refreshCsrf();
  const accepted = await invitee.post('/invitations/accept', { token }).expect(200);
  return { invitee, email, token, membershipId: accepted.body.data.membership_id as string };
}

describe('team invitations and roles', () => {
  it('owner invites a member who accepts with the invited email; invitations are single use', async () => {
    const { client: owner } = await signedInUser(app, env, prisma, 'owner');
    const company = (await owner.post('/companies', companyInput(['SELLER'])).expect(201)).body
      .data;
    const ws = company.workspaces[0].id;
    const { invitee, token } = await inviteAndAccept(owner, ws, 'SALES');
    const me = (await invitee.get('/me').expect(200)).body.data;
    expect(me.workspaces).toEqual([expect.objectContaining({ id: ws, role: 'SALES' })]);
    await invitee.post('/invitations/accept', { token }).expect(409);
    const members = (await owner.get(`/workspaces/${ws}/members`).expect(200)).body.data;
    expect(members.map((m: { role: string }) => m.role).sort()).toEqual(['OWNER', 'SALES']);
  });

  it('rejects roles that do not belong to the workspace kind', async () => {
    const { client: owner } = await signedInUser(app, env, prisma, 'kind');
    const company = (await owner.post('/companies', companyInput(['BUYER'])).expect(201)).body.data;
    const res = await owner
      .post(`/workspaces/${company.workspaces[0].id}/invitations`, {
        email: uniqueEmail(),
        role: 'WAREHOUSE',
      })
      .expect(422);
    expect(res.body.error.field_errors.role).toBe('not_allowed');
  });

  it('an invitation cannot be accepted by a different account', async () => {
    const { client: owner } = await signedInUser(app, env, prisma, 'mis');
    const company = (await owner.post('/companies', companyInput(['BUYER'])).expect(201)).body.data;
    const email = uniqueEmail('intended');
    await owner
      .post(`/workspaces/${company.workspaces[0].id}/invitations`, { email, role: 'VIEWER' })
      .expect(201);
    const token = await emailedToken(prisma, email, 'invitation');
    const { client: stranger } = await signedInUser(app, env, prisma, 'stranger');
    const res = await stranger.post('/invitations/accept', { token }).expect(403);
    expect(res.body.error.message_key).toBe('invitation.email_mismatch');
  });

  it('expired and revoked invitations cannot be accepted', async () => {
    const { client: owner } = await signedInUser(app, env, prisma, 'exp');
    const company = (await owner.post('/companies', companyInput(['BUYER'])).expect(201)).body.data;
    const ws = company.workspaces[0].id;
    const { client: invitee, email } = await signedInUser(app, env, prisma, 'late');
    const inv = (
      await owner.post(`/workspaces/${ws}/invitations`, { email, role: 'VIEWER' }).expect(201)
    ).body.data;
    const token = await emailedToken(prisma, email, 'invitation');
    await prisma.invitation.update({
      where: { id: inv.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    await invitee.post('/invitations/accept', { token }).expect(409);
    const inv2 = (
      await owner.post(`/workspaces/${ws}/invitations`, { email, role: 'VIEWER' }).expect(201)
    ).body.data;
    const token2 = await emailedToken(prisma, email, 'invitation');
    await owner.delete(`/workspaces/${ws}/invitations/${inv2.id}`).expect(200);
    await invitee.post('/invitations/accept', { token: token2 }).expect(409);
  });

  it('non-owners cannot invite or change roles (403)', async () => {
    const { client: owner } = await signedInUser(app, env, prisma, 'nonown');
    const company = (await owner.post('/companies', companyInput(['BUYER'])).expect(201)).body.data;
    const ws = company.workspaces[0].id;
    const { invitee: procurement, membershipId } = await inviteAndAccept(owner, ws, 'PROCUREMENT');
    await procurement
      .post(`/workspaces/${ws}/invitations`, { email: uniqueEmail(), role: 'VIEWER' })
      .expect(403);
    await procurement.patch(`/memberships/${membershipId}`, { role: 'OWNER' }).expect(403);
    await procurement.get(`/workspaces/${ws}/invitations`).expect(403);
    // Procurement cannot edit company legal details or upload documents.
    await procurement
      .patch(`/companies/${company.id}`, {
        display_name: 'Hijack',
        expected_version: company.version,
      })
      .expect(403);
    await procurement
      .upload(
        `/companies/${company.id}/documents`,
        { type: 'OTHER' },
        { name: 'x.pdf', content: SAMPLE_PDF },
      )
      .expect(403);
  });

  it('T05: revoking a membership denies the member immediately on the old session', async () => {
    const { client: owner } = await signedInUser(app, env, prisma, 't05');
    const company = (await owner.post('/companies', companyInput(['BUYER'])).expect(201)).body.data;
    const ws = company.workspaces[0].id;
    const { invitee, membershipId } = await inviteAndAccept(owner, ws, 'VIEWER');
    await invitee.get(`/companies/${company.id}`).expect(200);
    await invitee.get(`/workspaces/${ws}/members`).expect(200);
    await owner.patch(`/memberships/${membershipId}`, { status: 'REVOKED' }).expect(200);
    await invitee.get(`/companies/${company.id}`).expect(404);
    await invitee.get(`/workspaces/${ws}/members`).expect(404);
    expect((await invitee.get('/me').expect(200)).body.data.workspaces).toHaveLength(0);
  });

  it('T06: the last owner cannot be removed or demoted (409); membership unchanged', async () => {
    const { client: owner } = await signedInUser(app, env, prisma, 't06');
    const company = (await owner.post('/companies', companyInput(['BUYER'])).expect(201)).body.data;
    const ws = company.workspaces[0].id;
    const self = (await owner.get(`/workspaces/${ws}/members`).expect(200)).body.data[0];
    const r1 = await owner
      .patch(`/memberships/${self.membership_id}`, { status: 'REVOKED' })
      .expect(409);
    expect(r1.body.error.message_key).toBe('team.last_owner');
    await owner.patch(`/memberships/${self.membership_id}`, { role: 'VIEWER' }).expect(409);
    const m = await prisma.membership.findUniqueOrThrow({ where: { id: self.membership_id } });
    expect(m).toMatchObject({ role: 'OWNER', status: 'ACTIVE' });
  });

  it('T06 race: two owners revoking each other concurrently leave at least one owner', async () => {
    const { client: a } = await signedInUser(app, env, prisma, 'racea');
    const company = (await a.post('/companies', companyInput(['BUYER'])).expect(201)).body.data;
    const ws = company.workspaces[0].id;
    const { invitee: b, membershipId: bId } = await inviteAndAccept(a, ws, 'OWNER');
    const aId = (await a.get(`/workspaces/${ws}/members`)).body.data.find(
      (m: { is_self: boolean }) => m.is_self,
    ).membership_id;
    const results = await Promise.all([
      a.patch(`/memberships/${bId}`, { status: 'REVOKED' }),
      b.patch(`/memberships/${aId}`, { status: 'REVOKED' }),
    ]);
    expect(results.map((r) => r.status)).toContain(200);
    expect(
      await prisma.membership.count({
        where: { workspaceId: ws, role: 'OWNER', status: 'ACTIVE' },
      }),
    ).toBeGreaterThanOrEqual(1);
  });
});

describe('T04: cross-company isolation', () => {
  it('company A cannot read or act on company B resources, and gets 404 (no existence leak)', async () => {
    const { client: a } = await signedInUser(app, env, prisma, 'tenanta');
    const { client: b } = await signedInUser(app, env, prisma, 'tenantb');
    const companyB = await companyReadyToSubmit(b, ['BUYER', 'SELLER']);
    const vB = (await b.get(`/companies/${companyB.id}/verification`).expect(200)).body.data
      .current;
    const fileB = vB.documents[0].file.id;
    const docB = vB.documents[0].id;
    const wsB = companyB.workspaces[0].id;
    const ownerB = (await b.get(`/workspaces/${wsB}/members`)).body.data[0].membership_id;

    const missing = '00000000-0000-4000-8000-000000000000';
    const probes = [
      a.get(`/companies/${companyB.id}`),
      a.get(`/companies/${companyB.id}/verification`),
      a.patch(`/companies/${companyB.id}`, {
        display_name: 'Hacked Name',
        expected_version: companyB.version,
      }),
      a.post(`/companies/${companyB.id}/verification`, {
        terms_version: 'dev-1',
        expected_version: companyB.version,
      }),
      a.upload(
        `/companies/${companyB.id}/documents`,
        { type: 'OTHER' },
        { name: 'x.pdf', content: SAMPLE_PDF },
      ),
      a.delete(`/companies/${companyB.id}/documents/${docB}`),
      a.get(`/files/${fileB}/download`),
      a.get(`/workspaces/${wsB}/members`),
      a.get(`/workspaces/${wsB}/invitations`),
      a.post(`/workspaces/${wsB}/invitations`, { email: uniqueEmail(), role: 'VIEWER' }),
      a.patch(`/memberships/${ownerB}`, { status: 'REVOKED' }),
      a.post(`/companies/${companyB.id}/renewal`, {
        licence_number: 'X-1',
        licence_issuer: 'Issuer',
        licence_expiry: '2099-01-01',
      }),
    ];
    const results = await Promise.all(probes);
    for (const r of results) {
      expect(r.status, JSON.stringify(r.body)).toBe(404);
      expect(JSON.stringify(r.body)).not.toContain(companyB.id);
    }
    // Same shape as a non-existent id.
    const ghost = await a.get(`/companies/${missing}`);
    expect(ghost.status).toBe(404);
    expect(ghost.body.error.message_key).toBe(results[0]!.body.error.message_key);
    // A's own company list never includes B.
    const list = (await a.get('/companies').expect(200)).body.data;
    expect(list.find((c: { id: string }) => c.id === companyB.id)).toBeUndefined();
    // B's data is unchanged.
    const unchanged = await prisma.company.findUniqueOrThrow({ where: { id: companyB.id } });
    expect(unchanged.displayName).toBe('Test Trading');
  });

  it('viewers can see the company but cannot download legal documents', async () => {
    const { client: owner } = await signedInUser(app, env, prisma, 'docown');
    const company = await companyReadyToSubmit(owner, ['BUYER']);
    const { invitee: viewer } = await inviteAndAccept(owner, company.workspaces[0].id, 'VIEWER');
    const v = (await viewer.get(`/companies/${company.id}/verification`).expect(200)).body.data
      .current;
    const fileId = v.documents[0].file.id;
    await viewer.get(`/files/${fileId}/download`).expect(403);
    const dl = await owner.get(`/files/${fileId}/download`).expect(200);
    expect(dl.headers['content-type']).toBe('application/pdf');
    expect(dl.headers['cache-control']).toContain('no-store');
    expect(Buffer.from(dl.body).subarray(0, 5).toString()).toBe('%PDF-');
    expect(
      await prisma.auditEvent.count({
        where: { action: 'document.downloaded', resourceId: fileId },
      }),
    ).toBe(1);
  });
});
