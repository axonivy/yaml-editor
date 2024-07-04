import { type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { Combobox } from './Combobox';
import { FieldsetMessage } from './FieldsetMessage';
import { TextArea } from './TextArea';

export class AddVariableDialog {
  private readonly add: Button;
  readonly name: TextArea;
  readonly nameMessage: FieldsetMessage;
  readonly namespace: Combobox;
  readonly namespaceMessage: FieldsetMessage;
  private readonly create: Button;

  constructor(page: Page, parent: Locator) {
    this.add = new Button(parent, { name: 'Add variable' });
    this.name = new TextArea(parent);
    this.nameMessage = new FieldsetMessage(parent, { label: 'Name' });
    this.namespace = new Combobox(page, parent);
    this.namespaceMessage = new FieldsetMessage(parent, { label: 'Namespace' });
    this.create = new Button(parent, { name: 'Create variable' });
  }

  async open() {
    await this.add.click();
  }

  async expectValues(name: string, namespaceValue: string, ...namespaceOptions: Array<string>) {
    await this.name.expectValue(name);
    await this.namespace.expectValue(namespaceValue);
    await this.namespace.expectOptions(...namespaceOptions);
  }

  async createVariable() {
    await this.create.click();
  }

  async expectCreateEnabled() {
    await this.create.expectEnabled();
  }

  async expectCreateDisabled() {
    await this.create.expectDisabled();
  }
}
