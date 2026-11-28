import { publicConfigResponse, successSchema } from '@app/contracts';

export type ServerConfig = {
  appName: string;
  sandbox: boolean;
  uploadMaxBytes: number;
  reachable: boolean;
  /** Protected staging profile (C-20): fictional data only. */
  staging: boolean;
  stagingEmailDomains: string[];
};

const FALLBACK_NAME = 'B2B Marketplace (working name)';

/**
 * Product name and sandbox flag come from the API's public config (APP_NAME, decision A06), so
 * there is one source of truth. If the API is unreachable, the local APP_NAME is used and pages
 * show their own error states for data they cannot load.
 */
export async function loadServerConfig(): Promise<ServerConfig> {
  const base = process.env.API_INTERNAL_ORIGIN ?? process.env.API_ORIGIN ?? 'http://localhost:4000';
  try {
    const res = await fetch(`${base}/api/v1/public/config`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(2_000),
    });
    const parsed = successSchema(publicConfigResponse).safeParse(await res.json());
    if (parsed.success) {
      return {
        appName: parsed.data.data.app_name,
        sandbox: parsed.data.data.sandbox,
        uploadMaxBytes: parsed.data.data.upload_max_bytes,
        reachable: true,
        staging: parsed.data.data.staging,
        stagingEmailDomains: parsed.data.data.staging_email_domains,
      };
    }
  } catch {
    // fall through
  }
  return {
    appName: process.env.APP_NAME ?? FALLBACK_NAME,
    sandbox: false,
    uploadMaxBytes: 10 * 1024 * 1024,
    reachable: false,
    staging: process.env.APP_ENV === 'staging',
    stagingEmailDomains: [],
  };
}
