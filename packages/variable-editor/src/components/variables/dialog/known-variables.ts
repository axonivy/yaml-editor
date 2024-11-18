import type { BrowserNode } from '@axonivy/ui-components';
import type { ProjectVarNode } from '@axonivy/variable-editor-protocol';
import { nodeIcon } from '../data/variable-utils';

export const toNodes = (root?: ProjectVarNode): Array<BrowserNode> => {
  if (!root) {
    return [];
  }
  return root.children.map(varNode => toNode(varNode));
};

const toNode = (node: ProjectVarNode): BrowserNode => {
  const c = node.children.map(child => toNode(child));
  const icon = nodeIcon(node);
  const info = node.description;
  return {
    value: node.name,
    info,
    icon,
    data: node,
    children: c
  };
};
