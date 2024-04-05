import type { Variable } from '../components/editor/data/Variable';
import type { TreePath } from '../types/config';

export const getVariable = (variables: Array<Variable>, path: TreePath): Variable | undefined => {
  if (path.length === 0) {
    return;
  }
  return getVariableRecursive(variables, [...path]);
};

const getVariableRecursive = (variables: Array<Variable>, path: TreePath): Variable => {
  const variable = variables[path.shift()!];
  if (path.length === 0) {
    return variable;
  }
  return getVariableRecursive(variable.children, path);
};
