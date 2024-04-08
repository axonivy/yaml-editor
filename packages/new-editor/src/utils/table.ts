import type { Table } from '@tanstack/react-table';

export const selectRow = <TNode>(table: Table<TNode>, rowId?: string) => {
  if (!rowId || rowId === '') {
    table.setRowSelection({});
  } else {
    table.setRowSelection({ [`${rowId}`]: true });
  }
};

export const getFirstSelectedRow = <TNode>(table: Table<TNode>) => {
  return getRow(table, Object.keys(table.getState().rowSelection)[0]);
};

const getRow = <TNode>(table: Table<TNode>, rowId?: string) => {
  if (!rowId || rowId === '') {
    return;
  }
  return table.getRowModel().rowsById[rowId];
};

export const hasSelectedRows = <TNode>(table: Table<TNode>) => {
  return Object.entries(table.getState().rowSelection).length !== 0;
};
