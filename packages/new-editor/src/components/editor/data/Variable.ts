import type { TreeNode, TreeNodeUpdate, TreeNodeUpdates } from '../../../types/config';

export const variableDescriptionAttribute = 'description';
export const variableMetadataAttribute = 'metadata';

export interface Variable extends TreeNode<Variable> {
  description: string;
  metadata: Metadata;
}
export type VariableUpdate = TreeNodeUpdate<Variable>;
export type VariableUpdates = TreeNodeUpdates<Variable>;

export const metadataTypePassword = 'password';
export const metadataTypeDaytime = 'daytime';
export const metadataTypeEnum = 'enum';
export const metadataTypeFile = 'file';

export const metadataOptions = [
  { label: 'Password', value: metadataTypePassword },
  { label: 'Daytime', value: metadataTypeDaytime },
  { label: 'Enum', value: metadataTypeEnum },
  { label: 'File', value: metadataTypeFile }
] as const satisfies Array<{ label: string; value: string }>;

export type MetadataType = (typeof metadataOptions)[number]['value'] | '';
export type Metadata = { type: MetadataType };
export interface EnumMetadata extends Metadata {
  values: Array<string>;
}

export const asEnumMetadata = (metadata?: Metadata) => {
  if (!metadata || metadata.type !== metadataTypeEnum) {
    return;
  }
  return metadata as EnumMetadata;
};
export const toEnumMetadataUpdate = (values: Array<string>): VariableUpdate => {
  return { key: variableMetadataAttribute, value: { type: metadataTypeEnum, values: values } as EnumMetadata };
};
