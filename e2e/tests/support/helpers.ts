import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { expect, type Browser, type BrowserContext, type Page } from '@playwright/test';
import { authenticator } from 'otplib';

/** Fictional dev-only credentials from the seed (docs/TEST_ACCOUNTS.md). */
export const PASSWORD = 'DevOnly-Passw0rd!';
export const WEB = process.env.WEB_ORIGIN ?? 'http://localhost:3000';
export const ADMIN = process.env.ADMIN_ORIGIN ?? 'http://admin.localhost:3000';
const MAILPIT = process.env.MAILPIT_URL ?? 'http://localhost:8025';
const ROOT = resolve(__dirname, '../../..');

authenticator.options = { window: 1 };

export function unique(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

export function uniqueEmail(prefix: string): string {
  return `${unique(prefix)}@e2e.test`;
}

/** Minimal valid PDF (magic bytes are checked server-side). */
export function samplePdf(name: string) {
  const body = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n% ${name}`;
  return { name, mimeType: 'application/pdf', buffer: Buffer.from(body) };
}

/** Polls the local mail catcher (Mailpit) for the newest message to `to` and returns the link it carries. */
export async function emailedLink(to: string, path: string, timeoutMs = 30_000): Promise<string> {
  const deadline = Date.now() + timeoutMs;
  const re = new RegExp(`https?://[^\\s"<>]+/${path}#token=[A-Za-z0-9_%-]+`);
  while (Date.now() < deadline) {
    const res = await fetch(
      `${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}&limit=5`,
    );
    if (res.ok) {
      const list = (await res.json()) as { messages: { ID: string }[] };
      for (const m of list.messages) {
        const msg = (await (await fetch(`${MAILPIT}/api/v1/message/${m.ID}`)).json()) as {
          Text: string;
        };
        const match = re.exec(msg.Text);
        if (match) return match[0];
      }
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`no ${path} email for ${to}`);
}

export async function signIn(page: Page, email: string, password = PASSWORD) {
  await page.goto('/en/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/en\/app/);
}

/** Creates a platform admin through the operator CLI (the only way to provision admins, A03). */
export function createAdmin(
  role: 'COMPLIANCE' | 'SUPPORT' | 'SUPER_ADMIN' | 'FINANCE' | 'FINANCE_APPROVER' = 'COMPLIANCE',
): string {
  const email = uniqueEmail(`admin-${role.toLowerCase()}`);
  execFileSync(
    'pnpm',
    ['--silent', '--filter', '@app/api', 'run', 'admin:create', email, role, 'E2E Admin'],
    {
      cwd: ROOT,
      env: { ...process.env, ADMIN_INITIAL_PASSWORD: PASSWORD },
      stdio: 'pipe',
    },
  );
  return email;
}

/**
 * SANDBOX test clock: treat an order's 14-day dispute window as ended and run the settlement
 * sweep for it (the CLI refuses outside PAYMENT_MODE=mock and in production).
 */
export function endDisputeWindow(orderId: string): void {
  execFileSync(
    'pnpm',
    ['--silent', '--filter', '@app/api', 'run', 'sandbox:end-dispute-window', orderId],
    { cwd: ROOT, env: process.env, stdio: 'pipe' },
  );
}

export async function adminContext(
  browser: Browser,
  opts: Parameters<Browser['newContext']>[0] = {},
): Promise<BrowserContext> {
  return browser.newContext({ ...opts, baseURL: ADMIN });
}

/** Signs a new admin in and completes mandatory TOTP enrolment. Returns the TOTP secret. */
export async function enrolAdmin(
  page: Page,
  email: string,
): Promise<{ secret: string; recovery: string[] }> {
  await page.goto('/en/admin/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/en\/admin\/mfa\?step=enroll/);
  const secret = (await page.getByTestId('mfa-secret').textContent())!.trim();
  await page.getByLabel('6-digit code').fill(authenticator.generate(secret));
  await page.getByRole('button', { name: 'Confirm and continue' }).click();
  const codes = page.getByTestId('recovery-codes');
  await expect(codes.locator('li')).toHaveCount(10);
  const recovery = (await codes.locator('code').allTextContents()).map((s) => s.trim());
  await page.getByRole('button', { name: /saved/i }).click();
  await expect(page).toHaveURL(/\/en\/admin$/);
  return { secret, recovery };
}

export function totp(secret: string): string {
  return authenticator.generate(secret);
}

/** Registers through the UI and verifies via the emailed link. Leaves the page signed out. */
export async function registerVerified(page: Page, email: string, name = 'E2E User') {
  await page.goto('/en/register');
  await page.getByLabel('Full name').fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  const link = await emailedLink(email, 'en/verify-email');
  await page.goto(link.replace(/^https?:\/\/[^/]+/, ''));
  await expect(page.getByText('Your email is verified')).toBeVisible();
}

export function relative(link: string): string {
  return link.replace(/^https?:\/\/[^/]+/, '');
}

/**
 * Click after centring the element. On phone layouts the fixed bottom navigation (docs/05-ui.md)
 * can cover a control that Playwright scrolls only to the viewport edge.
 */
export async function press(locator: import('@playwright/test').Locator) {
  await locator.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await locator.click();
}
