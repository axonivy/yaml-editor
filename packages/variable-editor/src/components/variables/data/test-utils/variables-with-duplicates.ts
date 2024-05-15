import type { RootVariable } from '../variable';

export const contentParsedFromRootVariableWithDuplicates = `Variables:
  duplicateKey: duplicateValueOne
  duplicateMapping:
    deepDuplicateKeyOne: deepDuplicateValueOneOne
`;

export const rootVariableWithDuplicates: RootVariable = {
  name: 'Variables',
  value: '',
  description: '',
  commentAfter: '',
  metadata: { type: '' },
  children: [
    {
      name: 'duplicateKey',
      value: 'duplicateValueOne',
      description: '',
      metadata: { type: '' },
      children: []
    },
    {
      name: 'duplicateKey',
      value: 'duplicateValueTwo',
      description: '',
      metadata: { type: '' },
      children: []
    },
    {
      name: 'duplicateMapping',
      value: '',
      description: '',
      metadata: { type: '' },
      children: [
        {
          name: 'deepDuplicateKeyOne',
          value: 'deepDuplicateValueOneOne',
          description: '',
          metadata: { type: '' },
          children: []
        },
        {
          name: 'deepDuplicateKeyOne',
          value: 'deepDuplicateValueOneTwo',
          description: '',
          metadata: { type: '' },
          children: []
        }
      ]
    },
    {
      name: 'duplicateMapping',
      value: '',
      description: '',
      metadata: { type: '' },
      children: [
        {
          name: 'deepDuplicateKeyTwo',
          value: 'deepDuplicateValueTwoOne',
          description: '',
          metadata: { type: '' },
          children: []
        },
        {
          name: 'deepDuplicateKeyTwo',
          value: 'deepDuplicateValueTwoTwo',
          description: '',
          metadata: { type: '' },
          children: []
        }
      ]
    }
  ]
};
