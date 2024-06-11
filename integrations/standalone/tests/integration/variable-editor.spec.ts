import { test, expect } from '@playwright/test';

test('title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Variables Editor');
});

test('search', async ({ page }) => {
  await page.goto('/');
  const search = page.locator('.ui-input');
  await search.fill('Hello');
  await expect(search).toHaveValue('Hello');
});
