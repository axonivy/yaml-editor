import type { RootVariable } from '../variable';

export const contentEmpty = '';

export const contentWithEmptyVariables = 'Variables:';

export const contentWithEmptyVariablesMapping = `Variables: {}
`;

export const rootVariableEmpty: RootVariable = {
  name: 'Variables',
  value: '',
  description: '',
  commentAfter: '',
  metadata: { type: '' },
  children: []
};

export const contentWithCommentOnly = '# some comment';

export const rootVariableParsedFromContentWithCommentOnly: RootVariable = {
  name: 'Variables',
  value: '',
  description: ' some comment',
  commentAfter: '',
  metadata: { type: '' },
  children: []
};

export const contentWithEmptyValue = `Variables:
  EmptyValue:
`;

export const rootVariableWithEmptyValue: RootVariable = {
  name: 'Variables',
  value: '',
  description: '',
  commentAfter: '',
  metadata: { type: '' },
  children: [
    {
      name: 'EmptyValue',
      value: '',
      description: '',
      metadata: { type: '' },
      children: []
    }
  ]
};
