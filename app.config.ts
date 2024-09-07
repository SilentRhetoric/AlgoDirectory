import { defineConfig } from "@solidjs/start/config"

export default defineConfig({
  ssr: true,
  vite: {
    optimizeDeps: {
      include: [
        "@perawallet/connect",
        "@blockshake/defly-connect",
        "@walletconnect/modal",
        "@walletconnect/sign-client",
        "algosdk",
      ],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    esbuild: { drop: ["console"] },
  },
})
