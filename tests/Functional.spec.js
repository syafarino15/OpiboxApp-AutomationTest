// @ts-check
const { test, expect } = require('@playwright/test');

test('TC02001', async ({ page }) => {
  await page.goto('https://opibox.netlify.app/', { timeout: 60000 });
  await page.locator("//a[normalize-space()='Masuk']").click();
  await page.locator("//input[@id='email']").fill('syafarino010502@gmail.com');
  await page.locator("//input[@id='password']").fill('Password_1');
  await page.locator("//img[@alt='eye']").click();
  await page.locator("//button[normalize-space()='Masuk']").click();

  // Expects page to have a heading with the name of Buat Akun
  await expect(page.getByRole('textbox', { name: 'Cari' })).toBeVisible({ timeout: 60000 });
});

test('TC02002', async ({ page }) => {
  await page.goto('https://opibox.netlify.app/', { timeout: 60000 });
  await page.locator("//a[normalize-space()='Masuk']").click();
  await page.locator("//input[@id='email']").fill('albert123@gmail.com');
  await page.locator("//input[@id='password']").fill('Password_1');
  await page.locator("//img[@alt='eye']").click();
  await page.locator("//button[normalize-space()='Masuk']").click();

  // Expects page to have a heading with the name of Buat Akun
  await expect(page.locator("//p[@class='text-red-500 text-sm']")).toBeVisible({ timeout: 60000 });
});

test('TC02003', async ({ page }) => {
  await page.goto('https://opibox.netlify.app/', { timeout: 60000 });
  await page.locator("//a[normalize-space()='Masuk']").click();
  await page.locator("//input[@id='email']").fill('albert123@gmail.com');
  await page.locator("//input[@id='password']").fill('Password1');
  await page.locator("//img[@alt='eye']").click();

  // Expects page to have a heading with the name of Buat Akun
  await expect(page.locator("//div[@class='error-message text-red-400 text-sm']")).toBeVisible({ timeout: 60000 });
});

test('TC03001', async ({ page }) => {
  await page.goto('https://opibox.netlify.app/', { timeout: 60000 });
  await page.locator("//a[normalize-space()='Masuk']").click();
  await page.locator("//input[@id='email']").fill('albert123@gmail.com');
  await page.locator("//input[@id='password']").fill('Password1');
  await page.locator("//img[@alt='eye']").click();

  // Expects page to have a heading with the name of Buat Akun
  await expect(page.locator("//div[@class='error-message text-red-400 text-sm']")).toBeVisible({ timeout: 60000 });
});