import type { Row, Table } from '@tanstack/react-table';
import { getFirstSelectedRow, selectRow } from '../table/table';
import { addNode, getNode, removeNode } from './tree-data';
import type { AddChildToFirstSelectedRowReturnType, DeleteFirstSelectedRowReturnType, TreeNode, TreePath } from './types';

export const addChildToFirstSelectedRow = <TNode extends TreeNode<TNode>>(
  table: Table<TNode>,
  data: Array<TNode>,
  newNode: TNode
): AddChildToFirstSelectedRowReturnType<TNode> => {
  const row = getFirstSelectedRow(table);
  const path = getPathOfRow(row);
  const addNodeReturnValue = addNode(data, path, newNode);
  const newData = addNodeReturnValue.newData;
  const newChildIndex = addNodeReturnValue.newChildIndex;
  const newChildId = toRowId([...path, newChildIndex]);
  selectRow(table, newChildId);
  return { newData: newData, selectedNode: getNode(newData, path), newChildPath: [...path, newChildIndex] };
};

export const deleteFirstSelectedRow = <TNode extends TreeNode<TNode>>(
  table: Table<TNode>,
  data: Array<TNode>
): DeleteFirstSelectedRowReturnType<TNode> => {
  const selectedRow = getFirstSelectedRow(table);
  const newData = removeNode(data, getPathOfRow(selectedRow));
  let selectedVariablePath: TreePath;
  if (!selectedRow) {
    selectedVariablePath = [];
  } else {
    selectedVariablePath = adjustSelectionAfterDeletionOfRow(newData, table, selectedRow);
  }
  return { newData: newData, selectedVariablePath: selectedVariablePath };
};

export const getPathOfRow = <TNode extends TreeNode<TNode>>(row?: Row<TNode>) => {
  if (!row) {
    return [];
  }
  return toTreePath(row.id);
};

const getPathOfParentRow = <TNode extends TreeNode<TNode>>(row?: Row<TNode>) => {
  if (!row || !row.parentId) {
    return [];
  }
  return toTreePath(row.parentId);
};

const adjustSelectionAfterDeletionOfRow = <TNode extends TreeNode<TNode>>(data: Array<TNode>, table: Table<TNode>, row: Row<TNode>) => {
  const parentPath = getPathOfParentRow(row);
  const parentNode = getNode(data, parentPath);
  const children = parentNode ? parentNode.children : data;
  const childIndex = row.index;

  let selectedRowPath;
  switch (children.length) {
    // node was the last remaining child of its parent -> select parent
    case 0:
      selectedRowPath = parentPath;
      break;
    // node is the last child in the list of children of its parent -> select previous child
    case childIndex:
      selectedRowPath = [...parentPath, childIndex - 1];
      break;
    // default case -> select next child
    default:
      selectedRowPath = [...parentPath, childIndex];
      break;
  }
  selectRow(table, toRowId(selectedRowPath));
  return selectedRowPath;
};

const toTreePath = (rowId: string) => {
  return rowId.split('.').map(index => Number(index));
};

const toRowId = (path: TreePath) => {
  return path.join('.');
};
