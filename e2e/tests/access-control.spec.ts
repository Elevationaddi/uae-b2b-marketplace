import { expect, test } from '@playwright/test';
import { ADMIN, adminContext, createAdmin, enrolAdmin, signIn, WEB } from './support/helpers';

test.describe('role-based access and tenant isolation in the UI', () => {
  test('signed-out visitors are sent to sign-in, keeping the target', async ({ page }) => {
    await page.goto('/en/app/settings');
    await expect(page).toHaveURL(/\/en\/login\?next=%2Fen%2Fapp%2Fsettings/);
  });

  test('a viewer sees company details read-only and cannot manage the team', async ({ page }) => {
    await signIn(page, 'buyer.viewer@falcon-trading.test');
    await page.getByRole('link', { name: 'Open company' }).click();
    await expect(page.getByRole('heading', { name: 'Falcon Trading' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit details' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Upload document' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Download' })).toHaveCount(0);
    await page.getByRole('link', { name: 'Team' }).filter({ visible: true }).click();
    await expect(page.getByText('Only owners can manage the team.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send invitation' })).toHaveCount(0);
  });

  test("another company's page is not found (no cross-tenant access)", async ({ browser }) => {
    const owner = await browser.newPage();
    await signIn(owner, 'buyer.owner@falcon-trading.test');
    const href = await owner.getByRole('link', { name: 'Open company' }).getAttribute('href');
    await owner.close();

    const other = await browser.newPage();
    await signIn(other, 'seller.owner@desert-pack.test');
    await other.goto(href!);
    await expect(other.getByText('Not found, or you do not have access.')).toBeVisible();
    await expect(other.getByRole('heading', { name: 'Falcon Trading' })).toHaveCount(0);
    await other.close();
  });

  test('admin surface exists only on the admin origin and company pages only on the web origin', async ({
    page,
  }) => {
    // Navigations go through the browser, which resolves *.localhost to loopback.
    const status = async (url: string) => (await page.goto(url))?.status();
    expect(await status(`${WEB}/en/admin`)).toBe(404);
    expect(await status(`${WEB}/api/v1/admin/me`)).toBe(404);
    expect(await status(`${ADMIN}/en/app`)).toBe(404);
    expect(await status(`${ADMIN}/api/v1/me`)).toBe(404);
    expect(await status(`${ADMIN}/api/v1/admin/me`)).toBe(401);
  });

  test('a support admin cannot open the verification queue', async ({ browser }) => {
    const ctx = await adminContext(browser);
    const page = await ctx.newPage();
    await enrolAdmin(page, createAdmin('SUPPORT'));
    await expect(page.getByRole('link', { name: 'Verification', exact: true })).toHaveCount(0);
    await page.goto('/en/admin/verification');
    await expect(page.getByText('Not available')).toBeVisible();
    await ctx.close();
  });
});
