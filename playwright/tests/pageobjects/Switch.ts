import type { Locator } from '@playwright/test';

export class Switch {
  private readonly locator: Locator;

  constructor(parentLocator: Locator, options?: { name?: string; nth?: number }) {
    if (options?.name) {
      this.locator = parentLocator.getByRole('switch', { name: options.name });
    } else {
      this.locator = parentLocator.getByRole('switch').nth(options?.nth ?? 0);
    }
  }

  async click() {
    await this.locator.click();
  }
}
