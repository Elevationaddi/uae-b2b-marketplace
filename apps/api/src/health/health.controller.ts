import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import type { Liveness, Readiness } from '@app/contracts';
import { pingDatabase, type PrismaClient } from '@app/db';
import type { Response } from 'express';
import type Redis from 'ioredis';
import { APP_ENV, PRISMA, REDIS } from '../infra/tokens';
import { API_VERSION } from '../version';

const CHECK_TIMEOUT_MS = 2_000;

async function timed(
  probe: () => Promise<unknown>,
): Promise<{ status: 'up' | 'down'; latency_ms: number }> {
  const started = process.hrtime.bigint();
  let timer: NodeJS.Timeout | undefined;
  try {
    await Promise.race([
      probe(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('timeout')), CHECK_TIMEOUT_MS);
      }),
    ]);
    return { status: 'up', latency_ms: Number((process.hrtime.bigint() - started) / 1_000_000n) };
  } catch {
    return { status: 'down', latency_ms: Number((process.hrtime.bigint() - started) / 1_000_000n) };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

@Controller('health')
export class HealthController {
  constructor(
    @Inject(APP_ENV) private readonly env: AppEnv,
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  /** Liveness: the process is up. Does not touch dependencies. */
  @Get()
  live(): { data: Liveness; meta: { next_cursor: null } } {
    return {
      data: { status: 'ok', service: 'api', version: API_VERSION, time: new Date().toISOString() },
      meta: { next_cursor: null },
    };
  }

  /** Readiness: PostgreSQL and Redis reachable. 503 when any dependency is down. */
  @Get('ready')
  async ready(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ data: Readiness; meta: { next_cursor: null } }> {
    const [database, redis] = await Promise.all([
      timed(() => pingDatabase(this.prisma)),
      timed(async () => {
        const pong = await this.redis.ping();
        if (pong !== 'PONG') throw new Error('unexpected ping reply');
      }),
    ]);
    const ok = database.status === 'up' && redis.status === 'up';
    res.status(ok ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE);
    return {
      data: {
        status: ok ? 'ready' : 'not_ready',
        service: 'api',
        checks: { database, redis },
        sandbox: this.env.sandbox,
        trading_enabled: this.env.TRADING_ENABLED,
        time: new Date().toISOString(),
      },
      meta: { next_cursor: null },
    };
  }
}
