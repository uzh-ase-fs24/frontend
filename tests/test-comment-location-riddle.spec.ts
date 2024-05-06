import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 14 Pro'],
});

test('test-comment-location-riddle', async ({ page }) => {
  await page.goto('http://localhost:8100/home/feed');
  await page.getByText('add a comment...').first().click();
  await page.getByLabel('', { exact: true }).fill('I am also writing a comment because I like his riddle');
  await expect(page.getByText('I am also writing a comment')).toBeVisible();
  await page.locator('#ion-overlay-2 ion-backdrop').click();
  await expect(page.locator('ion-content > ion-item > .item-native > .item-inner > .input-wrapper').first()).toBeHidden();
});
