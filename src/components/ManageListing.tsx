import { AlgorandClient } from "@algorandfoundation/algokit-utils"
import { useWallet } from "@txnlab/use-wallet-solid"
import { createResource, For, Show } from "solid-js"
import { AlgoDirectoryClient } from "~/lib/AlgoDirectoryClient"
import { getOwnedSegments } from "~/lib/nfd-api"
import { ellipseString } from "~/lib/utilities"

export default function ManageListings() {
  const { activeAddress, transactionSigner, activeWallet, activeNetwork, algodClient, wallets } =
    useWallet()

  const [ownedSegments] = createResource(async () => {
    const response = await getOwnedSegments(activeAddress()!)
    return response
  })

  const algorand = AlgorandClient.testNet()
  const typedAppClient = algorand.client.getTypedAppClientById(AlgoDirectoryClient, {
    appId: 576232821n,
    defaultSender: activeAddress()!, // TODO: Handle null case from use-wallet
  })

  async function createNewListing() {
    const payTxn = algorand.createTransaction.payment({
      sender: activeAddress()!, // TODO: Handle null case from use-wallet
      receiver: typedAppClient.appAddress,
      amount: (72200).microAlgo(), // Each listing 72_200 uA
    })
    const createResult = await typedAppClient.send.createListing({
      args: {
        collateralPayment: payTxn,
        nfdAppId: 673442367,
        listingTags: new Uint8Array(13),
      },
      signer: transactionSigner,
    })
    console.debug(createResult)
  }

  return (
    <div>
      <Show
        when={activeAddress()}
        fallback={
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-center text-2xl">Connect Your Wallet</h2>
            <div class="flex flex-col gap-1">
              <For each={wallets}>
                {(wallet) => (
                  <button
                    class="rounded-sm border-[1px] p-2"
                    onClick={() => wallet.connect()}
                  >
                    {wallet.name}
                  </button>
                )}
              </For>
            </div>
          </div>
        }
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-row">
            <p>Connected Address: {ellipseString(activeAddress())}</p>
            <div class="grow"></div>
            <button
              onClick={() => activeWallet()!.disconnect()}
              aria-label="Disconnect"
              class="uppercase"
            >
              Disconnect
            </button>
          </div>
          <For each={ownedSegments()?.nfds}>
            {(segment) => (
              <div class="flex flex-row gap-2 rounded-sm border-[1px] p-4">
                <p>{segment.name}</p>
                <div class="grow"></div>
                <input>Vouch amount</input>
                <button>List it</button>
                <p>{JSON.stringify(segment)}</p>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}
// Get list of owned segments
// For each one
// Get listing data from store
// If no listing, amount field and create listing button
// If listing exists, refresh and abandon buttons
