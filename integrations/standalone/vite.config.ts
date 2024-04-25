import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: { input: { index: './index.html' } }
  },
  esbuild: {
    supported: {
      'top-level-await': true
    }
  },
  server: { port: 3001 },
  resolve: {
    alias: {
      '@axonivy/variable-editor': resolve(__dirname, '../../packages/variable-editor/src')
    }
  },
  base: './'
});
