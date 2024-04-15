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
import { selectRow } from '../../../utils/table/table';
import { addChildToFirstSelectedRow, deleteFirstSelectedRow, getPathOfRow } from '../../../utils/tree/tree';
import { treeNodeNameAttribute, treeNodeValueAttribute, type TreePath } from '../../../utils/tree/types';
import { Control } from '../../control/Control';
import { type Variable } from '../data/variable';

type VariablesProps = {
  variables: Array<Variable>;
  setVariables: (variables: Array<Variable>) => void;
  setSelectedVariablePath: (path: TreePath) => void;
};

export const VariablesMaster = ({ variables, setVariables, setSelectedVariablePath }: VariablesProps) => {
  const selection = useTableSelect<Variable>();
  const expanded = useTableExpand<Variable>();
  const columns: Array<ColumnDef<Variable, string>> = [
    {
      accessorKey: treeNodeNameAttribute,
      header: header => <ExpandableHeader name='Name' header={header} />,
      cell: cell => <ExpandableCell cell={cell} icon={cell.row.getCanExpand() ? IvyIcons.FolderOpen : IvyIcons.Note} />,
      minSize: 50
    },
    {
      accessorKey: treeNodeValueAttribute,
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
    const newVariable: Variable = {
      name: '',
      value: '',
      description: '',
      metadata: { type: '' },
      children: []
    };

    const addChildToFirstSelectedRowReturnValue = addChildToFirstSelectedRow(table, variables, newVariable);
    const parentNode = addChildToFirstSelectedRowReturnValue.selectedNode;
    if (parentNode) {
      parentNode.value = '';
      parentNode.metadata = { type: '' };
    }

    setSelectedVariablePath(addChildToFirstSelectedRowReturnValue.newChildPath);
    setVariables(addChildToFirstSelectedRowReturnValue.newData);
  };

  const deleteVariable = () => {
    const deleteFirstSelectedRowReturnValue = deleteFirstSelectedRow(table, variables);
    setSelectedVariablePath(deleteFirstSelectedRowReturnValue.selectedVariablePath);
    setVariables(deleteFirstSelectedRowReturnValue.newData);
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
