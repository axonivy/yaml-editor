/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type {
  ConfigEditorActionArgs,
  KnownVariables,
  VariablesActionArgs,
  VariablesData,
  VariablesEditorDataContext,
  VariablesSaveDataArgs,
  VariablesValidationResult
} from '../editor';

export type EditorDataContext = VariablesEditorDataContext;
export type EditorData = VariablesData;
export type ValidationResult = VariablesValidationResult;

export interface MetaRequestTypes {
  'variables/meta/knownVariables': [VariablesEditorDataContext, KnownVariables];
}

export interface RequestTypes extends MetaRequestTypes {
  'variables/data': [VariablesEditorDataContext, VariablesData];
  'variables/saveData': [SaveArgs, ValidationMessages];
  'variables/validate': [VariablesEditorDataContext, ValidationMessages];
}

export interface NotificationTypes {
  action: ConfigEditorActionArgs;
}

export type EditorProps = { context: VariablesEditorDataContext; directSave?: boolean };
export type SaveArgs = VariablesSaveDataArgs & { directSave?: boolean };

export type ValidationMessages = Array<VariablesValidationResult>;

export interface OnNotificationTypes {
  dataChanged: void;
}

export interface Event<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  action(action: VariablesActionArgs): void;
}

export interface ClientContext {
  client: Client;
}

export const EMPTY_KNOWN_VARIABLES: KnownVariables = {
  children: [],
  description: '',
  metaData: { type: '' },
  name: '',
  namespace: '',
  value: ''
};
