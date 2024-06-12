import { test, expect } from '@playwright/test';

test('title', async ({ page }) => {
  await page.goto('/mock.html');
  await expect(page).toHaveTitle('Variables Editor Mock');
});

test('search', async ({ page }) => {
  await page.goto('/mock.html');
  const search = page.locator('.ui-input');
  await search.fill('Hello');
  await expect(search).toHaveValue('Hello');
});
