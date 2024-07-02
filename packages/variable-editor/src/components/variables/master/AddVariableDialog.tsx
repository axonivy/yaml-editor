import {
  BasicSelect,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Fieldset,
  Flex,
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type Table } from '@tanstack/react-table';
import { useState } from 'react';
import { addChildToFirstSelectedRow } from '../../../utils/tree/tree';
import type { TreePath } from '../../../utils/tree/types';
import type { Variable } from '../data/variable';
import './AddVariableDialog.css';

type AddVariableDialogProps = {
  table: Table<Variable>;
  variables: Array<Variable>;
  setVariables: (variables: Array<Variable>) => void;
  setSelectedVariablePath: (path: TreePath) => void;
};

export const AddVariableDialog = ({ table, variables, setVariables, setSelectedVariablePath }: AddVariableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const addVariable = () => {
    const newVariable: Variable = {
      name: '',
      value: '',
      description: '',
      metadata: { type: '' },
      children: []
    };

    const addChildToFirstSelectedRowReturnValue = addChildToFirstSelectedRow(table, variables, newVariable);
    const parentNode = addChildToFirstSelectedRowReturnValue.selectedNode;
    if (parentNode) {
      parentNode.value = '';
      parentNode.metadata = { type: '' };
    }

    setSelectedVariablePath(addChildToFirstSelectedRowReturnValue.newChildPath);
    setVariables(addChildToFirstSelectedRowReturnValue.newData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className='add-variable-dialog-trigger-button'
          icon={IvyIcons.Plus}
          aria-label='Add variable'
          onClick={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Variable</DialogTitle>
        </DialogHeader>
        <Flex direction='column' gap={2}>
          <Fieldset label='Name'>
            <Input />
          </Fieldset>
          <Fieldset label='Namespace'>
            <BasicSelect items={[]} />
          </Fieldset>
        </Flex>
        <DialogFooter>
          <Button variant='primary' size='large' type='submit' aria-label='Create variable' onClick={addVariable}>
            Create Variable
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
