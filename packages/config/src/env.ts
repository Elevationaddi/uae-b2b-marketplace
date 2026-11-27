import { z } from 'zod';

/**
 * Runtime environment contract shared by api, worker and web server code.
 *
 * Development and test may use explicitly labelled sandbox/mock adapters.
 * Production fails closed: mock modes, placeholder or weak secrets and missing
 * provider keys stop the process at startup (docs/13-roadmap.md, docs/11-integrations.md).
 */

export const NODE_ENVS = ['development', 'test', 'production'] as const;
export type NodeEnv = (typeof NODE_ENVS)[number];

export const PAYMENT_MODES = ['disabled', 'mock', 'live'] as const;
export const EMAIL_PROVIDERS = ['disabled', 'smtp-dev', 'live'] as const;
export const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const;
export const LOCALES = ['en', 'ar'] as const;

/** Values that appear in .env.example; they must never be accepted in production. */
const PLACEHOLDER_PATTERN = /(change[-_ ]?me|placeholder|example|dev[-_]only|not[-_]a[-_]secret)/i;

const booleanFlag = z
  .enum(['true', 'false', '1', '0'])
  .default('false')
  .transform((v) => v === 'true' || v === '1');

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === undefined || v === '' ? undefined : v));

export const rawEnvSchema = z.object({
  NODE_ENV: z.enum(NODE_ENVS).default('development'),
  LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),
  APP_LOCALE: z.enum(LOCALES).default('en'),

  DATABASE_URL: z
    .string()
    .url()
    .refine((v) => /^postgres(ql)?:\/\//.test(v), {
      message: 'must be a postgres:// or postgresql:// URL',
    }),
  REDIS_URL: z
    .string()
    .url()
    .refine((v) => /^rediss?:\/\//.test(v), {
      message: 'must be a redis:// or rediss:// URL',
    }),

  SESSION_SECRET: z.string().min(1),
  WEB_ORIGIN: z.string().url(),
  API_ORIGIN: z.string().url(),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  WORKER_HEALTH_PORT: z.coerce.number().int().min(1).max(65535).default(4100),

  STORAGE_ENDPOINT: optionalString,
  STORAGE_REGION: z.string().default('me-central-1'),
  STORAGE_BUCKET: optionalString,
  STORAGE_ACCESS_KEY: optionalString,
  STORAGE_SECRET_KEY: optionalString,

  EMAIL_PROVIDER: z.enum(EMAIL_PROVIDERS).default('disabled'),
  EMAIL_API_KEY: optionalString,
  EMAIL_FROM: optionalString,
  SMTP_URL: optionalString,

  PAYMENT_MODE: z.enum(PAYMENT_MODES).default('disabled'),
  PSP_API_KEY: optionalString,
  PSP_WEBHOOK_SECRET: optionalString,

  TRADING_ENABLED: booleanFlag,
  FEATURE_REAL_PAYMENTS: booleanFlag,
  FEATURE_SUBSCRIPTIONS: booleanFlag,
  FEATURE_MILESTONE_PAYMENTS: booleanFlag,
});

export type RawEnv = z.infer<typeof rawEnvSchema>;

export interface AppEnv extends RawEnv {
  isProduction: boolean;
  /** True when any explicitly labelled sandbox adapter is active. Shown in UI and logs. */
  sandbox: boolean;
}

