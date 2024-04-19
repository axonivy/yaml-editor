import type { Variable } from '../variable';

export const variablesDuplicates: Array<Variable> = [
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
];
