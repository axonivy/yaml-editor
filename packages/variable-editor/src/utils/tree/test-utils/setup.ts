import type { RowSelectionState, Updater } from '@tanstack/react-table';
import { createTable, getCoreRowModel } from '@tanstack/react-table';

export const setupData = () => {
  return [
    { name: 'NameNode0', value: 'ValueNode0', children: [] },
    {
      name: 'NameNode1',
      value: 'ValueNode1',
      children: [
        { name: 'NameNode10', value: 'ValueNode10', children: [] },
        {
          name: 'NameNode11',
          value: 'ValueNode11',
          children: [
            {
              name: 'NameNode110',
              value: 'ValueNode110',
              children: [{ name: 'NameNode1100', value: 'ValueNode1100', children: [] }]
            }
          ]
        }
      ]
    }
  ];
};

export const setupTable = () => {
  const data = setupData();
  const onRowSelectionChangeValues: Array<Updater<RowSelectionState>> = [];
  const table = createTable({
    columns: [],
    data: data,
    getCoreRowModel: getCoreRowModel(),
    onStateChange: () => {},
    onRowSelectionChange: (value: Updater<RowSelectionState>) => {
      onRowSelectionChangeValues.push(value);
    },
    getSubRows: row => row.children,
    renderFallbackValue: undefined,
    state: {}
  });
  return { data, table, onRowSelectionChangeValues };
};

export const setupSearchData = () => {
  return [
    { name: 'SearchForParentName', value: '', children: [{ name: 'SearchForChildName', value: 'SearchForChildValue', children: [] }] }
  ];
};
