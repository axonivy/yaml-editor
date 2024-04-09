import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    dir: 'src',
    include: ['**/*.test.ts?(x)'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setupTests.tsx'],
    css: false,
    reporters: process.env.CI ? ['basic', 'junit'] : ['default'],
    outputFile: 'report.xml'
  }
});
