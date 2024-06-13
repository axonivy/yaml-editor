import { expect, type Locator, type Page } from '@playwright/test';
import { TextArea } from './TextArea';
import { Table } from './Table';
import { Button } from './Button';
import { Settings } from './Settings';

export class VariableEditor {
  readonly page: Page;
  readonly search: TextArea;
  readonly tree: Table;
  readonly delete: Button;
  readonly add: Button;
  readonly locator: Locator;
  readonly settings: Settings;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator(':root');
    this.search = new TextArea(this.locator);
    this.tree = new Table(page, this.locator, ['label', 'label']);
    this.delete = new Button(this.locator, { name: 'Delete variable' });
    this.add = new Button(this.locator, { name: 'Add variable' });
    this.settings = new Settings(this.locator);
  }

  static async open(page: Page) {
    const editor = new VariableEditor(page);
    await page.goto('/mock.html');
    return editor;
  }

  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }
}
