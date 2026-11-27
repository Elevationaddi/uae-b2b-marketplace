import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { adminContext, createAdmin, enrolAdmin, signIn } from './support/helpers';

/**
 * Phase 2 review pack: marketplace, seller centre and admin catalog screens in EN and AR,
 * desktop and phone. Run: pnpm test:e2e --project=screenshots tests/catalog.screenshots.spec.ts
 * Uses the dev seed (fictional companies); nothing is mocked.
 */
const OUT = resolve(
  process.env.SCREENSHOT_DIR ?? resolve(__dirname, '../screenshots-out'),
  'phase2',
);
mkdirSync(OUT, { recursive: true });
test.describe.configure({ mode: 'serial' });

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

test('marketplace as a guest', async ({ page }) => {
  await both(page, '', 'p2-01-home');
  await both(page, '/categories', 'p2-02-categories');
  await page.goto('/en/categories');
  const cat = await page.locator('.cat-dir-head').first().getAttribute('href');
  await both(page, cat!.replace(/^\/en/, ''), 'p2-03-category');
  await both(page, '/search?q=box', 'p2-04-search');
  await page.goto('/en/search?q=zzzz-no-such-product');
  await snap(page, 'p2-04b-search-empty-en');
  await page.goto('/en/search?q=box');
  const product = await page
    .getByTestId('product-card')
    .first()
    .getByRole('link')
    .getAttribute('href');
  await both(page, product!.replace(/^\/en/, ''), 'p2-05-product-guest');
  await both(page, '/suppliers', 'p2-06-suppliers');
  const supplier = await page
    .getByTestId('supplier-card')
    .first()
    .getByRole('link')
    .getAttribute('href');
  await both(page, supplier!.replace(/^\/(en|ar)/, ''), 'p2-07-storefront');
  await page.goto('/en/products/00000000-0000-4000-8000-000000000000');
  await snap(page, 'p2-08-product-not-found-en');
  await page.goto('/en/saved');
  await snap(page, 'p2-09-saved-signed-out-en');
});

test('marketplace as a verified buyer', async ({ page }) => {
  await signIn(page, 'buyer.procurement@falcon-trading.test');
  await page.goto('/en/search?q=box');
  await snap(page, 'p2-10-search-verified-en');
  const product = await page
    .getByTestId('product-card')
    .first()
    .getByRole('link')
    .getAttribute('href');
  await page.goto(product!);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  if (await page.getByRole('button', { name: 'Compare', exact: true }).isVisible())
    await page.getByRole('button', { name: 'Compare', exact: true }).click();
  await page
    .getByRole('button', { name: 'Calculate' })
    .click()
    .catch(() => undefined);
  await snap(page, 'p2-11-product-verified-en');
  await page.goto(product!.replace('/en/', '/ar/'));
  await snap(page, 'p2-11-product-verified-ar');
  for (const [path, name] of [
    ['/saved', 'p2-12-saved'],
    ['/compare', 'p2-13-compare'],
    ['/recent', 'p2-14-recent'],
    ['/preferences', 'p2-15-preferences'],
  ]) {
    await page.goto(`/en${path}`);
    await snap(page, `${name}-en`);
  }
  await page.goto('/ar/compare');
  await snap(page, 'p2-13-compare-ar');
});

test('seller centre', async ({ page }) => {
  await signIn(page, 'seller.owner@desert-pack.test');
  await page.getByRole('link', { name: 'Seller centre' }).first().click();
  await expect(page.getByTestId('seller-kpis')).toBeVisible();
  const base = new URL(page.url()).pathname.replace(/^\/en/, '');
  const pages: [string, string][] = [
    ['', 'p2-20-seller-overview'],
    ['/storefront', 'p2-21-seller-storefront'],
    ['/products', 'p2-22-seller-products'],
    ['/products/new', 'p2-23-seller-new-product'],
    ['/inventory', 'p2-25-seller-inventory'],
    ['/pricing', 'p2-26-seller-pricing'],
  ];
  for (const [p, name] of pages) {
    await page.goto(`/en${base}${p}`);
    await snap(page, `${name}-en`);
  }
  await page.goto(`/en${base}/products`);
  const editor = await page
    .getByTestId('seller-products')
    .getByRole('link')
    .first()
    .getAttribute('href');
  await page.goto(editor!);
  await snap(page, 'p2-24-seller-product-editor-en');
  await page.goto(editor!.replace('/en/', '/ar/'));
  await snap(page, 'p2-24-seller-product-editor-ar');
  await page.goto(`/ar${base}`);
  await snap(page, 'p2-20-seller-overview-ar');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/en${base}/inventory`);
  await snap(page, 'p2-25-seller-inventory-en-phone', false);
  await page.goto(`/en${base}`);
  await snap(page, 'p2-20-seller-overview-en-phone', false);
});

test('admin catalog', async ({ browser }) => {
  const ctx = await adminContext(browser, {
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await enrolAdmin(page, createAdmin('COMPLIANCE'));
  await page.goto('/en/admin/catalog');
  await snap(page, 'p2-30-admin-catalog-en');
  const review = page.getByTestId('review-queue').getByRole('link').first();
  if (await review.isVisible()) {
    await review.click();
    await snap(page, 'p2-31-admin-review-en');
  }
  for (const [path, name] of [
    ['/catalog/products', 'p2-32-admin-listings'],
    ['/catalog/storefronts', 'p2-34-admin-storefronts'],
    ['/catalog/categories', 'p2-35-admin-categories'],
    ['/catalog/restricted', 'p2-37-admin-restricted'],
    ['/catalog/featured', 'p2-38-admin-featured'],
  ]) {
    await page.goto(`/en/admin${path}`);
    await snap(page, `${name}-en`);
  }
  await page.goto('/en/admin/catalog/products');
  await page.getByTestId('admin-listings').getByRole('link').first().click();
  await snap(page, 'p2-33-admin-listing-detail-en');
  await page.goto('/en/admin/catalog/categories');
  await page.getByTestId('admin-categories').getByRole('link').first().click();
  await snap(page, 'p2-36-admin-category-en');
  await page.goto('/ar/admin/catalog');
  await snap(page, 'p2-30-admin-catalog-ar');
  await ctx.close();

  const sctx = await adminContext(browser, {
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 900 },
  });
  const sp = await sctx.newPage();
  await enrolAdmin(sp, createAdmin('SUPPORT'));
  await sp.goto('/en/admin/verification');
  await snap(sp, 'p2-39-admin-forbidden-en');
  await sctx.close();
});
