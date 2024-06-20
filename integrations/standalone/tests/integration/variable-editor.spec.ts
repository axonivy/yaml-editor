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
    await tree.expectNotEmpty();
    while ((await tree.rowCount()) > 4) {
      await tree.row(4).click();
      await editor.delete.click();
    }
  });

  test('title', async () => {
    await editor.expectTitle('Variables Editor');
  });

  test('validation', async () => {
    const tree = editor.tree;
    await tree.expectRowCount(4);
    await tree.expectValidationCount(0);

    await editor.add.click();
    const details = editor.details;
    await details.name.fill('hello.world');

    await tree.expectRowCount(5);
    await tree.expectValidationCount(1);
    await tree.validation(0).expectText('Not ivy.var field compliant: Invalid character . at position 6 in hello.world.');
  });

  test('load data', async () => {
    const tree = editor.tree;
    const details = editor.details;

    await tree.expectRowCount(4);

    await tree.row(0).click();
    await details.expectFolderValues('microsoft', '');

    await tree.row(1).click();
    await details.expectFolderValues('connector', '');

    await tree.row(2).click();
    await details.expectValues('appId', 'MyAppId', 'Your Azure Application (client) ID', '');

    await tree.row(3).click();
    await details.expectValues('secretKey', '${decrypt:MySecretKey}', 'Secret key from your applications "certificates & secrets"', 'Password');
  });

  test('save data', async () => {
    const tree = editor.tree;
    const details = editor.details;

    await tree.expectRowCount(4);

    await tree.row(2).click();
    await details.fill('appIdChanged', 'MyAppIdChanged', 'Your Azure Application (client) ID changed', '');

    await tree.row(3).click();
    await details.fill('secretKeyChanged', '${decrypt:MySecretKeyChanged}', 'Secret key from your applications "certificates & secrets changed"', 'Password');

    const editor2 = await VariableEditor.openEngine(editor.page);
    const tree2 = editor2.tree;
    const details2 = editor2.details;

    await tree2.row(2).click();
    await details2.expectValues('appIdChanged', 'MyAppIdChanged', 'Your Azure Application (client) ID changed', '');
    await details2.fill('appId', 'MyAppId', 'Your Azure Application (client) ID', '');

    await tree2.row(3).click();
    await details2.expectValues('secretKeyChanged', '${decrypt:MySecretKeyChanged}', 'Secret key from your applications "certificates & secrets changed"', 'Password');
    await details2.fill('secretKey', '${decrypt:MySecretKey}', 'Secret key from your applications "certificates & secrets"', 'Password');

    const editor3 = await VariableEditor.openEngine(editor.page);
    const tree3 = editor3.tree;
    const details3 = editor3.details;

    await tree3.row(2).click();
    await details3.expectValues('appId', 'MyAppId', 'Your Azure Application (client) ID', '');

    await tree3.row(3).click();
    await details3.expectValues('secretKey', '${decrypt:MySecretKey}', 'Secret key from your applications "certificates & secrets"', 'Password');
  });
});
