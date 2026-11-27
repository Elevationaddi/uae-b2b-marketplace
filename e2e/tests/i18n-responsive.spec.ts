import { expect, test } from '@playwright/test';
import { signIn } from './support/helpers';

test('Arabic sign-in page is right-to-left and translated', async ({ page }) => {
  await page.goto('/ar/login');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('تسجيل الدخول');
  await expect(page.getByLabel('بريد العمل')).toBeVisible();
});

test('language switch keeps the current page', async ({ page }) => {
  await page.goto('/en/forgot-password');
  await page.getByRole('link', { name: 'Switch language to Arabic' }).click();
  await expect(page).toHaveURL(/\/ar\/forgot-password$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('signed-in company pages render in Arabic', async ({ page }) => {
  await signIn(page, 'seller.owner@desert-pack.test');
  await page.goto('/ar/app');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('مرحباً');
});

test('no horizontal overflow on key pages', async ({ page }) => {
  const check = async (path: string) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  };
  for (const p of ['/en/register', '/ar/register', '/en/login']) await check(p);
  await signIn(page, 'dual.owner@oasis-textiles.test');
  const company = await page.getByRole('link', { name: 'Open company' }).getAttribute('href');
  for (const p of [
    '/en/app',
    '/ar/app',
    company!,
    company!.replace('/en/', '/ar/'),
    '/en/app/settings',
  ])
    await check(p);
});
