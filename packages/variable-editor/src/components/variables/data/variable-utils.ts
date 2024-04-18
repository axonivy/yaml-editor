import { parseDocument } from 'yaml';
import { getLastLine, removeLeadingWhitespacesFromEachLine } from '../../../utils/string/string';
import {
  isYAMLNodeWithChildren,
  isYAMLNodeWithoutChildren,
  isYAMLRoot,
  type YAMLNode,
  type YAMLNodeWithChildren,
  type YAMLNodeWithoutChildren
} from '../../../utils/yaml/types';
import { isFileMetadataFilenameExtension, isMetadataType, type EnumMetadata, type FileMetadata, type MetadataType } from './metadata';
import type { Variable } from './variable';

export const toVariables = (content: string) => {
  const variablesNode = parseDocument(content).get('Variables');
  if (!isYAMLRoot(variablesNode)) {
    return [];
  }
  const nodeChildren = variablesNode.items;
  nodeChildren[0].key.commentBefore = variablesNode.commentBefore;
  const newLocal = parseNodes(nodeChildren);
  return newLocal;
};

const parseNodes = (nodes: Array<YAMLNode>): Array<Variable> => {
  if (!nodes || nodes.length === 0) {
    return [];
  }
  return nodes.map(parseNode);
};

const parseNode = (node: YAMLNode) => {
  const variable: Variable = {
    name: node.key.value,
    value: '',
    description: '',
    metadata: { type: '' },
    children: []
  };

  if (isYAMLNodeWithChildren(node)) {
    return enrichVariableWithChildren(variable, node);
  } else if (isYAMLNodeWithoutChildren(node)) {
    return enrichVariableWithoutChildren(variable, node);
  }
  return variable;
};

const enrichVariableWithChildren = (variable: Variable, node: YAMLNodeWithChildren) => {
  const commentBefore = node.key.commentBefore;
  if (commentBefore) {
    variable.description = removeLeadingWhitespacesFromEachLine(commentBefore);
  }
  const nodeChildren = node.value.items;
  nodeChildren[0].key.commentBefore = node.value.commentBefore;
  variable.children = parseNodes(nodeChildren);
  return variable;
};

const enrichVariableWithoutChildren = (variable: Variable, node: YAMLNodeWithoutChildren) => {
  variable.value = String(node.value.value);
  return enrichVariableDescriptionAndMetadata(variable, node);
};

const enrichVariableDescriptionAndMetadata = (variable: Variable, node: YAMLNodeWithoutChildren) => {
  const commentBefore = node.key.commentBefore;
  if (!commentBefore) {
    return variable;
  }
  variable.description = removeLeadingWhitespacesFromEachLine(commentBefore);
  return enrichVariableMetadata(variable);
};

const enrichVariableMetadata = (variable: Variable) => {
  const metadata = extractMetadata(variable);
  if (!metadata) {
    return variable;
  }

  if (isMetadataType(metadata)) {
    return enrichVariableWithMetadata(variable, metadata);
  }
  if (metadata.startsWith('enum:')) {
    return enrichVariableWithEnumMetadata(variable, metadata);
  }
  if (metadata.startsWith('file:')) {
    return enrichVariableWithFileMetadata(variable, metadata);
  }
  return variable;
};

const extractMetadata = (variable: Variable) => {
  const lastDescriptionLine = getLastLine(variable.description);
  if (!lastDescriptionLine) {
    return;
  }
  const metadataMatch = lastDescriptionLine.match(/^\s*\[(.+)\]\s*$/);
  if (!metadataMatch || metadataMatch.length !== 2) {
    return;
  }
  variable.description = variable.description.substring(0, variable.description.lastIndexOf('\n'));
  return metadataMatch[1];
};

const enrichVariableWithMetadata = (variable: Variable, metadataType: MetadataType) => {
  variable.metadata = { type: metadataType };
  return variable;
};

const enrichVariableWithEnumMetadata = (variable: Variable, metadata: string) => {
  const enumValues = metadata
    .replace(/^enum:/, '')
    .replace(/\s/g, '')
    .split(',');
  const enumMetadata: EnumMetadata = { type: 'enum', values: enumValues };
  variable.metadata = enumMetadata;
  return variable;
};

const enrichVariableWithFileMetadata = (variable: Variable, metadata: string) => {
  const filenameExtension = metadata.replace(/^file:\s*/, '');
  if (isFileMetadataFilenameExtension(filenameExtension)) {
    const fileMetadata: FileMetadata = { type: 'file', filenameExtension: filenameExtension };
    variable.metadata = fileMetadata;
  }
  return variable;
};
