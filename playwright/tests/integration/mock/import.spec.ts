import { test } from '@playwright/test';
import { VariableEditor } from '../../pageobjects/VariableEditor';

test('importAndOverwrite', async ({ page }) => {
  const editor = await VariableEditor.openMock(page);
  await editor.tree.expectRowCount(11);

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

test('importAndOverwriteWholeSubTree', async ({ page }) => {
  const editor = await VariableEditor.openMock(page);
  const tree = editor.tree;
  await tree.expectRowCount(11);

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
  await tree.expectRowCount(15);
  await tree.row(11).click();
  await details.expectFolderValues('Amazon', '');
  await tree.row(13).click();
  await details.expectValues('SecretKey', '<YOUR_SECRET_KEY>', 'Secret key to access amazon comprehend', 'Password');
  await tree.row(14).click();
  await details.expectValues('AccessKey', '<YOUR_ACCESS_KEY>', 'Access key to access amazon comprehend', 'Default');
});
