import {test} from '@playwright/test';

const authFile1 = 'playwright/.auth/test-user-1.json';
const authFile2 = 'playwright/.auth/test-user-2.json';
const authFile3 = 'playwright/.auth/test-user-with-data.json';

test.describe('authenticate-users', () => {
  test('authenticate-user-1', async ({page}) => {
    await page.goto('http://localhost:8100/');
    await page.getByLabel('Username or email address*').fill('e2e-1@find-me.click');
    await page.getByLabel('Password*').fill('Password123');
    await page.getByRole('button', {name: 'Continue'}).click();
    await page.getByRole('button').nth(1).click();

    await page.context().storageState({path: authFile1});
  });

  test('authenticate-user-2', async ({page}) => {
    await page.goto('http://localhost:8100/');
    await page.getByLabel('Username or email address*').fill('e2e-2@find-me.click');
    await page.getByLabel('Password*').fill('Password123');
    await page.getByRole('button', {name: 'Continue'}).click();
    await page.getByRole('button').nth(1).click();

    await page.context().storageState({path: authFile2});
  });

  test('authenticate-user-with-data', async ({page}) => {
    await page.goto('http://localhost:8100/');
    await page.getByLabel('Username or email address*').fill('valentin.hollenstein@uzh.ch');
    await page.getByLabel('Password*').fill('Password123');
    await page.getByRole('button', {name: 'Continue'}).click();
    await page.getByRole('button').nth(1).click();

    await page.context().storageState({path: authFile3});
  });
});
