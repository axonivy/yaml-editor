import { type Row } from '@tanstack/react-table';
import type { ValidationMessage, ValidationMessages } from '../../../protocol/types';
import { keyOfRow } from '../../../utils/tree/tree';
import type { Variable } from './variable';

export const validationMessagesOfRow = (row: Row<Variable>, validationMessages?: ValidationMessages) => {
  if (!validationMessages) {
    return [];
  }
  return validationMessages.filter(validationMessage => validationMessageBelongsToRow(row, validationMessage));
};

const validationMessageBelongsToRow = (row: Row<Variable>, validationMessage: ValidationMessage) => {
  const key = 'Variables.' + keyOfRow(row);
  return key === validationMessage.path;
};

export const containsError = (validationMessages: ValidationMessages) => {
  return validationMessages.find(validationMessage => validationMessage.severity === 2);
};

export const containsWarning = (validationMessages: ValidationMessages) => {
  return validationMessages.find(validationMessage => validationMessage.severity === 1);
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

export const validateName = (name: string, takenNames: Array<string>) => {
  if (name.trim() === '') {
    return 'Name cannot be empty.';
  }
  if (takenNames.includes(name)) {
    return 'Name is already present in this Namespace.';
  }
  return;
};
