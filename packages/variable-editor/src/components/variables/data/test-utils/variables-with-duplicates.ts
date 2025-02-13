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
  validations: [],
  children: [
    {
      name: 'duplicateKey',
      value: 'duplicateValueOne',
      description: '',
      metadata: { type: '' },
      validations: [],
      children: []
    },
    {
      name: 'duplicateKey',
      value: 'duplicateValueTwo',
      description: '',
      metadata: { type: '' },
      validations: [],
      children: []
    },
    {
      name: 'duplicateMapping',
      value: '',
      description: '',
      metadata: { type: '' },
      validations: [],
      children: [
        {
          name: 'deepDuplicateKeyOne',
          value: 'deepDuplicateValueOneOne',
          description: '',
          metadata: { type: '' },
          validations: [],
          children: []
        },
        {
          name: 'deepDuplicateKeyOne',
          value: 'deepDuplicateValueOneTwo',
          description: '',
          metadata: { type: '' },
          validations: [],
          children: []
        }
      ]
    },
    {
      name: 'duplicateMapping',
      value: '',
      description: '',
      metadata: { type: '' },
      validations: [],
      children: [
        {
          name: 'deepDuplicateKeyTwo',
          value: 'deepDuplicateValueTwoOne',
          description: '',
          metadata: { type: '' },
          validations: [],
          children: []
        },
        {
          name: 'deepDuplicateKeyTwo',
          value: 'deepDuplicateValueTwoTwo',
          description: '',
          metadata: { type: '' },
          validations: [],
          children: []
        }
      ]
    }
  ]
};
