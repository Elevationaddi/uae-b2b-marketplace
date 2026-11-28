import { expect, type Browser, type Page } from '@playwright/test';
import { addToCart, buyerBase, ensureAddress, placeOrder } from './commerce';
import { adminContext, createAdmin, enrolAdmin, press, samplePdf, signIn } from './helpers';

/**
 * Phase 5 journey against the real stack and dev seed (fictional companies only):
 * paid order → supplier records dispatch and delivery with proof → buyer confirms receipt and
 * reviews → buyer opens a dispute → support closes it with no action → finance requests a partial
 * refund and a second finance user approves → labelled SANDBOX provider confirms → finance pays
 * the supplier out with dual approval → supplier sees the payout. No live provider is involved.
 */
// The owner holds seller.inventory.ship; the seeded sales user does not (role matrix).
export const SELLER = 'seller.owner@desert-pack.test';
export const BUYER = 'buyer.procurement@falcon-trading.test';

async function admin(browser: Browser, role: Parameters<typeof createAdmin>[0]) {
  const ctx = await adminContext(browser);
  const page = await ctx.newPage();
  await enrolAdmin(page, createAdmin(role));
  return { ctx, page };
}

async function sellerOrder(page: Page, orderNumber: string) {
  await page.getByRole('link', { name: 'Seller centre' }).first().click();
  await page.getByRole('link', { name: 'Orders' }).first().click();
  await press(page.getByTestId('orders').getByRole('link', { name: orderNumber }));
  await expect(page.getByRole('heading', { level: 1 })).toContainText(orderNumber);
}

