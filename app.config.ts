import { defineConfig } from "@solidjs/start/config"
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  ssr: true,
  server: {
    prerender: {
      routes: ["/about", "/manage"], // TODO: Experiment with prerendering "/"
    },
  },
  vite: {
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src")
      }
    },
    optimizeDeps: {
      include: [
        "@perawallet/connect",
        "@blockshake/defly-connect",
        "@walletconnect/modal",
        "@walletconnect/sign-client",
        "algosdk",
      ],
      // esbuildOptions: {  // Was trying to address Vinxi server build failure
      //   target: "es2020",
      //   // Node.js global to browser globalThis
      //   define: {
      //     global: "globalThis",
      //   },
      //   supported: {
      //     bigint: true,
      //   },
      // },
    },
    build: {
      // target: ["es2020"], // Was trying to address Vinxi server build failure
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    // esbuild: { drop: ["console"] },
  },
})
