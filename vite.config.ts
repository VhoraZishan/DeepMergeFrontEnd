// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // ... your other proxies
      '/incois-api': {
        // We will target the last known good server address
        target: 'https://las.incois.gov.in', 
        changeOrigin: true,
        secure: false, // Keep this for the SSL issue
        // We removed followRedirects and updated the rewrite
        rewrite: (path) => path.replace(/^\/incois-api/, ''),
      },
      // Local dev proxy for server-side fetches (so /api/proxy executes server logic)
      '/api/proxy': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/proxy/, '/'),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));