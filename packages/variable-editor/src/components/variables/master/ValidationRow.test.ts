import type { MessageData } from '@axonivy/ui-components';
import { rowClass } from './ValidationRow';

describe('rowClass', () => {
  test('error', () => {
    const messages: Array<MessageData> = [
      { message: 'error', variant: 'warning' },
      { message: 'error', variant: 'error' }
    ];
    expect(rowClass(messages)).toEqual('row-error');
  });

  test('warning', () => {
    const messages: Array<MessageData> = [{ message: 'error', variant: 'warning' }];
    expect(rowClass(messages)).toEqual('row-warning');
  });

  test('none', () => {
    expect(rowClass([{ message: 'hi', variant: 'info' }])).toEqual('');
  });
});
