import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { adminContext, createAdmin, enrolAdmin, press, signIn } from './support/helpers';

/**
 * Phase 4 review pack: cart, addresses, checkout, SANDBOX payment, buyer/seller/admin orders and
 * admin finance screens in EN and AR, desktop and phone.
 * Run: pnpm test:e2e --project=screenshots tests/checkout.screenshots.spec.ts
 * Uses the dev seed (fictional companies) and the sandbox payment adapter; nothing is mocked.
 */
const OUT = resolve(
  process.env.SCREENSHOT_DIR ?? resolve(__dirname, '../screenshots-out'),
  'phase4',
);
mkdirSync(OUT, { recursive: true });
test.describe.configure({ mode: 'serial' });

let base = '';
let checkoutPath = '';
let orderPath = '';
let orderNumber = '';

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

async function signedIn(browser: Browser, email: string) {
  const ctx = await browser.newContext({
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await signIn(page, email);
  return { ctx, page };
}

test('buyer cart, checkout and sandbox payment', async ({ browser }) => {
  test.setTimeout(240_000);
  const { ctx, page } = await signedIn(browser, 'buyer.procurement@falcon-trading.test');
  const me = await (await page.request.get('/api/v1/me')).json();
  base = `/app/buyer/${me.data.workspaces.find((w: { kind: string }) => w.kind === 'BUYER').id}`;

  await both(page, `${base}/addresses`, 'p4-01-addresses');

  await page.goto(`/en/search?q=${encodeURIComponent('double-wall carton')}`);
  await press(page.getByTestId('product-card').first().getByRole('link').first());
  await expect(page.getByTestId('add-to-cart')).toBeVisible();
  await snap(page, 'p4-02-product-add-to-cart-en');
  await press(page.getByTestId('add-to-cart').getByRole('button', { name: 'Add to cart' }));
  await expect(page.getByTestId('add-to-cart').getByRole('status')).toBeVisible();

  await both(page, `${base}/cart`, 'p4-03-cart');
  await both(page, `${base}/checkout`, 'p4-04-checkout');

  await page.goto(`/en${base}/checkout`);
  const summary = page.getByTestId('checkout-summary');
  await summary.getByRole('checkbox').check();
  await summary.getByLabel(/Your PO reference/).fill('PO-2026-0412');
  await press(summary.getByRole('button', { name: 'Place order and pay' }));
  await page.waitForURL(/\/sandbox-pay\//);
  const sandboxPath = rel(page.url());
  await both(page, sandboxPath, 'p4-05-sandbox-payment');
  await page.goto(`/en${sandboxPath}`);
  await press(page.getByRole('button', { name: 'Simulate successful payment' }));
  await page.waitForURL(/\/checkouts\//);
  checkoutPath = rel(page.url());
  await expect(page.getByText('Payment confirmed')).toBeVisible({ timeout: 60_000 });
  await both(page, checkoutPath, 'p4-06-checkout-paid');

  await page.goto(`/en${checkoutPath}`);
  const link = page.getByTestId('checkout-orders').getByRole('link').first();
  orderNumber = (await link.textContent())!.trim();
  await press(link);
  await page.waitForURL(/\/orders\//);
  orderPath = rel(page.url());
  await both(page, `${base}/orders`, 'p4-07-buyer-orders');
  await both(page, orderPath, 'p4-08-buyer-order');
  await ctx.close();
});

test('supplier orders', async ({ browser }) => {
  const { ctx, page } = await signedIn(browser, 'seller.sales@desert-pack.test');
  await page.getByRole('link', { name: 'Seller centre' }).first().click();
  await page.getByRole('link', { name: 'Orders' }).first().click();
  await expect(page.getByTestId('orders')).toBeVisible();
  const list = rel(page.url());
  await both(page, list, 'p4-10-seller-orders');
  await page.goto(`/en${list}`);
  await press(page.getByTestId('orders').getByRole('link', { name: orderNumber }));
  await page.waitForURL(/\/orders\//);
  await both(page, rel(page.url()), 'p4-11-seller-order');
  await ctx.close();
});

test('admin orders and finance', async ({ browser }) => {
  const ctx = await adminContext(browser, {
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await enrolAdmin(page, createAdmin('FINANCE'));
  for (const locale of ['en', 'ar']) {
    await page.goto(`/${locale}/admin/orders`);
    await snap(page, `p4-20-admin-orders-${locale}`);
    await page.goto(`/${locale}/admin/finance`);
    await expect(page.getByTestId('ledger-balances')).toBeVisible();
    await snap(page, `p4-22-admin-finance-${locale}`);
  }
  await page.goto('/en/admin/orders');
  await press(page.getByTestId('orders').getByRole('link').first());
  await snap(page, 'p4-21-admin-order-en');
  await ctx.close();
});
