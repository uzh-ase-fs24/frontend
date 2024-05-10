import { test, expect, devices } from '@playwright/test';

test.use({
  // camera mocking does not work with iPhone which is why Chrome has to be used here
  ...devices['Desktop Chrome'],
  storageState: 'playwright/.auth/test-user-with-data.json',
  permissions: ['geolocation', 'camera'],
  // Use fake camera to post location riddle
  launchOptions: {
    args: ['--disable-web-security',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream'
    ],
  },
  geolocation: { latitude: 47.3769, longitude: 8.5417 },
});
test.describe('location-riddle-flow', () => {
    test('test-location-riddle-post', async ({ page }) => {
        await page.goto('http://localhost:8100/home/post');
        // click shutter button
        await page.locator('.shutter-button').click();

        // select picture
        await page.locator('img').nth(2).click();

        // select location on map
        await page.locator('canvas').click({
          position: {
            x: 577,
            y: 282
          }
        });
        // select arenas
        await page.getByText('Select all arenas that apply').click();
        await page.getByRole('checkbox', { name: 'UZH' }).click();
        await page.getByRole('checkbox', { name: 'Lake' }).click();
        await page.getByRole('checkbox', { name: 'Zurich' }).click();

        // click okay
        await page.getByRole('button', { name: 'OK' }).click();

        // post location riddle
        await page.getByText('Post Riddle').click();

        // verify the successfull upload
        await expect(page.getByText('Post uploaded successfully')).toBeVisible();
    });


  test.describe('test-location-riddle-interaction', () => {
    test.use({
      storageState: 'playwright/.auth/test-user-with-data.json',
    });

    test('test-view-map-and-comment', async ({ page }) => {
        await page.goto('http://localhost:8100/home/feed');
        // click the map icon
        await page.locator('ion-card').filter({ hasText: 'flyingbeat4/24/24, 9:41 AMadd' }).locator('ion-fab-button').getByRole('img').nth(1).click();
        // verify that map is visible
        await expect(page.locator('canvas')).toBeVisible();
        // click on add a comment
        await page.getByText('add a comment...').nth(1).click();
        // add a comment
        await page.getByLabel('', { exact: true }).fill('honestly, I think this was a bit hard');
        // submit comment
        await page.locator('div').filter({ hasText: 'CommentslachsI was there' }).getByRole('button').click();
        // verify that comment is there
        await expect(page.getByText('honestly, I think this was a')).toBeVisible();
    });
  })

})

