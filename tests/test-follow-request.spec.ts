import { test, expect, devices } from '@playwright/test';

test.use({
	...devices['iPhone 14 Pro']
});

test.describe('follow-request-flow', () => {
	test.describe('e2e-user-1', () => {
		test.use({
			storageState: 'playwright/.auth/test-user-1.json'
		});

		// create a follow request
		test('test-create-follow-request', async ({ page }) => {
			await page.context().storageState();
			// authenticate with user 1
			await page.goto('http://localhost:8100/home/network');
			await page.getByLabel('Add or Search friends').fill('e2e-user-2');

			// button to create follow request shall be visible
			await expect(page.locator('ion-button').getByRole('button')).toBeVisible();
			await page.locator('ion-item').filter({ hasText: 'e2e-user-2E2E-2 Test-User' }).getByRole('button').click();

			// wait for confirmation message to pop up
			// await expect(page.getByText('Follow request sent!')).toBeVisible();
		});
	});

	test.describe('e2e-user-2', () => {
		test.use({
			storageState: 'playwright/.auth/test-user-2.json'
		});

		// accept the follow request
		test('test-accept-follow-request', async ({ page }) => {
			await page.goto('http://localhost:8100/home/network');

			// green tickbox should be visible
			await expect(page.getByRole('button').first()).toBeVisible();
			// click accept
			await page.getByRole('button').first().click();

			// go to profile
			await page.locator('#tab-button-profile svg').click();
			// expect to have one follower
			await expect(page.getByRole('heading', { name: '1' })).toBeVisible();
			// click on followers
			await page.getByRole('heading', { name: '1' }).click();
			// there should be e2e-user-1
			await expect(page.getByRole('heading', { name: 'e2e-user-1' })).toBeVisible();
		});
	});
});
