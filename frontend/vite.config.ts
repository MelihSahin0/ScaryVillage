import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import prettyCssModules from 'vite-plugin-pretty-css-modules';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  plugins: [react(), prettyCssModules()]
});