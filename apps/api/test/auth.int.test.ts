import type { INestApplication } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { PrismaClient } from '@app/db';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { Client, PASSWORD, emailedToken, makeApp, signedInUser, uniqueEmail } from './helpers';

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

describe('registration and email verification (A07)', () => {
  it('registers with a generic 202, stores an Argon2id hash and queues a verification email', async () => {
    const email = uniqueEmail('reg');
    const c = await new Client(app, env.WEB_ORIGIN).init();
    const res = await c
      .post('/auth/register', {
        email: email.toUpperCase(),
        password: PASSWORD,
        full_name: 'Reg User',
      })
      .expect(202);
    expect(res.body.data).toEqual({ accepted: true });
    expect(res.headers['set-cookie']?.toString() ?? '').not.toMatch(/sid=/);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(user.passwordHash).toMatch(/^\$argon2id\$/);
    expect(user.emailVerifiedAt).toBeNull();
    const outbox = await prisma.outboxEvent.findFirst({
      where: { eventType: 'email.verify_email' },
      orderBy: { createdAt: 'desc' },
    });
    expect(JSON.stringify(outbox?.payload)).toContain('#token=');
  });

  it('does not reveal whether an email is already registered', async () => {
    const email = uniqueEmail('dupe');
    const c = await new Client(app, env.WEB_ORIGIN).init();
    const first = await c.post('/auth/register', { email, password: PASSWORD, full_name: 'A' });
    const second = await c.post('/auth/register', {
      email,
      password: 'Another-Password-1',
      full_name: 'B',
    });
    expect(first.status).toBe(202);
    expect(second.status).toBe(202);
    expect(second.body).toEqual(first.body);
    expect(await prisma.user.count({ where: { email } })).toBe(1);
  });

  it('rejects weak passwords with field errors (422)', async () => {
    const c = await new Client(app, env.WEB_ORIGIN).init();
    const res = await c
      .post('/auth/register', { email: uniqueEmail(), password: 'short', full_name: 'X' })
      .expect(422);
    expect(res.body.error.code).toBe('VALIDATION_FAILED');
    expect(res.body.error.field_errors.password).toBe('min');
  });

  it('blocks company actions until the email is verified, then allows them', async () => {
    const email = uniqueEmail('unv');
    const c = await new Client(app, env.WEB_ORIGIN).init();
    await c.post('/auth/register', { email, password: PASSWORD, full_name: 'U' }).expect(202);
    await c.post('/auth/login', { email, password: PASSWORD }).expect(200);
    await c.refreshCsrf();
    const me = await c.get('/me').expect(200);
    expect(me.body.data.user.email_verified).toBe(false);
    const blocked = await c.get('/companies').expect(403);
    expect(blocked.body.error.message_key).toBe('auth.email_not_verified');
    const token = await emailedToken(prisma, email, 'verify_email');
    await c.post('/auth/verify-email', { token }).expect(200);
    await c.get('/companies').expect(200);
    // Tokens are single use.
    await c.post('/auth/verify-email', { token }).expect(422);
  });
});

describe('login, sessions and logout', () => {
  it('sets an HttpOnly SameSite session cookie and stores only a token hash', async () => {
    const { client, email } = await signedInUser(app, env, prisma, 'login');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: { sessions: true },
    });
    expect(user.sessions.length).toBeGreaterThan(0);
    const c = await new Client(app, env.WEB_ORIGIN).init();
    const res = await c.post('/auth/login', { email, password: PASSWORD }).expect(200);
    const cookie = (res.headers['set-cookie'] as unknown as string[]).find((h) =>
      h.startsWith('sid='),
    )!;
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Lax/);
    const raw = cookie.split(';')[0]!.split('=')[1]!;
    expect(await prisma.session.count({ where: { tokenHash: raw } })).toBe(0); // raw token is never stored
    await client.get('/me').expect(200);
  });

  it('uses one generic error for unknown email and wrong password', async () => {
    const { email } = await signedInUser(app, env, prisma, 'generic');
    const c = await new Client(app, env.WEB_ORIGIN).init();
    const a = await c.post('/auth/login', { email, password: 'Wrong-Password-123' }).expect(401);
    const b = await c
      .post('/auth/login', { email: uniqueEmail('nobody'), password: 'Wrong-Password-123' })
      .expect(401);
    expect(a.body.error.message_key).toBe('auth.invalid_credentials');
    expect(b.body.error.message_key).toBe(a.body.error.message_key);
  });

  it('logout revokes the session server-side', async () => {
    const { client } = await signedInUser(app, env, prisma, 'logout');
    await client.post('/auth/logout').expect(200);
    await client.get('/me').expect(401);
  });

  it('lists own sessions and revokes another session immediately', async () => {
    const { client: a, email } = await signedInUser(app, env, prisma, 'multi');
    const b = await new Client(app, env.WEB_ORIGIN).init();
    await b.post('/auth/login', { email, password: PASSWORD }).expect(200);
    await b.refreshCsrf();
    const list = (await a.get('/me/sessions').expect(200)).body.data as {
      id: string;
      current: boolean;
    }[];
    expect(list.filter((s) => s.current)).toHaveLength(1);
    const other = list.find((s) => !s.current)!;
    await a.delete(`/me/sessions/${other.id}`).expect(200);
    await b.get('/me').expect(401);
  });

  it("cannot revoke another user's session (404)", async () => {
    const { client: a } = await signedInUser(app, env, prisma, 'sa');
    const { email: otherEmail } = await signedInUser(app, env, prisma, 'sb');
    const other = await prisma.session.findFirstOrThrow({ where: { user: { email: otherEmail } } });
    await a.delete(`/me/sessions/${other.id}`).expect(404);
  });
});

