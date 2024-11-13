import type { ValidationMessages } from '@axonivy/variable-editor-protocol';
import { customRenderHook } from '../components/variables/data/test-utils/test-utils';
import { useValidations } from './useValidation';

const validations: ValidationMessages = [
  { message: 'message0', path: 'Variables.myVar', severity: 'INFO' },
  { message: 'message3', path: 'Variables.myVar', severity: 'ERROR' },
  { message: 'message1', path: 'Variables.msgraph.test', severity: 'INFO' },
  { message: 'message2', path: 'Variables.msgraph.secret', severity: 'WARNING' },
  { message: 'message4', path: '', severity: 'INFO' }
];

const renderValidations = (path: string) => {
  return customRenderHook(() => useValidations(path), { wrapperProps: { appContext: { validations } } });
};

test('useValidations', () => {
  expect(renderValidations('').result.current).toEqual([]);
  expect(renderValidations('myVar').result.current).toEqual([
    { message: 'message0', variant: 'info' },
    { message: 'message3', variant: 'error' }
  ]);
  expect(renderValidations('msgraph.test').result.current).toEqual([{ message: 'message1', variant: 'info' }]);
});
