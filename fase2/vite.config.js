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
