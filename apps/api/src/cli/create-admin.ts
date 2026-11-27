/**
 * Privileged admin provisioning (A03: admins are never created through public registration).
 * Usage: ADMIN_INITIAL_PASSWORD=... pnpm --filter @app/api admin:create <email> <ROLE> [full name]
 * The admin must enrol TOTP at first sign-in. The action is written to the audit log.
 */
import { parseEnv } from '@app/config';
import { ADMIN_ROLES, type AdminRole } from '@app/contracts';
import { createPrismaClient, writeAudit } from '@app/db';
import argon2 from 'argon2';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const file = resolve(__dirname, '../../../../.env');
if (process.env.NODE_ENV !== 'production' && existsSync(file)) process.loadEnvFile(file);

async function main() {
  const env = parseEnv(process.env);
  const [emailArg, roleArg, ...nameParts] = process.argv.slice(2);
  const email = (emailArg ?? '').trim().toLowerCase();
  const role = roleArg as AdminRole;
  const password = process.env.ADMIN_INITIAL_PASSWORD ?? '';
  if (
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
    !(ADMIN_ROLES as readonly string[]).includes(role)
  ) {
    throw new Error(`usage: admin:create <email> <${ADMIN_ROLES.join('|')}> [full name]`);
  }
  if (password.length < 12)
    throw new Error('ADMIN_INITIAL_PASSWORD must be set (min 12 characters)');
  const prisma = createPrismaClient(env.DATABASE_URL);
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.accountType !== 'PLATFORM_ADMIN')
      throw new Error('email belongs to a company account');
    const user =
      existing ??
      (await prisma.user.create({
        data: {
          email,
          fullName: nameParts.join(' ') || null,
          accountType: 'PLATFORM_ADMIN',
          emailVerifiedAt: new Date(),
          passwordHash: await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 1,
          }),
        },
      }));
    await prisma.adminMembership.upsert({
      where: { userId_role: { userId: user.id, role } },
      update: { active: true },
      create: { userId: user.id, role },
    });
    await writeAudit(prisma, {
      actorType: 'system',
      action: 'admin.provisioned_via_cli',
      resourceType: 'user',
      resourceId: user.id,
      details: { role, operator: process.env.USER ?? 'unknown' },
    });
    console.log(`Admin ${email} has role ${role}. TOTP enrolment is required at first sign-in.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(`[admin:create] ${(e as Error).message}`);
  process.exit(1);
});
