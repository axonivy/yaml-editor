import { toVariables } from './variable-utils';

describe('toVariables', () => {
  test('default', () => {
    const content = `Variables:
  string: value
  number: 42
  boolean: true
  mapping:
    mappingString: mappingValue
    mappingNumber: 43
    mappingBoolean: false
    mappingMapping:
      deepKeyOne: deepValueOne
      deepKeyTwo: deepValueTwo
`;
    expect(toVariables(content)).toEqual([
      {
        name: 'string',
        value: 'value',
        description: '',
        metadata: { type: '' },
        children: []
      },
      {
        name: 'number',
        value: '42',
        description: '',
        metadata: { type: '' },
        children: []
      },
      {
        name: 'boolean',
        value: 'true',
        description: '',
        metadata: { type: '' },
        children: []
      },
      {
        name: 'mapping',
        value: '',
        description: '',
        metadata: { type: '' },
        children: [
          {
            name: 'mappingString',
            value: 'mappingValue',
            description: '',
            metadata: { type: '' },
            children: []
          },
          {
            name: 'mappingNumber',
            value: '43',
            description: '',
            metadata: { type: '' },
            children: []
          },
          {
            name: 'mappingBoolean',
            value: 'false',
            description: '',
            metadata: { type: '' },
            children: []
          },
          {
            name: 'mappingMapping',
            value: '',
            description: '',
            metadata: { type: '' },
            children: [
              {
                name: 'deepKeyOne',
                value: 'deepValueOne',
                description: '',
                metadata: { type: '' },
                children: []
              },
              {
                name: 'deepKeyTwo',
                value: 'deepValueTwo',
                description: '',
                metadata: { type: '' },
                children: []
              }
            ]
          }
        ]
      }
    ]);
  });

  test('description', () => {
    const content = `Variables:
  # single-line description
  keyOne: valueOne
  # multi-line
  # description
  keyTwo: valueTwo
  # mapping description
  mapping:
    # first mapping value description
    mappingKeyOne: mappingValueOne
    # second mapping value description
    mappingKeyTwo: mappingValueTwo
    # multi-line
    # mapping description
    deepMapping:
      # first mapping value
      # multi-line description
      deepKeyOne: deepValueOne
      # second mapping value
      # multi-line
      # description
      deepKeyTwo: deepValueTwo
`;
    expect(toVariables(content)).toEqual([
      {
        name: 'keyOne',
        value: 'valueOne',
        description: 'single-line description',
        metadata: { type: '' },
        children: []
      },
      {
        name: 'keyTwo',
        value: 'valueTwo',
        description: 'multi-line\ndescription',
        metadata: { type: '' },
        children: []
      },
      {
        name: 'mapping',
        value: '',
        description: 'mapping description',
        metadata: { type: '' },
        children: [
          {
            name: 'mappingKeyOne',
            value: 'mappingValueOne',
            description: 'first mapping value description',
            metadata: { type: '' },
            children: []
          },
          {
            name: 'mappingKeyTwo',
            value: 'mappingValueTwo',
            description: 'second mapping value description',
            metadata: { type: '' },
            children: []
          },
          {
            name: 'deepMapping',
            value: '',
            description: 'multi-line\nmapping description',
            metadata: { type: '' },
            children: [
              {
                name: 'deepKeyOne',
                value: 'deepValueOne',
                description: 'first mapping value\nmulti-line description',
                metadata: { type: '' },
                children: []
              },
              {
                name: 'deepKeyTwo',
                value: 'deepValueTwo',
                description: 'second mapping value\nmulti-line\ndescription',
                metadata: { type: '' },
                children: []
              }
            ]
          }
        ]
      }
    ]);
  });

  test('metadata', () => {
    const content = `Variables:
  # [password]
  passwordKeyOne: passwordValueOne
  #   [password]   
  passwordKeyTwo: passwordValueTwo
  # [ password ]
  passwordKeyThree: passwordValueThree
  # [daytime]
  daytimeKey: 08:00
  # [enum: valueOne0, valueOne1, valueOne2]
  enumKeyOne: valueOne1
  # [enum:valueTwo0,valueTwo1,valueTwo2]
  enumKeyTwo: valueTwo1
  #    [enum:   valueThree0,   valueThree1,   valueThree2]   
  enumKeyThree: valueThree1
  # [file: json]
  fileKey: fileValue
`;
    expect(toVariables(content)).toEqual([
      {
        name: 'passwordKeyOne',
        value: 'passwordValueOne',
        description: '',
        metadata: { type: 'password' },
        children: []
      },
      {
        name: 'passwordKeyTwo',
        value: 'passwordValueTwo',
        description: '',
        metadata: { type: 'password' },
        children: []
      },
      {
        name: 'passwordKeyThree',
        value: 'passwordValueThree',
        description: '',
        metadata: { type: '' },
        children: []
      },
      {
        name: 'daytimeKey',
        value: '08:00',
        description: '',
        metadata: { type: 'daytime' },
        children: []
      },
      {
        name: 'enumKeyOne',
        value: 'valueOne1',
        description: '',
        metadata: { type: 'enum', values: ['valueOne0', 'valueOne1', 'valueOne2'] },
        children: []
      },
      {
        name: 'enumKeyTwo',
        value: 'valueTwo1',
        description: '',
        metadata: { type: 'enum', values: ['valueTwo0', 'valueTwo1', 'valueTwo2'] },
        children: []
      },
      {
        name: 'enumKeyThree',
        value: 'valueThree1',
        description: '',
        metadata: { type: 'enum', values: ['valueThree0', 'valueThree1', 'valueThree2'] },
        children: []
      },
      {
        name: 'fileKey',
        value: 'fileValue',
        description: '',
        metadata: { type: 'file', filenameExtension: 'json' },
        children: []
      }
    ]);
  });

  test('mixed', () => {
    const content = `Variables:
  
  microsoft-connector:
    
    # Your Azure Application (client) ID
    appId: "MyAppId"
    
    # Secret key from your applications "certificates & secrets"
    # [password]
    secretKey: "MySecretKey"
    
    # work with app permissions rather than in delegate of a user
    # set to 'true' if no user consent should be accuired and adjust the 'tenantId' below.
    useAppPermissions: false
    
    # tenant to use for OAUTH2 request.
    # the default 'common' fits for user delegate requests.
    # set the Azure Directory (tenant) ID, for application requests.
    tenantId: "common"
    
    # use a static user+password authentication to work in the name of technical user.
    # most insecure but valid, if you must work with user permissions, while no real user is able to consent the action.
    useUserPassFlow:
      enabled: false
      # technical user to login
      user: "MyUser"
      # technical users password
      # [password]
      pass: "MyPass"
    
    # permissions to request access to.
    # you may exclude or add some, as your azure administrator allows or restricts them.
    # for sharepoint-demos, the following must be added: Sites.Read.All Files.ReadWrite
    permissions: "user.read Calendars.ReadWrite mail.readWrite mail.send Tasks.ReadWrite Chat.Read offline_access"
    
    # this property specifies the library used to create and manage HTTP connections for Jersey client. 
    # it sets the connection provider class for the Jersey client.
    # while the default provider works well for most methods, if you specifically need to use the PATCH method, consider switching the provider to:
    #   org.glassfish.jersey.apache.connector.ApacheConnectorProvider
    connectorProvider: "org.glassfish.jersey.client.HttpUrlConnectorProvider"
`;
    expect(toVariables(content)).toEqual([
      {
        name: 'microsoft-connector',
        value: '',
        description: '',
        metadata: { type: '' },
        children: [
          {
            name: 'appId',
            value: 'MyAppId',
            description: 'Your Azure Application (client) ID',
            metadata: { type: '' },
            children: []
          },
          {
            name: 'secretKey',
            value: 'MySecretKey',
            description: 'Secret key from your applications "certificates & secrets"',
            metadata: { type: 'password' },
            children: []
          },
          {
            name: 'useAppPermissions',
            value: 'false',
            description:
              "work with app permissions rather than in delegate of a user\nset to 'true' if no user consent should be accuired and adjust the 'tenantId' below.",
            metadata: { type: '' },
            children: []
          },
          {
            name: 'tenantId',
            value: 'common',
            description:
              "tenant to use for OAUTH2 request.\nthe default 'common' fits for user delegate requests.\nset the Azure Directory (tenant) ID, for application requests.",
            metadata: { type: '' },
            children: []
          },
          {
            name: 'useUserPassFlow',
            value: '',
            description:
              'use a static user+password authentication to work in the name of technical user.\nmost insecure but valid, if you must work with user permissions, while no real user is able to consent the action.',
            metadata: { type: '' },
            children: [
              {
                name: 'enabled',
                value: 'false',
                description: '',
                metadata: { type: '' },
                children: []
              },
              {
                name: 'user',
                value: 'MyUser',
                description: 'technical user to login',
                metadata: { type: '' },
                children: []
              },
              {
                name: 'pass',
                value: 'MyPass',
                description: 'technical users password',
                metadata: { type: 'password' },
                children: []
              }
            ]
          },
          {
            name: 'permissions',
            value: 'user.read Calendars.ReadWrite mail.readWrite mail.send Tasks.ReadWrite Chat.Read offline_access',
            description:
              'permissions to request access to.\nyou may exclude or add some, as your azure administrator allows or restricts them.\nfor sharepoint-demos, the following must be added: Sites.Read.All Files.ReadWrite',
            metadata: { type: '' },
            children: []
          },
          {
            name: 'connectorProvider',
            value: 'org.glassfish.jersey.client.HttpUrlConnectorProvider',
            description:
              'this property specifies the library used to create and manage HTTP connections for Jersey client. \nit sets the connection provider class for the Jersey client.\nwhile the default provider works well for most methods, if you specifically need to use the PATCH method, consider switching the provider to:\norg.glassfish.jersey.apache.connector.ApacheConnectorProvider',
            metadata: { type: '' },
            children: []
          }
        ]
      }
    ]);
  });
});
