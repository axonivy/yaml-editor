import { MessageRow, SelectRow, TableCell, type MessageData } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';
import { useAppContext } from '../../../context/AppContext';
import { getPathOfRow, keyOfRow } from '../../../utils/tree/tree';
import type { Variable } from '../data/variable';
import './ValidationRow.css';
import { useValidations } from '../../../context/useValidation';

type ValidationRowProps = {
  row: Row<Variable>;
};

export const rowClass = (messages: Array<MessageData>) => {
  if (messages.find(message => message.variant === 'error')) {
    return 'row-error';
  }
  if (messages.find(message => message.variant === 'warning')) {
    return 'row-warning';
  }
  return '';
};

export const ValidationRow = ({ row }: ValidationRowProps) => {
  const { setSelectedVariable } = useAppContext();
  const validations = useValidations(keyOfRow(row));
  return (
    <>
      <SelectRow row={row} onClick={() => setSelectedVariable(getPathOfRow(row))} className={rowClass(validations)}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </SelectRow>
      {validations.map((message, index) => (
        <MessageRow key={index} columnCount={2} message={message} />
      ))}
    </>
  );
};
