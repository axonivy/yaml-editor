import { MessageRow } from '@axonivy/ui-components';
import type { ValidationMessages } from '../../../protocol/types';
import { toValidationMessageVariant } from '../data/validation-utils';

type ValidationMessagesRowsProps = {
  validationMessages: ValidationMessages;
};

export const ValidationMessagesRows = ({ validationMessages }: ValidationMessagesRowsProps) => {
  return validationMessages.map((validationMessage, index) => (
    <MessageRow
      key={index}
      columnCount={2}
      message={{ message: validationMessage.message, variant: toValidationMessageVariant(validationMessage.severity) }}
    />
  ));
};
