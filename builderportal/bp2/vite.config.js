import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { port: 5173, host: true },
  build: {
    outDir: '../../public/builderportal',
    emptyOutDir: true,
    chunkSizeWarningLimit: 800,
  },
});
