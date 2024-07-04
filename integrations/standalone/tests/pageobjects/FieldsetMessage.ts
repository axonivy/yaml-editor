import { expect, type Locator } from '@playwright/test';

export class FieldsetMessage {
  private readonly locator: Locator;

  constructor(parentLocator: Locator, options: { label: string }) {
    this.locator = parentLocator.getByLabel(options.label, { exact: true }).locator('.ui-message');
  }

  async expectToBeHidden() {
    await expect(this.locator).toBeHidden();
  }

  async expectMessage(message: string) {
    await expect(this.locator).toHaveText(message);
  }

  async expectVariant(variant: string) {
    await expect(this.locator).toHaveAttribute('data-state', variant);
  }
}
