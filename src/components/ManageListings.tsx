import { useWallet } from "@txnlab/use-wallet-solid"
import { createResource, For, Show, Suspense } from "solid-js"
import { getOwnedSegments } from "@/lib/nfd-api"
import { ellipseString } from "@/lib/utilities"
import { ManageSingleListing } from "./ManageSingleListing"
import { Button } from "@/components/ui/button"

export default function ManageListings() {
  const { activeAddress, activeWallet, transactionSigner, wallets } = useWallet()

  const [ownedSegments] = createResource(async () => {
    const response = await getOwnedSegments(activeAddress()!)
    return response
  })

  return (
    <div>
      <h1 class="flex flex-row items-center py-4 font-thin uppercase sm:justify-start">
        <span>
          Your{" "}
          <a
            href="https://app.testnet.nf.domains/name/directory.algo?view=segments"
            target="_blank"
            class="text-blue-500"
          >
            directory.algo
          </a>{" "}
          segments
        </span>
      </h1>
      <Show
        when={activeAddress()}
        fallback={
          <div class="flex flex-col items-center gap-2">
            <h2 class="text-center text-2xl">Connect Your Wallet</h2>
            <div class="flex flex-col gap-2 sm:gap-1">
              <For each={wallets}>
                {(wallet) => (
                  <Button
                    variant="outline"
                    class="h-12 w-48 rounded-sm border-[1px] p-2 text-lg"
                    onClick={() => wallet.connect()}
                  >
                    {wallet.name}
                  </Button>
                )}
              </For>
            </div>
          </div>
        }
      >
        <Suspense
          fallback={<div class="flex min-h-screen items-center justify-center">Loading...</div>}
        >
          <div class="flex flex-col gap-4">
            <div class="flex flex-row items-center">
              <p>Connected Address: {ellipseString(activeAddress())}</p>
              <div class="grow"></div>
              <Button
                onClick={() => activeWallet()!.disconnect()}
                aria-label="Disconnect"
                class="uppercase"
              >
                Disconnect
              </Button>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 md:gap-3 lg:grid-cols-3">
              <For each={ownedSegments()?.nfds}>
                {(segment) => (
                  <ManageSingleListing
                    segment={segment}
                    sender={activeAddress()!}
                    transactionSigner={transactionSigner}
                  />
                )}
              </For>
            </div>
          </div>
        </Suspense>
      </Show>
    </div>
  )
}
