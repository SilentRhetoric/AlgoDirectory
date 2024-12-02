import {
  cache,
  createAsync,
  redirect,
  RouteDefinition,
  RouteSectionProps,
  useSearchParams,
} from "@solidjs/router"
import SiteTitle from "@/components/SiteTitle"
import { getNFDInfo, NFDDisplayFields, nfdSiteUrlRoot, getPreparedNFDInfo } from "@/lib/nfd-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { For, Match, Suspense, Switch } from "solid-js"
import { fetchSingleListing } from "@/lib/algod-api"
import { formatTimestamp } from "@/lib/formatting"
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount"
import AlgorandLogo from "@/components/icons/AlgorandLogo"
import { Listing } from "@/types/types"
import { NUM_TAGS_ALLOWED } from "@/lib/constants"
import tagMap from "@/assets/tags.json"
import LinkIcon from "@/components/icons/LinkIcon"
import MaybeLink from "@/components/MaybeLink"
import { Image, ImageFallback, ImageRoot } from "@/components/ui/image"
import VerifiedIcon from "@/components/icons/VerifiedIcon"
import { Meta } from "@solidjs/meta"

export const route = {
  preload({ params }) {
    void getNFDInfo(params.name)
  },
} satisfies RouteDefinition

type NFDAndListingInfo = {
  preparedNfdInfo: NFDDisplayFields
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
      const preparedNfdInfo = await getPreparedNFDInfo(nfdInfo)
      allInfo = { listingInfo, preparedNfdInfo }
    } else {
      // Get NFD info first to get the appID, then get the listing info
      const nfdInfo = await getNFDInfo(name)
      const preparedNfdInfo = await getPreparedNFDInfo(nfdInfo)
      const listingInfo = await getListing(nfdInfo.appID!)
      allInfo = { listingInfo, preparedNfdInfo }
    }
  } catch (e) {
    console.error(e)
    throw redirect("/404")
  }

  if (allInfo.listingInfo.name !== allInfo.preparedNfdInfo.segmentName) {
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
  const [searchParams, setSearchParams] = useSearchParams()
  const appIDFromQueryParams = Number(searchParams.appid)
  const allNameInfo = createAsync(() => getAllNameInfo(props.params.name, appIDFromQueryParams), {
    // Defer stream so that the page doesn't navigate until the data loads
    deferStream: true,
  })

  return (
    <main class="flex flex-col gap-2 p-4">
      <SiteTitle>{allNameInfo()?.preparedNfdInfo?.segmentName}</SiteTitle>
      <Meta
        property="og:url"
        content={`https://algodirectory.app${props.location.pathname}`}
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
        content={`https://algodirectory.app/og/${props.params.name}`}
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
        content={`https://algodirectory.app${props.location.pathname}`}
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
        content={`https://algodirectory.app/og/${props.params.name}`}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <Card class="mx-auto w-full max-w-6xl overflow-hidden">
          <div class="aspect-[3/1] w-full border-b-[1px]">
            <ImageRoot>
              <Image
                src={allNameInfo()?.preparedNfdInfo?.banner}
                class="object-cover"
              />
              <ImageFallback>No banner</ImageFallback>
              <ImageRoot class="absolute -bottom-4 left-4 h-20 w-20 overflow-hidden rounded-full border-[1px] bg-background sm:h-32 sm:w-32">
                <Image src={allNameInfo()?.preparedNfdInfo?.avatar} />
                <ImageFallback>No avatar</ImageFallback>
              </ImageRoot>
            </ImageRoot>
          </div>
          <CardHeader class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle class="text-2xl uppercase sm:pt-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              <a
                href={`https://app.${nfdSiteUrlRoot}nf.domains/name/${allNameInfo()?.preparedNfdInfo?.segmentFullName}`}
                target="_blank"
                rel="noopener noreferrer"
                class="flex flex-row items-center gap-2"
              >
                {allNameInfo()?.preparedNfdInfo?.segmentName}
                <LinkIcon />
              </a>
            </CardTitle>
            <Switch>
              <Match when={allNameInfo()?.preparedNfdInfo?.state === ("forSale" as any)}>
                <Badge
                  variant={"outline"}
                  class="border-[hsl(var(--destructive))] capitalize text-red-500"
                >
                  <span>For Sale</span>
                </Badge>
              </Match>
              <Match when={allNameInfo()?.preparedNfdInfo?.state === ("expired" as any)}>
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
                    {allNameInfo()?.preparedNfdInfo?.name}
                  </p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Bio</p>
                  <p class="overflow-hidden text-wrap break-words">
                    {allNameInfo()?.preparedNfdInfo?.bio}
                  </p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <div class="uppercase">Website</div>
                  <MaybeLink content={allNameInfo()?.preparedNfdInfo?.website} />
                  <p class="overflow-hidden text-wrap break-words"></p>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Email</p>
                  <div class="flex flex-row gap-1">
                    {allNameInfo()?.preparedNfdInfo?.email ? <VerifiedIcon /> : null}
                    <a
                      href={`mailto:${allNameInfo()?.preparedNfdInfo?.email}`}
                      class="overflow-hidden text-wrap break-words text-blue-500"
                    >
                      {allNameInfo()?.preparedNfdInfo?.email}
                    </a>
                  </div>
                </div>
                {/* <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Address</p>
                  <p class="overflow-hidden text-wrap break-words">
                    {allNameInfo()?.nfdInfo?.properties?.userDefined?.address}
                  </p>
                </div> */}
              </div>
              <div id="NFDSecondColumn">
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">GitHub</p>
                  <div class="flex flex-row gap-1">
                    {allNameInfo()?.preparedNfdInfo.githubVerified ? <VerifiedIcon /> : null}
                    {allNameInfo()?.preparedNfdInfo.githubVerified ? (
                      <a
                        href={`https://github.com/${allNameInfo()?.preparedNfdInfo?.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-500"
                      >
                        {allNameInfo()?.preparedNfdInfo?.github}
                      </a>
                    ) : (
                      <MaybeLink content={allNameInfo()?.preparedNfdInfo?.github} />
                    )}
                  </div>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Twitter</p>
                  <div class="flex flex-row gap-1">
                    {allNameInfo()?.preparedNfdInfo.twitterVerified ? <VerifiedIcon /> : null}
                    {allNameInfo()?.preparedNfdInfo.twitterVerified ? (
                      <a
                        href={`https://x.com/${allNameInfo()?.preparedNfdInfo?.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-500"
                      >
                        {allNameInfo()?.preparedNfdInfo?.twitter}
                      </a>
                    ) : (
                      <MaybeLink content={allNameInfo()?.preparedNfdInfo?.twitter} />
                    )}{" "}
                  </div>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Bluesky</p>
                  <div class="flex flex-row gap-1">
                    {allNameInfo()?.preparedNfdInfo.blueskyVerified ? <VerifiedIcon /> : null}
                    {allNameInfo()?.preparedNfdInfo.blueskyVerified ? (
                      <a
                        href={`https://bsky.app/profile/${allNameInfo()?.preparedNfdInfo?.bluesky}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-500"
                      >
                        <MaybeLink content={allNameInfo()?.preparedNfdInfo?.bluesky} />
                      </a>
                    ) : (
                      <MaybeLink content={allNameInfo()?.preparedNfdInfo?.bluesky} />
                    )}
                  </div>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Discord</p>
                  <div class="flex flex-row gap-1">
                    {allNameInfo()?.preparedNfdInfo.discordVerified ? <VerifiedIcon /> : null}
                    {allNameInfo()?.preparedNfdInfo.discordVerified ? (
                      <a
                        href={`https://discordapp.com/users/${allNameInfo()?.preparedNfdInfo?.discord}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-500"
                      >
                        {allNameInfo()?.preparedNfdInfo?.discord}
                      </a>
                    ) : (
                      <MaybeLink content={allNameInfo()?.preparedNfdInfo?.discord} />
                    )}
                  </div>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">Telegram</p>
                  <div class="flex flex-row gap-1">
                    {allNameInfo()?.preparedNfdInfo?.telegramVerified ? <VerifiedIcon /> : null}
                    {allNameInfo()?.preparedNfdInfo.telegramVerified ? (
                      <a
                        href={`https://t.me/${allNameInfo()?.preparedNfdInfo?.telegram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-500"
                      >
                        {allNameInfo()?.preparedNfdInfo?.telegram}
                      </a>
                    ) : (
                      <MaybeLink content={allNameInfo()?.preparedNfdInfo?.telegram} />
                    )}
                  </div>
                </div>
                <div class="grid grid-cols-[96px_1fr]">
                  <p class="uppercase">LinkedIn</p>
                  <MaybeLink content={allNameInfo()?.preparedNfdInfo?.linkedin} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </main>
  )
}
