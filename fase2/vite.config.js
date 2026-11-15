<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: { port: 5187, proxy: { "/api": "http://127.0.0.1:4387" } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    include: ["src/**/*.test.{js,jsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: [
        "src/cart.js",
        "src/validation.js",
        "src/components/CartView.jsx",
        "src/pages/Auth.jsx",
      ],
    },
  },
});
=======
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
>>>>>>> f7f2dd95bcca7c96e827981119a58f23a37c22b2
