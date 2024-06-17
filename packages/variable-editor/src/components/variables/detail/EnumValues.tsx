import { Button, Fieldset, InputCell, SelectRow, Table, TableBody, TableCell, useTableSelect } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { addRow, deleteFirstSelectedRow } from '../../../utils/table/table';
import { updateRowData } from '../../../utils/table/table-data';
import { treeNodeValueAttribute } from '../../../utils/tree/types';
import { Control } from '../../control/Control';
import { toEnumMetadataUpdate } from '../data/metadata';
import { type VariableUpdates } from '../data/variable';

type EnumValuesProps = {
  selectedValue: string;
  values: Array<string>;
  onChange: (updates: VariableUpdates) => void;
};

export const EnumValues = ({ selectedValue: value, values, onChange }: EnumValuesProps) => {
  const selection = useTableSelect<string>();
  const columns: Array<ColumnDef<string, string>> = [
    {
      accessorFn: (value: string) => value,
      header: 'Value',
      cell: cell => <InputCell cell={cell} />
    }
  ];
  const meta = {
    updateData: (rowId: string, _columnId: string, value: string) => {
      if (values.includes(value)) {
        return;
      }
      const newValues = updateRowData(values, Number(rowId), value);
      onChange([toEnumMetadataUpdate(newValues)]);
    }
  };
  const table = useReactTable({
    ...selection.options,
    data: values,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState
    },
    meta: meta
  });

  const addValue = () => {
    const newValues = addRow(table, values, '');
    onChange([toEnumMetadataUpdate(newValues)]);
  };

  const deleteValue = () => {
    const newValues = deleteFirstSelectedRow(table, values);
    const updates: VariableUpdates = [toEnumMetadataUpdate(newValues)];
    if (!newValues.includes(value)) {
      updates.push({ key: treeNodeValueAttribute, value: '' });
    }
    onChange(updates);
  };

  return (
    <Fieldset
      label='List of possible values'
      control={
        <Control
          buttons={[
            <Button key='addButton' icon={IvyIcons.Plus} onClick={addValue} aria-label='Add value' />,
            <Button
              key='deleteButton'
              icon={IvyIcons.Trash}
              onClick={deleteValue}
              disabled={!table.getIsSomeRowsSelected()}
              aria-label='Delete value'
            />
          ]}
        />
      }
    >
      <Table>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <SelectRow key={row.id} row={row}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </SelectRow>
          ))}
        </TableBody>
      </Table>
    </Fieldset>
  );
};
