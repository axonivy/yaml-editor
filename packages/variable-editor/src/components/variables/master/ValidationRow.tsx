import { MessageRow, SelectRow, TableCell } from '@axonivy/ui-components';
import type { Severity, ValidationMessages } from '@axonivy/variable-editor-protocol';
import { flexRender, type Row } from '@tanstack/react-table';
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual';
import { useValidations } from '../../../context/useValidation';
import { toTreePath } from '../../../utils/tree/tree';
import type { Variable } from '../data/variable';
import './ValidationRow.css';
import { ROW_HEIGHT } from './VariablesMasterContent';

type ValidationRowProps = {
  row: Row<Variable>;
  virtualRow: VirtualItem;
  virtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
};

export const ValidationRow = ({ row, virtualRow, virtualizer }: ValidationRowProps) => {
  const validations = useValidations(toTreePath(row.id));
  return (
    <>
      <SelectRow
        row={row}
        className={rowClass(validations)}
        data-index={virtualRow.index}
        ref={virtualizer.measureElement}
        style={{
          transform: `translateY(${virtualRow.start}px)`
        }}
      >
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </SelectRow>
      {validations
        .filter(val => val.severity !== 'INFO')
        .map((val, index) => (
          <MessageRow
            key={index}
            columnCount={2}
            message={{ message: val.message, variant: val.severity.toLocaleLowerCase() as Lowercase<Severity> }}
            style={{
              transform: `translateY(${virtualRow.start + ROW_HEIGHT * (index + 1)}px)`
            }}
          />
        ))}
    </>
  );
};

export const rowClass = (messages: ValidationMessages) => {
  if (messages.find(message => message.severity === 'ERROR')) {
    return 'variables-editor-row-error';
  }
  if (messages.find(message => message.severity === 'WARNING')) {
    return 'variables-editor-row-warning';
  }
  return '';
};
