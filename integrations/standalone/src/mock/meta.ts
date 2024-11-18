import type { ProjectVarNode } from '@axonivy/variable-editor-protocol';

export const knownVariables: ProjectVarNode = {
  key: '',
  name: '',
  value: '',
  type: 'folder',
  description: '',
  children: [
    {
      key: 'Amazon',
      name: 'Amazon',
      value: '',
      type: 'folder',
      description: '',
      children: [
        {
          key: 'Amazon.Comprehend',
          name: 'Comprehend',
          value: '',
          type: 'folder',
          description: 'Amazon comprehend connector settings',
          children: [
            {
              key: 'Amazon.Comprehend.SecretKey',
              name: 'SecretKey',
              value: '<YOUR_SECRET_KEY>',
              type: 'password',
              description: 'Secret key to access amazon comprehend',
              children: []
            },
            {
              key: 'Amazon.Comprehend.AccessKey',
              name: 'AccessKey',
              value: '<YOUR_ACCESS_KEY>',
              type: 'string',
              description: 'Access key to access amazon comprehend',
              children: []
            }
          ]
        }
      ]
    }
  ]
};
