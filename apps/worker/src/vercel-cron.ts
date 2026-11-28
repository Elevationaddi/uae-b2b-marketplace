import { parseEnv } from '@app/config';
import { createPrismaClient } from '@app/db';
import pino from 'pino';
import { cronHandler } from './cron';

/**
 * Vercel Function entry for the background-task cron (not deployed; deployment needs founder
 * approval). Vercel Cron calls it with `Authorization: Bearer $CRON_SECRET`. The environment is
 * validated exactly as for the worker, so production refuses to run with an unsafe configuration.
 */
const env = parseEnv(process.env);
const prisma = createPrismaClient(env.DATABASE_URL);
const log = pino({ level: env.LOG_LEVEL, base: { service: 'cron' } });

/** Stay inside a 60 s function limit: 45 s of task passes plus start-up and response time. */
export const config = { maxDuration: 60 };
export default cronHandler(env, prisma, log, { budgetMs: 45_000 });
