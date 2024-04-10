import type { RowSelectionState, Table, Updater } from '@tanstack/react-table';
import { createTable, getCoreRowModel } from '@tanstack/react-table';
import type { TestData } from '../test-utils/types';
import { getFirstSelectedRow, selectRow } from './table';

let data: Array<TestData>;

let table: Table<TestData>;
let onRowSelectionChangeValue: Updater<RowSelectionState>;

beforeEach(() => {
  data = [
    { name: 'NameData0', value: 'ValueData0' },
    { name: 'NameData1', value: 'ValueData1' },
    { name: 'NameData2', value: 'ValueData2' }
  ];

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
      expect(onRowSelectionChangeValue).toEqual({});
      selectRow(table, '1');
      expect(onRowSelectionChangeValue).toEqual({ '1': true });
    });

    describe('rowIdNotSupplied', () => {
      test('undefined', () => {
        expect(onRowSelectionChangeValue).toEqual({});
        selectRow(table, undefined);
        expect(onRowSelectionChangeValue).toEqual({});
      });

      test('empty', () => {
        expect(onRowSelectionChangeValue).toEqual({});
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
});
