import {
  BrowsersView,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  selectRow,
  useBrowser,
  type BrowserNode
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { type Table } from '@tanstack/react-table';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useClient } from '../../../protocol';
import type { DataContext, ProjectVarNode } from '../../../protocol/types';
import { genQueryKey } from '../../../query';
import { toRowId } from '../../../utils/tree/tree';
import { addNode } from '../../../utils/tree/tree-data';
import type { AddNodeReturnType, TreePath } from '../../../utils/tree/types';
import { isMetadataType, type MetadataType } from '../data/metadata';
import { VariableFactory, type Variable } from '../data/variable';
import { nodeIcon } from '../data/variable-utils';

type OverwriteProps = {
  context: DataContext;
  table: Table<Variable>;
  variables: Array<Variable>;
  setVariables: (variables: Array<Variable>) => void;
  setSelectedVariablePath: (path: TreePath) => void;
};

export const OverwriteDialog = ({ context, table, variables, setVariables, setSelectedVariablePath }: OverwriteProps) => {
  const insertVariable = (node?: ProjectVarNode): void => {
    if (node) {
      const addNodeReturnValue = addVariable(variables, node);
      setVariables(addNodeReturnValue.newData);
      selectRow(table, toRowId(addNodeReturnValue.newNodePath));
      setSelectedVariablePath(addNodeReturnValue.newNodePath);
    }
  };

  const VariableBrowser = ({ applyFn, context }: { applyFn: (node?: ProjectVarNode) => void; context: DataContext }) => {
    const client = useClient();

    const queryKeys = useMemo(() => ({ knownVariables: () => genQueryKey('meta/knownVariables', context) }), [context]);

    const { data: knownVariables } = useQuery({
      queryKey: queryKeys.knownVariables(),
      queryFn: () => client.meta('meta/knownVariables', context)
    });

    const [nodes, setNodes] = useState<BrowserNode[]>([]);

    useEffect(() => {
      setNodes(toNodes(knownVariables));
    }, [knownVariables]);

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
        applyBtn={{ label: 'Import', icon: IvyIcons.FileImport }}
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
      <DialogContent style={{ height: '80vh', width: '500px', gridTemplateRows: 'auto 1fr auto' }}>
        <DialogHeader>
          <DialogTitle>Import and overwrite variable from required projects</DialogTitle>
        </DialogHeader>
        <VariableBrowser
          applyFn={node => {
            insertVariable(node);
            setDialogState(false);
          }}
          context={context}
        />
      </DialogContent>
    </Dialog>
  );
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

const toNodes = (root?: ProjectVarNode): Array<BrowserNode> => {
  if (!root) {
    return [];
  }
  return root.children.map(varNode => toNode(varNode));
};

const addVariable = (variables: Variable[], node: ProjectVarNode): AddNodeReturnType<Variable> => {
  const lastDot = node.key.lastIndexOf('.');
  const namespace = node.key.substring(0, lastDot);
  let metadataType: MetadataType = '';
  if (isMetadataType(node.type)) {
    metadataType = node.type;
  }
  const returnValue = addNode(node.name, namespace, variables, name => {
    if (name === node.name) {
      return {
        name,
        value: node.value,
        children: [],
        description: node.description,
        metadata: { type: metadataType }
      };
    }
    return VariableFactory(name);
  });
  let childReturnValue = returnValue;
  for (const child of node.children) {
    childReturnValue = addVariable(childReturnValue.newData, child);
  }
  returnValue.newData = childReturnValue.newData;
  return returnValue;
};
