import { EMPTY_PROJECT_VAR_NODE, type ProjectVarNode } from '@axonivy/variable-editor-protocol';
import { toNodes } from './known-variables';

const knownVariables: ProjectVarNode = {
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

test('toNodes', () => {
  expect(toNodes(EMPTY_PROJECT_VAR_NODE)).toEqual([]);

  const nodes = toNodes(knownVariables);
  expect(nodes).toHaveLength(1);
  const root = nodes[0];
  expect(root).toMatchObject({ value: 'Amazon', icon: 'folder-open', info: '' });
  expect(root.children).toHaveLength(1);
  const node = root.children[0];
  expect(node).toMatchObject({ value: 'Comprehend', icon: 'folder-open', info: 'Amazon comprehend connector settings' });
  expect(node.children).toHaveLength(2);
  expect(node.children[0]).toMatchObject({ value: 'SecretKey', icon: 'password', info: 'Secret key to access amazon comprehend' });
  expect(node.children[1]).toMatchObject({ value: 'AccessKey', icon: 'quote', info: 'Access key to access amazon comprehend' });
});
