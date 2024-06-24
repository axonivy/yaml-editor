import type { ValidationMessages } from '../../../protocol/types';
import { MockRow } from './test-utils/types';
import { containsError, containsWarning, toValidationMessageVariant, validationMessagesOfRow } from './validation-utils';
import type { Variable } from './variable';

let validationMessages: ValidationMessages;
let rowWithMessages: MockRow<Variable>;
let rowWithoutMessages: MockRow<Variable>;

beforeEach(() => {
  validationMessages = [
    {
      message: 'message0',
      path: 'Variables.key0.key0',
      severity: 0
    },
    {
      message: 'message1',
      path: 'Variables.key0.key1',
      severity: 0
    },
    {
      message: 'message2',
      path: 'Variables.key0.key1',
      severity: 0
    },
    {
      message: 'message3',
      path: 'Variables.key1.key0',
      severity: 0
    }
  ];
  rowWithMessages = new MockRow({ name: 'key1' } as Variable, [new MockRow({ name: 'key0' } as Variable, [])]);
  rowWithoutMessages = new MockRow({ name: 'key2' } as Variable, [new MockRow({ name: 'key0' } as Variable, [])]);
});

describe('validaton-utils', () => {
  describe('validationMessagesOfRow', () => {
    test('default', () => {
      const messages = validationMessagesOfRow(rowWithMessages, validationMessages);
      expect(messages).toHaveLength(2);
      expect(messages[0]).toEqual(validationMessages[1]);
      expect(messages[1]).toEqual(validationMessages[2]);
    });

    test('noMatches', () => {
      const messages = validationMessagesOfRow(rowWithoutMessages, validationMessages);
      expect(messages).toHaveLength(0);
    });

    test('undefined', () => {
      const messages = validationMessagesOfRow(rowWithMessages, undefined);
      expect(messages).toHaveLength(0);
    });
  });

  describe('containsError', () => {
    test('true', () => {
      validationMessages[1].severity = 2;
      expect(containsError(validationMessages)).toBeTruthy();
    });

    test('false', () => {
      expect(containsError(validationMessages)).toBeFalsy();
    });
  });

  describe('containsWarning', () => {
    test('true', () => {
      validationMessages[1].severity = 1;
      expect(containsWarning(validationMessages)).toBeTruthy();
    });

    test('false', () => {
      expect(containsWarning(validationMessages)).toBeFalsy();
    });
  });

  describe('toValidationMessageVariant', () => {
    test('warning', () => {
      expect(toValidationMessageVariant(1)).toEqual('warning');
    });

    test('error', () => {
      expect(toValidationMessageVariant(2)).toEqual('error');
    });

    test('default', () => {
      expect(toValidationMessageVariant(42)).toEqual('info');
    });
  });
});
