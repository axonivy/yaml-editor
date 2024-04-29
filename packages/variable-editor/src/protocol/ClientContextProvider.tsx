import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { Client, ClientContext } from './types';

const defaultClientContext: any = undefined;
const ClientContextInstance = createContext<ClientContext>(defaultClientContext);

export const useClient = (): Client => {
  const { client } = useContext(ClientContextInstance);
  return client;
};

export const ClientContextProvider = ({ client, children }: { client: Client; children: ReactNode }) => {
  return <ClientContextInstance.Provider value={{ client }}>{children}</ClientContextInstance.Provider>;
};
