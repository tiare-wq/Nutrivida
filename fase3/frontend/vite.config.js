import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        strictPort: true,
        proxy: {
            '/api/admin': { target: 'http://localhost:8082', changeOrigin: true },
            '/api': { target: 'http://localhost:8081', changeOrigin: true },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        clearMocks: true,
        setupFiles: './src/test/setup.js',
        include: ['src/test/*.fase3.test.{js,jsx}'],
        coverage: { provider: 'v8', reporter: ['text', 'json', 'html'] },
    },
});
