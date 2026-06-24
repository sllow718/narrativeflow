import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

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

  // Write injected dashboard to public/ so Vite serves it as static asset.
  // Per Vite docs: /dashboard/ works natively in dev for public/dashboard/index.html.
  const src = resolve("dashboard/index.html");
  const pubDir = resolve("public/dashboard");
  const pubFile = resolve(pubDir, "index.html");
  mkdirSync(pubDir, { recursive: true });
  writeFileSync(pubFile, injectEnv(readFileSync(src, "utf-8")));

  const dashboardPlugin = () => ({
    name: "serve-dashboard",
    configureServer(server) {
      // ponytail: redirect to /dashboard/index.html — Vite's static
      // file middleware serves public/ files raw (no HMR injection).
      // /dashboard/ gets HMR injected because Vite processes directory
      // indexes through its transform pipeline.
      server.middlewares.use((req, res, next) => {
        if (req.url === "/dashboard" || req.url === "/dashboard/") {
          res.writeHead(302, { Location: "/dashboard/index.html" });
          res.end();
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
