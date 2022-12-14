import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.API_URL,
          changeOrigin: true,
          secure: mode === "development" ? false : true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    define: {
      "process.env": Object.assign(process.env, env),
    },
  };
});
