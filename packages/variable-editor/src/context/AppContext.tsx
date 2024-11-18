import { createContext, useContext } from 'react';
import type { Variable } from '../components/variables/data/variable';
import type { VariablesEditorDataContext, ValidationMessages } from '@axonivy/variable-editor-protocol';
import type { TreePath } from '../utils/tree/types';
import type { UpdateConsumer } from '../utils/lambda/lambda';

type AppContext = {
  variables: Array<Variable>;
  setVariables: UpdateConsumer<Array<Variable>>;
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
