import type { RowSelectionState, Table, Updater } from '@tanstack/react-table';
import { createTable, getCoreRowModel } from '@tanstack/react-table';
import { addRow, deleteFirstSelectedRow, getFirstSelectedRow, selectRow } from './table';
import type { TestData } from '../test-utils/types';

let data: Array<TestData>;
let newRowData: TestData;

let table: Table<TestData>;
let onRowSelectionChangeValue: Updater<RowSelectionState>;

beforeEach(() => {
  data = [
    { name: 'NameData0', value: 'ValueData0' },
    { name: 'NameData1', value: 'ValueData1' },
    { name: 'NameData2', value: 'ValueData2' }
  ];
  newRowData = { name: 'newDataName', value: 'newDataValue' };

  table = createTable({
    columns: [],
    data: data,
    getCoreRowModel: getCoreRowModel(),
    onStateChange: () => {},
    onRowSelectionChange: (value: Updater<RowSelectionState>) => {
      onRowSelectionChangeValue = value;
    },
    renderFallbackValue: undefined,
    state: {}
  });
  onRowSelectionChangeValue = {};
});

describe('table', () => {
  describe('selectRow', () => {
    test('default', () => {
      selectRow(table, '1');
      expect(onRowSelectionChangeValue).toEqual({ '1': true });
    });

    describe('rowIdNotProvided', () => {
      test('undefined', () => {
        onRowSelectionChangeValue = { '1': true };
        selectRow(table, undefined);
        expect(onRowSelectionChangeValue).toEqual({});
      });

      test('empty', () => {
        onRowSelectionChangeValue = { '1': true };
        selectRow(table, '');
        expect(onRowSelectionChangeValue).toEqual({});
      });
    });
  });

  describe('getFirstSelectedRow', () => {
    test('present', () => {
      table.getState().rowSelection = { '1': true };
      const selectedRow = getFirstSelectedRow(table);
      expect(selectedRow).toBeDefined();
      expect(selectedRow!.original).toEqual(data[1]);
    });

    describe('missing', () => {
      test('empty', () => {
        table.getState().rowSelection = {};
        expect(getFirstSelectedRow(table)).toBeUndefined();
      });

      test('notFound', () => {
        table.getState().rowSelection = { '42': true };
        expect(getFirstSelectedRow(table)).toBeUndefined();
      });
    });
  });

  test('addRow', () => {
    const originalData = structuredClone(data);
    const newData = addRow(table, data, newRowData);
    expect(data).toEqual(originalData);
    expect(newData).not.toBe(data);
    expect(newData).toHaveLength(4);
    expect(newData[3]).toEqual(newRowData);
    expect(onRowSelectionChangeValue).toEqual({ '3': true });
  });

  describe('deleteFirstSelectedRow', () => {
    test('default', () => {
      const originalData = structuredClone(data);
      table.getState().rowSelection = { '1': true };
      onRowSelectionChangeValue = { '1': true };
      const newData = deleteFirstSelectedRow(table, data);
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newData).toHaveLength(2);
      expect(newData[0]).toEqual(data[0]);
      expect(newData[1]).toEqual(data[2]);
      expect(onRowSelectionChangeValue).toEqual({ '1': true });
    });

    test('lastElementInList', () => {
      const originalData = structuredClone(data);
      table.getState().rowSelection = { '2': true };
      const newData = deleteFirstSelectedRow(table, data);
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newData).toHaveLength(2);
      expect(newData[0]).toEqual(data[0]);
      expect(newData[1]).toEqual(data[1]);
      expect(onRowSelectionChangeValue).toEqual({ '1': true });
    });

    test('lastRemainingElement', () => {
      data = [{ name: 'NameData0', value: 'ValueData0' }];
      const originalData = structuredClone(data);
      table.getState().rowSelection = { '0': true };
      onRowSelectionChangeValue = { '0': true };
      const newData = deleteFirstSelectedRow(table, data);
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newData).toHaveLength(0);
      expect(onRowSelectionChangeValue).toEqual({});
    });

    test('noSelection', () => {
      const originalData = structuredClone(data);
      table.getState().rowSelection = {};
      const newData = deleteFirstSelectedRow(table, data);
      expect(data).toEqual(originalData);
      expect(newData).not.toBe(data);
      expect(newData).toEqual(data);
      expect(onRowSelectionChangeValue).toEqual({});
    });
  });
});
