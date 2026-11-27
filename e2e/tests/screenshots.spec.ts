import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import {
  ADMIN,
  createAdmin,
  PASSWORD,
  press,
  registerVerified,
  samplePdf,
  signIn,
  totp,
  unique,
  uniqueEmail,
} from './support/helpers';
import { authenticator } from 'otplib';

/**
 * Captures every Phase 1 screen (EN, plus AR and phone variants of key screens) for review.
 * Run: pnpm test:e2e --project=screenshots. Output: SCREENSHOT_DIR (default e2e/screenshots-out).
 * Uses the dev seed plus freshly created fictional records; nothing is mocked.
 */
const OUT = process.env.SCREENSHOT_DIR ?? resolve(__dirname, '../screenshots-out');
mkdirSync(OUT, { recursive: true });
test.describe.configure({ mode: 'serial' });
let submittedCompany = '';

async function snap(page: Page, name: string, fullPage = true) {
  // Let client-side navigations settle before checking that no loading state remains.
  await page.waitForTimeout(400);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('main h1, main [role="alert"]').first()).toBeVisible();
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
}

async function phone(page: Page, name: string) {
  const size = page.viewportSize()!;
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  // Viewport-sized, so the fixed bottom navigation appears where a phone shows it.
  await snap(page, name, false);
  await page.setViewportSize(size);
}

