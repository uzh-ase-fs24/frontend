import { test, expect, devices } from '@playwright/test';


test('test-edit-user', async ({ page }) => {
  await page.goto('http://localhost:8100/home/profile');
  await page.getByRole('button', { name: 'Edit Profile' }).click();
  await page.getByLabel('First Name').fill('Test');
  await page.getByLabel('Last Name').fill('User');
  await page.getByLabel('Bio').fill('Changing up the bio because we are cool!');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('ion-content')).toContainText('Test User');
  await expect(page.locator('ion-content')).toContainText('Changing up the bio because we are cool!');
});
