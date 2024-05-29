import type { ValidationMessage, ValidationMessages } from '../../../protocol/types';

export const validationMessagesOfRow = (rowId: string, validationMessages: ValidationMessages) => {
  return validationMessages.filter(validationMessage => validationMessageBelongsToRow(rowId, validationMessage));
};

const validationMessageBelongsToRow = (rowId: string, validationMessage: ValidationMessage) => {
  const path = JSON.parse(validationMessage.path);
  path.shift();
  return path.join('.') === rowId;
};

export const toValidationMessageVariant = (severity: number) => {
  switch (severity) {
    case 1:
      return 'warning';
    case 2:
      return 'error';
    default:
      return 'info';
  }
};
