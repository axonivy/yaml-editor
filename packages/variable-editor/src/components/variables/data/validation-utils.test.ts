import type { ValidationResult } from '@axonivy/variable-editor-protocol';
import type { Row } from '@tanstack/react-table';
import { setupRow, setupVariable } from './test-utils/setup';
import { containsError, containsWarning, validateName, validateNamespace, validationMessagesOfRow } from './validation-utils';
import type { Variable } from './variable';

const validationMessages: Array<ValidationResult> = [
  {
    message: 'message0',
    path: 'Variables.key0.key0',
    severity: 'INFO'
  },
  {
    message: 'message1',
    path: 'Variables.key0.key1',
    severity: 'INFO'
  },
  {
    message: 'message2',
    path: 'Variables.key0.key1',
    severity: 'INFO'
  },
  {
    message: 'message3',
    path: 'Variables.key1.key0',
    severity: 'INFO'
  }
];
const rowWithMessages = setupRow('key1', 'key0') as Row<Variable>;
const rowWithoutMessages = setupRow('key2', 'key0') as Row<Variable>;

const variables = [
  setupVariable('NameNode0', []),
  setupVariable('NameNode1', [setupVariable('NameNode10', []), setupVariable('NameNode11', [setupVariable('NameNode110', [])])])
];

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
    const validationMessagesWithError = structuredClone(validationMessages);
    validationMessagesWithError[1].severity = 'ERROR';
    expect(containsError(validationMessagesWithError)).toBeTruthy();
  });

  test('false', () => {
    expect(containsError(validationMessages)).toBeFalsy();
  });
});

describe('containsWarning', () => {
  test('true', () => {
    const validationMessagesWithWarning = structuredClone(validationMessages);
    validationMessagesWithWarning[1].severity = 'WARNING';
    expect(containsWarning(validationMessagesWithWarning)).toBeTruthy();
  });

  test('false', () => {
    expect(containsWarning(validationMessages)).toBeFalsy();
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

    test('containsDot', () => {
      expect(validateName('New.Name', [])).toEqual({ message: "Character '.' is not allowed.", variant: 'error' });
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
        message: "Namespace 'NameNode0' is not a folder, you cannot add a child to it.",
        variant: 'error'
      });
    });

    test('middlePartIsNotAFolder', () => {
      expect(validateNamespace('NameNode1.NameNode10.New.Namespace', variables)).toEqual({
        message: "Namespace 'NameNode1.NameNode10' is not a folder, you cannot add a child to it.",
        variant: 'error'
      });
    });

    test('lastPartIsNotAFolder', () => {
      expect(validateNamespace('NameNode1.NameNode11.NameNode110', variables)).toEqual({
        message: "Namespace 'NameNode1.NameNode11.NameNode110' is not a folder, you cannot add a child to it.",
        variant: 'error'
      });
    });
  });
});
