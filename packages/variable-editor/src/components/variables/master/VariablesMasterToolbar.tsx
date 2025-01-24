import {
  Button,
  Field,
  Flex,
  hotkeyRedoFix,
  hotkeyUndoFix,
  IvyIcon,
  Label,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  ReadonlyProvider,
  Separator,
  Switch,
  Toolbar,
  ToolbarContainer,
  ToolbarTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useHotkeys,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useRef } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useKnownHotkeys } from '../../../utils/hotkeys';

type VariablesMasterToolbarProps = {
  title: string;
};

export const VariablesMasterToolbar = ({ title }: VariablesMasterToolbarProps) => {
  const { detail, setDetail, history, setUnhistorisedVariables } = useAppContext();
  const { theme, setTheme, disabled } = useTheme();

  const firstElement = useRef<HTMLDivElement>(null);
  const hotkeys = useKnownHotkeys();
  useHotkeys(hotkeys.focusToolbar.hotkey, () => firstElement.current?.focus(), { scopes: ['global'] });
  useHotkeys(
    hotkeys.focusInscription.hotkey,
    () => {
      setDetail(true);
      document.querySelector<HTMLElement>('.detail-header')?.focus();
    },
    {
      scopes: ['global']
    }
  );
  const undo = () => history.undo(setUnhistorisedVariables);
  const redo = () => history.redo(setUnhistorisedVariables);
  useHotkeys(hotkeys.undo.hotkey, e => hotkeyUndoFix(e, undo), { scopes: ['global'] });
  useHotkeys(hotkeys.redo.hotkey, e => hotkeyRedoFix(e, redo), { scopes: ['global'] });

  return (
    <Toolbar tabIndex={-1} ref={firstElement} className='master-toolbar'>
      <ToolbarTitle>{title}</ToolbarTitle>
      <Flex gap={1}>
        <ToolbarContainer maxWidth={450}>
          <Flex>
            <Flex gap={1}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button aria-label={hotkeys.undo.label} icon={IvyIcons.Undo} size='large' onClick={undo} disabled={!history.canUndo} />
                </TooltipTrigger>
                <TooltipContent>{hotkeys.undo.label}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button aria-label={hotkeys.redo.label} icon={IvyIcons.Redo} size='large' onClick={redo} disabled={!history.canRedo} />
                </TooltipTrigger>
                <TooltipContent>{hotkeys.redo.label}</TooltipContent>
              </Tooltip>
            </Flex>
            <Separator orientation='vertical' style={{ height: '26px', marginInline: 'var(--size-2)' }} />
          </Flex>
        </ToolbarContainer>
        {!disabled && (
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button icon={IvyIcons.Settings} size='large' aria-label='Settings' />
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
            <PopoverContent sideOffset={12}>
              <ReadonlyProvider readonly={false}>
                <Flex direction='column' gap={2}>
                  <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
                    <Label>
                      <Flex alignItems='center' gap={1}>
                        <IvyIcon icon={IvyIcons.DarkMode} />
                        Theme
                      </Flex>
                    </Label>
                    <Switch
                      defaultChecked={theme === 'dark'}
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      size='small'
                      aria-label='Theme'
                    />
                  </Field>
                </Flex>
                <PopoverArrow />
              </ReadonlyProvider>
            </PopoverContent>
          </Popover>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              icon={IvyIcons.LayoutSidebarRightCollapse}
              size='large'
              onClick={() => setDetail(!detail)}
              aria-label='Details toggle'
            />
          </TooltipTrigger>
          <TooltipContent>Details toggle</TooltipContent>
        </Tooltip>
      </Flex>
    </Toolbar>
  );
};
