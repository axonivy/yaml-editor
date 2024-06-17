import { expect, type Locator, type Page } from '@playwright/test';
import { TextArea } from './TextArea';
import { Select } from './Select';
import { EnumValues } from './EnumValues';

export class Details {
  readonly locator: Locator;
  readonly title: Locator;
  readonly name: TextArea;
  readonly value: TextArea;
  readonly enumValue: Select;
  readonly description: TextArea;
  readonly metaData: Select;
  readonly fileNameExtension: Select;
  readonly listOfPossibleValues: EnumValues;

  constructor(page: Page, parent: Locator) {
    this.locator = parent.getByTestId('details-container');
    this.title = this.locator.getByTestId('Detail title');
    this.name = new TextArea(this.locator, { label: 'Name' });
    this.value = new TextArea(this.locator, { label: 'Value' });
    this.enumValue = new Select(page, this.locator, { label: 'Value' });
    this.description = new TextArea(this.locator, { label: 'Description' });
    this.metaData = new Select(page, this.locator, { label: 'Metadata' });
    this.fileNameExtension = new Select(page, this.locator, { label: 'Filename extension' });
    this.listOfPossibleValues = new EnumValues(page, this.locator);
  }

  async expectTitle(t: string) {
    await expect(this.title).toHaveText(t);
  }

  async fill(name: string, value: string, description: string, metaData?: string) {
    await this.name.fill(name);
    await this.description.fill(description);
    if (metaData) {
      await this.metaData.choose(metaData);
      if (metaData === 'Enum') {
        await this.listOfPossibleValues.setFirstValue(value);
        await this.enumValue.choose(value);
        return;
      }
    }
    await this.value.fill(value);
  }

  async expectValues(name: string, value: string, description: string, metaData: string) {
    await this.name.expectValue(name);
    if (metaData === 'Enum') {
      await this.enumValue.expectValue(value);
    } else {
      await this.value.expectValue(value);
    }
    await this.description.expectValue(description);
    await this.metaData.expectValue(metaData);
    switch (metaData) {
      case 'Password':
        await this.value.expectType('password');
        break;
      case 'Daytime':
        await this.value.expectType('time');
        break;
      case 'Enum':
        break;
      default:
        await this.value.expectNoType();
    }
  }
}
