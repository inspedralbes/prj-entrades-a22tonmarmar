import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests-components/organisms/**/*.spec.ts', 'tests-components/stores/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'tests-components/e2e'],
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'app'),
      '~': resolve(__dirname, 'app'),
    },
  },
});