export async function fulfilmentJourney(page: Page, browser: Browser) {
  // Paid order.
  await signIn(page, BUYER);
  const base = await buyerBase(page);
  await ensureAddress(page, base);
  await addToCart(page);
  await placeOrder(page, base);
  await press(page.getByRole('button', { name: 'Simulate successful payment' }));
  await page.waitForURL(/\/checkouts\//);
  await expect(page.getByText('Payment confirmed')).toBeVisible({ timeout: 60_000 });
  const link = page.getByTestId('checkout-orders').getByRole('link').first();
  const orderNumber = (await link.textContent())!.trim();
  await press(link);
  await page.waitForURL(/\/orders\//);
  const orderUrl = page.url();
  const orderId = orderUrl.split('/').pop()!;
  // The buyer has no seller actions and cannot confirm before dispatch.
  await expect(page.getByTestId('fulfilment')).toContainText('Not dispatched yet.');
  await expect(page.getByRole('button', { name: 'Confirm receipt' })).toHaveCount(0);
  await expect(page.getByTestId('dispatch-form')).toHaveCount(0);

  // Supplier: dispatch, then delivery with proof.
  const sellerCtx = await browser.newContext();
  const sp = await sellerCtx.newPage();
  await signIn(sp, SELLER);
  await sellerOrder(sp, orderNumber);
  const dispatch = sp.getByTestId('dispatch-form');
  await dispatch.getByLabel('Carrier').fill('Emirates Test Freight');
  await dispatch.getByLabel(/Tracking reference/).fill('ETF-20261201');
  await press(dispatch.getByRole('button', { name: 'Record dispatch' }));
  await expect(sp.locator('[data-status="DISPATCHED"]').first()).toBeVisible();
  const deliver = sp.getByTestId('deliver-form');
  await deliver.getByLabel('Delivery note').fill('Received by the warehouse desk.');
  await deliver.getByLabel(/Proof of delivery/).setInputFiles(samplePdf('pod.pdf'));
  await press(deliver.getByRole('button', { name: 'Report delivery' }));
  await expect(sp.locator('[data-status="DELIVERED"]').first()).toBeVisible();
  await expect(sp.getByRole('button', { name: 'Confirm receipt' })).toHaveCount(0);

  // Buyer: confirm receipt, review, open a dispute.
  await page.reload();
  await expect(page.getByRole('link', { name: 'Download proof' })).toBeVisible();
  await press(page.getByRole('button', { name: 'Confirm receipt' }));
  await press(page.getByRole('dialog').getByRole('button', { name: 'Confirm receipt' }));
  await expect(page.locator('[data-status="COMPLETED"]').first()).toBeVisible();
  const review = page.getByTestId('review-form');
  await review.getByLabel('Rating').selectOption('4');
  await review.getByLabel('Comment').fill('Cartons arrived well packed and on time.');
  await press(review.getByRole('button', { name: 'Submit review' }));
  await expect(page.getByTestId('own-review')).toContainText('Cartons arrived well packed');
  const disputeForm = page.getByTestId('dispute-form');
  await disputeForm.locator('summary').click();
  await disputeForm.getByLabel('Problem').selectOption('QUANTITY_SHORT');
  await disputeForm.getByLabel('What happened?').fill('Two cartons were missing from the pallet.');
  await press(disputeForm.getByRole('button', { name: 'Open a dispute' }));
  await page.waitForURL(/\/disputes\//);
  const disputeNumber = (await page.getByRole('heading', { level: 1 }).textContent())!
    .replace('Dispute', '')
    .trim();
  expect(disputeNumber).toMatch(/^DSP-/);
  const msg = page.getByTestId('dispute-message-form');
  await msg.getByLabel('Message').fill('Photo of the pallet attached.');
  await msg.getByLabel(/Evidence/).setInputFiles(samplePdf('pallet.pdf'));
  await press(msg.getByRole('button', { name: 'Send' }));
  await expect(page.getByTestId('dispute-messages')).toContainText('pallet.pdf');

  // Supplier sees the dispute and the hold.
  await sp.reload();
  await expect(sp.getByTestId('dispute-link')).toBeVisible();
  await expect(sp.getByTestId('fulfilment')).toContainText('Held (dispute)');

  // Support: assign, propose no action, close.
  const support = await admin(browser, 'SUPPORT');
  await support.page.goto('/en/admin/disputes');
  await press(support.page.getByTestId('disputes').getByRole('link', { name: disputeNumber }));
  await press(support.page.getByRole('button', { name: 'Assign to me' }));
  const propose = support.page.getByTestId('propose-form');
  await propose
    .getByLabel('Note to both parties')
    .fill('Short by two cartons; handled by a credit.');
  await press(propose.getByRole('button', { name: 'Propose resolution' }));
  await expect(support.page.locator('[data-status="RESOLUTION_PROPOSED"]').first()).toBeVisible();
  await support.page
    .getByLabel('Resolution', { exact: true })
    .fill('Closed; finance issues a partial credit.');
  await press(support.page.getByRole('button', { name: 'Close dispute' }));
  await expect(support.page.locator('[data-status="CLOSED"]').first()).toBeVisible();
  await support.ctx.close();

  // Finance requests a partial refund; a second finance user approves; the sandbox confirms.
  const finance = await admin(browser, 'FINANCE');
  const approver = await admin(browser, 'FINANCE_APPROVER');
  await finance.page.goto('/en/admin/refunds');
  await expect(finance.page.getByTestId('sandbox-notice')).toBeVisible();
  const rf = finance.page.getByTestId('refund-form');
  await rf.getByLabel('Order ID').fill(orderId);
  await rf.getByLabel('Amount (AED)').fill('20.00');
  await rf.getByLabel('Reason').fill('Credit for two missing cartons');
  await press(rf.getByRole('button', { name: 'Request a refund' }));
  await expect(finance.page.getByText('Refund requested.')).toBeVisible();
  const row = finance.page.getByTestId('refunds').getByRole('row').nth(1);
  await expect(row).toContainText('another finance user must decide');
  await approver.page.goto('/en/admin/refunds');
  const arow = approver.page.getByTestId('refunds').getByRole('row').nth(1);
  await press(arow.getByRole('button', { name: 'Approve' }));
  await approver.page
    .getByRole('dialog')
    .getByLabel('Reason for the decision')
    .fill('Matches dispute');
  await press(approver.page.getByRole('dialog').getByRole('button', { name: 'Approve' }));
  // The worker sends the approved refund to the sandbox provider.
  await expect(async () => {
    await finance.page.reload();
    await expect(row.getByTestId('sandbox-ops')).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });
  await press(row.getByRole('button', { name: 'Simulate provider success' }));
  await expect(async () => {
    await finance.page.reload();
    await expect(row.locator('[data-status="SUCCEEDED"]')).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });

  // Payout with dual approval; paid only on the provider confirmation.
  await finance.page.goto('/en/admin/payouts');
  const elig = finance.page.getByTestId('payout-eligible').getByRole('row', { name: /Desert/ });
  await press(elig.getByRole('button', { name: 'Request payout' }));
  await press(finance.page.getByRole('dialog').getByRole('button', { name: 'Request payout' }));
  const prow = finance.page.getByTestId('payouts').getByRole('row').nth(1);
  await expect(prow.locator('[data-status="REQUESTED"]')).toBeVisible();
  await approver.page.goto('/en/admin/payouts');
  const aprow = approver.page.getByTestId('payouts').getByRole('row').nth(1);
  await press(aprow.getByRole('button', { name: 'Approve' }));
  await approver.page.getByRole('dialog').getByLabel('Reason for the decision').fill('Checked');
  await press(approver.page.getByRole('dialog').getByRole('button', { name: 'Approve' }));
  await expect(async () => {
    await finance.page.reload();
    await expect(prow.getByTestId('sandbox-ops')).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });
  await press(prow.getByRole('button', { name: 'Simulate provider success' }));
  await expect(async () => {
    await finance.page.reload();
    await expect(prow.locator('[data-status="PAID"]')).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });
  await finance.ctx.close();
  await approver.ctx.close();

  // Supplier finance shows the payout; the order is paid out and no longer disputable.
  await sp.getByRole('link', { name: 'Finance', exact: true }).first().click();
  await expect(sp.getByTestId('seller-payouts')).toContainText('Paid by provider');
  await page.goto(orderUrl);
  await expect(page.getByTestId('dispute-form')).toHaveCount(0);
  await sellerCtx.close();
}
