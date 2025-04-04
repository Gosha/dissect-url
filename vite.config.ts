import { defineConfig } from "vite"

import solidPlugin from "vite-plugin-solid"
import UnocssPlugin from "@unocss/vite"

export default defineConfig({
  plugins: [
    UnocssPlugin(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
})
