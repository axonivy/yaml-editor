import { useQuery } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import type { MetaRequestTypes } from '@axonivy/variable-editor-protocol';
import { useClient } from '../protocol/ClientContextProvider';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof MetaRequestTypes>(
  path: TMeta,
  args: MetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<MetaRequestTypes[TMeta][1]>
): { data: MetaRequestTypes[TMeta][1] } {
  const client = useClient();
  return useQuery({
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args),
    initialData: initialData
  });
}
