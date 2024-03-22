import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rollupOptions: { input: { index: './index.html' } }
  },
  server: { port: 3000 },
  resolve: {
    alias: {
      '@axonivy/config-editor': resolve(__dirname, '../../packages/editor/src')
    }
  },
  base: './'
});
