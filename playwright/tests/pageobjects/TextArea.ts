import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class TextArea {
  private readonly locator: Locator;
  readonly showPassword: Locator;

  constructor(parentLocator: Locator, options?: { label?: string; nth?: number }) {
    if (options?.label) {
      this.locator = parentLocator.getByLabel(options.label, { exact: true });
    } else {
      this.locator = parentLocator.getByRole('textbox').nth(options?.nth ?? 0);
    }
    this.showPassword = parentLocator.getByLabel('Show password');
  }

  async fill(value: string) {
    await this.locator.fill(value);
  }

  async clear() {
    await this.locator.clear();
  }

  async expectValue(value: string) {
    await expect(this.locator).toHaveValue(value);
  }

  async expectEmpty() {
    await expect(this.locator).toBeEmpty();
  }

  async expectEnabled() {
    await expect(this.locator).toBeEnabled();
  }

  async expectDisabled() {
    await expect(this.locator).toBeDisabled();
  }

  async expectType(type: string) {
    await expect(this.locator).toHaveAttribute('type', type);
  }

  async expectNoType() {
    await expect(this.locator).not.toHaveAttribute('type');
  }

  async expectDoesNotExists() {
    await expect(this.locator).toHaveCount(0);
  }
}
