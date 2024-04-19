import type { Variable } from '../variable';

export const content = `Variables:
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
export const variables: Array<Variable> = [
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
];
