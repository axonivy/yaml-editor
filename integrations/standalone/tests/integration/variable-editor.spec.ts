import { VariableEditor } from '../pageobjects/VariableEditor';
import { test } from '@playwright/test';

test.describe('VariableEditor', () => {
  let editor: VariableEditor;

  test.beforeEach(async ({ page }) => {
    editor = await VariableEditor.openEngine(page);
  });

  test.afterEach(async ({ page }) => {
    editor = await VariableEditor.openEngine(page);
    const tree = editor.tree;
    while ((await tree.rowCount()) > 0) {
      await tree.row(0).click();
      await editor.delete.click();
    }
  });

  test('title', async () => {
    await editor.expectTitle('Variables Editor');
  });

  test('validation', async () => {
    const tree = editor.tree;
    await tree.expectRowCount(0);
    await editor.add.click();
    const details = editor.details;
    await details.name.fill('hello.world');
    await tree.expectRowCount(1);
    await tree.expectValidationCount(1);
    await tree.validation(0).expectText('Not ivy.var field compliant: Invalid character . at position 6 in hello.world.');
  });
});
