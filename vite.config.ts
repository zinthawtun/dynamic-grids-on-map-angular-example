import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    needsInterop: ['dynamic-grids-on-map']
  }
});