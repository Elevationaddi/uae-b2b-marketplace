import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Browser, type Page } from '@playwright/test';
import { adminContext, createAdmin, enrolAdmin, press, signIn, unique } from './support/helpers';

/**
 * Phase 3 review pack: RFQ, quote, messaging, notification and admin moderation screens in EN
 * and AR, desktop and phone. Run: pnpm test:e2e --project=screenshots tests/rfq.screenshots.spec.ts
 * Uses the dev seed (fictional companies) and creates its own request; nothing is mocked.
 */
const OUT = resolve(
  process.env.SCREENSHOT_DIR ?? resolve(__dirname, '../screenshots-out'),
  'phase3',
);
mkdirSync(OUT, { recursive: true });
test.describe.configure({ mode: 'serial' });

let rfqPath = '';
const title = unique('Printed shipping cartons');
let sellerRfqPath = '';
let conversationPath = '';

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

test('buyer creates and publishes a request', async ({ browser }) => {
  const { ctx, page } = await signedIn(browser, 'buyer.procurement@falcon-trading.test');
  await page.goto('/en/suppliers');
  await press(
    page
      .getByTestId('supplier-card')
      .filter({ hasText: 'Desert Packaging' })
      .first()
      .getByRole('link')
      .first(),
  );
  await press(page.getByRole('link', { name: 'Request quotation' }));
  await snap(page, 'p3-02-new-rfq-en');
  await page.getByLabel('Title').fill(title);
  const cat = page.getByLabel('Category', { exact: true });
  await cat.selectOption(
    (await cat.locator('option', { hasText: 'Boxes & Cartons' }).first().getAttribute('value'))!,
  );
  await page
    .getByLabel('Specifications')
    .fill('Double-wall cartons 40x30x30 cm, two-colour print, 2,000 units.');
  await page.getByLabel('Quantity').fill('2000');
  await page.getByLabel('Budget (AED)').fill('8000');
  await press(page.getByRole('button', { name: 'Save draft' }));
  await expect(page.getByText('Draft saved.')).toBeVisible();
  await snap(page, 'p3-03-rfq-draft-en');
  await press(page.getByRole('button', { name: 'Publish' }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/p3-04-publish-dialog-en.png` });
  await press(page.getByRole('dialog').getByRole('button', { name: 'Publish' }));
  await expect(page.getByText('Request published.')).toBeVisible();
  await page.waitForURL(/\/rfqs\/[0-9a-f-]{36}/);
  rfqPath = rel(page.url());
  await both(page, '/app/buyer/' + rfqPath.split('/')[3] + '/rfqs', 'p3-01-buyer-rfqs');
  await ctx.close();
});

test('supplier inbox, quote form and question', async ({ browser }) => {
  const { ctx, page } = await signedIn(browser, 'seller.sales@desert-pack.test');
  await page.getByRole('link', { name: 'Seller centre' }).first().click();
  await page.getByRole('link', { name: 'Quotation requests' }).first().click();
  await expect(page.getByTestId('seller-rfqs')).toBeVisible();
  const inbox = rel(page.url());
  await both(page, inbox, 'p3-10-seller-inbox');
  await page.goto(`/en${inbox}`);
  await press(page.getByTestId('seller-rfqs').getByRole('link', { name: title }));
  await page.waitForURL(/\/rfqs\/[0-9a-f-]{36}$/);
  sellerRfqPath = rel(page.url());
  await both(page, sellerRfqPath, 'p3-11-seller-rfq-quote-form');
  await page.goto(`/en${sellerRfqPath}`);
  const form = page.getByTestId('quote-form');
  await form.getByLabel('Unit price (AED, before tax)').fill('3.25');
  await form.getByLabel('Shipping (AED, before tax)').fill('400');
  await form
    .getByLabel('What is offered')
    .fill('Double-wall cartons as specified, FSC-certified board.');
  await form
    .getByLabel('Differences from the request')
    .fill('Print in Pantone 2945 instead of process blue.');
  await press(form.getByRole('button', { name: 'Save draft' }));
  await expect(page.getByText('Draft saved.')).toBeVisible();
  await snap(page, 'p3-12-seller-quote-draft-en');
  await press(page.getByRole('button', { name: 'Submit quote' }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/p3-13-submit-dialog-en.png` });
  await press(page.getByRole('dialog').getByRole('button', { name: 'Submit quote' }));
  await expect(page.getByText('Quote submitted.')).toBeVisible();
  await both(page, sellerRfqPath, 'p3-14-seller-quote-submitted');
  await page.goto(`/en${sellerRfqPath}`);
  await page
    .getByLabel('Your message')
    .fill('Can you accept delivery to your Jebel Ali warehouse?');
  await press(page.getByRole('button', { name: 'Send' }));
  await page.waitForURL(/\/messages\/[0-9a-f-]{36}\/[0-9a-f-]{36}$/);
  await expect(page.getByTestId('chat-messages')).toBeVisible();
  conversationPath = rel(page.url());
  await both(page, conversationPath, 'p3-15-seller-conversation');
  await both(page, inbox.replace(/rfqs$/, 'quotes'), 'p3-16-seller-quotes');
  await ctx.close();
});

test('buyer compares, messages and accepts', async ({ browser }) => {
  const { ctx, page } = await signedIn(browser, 'buyer.procurement@falcon-trading.test');
  await both(page, '/app/notifications', 'p3-20-notifications');
  const ws = rfqPath.split('/')[3];
  await both(page, `/app/messages/${ws}`, 'p3-21-messages');
  await page.goto(`/en/app/messages/${ws}`);
  await press(page.getByTestId('conversations').getByRole('link').first());
  await page.getByLabel('Your message').fill('Yes, Jebel Ali is fine. Please confirm lead time.');
  await press(page.getByRole('button', { name: 'Send' }));
  await snap(page, 'p3-22-buyer-conversation-en');
  await both(page, rfqPath, 'p3-23-buyer-rfq-comparison');
  await page.goto(`/en${rfqPath}`);
  const row = page.getByTestId('quote-comparison').getByRole('row', { name: /Desert Packaging/ });
  await press(row.getByRole('button', { name: 'Details' }));
  await snap(page, 'p3-24-quote-details-en');
  await press(row.getByRole('button', { name: 'Accept' }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/p3-25-accept-dialog-en.png` });
  await press(page.getByRole('dialog').getByRole('button', { name: 'Accept quote' }));
  await expect(page.locator('[data-status="AWARDED"]').first()).toBeVisible();
  await both(page, rfqPath, 'p3-26-buyer-rfq-awarded');
  await both(page, '/app/settings', 'p3-27-settings-email-prefs');
  await ctx.close();
});

test('admin request moderation', async ({ browser }) => {
  const ctx = await adminContext(browser, {
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await enrolAdmin(page, createAdmin('COMPLIANCE'));
  await page.goto('/en/admin/rfqs');
  await snap(page, 'p3-30-admin-rfqs-en');
  await page.goto('/ar/admin/rfqs');
  await snap(page, 'p3-30-admin-rfqs-ar');
  await page.goto('/en/admin/rfqs');
  await press(page.getByTestId('admin-rfqs').getByRole('link').first());
  await snap(page, 'p3-31-admin-rfq-detail-en');
  await ctx.close();
});
