import { test } from '@playwright/test';
import { VariableEditor } from '../pageobjects/VariableEditor';

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

  await editor.addVariable();
  const details = editor.details;
  await details.name.fill('hello.world');

  await tree.expectRowCount(5);
  await tree.expectValidationCount(1);
  await tree.validation(0).expectText('Not ivy.var field compliant: Invalid character . at position 6 in hello.world.');
});

test('importAndOverwrite', async () => {
  const tree = editor.tree;
  await tree.expectRowCount(4);

  const overwrite = editor.overwrite;
  await overwrite.open();
  const variables = overwrite.variables;
  await variables.cell(0, 0).expectValue('Amazon');
  await variables.cell(1, 0).expectValue('ComprehendAmazon comprehend connector settings');
  await variables.cell(1, 0).expand();
  await variables.cell(2, 0).expectValue('SecretKeySecret key to access amazon comprehend');
  await variables.row(2).click();
  await overwrite.importBtn.click();
  await overwrite.expectClosed();

  const details = editor.details;
  await details.expectValues('SecretKey', '<YOUR_SECRET_KEY>', 'Secret key to access amazon comprehend', 'Password');
});

test('importAndOverwriteWholeSubTree', async () => {
  const tree = editor.tree;
  await tree.expectRowCount(4);

  const overwrite = editor.overwrite;
  await overwrite.open();
  const variables = overwrite.variables;
  await variables.cell(0, 0).expectValue('Amazon');
  await variables.cell(1, 0).expectValue('ComprehendAmazon comprehend connector settings');
  await variables.row(1).click();
  await overwrite.importBtn.click();
  await overwrite.expectClosed();

  const details = editor.details;
  await details.expectFolderValues('Comprehend', 'Amazon comprehend connector settings');
  await tree.expectRowCount(8);
  await tree.row(4).click();
  await details.expectFolderValues('Amazon', '');
  await tree.row(6).click();
  await details.expectValues('SecretKey', '<YOUR_SECRET_KEY>', 'Secret key to access amazon comprehend', 'Password');
  await tree.row(7).click();
  await details.expectValues('AccessKey', '<YOUR_ACCESS_KEY>', 'Access key to access amazon comprehend', '');
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
  await details.expectValues('secretKey', 'MySecretKey', 'Secret key from your applications "certificates & secrets"', 'Password');
});

test('save data', async () => {
  const tree = editor.tree;
  const details = editor.details;

  await tree.expectRowCount(4);

  await tree.row(2).click();
  await details.fill('appIdChanged', 'MyAppIdChanged', 'Your Azure Application (client) ID changed', '');

  await tree.row(3).click();
  await details.fill('secretKeyChanged', 'MySecretKeyChanged', 'Secret key from your applications "certificates & secrets changed"', 'Password');

  const editor2 = await VariableEditor.openEngine(editor.page);
  const tree2 = editor2.tree;
  const details2 = editor2.details;

  await tree2.row(2).click();
  await details2.expectValues('appIdChanged', 'MyAppIdChanged', 'Your Azure Application (client) ID changed', '');
  await details2.fill('appId', 'MyAppId', 'Your Azure Application (client) ID', '');

  await tree2.row(3).click();
  await details2.expectValues('secretKeyChanged', 'MySecretKeyChanged', 'Secret key from your applications "certificates & secrets changed"', 'Password');
  await details2.fill('secretKey', 'MySecretKey', 'Secret key from your applications "certificates & secrets"', 'Password');

  const editor3 = await VariableEditor.openEngine(editor.page);
  const tree3 = editor3.tree;
  const details3 = editor3.details;

  await tree3.row(2).click();
  await details3.expectValues('appId', 'MyAppId', 'Your Azure Application (client) ID', '');

  await tree3.row(3).click();
  await details3.expectValues('secretKey', 'MySecretKey', 'Secret key from your applications "certificates & secrets"', 'Password');
});
