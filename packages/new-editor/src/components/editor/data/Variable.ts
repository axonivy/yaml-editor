export interface Variable {
  key: string;
  value: string;
  children: Array<Variable>;
}
