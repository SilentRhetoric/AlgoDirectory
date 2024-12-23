import { createAsyncStore } from "@solidjs/router"
import { Suspense } from "solid-js"
import { columns } from "@/components/data-table/Columns"
import { DataTable } from "@/components/data-table/DataTable"
import LoadingIcon from "@/components/icons/LoadingIcon"
import { getListings } from "@/lib/algod-api"
import { NUM_TAGS_ALLOWED } from "@/lib/constants"
import tagMap from "@/assets/tags.json" // Adjust the path as necessary
import SiteTitle from "@/components/SiteTitle"
import GetASegment from "@/components/GetASegment"
import { Meta } from "@solidjs/meta"

const Home = () => {
  const listings = createAsyncStore(async () => {
    // Fetch the raw (unfiltered and unconverted) listings from the server
    const rawListings = await getListings()

    // We need to convert the raw listings to a format that can be displayed
    const adjustedListings = rawListings?.map(
      (listing: {
        nfdAppID: any
        name: any
        vouchAmount: any
        timestamp: bigint
        tags: Iterable<unknown> | ArrayLike<unknown>
      }) => ({
        nfdAppID: listing.nfdAppID,
        name: listing.name,
        amount: (Number(listing.vouchAmount) * 1e-6).toFixed(4),
        timestamp: Number(listing.timestamp).toString(),
        tags: Array.from(listing.tags)
          .slice(0, NUM_TAGS_ALLOWED) // limit the number of tags to the first 5
          .filter((value) => value !== 0) // remove empty tags
          .map((value) => {
            return tagMap[value?.toString() as keyof typeof tagMap].short as string
          }), // convert to string for master tag list a string[] instead of Uint8Array[]
      }),
    )
    return adjustedListings
  })

  return (
    <div class="flex w-full flex-col gap-4 p-4">
      <SiteTitle>Home</SiteTitle>
      <Meta
        property="og:url"
        content="https://algodirectory.app"
      />
      <Meta
        property="og:type"
        content="website"
      />
      <Meta
        property="og:title"
        content="AlgoDirectory"
      />
      <Meta
        property="og:description"
        content="A decentralized, on-chain directory for the Algorand ecosystem"
      />
      <Meta
        property="og:image"
        content="https://algodirectory.app/og/Explore"
      />
      <Meta
        name="twitter:card"
        content="summary_large_image"
      />
      <Meta
        property="twitter:domain"
        content="algodirectory.app"
      />
      <Meta
        property="twitter:url"
        content="https://algodirectory.app"
      />
      <Meta
        name="twitter:title"
        content="AlgoDirectory"
      />
      <Meta
        name="twitter:description"
        content="A decentralized, on-chain directory for the Algorand ecosystem"
      />
      <Meta
        name="twitter:image"
        content="https://algodirectory.app/og/Explore"
      />
      <Suspense
        fallback={
          <div class="mx-auto flex min-h-screen items-center justify-center">
            <span class="animate-spin">
              <LoadingIcon />
            </span>
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={listings}
        />
      </Suspense>
      <GetASegment />
    </div>
  )
}

export default Home
