import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        clearMocks: true,
        setupFiles: './src/test/setup.js',
        coverage: {
            enabled: true, // Forzar la ejecución de cobertura
            provider: 'v8', 
            reporter: ['text', 'json', 'html'], // Formatos del reporte de cobertura
            },
    }
});