import { PrismaClient } from '@prisma/client';

export { PrismaClient, Prisma } from '@prisma/client';

/** Create a client. Callers own its lifecycle and must call $disconnect on shutdown. */
export function createPrismaClient(databaseUrl: string): PrismaClient {
  return new PrismaClient({ datasources: { db: { url: databaseUrl } } });
}

/** Lightweight connectivity probe used by readiness checks. */
export async function pingDatabase(client: PrismaClient): Promise<void> {
  await client.$queryRaw`SELECT 1`;
}
