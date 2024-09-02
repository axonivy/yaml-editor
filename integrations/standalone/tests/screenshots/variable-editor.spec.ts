import { test } from '@playwright/test';
import { VariableEditor } from '../pageobjects/VariableEditor';

let editor: VariableEditor;

test.beforeEach(async ({ page }) => {
  editor = await VariableEditor.openMock(page);
});

test('validation', async () => {
  const tree = editor.tree;
  await tree.row(8).click();
  await editor.takeScreenshot('variables-editor.png');
});
