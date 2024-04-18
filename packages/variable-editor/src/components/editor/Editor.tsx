import {
  Button,
  Flex,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  SidebarHeader,
  Toolbar,
  ToolbarTitle
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

  return (
    <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
      <ResizablePanel defaultSize={75} minSize={50} className='master-panel'>
        <Flex className='master-wrapper' direction='column'>
          <Toolbar className='master-toolbar'>
            <ToolbarTitle>{masterTitle}</ToolbarTitle>
            <Button icon={IvyIcons.LayoutSidebarRightCollapse} size='large' onClick={() => setSidebar(!sidebar)} />
          </Toolbar>
          <Flex direction='column' gap={4} className='content'>
            {masterContent}
          </Flex>
        </Flex>
      </ResizablePanel>
      {sidebar && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} minSize={10}>
            <Flex direction='column'>
              <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} />
              <Flex direction='column' gap={4} className='content'>
                {detailContent}
              </Flex>
            </Flex>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
