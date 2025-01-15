import { hotkeyText } from '@axonivy/ui-components';
import { useMemo } from 'react';

export const HOTKEYS = {
  UNDO: 'mod+Z',
  REDO: 'mod+shift+Z',

  OPEN_HELP: 'F1',

  ADD_VAR: 'A',
  IMPORT_VAR: 'I',
  DELETE_VAR: 'Delete',

  FOCUS_TOOLBAR: '1',
  FOCUS_MAIN: '2',
  FOCUS_INSCRIPTION: '3'
} as const;

export const useHotkeyTexts = () => {
  const undo = useMemo(() => `Undo (${hotkeyText(HOTKEYS.UNDO)})`, []);
  const redo = useMemo(() => `Redo (${hotkeyText(HOTKEYS.REDO)})`, []);
  const openHelp = useMemo(() => `Open Help (${hotkeyText(HOTKEYS.OPEN_HELP)})`, []);
  const addVar = useMemo(() => `Add Variable (${hotkeyText(HOTKEYS.ADD_VAR)})`, []);
  const importVar = useMemo(() => `Import Variable (${hotkeyText(HOTKEYS.IMPORT_VAR)})`, []);
  const deleteVar = useMemo(() => `Delete Variable (${hotkeyText(HOTKEYS.DELETE_VAR)})`, []);
  return { undo, redo, openHelp, addVar, importVar, deleteVar };
};
