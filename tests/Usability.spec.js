// @ts-check
const { test, expect } = require('@playwright/test');

test('usability test-Login', async ({ page }) => {
  await page.goto('https://opibox.netlify.app/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Masuk' }).click();
  // Expects page to have a heading with the name of Buat Akun
  await expect(page.getByRole('heading', { name: 'Masuk' })).toBeVisible();
});
