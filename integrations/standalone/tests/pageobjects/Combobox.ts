import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Combobox {
  readonly locator: Locator;

  constructor(readonly page: Page, parentLocator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parentLocator.getByRole('combobox', { name: options.label }).first();
    } else {
      this.locator = parentLocator.getByRole('combobox').nth(options?.nth ?? 0);
    }
  }

  async expectValue(value: string | RegExp) {
    await expect(this.locator).toHaveValue(value);
  }
}
