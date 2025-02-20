import type { Client, ValidationMessages, VariablesEditorDataContext } from '@axonivy/variable-editor-protocol';
import type { RenderHookOptions } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { AppProvider } from '../../../../context/AppContext';
import { ClientContextProvider } from '@axonivy/variable-editor-protocol/src/client/ClientContextProvider';
import { QueryProvider } from '../../../../query/QueryProvider';
import { initQueryClient } from '../../../../query/query-client';
import type { TreePath } from '../../../../utils/tree/types';
import type { Variable } from '../variable';
import type { useHistoryData } from '@axonivy/ui-components';

type ContextHelperProps = {
  client?: Partial<Client>;
  appContext?: {
    variables?: Array<Variable>;
    selectedVariable?: TreePath;
    validations?: ValidationMessages;
  };
};

const ContextHelper = (props: ContextHelperProps & { children: ReactNode }) => {
  const client = (props.client ?? new EmptyClient()) as Client;
  const appContext = {
    context: {} as VariablesEditorDataContext,
    variables: props.appContext?.variables ?? [],
    setVariables: () => {},
    selectedVariable: props.appContext?.selectedVariable ?? [],
    setSelectedVariable: () => {},
    validations: props.appContext?.validations ?? [],
    detail: true,
    setDetail: () => {},
    history: {} as ReturnType<typeof useHistoryData<Array<Variable>>>
  };
  return (
    <ClientContextProvider client={client}>
      <QueryProvider client={initQueryClient()}>
        <AppProvider value={appContext}>{props.children}</AppProvider>
      </QueryProvider>
    </ClientContextProvider>
  );
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

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class EmptyClient implements Partial<Client> {}
