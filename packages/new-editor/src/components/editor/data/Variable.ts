import type { TreeNode } from '../../../types/config';

export interface Variable extends TreeNode<Variable> {
  description: string;
  metadata: string;
}

export const metadataOptions: Array<{ label: string; value: string }> = [
  { label: 'None', value: 'none' },
  { label: 'Password', value: 'password' },
  { label: 'Daytime', value: 'daytime' },
  { label: 'Enum', value: 'enum' },
  { label: 'File', value: 'file' }
];

export const getSelectedMetadataOption = (variable: Variable) => {
  return metadataOptions.find(option => option.value === variable.metadata);
};
