import { content, contentStringsOnly, rootVariable } from './test-utils/variables';
import {
  contentEmpty,
  contentWithCommentOnly,
  contentWithEmptyVariables,
  contentWithEmptyVariablesMapping,
  rootVariableEmpty,
  rootVariableParsedFromContentWithCommentOnly
} from './test-utils/variables-empty';
import { contentNotYAML, contentWithMultipleTopLevelNodes, contentWithWrongNameOfTopLevelNode } from './test-utils/variables-malformed';
import { contentMixed, rootVariableMixed } from './test-utils/variables-mixed';
import { contentWithComments, rootVariableWithComments } from './test-utils/variables-with-comments';
import { contentParsedFromRootVariableWithDuplicates, rootVariableWithDuplicates } from './test-utils/variables-with-duplicates';
import {
  contentWithMetadata,
  contentWithWeirdMetadataFormat,
  contentWithWrongMetadataFormat,
  rootVariableParsedFromContentWithWeirdMetadataFormat,
  rootVariableParsedFromContentWithWrongMetadataFormat,
  rootVariableWithMetadata
} from './test-utils/variables-with-metadata';
import { toContent, toVariables } from './variable-utils';

describe('variable-utils', () => {
  describe('toVariables', () => {
    test('default', () => {
      expect(toVariables(content)).toEqual(rootVariable);
    });

    test('comments', () => {
      expect(toVariables(contentWithComments)).toEqual(rootVariableWithComments);
    });

    describe('metadata', () => {
      test('default', () => {
        expect(toVariables(contentWithMetadata)).toEqual(rootVariableWithMetadata);
      });

      test('weirdFormat', () => {
        expect(toVariables(contentWithWeirdMetadataFormat)).toEqual(rootVariableParsedFromContentWithWeirdMetadataFormat);
      });

      test('wrongFormat', () => {
        expect(toVariables(contentWithWrongMetadataFormat)).toEqual(rootVariableParsedFromContentWithWrongMetadataFormat);
      });
    });

    test('mixed', () => {
      expect(toVariables(contentMixed)).toEqual(rootVariableMixed);
    });

    describe('empty', () => {
      test('empty', () => {
        expect(toVariables(contentEmpty)).toEqual(rootVariableEmpty);
      });

      test('emptyVariables', () => {
        expect(toVariables(contentWithEmptyVariables)).toEqual(rootVariableEmpty);
      });

      test('emptyVariablesMapping', () => {
        expect(toVariables(contentWithEmptyVariablesMapping)).toEqual(rootVariableEmpty);
      });

      test('commentOnly', () => {
        expect(toVariables(contentWithCommentOnly)).toEqual(rootVariableParsedFromContentWithCommentOnly);
      });
    });

    describe('malformed', () => {
      test('wrongNameOfTopLevelNode', () => {
        expect(toVariables(contentWithWrongNameOfTopLevelNode)).toEqual(rootVariableEmpty);
      });

      test('multipleTopLevelNodes', () => {
        expect(toVariables(contentWithMultipleTopLevelNodes)).toEqual(rootVariableEmpty);
      });

      test('notYAML', () => {
        expect(toVariables(contentNotYAML)).toEqual(rootVariableEmpty);
      });
    });
  });

  describe('toContent', () => {
    test('default', () => {
      expect(toContent(rootVariable)).toEqual(contentStringsOnly);
    });

    test('comments', () => {
      expect(toContent(rootVariableWithComments)).toEqual(contentWithComments);
    });

    test('metadata', () => {
      expect(toContent(rootVariableWithMetadata)).toEqual(contentWithMetadata);
    });

    test('mixed', () => {
      expect(toContent(rootVariableMixed)).toEqual(contentMixed);
    });

    test('ignoreDuplicateKeys', () => {
      expect(toContent(rootVariableWithDuplicates)).toEqual(contentParsedFromRootVariableWithDuplicates);
    });

    test('empty', () => {
      expect(toContent(rootVariableEmpty)).toEqual(contentWithEmptyVariablesMapping);
    });
  });
});
