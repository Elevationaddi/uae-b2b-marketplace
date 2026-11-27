/**
 * Development seed. Uses fictional data only (docs/06-data.md).
 * Phase 0 has no business tables, so there is nothing to seed yet; this script
 * verifies the database connection and exits. Phase 1 adds fictional companies,
 * users and admin roles here.
 */
import { PrismaClient } from '@prisma/client';

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed a production database');
  }
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(
      '[seed] Database reachable. Phase 0 defines no business tables, so no rows were written.',
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[seed] failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
