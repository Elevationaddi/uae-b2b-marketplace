import type { INestApplication } from '@nestjs/common';
import { parseEnv, type AppEnv } from '@app/config';
import { createPrismaClient, type PrismaClient } from '@app/db';
import { authenticator } from 'otplib';
import { randomBytes } from 'node:crypto';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { createApp } from '../src/bootstrap';
import { DEV_PASSWORD } from '../src/cli/seed-secrets';

export const PASSWORD = 'Correct-Horse-Battery-9';
export { DEV_PASSWORD };

export function testEnv(overrides: Record<string, string> = {}): AppEnv {
  return parseEnv({
    ...process.env,
    NODE_ENV: 'test',
    LOG_LEVEL: 'silent',
    RATE_LIMIT_SCALE: '100',
    FILE_SCANNER: 'sandbox-eicar',
    ...overrides,
  });
}

export async function makeApp(
  overrides: Record<string, string> = {},
): Promise<{ app: INestApplication; env: AppEnv; prisma: PrismaClient }> {
  const env = testEnv(overrides);
  const app = await createApp(env, { bufferLogs: false });
  return { app, env, prisma: createPrismaClient(env.DATABASE_URL) };
}

export function uniqueEmail(prefix = 'user'): string {
  return `${prefix}.${randomBytes(5).toString('hex')}@example.test`;
}

export function uniqueLicence(): string {
  return `T-${randomBytes(6).toString('hex').toUpperCase()}`;
}

export function futureDate(days = 365): string {
  return new Date(Date.now() + days * 86400_000).toISOString().slice(0, 10);
}

/** Browser-like client: cookie jar, Origin header and double-submit CSRF token. */
export class Client {
  readonly agent: TestAgent;
  private csrf = '';

  constructor(
    private readonly app: INestApplication,
    private readonly origin: string,
  ) {
    this.agent = request.agent(app.getHttpServer());
  }

  async init(): Promise<this> {
    const res = await this.agent.get('/api/v1/auth/csrf').expect(200);
    this.csrf = res.body.data.csrf_token;
    return this;
  }

  /** Re-read the CSRF cookie after login rotates it. */
  async refreshCsrf(): Promise<void> {
    await this.init();
  }

  get(path: string) {
    return this.agent.get(`/api/v1${path}`);
  }

  private mutate(method: 'post' | 'patch' | 'delete' | 'put', path: string) {
    return this.agent[method](`/api/v1${path}`)
      .set('Origin', this.origin)
      .set('X-CSRF-Token', this.csrf);
  }

  post(path: string, body?: object) {
    return this.mutate('post', path).send(body ?? {});
  }

  patch(path: string, body?: object) {
    return this.mutate('patch', path).send(body ?? {});
  }

  delete(path: string) {
    return this.mutate('delete', path);
  }

  upload(
    path: string,
    fields: Record<string, string>,
    file: { name: string; content: Buffer; type?: string },
  ) {
    let req = this.mutate('post', path);
    for (const [k, v] of Object.entries(fields)) req = req.field(k, v);
    return req.attach('file', file.content, {
      filename: file.name,
      contentType: file.type ?? 'application/pdf',
    });
  }
}

