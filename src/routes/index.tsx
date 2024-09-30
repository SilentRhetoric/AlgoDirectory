import { createAsync } from "@solidjs/router"
import { For } from "solid-js"
import { ListingCard } from "~/components/Listing"
import SiteTitle from "~/components/SiteTitle"
import { getListings } from "~/lib/algod-api"

export default function Home() {
  const listings = createAsync(() => getListings())
  return (
    <main class="p-4">
      <SiteTitle>Home</SiteTitle>
      <div class="flex flex-col gap-4">
        <For each={listings()}>
          {(listing) => {
            return <ListingCard listing={listing} />
          }}
        </For>
      </div>
    </main>
  )
}
