import { expect, test } from '@playwright/test';
import { PRODUCT, addToCart, buyerBase, ensureAddress, placeOrder } from './support/commerce';
import { fulfilmentJourney } from './support/fulfilment-journey';
import { press, signIn } from './support/helpers';

/**
 * Phase 4 journey against the real stack and dev seed (fictional companies only):
 * buyer adds a ready-stock item to the cart → delivery address → checkout preview → place order →
 * labelled SANDBOX payment page → signed sandbox webhook → worker confirms → order is CONFIRMED,
 * and the supplier sees it. No live payment provider is involved at any point.
 */
test.describe.configure({ mode: 'serial' });

/*
 * One approved buyer is seeded and the cart belongs to its workspace, so every cart-mutating step
 * lives in this single sequential test, run on one project only (parallel runs would race the cart).
 */
test('buyer pays through the labelled sandbox (decline, retry, success), supplier sees the order, buyer cancels another', async ({
  page,
  browser,
}, info) => {
  test.skip(info.project.name !== 'chromium', 'shares the seeded buyer cart; runs once');
  test.setTimeout(240_000);
  await signIn(page, 'buyer.procurement@falcon-trading.test');
  const base = await buyerBase(page);
  await ensureAddress(page, base);
  await addToCart(page);

  // Cart: seller group with delivery terms and server prices.
  await page.goto(`${base}/cart`);
  const group = page.getByTestId('cart-group').filter({ hasText: 'Desert Packaging' });
  await expect(group.getByTestId('cart-lines')).toContainText(PRODUCT);
  await press(page.getByRole('link', { name: 'Continue to checkout' }));
  await page.waitForURL(/\/checkout$/);

  // Declined first attempt: the checkout stays payable.
  await placeOrder(page, base);
  await press(page.getByRole('button', { name: 'Simulate declined payment' }));
  await page.waitForURL(/\/checkouts\//);
  const payNow = page.getByRole('button', { name: 'Pay now' });
  await expect(payNow).toBeVisible({ timeout: 60_000 });
  await expect(page.locator('[data-status="PENDING_PAYMENT"]').first()).toBeVisible();
  await expect(page.getByTestId('payments')).toContainText('Failed');

  // Retry succeeds; the page polls until the signed webhook is processed by the worker.
  await press(payNow);
  await page.waitForURL(/\/sandbox-pay\//);
  await press(page.getByRole('button', { name: 'Simulate successful payment' }));
  await page.waitForURL(/\/checkouts\//);
  await expect(page.getByText('Payment confirmed')).toBeVisible({ timeout: 60_000 });
  await expect(page.locator('[data-status="PAID"]').first()).toBeVisible();
  const orderLink = page.getByTestId('checkout-orders').getByRole('link').first();
  const orderNumber = (await orderLink.textContent())!.trim();
  expect(orderNumber).toMatch(/^ORD-/);
  await press(orderLink);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(orderNumber);
  await expect(page.locator('[data-status="CONFIRMED"]').first()).toBeVisible();
  await expect(page.getByTestId('order-timeline')).toBeVisible();
  // The buyer never sees commission figures.
  await expect(page.getByText('Platform commission')).toHaveCount(0);

  // Supplier sees the confirmed order.
  const seller = await browser.newContext();
  const sp = await seller.newPage();
  await signIn(sp, 'seller.sales@desert-pack.test');
  await sp.getByRole('link', { name: 'Seller centre' }).first().click();
  await sp.getByRole('link', { name: 'Orders' }).first().click();
  await press(sp.getByTestId('orders').getByRole('link', { name: orderNumber }));
  await expect(sp.getByRole('heading', { level: 1 })).toContainText(orderNumber);
  await expect(sp.locator('[data-status="CONFIRMED"]').first()).toBeVisible();
  await seller.close();

  // A second checkout left unpaid can be cancelled by the buyer (stock reservation released).
  await addToCart(page);
  await placeOrder(page, base);
  await press(page.getByRole('link', { name: 'Return without paying' }));
  await page.waitForURL(/\/checkouts\//);
  await press(page.getByRole('button', { name: 'Cancel checkout' }));
  await press(page.getByRole('dialog').getByRole('button', { name: 'Cancel checkout' }));
  await expect(page.locator('[data-status="CANCELLED"]').first()).toBeVisible();
});

test('Phase 5: fulfilment, receipt, review, dispute, refund and payout through the labelled sandbox', async ({
  page,
  browser,
}, info) => {
  test.skip(info.project.name !== 'chromium', 'shares the seeded buyer cart; runs once');
  test.setTimeout(300_000);
  await fulfilmentJourney(page, browser);
});

test('Arabic cart and orders render right-to-left', async ({ page }) => {
  await signIn(page, 'buyer.procurement@falcon-trading.test');
  const base = (await buyerBase(page)).replace(/^\/en\//, '/ar/');
  await page.goto(`${base}/orders`);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1, name: 'الطلبات' })).toBeVisible();
  await page.goto(`${base}/cart`);
  await expect(page.getByRole('heading', { level: 1, name: 'السلة' })).toBeVisible();
});

test('a seller cannot open buyer checkout pages; outsiders get not found', async ({ page }) => {
  await signIn(page, 'seller.sales@desert-pack.test');
  const r = await page.request.get(
    '/api/v1/buyer/workspaces/00000000-0000-4000-8000-000000000000/cart',
  );
  expect([403, 404]).toContain(r.status());
  const sess = await page.request.get(
    '/api/v1/sandbox/psp/sessions/00000000-0000-4000-8000-000000000000',
  );
  expect(sess.status()).toBe(404);
});
