import type { TreeNode, TreeNodeFactory } from '../types';

export interface TestNode extends TreeNode<TestNode> {}
export const TestNodeFactory: TreeNodeFactory<TestNode> = (name: string) => {
  return {
    name: name,
    value: '',
    children: []
  };
};
