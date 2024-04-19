import type { Row, Table } from '@tanstack/react-table';

export const selectRow = <TData>(table: Table<TData>, rowId?: string) => {
  if (!rowId || rowId === '') {
    table.setRowSelection({});
  } else {
    table.setRowSelection({ [`${rowId}`]: true });
  }
};

export const getFirstSelectedRow = <TData>(table: Table<TData>) => {
  return getRow(table, Object.keys(table.getState().rowSelection)[0]);
};

const getRow = <TData>(table: Table<TData>, rowId?: string) => {
  if (!rowId || rowId === '') {
    return;
  }
  return table.getRowModel().rowsById[rowId];
};

export const addRow = <TData>(table: Table<TData>, data: Array<TData>, newRowData: TData) => {
  const newData = structuredClone(data);
  newData.push(newRowData);
  selectRow(table, String(newData.length - 1));
  return newData;
};

export const deleteFirstSelectedRow = <TData>(table: Table<TData>, data: Array<TData>) => {
  const newData = structuredClone(data);
  const selectedRow = getFirstSelectedRow(table);
  if (!selectedRow) {
    return newData;
  }
  newData.splice(selectedRow.index, 1);
  adjustSelectionAfterDeletionOfRow(newData, table, selectedRow);
  return newData;
};

const adjustSelectionAfterDeletionOfRow = <TData>(data: Array<TData>, table: Table<TData>, row: Row<TData>) => {
  if (data.length === 0) {
    selectRow(table);
  } else if (row.index === data.length) {
    selectRow(table, String(data.length - 1));
  }
};

/* workaround for "table.getIsSomeRowsSelected" as it returns false if only last remaining row is selected */
export const isRowSelected = <TData>(table: Table<TData>) => Object.keys(table.getState().rowSelection).length > 0;
