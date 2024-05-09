import { test, expect, devices } from '@playwright/test';

test.use({
  storageState: 'playwright/.auth/test-user-with-data.json',
});

test.use({
  ...devices['iPhone 14 Pro'],
});

test('test-edit-own-profile', async ({ page }) => {
  await page.goto('http://localhost:8100/home/profile');
  await page.getByRole('button', { name: 'Edit Profile' }).click();
  await page.getByLabel('First Name').fill('First Name');
  await page.getByLabel('Last Name').fill('Second Name');
  await page.getByLabel('BioChallenge me with your').fill('Changing up Bio for testing');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Changing up Bio for testing')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'First Name Second Name' })).toBeVisible();
});


test('test-view-multiple-other-profiles', async ({ page }) => {
  await page.goto('http://localhost:8100/home/profile');
  // look at own followers
  await page.getByText('followers').click();
  await expect(page.getByRole('heading', { name: 'chrispyb' })).toBeVisible();
  // select chrispyb
  await page.getByRole('heading', { name: 'chrispyb' }).click();
  // verify heading score and followers
  await expect(page.getByRole('heading', { name: 'Christian Bauer' })).toBeVisible();
  await expect(page.locator('ion-chip').filter({ hasText: '3,441' })).toBeVisible();
  await expect(page.getByText('followers').nth(1)).toBeVisible();

  // see who chrispyb is following
  await page.getByText('following').nth(1).click();

  // look at the profile of lachs and verify solved riddles
  await page.getByRole('heading', { name: 'lachs' }).click();
  await expect(page.getByRole('heading', { name: 'Ingmar Schmidt' })).toBeVisible();
  await expect(page.locator('ion-tabs ion-router-outlet').getByRole('tablist').locator('ion-segment-button').filter({ hasText: 'Posts' })).toBeVisible();
  await page.locator('ion-tabs ion-router-outlet').getByRole('tablist').locator('ion-segment-button').filter({ hasText: 'Solved' }).click();
  await expect(page.getByRole('heading', { name: 'chrispyb', exact: true })).toBeVisible();
});
