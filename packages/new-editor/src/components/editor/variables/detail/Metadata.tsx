import { Fieldset, SimpleSelect } from '@axonivy/ui-components';
import { treeNodeValueAttribute } from '../../../../types/config';
import {
  asEnumMetadata,
  metadataOptions,
  metadataTypeDaytime,
  metadataTypeEnum,
  variableMetadataAttribute,
  type EnumMetadata,
  type MetadataType,
  type Variable,
  type VariableUpdates
} from '../../data/Variable';
import { PossibleEnumValues } from './PossibleEnumValues';

type MetadataFieldsetProps = {
  variable: Variable;
  onChange: (updates: VariableUpdates) => void;
};

export const Metadata = ({ variable, onChange }: MetadataFieldsetProps) => {
  const enumMetadata = asEnumMetadata(variable.metadata);

  return (
    <>
      <Fieldset label='Metadata'>
        <SimpleSelect
          value={variable.metadata.type}
          items={metadataOptions}
          emptyItem={true}
          onValueChange={(value: MetadataType) => {
            const newMetadata = { type: value };
            const updates: VariableUpdates = [];
            switch (value) {
              case metadataTypeDaytime:
                updates.push({ key: treeNodeValueAttribute, value: '00:00' });
                break;
              case metadataTypeEnum:
                updates.push({ key: treeNodeValueAttribute, value: '' });
                (newMetadata as EnumMetadata).values = [''];
                break;
            }
            updates.push({ key: variableMetadataAttribute, value: newMetadata });
            onChange(updates);
          }}
        />
      </Fieldset>
      {enumMetadata && <PossibleEnumValues selectedValue={variable.value} values={enumMetadata.values} onChange={onChange} />}
    </>
  );
};
