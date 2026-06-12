/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    reporters: ["verbose"],
    exclude: ["e2e/**", "**/node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "e2e/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@app": "/src/app",
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@ui": "/src/components/ui",
      "@layout": "/src/components/layout",
      "@features": "/src/features",
      "@hooks": "/src/hooks",
      "@services": "/src/services",
      "@store": "/src/store",
      "@styles": "/src/styles",
      "@types": "/src/types",
      "@utils": "/src/utils",
    },
  },
});
