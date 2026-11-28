# Protected staging profile (C-20)

Code only. Nothing is deployed: staging needs the founder to confirm the Vercel plan and spending controls and to authorise the deployment (founder decisions, 28 November 2026, 16:33 UTC).

## What `APP_ENV=staging` does

Staging is a production build (`NODE_ENV=production`) that runs on free services with fictional data only. At startup the API, worker and cron entry refuse to run unless all of these hold:

| Rule | Why |
|---|---|
| `PAYMENT_MODE` is `mock` or `disabled`, and `FEATURE_REAL_PAYMENTS` is off. The labelled sandbox provider is allowed; production still refuses it. | No real money (Q6) |
| `EMAIL_PROVIDER` is `catcher` or `disabled`. `catcher` stores each rendered email for 7 days and shows it in the admin **Staging mailbox** (support staff). Nothing is sent. | No email sending in staging (Q5) |
| `STAGING_ACCESS_PASSWORD` is set (at least 16 characters). Every web and admin page asks for it with HTTP Basic authentication. `/api/…` routes are exempt because they have their own sessions, CSRF and permission checks, and webhooks and the scheduler must reach them. | Protected staging (C-20) |
| `STAGING_ALLOWED_EMAIL_DOMAINS` is set. Only addresses on these fictional domains can register (for example `example.test`); the register page says so. | No public registration without approval (section 9); fictional recipients only (Q5) |
| Strong `SESSION_SECRET`, `MFA_ENCRYPTION_KEY` and `CRON_SECRET`, https origins and a separate admin host. | Same hardening as production |
| Object storage is configured (`STORAGE_DRIVER=vercel-blob` with a private store, or S3). | Uploads |

Every page shows a staging banner: fictional companies and documents only, never real or confidential documents, simulated payments, no email. The malware scanner in staging is the labelled sandbox scanner, so real confidential documents must not be uploaded (Q7). Production still refuses to start without a real scanner.

The development seed refuses to run against staging because it creates accounts with published passwords. Create the first admin with `pnpm --filter @app/api admin:create`, then register fictional companies through the app.

## Serverless pieces

- **API on Vercel:** `apps/api/api/index.js` loads the compiled `dist/vercel.js`, which builds the Nest application once per function instance (`apps/api/vercel.json` sets the build and rewrites all paths to the function). A failed cold start answers 503 and is retried on the next request.
- **Rate limits without Redis:** when `REDIS_URL` is unset, rate limits and TOTP replay markers use the PostgreSQL table `rate_limit_buckets` (fixed windows, shared by all instances). With `REDIS_URL` (for example Upstash Free) they use Redis.
- **Vercel Blob:** `STORAGE_DRIVER=vercel-blob` stores files in a **private** store under `private/` and `media/`. Reads need the store token (`BLOB_READ_WRITE_TOKEN`, or the project OIDC token with `BLOB_STORE_ID`), so files are only reachable through API routes that check permissions first.
- **Prisma engines:** the client is generated for the local platform and for Vercel Functions (`rhel-openssl-3.0.x`).
