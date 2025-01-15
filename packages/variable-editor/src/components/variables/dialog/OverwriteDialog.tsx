import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  selectRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { KnownVariables } from '@axonivy/variable-editor-protocol';
import { type Table } from '@tanstack/react-table';
import { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { toRowId } from '../../../utils/tree/tree';
import { type Variable } from '../data/variable';
import { VariableBrowser } from './VariableBrowser';
import { addKnownVariable } from './known-variables';
import { useHotkeys } from 'react-hotkeys-hook';
import { HOTKEYS, useHotkeyTexts } from '../../../utils/hotkeys';

type OverwriteProps = {
  table: Table<Variable>;
};

export const OverwriteDialog = ({ table }: OverwriteProps) => {
  const { setVariables, setSelectedVariable } = useAppContext();
  const [dialogState, setDialogState] = useState(false);
  const { importVar: shortcut } = useHotkeyTexts();
  useHotkeys(HOTKEYS.IMPORT_VAR, () => setDialogState(true), { scopes: ['global'], keyup: true, enabled: !dialogState });

  const insertVariable = (node?: KnownVariables): void => {
    if (!node) {
      return;
    }
    setVariables(old => {
      const addNodeReturnValue = addKnownVariable(old, node);
      selectRow(table, toRowId(addNodeReturnValue.newNodePath));
      setSelectedVariable(addNodeReturnValue.newNodePath);
      return addNodeReturnValue.newData;
    });
  };

  return (
    <Dialog open={dialogState} onOpenChange={setDialogState}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button icon={IvyIcons.FileImport} aria-label={shortcut} />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <span>{shortcut}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogTrigger asChild></DialogTrigger>
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
