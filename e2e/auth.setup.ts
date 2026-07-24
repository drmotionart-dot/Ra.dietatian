import { test as setup, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';
const authFile = 'e2e/.auth/user.json';
const email = 'e2e_auth_' + Date.now() + '@test.com';
const password = 'TestPass123!';

setup('authenticate', async ({ page }) => {
  // Register
  await page.goto(BASE + '/en/register');
  await page.waitForSelector('#name', { timeout: 15000 });
  await page.fill('#name', 'E2E Auth User');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.fill('#confirmPassword', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/en/login', { timeout: 10000 });

  // Login
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/en/dashboard', { timeout: 15000 });

  // Save session
  await page.context().storageState({ path: authFile });
});
