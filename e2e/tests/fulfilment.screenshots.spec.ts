import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { addToCart, buyerBase, ensureAddress, placeOrder } from './support/commerce';
import { adminContext, createAdmin, enrolAdmin, press, samplePdf, signIn } from './support/helpers';

/**
 * Phase 5 review pack: order fulfilment actions, receipt, reviews, disputes, seller finance and
 * admin disputes, refunds, payouts and review moderation in EN and AR, desktop and phone.
 * Run: pnpm test:e2e --project=screenshots tests/fulfilment.screenshots.spec.ts
 * Uses the dev seed (fictional companies) and the labelled sandbox provider; nothing is mocked.
 */
const OUT = resolve(
  process.env.SCREENSHOT_DIR ?? resolve(__dirname, '../screenshots-out'),
  'phase5',
);
mkdirSync(OUT, { recursive: true });
test.describe.configure({ mode: 'serial' });

const BUYER = 'buyer.procurement@falcon-trading.test';
const SELLER = 'seller.owner@desert-pack.test';
let buyerOrderPath = '';
let sellerBase = '';
let orderId = '';
let disputePath = '';

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
  await enrolAdmin(page, createAdmin(role));
  return { ctx, page };
}

test('buyer and supplier fulfilment, receipt, review and dispute', async ({ browser }) => {
  test.setTimeout(300_000);
  const b = await signedIn(browser, BUYER);
  const base = await buyerBase(b.page);
  await ensureAddress(b.page, base);
  await addToCart(b.page);
  await placeOrder(b.page, base);
  await press(b.page.getByRole('button', { name: 'Simulate successful payment' }));
  await b.page.waitForURL(/\/checkouts\//);
  await expect(b.page.getByText('Payment confirmed')).toBeVisible({ timeout: 60_000 });
  const link = b.page.getByTestId('checkout-orders').getByRole('link').first();
  const orderNumber = (await link.textContent())!.trim();
  await press(link);
  await b.page.waitForURL(/\/orders\//);
  buyerOrderPath = rel(b.page.url());
  orderId = buyerOrderPath.split('/').pop()!;
  await both(b.page, buyerOrderPath, 'p5-01-buyer-order-confirmed');

  const s = await signedIn(browser, SELLER);
  await s.page.getByRole('link', { name: 'Seller centre' }).first().click();
  await s.page.getByRole('link', { name: 'Orders' }).first().click();
  await press(s.page.getByTestId('orders').getByRole('link', { name: orderNumber }));
  await s.page.waitForURL(/\/orders\//);
  const sellerOrderPath = rel(s.page.url());
  sellerBase = sellerOrderPath.replace(/\/orders\/.*$/, '');
  await both(s.page, sellerOrderPath, 'p5-02-seller-order-dispatch');
  await s.page.goto(`/en${sellerOrderPath}`);
  const dispatch = s.page.getByTestId('dispatch-form');
  await dispatch.getByLabel('Carrier').fill('Emirates Test Freight');
  await dispatch.getByLabel(/Tracking reference/).fill('ETF-20261201');
  await press(dispatch.getByRole('button', { name: 'Record dispatch' }));
  await expect(s.page.getByTestId('deliver-form')).toBeVisible();
  await both(s.page, sellerOrderPath, 'p5-03-seller-order-deliver');
  await s.page.goto(`/en${sellerOrderPath}`);
  const deliver = s.page.getByTestId('deliver-form');
  await deliver.getByLabel('Delivery note').fill('Received by the warehouse desk.');
  await deliver.getByLabel(/Proof of delivery/).setInputFiles(samplePdf('pod.pdf'));
  await press(deliver.getByRole('button', { name: 'Report delivery' }));
  await expect(s.page.locator('[data-status="DELIVERED"]').first()).toBeVisible();

  await both(b.page, buyerOrderPath, 'p5-04-buyer-order-confirm-receipt');
  await b.page.goto(`/en${buyerOrderPath}`);
  await press(b.page.getByRole('button', { name: 'Confirm receipt' }));
  await b.page.screenshot({ path: `${OUT}/p5-04b-confirm-receipt-dialog-en.png` });
  await press(b.page.getByRole('dialog').getByRole('button', { name: 'Confirm receipt' }));
  await expect(b.page.getByTestId('review-form')).toBeVisible();
  await both(b.page, buyerOrderPath, 'p5-05-buyer-order-completed');
  await b.page.goto(`/en${buyerOrderPath}`);
  const review = b.page.getByTestId('review-form');
  await review.getByLabel('Rating').selectOption('5');
  await review.getByLabel('Comment').fill('Strong double-wall cartons and clear delivery updates.');
  await press(review.getByRole('button', { name: 'Submit review' }));
  await expect(b.page.getByTestId('own-review')).toBeVisible();
  const df = b.page.getByTestId('dispute-form');
  await df.locator('summary').click();
  await df.getByLabel('Problem').selectOption('DAMAGED');
  await df.getByLabel('What happened?').fill('Three cartons were crushed at one corner.');
  await press(df.getByRole('button', { name: 'Open a dispute' }));
  await b.page.waitForURL(/\/disputes\//);
  const msg = b.page.getByTestId('dispute-message-form');
  await msg.getByLabel('Message').fill('Photos of the damaged cartons attached.');
  await msg.getByLabel(/Evidence/).setInputFiles(samplePdf('damage-photos.pdf'));
  await press(msg.getByRole('button', { name: 'Send' }));
  await expect(b.page.getByTestId('dispute-messages')).toContainText('damage-photos.pdf');
  disputePath = rel(b.page.url());
  await both(b.page, disputePath, 'p5-06-buyer-dispute');
  await both(b.page, `${base.replace(/^\/en/, '')}/disputes`, 'p5-07-buyer-disputes');

  const sellerDispute = `${sellerBase}/disputes/${disputePath.split('/').pop()}`;
  await both(s.page, `${sellerBase}/disputes`, 'p5-08-seller-disputes');
  await both(s.page, sellerDispute, 'p5-09-seller-dispute');
  await both(s.page, `${sellerBase}/finance`, 'p5-10-seller-finance');
  await b.ctx.close();
  await s.ctx.close();
});

test('admin disputes, refunds, payouts and review moderation', async ({ browser }) => {
  test.setTimeout(300_000);
  const support = await admin(browser, 'SUPPORT');
  const disputeId = disputePath.split('/').pop()!;
  for (const locale of ['en', 'ar']) {
    await support.page.goto(`/${locale}/admin/disputes`);
    await snap(support.page, `p5-20-admin-disputes-${locale}`);
  }
  await support.page.goto(`/en/admin/disputes/${disputeId}`);
  await press(support.page.getByRole('button', { name: 'Assign to me' }));
  await expect(support.page.getByTestId('propose-form')).toBeVisible();
  for (const locale of ['en', 'ar']) {
    await support.page.goto(`/${locale}/admin/disputes/${disputeId}`);
    await snap(support.page, `p5-21-admin-dispute-${locale}`);
  }
  // Propose a refund so finance can act on it.
  await support.page.goto(`/en/admin/disputes/${disputeId}`);
  const propose = support.page.getByTestId('propose-form');
  await propose.getByLabel('Proposed resolution').selectOption('REFUND');
  await propose.getByLabel('Proposed refund').fill('30.00');
  await propose.getByLabel('Note to both parties').fill('Credit for three damaged cartons.');
  await press(propose.getByRole('button', { name: 'Propose resolution' }));
  await expect(support.page.locator('[data-status="RESOLUTION_PROPOSED"]').first()).toBeVisible();
  await support.ctx.close();

  const finance = await admin(browser, 'FINANCE');
  await finance.page.goto('/en/admin/refunds');
  const rf = finance.page.getByTestId('refund-form');
  await rf.getByLabel('Order ID').fill(orderId);
  await rf.getByLabel('Amount (AED)').fill('30.00');
  await rf.getByLabel('Reason').fill('Dispute outcome: three damaged cartons');
  await rf.getByLabel(/Dispute ID/).fill(disputeId);
  await press(rf.getByRole('button', { name: 'Request a refund' }));
  await expect(finance.page.getByText('Refund requested.')).toBeVisible();
  for (const locale of ['en', 'ar']) {
    await finance.page.goto(`/${locale}/admin/refunds`);
    await snap(finance.page, `p5-22-admin-refunds-${locale}`);
    await finance.page.goto(`/${locale}/admin/payouts`);
    await snap(finance.page, `p5-23-admin-payouts-${locale}`);
  }
  await finance.page.setViewportSize({ width: 390, height: 844 });
  await finance.page.goto('/en/admin/refunds');
  await snap(finance.page, 'p5-22-admin-refunds-en-phone', false);
  await finance.ctx.close();

  const approver = await admin(browser, 'FINANCE_APPROVER');
  await approver.page.goto('/en/admin/refunds');
  await snap(approver.page, 'p5-22b-admin-refunds-approver-en');
  // Phase 8: settlement holds and the restricted commission setting (approver view).
  await both(approver.page, '/admin/holds', 'p8-01-admin-holds');
  await both(approver.page, '/admin/commission', 'p8-02-admin-commission');
  await approver.ctx.close();

  const compliance = await admin(browser, 'COMPLIANCE');
  for (const locale of ['en', 'ar']) {
    await compliance.page.goto(`/${locale}/admin/supplier-reviews`);
    await snap(compliance.page, `p5-24-admin-supplier-reviews-${locale}`);
  }
  await compliance.ctx.close();
});

test('public storefront reviews', async ({ browser }) => {
  const ctx = await browser.newContext(view);
  const page = await ctx.newPage();
  await page.goto('/en/suppliers');
  await press(page.getByRole('link', { name: /Desert Packaging/ }).first());
  await page.waitForURL(/\/suppliers\/[0-9a-f-]{36}/);
  const path = rel(page.url());
  for (const locale of ['en', 'ar']) {
    await page.goto(`/${locale}${path}`);
    await expect(page.getByTestId('supplier-reviews')).toBeVisible();
    await page.getByTestId('supplier-reviews').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/p5-25-storefront-reviews-${locale}.png` });
  }
  await ctx.close();
});
