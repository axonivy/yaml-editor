import { content, variables } from './test-utils/variables';
import { contentMixed, variablesMixed } from './test-utils/variables-mixed';
import { contentWithDescriptions, variablesWithDescriptions } from './test-utils/variables-with-descriptions';
import { contentWithMetadata, variablesWithMetadata } from './test-utils/variables-with-metadata';
import { toContent, toVariables } from './variable-utils';

describe('variable-utils', () => {
  describe('toVariables', () => {
    test('default', () => {
      expect(toVariables(content)).toEqual(variables);
    });

    test('description', () => {
      expect(toVariables(contentWithDescriptions)).toEqual(variablesWithDescriptions);
    });

    describe('metadata', () => {
      test('default', () => {
        expect(toVariables(contentWithMetadata)).toEqual(variablesWithMetadata);
      });

      test('weirdFormat', () => {
        const content = `Variables:
  #   [password]   
  passwordKey: passwordValue
  # [enum:valueOne0,valueOne1,valueOne2]
  enumKeyOne: valueOne1
  #    [enum:   valueTwo0,   valueTwo1,   valueTwo2]   
  enumKeyTwo: valueTwo1
`;
        expect(toVariables(content)).toEqual([
          {
            name: 'passwordKey',
            value: 'passwordValue',
            description: '',
            metadata: { type: 'password' },
            children: []
          },
          {
            name: 'enumKeyOne',
            value: 'valueOne1',
            description: '',
            metadata: { type: 'enum', values: ['valueOne0', 'valueOne1', 'valueOne2'] },
            children: []
          },
          {
            name: 'enumKeyTwo',
            value: 'valueTwo1',
            description: '',
            metadata: { type: 'enum', values: ['valueTwo0', 'valueTwo1', 'valueTwo2'] },
            children: []
          }
        ]);
      });

      test('wrongFormat', () => {
        const content = `Variables:
  # [ password ]
  passwordKey: passwordValue
`;
        expect(toVariables(content)).toEqual([
          {
            name: 'passwordKey',
            value: 'passwordValue',
            description: '',
            metadata: { type: '' },
            children: []
          }
        ]);
      });
    });

    test('mixed', () => {
      expect(toVariables(contentMixed)).toEqual(variablesMixed);
    });

    test('noVariables', () => {
      const content = `Variables: {}
`;
      expect(toVariables(content)).toEqual([]);
    });
  });

  describe('toContent', () => {
    test('default', () => {
      expect(toContent(variables)).toEqual(content);
    });

    test('description', () => {
      expect(toContent(variablesWithDescriptions)).toEqual(contentWithDescriptions);
    });

    test('metadata', () => {
      expect(toContent(variablesWithMetadata)).toEqual(contentWithMetadata);
    });

    test('mixed', () => {
      expect(toContent(variablesMixed)).toEqual(contentMixed);
    });
  });
});
