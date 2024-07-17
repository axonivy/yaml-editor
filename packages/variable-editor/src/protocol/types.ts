export type Data = { context: DataContext; data: string };
export type ProjectVarNode = {
  key: string;
  name: string;
  value: string;
  description: string;
  type: string;
  children: Array<ProjectVarNode>;
};
export type DataContext = { app: string; pmv: string; file: string };
export type EditorProps = { context: DataContext; directSave?: boolean };
export type SaveArgs = Data & { directSave?: boolean };

export type ValidationMessage = { message: string; path: string; severity: number };
export type ValidationMessages = Array<ValidationMessage>;

export interface RequestTypes {
  data: [any, any];
  saveData: [any, any];
  validate: [any, any];
  overwritables: [any, any];
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
  data(context: DataContext): Promise<Data>;
  saveData(saveArgs: SaveArgs): Promise<ValidationMessages>;
  validate(validate: DataContext): Promise<ValidationMessages>;
  overwritables(context: DataContext): Promise<ProjectVarNode>;
  onDataChanged: Event<void>;
}

export interface ClientContext {
  client: Client;
}
