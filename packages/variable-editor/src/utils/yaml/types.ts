export interface YAMLRoot {
  items: Array<YAMLNode>;
  commentBefore?: string;
}

interface YAMLNodeBase {
  key: YAMLNodeKey;
}
export interface YAMLNodeWithChildren extends YAMLNodeBase {
  value: YAMLNodeValueWithChildren;
}
export interface YAMLNodeWithoutChildren extends YAMLNodeBase {
  value: YAMLNodeValueWithoutChildren;
}
export type YAMLNode = YAMLNodeWithChildren | YAMLNodeWithoutChildren;

interface YAMLNodeKey {
  value: string;
  commentBefore?: string;
}

interface YAMLNodeValueBase {
  commentBefore?: string;
}
interface YAMLNodeValueWithChildren extends YAMLNodeValueBase {
  items: Array<YAMLNode>;
}
interface YAMLNodeValueWithoutChildren extends YAMLNodeValueBase {
  value: any;
}

export const isYAMLRoot = (root: any): root is YAMLRoot => {
  return (
    root !== undefined &&
    (root.commentBefore === undefined || typeof root.commentBefore === 'string') &&
    Array.isArray(root.items) &&
    root.items.every((item: any) => isYAMLNode(item))
  );
};

const isYAMLNodeBase = (node: any): node is YAMLNodeBase => {
  return node.key !== undefined && isYAMLNodeKey(node.key);
};
export const isYAMLNodeWithChildren = (node: any): node is YAMLNodeWithChildren => {
  return node !== undefined && node.value !== undefined && isYAMLNodeValueWithChildren(node.value) && isYAMLNodeBase(node);
};
export const isYAMLNodeWithoutChildren = (node: any): node is YAMLNodeWithoutChildren => {
  return node !== undefined && node.value !== undefined && isYAMLNodeValueWithoutChildren(node.value) && isYAMLNodeBase(node);
};
const isYAMLNode = (node: any): node is YAMLNode => {
  return isYAMLNodeWithChildren(node) || isYAMLNodeWithoutChildren(node);
};

const isYAMLNodeKey = (nodeKey: any): nodeKey is YAMLNodeKey => {
  return typeof nodeKey.value === 'string' && (nodeKey.commentBefore === undefined || typeof nodeKey.commentBefore === 'string');
};

const isYAMLNodeValueBase = (nodeValue: any): nodeValue is YAMLNodeValueBase => {
  return nodeValue.commentBefore === undefined || typeof nodeValue.commentBefore === 'string';
};
const isYAMLNodeValueWithChildren = (nodeValue: any): nodeValue is YAMLNodeValueWithChildren => {
  return Array.isArray(nodeValue.items) && nodeValue.items.every((item: any) => isYAMLNode(item)) && isYAMLNodeValueBase(nodeValue);
};
const isYAMLNodeValueWithoutChildren = (nodeValue: any): nodeValue is YAMLNodeValueWithoutChildren => {
  return nodeValue.value !== undefined && isYAMLNodeValueBase(nodeValue);
};
