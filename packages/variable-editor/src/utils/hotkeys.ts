import { hotkeyText, isWindows } from '@axonivy/ui-components';
import { useMemo } from 'react';

type KnownHotkey = { hotkey: string; label: string };

export const useKnownHotkeys = () => {
  const undo = useMemo<KnownHotkey>(() => {
    const hotkey = 'mod+Z';
    return { hotkey, label: `Undo (${hotkeyText(hotkey)})` };
  }, []);
  const redo = useMemo<KnownHotkey>(() => {
    const hotkey = isWindows() ? 'mod+Y' : 'mod+shift+Z';
    return { hotkey, label: `Redo (${hotkeyText(hotkey)})` };
  }, []);

  const openHelp = useMemo<KnownHotkey>(() => {
    const hotkey = 'F1';
    return { hotkey, label: `Open Help (${hotkeyText(hotkey)})` };
  }, []);

  const addVar = useMemo<KnownHotkey>(() => {
    const hotkey = 'A';
    return { hotkey, label: `Add Variable (${hotkeyText(hotkey)})` };
  }, []);

  const importVar = useMemo<KnownHotkey>(() => {
    const hotkey = 'I';
    return { hotkey, label: `Import Variable (${hotkeyText(hotkey)})` };
  }, []);

  const deleteVar = useMemo<KnownHotkey>(() => {
    const hotkey = 'Delete';
    return { hotkey, label: `Delete Variable (${hotkeyText(hotkey)})` };
  }, []);

  const focusToolbar = useMemo<KnownHotkey>(() => {
    const hotkey = '1';
    return { hotkey, label: `Focus Toolbar (${hotkeyText(hotkey)})` };
  }, []);

  const focusMain = useMemo<KnownHotkey>(() => {
    const hotkey = '2';
    return { hotkey, label: `Focus Main (${hotkeyText(hotkey)})` };
  }, []);

  const focusInscription = useMemo<KnownHotkey>(() => {
    const hotkey = '3';
    return { hotkey, label: `Focus Inscription (${hotkeyText(hotkey)})` };
  }, []);

  return { undo, redo, openHelp, addVar, importVar, deleteVar, focusToolbar, focusMain, focusInscription };
};
