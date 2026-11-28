import { expect, test } from '@playwright/test';
import { SELLER } from './support/fulfilment-journey';
import { signIn } from './support/helpers';

/**
 * Phase 5 checks that do not touch the seeded buyer cart. The full fulfilment → dispute → refund
 * → payout journey (support/fulfilment-journey.ts) runs inside the serial cart journeys in
 * checkout.spec.ts, because both journeys share the one seeded buyer cart.
 */
test('Arabic disputes and seller finance render right-to-left; outsiders get not found', async ({
  page,
}) => {
  await signIn(page, SELLER);
  const me = await (await page.request.get('/api/v1/me')).json();
  const ws = me.data.workspaces.find((w: { kind: string }) => w.kind === 'SELLER').id;
  await page.goto(`/ar/app/seller/${ws}/finance`);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1, name: 'المالية' })).toBeVisible();
  await page.goto(`/ar/app/seller/${ws}/disputes`);
  await expect(page.getByRole('heading', { level: 1, name: 'النزاعات' })).toBeVisible();
  const r = await page.request.get(
    `/api/v1/buyer/workspaces/00000000-0000-4000-8000-000000000000/disputes`,
  );
  expect([403, 404]).toContain(r.status());
  const admin = await page.request.get('/api/v1/admin/refunds');
  expect([401, 403, 404]).toContain(admin.status());
});
