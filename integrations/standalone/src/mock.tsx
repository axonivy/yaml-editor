import { ThemeProvider } from '@axonivy/ui-components';
import { ClientContextProvider, QueryProvider, VariableEditor, initQueryClient } from '@axonivy/variable-editor';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import { VariablesClientMock } from './mock/variables-client-mock';
import { HotkeysProvider } from 'react-hotkeys-hook';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const client = new VariablesClientMock();
const queryClient = initQueryClient();

root.render(
  <React.StrictMode>
    <ThemeProvider defaultTheme={'light'}>
      <ClientContextProvider client={client}>
        <QueryProvider client={queryClient}>
          <HotkeysProvider initiallyActiveScopes={['global']}>
            <VariableEditor context={{ app: '', pmv: 'project-name', file: '' }} />
          </HotkeysProvider>
        </QueryProvider>
      </ClientContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);
