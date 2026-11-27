import { expect, test } from '@playwright/test';
import {
  adminContext,
  createAdmin,
  emailedLink,
  enrolAdmin,
  PASSWORD,
  registerVerified,
  relative,
  signIn,
  uniqueEmail,
  press,
} from './support/helpers';

test('password reset with an emailed one-time link signs out other sessions', async ({
  page,
  browser,
}) => {
  const email = uniqueEmail('reset');
  await registerVerified(page, email);
  // A second, already signed-in session that must be revoked by the reset.
  const other = await browser.newPage();
  await signIn(other, email);

  await page.goto('/en/login');
  await page.getByRole('link', { name: 'Forgot your password?' }).click();
  await expect(page.getByRole('heading', { name: 'Reset your password' })).toBeVisible();
  await page.getByLabel('Email').fill(email);
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByText('If the email matches an account')).toBeVisible();

  const link = await emailedLink(email, 'en/reset-password');
  await page.goto(relative(link));
  const newPassword = `${PASSWORD}-new`;
  await page.getByLabel('New password').fill(newPassword);
  await page.getByRole('button', { name: 'Set new password' }).click();
  await expect(page.getByText('Your password was changed')).toBeVisible();

  // The link is single-use.
  await page.goto('/en/login');
  await page.goto(relative(link));
  await page.getByLabel('New password').fill(`${PASSWORD}-again`);
  await page.getByRole('button', { name: 'Set new password' }).click();
  await expect(
    page
      .getByRole('alert')
      .filter({ hasText: /invalid|expired/i })
      .first(),
  ).toBeVisible();

  // Old password fails, new one works, and the other session was revoked.
  await page.goto('/en/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('The email or password is incorrect.')).toBeVisible();
  await signIn(page, email, newPassword);
  await other.goto('/en/app/settings');
  await expect(other).toHaveURL(/\/en\/login/);
  await other.close();
});

test('a user can sign out other sessions from settings', async ({ page, browser }) => {
  const email = uniqueEmail('sessions');
  await registerVerified(page, email);
  const other = await browser.newPage();
  await signIn(other, email);
  await signIn(page, email);
  await page.goto('/en/app/settings');
  await press(page.getByRole('button', { name: 'Sign out all other sessions' }));
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByRole('button', { name: 'Sign out all other sessions' })).toHaveCount(0);
  await other.goto('/en/app');
  await expect(other).toHaveURL(/\/en\/login/);
  await other.close();
});

test('unverified users are held at the verification notice', async ({ page }) => {
  await signIn(page, 'unverified@example.test');
  await expect(page.getByRole('heading', { name: 'Verify your email to continue' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register a company' })).toHaveCount(0);
});

test('admin sign-in requires TOTP; a recovery code works once', async ({ browser }) => {
  const email = createAdmin('COMPLIANCE');
  const ctx = await adminContext(browser);
  const page = await ctx.newPage();
  const { recovery } = await enrolAdmin(page, email);
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/en\/admin\/login/);

  const signInWithRecovery = async () => {
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/en\/admin\/mfa/);
    // Without completing MFA no admin page loads.
    await page.goto('/en/admin/companies');
    await expect(page).toHaveURL(/\/en\/admin\/mfa/);
    await page.getByRole('button', { name: 'Use a recovery code instead' }).click();
    await page.getByLabel('Recovery code').fill(recovery[0]!);
    await page.getByRole('button', { name: 'Verify' }).click();
  };
  await signInWithRecovery();
  await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();

  await page.getByRole('button', { name: 'Sign out' }).click();
  await signInWithRecovery();
  await expect(page.getByText(/code is not valid|incorrect|invalid/i).first()).toBeVisible();
  await ctx.close();
});
