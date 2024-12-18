import { expect, type Locator } from '@playwright/test';

export class Button {
  readonly locator: Locator;

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

  async expectDataState(dataState: string) {
    await expect(this.locator).toHaveAttribute('data-state', dataState);
  }

  async expectEnabled() {
    await expect(this.locator).toBeEnabled();
  }

  async expectDisabled() {
    await expect(this.locator).toBeDisabled();
  }
}
