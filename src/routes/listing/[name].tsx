import {
  cache,
  createAsync,
  RouteDefinition,
  RouteSectionProps,
  useSearchParams,
} from "@solidjs/router"
import SiteTitle from "@/components/SiteTitle"
import { getNFDInfo, nfdSiteUrlRoot } from "@/lib/nfd-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { For, Match, Suspense, Switch } from "solid-js"
import { fetchSingleListing } from "@/lib/algod-api"
import { formatTimestamp } from "@/lib/formatting"
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount"
import AlgorandLogo from "@/components/icons/AlgorandLogo"
import { Listing } from "@/types/types"
import { NfdRecordResponseFull } from "@/lib/nfd-swagger-codegen"
import { NUM_TAGS_ALLOWED } from "@/lib/constants"
import tagMap from "@/assets/tags.json"
import LinkIcon from "@/components/icons/LinkIcon"

export const route = {
  preload({ params }) {
    void getNFDInfo(params.name)
  },
} satisfies RouteDefinition

type NFDAndListingInfo = {
  nfdInfo: NfdRecordResponseFull
  listingInfo: Listing
}
async function FetchAllNameInfo(name: string, appID?: number) {
  let allInfo = {} as NFDAndListingInfo
  const getListing = async (appID: number) => await fetchSingleListing(appID)
  const getNFD = async (name: string) => await getNFDInfo(name)
  if (appID) {
    // Fire off both requests at the same time because appID is known
    const [listingInfo, nfdInfo] = await Promise.all([getListing(appID), getNFD(name)])
    allInfo = { listingInfo, nfdInfo }
  } else {
    // Get NFD info first to get the appID, then get the listing info
    const nfdInfo = await getNFDInfo(name)
    const listingInfo = await getListing(nfdInfo.appID!)
    allInfo = { listingInfo, nfdInfo }
    console.log(allInfo)
  }
  return allInfo
}
const getAllNameInfo = cache(async (name: string, appID?: number) => {
  "use server"
  return FetchAllNameInfo(name, appID)
}, "getAllNameInfo")

