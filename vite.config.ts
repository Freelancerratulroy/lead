
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Inject the API key from the environment into the bundle at build time
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || "")
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  }
});
