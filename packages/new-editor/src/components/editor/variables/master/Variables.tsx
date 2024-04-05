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
import { getVariable } from '../../../../data/data';
import type { TreePath } from '../../../../types/config';
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

  const getSelectedRow = () => {
    return table.getRowModel().rowsById[Object.keys(selection.tableState.rowSelection!)[0]];
  };

  const getPath = (id?: string) => {
    if (!id) {
      return [];
    }
    return id.split('.').map(index => Number(index));
  };

  const selectVariable = (path: TreePath) => {
    setSelectedVariablePath(path);
    if (path.length === 0) {
      selection.options.onRowSelectionChange({});
    } else {
      selection.options.onRowSelectionChange({ [`${path.join('.')}`]: true });
    }
  };

  const adjustSelectionBeforeDeletion = (index: number, children: Array<Variable>, parentPath: TreePath) => {
    switch (children.length) {
      // variable is the last remaining child of its parent -> select parent
      case 1:
        selectVariable(parentPath);
        break;
      // variable is the last child in the list of children of its parent -> select previous variable
      case index + 1:
        selectVariable([...parentPath, index - 1]);
        break;
      // select next variable
      default:
        setSelectedVariablePath([...parentPath, index + 1]);
        break;
    }
  };

  const addVariable = () => {
    const selectedRow = getSelectedRow();
    const path = getPath(selectedRow?.id);
    const newVariables = structuredClone(variables);

    const parent = getVariable(newVariables, path);
    const children = parent ? parent.children : newVariables;

    if (parent) {
      parent.value = '';
      parent.metadata = 'none';
    }
    const newVariable = {
      name: '',
      value: '',
      description: '',
      metadata: 'none',
      children: []
    };
    children.push(newVariable);
    setVariables(newVariables);

    selectVariable([...path, children.length - 1]);
  };

  const deleteVariable = () => {
    const selectedRow = getSelectedRow();
    const parentPath = getPath(selectedRow.parentId);
    const index = selectedRow.index;
    const newVariables = structuredClone(variables);

    const parent = getVariable(newVariables, parentPath);
    const children = parent ? parent.children : newVariables;
    adjustSelectionBeforeDeletion(index, children, parentPath);

    children.splice(index, 1);
    setVariables(newVariables);
  };

  return (
    <Fieldset
      label='List of variables'
      control={
        <Control
          buttons={[
            <Button key='addButton' icon={IvyIcons.Plus} onClick={addVariable} />,
            <Button
              key='deleteButton'
              icon={IvyIcons.Trash}
              onClick={deleteVariable}
              disabled={Object.entries(selection.tableState.rowSelection!).length === 0}
            />
          ]}
        />
      }
    >
      <Table>
        <TableResizableHeader
          headerGroups={table.getHeaderGroups()}
          onClick={() => {
            selection.options.onRowSelectionChange({});
            setSelectedVariablePath([]);
          }}
        />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <SelectRow key={row.id} row={row} onClick={() => setSelectedVariablePath(getPath(row.id))}>
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
