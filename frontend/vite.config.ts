import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import prettyCssModules from 'vite-plugin-pretty-css-modules';

export default defineConfig({
  server: {
    https: {
      key: '/home/student/key.pem',
      cert: '/home/student/cert.pem',
    },
    host: '0.0.0.0',
    port: 5173
  },
  plugins: [react(), prettyCssModules()]
});