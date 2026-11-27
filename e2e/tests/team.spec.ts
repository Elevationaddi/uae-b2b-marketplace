import { expect, test } from '@playwright/test';
import { emailedLink, PASSWORD, press, relative, signIn, uniqueEmail } from './support/helpers';

test('owner invites a teammate who registers, verifies and joins with the assigned role', async ({
  page,
  browser,
}) => {
  test.slow();
  const invitee = uniqueEmail('invitee');

  await signIn(page, 'buyer.owner@falcon-trading.test');
  await page.getByRole('link', { name: 'Team' }).filter({ visible: true }).click();
  await page.getByLabel('Email').fill(invitee);
  await page.getByLabel('Role', { exact: true }).selectOption('PROCUREMENT');
  await press(page.getByRole('button', { name: 'Send invitation' }));
  await expect(page.getByText(`Invitation sent to ${invitee}.`)).toBeVisible();

  const ctx = await browser.newContext();
  const guest = await ctx.newPage();
  await guest.goto(relative(await emailedLink(invitee, 'en/invitations/accept')));
  await expect(guest.getByText('Falcon Trading')).toBeVisible();
  await guest
    .getByRole('link', { name: 'Create account' })
    .or(guest.getByRole('link', { name: 'Register' }))
    .first()
    .click();
  await guest.getByLabel('Full name').fill('Invited Buyer');
  await guest.getByLabel('Email').fill(invitee);
  await guest.getByLabel('Password').fill(PASSWORD);
  await press(guest.getByRole('button', { name: 'Create account' }));
  await guest.goto(relative(await emailedLink(invitee, 'en/verify-email')));
  await expect(guest.getByText('Your email is verified')).toBeVisible();

  // Same tab: the invitation token was kept for this tab while signing up.
  await guest.goto('/en/login?next=%2Fen%2Finvitations%2Faccept');
  await guest.getByLabel('Email').fill(invitee);
  await guest.getByLabel('Password', { exact: true }).fill(PASSWORD);
  await guest.getByRole('button', { name: 'Sign in' }).click();
  await expect(guest).toHaveURL(/\/en\/invitations\/accept/);
  await press(guest.getByRole('button', { name: 'Accept invitation' }));
  await expect(guest.getByText('You joined the workspace.')).toBeVisible();
  await expect(guest.getByText('Procurement')).toBeVisible();
  await ctx.close();

  // The owner sees the new member.
  await page.reload();
  await expect(page.getByRole('cell', { name: `Invited Buyer ${invitee}` })).toBeVisible();
});

test('the last owner cannot be demoted', async ({ page }) => {
  await signIn(page, 'draft.owner@palm-office.test');
  await page.getByRole('link', { name: 'Team' }).filter({ visible: true }).click();
  const row = page.getByRole('row').filter({ hasText: 'draft.owner@palm-office.test' });
  await row.getByRole('combobox').selectOption('VIEWER');
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm' }).click();
  await expect(page.getByRole('dialog').getByRole('alert')).toBeVisible();
});
