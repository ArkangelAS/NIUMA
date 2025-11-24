import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // Relative base is good for GitHub Pages, generally safe for Vercel too
    base: './', 
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
    },
    define: {
      // Expose API_KEY safely if user used legacy name
      // Prefer using VITE_API_KEY in Vercel settings
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    }
  };
});