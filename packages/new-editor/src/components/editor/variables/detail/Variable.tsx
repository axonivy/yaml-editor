import { Fieldset, Input, Message, SimpleSelect, Textarea } from '@axonivy/ui-components';
import { getVariable } from '../../../../data/data';
import type { TreePath } from '../../../../types/config';
import { metadataOptions, type Variable } from '../../data/Variable';

type VariableProps = {
  variables: Array<Variable>;
  variablePath: TreePath;
  setVariables: (variables: Array<Variable>) => void;
};

export const VariableDetail = ({ variables, variablePath, setVariables }: VariableProps) => {
  const variable = getVariable(variables, variablePath);
  if (!variable) {
    return <Message>Select a variable to edit.</Message>;
  }

  const selectedMetadataOption = metadataOptions.find(option => option.value === variable.metadata);
  const doesNotHaveChildren = variable.children.length == 0;

  const handleVariableAttributeChange = (key: keyof Variable, value: any) => {
    const newVariables = structuredClone(variables);
    getVariable(newVariables, variablePath)![key] = value;
    setVariables(newVariables);
  };

  return (
    <>
      <Fieldset label='Name'>
        <Input value={variable.name} onChange={event => handleVariableAttributeChange('name', event.target.value)} />
      </Fieldset>
      {doesNotHaveChildren && (
        <Fieldset label='Value'>
          <Input value={variable.value} onChange={event => handleVariableAttributeChange('value', event.target.value)} />
        </Fieldset>
      )}
      <Fieldset label='Description'>
        <Textarea value={variable.description} onChange={event => handleVariableAttributeChange('description', event.target.value)} />
      </Fieldset>
      {doesNotHaveChildren && (
        <Fieldset label='Metadata'>
          <SimpleSelect
            value={selectedMetadataOption?.value}
            items={metadataOptions}
            onValueChange={value => handleVariableAttributeChange('metadata', value)}
          ></SimpleSelect>
        </Fieldset>
      )}
    </>
  );
};
