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
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { selectRow } from '../../../utils/table/table';
import { keyOfFirstSelectedNonLeafRow, keysOfAllNonLeafRows, newNodeName, subRowNamesOfRow, toRowId } from '../../../utils/tree/tree';
import { addNode } from '../../../utils/tree/tree-data';
import type { TreePath } from '../../../utils/tree/types';
import { validateName, validateNamespace } from '../data/validation-utils';
import { VariableFactory, type Variable } from '../data/variable';
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

  const nameValidationMessage = useMemo(() => {
    return validateName(name, subRowNamesOfRow(namespace, table));
  }, [name, namespace, table]);

  const namespaceValidationMessage = useMemo(() => {
    return validateNamespace(namespace, variables);
  }, [namespace, variables]);

  const initializeVariableDialog = () => {
    setName(newNodeName(table, 'NewVariable'));
    setNamespace(keyOfFirstSelectedNonLeafRow(table));
  };

  const namespaceOptions = () => {
    return keysOfAllNonLeafRows(table).map(key => ({
      value: key
    }));
  };

  const addVariable = () => {
    const addNodeReturnValue = addNode(name, namespace, variables, VariableFactory);
    selectRow(table, toRowId(addNodeReturnValue.newNodePath));
    setSelectedVariablePath(addNodeReturnValue.newNodePath);
    setVariables(addNodeReturnValue.newData);
  };

  const allInputsValid = () => {
    return !nameValidationMessage && !namespaceValidationMessage;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className='add-variable-dialog-trigger-button'
          icon={IvyIcons.Plus}
          onClick={initializeVariableDialog}
          aria-label='Add variable'
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Variable</DialogTitle>
        </DialogHeader>
        <Flex direction='column' gap={2}>
          <Fieldset label='Name' message={nameValidationMessage} aria-label='Name'>
            <Input
              value={name}
              onChange={event => {
                setName(event.target.value);
              }}
            />
          </Fieldset>
          <Fieldset label='Namespace' message={namespaceValidationMessage} aria-label='Namespace'>
            <Combobox
              value={namespace}
              onChange={setNamespace}
              onInput={event => {
                setNamespace(event.currentTarget.value);
              }}
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
