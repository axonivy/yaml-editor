import { MessageRow, SelectRow, TableCell, type MessageData } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';
import { useAppContext } from '../../../context/AppContext';
import { getPathOfRow } from '../../../utils/tree/tree';
import { rowClass, toMessageData, validationMessagesOfRow } from '../data/validation-utils';
import type { Variable } from '../data/variable';
import './ValidationRow.css';

type ValidationRowProps = {
  row: Row<Variable>;
};

export const ValidationRow = ({ row }: ValidationRowProps) => {
  const { setSelectedVariable, validationMessages } = useAppContext();
  const messages = validationMessagesOfRow(row, validationMessages).map<MessageData>(toMessageData);
  return (
    <>
      <SelectRow row={row} onClick={() => setSelectedVariable(getPathOfRow(row))} className={rowClass(messages)}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </SelectRow>
      {messages.map((validationMessage, index) => (
        <MessageRow key={index} columnCount={2} message={validationMessage} />
      ))}
    </>
  );
};
