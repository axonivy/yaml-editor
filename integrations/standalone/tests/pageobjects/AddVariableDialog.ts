import { type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { Combobox } from './Combobox';
import { FieldsetMessage } from './FieldsetMessage';
import { TextArea } from './TextArea';

export class AddVariableDialog {
  private readonly add: Button;
  readonly name: TextArea;
  private readonly nameMessage: FieldsetMessage;
  readonly namespace: Combobox;
  private readonly create: Button;

  constructor(page: Page, parent: Locator) {
    this.add = new Button(parent, { name: 'Add variable' });
    this.name = new TextArea(parent);
    this.nameMessage = new FieldsetMessage(parent, { label: 'Name' });
    this.namespace = new Combobox(page, parent);
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

  async expectNoNameMessage() {
    await this.nameMessage.expectToBeHidden();
  }

  async expectNameMessage(message: string, variant: string) {
    await this.nameMessage.expectMessage(message);
    await this.nameMessage.expectVariant(variant);
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
