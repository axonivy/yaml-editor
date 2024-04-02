import { Flex, ResizableHandle, ResizablePanel, ResizablePanelGroup, SidebarHeader, Toolbar, ToolbarTitle } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import './Editor.css';
import type { Variable } from './data/Variable';
import { VariableDetail } from './variables/detail/Variable';
import { Variables } from './variables/master/Variables';

export const Editor = () => {
  // TODO: Variables coming from context and choosing corresponding master and detail content components
  const title = 'Variables Editor';
  const variables = [
    {
      name: 'microsoft-connector',
      value: '',
      description: '',
      metadata: 'none',
      children: [
        { name: 'appId', value: 'MyAppId', description: 'Your Azure Application (client) ID', metadata: 'none', children: [] },
        {
          name: 'secretKey',
          value: 'MySecretKey',
          description: 'Secret key from your applications "certificates & secrets"',
          metadata: 'password',
          children: []
        },
        {
          name: 'useAppPermissions',
          value: 'false',
          description:
            "work with app permissions rather than in delegate of a user\nset to 'true' if no user consent should be accuired and adjust the 'tenantId' below.",
          metadata: 'none',
          children: []
        },
        {
          name: 'tenantId',
          value: 'common',
          description:
            "tenant to use for OAUTH2 request.\nthe default 'common' fits for user delegate requests.\nset the Azure Directory (tenant) ID, for application requests.",
          metadata: 'none',
          children: []
        },
        {
          name: 'useUserPassFlow',
          value: '',
          description:
            'use a static user+password authentication to work in the name of technical user.\nmost insecure but valid, if you must work with user permissions, while no real user is able to consent the action.',
          metadata: 'none',
          children: [
            { name: 'enabled', value: 'false', description: '', metadata: 'none', children: [] },
            { name: 'user', value: 'MyUser', description: 'technical user to login', metadata: 'none', children: [] },
            { name: 'pass', value: 'MyPass', description: 'technical users password', metadata: 'password', children: [] }
          ]
        },
        {
          name: 'permissions',
          value: 'user.read Calendars.ReadWrite mail.readWrite mail.send Tasks.ReadWrite Chat.Read offline_access',
          description:
            'permissions to request access to.\nyou may exclude or add some, as your azure administrator allows or restricts them.\nfor sharepoint-demos, the following must be added: Sites.Read.All Files.ReadWrite',
          metadata: 'none',
          children: []
        },
        {
          name: 'connectorProvider',
          value: 'org.glassfish.jersey.client.HttpUrlConnectorProvider',
          description:
            'this property specifies the library used to create and manage HTTP connections for Jersey client.\nit sets the connection provider class for the Jersey client.\nwhile the default provider works well for most methods, if you specifically need to use the PATCH method, consider switching the provider to:\n  org.glassfish.jersey.apache.connector.ApacheConnectorProvider',
          metadata: 'none',
          children: []
        }
      ]
    }
  ];

  const [selectedVariable, setSelectedVariable] = useState<Variable>();

  return (
    <ResizablePanelGroup direction='horizontal' style={{ height: `100vh` }}>
      <ResizablePanel defaultSize={75} minSize={50} className='master-panel'>
        <Flex direction='column'>
          <Toolbar className='master-toolbar'>
            <ToolbarTitle>{title}</ToolbarTitle>
          </Toolbar>
          <Flex direction='column' gap={4} className='content'>
            <Variables variables={variables} onSelection={setSelectedVariable} />
          </Flex>
        </Flex>
      </ResizablePanel>
      {selectedVariable && (
        <>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} minSize={10}>
            <Flex direction='column'>
              <SidebarHeader icon={IvyIcons.PenEdit} title={title + ' - ' + selectedVariable.name} />
              <Flex direction='column' gap={4} className='content'>
                <VariableDetail variable={selectedVariable} />
              </Flex>
            </Flex>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};
