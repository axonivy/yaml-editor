import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  BrowsersView,
  useBrowser,
  type BrowserNode
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ProjectVarNode } from '../../../protocol/types';
import { useState, type ReactNode } from 'react';
import { nodeIcon } from '../data/variable-utils';

type OverwriteProps = {
  overwritables?: ProjectVarNode;
};

const toNodes = (overwritables?: ProjectVarNode): Array<BrowserNode> => {
  if (!overwritables) {
    return [];
  }
  return overwritables.children.map(varNode => toNode(varNode));
};

const toNode = (node: ProjectVarNode): BrowserNode => {
  const c = node.children.map(child => toNode(child));
  const icon = nodeIcon(node);
  const info = node.description;
  return {
    value: node.name,
    info: info,
    icon: icon,
    data: node,
    children: c
  };
};

const insertVariable = (node?: ProjectVarNode): void => {
  console.log(node);
};

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

export const OverwriteDialog = ({ overwritables }: OverwriteProps) => {
  const nodes = toNodes(overwritables);
  const VariableBrowser = ({ applyFn }: { applyFn: (node?: ProjectVarNode) => void }) => {
    const variableBrowser = useBrowser(nodes);
    return (
      <BrowsersView
        browsers={[
          {
            name: 'Variables',
            icon: IvyIcons.Bend,
            browser: variableBrowser,
            infoProvider: row => {
              return info(row?.original.data as ProjectVarNode);
            }
          }
        ]}
        apply={value => {
          applyFn(value?.data as ProjectVarNode);
        }}
      />
    );
  };

  const [dialogState, setDialogState] = useState(false);

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <DialogTrigger asChild>
        <Button icon={IvyIcons.FileImport} aria-label='Overwrite variable' />
      </DialogTrigger>
      <DialogContent style={{ height: '80vh' }}>
        <DialogHeader>
          <DialogTitle>Overwrite variable from dependent projects</DialogTitle>
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
