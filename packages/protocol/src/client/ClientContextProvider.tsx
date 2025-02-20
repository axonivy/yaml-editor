import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { Client, ClientContext } from '@axonivy/variable-editor-protocol';

const ClientContextInstance = createContext<ClientContext | undefined>(undefined);

export const useClient = (): Client => {
  const context = useContext(ClientContextInstance);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientContext');
  }
  return context.client;
};

export const ClientContextProvider = ({ client, children }: { client: Client; children: ReactNode }) => {
  return <ClientContextInstance.Provider value={{ client }}>{children}</ClientContextInstance.Provider>;
};
