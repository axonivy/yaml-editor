import { useBrowser, BrowsersView } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { EMPTY_PROJECT_VAR_NODE, type ProjectVarNode } from '@axonivy/variable-editor-protocol';
import { useMemo } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { useMeta } from '../../../context/useMeta';
import { toNodes } from './known-variables';

export const VariableBrowser = ({ applyFn }: { applyFn: (node?: ProjectVarNode) => void }) => {
  const { context } = useAppContext();
  const knownVariables = useMeta('meta/knownVariables', context, EMPTY_PROJECT_VAR_NODE).data;
  const nodes = useMemo(() => toNodes(knownVariables), [knownVariables]);
  const variableBrowser = useBrowser(nodes);
  return (
    <BrowsersView
      browsers={[
        {
          name: 'Variables',
          icon: IvyIcons.Tool,
          browser: variableBrowser,
          infoProvider: row => <InfoProvider node={row?.original.data as ProjectVarNode} />
        }
      ]}
      apply={(type, result) => {
        applyFn(result?.data as ProjectVarNode);
      }}
      applyBtn={{ label: 'Import', icon: IvyIcons.FileImport }}
    />
  );
};

const InfoProvider = ({ node }: { node?: ProjectVarNode }) => {
  let value = node?.value;
  if (value !== undefined && node?.type == 'password') {
    value = '***';
  }
  if (value !== undefined && value !== '') {
    value = node?.name + ' = ' + value;
  }
  return (
    <div>
      <div>{node?.key}</div>
      <div>{node?.description}</div>
      <div>{value}</div>
    </div>
  );
};
