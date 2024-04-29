import { ThemeProvider } from '@axonivy/ui-components';
import { ClientContextProvider, ClientJsonRpc, QueryProvider, VariableEditor, initQueryClient } from '@axonivy/variable-editor';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { URLParams } from './url-helper';

export async function start(): Promise<void> {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  const server = URLParams.webSocketBase();
  const app = URLParams.app();
  const pmv = URLParams.pmv();
  const theme = URLParams.theme();

  const client = await ClientJsonRpc.startWebSocketClient(server);
  const queryClient = initQueryClient();

  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme={theme}>
        <ClientContextProvider client={client}>
          <QueryProvider client={queryClient}>
            <VariableEditor app={app} pmv={pmv} file='variables.yaml' />
          </QueryProvider>
        </ClientContextProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

start();
