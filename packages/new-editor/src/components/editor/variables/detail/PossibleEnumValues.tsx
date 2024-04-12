import { Button, Fieldset, InputCell, SelectRow, Table, TableBody, TableCell, useTableSelect } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { addRow, deleteFirstSelectedRow } from '../../../../utils/table';
import { updateRowData } from '../../../../data/table-data';
import { treeNodeValueAttribute } from '../../../../types/config';
import { Control } from '../../control/Control';
import { toEnumMetadataUpdate, type VariableUpdates } from '../../data/Variable';

type PossibleEnumValuesProps = {
  selectedValue: string;
  values: Array<string>;
  onChange: (updates: VariableUpdates) => void;
};

export const PossibleEnumValues = ({ selectedValue: value, values, onChange }: PossibleEnumValuesProps) => {
  const selection = useTableSelect<string>();
  const columns: Array<ColumnDef<string, string>> = [
    {
      accessorFn: (value: string) => value,
      header: 'Value',
      cell: cell => <InputCell cell={cell} />
    }
  ];
  const meta = {
    updateData: (rowId: string, _columnId: string, value: unknown) => {
      const newValues = updateRowData(values, Number(rowId), String(value));
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

  const addPossibleValue = () => {
    const newValues = addRow(table, values, '');
    onChange([toEnumMetadataUpdate(newValues)]);
  };

  const deletePossibleValue = () => {
    const newValues = deleteFirstSelectedRow(table, values);
    const updates: VariableUpdates = [toEnumMetadataUpdate(newValues)];
    if (!newValues.includes(value)) {
      updates.push({ key: treeNodeValueAttribute, value: '' });
    }
    onChange(updates);
  };

  return (
    <Fieldset
      label='List of possible Values'
      control={
        <Control
          buttons={[
            <Button key='addButton' icon={IvyIcons.Plus} onClick={addPossibleValue} />,
            <Button key='deleteButton' icon={IvyIcons.Trash} onClick={deletePossibleValue} disabled={!table.getIsSomeRowsSelected()} />
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
