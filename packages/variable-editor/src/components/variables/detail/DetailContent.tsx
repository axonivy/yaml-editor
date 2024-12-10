import { BasicField, BasicInput, Flex, PanelMessage, ReadonlyProvider, Textarea } from '@axonivy/ui-components';
import { EMPTY_PROJECT_VAR_NODE, type ProjectVarNode } from '@axonivy/variable-editor-protocol';
import { useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { getNode, getNodesOnPath, updateNode, hasChildren as variableHasChildren } from '../../../utils/tree/tree-data';
import { type VariableUpdates } from '../data/variable';
import './DetailContent.css';
import { Metadata } from './Metadata';
import { Value } from './Value';

export const useOverwrites = () => {
  const { context, variables, selectedVariable } = useAppContext();
  const variableNodes = getNodesOnPath(variables, selectedVariable);
  let currentNode: ProjectVarNode | undefined = useMeta('meta/knownVariables', context, EMPTY_PROJECT_VAR_NODE).data;
  for (const variableNode of variableNodes) {
    currentNode = currentNode.children.find(child => child.name === variableNode?.name);
    if (!currentNode) {
      return false;
    }
  }
  return true;
};

export const VariablesDetailContent = () => {
  const { variables, setVariables, selectedVariable } = useAppContext();

  const variable = useMemo(() => getNode(variables, selectedVariable), [variables, selectedVariable]);
  const overwrites = useOverwrites();

  if (!variable) {
    return <PanelMessage message='Select a variable to edit its properties.' />;
  }

  const hasChildren = variableHasChildren(variable);

  const handleVariableAttributeChange = (updates: VariableUpdates) => setVariables(old => updateNode(old, selectedVariable, updates));

  return (
    <Flex direction='column' gap={4} className='detail-content'>
      <BasicField label='Name'>
        <BasicInput value={variable.name} onChange={event => handleVariableAttributeChange([{ key: 'name', value: event.target.value }])} />
      </BasicField>
      {!hasChildren && <Value variable={variable} onChange={handleVariableAttributeChange} />}
      <BasicField label='Description'>
        <Textarea
          value={variable.description}
          onChange={event => handleVariableAttributeChange([{ key: 'description', value: event.target.value }])}
        />
      </BasicField>
      {!hasChildren && (
        <ReadonlyProvider readonly={overwrites}>
          <Metadata variable={variable} onChange={handleVariableAttributeChange} />
        </ReadonlyProvider>
      )}
    </Flex>
  );
};
