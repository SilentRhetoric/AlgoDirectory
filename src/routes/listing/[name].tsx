import {
  cache,
  createAsync,
  redirect,
  RouteDefinition,
  RouteSectionProps,
  useSearchParams,
} from "@solidjs/router"
import SiteTitle from "@/components/SiteTitle"
import { getNFDInfo, nfdSiteUrlRoot } from "@/lib/nfd-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createSignal, For, Match, Show, Suspense, Switch } from "solid-js"
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
  try {
    const getListing = async (appID: number) => await fetchSingleListing(appID)
    const getNFD = async (name: string) => await getNFDInfo(name)
    if (appID) {
      // Fire off both requests at the same time bec ause appID is known
      const [listingInfo, nfdInfo] = await Promise.all([getListing(appID), getNFD(name)])
      allInfo = { listingInfo, nfdInfo }
    } else {
      // Get NFD info first to get the appID, then get the listing info
      const nfdInfo = await getNFDInfo(name)
      const listingInfo = await getListing(nfdInfo.appID!)
      allInfo = { listingInfo, nfdInfo }
    }
  } catch (e) {
    console.error(e)
    throw redirect("/404")
  }

  if (allInfo.listingInfo.name !== allInfo.nfdInfo.name.split(".")[0]) {
    // This shouldn't happen, but just in case we got a mismatch
    throw redirect("/404")
  }

  return allInfo
}

const getAllNameInfo = cache(async (name: string, appID?: number) => {
  "use server"
  return FetchAllNameInfo(name, appID)
}, "getAllNameInfo")

export default function ListingDetails(props: RouteSectionProps) {
  const [network] = createSignal(import.meta.env.VITE_NETWORK === "mainnet" ? "" : "testnet.")
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
        <Card class="mx-auto w-full max-w-6xl overflow-hidden">
          <div class="relative -mt-1 mb-4 flex h-full w-full items-center justify-center">
            {allNameInfo()?.nfdInfo?.properties?.userDefined?.banner ? (
              <a
                href={`https://app.${nfdSiteUrlRoot}nf.domains/name/${allNameInfo()?.nfdInfo?.name}`}
                target="_blank"
              >
                <img
                  src={allNameInfo()?.nfdInfo?.properties?.userDefined?.banner}
                  alt="banner"
                  class="aspect-[3/1] w-full border-b object-cover"
                />
                <div class="absolute -bottom-6 left-6 sm:-bottom-10 sm:left-10">
                  <div class="h-20 w-20 rounded-full border-[1px] sm:h-32 sm:w-32">
                    <Show
                      when={allNameInfo()?.nfdInfo?.properties?.userDefined?.avatar}
                      fallback={
                        <div class="flex h-full w-full items-center justify-center rounded-full bg-secondary text-xs">
                          No avatar
                        </div>
                      }
                    >
                      <img
                        src={allNameInfo()?.nfdInfo?.properties?.userDefined?.avatar}
                        alt="avatar"
                        class="h-full w-full rounded-full bg-background"
                      />
                    </Show>
                  </div>
                </div>
              </a>
            ) : (
              <div class="flex aspect-[16/9] h-full w-full items-center justify-center border-b text-xs">
                <p class="">No banner</p>
                <div class="absolute -bottom-6 left-6 sm:-bottom-10 sm:left-10">
                  <div class="h-20 w-20 rounded-full border-4 border-background sm:h-32 sm:w-32">
                    <Show
                      when={allNameInfo()?.nfdInfo?.properties?.userDefined?.avatar}
                      fallback={
                        <div class="flex h-full w-full items-center justify-center rounded-full bg-secondary">
                          No avatar
                        </div>
                      }
                    >
                      <img
                        src={allNameInfo()?.nfdInfo?.properties?.userDefined?.avatar || ""}
                        alt="avatar"
                        class="h-full w-full rounded-full"
                      />
                    </Show>
                  </div>
                </div>
              </div>
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
                  variant={"outline"}
                  class="border-[hsl(var(--destructive))] capitalize text-red-500"
                >
                  <span>For Sale</span>
                </Badge>
              </Match>
              <Match when={allNameInfo()?.nfdInfo?.state === ("expired" as any)}>
                <Badge
                  variant={"outline"}
                  class="border-[hsl(var(--destructive))] capitalize text-red-500"
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
                          variant="outline"
                          class="bg-transparent capitalize"
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
                    target="_blank"
                    class="overflow-hidden text-wrap break-words text-blue-500"
                  >
                    {allNameInfo()?.nfdInfo?.properties?.userDefined?.website}
                  </a>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Email</p>
                  <a
                    href={`mailto:${allNameInfo()?.nfdInfo?.properties?.userDefined?.email}`}
                    class="overflow-hidden text-wrap break-words text-blue-500"
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
                    target="_blank"
                    class="overflow-hidden text-wrap break-words text-blue-500"
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
