import type { TestNode } from '../test-utils/types';
import { addNode, getNode, hasChildren, removeNode, updateNode } from './data';

let data: Array<TestNode>;
let newNode: TestNode;

beforeEach(() => {
  data = [
    { name: 'NameNode0', value: 'ValueNode0', children: [] },
    {
      name: 'NameNode1',
      value: 'ValueNode1',
      children: [
        { name: 'NameNode1.0', value: 'ValueNode1.0', children: [] },
        {
          name: 'NameNode1.1',
          value: 'ValueNode1.1',
          children: [
            {
              name: 'NameNode1.1.0',
              value: 'ValueNode1.1.0',
              children: [{ name: 'NameNode1.1.0.0', value: 'ValueNode1.1.0.0', children: [] }]
            }
          ]
        }
      ]
    }
  ];
  newNode = {
    name: 'newNodeName',
    value: 'newNodeValue',
    children: []
  };
});

describe('data', () => {
  describe('getNode', () => {
    describe('present', () => {
      test('root', () => {
        expect(getNode(data, [0])).toEqual(data[0]);
      });

      test('deep', () => {
        expect(getNode(data, [1, 1, 0])).toEqual(data[1].children[1].children[0]);
      });
    });

    describe('missing', () => {
      test('root', () => {
        expect(getNode(data, [42])).toBeUndefined();
      });

      test('deep', () => {
        expect(getNode(data, [1, 1, 42])).toBeUndefined();
      });
    });

    describe('pathNotSupplied', () => {
      test('undefined', () => {
        expect(getNode(data, undefined)).toBeUndefined();
      });

      test('empty', () => {
        expect(getNode(data, [])).toBeUndefined();
      });
    });
  });

  describe('updateNode', () => {
    test('present', () => {
      expect(data[1].children[0].value).toEqual('ValueNode1.0');
      updateNode(data, [1, 0], 'value', 'newValue');
      expect(data[1].children[0].value).toEqual('newValue');
    });

    test('missing', () => {
      const originalData = structuredClone(data);
      updateNode(data, [42], 'value', 'newValue');
      expect(data).toEqual(originalData);
    });
  });

  describe('addNode', () => {
    describe('present', () => {
      test('root', () => {
        expect(data).toHaveLength(2);
        expect(addNode(data, [], newNode)).toEqual(2);
        expect(data).toHaveLength(3);
        expect(data[2]).toEqual(newNode);
      });

      test('deep', () => {
        expect(data[1].children[1].children).toHaveLength(1);
        expect(addNode(data, [1, 1], newNode)).toEqual(1);
        expect(data[1].children[1].children).toHaveLength(2);
        expect(data[1].children[1].children[1]).toEqual(newNode);
      });
    });

    test('missing', () => {
      expect(data).toHaveLength(2);
      expect(addNode(data, [42], newNode)).toEqual(2);
      expect(data).toHaveLength(3);
      expect(data[2]).toEqual(newNode);
    });
  });

  describe('removeNode', () => {
    describe('present', () => {
      test('root', () => {
        const originalData = structuredClone(data);
        expect(data).toHaveLength(2);
        removeNode(data, [1]);
        expect(data).toHaveLength(1);
        expect(data[0]).toEqual(originalData[0]);
      });

      test('deep', () => {
        expect(data[1].children[1].children).toHaveLength(1);
        removeNode(data, [1, 1, 0]);
        expect(data[1].children[1].children).toHaveLength(0);
      });
    });

    test('missing', () => {
      const originalData = structuredClone(data);
      removeNode(data, [42]);
      expect(data).toEqual(originalData);
    });
  });

  describe('hasChildren', () => {
    test('true', () => {
      expect(hasChildren(data[1])).toBeTruthy();
    });

    test('false', () => {
      expect(hasChildren(data[0])).toBeFalsy();
    });
  });
});
