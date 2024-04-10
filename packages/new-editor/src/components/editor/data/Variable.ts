import type { TreeNode } from '../../../types/config';

export interface Variable extends TreeNode<Variable> {
  description: string;
  metadata: (typeof metadataOptions)[number]['value'];
}

export const metadataOptions = [
  { label: 'None', value: 'none' },
  { label: 'Password', value: 'password' },
  { label: 'Daytime', value: 'daytime' },
  { label: 'Enum', value: 'enum' },
  { label: 'File', value: 'file' }
] as const satisfies Array<{ label: string; value: string }>;
