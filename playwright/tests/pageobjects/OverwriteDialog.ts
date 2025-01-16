import { type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { Table } from './Table';

export class OverwriteDialog {
  readonly overwrite: Button;
  readonly variables: Table;
  readonly importBtn: Button;
  readonly dialog: Locator;

  constructor(page: Page, parent: Locator) {
    this.overwrite = new Button(parent, { name: 'Import Variable' });
    this.dialog = parent.getByRole('dialog');
    this.variables = new Table(page, this.dialog, ['label', 'label']);
    this.importBtn = new Button(this.dialog, { name: 'Import' });
  }

  async open() {
    await this.overwrite.click();
  }
}
