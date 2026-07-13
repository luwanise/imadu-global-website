import { defineConfig } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    process.env.NODE_ENV === "production" && tanstackRouter({
      target: "react",
      autoCodeSplitting: false,
    }),

    tanstackStart({
      server: {
        entry: "server",
      },
    }),

    react(),

    tailwindcss(),

    nitro(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
    tsconfigPaths: true,
  },
});