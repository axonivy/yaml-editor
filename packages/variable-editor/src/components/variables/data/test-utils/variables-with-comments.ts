import type { RootVariable } from '../variable';

export const contentWithComments = `# start of file comment
Variables:
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
# end of file comment
`;

export const rootVariableWithComments: RootVariable = {
  name: 'Variables',
  value: '',
  description: ' start of file comment',
  commentAfter: ' end of file comment',
  metadata: { type: '' },
  children: [
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
  ]
};
