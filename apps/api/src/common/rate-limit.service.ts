import { Inject, Injectable } from '@nestjs/common';
import type { AppEnv } from '@app/config';
import { APP_ENV } from '../infra/tokens';
import { ApiError } from './api-error';
import { KvStore } from './kv-store';

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
  search_ip: { points: 600, duration: 60 },
  lists_user: { points: 300, duration: 60 },
  message_user: { points: 60, duration: 60 },
  checkout_user: { points: 30, duration: 60 },
  payment_webhook_ip: { points: 600, duration: 60 },
  support_create_user: { points: 10, duration: 60 * 60 },
  export_user: { points: 10, duration: 60 * 60 },
} as const;
export type RateLimitPolicy = keyof typeof POLICIES;

/**
 * Fixed-window rate limits on the shared store (Redis, or PostgreSQL when no Redis is configured).
 * Every API instance sees the same counters, so limits hold across serverless functions.
 */
@Injectable()
export class RateLimitService {
  constructor(
    private readonly kv: KvStore,
    @Inject(APP_ENV) private readonly env: AppEnv,
  ) {}

  private points(policy: RateLimitPolicy): number {
    const scale = this.env.isProduction ? 1 : this.env.RATE_LIMIT_SCALE;
    return Math.max(1, Math.round(POLICIES[policy].points * scale));
  }

  private key(policy: RateLimitPolicy, key: string) {
    return `rl:${policy}:${key.toLowerCase()}`;
  }

  /** Consume one point; throws 429 RATE_LIMITED with retry_after when exhausted. */
  async consume(policy: RateLimitPolicy, key: string): Promise<void> {
    // A store failure propagates and fails closed via the error filter (500).
    const c = await this.kv.increment(this.key(policy, key), POLICIES[policy].duration);
    if (c.points > this.points(policy))
      throw new ApiError('RATE_LIMITED', 'common.rate_limited', {
        retry_after: String(Math.max(1, Math.ceil(c.msBeforeNext / 1000))),
      });
  }

  async reset(policy: RateLimitPolicy, key: string): Promise<void> {
    await this.kv.delete(this.key(policy, key));
  }
}