test('public and authentication screens', async ({ page }) => {
  for (const locale of ['en', 'ar']) {
    await page.goto(`/${locale}`);
    await snap(page, `01-landing-${locale}`);
    await page.goto(`/${locale}/register`);
    await snap(page, `02-register-${locale}`);
    await page.goto(`/${locale}/login`);
    await snap(page, `04-login-${locale}`);
  }
  await page.goto('/en/register');
  await page.getByRole('button', { name: 'Create account' }).click();
  await snap(page, '02b-register-validation-en');
  await page.goto('/en/login');
  await phone(page, '04-login-en-phone');

  const email = uniqueEmail('shot');
  await page.goto('/en/register');
  await page.getByLabel('Full name').fill('Screenshot User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  await snap(page, '03-check-email-en');

  await page.goto('/en/login');
  await page.getByLabel('Email').fill('buyer.owner@falcon-trading.test');
  await page.getByLabel('Password', { exact: true }).fill('wrong-password-123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('alert').first()).toBeVisible();
  await snap(page, '04b-login-error-en');

  await page.goto('/en/verify-email');
  await snap(page, '05-verify-email-missing-token-en');
  await page.goto('/en/forgot-password');
  await snap(page, '06-forgot-password-en');
  await page.getByLabel('Email').fill(email);
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await snap(page, '06b-forgot-password-sent-en');
  await page.goto('/en/reset-password');
  await snap(page, '07-reset-password-missing-token-en');
  await page.goto('/en/invitations/accept');
  await snap(page, '08-invitation-missing-token-en');
});

test('company screens', async ({ page }) => {
  const email = uniqueEmail('shot-owner');
  await registerVerified(page, email, 'Screenshot Owner');
  await snap(page, '05b-verify-email-success-en');
  await signIn(page, email);
  await snap(page, '10-home-no-company-en');
  await page.goto('/ar/app');
  await snap(page, '10-home-no-company-ar');
  await page.goto('/en/app/onboarding');
  await snap(page, '11-onboarding-en');
  await press(page.getByRole('button', { name: 'Register company' }));
  await snap(page, '11b-onboarding-validation-en');
  await page.goto('/ar/app/onboarding');
  await snap(page, '11-onboarding-ar');
  await page.goto('/en/app/onboarding');
  const name = unique('Screenshot Trading');
  await page.getByLabel('Legal name').fill(`${name} LLC (Fictional)`);
  await page.getByLabel('Display name').fill(name);
  await page.getByLabel('Trade licence number').fill(unique('LIC').toUpperCase());
  await page.getByLabel('Licence issuing authority').fill('Fictional Economic Department');
  await page.getByLabel('Licence expiry date').fill('2030-12-31');
  await page.getByLabel('Licensed activity').fill('General trading');
  await page.getByLabel('Company contact email').fill(email);
  await page.getByLabel('Company contact phone').fill('+971501234567');
  await page.getByLabel('Seller').check();
  await press(page.getByRole('button', { name: 'Register company' }));
  await expect(page.getByRole('heading', { name })).toBeVisible();
  await snap(page, '12-company-draft-en');
  await press(page.getByRole('button', { name: 'Edit details' }));
  await snap(page, '12b-company-edit-en');
  await page.reload();
  await page.getByLabel('File').setInputFiles({
    name: 'eicar.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from(
      '%PDF-1.4\nX5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*\n%%EOF',
    ),
  });
  await press(page.getByRole('button', { name: 'Upload document' }));
  await expect(page.getByText('eicar.pdf').or(page.getByRole('alert')).first()).toBeVisible();
  await snap(page, '12c-company-upload-blocked-file-en');
  const companyUrl = page.url();
  await page.goto(page.url().replace('/en/', '/ar/'));
  await snap(page, '12-company-draft-ar');
  await phone(page, '12-company-draft-ar-phone');
  await page.getByRole('link', { name: 'الفريق' }).filter({ visible: true }).click();
  await snap(page, '13-team-owner-ar');
  await page.goto('/en/app/settings');
  await snap(page, '14-settings-en');
  await phone(page, '14-settings-en-phone');

  // Replace the blocked file with clean documents and submit, for the admin review screens.
  await page.goto(companyUrl);
  await expect(page.getByRole('button', { name: 'Upload document' })).toBeVisible();
  const blocked = page.getByRole('listitem').filter({ hasText: 'eicar.pdf' });
  if (await blocked.count()) {
    await press(blocked.getByRole('button', { name: 'Remove' }));
    await page.getByRole('dialog').getByRole('button', { name: 'Remove' }).click();
    await expect(page.getByText('eicar.pdf')).toHaveCount(0);
  }
  for (const [type, file] of [
    ['TRADE_LICENCE', 'licence.pdf'],
    ['AUTHORIZED_REPRESENTATIVE', 'representative.pdf'],
  ] as const) {
    await page.getByLabel('Document type').selectOption(type);
    await page.getByLabel('File').setInputFiles(samplePdf(file));
    await press(page.getByRole('button', { name: 'Upload document' }));
    await expect(page.getByText(file)).toBeVisible();
  }
  await page.getByLabel(/I confirm the information is accurate/).check();
  await press(page.getByRole('button', { name: 'Submit for verification' }));
  await expect(page.locator('.page-header [data-status="SUBMITTED"]')).toBeVisible();
  await snap(page, '12d-company-submitted-en');
  submittedCompany = name;
});

test('approved, read-only, isolation and unverified states', async ({ page, browser }) => {
  await signIn(page, 'buyer.owner@falcon-trading.test');
  await snap(page, '15-home-approved-en');
  await page.getByRole('link', { name: 'Open company' }).click();
  await snap(page, '16-company-approved-en');
  await page.getByRole('link', { name: 'Team' }).filter({ visible: true }).click();
  await expect(page.getByRole('row').nth(1)).toBeVisible();
  await snap(page, '17-team-owner-en');
  await phone(page, '17-team-owner-en-phone');
  const companyUrl = page.url().replace(/team\/.*/, '');

  const viewer = await browser.newPage();
  await signIn(viewer, 'buyer.viewer@falcon-trading.test');
  await viewer.getByRole('link', { name: 'Team' }).filter({ visible: true }).click();
  await snap(viewer, '18-team-viewer-read-only-en');
  await viewer.close();

  const dual = await browser.newPage();
  await signIn(dual, 'dual.owner@oasis-textiles.test');
  await snap(dual, '19-home-dual-workspaces-en');
  await dual.goto(`${companyUrl}company/00000000-0000-4000-8000-000000000000`);
  await snap(dual, '20-not-found-en');
  await dual.close();

  const unverified = await browser.newPage();
  await signIn(unverified, 'unverified@example.test');
  await snap(unverified, '21-unverified-notice-en');
  await unverified.close();
});

test('admin screens', async ({ browser }) => {
  const ctx = await browser.newContext({
    baseURL: ADMIN,
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto('/en/admin/login');
  await snap(page, '30-admin-login-en');
  await page.goto('/ar/admin/login');
  await snap(page, '30-admin-login-ar');

  const compliance = createAdmin('COMPLIANCE');
  await page.goto('/en/admin/login');
  await page.getByLabel('Email').fill(compliance);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByTestId('mfa-secret')).toBeVisible();
  // The secret shown on the enrolment screen is a fresh random one for a throwaway E2E admin.
  await snap(page, '31-admin-mfa-enrol-en');
  const secret = (await page.getByTestId('mfa-secret').textContent())!.trim();
  await page.getByLabel('6-digit code').fill(authenticator.generate(secret));
  await page.getByRole('button', { name: 'Confirm and continue' }).click();
  await expect(page.getByTestId('recovery-codes')).toBeVisible();
  await snap(page, '32-admin-recovery-codes-en');
  await page.getByRole('button', { name: /saved/i }).click();
  await expect(page.locator('.kpis')).toBeVisible();
  await snap(page, '34-admin-overview-en');
  await page.goto('/ar/admin');
  await snap(page, '34-admin-overview-ar');
  await page.goto('/en/admin/verification');
  await snap(page, '35-admin-verification-queue-en');
  await page.getByRole('link', { name: submittedCompany }).click();
  await snap(page, '36-admin-case-submitted-en');
  await page.getByRole('button', { name: 'Start review' }).click();
  await expect(page.getByRole('heading', { name: 'Decision', exact: true })).toBeVisible();
  await page
    .getByLabel('Request more information')
    .check()
    .catch(() => undefined);
  await page
    .getByLabel('Reason')
    .fill('Please upload a clearer copy of page 2 of the trade licence.');
  await snap(page, '37-admin-case-decision-en');
  await page.getByRole('button', { name: 'Record decision' }).click();
  await snap(page, '37b-admin-decision-confirm-en');
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
  await page.goto('/en/admin/companies');
  await snap(page, '38-admin-companies-en');
  await page.getByLabel('Name or licence number').fill('Falcon');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('link', { name: 'Falcon Trading' }).click();
  await snap(page, '39-admin-company-detail-en');
  await page.getByRole('button', { name: 'Suspend company' }).click();
  await snap(page, '39b-admin-suspend-dialog-en');
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
  await page.goto('/en/admin/users');
  await snap(page, '40-admin-users-en');
  await page.goto('/en/admin/staff');
  await snap(page, '41-admin-forbidden-staff-for-compliance-en');

  await page.getByRole('button', { name: 'Sign out' }).click();
  await page.getByLabel('Email').fill(compliance);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByLabel('6-digit code')).toBeVisible();
  await snap(page, '33-admin-mfa-verify-en');

  const superCtx = await browser.newContext({
    baseURL: ADMIN,
    deviceScaleFactor: 2,
    viewport: { width: 1280, height: 900 },
  });
  const su = await superCtx.newPage();
  const superEmail = createAdmin('SUPER_ADMIN');
  await su.goto('/en/admin/login');
  await su.getByLabel('Email').fill(superEmail);
  await su.getByLabel('Password').fill(PASSWORD);
  await su.getByRole('button', { name: 'Sign in' }).click();
  const s2 = (await su.getByTestId('mfa-secret').textContent())!.trim();
  await su.getByLabel('6-digit code').fill(totp(s2));
  await su.getByRole('button', { name: 'Confirm and continue' }).click();
  await su.getByRole('button', { name: /saved/i }).click();
  await su.goto('/en/admin/audit');
  await snap(su, '42-admin-audit-en');
  await su.goto('/en/admin/staff');
  await snap(su, '43-admin-staff-en');
  await su.getByRole('button', { name: 'Edit roles' }).first().click();
  await snap(su, '43b-admin-staff-roles-dialog-en');
  await su.setViewportSize({ width: 390, height: 844 });
  await su.goto('/en/admin/audit');
  await snap(su, '42-admin-audit-en-phone', false);
  await superCtx.close();
  await ctx.close();
});
