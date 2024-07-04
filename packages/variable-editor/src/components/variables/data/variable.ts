import type { TreeNode, TreeNodeFactory, TreeNodeUpdate, TreeNodeUpdates } from '../../../utils/tree/types';
import type { Metadata } from './metadata';

export const variableDescriptionAttribute = 'description';
export const variableMetadataAttribute = 'metadata';

export interface Variable extends TreeNode<Variable> {
  description: string;
  metadata: Metadata;
}
export const VariableFactory: TreeNodeFactory<Variable> = (name: string) => {
  return {
    name: name,
    value: '',
    children: [],
    description: '',
    metadata: { type: '' }
  };
};

export type VariableUpdate = TreeNodeUpdate<Variable>;
export type VariableUpdates = TreeNodeUpdates<Variable>;

export interface RootVariable extends Variable {
  commentAfter: string;
}
