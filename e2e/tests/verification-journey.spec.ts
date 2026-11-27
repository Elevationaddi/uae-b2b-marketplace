import { expect, test } from '@playwright/test';
import {
  adminContext,
  createAdmin,
  emailedLink,
  enrolAdmin,
  PASSWORD,
  samplePdf,
  signIn,
  unique,
  uniqueEmail,
  press,
} from './support/helpers';

/**
 * Main Phase 1 journey against the real API, database, storage, worker and mail catcher:
 * register -> verify email (link from Mailpit) -> sign in -> register company -> upload documents
 * -> submit -> compliance admin (separate origin, TOTP) reviews and approves -> company approved.
 */
test('company verification journey end to end', async ({ page, browser }, testInfo) => {
  test.slow();
  const email = uniqueEmail('owner');
  const companyName = unique('Journey Co');
  const licence = unique('LIC').toUpperCase();

  await test.step('register and see the check-email state', async () => {
    await page.goto('/en/register');
    await page.getByLabel('Full name').fill('Journey Owner');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(PASSWORD);
    await press(page.getByRole('button', { name: 'Create account' }));
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  });

  await test.step('verify email with the emailed link', async () => {
    const link = await emailedLink(email, 'en/verify-email');
    await page.goto(link.replace(/^https?:\/\/[^/]+/, ''));
    await expect(page.getByText('Your email is verified')).toBeVisible();
    // The one-time token is removed from the address bar after use.
    expect(page.url()).not.toContain('token=');
  });

  await test.step('sign in and register the company', async () => {
    await signIn(page, email);
    await page.getByRole('link', { name: 'Register a company' }).click();
    await page.getByLabel('Legal name').fill(`${companyName} LLC (Fictional)`);
    await page.getByLabel('Display name').fill(companyName);
    await page.getByLabel('Trade licence number').fill(licence);
    await page.getByLabel('Licence issuing authority').fill('Fictional Economic Department');
    await page.getByLabel('Licence expiry date').fill('2030-12-31');
    await page.getByLabel('Licensed activity').fill('General trading');
    await page.getByLabel('Company contact email').fill(email);
    await page.getByLabel('Company contact phone').fill('+971501234567');
    await press(page.getByRole('button', { name: 'Register company' }));
    await expect(page.getByRole('heading', { name: companyName })).toBeVisible();
  });

  await test.step('upload documents and submit for verification', async () => {
    await page.getByLabel('Document type').selectOption('TRADE_LICENCE');
    await page.getByLabel('File').setInputFiles(samplePdf('licence.pdf'));
    await press(page.getByRole('button', { name: 'Upload document' }));
    await expect(page.getByText('licence.pdf')).toBeVisible();
    await page.getByLabel('Document type').selectOption('AUTHORIZED_REPRESENTATIVE');
    await page.getByLabel('File').setInputFiles(samplePdf('representative.pdf'));
    await press(page.getByRole('button', { name: 'Upload document' }));
    await expect(page.getByText('representative.pdf')).toBeVisible();
    await page.getByLabel(/I confirm the information is accurate/).check();
    await press(page.getByRole('button', { name: 'Submit for verification' }));
    await expect(page.locator('[data-status="SUBMITTED"]').first()).toBeVisible();
  });

  await test.step('compliance admin approves on the admin origin with TOTP', async () => {
    const adminEmail = createAdmin('COMPLIANCE');
    const ctx = await adminContext(browser, {
      viewport: testInfo.project.use.viewport ?? undefined,
    });
    const admin = await ctx.newPage();
    await enrolAdmin(admin, adminEmail);
    await admin.getByRole('link', { name: 'Verification', exact: true }).first().click();
    await admin.getByRole('link', { name: companyName }).click();
    await press(admin.getByRole('button', { name: 'Start review' }));
    await admin.getByLabel('Approve').check();
    await press(admin.getByRole('button', { name: 'Record decision' }));
    await admin.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click();
    await expect(admin.getByText('Decision recorded')).toBeVisible();
    await ctx.close();
  });

  await test.step('company sees the approval', async () => {
    await page.reload();
    await expect(page.locator('.page-header [data-status="APPROVED"]')).toBeVisible();
  });
});
