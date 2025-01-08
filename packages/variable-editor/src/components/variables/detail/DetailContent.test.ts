import type { Client, KnownVariables, MetaRequestTypes, ValidationMessages } from '@axonivy/variable-editor-protocol';
import { waitFor } from '@testing-library/react';
import { customRenderHook } from '../data/test-utils/test-utils';
import type { Variable } from '../data/variable';
import { messageDataOfProperty, useOverwrites } from './DetailContent';

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

test('messageDataOfProperty', () => {
  expect(messageDataOfProperty(validations, 'property0')).toEqual({ message: 'message0', variant: 'info' });
  expect(messageDataOfProperty(validations, 'property1')).toEqual({ message: 'message2', variant: 'warning' });
  expect(messageDataOfProperty(validations, 'property2')).toEqual({ message: 'message3', variant: 'error' });
  expect(messageDataOfProperty(validations, 'property3')).toBeUndefined();
});

const validations = [
  { message: 'message0', property: 'property0', severity: 'INFO' },
  { message: 'message1', property: 'property1', severity: 'INFO' },
  { message: 'message2', property: 'property1', severity: 'WARNING' },
  { message: 'message3', property: 'property2', severity: 'ERROR' },
  { message: 'message4', property: 'property2', severity: 'INFO' }
] as ValidationMessages;
