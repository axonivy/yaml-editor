import { useAppContext } from './AppContext';
import { useClient } from '@axonivy/variable-editor-protocol/src/client/ClientContextProvider';
import type { VariablesActionArgs } from '@axonivy/variable-editor-protocol';

export function useAction(actionId: VariablesActionArgs['actionId']) {
  const { context } = useAppContext();
  const client = useClient();

  return (content?: VariablesActionArgs['payload']) => {
    let payload = content ?? '';
    if (typeof payload === 'object') {
      payload = JSON.stringify(payload);
    }
    client.action({ actionId, context, payload });
  };
}
