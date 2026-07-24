import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Make sure this uses a slash '/' and not a dot '.'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});