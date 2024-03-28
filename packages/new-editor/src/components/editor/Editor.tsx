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
      key: 'microsoft-connector',
      value: '',
      children: [
        { key: 'appId', value: 'MyAppId', children: [] },
        { key: 'secretKey', value: 'MySecretKey', children: [] },
        { key: 'useAppPermissions', value: 'false', children: [] },
        { key: 'tenantId', value: 'common', children: [] },
        {
          key: 'useUserPassFlow',
          value: '',
          children: [
            { key: 'enabled', value: 'false', children: [] },
            { key: 'user', value: 'MyUser', children: [] },
            { key: 'pass', value: 'MyPass', children: [] }
          ]
        },
        {
          key: 'permissions',
          value: 'user.read Calendars.ReadWrite mail.readWrite mail.send Tasks.ReadWrite Chat.Read offline_access',
          children: []
        },
        { key: 'connectorProvider', value: 'org.glassfish.jersey.client.HttpUrlConnectorProvider', children: [] }
      ]
    }
  ];
  const detailContent = (
    <Flex justifyContent='center' alignItems='center' style={{ height: '100%' }}>
      <span>Properties</span>
    </Flex>
  );

  return (
    <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
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
