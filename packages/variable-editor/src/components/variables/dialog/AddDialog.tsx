import {
  BasicField,
  Button,
  Combobox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Flex,
  Input,
  selectRow
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { EMPTY_KNOWN_VARIABLES } from '@axonivy/variable-editor-protocol';
import { type Table } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { keyOfFirstSelectedNonLeafRow, keysOfAllNonLeafRows, newNodeName, subRowNamesOfRow, toRowId } from '../../../utils/tree/tree';
import { addNode } from '../../../utils/tree/tree-data';
import { validateName, validateNamespace } from '../data/validation-utils';
import { createVariable, type Variable } from '../data/variable';
import './AddDialog.css';
import { addKnownVariable, findKnownVariable } from './known-variables';

type AddVariableDialogProps = {
  table: Table<Variable>;
};

export const AddVariableDialog = ({ table }: AddVariableDialogProps) => {
  const { context, variables, setVariables, setSelectedVariable } = useAppContext();

  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('');

  const nameValidationMessage = useMemo(() => validateName(name, subRowNamesOfRow(namespace, table)), [name, namespace, table]);

  const namespaceValidationMessage = useMemo(() => validateNamespace(namespace, variables), [namespace, variables]);

  const initializeVariableDialog = () => {
    setName(newNodeName(table, 'NewVariable'));
    setNamespace(keyOfFirstSelectedNonLeafRow(table));
  };

  const namespaceOptions = () => keysOfAllNonLeafRows(table).map(key => ({ value: key }));

  const knownVariables = useMeta('meta/knownVariables', context, EMPTY_KNOWN_VARIABLES).data;

  const addVariable = () => {
    const namespaceKey = namespace ? namespace.split('.') : [];
    const overwrittenVariable = findKnownVariable(knownVariables, ...namespaceKey, name);
    setVariables(old => {
      let addNodeReturnValue;
      if (overwrittenVariable) {
        addNodeReturnValue = addKnownVariable(old, overwrittenVariable);
      } else {
        addNodeReturnValue = addNode(name, namespace, old, createVariable);
      }
      selectRow(table, toRowId(addNodeReturnValue.newNodePath));
      setSelectedVariable(addNodeReturnValue.newNodePath);
      return addNodeReturnValue.newData;
    });
  };

  const allInputsValid = () => !nameValidationMessage && !namespaceValidationMessage;

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
      <DialogContent onCloseAutoFocus={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>New Variable</DialogTitle>
        </DialogHeader>
        <Flex direction='column' gap={3}>
          <BasicField label='Name' message={nameValidationMessage} aria-label='Name'>
            <Input
              value={name}
              onChange={event => {
                setName(event.target.value);
              }}
            />
          </BasicField>
          <BasicField
            label='Namespace'
            message={namespaceValidationMessage ?? { variant: 'info', message: `Folder structure of variable (e.g. 'Connector.Key')` }}
            aria-label='Namespace'
          >
            <Combobox
              value={namespace}
              onChange={setNamespace}
              onInput={event => {
                setNamespace(event.currentTarget.value);
              }}
              options={namespaceOptions()}
            />
          </BasicField>
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
