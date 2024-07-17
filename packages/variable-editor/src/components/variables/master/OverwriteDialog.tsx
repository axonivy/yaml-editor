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
import { useState } from 'react';
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
  let value = node.value;
  if (node.meta?.type?.format === 3) {
    value = '***';
  }
  const info = value === '' ? node.meta.description : value + ' - ' + node.meta.description;
  return {
    value: node.name,
    info: info,
    icon: icon,
    children: c
  };
};

export const OverwriteDialog = ({ overwritables }: OverwriteProps) => {
  const nodes = toNodes(overwritables);
  const VariableBrowser = ({ applyFn }: { applyFn?: (value?: string) => void }) => {
    const variableBrowser = useBrowser(nodes);
    return (
      <BrowsersView
        browsers={[
          {
            name: 'Variables',
            icon: IvyIcons.Bend,
            browser: variableBrowser,
            infoProvider: row => {
              return row?.original.value + ' - ' + row?.original.info;
            }
          }
        ]}
        apply={(value, type) => {
          console.log('apply', value, type);
          if (applyFn) applyFn(value?.cursor);
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
          applyFn={() => {
            setDialogState(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
