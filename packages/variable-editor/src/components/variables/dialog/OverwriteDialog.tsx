import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, selectRow } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type Table } from '@tanstack/react-table';
import { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import type { ProjectVarNode } from '@axonivy/variable-editor-protocol';
import { toRowId } from '../../../utils/tree/tree';
import { addNode } from '../../../utils/tree/tree-data';
import type { AddNodeReturnType } from '../../../utils/tree/types';
import { isMetadataType, type MetadataType } from '../data/metadata';
import { createVariable, type Variable } from '../data/variable';
import { VariableBrowser } from './VariableBrowser';

type OverwriteProps = {
  table: Table<Variable>;
};

export const OverwriteDialog = ({ table }: OverwriteProps) => {
  const { setVariables, setSelectedVariable } = useAppContext();

  const insertVariable = (node?: ProjectVarNode): void => {
    if (node) {
      setVariables(old => {
        const addNodeReturnValue = addVariable(old, node);
        selectRow(table, toRowId(addNodeReturnValue.newNodePath));
        setSelectedVariable(addNodeReturnValue.newNodePath);
        return addNodeReturnValue.newData;
      });
    }
  };

  const [dialogState, setDialogState] = useState(false);

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
        />
      </DialogContent>
    </Dialog>
  );
};

const addVariable = (variables: Array<Variable>, node: ProjectVarNode): AddNodeReturnType<Variable> => {
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
    return createVariable(name);
  });
  let childReturnValue = returnValue;
  for (const child of node.children) {
    childReturnValue = addVariable(childReturnValue.newData, child);
  }
  returnValue.newData = childReturnValue.newData;
  return returnValue;
};
