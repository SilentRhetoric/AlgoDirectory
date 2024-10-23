import { columns } from "@/components/data-table/Columns"
import { DataTable } from "@/components/data-table/DataTables"
import { createAsyncStore } from "@solidjs/router"

import { getListings } from "@/lib/algod-api"
import tagMap from "@/assets/tags.json" // Adjust the path as necessary
import { Suspense } from "solid-js"
import { formatTimestamp } from "@/lib/utilities"
import { NUM_TAGS_ALLOWED } from "@/lib/const";

const Home = () => {
  const listings = createAsyncStore(async () => {
    // Fetch the raw (unfiltered and unconverted) listings from the server
    const rawListings = await getListings()

    // We need to convert the raw listings to a format that can be displayed
    const c_listings = rawListings?.map((listing: { nfdAppID: any; name: any; vouchAmount: any; timestamp: bigint; tags: Iterable<unknown> | ArrayLike<unknown> }) => ({
      nfdAppID: listing.nfdAppID,
      name: listing.name,
      amount: (Number(listing.vouchAmount) * 1e-6).toFixed(4),
      timestamp: formatTimestamp(listing.timestamp),
      tags: Array.from(listing.tags)
        .slice(0, NUM_TAGS_ALLOWED) // limit the number of tags to the first 5
        .filter((value) => value !== 0) // remove empty tags
        .map((value) => {
          return tagMap[value?.toString() as keyof typeof tagMap].short as string
        }), // convert to string for master tag list a string[] instead of Uint8Array[]
    }))
    // console.log("c_listings", c_listings)
    return c_listings
  })

  return (
    <Suspense fallback="loading listings...">
      <div class="w-full p-4">
        <DataTable
          columns={columns}
          data={listings}
        />
      </div>
    </Suspense>
  )
}

export default Home
