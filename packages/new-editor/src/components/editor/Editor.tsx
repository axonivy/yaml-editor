import { Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Toolbar, ToolbarTitle } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import './Editor.css';

export const Editor = () => {
  // TODO: Variables coming from context
  const masterTitle = 'Rest Clients Editor';
  const masterContent = (
    <Flex justifyContent='center' alignItems='center' style={{ height: '100%' }}>
      <span>Content</span>
    </Flex>
  );
  const detailTitle = 'Variables Editor - variableA';
  const detailContent = (
    <Flex justifyContent='center' alignItems='center' style={{ height: '100%' }}>
      <span>Properties</span>
    </Flex>
  );

  return (
    <ResizablePanelGroup direction='horizontal' style={{ minHeight: 200 }}>
      <ResizablePanel defaultSize={75} minSize={50} className='master-panel'>
        <Flex direction='column' style={{ height: '100%' }}>
          <Toolbar className='master-toolbar'>
            <ToolbarTitle>{masterTitle}</ToolbarTitle>
          </Toolbar>
          {masterContent}
        </Flex>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={10}>
        <Flex direction='column' style={{ height: '100%' }}>
          <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} />
          {detailContent}
        </Flex>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
