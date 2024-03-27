import { Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Toolbar, ToolbarTitle } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import './Editor.css';
import { Variables } from './variables/master/Variables';

export const Editor = () => {
  // TODO: Variables coming from context
  const masterTitle = 'Rest Clients Editor';
  const detailTitle = 'Variables Editor - variableA';
  const variables = [
    {
      key: 'param.procurementRequest',
      value: '',
      children: [
        { key: 'accepted', children: [], value: 'true' },
        { key: 'amount', children: [], value: '1234' },
        { key: 'requester', value: '', children: [{ key: 'user', value: 'Admin', children: [] }] }
      ]
    }
  ];
  const detailContent = (
    <Flex justifyContent='center' alignItems='center' style={{ height: '100%' }}>
      <span>Properties</span>
    </Flex>
  );

  return (
    <ResizablePanelGroup direction='horizontal' className='editor'>
      <ResizablePanel defaultSize={75} minSize={50} className='master-panel'>
        <Flex direction='column'>
          <Toolbar className='master-toolbar'>
            <ToolbarTitle>{masterTitle}</ToolbarTitle>
          </Toolbar>
          <Flex className='master-content'>
            <Variables variables={variables} />
          </Flex>
        </Flex>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25} minSize={10}>
        <Flex direction='column'>
          <SidebarHeader icon={IvyIcons.PenEdit} title={detailTitle} />
          {detailContent}
        </Flex>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
