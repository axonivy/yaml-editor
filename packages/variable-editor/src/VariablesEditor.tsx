import { Flex, PanelMessage, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import type { Variable } from './components/variables/data/variable';
import { toContent, toVariables } from './components/variables/data/variable-utils';
import { VariablesDetailContent } from './components/variables/detail/VariablesDetailContent';
import { VariablesMasterContent } from './components/variables/master/VariablesMasterContent';
import { VariablesMasterToolbar } from './components/variables/master/VariablesMasterToolbar';
import { AppProvider } from './context/AppContext';
import { useClient } from './protocol/ClientContextProvider';
import type { Data, EditorProps, ValidationMessages } from '@axonivy/variable-editor-protocol';
import { genQueryKey } from './query/query-client';
import type { Unary } from './utils/lambda/lambda';
import { getNode } from './utils/tree/tree-data';
import type { TreePath } from './utils/tree/types';
import './VariablesEditor.css';

function VariableEditor(props: EditorProps) {
  const [detail, setDetail] = useState(true);

  const [context, setContext] = useState(props.context);
  const [directSave, setDirectSave] = useState(props.directSave);
  useEffect(() => {
    setContext(props.context);
    setDirectSave(props.directSave);
  }, [props]);
  const [selectedVariable, setSelectedVariable] = useState<TreePath>([]);
  const [validationMessages, setValidationMessages] = useState<ValidationMessages>([]);

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(() => {
    return {
      data: () => genQueryKey('data', context),
      saveData: () => genQueryKey('saveData', context),
      validate: () => genQueryKey('validate', context)
    };
  }, [context]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  useQuery({
    queryKey: queryKeys.validate(),
    queryFn: async () => {
      const validationMessages = await client.validate(context);
      setValidationMessages(validationMessages);
      return validationMessages;
    }
  });

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(),
    mutationFn: async (updateData: Unary<string>) => {
      const saveData = queryClient.setQueryData<Data>(queryKeys.data(), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        const data = await client.saveData({ context, data: saveData.data, directSave });
        return setValidationMessages(data);
      }
      return Promise.resolve();
    }
  });

  if (isPending) {
    return (
      <Flex alignItems='center' justifyContent='center' style={{ width: '100%', height: '100%' }}>
        <Spinner />
      </Flex>
    );
  }

  if (isError) {
    return <PanelMessage icon={IvyIcons.ErrorXMark} message={`An error has occurred: ${error.message}`} />;
  }

  const rootVariable = toVariables(data.data);
  const setVariables = (variables: Array<Variable>) => {
    const newRootVariable = structuredClone(rootVariable);
    newRootVariable.children = variables;
    mutation.mutate(() => toContent(newRootVariable));
  };

  const title = `Variables - ${context.pmv}`;
  let detailTitle = title;
  const variable = getNode(rootVariable.children, selectedVariable);
  if (variable) {
    detailTitle += ' - ' + variable.name;
  }

  return (
    <AppProvider
      value={{
        variables: rootVariable.children,
        setVariables: setVariables,
        selectedVariable: selectedVariable,
        setSelectedVariable: setSelectedVariable,
        validationMessages: validationMessages,
        context: context,
        detail: detail,
        setDetail: setDetail
      }}
    >
      <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
        <ResizablePanel defaultSize={75} minSize={50} className='master-panel' data-testid='master-panel'>
          <Flex className='panel-content-container' direction='column'>
            <VariablesMasterToolbar title={title} />
            <VariablesMasterContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <Flex direction='column' className='panel-content-container' data-testid='details-container'>
                <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} data-testid='Detail title' />
                <VariablesDetailContent />
              </Flex>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </AppProvider>
  );
}

export default VariableEditor;
