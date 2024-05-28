export type Data = { context: DataContext; data: string };
export type DataContext = { app: string; pmv: string; file: string };

type ValidationMessage = { message: string; path: string; severity: number };
export type ValidationMessages = Array<ValidationMessage>;

export interface RequestTypes {
  data: [any, any];
  saveData: [any, void];
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
  data(context: DataContext): Promise<Data>;
  saveData(saveData: Data): Promise<void>;
  validate(validate: DataContext): Promise<ValidationMessages>;
  onDataChanged: Event<void>;
}

export interface ClientContext {
  client: Client;
}