describe('password reset', () => {
  it('resets with a single-use token, revokes all sessions and queues a notice', async () => {
    const { client, email } = await signedInUser(app, env, prisma, 'reset');
    const anon = await new Client(app, env.WEB_ORIGIN).init();
    await anon.post('/auth/password-reset/request', { email }).expect(202);
    const token = await emailedToken(prisma, email, 'password_reset');
    await anon
      .post('/auth/password-reset/confirm', { token, new_password: 'Brand-New-Password-42' })
      .expect(200);
    await client.get('/me').expect(401);
    await anon
      .post('/auth/password-reset/confirm', { token, new_password: 'Another-New-Password-42' })
      .expect(422);
    await anon.post('/auth/login', { email, password: PASSWORD }).expect(401);
    await anon.post('/auth/login', { email, password: 'Brand-New-Password-42' }).expect(200);
  });

  it('responds identically for unknown emails', async () => {
    const anon = await new Client(app, env.WEB_ORIGIN).init();
    const res = await anon
      .post('/auth/password-reset/request', { email: uniqueEmail('ghost') })
      .expect(202);
    expect(res.body.data).toEqual({ accepted: true });
  });

  it('rejects expired reset tokens', async () => {
    const { email } = await signedInUser(app, env, prisma, 'expired');
    const anon = await new Client(app, env.WEB_ORIGIN).init();
    await anon.post('/auth/password-reset/request', { email }).expect(202);
    const token = await emailedToken(prisma, email, 'password_reset');
    await prisma.userToken.updateMany({
      where: { user: { email }, purpose: 'RESET_PASSWORD' },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    await anon
      .post('/auth/password-reset/confirm', { token, new_password: 'Brand-New-Password-42' })
      .expect(422);
  });

  it('change password requires the current password and signs out other sessions', async () => {
    const { client, email } = await signedInUser(app, env, prisma, 'chg');
    const other = await new Client(app, env.WEB_ORIGIN).init();
    await other.post('/auth/login', { email, password: PASSWORD }).expect(200);
    await client
      .post('/me/password', {
        current_password: 'nope-nope-nope',
        new_password: 'Changed-Password-77',
      })
      .expect(422);
    await client
      .post('/me/password', { current_password: PASSWORD, new_password: 'Changed-Password-77' })
      .expect(200);
    await client.get('/me').expect(200);
    await other.get('/me').expect(401);
  });
});

describe('admins cannot use public flows (A03)', () => {
  it('admin credentials are rejected by company login, and admin passwords cannot be reset publicly', async () => {
    const admin = await prisma.user.findFirst({ where: { accountType: 'PLATFORM_ADMIN' } });
    if (!admin) return; // seeded admins exist in dev/CI
    const c = await new Client(app, env.WEB_ORIGIN).init();
    await c.post('/auth/login', { email: admin.email, password: 'DevOnly-Passw0rd!' }).expect(401);
    const before = await prisma.userToken.count({
      where: { userId: admin.id, purpose: 'RESET_PASSWORD' },
    });
    await c.post('/auth/password-reset/request', { email: admin.email }).expect(202);
    expect(
      await prisma.userToken.count({ where: { userId: admin.id, purpose: 'RESET_PASSWORD' } }),
    ).toBe(before);
  });
});
