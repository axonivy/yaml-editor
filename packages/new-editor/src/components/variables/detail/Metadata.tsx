import { Fieldset, SimpleSelect } from '@axonivy/ui-components';
import { treeNodeValueAttribute } from '../../../utils/tree/types';
import {
  fileMetadataFilenameExtensionOptions,
  isEnumMetadata,
  isFileMetadata,
  metadataOptions,
  toFileMetadataUpdate,
  variableMetadataAttribute,
  type FileMetadataFilenameExtension,
  type MetadataType,
  type Variable,
  type VariableUpdates
} from '../data/variable';
import { EnumValues } from './EnumValues';

type MetadataFieldsetProps = {
  variable: Variable;
  onChange: (updates: VariableUpdates) => void;
};

export const Metadata = ({ variable, onChange }: MetadataFieldsetProps) => {
  const metadata = variable.metadata;

  const onValueChange = (value: MetadataType) => {
    const newMetadata = { type: value };
    const updates: VariableUpdates = [];
    switch (value) {
      case 'daytime':
        updates.push({ key: treeNodeValueAttribute, value: '00:00' });
        break;
      case 'enum':
        updates.push({ key: treeNodeValueAttribute, value: '' });
        if (isEnumMetadata(newMetadata)) {
          newMetadata.values = [''];
        }
        break;
      case 'file':
        if (isFileMetadata(newMetadata)) {
          newMetadata.filenameExtension = 'txt';
        }
    }
    updates.push({ key: variableMetadataAttribute, value: newMetadata });
    onChange(updates);
  };

  return (
    <>
      <Fieldset label='Metadata'>
        <SimpleSelect value={metadata.type} items={metadataOptions} emptyItem={true} onValueChange={onValueChange} />
      </Fieldset>
      {isEnumMetadata(metadata) && <EnumValues selectedValue={variable.value} values={metadata.values} onChange={onChange} />}
      {isFileMetadata(metadata) && (
        <Fieldset label='Filename extension'>
          <SimpleSelect
            value={metadata.filenameExtension}
            items={fileMetadataFilenameExtensionOptions}
            onValueChange={(filenameExtension: FileMetadataFilenameExtension) => onChange([toFileMetadataUpdate(filenameExtension)])}
          />
        </Fieldset>
      )}
    </>
  );
};
