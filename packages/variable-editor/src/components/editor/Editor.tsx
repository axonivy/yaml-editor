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
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  SidebarHeader,
  Switch,
  Toolbar,
  ToolbarTitle,
  useTheme
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState, type ReactElement } from 'react';
import './Editor.css';

type EditorProps = {
  masterTitle: string;
  masterContent: ReactElement;
  detailTitle: string;
  detailContent: ReactElement;
};

export const Editor = ({ masterTitle, masterContent, detailTitle, detailContent }: EditorProps) => {
  const [sidebar, setSidebar] = useState(true);
  const { theme, setTheme } = useTheme();

  return (
    <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
      <ResizablePanel defaultSize={75} minSize={50} className='master-panel' data-testid='master-panel'>
        <Flex className='master-wrapper' direction='column'>
          <Toolbar className='master-toolbar'>
            <ToolbarTitle>{masterTitle}</ToolbarTitle>
            <Flex gap={1}>
              {theme !== 'system' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button icon={IvyIcons.Settings} size='large' aria-label='Settings' />
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
                onClick={() => setSidebar(!sidebar)}
                aria-label='Details toggle'
              />
            </Flex>
          </Toolbar>
          <Flex direction='column' gap={4} className='content master-content'>
            {masterContent}
          </Flex>
        </Flex>
      </ResizablePanel>
      {sidebar && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} minSize={10}>
            <Flex direction='column' className='details-container' data-testid='details-container'>
              <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} data-testid='Detail title' />
              <Flex direction='column' gap={4} className='content details-content'>
                {detailContent}
              </Flex>
            </Flex>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
