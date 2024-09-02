export type TreeNode<TNode extends TreeNode<TNode>> = {
  name: string;
  value: string;
  children: Array<TNode>;
};
export type TreeNodeFactory<TreeNode> = (name: string) => TreeNode;

export type TreeNodeUpdate<TNode extends TreeNode<TNode>> = {
  [TKey in keyof TNode]: {
    key: TKey;
    value: TNode[TKey];
  };
}[keyof TNode];
export type TreeNodeUpdates<TNode extends TreeNode<TNode>> = Array<TreeNodeUpdate<TNode>>;
export type TreePath = Array<number>;

export type AddChildToFirstSelectedRowReturnType<TNode extends TreeNode<TNode>> = {
  newData: Array<TNode>;
  selectedNode?: TNode;
  newChildPath: TreePath;
};
export type AddNodeReturnType<TNode extends TreeNode<TNode>> = { newData: Array<TNode>; newNodePath: TreePath };
export type DeleteFirstSelectedRowReturnType<TNode extends TreeNode<TNode>> = { newData: Array<TNode>; selectedPath: TreePath };
