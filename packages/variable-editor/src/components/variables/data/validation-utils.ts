import type { MessageData } from '@axonivy/ui-components';
import type { ValidationMessages, ValidationResult } from '@axonivy/variable-editor-protocol';
import { type Row } from '@tanstack/react-table';
import { keyOfRow } from '../../../utils/tree/tree';
import { hasChildren } from '../../../utils/tree/tree-data';
import type { Variable } from './variable';

export const validationMessagesOfRow = (row: Row<Variable>, validationMessages?: ValidationMessages) => {
  if (!validationMessages) {
    return [];
  }
  return validationMessages.filter(validationMessage => validationMessageBelongsToRow(row, validationMessage));
};

const validationMessageBelongsToRow = (row: Row<Variable>, validationMessage: ValidationResult) => {
  const key = 'Variables.' + keyOfRow(row);
  return key === validationMessage.path;
};

export const containsError = (validationMessages: ValidationMessages) => {
  return validationMessages.find(validationMessage => validationMessage.severity === 'ERROR');
};

export const containsWarning = (validationMessages: ValidationMessages) => {
  return validationMessages.find(validationMessage => validationMessage.severity === 'WARNING');
};

export const validateName = (name: string, takenNames: Array<string>): MessageData => {
  if (name.trim() === '') {
    return toErrorMessage('Name cannot be empty.');
  }
  if (takenNames.includes(name)) {
    return toErrorMessage('Name is already present in this Namespace.');
  }
  if (name.includes('.')) {
    return toErrorMessage("Character '.' is not allowed.");
  }
};

export const validateNamespace = (namespace: string, variables: Array<Variable>): MessageData => {
  const keyParts = namespace.split('.');
  let currentVariables = variables;
  for (const [index, keyPart] of keyParts.entries()) {
    const nextVariable = currentVariables.find(variable => variable.name === keyPart);
    if (nextVariable === undefined) {
      return;
    }
    if (!hasChildren(nextVariable)) {
      return toErrorMessage("Namespace '" + keyParts.slice(0, index + 1).join('.') + "' is not a folder, you cannot add a child to it.");
    }
    currentVariables = nextVariable.children;
  }
};

const toErrorMessage = (message: string) => {
  return { message: message, variant: 'error' };
};
