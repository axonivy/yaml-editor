import type { MessageData } from '@axonivy/ui-components';
import { hasChildren } from '../../../utils/tree/tree-data';
import type { Variable } from './variable';

export const validateName = (name: string, takenNames: Array<string>): MessageData | undefined => {
  if (name.trim() === '') {
    return toErrorMessage('Name cannot be empty.');
  }
  if (takenNames.includes(name)) {
    return toErrorMessage('Name is already present in this Namespace.');
  }
  if (name.includes('.')) {
    return toErrorMessage("Character '.' is not allowed.");
  }
  return;
};

export const validateNamespace = (namespace: string, variables: Array<Variable>): MessageData | undefined => {
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
  return;
};

const toErrorMessage = (message: string): MessageData => {
  return { message: message, variant: 'error' };
};