/** Latest one-time token emailed to an address (read from the outbox, as the worker would send it). */
export async function emailedToken(
  prisma: PrismaClient,
  to: string,
  template: string,
): Promise<string> {
  const rows = await prisma.outboxEvent.findMany({
    where: { eventType: `email.${template}` },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
  for (const r of rows) {
    const p = r.payload as { to?: string; vars?: Record<string, string> };
    if (p.to !== to) continue;
    const url = Object.values(p.vars ?? {}).find((v) => v.includes('#token='));
    if (url) return decodeURIComponent(url.split('#token=')[1]!);
  }
  throw new Error(`no ${template} email for ${to}`);
}

/** Registers, verifies and signs in a fresh company user. */
export async function signedInUser(
  app: INestApplication,
  env: AppEnv,
  prisma: PrismaClient,
  prefix = 'user',
) {
  const email = uniqueEmail(prefix);
  const c = await new Client(app, env.WEB_ORIGIN).init();
  await c
    .post('/auth/register', {
      email,
      password: PASSWORD,
      full_name: `${prefix} person`,
      locale: 'en',
    })
    .expect(202);
  const token = await emailedToken(prisma, email, 'verify_email');
  await c.post('/auth/verify-email', { token }).expect(200);
  await c.post('/auth/login', { email, password: PASSWORD }).expect(200);
  await c.refreshCsrf();
  return { client: c, email };
}

export function companyInput(kinds: ('BUYER' | 'SELLER')[] = ['BUYER']) {
  return {
    legal_name: 'Test Trading LLC',
    display_name: 'Test Trading',
    licence_number: uniqueLicence(),
    licence_issuer: 'Test Economic Department',
    licence_expiry: futureDate(),
    activity: 'General trading',
    emirate: 'DUBAI',
    trn: '',
    contact_email: 'contact@example.test',
    contact_phone: '+971 50 123 4567',
    kinds,
  };
}

export const SAMPLE_PDF = Buffer.from('%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n');
export const EICAR_PDF = Buffer.from(
  '%PDF-1.4\nX5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*\n%%EOF\n',
);

/** Company with both required documents uploaded (DRAFT, ready to submit). */
export async function companyReadyToSubmit(
  client: Client,
  kinds: ('BUYER' | 'SELLER')[] = ['BUYER'],
) {
  const res = await client.post('/companies', companyInput(kinds)).expect(201);
  const company = res.body.data;
  for (const type of ['TRADE_LICENCE', 'AUTHORIZED_REPRESENTATIVE']) {
    await client
      .upload(
        `/companies/${company.id}/documents`,
        { type },
        { name: `${type}.pdf`, content: SAMPLE_PDF },
      )
      .expect(201);
  }
  return company as { id: string; version: number; workspaces: { id: string; kind: string }[] };
}

export async function adminClient(
  app: INestApplication,
  env: AppEnv,
  email: string,
  secret: string,
): Promise<Client> {
  const c = await new Client(app, env.ADMIN_ORIGIN).init();
  await c.post('/admin/auth/login', { email, password: DEV_PASSWORD }).expect(200);
  await c.refreshCsrf();
  // A code can be used once; wait for a fresh time step if this one was already used in this run.
  let code = authenticator.generate(secret);
  let res = await c.post('/admin/auth/mfa/verify', { code });
  if (res.status !== 200) {
    await new Promise((r) => setTimeout(r, 30_000 - (Date.now() % 30_000) + 200));
    code = authenticator.generate(secret);
    res = await c.post('/admin/auth/mfa/verify', { code });
  }
  if (res.status !== 200) throw new Error(`admin MFA failed: ${JSON.stringify(res.body)}`);
  await c.refreshCsrf();
  return c;
}

/** Submit then approve a company via compliance. */
export async function approveCompany(user: Client, compliance: Client, companyId: string) {
  const company = (await user.get(`/companies/${companyId}`).expect(200)).body.data;
  await user
    .post(`/companies/${companyId}/verification`, {
      terms_version: 'dev-1',
      expected_version: company.version,
    })
    .expect(200);
  const v = (await user.get(`/companies/${companyId}/verification`).expect(200)).body.data;
  const caseId = v.current.id;
  await compliance
    .post(`/admin/verification/${caseId}/start-review`, { expected_state: 'SUBMITTED' })
    .expect(200);
  await compliance
    .post(`/admin/verification/${caseId}/decision`, {
      decision: 'APPROVED',
      expected_state: 'UNDER_REVIEW',
    })
    .expect(200);
  return caseId as string;
}

/** Creates a fresh MFA-enrolled admin with the given roles (unique secret avoids TOTP replay clashes). */
export async function createAdmin(
  prisma: PrismaClient,
  env: AppEnv,
  roles: ('COMPLIANCE' | 'SUPPORT' | 'FINANCE' | 'FINANCE_APPROVER' | 'SUPER_ADMIN')[],
) {
  const { encryptSecret } = await import('../src/common/crypto');
  const argon2 = (await import('argon2')).default;
  const secret = authenticator.generateSecret(20);
  const email = uniqueEmail('admin');
  const user = await prisma.user.create({
    data: {
      email,
      accountType: 'PLATFORM_ADMIN',
      emailVerifiedAt: new Date(),
      passwordHash: await argon2.hash(DEV_PASSWORD, { type: argon2.argon2id }),
      mfaEnabled: true,
      mfaSecretEnc: encryptSecret(secret, env.MFA_ENCRYPTION_KEY),
      adminMemberships: { create: roles.map((role) => ({ role })) },
    },
  });
  return { email, secret, id: user.id };
}

export async function loggedInAdmin(
  app: INestApplication,
  env: AppEnv,
  prisma: PrismaClient,
  roles: Parameters<typeof createAdmin>[2],
) {
  const a = await createAdmin(prisma, env, roles);
  return { client: await adminClient(app, env, a.email, a.secret), ...a };
}
