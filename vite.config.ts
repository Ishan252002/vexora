import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// `vite build --mode single` produces a build with fonts inlined and relative
// paths, which scripts/build-single.mjs folds into one double-clickable HTML file.
export default defineConfig(({ mode }) => {
  const single = mode === 'single';
  return {
    base: single ? './' : '/',
    plugins: [react()],
    server: { port: 5173, host: true },
    preview: { port: 4173, host: true },
    build: single
      ? { outDir: 'demo-build', assetsInlineLimit: 100_000_000, cssCodeSplit: false, modulePreload: false }
      : {},
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  };
});
