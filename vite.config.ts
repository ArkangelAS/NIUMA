import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 设置 base 为 './' 确保资源路径在 GitHub Pages 上是相对的，避免路径错误
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});