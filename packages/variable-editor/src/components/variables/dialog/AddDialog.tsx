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
  Message,
  selectRow
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { EMPTY_KNOWN_VARIABLES, type KnownVariables } from '@axonivy/variable-editor-protocol';
import { type Table } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { keyOfFirstSelectedNonLeafRow, keysOfAllNonLeafRows, newNodeName, subRowNamesOfRow, toRowId } from '../../../utils/tree/tree';
import { addNode } from '../../../utils/tree/tree-data';
import type { AddNodeReturnType } from '../../../utils/tree/types';
import { validateName, validateNamespace } from '../data/validation-utils';
import { createVariable, type Variable } from '../data/variable';
import './AddDialog.css';
import { addKnownVariable, findVariable } from './known-variables';

type AddVariableDialogProps = {
  table: Table<Variable>;
};

export const AddVariableDialog = ({ table }: AddVariableDialogProps) => {
  const { context, variables, setVariables, setSelectedVariable } = useAppContext();

  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('');

  const nameValidationMessage = useMemo(() => validateName(name, subRowNamesOfRow(namespace, table)), [name, namespace, table]);
  const namespaceValidationMessage = useMemo(() => validateNamespace(namespace, variables), [namespace, variables]);

  const [knownVariable, setKnownVariable] = useState<KnownVariables>();
  useEffect(() => setKnownVariable(undefined), [name, namespace]);

  const knownVariables = useMeta('meta/knownVariables', context, EMPTY_KNOWN_VARIABLES).data;

  const initializeVariableDialog = () => {
    setName(newNodeName(table, 'NewVariable'));
    setNamespace(keyOfFirstSelectedNonLeafRow(table));
  };

  const namespaceOptions = () => keysOfAllNonLeafRows(table).map(key => ({ value: key }));

  const updateSelection = (addNodeReturnValue: AddNodeReturnType<Variable>) => {
    selectRow(table, toRowId(addNodeReturnValue.newNodePath));
    setSelectedVariable(addNodeReturnValue.newNodePath);
  };

  const addKnown = (knownVariable: KnownVariables) => {
    setVariables(old => {
      const addNodeReturnValue = addKnownVariable(old, knownVariable);
      updateSelection(addNodeReturnValue);
      return addNodeReturnValue.newData;
    });
  };

  const addVar = () => {
    setVariables(old => {
      const addNodeReturnValue = addNode(name, namespace, old, createVariable);
      updateSelection(addNodeReturnValue);
      return addNodeReturnValue.newData;
    });
  };

  const addVariable = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (knownVariable) {
      addKnown(knownVariable);
      return;
    }
    const namespaceKey = namespace ? namespace.split('.') : [];
    const foundKnownVariable = findVariable(knownVariables, ...namespaceKey, name);
    if (foundKnownVariable) {
      setKnownVariable(foundKnownVariable.node);
      event.preventDefault();
      return;
    }
    addVar();
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
          {knownVariable && (
            <Message
              variant='warning'
              message='This Variable is already present in a required project. Do you want to import it?'
              aria-label='Import message'
            />
          )}
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
              {`${knownVariable ? 'Import' : 'Create'} Variable`}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
