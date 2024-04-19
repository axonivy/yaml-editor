import { Pair, Scalar, YAMLMap, parseDocument, stringify } from 'yaml';
import { addSingleLeadingWhitespaceToEachLine, getLastLine, removeSingleLeadingWhitespaceFromEachLine } from '../../../utils/string/string';
import {
  isYAMLNodeWithChildren,
  isYAMLNodeWithoutChildren,
  isYAMLRoot,
  type YAMLNode,
  type YAMLNodeWithChildren,
  type YAMLNodeWithoutChildren
} from '../../../utils/yaml/types';
import {
  isEnumMetadata,
  isFileMetadata,
  isFileMetadataFilenameExtension,
  isMetadataType,
  type EnumMetadata,
  type FileMetadata,
  type Metadata,
  type MetadataType
} from './metadata';
import type { Variable } from './variable';

export const toVariables = (content: string) => {
  const variablesNode = parseDocument(content).get('Variables');
  if (!isYAMLRoot(variablesNode)) {
    return [];
  }
  const nodeChildren = variablesNode.items;
  if (nodeChildren.length === 0) {
    return [];
  }
  nodeChildren[0].key.commentBefore = variablesNode.commentBefore;
  return parseNodes(nodeChildren);
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
    variable.description = removeSingleLeadingWhitespaceFromEachLine(commentBefore);
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
  variable.description = removeSingleLeadingWhitespaceFromEachLine(commentBefore);
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

export const toContent = (variables: Array<Variable>) => {
  return stringify(new Pair(new Scalar('Variables'), parseVariables(variables)));
};

const parseVariables = (variables: Array<Variable>) => {
  const map = new YAMLMap();
  variables.forEach(variable => {
    if (!map.has(variable.name)) {
      map.add(parseVariable(variable));
    }
  });
  return map;
};

const parseVariable = (variable: Variable) => {
  const variableKey = new Scalar(variable.name);
  variableKey.commentBefore = parseKeyDescription(variable);
  let variableValue;
  if (variable.children.length === 0) {
    variableValue = new Scalar(parseVariableValue(variable.value));
  } else {
    variableValue = parseVariables(variable.children);
  }
  return new Pair(variableKey, variableValue);
};

const parseKeyDescription = (variable: Variable) => {
  const metadata = variable.metadata;
  const description = variable.description;
  if (metadata.type === '') {
    if (description) {
      return addSingleLeadingWhitespaceToEachLine(description);
    }
    return undefined;
  }

  const metadataComment = parseMetadataComment(metadata);
  const commentBefore = description ? description + '\n' + metadataComment : metadataComment;
  return addSingleLeadingWhitespaceToEachLine(commentBefore);
};

const parseMetadataComment = (metadata: Metadata) => {
  let metadataComment;
  switch (metadata.type) {
    case 'enum':
      if (isEnumMetadata(metadata)) {
        metadataComment = 'enum: ' + metadata.values.join(', ');
      }
      break;
    case 'file':
      if (isFileMetadata(metadata)) {
        metadataComment = 'file: ' + metadata.filenameExtension;
      }
      break;
    default:
      metadataComment = metadata.type;
      break;
  }
  return '[' + metadataComment + ']';
};

const parseVariableValue = (value: string) => {
  const valueLowercase = value.toLowerCase();
  if (valueLowercase === 'true') {
    return true;
  }
  if (valueLowercase === 'false') {
    return false;
  }

  const valueNumber = Number(value);
  if (!isNaN(valueNumber)) {
    return valueNumber;
  }

  return value;
};
