import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(rootDir, 'index.html'),
        'sample/index': resolve(rootDir, 'sample/index.html'),
        'sample/examples': resolve(rootDir, 'sample/examples.html'),
        'sample/bisnis-lokal': resolve(rootDir, 'sample/bisnis-lokal.html'),
        'sample/konsultan': resolve(rootDir, 'sample/konsultan.html'),
        'sample/kuliner': resolve(rootDir, 'sample/kuliner.html'),
        'sample/salon': resolve(rootDir, 'sample/salon.html'),
        'sample/toko-online': resolve(rootDir, 'sample/toko-online.html'),
      },
    },
  },
});
