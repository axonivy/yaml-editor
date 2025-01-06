import type { KnownVariables } from '@axonivy/variable-editor-protocol';

export const knownVariables: KnownVariables = {
  namespace: '',
  name: '',
  value: '',
  metaData: { type: 'folder' },
  description: '',
  children: [
    {
      namespace: '',
      name: 'Amazon',
      value: '',
      metaData: { type: 'folder' },
      description: '',
      children: [
        {
          namespace: 'Amazon',
          name: 'Comprehend',
          value: '',
          metaData: { type: 'folder' },
          description: 'Amazon comprehend connector settings',
          children: [
            {
              namespace: 'Amazon.Comprehend',
              name: 'SecretKey',
              value: '<YOUR_SECRET_KEY>',
              metaData: { type: 'password' },
              description: 'Secret key to access amazon comprehend',
              children: []
            },
            {
              namespace: 'Amazon.Comprehend',
              name: 'AccessKey',
              value: '<YOUR_ACCESS_KEY>',
              metaData: { type: 'string' },
              description: 'Access key to access amazon comprehend',
              children: []
            }
          ]
        }
      ]
    },
    {
      namespace: '',
      name: 'Meta',
      value: '',
      metaData: { type: 'folder' },
      description: '',
      children: [
        {
          namespace: 'Meta',
          name: 'Enum',
          value: 'two',
          metaData: { type: 'enum', values: ['one', 'two', 'three'] },
          description: '',
          children: []
        },
        {
          namespace: 'Meta',
          name: 'File',
          value: '',
          metaData: { type: 'file', extension: 'json' },
          description: '',
          children: []
        }
      ]
    }
  ]
};
