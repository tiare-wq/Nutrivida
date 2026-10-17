import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],

    test: {
        environment: 'jsdom',
        globals: false,
        clearMocks: true,
        setupFiles: './src/test/setup.js',

        reporters: [
            'default',
            'html',
            'json',
            'junit'
        ],

        outputFile: {
            html: './outputs/reporte.html',
            json: './outputs/reporte.json',
            junit: './outputs/reporte-junit.xml'
        }
    }
});