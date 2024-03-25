import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { YAMLVariablesTable } from '@axonivy/config-editor';

const content = localStorage.getItem('config') ?? '';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <YAMLVariablesTable
      content={content}
      onChange={(content) => localStorage.setItem('config', content)}
    />
  </React.StrictMode>
);
