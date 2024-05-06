import { test, expect, devices } from '@playwright/test';

test.use({
  // camera mocking does not work with iPhone which is why Chrome has to be used here
  ...devices['Desktop Chrome'],
  storageState: 'playwright/.auth/user.json',
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


test('test-location-riddle-post', async ({ page }) => {
  // Go to the specific page
  await page.goto('http://localhost:8100/home/post');

  // Interaction to open and use the camera
  await page.getByText('Open Camera').click();
  await page.locator('.shutter-button').click();

  // Interactions with image and canvas elements
  await page.locator('img').nth(2).click();
  await page.locator('canvas').click({
    position: {
      x: 298,
      y: 296
    }
  });

  // Interacting with text and checkbox for form completion
  await page.getByText('Select all arenas that apply').click();
  await page.getByRole('checkbox', { name: 'UZH' }).click();
  await page.getByRole('button', { name: 'OK' }).click();

  // Final action to post the riddle
  await page.getByText('Post Riddle').click();
});
