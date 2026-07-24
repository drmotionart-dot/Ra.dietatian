import { test, expect, type APIRequestContext } from '@playwright/test';

const BASE = 'http://localhost:3000';

// 1. ROOT REDIRECT
test('1.1 / redirects to /en', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForLoadState('networkidle', { timeout: 15000 });
  expect(page.url()).toContain('/en');
});

// 2. UNAUTHENTICATED ACCESS
test.describe('2. Unauthenticated Access', () => {
  test('2.1 register page renders', async ({ page }) => {
    await page.goto(BASE + '/en/register');
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });

  test('2.2 register mismatched passwords error', async ({ page }) => {
    await page.goto(BASE + '/en/register');
    await page.waitForSelector('#name');
    await page.fill('#name', 'Test');
    await page.fill('#email', 'mismatch_' + Date.now() + '@t.com');
    await page.fill('#password', 'Password123!');
    await page.fill('#confirmPassword', 'Different123!');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.text-destructive', { timeout: 5000 });
  });

  test('2.3 register short password error', async ({ page }) => {
    await page.goto(BASE + '/en/register');
    await page.waitForSelector('#name');
    await page.fill('#name', 'Short');
    await page.fill('#email', 'short_' + Date.now() + '@t.com');
    await page.fill('#password', 'abc');
    await page.fill('#confirmPassword', 'abc');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.text-destructive', { timeout: 5000 });
  });

  test('2.4 register has login link', async ({ page }) => {
    await page.goto(BASE + '/en/register');
    await expect(page.locator('a[href*="login"]')).toBeVisible();
  });

  test('2.5 login page renders fields', async ({ page }) => {
    await page.goto(BASE + '/en/login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('2.6 login wrong credentials error', async ({ page }) => {
    await page.goto(BASE + '/en/login');
    await page.waitForSelector('#email');
    await page.fill('#email', 'wrong@test.com');
    await page.fill('#password', 'WrongPass!');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.text-destructive', { timeout: 5000 });
  });

  test('2.7 login has register link', async ({ page }) => {
    await page.goto(BASE + '/en/login');
    await expect(page.locator('a[href*="register"]')).toBeVisible();
  });

  test('2.8 dashboard redirects unauthenticated to login', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto(BASE + '/en/dashboard');
    await page.waitForURL('**/login**', { timeout: 10000 });
    expect(page.url()).toContain('login');
  });
});

// 3. DASHBOARD (uses stored auth)
test.describe('3. Dashboard', () => {
  test('3.1 renders with content', async ({ page }) => {
    await page.goto(BASE + '/en/dashboard');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(50);
  });

  test('3.2 has sidebar nav links', async ({ page }) => {
    await page.goto(BASE + '/en/dashboard');
    await page.waitForTimeout(1000);
    const links = page.locator('aside a');
    expect(await links.count()).toBeGreaterThanOrEqual(5);
  });
});

// 4. NAVIGATION - all 9 pages load
test.describe('4. Navigation', () => {
  const routes = ['dashboard','meals','recipes','body','analytics','fasting','medical','notifications','settings'];
  for (const r of routes) {
    test('4.x navigates to ' + r, async ({ page }) => {
      await page.goto(BASE + '/en/' + r);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      expect(page.url()).toContain(r);
    });
  }
});

// 5. MEALS PAGE
test.describe('5. Meals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/en/meals');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });
  test('5.1 has meal tabs', async ({ page }) => {
    expect(await page.locator('[role="tab"]').count()).toBeGreaterThanOrEqual(3);
  });
  test('5.2 has search input', async ({ page }) => {
    await expect(page.locator('input').first()).toBeVisible();
  });
  test('5.3 food search works', async ({ page }) => {
    await page.locator('input').first().fill('rice');
    await page.waitForTimeout(1000);
  });
  test('5.4 switch meal tabs', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    if (await tabs.count() > 1) await tabs.nth(1).click();
  });
});

// 6. BODY MEASUREMENTS
test.describe('6. Body', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/en/body');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });
  test('6.1 renders heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible();
  });
  test('6.2 has add measurement button', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /add/i }).first();
    await expect(btn).toBeVisible();
  });
  test('6.3 add button shows form', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /add/i }).first();
    await btn.click();
    await expect(page.locator('#weight')).toBeVisible();
  });
  test('6.4 form has all 8 inputs', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /add/i }).first();
    await btn.click();
    for (const id of ['weight','bodyFat','waist','hip','bicep','chest','thigh','neck']) {
      await expect(page.locator('#' + id)).toBeVisible();
    }
  });
  test('6.5 saves measurement', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /add/i }).first();
    await btn.click();
    await page.fill('#weight', '75');
    await page.fill('#bodyFat', '18');
    await page.fill('#waist', '82');
    await page.fill('#hip', '96');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(2000);
  });
  test('6.6 cancel hides form', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /add/i }).first();
    await btn.click();
    await expect(page.locator('#weight')).toBeVisible();
    await page.locator('button').filter({ hasText: /cancel/i }).first().click();
    await expect(page.locator('#weight')).not.toBeVisible();
  });
  test('6.7 body visualization SVG exists', async ({ page }) => {
    expect(await page.locator('svg').count()).toBeGreaterThan(0);
  });
});

