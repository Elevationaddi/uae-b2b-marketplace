import { expect, test } from '@playwright/test';

test('root redirects to the English marketplace home', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByRole('search')).toBeVisible();
});

test('status page shows live system status from the API', async ({ page }) => {
  await page.goto('/en/status');
  const status = page.getByTestId('status-list');
  await expect(status).toContainText('API');
  await expect(status).toContainText('Database');
  await expect(status.getByText('Operational')).toHaveCount(3);
});

test('Arabic renders right-to-left with translated content', async ({ page }) => {
  await page.goto('/ar/status');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('حالة النظام');
});

test('language switch is a keyboard-reachable link', async ({ page }) => {
  await page.goto('/en');
  const link = page.getByRole('link', { name: 'Switch language to Arabic' });
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/ar$/);
});

test('no horizontal page overflow', async ({ page }) => {
  for (const path of ['/en', '/ar']) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test('unknown locale returns 404', async ({ page }) => {
  const res = await page.goto('/fr');
  expect(res?.status()).toBe(404);
});

test('web liveness endpoint', async ({ request }) => {
  const res = await request.get('/healthz');
  expect(res.status()).toBe(200);
  expect((await res.json()).data.service).toBe('web');
});
