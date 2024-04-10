import { Fieldset, Input, Message, SimpleSelect, Textarea } from '@axonivy/ui-components';
import { getNode, updateNode, hasChildren as variableHasChildren } from '../../../../data/data';
import type { TreePath } from '../../../../types/config';
import { metadataOptions, type Variable } from '../../data/Variable';

type VariableProps = {
  variables: Array<Variable>;
  variablePath: TreePath;
  setVariables: (variables: Array<Variable>) => void;
};

export const VariableDetail = ({ variables, variablePath, setVariables }: VariableProps) => {
  const variable = getNode(variables, variablePath);
  if (!variable) {
    return <Message>Select a variable to edit.</Message>;
  }

  const hasChildren = variableHasChildren(variable);

  const handleVariableAttributeChange = <TKey extends keyof Variable>(key: TKey, value: Variable[TKey]) => {
    const newVariables = structuredClone(variables);
    updateNode(newVariables, variablePath, key, value);
    setVariables(newVariables);
  };

  return (
    <>
      <Fieldset label='Name'>
        <Input value={variable.name} onChange={event => handleVariableAttributeChange('name', event.target.value)} />
      </Fieldset>
      {!hasChildren && (
        <Fieldset label='Value'>
          <Input value={variable.value} onChange={event => handleVariableAttributeChange('value', event.target.value)} />
        </Fieldset>
      )}
      <Fieldset label='Description'>
        <Textarea value={variable.description} onChange={event => handleVariableAttributeChange('description', event.target.value)} />
      </Fieldset>
      {!hasChildren && (
        <Fieldset label='Metadata'>
          <SimpleSelect
            value={variable.metadata}
            items={metadataOptions}
            onValueChange={(value: (typeof metadataOptions)[number]['value']) => handleVariableAttributeChange('metadata', value)}
          ></SimpleSelect>
        </Fieldset>
      )}
    </>
  );
};
