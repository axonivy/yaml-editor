import type { Locator } from '@playwright/test';
import { Button } from './Button';
import { Theme } from './Theme';

export class Settings {
  readonly button: Button;
  readonly theme: Theme;

  constructor(parent: Locator) {
    this.button = new Button(parent, { name: 'Settings' });
    this.theme = new Theme(parent);
  }

  async toggle() {
    await this.button.click();
  }
}
