import type { Severity, ValidationResult } from '@axonivy/variable-editor-protocol';
import { useAppContext } from './AppContext';
import type { MessageData } from '@axonivy/ui-components';

export function useValidations(path: string): Array<MessageData> {
  const { validations } = useAppContext();
  return validations.filter(val => val.path === `Variables.${path}`).map<MessageData>(toMessageData);
}

function toMessageData(validation: ValidationResult): MessageData;
function toMessageData(validation?: ValidationResult): MessageData | undefined;
function toMessageData(validation?: ValidationResult): MessageData | undefined {
  if (validation) {
    return { message: validation.message, variant: validation.severity.toLocaleLowerCase() as Lowercase<Severity> };
  }
  return undefined;
}
