import { createContext, useContext } from 'react';
import type { Variable } from '../components/variables/data/variable';
import type { VariablesEditorDataContext, ValidationMessages } from '@axonivy/variable-editor-protocol';
import type { TreePath } from '../utils/tree/types';

type AppContext = {
  variables: Array<Variable>;
  setVariables: (variables: Array<Variable>) => void;
  selectedVariable: TreePath;
  setSelectedVariable: (path: TreePath) => void;
  validations: ValidationMessages;
  context: VariablesEditorDataContext;
  detail: boolean;
  setDetail: (visible: boolean) => void;
};

const appContext = createContext<AppContext>({
  variables: [],
  setVariables: () => {},
  selectedVariable: [],
  setSelectedVariable: () => {},
  validations: [],
  context: { app: '', pmv: '', file: '' },
  detail: true,
  setDetail: () => {}
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  return useContext(appContext);
};
