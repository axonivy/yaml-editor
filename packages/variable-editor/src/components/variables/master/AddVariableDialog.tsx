import {
  Button,
  Combobox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Fieldset,
  Flex,
  Input,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type Table } from '@tanstack/react-table';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  addChildToFirstSelectedRow,
  keyOfFirstSelectedNonLeafRow,
  keysOfAllNonLeafRows,
  newNodeName,
  subRowNamesOfRow
} from '../../../utils/tree/tree';
import type { TreePath } from '../../../utils/tree/types';
import { validateName } from '../data/validation-utils';
import type { Variable } from '../data/variable';
import './AddVariableDialog.css';

type AddVariableDialogProps = {
  table: Table<Variable>;
  variables: Array<Variable>;
  setVariables: (variables: Array<Variable>) => void;
  setSelectedVariablePath: (path: TreePath) => void;
};

export const AddVariableDialog = ({ table, variables, setVariables, setSelectedVariablePath }: AddVariableDialogProps) => {
  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('');

  const nameValidationMessage = useMemo((): MessageData => {
    const validationMessage = validateName(name, subRowNamesOfRow(namespace, table));
    if (!validationMessage) {
      return;
    }
    return { message: validationMessage, variant: 'error' };
  }, [name, namespace, table]);

  const handleAddVariableDialogOpen = () => {
    setName(newNodeName(table, 'NewVariable'));
    setNamespace(keyOfFirstSelectedNonLeafRow(table));
  };

  const handleNameInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleNamespaceComboboxChange = (value: string) => {
    setNamespace(value);
  };

  const handleNamespaceComboboxInput = (event: FormEvent<HTMLInputElement>) => {
    setNamespace(event.currentTarget.value);
  };

  const namespaceOptions = () => {
    return keysOfAllNonLeafRows(table).map(key => ({
      value: key
    }));
  };

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
  };

  const allInputsValid = () => {
    return !nameValidationMessage;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className='add-variable-dialog-trigger-button'
          icon={IvyIcons.Plus}
          onClick={handleAddVariableDialogOpen}
          aria-label='Add variable'
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Variable</DialogTitle>
        </DialogHeader>
        <Flex direction='column' gap={2}>
          <Fieldset label='Name' message={nameValidationMessage} aria-label='Name'>
            <Input defaultValue={name} onChange={handleNameInputChange} />
          </Fieldset>
          <Fieldset label='Namespace'>
            <Combobox
              value={namespace}
              onChange={handleNamespaceComboboxChange}
              onInput={handleNamespaceComboboxInput}
              options={namespaceOptions()}
            />
          </Fieldset>
        </Flex>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='primary'
              size='large'
              type='submit'
              aria-label='Create variable'
              disabled={!allInputsValid()}
              onClick={addVariable}
            >
              Create Variable
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
