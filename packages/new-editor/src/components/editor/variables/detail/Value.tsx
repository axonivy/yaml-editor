import { Fieldset, Input, SimpleSelect } from '@axonivy/ui-components';
import { treeNodeValueAttribute } from '../../../../types/config';
import { asEnumMetadata, metadataTypeDaytime, metadataTypeEnum, type Variable, type VariableUpdates } from '../../data/Variable';

type ValueFieldsetProps = {
  variable: Variable;
  onChange: (updates: VariableUpdates) => void;
};

export const Value = ({ variable, onChange }: ValueFieldsetProps) => {
  const filterEnumValuesForSelect = () => {
    const metadata = asEnumMetadata(variable.metadata);
    if (!metadata) {
      return [];
    }
    const values = new Set(metadata.values);
    return Array.from(values)
      .filter(value => value !== '')
      .map(value => {
        return { label: value, value: value };
      });
  };

  let input;
  switch (variable.metadata.type) {
    case metadataTypeDaytime:
      input = (
        <Input
          value={variable.value}
          onChange={event => onChange([{ key: treeNodeValueAttribute, value: event.target.value }])}
          type='time'
        />
      );
      break;
    case metadataTypeEnum:
      input = (
        <SimpleSelect
          value={variable.value}
          items={filterEnumValuesForSelect()}
          emptyItem={true}
          onValueChange={(value: string) => onChange([{ key: treeNodeValueAttribute, value: value }])}
        />
      );
      break;
    default:
      input = <Input value={variable.value} onChange={event => onChange([{ key: treeNodeValueAttribute, value: event.target.value }])} />;
      break;
  }
  return <Fieldset label='Value'>{input}</Fieldset>;
};
