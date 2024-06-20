import { expect, type Locator, type Page } from '@playwright/test';
import { TextArea } from './TextArea';
import { Table } from './Table';
import { Button } from './Button';
import { Settings } from './Settings';
import { Details } from './Details';

export class VariableEditor {
  readonly page: Page;
  readonly search: TextArea;
  readonly tree: Table;
  readonly delete: Button;
  readonly add: Button;
  readonly locator: Locator;
  readonly settings: Settings;
  readonly details: Details;
  readonly detailsToggle: Button;
  readonly masterPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.locator = page.locator(':root');
    this.masterPanel = this.locator.getByTestId('master-panel');
    this.search = new TextArea(this.locator);
    this.tree = new Table(page, this.locator, ['label', 'label']);
    this.delete = new Button(this.locator, { name: 'Delete variable' });
    this.add = new Button(this.locator, { name: 'Add variable' });
    this.settings = new Settings(this.locator);
    this.details = new Details(this.page, this.locator);
    this.detailsToggle = new Button(this.locator, { name: 'Details toggle' });
  }

  static async openEngine(page: Page) {
    const server = process.env.BASE_URL ?? 'localhost:8081';
    const app = process.env.TEST_APP ?? 'designer';
    const serverUrl = server.replace(/^https?:\/\//, '');
    const pmv = 'variable-integration';
    const url = `?server=${serverUrl}&app=${app}&pmv=${pmv}&file=variables.yaml`;
    return this.openUrl(page, url);
  }

  static async openMock(page: Page) {
    return this.openUrl(page, '/mock.html');
  }

  private static async openUrl(page: Page, url: string) {
    const editor = new VariableEditor(page);
    await page.goto(url);
    return editor;
  }

  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }

  async takeScreenshot(fileName: string) {
    await this.hideQuery();
    const dir = process.env.SCREENSHOT_DIR ?? 'tests/screenshots/target';
    const buffer = await this.page.screenshot({ path: `${dir}/screenshots/${fileName}`, animations: 'disabled' });
    expect(buffer.byteLength).toBeGreaterThan(3000);
  }

  async hideQuery() {
    await this.page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
  }
}
