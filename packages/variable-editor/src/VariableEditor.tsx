import '@axonivy/ui-components/lib/style.css';
import '@axonivy/ui-icons/lib/ivy-icons.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Editor } from './components/editor/Editor';
import type { Variable } from './components/variables/data/variable';
import { toContent, toVariables } from './components/variables/data/variable-utils';
import { VariablesDetail } from './components/variables/detail/VariablesDetail';
import { VariablesMaster } from './components/variables/master/VariablesMaster';
import { useClient } from './protocol/ClientContextProvider';
import type { Data, DataContext } from './protocol/types';
import type { Unary } from './utils/lambda/lambda';
import { getNode } from './utils/tree/tree-data';
import type { TreePath } from './utils/tree/types';

function VariableEditor(props: DataContext) {
  const [context, setContext] = useState(props);
  useEffect(() => {
    setContext(props);
  }, [props]);
  const [selectedVariablePath, setSelectedVariablePath] = useState<TreePath>([]);

  const client = useClient<string>();
  const queryClient = useQueryClient();

  const queryKeys = useMemo(() => {
    return {
      data: () => ['data'],
      saveData: () => ['saveData']
    };
  }, []);

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(),
    queryFn: () => client.data(context).then(data => ({ ...data, data: toVariables(data.data) })),
    structuralSharing: false
  });

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(),
    mutationFn: (updateData: Unary<Array<Variable>>) => {
      const saveData = queryClient.setQueryData<Data<Array<Variable>>>(queryKeys.data(), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        return client.saveData({ context, data: toContent(saveData.data) });
      }
      return Promise.resolve();
    }
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{'An error has occurred: ' + error}</p>;
  }

  const variables = data.data;
  const setVariables = (variables: Array<Variable>) => {
    mutation.mutate(() => variables);
  };

  const title = 'Variables Editor';
  let detailTitle = title;
  const selectedVariable = getNode(variables, selectedVariablePath);
  if (selectedVariable) {
    detailTitle += ' - ' + selectedVariable.name;
  }

  return (
    <Editor
      masterTitle={title}
      masterContent={
        <VariablesMaster variables={variables} setVariables={setVariables} setSelectedVariablePath={setSelectedVariablePath} />
      }
      detailTitle={detailTitle}
      detailContent={<VariablesDetail variables={variables} variablePath={selectedVariablePath} setVariables={setVariables} />}
    />
  );
}

export default VariableEditor;
