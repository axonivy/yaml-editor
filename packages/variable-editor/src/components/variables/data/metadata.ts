import { type VariableUpdate } from './variable';

export type Metadata = { type: MetadataType };
export type MetadataType = (typeof metadataOptions)[number]['value'] | '';

export interface EnumMetadata extends Metadata {
  values: Array<string>;
}

export interface FileMetadata extends Metadata {
  extension: FileMetadataFilenameExtension;
}
export type FileMetadataFilenameExtension = (typeof fileMetadataFilenameExtensionOptions)[number]['value'];

export const metadataOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Password', value: 'password' },
  { label: 'Daytime', value: 'daytime' },
  { label: 'Enum', value: 'enum' },
  { label: 'File', value: 'file' }
] as const satisfies Array<{ label: string; value: string }>;

export const fileMetadataFilenameExtensionOptions = [
  { label: 'txt', value: 'txt' },
  { label: 'json', value: 'json' }
] as const satisfies Array<{ label: string; value: string }>;

export const isMetadataType = (metadataType: string): metadataType is MetadataType => {
  return metadataType === '' || metadataOptions.some(option => option.value === metadataType);
};

export const isMetadata = (metadata: unknown): metadata is Metadata => {
  return typeof metadata === 'object' && metadata !== null && 'type' in metadata && isMetadataType((metadata as Metadata).type);
};

export const isEnumMetadata = (metadata?: Metadata): metadata is EnumMetadata => {
  return metadata !== undefined && metadata.type === 'enum';
};

export const isFileMetadata = (metadata?: Metadata): metadata is FileMetadata => {
  return metadata !== undefined && metadata.type === 'file';
};

export const isFileMetadataFilenameExtension = (filenameExtension: string): filenameExtension is FileMetadataFilenameExtension => {
  return fileMetadataFilenameExtensionOptions.some(option => option.value === filenameExtension);
};

export const toEnumMetadataUpdate = (values: Array<string>): VariableUpdate => {
  const metadata: EnumMetadata = { type: 'enum', values: values };
  return { key: 'metadata', value: metadata };
};

export const toFileMetadataUpdate = (filenameExtension: FileMetadataFilenameExtension): VariableUpdate => {
  const metadata: FileMetadata = { type: 'file', extension: filenameExtension };
  return { key: 'metadata', value: metadata };
};
