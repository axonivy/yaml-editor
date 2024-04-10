import {
  Button,
  ExpandableCell,
  ExpandableHeader,
  Fieldset,
  SelectRow,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader,
  useTableExpand,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import type { TreePath } from '../../../../types/config';
import { selectRow } from '../../../../utils/table';
import { addChildToFirstSelectedRow, deleteFirstSelectedRow, getPathOfRow } from '../../../../utils/tree';
import { Control } from '../../control/Control';
import type { Variable } from '../../data/Variable';

type VariablesProps = {
  variables: Array<Variable>;
  setVariables: (variables: Array<Variable>) => void;
  setSelectedVariablePath: (path: TreePath) => void;
};

export const Variables = ({ variables, setVariables, setSelectedVariablePath }: VariablesProps) => {
  const selection = useTableSelect<Variable>();
  const expanded = useTableExpand<Variable>();
  const columns: Array<ColumnDef<Variable, string>> = [
    {
      accessorKey: 'name',
      header: header => <ExpandableHeader name='Name' header={header} />,
      cell: cell => <ExpandableCell cell={cell} icon={cell.row.getCanExpand() ? IvyIcons.FolderOpen : IvyIcons.Note} />,
      minSize: 50
    },
    {
      accessorKey: 'value',
      header: () => <span>Value</span>,
      cell: cell => <div>{cell.getValue()}</div>
    }
  ];
  const table = useReactTable({
    ...selection.options,
    ...expanded.options,
    data: variables,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...expanded.tableState
    }
  });

  const addVariable = () => {
    const newVariables = structuredClone(variables);
    const newVariable: Variable = {
      name: '',
      value: '',
      description: '',
      metadata: 'none',
      children: []
    };

    const addChildToFirstSelectedRowReturnValue = addChildToFirstSelectedRow(table, newVariables, newVariable);
    const parentNode = addChildToFirstSelectedRowReturnValue.selectedNode;
    if (parentNode) {
      parentNode.value = '';
      parentNode.metadata = 'none';
    }

    setSelectedVariablePath(addChildToFirstSelectedRowReturnValue.newChildPath);
    setVariables(newVariables);
  };

  const deleteVariable = () => {
    const newVariables = structuredClone(variables);
    const selectedVariablePath = deleteFirstSelectedRow(table, newVariables);
    setSelectedVariablePath(selectedVariablePath);
    setVariables(newVariables);
  };

  const resetSelection = () => {
    selectRow(table);
    setSelectedVariablePath([]);
  };

  return (
    <Fieldset
      label='List of variables'
      control={
        <Control
          buttons={[
            <Button key='addButton' icon={IvyIcons.Plus} onClick={addVariable} />,
            <Button key='deleteButton' icon={IvyIcons.Trash} onClick={deleteVariable} disabled={!table.getIsSomeRowsSelected()} />
          ]}
        />
      }
    >
      <Table>
        <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <SelectRow key={row.id} row={row} onClick={() => setSelectedVariablePath(getPathOfRow(row))}>
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
