import { columns } from "@/components/dataTable/Columns"
import { DataTable } from "@/components/dataTable/DataTables"
import { createAsyncStore } from "@solidjs/router"

import { getListings } from "@/lib/algod-api"
import { formatDistanceToNow } from "date-fns"
import tagMap from "@/assets/tags.json" // Adjust the path as necessary
import { Suspense } from "solid-js"

const NUM_TAGS_ALLOWED = 5

function formatTimestamp(timestamp: bigint) {
  // Convert the Unix timestamp to milliseconds
  const date = new Date(Number(timestamp) * 1000)

  // Use formatDistanceToNow to get the relative time
  return formatDistanceToNow(date, { addSuffix: true })
}

const Home = () => {
  const listings = createAsyncStore(async () => {
    // Fetch the raw (unfiltered and unconverted) listings from the server
    const rawListings = await getListings()

    // We need to convert the raw listings to a format that can be displayed
    const c_listings = rawListings?.map((listing) => ({
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
