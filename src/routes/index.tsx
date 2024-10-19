import { createAsyncStore } from "@solidjs/router"
import { For } from "solid-js"
import { ListingCard } from "~/components/ListingCard"
import SiteTitle from "~/components/SiteTitle"
import { getListings } from "~/lib/algod-api"

export default function Home() {
  const listings = createAsyncStore(() => getListings(), {
    initialValue: [],
    reconcile: { merge: true },
  })

  return (
    <main class="flex flex-col gap-2 p-4">
      <SiteTitle>Home</SiteTitle>
      <For each={listings()}>
        {(listing) => {
          return <ListingCard listing={listing} />
        }}
      </For>
    </main>
  )
}
