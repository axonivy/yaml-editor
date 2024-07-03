import { type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { Combobox } from './Combobox';
import { FieldsetMessage } from './FieldsetMessage';
import { TextArea } from './TextArea';

export class AddVariableDialog {
  private readonly add: Button;
  private readonly name: TextArea;
  private readonly nameMessage: FieldsetMessage;
  private readonly namespace: Combobox;
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

  async fillName(name: string) {
    await this.name.fill(name);
  }

  async fillNamespace(namespace: string) {
    await this.namespace.fill(namespace);
  }

  async chooseNamespace(namespace: string) {
    await this.namespace.choose(namespace);
  }

  async expectValues(name: string, namespaceValue: string, ...namespaceOptions: Array<string>) {
    await this.name.expectValue(name);
    await this.namespace.expectValue(namespaceValue);
    await this.namespace.expectOptions(...namespaceOptions);
  }

  async expectNoNameMessage() {
    await this.nameMessage.expectDoesNotExist();
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
