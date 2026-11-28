import { expect, test, type Page } from '@playwright/test';
import { press, signIn, unique } from './support/helpers';

/**
 * Phase 3 journey against the real stack and dev seed (fictional companies only):
 * buyer requests a quotation from a supplier storefront → supplier drafts and submits a quote →
 * buyer compares and accepts (award recorded; a quote checkout and order await payment).
 */
async function openSupplier(page: Page, name: string) {
  await page.goto('/en/suppliers');
  await press(
    page.getByTestId('supplier-card').filter({ hasText: name }).first().getByRole('link').first(),
  );
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
}

test('buyer requests a quotation, supplier quotes, buyer accepts', async ({ page, browser }) => {
  test.skip(
    (page.viewportSize()?.width ?? 1280) < 700,
    'long two-party desktop workflow; mobile layout covered below',
  );
  test.setTimeout(180_000);
  const title = unique('E2E Printed cartons');

  // Buyer: storefront → Request quotation (invites this supplier) → draft → publish.
  await signIn(page, 'buyer.procurement@falcon-trading.test');
  await openSupplier(page, 'Desert Packaging');
  await press(page.getByRole('link', { name: 'Request quotation' }));
  await expect(page.getByRole('heading', { name: 'New request' })).toBeVisible();
  await page.getByLabel('Title').fill(title);
  const cat = page.getByLabel('Category', { exact: true });
  const value = await cat
    .locator('option', { hasText: 'Boxes & Cartons' })
    .first()
    .getAttribute('value');
  await cat.selectOption(value!);
  await page
    .getByLabel('Specifications')
    .fill('Double-wall cartons 40x30x30 cm, two-colour print.');
  await page.getByLabel('Quantity').fill('2000');
  await expect(page.getByRole('radio', { name: /Invited suppliers only/ })).toBeChecked();
  await expect(page.getByText('1 invited')).toBeVisible();
  await press(page.getByRole('button', { name: 'Save draft' }));
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  await expect(page.getByText('Draft saved.')).toBeVisible();
  await press(page.getByRole('button', { name: 'Publish' }));
  await press(page.getByRole('dialog').getByRole('button', { name: 'Publish' }));
  await expect(page.getByText('Request published.')).toBeVisible();
  await expect(page.locator('[data-status="OPEN"]').first()).toBeVisible();
  const rfqUrl = page.url();

  // Supplier: inbox → quote draft → submit.
  const seller = await browser.newContext();
  const sp = await seller.newPage();
  await signIn(sp, 'seller.sales@desert-pack.test');
  await sp.getByRole('link', { name: 'Seller centre' }).first().click();
  await sp.getByRole('link', { name: 'Quotation requests' }).first().click();
  await press(sp.getByTestId('seller-rfqs').getByRole('link', { name: title }));
  await expect(sp.getByRole('heading', { level: 1, name: title })).toBeVisible();
  const form = sp.getByTestId('quote-form');
  await form.getByLabel('Unit price (AED, before tax)').fill('3.25');
  await form.getByLabel('Shipping (AED, before tax)').fill('400');
  await expect(form.getByText(/AED 6,?900\.00 before tax/)).toBeVisible();
  await form.getByLabel('What is offered').fill('Double-wall cartons as specified, FSC board.');
  await press(form.getByRole('button', { name: 'Save draft' }));
  await expect(sp.getByText('Draft saved.')).toBeVisible();
  // Server-computed totals: 2000 × 3.25 + 400 = 6,900.00; standard tax 5% = 345.00.
  await expect(sp.getByTestId('my-quote')).toContainText('7,245.00');
  await press(sp.getByRole('button', { name: 'Submit quote' }));
  await press(sp.getByRole('dialog').getByRole('button', { name: 'Submit quote' }));
  await expect(sp.getByText('Quote submitted.')).toBeVisible();
  await expect(sp.getByTestId('my-quote').locator('[data-status="SUBMITTED"]')).toBeVisible();

  // Buyer: notification, comparison and acceptance.
  await page.goto('/en/app/notifications');
  await expect(page.getByTestId('notifications')).toContainText(
    'Desert Packaging submitted a quote',
  );
  await page.goto(rfqUrl);
  const row = page.getByTestId('quote-comparison').getByRole('row', { name: /Desert Packaging/ });
  await expect(row).toContainText('7,245.00');
  await press(row.getByRole('button', { name: 'Accept' }));
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('7,245.00');
  await dialog.getByLabel('Your PO reference').fill('PO-E2E-1');
  await press(dialog.getByRole('button', { name: 'Accept quote' }));
  await expect(page.locator('.alert-title', { hasText: 'Quote accepted' })).toBeVisible();
  await expect(page.locator('[data-status="AWARDED"]').first()).toBeVisible();
  await expect(page.getByTestId('award-order-link')).toHaveText('Pay for this order');

  // Supplier sees the win; the accepted version can no longer be revised.
  await sp.reload();
  await expect(sp.getByText('The buyer accepted your quote.')).toBeVisible();
  await expect(sp.getByRole('button', { name: 'Revise' })).toHaveCount(0);
  await seller.close();
});

test('RFQ screens work in Arabic on a phone', async ({ page }) => {
  await signIn(page, 'buyer.procurement@falcon-trading.test');
  await page.goto('/ar/app');
  await page.getByRole('link', { name: 'طلبات عروض الأسعار' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1, name: 'طلبات عروض الأسعار' })).toBeVisible();
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual((page.viewportSize()?.width ?? 1280) + 1);
});

test('viewer role cannot create requests; other workspaces are not found', async ({ page }) => {
  await signIn(page, 'buyer.viewer@falcon-trading.test');
  await page.getByRole('link', { name: 'Requests for quotation' }).first().click();
  await expect(page.getByText('Your role can view requests but not create them.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'New request' })).toHaveCount(0);
  const res = await page.request.get(
    '/api/v1/buyer/workspaces/00000000-0000-4000-8000-000000000000/rfqs',
  );
  expect(res.status()).toBe(404);
});
