import type { ValidationMessages } from '../../../protocol/types';
import { toValidationMessageVariant, validationMessagesOfRow } from './validation-utils';

let validationMessages: ValidationMessages;

beforeEach(() => {
  validationMessages = [
    {
      message: 'message0',
      path: '[0, 0, 0]',
      severity: 0
    },
    {
      message: 'message1',
      path: '[0, 0, 1]',
      severity: 0
    },
    {
      message: 'message2',
      path: '[0, 0, 1]',
      severity: 0
    },
    {
      message: 'message3',
      path: '[0, 1, 0]',
      severity: 0
    }
  ];
});

describe('validaton-utils', () => {
  describe('validationMessagesOfRow', () => {
    test('default', () => {
      const messages = validationMessagesOfRow('0.1', validationMessages);
      expect(messages).toHaveLength(2);
      expect(messages[0]).toEqual(validationMessages[1]);
      expect(messages[1]).toEqual(validationMessages[2]);
    });

    test('noMatches', () => {
      const messages = validationMessagesOfRow('0.2', validationMessages);
      expect(messages).toHaveLength(0);
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
