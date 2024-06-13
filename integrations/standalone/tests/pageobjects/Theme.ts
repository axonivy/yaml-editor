import { expect, type Locator } from '@playwright/test';
import { Switch } from './Switch';

export class Theme {
  readonly switch: Switch;
  readonly locator: Locator;

  constructor(parent: Locator) {
    this.switch = new Switch(parent, { name: 'Theme' });
    this.locator = parent.getByText('Theme');
  }

  async toggle() {
    await this.switch.click();
  }

  async expectLight() {
    await expect(this.locator).toHaveCSS('color', 'rgb(27, 27, 27)');
  }

  async expectDark() {
    await expect(this.locator).toHaveCSS('color', 'rgb(255, 255, 255)');
  }
}
