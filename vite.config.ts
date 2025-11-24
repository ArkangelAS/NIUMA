import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL for GitHub Pages: Use relative paths
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  define: {
    // Polyfill process.env to prevent "process is not defined" error in browser
    'process.env': JSON.stringify(process.env)
  }
});