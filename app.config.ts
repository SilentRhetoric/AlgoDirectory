import { defineConfig } from "@solidjs/start/config"

export default defineConfig({
  ssr: true,
  server: {
    prerender: {
      routes: ["/about"],
    },
    esbuild: { options: { target: "esnext" } },
  },
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
    // esbuild: { drop: ["console"] },
  },
})
