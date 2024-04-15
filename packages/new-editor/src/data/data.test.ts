import type { TestNode } from '../test-utils/types';
import { addNode, getNode, hasChildren, removeNode, updateNode } from './data';
import { treeNodeNameAttribute, treeNodeValueAttribute, type TreeNodeUpdates } from '../types/config';

let data: Array<TestNode>;
let nodeUpdates: TreeNodeUpdates<TestNode>;
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
  nodeUpdates = [
    { key: treeNodeNameAttribute, value: 'newName' },
    { key: treeNodeValueAttribute, value: 'newValue' }
  ];
  newNode = {
    name: 'newNodeName',
    value: 'newNodeValue',
    children: []
  };
});

describe('tree-data', () => {
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

    describe('pathNotProvided', () => {
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
      const originalData = structuredClone(data);
      const newData = updateNode(data, [1, 0], nodeUpdates);
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newData[1].children[0].name).toEqual('newName');
      expect(newData[1].children[0].value).toEqual('newValue');
    });

    test('missing', () => {
      const originalData = structuredClone(data);
      const newData = updateNode(data, [42], nodeUpdates);
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newData).toEqual(data);
    });
  });

  describe('addNode', () => {
    describe('present', () => {
      test('root', () => {
        const originalData = structuredClone(data);
        const addNodeReturnValue = addNode(data, [], newNode);
        const newData = addNodeReturnValue.newData;
        const newChildIndex = addNodeReturnValue.newChildIndex;
        expect(data).toEqual(originalData);
        expect(newData).not.toBe(data);
        expect(newChildIndex).toEqual(2);
        expect(newData).toHaveLength(3);
        expect(newData[2]).toEqual(newNode);
      });

      test('deep', () => {
        const originalData = structuredClone(data);
        const addNodeReturnValue = addNode(data, [1, 1], newNode);
        const newData = addNodeReturnValue.newData;
        const newChildIndex = addNodeReturnValue.newChildIndex;
        expect(data).toEqual(originalData);
        expect(newData).not.toBe(data);
        expect(newChildIndex).toEqual(1);
        expect(newData[1].children[1].children).toHaveLength(2);
        expect(newData[1].children[1].children[1]).toEqual(newNode);
      });
    });

    test('missing', () => {
      const originalData = structuredClone(data);
      const addNodeReturnValue = addNode(data, [42], newNode);
      const newData = addNodeReturnValue.newData;
      const newChildIndex = addNodeReturnValue.newChildIndex;
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newChildIndex).toEqual(2);
      expect(newData).toHaveLength(3);
      expect(newData[2]).toEqual(newNode);
    });
  });

  describe('removeNode', () => {
    describe('present', () => {
      test('root', () => {
        const originalData = structuredClone(data);
        const newData = removeNode(data, [1]);
        expect(data).toEqual(originalData);
        expect(newData).not.toBe(data);
        expect(newData).toHaveLength(1);
        expect(newData[0]).toEqual(data[0]);
      });

      test('deep', () => {
        const originalData = structuredClone(data);
        const newData = removeNode(data, [1, 1, 0]);
        expect(data).toEqual(originalData);
        expect(newData).not.toBe(data);
        expect(newData[1].children[1].children).toHaveLength(0);
      });
    });

    test('missing', () => {
      const originalData = structuredClone(data);
      const newData = removeNode(data, [42]);
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newData).toEqual(data);
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
