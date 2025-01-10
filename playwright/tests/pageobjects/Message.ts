import { expect, type Locator } from '@playwright/test';

export class Message {
  readonly locator: Locator;

  constructor(parent: Locator, id?: string) {
    if (id) {
      this.locator = parent.locator(`[id="${id}"]`);
    } else {
      this.locator = parent.locator('.ui-message');
    }
  }

  async expectToBeHidden() {
    await expect(this.locator).toBeHidden();
  }

  async expectToBeInfo(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'info');
  }

  async expectToBeWarning(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'warning');
  }

  async expectToBeError(message: string) {
    await expect(this.locator).toHaveText(message);
    await expect(this.locator).toHaveAttribute('data-state', 'error');
  }
}
