import { MessageRow, SelectRow, TableCell } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';
import { useAppContext } from '../../../context/AppContext';
import type { ValidationMessages } from '@axonivy/variable-editor-protocol';
import { getPathOfRow } from '../../../utils/tree/tree';
import { containsError, containsWarning, toValidationMessageVariant, validationMessagesOfRow } from '../data/validation-utils';
import type { Variable } from '../data/variable';
import './ValidationRow.css';

type ValidationRowProps = {
  row: Row<Variable>;
};

export const ValidationRow = ({ row }: ValidationRowProps) => {
  const { setSelectedVariable, validationMessages } = useAppContext();

  const messages = validationMessagesOfRow(row, validationMessages);

  const rowClass = (validationMessages: ValidationMessages) => {
    if (containsError(validationMessages)) {
      return 'row-error';
    }
    if (containsWarning(validationMessages)) {
      return 'row-warning';
    }
    return '';
  };

  return (
    <>
      <SelectRow row={row} onClick={() => setSelectedVariable(getPathOfRow(row))} className={rowClass(messages)}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </SelectRow>
      {messages.map((validationMessage, index) => (
        <MessageRow
          key={index}
          columnCount={2}
          message={{ message: validationMessage.message, variant: toValidationMessageVariant(validationMessage.severity) }}
        />
      ))}
    </>
  );
};
