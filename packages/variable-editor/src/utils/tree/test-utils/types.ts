import type { TreeNodeFactory } from '../types';

export const TestTreeNodeFactory: TreeNodeFactory<{ name: string; value: string; children: Array<any> }> = (name: string) => {
  return {
    name: name,
    value: '',
    children: []
  };
};
