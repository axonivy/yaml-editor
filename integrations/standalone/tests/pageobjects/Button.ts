import type { Locator } from '@playwright/test';

export class Button {
  private readonly locator: Locator;

  constructor(parentLocator: Locator, options?: { name?: string; nth?: number }) {
    if (options?.name) {
      this.locator = parentLocator.getByRole('button', { name: options.name });
    } else {
      this.locator = parentLocator.getByRole('button').nth(options?.nth ?? 0);
    }
  }

  async click() {
    await this.locator.click();
  }
}
