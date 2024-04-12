import type { RowSelectionState, Table, Updater } from '@tanstack/react-table';
import { createRow, createTable, getCoreRowModel } from '@tanstack/react-table';
import type { TestNode } from '../test-utils/types';
import { addChildToFirstSelectedRow, deleteFirstSelectedRow, getPathOfRow } from './tree';

let data: Array<TestNode>;
let newNode: TestNode;

let table: Table<TestNode>;
let onRowSelectionChangeValue: Updater<RowSelectionState>;

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

  table = createTable({
    columns: [],
    data: data,
    getCoreRowModel: getCoreRowModel(),
    onStateChange: () => {},
    onRowSelectionChange: (value: Updater<RowSelectionState>) => {
      onRowSelectionChangeValue = value;
    },
    getSubRows: row => row.children,
    renderFallbackValue: undefined,
    state: {}
  });
  onRowSelectionChangeValue = {};
});

describe('tree', () => {
  describe('addChildToFirstSelectedRow', () => {
    test('selection', () => {
      const originalData = structuredClone(data);
      table.getState().rowSelection = { '1.1': true };
      const addChildToFirstSelectedRowReturnValue = addChildToFirstSelectedRow(table, data, newNode);
      const newData = addChildToFirstSelectedRowReturnValue.newData;
      const selectedNode = addChildToFirstSelectedRowReturnValue.selectedNode;
      const newChildPath = addChildToFirstSelectedRowReturnValue.newChildPath;
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(selectedNode).toEqual(newData[1].children[1]);
      expect(newChildPath).toEqual([1, 1, 1]);
      expect(newData[1].children[1].children).toHaveLength(2);
      expect(newData[1].children[1].children[1]).toEqual(newNode);
      expect(onRowSelectionChangeValue).toEqual({ '1.1.1': true });
    });

    test('noSelection', () => {
      const originalData = structuredClone(data);
      table.getState().rowSelection = {};
      const addChildToFirstSelectedRowReturnValue = addChildToFirstSelectedRow(table, data, newNode);
      const newData = addChildToFirstSelectedRowReturnValue.newData;
      const selectedNode = addChildToFirstSelectedRowReturnValue.selectedNode;
      const newChildPath = addChildToFirstSelectedRowReturnValue.newChildPath;
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(selectedNode).toBeUndefined();
      expect(newChildPath).toEqual([2]);
      expect(newData).toHaveLength(3);
      expect(newData[2]).toEqual(newNode);
      expect(onRowSelectionChangeValue).toEqual({ '2': true });
    });
  });

  describe('deleteFirstSelectedRow', () => {
    describe('selection', () => {
      describe('root', () => {
        test('default', () => {
          const originalData = structuredClone(data);
          table.getState().rowSelection = { '0': true };
          const deleteFirstSelectedRowReturnValue = deleteFirstSelectedRow(table, data);
          const newData = deleteFirstSelectedRowReturnValue.newData;
          const selectedVariablePath = deleteFirstSelectedRowReturnValue.selectedVariablePath;
          expect(data).toEqual(originalData);
          expect(newData).not.toBe(data);
          expect(selectedVariablePath).toEqual([0]);
          expect(newData).toHaveLength(1);
          expect(newData[0]).toEqual(originalData[1]);
          expect(onRowSelectionChangeValue).toEqual({ '0': true });
        });

        test('lastChildInListOfChildren', () => {
          const originalData = structuredClone(data);
          table.getState().rowSelection = { '1': true };
          const deleteFirstSelectedRowReturnValue = deleteFirstSelectedRow(table, data);
          const newData = deleteFirstSelectedRowReturnValue.newData;
          const selectedVariablePath = deleteFirstSelectedRowReturnValue.selectedVariablePath;
          expect(data).toEqual(originalData);
          expect(newData).not.toBe(data);
          expect(selectedVariablePath).toEqual([0]);
          expect(newData).toHaveLength(1);
          expect(newData[0]).toEqual(originalData[0]);
          expect(onRowSelectionChangeValue).toEqual({ '0': true });
        });

        test('lastRemainingChild', () => {
          data = [{ name: 'NameNode0', value: 'ValueNode0', children: [] }];
          const originalData = structuredClone(data);
          table.getState().rowSelection = { '0': true };
          onRowSelectionChangeValue = { '0': true };
          const deleteFirstSelectedRowReturnValue = deleteFirstSelectedRow(table, data);
          const newData = deleteFirstSelectedRowReturnValue.newData;
          const selectedVariablePath = deleteFirstSelectedRowReturnValue.selectedVariablePath;
          expect(data).toEqual(originalData);
          expect(newData).not.toBe(data);
          expect(selectedVariablePath).toEqual([]);
          expect(newData).toHaveLength(0);
          expect(onRowSelectionChangeValue).toEqual({});
        });
      });

      describe('deep', () => {
        test('default', () => {
          const originalData = structuredClone(data);
          table.getState().rowSelection = { '1.0': true };
          const deleteFirstSelectedRowReturnValue = deleteFirstSelectedRow(table, data);
          const newData = deleteFirstSelectedRowReturnValue.newData;
          const selectedVariablePath = deleteFirstSelectedRowReturnValue.selectedVariablePath;
          expect(data).toEqual(originalData);
          expect(newData).not.toBe(data);
          expect(selectedVariablePath).toEqual([1, 0]);
          expect(newData[1].children).toHaveLength(1);
          expect(newData[1].children[0]).toEqual(originalData[1].children[1]);
          expect(onRowSelectionChangeValue).toEqual({ '1.0': true });
        });

        test('lastChildInListOfChildren', () => {
          const originalData = structuredClone(data);
          table.getState().rowSelection = { '1.1': true };
          const deleteFirstSelectedRowReturnValue = deleteFirstSelectedRow(table, data);
          const newData = deleteFirstSelectedRowReturnValue.newData;
          const selectedVariablePath = deleteFirstSelectedRowReturnValue.selectedVariablePath;
          expect(data).toEqual(originalData);
          expect(newData).not.toBe(data);
          expect(selectedVariablePath).toEqual([1, 0]);
          expect(newData[1].children).toHaveLength(1);
          expect(newData[1].children[0]).toEqual(originalData[1].children[0]);
          expect(onRowSelectionChangeValue).toEqual({ '1.0': true });
        });

        test('lastRemainingChild', () => {
          const originalData = structuredClone(data);
          table.getState().rowSelection = { '1.1.0': true };
          const deleteFirstSelectedRowReturnValue = deleteFirstSelectedRow(table, data);
          const newData = deleteFirstSelectedRowReturnValue.newData;
          const selectedVariablePath = deleteFirstSelectedRowReturnValue.selectedVariablePath;
          expect(data).toEqual(originalData);
          expect(newData).not.toBe(data);
          expect(selectedVariablePath).toEqual([1, 1]);
          expect(newData[1].children[1].children).toHaveLength(0);
          expect(onRowSelectionChangeValue).toEqual({ '1.1': true });
        });
      });
    });

    test('noSelection', () => {
      const originalData = structuredClone(data);
      table.getState().rowSelection = {};
      const deleteFirstSelectedRowReturnValue = deleteFirstSelectedRow(table, data);
      const newData = deleteFirstSelectedRowReturnValue.newData;
      const selectedVariablePath = deleteFirstSelectedRowReturnValue.selectedVariablePath;
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(selectedVariablePath).toEqual([]);
      expect(newData).toEqual(data);
      expect(onRowSelectionChangeValue).toEqual({});
    });
  });

  describe('getPathOfRow', () => {
    test('singleDigit', () => {
      expect(getPathOfRow(createRow(table, '1', newNode, 1, 0))).toEqual([1]);
    });

    test('multipleDigits', () => {
      expect(getPathOfRow(createRow(table, '1.3.2', newNode, 1, 0))).toEqual([1, 3, 2]);
    });

    test('missing', () => {
      expect(getPathOfRow(undefined)).toEqual([]);
    });
  });
});
