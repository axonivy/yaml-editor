import type { RenderHookOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { AppProvider } from '../../../../context/AppContext';
import type { ValidationMessages, VariablesEditorDataContext } from '@axonivy/variable-editor-protocol';

type ContextHelperProps = {
  appContext?: {
    validations?: ValidationMessages;
  };
};

const ContextHelper = (props: ContextHelperProps & { children: ReactNode }) => {
  const appContext = {
    context: {} as VariablesEditorDataContext,
    variables: [],
    setVariables: () => {},
    selectedVariable: [],
    setSelectedVariable: () => {},
    validations: props.appContext?.validations ?? [],
    detail: true,
    setDetail: () => {}
  };
  return <AppProvider value={appContext}>{props.children}</AppProvider>;
};

export const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { wrapperProps: ContextHelperProps }
) => {
  return renderHook(render, {
    wrapper: props => <ContextHelper {...props} {...options?.wrapperProps} />,
    ...options
  });
};
