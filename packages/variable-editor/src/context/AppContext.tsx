import { createContext, useContext } from 'react';
import type { Variable } from '../components/variables/data/variable';
import type { DataContext, ValidationMessages } from '../protocol/types';
import type { TreePath } from '../utils/tree/types';

type AppContext = {
  variables: Array<Variable>;
  setVariables: (variables: Array<Variable>) => void;
  selectedVariable: TreePath;
  setSelectedVariable: (path: TreePath) => void;
  validationMessages: ValidationMessages;
  context: DataContext;
  detail: boolean;
  setDetail: (visible: boolean) => void;
};

const appContext = createContext<AppContext>({
  variables: [],
  setVariables: () => {},
  selectedVariable: [],
  setSelectedVariable: () => {},
  validationMessages: [],
  context: { app: '', pmv: '', file: '' },
  detail: true,
  setDetail: () => {}
});

export const AppProvider = appContext.Provider;

export const useAppContext = () => {
  return useContext(appContext);
};
