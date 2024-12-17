import type { BrowserNode } from '@axonivy/ui-components';
import type { KnownVariables } from '@axonivy/variable-editor-protocol';
import { addNode } from '../../../utils/tree/tree-data';
import { isMetadata, type Metadata } from '../data/metadata';
import { createVariable, type Variable } from '../data/variable';
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

export const findKnownVariable = (node: KnownVariables, ...key: Array<string>) => {
  let currentNode: KnownVariables | undefined = node;
  for (const part of key) {
    currentNode = currentNode.children.find(child => child.name === part);
    if (!currentNode) {
      return;
    }
  }
  return currentNode;
};

export const addKnownVariable = (variables: Array<Variable>, node: KnownVariables) => {
  let metadata: Metadata = { type: '' };
  const nodeMetaData = node.metaData;
  if (isMetadata(nodeMetaData)) {
    metadata = nodeMetaData;
  }
  let returnValue = addNode(node.name, node.namespace, variables, name => {
    if (name === node.name) {
      return {
        name,
        value: node.value,
        children: [],
        description: node.description,
        metadata
      };
    }
    return createVariable(name);
  });
  const newNodePath = returnValue.newNodePath;
  for (const child of node.children) {
    returnValue = addKnownVariable(returnValue.newData, child);
  }
  return { newData: returnValue.newData, newNodePath };
};
