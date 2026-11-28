import { expect, test, type Page } from '@playwright/test';
import { authenticator } from 'otplib';
import { adminContext, createAdmin, enrolAdmin, press, signIn, unique } from './support/helpers';

/**
 * Phase 6 journeys against the real stack and dev seed: a support ticket round trip between a
 * buyer and a support agent, a network failure while opening a ticket (T34), and scoped report
 * exports with step-up (T41). Every ticket opened here is closed again so reruns stay within the
 * per-workspace open-ticket limit.
 */
const BUYER = 'buyer.procurement@falcon-trading.test';

async function supportBase(page: Page) {
  const me = await (await page.request.get('/api/v1/me')).json();
  const ws = me.data.workspaces.find((w: { kind: string }) => w.kind === 'BUYER');
  return `/en/app/buyer/${ws.id}/support`;
}

/** A code from the next 30 s step: enrolment used the current one and replays are refused. */
const nextCode = (secret: string) =>
  authenticator.clone({ epoch: Date.now() + 30_000 }).generate(secret);

async function closeTicket(page: Page) {
  await press(page.getByRole('button', { name: 'Close ticket' }));
  await press(page.getByRole('dialog').getByRole('button', { name: 'Close ticket' }));
  await expect(page.getByText('This ticket is closed.')).toBeVisible();
}

test('buyer and support agent work a ticket from open to closed', async ({
  page,
  browser,
}, info) => {
  test.setTimeout(120_000);
  await signIn(page, BUYER);
  const base = await supportBase(page);
  await page.goto(base);
  await expect(page.getByRole('heading', { level: 1, name: 'Support' })).toBeVisible();
  await press(page.getByRole('link', { name: 'New ticket' }).first());
  const subject = unique(`Invoice copy ${info.project.name}`);
  const form = page.getByTestId('support-new-form');
  await form.getByLabel('Topic').selectOption('PAYMENT');
  await form.getByLabel('Subject').fill(subject);
  await form.getByLabel('How can we help?').fill('Please send a copy of the tax invoice.');
  await press(form.getByRole('button', { name: 'Open ticket' }));
  await page.waitForURL(/\/support\/[0-9a-f-]{36}$/);
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toContainText('Ticket SUP-');
  const number = (await heading.textContent())!.replace('Ticket ', '').trim();
  const ticketUrl = page.url();

  const ctx = await adminContext(browser);
  const admin = await ctx.newPage();
  await enrolAdmin(admin, createAdmin('SUPPORT'));
  await admin.goto('/en/admin/support');
  await press(admin.getByRole('link', { name: number, exact: true }));
  await press(admin.getByRole('button', { name: 'Take ticket' }));
  await expect(admin.getByTestId('support-reply-form')).toBeVisible();
  await admin.getByTestId('support-reply-form').getByLabel('Reply').fill('Sent to your email.');
  await press(admin.getByRole('button', { name: 'Send reply' }));
  await expect(admin.getByText('Reply sent.')).toBeVisible();
  await expect(admin.getByText('Waiting for customer').first()).toBeVisible();

  await page.goto(ticketUrl);
  await expect(page.getByText('Waiting for you').first()).toBeVisible();
  const thread = page.getByTestId('support-messages');
  await expect(thread).toContainText('Sent to your email.');
  await page.getByTestId('support-reply-form').getByLabel('Reply').fill('Received, thank you.');
  await press(page.getByRole('button', { name: 'Send reply' }));
  await expect(page.getByText('With support').first()).toBeVisible();

  await admin.reload();
  await admin.getByLabel(/Resolution note/).fill('Invoice re-sent.');
  // Wait for the server to record the resolution before closing the admin browser; otherwise a
  // slow engine (webkit) can abort the request when the context closes.
  const resolved = admin.waitForResponse(
    (r) =>
      /\/admin\/support\/[0-9a-f-]{36}\/resolve$/.test(r.url()) && r.request().method() === 'POST',
  );
  await press(admin.getByRole('button', { name: 'Mark resolved' }));
  expect((await resolved).status()).toBe(200);
  await expect(admin.getByText('Resolved').first()).toBeVisible();
  await ctx.close();

  await page.reload();
  await expect(page.getByText(/Support marked this resolved/)).toBeVisible();
  await closeTicket(page);
});

