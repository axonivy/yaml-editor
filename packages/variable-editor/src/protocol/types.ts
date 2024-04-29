export type Data = { context: DataContext; data: string };
export type DataContext = { app: string; pmv: string; file: string };

export interface RequestTypes {
  data: [any, any];
  saveData: [any, void];
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
  onDataChanged: Event<void>;
}

export interface ClientContext {
  client: Client;
}
