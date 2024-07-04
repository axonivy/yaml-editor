import type { Row } from '@tanstack/react-table';
import type { ValidationMessages } from '../../../protocol/types';
import { mockRow, variable } from './test-utils/types';
import {
  containsError,
  containsWarning,
  toValidationMessageVariant,
  validateName,
  validateNamespace,
  validationMessagesOfRow
} from './validation-utils';
import type { Variable } from './variable';

let validationMessages: ValidationMessages;
const rowWithMessages = mockRow('key1', 'key0') as Row<Variable>;
const rowWithoutMessages = mockRow('key2', 'key0') as Row<Variable>;

const variables = [
  variable('NameNode0', []),
  variable('NameNode1', [
    variable('NameNode10', []),
    variable('NameNode11', [
      variable('NameNode110', [])
    ])
  ])
];

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

  describe('validateName', () => {
    test('valid', () => {
      expect(validateName('Name', ['AnotherName'])).toBeUndefined();
    });

    describe('invalid', () => {
      describe('blank', () => {
        test('empty', () => {
          expect(validateName('', [])).toEqual({ message: 'Name cannot be empty.', variant: 'error' });
        });

        test('whitespace', () => {
          expect(validateName('   ', [])).toEqual({ message: 'Name cannot be empty.', variant: 'error' });
        });
      });

      test('taken', () => {
        expect(validateName('Name', ['Name'])).toEqual({ message: 'Name is already present in this Namespace.', variant: 'error' });
      });
    });
  });

  describe('validateNamespace', () => {
    describe('valid', () => {
      test('empty', () => {
        expect(validateNamespace('', variables)).toBeUndefined();
      });

      test('completelyNew', () => {
        expect(validateNamespace('New.Namespace', variables)).toBeUndefined();
      });

      test('partiallyNew', () => {
        expect(validateNamespace('NameNode1.New.Namespace', variables)).toBeUndefined();
      });
    });

    describe('invalid', () => {
      test('firstPartIsNotAFolder', () => {
        expect(validateNamespace('NameNode0.New.Namespace', variables)).toEqual({
          message: "Namespace 'NameNode0' is already present but not a folder.",
          variant: 'error'
        });
      });

      test('middlePartIsNotAFolder', () => {
        expect(validateNamespace('NameNode1.NameNode10.New.Namespace', variables)).toEqual({
          message: "Namespace 'NameNode1.NameNode10' is already present but not a folder.",
          variant: 'error'
        });
      });

      test('lastPartIsNotAFolder', () => {
        expect(validateNamespace('NameNode1.NameNode11.NameNode110', variables)).toEqual({
          message: "Namespace 'NameNode1.NameNode11.NameNode110' is already present but not a folder.",
          variant: 'error'
        });
      });
    });
  });
});