test('T34: a network failure keeps the ticket form and a retry succeeds', async ({
  page,
}, info) => {
  await signIn(page, BUYER);
  const base = await supportBase(page);
  await page.goto(`${base}/new`);
  const form = page.getByTestId('support-new-form');
  const subject = unique(`Retry ${info.project.name}`);
  await form.getByLabel('Subject').fill(subject);
  await form.getByLabel('How can we help?').fill('Network check.');
  let failed = false;
  await page.route('**/api/v1/workspaces/*/support', async (route) => {
    if (route.request().method() === 'POST' && !failed) {
      failed = true;
      return route.abort('internetdisconnected');
    }
    return route.continue();
  });
  await press(form.getByRole('button', { name: 'Open ticket' }));
  await expect(page.getByText('Something went wrong')).toBeVisible();
  await expect(form.getByLabel('Subject')).toHaveValue(subject);
  await expect(form.getByLabel('How can we help?')).toHaveValue('Network check.');
  await press(form.getByRole('button', { name: 'Open ticket' }));
  await page.waitForURL(/\/support\/[0-9a-f-]{36}$/);
  await expect(page.getByRole('heading', { level: 2, name: subject })).toBeVisible();
  await page.unroute('**/api/v1/workspaces/*/support');
  // Exactly one ticket was created by the two attempts.
  await page.goto(base);
  await expect(page.getByTestId('support-tickets').getByText(subject)).toHaveCount(1);
  await press(
    page
      .getByTestId('support-tickets')
      .locator('tr')
      .filter({ hasText: subject })
      .getByRole('link'),
  );
  await closeTicket(page);
});

test('T41: finance exports with step-up; support is refused outside its scope', async ({
  browser,
}, info) => {
  test.skip(info.project.name !== 'chromium', 'admin-only journey; desktop is enough');
  test.setTimeout(120_000);
  const ctx = await adminContext(browser, { acceptDownloads: true });
  const page = await ctx.newPage();
  const { secret } = await enrolAdmin(page, createAdmin('FINANCE'));
  await expect(page.getByTestId('operations')).toBeVisible();
  await expect(page.getByText(/Sandbox data/)).toBeVisible();
  await expect(page.getByTestId('operations')).toContainText('Gross order value');

  await page.goto('/en/admin/reports');
  const form = page.getByTestId('export-form');
  await form.getByLabel('Reason').fill('Month-end reconciliation');
  await form.getByLabel('Authenticator code').fill(nextCode(secret));
  await press(form.getByRole('button', { name: 'Create export' }));
  await expect(page.getByText('Export ready. Download it below.')).toBeVisible();
  const row = page.getByTestId('exports').locator('tbody tr').first();
  await expect(row).toContainText('Orders');
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    row.getByRole('link', { name: 'Download CSV' }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^orders_.*\.csv$/);
  await ctx.close();

  const sctx = await adminContext(browser);
  const sup = await sctx.newPage();
  const s = await enrolAdmin(sup, createAdmin('SUPPORT'));
  await expect(sup.getByText('Commerce figures are shown to finance roles only.')).toBeVisible();
  await sup.goto('/en/admin/reports');
  const sform = sup.getByTestId('export-form');
  await sform.getByLabel('Report').selectOption('orders');
  await sform.getByLabel('Scope').selectOption('all');
  await sform.getByLabel('Reason').fill('Curious');
  await sform.getByLabel('Authenticator code').fill(nextCode(s.secret));
  await press(sform.getByRole('button', { name: 'Create export' }));
  await expect(sup.getByText(/Your role cannot export this report/)).toBeVisible();
  await expect(sup.getByText('You have not exported anything yet.')).toBeVisible();
  await sctx.close();
});
