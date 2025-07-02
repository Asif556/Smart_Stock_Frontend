import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts'],
          utils: ['papaparse', 'jspdf']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  preview: {
    port: 3000,
    host: true
  }
});
