import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

const dashboardPlugin = () => ({
  name: "serve-dashboard",
  configureServer(server) {
    const html = readFileSync("dashboard/index.html", "utf-8");
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

export default defineConfig({
  plugins: [dashboardPlugin(), react()],
});
