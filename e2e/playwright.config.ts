import { defineConfig, devices } from '@playwright/test';

/**
 * Browser smoke tests for Phase 0. Requires built apps (`pnpm build`), running
 * Postgres + Redis (`docker compose up -d`) and applied migrations (`pnpm db:migrate`).
 * Playwright starts the built API and web servers itself.
 */
const WEB = process.env.WEB_ORIGIN ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL: WEB, trace: 'off' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'mobile-360',
      use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 740 } },
    },
  ],
  webServer: [
    {
      command: 'pnpm --filter @app/api start',
      url: 'http://localhost:4000/api/v1/health',
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
