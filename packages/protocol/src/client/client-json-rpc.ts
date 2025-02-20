import {
  BaseRpcClient,
  createMessageConnection,
  urlBuilder,
  type Connection,
  type Disposable,
  type MessageConnection
} from '@axonivy/jsonrpc';
import type { MetaRequestTypes, NotificationTypes, OnNotificationTypes, RequestTypes } from '@axonivy/variable-editor-protocol';
import type { ConfigEditorActionArgs } from '../editor';
import type { Client, EditorData, EditorDataContext, ValidationResult } from './types';

export abstract class ClientJsonRpc extends BaseRpcClient implements Client {
  abstract data(context: EditorDataContext): Promise<EditorData>;
  abstract saveData(saveData: EditorData): Promise<Array<ValidationResult>>;
  abstract validate(context: EditorDataContext): Promise<Array<ValidationResult>>;

  meta<TMeta extends keyof MetaRequestTypes>(path: TMeta, args: MetaRequestTypes[TMeta][0]): Promise<MetaRequestTypes[TMeta][1]> {
    return this.sendRequest(path, args);
  }

  action(action: ConfigEditorActionArgs): void {
    this.sendNotification('action', action);
  }

  sendRequest<K extends keyof RequestTypes>(command: K, args: RequestTypes[K][0]): Promise<RequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  sendNotification<K extends keyof NotificationTypes>(command: K, args: NotificationTypes[K]): Promise<void> {
    return this.connection.sendNotification(command, args);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNotification<K extends keyof OnNotificationTypes>(kind: K, listener: (args: OnNotificationTypes[K]) => any): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-config-lsp');
  }

  public static async startClient(connection: Connection): Promise<ClientJsonRpc> {
    return this.startMessageClient(createMessageConnection(connection.reader, connection.writer));
  }

  public static async startMessageClient(connection: MessageConnection): Promise<ClientJsonRpc> {
    const client = new ClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
