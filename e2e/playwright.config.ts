import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';

/**
 * Browser tests against the real stack. Requires built apps (`pnpm build`), docker compose
 * services (Postgres, Redis, SeaweedFS, Mailpit), applied migrations and the dev seed.
 * Playwright starts the built API, worker and web servers itself (or reuses running ones locally).
 *
 * WebKit (Safari engine) projects run when PW_WEBKIT=1 or in CI, where `playwright install
 * webkit` is available. The admin portal is served on admin.localhost (separate origin, A03).
 */
const WEB = process.env.WEB_ORIGIN ?? 'http://localhost:3000';
const withWebkit = !!process.env.CI || process.env.PW_WEBKIT === '1';
const serverEnv = { RATE_LIMIT_SCALE: process.env.RATE_LIMIT_SCALE ?? '50' };

const projects: PlaywrightTestConfig['projects'] = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: /screenshots/ },
  {
    name: 'mobile-360',
    use: {
      ...devices['Desktop Chrome'],
      viewport: { width: 360, height: 740 },
      isMobile: false,
      hasTouch: true,
    },
    testIgnore: /screenshots/,
  },
];
if (withWebkit) {
  projects.push(
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: /screenshots/ },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] }, testIgnore: /screenshots/ },
  );
}
// Screenshot capture for review packs: `pnpm test:e2e --project=screenshots`.
projects.push({
  name: 'screenshots',
  testMatch: /screenshots\.spec\.ts/,
  use: { ...devices['Desktop Chrome'], deviceScaleFactor: 2 },
});

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: WEB, trace: 'off' },
  projects,
  webServer: [
    {
      command: 'pnpm --filter @app/api start',
      url: 'http://localhost:4000/api/v1/health',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      cwd: '..',
      env: serverEnv,
    },
    {
      command: 'pnpm --filter @app/worker start',
      url: 'http://localhost:4100/health',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      cwd: '..',
    },
    {
      command: 'pnpm --filter @app/web start',
      url: `${WEB}/healthz`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      cwd: '..',
    },
  ],
});
