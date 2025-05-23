import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    port: 4200,
  },
  optimizeDeps: {
    include: ['zone.js'],
  },
});
