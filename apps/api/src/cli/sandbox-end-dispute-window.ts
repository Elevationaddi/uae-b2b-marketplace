/**
 * SANDBOX ONLY test clock for browser journeys: treats one order's 14-day dispute window as
 * ended (moves its verified delivery and window end into the past), then runs the worker's
 * settlement sweep for that order. Refuses in production and unless PAYMENT_MODE=mock; audited.
 * Usage: pnpm --filter @app/api sandbox:end-dispute-window <order id>
 */
import { parseEnv } from '@app/config';
import { createPrismaClient, runSettlementSweep, writeAudit } from '@app/db';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const file = resolve(__dirname, '../../../../.env');
if (process.env.NODE_ENV !== 'production' && existsSync(file)) process.loadEnvFile(file);

const DAY = 86_400_000;

async function main() {
  const env = parseEnv(process.env);
  if (env.appEnv === 'production' || env.PAYMENT_MODE !== 'mock')
    throw new Error(
      'sandbox:end-dispute-window is available only in sandbox mode (PAYMENT_MODE=mock)',
    );
  const id = (process.argv[2] ?? '').trim();
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error('usage: sandbox:end-dispute-window <order id>');
  const prisma = createPrismaClient(env.DATABASE_URL);
  try {
    const o = await prisma.order.findUniqueOrThrow({ where: { id } });
    if (!o.deliveryVerifiedAt) throw new Error('delivery is not verified for this order yet');
    await prisma.order.update({
      where: { id },
      data: {
        deliveryVerifiedAt: new Date(Date.now() - (env.DISPUTE_WINDOW_DAYS + 1) * DAY),
        disputeWindowEndsAt: new Date(Date.now() - DAY),
      },
    });
    await writeAudit(prisma, {
      actorType: 'system',
      action: 'sandbox.dispute_window_ended',
      resourceType: 'order',
      resourceId: id,
      reason: 'SANDBOX test clock',
    });
    const res = await runSettlementSweep(prisma, { orderIds: [id] });
    process.stdout.write(`${JSON.stringify(res)}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: Error) => {
  process.stderr.write(`${err.message}\n`);
  process.exit(1);
});
