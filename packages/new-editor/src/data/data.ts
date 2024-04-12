import type { AddNodeReturnType, TreeNode, TreeNodeUpdates, TreePath } from '../types/config';

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
  return getNodeRecursive(data, path.slice(0, -1));
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

export const updateNode = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path: TreePath, updates: TreeNodeUpdates<TNode>) => {
  const newData = structuredClone(data);
  const node = getNode(newData, path);
  if (!node) {
    return newData;
  }
  updates.forEach(update => (node[update.key] = update.value));
  return newData;
};

export const addNode = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path: TreePath, newNode: TNode): AddNodeReturnType<TNode> => {
  const newData = structuredClone(data);
  const node = getNode(newData, path);
  let newChildIndex;
  if (!node) {
    newData.push(newNode);
    newChildIndex = newData.length - 1;
  } else {
    const children = node.children;
    children.push(newNode);
    newChildIndex = children.length - 1;
  }
  return { newData: newData, newChildIndex: newChildIndex };
};

export const removeNode = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path: TreePath) => {
  const newData = structuredClone(data);
  const children = getChildrenContainingNode(newData, path);
  if (!children) {
    return newData;
  }
  const childIndex = path[path.length - 1];
  children.splice(childIndex, 1);
  return newData;
};

const getChildrenContainingNode = <TNode extends TreeNode<TNode>>(data: Array<TNode>, path: TreePath) => {
  if (path.length === 1) {
    return data;
  }
  const parent = getParentNode(data, path);
  if (!parent) {
    return;
  }
  return parent.children;
};

export const hasChildren = <TNode extends TreeNode<TNode>>(node: TNode) => {
  return node.children.length !== 0;
};
