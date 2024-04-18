import { isYAMLNodeWithChildren, isYAMLNodeWithoutChildren, isYAMLRoot } from './types';

let yamlRoot: any;
let yamlNodeWithChildren: any;
let yamlNodeWithoutChildren: any;

beforeEach(() => {
  yamlNodeWithoutChildren = {
    key: {
      value: 'keyValue',
      commentBefore: 'keyCommentBefore'
    },
    value: {
      value: 'valueValue',
      commentBefore: 'valueCommentBefore'
    }
  };
  yamlNodeWithChildren = {
    key: {
      value: 'keyValue',
      commentBefore: 'keyCommentBefore'
    },
    value: {
      items: [yamlNodeWithoutChildren],
      commentBefore: 'valueCommentBefore'
    }
  };
  yamlRoot = {
    items: [yamlNodeWithoutChildren],
    commentBefore: 'rootCommentBefore'
  };
});

describe('types', () => {
  describe('isYAMLRoot', () => {
    describe('true', () => {
      test('default', () => {
        expect(isYAMLRoot(yamlRoot)).toBeTruthy();
      });

      test('commentBeforeIsUndefined', () => {
        yamlRoot.commentBefore = undefined;
        expect(isYAMLRoot(yamlRoot)).toBeTruthy();
      });

      test('itemsIsEmpty', () => {
        yamlRoot.items = [];
        expect(isYAMLRoot(yamlRoot)).toBeTruthy();
      });

      test('itemsContainsMultiple', () => {
        yamlRoot.items.push(yamlNodeWithoutChildren);
        yamlRoot.items.push(yamlNodeWithoutChildren);
        expect(isYAMLRoot(yamlRoot)).toBeTruthy();
      });

      test('itemsContainsYAMLNodeWithChildren', () => {
        yamlRoot.items.push({
          key: {
            value: 'keyValue',
            commentBefore: 'keyCommentBefore'
          },
          value: {
            items: [yamlNodeWithoutChildren],
            commentBefore: 'valueCommentBefore'
          }
        });
        expect(isYAMLRoot(yamlRoot)).toBeTruthy();
      });
    });

    describe('false', () => {
      test('rootIsUndefined', () => {
        expect(isYAMLRoot(undefined)).toBeFalsy();
      });

      test('commentBeforeIsNumber', () => {
        yamlRoot.commentBefore = 42;
        expect(isYAMLRoot(yamlRoot)).toBeFalsy();
      });

      test('commentBeforeIsBoolean', () => {
        yamlRoot.commentBefore = true;
        expect(isYAMLRoot(yamlRoot)).toBeFalsy();
      });

      test('itemsIsUndefined', () => {
        yamlRoot.items = undefined;
        expect(isYAMLRoot(yamlNodeWithChildren)).toBeFalsy();
      });

      test('itemsContainsString', () => {
        yamlRoot.items.push('string');
        expect(isYAMLRoot(yamlNodeWithChildren)).toBeFalsy();
      });

      test('itemsContainsNumber', () => {
        yamlRoot.items.push(42);
        expect(isYAMLRoot(yamlNodeWithChildren)).toBeFalsy();
      });

      test('itemsContainsBoolean', () => {
        yamlRoot.items.push(true);
        expect(isYAMLRoot(yamlNodeWithChildren)).toBeFalsy();
      });

      test('itemsContainsUndefined', () => {
        yamlRoot.items.push(undefined);
        expect(isYAMLRoot(yamlNodeWithChildren)).toBeFalsy();
      });

      test('itemsContainsNonYAMLNodeObject', () => {
        yamlRoot.items.push({ attribute: 'value' });
        expect(isYAMLRoot(yamlNodeWithChildren)).toBeFalsy();
      });
    });
  });

  describe('isYAMLNodeWithChildren', () => {
    describe('true', () => {
      test('default', () => {
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeTruthy();
      });

      test('keyCommentBeforeIsUndefined', () => {
        yamlNodeWithChildren.key.commentBefore = undefined;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeTruthy();
      });

      test('valueItemsIsEmpty', () => {
        yamlNodeWithChildren.value.items = [];
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeTruthy();
      });

      test('valueItemsContainsMultiple', () => {
        yamlNodeWithChildren.value.items.push(yamlNodeWithoutChildren);
        yamlNodeWithChildren.value.items.push(yamlNodeWithoutChildren);
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeTruthy();
      });

      test('valueItemsContainsYAMLNodeWithChildren', () => {
        yamlNodeWithChildren.value.items.push({
          key: {
            value: 'keyValue',
            commentBefore: 'keyCommentBefore'
          },
          value: {
            items: [yamlNodeWithoutChildren],
            commentBefore: 'valueCommentBefore'
          }
        });
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeTruthy();
      });

      test('valueCommentBeforeIsUndefined', () => {
        yamlNodeWithChildren.value.commentBefore = undefined;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeTruthy();
      });
    });

    describe('false', () => {
      test('nodeIsUndefined', () => {
        expect(isYAMLNodeWithChildren(undefined)).toBeFalsy();
      });

      test('keyIsUndefined', () => {
        yamlNodeWithChildren.key = undefined;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('keyValueIsNumber', () => {
        yamlNodeWithChildren.key.value = 42;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('keyValueIsBoolean', () => {
        yamlNodeWithChildren.key.value = true;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('keyValueIsUndefined', () => {
        yamlNodeWithChildren.key.value = undefined;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('keyCommentBeforeIsNumber', () => {
        yamlNodeWithChildren.key.commentBefore = 42;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('keyCommentBeforeIsBoolean', () => {
        yamlNodeWithChildren.key.commentBefore = true;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('valueIsUndefined', () => {
        yamlNodeWithChildren.value = undefined;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('valueItemsIsUndefined', () => {
        yamlNodeWithChildren.value.items = undefined;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('valueItemsContainsString', () => {
        yamlNodeWithChildren.value.items.push('string');
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('valueItemsContainsNumber', () => {
        yamlNodeWithChildren.value.items.push(42);
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('valueItemsContainsBoolean', () => {
        yamlNodeWithChildren.value.items.push(true);
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('valueItemsContainsUndefined', () => {
        yamlNodeWithChildren.value.items.push(undefined);
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('valueItemsContainsNonYAMLNodeObject', () => {
        yamlNodeWithChildren.value.items.push({ attribute: 'value' });
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('valueCommentBeforeIsNumber', () => {
        yamlNodeWithChildren.value.commentBefore = 42;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });

      test('valueCommentBeforeIsBoolean', () => {
        yamlNodeWithChildren.value.commentBefore = true;
        expect(isYAMLNodeWithChildren(yamlNodeWithChildren)).toBeFalsy();
      });
    });
  });

  describe('isYAMLNodeWithoutChildren', () => {
    describe('true', () => {
      test('default', () => {
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeTruthy();
      });

      test('keyCommentBeforeIsUndefined', () => {
        yamlNodeWithoutChildren.key.commentBefore = undefined;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeTruthy();
      });

      test('valueValueIsNumber', () => {
        yamlNodeWithoutChildren.value.value = 42;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeTruthy();
      });

      test('valueValueIsBoolean', () => {
        yamlNodeWithoutChildren.value.value = true;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeTruthy();
      });

      test('valueCommentBeforeIsUndefined', () => {
        yamlNodeWithoutChildren.value.commentBefore = undefined;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeTruthy();
      });
    });

    describe('false', () => {
      test('nodeIsUndefined', () => {
        expect(isYAMLNodeWithoutChildren(undefined)).toBeFalsy();
      });

      test('keyIsUndefined', () => {
        yamlNodeWithoutChildren.key = undefined;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });

      test('keyValueIsNumber', () => {
        yamlNodeWithoutChildren.key.value = 42;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });

      test('keyValueIsBoolean', () => {
        yamlNodeWithoutChildren.key.value = true;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });

      test('keyValueIsUndefined', () => {
        yamlNodeWithoutChildren.key.value = undefined;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });

      test('keyCommentBeforeIsNumber', () => {
        yamlNodeWithoutChildren.key.commentBefore = 42;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });

      test('keyCommentBeforeIsBoolean', () => {
        yamlNodeWithoutChildren.key.commentBefore = true;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });

      test('valueIsUndefined', () => {
        yamlNodeWithoutChildren.value = undefined;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });

      test('valueValueIsUndefined', () => {
        yamlNodeWithoutChildren.value.value = undefined;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });

      test('valueCommentBeforeIsNumber', () => {
        yamlNodeWithoutChildren.value.commentBefore = 42;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });

      test('valueCommentBeforeIsBoolean', () => {
        yamlNodeWithoutChildren.value.commentBefore = true;
        expect(isYAMLNodeWithoutChildren(yamlNodeWithoutChildren)).toBeFalsy();
      });
    });
  });
});
