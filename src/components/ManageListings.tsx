import { AlgorandClient } from "@algorandfoundation/algokit-utils"
import { useWallet } from "@txnlab/use-wallet-solid"
import { createResource, For, Show, Suspense } from "solid-js"
import { AlgoDirectoryClient } from "@/lib/AlgoDirectoryClient"
import { getOwnedSegments } from "@/lib/nfd-api"
import { ellipseString } from "@/lib/utilities"
import { ManageSingleListing } from "./ManageSingleListing"

export default function ManageListings() {
  const { activeAddress, activeWallet, transactionSigner, wallets } = useWallet()

  const [ownedSegments] = createResource(async () => {
    const response = await getOwnedSegments(activeAddress()!)
    return response
  })

  const algorand = AlgorandClient.testNet()
  const typedAppClient = algorand.client.getTypedAppClientById(AlgoDirectoryClient, {
    appId: 722603330n,
    defaultSender: activeAddress()!, // TODO: Handle null case from use-wallet
  })

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
        <Suspense fallback={<div>Loading your segments...</div>}>
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
                  <ManageSingleListing
                    segment={segment}
                    algorand={algorand}
                    typedAppClient={typedAppClient}
                    sender={activeAddress()!}
                    transactionSigner={transactionSigner}
                  />
                </div>
              )}
            </For>
          </div>
        </Suspense>
      </Show>
    </div>
  )
}
// For each owned segment
// Get listing data from box by name, where name is the nfdAppID
// If no listing, amount field and create listing button
// If listing exists, refresh and abandon buttons
