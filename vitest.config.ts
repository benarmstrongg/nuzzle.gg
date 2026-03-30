import config from './vite.config';
import { mergeConfig, defineConfig } from 'vitest/config';

export default mergeConfig(
  config,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
    },
  })
);
