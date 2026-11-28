import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { adminContext, createAdmin, enrolAdmin, signIn } from './support/helpers';

/**
 * Automated accessibility checks (docs/12-testing.md nonfunctional targets, docs/05-ui.md) with
 * axe-core against WCAG 2.1 A/AA rules, in English and Arabic. Serious and critical findings
 * fail the test; manual keyboard and screen-reader review is still required before launch.
 */
async function audit(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator('main')).toBeVisible();
  await page.waitForLoadState('networkidle');
  const r = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const bad = r.violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map(
      (v) =>
        `${v.id} (${v.impact}): ${v.nodes
          .map((n) => n.target.join(' '))
          .slice(0, 3)
          .join(' | ')}`,
    );
  expect(bad, `${path}\n${bad.join('\n')}`).toEqual([]);
}

test.beforeEach(({ browserName: _browserName }, info) => {
  test.skip(info.project.name !== 'chromium', 'one desktop pass is enough for automated rules');
});

test('public and buyer pages have no serious accessibility violations', async ({ page }) => {
  test.setTimeout(120_000);
  for (const p of ['/en', '/ar', '/en/login', '/en/register']) await audit(page, p);
  await signIn(page, 'buyer.procurement@falcon-trading.test');
  const me = await (await page.request.get('/api/v1/me')).json();
  const ws = me.data.workspaces.find((w: { kind: string }) => w.kind === 'BUYER').id;
  for (const locale of ['en', 'ar'])
    for (const p of ['orders', 'cart', 'disputes', 'support', 'support/new', 'rfqs'])
      await audit(page, `/${locale}/app/buyer/${ws}/${p}`);
  await audit(page, '/en/app/settings');
  await audit(page, '/en/app/notifications');
});

test('seller pages have no serious accessibility violations', async ({ page }) => {
  test.setTimeout(120_000);
  await signIn(page, 'seller.owner@desert-pack.test');
  const me = await (await page.request.get('/api/v1/me')).json();
  const ws = me.data.workspaces.find((w: { kind: string }) => w.kind === 'SELLER').id;
  for (const p of ['', '/products', '/orders', '/finance', '/support'])
    await audit(page, `/en/app/seller/${ws}${p}`);
  await audit(page, `/ar/app/seller/${ws}/orders`);
});

test('admin pages have no serious accessibility violations', async ({ browser }) => {
  test.setTimeout(120_000);
  const ctx = await adminContext(browser);
  const page = await ctx.newPage();
  await enrolAdmin(page, createAdmin('SUPPORT'));
  for (const p of ['/en/admin', '/en/admin/support', '/en/admin/reports', '/ar/admin/support'])
    await audit(page, p);
  await ctx.close();
});
