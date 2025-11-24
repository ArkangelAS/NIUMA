import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 设置 base 为 './' 确保资源路径在 GitHub Pages 上是相对的
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    // 浏览器环境没有 process 对象，这里定义一个空对象防止代码报错
    // 注意：部署到 GitHub Pages 时，API Key 需要通过其他方式注入或构建时替换
    'process.env': {}
  }
});