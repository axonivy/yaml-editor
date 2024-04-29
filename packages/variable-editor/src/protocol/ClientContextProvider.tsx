import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { Client, ClientContext } from './types';

const defaultClientContext: any = undefined;
const ClientContextInstance = createContext<ClientContext<any>>(defaultClientContext);

export const useClient = <T,>(): Client<T> => {
  const { client } = useContext(ClientContextInstance);
  return client;
};

export const ClientContextProvider = <T,>({ client, children }: { client: Client<T>; children: ReactNode }) => {
  return <ClientContextInstance.Provider value={{ client }}>{children}</ClientContextInstance.Provider>;
};
