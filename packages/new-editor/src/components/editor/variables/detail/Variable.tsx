import { Fieldset, Input, SimpleSelect, Textarea, ToolbarTitle } from '@axonivy/ui-components';
import { metadataOptions, type Variable } from '../../data/Variable';

type VariableProps = {
  variable: Variable;
};

export const VariableDetail = ({ variable }: VariableProps) => {
  const selectedMetadataOption = metadataOptions.find(option => option.value === variable.metadata);

  return (
    <>
      <ToolbarTitle>Variable Configuration</ToolbarTitle>
      <Fieldset label='Name'>
        <Input value={variable.name} />
      </Fieldset>
      {variable.children.length == 0 && (
        <>
          <Fieldset label='Value'>
            <Input value={variable.value} />
          </Fieldset>
          <Fieldset label='Description'>
            <Textarea value={variable.description} />
          </Fieldset>
          <Fieldset label='Metadata'>
            <SimpleSelect defaultValue={selectedMetadataOption?.value} items={metadataOptions}></SimpleSelect>
          </Fieldset>
        </>
      )}
    </>
  );
};
