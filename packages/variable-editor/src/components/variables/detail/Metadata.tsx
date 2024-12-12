import { BasicField, BasicSelect } from '@axonivy/ui-components';
import {
  fileMetadataFilenameExtensionOptions,
  isEnumMetadata,
  isFileMetadata,
  metadataOptions,
  toFileMetadataUpdate,
  type FileMetadataFilenameExtension,
  type MetadataType
} from '../data/metadata';
import { type Variable, type VariableUpdates } from '../data/variable';
import { EnumValues } from './EnumValues';

type MetadataProps = {
  variable: Variable;
  onChange: (updates: VariableUpdates) => void;
};

export const Metadata = ({ variable, onChange }: MetadataProps) => {
  const metadata = variable.metadata;

  const onValueChange = (value: MetadataType) => {
    const newMetadata = { type: value === 'default' ? '' : value };
    const updates: VariableUpdates = [];
    switch (value) {
      case 'daytime':
        updates.push({ key: 'value', value: '00:00' });
        break;
      case 'enum':
        updates.push({ key: 'value', value: '' });
        if (isEnumMetadata(newMetadata)) {
          newMetadata.values = [''];
        }
        break;
      case 'file':
        updates.push({ key: 'value', value: '' });
        if (isFileMetadata(newMetadata)) {
          newMetadata.extension = 'txt';
        }
    }
    updates.push({ key: 'metadata', value: newMetadata });
    onChange(updates);
  };

  return (
    <>
      <BasicField label='Metadata'>
        <BasicSelect value={metadata.type === '' ? 'default' : metadata.type} items={metadataOptions} onValueChange={onValueChange} />
      </BasicField>
      {isEnumMetadata(metadata) && <EnumValues selectedValue={variable.value} values={metadata.values} onChange={onChange} />}
      {isFileMetadata(metadata) && (
        <BasicField label='Filename extension'>
          <BasicSelect
            value={metadata.extension}
            items={fileMetadataFilenameExtensionOptions}
            onValueChange={(filenameExtension: FileMetadataFilenameExtension) => onChange([toFileMetadataUpdate(filenameExtension)])}
          />
        </BasicField>
      )}
    </>
  );
};
