import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['iPhone 14 Pro'],
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:8100/home/search');
  await page.locator('label div').nth(2).click();
  await page.getByLabel('Search User').fill('chris');
  await expect(page.getByRole('heading')).toContainText('chrispyb');
  await page.getByLabel('reset').click();
});
