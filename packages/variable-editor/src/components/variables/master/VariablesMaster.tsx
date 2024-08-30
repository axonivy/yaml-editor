import {
  BasicField,
  Button,
  ExpandableCell,
  ExpandableHeader,
  selectRow,
  Table,
  TableBody,
  TableResizableHeader,
  useReadonly,
  useTableExpand,
  useTableSelect
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import type { DataContext, ValidationMessages } from '../../../protocol/types';
import { deleteFirstSelectedRow, useTreeGlobalFilter } from '../../../utils/tree/tree';
import { treeNodeNameAttribute, type TreePath } from '../../../utils/tree/types';
import { Control } from '../../control/Control';
import { validationMessagesOfRow } from '../data/validation-utils';
import { type Variable } from '../data/variable';
import { variableIcon } from '../data/variable-utils';
import { AddVariableDialog } from './AddVariableDialog';
import { OverwriteDialog } from './OverwriteDialog';
import { ValidationRow } from './ValidationRow';
import './VariablesMaster.css';

type VariablesProps = {
  context: DataContext;
  variables: Array<Variable>;
  setVariables: (variables: Array<Variable>) => void;
  setSelectedVariablePath: (path: TreePath) => void;
  validationMessages?: ValidationMessages;
};

export const VariablesMaster = ({ context, variables, setVariables, setSelectedVariablePath, validationMessages }: VariablesProps) => {
  const selection = useTableSelect<Variable>();
  const expanded = useTableExpand<Variable>();
  const globalFilter = useTreeGlobalFilter(variables);
  const columns: Array<ColumnDef<Variable, string>> = [
    {
      accessorKey: treeNodeNameAttribute,
      header: header => <ExpandableHeader name='Name' header={header} />,
      cell: cell => <ExpandableCell cell={cell} icon={variableIcon(cell.row.original)} />,
      minSize: 50
    },
    {
      accessorFn: (variable: Variable) => (variable.metadata.type === 'password' ? '***' : variable.value),
      header: 'Value',
      cell: cell => <div>{cell.getValue()}</div>
    }
  ];
  const table = useReactTable({
    ...selection.options,
    ...expanded.options,
    ...globalFilter.options,
    data: variables,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...selection.tableState,
      ...expanded.tableState,
      ...globalFilter.tableState
    }
  });

  const deleteVariable = () => {
    const deleteFirstSelectedRowReturnValue = deleteFirstSelectedRow(table, variables);
    setSelectedVariablePath(deleteFirstSelectedRowReturnValue.selectedVariablePath);
    setVariables(deleteFirstSelectedRowReturnValue.newData);
  };

  const resetSelection = () => {
    selectRow(table);
    setSelectedVariablePath([]);
  };

  const readonly = useReadonly();
  const controls = [];
  if (!readonly) {
    controls.push(
      <AddVariableDialog
        key='addButton'
        table={table}
        variables={variables}
        setVariables={setVariables}
        setSelectedVariablePath={setSelectedVariablePath}
      />,
      <OverwriteDialog
        context={context}
        table={table}
        variables={variables}
        setVariables={setVariables}
        setSelectedVariablePath={setSelectedVariablePath}
      />,
      <Button
        key='deleteButton'
        icon={IvyIcons.Trash}
        onClick={deleteVariable}
        disabled={table.getSelectedRowModel().flatRows.length === 0}
        aria-label='Delete variable'
      />
    );
  }

  return (
    <>
      <BasicField className='variable-wrapper' label='List of variables' control={<Control buttons={controls} />}>
        {globalFilter.filter}
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={resetSelection} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow
                key={row.id}
                row={row}
                setSelectedVariablePath={setSelectedVariablePath}
                validationMessages={validationMessagesOfRow(row, validationMessages)}
              />
            ))}
          </TableBody>
        </Table>
      </BasicField>
    </>
  );
};
