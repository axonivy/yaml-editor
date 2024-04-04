import { Fieldset, Input, Message, SimpleSelect, Textarea } from '@axonivy/ui-components';
import { metadataOptions, type Variable } from '../../data/Variable';

type VariableProps = {
  variable?: Variable;
};

export const VariableDetail = ({ variable }: VariableProps) => {
  if (!variable) {
    return <Message>Select a variable to edit.</Message>;
  }

  const selectedMetadataOption = metadataOptions.find(option => option.value === variable.metadata);
  const doesNotHaveChildren = variable.children.length == 0;

  return (
    <>
      <Fieldset label='Name'>
        <Input value={variable.name} />
      </Fieldset>
      {doesNotHaveChildren && (
        <Fieldset label='Value'>
          <Input value={variable.value} />
        </Fieldset>
      )}
      <Fieldset label='Description'>
        <Textarea value={variable.description} />
      </Fieldset>
      {doesNotHaveChildren && (
        <Fieldset label='Metadata'>
          <SimpleSelect value={selectedMetadataOption?.value} items={metadataOptions}></SimpleSelect>
        </Fieldset>
      )}
    </>
  );
};