export default function ListingDetails(props: RouteSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const appIDFromQueryParams = Number(searchParams.appid)
  // Defering stream here so that the page doesn't navigate until the data loads
  const allNameInfo = createAsync(() => getAllNameInfo(props.params.name, appIDFromQueryParams), {
    deferStream: true,
  })

  return (
    <main class="flex flex-col gap-2 p-4">
      <SiteTitle>{allNameInfo()?.nfdInfo?.name.split(".")[0].toUpperCase()}</SiteTitle>
      <Suspense fallback={<div>Loading...</div>}>
        <Card class="mx-auto w-full max-w-6xl">
          <div class="relative mb-4 flex h-full w-full items-center justify-center">
            {allNameInfo()?.nfdInfo?.properties?.userDefined?.banner ? (
              <a
                href={`https://app.${nfdSiteUrlRoot}nf.domains/name/${allNameInfo()?.nfdInfo?.name}`}
                target="_blank"
              >
                <img
                  src={allNameInfo()?.nfdInfo?.properties?.userDefined?.banner}
                  alt="banner"
                  class="aspect-[2/1] w-full overflow-hidden rounded-t-xl border-b"
                />
                <div class="absolute -bottom-6 left-6 sm:-bottom-10 sm:left-10">
                  <div class="h-20 w-20 rounded-full border-4 border-background sm:h-32 sm:w-32">
                    <img
                      src={allNameInfo()?.nfdInfo?.properties?.userDefined?.avatar}
                      alt="avatar"
                      class="h-full w-full rounded-full"
                    />
                  </div>
                </div>
              </a>
            ) : (
              <p class="flex aspect-[2/1] w-full items-center justify-center border-b text-xs">
                No banner
              </p>
            )}
          </div>
          <CardHeader class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle class="text-2xl uppercase sm:pt-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              <a
                href={`https://app.${nfdSiteUrlRoot}nf.domains/name/${allNameInfo()?.nfdInfo?.name}`}
                target="_blank"
                class="flex flex-row items-start gap-2"
              >
                {allNameInfo()?.nfdInfo?.name.split(".")[0]}
                <LinkIcon />
              </a>
            </CardTitle>
            <Switch>
              <Match when={allNameInfo()?.nfdInfo?.state === ("forSale" as any)}>
                <Badge
                  variant={"destructive"}
                  class="capitalize"
                >
                  <span>For Sale</span>
                </Badge>
              </Match>
              <Match when={allNameInfo()?.nfdInfo?.state === ("expired" as any)}>
                <Badge
                  variant={"destructive"}
                  class="capitalize"
                >
                  <span>Expired</span>
                </Badge>
              </Match>
            </Switch>
          </CardHeader>
          <CardContent>
            <div class="mb-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
              <div id="listingFirstColumn flex flex-col gap-2">
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Tags</p>
                  <div class="flex flex-wrap items-center gap-1">
                    <For
                      each={Array.from(allNameInfo()?.listingInfo.tags || [])
                        .slice(0, NUM_TAGS_ALLOWED)
                        .filter((value) => value !== 0)
                        .map((value) => {
                          return tagMap[value?.toString() as keyof typeof tagMap].short as string
                        })}
                    >
                      {(tag) => (
                        <Badge
                          variant="secondary"
                          class="capitalize"
                        >
                          <span class="flex flex-row items-center">{tag}</span>
                        </Badge>
                      )}
                    </For>
                  </div>
                </div>
              </div>

              <div id="listingSecondColumn flex flex-col gap-2">
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Value</p>
                  <p class="flex flex-row items-center gap-1">
                    <AlgorandLogo />
                    {`${allNameInfo()?.listingInfo?.vouchAmount ? new AlgoAmount({ microAlgo: allNameInfo()?.listingInfo?.vouchAmount! }).algo : ""}`}
                  </p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Updated</p>
                  <p class="overflow-hidden text-wrap break-words">
                    {formatTimestamp(allNameInfo()?.listingInfo.timestamp)}
                  </p>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
              <div id="NFDFirstColumn flex flex-col gap-2">
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Name</p>
                  <p class="overflow-hidden text-wrap break-words">
                    {allNameInfo()?.nfdInfo?.properties?.userDefined?.name}
                  </p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Bio</p>
                  <p class="overflow-hidden text-wrap break-words">
                    {allNameInfo()?.nfdInfo?.properties?.userDefined?.bio}
                  </p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Website</p>
                  <a
                    href={allNameInfo()?.nfdInfo?.properties?.userDefined?.website}
                    class="overflow-hidden text-wrap break-words"
                  >
                    {allNameInfo()?.nfdInfo?.properties?.userDefined?.website}
                  </a>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Email</p>
                  <a
                    href={`mailto:${allNameInfo()?.nfdInfo?.properties?.userDefined?.email}`}
                    class="overflow-hidden text-wrap break-words"
                  >
                    {allNameInfo()?.nfdInfo?.properties?.userDefined?.email}
                  </a>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Address</p>
                  <p class="overflow-hidden text-wrap break-words">
                    {allNameInfo()?.nfdInfo?.properties?.userDefined?.address}
                  </p>
                </div>
              </div>
              <div id="NFDSecondColumn">
                {/* TODO: Twitter/Discord/Telegram/GitHub can be verified on NFD */}
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">GitHub</p>
                  <p>{allNameInfo()?.nfdInfo?.properties?.userDefined?.github}</p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Twitter</p>
                  <p>{allNameInfo()?.nfdInfo?.properties?.userDefined?.twitter}</p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Discord</p>
                  <p>{allNameInfo()?.nfdInfo?.properties?.userDefined?.discord}</p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Telegram</p>
                  <p>{allNameInfo()?.nfdInfo?.properties?.userDefined?.telegram}</p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">LinkedIn</p>
                  <a
                    href={allNameInfo()?.nfdInfo?.properties?.userDefined?.linkedin}
                    class="overflow-hidden text-wrap break-words"
                  >
                    {allNameInfo()?.nfdInfo?.properties?.userDefined?.linkedin}
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </main>
  )
}
