import type { TreeNode } from '../types/config';

export interface TestData {
  name: string;
  value: string;
}
export interface TestNode extends TreeNode<TestNode> {}
