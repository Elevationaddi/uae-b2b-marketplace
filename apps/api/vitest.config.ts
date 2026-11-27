import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// SWC is required so NestJS decorator metadata is emitted under Vitest.
export default defineConfig({
  test: { include: ['test/**/*.test.ts', 'src/**/*.test.ts'], testTimeout: 20_000, pool: 'forks' },
  plugins: [swc.vite({ module: { type: 'es6' } })],
});
