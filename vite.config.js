import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [react(), mkcert()],

  server: {
    https: true,

    proxy: {
      "/api/telegram": {
        target: "https://api.telegram.org",
        changeOrigin: true,
        secure: true,
        rewrite: (path) =>
          path.replace(
            /^\/api\/telegram/,
            `/bot${process.env.BOT_TOKEN}/sendMessage`,
          ),
      },
    },
  },
});
