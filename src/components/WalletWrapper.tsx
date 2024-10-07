import { NetworkId, WalletId, WalletManager, WalletProvider } from "@txnlab/use-wallet-solid"
import { ErrorBoundary } from "solid-js"
import ManageListings from "~/components/ManageListing"
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
