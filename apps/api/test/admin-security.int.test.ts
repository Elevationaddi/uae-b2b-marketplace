import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { PrismaClient } from '@app/db';
import { authenticator } from 'otplib';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  Client,
  DEV_PASSWORD,
  PASSWORD,
  companyReadyToSubmit,
  createAdmin,
  loggedInAdmin,
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

describe('admin MFA (A02)', () => {
  it('requires TOTP enrolment before any admin access, then issues single-use recovery codes', async () => {
    const argon2 = (await import('argon2')).default;
    const email = uniqueEmail('enrol');
    await prisma.user.create({
      data: {
        email,
        accountType: 'PLATFORM_ADMIN',
        emailVerifiedAt: new Date(),
        passwordHash: await argon2.hash(DEV_PASSWORD, { type: argon2.argon2id }),
        adminMemberships: { create: [{ role: 'COMPLIANCE' }] },
      },
    });
    const c = await new Client(app, env.ADMIN_ORIGIN).init();
    const login = await c.post('/admin/auth/login', { email, password: DEV_PASSWORD }).expect(200);
    expect(login.body.data.mfa).toBe('ENROLL_REQUIRED');
    await c.refreshCsrf();
    // Password alone gives no access.
    const blocked = await c.get('/admin/me').expect(401);
    expect(blocked.body.error.message_key).toBe('admin.mfa_required');
    await c.get('/admin/verification').expect(401);
    const start = (await c.post('/admin/auth/mfa/enroll/start').expect(200)).body.data;
    expect(start.otpauth_url).toMatch(/^otpauth:\/\/totp\//);
    expect(start.qr_svg).toContain('<svg');
    const stored = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(stored.mfaSecretEnc).not.toContain(start.secret); // encrypted at rest
    await c.post('/admin/auth/mfa/enroll/confirm', { code: '000000' }).expect(422);
    const confirmed = await c
      .post('/admin/auth/mfa/enroll/confirm', { code: authenticator.generate(start.secret) })
      .expect(200);
    const codes: string[] = confirmed.body.data.recovery_codes;
    expect(codes).toHaveLength(10);
    await c.refreshCsrf();
    expect((await c.get('/admin/me').expect(200)).body.data.recovery_codes_remaining).toBe(10);

    // New login: verify with a recovery code; the same code cannot be used twice.
    const c2 = await new Client(app, env.ADMIN_ORIGIN).init();
    expect(
      (await c2.post('/admin/auth/login', { email, password: DEV_PASSWORD }).expect(200)).body.data
        .mfa,
    ).toBe('VERIFY_REQUIRED');
    await c2.refreshCsrf();
    await c2.post('/admin/auth/mfa/verify', { recovery_code: codes[0] }).expect(200);
    const c3 = await new Client(app, env.ADMIN_ORIGIN).init();
    await c3.post('/admin/auth/login', { email, password: DEV_PASSWORD }).expect(200);
    await c3.refreshCsrf();
    await c3.post('/admin/auth/mfa/verify', { recovery_code: codes[0] }).expect(422);
    expect(
      await prisma.auditEvent.count({
        where: { action: 'admin.mfa_recovery_code_used', actorId: stored.id },
      }),
    ).toBe(1);
  });

  it('a TOTP code cannot be replayed', async () => {
    const a = await createAdmin(prisma, env, ['SUPPORT']);
    const code = authenticator.generate(a.secret);
    const first = await new Client(app, env.ADMIN_ORIGIN).init();
    await first.post('/admin/auth/login', { email: a.email, password: DEV_PASSWORD }).expect(200);
    await first.refreshCsrf();
    await first.post('/admin/auth/mfa/verify', { code }).expect(200);
    const second = await new Client(app, env.ADMIN_ORIGIN).init();
    await second.post('/admin/auth/login', { email: a.email, password: DEV_PASSWORD }).expect(200);
    await second.refreshCsrf();
    await second.post('/admin/auth/mfa/verify', { code }).expect(422);
  });

  it('rotates the admin session token after MFA (fixation defence)', async () => {
    const a = await createAdmin(prisma, env, ['SUPPORT']);
    const c = await new Client(app, env.ADMIN_ORIGIN).init();
    const login = await c
      .post('/admin/auth/login', { email: a.email, password: DEV_PASSWORD })
      .expect(200);
    const preMfa = (login.headers['set-cookie'] as unknown as string[])
      .find((h) => h.startsWith('asid='))!
      .split(';')[0]!;
    await c.refreshCsrf();
    const verify = await c
      .post('/admin/auth/mfa/verify', { code: authenticator.generate(a.secret) })
      .expect(200);
    const postMfa = (verify.headers['set-cookie'] as unknown as string[])
      .find((h) => h.startsWith('asid='))!
      .split(';')[0]!;
    expect(postMfa).not.toBe(preMfa);
    // The pre-MFA token no longer works.
    await request(app.getHttpServer()).get('/api/v1/admin/me').set('Cookie', preMfa).expect(401);
  });
});

describe('separation of admin and company sessions (A03)', () => {
  it('company sessions cannot reach admin APIs and admin sessions cannot reach company APIs', async () => {
    const { client: user } = await signedInUser(app, env, prisma, 'sep');
    await user.get('/admin/me').expect(401);
    await user.get('/admin/verification').expect(401);
    const { client: admin } = await loggedInAdmin(app, env, prisma, ['SUPER_ADMIN']);
    await admin.get('/me').expect(401);
    await admin.get('/companies').expect(401);
  });

  it('a company session cookie presented as the admin cookie is rejected', async () => {
    const { email } = await signedInUser(app, env, prisma, 'swap');
    const c = await new Client(app, env.WEB_ORIGIN).init();
    const res = await c.post('/auth/login', { email, password: PASSWORD }).expect(200);
    const sid = (res.headers['set-cookie'] as unknown as string[])
      .find((h) => h.startsWith('sid='))!
      .split(';')[0]!
      .split('=')[1];
    await request(app.getHttpServer())
      .get('/api/v1/admin/me')
      .set('Cookie', `asid=${sid}`)
      .expect(401);
  });
});

describe('admin role matrix', () => {
  it('only compliance reviews verification; support and super-admin get 403', async () => {
    const support = (await loggedInAdmin(app, env, prisma, ['SUPPORT'])).client;
    const superAdmin = (await loggedInAdmin(app, env, prisma, ['SUPER_ADMIN'])).client;
    const compliance = (await loggedInAdmin(app, env, prisma, ['COMPLIANCE'])).client;
    await support.get('/admin/verification').expect(403);
    await superAdmin.get('/admin/verification').expect(403);
    await compliance.get('/admin/verification').expect(200);
    await support.get('/admin/companies').expect(200);
    await support.get('/admin/audit').expect(403);
    await compliance.get('/admin/staff').expect(403);
    await superAdmin.get('/admin/staff').expect(200);
  });

  it('suspension needs a reason, restricts the workspace and keeps member access', async () => {
    const compliance = (await loggedInAdmin(app, env, prisma, ['COMPLIANCE'])).client;
    const { client: owner } = await signedInUser(app, env, prisma, 'susp');
    const company = await companyReadyToSubmit(owner);
    const { approveCompany } = await import('./helpers');
    await approveCompany(owner, compliance, company.id);
    await compliance.post(`/admin/companies/${company.id}/suspend`, { reason: '' }).expect(422);
    await compliance
      .post(`/admin/companies/${company.id}/suspend`, { reason: 'Compliance investigation' })
      .expect(200);
    const c = (await owner.get(`/companies/${company.id}`).expect(200)).body.data;
    expect(c.status).toBe('SUSPENDED');
    expect(c.workspaces[0].status).toBe('RESTRICTED');
    await compliance
      .post(`/admin/companies/${company.id}/reactivate`, { reason: 'Investigation closed' })
      .expect(200);
    expect((await owner.get(`/companies/${company.id}`)).body.data.status).toBe('APPROVED');
  });

  it("admin can revoke a user's sessions with a reason (audited)", async () => {
    const admin = (await loggedInAdmin(app, env, prisma, ['COMPLIANCE'])).client;
    const { client: user, email } = await signedInUser(app, env, prisma, 'revoked');
    const u = await prisma.user.findUniqueOrThrow({ where: { email } });
    await admin
      .post(`/admin/users/${u.id}/revoke-sessions`, { reason: 'Suspected account compromise' })
      .expect(200);
    await user.get('/me').expect(401);
    expect(
      await prisma.auditEvent.count({
        where: { action: 'admin.user_sessions_revoked', resourceId: u.id },
      }),
    ).toBe(1);
  });

  it("the last super-admin cannot remove their own role; role changes revoke the target's sessions", async () => {
    const sa = await loggedInAdmin(app, env, prisma, ['SUPER_ADMIN']);
    const target = await loggedInAdmin(app, env, prisma, ['SUPPORT']);
    await sa.client
      .post(`/admin/staff/${target.id}/roles`, {
        roles: ['SUPPORT', 'FINANCE'],
        reason: 'Covering finance desk',
      })
      .expect(200);
    await target.client.get('/admin/me').expect(401);
    const supers = await prisma.adminMembership.count({
      where: { role: 'SUPER_ADMIN', active: true },
    });
    if (supers === 1) {
      await sa.client
        .post(`/admin/staff/${sa.id}/roles`, {
          roles: ['SUPPORT'],
          reason: 'Self demotion attempt',
        })
        .expect(409);
    }
  });
});

describe('CSRF protection', () => {
  it('rejects state changes without the CSRF token, with a foreign Origin, or with no Origin', async () => {
    const { client } = await signedInUser(app, env, prisma, 'csrf');
    const noToken = await client.agent
      .post('/api/v1/auth/logout')
      .set('Origin', env.WEB_ORIGIN)
      .expect(403);
    expect(noToken.body.error.message_key).toBe('common.csrf_token');
    const evil = await client.agent
      .post('/api/v1/auth/logout')
      .set('Origin', 'https://evil.invalid')
      .expect(403);
    expect(evil.body.error.message_key).toBe('common.csrf_origin');
    await client.agent.post('/api/v1/auth/logout').expect(403);
    await client.get('/me').expect(200); // still signed in
  });

  it('admin routes only accept the admin origin', async () => {
    const c = await new Client(app, env.WEB_ORIGIN).init(); // web origin used against an admin route
    const res = await c
      .post('/admin/auth/login', { email: 'x@example.test', password: 'whatever-123' })
      .expect(403);
    expect(res.body.error.message_key).toBe('common.csrf_origin');
  });
});

describe('rate limiting', () => {
  it('locks out repeated login attempts for an account with 429', async () => {
    const strict = await makeApp({ RATE_LIMIT_SCALE: '1' });
    // Counters are shared in Redis with the relaxed test app; start this policy from zero.
    const Redis = (await import('ioredis')).default;
    const redis = new Redis(strict.env.REDIS_URL);
    const keys = await redis.keys('rl:login_*');
    if (keys.length) await redis.del(...keys);
    await redis.quit();
    try {
      const email = uniqueEmail('brute');
      const c = await new Client(strict.app, strict.env.WEB_ORIGIN).init();
      const statuses: number[] = [];
      for (let i = 0; i < 12; i++) {
        statuses.push(
          (await c.post('/auth/login', { email, password: `Wrong-Password-${i}` })).status,
        );
      }
      expect(statuses.slice(0, 10).every((s) => s === 401)).toBe(true);
      expect(statuses.slice(10)).toEqual([429, 429]);
      const last = await c.post('/auth/login', { email, password: 'Wrong-Password-x' });
      expect(last.body.error.code).toBe('RATE_LIMITED');
      expect(Number(last.body.error.field_errors.retry_after)).toBeGreaterThan(0);
    } finally {
      await strict.prisma.$disconnect();
      await strict.app.close();
    }
  });
});

describe('audit log (T32)', () => {
  it('is append-only at the database level', async () => {
    const row = await prisma.auditEvent.findFirstOrThrow();
    await expect(
      prisma.$executeRaw`UPDATE audit_events SET action = 'tampered' WHERE id = ${row.id}::uuid`,
    ).rejects.toThrow(/append-only/);
    await expect(
      prisma.$executeRaw`DELETE FROM audit_events WHERE id = ${row.id}::uuid`,
    ).rejects.toThrow(/append-only/);
    await expect(prisma.$executeRaw`TRUNCATE audit_events`).rejects.toThrow(/append-only/);
  });

  it('is readable (paginated, filterable) by authorised admins and never contains secrets', async () => {
    const admin = (await loggedInAdmin(app, env, prisma, ['SUPER_ADMIN'])).client;
    const page1 = (await admin.get('/admin/audit?limit=5').expect(200)).body;
    expect(page1.data).toHaveLength(5);
    expect(page1.meta.next_cursor).toBeTruthy();
    const page2 = (
      await admin.get(`/admin/audit?limit=5&cursor=${page1.meta.next_cursor}`).expect(200)
    ).body;
    expect(page2.data[0].id).not.toBe(page1.data[0].id);
    const filtered = (await admin.get('/admin/audit?action=auth.login&limit=20').expect(200)).body
      .data;
    expect(filtered.every((e: { action: string }) => e.action.startsWith('auth.login'))).toBe(true);
    const all = JSON.stringify((await admin.get('/admin/audit?limit=100').expect(200)).body);
    expect(all).not.toMatch(/argon2|#token=|password":"[^[]/);
  });
});

describe('platform admins cannot hold company memberships', () => {
  it('is enforced by the database', async () => {
    const a = await createAdmin(prisma, env, ['SUPPORT']);
    const ws = await prisma.workspace.findFirstOrThrow();
    await expect(
      prisma.membership.create({ data: { workspaceId: ws.id, userId: a.id, role: 'VIEWER' } }),
    ).rejects.toThrow(/platform admin/);
  });
});
