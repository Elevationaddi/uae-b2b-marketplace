/** Staging mail catcher (C-20) against real PostgreSQL: rendered emails are stored, never sent. */
import { parseEnv } from '@app/config';
import { createPrismaClient } from '@app/db';
import { randomBytes } from 'node:crypto';
import { afterAll, describe, expect, it } from 'vitest';
import { createMailer } from '../src/jobs';

describe('staging mail catcher', () => {
  const env = parseEnv({
    ...process.env,
    NODE_ENV: 'test',
    LOG_LEVEL: 'silent',
    EMAIL_PROVIDER: 'catcher',
  });
  const prisma = createPrismaClient(env.DATABASE_URL);
  afterAll(() => prisma.$disconnect());

  it('stores the rendered email for admins instead of sending it', async () => {
    const to = `catcher.${randomBytes(4).toString('hex')}@example.test`;
    const mailer = createMailer(env, prisma);
    expect(mailer).not.toBeNull();
    await mailer!.send(to, 'Verify your email', 'Open https://staging.app.invalid/ar/verify', {
      template: 'verify_email',
      locale: 'ar',
    });
    const caught = await prisma.caughtEmail.findFirstOrThrow({ where: { toAddress: to } });
    expect(caught.subject).toBe('[STAGING] Verify your email');
    expect(caught.locale).toBe('ar');
    expect(caught.template).toBe('verify_email');
    expect(caught.body).toContain('https://staging.app.invalid/ar/verify');
  });

  it('is refused without a database client', () => {
    expect(() => createMailer(env)).toThrow(/database/);
  });
});
