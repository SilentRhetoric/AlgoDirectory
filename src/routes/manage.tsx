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
          <main class="mx-auto p-4 text-center text-gray-700">
            <h1 class="max-6-xs my-16 text-6xl font-thin uppercase text-sky-700">Manage Page</h1>
          </main>
        </WalletProvider>
      </ErrorBoundary>
    </main>
  )
}
