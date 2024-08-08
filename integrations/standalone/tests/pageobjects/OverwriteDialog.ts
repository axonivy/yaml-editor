import { expect, type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { Table } from './Table';

export class OverwriteDialog {
  private readonly overwrite: Button;
  public readonly variables: Table;
  public readonly importBtn: Button;
  private readonly dialog: Locator;

  constructor(page: Page, parent: Locator) {
    this.overwrite = new Button(parent, { name: 'Overwrite variable' });
    this.dialog = parent.getByRole('dialog');
    this.variables = new Table(page, this.dialog, ['label', 'label']);
    this.importBtn = new Button(this.dialog, { name: 'Import' });
  }

  async open() {
    await this.overwrite.click();
  }

  async expectClosed() {
    await expect(this.dialog).not.toBeVisible();
  }
}
