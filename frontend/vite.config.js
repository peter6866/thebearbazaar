import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [
    react(),
    eslintPlugin({
      cache: false,
      include: ["./src/**/*.jsx"],
      exclude: ["node_modules", "dist", "build"],
    }),
  ],
  server: {
    port: 3000,
    open: false,
  },
});
