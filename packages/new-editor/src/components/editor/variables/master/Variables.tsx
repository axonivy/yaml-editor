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
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import { useState } from 'react';
import { Control } from '../../control/Control';
import type { Variable } from '../../data/Variable';

type VariablesProps = {
  variables: Variable[];
  setSelectedVariable: (selectedVariable?: Variable) => void;
};

type TreePath = Array<number>;

export const Variables = ({ variables: propsVariables, setSelectedVariable }: VariablesProps) => {
  const [variables, setVariables] = useState<Variable[]>(propsVariables);

  const selection = useTableSelect<Variable>();
  const expanded = useTableExpand<Variable>();
  const columns: ColumnDef<Variable, string>[] = [
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

  const getParentPath = (row: Row<Variable>) => {
    const parentId = row.parentId;
    if (!parentId) {
      return [];
    }
    return parentId.split('.').map(index => Number(index));
  };

  const getVariable = (variables: Variable[], path: TreePath): Variable | undefined => {
    if (path.length === 0) {
      return;
    }
    return getVariableRecursive(variables, [...path]);
  };

  const getVariableRecursive = (variables: Variable[], path: TreePath): Variable => {
    const variable = variables[path.shift()!];
    if (path.length === 0) {
      return variable;
    }
    return getVariableRecursive(variable.children, path);
  };

  const selectVariable = (path: TreePath, variable?: Variable) => {
    setSelectedVariable(variable);
    if (path.length === 0) {
      selection.options.onRowSelectionChange({});
    } else {
      selection.options.onRowSelectionChange({ [`${path.join('.')}`]: true });
    }
  };

  const adjustSelectionBeforeDeletion = (index: number, children: Variable[], parentPath: TreePath, parent?: Variable) => {
    switch (children.length) {
      // variable is the last remaining child of its parent -> select parent
      case 1:
        selectVariable(parentPath, parent);
        break;
      // variable is the last child in the list of children of its parent -> select previous variable
      case index + 1:
        selectVariable([...parentPath, index - 1], children[index - 1]);
        break;
      // select next variable
      default:
        setSelectedVariable(children[index + 1]);
        break;
    }
  };

  const addVariable = () => {}; // TODO: Implementation

  const deleteVariable = () => {
    const selectedRow = getSelectedRow();
    const parentPath = getParentPath(selectedRow);
    const index = selectedRow.index;
    const newVariables = structuredClone(variables);

    const parent = getVariable(newVariables, parentPath);
    const children = parent ? parent.children : newVariables;
    adjustSelectionBeforeDeletion(index, children, parentPath, parent);

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
            setSelectedVariable();
          }}
        />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <SelectRow key={row.id} row={row} onClick={() => setSelectedVariable(row.original)}>
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
