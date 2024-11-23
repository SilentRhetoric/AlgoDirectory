import { useWallet } from "@txnlab/use-wallet-solid"
import { createMemo, createResource, For, Show, Suspense } from "solid-js"
import { getOwnedSegments } from "@/lib/nfd-api"
import { ellipseString } from "@/lib/formatting"
import { ManageSingleListing } from "./ManageSingleListing"
import { Button } from "@/components/ui/button"
import GetASegment from "./GetASegment"
import { generateTagsList, generateTagsMap, sortedTagsList } from "@/lib/tag-generator"

export default function ManageListings() {
  const { activeAddress, activeWallet, transactionSigner, wallets } = useWallet()

  const [ownedSegments] = createResource(activeAddress, async () => {
    const response = await getOwnedSegments(activeAddress()!)
    return response
  })

  // Generate the master list of tags and the map of tags
  const masterTagList = createMemo(() => generateTagsList())
  const sortedMasterTagList = createMemo(() => sortedTagsList)
  const masterTagMap = createMemo(() => generateTagsMap())

  return (
    <div>
      <h1 class="flex flex-row items-center uppercase sm:justify-start">
        <span>Your segments</span>
      </h1>
      <Show
        when={activeAddress()}
        fallback={
          <div class="flex flex-col items-center gap-4 p-4">
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
              <p class="uppercase">Connected Address: {ellipseString(activeAddress())}</p>
              <div class="grow"></div>
              <Button
                onClick={() => activeWallet()!.disconnect()}
                aria-label="Disconnect"
                class="uppercase"
                variant="outline"
              >
                Disconnect
              </Button>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <For each={ownedSegments()?.nfds}>
                {(segment) => (
                  <ManageSingleListing
                    segment={segment}
                    sender={activeAddress()!}
                    transactionSigner={transactionSigner}
                    masterTagList={masterTagList()}
                    sortedMasterTagList={sortedMasterTagList()}
                    masterTagMap={masterTagMap()}
                  />
                )}
              </For>
            </div>
          </div>
        </Suspense>
      </Show>
      <div class="p-4">
        <h2>How It Works</h2>
        <p>Creating an AlgoDirectory listing is as easy as 1, 2, 3:</p>
        <ol>
          <li>
            1. Mint an NFD segment of{" "}
            <a
              href="https://app.nf.domains/name/directory.algo?view=segments"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500"
            >
              directory.algo
            </a>{" "}
            and fill out its metadata, images, etc.
          </li>
          <li>2. Return here and connect the account that owns the segment.</li>
          <li>3. Select tags, deposit some Algo to vouch for the listing, and create it!</li>
        </ol>
      </div>
    </div>
  )
}
