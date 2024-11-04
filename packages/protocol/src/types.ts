import type { ProjectVarNode, ValidationResult, VariablesData, VariablesEditorDataContext } from './editor';

export type EditorProps = { context: VariablesEditorDataContext; directSave?: boolean };
export type SaveArgs = VariablesData & { directSave?: boolean };

export type ValidationMessages = Array<ValidationResult>;

export interface MetaRequestTypes {
  'meta/knownVariables': [VariablesEditorDataContext, ProjectVarNode];
}

export interface RequestTypes extends MetaRequestTypes {
  data: [any, any];
  saveData: [any, any];
  validate: [any, any];
}

export interface NotificationTypes {
  dataChanged: void;
}

export interface Event<T> {
  (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Disposable {
  dispose(): void;
}

export interface Client {
  data(context: VariablesEditorDataContext): Promise<VariablesData>;
  saveData(saveArgs: SaveArgs): Promise<ValidationMessages>;
  validate(validate: VariablesEditorDataContext): Promise<ValidationMessages>;
  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]>;
  onDataChanged: Event<void>;
}

export interface ClientContext {
  client: Client;
}
