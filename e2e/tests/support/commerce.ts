import { expect, type Page } from '@playwright/test';
import { press, unique } from './helpers';

/** Checkout steps shared by the Phase 4 and Phase 5 journeys (seeded fictional companies only). */
export const PRODUCT = 'Double-Wall Corrugated Shipping Carton';

export async function buyerBase(page: Page): Promise<string> {
  const me = await (await page.request.get('/api/v1/me')).json();
  const ws = me.data.workspaces.find((w: { kind: string }) => w.kind === 'BUYER');
  return `/en/app/buyer/${ws.id}`;
}

export async function ensureAddress(page: Page, base: string) {
  await page.goto(`${base}/addresses`);
  await expect(page.getByRole('heading', { level: 1, name: 'Addresses' })).toBeVisible();
  const list = page.getByTestId('addresses');
  if (await list.isVisible().catch(() => false)) return;
  const form = page.getByTestId('address-form');
  await form.getByLabel('Label (for example Main warehouse)').fill(unique('Warehouse'));
  await form.getByLabel('Recipient').fill('Receiving desk');
  await form.getByLabel('Phone').fill('+971501234567');
  await form.getByLabel('Address line 1').fill('Warehouse 12, Street 4, Al Quoz Industrial 3');
  await form.getByLabel('City').fill('Dubai');
  await form.getByLabel('Emirate').selectOption('DUBAI');
  await press(form.getByRole('button', { name: 'Save address' }));
  await expect(page.getByText('Address saved.')).toBeVisible();
  await expect(list).toBeVisible();
}

export async function addToCart(page: Page) {
  await page.goto(`/en/search?q=${encodeURIComponent('double-wall carton')}`);
  await press(
    page.getByTestId('product-card').filter({ hasText: PRODUCT }).first().getByRole('link').first(),
  );
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Double-Wall');
  const form = page.getByTestId('add-to-cart');
  await press(form.getByRole('button', { name: 'Add to cart' }));
  await expect(form.getByRole('status')).toContainText('Added to your cart.');
}

export async function placeOrder(page: Page, base: string) {
  await page.goto(`${base}/checkout`);
  await expect(page.getByTestId('sandbox-notice')).toBeVisible();
  await expect(page.getByTestId('checkout-group').first()).toBeVisible();
  const summary = page.getByTestId('checkout-summary');
  await expect(summary.getByTestId('totals')).toContainText('AED');
  await press(summary.getByRole('button', { name: 'Place order and pay' }));
  await expect(summary.getByText('Confirm the order details to continue.')).toBeVisible();
  await summary.getByRole('checkbox').check();
  await summary.getByLabel(/Your PO reference/).fill(unique('PO'));
  await press(summary.getByRole('button', { name: 'Place order and pay' }));
  await page.waitForURL(/\/sandbox-pay\//);
  await expect(page.getByTestId('sandbox-notice')).toBeVisible();
}
