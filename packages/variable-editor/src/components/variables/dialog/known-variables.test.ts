import { EMPTY_KNOWN_VARIABLES, type KnownVariables } from '@axonivy/variable-editor-protocol';
import { toNodes } from './known-variables';

const knownVariables: KnownVariables = {
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
    }
  ]
};

test('toNodes', () => {
  expect(toNodes(EMPTY_KNOWN_VARIABLES)).toEqual([]);

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
