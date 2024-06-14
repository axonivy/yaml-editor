import { VariableEditor } from '../pageobjects/VariableEditor';
import { test } from '@playwright/test';

test.describe('VariableEditor Detail', () => {
  let editor: VariableEditor;

  test.beforeEach(async ({ page }) => {
    editor = await VariableEditor.open(page);
  });

  test('new string variable', async () => {
    await editor.tree.row(0).click();
    await editor.add.click();
    await editor.tree.row(11).click();
    const details = editor.details;
    await details.expectTitle('Variables Editor - ');

    await details.fill('myName', 'myValue', 'This is myName with a value of myValue');

    await details.expectTitle('Variables Editor - myName');
    await editor.tree.row(11).expectValues(['myName', 'myValue']);
    await editor.tree.row(10).click();
    await details.expectTitle('Variables Editor - connectorProvider');
    await editor.tree.row(11).click();

    await details.expectTitle('Variables Editor - myName');
    await details.expectValues('myName', 'myValue', 'This is myName with a value of myValue', '');
  });

  test('new password variable', async () => {
    await editor.tree.row(0).click();
    await editor.add.click();
    await editor.tree.row(11).click();
    const details = editor.details;
    await details.expectTitle('Variables Editor - ');

    await details.fill('myName', 'myValue', 'This is myName with a value of myValue', 'Password');

    await details.expectTitle('Variables Editor - myName');
    await editor.tree.row(11).expectValues(['myName', '***']);
    await editor.tree.row(10).click();
    await details.expectTitle('Variables Editor - connectorProvider');
    await editor.tree.row(11).click();

    await details.expectTitle('Variables Editor - myName');
    await details.expectValues('myName', 'myValue', 'This is myName with a value of myValue', 'Password');
  });

  test('new daytime variable', async () => {
    await editor.tree.row(0).click();
    await editor.add.click();
    await editor.tree.row(11).click();
    const details = editor.details;
    await details.expectTitle('Variables Editor - ');

    await details.fill('myName', '12:15', 'This is myName with a value of myValue', 'Daytime');

    await details.expectTitle('Variables Editor - myName');
    await editor.tree.row(11).expectValues(['myName', '12:15']);
    await editor.tree.row(10).click();
    await details.expectTitle('Variables Editor - connectorProvider');
    await editor.tree.row(11).click();

    await details.expectTitle('Variables Editor - myName');
    await details.expectValues('myName', '12:15', 'This is myName with a value of myValue', 'Daytime');
  });

  test('new file variable', async () => {
    await editor.tree.row(0).click();
    await editor.add.click();
    await editor.tree.row(11).click();
    const details = editor.details;
    await details.expectTitle('Variables Editor - ');

    await details.fill('myName', 'test.txt', 'This is myName with a value of myValue', 'File');
    await details.fileNameExtension.choose('txt');

    await details.expectTitle('Variables Editor - myName');
    await editor.tree.row(11).expectValues(['myName', 'test.txt']);
    await editor.tree.row(10).click();
    await details.expectTitle('Variables Editor - connectorProvider');
    await editor.tree.row(11).click();

    await details.expectTitle('Variables Editor - myName');
    await details.expectValues('myName', 'test.txt', 'This is myName with a value of myValue', 'File');
    await details.fileNameExtension.expectValue('txt');
  });

  test('new enum variable', async () => {
    await editor.tree.row(0).click();
    await editor.add.click();
    await editor.tree.row(11).click();
    const details = editor.details;
    await details.expectTitle('Variables Editor - ');

    await details.fill('myName', 'Monday', 'This is myName with a value of Monday', 'Enum');

    await details.expectTitle('Variables Editor - myName');
    await editor.tree.row(11).expectValues(['myName', 'Monday']);
    await editor.tree.row(10).click();
    await details.expectTitle('Variables Editor - connectorProvider');
    await editor.tree.row(11).click();

    await details.expectTitle('Variables Editor - myName');
    await details.expectValues('myName', 'Monday', 'This is myName with a value of Monday', 'Enum');
    await details.listOfPossibleValues.expectValues(['Monday']);
  });

  test('add/delete enum variable', async () => {
    await editor.tree.row(0).click();
    await editor.add.click();
    await editor.tree.row(11).click();
    const details = editor.details;
    await details.expectTitle('Variables Editor - ');

    await details.fill('myName', 'Monday', 'This is myName with a value of Monday', 'Enum');
    await details.listOfPossibleValues.addValue('Tuesday');
    await details.listOfPossibleValues.addValue('Wednesday');

    await details.listOfPossibleValues.expectValues(['Monday', 'Tuesday', 'Wednesday']);

    await details.enumValue.choose('Tuesday');
    await details.enumValue.expectValue('Tuesday');

    await details.enumValue.choose('Wednesday');
    await details.enumValue.expectValue('Wednesday');

    await details.enumValue.choose('Monday');

    await details.listOfPossibleValues.deleteValue('Tuesday');
    await details.listOfPossibleValues.deleteValue('Wednesday');

    await details.listOfPossibleValues.expectValues(['Monday']);
  });
});
