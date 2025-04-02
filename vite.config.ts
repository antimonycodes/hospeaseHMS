import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   proxy: {
  //     "/v0.1/api": {
  //       target: "https://dev.gethospease.com",
  //       changeOrigin: true,
  //       secure: false, // Use false only if the backend has self-signed SSL
  //     },
  //   },
  // },
  // server: {
  //   proxy: {
  //     "/v0.1/api": {
  //       target: "https://dev.gethospease.com",
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => {
  //         console.log("Proxying request:", path);
  //         return path.replace(/^\/v0.1\/api/, "/v0.1/api");
  //       },
  //     },
  //   },
  // },
});
