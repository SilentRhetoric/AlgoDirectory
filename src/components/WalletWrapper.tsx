import { NetworkId, WalletId, WalletManager, WalletProvider } from "@txnlab/use-wallet-solid"
import { ErrorBoundary } from "solid-js"
import ManageListings from "@/components/ManageListings"
import { NETWORK } from "@/lib/algod-api"

const walletNetwork = () => {
  switch (NETWORK) {
    case "mainnet":
      return NetworkId.MAINNET
    case "testnet":
      return NetworkId.TESTNET
    default:
      throw new Error(`Unsupported network: ${NETWORK}`)
  }
}

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
  network: walletNetwork(),
})

export default function WalletWrapper() {
  return (
    <ErrorBoundary fallback={(err, reset) => <div onClick={reset}>Error: {err.toString()}</div>}>
      <WalletProvider manager={walletManager}>
        <ManageListings />
      </WalletProvider>
    </ErrorBoundary>
  )
}