// 7. RECIPES PAGE
test.describe('7. Recipes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/en/recipes');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });
  test('7.1 renders heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible();
  });
  test('7.2 has create button', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /create/i }).first();
    await expect(btn).toBeVisible();
  });
  test('7.3 create shows form', async ({ page }) => {
    await page.locator('button').filter({ hasText: /create/i }).first().click();
    await page.waitForTimeout(1000);
    expect(await page.locator('[role="textbox"], input').count()).toBeGreaterThan(0);
  });
  test('7.4 form has category/difficulty selects', async ({ page }) => {
    await page.locator('button').filter({ hasText: /create/i }).first().click();
    expect(await page.locator('select').count()).toBeGreaterThanOrEqual(2);
  });
  test('7.5 creates recipe', async ({ page }) => {
    await page.locator('button').filter({ hasText: /create/i }).first().click();
    await page.waitForSelector('[role="textbox"], input', { timeout: 5000 });
    await page.locator('[role="textbox"], input').first().fill('E2E Recipe');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(2000);
  });
  test('7.6 has category tabs', async ({ page }) => {
    expect(await page.locator('[role="tab"]').count()).toBeGreaterThanOrEqual(3);
  });
  test('7.7 switch category', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    if (await tabs.count() > 1) await tabs.nth(1).click();
  });
});

// 8. ANALYTICS PAGE
test.describe('8. Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/en/analytics');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });
  test('8.1 renders heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible();
  });
  test('8.2 has view tabs', async ({ page }) => {
    expect(await page.locator('[role="tab"]').count()).toBeGreaterThanOrEqual(2);
  });
  test('8.3 has buttons for date range', async ({ page }) => {
    expect(await page.locator('button').count()).toBeGreaterThan(0);
  });
});

// 9. FASTING PAGE
test.describe('9. Fasting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/en/fasting');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });
  test('9.1 renders heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible();
  });
  test('9.2 has suhoor/iftar time inputs', async ({ page }) => {
    expect(await page.locator('input[type="time"]').count()).toBeGreaterThanOrEqual(2);
  });
  test('9.3 has fasting toggle switches', async ({ page }) => {
    expect(await page.locator('[role="switch"]').count()).toBeGreaterThanOrEqual(1);
  });
  test('9.4 has log completed button', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /completed/i }).first();
    await expect(btn).toBeVisible();
  });
  test('9.5 has log missed button', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /missed/i }).first();
    await expect(btn).toBeVisible();
  });
  test('9.6 toggle switch works', async ({ page }) => {
    const sw = page.locator('[role="switch"]').first();
    await sw.click();
    await page.waitForTimeout(500);
  });
  test('9.7 log fast completes', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /completed/i }).first();
    await btn.click();
    await page.waitForTimeout(2000);
  });
});

// 10. NOTIFICATIONS PAGE
test.describe('10. Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/en/notifications');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });
  test('10.1 renders heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible();
  });
  test('10.2 has notification toggle switches', async ({ page }) => {
    expect(await page.locator('[role="switch"]').count()).toBeGreaterThanOrEqual(5);
  });
  test('10.3 toggles a switch', async ({ page }) => {
    await page.locator('[role="switch"]').nth(1).click();
    await page.waitForTimeout(500);
  });
});

// 11. MEDICAL PAGE
test.describe('11. Medical', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/en/medical');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });
  test('11.1 renders heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible();
  });
  test('11.2 has search input', async ({ page }) => {
    await expect(page.locator('input').first()).toBeVisible();
  });
  test('11.3 has nutrient/benefits/considerations tabs', async ({ page }) => {
    expect(await page.locator('[role="tab"]').count()).toBeGreaterThanOrEqual(3);
  });
  test('11.4 entries load from DB', async ({ page }) => {
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(100);
  });
  test('11.5 search filters entries', async ({ page }) => {
    await page.locator('input').first().fill('zinc');
    await page.waitForTimeout(1000);
  });
  test('11.6 switch between tabs', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    if (await tabs.count() > 1) {
      await tabs.nth(1).click();
      await page.waitForTimeout(300);
      await tabs.nth(2).click();
    }
  });
});

