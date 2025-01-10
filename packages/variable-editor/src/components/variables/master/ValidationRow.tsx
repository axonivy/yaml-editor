import { MessageRow, SelectRow, TableCell } from '@axonivy/ui-components';
import type { Severity, ValidationMessages } from '@axonivy/variable-editor-protocol';
import { flexRender, type Row } from '@tanstack/react-table';
import { useAppContext } from '../../../context/AppContext';
import { useValidations } from '../../../context/useValidation';
import { getPathOfRow, toTreePath } from '../../../utils/tree/tree';
import type { Variable } from '../data/variable';
import './ValidationRow.css';

type ValidationRowProps = {
  row: Row<Variable>;
};

export const ValidationRow = ({ row }: ValidationRowProps) => {
  const { setSelectedVariable } = useAppContext();
  const validations = useValidations(toTreePath(row.id));
  return (
    <>
      <SelectRow row={row} onClick={() => setSelectedVariable(getPathOfRow(row))} className={rowClass(validations)}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </SelectRow>
      {validations
        .filter(val => val.severity !== 'INFO')
        .map((val, index) => (
          <MessageRow
            key={index}
            columnCount={2}
            message={{ message: val.message, variant: val.severity.toLocaleLowerCase() as Lowercase<Severity> }}
          />
        ))}
    </>
  );
};

export const rowClass = (messages: ValidationMessages) => {
  if (messages.find(message => message.severity === 'ERROR')) {
    return 'row-error';
  }
  if (messages.find(message => message.severity === 'WARNING')) {
    return 'row-warning';
  }
  return '';
};
