export type TreeNode<TNode extends TreeNode<TNode>> = { name: string; value: string; children: Array<TNode> };
export type TreePath = Array<number>;

export type addChildToFirstSelectedRowReturnType<TNode extends TreeNode<TNode>> = { selectedNode?: TNode; newChildPath: TreePath };
