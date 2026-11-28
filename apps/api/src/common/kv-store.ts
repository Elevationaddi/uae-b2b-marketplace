import { Inject, Injectable } from '@nestjs/common';
import type { PrismaClient } from '@app/db';
import type Redis from 'ioredis';
import { PRISMA, REDIS } from '../infra/tokens';

/**
 * Short-lived counters and one-time markers. Redis when REDIS_URL is set; otherwise PostgreSQL
 * (`rate_limit_buckets`), so serverless deployments without Redis still enforce rate limits and
 * TOTP replay protection (Phase 8, C-20). Both stores fail closed: an error propagates (500).
 */
export interface Counter {
  points: number;
  msBeforeNext: number;
}

@Injectable()
export class KvStore {
  constructor(
    @Inject(PRISMA) private readonly prisma: PrismaClient,
    @Inject(REDIS) private readonly redis: Redis | null,
  ) {}

  get kind(): 'redis' | 'postgres' {
    return this.redis ? 'redis' : 'postgres';
  }

  /** Add one point to a fixed window of `seconds`; returns the window's points so far. */
  async increment(key: string, seconds: number): Promise<Counter> {
    if (this.redis) {
      const [[, points], [, ttl]] = (await this.redis.multi().incr(key).pttl(key).exec()) as [
        [null, number],
        [null, number],
      ];
      let ms = ttl;
      if (ttl < 0) {
        await this.redis.pexpire(key, seconds * 1000);
        ms = seconds * 1000;
      }
      return { points, msBeforeNext: ms };
    }
    const rows = await this.prisma.$queryRaw<{ points: number; ms: number }[]>`
      INSERT INTO rate_limit_buckets (key, points, expires_at)
      VALUES (${key}, 1, now() + make_interval(secs => ${seconds}))
      ON CONFLICT (key) DO UPDATE SET
        points = CASE WHEN rate_limit_buckets.expires_at <= now() THEN 1
                      ELSE rate_limit_buckets.points + 1 END,
        expires_at = CASE WHEN rate_limit_buckets.expires_at <= now()
                          THEN now() + make_interval(secs => ${seconds})
                          ELSE rate_limit_buckets.expires_at END
      RETURNING points, (EXTRACT(EPOCH FROM (expires_at - now())) * 1000)::int AS ms`;
    // Opportunistic cleanup keeps the table small without a separate job.
    if (Math.random() < 0.01)
      await this.prisma
        .$executeRaw`DELETE FROM rate_limit_buckets WHERE expires_at < now() - interval '1 hour'`;
    return { points: rows[0]!.points, msBeforeNext: Math.max(0, rows[0]!.ms) };
  }

  async delete(key: string): Promise<void> {
    if (this.redis) await this.redis.del(key);
    else await this.prisma.rateLimitBucket.deleteMany({ where: { key } });
  }

  /** True the first time `key` is set within `seconds`; false while it is still set. */
  async setOnce(key: string, seconds: number): Promise<boolean> {
    if (this.redis) return (await this.redis.set(key, '1', 'EX', seconds, 'NX')) === 'OK';
    return (await this.increment(key, seconds)).points === 1;
  }

  async ping(): Promise<void> {
    if (this.redis) {
      if ((await this.redis.ping()) !== 'PONG') throw new Error('unexpected ping reply');
    } else await this.prisma.$queryRaw`SELECT 1 FROM rate_limit_buckets LIMIT 1`;
  }
}
