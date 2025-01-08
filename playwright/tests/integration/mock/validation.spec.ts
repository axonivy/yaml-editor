import test, { expect } from '@playwright/test';
import { VariableEditor } from '../../pageobjects/VariableEditor';

let editor: VariableEditor;

test.beforeEach(async ({ page }) => {
  editor = await VariableEditor.openMock(page);
});

test('tree', async () => {
  await expect(editor.tree.messages).toHaveCount(0);

  await editor.addVariable('invalidVariable0', 'invalidKey');
  await editor.addVariable('invalidVariable1', 'invalidKey');
  await expect(editor.tree.messages).toHaveCount(3);

  await editor.tree.row(11).expectToHaveWarning();
  await editor.tree.message(0).expectToBeWarning('Invalid key');

  await editor.tree.row(12).expectToHaveError();
  await editor.tree.message(1).expectToBeWarning('Invalid variable 0 value warning');
  await editor.tree.message(2).expectToBeError('Invalid variable 0 value error');

  await editor.tree.row(13).expectToHaveNoValidation();
});

test('detail', async () => {
  await editor.addVariable('invalidVariable0', 'invalidKey');
  await editor.addVariable('invalidVariable1', 'invalidKey');

  await editor.tree.row(11).click();
  await editor.details.name.message.expectToBeWarning('Invalid key');

  await editor.tree.row(12).click();
  await editor.details.name.message.expectToBeInfo('Invalid variable 0 key');
  await editor.details.value.message.expectToBeError('Invalid variable 0 value error');

  await editor.tree.row(13).click();
  await editor.details.value.message.expectToBeInfo('Invalid variable 1 value');
});
