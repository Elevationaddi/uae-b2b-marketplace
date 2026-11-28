import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { authenticator } from 'otplib';
import { adminContext, createAdmin, enrolAdmin, press, signIn, unique } from './support/helpers';

/**
 * Phase 6 review pack: customer support (buyer and seller), the admin support queue and ticket,
 * the operations overview (finance and support views), report exports and the marketing opt-in,
 * in EN and AR, desktop and phone. Run:
 * pnpm test:e2e --project=screenshots tests/operations.screenshots.spec.ts
 * Uses the dev seed (fictional companies); nothing is mocked. The ticket is closed at the end.
 */
const OUT = resolve(
  process.env.SCREENSHOT_DIR ?? resolve(__dirname, '../screenshots-out'),
  'phase6',
);
mkdirSync(OUT, { recursive: true });
test.describe.configure({ mode: 'serial' });

const BUYER = 'buyer.procurement@falcon-trading.test';
const SELLER = 'seller.owner@desert-pack.test';

async function snap(page: Page, name: string, fullPage = true) {
  await page.waitForTimeout(400);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('main h1, main [role="alert"]').first()).toBeVisible();
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
}

async function both(page: Page, path: string, name: string) {
  for (const locale of ['en', 'ar']) {
    await page.goto(`/${locale}${path}`);
    await snap(page, `${name}-${locale}`);
  }
  const size = page.viewportSize()!;
  await page.setViewportSize({ width: 390, height: 844 });
  for (const locale of ['en', 'ar']) {
    await page.goto(`/${locale}${path}`);
    await snap(page, `${name}-${locale}-phone`, false);
  }
  await page.setViewportSize(size);
}

const rel = (url: string) => new URL(url).pathname.replace(/^\/(en|ar)/, '');
const view = { deviceScaleFactor: 2, viewport: { width: 1280, height: 900 } };

async function signedIn(browser: Browser, email: string) {
  const ctx = await browser.newContext(view);
  const page = await ctx.newPage();
  await signIn(page, email);
  return { ctx, page };
}

async function admin(browser: Browser, role: Parameters<typeof createAdmin>[0]) {
  const ctx = await adminContext(browser, view);
  const page = await ctx.newPage();
  const { secret } = await enrolAdmin(page, createAdmin(role));
  return { ctx, page, secret };
}

async function workspace(page: Page, kind: 'BUYER' | 'SELLER') {
  const me = await (await page.request.get('/api/v1/me')).json();
  return me.data.workspaces.find((w: { kind: string }) => w.kind === kind).id as string;
}

test('support tickets, operations overview, exports and marketing opt-in', async ({ browser }) => {
  test.setTimeout(300_000);
  const b = await signedIn(browser, BUYER);
  const bws = await workspace(b.page, 'BUYER');
  const base = `/app/buyer/${bws}`;
  await both(b.page, `${base}/support/new`, 'buyer-support-new');

  await b.page.goto(`/en${base}/support/new`);
  const form = b.page.getByTestId('support-new-form');
  await form.getByLabel('Topic').selectOption('ORDER');
  await form.getByLabel('Subject').fill(unique('Delivery window for next order'));
  await form
    .getByLabel('How can we help?')
    .fill('Can the supplier deliver before 10:00 to our Al Quoz warehouse?');
  await press(form.getByRole('button', { name: 'Open ticket' }));
  await b.page.waitForURL(/\/support\/[0-9a-f-]{36}$/);
  const ticketPath = rel(b.page.url());
  const number = (await b.page.getByRole('heading', { level: 1 }).textContent())!
    .replace('Ticket ', '')
    .trim();

  const sup = await admin(browser, 'SUPPORT');
  await sup.page.goto('/en/admin/support');
  await press(sup.page.getByRole('link', { name: number, exact: true }));
  await sup.page.waitForURL(/\/admin\/support\/[0-9a-f-]{36}$/);
  const adminTicket = rel(sup.page.url());
  await press(sup.page.getByRole('button', { name: 'Take ticket' }));
  await sup.page
    .getByTestId('support-reply-form')
    .getByLabel('Reply')
    .fill('The supplier confirmed delivery between 08:00 and 10:00.');
  await press(sup.page.getByRole('button', { name: 'Send reply' }));
  await expect(sup.page.getByText('Reply sent.')).toBeVisible();

  await both(b.page, `${base}/support`, 'buyer-support-list');
  await both(b.page, ticketPath, 'buyer-support-ticket');
  await both(sup.page, '/admin/support', 'admin-support-queue');
  await both(sup.page, adminTicket, 'admin-support-ticket');
  await both(sup.page, '/admin', 'admin-overview-support');
  await both(sup.page, '/admin/reports', 'admin-reports-support');

  const fin = await admin(browser, 'FINANCE');
  await both(fin.page, '/admin', 'admin-overview-finance');
  await fin.page.goto('/en/admin/reports');
  const ef = fin.page.getByTestId('export-form');
  await ef.getByLabel('Reason').fill('Month-end reconciliation');
  await ef
    .getByLabel('Authenticator code')
    .fill(authenticator.clone({ epoch: Date.now() + 30_000 }).generate(fin.secret));
  await press(ef.getByRole('button', { name: 'Create export' }));
  await expect(fin.page.getByText('Export ready. Download it below.')).toBeVisible();
  await both(fin.page, '/admin/reports', 'admin-reports-finance');

  const s = await signedIn(browser, SELLER);
  const sws = await workspace(s.page, 'SELLER');
  await both(s.page, `/app/seller/${sws}/support`, 'seller-support-list');
  await both(b.page, '/app/settings', 'settings-marketing');

  // Leave nothing open: resolve as support, then the buyer closes the ticket.
  await sup.page.goto(`/en${adminTicket}`);
  await press(sup.page.getByRole('button', { name: 'Mark resolved' }));
  await expect(sup.page.getByText('Resolved').first()).toBeVisible();
  await b.page.goto(`/en${ticketPath}`);
  await press(b.page.getByRole('button', { name: 'Close ticket' }));
  await press(b.page.getByRole('dialog').getByRole('button', { name: 'Close ticket' }));
  await expect(b.page.getByText('This ticket is closed.')).toBeVisible();
  for (const c of [b, sup, fin, s]) await c.ctx.close();
});
