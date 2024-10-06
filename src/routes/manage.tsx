import { NetworkId, WalletId, WalletManager, WalletProvider } from "@txnlab/use-wallet-solid"
import { ErrorBoundary } from "solid-js"
import SiteTitle from "~/components/SiteTitle"

const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.EXODUS,
    {
      id: WalletId.WALLETCONNECT,
      options: { projectId: "d9cef016ef56cf53a72d549e5898f348" },
    },
    {
      id: WalletId.LUTE,
      options: { siteName: "Bonfire" },
    },
    // WalletId.KMD,
  ],
  network: NetworkId.MAINNET,
})

export default function Manage() {
  return (
    <main>
      <SiteTitle>Manage</SiteTitle>
      <ErrorBoundary fallback={(err, reset) => <div onClick={reset}>Error: {err.toString()}</div>}>
        <WalletProvider manager={walletManager}>
          <div class="text-gray-700 p-4 text-center">
            <h1 class="max-6-xs text-sky-700 my-16 text-6xl uppercase">Manage Page</h1>
          </div>
        </WalletProvider>
      </ErrorBoundary>
    </main>
  )
}
