import { defineConfig } from "@solidjs/start/config"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// const __mode = import.meta.env.MODE
// const __prod = __mode === "production"

export default defineConfig({
  ssr: true,
  server: {
    prerender: {
      routes: ["/about"],
    },
    esbuild: { options: { target: "esnext" } },
  },
  vite: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      include: [
        "@perawallet/connect",
        "@blockshake/defly-connect",
        "@walletconnect/modal",
        "@walletconnect/sign-client",
        "algosdk",
      ],
    },
    // esbuild: { drop: ["console"] },
  },
})
