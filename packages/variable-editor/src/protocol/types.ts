export type Data<T> = { context: DataContext; data: T };
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

export interface Client<T> {
  data(context: DataContext): Promise<Data<T>>;
  saveData(saveData: Data<T>): Promise<void>;
  onDataChanged: Event<void>;
}

export interface ClientContext<T> {
  client: Client<T>;
}
