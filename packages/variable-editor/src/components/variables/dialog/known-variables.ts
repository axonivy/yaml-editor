import type { BrowserNode } from '@axonivy/ui-components';
import type { KnownVariables } from '@axonivy/variable-editor-protocol';
import { nodeIcon } from '../data/variable-utils';

export const toNodes = (root?: KnownVariables): Array<BrowserNode> => {
  if (!root) {
    return [];
  }
  return root.children.map(varNode => toNode(varNode));
};

const toNode = (node: KnownVariables): BrowserNode => {
  const children = node.children.map(child => toNode(child));
  const icon = nodeIcon(node);
  const info = node.description;
  return {
    value: node.name,
    info,
    icon,
    data: node,
    children
  };
};
