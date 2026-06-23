import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const DASHBOARD_SRC = "dashboard/index.html";
const DASHBOARD_OUT = "dist/dashboard/index.html";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  function injectEnv(html) {
    return html
      .replace(/__VITE_FIREBASE_API_KEY__/g, env.VITE_FIREBASE_API_KEY || "")
      .replace(/__VITE_FIREBASE_AUTH_DOMAIN__/g, env.VITE_FIREBASE_AUTH_DOMAIN || "")
      .replace(/__VITE_FIREBASE_PROJECT_ID__/g, env.VITE_FIREBASE_PROJECT_ID || "")
      .replace(/__VITE_FIREBASE_STORAGE_BUCKET__/g, env.VITE_FIREBASE_STORAGE_BUCKET || "")
      .replace(/__VITE_FIREBASE_MESSAGING_SENDER_ID__/g, env.VITE_FIREBASE_MESSAGING_SENDER_ID || "")
      .replace(/__VITE_FIREBASE_APP_ID__/g, env.VITE_FIREBASE_APP_ID || "");
  }

  // Write injected dashboard to public/ immediately so Vite copies it into dist/
  const src = resolve(DASHBOARD_SRC);
  const pub = resolve("public/dashboard/index.html");
  mkdirSync(dirname(pub), { recursive: true });
  writeFileSync(pub, injectEnv(readFileSync(src, "utf-8")));

  const dashboardPlugin = () => ({
    name: "serve-dashboard",
    configureServer(server) {
      const html = injectEnv(readFileSync(DASHBOARD_SRC, "utf-8"));
      server.middlewares.use((req, res, next) => {
        if (req.url === "/dashboard" || req.url === "/dashboard/") {
          res.setHeader("Content-Type", "text/html");
          res.end(html);
          return;
        }
        next();
      });
    },
  });

  return {
    plugins: [dashboardPlugin, react()],
  };
});
