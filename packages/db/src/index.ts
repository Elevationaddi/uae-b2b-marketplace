import { PrismaClient } from '@prisma/client';

export { PrismaClient, Prisma } from '@prisma/client';
export * from '@prisma/client';
export * from './audit';
export * from './outbox';
export * from './commerce';

/** Create a client. Callers own its lifecycle and must call $disconnect on shutdown. */
export function createPrismaClient(databaseUrl: string): PrismaClient {
  return new PrismaClient({ datasources: { db: { url: databaseUrl } } });
}

/** Lightweight connectivity probe used by readiness checks. */
export async function pingDatabase(client: PrismaClient): Promise<void> {
  await client.$queryRaw`SELECT 1`;
}

/** Today's date (UTC) as a Date at 00:00Z, for comparing @db.Date columns. */
export function todayUtc(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Format a @db.Date value as YYYY-MM-DD. */
export function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Licence is expired when its expiry date is before today (UTC). Expiry day itself is still valid. */
export function isLicenceExpired(expiry: Date, now: Date = new Date()): boolean {
  return expiry.getTime() < todayUtc(now).getTime();
}
