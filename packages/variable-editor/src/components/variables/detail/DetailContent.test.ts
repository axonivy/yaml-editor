import type { Client, MetaRequestTypes, ProjectVarNode } from '@axonivy/variable-editor-protocol';
import { waitFor } from '@testing-library/react';
import { customRenderHook } from '../data/test-utils/test-utils';
import type { Variable } from '../data/variable';
import { useOverwrites } from './DetailContent';

describe('useOverwrites', () => {
  describe('false', () => {
    test('in known folder', () => {
      const view = customRenderHook(() => useOverwrites(), {
        wrapperProps: { client: new ClientMock(), appContext: { variables: variables, selectedVariable: [1, 0] } }
      });
      expect(view.result.current).toBeFalsy();
    });

    test('not in known folder', () => {
      const view = customRenderHook(() => useOverwrites(), {
        wrapperProps: { client: new ClientMock(), appContext: { variables: variables, selectedVariable: [0] } }
      });
      expect(view.result.current).toBeFalsy();
    });
  });

  describe('true', () => {
    test('leaf', async () => {
      const view = customRenderHook(() => useOverwrites(), {
        wrapperProps: { client: new ClientMock(), appContext: { variables: variables, selectedVariable: [1, 1, 0] } }
      });
      await waitFor(() => {
        expect(view.result.current).toBeTruthy();
      });
    });

    test('not leaf', async () => {
      const view = customRenderHook(() => useOverwrites(), {
        wrapperProps: { client: new ClientMock(), appContext: { variables: variables, selectedVariable: [1, 1] } }
      });
      await waitFor(() => {
        expect(view.result.current).toBeTruthy();
      });
    });
  });
});

const variables = [
  { name: 'Variable' },
  { name: 'Amazon', children: [{ name: 'AmazonVariable' }, { name: 'Comprehend', children: [{ name: 'SecretKey' }] }] }
] as Array<Variable>;

class ClientMock implements Partial<Client> {
  meta<TMeta extends keyof MetaRequestTypes>(): Promise<MetaRequestTypes[TMeta][1]> {
    return Promise.resolve({
      children: [{ name: 'Amazon', children: [{ name: 'Comprehend', children: [{ name: 'SecretKey' }, { name: 'AccessKey' }] }] }]
    } as ProjectVarNode);
  }
}
