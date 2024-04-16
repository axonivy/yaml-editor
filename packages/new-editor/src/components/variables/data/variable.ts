import type { TreeNode, TreeNodeUpdate, TreeNodeUpdates } from '../../../utils/tree/types';

export const variableDescriptionAttribute = 'description';
export const variableMetadataAttribute = 'metadata';

export interface Variable extends TreeNode<Variable> {
  description: string;
  metadata: Metadata;
}
export type VariableUpdate = TreeNodeUpdate<Variable>;
export type VariableUpdates = TreeNodeUpdates<Variable>;

export const metadataOptions = [
  { label: 'Password', value: 'password' },
  { label: 'Daytime', value: 'daytime' },
  { label: 'Enum', value: 'enum' },
  { label: 'File', value: 'file' }
] as const satisfies Array<{ label: string; value: string }>;

export type MetadataType = (typeof metadataOptions)[number]['value'] | '';
export type Metadata = { type: MetadataType };

export interface EnumMetadata extends Metadata {
  values: Array<string>;
}

export const fileMetadataFilenameExtensionOptions = [
  { label: 'txt', value: 'txt' },
  { label: 'json', value: 'json' }
] as const satisfies Array<{ label: string; value: string }>;

export type FileMetadataFilenameExtension = (typeof fileMetadataFilenameExtensionOptions)[number]['value'];
export interface FileMetadata extends Metadata {
  filenameExtension: FileMetadataFilenameExtension;
}

export const isEnumMetadata = (metadata?: Metadata): metadata is EnumMetadata => {
  return metadata !== undefined && metadata.type === 'enum';
};
export const toEnumMetadataUpdate = (values: Array<string>): VariableUpdate => {
  const metadata: EnumMetadata = { type: 'enum', values: values };
  return { key: variableMetadataAttribute, value: metadata };
};

export const isFileMetadata = (metadata?: Metadata): metadata is FileMetadata => {
  return metadata !== undefined && metadata.type === 'file';
};
export const toFileMetadataUpdate = (filenameExtension: FileMetadataFilenameExtension): VariableUpdate => {
  const metadata: FileMetadata = { type: 'file', filenameExtension: filenameExtension };
  return { key: variableMetadataAttribute, value: metadata };
};