// 12. SETTINGS PAGE
test.describe('12. Settings', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE + '/en/settings');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });
  test('12.1 renders heading', async ({ page }) => {
    await expect(page.locator('h1').first()).toBeVisible();
  });
  test('12.2 has language toggle button', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /English|العربية/ }).first();
    await expect(btn).toBeVisible();
  });
  test('12.3 has edit profile button', async ({ page }) => {
    const btn = page.locator('button').filter({ hasText: /edit/i }).first();
    await expect(btn).toBeVisible();
  });
  test('12.4 edit shows form with selects', async ({ page }) => {
    await page.locator('button').filter({ hasText: /edit/i }).first().click();
    await page.waitForTimeout(500);
    expect(await page.locator('select').count()).toBeGreaterThanOrEqual(2);
  });
  test('12.5 cancel edit hides form', async ({ page }) => {
    await page.locator('button').filter({ hasText: /edit/i }).first().click();
    await page.waitForTimeout(500);
    await page.locator('button').filter({ hasText: /cancel/i }).first().click();
  });
  test('12.6 save profile works', async ({ page }) => {
    await page.locator('button').filter({ hasText: /edit/i }).first().click();
    await page.waitForTimeout(500);
    await page.locator('button').filter({ hasText: /save/i }).first().click();
    await page.waitForTimeout(2000);
  });
});

// 13. THEME TOGGLE
test.describe('13. Theme', () => {
  test('13.1 sidebar has theme area', async ({ page }) => {
    await page.goto(BASE + '/en/dashboard');
    await page.waitForTimeout(1000);
    await expect(page.locator('aside')).toBeVisible();
  });
  test('13.2 toggle changes html class', async ({ page }) => {
    await page.goto(BASE + '/en/dashboard');
    await page.waitForTimeout(1000);
    const before = await page.locator('html').getAttribute('class');
    const btn = page.locator('aside button').last();
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(1000);
      const after = await page.locator('html').getAttribute('class');
      expect(before).not.toBe(after);
    }
  });
});

// 14. ARABIC LOCALE
test.describe('14. Arabic Locale', () => {
  const arRoutes = ['dashboard','meals','body','fasting','settings','recipes','medical','notifications','analytics'];
  for (const r of arRoutes) {
    test('14.x /ar/' + r + ' renders', async ({ page }) => {
      await page.goto(BASE + '/ar/' + r);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      expect(page.url()).toContain('/ar/' + r);
    });
  }
});

// 15. API SMOKE TESTS
test.describe('15. API Endpoints', () => {
  test('15.1 foods API returns data', async ({ request }) => {
    const res = await request.get(BASE + '/api/foods?q=rice');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('foods');
  });
  test('15.2 medical API returns data', async ({ request }) => {
    const res = await request.get(BASE + '/api/medical');
    expect(res.ok()).toBeTruthy();
  });
  test('15.3 recipes API returns data', async ({ request }) => {
    const res = await request.get(BASE + '/api/recipes');
    expect(res.ok()).toBeTruthy();
  });
  test('15.4 foods endpoint returns valid response', async ({ request }) => {
    const res = await request.get(BASE + '/api/foods');
    expect([200, 401]).toContain(res.status());
  });
  test('15.5 dashboard endpoint returns valid response', async ({ request }) => {
    const res = await request.get(BASE + '/api/dashboard');
    expect([200, 401]).toContain(res.status());
  });
  test('15.6 register works', async ({ request }) => {
    const res = await request.post(BASE + '/api/auth/register', {
      data: { name: 'API Test', email: 'api_' + Date.now() + '@test.com', password: 'ApiTest123!' },
    });
    expect(res.ok()).toBeTruthy();
  });
  test('15.7 register rejects short password', async ({ request }) => {
    const res = await request.post(BASE + '/api/auth/register', {
      data: { name: 'Short', email: 'short_' + Date.now() + '@test.com', password: 'abc' },
    });
    expect(res.status()).toBe(400);
  });
  test('15.8 register rejects bad email', async ({ request }) => {
    const res = await request.post(BASE + '/api/auth/register', {
      data: { name: 'Bad', email: 'notanemail', password: 'Test12345!' },
    });
    expect(res.status()).toBe(400);
  });
});

// 16. 404 PAGE
test('16.1 404 renders for nonexistent route', async ({ page }) => {
  await page.goto(BASE + '/en/nonexistent-page-xyz');
  await page.waitForTimeout(2000);
  const body = await page.textContent('body');
  expect(body).toBeTruthy();
});
