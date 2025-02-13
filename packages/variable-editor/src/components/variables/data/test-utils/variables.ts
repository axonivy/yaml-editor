import type { RootVariable } from '../variable';

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

export const contentStringsOnly = `Variables:
  string: value
  number: "42"
  boolean: "true"
  mapping:
    mappingString: mappingValue
    mappingNumber: "43"
    mappingBoolean: "false"
    mappingMapping:
      deepKeyOne: deepValueOne
      deepKeyTwo: deepValueTwo
`;

export const rootVariable: RootVariable = {
  name: 'Variables',
  value: '',
  description: '',
  commentAfter: '',
  metadata: { type: '' },
  validations: [],
  children: [
    {
      name: 'string',
      value: 'value',
      description: '',
      metadata: { type: '' },
      validations: [],
      children: []
    },
    {
      name: 'number',
      value: '42',
      description: '',
      metadata: { type: '' },
      validations: [],
      children: []
    },
    {
      name: 'boolean',
      value: 'true',
      description: '',
      metadata: { type: '' },
      validations: [],
      children: []
    },
    {
      name: 'mapping',
      value: '',
      description: '',
      metadata: { type: '' },
      validations: [],
      children: [
        {
          name: 'mappingString',
          value: 'mappingValue',
          description: '',
          metadata: { type: '' },
          validations: [],
          children: []
        },
        {
          name: 'mappingNumber',
          value: '43',
          description: '',
          metadata: { type: '' },
          validations: [],
          children: []
        },
        {
          name: 'mappingBoolean',
          value: 'false',
          description: '',
          metadata: { type: '' },
          validations: [],
          children: []
        },
        {
          name: 'mappingMapping',
          value: '',
          description: '',
          metadata: { type: '' },
          validations: [],
          children: [
            {
              name: 'deepKeyOne',
              value: 'deepValueOne',
              description: '',
              metadata: { type: '' },
              validations: [],
              children: []
            },
            {
              name: 'deepKeyTwo',
              value: 'deepValueTwo',
              description: '',
              metadata: { type: '' },
              validations: [],
              children: []
            }
          ]
        }
      ]
    }
  ]
};
