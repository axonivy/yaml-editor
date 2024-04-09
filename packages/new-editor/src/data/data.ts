import type { TreeNode, TreePath } from '../types/config';

export const getNode = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path?: TreePath) => {
  if (!path || path.length === 0) {
    return;
  }
  return getNodeRecursive(data, [...path]);
};

const getParentNode = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path?: TreePath) => {
  if (!path || path.length === 0 || path.length === 1) {
    return;
  }
  const parentNode = getNodeRecursive(data, path.slice(0, -1));
  if (!parentNode) {
    return null;
  }
  return parentNode;
};

const getNodeRecursive = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path: TreePath): TNode | undefined => {
  const node = data[path.shift()!];
  if (path.length === 0) {
    return node;
  }
  if (!node) {
    return;
  }
  return getNodeRecursive(node.children, path);
};

export const updateNode = <TNode extends TreeNode<TNode>, TKey extends keyof TNode>(
  data: Array<TNode>,
  path: TreePath,
  key: TKey,
  value: TNode[TKey]
) => {
  const node = getNode(data, path);
  if (!node) {
    return;
  }
  node[key] = value;
};

export const addNode = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path: TreePath, newNode: TNode) => {
  const node = getNode(data, path);
  if (!node) {
    data.push(newNode);
    return data.length - 1;
  }
  const children = node.children;
  children.push(newNode);
  return children.length - 1;
};

export const removeNode = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path: TreePath) => {
  const parent = getParentNode(data, path);
  if (parent === null) {
    return;
  }
  const children = parent ? parent.children : data;
  const childIndex = path[path.length - 1];
  children.splice(childIndex, 1);
};

export const hasChildren = <TNode extends TreeNode<TNode>>(node: TNode) => {
  return node.children.length !== 0;
};
