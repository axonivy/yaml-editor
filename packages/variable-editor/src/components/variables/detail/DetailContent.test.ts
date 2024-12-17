import type { Client, MetaRequestTypes, KnownVariables } from '@axonivy/variable-editor-protocol';
import { waitFor } from '@testing-library/react';
import { customRenderHook } from '../data/test-utils/test-utils';
import type { Variable } from '../data/variable';
import { useOverwrites } from './DetailContent';

describe('useOverwrites', () => {
  test('variable that does not exist in required project returns false', () => {
    const view = customRenderHook(() => useOverwrites(), {
      wrapperProps: { client: new ClientMock(), appContext: { variables: variables, selectedVariable: [0] } }
    });
    expect(view.result.current).toBeFalsy();
  });

  test('variable located in existing folder of required project returns false', () => {
    const view = customRenderHook(() => useOverwrites(), {
      wrapperProps: { client: new ClientMock(), appContext: { variables: variables, selectedVariable: [1, 0] } }
    });
    expect(view.result.current).toBeFalsy();
  });

  test('variable that exists in required project returns true', async () => {
    const view = customRenderHook(() => useOverwrites(), {
      wrapperProps: { client: new ClientMock(), appContext: { variables: variables, selectedVariable: [1, 1, 0] } }
    });
    await waitFor(() => {
      expect(view.result.current).toBeTruthy();
    });
  });

  test('variable that exists as folder in required project returns true', async () => {
    const view = customRenderHook(() => useOverwrites(), {
      wrapperProps: { client: new ClientMock(), appContext: { variables: variables, selectedVariable: [1, 1] } }
    });
    await waitFor(() => {
      expect(view.result.current).toBeTruthy();
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
    } as KnownVariables);
  }
}
