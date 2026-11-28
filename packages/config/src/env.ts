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
export const FILE_SCANNERS = ['disabled', 'sandbox-eicar', 'live'] as const;

/** Values that appear in .env.example; they must never be accepted in production. */
const PLACEHOLDER_PATTERN = /(change[-_ ]?me|placeholder|example|dev[-_]only|not[-_]a[-_]secret)/i;

/** The key shipped in .env.example. Accepted only outside production. */
export const DEV_EXAMPLE_MFA_KEY = 'ZGV2LW9ubHktbWZhLWtleS0zMi1ieXRlcy1sb25nISE=';

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

  /** Configurable working name until branding is approved (A06). */
  APP_NAME: z.string().trim().min(1).max(80).default('B2B Marketplace (working name)'),

  SESSION_SECRET: z.string().min(1),
  /** 32-byte key, base64, used to encrypt admin TOTP secrets at rest (AES-256-GCM). */
  MFA_ENCRYPTION_KEY: z.string().refine((v) => Buffer.from(v, 'base64').length === 32, {
    message: 'must be 32 bytes, base64 encoded',
  }),
  WEB_ORIGIN: z.string().url(),
  /** Admin portal origin; separate host in production (A03). */
  ADMIN_ORIGIN: z.string().url(),
  API_ORIGIN: z.string().url(),
  /** Express "trust proxy" setting: number of hops, or 'loopback'. */
  TRUST_PROXY: z.string().default('loopback'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  WORKER_HEALTH_PORT: z.coerce.number().int().min(1).max(65535).default(4100),

  STORAGE_ENDPOINT: optionalString,
  STORAGE_REGION: z.string().default('me-central-1'),
  STORAGE_BUCKET: optionalString,
  /** Separate bucket for marketplace media (product/storefront/category images), kept apart from
   * private verification documents. Defaults to "<STORAGE_BUCKET>-media". Never public-read:
   * the API serves an image only while it is attached to approved, visible content. */
  STORAGE_MEDIA_BUCKET: optionalString,
  STORAGE_ACCESS_KEY: optionalString,
  STORAGE_SECRET_KEY: optionalString,

  EMAIL_PROVIDER: z.enum(EMAIL_PROVIDERS).default('disabled'),
  EMAIL_API_KEY: optionalString,
  EMAIL_FROM: optionalString,
  SMTP_URL: optionalString,

  FILE_SCANNER: z.enum(FILE_SCANNERS).default('disabled'),
  UPLOAD_MAX_BYTES: z.coerce
    .number()
    .int()
    .min(1024)
    .max(25 * 1024 * 1024)
    .default(10 * 1024 * 1024),

  /** Hours a buyer has to pay after quote acceptance (A05); separate from stock reservation. */
  QUOTE_PAYMENT_WINDOW_HOURS: z.coerce
    .number()
    .int()
    .min(1)
    .max(24 * 30)
    .default(72),

  /**
   * Rate for the STANDARD quote tax code, in basis points (D06 open: no assumed VAT treatment).
   * Unset outside production uses the 500 bps sandbox fixture; production requires a value.
   */
  TAX_STANDARD_BPS: z.coerce.number().int().min(0).max(10000).optional(),

  /**
   * Platform commission on merchandise, in basis points (D05 open). Unset outside production uses
   * the 1000 bps fixture from docs/08-finance.md; production requires an explicit value.
   */
  COMMISSION_BPS: z.coerce.number().int().min(0).max(5000).optional(),
  /** Minutes a checkout holds stock while payment is pending (D11: 15). */
  RESERVATION_MINUTES: z.coerce.number().int().min(5).max(120).default(15),

  PAYMENT_MODE: z.enum(PAYMENT_MODES).default('disabled'),
  PSP_API_KEY: optionalString,
  PSP_WEBHOOK_SECRET: optionalString,

  /** Provisional retention defaults (A13). Report-only until the policy is legally approved. */
  RETENTION_REJECTED_DOCS_DAYS: z.coerce.number().int().min(1).max(3650).default(90),
  RETENTION_ABANDONED_APPLICATION_DAYS: z.coerce.number().int().min(1).max(3650).default(90),
  RETENTION_CLOSED_COMPANY_DAYS: z.coerce.number().int().min(1).max(3650).default(180),
  /** Irreversible deletion of retained documents. Refused until legal approval (A13). */
  RETENTION_DELETION_ENABLED: booleanFlag,

  /** Multiplies rate-limit allowances in development/test only (ignored in production). */
  RATE_LIMIT_SCALE: z.coerce.number().min(1).max(1000).default(1),

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
  if (env.EMAIL_PROVIDER !== 'live') {
    issues.push(
      'EMAIL_PROVIDER=live is required in production (email verification is mandatory, A07)',
    );
  }
  if (env.TAX_STANDARD_BPS === undefined) {
    issues.push('TAX_STANDARD_BPS must be set explicitly in production (tax rules, D06)');
  }
  if (env.COMMISSION_BPS === undefined) {
    issues.push('COMMISSION_BPS must be set explicitly in production (commission policy, D05)');
  }
  if (env.FILE_SCANNER !== 'live') {
    issues.push('FILE_SCANNER=live is required in production (uploads must be malware scanned)');
  }
  if (
    env.MFA_ENCRYPTION_KEY === DEV_EXAMPLE_MFA_KEY ||
    PLACEHOLDER_PATTERN.test(Buffer.from(env.MFA_ENCRYPTION_KEY, 'base64').toString('latin1'))
  ) {
    issues.push('MFA_ENCRYPTION_KEY must be a real random key in production');
  }
  try {
    if (new URL(env.ADMIN_ORIGIN).host === new URL(env.WEB_ORIGIN).host) {
      issues.push('ADMIN_ORIGIN must be a different host from WEB_ORIGIN in production (A03)');
    }
  } catch {
    /* URL validity already checked by the schema */
  }
  for (const key of ['WEB_ORIGIN', 'ADMIN_ORIGIN', 'API_ORIGIN'] as const) {
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
  if (env.RETENTION_DELETION_ENABLED) {
    issues.push(
      'RETENTION_DELETION_ENABLED is refused: the retention schedule is provisional until legally approved (A13)',
    );
  }
  if (env.FEATURE_REAL_PAYMENTS && env.NODE_ENV !== 'production') {
    issues.push('FEATURE_REAL_PAYMENTS may not be enabled outside production');
  }
  if (env.EMAIL_PROVIDER === 'smtp-dev' && !env.SMTP_URL) {
    issues.push('SMTP_URL is required for EMAIL_PROVIDER=smtp-dev');
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
    sandbox:
      env.PAYMENT_MODE === 'mock' ||
      env.EMAIL_PROVIDER === 'smtp-dev' ||
      env.FILE_SCANNER === 'sandbox-eicar',
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
    RESERVATION_MINUTES: env.RESERVATION_MINUTES,
    EMAIL_PROVIDER: env.EMAIL_PROVIDER,
    FILE_SCANNER: env.FILE_SCANNER,
    APP_NAME: env.APP_NAME,
    TRADING_ENABLED: env.TRADING_ENABLED,
    FEATURE_REAL_PAYMENTS: env.FEATURE_REAL_PAYMENTS,
    FEATURE_SUBSCRIPTIONS: env.FEATURE_SUBSCRIPTIONS,
    FEATURE_MILESTONE_PAYMENTS: env.FEATURE_MILESTONE_PAYMENTS,
    sandbox: env.sandbox,
  };
}
