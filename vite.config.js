// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/telegram": {
        target: "https://api.telegram.org",
        changeOrigin: true,
        rewrite: () => `/bot${process.env.BOT_TOKEN}/sendMessage`,
      },
    },
  },
});