export class EnvValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid environment configuration:\n - ${issues.join('\n - ')}`);
    this.name = 'EnvValidationError';
  }
}

function isWeakSecret(value: string | undefined, minLength: number): boolean {
  return value === undefined || value.length < minLength || PLACEHOLDER_PATTERN.test(value);
}

/** Production-only rules. Each returns an issue string; empty array means compliant. */
export function productionIssues(env: RawEnv): string[] {
  const issues: string[] = [];
  if (isWeakSecret(env.SESSION_SECRET, 32)) {
    issues.push(
      'SESSION_SECRET must be at least 32 characters and not a placeholder in production',
    );
  }
  if (env.PAYMENT_MODE === 'mock') {
    issues.push('PAYMENT_MODE=mock is not allowed in production');
  }
  if (env.PAYMENT_MODE === 'live') {
    if (isWeakSecret(env.PSP_API_KEY, 16))
      issues.push('PSP_API_KEY is required for PAYMENT_MODE=live');
    if (isWeakSecret(env.PSP_WEBHOOK_SECRET, 16))
      issues.push('PSP_WEBHOOK_SECRET is required for PAYMENT_MODE=live');
    if (!env.FEATURE_REAL_PAYMENTS)
      issues.push('PAYMENT_MODE=live requires FEATURE_REAL_PAYMENTS=true (explicit approval flag)');
  }
  if (env.FEATURE_REAL_PAYMENTS && env.PAYMENT_MODE !== 'live') {
    issues.push('FEATURE_REAL_PAYMENTS=true requires PAYMENT_MODE=live');
  }
  if (env.TRADING_ENABLED && env.PAYMENT_MODE !== 'live') {
    issues.push('TRADING_ENABLED=true in production requires a live payment provider');
  }
  if (env.EMAIL_PROVIDER === 'smtp-dev') {
    issues.push('EMAIL_PROVIDER=smtp-dev (local mail catcher) is not allowed in production');
  }
  if (env.EMAIL_PROVIDER === 'live') {
    if (isWeakSecret(env.EMAIL_API_KEY, 8))
      issues.push('EMAIL_API_KEY is required for EMAIL_PROVIDER=live');
    if (!env.EMAIL_FROM) issues.push('EMAIL_FROM is required for EMAIL_PROVIDER=live');
  }
  for (const key of ['STORAGE_ENDPOINT', 'STORAGE_BUCKET'] as const) {
    if (!env[key]) issues.push(`${key} is required in production`);
  }
  for (const key of ['STORAGE_ACCESS_KEY', 'STORAGE_SECRET_KEY'] as const) {
    if (isWeakSecret(env[key], 8))
      issues.push(`${key} is required and must not be a placeholder in production`);
  }
  for (const key of ['WEB_ORIGIN', 'API_ORIGIN'] as const) {
    if (!env[key].startsWith('https://')) issues.push(`${key} must use https in production`);
  }
  return issues;
}

/** Rules for every environment. */
function commonIssues(env: RawEnv): string[] {
  const issues: string[] = [];
  if (env.PAYMENT_MODE === 'live' && env.NODE_ENV !== 'production') {
    issues.push(
      'PAYMENT_MODE=live is only permitted with NODE_ENV=production and approved launch gates',
    );
  }
  if (env.FEATURE_REAL_PAYMENTS && env.NODE_ENV !== 'production') {
    issues.push('FEATURE_REAL_PAYMENTS may not be enabled outside production');
  }
  if (env.SESSION_SECRET.length < 16) {
    issues.push('SESSION_SECRET must be at least 16 characters');
  }
  return issues;
}

/** Parse and validate an environment record. Throws EnvValidationError listing every problem. */
export function parseEnv(source: Record<string, string | undefined>): AppEnv {
  const parsed = rawEnvSchema.safeParse(source);
  if (!parsed.success) {
    throw new EnvValidationError(
      parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`),
    );
  }
  const env = parsed.data;
  const issues = [
    ...commonIssues(env),
    ...(env.NODE_ENV === 'production' ? productionIssues(env) : []),
  ];
  if (issues.length > 0) throw new EnvValidationError(issues);
  return {
    ...env,
    isProduction: env.NODE_ENV === 'production',
    sandbox: env.PAYMENT_MODE === 'mock' || env.EMAIL_PROVIDER === 'smtp-dev',
  };
}

/** Returns a redacted view safe for logs (never prints secrets or credentials in URLs). */
export function describeEnv(env: AppEnv): Record<string, string | number | boolean> {
  const stripCredentials = (url: string) => {
    try {
      const u = new URL(url);
      if (u.password) u.password = '***';
      if (u.username) u.username = '***';
      return u.toString();
    } catch {
      return '[invalid url]';
    }
  };
  return {
    NODE_ENV: env.NODE_ENV,
    DATABASE_URL: stripCredentials(env.DATABASE_URL),
    REDIS_URL: stripCredentials(env.REDIS_URL),
    PAYMENT_MODE: env.PAYMENT_MODE,
    EMAIL_PROVIDER: env.EMAIL_PROVIDER,
    TRADING_ENABLED: env.TRADING_ENABLED,
    FEATURE_REAL_PAYMENTS: env.FEATURE_REAL_PAYMENTS,
    FEATURE_SUBSCRIPTIONS: env.FEATURE_SUBSCRIPTIONS,
    FEATURE_MILESTONE_PAYMENTS: env.FEATURE_MILESTONE_PAYMENTS,
    sandbox: env.sandbox,
  };
}
