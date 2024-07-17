import { Fieldset, Input, Textarea } from '@axonivy/ui-components';
import { getNode, updateNode, hasChildren as variableHasChildren } from '../../../utils/tree/tree-data';
import { treeNodeNameAttribute, type TreePath } from '../../../utils/tree/types';
import { EmptyDetail } from '../../detail/EmptyDetail';
import { variableDescriptionAttribute, type Variable, type VariableUpdates } from '../data/variable';
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
    return <EmptyDetail message='Nothing there yet. Select a Variable to edit its properties.' />;
  }

  const hasChildren = variableHasChildren(variable);

  const handleVariableAttributeChange = (updates: VariableUpdates) => {
    const newVariables = updateNode(variables, variablePath, updates);
    setVariables(newVariables);
  };

  return (
    <>
      <Fieldset label='Name'>
        <Input
          value={variable.name}
          onChange={event => handleVariableAttributeChange([{ key: treeNodeNameAttribute, value: event.target.value }])}
        />
      </Fieldset>
      {!hasChildren && <Value variable={variable} onChange={handleVariableAttributeChange} />}
      <Fieldset label='Description'>
        <Textarea
          value={variable.description}
          onChange={event => handleVariableAttributeChange([{ key: variableDescriptionAttribute, value: event.target.value }])}
        />
      </Fieldset>
      {!hasChildren && <Metadata variable={variable} onChange={handleVariableAttributeChange} />}
    </>
  );
};
