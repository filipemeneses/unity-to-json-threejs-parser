import { defineConfig } from "vite";

import path from "path";

export default defineConfig({
  plugins: [],
  resolve: {
    alias: [
      {
        find: "~",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: './lib',
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    commonjsOptions: {
      include: [/three/, /node_modules/],
    },
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["cjs"],
    }
  },
});