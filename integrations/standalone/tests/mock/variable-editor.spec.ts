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
});
