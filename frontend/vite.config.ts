import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
    // HMR 연결 실패 시 자동 재연결
    hmr: {
      overlay: true,
    },
  },
  // 개발 중 캐시 무효화 방지
  optimizeDeps: {
    // 의존성 변경 시 자동 재빌드
    force: false,
  },
  // 빌드 캐시 설정
  build: {
    // 빌드 시 캐시 무효화 방지
    rollupOptions: {
      output: {
        // 파일명에 해시 포함하여 캐시 무효화
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
});
