import { BasicField, Input, PanelMessage, Textarea } from '@axonivy/ui-components';
import { getNode, updateNode, hasChildren as variableHasChildren } from '../../../utils/tree/tree-data';
import { type TreePath } from '../../../utils/tree/types';
import { type Variable, type VariableUpdates } from '../data/variable';
import { Metadata } from './Metadata';
import { Value } from './Value';

type VariableProps = {
  variables: Array<Variable>;
  variablePath: TreePath;
  setVariables: (variables: Array<Variable>) => void;
};

export const VariablesDetail = ({ variables, variablePath, setVariables }: VariableProps) => {
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
    <>
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
    </>
  );
};
