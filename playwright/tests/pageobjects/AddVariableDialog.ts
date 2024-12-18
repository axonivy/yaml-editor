import { type Locator, type Page } from '@playwright/test';
import { Button } from './Button';
import { Combobox } from './Combobox';
import { FieldMessage } from './FieldMessage';
import { TextArea } from './TextArea';

export class AddVariableDialog {
  readonly open: Button;
  readonly name: TextArea;
  readonly nameMessage: FieldMessage;
  readonly namespace: Combobox;
  readonly namespaceMessage: FieldMessage;
  readonly importMessage: Locator;
  readonly create: Button;

  constructor(page: Page, parent: Locator) {
    this.open = new Button(parent, { name: 'Add variable' });
    this.name = new TextArea(parent);
    this.nameMessage = new FieldMessage(parent, { label: 'Name' });
    this.namespace = new Combobox(page, parent);
    this.namespaceMessage = new FieldMessage(parent, { label: 'Namespace' });
    this.importMessage = parent.getByLabel('Import message');
    this.create = new Button(parent, { name: 'Create variable' });
  }

  async expectValues(name: string, namespaceValue: string, ...namespaceOptions: Array<string>) {
    await this.name.expectValue(name);
    await this.namespace.expectValue(namespaceValue);
    await this.namespace.expectOptions(...namespaceOptions);
  }
}
