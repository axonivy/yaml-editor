import { VariableEditor } from '../pageobjects/VariableEditor';
import { test } from '@playwright/test';

test.describe('VariableEditor', () => {
  let editor: VariableEditor;

  test.beforeEach(async ({ page }) => {
    editor = await VariableEditor.open(page);
  });

  test('title', async () => {
    await editor.expectTitle('Variables Editor Mock');
  });

  test('search', async () => {
    const search = editor.search;
    const tree = editor.tree;
    await tree.expectRowCount(11);

    await search.fill('Hello');
    await search.expectValue('Hello');
    await tree.expectRowCount(0);

    await search.fill('useUser');
    await search.expectValue('useUser');
    await tree.expectRowCount(5);
  });

  test('delete', async () => {
    const tree = editor.tree;
    await tree.expectRowCount(11);

    await tree.row(6).click();
    await tree.row(6).expectValues(['enabled', 'false']);
    await editor.delete.click();
    await tree.expectRowCount(10);
    await tree.row(6).expectValues(['user', 'MyUser']);
  });

  test('add', async () => {
    const tree = editor.tree;
    await tree.expectRowCount(11);

    await tree.row(5).click();
    await tree.row(5).expectValues(['useUserPassFlow', '']);
    await editor.add.click();
    await tree.expectRowCount(12);
  });

  test('collapse', async () => {
    const tree = editor.tree;
    await tree.expectRowCount(11);
    await tree.row(5).collapse();
    await tree.expectRowCount(8);
  });

  test('expand', async () => {
    const tree = editor.tree;
    await tree.row(5).collapse();
    await tree.expectRowCount(8);
    await tree.row(5).expand();
    await tree.expectRowCount(11);
  });

  test('theme', async () => {
    const settings = editor.settings;
    await settings.toggle();
    await settings.theme.expectLight();
    await settings.theme.toggle();
    await settings.theme.expectDark();
  });

  test('password', async () => {
    await editor.tree.row(2).expectValues(['secretKey', '***']);
  });
});
