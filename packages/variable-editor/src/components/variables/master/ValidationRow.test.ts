import type { ValidationMessages } from '@axonivy/variable-editor-protocol';
import { rowClass } from './ValidationRow';

test('rowClass', () => {
  expect(rowClass([])).toEqual('');
  expect(rowClass([{ severity: 'INFO' }] as ValidationMessages)).toEqual('');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'WARNING' }] as ValidationMessages)).toEqual('row-warning');
  expect(rowClass([{ severity: 'INFO' }, { severity: 'WARNING' }, { severity: 'ERROR' }] as ValidationMessages)).toEqual('row-error');
});
