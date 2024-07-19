import {
  BrowsersView,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useBrowser,
  type BrowserNode
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactNode } from 'react';
import { type Table } from '@tanstack/react-table';
import type { ProjectVarNode } from '../../../protocol/types';
import { addNode } from '../../../utils/tree/tree-data';
import { VariableFactory, type Variable } from '../data/variable';
import { nodeIcon } from '../data/variable-utils';
import type { TreePath } from '../../../utils/tree/types';
import { selectRow } from '../../../utils/table/table';
import { toRowId } from '../../../utils/tree/tree';
import { isMetadataType, type MetadataType } from '../data/metadata';

type OverwriteProps = {
  knownVariables?: ProjectVarNode;
  table: Table<Variable>;
  variables: Array<Variable>;
  setVariables: (variables: Array<Variable>) => void;
  setSelectedVariablePath: (path: TreePath) => void;
};

export const OverwriteDialog = ({ knownVariables, table, variables, setVariables, setSelectedVariablePath }: OverwriteProps) => {
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

  const toNodes = (): Array<BrowserNode> => {
    if (!knownVariables) {
      return [];
    }
    return knownVariables.children.map(varNode => toNode(varNode));
  };

  const nodes = toNodes();

  const insertVariable = (node?: ProjectVarNode): void => {
    if (node) {
      const lastDot = node?.key.lastIndexOf('.');
      const namespace = node?.key.substring(0, lastDot);
      let metadataType: MetadataType = '';
      if (isMetadataType(node?.type)) {
        metadataType = node?.type;
      }
      const addNodeReturnValue = addNode(node?.name, namespace, variables, name => {
        if (name === node?.name) {
          return {
            name,
            value: node?.value,
            children: [],
            description: node?.description,
            metadata: { type: metadataType }
          };
        }
        return VariableFactory(name);
      });
      selectRow(table, toRowId(addNodeReturnValue.newNodePath));
      setSelectedVariablePath(addNodeReturnValue.newNodePath);
      setVariables(addNodeReturnValue.newData);
    }
  };

  const VariableBrowser = ({ applyFn }: { applyFn: (node?: ProjectVarNode) => void }) => {
    const variableBrowser = useBrowser(nodes);
    return (
      <BrowsersView
        browsers={[
          {
            name: 'Variables',
            icon: IvyIcons.Tool,
            browser: variableBrowser,
            infoProvider: row => {
              return info(row?.original.data as ProjectVarNode);
            }
          }
        ]}
        apply={(type, result) => {
          applyFn(result?.data as ProjectVarNode);
        }}
      />
    );
  };

  const [dialogState, setDialogState] = useState(false);

  const info = (node?: ProjectVarNode): ReactNode => {
    let value = node?.value;
    if (value !== undefined && node?.type == 'password') {
      value = '***';
    }
    if (value !== undefined && value !== '') {
      value = node?.name + ' = ' + value;
    }
    return (
      <div>
        <div>{node?.key}</div>
        <div>{node?.description}</div>
        <div>{value}</div>
      </div>
    );
  };

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogTrigger asChild>
        <Button icon={IvyIcons.FileImport} aria-label='Overwrite variable' />
      </DialogTrigger>
      <DialogContent style={{ height: '40vh', gridTemplateRows: 'auto 1fr auto' }}>
        <DialogHeader>
          <DialogTitle>Import and overwrite variable from required projects</DialogTitle>
        </DialogHeader>
        <VariableBrowser
          applyFn={node => {
            insertVariable(node);
            setDialogState(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
