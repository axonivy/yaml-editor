import {
  Button,
  Field,
  Flex,
  IvyIcon,
  Label,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  ReadonlyProvider,
  Switch,
  Toolbar,
  ToolbarTitle,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useAppContext } from '../../../context/AppContext';
import { useHotkeys } from 'react-hotkeys-hook';
import { HOTKEYS } from '../../../utils/hotkeys';
import { useRef } from 'react';

type VariablesMasterToolbarProps = {
  title: string;
};

export const VariablesMasterToolbar = ({ title }: VariablesMasterToolbarProps) => {
  const { detail, setDetail } = useAppContext();
  const { theme, setTheme, disabled } = useTheme();

  const firstElement = useRef<HTMLDivElement>(null);
  useHotkeys(HOTKEYS.FOCUS_TOOLBAR, () => firstElement.current?.focus(), { scopes: ['global'] });
  useHotkeys(
    HOTKEYS.FOCUS_INSCRIPTION,
    () => {
      setDetail(true);
      document.querySelector<HTMLElement>('.detail-header')?.focus();
    },
    {
      scopes: ['global']
    }
  );

  return (
    <Toolbar tabIndex={-1} ref={firstElement} className='master-toolbar'>
      <ToolbarTitle>{title}</ToolbarTitle>
      <Flex gap={1}>
        {!disabled && (
          <Popover>
            <PopoverTrigger asChild>
              <Button icon={IvyIcons.Settings} size='large' title='Settings' aria-label='Settings' />
            </PopoverTrigger>
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
        <Button
          icon={IvyIcons.LayoutSidebarRightCollapse}
          size='large'
          onClick={() => setDetail(!detail)}
          title='Details toggle'
          aria-label='Details toggle'
        />
      </Flex>
    </Toolbar>
  );
};
