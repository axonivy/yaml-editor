import {
  Button,
  Flex,
  PanelMessage,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  SidebarHeader,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useHistoryData,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { EditorProps, ValidationMessages, VariablesData } from '@axonivy/variable-editor-protocol';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import type { RootVariable, Variable } from './components/variables/data/variable';
import { toContent, toVariables } from './components/variables/data/variable-utils';
import { VariablesDetailContent } from './components/variables/detail/DetailContent';
import { VariablesMasterContent } from './components/variables/master/VariablesMasterContent';
import { VariablesMasterToolbar } from './components/variables/master/VariablesMasterToolbar';
import { AppProvider } from './context/AppContext';
import { useAction } from './context/useAction';
import { useClient } from './protocol/ClientContextProvider';
import { genQueryKey } from './query/query-client';
import { useKnownHotkeys } from './utils/hotkeys';
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
  const history = useHistoryData<Array<Variable>>();

  const client = useClient();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(
    () => ({
      data: () => genQueryKey('data', context),
      saveData: () => genQueryKey('saveData', context),
      validate: () => genQueryKey('validate', context)
    }),
    [context]
  );

  const { data, isPending, isError, isSuccess, error } = useQuery({
    queryKey: queryKeys.data(),
    queryFn: async () => {
      const content = await client.data(context);
      const root = toVariables(content.data);
      history.push(root.children);
      return { ...content, root };
    },
    structuralSharing: false
  });

  const validations = useQuery({
    queryKey: queryKeys.validate(),
    queryFn: async () => await client.validate(context),
    initialData: [],
    enabled: isSuccess
  }).data;

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(),
    mutationFn: async (updateData: Unary<Array<Variable>>) => {
      const saveData = queryClient.setQueryData<VariablesData & { root: RootVariable }>(queryKeys.data(), prevData => {
        if (prevData) {
          prevData.root.children = updateData(prevData.root.children);
          return prevData;
        }
        return;
      });
      if (saveData) {
        return await client.saveData({ context, data: toContent(saveData.root), directSave });
      }
      return Promise.resolve([]);
    },
    onSuccess: (data: ValidationMessages) => queryClient.setQueryData(queryKeys.validate(), data)
  });

  const openUrl = useAction('openUrl');
  const { openHelp: helpText } = useKnownHotkeys();
  useHotkeys(helpText.hotkey, () => openUrl(data?.helpUrl), { scopes: ['global'] });

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

  const title = `Variables - ${context.pmv}`;
  let detailTitle = title;
  const variable = getNode(data.root.children, selectedVariable);
  if (variable) {
    detailTitle += ' - ' + variable.name;
  }

  return (
    <AppProvider
      value={{
        variables: data.root.children,
        setVariables: mutation.mutate,
        selectedVariable,
        setSelectedVariable,
        validations,
        context,
        detail,
        setDetail,
        history
      }}
    >
      <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
        <ResizablePanel defaultSize={75} minSize={50} className='master-panel'>
          <Flex className='panel-content-container' direction='column'>
            <VariablesMasterToolbar title={title} />
            <VariablesMasterContent />
          </Flex>
        </ResizablePanel>
        {detail && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={10}>
              <Flex direction='column' className='panel-content-container detail-container'>
                <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} className='detail-header' tabIndex={-1}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button icon={IvyIcons.Help} onClick={() => openUrl(data.helpUrl)} aria-label={helpText.label} />
                      </TooltipTrigger>
                      <TooltipContent style={{ fontSize: '0.75rem', fontWeight: 'initial' }}>{helpText.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarHeader>
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
