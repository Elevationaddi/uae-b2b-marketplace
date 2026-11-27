import { resolve } from 'node:path';
import { expect, test } from '@playwright/test';
import { adminContext, createAdmin, enrolAdmin, press, signIn, unique } from './support/helpers';

/**
 * Phase 2 marketplace journeys against the real stack and dev seed (fictional companies only).
 * Guest vs verified access (A12), seller listing → admin moderation → public visibility.
 */
const IMAGE = resolve(__dirname, 'support/fixtures/product.png');

test('guest browses the marketplace without seeing prices', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('search')).toBeVisible();
  await expect(page.getByTestId('home-totals')).toContainText('verified suppliers');
  await page.getByRole('combobox').fill('carton');
  await page.getByRole('combobox').press('Enter');
  await expect(page).toHaveURL(/\/en\/search\?q=carton/);
  await expect(page.getByTestId('results-count')).toBeVisible();
  const card = page.getByTestId('product-card').first();
  await expect(card).toContainText('Sign in with a verified email to see wholesale prices');
  // Price sorts are offered to verified users only; the API refuses them for guests too.
  await expect(page.getByLabel('Sort by').locator('option')).not.toContainText([
    'Price: low to high',
  ]);
  await press(card.getByRole('link'));
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Sign in to request quotations or order.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Request quotation' })).toBeDisabled();
  const api = await page.request.get('/api/v1/marketplace/products?sort=price_asc');
  expect(api.status()).toBe(422);
});

test('Arabic marketplace renders right-to-left', async ({ page }) => {
  await page.goto('/ar/suppliers');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { name: 'دليل الموردين' })).toBeVisible();
  await expect(page.getByTestId('supplier-card').first()).toBeVisible();
});

test('verified buyer sees prices, saves and compares a product', async ({ page }) => {
  await signIn(page, 'buyer.procurement@falcon-trading.test');
  await page.goto('/en/search?q=carton');
  const card = page.getByTestId('product-card').first();
  await expect(card.locator('.money')).toBeVisible();
  await press(card.getByRole('link'));
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const save = page.getByRole('button', { name: /^(Save|Saved)$/ });
  if ((await save.textContent()) === 'Saved') await press(save);
  await press(page.getByRole('button', { name: 'Save', exact: true }));
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toBeVisible();
  await page.goto('/en/saved');
  await expect(page.getByTestId('product-card').first()).toBeVisible();
});

test('seller lists a product, admin approves it, guests then find it', async ({
  page,
  browser,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 1280) < 700,
    'long desktop workflow; mobile layout covered elsewhere',
  );
  test.setTimeout(150_000);
  const title = unique('E2E Kraft Box');
  await signIn(page, 'seller.owner@desert-pack.test');
  await page.getByRole('link', { name: 'Seller centre' }).first().click();
  await expect(page.getByTestId('seller-kpis')).toBeVisible();
  await page.getByRole('link', { name: 'Add product' }).first().click();
  await page.getByLabel('Product name (English)').fill(title);
  await page.getByLabel('Category').selectOption({ label: 'Boxes & Cartons' });
  await page.getByLabel('SKU').fill(
    unique('SKU')
      .replace(/[^A-Za-z0-9]/g, '')
      .slice(0, 30),
  );
  await page.getByRole('button', { name: 'Create draft' }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();

  await page
    .getByLabel('Description (English)', { exact: true })
    .fill('Corrugated kraft box for E2E testing, fictional listing.');
  await page.getByRole('button', { name: 'Save draft' }).click();
  await expect(page.getByText('Saved.').first()).toBeVisible();

  await page.locator('#pm-file').setInputFiles(IMAGE);
  await page.locator('button[type=submit]', { hasText: 'Upload image' }).click();
  await expect(page.locator('.media-grid img')).toHaveCount(1);

  await page.getByLabel('Unit price (AED) 1').fill('2.50');
  await page.getByRole('button', { name: 'Save pricing' }).click();
  await expect(page.locator('#sec-pricing').locator('..').getByText('Saved.')).toBeVisible();

  await page.getByRole('button', { name: 'Submit for review' }).first().click();
  await page.getByRole('dialog').getByRole('button', { name: 'Submit for review' }).click();
  await expect(page.locator('[data-status="PENDING_REVIEW"]').first()).toBeVisible();

  const admin = await adminContext(browser);
  const ap = await admin.newPage();
  await enrolAdmin(ap, createAdmin('COMPLIANCE'));
  await ap.goto('/en/admin/catalog');
  await ap.getByPlaceholder('Search title, company or SKU').fill(title);
  await ap.getByRole('button', { name: 'Search' }).click();
  await ap.getByRole('link', { name: title }).click();
  await expect(ap.getByRole('heading', { name: new RegExp(title) })).toBeVisible();
  await ap.getByRole('button', { name: 'Approve' }).click();
  await expect(ap.getByText('Decision recorded.')).toBeVisible();
  await admin.close();

  const guest = await browser.newContext();
  const gp = await guest.newPage();
  await gp.goto(`/en/search?q=${encodeURIComponent(title)}`);
  await expect(gp.getByTestId('product-card')).toHaveCount(1);
  await expect(gp.getByTestId('product-card')).toContainText(title);
  await guest.close();
});

test('seller workspace is not reachable by another company', async ({ page }) => {
  await signIn(page, 'buyer.owner@falcon-trading.test');
  // A seller workspace id the buyer is not a member of: the API answers 404, never data.
  const res = await page.request.get(
    '/api/v1/seller/workspaces/00000000-0000-4000-8000-000000000001/overview',
  );
  expect([403, 404]).toContain(res.status());
});
