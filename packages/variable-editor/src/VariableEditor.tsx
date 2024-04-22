import '@axonivy/ui-components/lib/style.css';
import '@axonivy/ui-icons/lib/ivy-icons.css';
import { useEffect, useMemo, useState } from 'react';
import { Editor } from './components/editor/Editor';
import { type Variable } from './components/variables/data/variable';
import { toContent, toVariables } from './components/variables/data/variable-utils';
import { VariablesDetail } from './components/variables/detail/VariablesDetail';
import { VariablesMaster } from './components/variables/master/VariablesMaster';
import { getNode } from './utils/tree/tree-data';
import type { TreePath } from './utils/tree/types';

type VariableEditorProps = {
  content: string;
  onChange: (content: string) => void;
};

// TODO: remove this after implementing onChange
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function VariableEditor({ content, onChange }: VariableEditorProps) {
  const [variables, setVariables] = useState<Array<Variable>>([]);
  const [selectedVariablePath, setSelectedVariablePath] = useState<TreePath>([]);

  useMemo(() => {
    setVariables(toVariables(content));
  }, [content]);
  useEffect(() => {
    onChange(toContent(variables));
  }, [onChange, variables]);

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
