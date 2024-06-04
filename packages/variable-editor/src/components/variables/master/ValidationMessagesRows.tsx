import { MessageRow } from '@axonivy/ui-components';
import type { ValidationMessages } from '../../../protocol/types';
import { toValidationMessageVariant, validationMessagesOfRow } from '../data/validation-utils';

type ValidationMessagesRowsProps = {
  rowId: string;
  validationMessages?: ValidationMessages;
};

export const ValidationMessagesRows = ({ rowId, validationMessages }: ValidationMessagesRowsProps) => {
  if (!validationMessages) {
    return;
  }
  return validationMessagesOfRow(rowId, validationMessages).map((validationMessage, index) => (
    <MessageRow
      key={index}
      columnCount={2}
      message={{ message: validationMessage.message, variant: toValidationMessageVariant(validationMessage.severity) }}
    />
  ));
};
