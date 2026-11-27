import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import Redis from 'ioredis';
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';
import { APP_ENV, REDIS } from '../infra/tokens';
import { ApiError } from './api-error';

/** Named policies: points per duration (seconds). Scaled by RATE_LIMIT_SCALE outside production. */
const POLICIES = {
  login_ip: { points: 50, duration: 15 * 60 },
  login_account: { points: 10, duration: 15 * 60 },
  register_ip: { points: 10, duration: 60 * 60 },
  email_action_account: { points: 3, duration: 60 * 60 },
  email_action_ip: { points: 20, duration: 60 * 60 },
  token_ip: { points: 30, duration: 15 * 60 },
  admin_login_ip: { points: 20, duration: 15 * 60 },
  admin_login_account: { points: 5, duration: 15 * 60 },
  mfa_user: { points: 5, duration: 5 * 60 },
  invitation_workspace: { points: 50, duration: 24 * 60 * 60 },
  company_create_user: { points: 5, duration: 24 * 60 * 60 },
  upload_user: { points: 60, duration: 60 * 60 },
} as const;
export type RateLimitPolicy = keyof typeof POLICIES;

@Injectable()
export class RateLimitService {
  private readonly limiters = new Map<RateLimitPolicy, RateLimiterRedis>();

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  private limiter(policy: RateLimitPolicy): RateLimiterRedis {
    let l = this.limiters.get(policy);
    if (!l) {
      const p = POLICIES[policy];
      const scale = this.env.isProduction ? 1 : this.env.RATE_LIMIT_SCALE;
      l = new RateLimiterRedis({
        storeClient: this.redis,
        keyPrefix: `rl:${policy}`,
        points: Math.max(1, Math.round(p.points * scale)),
        duration: p.duration,
        useRedisPackage: false,
      });
      this.limiters.set(policy, l);
    }
    return l;
  }

  /** Consume one point; throws 429 RATE_LIMITED with retry_after when exhausted. */
  async consume(policy: RateLimitPolicy, key: string): Promise<void> {
    try {
      await this.limiter(policy).consume(key.toLowerCase());
    } catch (err) {
      if (err instanceof RateLimiterRes) {
        throw new ApiError('RATE_LIMITED', 'common.rate_limited', {
          retry_after: String(Math.ceil(err.msBeforeNext / 1000)),
        });
      }
      throw err; // Redis failure: fail closed via the error filter (500)
    }
  }

  async reset(policy: RateLimitPolicy, key: string): Promise<void> {
    await this.limiter(policy).delete(key.toLowerCase());
  }
}
