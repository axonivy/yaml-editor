import { BasicField, Flex, Input, PanelMessage, Textarea } from '@axonivy/ui-components';
import { getNode, updateNode, hasChildren as variableHasChildren } from '../../../utils/tree/tree-data';
import { type TreePath } from '../../../utils/tree/types';
import { type Variable, type VariableUpdates } from '../data/variable';
import { Metadata } from './Metadata';
import { Value } from './Value';
import './VariablesDetailContent.css';

type VariablesDetailContentProps = {
  variables: Array<Variable>;
  variablePath: TreePath;
  setVariables: (variables: Array<Variable>) => void;
};

export const VariablesDetailContent = ({ variables, variablePath, setVariables }: VariablesDetailContentProps) => {
  const variable = getNode(variables, variablePath);
  if (!variable) {
    return <PanelMessage message='Select a variable to edit its properties.' />;
  }

  const hasChildren = variableHasChildren(variable);

  const handleVariableAttributeChange = (updates: VariableUpdates) => {
    const newVariables = updateNode(variables, variablePath, updates);
    setVariables(newVariables);
  };

  return (
    <Flex direction='column' gap={4} className='detail-content'>
      <BasicField label='Name'>
        <Input value={variable.name} onChange={event => handleVariableAttributeChange([{ key: 'name', value: event.target.value }])} />
      </BasicField>
      {!hasChildren && <Value variable={variable} onChange={handleVariableAttributeChange} />}
      <BasicField label='Description'>
        <Textarea
          value={variable.description}
          onChange={event => handleVariableAttributeChange([{ key: 'description', value: event.target.value }])}
        />
      </BasicField>
      {!hasChildren && <Metadata variable={variable} onChange={handleVariableAttributeChange} />}
    </Flex>
  );
};
