import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiOrigin = process.env.API_ORIGIN ?? "http://127.0.0.1:4000";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 3001,
    strictPort: true,
    proxy: {
      "/api": { target: apiOrigin, changeOrigin: true },
      "/health": { target: apiOrigin, changeOrigin: true },
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 3001,
    proxy: {
      "/api": { target: apiOrigin, changeOrigin: true },
      "/health": { target: apiOrigin, changeOrigin: true },
    },
  },
});
