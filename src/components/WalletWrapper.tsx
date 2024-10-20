import { NetworkId, WalletId, WalletManager, WalletProvider } from "@txnlab/use-wallet-solid"
import { ErrorBoundary } from "solid-js"
import ManageListings from "@/components/ManageListings"

const walletManager = new WalletManager({
  wallets: [
    WalletId.PERA,
    WalletId.DEFLY,
    WalletId.EXODUS,
    {
      id: WalletId.WALLETCONNECT,
      options: { projectId: "81b8486634fd8d59e84d3972b59d05b3" },
    },
    {
      id: WalletId.LUTE,
      options: { siteName: "AlgoDirectory" },
    },
  ],
  network: NetworkId.TESTNET,
})

export default function WalletWrapper() {
  return (
    <ErrorBoundary fallback={(err, reset) => <div onClick={reset}>Error: {err.toString()}</div>}>
      <WalletProvider manager={walletManager}>
        <h1 class="py-4 font-thin uppercase">Manage Your Listings</h1>
        <ManageListings />
      </WalletProvider>
    </ErrorBoundary>
  )
}
